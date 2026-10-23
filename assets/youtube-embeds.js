/* Click-to-load YouTube embeds. No YouTube iframe is loaded until visitor taps Play. */
(()=>{
"use strict";
document.addEventListener("click",event=>{
  const button=event.target.closest("[data-youtube-id]");
  if(!button)return;
  const id=button.getAttribute("data-youtube-id");
  if(!/^[A-Za-z0-9_-]{11}$/.test(id))return;
  const wrapper=document.createElement("div");
  wrapper.className="yt-iframe-wrap";
  const frame=document.createElement("iframe");
  frame.src="https://www.youtube-nocookie.com/embed/"+id+"?autoplay=1&rel=0";
  frame.title=button.getAttribute("data-youtube-title")||"YouTube lesson";
  frame.allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  frame.allowFullscreen=true;
  frame.referrerPolicy="strict-origin-when-cross-origin";
  frame.setAttribute("loading","lazy");
  wrapper.appendChild(frame);
  button.replaceWith(wrapper);
});
})();