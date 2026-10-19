import fs from 'node:fs';import vm from 'node:vm';import ts from 'typescript';import {webcrypto} from 'node:crypto';
const store=new Map();let version=0;
const bucket={get:async key=>{const x=store.get(key);return x?{etag:x.etag,json:async()=>JSON.parse(x.body),arrayBuffer:async()=>x.body}:null},put:async(key,body,options={})=>{const old=store.get(key);if(options.onlyIf?.etagMatches&&old?.etag!==options.onlyIf.etagMatches)return null;if(options.onlyIf?.etagDoesNotMatch==='*'&&old)return null;const etag='v'+(++version);store.set(key,{body,etag});return {etag}},delete:async key=>store.delete(key)};
function module(file,globals){let s=fs.readFileSync(file,'utf8').replace(/^import .*;$/gm,'');const c=ts.transpile(s,{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS});const context={exports:{},crypto:webcrypto,structuredClone,TextDecoder,TextEncoder,Uint8Array,Date,URL,Request,Response,File,FormData,console,...globals};vm.createContext(context);vm.runInContext(c,context);return context.exports;}
const auth=module('lib/access.ts',{});const reqA=new Request('https://site.test',{headers:{'oai-authenticated-user-id':'user-A','oai-authenticated-user-email':'a@example.com'}});const reqB=new Request('https://site.test',{headers:{'oai-authenticated-user-id':'user-B','oai-authenticated-user-email':'b@example.com'}});const A=auth.workspace(reqA),B=auth.workspace(reqB);if(A===B||auth.isSignedIn(new Request('https://site.test')))throw Error('Identity isolation failed');
const seed=JSON.parse(fs.readFileSync('lib/seed.json','utf8'));const state=module('lib/state.ts',{env:{BUCKET:bucket},seed});const format=module('lib/resume-format.ts',{});const apps=module('lib/applications.ts',{env:{BUCKET:bucket},...state,...format});const questions=module('lib/questions.ts',state);
async function rejects(fn){let rejected=false;try{await fn()}catch{rejected=true}if(!rejected)throw Error('Expected authorization/data rejection');}
await rejects(()=>state.readState());
const legacy=await state.readState('legacy');if(legacy.data.jobs.length!==0)throw Error('Legacy data changed');if((await state.readState(A)).data.jobs.length)throw Error('New account inherited legacy jobs');
await state.mergeResearch({jobs:[{'Job ID':'JOB1',Company:'Account A',Role:'Engineer','Application link':'https://example.com/apply'}]},A);
if((await state.readState(B)).data.jobs.length!==0)throw Error('Cross-account job read');
const prefA=await state.readState(A);prefA.data.preferences.name='Account A private name';await state.writeState(A,prefA.data,prefA.etag);if((await state.readState(B)).data.preferences.name)throw Error('Cross-account preference read');
const bytes=new TextEncoder().encode('%PDF-1.7\n1 0 obj << /Type /Catalog >> endobj\n%%EOF').buffer;const resume=await apps.storeResume('A.pdf',bytes,'',A);if(await apps.resumeFile(resume.id,B))throw Error('Cross-account file read');if(!(await apps.resumeFile(resume.id,A)))throw Error('Owner file missing');
await rejects(()=>apps.approveApplication({jobId:'JOB1',resumeId:resume.id,consent:true},B));await rejects(()=>apps.approveApplication({jobId:'JOB1',resumeId:resume.id,consent:false},A));
const app=await apps.approveApplication({jobId:'JOB1',resumeId:resume.id,consent:true,answers:{notice:'2 months'}},A);await rejects(()=>apps.applicationPacket(app.id,B));await rejects(()=>apps.updateApplication(app.id,{status:'Withdrawn'},B));await rejects(()=>apps.updateApplication(app.id,{status:'Submitted'},A));
await state.mergeResearch({jobs:[{'Job ID':'JOB1',Company:'Account B',Role:'Scientist','Application link':'https://example.com/b'}]},B);
const a=await state.readState(A);const b=await state.readState(B);if(a.data.jobs[0].Company!=='Account A'||b.data.jobs[0].Company!=='Account B'||b.data.resumes.length)throw Error('Account records mixed');
await rejects(()=>questions.requestQuestions(app.id,{sourceUrl:'https://example.com/apply',questions:[{id:'q1',label:'Years in B2B SaaS?',required:true,options:['1-2','3-5']}]},B));
await questions.requestQuestions(app.id,{sourceUrl:'https://example.com/apply',questions:[{id:'q1',label:'Years in B2B SaaS?',required:true,options:['1-2','3-5']}]},A);
await rejects(()=>apps.updateApplication(app.id,{status:'In progress'},A));
await rejects(()=>apps.updateApplication(app.id,{status:'Submitted',confirmation:'premature',submittedAt:'2026-10-19'},A));
await rejects(()=>questions.answerQuestions(app.id,{questionRevision:1,answers:{q1:'7'},consent:true},A));
await rejects(()=>questions.answerQuestions(app.id,{questionRevision:0,answers:{q1:'3-5'},consent:true},A));
await rejects(()=>questions.answerQuestions(app.id,{questionRevision:1,answers:{q1:'3-5'},consent:false},A));
await questions.answerQuestions(app.id,{questionRevision:1,answers:{q1:'3-5'},consent:true},A);
const reviewed=await apps.applicationPacket(app.id,A);if(reviewed.application.answers['Years in B2B SaaS?']!=='3-5')throw Error('Reviewed answer missing');
await apps.updateApplication(app.id,{status:'Submitted',confirmation:'Actual employer confirmation in local test',submittedAt:'2026-10-19'},A);await rejects(()=>apps.updateApplication(app.id,{status:'In progress'},A));
if((await state.readState('legacy')).data.jobs.length!==0)throw Error('Legacy owner state modified');
console.log('PASS: signed-in identity, separate jobs/preferences, cross-account file/packet/write denial, approval and confirmation gates, and legacy preservation.');

const retrieval=module('lib/resume-match.ts',{});const evidence=retrieval.rankEvidence('competencies in artificial intelligence',['Skills: AI and forecasting','Office location: Noida']);if(!evidence[0].text.includes('Skills: AI'))throw Error('Synonym retrieval failed');const semantic=retrieval.rankEvidence('roadmaps',['Relevant paraphrase','Unrelated'],[[1,0],[0,1]],[1,0]);if(semantic[0].text!=='Relevant paraphrase')throw Error('Semantic fusion failed');console.log('PASS: question ownership, required answers, option validity, stale revision, consent and execution gates; synonym and semantic score fusion.');
