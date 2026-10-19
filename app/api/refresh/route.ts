import {isSignedIn,workspace,displayName} from '../../../lib/access';
import {mergeResearch} from '../../../lib/state';
export async function POST(req:Request){if(!isSignedIn(req))return Response.json({error:"Sign in required"},{status:403});try{const origin=req.headers.get('origin');if(origin&&new URL(origin).host!==new URL(req.url).host)return Response.json({error:'Invalid origin'},{status:403});return Response.json(await mergeResearch(await req.json(),workspace(req)));}catch(e){return Response.json({error:String(e)},{status:400});}}
