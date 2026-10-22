import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { before, after, test } from 'node:test';
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { collection, doc, getDoc, getDocs, query, orderBy, setDoc, updateDoc, deleteDoc, deleteField, serverTimestamp, Timestamp } from 'firebase/firestore';

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

test('service editor payload can be published, updated and read without signing in',async () => {
 const publicDb=env.unauthenticatedContext().firestore();
 const serviceRef=doc(admin,'services/editor-flow');
 const original={
  title:'입주청소', description:'새로운 집의 먼지와 오염을 정리합니다.',
  details:['주방 청소','욕실 청소'], image:'/images/service-move-in.webp',
 };
 await assertSucceeds(setDoc(serviceRef,original,{merge:true}));
 assert.deepEqual((await assertSucceeds(getDoc(doc(publicDb,'services/editor-flow')))).data(),original);
 const edited={...original,title:'입주·이사청소',details:['주방 청소','창틀 청소'],image:'https://www.neutiul.com/images/service-move-in.webp'};
 await assertSucceeds(setDoc(serviceRef,edited,{merge:true}));
 const publicServices=await assertSucceeds(getDocs(collection(publicDb,'services')));
 assert.deepEqual(publicServices.docs.find(item=>item.id==='editor-flow')?.data(),edited);
 await assertFails(updateDoc(doc(publicDb,'services/editor-flow'),{title:'Unauthorized change'}));
 await assertSucceeds(deleteDoc(serviceRef));
 assert.equal((await assertSucceeds(getDoc(doc(publicDb,'services/editor-flow')))).exists(),false);
});

test('service editor rejects malformed fields while retaining the last valid content',async () => {
 const serviceRef=doc(admin,'services/editor-validation');
 const original={title:'청소',description:'설명',details:['작업 범위'],image:'/images/service.webp'};
 await assertSucceeds(setDoc(serviceRef,original));
 for(const changes of [
  {title:'x'.repeat(201)}, {description:'x'.repeat(5001)},
  {title:42}, {description:null}, {details:'not a list'}, {details:Array(31).fill('작업')},
  {image:'javascript:alert(1)'}, {image:'data:image/svg+xml;base64,PHN2Zz4='},
  {image:{}}, {id:'changed-id'}, {seoTitle:'unsupported field'},
  {title:deleteField()}, {description:deleteField()},
 ]) await assertFails(updateDoc(serviceRef,changes));
 assert.deepEqual((await assertSucceeds(getDoc(serviceRef))).data(),original);
 await assertSucceeds(deleteDoc(serviceRef));
});

test('home and about company copy edits remain public and preserve required identity fields',async () => {
 const publicDb=env.unauthenticatedContext().firestore();
 const companyRef=doc(admin,'company/info');
 const original={name:'느티울',phone:'010-0000-0000',slogan:'처음 문구',description:'처음 소개'};
 await assertSucceeds(setDoc(companyRef,original));
 const edits={slogan:'공간을 깨끗하게, 마음을 편안하게',description:'현장에 맞는 방법으로 꼼꼼하게 청소합니다.'};
 await assertSucceeds(updateDoc(companyRef,edits));
 assert.deepEqual((await assertSucceeds(getDoc(doc(publicDb,'company/info')))).data(),{...original,...edits});
 for(const changes of [
  {slogan:'x'.repeat(501)}, {description:'x'.repeat(5001)},
  {slogan:[]}, {description:{}}, {name:deleteField()}, {phone:deleteField()},
 ]) await assertFails(updateDoc(companyRef,changes));
 await assertFails(updateDoc(doc(publicDb,'company/info'),{slogan:'Unauthorized change'}));
 assert.deepEqual((await assertSucceeds(getDoc(companyRef))).data(),{...original,...edits});
});

test('published portfolio CRUD is reflected in the anonymous newest-first collection query',async () => {
 const publicDb=env.unauthenticatedContext().firestore();
 const itemRef=doc(admin,'portfolio/public-editor-flow');
 const publicQuery=query(collection(publicDb,'portfolio'),orderBy('createdAt','desc'));
 const readPublished=async()=>{
  const snapshot=await assertSucceeds(getDocs(publicQuery));
  return snapshot.docs.find(item=>item.id==='public-editor-flow');
 };
 await assertSucceeds(setDoc(itemRef,{...portfolio(),title:'새 추천 사례'}));
 const created=await readPublished();
 assert.ok(created,'anonymous visitors must see a newly published item');
 assert.equal(created.data().title,'새 추천 사례');
 assert.ok(created.data().createdAt instanceof Timestamp);
 const createdAt=created.data().createdAt;
 await assertSucceeds(updateDoc(itemRef,{title:'수정한 추천 사례',description:'수정된 현장 설명'}));
 const updated=await readPublished();
 assert.equal(updated.data().title,'수정한 추천 사례');
 assert.equal(updated.data().description,'수정된 현장 설명');
 assert.ok(updated.data().createdAt.isEqual(createdAt),'editing must preserve the original publishing timestamp');
 await assertSucceeds(deleteDoc(itemRef));
 assert.equal(await readPublished(),undefined,'deleted items must no longer appear to anonymous visitors');
});
