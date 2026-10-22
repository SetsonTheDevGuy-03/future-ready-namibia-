(()=>{
"use strict";
const config=[
  {file:"assets/audio/episode-01-youth-unemployment.mp3",dir:"episode-01",count:4,type:"audio/mpeg"},
  {file:"assets/audio/episode-02-online-work.mp3",dir:"episode-02",count:5,type:"audio/mpeg"},
  {file:"assets/audio/episode-03-one-skill.mp3",dir:"episode-03",count:5,type:"audio/mpeg"},
  {file:"assets/video/futureready-skills-journey.mp4",dir:"video",count:3,type:"video/mp4"},
  {file:"assets/docs/FutureReady_Podcast_Recording_Scripts.pdf",dir:"scripts",count:1,type:"application/pdf"}
];
const byFile=new Map(config.map(x=>[x.file,x]));
const loading=new Map();
async function reconstruct(info){
  if(loading.has(info.file)) return loading.get(info.file);
  const promise=(async()=>{
    const chunks=await Promise.all(Array.from({length:info.count},(_,i)=>
      fetch("media-parts/"+info.dir+"/"+String(i).padStart(3,"0")+".b64")
        .then(r=>{if(!r.ok) throw new Error("Media part unavailable: "+r.status);return r.text()})
    ));
    const binary=atob(chunks.join("").replace(/\s/g,""));
    const buffer=new Uint8Array(binary.length);
    for(let i=0;i<binary.length;i++) buffer[i]=binary.charCodeAt(i);
    return new Blob([buffer],{type:info.type});
  })().catch(e=>{loading.delete(info.file);throw e});
  loading.set(info.file,promise);
  return promise;
}
async function exists(url){
  try {const r=await fetch(url,{method:"HEAD"});return r.ok}catch{return false}
}
function message(el,text){
  let status=el.parentNode.querySelector(".media-fallback-status");
  if(!status){status=document.createElement("p");status.className="media-fallback-status muted";status.setAttribute("role","status");status.style.margin="9px 0";el.insertAdjacentElement("afterend",status)}
  status.textContent=text;
}
function initPlayer(el,info){
  const button=document.createElement("button");button.type="button";
  button.className="button outline small";
  button.style.margin="12px 0";
  button.textContent=el.tagName==="VIDEO"?"▶ Load and play video":"▶ Load and play episode";
  el.insertAdjacentElement("afterend",button);
  message(el,"Your recording is stored securely with the project. Load it to start listening or watching.");
  button.addEventListener("click",async()=>{
    button.disabled=true;button.textContent="Preparing media…";
    message(el,"Loading the original recording. This may use several megabytes of data.");
    try{
      const blob=await reconstruct(info);
      el.querySelectorAll("source").forEach(x=>x.remove());
      el.src=URL.createObjectURL(blob);
      el.load();
      button.remove();
      message(el,"Recording is ready to play.");
      try{await el.play()}catch{/* User can press the native play control. */}
    }catch(err){
      console.error("FutureReady media loading",err);
      button.disabled=false;button.textContent="Retry loading recording";
      message(el,"Could not load the recording. Check your connection and try again.");
    }
  });
}
async function init(){
  for(const info of config){
    if(await exists(info.file)) continue;
    const nodes=[...document.querySelectorAll("audio,video")];
    for(const node of nodes){
      const source=node.querySelector("source");
      if(source&&source.getAttribute("src")===info.file){
        source.removeAttribute("src");
        initPlayer(node,info);
      }
    }
    for(const a of document.querySelectorAll("a[href]")){
      if(a.getAttribute("href")!==info.file) continue;
      a.addEventListener("click",async e=>{
        e.preventDefault();
        const oldText=a.textContent;
        a.textContent="Preparing download…";
        try{
          const blob=await reconstruct(info);
          const url=URL.createObjectURL(blob);
          const download=document.createElement("a");
          download.href=url;download.download=info.file.split("/").pop();
          document.body.appendChild(download);download.click();download.remove();
          setTimeout(()=>URL.revokeObjectURL(url),60000);
        }catch(err){console.error(err);alert("Download unavailable. Please try again when your connection improves.")}
        finally{a.textContent=oldText}
      });
    }
  }
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});
else init();
})();