function t(t){const o=t.getBoundingClientRect();return window.innerHeight-o.bottom}function o(t,o,e,s=0){const l=o.getBoundingClientRect();switch(e){case"bottom-right":t.style.left=l.left+l.width-t.offsetWidth+"px",t.style.top=l.bottom+s+"px";break;case"bottom-left":t.style.left=l.left+"px",t.style.top=l.bottom+s+"px";break;case"top-right":t.style.top="",t.style.left=l.left+l.width-t.offsetWidth+"px",t.style.top=l.top-t.offsetHeight-s+"px";break;case"top-right":t.style.top="",t.style.left=l.left+"px",t.style.top=l.top-t.offsetHeight-s+"px";break;default:throw new Error("Invalid position")}}function e(){window.innerWidth,document.body.offsetWidth,document.body.style.position="fixed",document.body.style.overflowY="scroll",document.body.style.overflowX="scroll"}function s(){document.body.style.position="static",document.body.style.overflowY="auto",document.body.style.overflowX="auto"}export{o as a,e as b,s as c,t as h};