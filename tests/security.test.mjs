import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/naver-rss.js';
import { isVerifiedAdmin, ADMIN_EMAIL } from '../lib/adminPolicy.mjs';

test('admin policy requires the exact verified Firebase identity', () => {
  for (const user of [null, {}, {email: ADMIN_EMAIL}, {email: ADMIN_EMAIL, emailVerified: false},
    {email: ADMIN_EMAIL, emailVerified: 'true'}, {email:'other@example.com', emailVerified:true}]) {
    assert.equal(isVerifiedAdmin(user), false);
  }
  assert.equal(isVerifiedAdmin({email:ADMIN_EMAIL,emailVerified:true}), true);
});

test('RSS rejects methods, duplicate blogs and proxy targets without fetching', async t => {
  const mock = t.mock.method(globalThis, 'fetch', () => { throw new Error('must not fetch'); });
  for (const [query, method, status] of [
    ['blog=kslee0143','POST',405], ['blog=kslee0143&blog=decline11731','GET',400],
    ['blog=https://127.0.0.1','GET',400], ['','GET',400],
  ]) {
    const res = await handler(new Request('https://example.com/api/naver-rss?'+query, {method}));
    assert.equal(res.status,status);
    assert.equal(res.headers.get('cache-control'),'no-store');
  }
  assert.equal(mock.mock.callCount(),0);
});

test('RSS fetch uses fixed origin, rejects redirects and carries an abort signal', async t => {
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url,'https://rss.blog.naver.com/kslee0143.xml');
    assert.equal(options.redirect,'manual');
    assert.ok(options.signal instanceof AbortSignal);
    return new Response('<rss><channel><item><title>OK</title></item></channel></rss>');
  });
  const res = await handler(new Request('https://example.com/api/naver-rss?blog=kslee0143'));
  assert.equal(res.status,200);
  assert.equal((await res.json()).items[0].title,'OK');
});

test('RSS bounds streamed bodies even without Content-Length and hides upstream errors', async t => {
  t.mock.method(globalThis, 'fetch', async () => new Response('x'.repeat(2*1024*1024+1)));
  const res = await handler(new Request('https://example.com/api/naver-rss?blog=kslee0143'));
  assert.equal(res.status,502);
  assert.equal(res.headers.get('cache-control'),'no-store');
  assert.equal((await res.json()).message,'fetch failed');
});

test('RSS deadline aborts a stalled upstream and returns an uncacheable error', async t => {
  t.mock.timers.enable({apis:['setTimeout']});
  t.mock.method(globalThis,'fetch',(_url,{signal}) => new Promise((resolve,reject) => {
    signal.addEventListener('abort',() => reject(new Error('private upstream detail')),{once:true});
  }));
  const pending=handler(new Request('https://example.com/api/naver-rss?blog=kslee0143'));
  t.mock.timers.tick(8000);
  const res=await pending;
  assert.equal(res.status,502);
  assert.equal(res.headers.get('cache-control'),'no-store');
  assert.equal((await res.json()).message,'fetch failed');
});

test('RSS rejects upstream redirects without following their target', async t => {
  const mock=t.mock.method(globalThis,'fetch', async (_url, options) => {
    assert.equal(options.redirect,'manual');
    return new Response(null,{status:302,headers:{Location:'http://127.0.0.1/private'}});
  });
  const response=await handler(new Request('https://example.com/api/naver-rss?blog=kslee0143'));
  assert.equal(response.status,502);
  assert.equal(mock.mock.callCount(),1);
});
