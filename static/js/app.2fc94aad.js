(function(e){function t(t){for(var r,s,o=t[0],c=t[1],u=t[2],d=0,p=[];d<o.length;d++)s=o[d],Object.prototype.hasOwnProperty.call(a,s)&&a[s]&&p.push(a[s][0]),a[s]=0;for(r in c)Object.prototype.hasOwnProperty.call(c,r)&&(e[r]=c[r]);l&&l(t);while(p.length)p.shift()();return i.push.apply(i,u||[]),n()}function n(){for(var e,t=0;t<i.length;t++){for(var n=i[t],r=!0,o=1;o<n.length;o++){var c=n[o];0!==a[c]&&(r=!1)}r&&(i.splice(t--,1),e=s(s.s=n[0]))}return e}var r={},a={app:0},i=[];function s(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,s),n.l=!0,n.exports}s.m=e,s.c=r,s.d=function(e,t,n){s.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},s.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,t){if(1&t&&(e=s(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(s.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)s.d(n,r,function(t){return e[t]}.bind(null,r));return n},s.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="/";var o=window["webpackJsonp"]=window["webpackJsonp"]||[],c=o.push.bind(o);o.push=t,o=o.slice();for(var u=0;u<o.length;u++)t(o[u]);var l=c;i.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},"56d7":function(e,t,n){"use strict";n.r(t);n("e260"),n("e6cf"),n("cca6"),n("a79d");var r=n("2b0e"),a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"app"}},[n("a",{attrs:{href:"/login"}},[e._v("login")]),n("div",[n("input",{attrs:{placeholder:"searchForSong"},on:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.search.apply(null,arguments)}}})]),n("div",{staticStyle:{display:"flex"}},[n("div",[n("div",[e._v("search results")]),e._l(e.searchResults,(function(t){return n("div",{key:t.id,staticStyle:{display:"flex"}},[n("img",{attrs:{width:"100px",src:t.art}}),n("div",[n("a",{attrs:{href:t.url}},[e._v(e._s(t.name))]),n("div",[e._v("by "),e._l(t.artists,(function(r){return n("a",{key:""+t.id+r.name,staticStyle:{"margin-right":"8px"},attrs:{href:r.url}},[e._v(e._s(r.name))])}))],2),n("button",{on:{click:function(n){return e.add(t)}}},[e._v("add")])])])}))],2),n("div",[n("div",[e._v("selected")]),n("button",{on:{click:e.generate}},[e._v("generate")]),e._l(e.selectedSongs,(function(t){return n("div",{key:t.id,staticStyle:{display:"flex"}},[n("img",{attrs:{width:"100px",src:t.art}}),n("div",[n("a",{attrs:{href:t.url}},[e._v(e._s(t.name))]),n("div",[e._v("by "),e._l(t.artists,(function(r){return n("a",{key:""+t.id+r.name,staticStyle:{"margin-right":"8px"},attrs:{href:r.url}},[e._v(e._s(r.name))])}))],2),n("button",{on:{click:function(n){return e.remove(t)}}},[e._v("remove")])])])}))],2),n("div",[n("div",[e._v("generated")]),e._l(e.genResults,(function(t){return n("div",{key:t.id,staticStyle:{display:"flex"}},[n("img",{attrs:{width:"100px",src:t.art}}),n("div",[n("a",{attrs:{href:t.url}},[e._v(e._s(t.name))]),n("div",[e._v("by "),e._l(t.artists,(function(r){return n("a",{key:""+t.id+r.name,staticStyle:{"margin-right":"8px"},attrs:{href:r.url}},[e._v(e._s(r.name))])}))],2)])])}))],2),n("div",[n("button",{on:{click:e.exportPlaylist}},[e._v("export")])]),n("div",[e._v(" generated playlist "),n("a",{attrs:{href:e.generatedPlaylist.url}},[e._v(e._s(e.generatedPlaylist.name))]),n("div",[e._v(e._s(e.generatedPlaylist.description))])])])])},i=[],s=n("1da1"),o=(n("96cf"),n("d3b7"),n("e9c4"),n("d81d"),n("a434"),n("c740"),n("7db0"),{name:"App",components:{},data:function(){return{selectedSongs:[],searchResults:[],genResults:[],generatedPlaylist:{name:"",url:"",description:""}}},methods:{generate:function(){var e=this;return Object(s["a"])(regeneratorRuntime.mark((function t(){var n;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,fetch("/api/sammify",{method:"post",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify({tracks:e.selectedSongs.map((function(e){return e.id}))})});case 2:return n=t.sent,t.next=5,n.json();case 5:e.genResults=t.sent;case 6:case"end":return t.stop()}}),t)})))()},remove:function(e){this.selectedSongs.splice(this.selectedSongs.findIndex((function(t){return t.id===e.id})),1)},add:function(e){this.selectedSongs.find((function(t){return t.id===e.id}))||this.selectedSongs.push(e)},exportPlaylist:function(){var e=this;return Object(s["a"])(regeneratorRuntime.mark((function t(){var n;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,fetch("/api/generate-playlist",{method:"post",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify({tracks:e.genResults.map((function(e){return e.id}))})});case 2:return n=t.sent,t.next=5,n.json();case 5:e.generatedPlaylist=t.sent;case 6:case"end":return t.stop()}}),t)})))()},search:function(e){var t=this;return Object(s["a"])(regeneratorRuntime.mark((function n(){var r;return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return n.next=2,fetch("/api/search?song=".concat(e.target.value));case 2:return r=n.sent,n.next=5,r.json();case 5:t.searchResults=n.sent;case 6:case"end":return n.stop()}}),n)})))()}}}),c=o,u=n("2877"),l=Object(u["a"])(c,a,i,!1,null,null,null),d=l.exports;r["a"].config.productionTip=!1,new r["a"]({render:function(e){return e(d)}}).$mount("#app")}});
//# sourceMappingURL=app.2fc94aad.js.map