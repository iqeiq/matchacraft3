!function t(e,n,r){function i(s,u){if(!n[s]){if(!e[s]){var a="function"==typeof require&&require;if(!u&&a)return a(s,!0);if(o)return o(s,!0);var c=new Error("Cannot find module '"+s+"'");throw c.code="MODULE_NOT_FOUND",c}var h=n[s]={exports:{}};e[s][0].call(h.exports,function(t){var n=e[s][1][t];return i(n?n:t)},h,h.exports,t,e,n,r)}return n[s].exports}for(var o="function"==typeof require&&require,s=0;s<r.length;s++)i(r[s]);return i}({1:[function(t,e,n){"function"==typeof Object.create?e.exports=function(t,e){t.super_=e,t.prototype=Object.create(e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}})}:e.exports=function(t,e){t.super_=e;var n=function(){};n.prototype=e.prototype,t.prototype=new n,t.prototype.constructor=t}},{}],2:[function(t,e,n){function r(){h=!1,u.length?c=u.concat(c):l=-1,c.length&&i()}function i(){if(!h){var t=setTimeout(r);h=!0;for(var e=c.length;e;){for(u=c,c=[];++l<e;)u[l].run();l=-1,e=c.length}u=null,h=!1,clearTimeout(t)}}function o(t,e){this.fun=t,this.array=e}function s(){}var u,a=e.exports={},c=[],h=!1,l=-1;a.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)e[n-1]=arguments[n];c.push(new o(t,e)),1!==c.length||h||setTimeout(i,0)},o.prototype.run=function(){this.fun.apply(null,this.array)},a.title="browser",a.browser=!0,a.env={},a.argv=[],a.version="",a.versions={},a.on=s,a.addListener=s,a.once=s,a.off=s,a.removeListener=s,a.removeAllListeners=s,a.emit=s,a.binding=function(t){throw new Error("process.binding is not supported")},a.cwd=function(){return"/"},a.chdir=function(t){throw new Error("process.chdir is not supported")},a.umask=function(){return 0}},{}],3:[function(t,e,n){e.exports=function(t){return t&&"object"==typeof t&&"function"==typeof t.copy&&"function"==typeof t.fill&&"function"==typeof t.readUInt8}},{}],4:[function(t,e,n){(function(e,r){function i(t,e){var r={seen:[],stylize:s};return arguments.length>=3&&(r.depth=arguments[2]),arguments.length>=4&&(r.colors=arguments[3]),d(e)?r.showHidden=e:e&&n._extend(r,e),b(r.showHidden)&&(r.showHidden=!1),b(r.depth)&&(r.depth=2),b(r.colors)&&(r.colors=!1),b(r.customInspect)&&(r.customInspect=!0),r.colors&&(r.stylize=o),a(r,t,r.depth)}function o(t,e){var n=i.styles[e];return n?"["+i.colors[n][0]+"m"+t+"["+i.colors[n][1]+"m":t}function s(t,e){return t}function u(t){var e={};return t.forEach(function(t,n){e[t]=!0}),e}function a(t,e,r){if(t.customInspect&&e&&R(e.inspect)&&e.inspect!==n.inspect&&(!e.constructor||e.constructor.prototype!==e)){var i=e.inspect(r,t);return E(i)||(i=a(t,i,r)),i}var o=c(t,e);if(o)return o;var s=Object.keys(e),d=u(s);if(t.showHidden&&(s=Object.getOwnPropertyNames(e)),T(e)&&(s.indexOf("message")>=0||s.indexOf("description")>=0))return h(e);if(0===s.length){if(R(e)){var g=e.name?": "+e.name:"";return t.stylize("[Function"+g+"]","special")}if(z(e))return t.stylize(RegExp.prototype.toString.call(e),"regexp");if(M(e))return t.stylize(Date.prototype.toString.call(e),"date");if(T(e))return h(e)}var m="",v=!1,w=["{","}"];if(y(e)&&(v=!0,w=["[","]"]),R(e)){var b=e.name?": "+e.name:"";m=" [Function"+b+"]"}if(z(e)&&(m=" "+RegExp.prototype.toString.call(e)),M(e)&&(m=" "+Date.prototype.toUTCString.call(e)),T(e)&&(m=" "+h(e)),0===s.length&&(!v||0==e.length))return w[0]+m+w[1];if(0>r)return z(e)?t.stylize(RegExp.prototype.toString.call(e),"regexp"):t.stylize("[Object]","special");t.seen.push(e);var x;return x=v?l(t,e,r,d,s):s.map(function(n){return f(t,e,r,d,n,v)}),t.seen.pop(),p(x,m,w)}function c(t,e){if(b(e))return t.stylize("undefined","undefined");if(E(e)){var n="'"+JSON.stringify(e).replace(/^"|"$/g,"").replace(/'/g,"\\'").replace(/\\"/g,'"')+"'";return t.stylize(n,"string")}return v(e)?t.stylize(""+e,"number"):d(e)?t.stylize(""+e,"boolean"):g(e)?t.stylize("null","null"):void 0}function h(t){return"["+Error.prototype.toString.call(t)+"]"}function l(t,e,n,r,i){for(var o=[],s=0,u=e.length;u>s;++s)O(e,String(s))?o.push(f(t,e,n,r,String(s),!0)):o.push("");return i.forEach(function(i){i.match(/^\d+$/)||o.push(f(t,e,n,r,i,!0))}),o}function f(t,e,n,r,i,o){var s,u,c;if(c=Object.getOwnPropertyDescriptor(e,i)||{value:e[i]},c.get?u=c.set?t.stylize("[Getter/Setter]","special"):t.stylize("[Getter]","special"):c.set&&(u=t.stylize("[Setter]","special")),O(r,i)||(s="["+i+"]"),u||(t.seen.indexOf(c.value)<0?(u=g(n)?a(t,c.value,null):a(t,c.value,n-1),u.indexOf("\n")>-1&&(u=o?u.split("\n").map(function(t){return"  "+t}).join("\n").substr(2):"\n"+u.split("\n").map(function(t){return"   "+t}).join("\n"))):u=t.stylize("[Circular]","special")),b(s)){if(o&&i.match(/^\d+$/))return u;s=JSON.stringify(""+i),s.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)?(s=s.substr(1,s.length-2),s=t.stylize(s,"name")):(s=s.replace(/'/g,"\\'").replace(/\\"/g,'"').replace(/(^"|"$)/g,"'"),s=t.stylize(s,"string"))}return s+": "+u}function p(t,e,n){var r=0,i=t.reduce(function(t,e){return r++,e.indexOf("\n")>=0&&r++,t+e.replace(/\u001b\[\d\d?m/g,"").length+1},0);return i>60?n[0]+(""===e?"":e+"\n ")+" "+t.join(",\n  ")+" "+n[1]:n[0]+e+" "+t.join(", ")+" "+n[1]}function y(t){return Array.isArray(t)}function d(t){return"boolean"==typeof t}function g(t){return null===t}function m(t){return null==t}function v(t){return"number"==typeof t}function E(t){return"string"==typeof t}function w(t){return"symbol"==typeof t}function b(t){return void 0===t}function z(t){return x(t)&&"[object RegExp]"===H(t)}function x(t){return"object"==typeof t&&null!==t}function M(t){return x(t)&&"[object Date]"===H(t)}function T(t){return x(t)&&("[object Error]"===H(t)||t instanceof Error)}function R(t){return"function"==typeof t}function k(t){return null===t||"boolean"==typeof t||"number"==typeof t||"string"==typeof t||"symbol"==typeof t||"undefined"==typeof t}function H(t){return Object.prototype.toString.call(t)}function C(t){return 10>t?"0"+t.toString(10):t.toString(10)}function F(){var t=new Date,e=[C(t.getHours()),C(t.getMinutes()),C(t.getSeconds())].join(":");return[t.getDate(),D[t.getMonth()],e].join(" ")}function O(t,e){return Object.prototype.hasOwnProperty.call(t,e)}var S=/%[sdj%]/g;n.format=function(t){if(!E(t)){for(var e=[],n=0;n<arguments.length;n++)e.push(i(arguments[n]));return e.join(" ")}for(var n=1,r=arguments,o=r.length,s=String(t).replace(S,function(t){if("%%"===t)return"%";if(n>=o)return t;switch(t){case"%s":return String(r[n++]);case"%d":return Number(r[n++]);case"%j":try{return JSON.stringify(r[n++])}catch(e){return"[Circular]"}default:return t}}),u=r[n];o>n;u=r[++n])s+=g(u)||!x(u)?" "+u:" "+i(u);return s},n.deprecate=function(t,i){function o(){if(!s){if(e.throwDeprecation)throw new Error(i);e.traceDeprecation?console.trace(i):console.error(i),s=!0}return t.apply(this,arguments)}if(b(r.process))return function(){return n.deprecate(t,i).apply(this,arguments)};if(e.noDeprecation===!0)return t;var s=!1;return o};var _,A={};n.debuglog=function(t){if(b(_)&&(_=e.env.NODE_DEBUG||""),t=t.toUpperCase(),!A[t])if(new RegExp("\\b"+t+"\\b","i").test(_)){var r=e.pid;A[t]=function(){var e=n.format.apply(n,arguments);console.error("%s %d: %s",t,r,e)}}else A[t]=function(){};return A[t]},n.inspect=i,i.colors={bold:[1,22],italic:[3,23],underline:[4,24],inverse:[7,27],white:[37,39],grey:[90,39],black:[30,39],blue:[34,39],cyan:[36,39],green:[32,39],magenta:[35,39],red:[31,39],yellow:[33,39]},i.styles={special:"cyan",number:"yellow","boolean":"yellow",undefined:"grey","null":"bold",string:"green",date:"magenta",regexp:"red"},n.isArray=y,n.isBoolean=d,n.isNull=g,n.isNullOrUndefined=m,n.isNumber=v,n.isString=E,n.isSymbol=w,n.isUndefined=b,n.isRegExp=z,n.isObject=x,n.isDate=M,n.isError=T,n.isFunction=R,n.isPrimitive=k,n.isBuffer=t("./support/isBuffer");var D=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];n.log=function(){console.log("%s - %s",F(),n.format.apply(n,arguments))},n.inherits=t("inherits"),n._extend=function(t,e){if(!e||!x(e))return t;for(var n=Object.keys(e),r=n.length;r--;)t[n[r]]=e[n[r]];return t}}).call(this,t("_process"),"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./support/isBuffer":3,_process:2,inherits:1}],5:[function(t,e,n){var r,i=[].indexOf||function(t){for(var e=0,n=this.length;n>e;e++)if(e in this&&this[e]===t)return e;return-1},o={}.hasOwnProperty;r=function(){function t(t){var e,n,r,s,u,a,c,h,l;this.domElement=null!=t?t:document,this.keys={},this.listener={},this.keyMap={8:"backspace",13:"enter",16:"shift",17:"ctrl",18:"alt",27:"esc",32:"space",37:"left",38:"up",39:"right",40:"down"},s=function(t){return function(e,n){return{key:t.keyMap[e]||String.fromCharCode(e).toLowerCase(),status:n}}}(this),n=Bacon.fromEventTarget(this.domElement,"keydown").map(function(t){return function(e){return s.call(t,e.keyCode,!0)}}(this)),r=Bacon.fromEventTarget(this.domElement,"keyup").map(function(t){return function(e){return s.call(t,e.keyCode,!1)}}(this)),n.merge(r).filter(function(t){var e;return e=t.key.charCodeAt(0),e>47&&58>e||e>96&&123>e}).onValue(function(t){return function(e){var n;return t.keys[e.key]=e.status,e.status&&null!=(n=t.listener[e.key])?n.forEach(function(t){return t()}):void 0}}(this)),e=[THREE.MOUSE.LEFT,THREE.MOUSE.RIGHT],u=function(t){return function(n){var r;return r={},e.forEach(function(t){return r[t]=[]}),Bacon.fromEventTarget(t.domElement,n).filter(function(t){var n;return n=t.button,i.call(e,n)>=0}).onValue(function(t){return r[t.button].forEach(function(e){return e(t.clientX,t.clientY)})}),[function(t,e){var n;return null!=(n=r[t])?n.push(e):void 0},function(t,e){return _.remove(r[t],function(t){return null!=e?t===e:!0})}]}}(this),a=u("mousedown"),this.onMouseDown=a[0],this.offMouseDown=a[1],c=u("mouseup"),this.onMouseUp=c[0],this.offMouseUp=c[1],h=_.transform(u("dblclick"),function(t,e){return t.push(e.bind(this,THREE.MOUSE.LEFT))}),this.onDoubleClick=h[0],this.offDoubleClick=h[1],l=function(t){return function(){var n,r,i,s;return r={},n={},e.forEach(function(t){return n[t]=!1,r[t]=[]}),i=Bacon.fromEventTarget(t.domElement,"mousedown").map(function(t){return[t.button,!0]}),s=Bacon.fromEventTarget(t.domElement,"mouseup").map(function(t){return[t.button,!1]}),i.merge(s).onValue(function(t){return null!=n[t[0]]?n[t[0]]=t[1]:void 0}),Bacon.fromEventTarget(t.domElement,"mousemove").onValue(function(t){var e,i,s;i=[];for(e in r)o.call(r,e)&&(s=r[e],i.push(s.forEach(function(r){return n[e]?r(t.clientX,t.clientY):void 0})));return i}),[function(t,e){var n;return null!=(n=r[t])?n.push(e):void 0},function(t,e){return _.remove(r[t],function(t){return null!=e?t===e:!0})}]}}(this)(),this.onMouseMove=l[0],this.offMouseMove=l[1],this.offAll=function(t){return function(){var n,r,i,s;e.forEach(function(e){return t.offMouseDown(e),t.offMouseUp(e),t.offMouseMove(e)}),t.offDoubleClick(),r=t.listener,i=[];for(n in r)o.call(r,n)&&(s=r[n],i.push(t.off(n)));return i}}(this)}return t.prototype.on=function(t,e){return this.listener[t]?this.listener[t].push(e):this.listener[t]=[e]},t.prototype.off=function(t,e){return null==e&&(e=allremove),_.remove(this.listener[t],function(t){return t===e})},t}(),e.exports=r},{}],6:[function(t,e,n){"use strict";var r,i;i=t("./scene"),r=function(){function t(){var t;Detector.webgl||Detector.addGetWebGLMessage(),this.renderer=new THREE.WebGLRenderer({alpha:!0,antialiasing:!0}),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.setClearColor(10541295,1),this.renderer.autoClear=!1,this.renderer.sortObjects=!0,$("#world").append(this.renderer.domElement),this.currentScene=void 0,t=function(t){return function(e){return t.currentScene.input.offAll(),t.currentScene=e}}(this),this.currentScene=new i(this.renderer,t),this.stats=new Stats,this.stats.setMode(0),this.stats.domElement.style.position="absolute",this.stats.domElement.style.left="0px",this.stats.domElement.style.top="0px",$(document.body).append(this.stats.domElement),$(window).resize(function(t){return function(){var e,n;return n=window.innerWidth,e=window.innerHeight,t.renderer.setSize(n,e),t.currentScene.camera.aspect=n/e,t.currentScene.camera.updateProjectionMatrix()}}(this))}return t.prototype.animate=function(){var t;return requestAnimationFrame(function(t){return function(){return t.animate()}}(this)),this.stats.begin(),this.renderer.clear(),null!=(t=this.currentScene)&&t.update(),this.stats.end()},t}(),$(function(){return(new r).animate()})},{"./scene":8}],7:[function(t,e,n){var r,i,o,s=function(t,e){function n(){this.constructor=t}for(var r in e)u.call(e,r)&&(t[r]=e[r]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t},u={}.hasOwnProperty;r=t("./input"),o=t("util").inspect,i=function(t){function e(t,n,r,i){this.world=t,e.__super__.constructor.call(this),this.input=this.world.input,this.velocity=new THREE.Vector3(0,0,0),this.canJump=!1,this.canDoubleJump=!1,this.doubleJumpFlag=!1,this.gravity=!0,this.height=1.7,this.width=.7,this.mode=1,this.sneak=!1,this.position.set(n,r,i),this.lookAt(new THREE.Vector3(n,0,i)),this.ray=new THREE.Raycaster,this.ray.near=0,this.ray.far=5,this.pickFlag=!1,this.input.onMouseDown(THREE.MOUSE.LEFT,function(t){return function(){return t.pickFlag=!0}}(this)),this.input.onMouseUp(THREE.MOUSE.LEFT,function(t){return function(){return t.pickFlag=!1}}(this))}return s(e,t),e.prototype.getCollider=function(){return this.collider=[this.position.clone().add(new THREE.Vector3(-this.width/2,-.5,-this.width/2)),this.position.clone().add(new THREE.Vector3(this.width/2,this.height-.5,this.width/2))]},e.prototype.getCell=function(){var t;return t={x:Math.floor(this.position.x),y:Math.floor(this.position.y),z:Math.floor(this.position.z)}},e.prototype.getAroundColliders=function(t,e){var n,r,i,o,s,u,a,c,h,l,f,p,y,d,g,m,v,E,w,b;for(d=[],f=this.getCell(),E=f.x,w=f.y,b=f.z,o=[],p=[-1,0,1],s=0,c=p.length;c>s;s++)for(n=p[s],y=[-1,0,1],u=0,h=y.length;h>u;u++)r=y[u],"x"===t&&o.push([e,n,r]),"y"===t&&o.push([n,e,r]),"z"===t&&o.push([n,r,e]);for(a=0,l=o.length;l>a;a++)i=o[a],g=E+i[0],m=w+i[1],v=b+i[2],this.world.terrain.getType(g,m,v)&&d.push(this.world.terrain.getCollider(g,m,v));return d},e.prototype.collides=function(t){var e;return e=this.getCollider(),t.some(function(t){return t[0].x>e[1].x?!1:t[0].y>e[1].y?!1:t[0].z>e[1].z?!1:t[1].x<e[0].x?!1:t[1].y<e[0].y?!1:t[1].z<e[0].z?!1:!0})},e.prototype.pick=function(){var t,e,n,r,i,o,s,u,a,c,h,l,f,p,y,d,g;if(h=this.position.clone().add(new THREE.Vector3(0,this.height-.6,0)),o=new THREE.Vector3(0,0,1),o.unproject(this.world.camera),e=o.sub(h).normalize(),this.ray.set(h,e),i=this.ray.intersectObject(this.world.terrain.mesh),i.length>0){if(r=i[0],n=r.face,t=r.object.geometry.attributes,l=t.position,s=t.normal,p=3*n.a,this.input.keys.q)return f=this.world.terrain.getCell(l.array[p],l.array[p+1],l.array[p+2]),y=f.x,d=f.y,g=f.z,this.world.terrain.removeBlock(y,d,g);if(this.input.keys.e)return u=s.array[p],a=s.array[p+1],c=s.array[p+2],console.log(u+" "+a+" "+c)}},e.prototype.action=function(t){var e,n,r,i,o,s,u;for(n=.001,r=!1,this.velocity.x-=3*this.velocity.x*t,this.velocity.z-=3*this.velocity.z*t,Math.abs(this.velocity.x)<n&&(this.velocity.x=0),Math.abs(this.velocity.z)<n&&(this.velocity.z=0),this.gravity&&-this.velocity.y*t<.5&&(this.velocity.y-=9.8*2.7*t),s=["x","y","z"],i=0,o=s.length;o>i;i++)e=s[i],Math.abs(this.velocity[e])*t>.7&&(this.velocity[e]=.8*(this.velocity[e]<0?-1:1)/t);return this.input.keys.shift?this.canJump&&(this.sneak=!0):(r=!0,this.sneak=!1),u=this.sneak?2:12,this.input.keys.w&&(this.velocity.z-=u*t,r=!0),this.input.keys.a&&(this.velocity.x-=u*t,r=!0),this.input.keys.s&&(this.velocity.z+=u*t,r=!0),this.input.keys.d&&(this.velocity.x+=u*t,r=!0),this.input.keys.space&&!this.sneak?this.gravity?this.canDoubleJump&&(this.velocity.y=17,this.velocity.x*=3,this.velocity.z*=3,this.canDoubleJump=!1):this.canJump&&(this.velocity.y=8.5,this.canJump=!1,this.gravity=!0,this.doubleJumpFlag=!0):this.doubleJumpFlag&&(this.canDoubleJump=!0,this.doubleJumpFlag=!1),r?(this.gravity=!0,this.canJump=!1):void 0},e.prototype.hitCheck=function(t){var e,n,r,i,o,s,u,a,c,h,l,f,p,y,d;if(r=.001,f=this.position.clone(),this.translateX(this.velocity.x*t),this.translateZ(this.velocity.z*t),this.translateY(this.velocity.y*t),c={x:this.position.x-f.x,z:this.position.z-f.z,y:this.position.y-f.y},this.position.copy(f),this.sneak){for(p=["x","z"],i=0,s=p.length;s>i;i++)if(e=p[i],a=c[e],!(Math.abs(a)<r))if(h=this.position[e],this.position[e]+=a,n=this.getAroundColliders(e,0>a?-1:1),this.collides(n))this.position[e]=h;else{if(c.y>0)continue;l=this.position.y,this.position.y-=.5,n=this.getAroundColliders("y",-1),this.collides(n)||(this.position[e]=h),this.position.y=l}return this.velocity.y=0,this.gravity=!1}for(y=["x","z","y"],d=[],o=0,u=y.length;u>o;o++)e=y[o],a=c[e],Math.abs(a)<r||(h=this.position[e],this.position[e]+=a,n=this.getAroundColliders(e,0>a?-1:1),this.collides(n)?(this.position[e]=h,"y"===e?(this.velocity.y=0,0>a?(this.canJump=!0,this.canDoubleJump=!1,this.doubleJumpFlag=!1,d.push(this.gravity=!1)):d.push(void 0)):d.push(void 0)):d.push(void 0));return d},e.prototype.update=function(t){return this.pickFlag&&this.pick(),this.action(t),this.hitCheck(t)},e}(THREE.Object3D),e.exports=i},{"./input":5,util:4}],8:[function(t,e,n){var r,i,o,s,u=function(t,e){function n(){this.constructor=t}for(var r in e)a.call(e,r)&&(t[r]=e[r]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t},a={}.hasOwnProperty;r=t("./input"),s=t("./world"),o=function(){function t(t,e){var n,i;this.renderer=t,this.transit=e,this.clock=new THREE.Clock,this.input=new r(document.body),this.scene=new THREE.Scene,i=window.innerWidth,n=window.innerHeight,this.camera=new THREE.PerspectiveCamera(72,i/n,.1,1e3)}return t.prototype.update=function(){return this.renderer.render(this.scene,this.camera)},t}(),i=function(t){function e(t,n){this.renderer=t,this.transit=n,e.__super__.constructor.call(this,this.renderer,this.transit),this.scene.fog=new THREE.Fog(16777215,100,1e3),this.controls=new THREE.PointerLockControls(this.camera),this.scene.add(this.controls.getObject()),this.world=new s(this.renderer,this.scene,this.input,this.camera,8),this.world.syncCamera(this.controls),this.input.onMouseDown(THREE.MOUSE.LEFT,function(t){return function(){return document.pointerLockElement?void 0:(t.controls.enabled=!0,document.body.requestPointerLock())}}(this))}return u(e,t),e.prototype.update=function(){var t;return this.controls.enabled&&(t=this.clock.getDelta(),t=Math.min(1/60,t),this.world.update(t),this.world.syncCamera(this.controls)),e.__super__.update.call(this)},e}(o),e.exports=i},{"./input":5,"./world":11}],9:[function(t,e,n){var r,i;i=t("./util"),r=function(){function t(t,e,n,r,o){this.world=t,this.size=e,this.heightMin=null!=n?n:0,this.heightRange=null!=r?r:128,this.seed=null!=o?o:void 0,this.size2=this.size*this.size,null==this.seed&&(this.seed=i.rand(1e6)),this.cell=new Uint8Array(this.size2*this.heightRange),this.cellFace=new Int32Array(this.size2*this.heightRange*6),this.faceNum=0,this.generateMesh(32,.5,this.heightMin,this.heightMin+this.heightRange-1),console.log("seed: "+this.seed)}return t.prototype.getCell=function(t,e,n){var r;return r={x:Math.floor(t),y:Math.floor(e),z:Math.floor(n)}},t.prototype.getIndex=function(t,e,n){return 0>t||t>this.size-1?-1:0>n||n>this.size-1?-1:e<this.heightMin||e>this.heightMin+this.heightRange-1?-1:t+n*this.size+e*this.size2},t.prototype.getIndex2=function(t,e,n){var r;return r=this.getCell(t,e,n),t=r.x,e=r.y,n=r.z,0>t||t>this.size-1?-1:0>n||n>this.size-1?-1:e<this.heightMin||e>this.heightMin+this.heightRange-1?-1:t+n*this.size+e*this.size2},t.prototype.getType=function(t,e,n){var r;return r=this.getIndex(t,e,n),0>r?0:this.cell[r]},t.prototype.getFaceIndex=function(t,e){return this.cellFace[6*t+e]},t.prototype.getFaceFromNormal=function(t,e,n){return t*t*(3+t)/2+e*e*(5-5*e)/2+n*n*(7+n)/2},t.prototype.getInvFaceFromNormal=function(t,e,n){return t*t*(3-t)/2+e*e*(5+5*e)/2+n*n*(7-n)/2},t.prototype.getColor=function(t){var e,n,r,i;switch(e=new THREE.Color(0),i=new THREE.Color(1118481),n=new THREE.Color(9127187),r=new THREE.Color(2263842),t){case 0:return[e,e,e,e,e,e];case 1:return[n,n,n,n,n,n];case 2:return[r,n,n,n,n,n];default:return[i,i,i,i,i,i]}},t.prototype.removeBlock=function(t,e,n){var r,o,s,u,a,c,h,l,f,p,y,d,g,m,v,E,w,b,z,x,M,T,R,k,H,C,F,O,S,_,A,D,j,N,B,J,U,L,I,V,G,P;if(m=this.getIndex(t,e,n),!(0>m)){for(this.cell[m]=0,r=this.geometry.attributes,k=r.position,T=r.normal,s=r.color,g=r.index,F=[],p=w=0;6>w;p=++w)if(l=this.getFaceIndex(m,p),-1!==l)if(this.faceNum--,N=6*this.faceNum,l!==N)for(console.log("[remove] "+l),O=[0,1,2,5],x=0,b=O.length;b>x;x++){for(d=O[x],a=3*g.array[l+d],S=3*g.array[N+d],y=!0,F.forEach(function(t,e){var n;return t[0]<=a&&a<=t[0]+t[1]?(t[0]+t[1]===a&&(F[e][1]+=3),y=!1):a<=(n=t[0])&&a+3>=n?(F[e][0]=a,t[0]!==a&&(F[e][1]+=3),y=!1):void 0}),y&&F.push([a,3]),j=[],D=[],E=M=0;3>M;E=++M)j.push(k.array[S+E]),k.array[a+E]=k.array[S+E],D.push(T.array[S+E]),T.array[a+E]=T.array[S+E],s.array[a+E]=s.array[S+E];0===d&&(A=6*this.getIndex2(j[0],j[1],j[2]),_=this.getFaceFromNormal(D[0],D[1],D[2]),this.cellFace[A+_]=l,console.log("[move] "+N))}else console.log("last face!!");for(d=H=0;6>H;d=++H)this.cellFace[6*m+d]=-1;for(h=[[0,1,0],[-1,0,0],[1,0,0],[0,0,-1],[0,0,1],[0,-1,0]],f=[[[0,1,0],[0,1,1],[1,1,0],[1,1,1]],[[0,1,0],[0,0,0],[0,1,1],[0,0,1]],[[1,1,1],[1,0,1],[1,1,0],[1,0,0]],[[1,1,0],[1,0,0],[0,1,0],[0,0,0]],[[0,1,1],[0,0,1],[1,1,1],[1,0,1]],[[1,0,1],[0,0,1],[1,0,0],[0,0,0]]],v=[[0,1,2],[2,1,3]],R=1e-5,J=6*this.faceNum,B=g.array[J-1]+1,U=3*B,G=U,I=0,P=J,V=0,C=0,z=h.length;z>C;C++)u=h[C],L=this.getType(t+u[0],e+u[1],n+u[2]),0!==L&&(l=this.getInvFaceFromNormal(u[0],u[1],u[2]),console.log("[add] "+J+" face: "+l+" / d: "+u),o=this.getColor(L)[l],c=this.getIndex(t+u[0],e+u[1],n+u[2]),this.cellFace[6*c+l]=J,v.forEach(function(t){return g.array[J]=t[0]+B,g.array[J+1]=t[1]+B,g.array[J+2]=t[2]+B,J+=3}),B+=4,f[l].forEach(function(r){return k.array[U]=r[0]+t+u[0]+(r[0]<.5?R:-R),k.array[U+1]=r[1]+e+u[1]+(r[1]<.5?R:-R),k.array[U+2]=r[2]+n+u[2]+(r[2]<.5?R:-R),T.array[U]=-u[0],T.array[U+1]=-u[1],T.array[U+2]=-u[2],s.array[U]=o.r+i.randf(o.r/4),s.array[U+1]=o.g+i.randf(o.g/4),s.array[U+2]=o.b+i.randf(o.b/4),U+=3}),V+=6,I+=12,this.faceNum++);return I>0&&F.push([G,I]),V>0&&this.updateGeometry("index",[[P,V]]),console.log("range: "+F),F.length>0&&(this.updateGeometry("position",F),this.updateGeometry("color",F),this.updateGeometry("normal",F)),this.geometry.drawcalls[0].count=6*this.faceNum}},t.prototype.addBlock=function(t,e,n,r){var i;return i=this.getIndex(t,e,n),-1>i},t.prototype.updateGeometry=function(t,e){var n,r,i,o,s,u,a,c,h,l,f;for(n=this.world.renderer.context,i=this.geometry.attributes,r=i[t],o="index"===t?n.ELEMENT_ARRAY_BUFFER:n.ARRAY_BUFFER,n.bindBuffer(o,r.buffer),f=[],a=0,c=e.length;c>a;a++)l=e[a],h=l[0],s=l[1],u=r.array.subarray(h,h+s),n.bufferSubData(o,h*r.array.BYTES_PER_ELEMENT,u),f.push(u=null);return f},t.prototype.getCollider=function(t,e,n){return[new THREE.Vector3(t,e,n),new THREE.Vector3(t+1,e+1,n+1)]},t.prototype.getHeight=function(t,e){var n,r,i,o,s,u;for(i=t+e*this.size,r=this.heightMin+this.heightRange-1,n=o=s=r,u=this.heightMin;u>=s?u>=o:o>=u;n=u>=s?++o:--o)if(0!==this.cell[i+n*this.size2])return n;return this.heightMin},t.prototype.generateMesh=function(t,e,n,r){var o,s;return s=new Int16Array(this.size2),o=this.size2*(this.heightMin+this.heightRange-1)*3,console.log("faceMax: "+o),function(o){return function(){var u,a,c,h,l,f,p,y,d,g,m,v,E;for(u=n,a=r,c=f=0,g=o.size2;g>=0?g>f:f>g;c=g>=0?++f:--f){for(v=(c%o.size+2)/2,E=((c/o.size|0)+3)/2,d=2,l=p=0;4>p;l=++p)s[c]+=i.noise(v/d,E/d,o.seed)*d,d*=4;for(s[c]=~~Math.max(n,Math.min(r,s[c]*e+t)),h=y=0,m=s[c];m>=0?m>=y:y>=m;h=m>=0?++y:--y)h===s[c]?o.cell[c+h*o.size2]=2:o.cell[c+h*o.size2]=1;u=Math.max(u,s[c]),a=Math.min(a,s[c])}return console.log("height: ["+a+", "+u+"]")}}(this)(),this.geometry=new THREE.BufferGeometry,this.material=new THREE.MeshLambertMaterial({vertexColors:THREE.VertexColors}),function(t){return function(){var e,n,r,s,u,a,c,h,l;return s=[[[0,1,0],[0,1,1],[1,1,0],[1,1,1]],[[0,1,0],[0,0,0],[0,1,1],[0,0,1]],[[1,1,1],[1,0,1],[1,1,0],[1,0,0]],[[1,1,0],[1,0,0],[0,1,0],[0,0,0]],[[0,1,1],[0,0,1],[1,1,1],[1,0,1]],[[1,0,1],[0,0,1],[1,0,0],[0,0,0]]],u=[[0,1,2],[2,1,3]],r=[[0,1,0],[-1,0,0],[1,0,0],[0,0,-1],[0,0,1],[0,-1,0]],l=new Float32Array(4*o*3),a=new Uint32Array(2*o*3),c=new Float32Array(4*o*3),e=new Float32Array(4*o*3),n=0,h=1e-5,t.cell.forEach(function(o,f){var p,y,d,g,m,v;{if(0!==o)return g=f%t.size,v=f%t.size2/t.size|0,m=f/t.size2|0,p=t.getColor(t.getType(g,m,v)),r.forEach(function(r,o){var y;return y=t.getType(g+r[0],m+r[1],v+r[2]),0===y?(t.faceNum++,s[o].forEach(function(t,r){var s;return l[12*n+3*r+0]=t[0]+g+(t[0]<.5?h:-h),l[12*n+3*r+1]=t[1]+m+(t[1]<.5?h:-h),l[12*n+3*r+2]=t[2]+v+(t[2]<.5?h:-h),c[12*n+3*r+0]=1===o?-1:2===o?1:0,c[12*n+3*r+1]=5===o?-1:0===o?1:0,c[12*n+3*r+2]=3===o?-1:4===o?1:0,s=p[o],e[12*n+3*r+0]=s.r+i.randf(s.r/4),e[12*n+3*r+1]=s.g+i.randf(s.g/4),e[12*n+3*r+2]=s.b+i.randf(s.b/4)}),t.cellFace[6*f+o]=6*n,u.forEach(function(t,e){return a[6*n+3*e+0]=t[0]+4*n,a[6*n+3*e+1]=t[1]+4*n,a[6*n+3*e+2]=t[2]+4*n}),n++):t.cellFace[6*f+o]=-1});for(y=d=0;6>d;y=++d)t.cellFace[6*f+y]=-1}}),t.geometry.addAttribute("position",new THREE.DynamicBufferAttribute(l,3)),t.geometry.addAttribute("index",new THREE.DynamicBufferAttribute(a,3)),t.geometry.addAttribute("normal",new THREE.DynamicBufferAttribute(c,3)),t.geometry.addAttribute("color",new THREE.DynamicBufferAttribute(e,3)),t.geometry.drawcalls.push({start:0,count:2*t.faceNum*3,index:0})}}(this)(),this.mesh=new THREE.Mesh(this.geometry,this.material)},t}(),e.exports=r},{"./util":10}],10:[function(t,e,n){var r;r=function(){function t(){}return t.rand=function(t){return Math.floor(Math.random()*t)},t.randf=function(t){return Math.random()*t},t.randRange=function(t,e){return Math.floor(Math.random()*(e-t+1))+t},t.randArray=function(t){return t[Math.floor(Math.random()*t.length)]},t.noise=function(){var t;return t=new ImprovedNoise,function(e,n,r){return t.noise(e,n,r)}}(),t}(),e.exports=r},{}],11:[function(t,e,n){var r,i,o;i=t("./terrain"),r=t("./player"),o=function(){function t(t,e,n,o,s){var u;this.renderer=t,this.scene=e,this.input=n,this.camera=o,this.size=s,u=128,this.terrain=new i(this,this.size,0,u,599774),this.scene.add(this.terrain.mesh),this.light=new THREE.DirectionalLight(16777215,.6),this.light.position.set(.5,.7,.3).normalize(),this.scene.add(this.light),this.light2=new THREE.HemisphereLight(16777215,1118481,.6),this.scene.add(this.light2),this.player=new r(this,this.size/2,this.terrain.getHeight(this.size/2,this.size/2)+128,this.size/2)}return t.prototype.update=function(t){return this.player.update(t)},t.prototype.syncCamera=function(t){var e;return e=this.player.position.clone().add(new THREE.Vector3(0,this.player.height-.6,0)),t.getObject().position.copy(e),this.player.rotation.copy(t.getObject().rotation)},t}(),e.exports=o},{"./player":7,"./terrain":9}]},{},[6]);
//# sourceMappingURL=bundle.js.map