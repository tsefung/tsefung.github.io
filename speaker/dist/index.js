!function(n){var e={};function t(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return n[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}t.m=n,t.c=e,t.d=function(n,e,r){t.o(n,e)||Object.defineProperty(n,e,{enumerable:!0,get:r})},t.r=function(n){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(n,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(n,"__esModule",{value:!0})},t.t=function(n,e){if(1&e&&(n=t(n)),8&e)return n;if(4&e&&"object"==typeof n&&n&&n.__esModule)return n;var r=Object.create(null);if(t.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:n}),2&e&&"string"!=typeof n)for(var o in n)t.d(r,o,function(e){return n[e]}.bind(null,o));return r},t.n=function(n){var e=n&&n.__esModule?function(){return n.default}:function(){return n};return t.d(e,"a",e),e},t.o=function(n,e){return Object.prototype.hasOwnProperty.call(n,e)},t.p="",t(t.s=0)}([function(n,e,t){var r=t(1);window.onload=function(){(new r).play("/chinese/丑小鸭.txt","丑小鸭")}},function(n,e,t){var r=t(2),o=t(3);n.exports=function(n){for(var e=r.getInstance(),t=!1,i=[],u=o.button(o.icon.player.PLAY,(function(n){t&&e.play()})).$icon().$huge(),l=o.button(o.icon.player.PREVIOUS,(function(n){t&&(e.prev(),e.play())})).$icon().$huge(),c=o.button(o.icon.player.NEXT,(function(n){t&&(e.next(),e.play())})).$icon().$huge(),a=o.div().$style({color:"#87bdf7",fontSize:"36px",textAlign:"center"}),f=[],p=0;p<5;p++){var s=o.div().$style({color:"#aaa",fontSize:"24px",minHeight:"24px",border:"1px dotted #ccc",borderRadius:"5px",margin:"15px 0",padding:"15px 5px",textAlign:"center"});f.push(s)}var d=o.div().$style({position:"absolute",left:"0",right:"0",bottom:"75px",height:"5px",backgroundColor:"#eee"}),h=o.div().$parent(d).$style({height:"5px",width:"0%",backgroundColor:"#97e497"}),g=o.div().$append([l,u,c]).$style({position:"absolute",left:"0",right:"0",bottom:"15px",textAlign:"center"});return o.div().$append(a).$append(f).$append([d,g]).$parent(n),{play:function(n,r){t=!1,e.load({src:n,onload:function(n){t=!0,i=n,console.log(n),a.innerText=r;for(var e=0;e<5;e++)f[e].innerText=e<i.length?i[e]:"",f[e].style.color=0===e?"#333":"#ccc"},onplay:function(n){u.$disable(),l.$disable(),c.$disable();var e=n-2,t=n+2;e<0?(e=0,(t=4)>=i.length&&(t=i.length-1)<0&&(t=0)):t>=i.length&&(e=(t=i.length-1)-4)<0&&(e=0);for(var r=0,o=e;r<f.length;r++,o++)f[r].innerText=o<=t?i[o]:"",f[r].style.color=o===n?"#333":"#ccc";h.style.width=Math.round(100*(n+1)/i.length)+"%"},onpause:function(n){u.$enable(),l.$enable(),c.$enable()}})}}}},function(n,e){var t=null,r=function(){var n=!1,e=!0,t=!1,r=[],o=-1,i=new SpeechSynthesisUtterance;i.rate=.9;var u=function(){t||0===r.length||((o<0||o>=r.length)&&(o=0),i.text=r[o].replace(/[，；。：“”‘！？,;.:"'!?]/g,""),speechSynthesis.speak(i))};return{load:function(l){l&&l.src&&(n=!!l.continous,e=!!l.loop,fetch(l.src).then((function(c){c.text().then((function(c){r=[],o=-1,0!==(r=function(n){for(var e=[],t=n.length,r=0,o=n.replace(/\s/g,""),i="",u=null;r<t;){switch(u=o.charAt(r)){case"，":case"。":case"！":case"？":(i+=u).length>1&&e.push(i),i="";break;case"“":for(i+=u,r++;r<t;){if(i+=u=o.charAt(r),"”"===u){if(i.length>20){for(var l="",c=0;c<i.length;c++)switch(u=i.charAt(c)){case"，":case"。":case"！":case"？":(l+=u).length>1&&(c===i.length-2&&(c++,l+=i.charAt(c)),e.push(l)),l="";break;default:l+=u}l.length>0&&e.push(l),l=""}else e.push(i);i="";break}r++}break;default:i+=u}r++}return i.length>0&&e.push(i),e}(c)).length&&(o=0,i.onstart=function(){t=!0,"function"==typeof l.onplay&&l.onplay(o)},i.onend=function(){if(t=!1,"function"==typeof l.onpause&&l.onpause(o),n){if(++o>=r.length){if(!e)return;o=0}u()}},"function"==typeof l.onload?l.onload(r):u())}))})))},play:u,front:function(){t||(o=0)},prev:function(){t||--o<0&&(o=0)},next:function(){t||(r.length>0?++o>=r.length&&(o=r.length-1):o=0)},tail:function(){t||(o=r.length>0?r.length-1:0)}}};e.createNew=r,e.getInstance=function(){return t||(t=r()),t}},function(n,e){function t(n){return"object"==typeof n}function r(n){return"string"==typeof n}function o(n){return"function"==typeof n}document.body,document.getElementById,console.log;function i(n){var e=document.createElement(n);return e.$parent=function(n){return t(n)&&o(n.appendChild)?n.appendChild(e):document.body.appendChild(e),e},e.$append=function(n){if(t(n))if(n.length>0)for(var r=0;r<n.length;r++)e.appendChild(n[r]);else e.appendChild(n);return e},e.$empty=function(){return e.innerHTML="",e},e.$bind=function(n){if(t(n)){for(var r in n){var i=n[r];o(i)&&e.addEventListener(r,i)}n.click&&(e.style.cursor="pointer")}return e},e.$hide=function(){return e.setAttribtue("hidden","hidden"),e},e.$show=function(){return e.removeAttribute("hidden"),e},e.$style=function(n){if(t(n))for(var o in n)r(n[o])&&(e.style[o]=n[o]);return e},e.$class=function(n){return r(n)&&(e.className=n),e},e.$icon=function(n){return r(n)&&(e.text=n),e.className="ui",e},e}function u(){var n=i("input");return n.$enable=function(){return n.removeAttribute("disabled"),n},n.$disable=function(){return n.setAttribute("disabled","disabled"),n},n.$huge=function(){return n.style.fontSize="36px",n.style.lineHeight="36px",n},n.$large=function(){return n.style.fontSize="28px",n.style.lineHeight="28px",n},n.$medium=function(){return n.style.fontSize="20px",n.style.lineHeight="20px",n},n.$small=function(){return n.style.fontSize="12px",n.style.lineHeight="12px",n},n.style.color="#555",n.style.padding="5px",n}n.exports={icon:{player:{PLAY:"",PAUSE:"",STOP:"",FRONT:"",PREVIOUS:"",NEXT:"",TAIL:"",REPEAT:"",REPEAT_ONE:""}},div:function(n){var e=i("div");return r(n)&&(e.innerText=n),e},span:function(n){var e=i("span");return r(n)&&(e.innerText=n),e},img:function(n,e,t){var u=i("img");return o(e)&&(u.onload=e),o(t)&&(u.onerror=t),r(s)&&(u.src=n),u},textInput:function(n){var e=u();return e.type="text",r(n)&&(e.placeholder=n),e},passwordInput:function(){var n=u();return n.type="password",n},fileInput:function(){var n=u();return n.type="file",n},button:function(n,e){var t=u();return t.type="button",t.value=n,t.style.margin="0 1px",t.style.cursor="pointer",t.onclick=e,t}}}]);