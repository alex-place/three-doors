const fs=require("fs"),path=require("path"),{execFileSync}=require("child_process");
const ORIG="C:/Users/alexp/Downloads/koh-discord-2026-07-17/originals";
const CDN="C:/Users/alexp/Downloads/koh-cdn-upload"; fs.mkdirSync(CDN,{recursive:true});
const sorted=require("C:/Users/alexp/Downloads/sorted.json").folders;
const mfPath="public/assets/content/koh/manifest.json", tlPath="data/three-doors/art-timeline.json";
const mf=JSON.parse(fs.readFileSync(mfPath,"utf8"));
const tl=JSON.parse(fs.readFileSync(tlPath,"utf8"));
const have=new Set(mf.items.map(i=>i.id));
const LABEL={ "kingdome-garden":"Garden","cloverfield":"Cloverfield","future-doors":"Future Doors","xp-door":"XP Door","xenon-convergence":"Xenon","sigil-city":"Sigil","fog-door-return":"Fog Return","reference":"Reference" };
const CAT={ reference:"reference" }; // else world
function findOrig(id,orig){ const cand=`${id}_${orig.replace(/[^\w.-]/g,"_")}`; const p=path.join(ORIG,cand); if(fs.existsSync(p))return p;
  const hit=fs.readdirSync(ORIG).find(f=>f.startsWith(id+"_")); return hit?path.join(ORIG,hit):null; }
let added=0,tlAdded=0,missing=0,gen=0;
for(const [folder,list] of Object.entries(sorted)){
  if(folder==="_reject") continue;
  if(!tl[folder]) tl[folder]=[];
  for(const it of list){
    const src=findOrig(it.id,it.orig); if(!src){missing++;console.log("MISSING orig",it.id);continue;}
    // webp full (<=1920) + thumb (<=480)
    const full=path.join(CDN,it.id+".webp"), thumb=path.join(CDN,it.id+"-t.webp");
    try{ execFileSync("ffmpeg",["-v","error","-y","-i",src,"-vf","scale='min(1920,iw)':-2","-c:v","libwebp","-quality","82",full]);
         execFileSync("ffmpeg",["-v","error","-y","-i",src,"-vf","scale='min(480,iw)':-2","-c:v","libwebp","-quality","78",thumb]); gen++; }catch(e){console.log("webp fail",it.id,e.message);continue;}
    if(!have.has(it.id)){
      mf.items.push({ id:it.id, title:`${LABEL[folder]} · ${it.posted} · ${it.id.slice(0,6)}`, cat:CAT[folder]||"world", status:"auto", tags:["discord-import"], src:it.orig, full:it.id+".webp", thumb:it.id+"-t.webp", titled_by:"discord-import" });
      have.add(it.id); added++;
    }
    if(!tl[folder].includes(it.id)){ tl[folder].push(it.id); tlAdded++; }
  }
}
fs.writeFileSync(mfPath, JSON.stringify(mf,null,2)+"\n");
fs.writeFileSync(tlPath, JSON.stringify(tl,null,2)+"\n");
console.log("manifest items now:",mf.items.length,"(+"+added+") | timeline +"+tlAdded+" | webp generated:",gen,"| missing:",missing);
