function t(t){const o=t.getBoundingClientRect();return window.innerHeight-o.bottom}function o(t,o,e,l=0){const s=o.getBoundingClientRect();switch(e){case"bottom-right":t.style.left=s.left+s.width-t.offsetWidth+"px",t.style.top=s.bottom+l+"px";break;case"bottom-left":t.style.left=s.left+"px",t.style.top=s.bottom+l+"px";break;case"top-right":t.style.top="",t.style.left=s.left+s.width-t.offsetWidth+"px",t.style.top=s.top-t.offsetHeight-l+"px";break;case"top-right":t.style.top="",t.style.left=s.left+"px",t.style.top=s.top-t.offsetHeight-l+"px";break;default:throw new Error("Invalid position")}}function e(){document.body.scrollHeight>document.body.clientHeight&&(document.body.style.position="fixed",document.body.style.overflowY="scroll");document.body.scrollWidth>document.body.clientWidth&&(document.body.style.position="fixed",document.body.style.overflowX="scroll")}function l(){document.body.style.position="static",document.body.style.overflowY="auto",document.body.style.overflowX="auto"}export{o as a,e as b,l as c,t as h};
