/* FutureReady: on-demand media, zero recording downloads on page open. */
(()=>{
"use strict";
const config=[
{file:"assets/audio/episode-01-youth-unemployment.mp3",dir:"episode-01",count:4,type:"audio/mpeg"},
{file:"assets/audio/episode-02-online-work.mp3",dir:"episode-02",count:5,type:"audio/mpeg"},
{file:"assets/audio/episode-03-one-skill.mp3",dir:"episode-03",count:5,type:"audio/mpeg"},
{file:"assets/video/futureready-skills-journey.mp4",dir:"video",count:3,type:"video/mp4"},
{file:"assets/docs/FutureReady_Podcast_Recording_Scripts.pdf",dir:"scripts",count:1,type:"application/pdf"}
];
const loading=new Map();
async function rebuild(info){
if(loading.has(info.file))return loading.get(info.file);
const task=(async()=>{
const parts=await Promise.all(Array.from({length:info.count},(_,i)=>fetch("media-parts/"+info.dir+"/"+String(i).padStart(3,"0")+".b64").then(res=>{if(!res.ok)throw new Error("Missing media part: "+res.status);return res.text()})));
const base64=parts.join("").replace(/\s/g,"");
const binary=atob(base64);
const bytes=new Uint8Array(binary.length);
for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
return new Blob([bytes],{type:info.type});
})().catch(err=>{loading.delete(info.file);throw err});
loading.set(info.file,task);return task;
}
function status(element,message){
let el=element.parentElement.querySelector(".media-fallback-status");
if(!el){el=document.createElement("p");el.className="media-fallback-status muted";el.setAttribute("role","status");el.style.margin="9px 0";element.insertAdjacentElement("afterend",el)}
el.textContent=message;
}
function setup(){
for(const info of config){
  for(const player of document.querySelectorAll("audio,video")){
    const original=player.querySelector("source");
    if(!original||original.getAttribute("src")!==info.file)continue;
    original.removeAttribute("src");
    player.preload="none";
    const play=document.createElement("button");
    play.type="button";play.className="button outline small";
    play.style.margin="12px 0";
    play.textContent=player.tagName==="VIDEO"?"▶ Load and play video":"▶ Load and play episode";
    player.insertAdjacentElement("afterend",play);
    status(player,"Recording is not downloaded until you choose to play it.");
    play.addEventListener("click",async()=>{
      play.disabled=true;play.textContent="Loading recording…";
      status(player,"Preparing recording from the project media files. This uses mobile data.");
      try{
        const blob=await rebuild(info);
        player.src=URL.createObjectURL(blob);
        player.load();
        play.remove();
        status(player,"Ready to play.");
        try{await player.play()}catch{/* Native play control remains available. */}
      }catch(error){
        console.error("Podcast loading error",error);
        play.disabled=false;play.textContent="Retry loading recording";
        status(player,"Unable to load. Check your connection, then retry.");
      }
    });
  }
  for(const a of document.querySelectorAll("a[href]")){
    if(a.getAttribute("href")!==info.file)continue;
    a.addEventListener("click",async event=>{
      event.preventDefault();
      const before=a.textContent;
      a.textContent="Preparing download…";
      try{
        const blob=await rebuild(info);
        const url=URL.createObjectURL(blob);
        const download=document.createElement("a");
        download.href=url;download.download=info.file.split("/").pop();
        document.body.appendChild(download);download.click();download.remove();
        setTimeout(()=>URL.revokeObjectURL(url),120000);
      }catch(error){
        console.error("Download error",error);a.textContent="Download unavailable — try again";
      }finally{if(a.textContent==="Preparing download…")a.textContent=before;}
    });
  }
}
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",setup,{once:true});else setup();
})();