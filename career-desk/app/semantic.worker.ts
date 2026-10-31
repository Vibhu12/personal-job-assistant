import {pipeline,env} from '@huggingface/transformers';
import {semanticText} from '../lib/resume-match';
env.allowLocalModels=false;
let extractor:any;
self.onmessage=async(e:MessageEvent)=>{try{extractor||=await pipeline('feature-extraction','Xenova/all-MiniLM-L6-v2',{device:'wasm',dtype:'q8'});const tensor=await extractor(e.data.texts.map(semanticText),{pooling:'mean',normalize:true});self.postMessage({id:e.data.id,vectors:tensor.tolist()});}catch(err){self.postMessage({id:e.data.id,error:String(err)});}};
