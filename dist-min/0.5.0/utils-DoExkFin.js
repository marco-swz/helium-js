function t(t){const e=t.getBoundingClientRect();return window.innerHeight-e.bottom}function e(t,e,o,s=0){const l=e.getBoundingClientRect();switch(o){case"bottom-right":t.style.left=l.left+l.width-t.offsetWidth+"px",t.style.top=l.bottom+s+"px";break;case"bottom-left":t.style.left=l.left+"px",t.style.top=l.bottom+s+"px";break;case"top-right":t.style.top="",t.style.left=l.left+l.width-t.offsetWidth+"px",t.style.top=l.top-t.offsetHeight-s+"px";break;case"top-right":t.style.top="",t.style.left=l.left+"px",t.style.top=l.top-t.offsetHeight-s+"px";break;default:throw new Error("Invalid position")}}function o(){document.body.style.position="static",document.body.style.overflowY="auto",document.body.style.overflowX="auto"}export{e as a,o as b,t as h};