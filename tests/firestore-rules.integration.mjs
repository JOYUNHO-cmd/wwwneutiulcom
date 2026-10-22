import { readFileSync } from 'node:fs';
import { before, after, test } from 'node:test';
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp, Timestamp } from 'firebase/firestore';

let env;
let admin;
before(async () => {
  if (!process.env.FIRESTORE_EMULATOR_HOST) throw new Error('Run inside the Firestore emulator; production tests are forbidden.');
  env = await initializeTestEnvironment({
    projectId:'demo-neutiul-security',
    firestore:{rules:readFileSync('firestore.rules','utf8')}
  });
  admin=env.authenticatedContext('admin',{email:'johyun3662@gmail.com',email_verified:true}).firestore();
});
after(async () => { await env?.cleanup(); });
const portfolio = () => ({title:'Test',category:'청소',beforeImage:'/images/test.webp',
 afterImage:'https://blog.naver.com/kslee0143/123',description:'Test',date:'2026-10-22',createdAt:serverTimestamp()});

test('anonymous, wrong-email and unverified identities cannot mutate any public collection',async () => {
 const dbs=[env.unauthenticatedContext().firestore(),
   env.authenticatedContext('other',{email:'other@example.com',email_verified:true}).firestore(),
   env.authenticatedContext('unverified',{email:'johyun3662@gmail.com',email_verified:false}).firestore()];
 await assertSucceeds(setDoc(doc(admin,'company/info'),{name:'Test',phone:'123'}));
 await assertSucceeds(setDoc(doc(admin,'services/test'),{title:'Test',description:'Test'}));
 await assertSucceeds(setDoc(doc(admin,'portfolio/test'),portfolio()));
 for(const db of dbs) {
   for(const path of ['company/info','services/test','portfolio/test']) {
     await assertFails(setDoc(doc(db,path),{name:'Attack',phone:'123'}));
     await assertFails(updateDoc(doc(db,path),{description:'Attack'}));
     await assertFails(deleteDoc(doc(db,path)));
   }
 }
});

test('public content is readable but private and system documents are not',async () => {
 const db=env.unauthenticatedContext().firestore();
 for(const path of ['company/info','services/test','portfolio/test']) await assertSucceeds(getDoc(doc(db,path)));
 for(const path of ['system/status','private/test']) await assertFails(getDoc(doc(db,path)));
});

test('admin can create, update and delete valid content',async () => {
 for(const [path,data,update] of [
   ['company/info',{name:'Test',phone:'123',blog:''},{name:'Updated'}],
   ['services/valid',{title:'Test',description:'Test'},{description:'Updated'}],
   ['portfolio/valid',portfolio(),{title:'Updated'}],
 ]) {
   await assertSucceeds(setDoc(doc(admin,path),data));
   await assertSucceeds(updateDoc(doc(admin,path),update));
   await assertSucceeds(deleteDoc(doc(admin,path)));
 }
});

test('unknown fields and executable URLs are rejected',async () => {
 await assertFails(setDoc(doc(admin,'company/info'),{name:'Test',phone:'123',isAdmin:true}));
 await assertFails(setDoc(doc(admin,'company/info'),{name:'Test',phone:'123',blog:'javascript:alert(1)'}));
 await assertFails(setDoc(doc(admin,'services/unknown'),{title:'Test',description:'Test',isAdmin:true}));
 for(const data of [
  {...portfolio(),isAdmin:true}, {...portfolio(),afterImage:'javascript:alert(1)'},
  {...portfolio(),beforeImage:'data:image/svg+xml;base64,PHN2Zz4='},
  {...portfolio(),beforeImage:[]}, {...portfolio(),description:'x'.repeat(5001)},
  {...portfolio(),createdAt:Timestamp.fromMillis(0)},
 ]) await assertFails(setDoc(doc(admin,'portfolio/bad'),data));
 const missing=portfolio(); delete missing.title;
 await assertFails(setDoc(doc(admin,'portfolio/missing'),missing));
 for(const id of ['bad$id','x'.repeat(129)]) await assertFails(setDoc(doc(admin,'portfolio/'+id),portfolio()));
});

test('bounded JPEG thumbnails work; oversized images and timestamp rewrites fail',async () => {
 const path=doc(admin,'portfolio/image');
 await assertSucceeds(setDoc(path,{...portfolio(),beforeImage:'data:image/jpeg;base64,/9j/AA=='}));
 await assertFails(updateDoc(path,{beforeImage:'data:image/jpeg;base64,'+'A'.repeat(350000)}));
 await assertFails(updateDoc(path,{createdAt:Timestamp.fromMillis(0)}));
 await assertFails(updateDoc(path,{isAdmin:true}));
});
