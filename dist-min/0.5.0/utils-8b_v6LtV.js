function t(t){const o=t.getBoundingClientRect();return window.innerHeight-o.bottom}function o(t,o,e,n=0){const i=o.getBoundingClientRect();switch(e){case"bottom-right":t.style.left=i.left+"px",t.style.top=i.bottom+n+"px";break;case"top-right":t.style.top="",t.style.left=i.left+"px",t.style.top=i.top-t.offsetHeight-n+"px";break;default:throw new Error("Invalid position")}}function e(){const t=window.innerWidth-document.body.offsetWidth;document.body.style.overflow="hidden",document.body.style.paddingRight=t+"px"}function n(){document.body.style.overflow="",document.body.style.paddingRight=""}export{o as a,e as b,n as c,t as h};
