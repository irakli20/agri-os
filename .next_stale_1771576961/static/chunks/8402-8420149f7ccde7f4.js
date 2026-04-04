(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[8402],{93719:function(e){"use strict";function t(e,t,c){c=c||2;var h,p,_,m,E,v,b,A=t&&t.length,y=A?t[0]*c:e.length,T=r(e,0,y,c,!0),R=[];if(!T||T.next===T.prev)return R;if(A&&(T=function(e,t,s,l){var u,c,h,p,g,_=[];for(u=0,c=t.length;u<c;u++)h=t[u]*l,p=u<c-1?t[u+1]*l:e.length,(g=r(e,h,p,l,!1))===g.next&&(g.steiner=!0),_.push(function(e){var t=e,r=e;do(t.x<r.x||t.x===r.x&&t.y<r.y)&&(r=t),t=t.next;while(t!==e);return r}(g));for(_.sort(n),u=0;u<_.length;u++)s=function(e,t){var r=function(e,t){var r,i,n,s=t,l=e.x,u=e.y,c=-1/0;do{if(u<=s.y&&u>=s.next.y&&s.next.y!==s.y){var h=s.x+(u-s.y)*(s.next.x-s.x)/(s.next.y-s.y);if(h<=l&&h>c&&(c=h,n=s.x<s.next.x?s:s.next,h===l))return n}s=s.next}while(s!==t);if(!n)return null;var d,p=n,g=n.x,_=n.y,m=1/0;s=n;do l>=s.x&&s.x>=g&&l!==s.x&&o(u<_?l:c,u,g,_,u<_?c:l,u,s.x,s.y)&&(d=Math.abs(u-s.y)/(l-s.x),f(s,e)&&(d<m||d===m&&(s.x>n.x||s.x===n.x&&(r=n,i=s,0>a(r.prev,r,i.prev)&&0>a(i.next,r,r.next))))&&(n=s,m=d)),s=s.next;while(s!==p);return n}(e,t);if(!r)return t;var n=d(r,e);return i(n,n.next),i(r,r.next)}(_[u],s);return s}(e,t,T,c)),e.length>80*c){h=_=e[0],p=m=e[1];for(var S=c;S<y;S+=c)E=e[S],v=e[S+1],E<h&&(h=E),v<p&&(p=v),E>_&&(_=E),v>m&&(m=v);b=0!==(b=Math.max(_-h,m-p))?32767/b:0}return function e(t,r,n,c,h,p,_){if(t){!_&&p&&function(e,t,r,i){var n=e;do 0===n.z&&(n.z=s(n.x,n.y,t,r,i)),n.prevZ=n.prev,n.nextZ=n.next,n=n.next;while(n!==e);n.prevZ.nextZ=null,n.prevZ=null,function(e){var t,r,i,n,s,o,a,l,u=1;do{for(r=e,e=null,s=null,o=0;r;){for(o++,i=r,a=0,t=0;t<u&&(a++,i=i.nextZ);t++);for(l=u;a>0||l>0&&i;)0!==a&&(0===l||!i||r.z<=i.z)?(n=r,r=r.nextZ,a--):(n=i,i=i.nextZ,l--),s?s.nextZ=n:e=n,n.prevZ=s,s=n;r=i}s.nextZ=null,u*=2}while(o>1)}(n)}(t,c,h,p);for(var m,E,v=t;t.prev!==t.next;){if(m=t.prev,E=t.next,p?function(e,t,r,i){var n=e.prev,l=e.next;if(a(n,e,l)>=0)return!1;for(var u=n.x,c=e.x,h=l.x,f=n.y,d=e.y,p=l.y,g=u<c?u<h?u:h:c<h?c:h,_=f<d?f<p?f:p:d<p?d:p,m=u>c?u>h?u:h:c>h?c:h,E=f>d?f>p?f:p:d>p?d:p,v=s(g,_,t,r,i),b=s(m,E,t,r,i),A=e.prevZ,y=e.nextZ;A&&A.z>=v&&y&&y.z<=b;){if(A.x>=g&&A.x<=m&&A.y>=_&&A.y<=E&&A!==n&&A!==l&&o(u,f,c,d,h,p,A.x,A.y)&&a(A.prev,A,A.next)>=0||(A=A.prevZ,y.x>=g&&y.x<=m&&y.y>=_&&y.y<=E&&y!==n&&y!==l&&o(u,f,c,d,h,p,y.x,y.y)&&a(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;A&&A.z>=v;){if(A.x>=g&&A.x<=m&&A.y>=_&&A.y<=E&&A!==n&&A!==l&&o(u,f,c,d,h,p,A.x,A.y)&&a(A.prev,A,A.next)>=0)return!1;A=A.prevZ}for(;y&&y.z<=b;){if(y.x>=g&&y.x<=m&&y.y>=_&&y.y<=E&&y!==n&&y!==l&&o(u,f,c,d,h,p,y.x,y.y)&&a(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}(t,c,h,p):function(e){var t=e.prev,r=e.next;if(a(t,e,r)>=0)return!1;for(var i=t.x,n=e.x,s=r.x,l=t.y,u=e.y,c=r.y,h=i<n?i<s?i:s:n<s?n:s,f=l<u?l<c?l:c:u<c?u:c,d=i>n?i>s?i:s:n>s?n:s,p=l>u?l>c?l:c:u>c?u:c,g=r.next;g!==t;){if(g.x>=h&&g.x<=d&&g.y>=f&&g.y<=p&&o(i,l,n,u,s,c,g.x,g.y)&&a(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}(t)){r.push(m.i/n|0),r.push(t.i/n|0),r.push(E.i/n|0),g(t),t=E.next,v=E.next;continue}if((t=E)===v){_?1===_?e(t=function(e,t,r){var n=e;do{var s=n.prev,o=n.next.next;!l(s,o)&&u(s,n,n.next,o)&&f(s,o)&&f(o,s)&&(t.push(s.i/r|0),t.push(n.i/r|0),t.push(o.i/r|0),g(n),g(n.next),n=e=o),n=n.next}while(n!==e);return i(n)}(i(t),r,n),r,n,c,h,p,2):2===_&&function(t,r,n,s,o,c){var h=t;do{for(var p,g,_=h.next.next;_!==h.prev;){if(h.i!==_.i&&(p=h,g=_,p.next.i!==g.i&&p.prev.i!==g.i&&!function(e,t){var r=e;do{if(r.i!==e.i&&r.next.i!==e.i&&r.i!==t.i&&r.next.i!==t.i&&u(r,r.next,e,t))return!0;r=r.next}while(r!==e);return!1}(p,g)&&(f(p,g)&&f(g,p)&&function(e,t){var r=e,i=!1,n=(e.x+t.x)/2,s=(e.y+t.y)/2;do r.y>s!=r.next.y>s&&r.next.y!==r.y&&n<(r.next.x-r.x)*(s-r.y)/(r.next.y-r.y)+r.x&&(i=!i),r=r.next;while(r!==e);return i}(p,g)&&(a(p.prev,p,g.prev)||a(p,g.prev,g))||l(p,g)&&a(p.prev,p,p.next)>0&&a(g.prev,g,g.next)>0))){var m=d(h,_);h=i(h,h.next),m=i(m,m.next),e(h,r,n,s,o,c,0),e(m,r,n,s,o,c,0);return}_=_.next}h=h.next}while(h!==t)}(t,r,n,c,h,p):e(i(t),r,n,c,h,p,1);break}}}}(T,R,c,h,p,b,0),R}function r(e,t,r,i,n){var s,o;if(n===m(e,t,r,i)>0)for(s=t;s<r;s+=i)o=p(s,e[s],e[s+1],o);else for(s=r-i;s>=t;s-=i)o=p(s,e[s],e[s+1],o);return o&&l(o,o.next)&&(g(o),o=o.next),o}function i(e,t){if(!e)return e;t||(t=e);var r,i=e;do if(r=!1,!i.steiner&&(l(i,i.next)||0===a(i.prev,i,i.next))){if(g(i),(i=t=i.prev)===i.next)break;r=!0}else i=i.next;while(r||i!==t);return t}function n(e,t){return e.x-t.x}function s(e,t,r,i,n){return(e=((e=((e=((e=((e=(e-r)*n|0)|e<<8)&16711935)|e<<4)&252645135)|e<<2)&858993459)|e<<1)&1431655765)|(t=((t=((t=((t=((t=(t-i)*n|0)|t<<8)&16711935)|t<<4)&252645135)|t<<2)&858993459)|t<<1)&1431655765)<<1}function o(e,t,r,i,n,s,o,a){return(n-o)*(t-a)>=(e-o)*(s-a)&&(e-o)*(i-a)>=(r-o)*(t-a)&&(r-o)*(s-a)>=(n-o)*(i-a)}function a(e,t,r){return(t.y-e.y)*(r.x-t.x)-(t.x-e.x)*(r.y-t.y)}function l(e,t){return e.x===t.x&&e.y===t.y}function u(e,t,r,i){var n=h(a(e,t,r)),s=h(a(e,t,i)),o=h(a(r,i,e)),l=h(a(r,i,t));return!!(n!==s&&o!==l||0===n&&c(e,r,t)||0===s&&c(e,i,t)||0===o&&c(r,e,i)||0===l&&c(r,t,i))}function c(e,t,r){return t.x<=Math.max(e.x,r.x)&&t.x>=Math.min(e.x,r.x)&&t.y<=Math.max(e.y,r.y)&&t.y>=Math.min(e.y,r.y)}function h(e){return e>0?1:e<0?-1:0}function f(e,t){return 0>a(e.prev,e,e.next)?a(e,t,e.next)>=0&&a(e,e.prev,t)>=0:0>a(e,t,e.prev)||0>a(e,e.next,t)}function d(e,t){var r=new _(e.i,e.x,e.y),i=new _(t.i,t.x,t.y),n=e.next,s=t.prev;return e.next=t,t.prev=e,r.next=n,n.prev=r,i.next=r,r.prev=i,s.next=i,i.prev=s,i}function p(e,t,r,i){var n=new _(e,t,r);return i?(n.next=i.next,n.prev=i,i.next.prev=n,i.next=n):(n.prev=n,n.next=n),n}function g(e){e.next.prev=e.prev,e.prev.next=e.next,e.prevZ&&(e.prevZ.nextZ=e.nextZ),e.nextZ&&(e.nextZ.prevZ=e.prevZ)}function _(e,t,r){this.i=e,this.x=t,this.y=r,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function m(e,t,r,i){for(var n=0,s=t,o=r-i;s<r;s+=i)n+=(e[o]-e[s])*(e[s+1]+e[o+1]),o=s;return n}e.exports=t,e.exports.default=t,t.deviation=function(e,t,r,i){var n=t&&t.length,s=n?t[0]*r:e.length,o=Math.abs(m(e,0,s,r));if(n)for(var a=0,l=t.length;a<l;a++){var u=t[a]*r,c=a<l-1?t[a+1]*r:e.length;o-=Math.abs(m(e,u,c,r))}var h=0;for(a=0;a<i.length;a+=3){var f=i[a]*r,d=i[a+1]*r,p=i[a+2]*r;h+=Math.abs((e[f]-e[p])*(e[d+1]-e[f+1])-(e[f]-e[d])*(e[p+1]-e[f+1]))}return 0===o&&0===h?0:Math.abs((h-o)/o)},t.flatten=function(e){for(var t=e[0][0].length,r={vertices:[],holes:[],dimensions:t},i=0,n=0;n<e.length;n++){for(var s=0;s<e[n].length;s++)for(var o=0;o<t;o++)r.vertices.push(e[n][s][o]);n>0&&(i+=e[n-1].length,r.holes.push(i))}return r}},22252:function(e,t,r){"use strict";r.d(t,{Z:function(){return i}});let i=(0,r(39763).Z)("AlertCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]])},76858:function(e,t,r){"use strict";r.d(t,{Z:function(){return i}});let i=(0,r(39763).Z)("ArrowRight",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]])},46221:function(e,t,r){"use strict";r.d(t,{Z:function(){return i}});let i=(0,r(39763).Z)("BarChart3",[["path",{d:"M3 3v18h18",key:"1s2lah"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]])},85673:function(e,t,r){"use strict";r.d(t,{Z:function(){return i}});let i=(0,r(39763).Z)("Battery",[["rect",{width:"16",height:"10",x:"2",y:"7",rx:"2",ry:"2",key:"1w10f2"}],["line",{x1:"22",x2:"22",y1:"11",y2:"13",key:"4dh1rd"}]])},71769:function(e,t,r){"use strict";r.d(t,{Z:function(){return i}});let i=(0,r(39763).Z)("BookOpen",[["path",{d:"M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z",key:"vv98re"}],["path",{d:"M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",key:"1cyq3y"}]])},82222:function(e,t,r){"use strict";r.d(t,{Z:function(){return i}});let i=(0,r(39763).Z)("Bot",[["path",{d:"M12 8V4H8",key:"hb8ula"}],["rect",{width:"16",height:"12",x:"4",y:"8",rx:"2",key:"enze0r"}],["path",{d:"M2 14h2",key:"vft8re"}],["path",{d:"M20 14h2",key:"4cs60a"}],["path",{d:"M15 13v2",key:"1xurst"}],["path",{d:"M9 13v2",key:"rq6x2g"}]])},64972:function(e,t,r){"use strict";r.d(t,{Z:function(){return i}});let i=(0,r(39763).Z)("Brain",[["path",{d:"M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z",key:"l5xja"}],["path",{d:"M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z",key:"ep3f8r"}],["path",{d:"M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4",key:"1p4c4q"}],["path",{d:"M17.599 6.5a3 3 0 0 0 .399-1.375",key:"tmeiqw"}],["path",{d:"M6.003 5.125A3 3 0 0 0 6.401 6.5",key:"105sqy"}],["path",{d:"M3.477 10.896a4 4 0 0 1 .585-.396",key:"ql3yin"}],["path",{d:"M19.938 10.5a4 4 0 0 1 .585.396",key:"1qfode"}],["path",{d:"M6 18a4 4 0 0 1-1.967-.516",key:"2e4loj"}],["path",{d:"M19.967 17.484A4 4 0 0 1 18 18",key:"159ez6"}]])},88501:function(e,t,r){"use strict";r.d(t,{Z:function(){return i}});let i=(0,r(39763).Z)("CalendarDays",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}],["path",{d:"M8 14h.01",key:"6423bh"}],["path",{d:"M12 14h.01",key:"1etili"}],["path",{d:"M16 14h.01",key:"1gbofw"}],["path",{d:"M8 18h.01",key:"lrp35t"}],["path",{d:"M12 18h.01",key:"mhygvu"}],["path",{d:"M16 18h.01",key:"kzsmim"}]])},30401:function(e,t,r){"use strict";r.d(t,{Z:function(){return i}});let i=(0,r(39763).Z)("Check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]])},40875:function(e,t,r){"use strict";r.d(t,{Z:function(){return i}});let i=(0,r(39763).Z)("ChevronDown",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]])},45575:function(e,t,r){"use strict";r.d(t,{Z:function(){return i}});let i=(0,r(39763).Z)("ClipboardCheck",[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}],["path",{d:"m9 14 2 2 4-4",key:"df797q"}]])},43044:function(e,t,r){"use strict";r.d(t,{Z:function(){return i}});let i=(0,r(39763).Z)("ClipboardList",[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}],["path",{d:"M12 11h4",key:"1jrz19"}],["path",{d:"M12 16h4",key:"n85exb"}],["path",{d:"M8 11h.01",key:"1dfujw"}],["path",{d:"M8 16h.01",key:"18s6g9"}]])},5136:function(e,t,r){"use strict";r.d(t,{Z:function(){return i}});let i=(0,r(39763).Z)("Clipboard",[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}]])},91723:function(e,t,r){"use strict";r.d(t,{Z:function(){return i}});let i=(0,r(39763).Z)("Clock",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]])},79242:function(e,t,r){"use strict";r.d(t,{Z:function(){return i}});let i=(0,r(39763).Z)("CloudDrizzle",[["path",{d:"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242",key:"1pljnt"}],["path",{d:"M8 19v1",key:"1dk2by"}],["path",{d:"M8 14v1",key:"84yxot"}],["path",{d:"M16 19v1",key:"v220m7"}],["path",{d:"M16 14v1",key:"g12gj6"}],["path",{d:"M12 21v1",key:"q8vafk"}],["path",{d:"M12 16v1",key:"1mx6rx"}]])},24246:function(e,t,r){"use strict";r.d(t,{Z:function(){return i}});let i=(0,r(39763).Z)("CloudSun",[["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}],["path",{d:"M15.947 12.65a4 4 0 0 0-5.925-4.128",key:"dpwdj0"}],["path",{d:"M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z",key:"s09mg5"}]])},61341:function(e,t,r){"use strict";r.d(t,{Z:function(){return i}});let i=(0,r(39763).Z)("Cloud",[["path",{d:"M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z",key:"p7xjir"}]])},54080:function(e,t,r){"use strict";r.d(t,{Z:function(){return i}});let i=(0,r(39763).Z)("CornerDownLeft",[["polyline",{points:"9 10 4 15 9 20",key:"r3jprv"}],["path",{d:"M20 4v7a4 4 0 0 1-4 4H4",key:"6o5b7l"}]])},88226:function(e,t,r){"use strict";r.d(t,{Z:function(){return i}});let i=(0,r(39763).Z)("CreditCard",[["rect",{width:"20",height:"14",x:"2",y:"5",rx:"2",key:"ynyp8z"}],["line",{x1:"2",x2:"22",y1:"10",y2:"10",key:"1b3vmo"}]])},92735:function(e,t,r){"use strict";r.d(t,{Z:function(){return i}});let i=(0,r(39763).Z)("Download",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"7 10 12 15 17 10",key:"2ggqvy"}],["line",{x1:"12",x2:"12",y1:"15",y2:"3",key:"1vk2je"}]])},66927:function(e,t,r){"use strict";r.d(t,{Z:function(){return i}});let i=(0,r(39763).Z)("Droplets",[["path",{d:"M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z",key:"1ptgy4"}],["path",{d:"M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97",key:"1sl1rz"}]])},48736:function(e,t,r){"use strict";r.d(t,{Z:function(){return i}});let i=(0,r(39763).Z)("FileText",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]])},45554:function(e,t,r){"use strict";r.d(t,{Z:function(){return i}});let i=(0,r(39763).Z)("ListChecks",[["path",{d:"m3 17 2 2 4-4",key:"1jhpwq"}],["path",{d:"m3 7 2 2 4-4",key:"1obspn"}],["path",{d:"M13 6h8",key:"15sg57"}],["path",{d:"M13 12h8",key:"h98zly"}],["path",{d:"M13 18h8",key:"oe0vm4"}]])},15863:function(e,t,r){"use strict";r.d(t,{Z:function(){return i}});let i=(0,r(39763).Z)("Loader2",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]])},14168:function(e,t,r){"use strict";r.d(t,{Z:function(){return i}});let i=(0,r(39763).Z)("MapPinned",[["path",{d:"M18 8c0 4.5-6 9-6 9s-6-4.5-6-9a6 6 0 0 1 12 0",key:"yrbn30"}],["circle",{cx:"12",cy:"8",r:"2",key:"1822b1"}],["path",{d:"M8.835 14H5a1 1 0 0 0-.9.7l-2 6c-.1.1-.1.2-.1.3 0 .6.4 1 1 1h18c.6 0 1-.4 1-1 0-.1 0-.2-.1-.3l-2-6a1 1 0 0 0-.9-.7h-3.835",key:"112zkj"}]])},82718:function(e,t,r){"use strict";r.d(t,{Z:function(){return i}});let i=(0,r(39763).Z)("MessageCircle",[["path",{d:"M7.9 20A9 9 0 1 0 4 16.1L2 22Z",key:"vv11sd"}]])},21047:function(e,t,r){"use strict";r.d(t,{Z:function(){return i}});let i=(0,r(39763).Z)("Minus",[["path",{d:"M5 12h14",key:"1ays0h"}]])},44794:function(e,t,r){"use strict";r.d(t,{Z:function(){return i}});let i=(0,r(39763).Z)("Package",[["path",{d:"m7.5 4.27 9 5.15",key:"1c824w"}],["path",{d:"M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z",key:"hh9hay"}],["path",{d:"m3.3 7 8.7 5 8.7-5",key:"g66t2b"}],["path",{d:"M12 22V12",key:"d0xqtd"}]])},33276:function(e,t,r){"use strict";r.d(t,{Z:function(){return i}});let i=(0,r(39763).Z)("Play",[["polygon",{points:"5 3 19 12 5 21 5 3",key:"191637"}]])},99397:function(e,t,r){"use strict";r.d(t,{Z:function(){return i}});let i=(0,r(39763).Z)("Plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]])},83578:function(e,t,r){"use strict";r.d(t,{Z:function(){return i}});let i=(0,r(39763).Z)("ShieldAlert",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"M12 8v4",key:"1got3b"}],["path",{d:"M12 16h.01",key:"1drbdi"}]])},84286:function(e,t,r){"use strict";r.d(t,{Z:function(){return i}});let i=(0,r(39763).Z)("ShieldCheck",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]])},82023:function(e,t,r){"use strict";r.d(t,{Z:function(){return i}});let i=(0,r(39763).Z)("Sparkles",[["path",{d:"m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z",key:"17u4zn"}],["path",{d:"M5 3v4",key:"bklmnn"}],["path",{d:"M19 17v4",key:"iiml17"}],["path",{d:"M3 5h4",key:"nem4j1"}],["path",{d:"M17 19h4",key:"lbex7p"}]])},40485:function(e,t,r){"use strict";r.d(t,{Z:function(){return i}});let i=(0,r(39763).Z)("SprayCan",[["path",{d:"M3 3h.01",key:"159qn6"}],["path",{d:"M7 5h.01",key:"1hq22a"}],["path",{d:"M11 7h.01",key:"1osv80"}],["path",{d:"M3 7h.01",key:"1xzrh3"}],["path",{d:"M7 9h.01",key:"19b3jx"}],["path",{d:"M3 11h.01",key:"1eifu7"}],["rect",{width:"4",height:"4",x:"15",y:"5",key:"mri9e4"}],["path",{d:"m19 9 2 2v10c0 .6-.4 1-1 1h-6c-.6 0-1-.4-1-1V11l2-2",key:"aib6hk"}],["path",{d:"m13 14 8-2",key:"1d7bmk"}],["path",{d:"m13 19 8-2",key:"1y2vml"}]])},85929:function(e,t,r){"use strict";r.d(t,{Z:function(){return i}});let i=(0,r(39763).Z)("Sun",[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]])},26899:function(e,t,r){"use strict";r.d(t,{Z:function(){return i}});let i=(0,r(39763).Z)("Thermometer",[["path",{d:"M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z",key:"17jzev"}]])},15787:function(e,t,r){"use strict";r.d(t,{Z:function(){return i}});let i=(0,r(39763).Z)("Tractor",[["path",{d:"m10 11 11 .9c.6 0 .9.5.8 1.1l-.8 5h-1",key:"2w242w"}],["path",{d:"M16 18h-5",key:"bq60fd"}],["path",{d:"M18 5a1 1 0 0 0-1 1v5.573",key:"1kv8ia"}],["path",{d:"M3 4h9l1 7.246",key:"d639it"}],["path",{d:"M4 11V4",key:"9ft8pt"}],["path",{d:"M7 15h.01",key:"k5ht0j"}],["path",{d:"M8 10.1V4",key:"1jgyzo"}],["circle",{cx:"18",cy:"18",r:"2",key:"1emm8v"}],["circle",{cx:"7",cy:"15",r:"5",key:"ddtuc"}]])},18930:function(e,t,r){"use strict";r.d(t,{Z:function(){return i}});let i=(0,r(39763).Z)("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]])},3085:function(e,t,r){"use strict";r.d(t,{Z:function(){return i}});let i=(0,r(39763).Z)("TrendingDown",[["polyline",{points:"22 17 13.5 8.5 8.5 13.5 2 7",key:"1r2t7k"}],["polyline",{points:"16 17 22 17 22 11",key:"11uiuu"}]])},70525:function(e,t,r){"use strict";r.d(t,{Z:function(){return i}});let i=(0,r(39763).Z)("TrendingUp",[["polyline",{points:"22 7 13.5 15.5 8.5 10.5 2 17",key:"126l90"}],["polyline",{points:"16 7 22 7 22 13",key:"kwv8wd"}]])},40340:function(e,t,r){"use strict";r.d(t,{Z:function(){return i}});let i=(0,r(39763).Z)("Truck",[["path",{d:"M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2",key:"wrbu53"}],["path",{d:"M15 18H9",key:"1lyqi6"}],["path",{d:"M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14",key:"lysw3i"}],["circle",{cx:"17",cy:"18",r:"2",key:"332jqn"}],["circle",{cx:"7",cy:"18",r:"2",key:"19iecd"}]])},92369:function(e,t,r){"use strict";r.d(t,{Z:function(){return i}});let i=(0,r(39763).Z)("User",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]])},29525:function(e,t,r){"use strict";r.d(t,{Z:function(){return i}});let i=(0,r(39763).Z)("Wrench",[["path",{d:"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",key:"cbrjhi"}]])},45131:function(e,t,r){"use strict";r.d(t,{Z:function(){return i}});let i=(0,r(39763).Z)("XCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]])},40257:function(e,t,r){"use strict";var i,n;e.exports=(null==(i=r.g.process)?void 0:i.env)&&"object"==typeof(null==(n=r.g.process)?void 0:n.env)?r.g.process:r(44227)},44227:function(e){!function(){var t={229:function(e){var t,r,i,n=e.exports={};function s(){throw Error("setTimeout has not been defined")}function o(){throw Error("clearTimeout has not been defined")}function a(e){if(t===setTimeout)return setTimeout(e,0);if((t===s||!t)&&setTimeout)return t=setTimeout,setTimeout(e,0);try{return t(e,0)}catch(r){try{return t.call(null,e,0)}catch(r){return t.call(this,e,0)}}}!function(){try{t="function"==typeof setTimeout?setTimeout:s}catch(e){t=s}try{r="function"==typeof clearTimeout?clearTimeout:o}catch(e){r=o}}();var l=[],u=!1,c=-1;function h(){u&&i&&(u=!1,i.length?l=i.concat(l):c=-1,l.length&&f())}function f(){if(!u){var e=a(h);u=!0;for(var t=l.length;t;){for(i=l,l=[];++c<t;)i&&i[c].run();c=-1,t=l.length}i=null,u=!1,function(e){if(r===clearTimeout)return clearTimeout(e);if((r===o||!r)&&clearTimeout)return r=clearTimeout,clearTimeout(e);try{r(e)}catch(t){try{return r.call(null,e)}catch(t){return r.call(this,e)}}}(e)}}function d(e,t){this.fun=e,this.array=t}function p(){}n.nextTick=function(e){var t=Array(arguments.length-1);if(arguments.length>1)for(var r=1;r<arguments.length;r++)t[r-1]=arguments[r];l.push(new d(e,t)),1!==l.length||u||a(f)},d.prototype.run=function(){this.fun.apply(null,this.array)},n.title="browser",n.browser=!0,n.env={},n.argv=[],n.version="",n.versions={},n.on=p,n.addListener=p,n.once=p,n.off=p,n.removeListener=p,n.removeAllListeners=p,n.emit=p,n.prependListener=p,n.prependOnceListener=p,n.listeners=function(e){return[]},n.binding=function(e){throw Error("process.binding is not supported")},n.cwd=function(){return"/"},n.chdir=function(e){throw Error("process.chdir is not supported")},n.umask=function(){return 0}}},r={};function i(e){var n=r[e];if(void 0!==n)return n.exports;var s=r[e]={exports:{}},o=!0;try{t[e](s,s.exports,i),o=!1}finally{o&&delete r[e]}return s.exports}i.ab="//";var n=i(229);e.exports=n}()},24872:function(e,t,r){"use strict";var i=Object.defineProperty,n=Object.getOwnPropertyDescriptor,s=Object.getOwnPropertyNames,o=Object.prototype.hasOwnProperty,a={};((e,t)=>{for(var r in t)i(e,r,{get:t[r],enumerable:!0})})(a,{FetchError:()=>M,JSONLoader:()=>ts.JSONLoader,NullLoader:()=>tn,NullWorkerLoader:()=>ti,RequestScheduler:()=>te.RequestScheduler,_BrowserFileSystem:()=>tu,_fetchProgress:()=>to,_selectSource:()=>e7,_unregisterLoaders:()=>ea,assert:()=>th.assert,concatenateArrayBuffersAsync:()=>tf.concatenateArrayBuffersAsync,createDataSource:()=>e8,document:()=>tc.document,encode:()=>e0,encodeInBatches:()=>e4,encodeSync:()=>e1,encodeTable:()=>eY,encodeTableAsText:()=>eZ,encodeTableInBatches:()=>eK,encodeText:()=>e2,encodeTextSync:()=>e3,encodeURLtoURL:()=>e6,fetchFile:()=>k,forEach:()=>tf.forEach,getLoaderOptions:()=>Z,getPathPrefix:()=>e9.getPathPrefix,global:()=>tc.global,isAsyncIterable:()=>g,isBrowser:()=>tc.isBrowser,isIterable:()=>p,isIterator:()=>_,isPromise:()=>d,isPureObject:()=>f,isReadableStream:()=>R,isResponse:()=>m,isWorker:()=>tc.isWorker,isWritableStream:()=>S,load:()=>eW,loadInBatches:()=>eX,makeIterator:()=>eM,makeLineIterator:()=>td.makeLineIterator,makeNumberedLineIterator:()=>td.makeNumberedLineIterator,makeStream:()=>tt,makeTextDecoderIterator:()=>td.makeTextDecoderIterator,makeTextEncoderIterator:()=>td.makeTextEncoderIterator,parse:()=>eF,parseInBatches:()=>eG,parseSync:()=>eD,readArrayBuffer:()=>G,registerLoaders:()=>eo,resolvePath:()=>e9.resolvePath,selectLoader:()=>ec,selectLoaderSync:()=>eh,self:()=>tc.self,setLoaderOptions:()=>K,setPathPrefix:()=>e9.setPathPrefix,window:()=>tc.window}),e.exports=((e,t,r,a)=>{if(t&&"object"==typeof t||"function"==typeof t)for(let l of s(t))o.call(e,l)||l===r||i(e,l,{get:()=>t[l],enumerable:!(a=n(t,l))||a.enumerable});return e})(i({},"__esModule",{value:!0}),a);var l=r(2361),u=e=>"boolean"==typeof e,c=e=>"function"==typeof e,h=e=>null!==e&&"object"==typeof e,f=e=>h(e)&&e.constructor===({}).constructor,d=e=>h(e)&&c(e.then),p=e=>!!e&&"function"==typeof e[Symbol.iterator],g=e=>e&&"function"==typeof e[Symbol.asyncIterator],_=e=>e&&c(e.next),m=e=>"undefined"!=typeof Response&&e instanceof Response||e&&e.arrayBuffer&&e.text&&e.json,E=e=>"undefined"!=typeof Blob&&e instanceof Blob,v=e=>e&&"object"==typeof e&&e.isBuffer,b=e=>h(e)&&c(e.abort)&&c(e.getWriter),A=e=>"undefined"!=typeof ReadableStream&&e instanceof ReadableStream||h(e)&&c(e.tee)&&c(e.cancel)&&c(e.getReader),y=e=>h(e)&&c(e.end)&&c(e.write)&&u(e.writable),T=e=>h(e)&&c(e.read)&&c(e.pipe)&&u(e.readable),R=e=>A(e)||T(e),S=e=>b(e)||y(e),M=class extends Error{constructor(e,t){super(e),this.reason=t.reason,this.url=t.url,this.response=t.response}reason;url;response},I=/^data:([-\w.]+\/[-\w.+]+)(;|,)/,C=/^([-\w.]+\/[-\w.+]+)/;function x(e,t){return e.toLowerCase()===t.toLowerCase()}function w(e){let t=I.exec(e);return t?t[1]:""}var N=/\?.*/;function O(e){return e.replace(N,"")}function P(e){return m(e)?e.url:E(e)?e.name||"":"string"==typeof e?e:""}function L(e){if(m(e)){let t=e.headers.get("content-type")||"",r=O(e.url);return function(e){let t=C.exec(e);return t?t[1]:e}(t)||w(r)}return E(e)?e.type||"":"string"==typeof e?w(e):""}async function F(e){var t;if(m(e))return e;let r={},i=m(t=e)?t.headers["content-length"]||-1:E(t)?t.size:"string"==typeof t?t.length:t instanceof ArrayBuffer||ArrayBuffer.isView(t)?t.byteLength:-1;i>=0&&(r["content-length"]=String(i));let n=P(e),s=L(e);s&&(r["content-type"]=s);let o=await U(e);o&&(r["x-first-bytes"]=o),"string"==typeof e&&(e=new TextEncoder().encode(e));let a=new Response(e,{headers:r});return Object.defineProperty(a,"url",{value:n}),a}async function B(e){if(!e.ok)throw await D(e)}async function D(e){let t=function(e){if(e.length<50)return e;let t=e.slice(e.length-15),r=e.substr(0,32);return`${r}...${t}`}(e.url),r=`Failed to fetch resource (${e.status}) ${e.statusText}: ${t}`;r=r.length>100?`${r.slice(0,100)}...`:r;let i={reason:e.statusText,url:e.url,response:e};try{let t=e.headers.get("Content-Type");i.reason=!e.bodyUsed&&(null==t?void 0:t.includes("application/json"))?await e.json():await e.text()}catch(e){}return new M(r,i)}async function U(e){if("string"==typeof e)return`data:,${e.slice(0,5)}`;if(e instanceof Blob){let t=e.slice(0,5);return await new Promise(e=>{let r=new FileReader;r.onload=t=>{var r;return e(null==(r=null==t?void 0:t.target)?void 0:r.result)},r.readAsDataURL(t)})}if(e instanceof ArrayBuffer){let t=function(e){let t="",r=new Uint8Array(e);for(let e=0;e<r.byteLength;e++)t+=String.fromCharCode(r[e]);return btoa(t)}(e.slice(0,5));return`data:base64,${t}`}return null}async function k(e,t){var r,i;if("string"==typeof e){let n=(0,l.resolvePath)(e);return!(n.startsWith("http:")||n.startsWith("https:"))&&!n.startsWith("data:")&&(null==(r=globalThis.loaders)?void 0:r.fetchNode)?null==(i=globalThis.loaders)?void 0:i.fetchNode(n,t):await fetch(n,t)}return await F(e)}async function G(e,t,r){e instanceof Blob||(e=new Blob([e]));let i=e.slice(t,t+r);return await H(i)}async function H(e){return await new Promise((t,r)=>{let i=new FileReader;i.onload=e=>{var r;return t(null==(r=null==e?void 0:e.target)?void 0:r.result)},i.onerror=e=>r(e),i.readAsArrayBuffer(e)})}var V=r(2361),z=new(r(18613)).Log({id:"loaders.gl"}),j=class{log(){return()=>{}}info(){return()=>{}}warn(){return()=>{}}error(){return()=>{}}},W=class{console;constructor(){this.console=console}log(...e){return this.console.log.bind(this.console,...e)}info(...e){return this.console.info.bind(this.console,...e)}warn(...e){return this.console.warn.bind(this.console,...e)}error(...e){return this.console.error.bind(this.console,...e)}},X=r(2361),$={fetch:null,mimeType:void 0,nothrow:!1,log:new W,useLocalLibraries:!1,CDN:"https://unpkg.com/@loaders.gl",worker:!0,maxConcurrency:3,maxMobileConcurrency:1,reuseWorkers:X.isBrowser,_nodeWorkers:!1,_workerType:"",limit:0,_limitMB:0,batchSize:"auto",batchDebounceMs:0,metadata:!1,transforms:[]},q={throws:"nothrow",dataType:"(no longer used)",uri:"baseUri",method:"fetch.method",headers:"fetch.headers",body:"fetch.body",mode:"fetch.mode",credentials:"fetch.credentials",cache:"fetch.cache",redirect:"fetch.redirect",referrer:"fetch.referrer",referrerPolicy:"fetch.referrerPolicy",integrity:"fetch.integrity",keepalive:"fetch.keepalive",signal:"fetch.signal"};function Y(){globalThis.loaders=globalThis.loaders||{};let{loaders:e}=globalThis;return e._state||(e._state={}),e._state}function Z(){let e=Y();return e.globalOptions=e.globalOptions||{...$},e.globalOptions}function K(e){let t=Y(),r=Z();t.globalOptions=ee(r,e),(0,V.registerJSModules)(e.modules)}function Q(e,t,r,i){return function(e,t){for(let r of(J(e,null,$,q,t),t)){let i=e&&e[r.id]||{},n=r.options&&r.options[r.id]||{},s=r.deprecatedOptions&&r.deprecatedOptions[r.id]||{};J(i,r.id,n,s,t)}}(e,r=Array.isArray(r=r||[])?r:[r]),ee(t,e,i)}function J(e,t,r,i,n){let s=t||"Top level",o=t?`${t}.`:"";for(let a in e){let l=!t&&h(e[a]),u="baseUri"===a&&!t,c="workerUrl"===a&&t;if(!(a in r)&&!u&&!c){if(a in i)z.warn(`${s} loader option '${o}${a}' no longer supported, use '${i[a]}'`)();else if(!l){let e=function(e,t){let r=e.toLowerCase(),i="";for(let n of t)for(let t in n.options){if(e===t)return`Did you mean '${n.id}.${t}'?`;let s=t.toLowerCase();(r.startsWith(s)||s.startsWith(r))&&(i=i||`Did you mean '${n.id}.${t}'?`)}return i}(a,n);z.warn(`${s} loader option '${o}${a}' not recognized. ${e}`)()}}}}function ee(e,t,r){let i={...e.options||{}};return!r||"baseUri"in i||(i.baseUri=r),null===i.log&&(i.log=new j),et(i,Z()),et(i,t),i}function et(e,t){for(let r in t)r in t&&(f(t[r])&&f(e[r])?e[r]={...e[r],...t[r]}:e[r]=t[r])}var er=r(2361);function ei(e){return!!e&&(Array.isArray(e)&&(e=e[0]),Array.isArray(null==e?void 0:e.extensions))}function en(e){let t;return(0,er.assert)(e,"null loader"),(0,er.assert)(ei(e),"invalid loader"),Array.isArray(e)&&(t=e[1],e={...e=e[0],options:{...e.options,...t}}),((null==e?void 0:e.parseTextSync)||(null==e?void 0:e.parseText))&&(e.text=!0),e.text||(e.binary=!0),e}var es=()=>{let e=Y();return e.loaderRegistry=e.loaderRegistry||[],e.loaderRegistry};function eo(e){let t=es();for(let r of e=Array.isArray(e)?e:[e]){let e=en(r);t.find(t=>e===t)||t.unshift(e)}}function ea(){Y().loaderRegistry=[]}var el=r(2361),eu=/\.([^.]+)$/;async function ec(e,t=[],r,i){if(!ef(e))return null;let n=eh(e,t,{...r,nothrow:!0},i);if(n)return n;if(E(e)&&(n=eh(e=await e.slice(0,10).arrayBuffer(),t,r,i)),!n&&!(null==r?void 0:r.nothrow))throw Error(ed(e));return n}function eh(e,t=[],r,i){if(!ef(e))return null;if(t&&!Array.isArray(t))return en(t);let n=[];t&&(n=n.concat(t)),(null==r?void 0:r.ignoreRegisteredLoaders)||n.push(...es()),function(e){for(let t of e)en(t)}(n);let s=function(e,t,r,i){let n=P(e),s=L(e),o=O(n)||(null==i?void 0:i.url),a=null,l="";return(null==r?void 0:r.mimeType)&&(a=ep(t,null==r?void 0:r.mimeType),l=`match forced by supplied MIME type ${null==r?void 0:r.mimeType}`),a=a||function(e,t){let r=t&&eu.exec(t),i=r&&r[1];return i?function(e,t){for(let r of(t=t.toLowerCase(),e))for(let e of r.extensions)if(e.toLowerCase()===t)return r;return null}(e,i):null}(t,o),l=l||(a?`matched url ${o}`:""),a=a||ep(t,s),l=l||(a?`matched MIME type ${s}`:""),a=a||function(e,t){if(!t)return null;for(let r of e)if("string"==typeof t){if(function(e,t){return t.testText?t.testText(e):(Array.isArray(t.tests)?t.tests:[t.tests]).some(t=>e.startsWith(t))}(t,r))return r}else if(ArrayBuffer.isView(t)){if(eg(t.buffer,t.byteOffset,r))return r}else if(t instanceof ArrayBuffer&&eg(t,0,r))return r;return null}(t,e),l=l||(a?`matched initial data ${e_(e)}`:""),(null==r?void 0:r.fallbackMimeType)&&(a=a||ep(t,null==r?void 0:r.fallbackMimeType),l=l||(a?`matched fallback MIME type ${s}`:"")),l&&el.log.log(1,`selectLoader selected ${null==a?void 0:a.name}: ${l}.`),a}(e,n,r,i);if(!s&&!(null==r?void 0:r.nothrow))throw Error(ed(e));return s}function ef(e){return!(e instanceof Response)||204!==e.status}function ed(e){let t=P(e),r=L(e),i="No valid loader found (";i+=(t?`${el.path.filename(t)}, `:"no url provided, ")+`MIME type: ${r?`"${r}"`:"not provided"}, `;let n=e?e_(e):"";return i+(n?` first bytes: "${n}"`:"first bytes: not available")+")"}function ep(e,t){var r;for(let i of e)if((null==(r=i.mimeTypes)?void 0:r.some(e=>x(t,e)))||x(t,`application/x.${i.id}`))return i;return null}function eg(e,t,r){return(Array.isArray(r.tests)?r.tests:[r.tests]).some(r=>(function(e,t,r,i){if(i instanceof ArrayBuffer)return(0,el.compareArrayBuffers)(i,e,i.byteLength);switch(typeof i){case"function":return i(e);case"string":let n=em(e,t,i.length);return i===n;default:return!1}})(e,t,0,r))}function e_(e,t=5){return"string"==typeof e?e.slice(0,t):ArrayBuffer.isView(e)?em(e.buffer,e.byteOffset,t):e instanceof ArrayBuffer?em(e,0,t):""}function em(e,t,r){if(e.byteLength<t+r)return"";let i=new DataView(e),n="";for(let e=0;e<r;e++)n+=String.fromCharCode(i.getUint8(t+e));return n}var eE=r(2361),ev=r(34427),eb=r(2361);async function*eA(e,t){let r=(null==t?void 0:t.chunkSize)||1048576,i=0;for(;i<e.size;){let t=i+r,n=await e.slice(i,t).arrayBuffer();i=t,yield n}}var ey=r(2361);function eT(e,t){return ey.isBrowser?eR(e,t):eS(e,t)}async function*eR(e,t){let r;let i=e.getReader();try{for(;;){let e=r||i.read();(null==t?void 0:t._streamReadAhead)&&(r=i.read());let{done:n,value:s}=await e;if(n)return;yield(0,ey.toArrayBuffer)(s)}}catch(e){i.releaseLock()}}async function*eS(e,t){for await(let t of e)yield(0,ey.toArrayBuffer)(t)}function eM(e,t){if("string"==typeof e)return function*(e,t){let r=(null==t?void 0:t.chunkSize)||262144,i=0,n=new TextEncoder;for(;i<e.length;){let t=Math.min(e.length-i,r),s=e.slice(i,i+t);i+=t,yield n.encode(s)}}(e,t);if(e instanceof ArrayBuffer)return function*(e,t={}){let{chunkSize:r=262144}=t,i=0;for(;i<e.byteLength;){let t=Math.min(e.byteLength-i,r),n=new ArrayBuffer(t),s=new Uint8Array(e,i,t);new Uint8Array(n).set(s),i+=t,yield n}}(e,t);if(E(e))return eA(e,t);if(R(e))return eT(e,t);if(m(e))return eT(e.body,t);throw Error("makeIterator")}var eI="Cannot convert supplied data type";function eC(e,t,r){if(t.text&&"string"==typeof e)return e;if(v(e)&&(e=e.buffer),e instanceof ArrayBuffer){let r=e;return t.text&&!t.binary?new TextDecoder("utf8").decode(r):r}if(ArrayBuffer.isView(e)){if(t.text&&!t.binary)return new TextDecoder("utf8").decode(e);let r=e.buffer,i=e.byteLength||e.length;return(0!==e.byteOffset||i!==r.byteLength)&&(r=r.slice(e.byteOffset,e.byteOffset+i)),r}throw Error(eI)}async function ex(e,t,r){let i=e instanceof ArrayBuffer||ArrayBuffer.isView(e);if("string"==typeof e||i)return eC(e,t,r);if(E(e)&&(e=await F(e)),m(e)){let r=e;return await B(r),t.binary?await r.arrayBuffer():await r.text()}if(R(e)&&(e=eM(e,r)),p(e)||g(e))return(0,eb.concatenateArrayBuffersAsync)(e);throw Error(eI)}async function ew(e,t){return _(e)?e:m(e)?(await B(e),eM(await e.body,t)):E(e)||R(e)?eM(e,t):g(e)?e:function(e){if(ArrayBuffer.isView(e))return function*(){yield e.buffer}();if(e instanceof ArrayBuffer)return function*(){yield e}();if(_(e))return e;if(p(e))return e[Symbol.iterator]();throw Error(eI)}(e)}function eN(e,t){let r=Z(),i=e||r;return"function"==typeof i.fetch?i.fetch:h(i.fetch)?e=>k(e,i.fetch):(null==t?void 0:t.fetch)?null==t?void 0:t.fetch:k}var eO=r(2361);function eP(e,t,r){if(r)return r;let i={fetch:eN(t,e),...e};if(i.url){let e=O(i.url);i.baseUrl=e,i.queryString=function(e){let t=e.match(N);return t&&t[0]}(i.url),i.filename=eO.path.filename(e),i.baseUrl=eO.path.dirname(e)}return Array.isArray(i.loaders)||(i.loaders=null),i}function eL(e,t){let r;if(e&&!Array.isArray(e))return e;if(e&&(r=Array.isArray(e)?e:[e]),t&&t.loaders){let e=Array.isArray(t.loaders)?t.loaders:[t.loaders];r=r?[...r,...e]:e}return r&&r.length?r:void 0}async function eF(e,t,r,i){!t||Array.isArray(t)||ei(t)||(i=void 0,r=t,t=void 0),e=await e,r=r||{};let n=P(e),s=eL(t,i),o=await ec(e,s,r);return o?(r=Q(r,o,s,n),i=eP({url:n,_parse:eF,loaders:s},r,i||null),await eB(o,e,r,i)):null}async function eB(e,t,r,i){if((0,ev.validateWorkerVersion)(e),r=(0,eE.mergeLoaderOptions)(e.options,r),m(t)){let e=t,{ok:r,redirected:n,status:s,statusText:o,type:a,url:l}=e,u=Object.fromEntries(e.headers.entries());i.response={headers:u,ok:r,redirected:n,status:s,statusText:o,type:a,url:l}}if(t=await ex(t,e,r),e.parseTextSync&&"string"==typeof t)return e.parseTextSync(t,r,i);if((0,eE.canParseWithWorker)(e,r))return await (0,eE.parseWithWorker)(e,t,r,i,eF);if(e.parseText&&"string"==typeof t)return await e.parseText(t,r,i);if(e.parse)return await e.parse(t,r,i);throw(0,ev.assert)(!e.parseSync),Error(`${e.id} loader - no parser found and worker is disabled`)}function eD(e,t,r,i){Array.isArray(t)||ei(t)||(i=void 0,r=t,t=void 0),r=r||{};let n=eL(t,i),s=eh(e,n,r);if(!s)return null;r=Q(r,s,n);let o=P(e),a=()=>{throw Error("parseSync called parse (which is async")};return i=eP({url:o,_parseSync:a,_parse:a,loaders:t},r,i||null),function(e,t,r,i){if(t=eC(t,e,r),e.parseTextSync&&"string"==typeof t)return e.parseTextSync(t,r);if(e.parseSync&&t instanceof ArrayBuffer)return e.parseSync(t,r,i);throw Error(`${e.name} loader: 'parseSync' not supported by this loader, use 'parse' instead. ${i.url||""}`)}(s,e,r,i)}var eU=r(93989),ek=r(2361);async function eG(e,t,r,i){let n=Array.isArray(t)?t:void 0;Array.isArray(t)||ei(t)||(i=void 0,r=t,t=void 0),e=await e,r=r||{};let s=P(e),o=await ec(e,t,r);return o?(r=Q(r,o,n,s),i=eP({url:s,_parseInBatches:eG,_parse:eF,loaders:n},r,i||null),await eH(o,e,r,i)):[]}async function eH(e,t,r,i){let n=await eV(e,t,r,i);if(!r.metadata)return n;let s={shape:"metadata",batchType:"metadata",metadata:{_loader:e,_context:i},data:[],bytesUsed:0};return async function*(e){yield s,yield*e}(n)}async function eV(e,t,r,i){let n=await ew(t,r),s=await ej(n,(null==r?void 0:r.transforms)||[]);return e.parseInBatches?e.parseInBatches(s,r,i):ez(s,e,r,i)}async function*ez(e,t,r,i){let n=await (0,ek.concatenateArrayBuffersAsync)(e),s=function(e,t){let r=(0,eU.isTable)(e)?(0,eU.makeBatchFromTable)(e):{shape:"unknown",batchType:"data",data:e,length:Array.isArray(e)?e.length:1};return r.mimeType=t.mimeTypes[0],r}(await eF(n,t,{...r,mimeType:t.mimeTypes[0]},i),t);yield s}async function ej(e,t=[]){let r=e;for await(let e of t)r=e(r);return r}async function eW(e,t,r,i){let n,s;Array.isArray(t)||ei(t)?(n=t,s=r):(n=[],s=t);let o=eN(s),a=e;return"string"==typeof e&&(a=await o(e)),E(e)&&(a=await o(e)),Array.isArray(n),await eF(a,n,s)}function eX(e,t,r,i){let n;Array.isArray(t)||ei(t)?n=t:(r=t,n=void 0);let s=eN(r||{});return Array.isArray(e)?e.map(e=>e$(e,n,r||{},s)):e$(e,n,r||{},s)}async function e$(e,t,r,i){if("string"==typeof e){let n=await i(e);return Array.isArray(t),await eG(n,t,r)}return Array.isArray(t),await eG(e,t,r)}var eq=r(2361);async function eY(e,t,r){if(t.encode)return await t.encode(e,r);if(t.encodeText){let i=await t.encodeText(e,r);return new TextEncoder().encode(i)}if(t.encodeInBatches){let i=eK(e,t,r),n=[];for await(let e of i)n.push(e);return(0,eq.concatenateArrayBuffers)(...n)}throw Error("Writer could not encode data")}async function eZ(e,t,r){if(t.text&&t.encodeText)return await t.encodeText(e,r);if(t.text){let i=await eY(e,t,r);return new TextDecoder().decode(i)}throw Error(`Writer ${t.name} could not encode data as text`)}function eK(e,t,r){if(t.encodeInBatches){let i=[{...e,start:0,end:e.length}];return t.encodeInBatches(i,r)}throw Error("Writer could not encode data in batches")}var eQ=r(2361),eJ=r(34427);async function e0(e,t,r){let i={...Z(),...r};return t.encodeURLtoURL?e5(t,e,i):(0,eQ.canEncodeWithWorker)(t,i)?await (0,eJ.processOnWorker)(t,e,i):await t.encode(e,i)}function e1(e,t,r){if(t.encodeSync)return t.encodeSync(e,r);if(t.encodeTextSync)return new TextEncoder().encode(t.encodeTextSync(e,r));throw Error(`Writer ${t.name} could not synchronously encode data`)}async function e2(e,t,r){if(t.encodeText)return await t.encodeText(e,r);if(t.encodeTextSync)return t.encodeTextSync(e,r);if(t.text){let i=await t.encode(e,r);return new TextDecoder().decode(i)}throw Error(`Writer ${t.name} could not encode data as text`)}function e3(e,t,r){if(t.encodeTextSync)return t.encodeTextSync(e,r);if(t.text&&t.encodeSync){let i=e1(e,t,r);return new TextDecoder().decode(i)}throw Error(`Writer ${t.name} could not encode data as text`)}function e4(e,t,r){if(t.encodeInBatches){let i=[{...e,start:0,end:e.length}];return t.encodeInBatches(i,r)}throw Error(`Writer ${t.name} could not encode in batches`)}async function e6(e,t,r,i){if(e=(0,eQ.resolvePath)(e),t=(0,eQ.resolvePath)(t),eQ.isBrowser||!r.encodeURLtoURL)throw Error();return await r.encodeURLtoURL(e,t,i)}async function e5(e,t,r){if(eQ.isBrowser)throw Error(`Writer ${e.name} not supported in browser`);let i="/tmp/input",n=new eQ.NodeFile(i,"w");await n.write(t);let s=await e6(i,"/tmp/output",e,r);return(await k(s)).arrayBuffer()}function e8(e,t,r){let{type:i="auto"}=r,n="auto"===i?function(e,t){for(let r of t)if(r.testURL&&r.testURL(e))return r;return null}(e,t):function(e,t){for(let r of t)if(r.type===e)return r;return null}(i,t);if(!n)throw Error("Not a valid image source type");return n.createDataSource(e,r)}function e7(e,t,r){let i=(null==r?void 0:r.type)||"auto",n=null;if("auto"===i){for(let r of t)if("string"==typeof e&&r.testURL&&r.testURL(e))return r}else n=function(e,t){for(let r of t)if(r.type===e)return r;return null}(i,t);if(!n&&!(null==r?void 0:r.nothrow))throw Error("Not a valid image source type");return n}var e9=r(2361),te=r(2361);function tt(e,t){if(globalThis.loaders.makeNodeStream)return globalThis.loaders.makeNodeStream(e,t);let r=e[Symbol.asyncIterator]?e[Symbol.asyncIterator]():e[Symbol.iterator]();return new ReadableStream({type:"bytes",async pull(e){try{let{done:t,value:i}=await r.next();t?e.close():e.enqueue(new Uint8Array(i))}catch(t){e.error(t)}},async cancel(){var e;await (null==(e=null==r?void 0:r.return)?void 0:e.call(r))}},{highWaterMark:16777216,...t})}var tr="4.3.3",ti={dataType:null,batchType:null,name:"Null loader",id:"null",module:"core",version:tr,worker:!0,mimeTypes:["application/x.empty"],extensions:["null"],tests:[()=>!1],options:{null:{}}},tn={dataType:null,batchType:null,name:"Null loader",id:"null",module:"core",version:tr,mimeTypes:["application/x.empty"],extensions:["null"],parse:async(e,t,r)=>null,parseSync:function(e,t,r){return null},parseInBatches:async function*(e,t,r){for await(let t of e)yield null},tests:[()=>!1],options:{null:{}}},ts=r(2361);async function to(e,t,r=()=>{},i=()=>{}){if(!(e=await e).ok)return e;let n=e.body;if(!n)return e;let s=e.headers.get("content-length")||0,o=s?parseInt(s):0;return o>0&&"undefined"!=typeof ReadableStream&&n.getReader?new Response(new ReadableStream({async start(e){let s=n.getReader();await ta(e,s,0,o,t,r,i)}})):e}async function ta(e,t,r,i,n,s,o){try{let{done:a,value:l}=await t.read();if(a){s(),e.close();return}r+=l.byteLength;let u=Math.round(r/i*100);n(u,{loadedBytes:r,totalBytes:i}),e.enqueue(l),await ta(e,t,r,i,n,s,o)}catch(t){e.error(t),o(t)}}var tl=r(2361),tu=class{_fetch;files={};lowerCaseFiles={};usedFiles={};constructor(e,t){this._fetch=(null==t?void 0:t.fetch)||fetch;for(let t=0;t<e.length;++t){let r=e[t];this.files[r.name]=r,this.lowerCaseFiles[r.name.toLowerCase()]=r,this.usedFiles[r.name]=!1}this.fetch=this.fetch.bind(this)}async fetch(e,t){if(e.includes("://"))return this._fetch(e,t);let r=this.files[e];if(!r)return new Response(e,{status:400,statusText:"NOT FOUND"});let i=new Headers(null==t?void 0:t.headers).get("Range"),n=i&&/bytes=($1)-($2)/.exec(i);if(n){let t=parseInt(n[1]),i=parseInt(n[2]),s=new Response(await r.slice(t,i).arrayBuffer());return Object.defineProperty(s,"url",{value:e}),s}let s=new Response(r);return Object.defineProperty(s,"url",{value:e}),s}async readdir(e){let t=[];for(let e in this.files)t.push(e);return t}async stat(e,t){let r=this.files[e];if(!r)throw Error(e);return{size:r.size}}async unlink(e){delete this.files[e],delete this.lowerCaseFiles[e],this.usedFiles[e]=!0}async openReadableFile(e,t){return new tl.BlobFile(this.files[e])}_getFile(e,t){let r=this.files[e]||this.lowerCaseFiles[e];return r&&t&&(this.usedFiles[e]=!0),r}},tc=r(2361),th=r(2361),tf=r(2361),td=r(2361)},38630:function(e,t,r){"use strict";var i,n,s=Object.defineProperty,o=Object.getOwnPropertyDescriptor,a=Object.getOwnPropertyNames,l=Object.prototype.hasOwnProperty,u={};((e,t)=>{for(var r in t)s(e,r,{get:t[r],enumerable:!0})})(u,{ImageLoader:()=>U,ImageWriter:()=>V,getBinaryImageMetadata:()=>F,getDefaultImageType:()=>E,getImageData:()=>y,getImageSize:()=>A,getImageType:()=>b,getSupportedImageFormats:()=>W,isImage:()=>v,isImageFormatSupported:()=>$,isImageTypeSupported:()=>m,loadImage:()=>Q}),e.exports=((e,t,r,i)=>{if(t&&"object"==typeof t||"function"==typeof t)for(let n of a(t))l.call(e,n)||n===r||s(e,n,{get:()=>t[n],enumerable:!(i=o(t,n))||i.enumerable});return e})(s({},"__esModule",{value:!0}),u);var c="4.3.3",h=r(2361),f=r(2361),d=null==(i=globalThis.loaders)?void 0:i.parseImageNode,p="undefined"!=typeof Image,g="undefined"!=typeof ImageBitmap,_=!!f.isBrowser||!!d;function m(e){switch(e){case"auto":return g||p||_;case"imagebitmap":return g;case"image":return p;case"data":return _;default:throw Error(`@loaders.gl/images: image ${e} not supported in this environment`)}}function E(){if(g)return"imagebitmap";if(p)return"image";if(_)return"data";throw Error("Install '@loaders.gl/polyfills' to parse images under Node.js")}function v(e){return!!T(e)}function b(e){let t=T(e);if(!t)throw Error("Not an image");return t}function A(e){return y(e)}function y(e){switch(b(e)){case"data":return e;case"image":case"imagebitmap":let t=document.createElement("canvas"),r=t.getContext("2d");if(!r)throw Error("getImageData");return t.width=e.width,t.height=e.height,r.drawImage(e,0,0),r.getImageData(0,0,e.width,e.height);default:throw Error("getImageData")}}function T(e){return"undefined"!=typeof ImageBitmap&&e instanceof ImageBitmap?"imagebitmap":"undefined"!=typeof Image&&e instanceof Image?"image":e&&"object"==typeof e&&e.data&&e.width&&e.height?"data":null}var R=/^data:image\/svg\+xml/,S=/\.svg((\?|#).*)?$/;function M(e){return e&&(R.test(e)||S.test(e))}function I(e,t){if(M(t))throw Error("SVG cannot be parsed directly to imagebitmap");return new Blob([new Uint8Array(e)])}async function C(e,t,r){let i=function(e,t){if(M(t)){let t=new TextDecoder().decode(e);try{"function"==typeof unescape&&"function"==typeof encodeURIComponent&&(t=unescape(encodeURIComponent(t)))}catch(e){throw Error(e.message)}return`data:image/svg+xml;base64,${btoa(t)}`}return I(e,t)}(e,r),n=self.URL||self.webkitURL,s="string"!=typeof i&&n.createObjectURL(i);try{return await x(s||i,t)}finally{s&&n.revokeObjectURL(s)}}async function x(e,t){let r=new Image;return(r.src=e,t.image&&t.image.decode&&r.decode)?(await r.decode(),r):await new Promise((e,t)=>{try{r.onload=()=>e(r),r.onerror=e=>{let r=e instanceof Error?e.message:"error";t(Error(r))}}catch(e){t(e)}})}var w={},N=!0;async function O(e,t,r){let i;i=M(r)?await C(e,t,r):I(e,r);let n=t&&t.imagebitmap;return await P(i,n)}async function P(e,t=null){if((function(e){for(let t in e||w)return!1;return!0}(t)||!N)&&(t=null),t)try{return await createImageBitmap(e,t)}catch(e){console.warn(e),N=!1}return await createImageBitmap(e)}var L=r(2361);function F(e){let t=B(e);return function(e){let t=B(e);return t.byteLength>=24&&2303741511===t.getUint32(0,!1)?{mimeType:"image/png",width:t.getUint32(16,!1),height:t.getUint32(20,!1)}:null}(t)||function(e){let t=B(e);if(!(t.byteLength>=3&&65496===t.getUint16(0,!1)&&255===t.getUint8(2)))return null;let{tableMarkers:r,sofMarkers:i}=function(){let e=new Set([65499,65476,65484,65501,65534]);for(let t=65504;t<65520;++t)e.add(t);return{tableMarkers:e,sofMarkers:new Set([65472,65473,65474,65475,65477,65478,65479,65481,65482,65483,65485,65486,65487,65502])}}(),n=2;for(;n+9<t.byteLength;){let e=t.getUint16(n,!1);if(i.has(e))return{mimeType:"image/jpeg",height:t.getUint16(n+5,!1),width:t.getUint16(n+7,!1)};if(!r.has(e))break;n+=2,n+=t.getUint16(n,!1)}return null}(t)||function(e){let t=B(e);return t.byteLength>=10&&1195984440===t.getUint32(0,!1)?{mimeType:"image/gif",width:t.getUint16(6,!0),height:t.getUint16(8,!0)}:null}(t)||function(e){let t=B(e);return t.byteLength>=14&&16973===t.getUint16(0,!1)&&t.getUint32(2,!0)===t.byteLength?{mimeType:"image/bmp",width:t.getUint32(18,!0),height:t.getUint32(22,!0)}:null}(t)||function(e){var t;let r=!function(e,t,r=0){let i=[...t].map(e=>e.charCodeAt(0));for(let t=0;t<i.length;++t)if(i[t]!==e[t+r])return!1;return!0}(t=new Uint8Array(e instanceof DataView?e.buffer:e),"ftyp",4)||(96&t[8])==0?null:function(e){switch(String.fromCharCode(...e.slice(8,12)).replace("\0"," ").trim()){case"avif":case"avis":return{extension:"avif",mimeType:"image/avif"};default:return null}}(t);return r?{mimeType:r.mimeType,width:0,height:0}:null}(t)}function B(e){if(e instanceof DataView)return e;if(ArrayBuffer.isView(e))return new DataView(e.buffer);if(e instanceof ArrayBuffer)return new DataView(e);throw Error("toDataView")}async function D(e,t){var r;let{mimeType:i}=F(e)||{},n=null==(r=globalThis.loaders)?void 0:r.parseImageNode;return(0,L.assert)(n),await n(e,i)}var U={dataType:null,batchType:null,id:"image",module:"images",name:"Images",version:c,mimeTypes:["image/png","image/jpeg","image/gif","image/webp","image/avif","image/bmp","image/vnd.microsoft.icon","image/svg+xml"],extensions:["png","jpg","jpeg","gif","webp","bmp","ico","svg","avif"],parse:async function(e,t,r){let i;let n=((t=t||{}).image||{}).type||"auto",{url:s}=r||{};switch(function(e){switch(e){case"auto":case"data":return E();default:return m(e),e}}(n)){case"imagebitmap":i=await O(e,t,s);break;case"image":i=await C(e,t,s);break;case"data":i=await D(e,t);break;default:(0,h.assert)(!1)}return"data"===n&&(i=y(i)),i},tests:[e=>!!F(new DataView(e))],options:{image:{type:"auto",decode:!0}}},k=null==(n=globalThis.loaders)?void 0:n.encodeImageNode,G=!0;async function H(e,t){let{mimeType:r,jpegQuality:i}=t.image,{width:n,height:s}=y(e),o=document.createElement("canvas");o.width=n,o.height=s,function(e,t,r=0,i=0){if(0===r&&0===i&&"undefined"!=typeof ImageBitmap&&e instanceof ImageBitmap){let r=t.getContext("bitmaprenderer");if(r)return r.transferFromImageBitmap(e)}let n=t.getContext("2d");if(e.data){let t=new ImageData(new Uint8ClampedArray(e.data),e.width,e.height);return n.putImageData(t,0,0)}n.drawImage(e,0,0)}(e,o);let a=await new Promise(e=>{if(i&&G)try{o.toBlob(e,r,i);return}catch(e){G=!1}o.toBlob(e,r)});if(!a)throw Error("image encoding failed");return await a.arrayBuffer()}var V={name:"Images",id:"image",module:"images",version:c,extensions:["jpeg"],options:{image:{mimeType:"image/png",jpegQuality:null}},encode:async function(e,t){return(t=t||{}).image=t.image||{},k?k(e,{type:t.image.mimeType}):H(e,t)}},z=r(2361),j=["image/png","image/jpeg","image/gif","image/webp","image/avif","image/tiff","image/svg","image/svg+xml","image/bmp","image/vnd.microsoft.icon"];async function W(){let e=new Set;for(let t of j)(z.isBrowser?await Z(t):q(t))&&e.add(t);return e}var X={};function $(e){if(void 0===X[e]){let t=z.isBrowser?function(e){switch(e){case"image/avif":case"image/webp":return function(e){try{let t=document.createElement("canvas").toDataURL(e);return 0===t.indexOf(`data:${e}`)}catch{return!1}}(e);default:return!0}}(e):q(e);X[e]=t}return X[e]}function q(e){var t,r;let i=(null==(t=globalThis.loaders)?void 0:t.imageFormatsNode)||["image/png","image/jpeg","image/gif"];return!!(null==(r=globalThis.loaders)?void 0:r.parseImageNode)&&i.includes(e)}var Y={"image/avif":"data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=","image/webp":"data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA"};async function Z(e){let t=Y[e];return!t||await K(t)}async function K(e){return new Promise(t=>{let r=new Image;r.src=e,r.onload=()=>t(r.height>0),r.onerror=()=>t(!1)})}function Q(){throw Error("loadImage has moved to @loaders.gl/textures")}},2361:function(e,t,r){"use strict";var i=r(40257),n=Object.defineProperty,s=Object.getOwnPropertyDescriptor,o=Object.getOwnPropertyNames,a=Object.prototype.hasOwnProperty,l=(e,t,r)=>t in e?n(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,u=(e,t)=>{for(var r in t)n(e,r,{get:t[r],enumerable:!0})},c=(e,t,r)=>(l(e,"symbol"!=typeof t?t+"":t,r),r),h={};async function f(e,t,r,i){return i._parse(e,t,r,i)}function d(e,t,r,i){if(!i._parseSync)throw Error("parseSync");return i._parseSync(e,t,r,i)}async function p(e,t,r,i){if(!i._parseInBatches)throw Error("parseInBatches");return i._parseInBatches(e,t,r,i)}function g(e,t){if(!e)throw Error(t||"loader assertion failed.")}u(h,{BlobFile:()=>eU,DataSource:()=>eY,DataViewFile:()=>eq,FileHandleFile:()=>eX,FileProvider:()=>eW,HttpFile:()=>ek,ImageSource:()=>eZ,JSONLoader:()=>ey,NodeFile:()=>eH,NodeFilesystem:()=>ez,RequestScheduler:()=>eg,VectorSource:()=>eK,_addAliases:()=>eb,assert:()=>g,canEncodeWithWorker:()=>j,canParseWithWorker:()=>G,checkJSModule:()=>N,compareArrayBuffers:()=>q,concatenateArrayBuffers:()=>Y,concatenateArrayBuffersAsync:()=>ef,concatenateArrayBuffersFromArray:()=>Z,concatenateTypedArrays:()=>K,copyArrayBuffer:()=>ee,copyBinaryToDataView:()=>en,copyPaddedArrayBufferToDataView:()=>es,copyPaddedStringToDataView:()=>eo,copyStringToDataView:()=>ei,copyToArray:()=>et,createLoaderWorker:()=>B,document:()=>b,forEach:()=>eh,getFirstCharacters:()=>W,getJSModule:()=>O,getJSModuleOrNull:()=>P,getMagicString:()=>X,getPathPrefix:()=>ev,global:()=>v,isBrowser:()=>A,isBuffer:()=>eS,isFileProvider:()=>ej,isWorker:()=>y,log:()=>C,makeLineIterator:()=>eu,makeNumberedLineIterator:()=>ec,makeTextDecoderIterator:()=>ea,makeTextEncoderIterator:()=>el,mergeLoaderOptions:()=>x,nodeVersion:()=>R,padStringToByteAlignment:()=>er,padToNBytes:()=>J,parseFromContext:()=>f,parseInBatchesFromContext:()=>p,parseJSON:()=>$,parseSyncFromContext:()=>d,parseWithWorker:()=>H,path:()=>ew,promisify1:()=>eC,promisify2:()=>ex,registerJSModules:()=>w,resolvePath:()=>eA,self:()=>m,setPathPrefix:()=>eE,sliceArrayBuffer:()=>Q,stream:()=>eB,toArrayBuffer:()=>eI,toBuffer:()=>eM,window:()=>E}),e.exports=((e,t,r,i)=>{if(t&&"object"==typeof t||"function"==typeof t)for(let l of o(t))a.call(e,l)||l===r||n(e,l,{get:()=>t[l],enumerable:!(i=s(t,l))||i.enumerable});return e})(n({},"__esModule",{value:!0}),h);var _={self:"undefined"!=typeof self&&self,window:"undefined"!=typeof window&&window,global:void 0!==r.g&&r.g,document:"undefined"!=typeof document&&document},m=_.self||_.window||_.global||{},E=_.window||_.self||_.global||{},v=_.global||_.self||_.window||{},b=_.document||{},A=("object"!=typeof i||String(i),!0),y="function"==typeof importScripts,T=void 0!==i&&i.version&&/v([0-9]*)/.exec(i.version),R=T&&parseFloat(T[1])||0,S=r(18613),M="4.3.3",I=M[0]>="0"&&M[0]<="9"?`v${M}`:"",C=function(){let e=new S.Log({id:"loaders.gl"});return globalThis.loaders=globalThis.loaders||{},globalThis.loaders.log=e,globalThis.loaders.version=I,globalThis.probe=globalThis.probe||{},globalThis.probe.loaders=e,e}();function x(e,t){return function e(t,r,i=0){if(i>3)return r;let n={...t};for(let[t,s]of Object.entries(r))s&&"object"==typeof s&&!Array.isArray(s)?n[t]=e(n[t]||{},r[t],i+1):n[t]=r[t];return n}(e||{},t)}function w(e){globalThis.loaders||={},globalThis.loaders.modules||={},Object.assign(globalThis.loaders.modules,e)}function N(e,t){var r,i;(null==(i=null==(r=globalThis.loaders)?void 0:r.modules)?void 0:i[e])||C.warn(`${t}: ${e} library not installed`)()}function O(e,t){var r,i;let n=null==(i=null==(r=globalThis.loaders)?void 0:r.modules)?void 0:i[e];if(!n)throw Error(`${t}: ${e} library not installed`);return n}function P(e){var t,r;return(null==(r=null==(t=globalThis.loaders)?void 0:t.modules)?void 0:r[e])||null}var L=r(34427),F=0;async function B(e){await L.WorkerBody.inWorkerThread()&&(L.WorkerBody.onmessage=async(t,r)=>{if("process"===t)try{let{input:t,options:i={},context:n={}}=r,s=await U({loader:e,arrayBuffer:t,options:i,context:{...n,_parse:D}});L.WorkerBody.postMessage("done",{result:s})}catch(t){let e=t instanceof Error?t.message:"";L.WorkerBody.postMessage("error",{error:e})}})}function D(e,t,r,i){return new Promise((t,i)=>{let n=F++,s=(e,r)=>{if(r.id===n)switch(e){case"done":L.WorkerBody.removeEventListener(s),t(r.result);break;case"error":L.WorkerBody.removeEventListener(s),i(r.error)}};L.WorkerBody.addEventListener(s),L.WorkerBody.postMessage("process",{id:n,input:e,options:r})})}async function U({loader:e,arrayBuffer:t,options:r,context:i}){let n,s;if(e.parseSync||e.parse)n=t,s=e.parseSync||e.parse;else if(e.parseTextSync)n=new TextDecoder().decode(t),s=e.parseTextSync;else throw Error(`Could not load data with ${e.name} loader`);return r={...r,modules:e&&e.options&&e.options.modules||{},worker:!1},await s(n,{...r},i,e)}var k=r(34427);function G(e,t){return!!k.WorkerFarm.isSupported()&&(!!k.isBrowser||null!=t&&!!t._nodeWorkers)&&e.worker&&(null==t?void 0:t.worker)}async function H(e,t,r,i,n){let s=e.id,o=(0,k.getWorkerURL)(e,r),a=k.WorkerFarm.getWorkerFarm(r).getWorkerPool({name:s,url:o});r=JSON.parse(JSON.stringify(r)),i=JSON.parse(JSON.stringify(i||{}));let l=await a.startJob("process-on-worker",V.bind(null,n));l.postMessage("process",{input:t,options:r,context:i});let u=await l.result;return await u.result}async function V(e,t,r,i){switch(r){case"done":t.done(i);break;case"error":t.error(Error(i.error));break;case"process":let{id:n,input:s,options:o}=i;try{let r=await e(s,o);t.postMessage("done",{id:n,result:r})}catch(r){let e=r instanceof Error?r.message:"unknown error";t.postMessage("error",{id:n,error:e})}break;default:console.warn(`parse-with-worker unknown message ${r}`)}}var z=r(34427);function j(e,t){return!!z.WorkerFarm.isSupported()&&(!!A||null!=t&&!!t._nodeWorkers)&&e.worker&&(null==t?void 0:t.worker)}function W(e,t=5){return"string"==typeof e?e.slice(0,t):ArrayBuffer.isView(e)?X(e.buffer,e.byteOffset,t):e instanceof ArrayBuffer?X(e,0,t):""}function X(e,t,r){if(e.byteLength<=t+r)return"";let i=new DataView(e),n="";for(let e=0;e<r;e++)n+=String.fromCharCode(i.getUint8(t+e));return n}function $(e){try{return JSON.parse(e)}catch(t){throw Error(`Failed to parse JSON from data starting with "${W(e)}"`)}}function q(e,t,r){if(r=r||e.byteLength,e.byteLength<r||t.byteLength<r)return!1;let i=new Uint8Array(e),n=new Uint8Array(t);for(let e=0;e<i.length;++e)if(i[e]!==n[e])return!1;return!0}function Y(...e){return Z(e)}function Z(e){let t=e.map(e=>e instanceof ArrayBuffer?new Uint8Array(e):e),r=new Uint8Array(t.reduce((e,t)=>e+t.byteLength,0)),i=0;for(let e of t)r.set(e,i),i+=e.byteLength;return r.buffer}function K(...e){let t=e&&e.length>1&&e[0].constructor||null;if(!t)throw Error('"concatenateTypedArrays" - incorrect quantity of arguments or arguments have incompatible data types');let r=new t(e.reduce((e,t)=>e+t.length,0)),i=0;for(let t of e)r.set(t,i),i+=t.length;return r}function Q(e,t,r){let i=void 0!==r?new Uint8Array(e).subarray(t,t+r):new Uint8Array(e).subarray(t);return new Uint8Array(i).buffer}function J(e,t){return g(e>=0),g(t>0),e+(t-1)&~(t-1)}function ee(e,t,r,i=t.byteLength){let n=new Uint8Array(e,r,i),s=new Uint8Array(t);return n.set(s),e}function et(e,t,r){let i;if(e instanceof ArrayBuffer)i=new Uint8Array(e);else{let t=e.byteOffset,r=e.byteLength;i=new Uint8Array(e.buffer||e.arrayBuffer,t,r)}return t.set(i,r),r+J(i.byteLength,4)}function er(e,t){let r=e.length,i=Math.ceil(r/t)*t-r,n="";for(let e=0;e<i;++e)n+=" ";return e+n}function ei(e,t,r,i){if(e)for(let n=0;n<i;n++)e.setUint8(t+n,r.charCodeAt(n));return t+i}function en(e,t,r,i){if(e)for(let n=0;n<i;n++)e.setUint8(t+n,r[n]);return t+i}function es(e,t,r,i){let n=J(r.byteLength,i),s=n-r.byteLength;if(e){let i=new Uint8Array(e.buffer,e.byteOffset+t,r.byteLength),n=new Uint8Array(r);i.set(n);for(let i=0;i<s;++i)e.setUint8(t+r.byteLength+i,32)}return t+n}function eo(e,t,r,i){return t=es(e,t,new TextEncoder().encode(r),i)}async function*ea(e,t={}){let r=new TextDecoder(void 0,t);for await(let t of e)yield"string"==typeof t?t:r.decode(t,{stream:!0})}async function*el(e){let t=new TextEncoder;for await(let r of e)yield"string"==typeof r?t.encode(r):r}async function*eu(e){let t="";for await(let r of e){let e;for(t+=r;(e=t.indexOf("\n"))>=0;){let r=t.slice(0,e+1);t=t.slice(e+1),yield r}}t.length>0&&(yield t)}async function*ec(e){let t=1;for await(let r of e)yield{counter:t,line:r},t++}async function eh(e,t){for(;;){let{done:r,value:i}=await e.next();if(r){e.return();return}if(t(i))return}}async function ef(e){let t=[];for await(let r of e)t.push(r);return Y(...t)}var ed=r(83406),ep={id:"request-scheduler",throttleRequests:!0,maxRequests:6,debounceTime:0},eg=class{props;stats;activeRequestCount=0;requestQueue=[];requestMap=new Map;updateTimer=null;constructor(e={}){this.props={...ep,...e},this.stats=new ed.Stats({id:this.props.id}),this.stats.get("Queued Requests"),this.stats.get("Active Requests"),this.stats.get("Cancelled Requests"),this.stats.get("Queued Requests Ever"),this.stats.get("Active Requests Ever")}scheduleRequest(e,t=()=>0){if(!this.props.throttleRequests)return Promise.resolve({done:()=>{}});if(this.requestMap.has(e))return this.requestMap.get(e);let r={handle:e,priority:0,getPriority:t},i=new Promise(e=>(r.resolve=e,r));return this.requestQueue.push(r),this.requestMap.set(e,i),this._issueNewRequests(),i}_issueRequest(e){let{handle:t,resolve:r}=e,i=!1,n=()=>{i||(i=!0,this.requestMap.delete(t),this.activeRequestCount--,this._issueNewRequests())};return this.activeRequestCount++,r?r({done:n}):Promise.resolve({done:n})}_issueNewRequests(){null!==this.updateTimer&&clearTimeout(this.updateTimer),this.updateTimer=setTimeout(()=>this._issueNewRequestsAsync(),this.props.debounceTime)}_issueNewRequestsAsync(){null!==this.updateTimer&&clearTimeout(this.updateTimer),this.updateTimer=null;let e=Math.max(this.props.maxRequests-this.activeRequestCount,0);if(0!==e){this._updateAllRequests();for(let t=0;t<e;++t){let e=this.requestQueue.shift();e&&this._issueRequest(e)}}}_updateAllRequests(){let e=this.requestQueue;for(let t=0;t<e.length;++t){let r=e[t];!this._updateRequest(r)&&(e.splice(t,1),this.requestMap.delete(r.handle),t--)}e.sort((e,t)=>e.priority-t.priority)}_updateRequest(e){return e.priority=e.getPriority(e.handle),!(e.priority<0)||(e.resolve(null),!1)}},e_="",em={};function eE(e){e_=e}function ev(){return e_}function eb(e){Object.assign(em,e)}function eA(e){for(let t in em)if(e.startsWith(t)){let r=em[t];e=e.replace(t,r)}return e.startsWith("http://")||e.startsWith("https://")||(e=`${e_}${e}`),e}var ey={dataType:null,batchType:null,name:"JSON",id:"json",module:"json",version:"4.3.3",extensions:["json","geojson"],mimeTypes:["application/json"],category:"json",text:!0,parseTextSync:eT,parse:async e=>eT(new TextDecoder().decode(e)),options:{}};function eT(e){return JSON.parse(e)}function eR(e){throw Error("Buffer not supported in browser")}function eS(e){return e&&"object"==typeof e&&e.isBuffer}function eM(e){return eR?eR(e):e}function eI(e){if(eS(e)||e instanceof ArrayBuffer)return e;if(ArrayBuffer.isView(e))return 0===e.byteOffset&&e.byteLength===e.buffer.byteLength?e.buffer:e.buffer.slice(e.byteOffset,e.byteOffset+e.byteLength);if("string"==typeof e)return new TextEncoder().encode(e).buffer;if(e&&"object"==typeof e&&e._toArrayBuffer)return e._toArrayBuffer();throw Error("toArrayBuffer")}function eC(e){return t=>new Promise((r,i)=>e(t,(e,t)=>e?i(e):r(t)))}function ex(e){return(t,r)=>new Promise((i,n)=>e(t,r,(e,t)=>e?n(e):i(t)))}var ew={};function eN(e){let t=e?e.lastIndexOf("/"):-1;return t>=0?e.substr(t+1):""}function eO(e){let t=e?e.lastIndexOf("/"):-1;return t>=0?e.substr(0,t):""}function eP(...e){return(e=e.map((t,r)=>(r&&(t=t.replace(RegExp("^/"),"")),r!==e.length-1&&(t=t.replace(RegExp("/$"),"")),t))).join("/")}function eL(...e){let t;let r=[];for(let t=0;t<e.length;t++)r[t]=e[t];let n="",s=!1;for(let e=r.length-1;e>=-1&&!s;e--){let o;e>=0?o=r[e]:(void 0===t&&(t=function(){var e;if(void 0!==i&&void 0!==i.cwd)return i.cwd();let t=null==(e=window.location)?void 0:e.pathname;return(null==t?void 0:t.slice(0,t.lastIndexOf("/")+1))||""}()),o=t),0!==o.length&&(n=`${o}/${n}`,s=o.charCodeAt(0)===eF)}return(n=function(e,t){let r,i="",n=-1,s=0,o=!1;for(let a=0;a<=e.length;++a){if(a<e.length)r=e.charCodeAt(a);else if(r===eF)break;else r=eF;if(r===eF){if(n===a-1||1===s);else if(n!==a-1&&2===s){if(i.length<2||!o||46!==i.charCodeAt(i.length-1)||46!==i.charCodeAt(i.length-2)){if(i.length>2){let e=i.length-1,t=e;for(;t>=0&&i.charCodeAt(t)!==eF;--t);if(t!==e){i=-1===t?"":i.slice(0,t),n=a,s=0,o=!1;continue}}else if(2===i.length||1===i.length){i="",n=a,s=0,o=!1;continue}}t&&(i.length>0?i+="/..":i="..",o=!0)}else{let t=e.slice(n+1,a);i.length>0?i+=`/${t}`:i=t,o=!1}n=a,s=0}else 46===r&&-1!==s?++s:s=-1}return i}(n,!s),s)?`/${n}`:n.length>0?n:"."}u(ew,{dirname:()=>eO,filename:()=>eN,join:()=>eP,resolve:()=>eL});var eF=47,eB={};u(eB,{isSupported:()=>eD});var eD=!1,eU=class{handle;size;bigsize;url;constructor(e){this.handle=e instanceof ArrayBuffer?new Blob([e]):e,this.size=e instanceof ArrayBuffer?e.byteLength:e.size,this.bigsize=BigInt(this.size),this.url=e instanceof File?e.name:""}async close(){}async stat(){return{size:this.handle.size,bigsize:BigInt(this.handle.size),isDirectory:!1}}async read(e,t){return await this.handle.slice(Number(e),Number(e)+Number(t)).arrayBuffer()}},ek=class{handle;size=0;bigsize=0n;url;constructor(e){this.handle=e,this.url=e}async close(){}async stat(){let e=await fetch(this.handle,{method:"HEAD"});if(!e.ok)throw Error(`Failed to fetch HEAD ${this.handle}`);let t=parseInt(e.headers.get("Content-Length")||"0");return{size:t,bigsize:BigInt(t),isDirectory:!1}}async read(e=0,t=0){let r=await this.fetchRange(e,t);return await r.arrayBuffer()}async fetchRange(e,t,r){let i;let n=Number(e),s=Number(t);r||(r=(i=new AbortController).signal);let o=this.handle,a=await fetch(o,{signal:r,headers:{Range:`bytes=${n}-${n+s-1}`}});switch(a.status){case 206:break;case 200:let l=a.headers.get("Content-Length");if(!l||Number(l)>t)throw i&&i.abort(),Error("content-length header missing or exceeding request. Server must support HTTP Byte Serving.");case 416:if(0===e){let e=a.headers.get("Content-Range");if(!e||!e.startsWith("bytes *"))throw Error("Missing content-length on 416 response");let t=Number(e.substr(8));a=await fetch(this.url,{signal:r,headers:{Range:`bytes=0-${t-1}`}})}break;default:if(a.status>=300)throw Error(`Bad response code: ${a.status}`)}return a}},eG=Error("Not implemented"),eH=class{handle;size=0;bigsize=0n;url="";constructor(e,t,r){var i;if(null==(i=globalThis.loaders)?void 0:i.NodeFile)return new globalThis.loaders.NodeFile(e,t,r);if(A)throw Error("Can't instantiate NodeFile in browser.");throw Error("Can't instantiate NodeFile. Make sure to import @loaders.gl/polyfills first.")}async read(e,t){throw eG}async write(e,t,r){throw eG}async stat(){throw eG}async truncate(e){throw eG}async append(e){throw eG}async close(){}},eV=Error("Not implemented"),ez=class{constructor(e){var t;if(null==(t=globalThis.loaders)?void 0:t.NodeFileSystem)return new globalThis.loaders.NodeFileSystem(e);if(A)throw Error("Can't instantiate NodeFileSystem in browser.");throw Error("Can't instantiate NodeFileSystem. Make sure to import @loaders.gl/polyfills first.")}readable=!0;writable=!0;async openReadableFile(e,t){throw eV}async openWritableFile(e,t,r){throw eV}async readdir(e=".",t){throw eV}async stat(e,t){throw eV}async unlink(e){throw eV}async fetch(e,t){throw eV}},ej=e=>(null==e?void 0:e.getUint8)&&(null==e?void 0:e.slice)&&(null==e?void 0:e.length),eW=class{file;size;constructor(e,t){this.file=e,this.size=BigInt(t)}static async create(e){var t;let r=0n;if(e.bigsize>0n)r=e.bigsize;else if(e.size>0)r=e.size;else{let i=await (null==(t=e.stat)?void 0:t.call(e));r=(null==i?void 0:i.bigsize)??0n}return new eW(e,r)}async truncate(e){throw Error("file loaded via range requests cannot be changed")}async append(e){throw Error("file loaded via range requests cannot be changed")}async destroy(){throw Error("file loaded via range requests cannot be changed")}async getUint8(e){let t=new Uint8Array(await this.file.read(e,1)).at(0);if(void 0===t)throw Error("something went wrong");return t}async getUint16(e){let t=new Uint16Array(await this.file.read(e,2)).at(0);if(void 0===t)throw Error("something went wrong");return t}async getUint32(e){let t=new Uint32Array(await this.file.read(e,4)).at(0);if(void 0===t)throw Error("something went wrong");return t}async getBigUint64(e){let t=new BigInt64Array(await this.file.read(e,8)).at(0);if(void 0===t)throw Error("something went wrong");return t}async slice(e,t){let r=BigInt(t)-BigInt(e);if(r>Number.MAX_SAFE_INTEGER)throw Error("too big slice");let i=Number(r);return await this.file.read(e,i)}get length(){return this.size}},eX=class{file;constructor(e,t=!1){this.file=new eH(e,t?"a+":"r")}async truncate(e){await this.file.truncate(e)}async append(e){await this.file.append(e)}async destroy(){await this.file.close()}async getUint8(e){let t=new Uint8Array(await this.file.read(e,1)).at(0);if(void 0===t)throw Error("something went wrong");return t}async getUint16(e){let t=new Uint16Array(await this.file.read(e,2)).at(0);if(void 0===t)throw Error("something went wrong");return t}async getUint32(e){let t=new Uint32Array(await this.file.read(e,4)).at(0);if(void 0===t)throw Error("something went wrong");return t}async getBigUint64(e){let t=new BigInt64Array(await this.file.read(e,8)).at(0);if(void 0===t)throw Error("something went wrong");return t}async slice(e,t){let r=t-e;if(r>Number.MAX_SAFE_INTEGER)throw Error("too big slice");let i=Number(r);return await this.file.read(e,i)}get length(){return this.file.bigsize}},e$=e=>{if(e>Number.MAX_SAFE_INTEGER)throw Error("Offset is out of bounds");return Number(e)},eq=class{file;constructor(e){this.file=e}async destroy(){}async getUint8(e){return this.file.getUint8(e$(e))}async getUint16(e){return this.file.getUint16(e$(e),!0)}async getUint32(e){return this.file.getUint32(e$(e),!0)}async getBigUint64(e){return this.file.getBigUint64(e$(e),!0)}async slice(e,t){return this.file.buffer.slice(e$(e),e$(t))}get length(){return BigInt(this.file.byteLength)}},eY=class{fetch;loadOptions;_needsRefresh=!0;props;constructor(e){this.props={...e},this.loadOptions={...e.loadOptions},this.fetch=function(e){let t=null==e?void 0:e.fetch;if(t&&"function"==typeof t)return(e,r)=>t(e,r);let r=null==e?void 0:e.fetch;return r&&"function"!=typeof r?e=>fetch(e,r):e=>fetch(e)}(this.loadOptions)}setProps(e){this.props=Object.assign(this.props,e),this.setNeedsRefresh()}setNeedsRefresh(){this._needsRefresh=!0}getNeedsRefresh(e=!0){let t=this._needsRefresh;return e&&(this._needsRefresh=!1),t}},eZ=class extends eY{};c(eZ,"type","template"),c(eZ,"testURL",e=>!1);var eK=class extends eY{};c(eK,"type","template"),c(eK,"testURL",e=>!1)},93989:function(e){"use strict";let t;var r,i,n,s,o=Object.defineProperty,a=Object.getOwnPropertyDescriptor,l=Object.getOwnPropertyNames,u=Object.prototype.hasOwnProperty,c={};function h(e,t="float32"){return e instanceof Date?"date-millisecond":e instanceof Number?t:"string"==typeof e?"utf8":"null"}function f(e){let t=d(e);return"null"!==t?{type:t,nullable:!1}:e.length>0?{type:t=h(e[0]),nullable:!0}:{type:"null",nullable:!0}}function d(e){switch(e.constructor){case Int8Array:return"int8";case Uint8Array:case Uint8ClampedArray:return"uint8";case Int16Array:return"int16";case Uint16Array:return"uint16";case Int32Array:return"int32";case Uint32Array:return"uint32";case Float32Array:return"float32";case Float64Array:return"float64";default:return"null"}}function p(e,t){if(!t)switch(e){case"int8":return Int8Array;case"uint8":return Uint8Array;case"int16":return Int16Array;case"uint16":return Uint16Array;case"int32":return Int32Array;case"uint32":return Uint32Array;case"float32":return Float32Array;case"float64":return Float64Array}return Array}((e,t)=>{for(var r in t)o(e,r,{get:t[r],enumerable:!0})})(c,{ArrowLikeDataType:()=>Q,ArrowLikeField:()=>B,ArrowLikeSchema:()=>D,ArrowLikeTable:()=>V,AsyncQueue:()=>eU,Binary:()=>ep,Bool:()=>ee,ColumnarTableBatchAggregator:()=>v,Date:()=>em,DateDay:()=>eE,DateMillisecond:()=>ev,FixedSizeList:()=>eP,Float:()=>ec,Float16:()=>eh,Float32:()=>ef,Float64:()=>ed,Int:()=>et,Int16:()=>ei,Int32:()=>en,Int64:()=>es,Int8:()=>er,Interval:()=>ew,IntervalDayTime:()=>eN,IntervalYearMonth:()=>eO,Null:()=>J,RowTableBatchAggregator:()=>E,Struct:()=>eL,TableBatchBuilder:()=>y,Time:()=>eA,TimeMillisecond:()=>eT,TimeSecond:()=>ey,Timestamp:()=>eR,TimestampMicrosecond:()=>eI,TimestampMillisecond:()=>eM,TimestampNanosecond:()=>eC,TimestampSecond:()=>eS,Uint16:()=>ea,Uint32:()=>el,Uint64:()=>eu,Uint8:()=>eo,Utf8:()=>eg,convertTable:()=>X,convertToArrayRow:()=>m,convertToObjectRow:()=>_,deduceMeshField:()=>Z,deduceMeshSchema:()=>Y,deduceTableSchema:()=>k,getArrayTypeFromDataType:()=>p,getDataTypeFromArray:()=>f,getMeshBoundingBox:()=>q,getMeshSize:()=>$,getTableCell:()=>M,getTableCellAt:()=>I,getTableColumnIndex:()=>x,getTableColumnName:()=>w,getTableLength:()=>R,getTableNumCols:()=>S,getTableRowAsArray:()=>O,getTableRowAsObject:()=>N,getTableRowShape:()=>C,getTypeInfo:()=>eF,isTable:()=>T,makeArrayRowIterator:()=>L,makeBatchFromTable:()=>j,makeMeshAttributeMetadata:()=>K,makeObjectRowIterator:()=>F,makeRowIterator:()=>P,makeTableFromBatches:()=>W,makeTableFromData:()=>z}),e.exports=((e,t,r,i)=>{if(t&&"object"==typeof t||"function"==typeof t)for(let n of l(t))u.call(e,n)||n===r||o(e,n,{get:()=>t[n],enumerable:!(i=a(t,n))||i.enumerable});return e})(o({},"__esModule",{value:!0}),c);var g=class{schema;options;shape;length=0;rows=null;cursor=0;_headers=[];constructor(e,t){if(this.options=t,this.schema=e,!Array.isArray(e))for(let t in this._headers=[],e)this._headers[e[t].index]=e[t].name}rowCount(){return this.length}addArrayRow(e,t){Number.isFinite(t)&&(this.cursor=t),this.shape="array-row-table",this.rows=this.rows||Array(100),this.rows[this.length]=e,this.length++}addObjectRow(e,t){Number.isFinite(t)&&(this.cursor=t),this.shape="object-row-table",this.rows=this.rows||Array(100),this.rows[this.length]=e,this.length++}getBatch(){let e=this.rows;return e?(e=e.slice(0,this.length),this.rows=null,{shape:this.shape||"array-row-table",batchType:"data",data:e,length:this.length,schema:this.schema,cursor:this.cursor}):null}};function _(e,t){if(!e)throw Error("null row");let r={};if(t)for(let i=0;i<t.length;i++)r[t[i]]=e[i];else for(let t=0;t<e.length;t++)r[`column-${t}`]=e[t];return r}function m(e,t){if(!e)throw Error("null row");if(t){let r=Array(t.length);for(let i=0;i<t.length;i++)r[i]=e[t[i]];return r}return Object.values(e)}var E=class{schema;options;length=0;objectRows=null;arrayRows=null;cursor=0;_headers=null;constructor(e,t){if(this.options=t,this.schema=e,e)for(let t in this._headers=[],e)this._headers[e[t].index]=e[t].name}rowCount(){return this.length}addArrayRow(e,t){switch(Number.isFinite(t)&&(this.cursor=t),this._headers||=function(e){let t=[];for(let r=0;r<e.length;r++){let e=`column-${r}`;t.push(e)}return t}(e),this.options.shape){case"object-row-table":let r=_(e,this._headers);this.addObjectRow(r,t);break;case"array-row-table":this.arrayRows=this.arrayRows||Array(100),this.arrayRows[this.length]=e,this.length++}}addObjectRow(e,t){switch(Number.isFinite(t)&&(this.cursor=t),this._headers||=Object.keys(e),this.options.shape){case"array-row-table":let r=m(e,this._headers);this.addArrayRow(r,t);break;case"object-row-table":this.objectRows=this.objectRows||Array(100),this.objectRows[this.length]=e,this.length++}}getBatch(){let e=this.arrayRows||this.objectRows;return e?(e=e.slice(0,this.length),this.arrayRows=null,this.objectRows=null,{shape:this.options.shape,batchType:"data",data:e,length:this.length,schema:this.schema,cursor:this.cursor}):null}},v=class{schema;length=0;allocated=0;columns={};constructor(e,t){this.schema=e,this._reallocateColumns()}rowCount(){return this.length}addArrayRow(e){this._reallocateColumns();let t=0;for(let r in this.columns)this.columns[r][this.length]=e[t++];this.length++}addObjectRow(e){for(let t in this._reallocateColumns(),e)this.columns[t][this.length]=e[t];this.length++}getBatch(){this._pruneColumns();let e=Array.isArray(this.schema)?this.columns:{};if(!Array.isArray(this.schema))for(let t in this.schema){let r=this.schema[t];e[r.name]=this.columns[r.index]}return this.columns={},{shape:"columnar-table",batchType:"data",data:e,schema:this.schema,length:this.length}}_reallocateColumns(){if(!(this.length<this.allocated))for(let e in this.allocated=this.allocated>0?this.allocated*=2:100,this.columns={},this.schema){let t=this.schema[e],r=t.type||Float32Array,i=this.columns[t.index];if(i&&ArrayBuffer.isView(i)){let e=new r(this.allocated);e.set(i),this.columns[t.index]=e}else i?(i.length=this.allocated,this.columns[t.index]=i):this.columns[t.index]=new r(this.allocated)}}_pruneColumns(){for(let[e,t]of Object.entries(this.columns))this.columns[e]=t.slice(0,this.length)}},b={shape:void 0,batchSize:"auto",batchDebounceMs:0,limit:0,_limitMB:0},A=class{schema;options;aggregator=null;batchCount=0;bytesUsed=0;isChunkComplete=!1;lastBatchEmittedMs=Date.now();totalLength=0;totalBytes=0;rowBytes=0;constructor(e,t){this.schema=e,this.options={...b,...t}}limitReached(){var e,t;return null!=(e=this.options)&&!!e.limit&&this.totalLength>=this.options.limit||null!=(t=this.options)&&!!t._limitMB&&this.totalBytes/1e6>=this.options._limitMB}addRow(e){this.limitReached()||(this.totalLength++,this.rowBytes=this.rowBytes||this._estimateRowMB(e),this.totalBytes+=this.rowBytes,Array.isArray(e)?this.addArrayRow(e):this.addObjectRow(e))}addArrayRow(e){if(!this.aggregator){let e=this._getTableBatchType();this.aggregator=new e(this.schema,this.options)}this.aggregator.addArrayRow(e)}addObjectRow(e){if(!this.aggregator){let e=this._getTableBatchType();this.aggregator=new e(this.schema,this.options)}this.aggregator.addObjectRow(e)}chunkComplete(e){e instanceof ArrayBuffer&&(this.bytesUsed+=e.byteLength),"string"==typeof e&&(this.bytesUsed+=e.length),this.isChunkComplete=!0}getFullBatch(e){return this._isFull()?this._getBatch(e):null}getFinalBatch(e){return this._getBatch(e)}_estimateRowMB(e){return Array.isArray(e)?8*e.length:8*Object.keys(e).length}_isFull(){if(!this.aggregator||0===this.aggregator.rowCount())return!1;if("auto"===this.options.batchSize){if(!this.isChunkComplete)return!1}else if(this.options.batchSize>this.aggregator.rowCount())return!1;return!(this.options.batchDebounceMs>Date.now()-this.lastBatchEmittedMs)&&(this.isChunkComplete=!1,this.lastBatchEmittedMs=Date.now(),!0)}_getBatch(e){if(!this.aggregator)return null;(null==e?void 0:e.bytesUsed)&&(this.bytesUsed=e.bytesUsed);let t=this.aggregator.getBatch();return t.count=this.batchCount,t.bytesUsed=this.bytesUsed,Object.assign(t,e),this.batchCount++,this.aggregator=null,t}_getTableBatchType(){switch(this.options.shape){case"array-row-table":case"object-row-table":return E;case"columnar-table":return v;case"arrow-table":if(!A.ArrowBatch)throw Error("TableBatchBuilder");return A.ArrowBatch;default:return g}}},y=A;function T(e){var t;switch("object"==typeof e&&(null==e?void 0:e.shape)){case"array-row-table":case"object-row-table":return Array.isArray(e.data);case"geojson-table":return Array.isArray(e.features);case"columnar-table":return e.data&&"object"==typeof e.data;case"arrow-table":return(null==(t=null==e?void 0:e.data)?void 0:t.numRows)!==void 0;default:return!1}}function R(e){switch(e.shape){case"array-row-table":case"object-row-table":return e.data.length;case"geojson-table":return e.features.length;case"arrow-table":return e.data.numRows;case"columnar-table":for(let t of Object.values(e.data))return t.length||0;return 0;default:throw Error("table")}}function S(e){if(e.schema)return e.schema.fields.length;if(0===R(e))throw Error("empty table");switch(e.shape){case"array-row-table":return e.data[0].length;case"object-row-table":return Object.keys(e.data[0]).length;case"geojson-table":return Object.keys(e.features[0]).length;case"columnar-table":return Object.keys(e.data).length;case"arrow-table":return e.data.numCols;default:throw Error("table")}}function M(e,t,r){var i;switch(e.shape){case"array-row-table":let n=x(e,r);return e.data[t][n];case"object-row-table":return e.data[t][r];case"geojson-table":return e.features[t][r];case"columnar-table":return e.data[r][t];case"arrow-table":let s=e.data,o=s.schema.fields.findIndex(e=>e.name===r);return null==(i=s.getChildAt(o))?void 0:i.get(t);default:throw Error("todo")}}function I(e,t,r){var i;switch(e.shape){case"array-row-table":return e.data[t][r];case"object-row-table":let n=w(e,r);return e.data[t][n];case"geojson-table":let s=w(e,r);return e.features[t][s];case"columnar-table":let o=w(e,r);return e.data[o][t];case"arrow-table":return null==(i=e.data.getChildAt(r))?void 0:i.get(t);default:throw Error("todo")}}function C(e){switch(e.shape){case"array-row-table":case"object-row-table":return e.shape;case"geojson-table":return"object-row-table";default:throw Error("Not a row table")}}function x(e,t){var r;let i=null==(r=e.schema)?void 0:r.fields.findIndex(e=>e.name===t);if(void 0===i)throw Error(t);return i}function w(e,t){var r,i;let n=null==(i=null==(r=e.schema)?void 0:r.fields[t])?void 0:i.name;if(!n)throw Error(`${t}`);return n}function N(e,t,r,i){switch(e.shape){case"object-row-table":return i?Object.fromEntries(Object.entries(e.data[t])):e.data[t];case"array-row-table":if(e.schema){let i=r||{};for(let r=0;r<e.schema.fields.length;r++)i[e.schema.fields[r].name]=e.data[t][r];return i}throw Error("no schema");case"geojson-table":if(e.schema){let i=r||{};for(let r=0;r<e.schema.fields.length;r++)i[e.schema.fields[r].name]=e.features[t][r];return i}throw Error("no schema");case"columnar-table":if(e.schema){let i=r||{};for(let r=0;r<e.schema.fields.length;r++)i[e.schema.fields[r].name]=e.data[e.schema.fields[r].name][t];return i}{let i=r||{};for(let[r,n]of Object.entries(e.data))i[r]=n[t];return i}case"arrow-table":let n=e.data,s=r||{},o=n.get(t),a=n.schema;for(let e=0;e<a.fields.length;e++)s[a.fields[e].name]=null==o?void 0:o[a.fields[e].name];return s;default:throw Error("shape")}}function O(e,t,r,i){switch(e.shape){case"array-row-table":return i?Array.from(e.data[t]):e.data[t];case"object-row-table":if(e.schema){let i=r||[];for(let r=0;r<e.schema.fields.length;r++)i[r]=e.data[t][e.schema.fields[r].name];return i}return Object.values(e.data[t]);case"geojson-table":if(e.schema){let i=r||[];for(let r=0;r<e.schema.fields.length;r++)i[r]=e.features[t][e.schema.fields[r].name];return i}return Object.values(e.features[t]);case"columnar-table":if(e.schema){let i=r||[];for(let r=0;r<e.schema.fields.length;r++)i[r]=e.data[e.schema.fields[r].name][t];return i}{let i=r||[],n=0;for(let r of Object.values(e.data))i[n]=r[t],n++;return i}case"arrow-table":let n=e.data,s=r||[],o=n.get(t),a=n.schema;for(let e=0;e<a.fields.length;e++)s[e]=null==o?void 0:o[a.fields[e].name];return s;default:throw Error("shape")}}function*P(e,t){switch(t){case"array-row-table":yield*L(e);break;case"object-row-table":yield*F(e);break;default:throw Error(`Unknown row type ${t}`)}}function*L(e,t=[]){let r=R(e);for(let i=0;i<r;i++)yield O(e,i,t)}function*F(e,t={}){let r=R(e);for(let i=0;i<r;i++)yield N(e,i,t)}(t="symbol"!=typeof(r="ArrowBatch")?r+"":r)in y?o(y,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):y[t]=i;var B=class{name;type;nullable;metadata;constructor(e,t,r=!1,i=new Map){this.name=e,this.type=t,this.nullable=r,this.metadata=i}get typeId(){return this.type&&this.type.typeId}clone(){return new B(this.name,this.type,this.nullable,this.metadata)}compareTo(e){return this.name===e.name&&this.type===e.type&&this.nullable===e.nullable&&this.metadata===e.metadata}toString(){return`${JSON.stringify(this.type)}${this.nullable?", nullable":""}${this.metadata?`, metadata: ${JSON.stringify(this.metadata)}`:""}`}},D=class{fields;metadata;constructor(e,t=new Map){this.fields=e.map(e=>new B(e.name,e.type,e.nullable,e.metadata)),this.metadata=t instanceof Map?t:new Map(Object.entries(t))}compareTo(e){if(this.metadata!==e.metadata||this.fields.length!==e.fields.length)return!1;for(let t=0;t<this.fields.length;++t)if(!this.fields[t].compareTo(e.fields[t]))return!1;return!0}select(...e){let t=Object.create(null);for(let r of e)t[r]=!0;return new D(this.fields.filter(e=>t[e.name]),this.metadata)}selectAt(...e){return new D(e.map(e=>this.fields[e]).filter(Boolean),this.metadata)}assign(e){let t;let r=this.metadata;e instanceof D?(t=e.fields,r=U(U(new Map,this.metadata),e.metadata)):t=e;let i=Object.create(null);for(let e of this.fields)i[e.name]=e;for(let e of t)i[e.name]=e;return new D(Object.values(i),r)}};function U(e,t){return new Map([...e||new Map,...t||new Map])}function k(e){switch(e.shape){case"array-row-table":case"object-row-table":return function(e){if(!e.length)throw Error("deduce from empty table");let t=[];for(let[r,i]of Object.entries(e[0]))t.push(G(i,r));return{fields:t,metadata:{}}}(e.data);case"geojson-table":return function(e){if(!e.length)throw Error("deduce from empty table");let t=[];for(let[r,i]of Object.entries(e[0].properties||{}))t.push(G(i,r));return{fields:t,metadata:{}}}(e.features);case"columnar-table":return function(e){let t=[];for(let[r,i]of Object.entries(e)){let e=function(e,t){if(ArrayBuffer.isView(e)){let r=f(e);return{name:t,type:r.type||"null",nullable:r.nullable}}if(Array.isArray(e)&&e.length>0)return{name:t,type:h(e[0]),nullable:!0};throw Error("empty table")}(i,r);t.push(e)}return{fields:t,metadata:{}}}(e.data);default:throw Error("Deduce schema")}}function G(e,t){return{name:t,type:h(e),nullable:!0}}var H=class{table;columnName;constructor(e,t){this.table=e,this.columnName=t}get(e){return M(this.table,e,this.columnName)}toArray(){var e;switch(this.table.shape){case"arrow-table":return null==(e=this.table.data.getChild(this.columnName))?void 0:e.toArray();case"columnar-table":return this.table.data[this.columnName];default:throw Error(this.table.shape)}}},V=class{schema;table;constructor(e){let t=e.schema||k(e);this.schema=new D(t.fields,t.metadata),this.table={...e,schema:t}}get data(){return"geojson-table"===this.table.shape?this.table.features:this.table.data}get numCols(){return S(this.table)}get length(){return R(this.table)}getChild(e){return new H(this.table,e)}};function z(e){let t;switch(function(e){if(Array.isArray(e)){if(0===e.length)throw Error("cannot deduce type of empty table");let t=e[0];if(Array.isArray(t))return"array-row-table";if(t&&"object"==typeof t)return"object-row-table"}if(e&&"object"==typeof e)return"columnar-table";throw Error("invalid table")}(e)){case"array-row-table":t={shape:"array-row-table",data:e};break;case"object-row-table":t={shape:"object-row-table",data:e};break;case"columnar-table":t={shape:"columnar-table",data:e};break;default:throw Error("table")}let r=k(t);return{...t,schema:r}}function j(e){return{...e,length:R(e),batchType:"data"}}async function W(e){let t,r,i,n;let s=null;for await(let o of e)switch(s=s||o.shape,n=n||o.schema,o.shape){case"array-row-table":t=t||[];for(let e=0;e<R(o);e++){let r=o.data[e];t.push(r)}break;case"object-row-table":r=r||[];for(let e=0;e<R(o);e++){let t=o.data[e];r.push(t)}break;case"geojson-table":i=i||[];for(let e=0;e<R(o);e++){let t=o.features[e];i.push(t)}break;default:throw Error("shape")}if(!s)return null;switch(s){case"array-row-table":return{shape:"array-row-table",data:t,schema:n};case"object-row-table":return{shape:"object-row-table",data:r,schema:n};case"geojson-table":return{shape:"geojson-table",type:"FeatureCollection",features:i,schema:n};default:return null}}function X(e,t){switch(t){case"object-row-table":return function(e){if("object-row-table"===e.shape)return e;let t=R(e),r=Array(t);for(let i=0;i<t;i++)r[i]=N(e,i);return{shape:"object-row-table",schema:e.schema,data:r}}(e);case"array-row-table":return function(e){if("array-row-table"===e.shape)return e;let t=R(e),r=Array(t);for(let i=0;i<t;i++)r[i]=O(e,i);return{shape:"array-row-table",schema:e.schema,data:r}}(e);case"columnar-table":return function(e){var t;let r=e.schema||k(e),i=(null==(t=e.schema)?void 0:t.fields)||[];if("columnar-table"===e.shape)return{...e,schema:r};let n=R(e),s={};for(let t of i){let r=new(p(t.type,t.nullable))(n);s[t.name]=r;for(let i=0;i<n;i++)r[i]=M(e,i,t.name)}return{shape:"columnar-table",schema:r,data:s}}(e);case"arrow-table":return function(e){var t;let r=null==(t=globalThis.__loaders)?void 0:t._makeArrowTable;if(!r)throw Error("");return r(e)}(e);default:throw Error(t)}}function $(e){let t=0;for(let r in e){let i=e[r];ArrayBuffer.isView(i)&&(t+=i.byteLength*i.BYTES_PER_ELEMENT)}return t}function q(e){let t=1/0,r=1/0,i=1/0,n=-1/0,s=-1/0,o=-1/0,a=e.POSITION?e.POSITION.value:[],l=a&&a.length;for(let e=0;e<l;e+=3){let l=a[e],u=a[e+1],c=a[e+2];t=l<t?l:t,r=u<r?u:r,i=c<i?c:i,n=l>n?l:n,s=u>s?u:s,o=c>o?c:o}return[[t,r,i],[n,s,o]]}function Y(e,t={}){return{fields:function(e){let t=[];for(let r in e){let i=e[r];t.push(Z(r,i))}return t}(e),metadata:t}}function Z(e,t,r){let i=d(t.value),n=r||K(t);return{name:e,type:{type:"fixed-size-list",listSize:t.size,children:[{name:"value",type:i}]},nullable:!1,metadata:n}}function K(e){let t={};return"byteOffset"in e&&(t.byteOffset=e.byteOffset.toString(10)),"byteStride"in e&&(t.byteStride=e.byteStride.toString(10)),"normalized"in e&&(t.normalized=e.normalized.toString()),t}(n=s||(s={}))[n.NONE=0]="NONE",n[n.Null=1]="Null",n[n.Int=2]="Int",n[n.Float=3]="Float",n[n.Binary=4]="Binary",n[n.Utf8=5]="Utf8",n[n.Bool=6]="Bool",n[n.Decimal=7]="Decimal",n[n.Date=8]="Date",n[n.Time=9]="Time",n[n.Timestamp=10]="Timestamp",n[n.Interval=11]="Interval",n[n.List=12]="List",n[n.Struct=13]="Struct",n[n.Union=14]="Union",n[n.FixedSizeBinary=15]="FixedSizeBinary",n[n.FixedSizeList=16]="FixedSizeList",n[n.Map=17]="Map",n[n.Dictionary=-1]="Dictionary",n[n.Int8=-2]="Int8",n[n.Int16=-3]="Int16",n[n.Int32=-4]="Int32",n[n.Int64=-5]="Int64",n[n.Uint8=-6]="Uint8",n[n.Uint16=-7]="Uint16",n[n.Uint32=-8]="Uint32",n[n.Uint64=-9]="Uint64",n[n.Float16=-10]="Float16",n[n.Float32=-11]="Float32",n[n.Float64=-12]="Float64",n[n.DateDay=-13]="DateDay",n[n.DateMillisecond=-14]="DateMillisecond",n[n.TimestampSecond=-15]="TimestampSecond",n[n.TimestampMillisecond=-16]="TimestampMillisecond",n[n.TimestampMicrosecond=-17]="TimestampMicrosecond",n[n.TimestampNanosecond=-18]="TimestampNanosecond",n[n.TimeSecond=-19]="TimeSecond",n[n.TimeMillisecond=-20]="TimeMillisecond",n[n.TimeMicrosecond=-21]="TimeMicrosecond",n[n.TimeNanosecond=-22]="TimeNanosecond",n[n.DenseUnion=-23]="DenseUnion",n[n.SparseUnion=-24]="SparseUnion",n[n.IntervalDayTime=-25]="IntervalDayTime",n[n.IntervalYearMonth=-26]="IntervalYearMonth";var Q=class{static isNull(e){return e&&e.typeId===s.Null}static isInt(e){return e&&e.typeId===s.Int}static isFloat(e){return e&&e.typeId===s.Float}static isBinary(e){return e&&e.typeId===s.Binary}static isUtf8(e){return e&&e.typeId===s.Utf8}static isBool(e){return e&&e.typeId===s.Bool}static isDecimal(e){return e&&e.typeId===s.Decimal}static isDate(e){return e&&e.typeId===s.Date}static isTime(e){return e&&e.typeId===s.Time}static isTimestamp(e){return e&&e.typeId===s.Timestamp}static isInterval(e){return e&&e.typeId===s.Interval}static isList(e){return e&&e.typeId===s.List}static isStruct(e){return e&&e.typeId===s.Struct}static isUnion(e){return e&&e.typeId===s.Union}static isFixedSizeBinary(e){return e&&e.typeId===s.FixedSizeBinary}static isFixedSizeList(e){return e&&e.typeId===s.FixedSizeList}static isMap(e){return e&&e.typeId===s.Map}static isDictionary(e){return e&&e.typeId===s.Dictionary}get typeId(){return s.NONE}compareTo(e){return this===e}},J=class extends Q{get typeId(){return s.Null}get[Symbol.toStringTag](){return"Null"}toString(){return"Null"}},ee=class extends Q{get typeId(){return s.Bool}get[Symbol.toStringTag](){return"Bool"}toString(){return"Bool"}},et=class extends Q{isSigned;bitWidth;constructor(e,t){super(),this.isSigned=e,this.bitWidth=t}get typeId(){return s.Int}get[Symbol.toStringTag](){return"Int"}toString(){return`${this.isSigned?"I":"Ui"}nt${this.bitWidth}`}},er=class extends et{constructor(){super(!0,8)}},ei=class extends et{constructor(){super(!0,16)}},en=class extends et{constructor(){super(!0,32)}},es=class extends et{constructor(){super(!0,64)}},eo=class extends et{constructor(){super(!1,8)}},ea=class extends et{constructor(){super(!1,16)}},el=class extends et{constructor(){super(!1,32)}},eu=class extends et{constructor(){super(!1,64)}},ec=class extends Q{precision;constructor(e){super(),this.precision=e}get typeId(){return s.Float}get[Symbol.toStringTag](){return"Float"}toString(){return`Float${this.precision}`}},eh=class extends ec{constructor(){super(16)}},ef=class extends ec{constructor(){super(32)}},ed=class extends ec{constructor(){super(64)}},ep=class extends Q{constructor(){super()}get typeId(){return s.Binary}toString(){return"Binary"}get[Symbol.toStringTag](){return"Binary"}},eg=class extends Q{get typeId(){return s.Utf8}get[Symbol.toStringTag](){return"Utf8"}toString(){return"Utf8"}},e_={DAY:0,MILLISECOND:1},em=class extends Q{unit;constructor(e){super(),this.unit=e}get typeId(){return s.Date}get[Symbol.toStringTag](){return"Date"}toString(){return`Date${(this.unit+1)*32}<${e_[this.unit]}>`}},eE=class extends em{constructor(){super(e_.DAY)}},ev=class extends em{constructor(){super(e_.MILLISECOND)}},eb={SECOND:1,MILLISECOND:1e3,MICROSECOND:1e6,NANOSECOND:1e9},eA=class extends Q{unit;bitWidth;constructor(e,t){super(),this.unit=e,this.bitWidth=t}get typeId(){return s.Time}toString(){return`Time${this.bitWidth}<${eb[this.unit]}>`}get[Symbol.toStringTag](){return"Time"}},ey=class extends eA{constructor(){super(eb.SECOND,32)}},eT=class extends eA{constructor(){super(eb.MILLISECOND,32)}},eR=class extends Q{unit;timezone;constructor(e,t=null){super(),this.unit=e,this.timezone=t}get typeId(){return s.Timestamp}get[Symbol.toStringTag](){return"Timestamp"}toString(){return`Timestamp<${eb[this.unit]}${this.timezone?`, ${this.timezone}`:""}>`}},eS=class extends eR{constructor(e=null){super(eb.SECOND,e)}},eM=class extends eR{constructor(e=null){super(eb.MILLISECOND,e)}},eI=class extends eR{constructor(e=null){super(eb.MICROSECOND,e)}},eC=class extends eR{constructor(e=null){super(eb.NANOSECOND,e)}},ex={DAY_TIME:0,YEAR_MONTH:1},ew=class extends Q{unit;constructor(e){super(),this.unit=e}get typeId(){return s.Interval}get[Symbol.toStringTag](){return"Interval"}toString(){return`Interval<${ex[this.unit]}>`}},eN=class extends ew{constructor(){super(ex.DAY_TIME)}},eO=class extends ew{constructor(){super(ex.YEAR_MONTH)}},eP=class extends Q{listSize;children;constructor(e,t){super(),this.listSize=e,this.children=[t]}get typeId(){return s.FixedSizeList}get valueType(){return this.children[0].type}get valueField(){return this.children[0]}get[Symbol.toStringTag](){return"FixedSizeList"}toString(){return`FixedSizeList[${this.listSize}]<${JSON.stringify(this.valueType)}>`}},eL=class extends Q{children;constructor(e){super(),this.children=e}get typeId(){return s.Struct}toString(){return`Struct<{${this.children.map(e=>`${e.name}:${JSON.stringify(e.type)}`).join(", ")}}>`}get[Symbol.toStringTag](){return"Struct"}};function eF(e){return{typeId:e.typeId,ArrayType:e.ArrayType,typeName:e.toString(),typeEnumName:function(e){if(!eB)for(let e in eB={},s)eB[s[e]]=e;return eB[e]}(e.typeId),precision:e.precision}}var eB=null,eD=class extends Array{enqueue(e){return this.push(e)}dequeue(){return this.shift()}},eU=class{_values;_settlers;_closed;constructor(){this._values=new eD,this._settlers=new eD,this._closed=!1}close(){for(;this._settlers.length>0;)this._settlers.dequeue().resolve({done:!0});this._closed=!0}[Symbol.asyncIterator](){return this}enqueue(e){if(this._closed)throw Error("Closed");if(this._settlers.length>0){if(this._values.length>0)throw Error("Illegal internal state");let t=this._settlers.dequeue();e instanceof Error?t.reject(e):t.resolve({value:e})}else this._values.enqueue(e)}next(){if(this._values.length>0){let e=this._values.dequeue();return e instanceof Error?Promise.reject(e):Promise.resolve({value:e})}if(this._closed){if(this._settlers.length>0)throw Error("Illegal internal state");return Promise.resolve({done:!0})}return new Promise((e,t)=>{this._settlers.enqueue({resolve:e,reject:t})})}}},34427:function(e,t,r){"use strict";let i;var n,s,o,a,l,u=r(40257),c=Object.create,h=Object.defineProperty,f=Object.getOwnPropertyDescriptor,d=Object.getOwnPropertyNames,p=Object.getPrototypeOf,g=Object.prototype.hasOwnProperty,_=(e,t,r,i)=>{if(t&&"object"==typeof t||"function"==typeof t)for(let n of d(t))g.call(e,n)||n===r||h(e,n,{get:()=>t[n],enumerable:!(i=f(t,n))||i.enumerable});return e},m=(e,t,r)=>(r=null!=e?c(p(e)):{},_(!t&&e&&e.__esModule?r:h(r,"default",{value:e,enumerable:!0}),e)),E={};((e,t)=>{for(var r in t)h(e,r,{get:t[r],enumerable:!0})})(E,{AsyncQueue:()=>X,ChildProcessProxy:()=>eo,NullWorker:()=>ea,WorkerBody:()=>H,WorkerFarm:()=>U,WorkerJob:()=>M,WorkerPool:()=>F,WorkerThread:()=>L,assert:()=>b,canProcessOnWorker:()=>z,createWorker:()=>q,getLibraryUrl:()=>J,getTransferList:()=>w,getTransferListForWriter:()=>O,getWorkerURL:()=>V,isBrowser:()=>y,isWorker:()=>T,loadLibrary:()=>Q,processOnWorker:()=>j,validateWorkerVersion:()=>Z}),e.exports=_(h({},"__esModule",{value:!0}),E);var v=((null==(n=globalThis._loadersgl_)?void 0:n.version)||(globalThis._loadersgl_=globalThis._loadersgl_||{},globalThis._loadersgl_.version="4.3.3"),globalThis._loadersgl_.version);function b(e,t){if(!e)throw Error(t||"loaders.gl assertion failed.")}var A={self:"undefined"!=typeof self&&self,window:"undefined"!=typeof window&&window,global:void 0!==r.g&&r.g,document:"undefined"!=typeof document&&document};A.self||A.window||A.global,A.window||A.self||A.global,A.global||A.self||A.window,A.document;var y="object"!=typeof u||"[object process]"!==String(u)||!0,T="function"==typeof importScripts,R="undefined"!=typeof window&&void 0!==window.orientation,S=void 0!==u&&u.version&&/v([0-9]*)/.exec(u.version);S&&parseFloat(S[1]);var M=class{name;workerThread;isRunning=!0;result;_resolve=()=>{};_reject=()=>{};constructor(e,t){this.name=e,this.workerThread=t,this.result=new Promise((e,t)=>{this._resolve=e,this._reject=t})}postMessage(e,t){this.workerThread.postMessage({source:"loaders.gl",type:e,payload:t})}done(e){b(this.isRunning),this.isRunning=!1,this._resolve(e)}error(e){b(this.isRunning),this.isRunning=!1,this._reject(e)}},I=class{terminate(){}},C=new Map;function x(e){let t=new Blob([e],{type:"application/javascript"});return URL.createObjectURL(t)}function w(e,t=!0,r){let i=r||new Set;if(e){if(N(e))i.add(e);else if(N(e.buffer))i.add(e.buffer);else if(ArrayBuffer.isView(e));else if(t&&"object"==typeof e)for(let r in e)w(e[r],t,i)}return void 0===r?Array.from(i):[]}function N(e){return!!e&&!!(e instanceof ArrayBuffer||"undefined"!=typeof MessagePort&&e instanceof MessagePort||"undefined"!=typeof ImageBitmap&&e instanceof ImageBitmap||"undefined"!=typeof OffscreenCanvas&&e instanceof OffscreenCanvas)}function O(e){if(null===e)return{};let t=Object.assign({},e);return Object.keys(t).forEach(r=>{"object"!=typeof e[r]||ArrayBuffer.isView(e[r])||e[r]instanceof Array?"function"==typeof t[r]||t[r]instanceof RegExp?t[r]={}:t[r]=e[r]:t[r]=O(e[r])}),t}var P=()=>{},L=class{name;source;url;terminated=!1;worker;onMessage;onError;_loadableURL="";static isSupported(){return"undefined"!=typeof Worker&&y||void 0!==I&&!y}constructor(e){let{name:t,source:r,url:i}=e;b(r||i),this.name=t,this.source=r,this.url=i,this.onMessage=P,this.onError=e=>console.log(e),this.worker=y?this._createBrowserWorker():this._createNodeWorker()}destroy(){this.onMessage=P,this.onError=P,this.worker.terminate(),this.terminated=!0}get isRunning(){return!!this.onMessage}postMessage(e,t){t=t||w(e),this.worker.postMessage(e,t)}_getErrorFromErrorEvent(e){let t="Failed to load ";return t+=`worker ${this.name} from ${this.url}. `,e.message&&(t+=`${e.message} in `),e.lineno&&(t+=`:${e.lineno}:${e.colno}`),Error(t)}_createBrowserWorker(){var e,t;let r;this._loadableURL=(b((e={source:this.source,url:this.url}).source&&!e.url||!e.source&&e.url),(r=C.get(e.source||e.url))||(e.url&&(r=(t=e.url).startsWith("http")?x(`try {
  importScripts('${t}');
} catch (error) {
  console.error(error);
  throw error;
}`):t,C.set(e.url,r)),e.source&&(r=x(e.source),C.set(e.source,r))),b(r),r);let i=new Worker(this._loadableURL,{name:this.name});return i.onmessage=e=>{e.data?this.onMessage(e.data):this.onError(Error("No data received"))},i.onerror=e=>{this.onError(this._getErrorFromErrorEvent(e)),this.terminated=!0},i.onmessageerror=e=>console.error(e),i}_createNodeWorker(){let e;if(this.url)e=new I(this.url.includes(":/")||this.url.startsWith("/")?this.url:`./${this.url}`,{eval:!1});else if(this.source)e=new I(this.source,{eval:!0});else throw Error("no worker");return e.on("message",e=>{this.onMessage(e)}),e.on("error",e=>{this.onError(e)}),e.on("exit",e=>{}),e}},F=class{name="unnamed";source;url;maxConcurrency=1;maxMobileConcurrency=1;onDebug=()=>{};reuseWorkers=!0;props={};jobQueue=[];idleQueue=[];count=0;isDestroyed=!1;static isSupported(){return L.isSupported()}constructor(e){this.source=e.source,this.url=e.url,this.setProps(e)}destroy(){this.idleQueue.forEach(e=>e.destroy()),this.isDestroyed=!0}setProps(e){this.props={...this.props,...e},void 0!==e.name&&(this.name=e.name),void 0!==e.maxConcurrency&&(this.maxConcurrency=e.maxConcurrency),void 0!==e.maxMobileConcurrency&&(this.maxMobileConcurrency=e.maxMobileConcurrency),void 0!==e.reuseWorkers&&(this.reuseWorkers=e.reuseWorkers),void 0!==e.onDebug&&(this.onDebug=e.onDebug)}async startJob(e,t=(e,t,r)=>e.done(r),r=(e,t)=>e.error(t)){let i=new Promise(i=>(this.jobQueue.push({name:e,onMessage:t,onError:r,onStart:i}),this));return this._startQueuedJob(),await i}async _startQueuedJob(){if(!this.jobQueue.length)return;let e=this._getAvailableWorker();if(!e)return;let t=this.jobQueue.shift();if(t){this.onDebug({message:"Starting job",name:t.name,workerThread:e,backlog:this.jobQueue.length});let r=new M(t.name,e);e.onMessage=e=>t.onMessage(r,e.type,e.payload),e.onError=e=>t.onError(r,e),t.onStart(r);try{await r.result}catch(e){console.error(`Worker exception: ${e}`)}finally{this.returnWorkerToQueue(e)}}}returnWorkerToQueue(e){!y||this.isDestroyed||!this.reuseWorkers||this.count>this._getMaxConcurrency()?(e.destroy(),this.count--):this.idleQueue.push(e),this.isDestroyed||this._startQueuedJob()}_getAvailableWorker(){return this.idleQueue.length>0?this.idleQueue.shift()||null:this.count<this._getMaxConcurrency()?(this.count++,new L({name:`${this.name.toLowerCase()} (#${this.count} of ${this.maxConcurrency})`,source:this.source,url:this.url})):null}_getMaxConcurrency(){return R?this.maxMobileConcurrency:this.maxConcurrency}},B={maxConcurrency:3,maxMobileConcurrency:1,reuseWorkers:!0,onDebug:()=>{}},D=class{props;workerPools=new Map;static isSupported(){return L.isSupported()}static getWorkerFarm(e={}){return D._workerFarm=D._workerFarm||new D({}),D._workerFarm.setProps(e),D._workerFarm}constructor(e){this.props={...B},this.setProps(e),this.workerPools=new Map}destroy(){for(let e of this.workerPools.values())e.destroy();this.workerPools=new Map}setProps(e){for(let t of(this.props={...this.props,...e},this.workerPools.values()))t.setProps(this._getWorkerPoolProps())}getWorkerPool(e){let{name:t,source:r,url:i}=e,n=this.workerPools.get(t);return n||((n=new F({name:t,source:r,url:i})).setProps(this._getWorkerPoolProps()),this.workerPools.set(t,n)),n}_getWorkerPoolProps(){return{maxConcurrency:this.props.maxConcurrency,maxMobileConcurrency:this.props.maxMobileConcurrency,reuseWorkers:this.props.reuseWorkers,onDebug:this.props.onDebug}}},U=D;async function k(){return null}(i="symbol"!=typeof(s="_workerFarm")?s+"":s)in U?h(U,i,{enumerable:!0,configurable:!0,writable:!0,value:o}):U[i]=o;var G=new Map,H=class{static async inWorkerThread(){return"undefined"!=typeof self||!!await k()}static set onmessage(e){async function t(t){let{type:r,payload:i}=await k()?t:t.data;e(r,i)}k().then(e=>{e?(e.on("message",e=>{t(e)}),e.on("exit",()=>console.debug("Node worker closing"))):globalThis.onmessage=t})}static async addEventListener(e){let t=G.get(e);t||(t=async t=>{if(!function(e){let{type:t,data:r}=e;return"message"===t&&r&&"string"==typeof r.source&&r.source.startsWith("loaders.gl")}(t))return;let{type:r,payload:i}=await k()?t:t.data;e(r,i)}),await k()?console.error("not implemented"):globalThis.addEventListener("message",t)}static async removeEventListener(e){let t=G.get(e);G.delete(e),await k()?console.error("not implemented"):globalThis.removeEventListener("message",t)}static async postMessage(e,t){let r={source:"loaders.gl",type:e,payload:t},i=w(t),n=await k();n?n.postMessage(r,i):globalThis.postMessage(r,i)}};function V(e,t={}){let r=t[e.id]||{},i=y?`${e.id}-worker.js`:`${e.id}-worker-node.js`,n=r.workerUrl;if(n||"compression"!==e.id||(n=t.workerUrl),"test"===t._workerType&&(n=y?`modules/${e.module}/dist/${i}`:`modules/${e.module}/src/workers/${e.id}-worker-node.ts`),!n){let t=e.version;"latest"===t&&(t="latest");let r=t?`@${t}`:"";n=`https://unpkg.com/@loaders.gl/${e.module}${r}/dist/${i}`}return b(n),n}function z(e,t){return!!U.isSupported()&&e.worker&&(null==t?void 0:t.worker)}async function j(e,t,r={},i={}){let n=function(e){let t=e.version!==v?` (worker-utils@${v})`:"";return`${e.name}@${e.version}${t}`}(e),s=U.getWorkerFarm(r),{source:o}=r,a={name:n,source:o};o||(a.url=V(e,r));let l=s.getWorkerPool(a),u=r.jobName||e.name,c=await l.startJob(u,W.bind(null,i)),h=O(r);return c.postMessage("process",{input:t,options:h}),(await c.result).result}async function W(e,t,r,i){switch(r){case"done":t.done(i);break;case"error":t.error(Error(i.error));break;case"process":let{id:n,input:s,options:o}=i;try{if(!e.process){t.postMessage("error",{id:n,error:"Worker not set up to process on main thread"});return}let r=await e.process(s,o);t.postMessage("done",{id:n,result:r})}catch(r){let e=r instanceof Error?r.message:"unknown error";t.postMessage("error",{id:n,error:e})}break;default:console.warn(`process-on-worker: unknown message ${r}`)}}var X=class{_values;_settlers;_closed;constructor(){this._values=[],this._settlers=[],this._closed=!1}[Symbol.asyncIterator](){return this}push(e){return this.enqueue(e)}enqueue(e){if(this._closed)throw Error("Closed");if(this._settlers.length>0){if(this._values.length>0)throw Error("Illegal internal state");let t=this._settlers.shift();e instanceof Error?t.reject(e):t.resolve({value:e})}else this._values.push(e)}close(){for(;this._settlers.length>0;)this._settlers.shift().resolve({done:!0});this._closed=!0}next(){if(this._values.length>0){let e=this._values.shift();return e instanceof Error?Promise.reject(e):Promise.resolve({done:!1,value:e})}if(this._closed){if(this._settlers.length>0)throw Error("Illegal internal state");return Promise.resolve({done:!0,value:void 0})}return new Promise((e,t)=>{this._settlers.push({resolve:e,reject:t})})}},$=0;async function q(e,t){if(!await H.inWorkerThread())return;let r={process:Y};H.onmessage=async(i,n)=>{try{switch(i){case"process":if(!e)throw Error("Worker does not support atomic processing");let s=await e(n.input,n.options||{},r);H.postMessage("done",{result:s});break;case"process-in-batches":if(!t)throw Error("Worker does not support batched processing");for await(let e of(a=new X,l=n.options||{},t(a,l,r)))H.postMessage("output-batch",{result:e});H.postMessage("done",{});break;case"input-batch":a.push(n.input);break;case"input-done":a.close()}}catch(t){let e=t instanceof Error?t.message:"";H.postMessage("error",{error:e})}}}function Y(e,t={}){return new Promise((r,i)=>{let n=$++,s=(e,t)=>{if(t.id===n)switch(e){case"done":H.removeEventListener(s),r(t.result);break;case"error":H.removeEventListener(s),i(t.error)}};H.addEventListener(s),H.postMessage("process",{id:n,input:e,options:t})})}function Z(e,t=v){b(e,"no worker provided");let r=e.version;return!!t&&!!r}var K={};async function Q(e,t=null,r={},i=null){return t&&(e=J(e,t,r,i)),K[e]=K[e]||ee(e),await K[e]}function J(e,t,r={},i=null){if(!r.useLocalLibraries&&e.startsWith("http"))return e;i=i||e;let n=r.modules||{};return n[i]?n[i]:y?r.CDN?(b(r.CDN.startsWith("http")),`${r.CDN}/${t}@${v}/dist/libs/${i}`):T?`../src/libs/${i}`:`modules/${t}/src/libs/${i}`:`modules/${t}/dist/libs/${i}`}async function ee(e){if(e.endsWith("wasm"))return await et(e);if(!y)try{let{requireFromFile:t}=globalThis.loaders||{};return await (null==t?void 0:t(e))}catch(e){return console.error(e),null}return T?importScripts(e):function(e,t){if(!y){let{requireFromString:r}=globalThis.loaders||{};return null==r?void 0:r(e,t)}if(T)return eval.call(globalThis,e),null;let r=document.createElement("script");r.id=t;try{r.appendChild(document.createTextNode(e))}catch(t){r.text=e}return document.body.appendChild(r),null}(await er(e),e)}async function et(e){let{readFileAsArrayBuffer:t}=globalThis.loaders||{};if(y||!t||e.startsWith("http")){let t=await fetch(e);return await t.arrayBuffer()}return await t(e)}async function er(e){let{readFileAsText:t}=globalThis.loaders||{};if(y||!t||e.startsWith("http")){let t=await fetch(e);return await t.text()}return await t(e)}var ei=m(r(94409),1),en=m(r(94409),1),es={command:"",arguments:[],port:5e3,autoPort:!0,wait:2e3,onSuccess:e=>{console.log(`Started ${e.props.command}`)}},eo=class{id;props={...es};childProcess=null;port=0;successTimer;constructor({id:e="browser-driver"}={}){this.id=e}async start(e){e={...es,...e},this.props=e;let t=[...e.arguments];return this.port=Number(e.port),e.portArg&&(e.autoPort&&(this.port=await function(e=3e3){return new Promise(t=>{en.default.exec("lsof -i -P -n | grep LISTEN",(r,i)=>{if(r){t(e);return}let n=[],s=/:(\d+) \(LISTEN\)/;i.split("\n").forEach(e=>{let t=s.exec(e);t&&n.push(Number(t[1]))});let o=e;for(;n.includes(o);)o++;t(o)})})}(e.port)),t.push(e.portArg,String(this.port))),await new Promise((r,i)=>{try{this._setTimeout(()=>{e.onSuccess&&e.onSuccess(this),r({})}),console.log(`Spawning ${e.command} ${e.arguments.join(" ")}`);let n=ei.spawn(e.command,t,e.spawn);this.childProcess=n,n.stdout.on("data",e=>{console.log(e.toString())}),n.stderr.on("data",t=>{console.log(`Child process wrote to stderr: "${t}".`),e.ignoreStderr||(this._clearTimeout(),i(Error(t)))}),n.on("error",e=>{console.log(`Child process errored with ${e}`),this._clearTimeout(),i(e)}),n.on("close",e=>{console.log(`Child process exited with ${e}`),this.childProcess=null,this._clearTimeout(),r({})})}catch(e){i(e)}})}async stop(){this.childProcess&&(this.childProcess.kill(),this.childProcess=null)}async exit(e=0){try{await this.stop(),u.exit(e)}catch(e){console.error(e.message||e),u.exit(1)}}_setTimeout(e){Number(this.props.wait)>0&&(this.successTimer=setTimeout(e,this.props.wait))}_clearTimeout(){this.successTimer&&clearTimeout(this.successTimer)}},ea={id:"null",name:"null",module:"worker-utils",version:v,options:{null:{}}}},63522:function(e){"use strict";var t,r,i=Object.defineProperty,n=Object.getOwnPropertyDescriptor,s=Object.getOwnPropertyNames,o=Object.prototype.hasOwnProperty,a={};((e,t)=>{for(var r in t)i(e,r,{get:t[r],enumerable:!0})})(a,{GL:()=>r}),e.exports=((e,t,r,a)=>{if(t&&"object"==typeof t||"function"==typeof t)for(let l of s(t))o.call(e,l)||l===r||i(e,l,{get:()=>t[l],enumerable:!(a=n(t,l))||a.enumerable});return e})(i({},"__esModule",{value:!0}),a),(t=r||(r={}))[t.DEPTH_BUFFER_BIT=256]="DEPTH_BUFFER_BIT",t[t.STENCIL_BUFFER_BIT=1024]="STENCIL_BUFFER_BIT",t[t.COLOR_BUFFER_BIT=16384]="COLOR_BUFFER_BIT",t[t.POINTS=0]="POINTS",t[t.LINES=1]="LINES",t[t.LINE_LOOP=2]="LINE_LOOP",t[t.LINE_STRIP=3]="LINE_STRIP",t[t.TRIANGLES=4]="TRIANGLES",t[t.TRIANGLE_STRIP=5]="TRIANGLE_STRIP",t[t.TRIANGLE_FAN=6]="TRIANGLE_FAN",t[t.ZERO=0]="ZERO",t[t.ONE=1]="ONE",t[t.SRC_COLOR=768]="SRC_COLOR",t[t.ONE_MINUS_SRC_COLOR=769]="ONE_MINUS_SRC_COLOR",t[t.SRC_ALPHA=770]="SRC_ALPHA",t[t.ONE_MINUS_SRC_ALPHA=771]="ONE_MINUS_SRC_ALPHA",t[t.DST_ALPHA=772]="DST_ALPHA",t[t.ONE_MINUS_DST_ALPHA=773]="ONE_MINUS_DST_ALPHA",t[t.DST_COLOR=774]="DST_COLOR",t[t.ONE_MINUS_DST_COLOR=775]="ONE_MINUS_DST_COLOR",t[t.SRC_ALPHA_SATURATE=776]="SRC_ALPHA_SATURATE",t[t.CONSTANT_COLOR=32769]="CONSTANT_COLOR",t[t.ONE_MINUS_CONSTANT_COLOR=32770]="ONE_MINUS_CONSTANT_COLOR",t[t.CONSTANT_ALPHA=32771]="CONSTANT_ALPHA",t[t.ONE_MINUS_CONSTANT_ALPHA=32772]="ONE_MINUS_CONSTANT_ALPHA",t[t.FUNC_ADD=32774]="FUNC_ADD",t[t.FUNC_SUBTRACT=32778]="FUNC_SUBTRACT",t[t.FUNC_REVERSE_SUBTRACT=32779]="FUNC_REVERSE_SUBTRACT",t[t.BLEND_EQUATION=32777]="BLEND_EQUATION",t[t.BLEND_EQUATION_RGB=32777]="BLEND_EQUATION_RGB",t[t.BLEND_EQUATION_ALPHA=34877]="BLEND_EQUATION_ALPHA",t[t.BLEND_DST_RGB=32968]="BLEND_DST_RGB",t[t.BLEND_SRC_RGB=32969]="BLEND_SRC_RGB",t[t.BLEND_DST_ALPHA=32970]="BLEND_DST_ALPHA",t[t.BLEND_SRC_ALPHA=32971]="BLEND_SRC_ALPHA",t[t.BLEND_COLOR=32773]="BLEND_COLOR",t[t.ARRAY_BUFFER_BINDING=34964]="ARRAY_BUFFER_BINDING",t[t.ELEMENT_ARRAY_BUFFER_BINDING=34965]="ELEMENT_ARRAY_BUFFER_BINDING",t[t.LINE_WIDTH=2849]="LINE_WIDTH",t[t.ALIASED_POINT_SIZE_RANGE=33901]="ALIASED_POINT_SIZE_RANGE",t[t.ALIASED_LINE_WIDTH_RANGE=33902]="ALIASED_LINE_WIDTH_RANGE",t[t.CULL_FACE_MODE=2885]="CULL_FACE_MODE",t[t.FRONT_FACE=2886]="FRONT_FACE",t[t.DEPTH_RANGE=2928]="DEPTH_RANGE",t[t.DEPTH_WRITEMASK=2930]="DEPTH_WRITEMASK",t[t.DEPTH_CLEAR_VALUE=2931]="DEPTH_CLEAR_VALUE",t[t.DEPTH_FUNC=2932]="DEPTH_FUNC",t[t.STENCIL_CLEAR_VALUE=2961]="STENCIL_CLEAR_VALUE",t[t.STENCIL_FUNC=2962]="STENCIL_FUNC",t[t.STENCIL_FAIL=2964]="STENCIL_FAIL",t[t.STENCIL_PASS_DEPTH_FAIL=2965]="STENCIL_PASS_DEPTH_FAIL",t[t.STENCIL_PASS_DEPTH_PASS=2966]="STENCIL_PASS_DEPTH_PASS",t[t.STENCIL_REF=2967]="STENCIL_REF",t[t.STENCIL_VALUE_MASK=2963]="STENCIL_VALUE_MASK",t[t.STENCIL_WRITEMASK=2968]="STENCIL_WRITEMASK",t[t.STENCIL_BACK_FUNC=34816]="STENCIL_BACK_FUNC",t[t.STENCIL_BACK_FAIL=34817]="STENCIL_BACK_FAIL",t[t.STENCIL_BACK_PASS_DEPTH_FAIL=34818]="STENCIL_BACK_PASS_DEPTH_FAIL",t[t.STENCIL_BACK_PASS_DEPTH_PASS=34819]="STENCIL_BACK_PASS_DEPTH_PASS",t[t.STENCIL_BACK_REF=36003]="STENCIL_BACK_REF",t[t.STENCIL_BACK_VALUE_MASK=36004]="STENCIL_BACK_VALUE_MASK",t[t.STENCIL_BACK_WRITEMASK=36005]="STENCIL_BACK_WRITEMASK",t[t.VIEWPORT=2978]="VIEWPORT",t[t.SCISSOR_BOX=3088]="SCISSOR_BOX",t[t.COLOR_CLEAR_VALUE=3106]="COLOR_CLEAR_VALUE",t[t.COLOR_WRITEMASK=3107]="COLOR_WRITEMASK",t[t.UNPACK_ALIGNMENT=3317]="UNPACK_ALIGNMENT",t[t.PACK_ALIGNMENT=3333]="PACK_ALIGNMENT",t[t.MAX_TEXTURE_SIZE=3379]="MAX_TEXTURE_SIZE",t[t.MAX_VIEWPORT_DIMS=3386]="MAX_VIEWPORT_DIMS",t[t.SUBPIXEL_BITS=3408]="SUBPIXEL_BITS",t[t.RED_BITS=3410]="RED_BITS",t[t.GREEN_BITS=3411]="GREEN_BITS",t[t.BLUE_BITS=3412]="BLUE_BITS",t[t.ALPHA_BITS=3413]="ALPHA_BITS",t[t.DEPTH_BITS=3414]="DEPTH_BITS",t[t.STENCIL_BITS=3415]="STENCIL_BITS",t[t.POLYGON_OFFSET_UNITS=10752]="POLYGON_OFFSET_UNITS",t[t.POLYGON_OFFSET_FACTOR=32824]="POLYGON_OFFSET_FACTOR",t[t.TEXTURE_BINDING_2D=32873]="TEXTURE_BINDING_2D",t[t.SAMPLE_BUFFERS=32936]="SAMPLE_BUFFERS",t[t.SAMPLES=32937]="SAMPLES",t[t.SAMPLE_COVERAGE_VALUE=32938]="SAMPLE_COVERAGE_VALUE",t[t.SAMPLE_COVERAGE_INVERT=32939]="SAMPLE_COVERAGE_INVERT",t[t.COMPRESSED_TEXTURE_FORMATS=34467]="COMPRESSED_TEXTURE_FORMATS",t[t.VENDOR=7936]="VENDOR",t[t.RENDERER=7937]="RENDERER",t[t.VERSION=7938]="VERSION",t[t.IMPLEMENTATION_COLOR_READ_TYPE=35738]="IMPLEMENTATION_COLOR_READ_TYPE",t[t.IMPLEMENTATION_COLOR_READ_FORMAT=35739]="IMPLEMENTATION_COLOR_READ_FORMAT",t[t.BROWSER_DEFAULT_WEBGL=37444]="BROWSER_DEFAULT_WEBGL",t[t.STATIC_DRAW=35044]="STATIC_DRAW",t[t.STREAM_DRAW=35040]="STREAM_DRAW",t[t.DYNAMIC_DRAW=35048]="DYNAMIC_DRAW",t[t.ARRAY_BUFFER=34962]="ARRAY_BUFFER",t[t.ELEMENT_ARRAY_BUFFER=34963]="ELEMENT_ARRAY_BUFFER",t[t.BUFFER_SIZE=34660]="BUFFER_SIZE",t[t.BUFFER_USAGE=34661]="BUFFER_USAGE",t[t.CURRENT_VERTEX_ATTRIB=34342]="CURRENT_VERTEX_ATTRIB",t[t.VERTEX_ATTRIB_ARRAY_ENABLED=34338]="VERTEX_ATTRIB_ARRAY_ENABLED",t[t.VERTEX_ATTRIB_ARRAY_SIZE=34339]="VERTEX_ATTRIB_ARRAY_SIZE",t[t.VERTEX_ATTRIB_ARRAY_STRIDE=34340]="VERTEX_ATTRIB_ARRAY_STRIDE",t[t.VERTEX_ATTRIB_ARRAY_TYPE=34341]="VERTEX_ATTRIB_ARRAY_TYPE",t[t.VERTEX_ATTRIB_ARRAY_NORMALIZED=34922]="VERTEX_ATTRIB_ARRAY_NORMALIZED",t[t.VERTEX_ATTRIB_ARRAY_POINTER=34373]="VERTEX_ATTRIB_ARRAY_POINTER",t[t.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING=34975]="VERTEX_ATTRIB_ARRAY_BUFFER_BINDING",t[t.CULL_FACE=2884]="CULL_FACE",t[t.FRONT=1028]="FRONT",t[t.BACK=1029]="BACK",t[t.FRONT_AND_BACK=1032]="FRONT_AND_BACK",t[t.BLEND=3042]="BLEND",t[t.DEPTH_TEST=2929]="DEPTH_TEST",t[t.DITHER=3024]="DITHER",t[t.POLYGON_OFFSET_FILL=32823]="POLYGON_OFFSET_FILL",t[t.SAMPLE_ALPHA_TO_COVERAGE=32926]="SAMPLE_ALPHA_TO_COVERAGE",t[t.SAMPLE_COVERAGE=32928]="SAMPLE_COVERAGE",t[t.SCISSOR_TEST=3089]="SCISSOR_TEST",t[t.STENCIL_TEST=2960]="STENCIL_TEST",t[t.NO_ERROR=0]="NO_ERROR",t[t.INVALID_ENUM=1280]="INVALID_ENUM",t[t.INVALID_VALUE=1281]="INVALID_VALUE",t[t.INVALID_OPERATION=1282]="INVALID_OPERATION",t[t.OUT_OF_MEMORY=1285]="OUT_OF_MEMORY",t[t.CONTEXT_LOST_WEBGL=37442]="CONTEXT_LOST_WEBGL",t[t.CW=2304]="CW",t[t.CCW=2305]="CCW",t[t.DONT_CARE=4352]="DONT_CARE",t[t.FASTEST=4353]="FASTEST",t[t.NICEST=4354]="NICEST",t[t.GENERATE_MIPMAP_HINT=33170]="GENERATE_MIPMAP_HINT",t[t.BYTE=5120]="BYTE",t[t.UNSIGNED_BYTE=5121]="UNSIGNED_BYTE",t[t.SHORT=5122]="SHORT",t[t.UNSIGNED_SHORT=5123]="UNSIGNED_SHORT",t[t.INT=5124]="INT",t[t.UNSIGNED_INT=5125]="UNSIGNED_INT",t[t.FLOAT=5126]="FLOAT",t[t.DOUBLE=5130]="DOUBLE",t[t.DEPTH_COMPONENT=6402]="DEPTH_COMPONENT",t[t.ALPHA=6406]="ALPHA",t[t.RGB=6407]="RGB",t[t.RGBA=6408]="RGBA",t[t.LUMINANCE=6409]="LUMINANCE",t[t.LUMINANCE_ALPHA=6410]="LUMINANCE_ALPHA",t[t.UNSIGNED_SHORT_4_4_4_4=32819]="UNSIGNED_SHORT_4_4_4_4",t[t.UNSIGNED_SHORT_5_5_5_1=32820]="UNSIGNED_SHORT_5_5_5_1",t[t.UNSIGNED_SHORT_5_6_5=33635]="UNSIGNED_SHORT_5_6_5",t[t.FRAGMENT_SHADER=35632]="FRAGMENT_SHADER",t[t.VERTEX_SHADER=35633]="VERTEX_SHADER",t[t.COMPILE_STATUS=35713]="COMPILE_STATUS",t[t.DELETE_STATUS=35712]="DELETE_STATUS",t[t.LINK_STATUS=35714]="LINK_STATUS",t[t.VALIDATE_STATUS=35715]="VALIDATE_STATUS",t[t.ATTACHED_SHADERS=35717]="ATTACHED_SHADERS",t[t.ACTIVE_ATTRIBUTES=35721]="ACTIVE_ATTRIBUTES",t[t.ACTIVE_UNIFORMS=35718]="ACTIVE_UNIFORMS",t[t.MAX_VERTEX_ATTRIBS=34921]="MAX_VERTEX_ATTRIBS",t[t.MAX_VERTEX_UNIFORM_VECTORS=36347]="MAX_VERTEX_UNIFORM_VECTORS",t[t.MAX_VARYING_VECTORS=36348]="MAX_VARYING_VECTORS",t[t.MAX_COMBINED_TEXTURE_IMAGE_UNITS=35661]="MAX_COMBINED_TEXTURE_IMAGE_UNITS",t[t.MAX_VERTEX_TEXTURE_IMAGE_UNITS=35660]="MAX_VERTEX_TEXTURE_IMAGE_UNITS",t[t.MAX_TEXTURE_IMAGE_UNITS=34930]="MAX_TEXTURE_IMAGE_UNITS",t[t.MAX_FRAGMENT_UNIFORM_VECTORS=36349]="MAX_FRAGMENT_UNIFORM_VECTORS",t[t.SHADER_TYPE=35663]="SHADER_TYPE",t[t.SHADING_LANGUAGE_VERSION=35724]="SHADING_LANGUAGE_VERSION",t[t.CURRENT_PROGRAM=35725]="CURRENT_PROGRAM",t[t.NEVER=512]="NEVER",t[t.LESS=513]="LESS",t[t.EQUAL=514]="EQUAL",t[t.LEQUAL=515]="LEQUAL",t[t.GREATER=516]="GREATER",t[t.NOTEQUAL=517]="NOTEQUAL",t[t.GEQUAL=518]="GEQUAL",t[t.ALWAYS=519]="ALWAYS",t[t.KEEP=7680]="KEEP",t[t.REPLACE=7681]="REPLACE",t[t.INCR=7682]="INCR",t[t.DECR=7683]="DECR",t[t.INVERT=5386]="INVERT",t[t.INCR_WRAP=34055]="INCR_WRAP",t[t.DECR_WRAP=34056]="DECR_WRAP",t[t.NEAREST=9728]="NEAREST",t[t.LINEAR=9729]="LINEAR",t[t.NEAREST_MIPMAP_NEAREST=9984]="NEAREST_MIPMAP_NEAREST",t[t.LINEAR_MIPMAP_NEAREST=9985]="LINEAR_MIPMAP_NEAREST",t[t.NEAREST_MIPMAP_LINEAR=9986]="NEAREST_MIPMAP_LINEAR",t[t.LINEAR_MIPMAP_LINEAR=9987]="LINEAR_MIPMAP_LINEAR",t[t.TEXTURE_MAG_FILTER=10240]="TEXTURE_MAG_FILTER",t[t.TEXTURE_MIN_FILTER=10241]="TEXTURE_MIN_FILTER",t[t.TEXTURE_WRAP_S=10242]="TEXTURE_WRAP_S",t[t.TEXTURE_WRAP_T=10243]="TEXTURE_WRAP_T",t[t.TEXTURE_2D=3553]="TEXTURE_2D",t[t.TEXTURE=5890]="TEXTURE",t[t.TEXTURE_CUBE_MAP=34067]="TEXTURE_CUBE_MAP",t[t.TEXTURE_BINDING_CUBE_MAP=34068]="TEXTURE_BINDING_CUBE_MAP",t[t.TEXTURE_CUBE_MAP_POSITIVE_X=34069]="TEXTURE_CUBE_MAP_POSITIVE_X",t[t.TEXTURE_CUBE_MAP_NEGATIVE_X=34070]="TEXTURE_CUBE_MAP_NEGATIVE_X",t[t.TEXTURE_CUBE_MAP_POSITIVE_Y=34071]="TEXTURE_CUBE_MAP_POSITIVE_Y",t[t.TEXTURE_CUBE_MAP_NEGATIVE_Y=34072]="TEXTURE_CUBE_MAP_NEGATIVE_Y",t[t.TEXTURE_CUBE_MAP_POSITIVE_Z=34073]="TEXTURE_CUBE_MAP_POSITIVE_Z",t[t.TEXTURE_CUBE_MAP_NEGATIVE_Z=34074]="TEXTURE_CUBE_MAP_NEGATIVE_Z",t[t.MAX_CUBE_MAP_TEXTURE_SIZE=34076]="MAX_CUBE_MAP_TEXTURE_SIZE",t[t.TEXTURE0=33984]="TEXTURE0",t[t.ACTIVE_TEXTURE=34016]="ACTIVE_TEXTURE",t[t.REPEAT=10497]="REPEAT",t[t.CLAMP_TO_EDGE=33071]="CLAMP_TO_EDGE",t[t.MIRRORED_REPEAT=33648]="MIRRORED_REPEAT",t[t.TEXTURE_WIDTH=4096]="TEXTURE_WIDTH",t[t.TEXTURE_HEIGHT=4097]="TEXTURE_HEIGHT",t[t.FLOAT_VEC2=35664]="FLOAT_VEC2",t[t.FLOAT_VEC3=35665]="FLOAT_VEC3",t[t.FLOAT_VEC4=35666]="FLOAT_VEC4",t[t.INT_VEC2=35667]="INT_VEC2",t[t.INT_VEC3=35668]="INT_VEC3",t[t.INT_VEC4=35669]="INT_VEC4",t[t.BOOL=35670]="BOOL",t[t.BOOL_VEC2=35671]="BOOL_VEC2",t[t.BOOL_VEC3=35672]="BOOL_VEC3",t[t.BOOL_VEC4=35673]="BOOL_VEC4",t[t.FLOAT_MAT2=35674]="FLOAT_MAT2",t[t.FLOAT_MAT3=35675]="FLOAT_MAT3",t[t.FLOAT_MAT4=35676]="FLOAT_MAT4",t[t.SAMPLER_2D=35678]="SAMPLER_2D",t[t.SAMPLER_CUBE=35680]="SAMPLER_CUBE",t[t.LOW_FLOAT=36336]="LOW_FLOAT",t[t.MEDIUM_FLOAT=36337]="MEDIUM_FLOAT",t[t.HIGH_FLOAT=36338]="HIGH_FLOAT",t[t.LOW_INT=36339]="LOW_INT",t[t.MEDIUM_INT=36340]="MEDIUM_INT",t[t.HIGH_INT=36341]="HIGH_INT",t[t.FRAMEBUFFER=36160]="FRAMEBUFFER",t[t.RENDERBUFFER=36161]="RENDERBUFFER",t[t.RGBA4=32854]="RGBA4",t[t.RGB5_A1=32855]="RGB5_A1",t[t.RGB565=36194]="RGB565",t[t.DEPTH_COMPONENT16=33189]="DEPTH_COMPONENT16",t[t.STENCIL_INDEX=6401]="STENCIL_INDEX",t[t.STENCIL_INDEX8=36168]="STENCIL_INDEX8",t[t.DEPTH_STENCIL=34041]="DEPTH_STENCIL",t[t.RENDERBUFFER_WIDTH=36162]="RENDERBUFFER_WIDTH",t[t.RENDERBUFFER_HEIGHT=36163]="RENDERBUFFER_HEIGHT",t[t.RENDERBUFFER_INTERNAL_FORMAT=36164]="RENDERBUFFER_INTERNAL_FORMAT",t[t.RENDERBUFFER_RED_SIZE=36176]="RENDERBUFFER_RED_SIZE",t[t.RENDERBUFFER_GREEN_SIZE=36177]="RENDERBUFFER_GREEN_SIZE",t[t.RENDERBUFFER_BLUE_SIZE=36178]="RENDERBUFFER_BLUE_SIZE",t[t.RENDERBUFFER_ALPHA_SIZE=36179]="RENDERBUFFER_ALPHA_SIZE",t[t.RENDERBUFFER_DEPTH_SIZE=36180]="RENDERBUFFER_DEPTH_SIZE",t[t.RENDERBUFFER_STENCIL_SIZE=36181]="RENDERBUFFER_STENCIL_SIZE",t[t.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE=36048]="FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE",t[t.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME=36049]="FRAMEBUFFER_ATTACHMENT_OBJECT_NAME",t[t.FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL=36050]="FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL",t[t.FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE=36051]="FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE",t[t.COLOR_ATTACHMENT0=36064]="COLOR_ATTACHMENT0",t[t.DEPTH_ATTACHMENT=36096]="DEPTH_ATTACHMENT",t[t.STENCIL_ATTACHMENT=36128]="STENCIL_ATTACHMENT",t[t.DEPTH_STENCIL_ATTACHMENT=33306]="DEPTH_STENCIL_ATTACHMENT",t[t.NONE=0]="NONE",t[t.FRAMEBUFFER_COMPLETE=36053]="FRAMEBUFFER_COMPLETE",t[t.FRAMEBUFFER_INCOMPLETE_ATTACHMENT=36054]="FRAMEBUFFER_INCOMPLETE_ATTACHMENT",t[t.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT=36055]="FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT",t[t.FRAMEBUFFER_INCOMPLETE_DIMENSIONS=36057]="FRAMEBUFFER_INCOMPLETE_DIMENSIONS",t[t.FRAMEBUFFER_UNSUPPORTED=36061]="FRAMEBUFFER_UNSUPPORTED",t[t.FRAMEBUFFER_BINDING=36006]="FRAMEBUFFER_BINDING",t[t.RENDERBUFFER_BINDING=36007]="RENDERBUFFER_BINDING",t[t.READ_FRAMEBUFFER=36008]="READ_FRAMEBUFFER",t[t.DRAW_FRAMEBUFFER=36009]="DRAW_FRAMEBUFFER",t[t.MAX_RENDERBUFFER_SIZE=34024]="MAX_RENDERBUFFER_SIZE",t[t.INVALID_FRAMEBUFFER_OPERATION=1286]="INVALID_FRAMEBUFFER_OPERATION",t[t.UNPACK_FLIP_Y_WEBGL=37440]="UNPACK_FLIP_Y_WEBGL",t[t.UNPACK_PREMULTIPLY_ALPHA_WEBGL=37441]="UNPACK_PREMULTIPLY_ALPHA_WEBGL",t[t.UNPACK_COLORSPACE_CONVERSION_WEBGL=37443]="UNPACK_COLORSPACE_CONVERSION_WEBGL",t[t.READ_BUFFER=3074]="READ_BUFFER",t[t.UNPACK_ROW_LENGTH=3314]="UNPACK_ROW_LENGTH",t[t.UNPACK_SKIP_ROWS=3315]="UNPACK_SKIP_ROWS",t[t.UNPACK_SKIP_PIXELS=3316]="UNPACK_SKIP_PIXELS",t[t.PACK_ROW_LENGTH=3330]="PACK_ROW_LENGTH",t[t.PACK_SKIP_ROWS=3331]="PACK_SKIP_ROWS",t[t.PACK_SKIP_PIXELS=3332]="PACK_SKIP_PIXELS",t[t.TEXTURE_BINDING_3D=32874]="TEXTURE_BINDING_3D",t[t.UNPACK_SKIP_IMAGES=32877]="UNPACK_SKIP_IMAGES",t[t.UNPACK_IMAGE_HEIGHT=32878]="UNPACK_IMAGE_HEIGHT",t[t.MAX_3D_TEXTURE_SIZE=32883]="MAX_3D_TEXTURE_SIZE",t[t.MAX_ELEMENTS_VERTICES=33e3]="MAX_ELEMENTS_VERTICES",t[t.MAX_ELEMENTS_INDICES=33001]="MAX_ELEMENTS_INDICES",t[t.MAX_TEXTURE_LOD_BIAS=34045]="MAX_TEXTURE_LOD_BIAS",t[t.MAX_FRAGMENT_UNIFORM_COMPONENTS=35657]="MAX_FRAGMENT_UNIFORM_COMPONENTS",t[t.MAX_VERTEX_UNIFORM_COMPONENTS=35658]="MAX_VERTEX_UNIFORM_COMPONENTS",t[t.MAX_ARRAY_TEXTURE_LAYERS=35071]="MAX_ARRAY_TEXTURE_LAYERS",t[t.MIN_PROGRAM_TEXEL_OFFSET=35076]="MIN_PROGRAM_TEXEL_OFFSET",t[t.MAX_PROGRAM_TEXEL_OFFSET=35077]="MAX_PROGRAM_TEXEL_OFFSET",t[t.MAX_VARYING_COMPONENTS=35659]="MAX_VARYING_COMPONENTS",t[t.FRAGMENT_SHADER_DERIVATIVE_HINT=35723]="FRAGMENT_SHADER_DERIVATIVE_HINT",t[t.RASTERIZER_DISCARD=35977]="RASTERIZER_DISCARD",t[t.VERTEX_ARRAY_BINDING=34229]="VERTEX_ARRAY_BINDING",t[t.MAX_VERTEX_OUTPUT_COMPONENTS=37154]="MAX_VERTEX_OUTPUT_COMPONENTS",t[t.MAX_FRAGMENT_INPUT_COMPONENTS=37157]="MAX_FRAGMENT_INPUT_COMPONENTS",t[t.MAX_SERVER_WAIT_TIMEOUT=37137]="MAX_SERVER_WAIT_TIMEOUT",t[t.MAX_ELEMENT_INDEX=36203]="MAX_ELEMENT_INDEX",t[t.RED=6403]="RED",t[t.RGB8=32849]="RGB8",t[t.RGBA8=32856]="RGBA8",t[t.RGB10_A2=32857]="RGB10_A2",t[t.TEXTURE_3D=32879]="TEXTURE_3D",t[t.TEXTURE_WRAP_R=32882]="TEXTURE_WRAP_R",t[t.TEXTURE_MIN_LOD=33082]="TEXTURE_MIN_LOD",t[t.TEXTURE_MAX_LOD=33083]="TEXTURE_MAX_LOD",t[t.TEXTURE_BASE_LEVEL=33084]="TEXTURE_BASE_LEVEL",t[t.TEXTURE_MAX_LEVEL=33085]="TEXTURE_MAX_LEVEL",t[t.TEXTURE_COMPARE_MODE=34892]="TEXTURE_COMPARE_MODE",t[t.TEXTURE_COMPARE_FUNC=34893]="TEXTURE_COMPARE_FUNC",t[t.SRGB=35904]="SRGB",t[t.SRGB8=35905]="SRGB8",t[t.SRGB8_ALPHA8=35907]="SRGB8_ALPHA8",t[t.COMPARE_REF_TO_TEXTURE=34894]="COMPARE_REF_TO_TEXTURE",t[t.RGBA32F=34836]="RGBA32F",t[t.RGB32F=34837]="RGB32F",t[t.RGBA16F=34842]="RGBA16F",t[t.RGB16F=34843]="RGB16F",t[t.TEXTURE_2D_ARRAY=35866]="TEXTURE_2D_ARRAY",t[t.TEXTURE_BINDING_2D_ARRAY=35869]="TEXTURE_BINDING_2D_ARRAY",t[t.R11F_G11F_B10F=35898]="R11F_G11F_B10F",t[t.RGB9_E5=35901]="RGB9_E5",t[t.RGBA32UI=36208]="RGBA32UI",t[t.RGB32UI=36209]="RGB32UI",t[t.RGBA16UI=36214]="RGBA16UI",t[t.RGB16UI=36215]="RGB16UI",t[t.RGBA8UI=36220]="RGBA8UI",t[t.RGB8UI=36221]="RGB8UI",t[t.RGBA32I=36226]="RGBA32I",t[t.RGB32I=36227]="RGB32I",t[t.RGBA16I=36232]="RGBA16I",t[t.RGB16I=36233]="RGB16I",t[t.RGBA8I=36238]="RGBA8I",t[t.RGB8I=36239]="RGB8I",t[t.RED_INTEGER=36244]="RED_INTEGER",t[t.RGB_INTEGER=36248]="RGB_INTEGER",t[t.RGBA_INTEGER=36249]="RGBA_INTEGER",t[t.R8=33321]="R8",t[t.RG8=33323]="RG8",t[t.R16F=33325]="R16F",t[t.R32F=33326]="R32F",t[t.RG16F=33327]="RG16F",t[t.RG32F=33328]="RG32F",t[t.R8I=33329]="R8I",t[t.R8UI=33330]="R8UI",t[t.R16I=33331]="R16I",t[t.R16UI=33332]="R16UI",t[t.R32I=33333]="R32I",t[t.R32UI=33334]="R32UI",t[t.RG8I=33335]="RG8I",t[t.RG8UI=33336]="RG8UI",t[t.RG16I=33337]="RG16I",t[t.RG16UI=33338]="RG16UI",t[t.RG32I=33339]="RG32I",t[t.RG32UI=33340]="RG32UI",t[t.R8_SNORM=36756]="R8_SNORM",t[t.RG8_SNORM=36757]="RG8_SNORM",t[t.RGB8_SNORM=36758]="RGB8_SNORM",t[t.RGBA8_SNORM=36759]="RGBA8_SNORM",t[t.RGB10_A2UI=36975]="RGB10_A2UI",t[t.TEXTURE_IMMUTABLE_FORMAT=37167]="TEXTURE_IMMUTABLE_FORMAT",t[t.TEXTURE_IMMUTABLE_LEVELS=33503]="TEXTURE_IMMUTABLE_LEVELS",t[t.UNSIGNED_INT_2_10_10_10_REV=33640]="UNSIGNED_INT_2_10_10_10_REV",t[t.UNSIGNED_INT_10F_11F_11F_REV=35899]="UNSIGNED_INT_10F_11F_11F_REV",t[t.UNSIGNED_INT_5_9_9_9_REV=35902]="UNSIGNED_INT_5_9_9_9_REV",t[t.FLOAT_32_UNSIGNED_INT_24_8_REV=36269]="FLOAT_32_UNSIGNED_INT_24_8_REV",t[t.UNSIGNED_INT_24_8=34042]="UNSIGNED_INT_24_8",t[t.HALF_FLOAT=5131]="HALF_FLOAT",t[t.RG=33319]="RG",t[t.RG_INTEGER=33320]="RG_INTEGER",t[t.INT_2_10_10_10_REV=36255]="INT_2_10_10_10_REV",t[t.CURRENT_QUERY=34917]="CURRENT_QUERY",t[t.QUERY_RESULT=34918]="QUERY_RESULT",t[t.QUERY_RESULT_AVAILABLE=34919]="QUERY_RESULT_AVAILABLE",t[t.ANY_SAMPLES_PASSED=35887]="ANY_SAMPLES_PASSED",t[t.ANY_SAMPLES_PASSED_CONSERVATIVE=36202]="ANY_SAMPLES_PASSED_CONSERVATIVE",t[t.MAX_DRAW_BUFFERS=34852]="MAX_DRAW_BUFFERS",t[t.DRAW_BUFFER0=34853]="DRAW_BUFFER0",t[t.DRAW_BUFFER1=34854]="DRAW_BUFFER1",t[t.DRAW_BUFFER2=34855]="DRAW_BUFFER2",t[t.DRAW_BUFFER3=34856]="DRAW_BUFFER3",t[t.DRAW_BUFFER4=34857]="DRAW_BUFFER4",t[t.DRAW_BUFFER5=34858]="DRAW_BUFFER5",t[t.DRAW_BUFFER6=34859]="DRAW_BUFFER6",t[t.DRAW_BUFFER7=34860]="DRAW_BUFFER7",t[t.DRAW_BUFFER8=34861]="DRAW_BUFFER8",t[t.DRAW_BUFFER9=34862]="DRAW_BUFFER9",t[t.DRAW_BUFFER10=34863]="DRAW_BUFFER10",t[t.DRAW_BUFFER11=34864]="DRAW_BUFFER11",t[t.DRAW_BUFFER12=34865]="DRAW_BUFFER12",t[t.DRAW_BUFFER13=34866]="DRAW_BUFFER13",t[t.DRAW_BUFFER14=34867]="DRAW_BUFFER14",t[t.DRAW_BUFFER15=34868]="DRAW_BUFFER15",t[t.MAX_COLOR_ATTACHMENTS=36063]="MAX_COLOR_ATTACHMENTS",t[t.COLOR_ATTACHMENT1=36065]="COLOR_ATTACHMENT1",t[t.COLOR_ATTACHMENT2=36066]="COLOR_ATTACHMENT2",t[t.COLOR_ATTACHMENT3=36067]="COLOR_ATTACHMENT3",t[t.COLOR_ATTACHMENT4=36068]="COLOR_ATTACHMENT4",t[t.COLOR_ATTACHMENT5=36069]="COLOR_ATTACHMENT5",t[t.COLOR_ATTACHMENT6=36070]="COLOR_ATTACHMENT6",t[t.COLOR_ATTACHMENT7=36071]="COLOR_ATTACHMENT7",t[t.COLOR_ATTACHMENT8=36072]="COLOR_ATTACHMENT8",t[t.COLOR_ATTACHMENT9=36073]="COLOR_ATTACHMENT9",t[t.COLOR_ATTACHMENT10=36074]="COLOR_ATTACHMENT10",t[t.COLOR_ATTACHMENT11=36075]="COLOR_ATTACHMENT11",t[t.COLOR_ATTACHMENT12=36076]="COLOR_ATTACHMENT12",t[t.COLOR_ATTACHMENT13=36077]="COLOR_ATTACHMENT13",t[t.COLOR_ATTACHMENT14=36078]="COLOR_ATTACHMENT14",t[t.COLOR_ATTACHMENT15=36079]="COLOR_ATTACHMENT15",t[t.SAMPLER_3D=35679]="SAMPLER_3D",t[t.SAMPLER_2D_SHADOW=35682]="SAMPLER_2D_SHADOW",t[t.SAMPLER_2D_ARRAY=36289]="SAMPLER_2D_ARRAY",t[t.SAMPLER_2D_ARRAY_SHADOW=36292]="SAMPLER_2D_ARRAY_SHADOW",t[t.SAMPLER_CUBE_SHADOW=36293]="SAMPLER_CUBE_SHADOW",t[t.INT_SAMPLER_2D=36298]="INT_SAMPLER_2D",t[t.INT_SAMPLER_3D=36299]="INT_SAMPLER_3D",t[t.INT_SAMPLER_CUBE=36300]="INT_SAMPLER_CUBE",t[t.INT_SAMPLER_2D_ARRAY=36303]="INT_SAMPLER_2D_ARRAY",t[t.UNSIGNED_INT_SAMPLER_2D=36306]="UNSIGNED_INT_SAMPLER_2D",t[t.UNSIGNED_INT_SAMPLER_3D=36307]="UNSIGNED_INT_SAMPLER_3D",t[t.UNSIGNED_INT_SAMPLER_CUBE=36308]="UNSIGNED_INT_SAMPLER_CUBE",t[t.UNSIGNED_INT_SAMPLER_2D_ARRAY=36311]="UNSIGNED_INT_SAMPLER_2D_ARRAY",t[t.MAX_SAMPLES=36183]="MAX_SAMPLES",t[t.SAMPLER_BINDING=35097]="SAMPLER_BINDING",t[t.PIXEL_PACK_BUFFER=35051]="PIXEL_PACK_BUFFER",t[t.PIXEL_UNPACK_BUFFER=35052]="PIXEL_UNPACK_BUFFER",t[t.PIXEL_PACK_BUFFER_BINDING=35053]="PIXEL_PACK_BUFFER_BINDING",t[t.PIXEL_UNPACK_BUFFER_BINDING=35055]="PIXEL_UNPACK_BUFFER_BINDING",t[t.COPY_READ_BUFFER=36662]="COPY_READ_BUFFER",t[t.COPY_WRITE_BUFFER=36663]="COPY_WRITE_BUFFER",t[t.COPY_READ_BUFFER_BINDING=36662]="COPY_READ_BUFFER_BINDING",t[t.COPY_WRITE_BUFFER_BINDING=36663]="COPY_WRITE_BUFFER_BINDING",t[t.FLOAT_MAT2x3=35685]="FLOAT_MAT2x3",t[t.FLOAT_MAT2x4=35686]="FLOAT_MAT2x4",t[t.FLOAT_MAT3x2=35687]="FLOAT_MAT3x2",t[t.FLOAT_MAT3x4=35688]="FLOAT_MAT3x4",t[t.FLOAT_MAT4x2=35689]="FLOAT_MAT4x2",t[t.FLOAT_MAT4x3=35690]="FLOAT_MAT4x3",t[t.UNSIGNED_INT_VEC2=36294]="UNSIGNED_INT_VEC2",t[t.UNSIGNED_INT_VEC3=36295]="UNSIGNED_INT_VEC3",t[t.UNSIGNED_INT_VEC4=36296]="UNSIGNED_INT_VEC4",t[t.UNSIGNED_NORMALIZED=35863]="UNSIGNED_NORMALIZED",t[t.SIGNED_NORMALIZED=36764]="SIGNED_NORMALIZED",t[t.VERTEX_ATTRIB_ARRAY_INTEGER=35069]="VERTEX_ATTRIB_ARRAY_INTEGER",t[t.VERTEX_ATTRIB_ARRAY_DIVISOR=35070]="VERTEX_ATTRIB_ARRAY_DIVISOR",t[t.TRANSFORM_FEEDBACK_BUFFER_MODE=35967]="TRANSFORM_FEEDBACK_BUFFER_MODE",t[t.MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS=35968]="MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS",t[t.TRANSFORM_FEEDBACK_VARYINGS=35971]="TRANSFORM_FEEDBACK_VARYINGS",t[t.TRANSFORM_FEEDBACK_BUFFER_START=35972]="TRANSFORM_FEEDBACK_BUFFER_START",t[t.TRANSFORM_FEEDBACK_BUFFER_SIZE=35973]="TRANSFORM_FEEDBACK_BUFFER_SIZE",t[t.TRANSFORM_FEEDBACK_PRIMITIVES_WRITTEN=35976]="TRANSFORM_FEEDBACK_PRIMITIVES_WRITTEN",t[t.MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS=35978]="MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS",t[t.MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS=35979]="MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS",t[t.INTERLEAVED_ATTRIBS=35980]="INTERLEAVED_ATTRIBS",t[t.SEPARATE_ATTRIBS=35981]="SEPARATE_ATTRIBS",t[t.TRANSFORM_FEEDBACK_BUFFER=35982]="TRANSFORM_FEEDBACK_BUFFER",t[t.TRANSFORM_FEEDBACK_BUFFER_BINDING=35983]="TRANSFORM_FEEDBACK_BUFFER_BINDING",t[t.TRANSFORM_FEEDBACK=36386]="TRANSFORM_FEEDBACK",t[t.TRANSFORM_FEEDBACK_PAUSED=36387]="TRANSFORM_FEEDBACK_PAUSED",t[t.TRANSFORM_FEEDBACK_ACTIVE=36388]="TRANSFORM_FEEDBACK_ACTIVE",t[t.TRANSFORM_FEEDBACK_BINDING=36389]="TRANSFORM_FEEDBACK_BINDING",t[t.FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING=33296]="FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING",t[t.FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE=33297]="FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE",t[t.FRAMEBUFFER_ATTACHMENT_RED_SIZE=33298]="FRAMEBUFFER_ATTACHMENT_RED_SIZE",t[t.FRAMEBUFFER_ATTACHMENT_GREEN_SIZE=33299]="FRAMEBUFFER_ATTACHMENT_GREEN_SIZE",t[t.FRAMEBUFFER_ATTACHMENT_BLUE_SIZE=33300]="FRAMEBUFFER_ATTACHMENT_BLUE_SIZE",t[t.FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE=33301]="FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE",t[t.FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE=33302]="FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE",t[t.FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE=33303]="FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE",t[t.FRAMEBUFFER_DEFAULT=33304]="FRAMEBUFFER_DEFAULT",t[t.DEPTH24_STENCIL8=35056]="DEPTH24_STENCIL8",t[t.DRAW_FRAMEBUFFER_BINDING=36006]="DRAW_FRAMEBUFFER_BINDING",t[t.READ_FRAMEBUFFER_BINDING=36010]="READ_FRAMEBUFFER_BINDING",t[t.RENDERBUFFER_SAMPLES=36011]="RENDERBUFFER_SAMPLES",t[t.FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER=36052]="FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER",t[t.FRAMEBUFFER_INCOMPLETE_MULTISAMPLE=36182]="FRAMEBUFFER_INCOMPLETE_MULTISAMPLE",t[t.UNIFORM_BUFFER=35345]="UNIFORM_BUFFER",t[t.UNIFORM_BUFFER_BINDING=35368]="UNIFORM_BUFFER_BINDING",t[t.UNIFORM_BUFFER_START=35369]="UNIFORM_BUFFER_START",t[t.UNIFORM_BUFFER_SIZE=35370]="UNIFORM_BUFFER_SIZE",t[t.MAX_VERTEX_UNIFORM_BLOCKS=35371]="MAX_VERTEX_UNIFORM_BLOCKS",t[t.MAX_FRAGMENT_UNIFORM_BLOCKS=35373]="MAX_FRAGMENT_UNIFORM_BLOCKS",t[t.MAX_COMBINED_UNIFORM_BLOCKS=35374]="MAX_COMBINED_UNIFORM_BLOCKS",t[t.MAX_UNIFORM_BUFFER_BINDINGS=35375]="MAX_UNIFORM_BUFFER_BINDINGS",t[t.MAX_UNIFORM_BLOCK_SIZE=35376]="MAX_UNIFORM_BLOCK_SIZE",t[t.MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS=35377]="MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS",t[t.MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS=35379]="MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS",t[t.UNIFORM_BUFFER_OFFSET_ALIGNMENT=35380]="UNIFORM_BUFFER_OFFSET_ALIGNMENT",t[t.ACTIVE_UNIFORM_BLOCKS=35382]="ACTIVE_UNIFORM_BLOCKS",t[t.UNIFORM_TYPE=35383]="UNIFORM_TYPE",t[t.UNIFORM_SIZE=35384]="UNIFORM_SIZE",t[t.UNIFORM_BLOCK_INDEX=35386]="UNIFORM_BLOCK_INDEX",t[t.UNIFORM_OFFSET=35387]="UNIFORM_OFFSET",t[t.UNIFORM_ARRAY_STRIDE=35388]="UNIFORM_ARRAY_STRIDE",t[t.UNIFORM_MATRIX_STRIDE=35389]="UNIFORM_MATRIX_STRIDE",t[t.UNIFORM_IS_ROW_MAJOR=35390]="UNIFORM_IS_ROW_MAJOR",t[t.UNIFORM_BLOCK_BINDING=35391]="UNIFORM_BLOCK_BINDING",t[t.UNIFORM_BLOCK_DATA_SIZE=35392]="UNIFORM_BLOCK_DATA_SIZE",t[t.UNIFORM_BLOCK_ACTIVE_UNIFORMS=35394]="UNIFORM_BLOCK_ACTIVE_UNIFORMS",t[t.UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES=35395]="UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES",t[t.UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER=35396]="UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER",t[t.UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER=35398]="UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER",t[t.OBJECT_TYPE=37138]="OBJECT_TYPE",t[t.SYNC_CONDITION=37139]="SYNC_CONDITION",t[t.SYNC_STATUS=37140]="SYNC_STATUS",t[t.SYNC_FLAGS=37141]="SYNC_FLAGS",t[t.SYNC_FENCE=37142]="SYNC_FENCE",t[t.SYNC_GPU_COMMANDS_COMPLETE=37143]="SYNC_GPU_COMMANDS_COMPLETE",t[t.UNSIGNALED=37144]="UNSIGNALED",t[t.SIGNALED=37145]="SIGNALED",t[t.ALREADY_SIGNALED=37146]="ALREADY_SIGNALED",t[t.TIMEOUT_EXPIRED=37147]="TIMEOUT_EXPIRED",t[t.CONDITION_SATISFIED=37148]="CONDITION_SATISFIED",t[t.WAIT_FAILED=37149]="WAIT_FAILED",t[t.SYNC_FLUSH_COMMANDS_BIT=1]="SYNC_FLUSH_COMMANDS_BIT",t[t.COLOR=6144]="COLOR",t[t.DEPTH=6145]="DEPTH",t[t.STENCIL=6146]="STENCIL",t[t.MIN=32775]="MIN",t[t.MAX=32776]="MAX",t[t.DEPTH_COMPONENT24=33190]="DEPTH_COMPONENT24",t[t.STREAM_READ=35041]="STREAM_READ",t[t.STREAM_COPY=35042]="STREAM_COPY",t[t.STATIC_READ=35045]="STATIC_READ",t[t.STATIC_COPY=35046]="STATIC_COPY",t[t.DYNAMIC_READ=35049]="DYNAMIC_READ",t[t.DYNAMIC_COPY=35050]="DYNAMIC_COPY",t[t.DEPTH_COMPONENT32F=36012]="DEPTH_COMPONENT32F",t[t.DEPTH32F_STENCIL8=36013]="DEPTH32F_STENCIL8",t[t.INVALID_INDEX=4294967295]="INVALID_INDEX",t[t.TIMEOUT_IGNORED=-1]="TIMEOUT_IGNORED",t[t.MAX_CLIENT_WAIT_TIMEOUT_WEBGL=37447]="MAX_CLIENT_WAIT_TIMEOUT_WEBGL",t[t.UNMASKED_VENDOR_WEBGL=37445]="UNMASKED_VENDOR_WEBGL",t[t.UNMASKED_RENDERER_WEBGL=37446]="UNMASKED_RENDERER_WEBGL",t[t.MAX_TEXTURE_MAX_ANISOTROPY_EXT=34047]="MAX_TEXTURE_MAX_ANISOTROPY_EXT",t[t.TEXTURE_MAX_ANISOTROPY_EXT=34046]="TEXTURE_MAX_ANISOTROPY_EXT",t[t.R16_EXT=33322]="R16_EXT",t[t.RG16_EXT=33324]="RG16_EXT",t[t.RGB16_EXT=32852]="RGB16_EXT",t[t.RGBA16_EXT=32859]="RGBA16_EXT",t[t.R16_SNORM_EXT=36760]="R16_SNORM_EXT",t[t.RG16_SNORM_EXT=36761]="RG16_SNORM_EXT",t[t.RGB16_SNORM_EXT=36762]="RGB16_SNORM_EXT",t[t.RGBA16_SNORM_EXT=36763]="RGBA16_SNORM_EXT",t[t.COMPRESSED_RGB_S3TC_DXT1_EXT=33776]="COMPRESSED_RGB_S3TC_DXT1_EXT",t[t.COMPRESSED_RGBA_S3TC_DXT1_EXT=33777]="COMPRESSED_RGBA_S3TC_DXT1_EXT",t[t.COMPRESSED_RGBA_S3TC_DXT3_EXT=33778]="COMPRESSED_RGBA_S3TC_DXT3_EXT",t[t.COMPRESSED_RGBA_S3TC_DXT5_EXT=33779]="COMPRESSED_RGBA_S3TC_DXT5_EXT",t[t.COMPRESSED_SRGB_S3TC_DXT1_EXT=35916]="COMPRESSED_SRGB_S3TC_DXT1_EXT",t[t.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT=35917]="COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT",t[t.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT=35918]="COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT",t[t.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT=35919]="COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT",t[t.COMPRESSED_RED_RGTC1_EXT=36283]="COMPRESSED_RED_RGTC1_EXT",t[t.COMPRESSED_SIGNED_RED_RGTC1_EXT=36284]="COMPRESSED_SIGNED_RED_RGTC1_EXT",t[t.COMPRESSED_RED_GREEN_RGTC2_EXT=36285]="COMPRESSED_RED_GREEN_RGTC2_EXT",t[t.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT=36286]="COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT",t[t.COMPRESSED_RGBA_BPTC_UNORM_EXT=36492]="COMPRESSED_RGBA_BPTC_UNORM_EXT",t[t.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT=36493]="COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT",t[t.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT=36494]="COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT",t[t.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT=36495]="COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT",t[t.COMPRESSED_R11_EAC=37488]="COMPRESSED_R11_EAC",t[t.COMPRESSED_SIGNED_R11_EAC=37489]="COMPRESSED_SIGNED_R11_EAC",t[t.COMPRESSED_RG11_EAC=37490]="COMPRESSED_RG11_EAC",t[t.COMPRESSED_SIGNED_RG11_EAC=37491]="COMPRESSED_SIGNED_RG11_EAC",t[t.COMPRESSED_RGB8_ETC2=37492]="COMPRESSED_RGB8_ETC2",t[t.COMPRESSED_RGBA8_ETC2_EAC=37493]="COMPRESSED_RGBA8_ETC2_EAC",t[t.COMPRESSED_SRGB8_ETC2=37494]="COMPRESSED_SRGB8_ETC2",t[t.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC=37495]="COMPRESSED_SRGB8_ALPHA8_ETC2_EAC",t[t.COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2=37496]="COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2",t[t.COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2=37497]="COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2",t[t.COMPRESSED_RGB_PVRTC_4BPPV1_IMG=35840]="COMPRESSED_RGB_PVRTC_4BPPV1_IMG",t[t.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG=35842]="COMPRESSED_RGBA_PVRTC_4BPPV1_IMG",t[t.COMPRESSED_RGB_PVRTC_2BPPV1_IMG=35841]="COMPRESSED_RGB_PVRTC_2BPPV1_IMG",t[t.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG=35843]="COMPRESSED_RGBA_PVRTC_2BPPV1_IMG",t[t.COMPRESSED_RGB_ETC1_WEBGL=36196]="COMPRESSED_RGB_ETC1_WEBGL",t[t.COMPRESSED_RGB_ATC_WEBGL=35986]="COMPRESSED_RGB_ATC_WEBGL",t[t.COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL=35986]="COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL",t[t.COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL=34798]="COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL",t[t.COMPRESSED_RGBA_ASTC_4x4_KHR=37808]="COMPRESSED_RGBA_ASTC_4x4_KHR",t[t.COMPRESSED_RGBA_ASTC_5x4_KHR=37809]="COMPRESSED_RGBA_ASTC_5x4_KHR",t[t.COMPRESSED_RGBA_ASTC_5x5_KHR=37810]="COMPRESSED_RGBA_ASTC_5x5_KHR",t[t.COMPRESSED_RGBA_ASTC_6x5_KHR=37811]="COMPRESSED_RGBA_ASTC_6x5_KHR",t[t.COMPRESSED_RGBA_ASTC_6x6_KHR=37812]="COMPRESSED_RGBA_ASTC_6x6_KHR",t[t.COMPRESSED_RGBA_ASTC_8x5_KHR=37813]="COMPRESSED_RGBA_ASTC_8x5_KHR",t[t.COMPRESSED_RGBA_ASTC_8x6_KHR=37814]="COMPRESSED_RGBA_ASTC_8x6_KHR",t[t.COMPRESSED_RGBA_ASTC_8x8_KHR=37815]="COMPRESSED_RGBA_ASTC_8x8_KHR",t[t.COMPRESSED_RGBA_ASTC_10x5_KHR=37816]="COMPRESSED_RGBA_ASTC_10x5_KHR",t[t.COMPRESSED_RGBA_ASTC_10x6_KHR=37817]="COMPRESSED_RGBA_ASTC_10x6_KHR",t[t.COMPRESSED_RGBA_ASTC_10x8_KHR=37818]="COMPRESSED_RGBA_ASTC_10x8_KHR",t[t.COMPRESSED_RGBA_ASTC_10x10_KHR=37819]="COMPRESSED_RGBA_ASTC_10x10_KHR",t[t.COMPRESSED_RGBA_ASTC_12x10_KHR=37820]="COMPRESSED_RGBA_ASTC_12x10_KHR",t[t.COMPRESSED_RGBA_ASTC_12x12_KHR=37821]="COMPRESSED_RGBA_ASTC_12x12_KHR",t[t.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR=37840]="COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR",t[t.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR=37841]="COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR",t[t.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR=37842]="COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR",t[t.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR=37843]="COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR",t[t.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR=37844]="COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR",t[t.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR=37845]="COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR",t[t.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR=37846]="COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR",t[t.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR=37847]="COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR",t[t.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR=37848]="COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR",t[t.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR=37849]="COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR",t[t.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR=37850]="COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR",t[t.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR=37851]="COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR",t[t.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR=37852]="COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR",t[t.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR=37853]="COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR",t[t.QUERY_COUNTER_BITS_EXT=34916]="QUERY_COUNTER_BITS_EXT",t[t.CURRENT_QUERY_EXT=34917]="CURRENT_QUERY_EXT",t[t.QUERY_RESULT_EXT=34918]="QUERY_RESULT_EXT",t[t.QUERY_RESULT_AVAILABLE_EXT=34919]="QUERY_RESULT_AVAILABLE_EXT",t[t.TIME_ELAPSED_EXT=35007]="TIME_ELAPSED_EXT",t[t.TIMESTAMP_EXT=36392]="TIMESTAMP_EXT",t[t.GPU_DISJOINT_EXT=36795]="GPU_DISJOINT_EXT",t[t.COMPLETION_STATUS_KHR=37297]="COMPLETION_STATUS_KHR",t[t.DEPTH_CLAMP_EXT=34383]="DEPTH_CLAMP_EXT",t[t.FIRST_VERTEX_CONVENTION_WEBGL=36429]="FIRST_VERTEX_CONVENTION_WEBGL",t[t.LAST_VERTEX_CONVENTION_WEBGL=36430]="LAST_VERTEX_CONVENTION_WEBGL",t[t.PROVOKING_VERTEX_WEBL=36431]="PROVOKING_VERTEX_WEBL",t[t.POLYGON_MODE_WEBGL=2880]="POLYGON_MODE_WEBGL",t[t.POLYGON_OFFSET_LINE_WEBGL=10754]="POLYGON_OFFSET_LINE_WEBGL",t[t.LINE_WEBGL=6913]="LINE_WEBGL",t[t.FILL_WEBGL=6914]="FILL_WEBGL",t[t.MAX_CLIP_DISTANCES_WEBGL=3378]="MAX_CLIP_DISTANCES_WEBGL",t[t.MAX_CULL_DISTANCES_WEBGL=33529]="MAX_CULL_DISTANCES_WEBGL",t[t.MAX_COMBINED_CLIP_AND_CULL_DISTANCES_WEBGL=33530]="MAX_COMBINED_CLIP_AND_CULL_DISTANCES_WEBGL",t[t.CLIP_DISTANCE0_WEBGL=12288]="CLIP_DISTANCE0_WEBGL",t[t.CLIP_DISTANCE1_WEBGL=12289]="CLIP_DISTANCE1_WEBGL",t[t.CLIP_DISTANCE2_WEBGL=12290]="CLIP_DISTANCE2_WEBGL",t[t.CLIP_DISTANCE3_WEBGL=12291]="CLIP_DISTANCE3_WEBGL",t[t.CLIP_DISTANCE4_WEBGL=12292]="CLIP_DISTANCE4_WEBGL",t[t.CLIP_DISTANCE5_WEBGL=12293]="CLIP_DISTANCE5_WEBGL",t[t.CLIP_DISTANCE6_WEBGL=12294]="CLIP_DISTANCE6_WEBGL",t[t.CLIP_DISTANCE7_WEBGL=12295]="CLIP_DISTANCE7_WEBGL",t[t.POLYGON_OFFSET_CLAMP_EXT=36379]="POLYGON_OFFSET_CLAMP_EXT",t[t.LOWER_LEFT_EXT=36001]="LOWER_LEFT_EXT",t[t.UPPER_LEFT_EXT=36002]="UPPER_LEFT_EXT",t[t.NEGATIVE_ONE_TO_ONE_EXT=37726]="NEGATIVE_ONE_TO_ONE_EXT",t[t.ZERO_TO_ONE_EXT=37727]="ZERO_TO_ONE_EXT",t[t.CLIP_ORIGIN_EXT=37724]="CLIP_ORIGIN_EXT",t[t.CLIP_DEPTH_MODE_EXT=37725]="CLIP_DEPTH_MODE_EXT",t[t.SRC1_COLOR_WEBGL=35065]="SRC1_COLOR_WEBGL",t[t.SRC1_ALPHA_WEBGL=34185]="SRC1_ALPHA_WEBGL",t[t.ONE_MINUS_SRC1_COLOR_WEBGL=35066]="ONE_MINUS_SRC1_COLOR_WEBGL",t[t.ONE_MINUS_SRC1_ALPHA_WEBGL=35067]="ONE_MINUS_SRC1_ALPHA_WEBGL",t[t.MAX_DUAL_SOURCE_DRAW_BUFFERS_WEBGL=35068]="MAX_DUAL_SOURCE_DRAW_BUFFERS_WEBGL",t[t.MIRROR_CLAMP_TO_EDGE_EXT=34627]="MIRROR_CLAMP_TO_EDGE_EXT"},97175:function(e,t,r){"use strict";let i,n;var s,o=Object.defineProperty,a=Object.getOwnPropertyDescriptor,l=Object.getOwnPropertyNames,u=Object.prototype.hasOwnProperty,c=(e,t,r)=>t in e?o(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,h=(e,t,r)=>(c(e,"symbol"!=typeof t?t+"":t,r),r),f={};((e,t)=>{for(var r in t)o(e,r,{get:t[r],enumerable:!0})})(f,{Adapter:()=>ei,Buffer:()=>b,CanvasContext:()=>eu,CommandBuffer:()=>eU,CommandEncoder:()=>eB,ComputePass:()=>eL,ComputePipeline:()=>eO,Device:()=>Q,DeviceFeatures:()=>Z,DeviceLimits:()=>Y,ExternalTexture:()=>eb,Framebuffer:()=>eM,PipelineLayout:()=>eQ,QuerySet:()=>eZ,RenderPass:()=>ew,RenderPipeline:()=>eC,Resource:()=>E,Sampler:()=>ed,Shader:()=>eR,Texture:()=>e_,TextureFormatDecoder:()=>X,TextureView:()=>eE,TransformFeedback:()=>eq,UniformBlock:()=>e3,UniformBufferLayout:()=>e2,UniformStore:()=>e4,VertexArray:()=>eX,_getTextureFormatDefinition:()=>H,_getTextureFormatTable:()=>V,getAttributeInfosFromLayouts:()=>ej,getAttributeShaderTypeInfo:()=>eG,getDataType:()=>T,getDataTypeInfo:()=>A,getNormalizedDataType:()=>y,getScratchArray:()=>e0,getTypedArrayConstructor:()=>R,getVariableShaderTypeInfo:()=>ek,getVertexFormatFromAttribute:()=>C,getVertexFormatInfo:()=>M,log:()=>g,luma:()=>et,makeVertexFormat:()=>I,readPixel:()=>e6,textureFormatDecoder:()=>$,writePixel:()=>e5}),e.exports=((e,t,r,i)=>{if(t&&"object"==typeof t||"function"==typeof t)for(let n of l(t))u.call(e,n)||n===r||o(e,n,{get:()=>t[n],enumerable:!(i=a(t,n))||i.enumerable});return e})(o({},"__esModule",{value:!0}),f);var d=r(83406),p=new class{stats=new Map;getStats(e){return this.get(e)}get(e){return this.stats.has(e)||this.stats.set(e,new d.Stats({id:e})),this.stats.get(e)}},g=new(r(18613)).Log({id:"luma.gl"}),_={};function m(e="id"){_[e]=_[e]||1;let t=_[e]++;return`${e}-${t}`}var E=class{toString(){return`${this[Symbol.toStringTag]||this.constructor.name}:"${this.id}"`}id;props;userData={};_device;destroyed=!1;allocatedBytes=0;_attachedResources=new Set;constructor(e,t,r){if(!e)throw Error("no device");this._device=e,this.props=function(e,t){let r={...t};for(let t in e)void 0!==e[t]&&(r[t]=e[t]);return r}(t,r);let i="undefined"!==this.props.id?this.props.id:m(this[Symbol.toStringTag]);this.props.id=i,this.id=i,this.userData=this.props.userData||{},this.addStats()}destroy(){this.destroyResource()}delete(){return this.destroy(),this}getProps(){return this.props}attachResource(e){this._attachedResources.add(e)}detachResource(e){this._attachedResources.delete(e)}destroyAttachedResource(e){this._attachedResources.delete(e)&&e.destroy()}destroyAttachedResources(){for(let e of Object.values(this._attachedResources))e.destroy();this._attachedResources=new Set}destroyResource(){this.destroyAttachedResources(),this.removeStats(),this.destroyed=!0}removeStats(){let e=this._device.statsManager.getStats("Resource Counts"),t=this[Symbol.toStringTag];e.get(`${t}s Active`).decrementCount()}trackAllocatedMemory(e,t=this[Symbol.toStringTag]){let r=this._device.statsManager.getStats("Resource Counts");r.get("GPU Memory").addCount(e),r.get(`${t} Memory`).addCount(e),this.allocatedBytes=e}trackDeallocatedMemory(e=this[Symbol.toStringTag]){let t=this._device.statsManager.getStats("Resource Counts");t.get("GPU Memory").subtractCount(this.allocatedBytes),t.get(`${e} Memory`).subtractCount(this.allocatedBytes),this.allocatedBytes=0}addStats(){let e=this._device.statsManager.getStats("Resource Counts"),t=this[Symbol.toStringTag];e.get("Resources Created").incrementCount(),e.get(`${t}s Created`).incrementCount(),e.get(`${t}s Active`).incrementCount()}};h(E,"defaultProps",{id:"undefined",handle:void 0,userData:void 0});var v=class extends E{get[Symbol.toStringTag](){return"Buffer"}usage;indexType;updateTimestamp;constructor(e,t){let r={...t};(t.usage||0)&v.INDEX&&!t.indexType&&(t.data instanceof Uint32Array?r.indexType="uint32":t.data instanceof Uint16Array&&(r.indexType="uint16")),delete r.data,super(e,r,v.defaultProps),this.usage=r.usage||0,this.indexType=r.indexType,this.updateTimestamp=e.incrementTimestamp()}clone(e){return this.device.createBuffer({...this.props,...e})}debugData=new ArrayBuffer(0);_setDebugData(e,t,r){let i=ArrayBuffer.isView(e)?e.buffer:e,n=Math.min(e?e.byteLength:r,v.DEBUG_DATA_MAX_LENGTH);null===i?this.debugData=new ArrayBuffer(n):0===t&&r===i.byteLength?this.debugData=i.slice(0,n):this.debugData=i.slice(t,t+n)}},b=v;function A(e){let[t,r,i]=S[e],n=e.includes("norm"),s=!n&&!e.startsWith("float");return{signedType:t,primitiveType:r,byteLength:i,normalized:n,integer:s,signed:e.startsWith("s")}}function y(e){switch(e){case"uint8":return"unorm8";case"sint8":return"snorm8";case"uint16":return"unorm16";case"sint16":return"snorm16";default:return e}}function T(e){let t=ArrayBuffer.isView(e)?e.constructor:e;if(t===Uint8ClampedArray)return"uint8";let r=Object.values(S).find(e=>t===e[4]);if(!r)throw Error(t.name);return r[0]}function R(e){let[,,,,t]=S[e];return t}h(b,"INDEX",16),h(b,"VERTEX",32),h(b,"UNIFORM",64),h(b,"STORAGE",128),h(b,"INDIRECT",256),h(b,"QUERY_RESOLVE",512),h(b,"MAP_READ",1),h(b,"MAP_WRITE",2),h(b,"COPY_SRC",4),h(b,"COPY_DST",8),h(b,"DEBUG_DATA_MAX_LENGTH",32),h(b,"defaultProps",{...E.defaultProps,usage:0,byteLength:0,byteOffset:0,data:null,indexType:"uint16",onMapped:void 0});var S={uint8:["uint8","u32",1,!1,Uint8Array],sint8:["sint8","i32",1,!1,Int8Array],unorm8:["uint8","f32",1,!0,Uint8Array],snorm8:["sint8","f32",1,!0,Int8Array],uint16:["uint16","u32",2,!1,Uint16Array],sint16:["sint16","i32",2,!1,Int16Array],unorm16:["uint16","u32",2,!0,Uint16Array],snorm16:["sint16","i32",2,!0,Int16Array],float16:["float16","f16",2,!1,Uint16Array],float32:["float32","f32",4,!1,Float32Array],uint32:["uint32","u32",4,!1,Uint32Array],sint32:["sint32","i32",4,!1,Int32Array]};function M(e){let t;e.endsWith("-webgl")&&(e.replace("-webgl",""),t=!0);let[r,i]=e.split("x"),n=i?parseInt(i):1,s=A(r),o={type:r,components:n,byteLength:s.byteLength*n,integer:s.integer,signed:s.signed,normalized:s.normalized};return t&&(o.webglOnly=!0),o}function I(e,t,r){let i=r?y(e):e;switch(i){case"unorm8":if(1===t)return"unorm8";if(3===t)return"unorm8x3-webgl";return`${i}x${t}`;case"snorm8":case"uint8":case"sint8":case"uint16":case"sint16":case"unorm16":case"snorm16":case"float16":if(1===t||3===t)throw Error(`size: ${t}`);return`${i}x${t}`;default:return 1===t?i:`${i}x${t}`}}function C(e,t,r){if(!t||t>4)throw Error(`size ${t}`);return I(T(e),t,r)}var x="texture-compression-bc",w="texture-compression-astc",N="texture-compression-etc2",O="texture-compression-pvrtc-webgl",P="texture-compression-atc-webgl",L="float32-renderable-webgl",F="float16-renderable-webgl",B="snorm8-renderable-webgl",D="norm16-renderable-webgl",U="snorm16-renderable-webgl",k="float32-filterable",G="float16-filterable-webgl";function H(e){let t=z[e];if(!t)throw Error(`Unsupported texture format ${e}`);return t}function V(){return z}var z={r8unorm:{},rg8unorm:{},"rgb8unorm-webgl":{},rgba8unorm:{},"rgba8unorm-srgb":{},r8snorm:{render:B},rg8snorm:{render:B},"rgb8snorm-webgl":{},rgba8snorm:{render:B},r8uint:{},rg8uint:{},rgba8uint:{},r8sint:{},rg8sint:{},rgba8sint:{},bgra8unorm:{},"bgra8unorm-srgb":{},r16unorm:{f:D},rg16unorm:{render:D},"rgb16unorm-webgl":{f:D},rgba16unorm:{render:D},r16snorm:{f:U},rg16snorm:{render:U},"rgb16snorm-webgl":{f:D},rgba16snorm:{render:U},r16uint:{},rg16uint:{},rgba16uint:{},r16sint:{},rg16sint:{},rgba16sint:{},r16float:{render:F,filter:"float16-filterable-webgl"},rg16float:{render:F,filter:G},rgba16float:{render:F,filter:G},r32uint:{},rg32uint:{},rgba32uint:{},r32sint:{},rg32sint:{},rgba32sint:{},r32float:{render:L,filter:k},rg32float:{render:!1,filter:k},"rgb32float-webgl":{render:L,filter:k},rgba32float:{render:L,filter:k},"rgba4unorm-webgl":{channels:"rgba",bitsPerChannel:[4,4,4,4],packed:!0},"rgb565unorm-webgl":{channels:"rgb",bitsPerChannel:[5,6,5,0],packed:!0},"rgb5a1unorm-webgl":{channels:"rgba",bitsPerChannel:[5,5,5,1],packed:!0},rgb9e5ufloat:{channels:"rgb",packed:!0,render:"rgb9e5ufloat-renderable-webgl"},rg11b10ufloat:{channels:"rgb",bitsPerChannel:[11,11,10,0],packed:!0,p:1,render:L},rgb10a2unorm:{channels:"rgba",bitsPerChannel:[10,10,10,2],packed:!0,p:1},rgb10a2uint:{channels:"rgba",bitsPerChannel:[10,10,10,2],packed:!0,p:1},stencil8:{attachment:"stencil",bitsPerChannel:[8,0,0,0],dataType:"uint8"},depth16unorm:{attachment:"depth",bitsPerChannel:[16,0,0,0],dataType:"uint16"},depth24plus:{attachment:"depth",bitsPerChannel:[24,0,0,0],dataType:"uint32"},depth32float:{attachment:"depth",bitsPerChannel:[32,0,0,0],dataType:"float32"},"depth24plus-stencil8":{attachment:"depth-stencil",bitsPerChannel:[24,8,0,0],packed:!0},"depth32float-stencil8":{attachment:"depth-stencil",bitsPerChannel:[32,8,0,0],packed:!0},"bc1-rgb-unorm-webgl":{f:x},"bc1-rgb-unorm-srgb-webgl":{f:x},"bc1-rgba-unorm":{f:x},"bc1-rgba-unorm-srgb":{f:x},"bc2-rgba-unorm":{f:x},"bc2-rgba-unorm-srgb":{f:x},"bc3-rgba-unorm":{f:x},"bc3-rgba-unorm-srgb":{f:x},"bc4-r-unorm":{f:x},"bc4-r-snorm":{f:x},"bc5-rg-unorm":{f:x},"bc5-rg-snorm":{f:x},"bc6h-rgb-ufloat":{f:x},"bc6h-rgb-float":{f:x},"bc7-rgba-unorm":{f:x},"bc7-rgba-unorm-srgb":{f:x},"etc2-rgb8unorm":{f:N},"etc2-rgb8unorm-srgb":{f:N},"etc2-rgb8a1unorm":{f:N},"etc2-rgb8a1unorm-srgb":{f:N},"etc2-rgba8unorm":{f:N},"etc2-rgba8unorm-srgb":{f:N},"eac-r11unorm":{f:N},"eac-r11snorm":{f:N},"eac-rg11unorm":{f:N},"eac-rg11snorm":{f:N},"astc-4x4-unorm":{f:w},"astc-4x4-unorm-srgb":{f:w},"astc-5x4-unorm":{f:w},"astc-5x4-unorm-srgb":{f:w},"astc-5x5-unorm":{f:w},"astc-5x5-unorm-srgb":{f:w},"astc-6x5-unorm":{f:w},"astc-6x5-unorm-srgb":{f:w},"astc-6x6-unorm":{f:w},"astc-6x6-unorm-srgb":{f:w},"astc-8x5-unorm":{f:w},"astc-8x5-unorm-srgb":{f:w},"astc-8x6-unorm":{f:w},"astc-8x6-unorm-srgb":{f:w},"astc-8x8-unorm":{f:w},"astc-8x8-unorm-srgb":{f:w},"astc-10x5-unorm":{f:w},"astc-10x5-unorm-srgb":{f:w},"astc-10x6-unorm":{f:w},"astc-10x6-unorm-srgb":{f:w},"astc-10x8-unorm":{f:w},"astc-10x8-unorm-srgb":{f:w},"astc-10x10-unorm":{f:w},"astc-10x10-unorm-srgb":{f:w},"astc-12x10-unorm":{f:w},"astc-12x10-unorm-srgb":{f:w},"astc-12x12-unorm":{f:w},"astc-12x12-unorm-srgb":{f:w},"pvrtc-rgb4unorm-webgl":{f:O},"pvrtc-rgba4unorm-webgl":{f:O},"pvrtc-rbg2unorm-webgl":{f:O},"pvrtc-rgba2unorm-webgl":{f:O},"etc1-rbg-unorm-webgl":{f:"texture-compression-etc1-webgl"},"atc-rgb-unorm-webgl":{f:P},"atc-rgba-unorm-webgl":{f:P},"atc-rgbai-unorm-webgl":{f:P}},j=["bc1","bc2","bc3","bc4","bc5","bc6","bc7","etc1","etc2","eac","atc","astc","pvrtc"],W=/^(r|rg|rgb|rgba|bgra)([0-9]*)([a-z]*)(-srgb)?(-webgl)?$/,X=class{getInfo(e){return q(e)}isColor(e){return e.startsWith("rgba")||e.startsWith("bgra")||e.startsWith("rgb")}isDepthStencil(e){return e.startsWith("depth")||e.startsWith("stencil")}isCompressed(e){return j.some(t=>e.startsWith(t))}getCapabilities(e){let t=H(e),r={format:e,create:t.f??!0,render:t.render??!0,filter:t.filter??!0,blend:t.blend??!0,store:t.store??!0},i=q(e),n=e.startsWith("depth")||e.startsWith("stencil"),s=null==i?void 0:i.signed,o=null==i?void 0:i.integer,a=null==i?void 0:i.webgl;return r.render&&=!s,r.filter&&=!n&&!s&&!o&&!a,r}},$=new X;function q(e){let t=function(e){var t;let r=H(e),i=r.bytesPerPixel||1,n=r.bitsPerChannel||[8,8,8,8];return delete r.bitsPerChannel,delete r.bytesPerPixel,delete r.f,delete r.render,delete r.filter,delete r.blend,delete r.store,{...r,format:e,attachment:r.attachment||"color",channels:r.channels||"r",components:r.components||(null==(t=r.channels)?void 0:t.length)||1,bytesPerPixel:i,bitsPerChannel:n,dataType:r.dataType||"uint8",srgb:r.srgb??!1,packed:r.packed??!1,webgl:r.webgl??!1,integer:r.integer??!1,signed:r.signed??!1,normalized:r.normalized??!1,compressed:r.compressed??!1}}(e);if($.isCompressed(e)){t.channels="rgb",t.components=3,t.bytesPerPixel=1,t.srgb=!1,t.compressed=!0;let r=function(e){let t=/.*-(\d+)x(\d+)-.*/.exec(e);if(t){let[,e,r]=t;return{blockWidth:Number(e),blockHeight:Number(r)}}return null}(e);r&&(t.blockWidth=r.blockWidth,t.blockHeight=r.blockHeight)}let r=W.exec(e);if(r){let[,i,n,s,o,a]=r,l=A(`${s}${n}`),u=8*l.byteLength,c=i.length;t={format:e,attachment:t.attachment,dataType:l.signedType,components:c,channels:i,integer:l.integer,signed:l.signed,normalized:l.normalized,bitsPerChannel:[u,c>=2?u:0,c>=3?u:0,c>=4?u:0],bytesPerPixel:l.byteLength*i.length,packed:t.packed,srgb:t.srgb},"-webgl"===a&&(t.webgl=!0),"-srgb"===o&&(t.srgb=!0)}return e.endsWith("-webgl")&&(t.webgl=!0),e.endsWith("-srgb")&&(t.srgb=!0),t}var Y=class{},Z=class{features;disabledFeatures;constructor(e=[],t){this.features=new Set(e),this.disabledFeatures=t||{}}*[Symbol.iterator](){yield*this.features}has(e){var t;return!(null==(t=this.disabledFeatures)?void 0:t[e])&&this.features.has(e)}},K=class{get[Symbol.toStringTag](){return"Device"}toString(){return`Device(${this.id})`}id;props;userData={};statsManager=p;timestamp=0;_reused=!1;_lumaData={};_textureCaps={};constructor(e){this.props={...K.defaultProps,...e},this.id=this.props.id||m(this[Symbol.toStringTag].toLowerCase())}getVertexFormatInfo(e){return M(e)}isVertexFormatSupported(e){return!0}getTextureFormatInfo(e){return $.getInfo(e)}getTextureFormatCapabilities(e){let t=this._textureCaps[e];if(!t){let r=this._getDeviceTextureFormatCapabilities(e);t=this._getDeviceSpecificTextureFormatCapabilities(r),this._textureCaps[e]=t}return t}getMipLevelCount(e,t,r=1){return 1+Math.floor(Math.log2(Math.max(e,t,r)))}isExternalImage(e){return"undefined"!=typeof ImageData&&e instanceof ImageData||"undefined"!=typeof ImageBitmap&&e instanceof ImageBitmap||"undefined"!=typeof HTMLImageElement&&e instanceof HTMLImageElement||"undefined"!=typeof HTMLVideoElement&&e instanceof HTMLVideoElement||"undefined"!=typeof VideoFrame&&e instanceof VideoFrame||"undefined"!=typeof HTMLCanvasElement&&e instanceof HTMLCanvasElement||"undefined"!=typeof OffscreenCanvas&&e instanceof OffscreenCanvas}getExternalImageSize(e){return function(e){if("undefined"!=typeof ImageData&&e instanceof ImageData||"undefined"!=typeof ImageBitmap&&e instanceof ImageBitmap||"undefined"!=typeof HTMLCanvasElement&&e instanceof HTMLCanvasElement||"undefined"!=typeof OffscreenCanvas&&e instanceof OffscreenCanvas)return{width:e.width,height:e.height};if("undefined"!=typeof HTMLImageElement&&e instanceof HTMLImageElement)return{width:e.naturalWidth,height:e.naturalHeight};if("undefined"!=typeof HTMLVideoElement&&e instanceof HTMLVideoElement)return{width:e.videoWidth,height:e.videoHeight};if("undefined"!=typeof VideoFrame&&e instanceof VideoFrame)return{width:e.displayWidth,height:e.displayHeight};throw Error("Unknown image type")}(e)}isTextureFormatSupported(e){return this.getTextureFormatCapabilities(e).create}isTextureFormatFilterable(e){return this.getTextureFormatCapabilities(e).filter}isTextureFormatRenderable(e){return this.getTextureFormatCapabilities(e).render}isTextureFormatCompressed(e){return $.isCompressed(e)}pushDebugGroup(e){this.commandEncoder.pushDebugGroup(e)}popDebugGroup(){var e;null==(e=this.commandEncoder)||e.popDebugGroup()}insertDebugMarker(e){var t;null==(t=this.commandEncoder)||t.insertDebugMarker(e)}loseDevice(){return!1}incrementTimestamp(){return this.timestamp++}reportError(e,t,...r){return this.props.onError(e,t)?()=>{}:g.error(e.message,t,...r)}debug(){if(this.props.debug);else{let e=`'Type luma.log.set({debug: true}) in console to enable debug breakpoints',
or create a device with the 'debug: true' prop.`;g.once(0,e)()}}getDefaultCanvasContext(){if(!this.canvasContext)throw Error("Device has no default CanvasContext. See props.createCanvasContext");return this.canvasContext}beginRenderPass(e){return this.commandEncoder.beginRenderPass(e)}beginComputePass(e){return this.commandEncoder.beginComputePass(e)}getCanvasContext(){return this.getDefaultCanvasContext()}readPixelsToArrayWebGL(e,t){throw Error("not implemented")}readPixelsToBufferWebGL(e,t){throw Error("not implemented")}setParametersWebGL(e){throw Error("not implemented")}getParametersWebGL(e){throw Error("not implemented")}withParametersWebGL(e,t){throw Error("not implemented")}clearWebGL(e){throw Error("not implemented")}resetWebGL(){throw Error("not implemented")}static _getCanvasContextProps(e){return!0===e.createCanvasContext?{}:e.createCanvasContext}_getDeviceTextureFormatCapabilities(e){let t=$.getCapabilities(e),r=e=>("string"==typeof e?this.features.has(e):e)??!0,i=r(t.create);return{format:e,create:i,render:i&&r(t.render),filter:i&&r(t.filter),blend:i&&r(t.blend),store:i&&r(t.store)}}_normalizeBufferProps(e){(e instanceof ArrayBuffer||ArrayBuffer.isView(e))&&(e={data:e});let t={...e};if((e.usage||0)&b.INDEX&&(!e.indexType&&(e.data instanceof Uint32Array?t.indexType="uint32":e.data instanceof Uint16Array&&(t.indexType="uint16")),!t.indexType))throw Error("indices buffer content must be of type uint16 or uint32");return t}},Q=K;h(Q,"defaultProps",{id:null,powerPreference:"high-performance",failIfMajorPerformanceCaveat:!1,createCanvasContext:void 0,webgl:{},onError:(e,t)=>{},onResize:(e,t)=>{let[r,i]=e.getDevicePixelSize();g.log(1,`${e} resized => ${r}x${i}px`)()},onPositionChange:(e,t)=>{let[r,i]=e.getPosition();g.log(1,`${e} repositioned => ${r},${i}`)()},onVisibilityChange:e=>g.log(1,`${e} Visibility changed ${e.isVisible}`)(),onDevicePixelRatioChange:(e,t)=>g.log(1,`${e} DPR changed ${t.oldRatio} => ${e.devicePixelRatio}`)(),debug:g.get("debug")||void 0,debugShaders:g.get("debug-shaders")||void 0,debugFramebuffers:!!g.get("debug-framebuffers"),debugFactories:!!g.get("debug-factories"),debugWebGL:!!g.get("debug-webgl"),debugSpectorJS:void 0,debugSpectorJSUrl:void 0,_reuseDevices:!1,_requestMaxLimits:!0,_cacheShaders:!1,_cachePipelines:!1,_cacheDestroyPolicy:"unused",_initializeFeatures:!0,_disabledFeatures:{"compilation-status-async-webgl":!0},_handle:void 0});var J="No matching device found. Ensure `@luma.gl/webgl` and/or `@luma.gl/webgpu` modules are imported.",ee=class{stats=p;log=g;VERSION="9.2.4";spector;preregisteredAdapters=new Map;constructor(){if(globalThis.luma){if(globalThis.luma.VERSION!==this.VERSION)throw g.error(`Found luma.gl ${globalThis.luma.VERSION} while initialzing ${this.VERSION}`)(),g.error("'yarn why @luma.gl/core' can help identify the source of the conflict")(),Error("luma.gl - multiple versions detected: see console log");g.error("This version of luma.gl has already been initialized")()}g.log(1,`${this.VERSION} - set luma.log.level=1 (or higher) to trace rendering`)(),globalThis.luma=this}async createDevice(e={}){let t={...ee.defaultProps,...e},r=this.selectAdapter(t.type,t.adapters);if(!r)throw Error(J);return t.waitForPageLoad&&await r.pageLoaded,await r.create(t)}async attachDevice(e,t){var r;let i=this._getTypeFromHandle(e,t.adapters),n=i&&this.selectAdapter(i,t.adapters);if(!n)throw Error(J);return await (null==(r=null==n?void 0:n.attach)?void 0:r.call(n,e,t))}registerAdapters(e){for(let t of e)this.preregisteredAdapters.set(t.type,t)}getSupportedAdapters(e=[]){return Array.from(this._getAdapterMap(e)).map(([,e])=>e).filter(e=>{var t;return null==(t=e.isSupported)?void 0:t.call(e)}).map(e=>e.type)}getBestAvailableAdapterType(e=[]){var t,r;let i=this._getAdapterMap(e);for(let e of["webgpu","webgl","null"])if(null==(r=null==(t=i.get(e))?void 0:t.isSupported)?void 0:r.call(t))return e;return null}selectAdapter(e,t=[]){let r=e;"best-available"===e&&(r=this.getBestAvailableAdapterType(t));let i=this._getAdapterMap(t);return r&&i.get(r)||null}enforceWebGL2(e=!0,t=[]){var r;let i=this._getAdapterMap(t).get("webgl");i||g.warn("enforceWebGL2: webgl adapter not found")(),null==(r=null==i?void 0:i.enforceWebGL2)||r.call(i,e)}setDefaultDeviceProps(e){Object.assign(ee.defaultProps,e)}_getAdapterMap(e=[]){let t=new Map(this.preregisteredAdapters);for(let r of e)t.set(r.type,r);return t}_getTypeFromHandle(e,t=[]){return e instanceof WebGL2RenderingContext?"webgl":"undefined"!=typeof GPUDevice&&e instanceof GPUDevice||(null==e?void 0:e.queue)?"webgpu":null===e?"null":(e instanceof WebGLRenderingContext?g.warn("WebGL1 is not supported",e)():g.warn("Unknown handle type",e)(),null)}};h(ee,"defaultProps",{...Q.defaultProps,type:"best-available",adapters:void 0,waitForPageLoad:!0});var et=new ee,er=r(33278),ei=class{get pageLoaded(){return eo||(eo=es()||"undefined"==typeof window?Promise.resolve():new Promise(e=>window.addEventListener("load",()=>e()))),eo}},en=(0,er.isBrowser)()&&"undefined"!=typeof document,es=()=>en&&"complete"===document.readyState,eo=null,ea=r(33278),el=class{static isHTMLCanvas(e){return"undefined"!=typeof HTMLCanvasElement&&e instanceof HTMLCanvasElement}static isOffscreenCanvas(e){return"undefined"!=typeof OffscreenCanvas&&e instanceof OffscreenCanvas}id;props;canvas;htmlCanvas;offscreenCanvas;type;initialized;isInitialized=!1;isVisible=!0;cssWidth;cssHeight;devicePixelRatio;devicePixelWidth;devicePixelHeight;drawingBufferWidth;drawingBufferHeight;_initializedResolvers={promise:new Promise((e,t)=>{i=e,n=t}),resolve:i,reject:n};_resizeObserver;_intersectionObserver;_position;destroyed=!1;toString(){return`${this[Symbol.toStringTag]}(${this.id})`}constructor(e){var t,r;if(this.props={...el.defaultProps,...e},e=this.props,this.initialized=this._initializedResolvers.promise,(0,ea.isBrowser)()?e.canvas?"string"==typeof e.canvas?this.canvas=function(e){let t=document.getElementById(e);if(!eu.isHTMLCanvas(t))throw Error("Object is not a canvas element");return t}(e.canvas):this.canvas=e.canvas:this.canvas=function(e){let{width:t,height:r}=e,i=document.createElement("canvas");i.id=m("lumagl-auto-created-canvas"),i.width=t||1,i.height=r||1,i.style.width=Number.isFinite(t)?`${t}px`:"100%",i.style.height=Number.isFinite(r)?`${r}px`:"100%",(null==e?void 0:e.visible)||(i.style.visibility="hidden");let n=function(e){if("string"==typeof e){let t=document.getElementById(e);if(!t)throw Error(`${e} is not an HTML element`);return t}return e||document.body}((null==e?void 0:e.container)||null);return n.insertBefore(i,n.firstChild),i}(e):this.canvas={width:e.width||1,height:e.height||1},el.isHTMLCanvas(this.canvas)?(this.id=e.id||this.canvas.id,this.type="html-canvas",this.htmlCanvas=this.canvas):el.isOffscreenCanvas(this.canvas)?(this.id=e.id||"offscreen-canvas",this.type="offscreen-canvas",this.offscreenCanvas=this.canvas):(this.id=e.id||"node-canvas-context",this.type="node"),this.cssWidth=(null==(t=this.htmlCanvas)?void 0:t.clientWidth)||this.canvas.width,this.cssHeight=(null==(r=this.htmlCanvas)?void 0:r.clientHeight)||this.canvas.height,this.devicePixelWidth=this.canvas.width,this.devicePixelHeight=this.canvas.height,this.drawingBufferWidth=this.canvas.width,this.drawingBufferHeight=this.canvas.height,this.devicePixelRatio=globalThis.devicePixelRatio||1,this._position=[0,0],el.isHTMLCanvas(this.canvas)){this._intersectionObserver=new IntersectionObserver(e=>this._handleIntersection(e)),this._intersectionObserver.observe(this.canvas),this._resizeObserver=new ResizeObserver(e=>this._handleResize(e));try{this._resizeObserver.observe(this.canvas,{box:"device-pixel-content-box"})}catch{this._resizeObserver.observe(this.canvas,{box:"content-box"})}setTimeout(()=>this._observeDevicePixelRatio(),0),this.props.trackPosition&&this._trackPosition()}}destroy(){this.destroyed=!0}setProps(e){return"useDevicePixels"in e&&(this.props.useDevicePixels=e.useDevicePixels||!1,this._updateDrawingBufferSize()),this}getCSSSize(){return[this.cssWidth,this.cssHeight]}getPosition(){return this._position}getDevicePixelSize(){return[this.devicePixelWidth,this.devicePixelHeight]}getDrawingBufferSize(){return[this.drawingBufferWidth,this.drawingBufferHeight]}getMaxDrawingBufferSize(){let e=this.device.limits.maxTextureDimension2D;return[e,e]}setDrawingBufferSize(e,t){this.canvas.width=e,this.canvas.height=t,this.drawingBufferWidth=e,this.drawingBufferHeight=t}getDevicePixelRatio(){return"undefined"!=typeof window&&window.devicePixelRatio||1}cssToDevicePixels(e,t=!0){let r=this.cssToDeviceRatio(),[i,n]=this.getDrawingBufferSize();return function(e,t,r,i,n){let s;let o=ec(e[0],t,r),a=eh(e[1],t,i,n),l=ec(e[0]+1,t,r),u=l===r-1?l:l-1;return l=eh(e[1]+1,t,i,n),n?(l=0===l?l:l+1,s=a,a=l):s=l===i-1?l:l-1,{x:o,y:a,width:Math.max(u-o+1,1),height:Math.max(s-a+1,1)}}(e,r,i,n,t)}getPixelSize(){return this.getDevicePixelSize()}getAspect(){let[e,t]=this.getDevicePixelSize();return e/t}cssToDeviceRatio(){try{let[e]=this.getDrawingBufferSize(),[t]=this.getCSSSize();return t?e/t:1}catch{return 1}}resize(e){this.setDrawingBufferSize(e.width,e.height)}_setAutoCreatedCanvasId(e){var t;(null==(t=this.htmlCanvas)?void 0:t.id)==="lumagl-auto-created-canvas"&&(this.htmlCanvas.id=e)}_handleIntersection(e){let t=e.find(e=>e.target===this.canvas);if(!t)return;let r=t.isIntersecting;this.isVisible!==r&&(this.isVisible=r,this.device.props.onVisibilityChange(this))}_handleResize(e){var t,r;let i=e.find(e=>e.target===this.canvas);if(!i)return;this.cssWidth=i.contentBoxSize[0].inlineSize,this.cssHeight=i.contentBoxSize[0].blockSize;let n=this.getDevicePixelSize(),s=(null==(t=i.devicePixelContentBoxSize)?void 0:t[0].inlineSize)||i.contentBoxSize[0].inlineSize*devicePixelRatio,o=(null==(r=i.devicePixelContentBoxSize)?void 0:r[0].blockSize)||i.contentBoxSize[0].blockSize*devicePixelRatio,[a,l]=this.getMaxDrawingBufferSize();this.devicePixelWidth=Math.max(1,Math.min(s,a)),this.devicePixelHeight=Math.max(1,Math.min(o,l)),this._updateDrawingBufferSize(),this.device.props.onResize(this,{oldPixelSize:n})}_updateDrawingBufferSize(){if(this.props.autoResize){if("number"==typeof this.props.useDevicePixels){let e=this.props.useDevicePixels;this.setDrawingBufferSize(this.cssWidth*e,this.cssHeight*e)}else this.props.useDevicePixels?this.setDrawingBufferSize(this.devicePixelWidth,this.devicePixelHeight):this.setDrawingBufferSize(this.cssWidth,this.cssHeight);this._updateDevice()}this._initializedResolvers.resolve(),this.isInitialized=!0,this.updatePosition()}_observeDevicePixelRatio(){let e=this.devicePixelRatio;this.devicePixelRatio=window.devicePixelRatio,this.updatePosition(),this.device.props.onDevicePixelRatioChange(this,{oldRatio:e}),matchMedia(`(resolution: ${this.devicePixelRatio}dppx)`).addEventListener("change",()=>this._observeDevicePixelRatio(),{once:!0})}_trackPosition(e=100){let t=setInterval(()=>{this.destroyed?clearInterval(t):this.updatePosition()},e)}updatePosition(){var e,t,r;let i=null==(e=this.htmlCanvas)?void 0:e.getBoundingClientRect();if(i){let e=[i.left,i.top];if(this._position??=e,e[0]!==this._position[0]||e[1]!==this._position[1]){let i=this._position;this._position=e,null==(r=(t=this.device.props).onPositionChange)||r.call(t,this,{oldPosition:i})}}}},eu=el;function ec(e,t,r){return Math.min(Math.round(e*t),r-1)}function eh(e,t,r,i){return i?Math.max(0,r-1-Math.round(e*t)):Math.min(Math.round(e*t),r-1)}h(eu,"defaultProps",{id:void 0,canvas:null,width:800,height:600,useDevicePixels:!0,autoResize:!0,container:null,visible:!0,alphaMode:"opaque",colorSpace:"srgb",trackPosition:!1});var ef=class extends E{get[Symbol.toStringTag](){return"Sampler"}constructor(e,t){super(e,t=ef.normalizeProps(e,t),ef.defaultProps)}static normalizeProps(e,t){return t}},ed=ef;h(ed,"defaultProps",{...E.defaultProps,type:"color-sampler",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge",addressModeW:"clamp-to-edge",magFilter:"nearest",minFilter:"nearest",mipmapFilter:"none",lodMinClamp:0,lodMaxClamp:32,compare:"less-equal",maxAnisotropy:1});var ep={"1d":"1d","2d":"2d","2d-array":"2d",cube:"2d","cube-array":"2d","3d":"3d"},eg=class extends E{dimension;baseDimension;format;width;height;depth;mipLevels;updateTimestamp;get[Symbol.toStringTag](){return"Texture"}toString(){return`Texture(${this.id},${this.format},${this.width}x${this.height})`}constructor(e,t){if(super(e,t=eg.normalizeProps(e,t),eg.defaultProps),this.dimension=this.props.dimension,this.baseDimension=ep[this.dimension],this.format=this.props.format,this.width=this.props.width,this.height=this.props.height,this.depth=this.props.depth,this.mipLevels=this.props.mipLevels,void 0===this.props.width||void 0===this.props.height){if(e.isExternalImage(t.data)){let r=e.getExternalImageSize(t.data);this.width=(null==r?void 0:r.width)||1,this.height=(null==r?void 0:r.height)||1}else this.width=1,this.height=1,(void 0===this.props.width||void 0===this.props.height)&&g.warn(`${this} created with undefined width or height. This is deprecated. Use AsyncTexture instead.`)()}this.updateTimestamp=e.incrementTimestamp()}setSampler(e){this.sampler=e instanceof ed?e:this.device.createSampler(e)}clone(e){return this.device.createTexture({...this.props,...e})}static normalizeProps(e,t){let r={...t},{width:i,height:n}=r;return"number"==typeof i&&(r.width=Math.max(1,Math.ceil(i))),"number"==typeof n&&(r.height=Math.max(1,Math.ceil(n))),r}_initializeData(e){this.device.isExternalImage(e)?this.copyExternalImage({image:e,width:this.width,height:this.height,depth:this.depth,mipLevel:0,x:0,y:0,z:0,aspect:"all",colorSpace:"srgb",premultipliedAlpha:!1,flipY:!1}):e&&this.copyImageData({data:e,mipLevel:0,x:0,y:0,z:0,aspect:"all"})}_normalizeCopyImageDataOptions(e){let{width:t,height:r,depth:i}=this,n={...eg.defaultCopyDataOptions,width:t,height:r,depth:i,...e},s=this.device.getTextureFormatInfo(this.format);if(!e.bytesPerRow&&!s.bytesPerPixel)throw Error(`bytesPerRow must be provided for texture format ${this.format}`);return n.bytesPerRow=e.bytesPerRow||t*(s.bytesPerPixel||4),n.rowsPerImage=e.rowsPerImage||r,n}_normalizeCopyExternalImageOptions(e){let t=this.device.getExternalImageSize(e.image),r={...eg.defaultCopyExternalImageOptions,...t,...e};return r.width=Math.min(r.width,this.width-r.x),r.height=Math.min(r.height,this.height-r.y),r}},e_=eg;h(e_,"SAMPLE",4),h(e_,"STORAGE",8),h(e_,"RENDER",16),h(e_,"COPY_SRC",1),h(e_,"COPY_DST",2),h(e_,"TEXTURE",4),h(e_,"RENDER_ATTACHMENT",16),h(e_,"defaultProps",{...E.defaultProps,data:null,dimension:"2d",format:"rgba8unorm",usage:eg.TEXTURE|eg.RENDER_ATTACHMENT|eg.COPY_DST,width:void 0,height:void 0,depth:1,mipLevels:1,samples:void 0,sampler:{},view:void 0}),h(e_,"defaultCopyDataOptions",{data:void 0,byteOffset:0,bytesPerRow:void 0,rowsPerImage:void 0,mipLevel:0,x:0,y:0,z:0,aspect:"all"}),h(e_,"defaultCopyExternalImageOptions",{image:void 0,sourceX:0,sourceY:0,width:void 0,height:void 0,depth:1,mipLevel:0,x:0,y:0,z:0,aspect:"all",colorSpace:"srgb",premultipliedAlpha:!1,flipY:!1});var em=class extends E{get[Symbol.toStringTag](){return"TextureView"}constructor(e,t){super(e,t,em.defaultProps)}},eE=em;h(eE,"defaultProps",{...E.defaultProps,format:void 0,dimension:void 0,aspect:"all",baseMipLevel:0,mipLevelCount:void 0,baseArrayLayer:0,arrayLayerCount:void 0});var ev=class extends E{get[Symbol.toStringTag](){return"ExternalTexture"}constructor(e,t){super(e,t,ev.defaultProps)}},eb=ev;function eA(e,t,r,i){if(null==i?void 0:i.inlineSource){let i=function(e,t,r){let i="";for(let r=t-2;r<=t;r++){let n=e[r-1];void 0!==n&&(i+=ey(n,t,void 0))}return i}(t,r),n=e.linePos>0?`${" ".repeat(e.linePos+5)}^^^
`:"";return`
${i}${n}${e.type.toUpperCase()}: ${e.message}

`}let n="error"===e.type?"red":"#8B4000";return(null==i?void 0:i.html)?`<div class='luma-compiler-log-error' style="color:${n};"><b> ${e.type.toUpperCase()}: ${e.message}</b></div>`:`${e.type.toUpperCase()}: ${e.message}`}function ey(e,t,r){let i=(null==r?void 0:r.html)?e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;"):e;return`${function(e,t){let r="";for(let t=e.length;t<4;++t)r+=" ";return r+e}(String(t),0)}: ${i}${(null==r?void 0:r.html)?"<br/>":"\n"}`}h(eb,"defaultProps",{...E.defaultProps,source:void 0,colorSpace:"srgb"});var eT=class extends E{get[Symbol.toStringTag](){return"Shader"}stage;source;compilationStatus="pending";constructor(e,t){var r;t={...t,debugShaders:t.debugShaders||e.props.debugShaders||"errors"},super(e,{id:function(e,t="unnamed"){let r=/#define[\s*]SHADER_NAME[\s*]([A-Za-z0-9_-]+)[\s*]/.exec(e);return r?r[1]:t}((r=t).source)||r.id||m(`unnamed ${r.stage}-shader`),...t},eT.defaultProps),this.stage=this.props.stage,this.source=this.props.source}getCompilationInfoSync(){return null}getTranslatedSource(){return null}async debugShader(){let e=this.props.debugShaders;switch(e){case"never":return;case"errors":if("success"===this.compilationStatus)return}let t=await this.getCompilationInfo();("warnings"!==e||(null==t?void 0:t.length)!==0)&&this._displayShaderLog(t,this.id)}_displayShaderLog(e,t){var r;if("undefined"==typeof document||!(null==document?void 0:document.createElement))return;let i=`${this.stage} shader "${t}"`,n=function(e,t,r){let i="",n=t.split(/\r?\n/),s=e.slice().sort((e,t)=>e.lineNum-t.lineNum);switch((null==r?void 0:r.showSourceCode)||"no"){case"all":let o=0;for(let e=1;e<=n.length;e++)for(i+=ey(n[e-1],e,r);s.length>o&&s[o].lineNum===e;){let e=s[o++];i+=eA(e,n,e.lineNum,{...r,inlineSource:!1})}for(;s.length>o;)i+=eA(s[o++],[],0,{...r,inlineSource:!1});return i;case"issues":case"no":for(let t of e)i+=eA(t,n,t.lineNum,{inlineSource:(null==r?void 0:r.showSourceCode)!=="no"});return i}}(e,this.source,{showSourceCode:"all",html:!0}),s=this.getTranslatedSource();s&&(n+=`<br /><br /><h1>Translated Source</h1><br /><br /><code style="user-select:text;"><pre>${s}</pre></code>`);let o=document.createElement("Button");o.innerHTML=`
<h1>Compilation error in ${i}</h1><br /><br />
<code style="user-select:text;"><pre>
${n}
</pre></code>`,o.style.top="10px",o.style.left="10px",o.style.position="absolute",o.style.zIndex="9999",o.style.width="100%",o.style.textAlign="left",document.body.appendChild(o),null==(r=document.getElementsByClassName("luma-compiler-log-error")[0])||r.scrollIntoView(),o.onclick=()=>{let e=`data:text/plain,${encodeURIComponent(this.source)}`;navigator.clipboard.writeText(e)}}},eR=eT;h(eR,"defaultProps",{...E.defaultProps,language:"auto",stage:void 0,source:"",sourceMap:null,entryPoint:"main",debugShaders:void 0});var eS=class extends E{get[Symbol.toStringTag](){return"Framebuffer"}width;height;constructor(e,t={}){super(e,t,eS.defaultProps),this.width=this.props.width,this.height=this.props.height}clone(e){let t=this.colorAttachments.map(t=>t.texture.clone(e)),r=this.depthStencilAttachment&&this.depthStencilAttachment.texture.clone(e);return this.device.createFramebuffer({...this.props,colorAttachments:t,depthStencilAttachment:r})}resize(e){let t=!e;if(e){let[r,i]=Array.isArray(e)?e:[e.width,e.height];t=t||i!==this.height||r!==this.width,this.width=r,this.height=i}t&&(g.log(2,`Resizing framebuffer ${this.id} to ${this.width}x${this.height}`)(),this.resizeAttachments(this.width,this.height))}autoCreateAttachmentTextures(){if(0===this.props.colorAttachments.length&&!this.props.depthStencilAttachment)throw Error("Framebuffer has noattachments");this.colorAttachments=this.props.colorAttachments.map((e,t)=>{if("string"==typeof e){let r=this.createColorTexture(e,t);return this.attachResource(r),r.view}return e instanceof e_?e.view:e});let e=this.props.depthStencilAttachment;if(e){if("string"==typeof e){let t=this.createDepthStencilTexture(e);this.attachResource(t),this.depthStencilAttachment=t.view}else e instanceof e_?this.depthStencilAttachment=e.view:this.depthStencilAttachment=e}}createColorTexture(e,t){return this.device.createTexture({id:`${this.id}-color-attachment-${t}`,usage:e_.RENDER_ATTACHMENT,format:e,width:this.width,height:this.height,sampler:{magFilter:"linear",minFilter:"linear"}})}createDepthStencilTexture(e){return this.device.createTexture({id:`${this.id}-depth-stencil-attachment`,usage:e_.RENDER_ATTACHMENT,format:e,width:this.width,height:this.height})}resizeAttachments(e,t){for(let r=0;r<this.colorAttachments.length;++r)if(this.colorAttachments[r]){let i=this.colorAttachments[r].texture.clone({width:e,height:t});this.destroyAttachedResource(this.colorAttachments[r]),this.colorAttachments[r]=i.view,this.attachResource(i.view)}if(this.depthStencilAttachment){let r=this.depthStencilAttachment.texture.clone({width:e,height:t});this.destroyAttachedResource(this.depthStencilAttachment),this.depthStencilAttachment=r.view,this.attachResource(r)}this.updateAttachments()}},eM=eS;h(eM,"defaultProps",{...E.defaultProps,width:1,height:1,colorAttachments:[],depthStencilAttachment:null});var eI=class extends E{get[Symbol.toStringTag](){return"RenderPipeline"}shaderLayout;bufferLayout;linkStatus="pending";hash="";constructor(e,t){super(e,t,eI.defaultProps),this.shaderLayout=this.props.shaderLayout,this.bufferLayout=this.props.bufferLayout||[]}},eC=eI;h(eC,"defaultProps",{...E.defaultProps,vs:null,vertexEntryPoint:"vertexMain",vsConstants:{},fs:null,fragmentEntryPoint:"fragmentMain",fsConstants:{},shaderLayout:null,bufferLayout:[],topology:"triangle-list",colorAttachmentFormats:void 0,depthStencilAttachmentFormat:void 0,parameters:{},bindings:{},uniforms:{}});var ex=class extends E{get[Symbol.toStringTag](){return"RenderPass"}constructor(e,t){super(e,t=ex.normalizeProps(e,t),ex.defaultProps)}static normalizeProps(e,t){return t}},ew=ex;h(ew,"defaultClearColor",[0,0,0,1]),h(ew,"defaultClearDepth",1),h(ew,"defaultClearStencil",0),h(ew,"defaultProps",{...E.defaultProps,framebuffer:null,parameters:void 0,clearColor:ex.defaultClearColor,clearColors:void 0,clearDepth:ex.defaultClearDepth,clearStencil:ex.defaultClearStencil,depthReadOnly:!1,stencilReadOnly:!1,discard:!1,occlusionQuerySet:void 0,timestampQuerySet:void 0,beginTimestampIndex:void 0,endTimestampIndex:void 0});var eN=class extends E{get[Symbol.toStringTag](){return"ComputePipeline"}hash="";shaderLayout;constructor(e,t){super(e,t,eN.defaultProps),this.shaderLayout=t.shaderLayout}},eO=eN;h(eO,"defaultProps",{...E.defaultProps,shader:void 0,entryPoint:void 0,constants:{},shaderLayout:void 0});var eP=class extends E{constructor(e,t){super(e,t,eP.defaultProps)}get[Symbol.toStringTag](){return"ComputePass"}},eL=eP;h(eL,"defaultProps",{...E.defaultProps,timestampQuerySet:void 0,beginTimestampIndex:void 0,endTimestampIndex:void 0});var eF=class extends E{get[Symbol.toStringTag](){return"CommandEncoder"}constructor(e,t){super(e,t,eF.defaultProps)}},eB=eF;h(eB,"defaultProps",{...E.defaultProps,measureExecutionTime:void 0});var eD=class extends E{get[Symbol.toStringTag](){return"CommandBuffer"}constructor(e,t){super(e,t,eD.defaultProps)}},eU=eD;function ek(e){return ez[e]}function eG(e){let[t,r]=eV[e],i=eH[t]*r;return{primitiveType:t,components:r,byteLength:i,integer:"i32"===t||"u32"===t,signed:"u32"!==t}}h(eU,"defaultProps",{...E.defaultProps});var eH={f32:4,f16:2,i32:4,u32:4},eV={f32:["f32",1],"vec2<f32>":["f32",2],"vec3<f32>":["f32",3],"vec4<f32>":["f32",4],f16:["f16",1],"vec2<f16>":["f16",2],"vec3<f16>":["f16",3],"vec4<f16>":["f16",4],i32:["i32",1],"vec2<i32>":["i32",2],"vec3<i32>":["i32",3],"vec4<i32>":["i32",4],u32:["u32",1],"vec2<u32>":["u32",2],"vec3<u32>":["u32",3],"vec4<u32>":["u32",4]},ez={f32:{type:"f32",components:1},f16:{type:"f16",components:1},i32:{type:"i32",components:1},u32:{type:"u32",components:1},"vec2<f32>":{type:"f32",components:2},"vec3<f32>":{type:"f32",components:3},"vec4<f32>":{type:"f32",components:4},"vec2<f16>":{type:"f16",components:2},"vec3<f16>":{type:"f16",components:3},"vec4<f16>":{type:"f16",components:4},"vec2<i32>":{type:"i32",components:2},"vec3<i32>":{type:"i32",components:3},"vec4<i32>":{type:"i32",components:4},"vec2<u32>":{type:"u32",components:2},"vec3<u32>":{type:"u32",components:3},"vec4<u32>":{type:"u32",components:4},"mat2x2<f32>":{type:"f32",components:4},"mat2x3<f32>":{type:"f32",components:6},"mat2x4<f32>":{type:"f32",components:8},"mat3x2<f32>":{type:"f32",components:6},"mat3x3<f32>":{type:"f32",components:9},"mat3x4<f32>":{type:"f32",components:12},"mat4x2<f32>":{type:"f32",components:8},"mat4x3<f32>":{type:"f32",components:12},"mat4x4<f32>":{type:"f32",components:16},"mat2x2<f16>":{type:"f16",components:4},"mat2x3<f16>":{type:"f16",components:6},"mat2x4<f16>":{type:"f16",components:8},"mat3x2<f16>":{type:"f16",components:6},"mat3x3<f16>":{type:"f16",components:9},"mat3x4<f16>":{type:"f16",components:12},"mat4x2<f16>":{type:"f16",components:8},"mat4x3<f16>":{type:"f16",components:12},"mat4x4<f16>":{type:"f16",components:16},"mat2x2<i32>":{type:"i32",components:4},"mat2x3<i32>":{type:"i32",components:6},"mat2x4<i32>":{type:"i32",components:8},"mat3x2<i32>":{type:"i32",components:6},"mat3x3<i32>":{type:"i32",components:9},"mat3x4<i32>":{type:"i32",components:12},"mat4x2<i32>":{type:"i32",components:8},"mat4x3<i32>":{type:"i32",components:12},"mat4x4<i32>":{type:"i32",components:16},"mat2x2<u32>":{type:"u32",components:4},"mat2x3<u32>":{type:"u32",components:6},"mat2x4<u32>":{type:"u32",components:8},"mat3x2<u32>":{type:"u32",components:6},"mat3x3<u32>":{type:"u32",components:9},"mat3x4<u32>":{type:"u32",components:12},"mat4x2<u32>":{type:"u32",components:8},"mat4x3<u32>":{type:"u32",components:12},"mat4x4<u32>":{type:"u32",components:16}};function ej(e,t){let r={};for(let i of e.attributes){let n=function(e,t,r){let i=function(e,t){let r=e.attributes.find(e=>e.name===t);return r||g.warn(`shader layout attribute "${t}" not present in shader`),r||null}(e,r),n=function(e,t){!function(e){for(let t of e)(t.attributes&&t.format||!t.attributes&&!t.format)&&g.warn(`BufferLayout ${name} must have either 'attributes' or 'format' field`)}(e);let r=function(e,t){for(let r of e)if(r.format&&r.name===t)return{attributeName:r.name,bufferName:t,stepMode:r.stepMode,vertexFormat:r.format,byteOffset:0,byteStride:r.byteStride||0};return null}(e,t);return r||(r=function(e,t){var r;for(let i of e){let e=i.byteStride;if("number"!=typeof i.byteStride)for(let t of i.attributes||[])e+=M(t.format).byteLength;let n=null==(r=i.attributes)?void 0:r.find(e=>e.attribute===t);if(n)return{attributeName:n.attribute,bufferName:i.name,stepMode:i.stepMode,vertexFormat:n.format,byteOffset:n.byteOffset,byteStride:e}}return null}(e,t))?r:(g.warn(`layout for attribute "${t}" not present in buffer layout`),null)}(t,r);if(!i)return null;let s=eG(i.type),o=function(e){let t;switch(e.primitiveType){case"f32":t="float32";break;case"i32":t="sint32";break;case"u32":t="uint32";break;case"f16":return e.components<=2?"float16x2":"float16x4"}return 1===e.components?t:`${t}x${e.components}`}(s),a=(null==n?void 0:n.vertexFormat)||o,l=M(a);return{attributeName:(null==n?void 0:n.attributeName)||i.name,bufferName:(null==n?void 0:n.bufferName)||i.name,location:i.location,shaderType:i.type,primitiveType:s.primitiveType,shaderComponents:s.components,vertexFormat:a,bufferDataType:l.type,bufferComponents:l.components,normalized:l.normalized,integer:s.integer,stepMode:(null==n?void 0:n.stepMode)||i.stepMode||"vertex",byteOffset:(null==n?void 0:n.byteOffset)||0,byteStride:(null==n?void 0:n.byteStride)||0}}(e,t,i.name);n&&(r[i.name]=n)}return r}var eW=class extends E{get[Symbol.toStringTag](){return"VertexArray"}maxVertexAttributes;attributeInfos;indexBuffer=null;attributes;constructor(e,t){super(e,t,eW.defaultProps),this.maxVertexAttributes=e.limits.maxVertexAttributes,this.attributes=Array(this.maxVertexAttributes).fill(null),this.attributeInfos=function(e,t,r=16){let i=ej(e,t),n=Array(r).fill(null);for(let e of Object.values(i))n[e.location]=e;return n}(t.shaderLayout,t.bufferLayout,this.maxVertexAttributes)}setConstantWebGL(e,t){this.device.reportError(Error("constant attributes not supported"),this)()}},eX=eW;h(eX,"defaultProps",{...E.defaultProps,shaderLayout:void 0,bufferLayout:[]});var e$=class extends E{get[Symbol.toStringTag](){return"TransformFeedback"}constructor(e,t){super(e,t,e$.defaultProps)}},eq=e$;h(eq,"defaultProps",{...E.defaultProps,layout:void 0,buffers:{}});var eY=class extends E{get[Symbol.toStringTag](){return"QuerySet"}constructor(e,t){super(e,t,eY.defaultProps)}},eZ=eY;h(eZ,"defaultProps",{...E.defaultProps,type:void 0,count:void 0});var eK=class extends E{get[Symbol.toStringTag](){return"PipelineLayout"}constructor(e,t){super(e,t,eK.defaultProps)}},eQ=eK;function eJ(e){return(!s||s.byteLength<e)&&(s=new ArrayBuffer(e)),s}function e0(e,t){let r=eJ(e.BYTES_PER_ELEMENT*t);return new e(r,0,t)}function e1(e){return Array.isArray(e)?0===e.length||"number"==typeof e[0]:ArrayBuffer.isView(e)&&!(e instanceof DataView)}h(eQ,"defaultProps",{...E.defaultProps,shaderLayout:{attributes:[],bindings:[]}});var e2=class{layout={};byteLength;constructor(e,t={}){let r=0;for(let[i,n]of Object.entries(e)){let{type:e,components:s}=ez[n],o=s*((null==t?void 0:t[i])??1),a=r=function(e,t){switch(t){case 1:return e;case 2:return e+e%2;default:return e+(4-e%4)%4}}(r,o);r+=o,this.layout[i]={type:e,size:o,offset:a}}let i=4*(r+=(4-r%4)%4);this.byteLength=Math.max(i,1024)}getData(e){let t=eJ(this.byteLength),r={i32:new Int32Array(t),u32:new Uint32Array(t),f32:new Float32Array(t),f16:new Uint16Array(t)};for(let[t,i]of Object.entries(e)){let e=this.layout[t];if(!e){g.warn(`Supplied uniform value ${t} not present in uniform block layout`)();continue}let{type:n,size:s,offset:o}=e,a=r[n];if(1===s){if("number"!=typeof i&&"boolean"!=typeof i){g.warn(`Supplied value for single component uniform ${t} is not a number: ${i}`)();continue}a[o]=Number(i)}else{if(!e1(i)){g.warn(`Supplied value for multi component / array uniform ${t} is not a numeric array: ${i}`)();continue}a.set(i,o)}}return new Uint8Array(t,0,this.byteLength)}has(e){return!!this.layout[e]}get(e){return this.layout[e]}},e3=class{name;uniforms={};modifiedUniforms={};modified=!0;bindingLayout={};needsRedraw="initialized";constructor(e){var t;if(this.name=(null==e?void 0:e.name)||"unnamed",(null==e?void 0:e.name)&&(null==e?void 0:e.shaderLayout)){let r=null==(t=null==e?void 0:e.shaderLayout.bindings)?void 0:t.find(t=>"uniform"===t.type&&t.name===(null==e?void 0:e.name));if(!r)throw Error(null==e?void 0:e.name);for(let e of r.uniforms||[])this.bindingLayout[e.name]=e}}setUniforms(e){for(let[t,r]of Object.entries(e))this._setUniform(t,r),this.needsRedraw||this.setNeedsRedraw(`${this.name}.${t}=${r}`)}setNeedsRedraw(e){this.needsRedraw=this.needsRedraw||e}getAllUniforms(){return this.modifiedUniforms={},this.needsRedraw=!1,this.uniforms||{}}_setUniform(e,t){!function(e,t,r=16){if(e!==t||!e1(e))return!1;if(e1(t)&&e.length===t.length){for(let r=0;r<e.length;++r)if(t[r]!==e[r])return!1}return!0}(this.uniforms[e],t)&&(this.uniforms[e]=e1(t)?t.slice():t,this.modifiedUniforms[e]=!0,this.modified=!0)}},e4=class{uniformBlocks=new Map;uniformBufferLayouts=new Map;uniformBuffers=new Map;constructor(e){for(let[t,r]of Object.entries(e)){let e=new e2(r.uniformTypes??{},r.uniformSizes??{});this.uniformBufferLayouts.set(t,e);let i=new e3({name:t});i.setUniforms(r.defaultUniforms||{}),this.uniformBlocks.set(t,i)}}destroy(){for(let e of this.uniformBuffers.values())e.destroy()}setUniforms(e){var t;for(let[r,i]of Object.entries(e))null==(t=this.uniformBlocks.get(r))||t.setUniforms(i);this.updateUniformBuffers()}getUniformBufferByteLength(e){var t;return(null==(t=this.uniformBufferLayouts.get(e))?void 0:t.byteLength)||0}getUniformBufferData(e){var t,r;let i=(null==(t=this.uniformBlocks.get(e))?void 0:t.getAllUniforms())||{};return null==(r=this.uniformBufferLayouts.get(e))?void 0:r.getData(i)}createUniformBuffer(e,t,r){r&&this.setUniforms(r);let i=this.getUniformBufferByteLength(t),n=e.createBuffer({usage:b.UNIFORM|b.COPY_DST,byteLength:i}),s=this.getUniformBufferData(t);return n.write(s),n}getManagedUniformBuffer(e,t){if(!this.uniformBuffers.get(t)){let r=this.getUniformBufferByteLength(t),i=e.createBuffer({usage:b.UNIFORM|b.COPY_DST,byteLength:r});this.uniformBuffers.set(t,i)}return this.uniformBuffers.get(t)}updateUniformBuffers(){let e=!1;for(let t of this.uniformBlocks.keys()){let r=this.updateUniformBuffer(t);e||=r}return e&&g.log(3,`UniformStore.updateUniformBuffers(): ${e}`)(),e}updateUniformBuffer(e){var t;let r=this.uniformBlocks.get(e),i=this.uniformBuffers.get(e),n=!1;if(i&&(null==r?void 0:r.needsRedraw)){n||=r.needsRedraw;let s=this.getUniformBufferData(e);null==(i=this.uniformBuffers.get(e))||i.write(s);let o=null==(t=this.uniformBlocks.get(e))?void 0:t.getAllUniforms();g.log(4,`Writing to uniform buffer ${String(e)}`,s,o)()}return n}};function e6(e,t,r,i){if(t<0||t>=e.width||r<0||r>=e.height)throw Error("Coordinates out of bounds.");let n=r*e.bytesPerRow+t*e.bytesPerPixel,s=new DataView(e.arrayBuffer,n,e.bytesPerPixel),o=0,a=[];for(let e=0;e<4;e++){let t=i[e];if(t<=0)a.push(0);else{let e=function(e,t,r){if(t%8==0){let i=t/8;if(8===r&&i+1<=e.byteLength)return e.getUint8(i);if(16===r&&i+2<=e.byteLength)return e.getUint16(i,!1);if(32===r&&i+4<=e.byteLength)return e.getUint32(i,!1)}let i=0;for(let n=0;n<r;n++){let r=t+n,s=Math.floor(r/8),o=r%8;i=i<<1|e.getUint8(s)>>7-o&1}return i}(s,o,t);a.push(e),o+=t}}return[a[0],a[1],a[2],a[3]]}function e5(e,t,r,i){let n=t;for(let t=0;t<4;t++){let s=r[t],o=(1<<s)-1;(function(e,t,r,i){if(t%8==0){let n=t/8;if(8===r&&n+1<=e.byteLength){e.setUint8(n,255&i);return}if(16===r&&n+2<=e.byteLength){e.setUint16(n,65535&i,!1);return}if(32===r&&n+4<=e.byteLength){e.setUint32(n,i,!1);return}}for(let n=0;n<r;n++){let s=t+n,o=Math.floor(s/8),a=1<<7-s%8,l=i>>r-1-n&1,u=e.getUint8(o);u&=~a,l&&(u|=a),e.setUint8(o,u)}})(e,n,s,i[t]&o),n+=s}}},59830:function(e,t,r){"use strict";var i=Object.defineProperty,n=Object.getOwnPropertyDescriptor,s=Object.getOwnPropertyNames,o=Object.prototype.hasOwnProperty,a=(e,t,r)=>t in e?i(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,l=(e,t,r)=>(a(e,"symbol"!=typeof t?t+"":t,r),r),u={};((e,t)=>{for(var r in t)i(e,r,{get:t[r],enumerable:!0})})(u,{AnimationLoop:()=>A,AnimationLoopTemplate:()=>p,AsyncTexture:()=>Q,BackgroundTextureModel:()=>eg,BufferTransform:()=>es,ClipSpace:()=>ef,Computation:()=>e1,ConeGeometry:()=>eR,CubeGeometry:()=>eS,CylinderGeometry:()=>eF,GPUGeometry:()=>x,Geometry:()=>el,GroupNode:()=>eb,IcoSphereGeometry:()=>ek,KeyFrames:()=>d,LegacyPickingManager:()=>ts,Model:()=>et,ModelNode:()=>eA,PickingManager:()=>e5,PipelineFactory:()=>O,PlaneGeometry:()=>eG,ScenegraphNode:()=>em,ShaderFactory:()=>F,ShaderInputs:()=>z,ShaderPassRenderer:()=>eq,SphereGeometry:()=>eH,Swap:()=>eW,SwapBuffers:()=>e$,SwapFramebuffers:()=>eX,TextureTransform:()=>ea,Timeline:()=>f,TruncatedConeGeometry:()=>eT,cancelAnimationFramePolyfill:()=>m,colorPicking:()=>tn,indexPicking:()=>te,loadImage:()=>q,loadImageBitmap:()=>$,makeAnimationLoop:()=>T,makeRandomGenerator:()=>eV,requestAnimationFramePolyfill:()=>_,setPathPrefix:()=>X}),e.exports=((e,t,r,a)=>{if(t&&"object"==typeof t||"function"==typeof t)for(let l of s(t))o.call(e,l)||l===r||i(e,l,{get:()=>t[l],enumerable:!(a=n(t,l))||a.enumerable});return e})(i({},"__esModule",{value:!0}),u);var c=1,h=1,f=class{time=0;channels=new Map;animations=new Map;playing=!1;lastEngineTime=-1;constructor(){}addChannel(e){let{delay:t=0,duration:r=Number.POSITIVE_INFINITY,rate:i=1,repeat:n=1}=e,s=c++,o={time:0,delay:t,duration:r,rate:i,repeat:n};return this._setChannelTime(o,this.time),this.channels.set(s,o),s}removeChannel(e){for(let[t,r]of(this.channels.delete(e),this.animations))r.channel===e&&this.detachAnimation(t)}isFinished(e){let t=this.channels.get(e);return void 0!==t&&this.time>=t.delay+t.duration*t.repeat}getTime(e){if(void 0===e)return this.time;let t=this.channels.get(e);return void 0===t?-1:t.time}setTime(e){for(let t of(this.time=Math.max(0,e),this.channels.values()))this._setChannelTime(t,this.time);for(let e of this.animations.values()){let{animation:t,channel:r}=e;t.setTime(this.getTime(r))}}play(){this.playing=!0}pause(){this.playing=!1,this.lastEngineTime=-1}reset(){this.setTime(0)}attachAnimation(e,t){let r=h++;return this.animations.set(r,{animation:e,channel:t}),e.setTime(this.getTime(t)),r}detachAnimation(e){this.animations.delete(e)}update(e){this.playing&&(-1===this.lastEngineTime&&(this.lastEngineTime=e),this.setTime(this.time+(e-this.lastEngineTime)),this.lastEngineTime=e)}_setChannelTime(e,t){let r=t-e.delay;r>=e.duration*e.repeat?e.time=e.duration*e.rate:(e.time=Math.max(0,r)%e.duration,e.time*=e.rate)}},d=class{startIndex=-1;endIndex=-1;factor=0;times=[];values=[];_lastTime=-1;constructor(e){this.setKeyFrames(e),this.setTime(0)}setKeyFrames(e){let t=e.length;this.times.length=t,this.values.length=t;for(let r=0;r<t;++r)this.times[r]=e[r][0],this.values[r]=e[r][1];this._calculateKeys(this._lastTime)}setTime(e){(e=Math.max(0,e))!==this._lastTime&&(this._calculateKeys(e),this._lastTime=e)}getStartTime(){return this.times[this.startIndex]}getEndTime(){return this.times[this.endIndex]}getStartData(){return this.values[this.startIndex]}getEndData(){return this.values[this.endIndex]}_calculateKeys(e){let t=0,r=this.times.length;for(t=0;t<r-2&&!(this.times[t+1]>e);++t);this.startIndex=t,this.endIndex=t+1;let i=this.times[this.startIndex],n=this.times[this.endIndex];this.factor=Math.min(Math.max(0,(e-i)/(n-i)),1)}},p=class{constructor(e){}async onInitialize(e){return null}},g=r(97175);function _(e){return"undefined"!=typeof window&&window.requestAnimationFrame?window.requestAnimationFrame(e):setTimeout(e,1e3/60)}function m(e){return"undefined"!=typeof window&&window.cancelAnimationFrame?window.cancelAnimationFrame(e):clearTimeout(e)}var E=r(83406),v=0,b=class{device=null;canvas=null;props;animationProps=null;timeline=null;stats;cpuTime;gpuTime;frameRate;display;needsRedraw="initialized";_initialized=!1;_running=!1;_animationFrameId=null;_nextFramePromise=null;_resolveNextFrame=null;_cpuStartTime=0;_error=null;constructor(e){if(this.props={...b.defaultAnimationLoopProps,...e},!(e=this.props).device)throw Error("No device provided");this.stats=e.stats||new E.Stats({id:"animation-loop-stats"}),this.cpuTime=this.stats.get("CPU Time"),this.gpuTime=this.stats.get("GPU Time"),this.frameRate=this.stats.get("Frame Rate"),this.setProps({autoResizeViewport:e.autoResizeViewport}),this.start=this.start.bind(this),this.stop=this.stop.bind(this),this._onMousemove=this._onMousemove.bind(this),this._onMouseleave=this._onMouseleave.bind(this)}destroy(){this.stop(),this._setDisplay(null)}delete(){this.destroy()}reportError(e){this.props.onError(e),this._error=e}setNeedsRedraw(e){return this.needsRedraw=this.needsRedraw||e,this}setProps(e){return"autoResizeViewport"in e&&(this.props.autoResizeViewport=e.autoResizeViewport||!1),this}async start(){if(this._running)return this;this._running=!0;try{let e;if(this._initialized||(this._initialized=!0,await this._initDevice(),this._initialize(),await this.props.onInitialize(this._getAnimationProps())),!this._running)return null;return!1!==e&&(this._cancelAnimationFrame(),this._requestAnimationFrame()),this}catch(t){let e=t instanceof Error?t:Error("Unknown error");throw this.props.onError(e),e}}stop(){return this._running&&(this.animationProps&&!this._error&&this.props.onFinalize(this.animationProps),this._cancelAnimationFrame(),this._nextFramePromise=null,this._resolveNextFrame=null,this._running=!1),this}redraw(){var e;return(null==(e=this.device)?void 0:e.isLost)||this._error||(this._beginFrameTimers(),this._setupFrame(),this._updateAnimationProps(),this._renderFrame(this._getAnimationProps()),this._clearNeedsRedraw(),this._resolveNextFrame&&(this._resolveNextFrame(this),this._nextFramePromise=null,this._resolveNextFrame=null),this._endFrameTimers()),this}attachTimeline(e){return this.timeline=e,this.timeline}detachTimeline(){this.timeline=null}waitForRender(){return this.setNeedsRedraw("waitForRender"),this._nextFramePromise||(this._nextFramePromise=new Promise(e=>{this._resolveNextFrame=e})),this._nextFramePromise}async toDataURL(){if(this.setNeedsRedraw("toDataURL"),await this.waitForRender(),this.canvas instanceof HTMLCanvasElement)return this.canvas.toDataURL();throw Error("OffscreenCanvas")}_initialize(){this._startEventHandling(),this._initializeAnimationProps(),this._updateAnimationProps(),this._resizeViewport()}_setDisplay(e){this.display&&(this.display.destroy(),this.display.animationLoop=null),e&&(e.animationLoop=this),this.display=e}_requestAnimationFrame(){this._running&&(this._animationFrameId=_(this._animationFrame.bind(this)))}_cancelAnimationFrame(){null!==this._animationFrameId&&(m(this._animationFrameId),this._animationFrameId=null)}_animationFrame(){this._running&&(this.redraw(),this._requestAnimationFrame())}_renderFrame(e){var t;if(this.display){this.display._renderFrame(e);return}this.props.onRender(this._getAnimationProps()),null==(t=this.device)||t.submit()}_clearNeedsRedraw(){this.needsRedraw=!1}_setupFrame(){this._resizeViewport()}_initializeAnimationProps(){var e;let t=null==(e=this.device)?void 0:e.getDefaultCanvasContext();if(!this.device||!t)throw Error("loop");let r=null==t?void 0:t.canvas,i=t.props.useDevicePixels;this.animationProps={animationLoop:this,device:this.device,canvasContext:t,canvas:r,useDevicePixels:i,timeline:this.timeline,needsRedraw:!1,width:1,height:1,aspect:1,time:0,startTime:Date.now(),engineTime:0,tick:0,tock:0,_mousePosition:null}}_getAnimationProps(){if(!this.animationProps)throw Error("animationProps");return this.animationProps}_updateAnimationProps(){if(!this.animationProps)return;let{width:e,height:t,aspect:r}=this._getSizeAndAspect();(e!==this.animationProps.width||t!==this.animationProps.height)&&this.setNeedsRedraw("drawing buffer resized"),r!==this.animationProps.aspect&&this.setNeedsRedraw("drawing buffer aspect changed"),this.animationProps.width=e,this.animationProps.height=t,this.animationProps.aspect=r,this.animationProps.needsRedraw=this.needsRedraw,this.animationProps.engineTime=Date.now()-this.animationProps.startTime,this.timeline&&this.timeline.update(this.animationProps.engineTime),this.animationProps.tick=Math.floor(this.animationProps.time/1e3*60),this.animationProps.tock++,this.animationProps.time=this.timeline?this.timeline.getTime():this.animationProps.engineTime}async _initDevice(){if(this.device=await this.props.device,!this.device)throw Error("No device provided");this.canvas=this.device.getDefaultCanvasContext().canvas||null}_createInfoDiv(){if(this.canvas&&this.props.onAddHTML){let e=document.createElement("div");document.body.appendChild(e),e.style.position="relative";let t=document.createElement("div");t.style.position="absolute",t.style.left="10px",t.style.bottom="10px",t.style.width="300px",t.style.background="white",this.canvas instanceof HTMLCanvasElement&&e.appendChild(this.canvas),e.appendChild(t);let r=this.props.onAddHTML(t);r&&(t.innerHTML=r)}}_getSizeAndAspect(){var e,t;if(!this.device)return{width:1,height:1,aspect:1};let[r,i]=(null==(e=this.device)?void 0:e.getDefaultCanvasContext().getDevicePixelSize())||[1,1],n=1,s=null==(t=this.device)?void 0:t.getDefaultCanvasContext().canvas;return s&&s.clientHeight?n=s.clientWidth/s.clientHeight:r>0&&i>0&&(n=r/i),{width:r,height:i,aspect:n}}_resizeViewport(){this.props.autoResizeViewport&&this.device.gl&&this.device.gl.viewport(0,0,this.device.gl.drawingBufferWidth,this.device.gl.drawingBufferHeight)}_beginFrameTimers(){this.frameRate.timeEnd(),this.frameRate.timeStart(),this.cpuTime.timeStart()}_endFrameTimers(){this.cpuTime.timeEnd()}_startEventHandling(){this.canvas&&(this.canvas.addEventListener("mousemove",this._onMousemove.bind(this)),this.canvas.addEventListener("mouseleave",this._onMouseleave.bind(this)))}_onMousemove(e){e instanceof MouseEvent&&(this._getAnimationProps()._mousePosition=[e.offsetX,e.offsetY])}_onMouseleave(e){this._getAnimationProps()._mousePosition=null}},A=b;l(A,"defaultAnimationLoopProps",{device:null,onAddHTML:()=>"",onInitialize:async()=>null,onRender:()=>{},onFinalize:()=>{},onError:e=>console.error(e),stats:g.luma.stats.get(`animation-loop-${v++}`),autoResizeViewport:!1});var y=r(97175);function T(e,t){let r=null,i=(null==t?void 0:t.device)||y.luma.createDevice({id:"animation-loop",adapters:null==t?void 0:t.adapters,createCanvasContext:!0}),n=new A({...t,device:i,async onInitialize(t){!function(e){let t=document.getElementById("animation-loop-error");t&&t.remove()}(t.animationLoop.device);try{return r=new e(t),await (null==r?void 0:r.onInitialize(t))}catch(e){return function(e,t){var r;let i=null==e?void 0:e.getDefaultCanvasContext().canvas;if(i instanceof HTMLCanvasElement){i.style.overflow="visible";let e=document.getElementById("animation-loop-error");null==e||e.remove(),(e=document.createElement("h1")).id="animation-loop-error",e.innerHTML=t.message,e.style.position="absolute",e.style.top="10px",e.style.left="10px",e.style.color="black",e.style.backgroundColor="red",null==(r=i.parentElement)||r.appendChild(e)}}(t.animationLoop.device,e),null}},onRender:e=>null==r?void 0:r.onRender(e),onFinalize:e=>null==r?void 0:r.onFinalize(e)});return n.getInfo=()=>this.AnimationLoopTemplateCtor.info,n}var R=r(97175),S=r(80718),M=r(97175),I={};function C(e="id"){I[e]=I[e]||1;let t=I[e]++;return`${e}-${t}`}var x=class{id;userData={};topology;bufferLayout=[];vertexCount;indices;attributes;constructor(e){if(this.id=e.id||C("geometry"),this.topology=e.topology,this.indices=e.indices||null,this.attributes=e.attributes,this.vertexCount=e.vertexCount,this.bufferLayout=e.bufferLayout||[],this.indices&&!(this.indices.usage&M.Buffer.INDEX))throw Error("Index buffer must have INDEX usage")}destroy(){var e;for(let t of(null==(e=this.indices)||e.destroy(),Object.values(this.attributes)))t.destroy()}getVertexCount(){return this.vertexCount}getAttributes(){return this.attributes}getIndexes(){return this.indices||null}_calculateVertexCount(e){return e.byteLength/12}},w=r(97175),N=class{static getDefaultPipelineFactory(e){return e._lumaData.defaultPipelineFactory=e._lumaData.defaultPipelineFactory||new N(e),e._lumaData.defaultPipelineFactory}device;cachingEnabled;destroyPolicy;debug;_hashCounter=0;_hashes={};_renderPipelineCache={};_computePipelineCache={};get[Symbol.toStringTag](){return"PipelineFactory"}toString(){return`PipelineFactory(${this.device.id})`}constructor(e){this.device=e,this.cachingEnabled=e.props._cachePipelines,this.destroyPolicy=e.props._cacheDestroyPolicy,this.debug=e.props.debugFactories}createRenderPipeline(e){var t;if(!this.cachingEnabled)return this.device.createRenderPipeline(e);let r={...w.RenderPipeline.defaultProps,...e},i=this._renderPipelineCache,n=this._hashRenderPipeline(r),s=null==(t=i[n])?void 0:t.pipeline;return s?(i[n].useCount++,this.debug&&w.log.warn(`${this}: ${i[n].pipeline} reused, count=${i[n].useCount}, (id=${e.id})`)()):((s=this.device.createRenderPipeline({...r,id:r.id?`${r.id}-cached`:C("unnamed-cached")})).hash=n,i[n]={pipeline:s,useCount:1},this.debug&&w.log.warn(`${this}: ${s} created, count=${i[n].useCount}`)()),s}createComputePipeline(e){var t;if(!this.cachingEnabled)return this.device.createComputePipeline(e);let r={...w.ComputePipeline.defaultProps,...e},i=this._computePipelineCache,n=this._hashComputePipeline(r),s=null==(t=i[n])?void 0:t.pipeline;return s?(i[n].useCount++,this.debug&&w.log.warn(`${this}: ${i[n].pipeline} reused, count=${i[n].useCount}, (id=${e.id})`)()):((s=this.device.createComputePipeline({...r,id:r.id?`${r.id}-cached`:void 0})).hash=n,i[n]={pipeline:s,useCount:1},this.debug&&w.log.warn(`${this}: ${s} created, count=${i[n].useCount}`)()),s}release(e){if(!this.cachingEnabled){e.destroy();return}let t=this._getCache(e),r=e.hash;t[r].useCount--,0===t[r].useCount?(this._destroyPipeline(e),this.debug&&w.log.warn(`${this}: ${e} released and destroyed`)()):t[r].useCount<0?(w.log.error(`${this}: ${e} released, useCount < 0, resetting`)(),t[r].useCount=0):this.debug&&w.log.warn(`${this}: ${e} released, count=${t[r].useCount}`)()}_destroyPipeline(e){let t=this._getCache(e);switch(this.destroyPolicy){case"never":return!1;case"unused":return delete t[e.hash],e.destroy(),!0}}_getCache(e){let t;if(e instanceof w.ComputePipeline&&(t=this._computePipelineCache),e instanceof w.RenderPipeline&&(t=this._renderPipelineCache),!t)throw Error(`${this}`);if(!t[e.hash])throw Error(`${this}: ${e} matched incorrect entry`);return t}_hashComputePipeline(e){let{type:t}=this.device,r=this._getHash(e.shader.source);return`${t}/C/${r}`}_hashRenderPipeline(e){let t=e.vs?this._getHash(e.vs.source):0,r=e.fs?this._getHash(e.fs.source):0,i=this._getHash(JSON.stringify(e.bufferLayout)),{type:n}=this.device;if("webgl"===n)return`${n}/R/${t}/${r}V-BL${i}`;{let s=this._getHash(JSON.stringify(e.parameters));return`${n}/R/${t}/${r}V-T${e.topology}P${s}BL${i}`}}_getHash(e){return void 0===this._hashes[e]&&(this._hashes[e]=this._hashCounter++),this._hashes[e]}},O=N;l(O,"defaultProps",{...w.RenderPipeline.defaultProps});var P=r(97175),L=class{static getDefaultShaderFactory(e){return e._lumaData.defaultShaderFactory||=new L(e),e._lumaData.defaultShaderFactory}device;cachingEnabled;destroyPolicy;debug;_cache={};get[Symbol.toStringTag](){return"ShaderFactory"}toString(){return`${this[Symbol.toStringTag]}(${this.device.id})`}constructor(e){this.device=e,this.cachingEnabled=e.props._cacheShaders,this.destroyPolicy=e.props._cacheDestroyPolicy,this.debug=!0}createShader(e){if(!this.cachingEnabled)return this.device.createShader(e);let t=this._hashShader(e),r=this._cache[t];if(r)r.useCount++,this.debug&&P.log.warn(`${this}: Reusing shader ${r.shader.id} count=${r.useCount}`)();else{let i=this.device.createShader({...e,id:e.id?`${e.id}-cached`:void 0});this._cache[t]=r={shader:i,useCount:1},this.debug&&P.log.warn(`${this}: Created new shader ${i.id}`)()}return r.shader}release(e){if(!this.cachingEnabled){e.destroy();return}let t=this._hashShader(e),r=this._cache[t];if(r){if(r.useCount--,0===r.useCount)"unused"===this.destroyPolicy&&(delete this._cache[t],r.shader.destroy(),this.debug&&P.log.warn(`${this}: Releasing shader ${e.id}, destroyed`)());else if(r.useCount<0)throw Error(`ShaderFactory: Shader ${e.id} released too many times`);else this.debug&&P.log.warn(`${this}: Releasing shader ${e.id} count=${r.useCount}`)()}}_hashShader(e){return`${e.stage}:${e.source}`}},F=L;l(F,"defaultProps",{...P.Shader.defaultProps});var B=null,D=null,U=r(97175),k=class{bufferLayouts;constructor(e){this.bufferLayouts=e}getBufferLayout(e){return this.bufferLayouts.find(t=>t.name===e)||null}getAttributeNamesForBuffer(e){var t;return e.attributes?null==(t=e.attributes)?void 0:t.map(e=>e.attribute):[e.name]}mergeBufferLayouts(e,t){let r=[...e];for(let e of t){let t=r.findIndex(t=>t.name===e.name);t<0?r.push(e):r[t]=e}return r}getBufferIndex(e){let t=this.bufferLayouts.findIndex(t=>t.name===e);return -1===t&&U.log.warn(`BufferLayout: Missing buffer for "${e}".`)(),t}},G=r(97175),H=r(80718),V=r(49156),z=class{options={disableWarnings:!1};modules;moduleUniforms;moduleBindings;constructor(e,t){for(let r of(Object.assign(this.options,t),(0,H.getShaderModuleDependencies)(Object.values(e).filter(e=>e.dependencies))))e[r.name]=r;for(let[t,r]of(G.log.log(1,"Creating ShaderInputs with modules",Object.keys(e))(),this.modules=e,this.moduleUniforms={},this.moduleBindings={},Object.entries(e)))this._addModule(r),r.name&&t!==r.name&&!this.options.disableWarnings&&G.log.warn(`Module name: ${t} vs ${r.name}`)()}destroy(){}setProps(e){var t;for(let r of Object.keys(e)){let i=e[r]||{},n=this.modules[r];if(!n){this.options.disableWarnings||G.log.warn(`Module ${r} not found`)();continue}let s=this.moduleUniforms[r],o=this.moduleBindings[r],{uniforms:a,bindings:l}=function(e){let t={bindings:{},uniforms:{}};return Object.keys(e).forEach(r=>{let i=e[r];(0,V.isNumericArray)(i)||"number"==typeof i||"boolean"==typeof i?t.uniforms[r]=i:t.bindings[r]=i}),t}((null==(t=n.getUniforms)?void 0:t.call(n,i,s))||i);this.moduleUniforms[r]={...s,...a},this.moduleBindings[r]={...o,...l}}}getModules(){return Object.values(this.modules)}getUniformValues(){return this.moduleUniforms}getBindingValues(){let e={};for(let t of Object.values(this.moduleBindings))Object.assign(e,t);return e}getDebugTable(){var e;let t={};for(let[r,i]of Object.entries(this.moduleUniforms))for(let[n,s]of Object.entries(i))t[`${r}.${n}`]={type:null==(e=this.modules[r].uniformTypes)?void 0:e[n],value:String(s)};return t}_addModule(e){let t=e.name;this.moduleUniforms[t]=e.defaultUniforms||{},this.moduleBindings[t]={}}},j=r(97175),W="";function X(e){W=e}async function $(e,t){let r=new Image;return r.crossOrigin=(null==t?void 0:t.crossOrigin)||"anonymous",r.src=e.startsWith("http")?e:W+e,await r.decode(),t?await createImageBitmap(r,t):await createImageBitmap(r)}async function q(e,t){return await new Promise((r,i)=>{try{let n=new Image;n.onload=()=>r(n),n.onerror=()=>i(Error(`Could not load image ${e}.`)),n.crossOrigin=(null==t?void 0:t.crossOrigin)||"anonymous",n.src=e.startsWith("http")?e:W+e}catch(e){i(e)}})}var Y=["+X","-X","+Y","-Y","+Z","-Z"],Z=["+X","-X","+Y","-Y","+Z","-Z"],K=class{device;id;props;texture;sampler;view;ready;isReady=!1;destroyed=!1;resolveReady=()=>{};rejectReady=()=>{};get[Symbol.toStringTag](){return"AsyncTexture"}toString(){return`AsyncTexture:"${this.id}"(${this.isReady?"ready":"loading"})`}constructor(e,t){this.device=e;let r=C("async-texture");this.props={...K.defaultProps,id:r,...t},this.id=this.props.id,"string"==typeof(t={...t}).data&&"2d"===t.dimension&&(t.data=$(t.data)),t.mipmaps&&(t.mipLevels="auto"),this.ready=new Promise((e,t)=>{this.resolveReady=()=>{this.isReady=!0,e()},this.rejectReady=t}),this.initAsync(t)}async initAsync(e){let t=e.data,r=await J(t).then(void 0,this.rejectReady);if(this.destroyed)return;let i=this.props.width&&this.props.height?{width:this.props.width,height:this.props.height}:this.getTextureDataSize(r);if(!i)throw Error("Texture size could not be determined");let n={...i,...e,data:void 0,mipLevels:1},s=this.device.getMipLevelCount(n.width,n.height);if(n.mipLevels="auto"===this.props.mipLevels?s:Math.min(s,this.props.mipLevels),this.texture=this.device.createTexture(n),this.sampler=this.texture.sampler,this.view=this.texture.view,e.data)switch(this.props.dimension){case"1d":this._setTexture1DData(this.texture,r);break;case"2d":this._setTexture2DData(r);break;case"3d":this._setTexture3DData(this.texture,r);break;case"2d-array":this._setTextureArrayData(this.texture,r);break;case"cube":this._setTextureCubeData(this.texture,r);break;case"cube-array":this._setTextureCubeArrayData(this.texture,r)}this.props.mipmaps&&this.generateMipmaps(),j.log.info(1,`${this} loaded`),this.resolveReady()}destroy(){this.texture&&(this.texture.destroy(),this.texture=null),this.destroyed=!0}generateMipmaps(){this.texture.generateMipmapsWebGL()}setSampler(e={}){this.texture.setSampler(e instanceof j.Sampler?e:this.device.createSampler(e))}resize(e){if(!this.isReady)throw Error("Cannot resize texture before it is ready");if(e.width===this.texture.width&&e.height===this.texture.height)return!1;if(this.texture){let t=this.texture;this.texture=t.clone(e),t.destroy()}return!0}isTextureLevelData(e){return ArrayBuffer.isView(null==e?void 0:e.data)}getTextureDataSize(e){if(!e||ArrayBuffer.isView(e))return null;if(Array.isArray(e))return this.getTextureDataSize(e[0]);if(this.device.isExternalImage(e))return this.device.getExternalImageSize(e);if(e&&"object"==typeof e&&e.constructor===Object){let t=Object.values(e)[0];return{width:t.width,height:t.height}}throw Error("texture size deduction failed")}getCubeFaceDepth(e){switch(e){case"+X":return 0;case"-X":return 1;case"+Y":return 2;case"-Y":return 3;case"+Z":return 4;case"-Z":return 5;default:throw Error(e)}}setTextureData(e){}_setTexture1DData(e,t){throw Error("setTexture1DData not supported in WebGL.")}_setTexture2DData(e,t=0){if(!this.texture)throw Error("Texture not initialized");let r=this._normalizeTextureData(e);r.length>1&&!1!==this.props.mipmaps&&j.log.warn(`Texture ${this.id} mipmap and multiple LODs.`)();for(let e=0;e<r.length;e++){let i=r[e];this.device.isExternalImage(i)?this.texture.copyExternalImage({image:i,depth:t,mipLevel:e,flipY:!0}):this.texture.copyImageData({data:i.data,mipLevel:e})}}_setTexture3DData(e,t){var r;if((null==(r=this.texture)?void 0:r.props.dimension)!=="3d")throw Error(this.id);for(let e=0;e<t.length;e++)this._setTexture2DData(t[e],e)}_setTextureCubeData(e,t){var r;if((null==(r=this.texture)?void 0:r.props.dimension)!=="cube")throw Error(this.id);for(let[e,r]of Object.entries(t)){let t=Z.indexOf(e);this._setTexture2DData(r,t)}}_setTextureArrayData(e,t){var r;if((null==(r=this.texture)?void 0:r.props.dimension)!=="2d-array")throw Error(this.id);for(let e=0;e<t.length;e++)this._setTexture2DData(t[e],e)}_setTextureCubeArrayData(e,t){throw Error("setTextureCubeArrayData not supported in WebGL2.")}_setTextureCubeFaceData(e,t,r,i=0){Array.isArray(t)&&t.length>1&&!1!==this.props.mipmaps&&j.log.warn(`${this.id} has mipmap and multiple LODs.`)();let n=Y.indexOf(r);this._setTexture2DData(t,n)}_normalizeTextureData(e){let t=this.texture;return ArrayBuffer.isView(e)?[{data:e,width:t.width,height:t.height}]:Array.isArray(e)?e:[e]}},Q=K;async function J(e){if(Array.isArray(e=await e))return await Promise.all(e.map(J));if(e&&"object"==typeof e&&e.constructor===Object){let t=e,r=await Promise.all(Object.values(t)),i=Object.keys(t),n={};for(let e=0;e<i.length;e++)n[i[e]]=r[e];return n}return e}l(Q,"defaultProps",{...j.Texture.defaultProps,data:null,mipmaps:!1});var ee=class{device;id;source;vs;fs;pipelineFactory;shaderFactory;userData={};parameters;topology;bufferLayout;isInstanced=void 0;instanceCount=0;vertexCount;indexBuffer=null;bufferAttributes={};constantAttributes={};bindings={};vertexArray;transformFeedback=null;pipeline;shaderInputs;_uniformStore;_attributeInfos={};_gpuGeometry=null;props;_pipelineNeedsUpdate="newly created";_needsRedraw="initializing";_destroyed=!1;_lastDrawTimestamp=-1;get[Symbol.toStringTag](){return"Model"}toString(){return`Model(${this.id})`}constructor(e,t){var r,i,n;this.props={...ee.defaultProps,...t},t=this.props,this.id=t.id||C("model"),this.device=e,Object.assign(this.userData,t.userData);let s=Object.fromEntries((null==(r=this.props.modules)?void 0:r.map(e=>[e.name,e]))||[]),o=t.shaderInputs||new z(s,{disableWarnings:this.props.disableWarnings});this.setShaderInputs(o);let a={type:e.type,shaderLanguage:e.info.shadingLanguage,shaderLanguageVersion:e.info.shadingLanguageVersion,gpu:e.info.gpu,features:e.features},l=((null==(i=this.props.modules)?void 0:i.length)>0?this.props.modules:null==(n=this.shaderInputs)?void 0:n.getModules())||[];if("webgpu"===this.device.type&&this.props.source){let{source:e,getUniforms:t}=this.props.shaderAssembler.assembleWGSLShader({platformInfo:a,...this.props,modules:l});this.source=e,this._getModuleUniforms=t,this.props.shaderLayout||=(0,S.getShaderLayoutFromWGSL)(this.source)}else{let{vs:e,fs:t,getUniforms:r}=this.props.shaderAssembler.assembleGLSLShaderPair({platformInfo:a,...this.props,modules:l});this.vs=e,this.fs=t,this._getModuleUniforms=r}this.vertexCount=this.props.vertexCount,this.instanceCount=this.props.instanceCount,this.topology=this.props.topology,this.bufferLayout=this.props.bufferLayout,this.parameters=this.props.parameters,t.geometry&&this.setGeometry(t.geometry),this.pipelineFactory=t.pipelineFactory||O.getDefaultPipelineFactory(this.device),this.shaderFactory=t.shaderFactory||F.getDefaultShaderFactory(this.device),this.pipeline=this._updatePipeline(),this.vertexArray=e.createVertexArray({shaderLayout:this.pipeline.shaderLayout,bufferLayout:this.pipeline.bufferLayout}),this._gpuGeometry&&this._setGeometryAttributes(this._gpuGeometry),"isInstanced"in t&&(this.isInstanced=t.isInstanced),t.instanceCount&&this.setInstanceCount(t.instanceCount),t.vertexCount&&this.setVertexCount(t.vertexCount),t.indexBuffer&&this.setIndexBuffer(t.indexBuffer),t.attributes&&this.setAttributes(t.attributes),t.constantAttributes&&this.setConstantAttributes(t.constantAttributes),t.bindings&&this.setBindings(t.bindings),t.transformFeedback&&(this.transformFeedback=t.transformFeedback),Object.seal(this)}destroy(){var e;this._destroyed||(this.pipelineFactory.release(this.pipeline),this.shaderFactory.release(this.pipeline.vs),this.pipeline.fs&&this.shaderFactory.release(this.pipeline.fs),this._uniformStore.destroy(),null==(e=this._gpuGeometry)||e.destroy(),this._destroyed=!0)}needsRedraw(){this._getBindingsUpdateTimestamp()>this._lastDrawTimestamp&&this.setNeedsRedraw("contents of bound textures or buffers updated");let e=this._needsRedraw;return this._needsRedraw=!1,e}setNeedsRedraw(e){this._needsRedraw||=e}predraw(){this.updateShaderInputs(),this.pipeline=this._updatePipeline()}draw(e){let t;let r=this._areBindingsLoading();if(r)return R.log.info(2,`>>> DRAWING ABORTED ${this.id}: ${r} not loaded`)(),!1;try{e.pushDebugGroup(`${this}.predraw(${e})`),this.predraw()}finally{e.popDebugGroup()}try{e.pushDebugGroup(`${this}.draw(${e})`),this._logDrawCallStart(),this.pipeline=this._updatePipeline();let r=this._getBindings();this.pipeline.setBindings(r,{disableWarnings:this.props.disableWarnings});let{indexBuffer:i}=this.vertexArray,n=i?i.byteLength/("uint32"===i.indexType?4:2):void 0;t=this.pipeline.draw({renderPass:e,vertexArray:this.vertexArray,isInstanced:this.isInstanced,vertexCount:this.vertexCount,instanceCount:this.instanceCount,indexCount:n,transformFeedback:this.transformFeedback||void 0,parameters:this.parameters,topology:this.topology})}finally{e.popDebugGroup(),this._logDrawCallEnd()}return this._logFramebuffer(e),t?(this._lastDrawTimestamp=this.device.timestamp,this._needsRedraw=!1):this._needsRedraw="waiting for resource initialization",t}setGeometry(e){var t;null==(t=this._gpuGeometry)||t.destroy();let r=e&&function(e,t){if(t instanceof x)return t;let r=function(e,t){if(!t.indices)return;let r=t.indices.value;return e.createBuffer({usage:M.Buffer.INDEX,data:r})}(e,t),{attributes:i,bufferLayout:n}=function(e,t){let r=[],i={};for(let[n,s]of Object.entries(t.attributes)){let t=n;switch(n){case"POSITION":t="positions";break;case"NORMAL":t="normals";break;case"TEXCOORD_0":t="texCoords";break;case"COLOR_0":t="colors"}if(s){i[t]=e.createBuffer({data:s.value,id:`${n}-buffer`});let{value:o,size:a,normalized:l}=s;r.push({name:t,format:(0,M.getVertexFormatFromAttribute)(o,a,l)})}}return{attributes:i,bufferLayout:r,vertexCount:t._calculateVertexCount(t.attributes,t.indices)}}(e,t);return new x({topology:t.topology||"triangle-list",bufferLayout:n,vertexCount:t.vertexCount,indices:r,attributes:i})}(this.device,e);if(r){this.setTopology(r.topology||"triangle-list");let e=new k(this.bufferLayout);this.bufferLayout=e.mergeBufferLayouts(r.bufferLayout,this.bufferLayout),this.vertexArray&&this._setGeometryAttributes(r)}this._gpuGeometry=r}setTopology(e){e!==this.topology&&(this.topology=e,this._setPipelineNeedsUpdate("topology"))}setBufferLayout(e){let t=new k(this.bufferLayout);this.bufferLayout=this._gpuGeometry?t.mergeBufferLayouts(e,this._gpuGeometry.bufferLayout):e,this._setPipelineNeedsUpdate("bufferLayout"),this.pipeline=this._updatePipeline(),this.vertexArray=this.device.createVertexArray({shaderLayout:this.pipeline.shaderLayout,bufferLayout:this.pipeline.bufferLayout}),this._gpuGeometry&&this._setGeometryAttributes(this._gpuGeometry)}setParameters(e){!function e(t,r,i){if(t===r)return!0;if(!i||!t||!r)return!1;if(Array.isArray(t)){if(!Array.isArray(r)||t.length!==r.length)return!1;for(let n=0;n<t.length;n++)if(!e(t[n],r[n],i-1))return!1;return!0}if(Array.isArray(r))return!1;if("object"==typeof t&&"object"==typeof r){let n=Object.keys(t),s=Object.keys(r);if(n.length!==s.length)return!1;for(let s of n)if(!r.hasOwnProperty(s)||!e(t[s],r[s],i-1))return!1;return!0}return!1}(e,this.parameters,2)&&(this.parameters=e,this._setPipelineNeedsUpdate("parameters"))}setInstanceCount(e){this.instanceCount=e,void 0===this.isInstanced&&e>0&&(this.isInstanced=!0),this.setNeedsRedraw("instanceCount")}setVertexCount(e){this.vertexCount=e,this.setNeedsRedraw("vertexCount")}setShaderInputs(e){for(let[t,r]of(this.shaderInputs=e,this._uniformStore=new R.UniformStore(this.shaderInputs.modules),Object.entries(this.shaderInputs.modules)))if(r.uniformTypes&&!function(e){for(let t in e)return!1;return!0}(r.uniformTypes)){let e=this._uniformStore.getManagedUniformBuffer(this.device,t);this.bindings[`${t}Uniforms`]=e}this.setNeedsRedraw("shaderInputs")}updateShaderInputs(){this._uniformStore.setUniforms(this.shaderInputs.getUniformValues()),this.setBindings(this.shaderInputs.getBindingValues()),this.setNeedsRedraw("shaderInputs")}setBindings(e){Object.assign(this.bindings,e),this.setNeedsRedraw("bindings")}setTransformFeedback(e){this.transformFeedback=e,this.setNeedsRedraw("transformFeedback")}setIndexBuffer(e){this.vertexArray.setIndexBuffer(e),this.setNeedsRedraw("indexBuffer")}setAttributes(e,t){let r=(null==t?void 0:t.disableWarnings)??this.props.disableWarnings;e.indices&&R.log.warn(`Model:${this.id} setAttributes() - indexBuffer should be set using setIndexBuffer()`)(),this.bufferLayout=function(e,t){let r=Object.fromEntries(e.attributes.map(e=>[e.name,e.location])),i=t.slice();return i.sort((e,t)=>{let i=e.attributes?e.attributes.map(e=>e.attribute):[e.name],n=t.attributes?t.attributes.map(e=>e.attribute):[t.name];return Math.min(...i.map(e=>r[e]))-Math.min(...n.map(e=>r[e]))}),i}(this.pipeline.shaderLayout,this.bufferLayout);let i=new k(this.bufferLayout);for(let[t,n]of Object.entries(e)){let e=i.getBufferLayout(t);if(!e){r||R.log.warn(`Model(${this.id}): Missing layout for buffer "${t}".`)();continue}let s=i.getAttributeNamesForBuffer(e),o=!1;for(let e of s){let t=this._attributeInfos[e];if(t){let e="webgpu"===this.device.type?i.getBufferIndex(t.bufferName):t.location;this.vertexArray.setBuffer(e,n),o=!0}}o||r||R.log.warn(`Model(${this.id}): Ignoring buffer "${n.id}" for unknown attribute "${t}"`)()}this.setNeedsRedraw("attributes")}setConstantAttributes(e,t){for(let[r,i]of Object.entries(e)){let e=this._attributeInfos[r];e?this.vertexArray.setConstantWebGL(e.location,i):((null==t?void 0:t.disableWarnings)??this.props.disableWarnings)||R.log.warn(`Model "${this.id}: Ignoring constant supplied for unknown attribute "${r}"`)()}this.setNeedsRedraw("constants")}_areBindingsLoading(){for(let e of Object.values(this.bindings))if(e instanceof Q&&!e.isReady)return e.id;return!1}_getBindings(){let e={};for(let[t,r]of Object.entries(this.bindings))r instanceof Q?r.isReady&&(e[t]=r.texture):e[t]=r;return e}_getBindingsUpdateTimestamp(){let e=0;for(let t of Object.values(this.bindings))t instanceof R.TextureView?e=Math.max(e,t.texture.updateTimestamp):t instanceof R.Buffer||t instanceof R.Texture?e=Math.max(e,t.updateTimestamp):t instanceof Q?e=t.texture?Math.max(e,t.texture.updateTimestamp):1/0:t instanceof R.Sampler||(e=Math.max(e,t.buffer.updateTimestamp));return e}_setGeometryAttributes(e){let t={...e.attributes};for(let[e]of Object.entries(t))this.pipeline.shaderLayout.attributes.find(t=>t.name===e)||"positions"===e||delete t[e];this.vertexCount=e.vertexCount,this.setIndexBuffer(e.indices||null),this.setAttributes(e.attributes,{disableWarnings:!0}),this.setAttributes(t,{disableWarnings:this.props.disableWarnings}),this.setNeedsRedraw("geometry attributes")}_setPipelineNeedsUpdate(e){this._pipelineNeedsUpdate||=e,this.setNeedsRedraw(e)}_updatePipeline(){if(this._pipelineNeedsUpdate){let e=null,t=null;this.pipeline&&(R.log.log(1,`Model ${this.id}: Recreating pipeline because "${this._pipelineNeedsUpdate}".`)(),e=this.pipeline.vs,t=this.pipeline.fs),this._pipelineNeedsUpdate=!1;let r=this.shaderFactory.createShader({id:`${this.id}-vertex`,stage:"vertex",source:this.source||this.vs,debugShaders:this.props.debugShaders}),i=null;this.source?i=r:this.fs&&(i=this.shaderFactory.createShader({id:`${this.id}-fragment`,stage:"fragment",source:this.source||this.fs,debugShaders:this.props.debugShaders})),this.pipeline=this.pipelineFactory.createRenderPipeline({...this.props,bufferLayout:this.bufferLayout,topology:this.topology,parameters:this.parameters,bindings:this._getBindings(),vs:r,fs:i}),this._attributeInfos=(0,R.getAttributeInfosFromLayouts)(this.pipeline.shaderLayout,this.bufferLayout),e&&this.shaderFactory.release(e),t&&this.shaderFactory.release(t)}return this.pipeline}_lastLogTime=0;_logOpen=!1;_logDrawCallStart(){let e=R.log.level>3?0:1e4;R.log.level<2||Date.now()-this._lastLogTime<e||(this._lastLogTime=Date.now(),this._logOpen=!0,R.log.group(2,`>>> DRAWING MODEL ${this.id}`,{collapsed:R.log.level<=2})())}_logDrawCallEnd(){if(this._logOpen){let e=function(e,t){var r;let i={},n="Values";if(0===e.attributes.length&&!(null==(r=e.varyings)?void 0:r.length))return{"No attributes or varyings":{[n]:"N/A"}};for(let t of e.attributes)if(t){let e=`${t.location} ${t.name}: ${t.type}`;i[`in ${e}`]={[n]:t.stepMode||"vertex"}}for(let t of e.varyings||[]){let e=`${t.location} ${t.name}`;i[`out ${e}`]={[n]:JSON.stringify(t)}}return i}(this.pipeline.shaderLayout,this.id);R.log.table(2,e)();let t=this.shaderInputs.getDebugTable();R.log.table(2,t)();let r=this._getAttributeDebugTable();R.log.table(2,this._attributeInfos)(),R.log.table(2,r)(),R.log.groupEnd(2)(),this._logOpen=!1}}_drawCount=0;_logFramebuffer(e){let t=this.device.props.debugFramebuffers;if(this._drawCount++,!t)return;let r=e.props.framebuffer;r&&function(e,{id:t,minimap:r,opaque:i,top:n="0",left:s="0",rgbaScale:o=1}){B||((B=document.createElement("canvas")).id=t,B.title=t,B.style.zIndex="100",B.style.position="absolute",B.style.top=n,B.style.left=s,B.style.border="blue 5px solid",B.style.transform="scaleY(-1)",document.body.appendChild(B),D=B.getContext("2d")),(B.width!==e.width||B.height!==e.height)&&(B.width=e.width/2,B.height=e.height/2,B.style.width="400px",B.style.height="400px");let a=e.device.readPixelsToArrayWebGL(e),l=null==D?void 0:D.createImageData(e.width,e.height);if(l){for(let e=0;e<a.length;e+=4)l.data[0+e+0]=a[e+0]*o,l.data[0+e+1]=a[e+1]*o,l.data[0+e+2]=a[e+2]*o,l.data[0+e+3]=i?255:a[e+3]*o;null==D||D.putImageData(l,0,0)}}(r,{id:r.id,minimap:!0})}_getAttributeDebugTable(){let e={};for(let[t,r]of Object.entries(this._attributeInfos)){let i=this.vertexArray.attributes[r.location];e[r.location]={name:t,type:r.shaderType,values:i?this._getBufferOrConstantValues(i,r.bufferDataType):"null"}}if(this.vertexArray.indexBuffer){let{indexBuffer:t}=this.vertexArray,r="uint32"===t.indexType?new Uint32Array(t.debugData):new Uint16Array(t.debugData);e.indices={name:"indices",type:t.indexType,values:r.toString()}}return e}_getBufferOrConstantValues(e,t){let r=(0,R.getTypedArrayConstructor)(t);return(e instanceof R.Buffer?new r(e.debugData):e).toString()}},et=ee;l(et,"defaultProps",{...R.RenderPipeline.defaultProps,source:void 0,vs:null,fs:null,id:"unnamed",handle:void 0,userData:{},defines:{},modules:[],geometry:null,indexBuffer:null,attributes:{},constantAttributes:{},varyings:[],isInstanced:void 0,instanceCount:0,vertexCount:0,shaderInputs:void 0,pipelineFactory:void 0,shaderFactory:void 0,transformFeedback:void 0,shaderAssembler:S.ShaderAssembler.getDefaultShaderAssembler(),debugShaders:void 0,disableWarnings:void 0});var er=r(97175),ei=r(80718),en=class{device;model;transformFeedback;static isSupported(e){var t;return(null==(t=null==e?void 0:e.info)?void 0:t.type)==="webgl"}constructor(e,t=en.defaultProps){if(!en.isSupported(e))throw Error("BufferTransform not yet implemented on WebGPU");this.device=e,this.model=new et(this.device,{id:t.id||"buffer-transform-model",fs:t.fs||(0,ei.getPassthroughFS)(),topology:t.topology||"point-list",varyings:t.outputs||t.varyings,...t}),this.transformFeedback=this.device.createTransformFeedback({layout:this.model.pipeline.shaderLayout,buffers:t.feedbackBuffers}),this.model.setTransformFeedback(this.transformFeedback),Object.seal(this)}destroy(){this.model&&this.model.destroy()}delete(){this.destroy()}run(e){(null==e?void 0:e.inputBuffers)&&this.model.setAttributes(e.inputBuffers),(null==e?void 0:e.outputBuffers)&&this.transformFeedback.setBuffers(e.outputBuffers);let t=this.device.beginRenderPass(e);this.model.draw(t),t.end()}getBuffer(e){return this.transformFeedback.getBuffer(e)}readAsync(e){let t=this.getBuffer(e);if(!t)throw Error("BufferTransform#getBuffer");if(t instanceof er.Buffer)return t.readAsync();let{buffer:r,byteOffset:i=0,byteLength:n=r.byteLength}=t;return r.readAsync(i,n)}},es=en;l(es,"defaultProps",{...et.defaultProps,outputs:void 0,feedbackBuffers:void 0});var eo=r(80718),ea=class{device;model;sampler;currentIndex=0;samplerTextureMap=null;bindings=[];resources={};constructor(e,t){this.device=e,this.sampler=e.createSampler({addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge",minFilter:"nearest",magFilter:"nearest",mipmapFilter:"nearest"}),this.model=new et(this.device,{id:t.id||C("texture-transform-model"),fs:t.fs||(0,eo.getPassthroughFS)({input:t.targetTextureVarying,inputChannels:t.targetTextureChannels,output:"transform_output"}),vertexCount:t.vertexCount,...t}),this._initialize(t),Object.seal(this)}destroy(){var e;for(let t of(this.model.destroy(),this.bindings))null==(e=t.framebuffer)||e.destroy()}delete(){this.destroy()}run(e){let{framebuffer:t}=this.bindings[this.currentIndex],r=this.device.beginRenderPass({framebuffer:t,...e});this.model.draw(r),r.end(),this.device.submit()}getTargetTexture(){let{targetTexture:e}=this.bindings[this.currentIndex];return e}getFramebuffer(){return this.bindings[this.currentIndex].framebuffer}_initialize(e){this._updateBindings(e)}_updateBindings(e){this.bindings[this.currentIndex]=this._updateBinding(this.bindings[this.currentIndex],e)}_updateBinding(e,{sourceBuffers:t,sourceTextures:r,targetTexture:i}){if(e||(e={sourceBuffers:{},sourceTextures:{},targetTexture:null}),Object.assign(e.sourceTextures,r),Object.assign(e.sourceBuffers,t),i){e.targetTexture=i;let{width:t,height:r}=i;e.framebuffer&&e.framebuffer.destroy(),e.framebuffer=this.device.createFramebuffer({id:"transform-framebuffer",width:t,height:r,colorAttachments:[i]}),e.framebuffer.resize({width:t,height:r})}return e}_setSourceTextureParameters(){let e=this.currentIndex,{sourceTextures:t}=this.bindings[e];for(let e in t)t[e].sampler=this.sampler}},el=class{id;topology;vertexCount;indices;attributes;userData={};constructor(e){let{attributes:t={},indices:r=null,vertexCount:i=null}=e;for(let[i,n]of(this.id=e.id||C("geometry"),this.topology=e.topology,r&&(this.indices=ArrayBuffer.isView(r)?{value:r,size:1}:r),this.attributes={},Object.entries(t))){let e=ArrayBuffer.isView(n)?{value:n}:n;if(!ArrayBuffer.isView(e.value))throw Error(`${this._print(i)}: must be typed array or object with value as typed array`);if("POSITION"!==i&&"positions"!==i||e.size||(e.size=3),"indices"===i){if(this.indices)throw Error("Multiple indices detected");this.indices=e}else this.attributes[i]=e}this.indices&&void 0!==this.indices.isIndexed&&(this.indices=Object.assign({},this.indices),delete this.indices.isIndexed),this.vertexCount=i||this._calculateVertexCount(this.attributes,this.indices)}getVertexCount(){return this.vertexCount}getAttributes(){return this.indices?{indices:this.indices,...this.attributes}:this.attributes}_print(e){return`Geometry ${this.id} attribute ${e}`}_setAttributes(e,t){return this}_calculateVertexCount(e,t){if(t)return t.value.length;let r=1/0;for(let t of Object.values(e)){let{value:e,size:i,constant:n}=t;!n&&e&&void 0!==i&&i>=1&&(r=Math.min(r,e.length/i))}return r}},eu=`struct VertexInputs {
  @location(0) clipSpacePosition: vec2<f32>,
  @location(1) texCoord: vec2<f32>,
  @location(2) coordinate: vec2<f32>  
}

struct FragmentInputs {
  @builtin(position) Position : vec4<f32>,
  @location(0) position : vec2<f32>,
  @location(1) coordinate : vec2<f32>,
  @location(2) uv : vec2<f32>
};

@vertex
fn vertexMain(inputs: VertexInputs) -> FragmentInputs {
  var outputs: FragmentInputs;
  outputs.Position = vec4(inputs.clipSpacePosition, 0., 1.);
  outputs.position = inputs.clipSpacePosition;
  outputs.coordinate = inputs.coordinate;
  outputs.uv = inputs.texCoord;
  return outputs;
}
`,ec=`#version 300 es
in vec2 clipSpacePositions;
in vec2 texCoords;
in vec2 coordinates;

out vec2 position;
out vec2 coordinate;
out vec2 uv;

void main(void) {
  gl_Position = vec4(clipSpacePositions, 0., 1.);
  position = clipSpacePositions;
  coordinate = coordinates;
  uv = texCoords;
}
`,eh=[-1,-1,1,-1,-1,1,1,1],ef=class extends et{constructor(e,t){let r=eh.map(e=>-1===e?0:e);t.source&&(t={...t,source:`${eu}
${t.source}`}),super(e,{id:t.id||C("clip-space"),...t,vs:ec,vertexCount:4,geometry:new el({topology:"triangle-strip",vertexCount:4,attributes:{clipSpacePositions:{size:2,value:new Float32Array(eh)},texCoords:{size:2,value:new Float32Array(r)},coordinates:{size:2,value:new Float32Array(r)}}})})}},ed=`@group(0) @binding(0) var backgroundTexture: texture_2d<f32>;
@group(0) @binding(1) var backgroundTextureSampler: sampler;

fn billboardTexture_getTextureUV(coordinates: vec2<f32>) -> vec2<f32> {
	let iTexSize: vec2<u32> = textureDimensions(backgroundTexture, 0);
	let texSize: vec2<f32> = vec2<f32>(f32(iTexSize.x), f32(iTexSize.y));
	var position: vec2<f32> = coordinates.xy / texSize;
	return position;
} 

@fragment
fn fragmentMain(inputs: FragmentInputs) -> @location(0) vec4<f32> {
	let position: vec2<f32> = billboardTexture_getTextureUV(inputs.coordinate);
	return textureSample(backgroundTexture, backgroundTextureSampler, position);
}
`,ep=`#version 300 es
precision highp float;

uniform sampler2D backgroundTexture;
out vec4 fragColor;

vec2 billboardTexture_getTextureUV() {
  ivec2 iTexSize = textureSize(backgroundTexture, 0);
  vec2 texSize = vec2(float(iTexSize.x), float(iTexSize.y));
  vec2 position = gl_FragCoord.xy / texSize;
  return position;
}

void main(void) {
  vec2 position = billboardTexture_getTextureUV();
  fragColor = texture(backgroundTexture, position);
}
`,eg=class extends ef{constructor(e,t){if(super(e,{id:t.id||"background-texture-model",source:ed,fs:ep,parameters:{depthWriteEnabled:!1,...t.blend?{blend:!0,blendColorOperation:"add",blendAlphaOperation:"add",blendColorSrcFactor:"one",blendColorDstFactor:"one-minus-src",blendAlphaSrcFactor:"one",blendAlphaDstFactor:"one-minus-src-alpha"}:{}}}),!t.backgroundTexture)throw Error("BackgroundTextureModel requires a backgroundTexture prop");this.setTexture(t.backgroundTexture)}setTexture(e){this.setBindings({backgroundTexture:e})}predraw(){this.shaderInputs.setProps({}),super.predraw()}},e_=r(6049),em=class{id;matrix=new e_.Matrix4;display=!0;position=new e_.Vector3;rotation=new e_.Vector3;scale=new e_.Vector3(1,1,1);userData={};props={};constructor(e={}){let{id:t}=e;this.id=t||C(this.constructor.name),this._setScenegraphNodeProps(e)}getBounds(){return null}destroy(){}delete(){this.destroy()}setProps(e){return this._setScenegraphNodeProps(e),this}toString(){return`{type: ScenegraphNode, id: ${this.id})}`}setPosition(e){return this.position=e,this}setRotation(e){return this.rotation=e,this}setScale(e){return this.scale=e,this}setMatrix(e,t=!0){t?this.matrix.copy(e):this.matrix=e}setMatrixComponents(e){let{position:t,rotation:r,scale:i,update:n=!0}=e;return t&&this.setPosition(t),r&&this.setRotation(r),i&&this.setScale(i),n&&this.updateMatrix(),this}updateMatrix(){let e=this.position,t=this.rotation,r=this.scale;return this.matrix.identity(),this.matrix.translate(e),this.matrix.rotateXYZ(t),this.matrix.scale(r),this}update(e={}){let{position:t,rotation:r,scale:i}=e;return t&&this.setPosition(t),r&&this.setRotation(r),i&&this.setScale(i),this.updateMatrix(),this}getCoordinateUniforms(e,t){t=t||this.matrix;let r=new e_.Matrix4(e).multiplyRight(t),i=r.invert(),n=i.transpose();return{viewMatrix:e,modelMatrix:t,objectMatrix:t,worldMatrix:r,worldInverseMatrix:i,worldInverseTransposeMatrix:n}}_setScenegraphNodeProps(e){"position"in e&&this.setPosition(e.position),"rotation"in e&&this.setRotation(e.rotation),"scale"in e&&this.setScale(e.scale),"matrix"in e&&this.setMatrix(e.matrix),Object.assign(this.props,e)}},eE=r(6049),ev=r(97175),eb=class extends em{children;constructor(e={}){let{children:t=[]}=e=Array.isArray(e)?{children:e}:e;ev.log.assert(t.every(e=>e instanceof em),"every child must an instance of ScenegraphNode"),super(e),this.children=t}getBounds(){let e=[[1/0,1/0,1/0],[-1/0,-1/0,-1/0]];return(this.traverse((t,{worldMatrix:r})=>{let i=t.getBounds();if(!i)return;let[n,s]=i,o=new eE.Vector3(n).add(s).divide([2,2,2]);r.transformAsPoint(o,o);let a=new eE.Vector3(s).subtract(n).divide([2,2,2]);r.transformAsVector(a,a);for(let t=0;t<8;t++){let r=new eE.Vector3(1&t?-1:1,2&t?-1:1,4&t?-1:1).multiply(a).add(o);for(let t=0;t<3;t++)e[0][t]=Math.min(e[0][t],r[t]),e[1][t]=Math.max(e[1][t],r[t])}}),Number.isFinite(e[0][0]))?e:null}destroy(){this.children.forEach(e=>e.destroy()),this.removeAll(),super.destroy()}add(...e){for(let t of e)Array.isArray(t)?this.add(...t):this.children.push(t);return this}remove(e){let t=this.children,r=t.indexOf(e);return r>-1&&t.splice(r,1),this}removeAll(){return this.children=[],this}traverse(e,{worldMatrix:t=new eE.Matrix4}={}){let r=new eE.Matrix4(t).multiplyRight(this.matrix);for(let t of this.children)t instanceof eb?t.traverse(e,{worldMatrix:r}):e(t,{worldMatrix:r})}},eA=class extends em{model;bounds=null;managedResources;constructor(e){super(e),this.model=e.model,this.managedResources=e.managedResources||[],this.bounds=e.bounds||null,this.setProps(e)}destroy(){this.model&&(this.model.destroy(),this.model=null),this.managedResources.forEach(e=>e.destroy()),this.managedResources=[]}getBounds(){return this.bounds}draw(e){return this.model.draw(e)}},ey={x:[2,0,1],y:[0,1,2],z:[1,2,0]},eT=class extends el{constructor(e={}){let{id:t=C("truncated-code-geometry")}=e,{indices:r,attributes:i}=function(e={}){let{bottomRadius:t=0,topRadius:r=0,height:i=1,nradial:n=10,nvertical:s=10,verticalAxis:o="y",topCap:a=!1,bottomCap:l=!1}=e,u=(a?2:0)+(l?2:0),c=(n+1)*(s+1+u),h=Math.atan2(t-r,i),f=Math.sin,d=Math.cos,p=Math.PI,g=d(h),_=f(h),m=a?-2:0,E=s+(l?2:0),v=n+1,b=new Uint16Array(n*(s+u)*6),A=ey[o],y=new Float32Array(3*c),T=new Float32Array(3*c),R=new Float32Array(2*c),S=0,M=0;for(let e=m;e<=E;e++){let o,a=e/s,l=i*a;e<0?(l=0,a=1,o=t):e>s?(l=i,a=1,o=r):o=t+e/s*(r-t),(-2===e||e===s+2)&&(o=0,a=0),l-=i/2;for(let t=0;t<v;t++){let r=f(t*p*2/n),i=d(t*p*2/n);y[S+A[0]]=r*o,y[S+A[1]]=l,y[S+A[2]]=i*o,T[S+A[0]]=e<0||e>s?0:r*g,T[S+A[1]]=e<0?-1:e>s?1:_,T[S+A[2]]=e<0||e>s?0:i*g,R[M+0]=t/n,R[M+1]=a,M+=2,S+=3}}for(let e=0;e<s+u;e++)for(let t=0;t<n;t++){let r=(e*n+t)*6;b[r+0]=v*(e+0)+0+t,b[r+1]=v*(e+0)+1+t,b[r+2]=v*(e+1)+1+t,b[r+3]=v*(e+0)+0+t,b[r+4]=v*(e+1)+1+t,b[r+5]=v*(e+1)+0+t}return{indices:b,attributes:{POSITION:y,NORMAL:T,TEXCOORD_0:R}}}(e);super({...e,id:t,topology:"triangle-list",indices:r,attributes:{POSITION:{size:3,value:i.POSITION},NORMAL:{size:3,value:i.NORMAL},TEXCOORD_0:{size:2,value:i.TEXCOORD_0},...e.attributes}})}},eR=class extends eT{constructor(e={}){let{id:t=C("cone-geometry"),radius:r=1,cap:i=!0}=e;super({...e,id:t,topRadius:0,topCap:!!i,bottomCap:!!i,bottomRadius:r})}},eS=class extends el{constructor(e={}){let{id:t=C("cube-geometry"),indices:r=!0}=e;super(r?{...e,id:t,topology:"triangle-list",indices:{size:1,value:eM},attributes:{...eP,...e.attributes}}:{...e,id:t,topology:"triangle-list",indices:void 0,attributes:{...eL,...e.attributes}})}},eM=new Uint16Array([0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,8,10,11,12,13,14,12,14,15,16,17,18,16,18,19,20,21,22,20,22,23]),eI=new Float32Array([-1,-1,1,1,-1,1,1,1,1,-1,1,1,-1,-1,-1,-1,1,-1,1,1,-1,1,-1,-1,-1,1,-1,-1,1,1,1,1,1,1,1,-1,-1,-1,-1,1,-1,-1,1,-1,1,-1,-1,1,1,-1,-1,1,1,-1,1,1,1,1,-1,1,-1,-1,-1,-1,-1,1,-1,1,1,-1,1,-1]),eC=new Float32Array([0,0,1,0,0,1,0,0,1,0,0,1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,1,0,0,1,0,0,1,0,0,1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,1,0,0,1,0,0,1,0,0,1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0]),ex=new Float32Array([0,0,1,0,1,1,0,1,1,0,1,1,0,1,0,0,0,1,0,0,1,0,1,1,1,1,0,1,0,0,1,0,1,0,1,1,0,1,0,0,0,0,1,0,1,1,0,1]),ew=new Float32Array([1,-1,1,-1,-1,1,-1,-1,-1,1,-1,-1,1,-1,1,-1,-1,-1,1,1,1,1,-1,1,1,-1,-1,1,1,-1,1,1,1,1,-1,-1,-1,1,1,1,1,1,1,1,-1,-1,1,-1,-1,1,1,1,1,-1,-1,-1,1,-1,1,1,-1,1,-1,-1,-1,-1,-1,-1,1,-1,1,-1,1,1,1,-1,1,1,-1,-1,1,-1,-1,1,1,-1,1,1,1,1,1,-1,-1,-1,-1,-1,-1,1,-1,1,1,-1,1,-1,-1,-1,1,-1]),eN=new Float32Array([1,1,0,1,0,0,1,0,1,1,0,0,1,1,0,1,0,0,1,0,1,1,0,0,1,1,0,1,0,0,1,0,1,1,0,0,1,1,0,1,0,0,1,0,1,1,0,0,1,1,0,1,0,0,0,0,1,0,1,1,1,1,0,1,0,0,1,0,1,1,0,0]),eO=new Float32Array([1,0,1,1,0,0,1,1,0,0,0,1,1,0,0,1,1,0,1,1,0,0,0,1,1,1,1,1,1,0,1,1,1,0,0,1,1,1,0,1,1,1,1,1,1,0,0,1,0,1,1,1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,0,1,0,0,1,1,0,1,1,1,0,1,0,1,0,0,0,1,0,0,1,1,0,1,0,1,1,1,1,1,0,1,1,1,0,0,1,1,0,0,1,1,1,0,1,1,1,1,1,1,1,0,0,1,0,0,0,1,0,1,0,1,1,1,0,1,1,0,0,1,0,1,0,1]),eP={POSITION:{size:3,value:eI},NORMAL:{size:3,value:eC},TEXCOORD_0:{size:2,value:ex}},eL={POSITION:{size:3,value:ew},TEXCOORD_0:{size:2,value:eN},COLOR_0:{size:3,value:eO}},eF=class extends eT{constructor(e={}){let{id:t=C("cylinder-geometry"),radius:r=1}=e;super({...e,id:t,bottomRadius:r,topRadius:r})}},eB=r(6049),eD=[-1,0,0,0,1,0,0,0,-1,0,0,1,0,-1,0,1,0,0],eU=[3,4,5,3,5,1,3,1,0,3,0,4,4,0,2,4,2,5,2,0,1,5,2,1],ek=class extends el{constructor(e={}){let{id:t=C("ico-sphere-geometry")}=e,{indices:r,attributes:i}=function(e){let{iterations:t=0}=e,r=Math.PI,i=2*r,n=[...eD],s=[...eU];n.push(),s.push();let o=(()=>{let e={};return(t,r)=>{let i=(t*=3)<(r*=3)?t:r,s=t>r?t:r,o=`${i}|${s}`;if(o in e)return e[o];let a=n[t],l=n[t+1],u=n[t+2],c=n[r],h=n[r+1],f=n[r+2],d=(a+c)/2,p=(l+h)/2,g=(u+f)/2,_=Math.sqrt(d*d+p*p+g*g);return d/=_,p/=_,g/=_,n.push(d,p,g),e[o]=n.length/3-1}})();for(let e=0;e<t;e++){let e=[];for(let t=0;t<s.length;t+=3){let r=o(s[t+0],s[t+1]),i=o(s[t+1],s[t+2]),n=o(s[t+2],s[t+0]);e.push(n,s[t+0],r,r,s[t+1],i,i,s[t+2],n,r,i,n)}s=e}let a=Array(n.length),l=Array(n.length/3*2),u=s.length;for(let e=u-3;e>=0;e-=3){let t;let o=s[e+0],u=s[e+1],c=s[e+2],h=3*o,f=3*u,d=3*c,p=2*o,g=2*u,_=2*c,m=n[h+0],E=n[h+1],v=n[h+2],b=Math.acos(v/Math.sqrt(m*m+E*E+v*v)),A=Math.atan2(E,m)+r,y=b/r,T=1-A/i,R=n[f+0],S=n[f+1],M=n[f+2],I=Math.acos(M/Math.sqrt(R*R+S*S+M*M)),C=Math.atan2(S,R)+r,x=I/r,w=1-C/i,N=n[d+0],O=n[d+1],P=n[d+2],L=Math.acos(P/Math.sqrt(N*N+O*O+P*P)),F=Math.atan2(O,N)+r,B=L/r,D=1-F/i,U=[N-R,O-S,P-M],k=[m-R,E-S,v-M],G=new eB.Vector3(U).cross(k).normalize();(0===T||0===w||0===D)&&(0===T||T>.5)&&(0===w||w>.5)&&(0===D||D>.5)&&(n.push(n[h+0],n[h+1],n[h+2]),t=n.length/3-1,s.push(t),l[2*t+0]=1,l[2*t+1]=y,a[3*t+0]=G.x,a[3*t+1]=G.y,a[3*t+2]=G.z,n.push(n[f+0],n[f+1],n[f+2]),t=n.length/3-1,s.push(t),l[2*t+0]=1,l[2*t+1]=x,a[3*t+0]=G.x,a[3*t+1]=G.y,a[3*t+2]=G.z,n.push(n[d+0],n[d+1],n[d+2]),t=n.length/3-1,s.push(t),l[2*t+0]=1,l[2*t+1]=B,a[3*t+0]=G.x,a[3*t+1]=G.y,a[3*t+2]=G.z),a[h+0]=a[f+0]=a[d+0]=G.x,a[h+1]=a[f+1]=a[d+1]=G.y,a[h+2]=a[f+2]=a[d+2]=G.z,l[p+0]=T,l[p+1]=y,l[g+0]=w,l[g+1]=x,l[_+0]=D,l[_+1]=B}return{indices:{size:1,value:new Uint16Array(s)},attributes:{POSITION:{size:3,value:new Float32Array(n)},NORMAL:{size:3,value:new Float32Array(a)},TEXCOORD_0:{size:2,value:new Float32Array(l)}}}}(e);super({...e,id:t,topology:"triangle-list",indices:r,attributes:{...i,...e.attributes}})}},eG=class extends el{constructor(e={}){let{id:t=C("plane-geometry")}=e,{indices:r,attributes:i}=function(e){let{type:t="x,y",offset:r=0,flipCull:i=!1,unpack:n=!1}=e,s=t.split(","),o=e[`${s[0]}len`]||1,a=e[`${s[1]}len`]||1,l=e[`n${s[0]}`]||1,u=e[`n${s[1]}`]||1,c=(l+1)*(u+1),h=new Float32Array(3*c),f=new Float32Array(3*c),d=new Float32Array(2*c);i&&(o=-o);let p=0,g=0;for(let e=0;e<=u;e++)for(let n=0;n<=l;n++){let s=n/l,c=e/u;switch(d[p+0]=i?1-s:s,d[p+1]=c,t){case"x,y":h[g+0]=o*s-.5*o,h[g+1]=a*c-.5*a,h[g+2]=r,f[g+0]=0,f[g+1]=0,f[g+2]=i?1:-1;break;case"x,z":h[g+0]=o*s-.5*o,h[g+1]=r,h[g+2]=a*c-.5*a,f[g+0]=0,f[g+1]=i?1:-1,f[g+2]=0;break;case"y,z":h[g+0]=r,h[g+1]=o*s-.5*o,h[g+2]=a*c-.5*a,f[g+0]=i?1:-1,f[g+1]=0,f[g+2]=0;break;default:throw Error("PlaneGeometry: unknown type")}p+=2,g+=3}let _=l+1,m=new Uint16Array(l*u*6);for(let e=0;e<u;e++)for(let t=0;t<l;t++){let r=(e*l+t)*6;m[r+0]=(e+0)*_+t,m[r+1]=(e+1)*_+t,m[r+2]=(e+0)*_+t+1,m[r+3]=(e+1)*_+t,m[r+4]=(e+1)*_+t+1,m[r+5]=(e+0)*_+t+1}let E={indices:{size:1,value:m},attributes:{POSITION:{size:3,value:h},NORMAL:{size:3,value:f},TEXCOORD_0:{size:2,value:d}}};return n?function(e){let{indices:t,attributes:r}=e;if(!t)return e;let i=t.value.length,n={};for(let e in r){let{constant:s,value:o,size:a}=r[e];if(s||!a)continue;let l=new o.constructor(i*a);for(let e=0;e<i;++e){let r=t.value[e];for(let t=0;t<a;t++)l[e*a+t]=o[r*a+t]}n[e]={size:a,value:l}}return{attributes:Object.assign({},r,n)}}(E):E}(e);super({...e,id:t,topology:"triangle-list",indices:r,attributes:{...i,...e.attributes}})}},eH=class extends el{constructor(e={}){let{id:t=C("sphere-geometry")}=e,{indices:r,attributes:i}=function(e){let{nlat:t=10,nlong:r=10}=e,i=Math.PI-0,n=2*Math.PI-0,s=(t+1)*(r+1),o=(t,r,i,n,s)=>e.radius||1,a=new Float32Array(3*s),l=new Float32Array(3*s),u=new Float32Array(2*s),c=new(s>65535?Uint32Array:Uint16Array)(t*r*6);for(let e=0;e<=t;e++)for(let s=0;s<=r;s++){let c=s/r,h=e/t,f=s+e*(r+1),d=2*f,p=3*f,g=n*c,_=i*h,m=Math.sin(g),E=Math.sin(_),v=Math.cos(_),b=Math.cos(g)*E,A=m*E,y=o(b,v,A,c,h);a[p+0]=y*b,a[p+1]=y*v,a[p+2]=y*A,l[p+0]=b,l[p+1]=v,l[p+2]=A,u[d+0]=c,u[d+1]=1-h}let h=r+1;for(let e=0;e<r;e++)for(let r=0;r<t;r++){let i=(e*t+r)*6;c[i+0]=r*h+e,c[i+1]=r*h+e+1,c[i+2]=(r+1)*h+e,c[i+3]=(r+1)*h+e,c[i+4]=r*h+e+1,c[i+5]=(r+1)*h+e+1}return{indices:{size:1,value:c},attributes:{POSITION:{size:3,value:a},NORMAL:{size:3,value:l},TEXCOORD_0:{size:2,value:u}}}}(e);super({...e,id:t,topology:"triangle-list",indices:r,attributes:{...i,...e.attributes}})}};function eV(){let e=1,t=1;return()=>{var r;return t=Math.cos(27.92*(e=Math.sin(17.23*t))),(r=1432.71*Math.abs(e*t))-Math.floor(r)}}var ez=r(80718),ej=r(97175),eW=class{current;next;constructor(e){this.current=e.current,this.next=e.next}destroy(){var e,t;null==(e=this.current)||e.destroy(),null==(t=this.next)||t.destroy()}swap(){let e=this.current;this.current=this.next,this.next=e}},eX=class extends eW{constructor(e,t){var r,i;let n=null==(r=(t={...t}).colorAttachments)?void 0:r.map(t=>"string"!=typeof t?t:e.createTexture({format:t,usage:ej.Texture.SAMPLE|ej.Texture.RENDER|ej.Texture.COPY_SRC|ej.Texture.COPY_DST,width:1,height:1}));super({current:e.createFramebuffer({...t,colorAttachments:n}),next:e.createFramebuffer({...t,colorAttachments:n=null==(i=t.colorAttachments)?void 0:i.map(t=>"string"!=typeof t?t:e.createTexture({format:t,usage:ej.Texture.TEXTURE|ej.Texture.COPY_SRC|ej.Texture.COPY_DST|ej.Texture.RENDER_ATTACHMENT,width:1,height:1}))})})}resize(e){if(e.width===this.current.width&&e.height===this.current.height)return!1;let{current:t,next:r}=this;return this.current=t.clone(e),t.destroy(),this.next=r.clone(e),r.destroy(),!0}},e$=class extends eW{constructor(e,t){super({current:e.createBuffer(t),next:e.createBuffer(t)})}resize(e){if(e.byteLength===this.current.byteLength)return!1;let{current:t,next:r}=this;return this.current=t.clone(e),t.destroy(),this.next=r.clone(e),r.destroy(),!0}},eq=class{device;shaderInputs;passRenderers;swapFramebuffers;clipSpace;textureModel;constructor(e,t){this.device=e,t.shaderPasses.map(e=>(0,ez.initializeShaderModule)(e));let r=t.shaderPasses.reduce((e,t)=>({...e,[t.name]:t}),{});this.shaderInputs=t.shaderInputs||new z(r);let i=e.getCanvasContext().getDrawingBufferSize();this.swapFramebuffers=new eX(e,{colorAttachments:[e.preferredColorFormat],width:i[0],height:i[1]}),this.textureModel=new eg(e,{backgroundTexture:this.swapFramebuffers.current.colorAttachments[0].texture}),this.clipSpace=new ef(e,{source:`  @group(0) @binding(0) var sourceTexture: texture_2d<f32>;
  @group(0) @binding(1) var sourceTextureSampler: sampler;

@fragment
fn fragmentMain(inputs: FragmentInputs) -> @location(0) vec4<f32> {
	let texCoord: vec2<f32> = inputs.coordinate;
	return textureSample(sourceTexture, sourceTextureSampler, texCoord);
}
`,fs:`#version 300 es

uniform sampler2D sourceTexture;
in vec2 uv;
in vec2 coordinate;
out vec4 fragColor;

void main() {
  vec2 texCoord = coordinate;
  fragColor = texture(sourceTexture, coordinate);
}
`}),this.passRenderers=t.shaderPasses.map(t=>new eY(e,t))}destroy(){for(let e of this.passRenderers)e.destroy();this.swapFramebuffers.destroy(),this.clipSpace.destroy()}resize(e,t){this.swapFramebuffers.resize({width:e,height:t})}renderToScreen(e){let t=this.renderToTexture(e);if(!t)return!1;let r=this.device.getDefaultCanvasContext().getCurrentFramebuffer({depthStencilAttachment:!1}),i=this.device.beginRenderPass({id:"shader-pass-renderer-to-screen",framebuffer:r,clearColor:[0,0,0,1],clearDepth:1});return this.clipSpace.setBindings({sourceTexture:t}),this.clipSpace.draw(i),i.end(),!0}renderToTexture(e){let{sourceTexture:t}=e;if(!t.isReady)return null;this.textureModel.destroy(),this.textureModel=new eg(this.device,{backgroundTexture:t});let r=this.device.beginRenderPass({id:"shader-pass-renderer-clear-texture",framebuffer:this.swapFramebuffers.current,clearColor:[0,0,0,1]});this.textureModel.draw(r),r.end();let i=!0;for(let e of this.passRenderers)for(let t of e.subPassRenderers){i||this.swapFramebuffers.swap(),i=!1;let e={sourceTexture:this.swapFramebuffers.current.colorAttachments[0].texture},r=this.device.beginRenderPass({id:"shader-pass-renderer-run-pass",framebuffer:this.swapFramebuffers.next,clearColor:[0,0,0,1],clearDepth:1});t.render({renderPass:r,bindings:e}),r.end()}return this.swapFramebuffers.swap(),this.swapFramebuffers.current.colorAttachments[0].texture}},eY=class{shaderPass;subPassRenderers;constructor(e,t,r={}){this.shaderPass=t;let i=t.passes||[];this.subPassRenderers=i.map(r=>new eZ(e,t,r))}destroy(){for(let e of this.subPassRenderers)e.destroy()}},eZ=class{model;shaderPass;subPass;constructor(e,t,r){this.shaderPass=t,this.subPass=r;let i=function(e){let{shaderPass:t,action:r,shadingLanguage:i}=e;switch(r){case"filter":let n=`${t.name}_filterColor_ext`;return"wgsl"===i?`// Binding 0:1 is reserved for shader passes
// @group(0) @binding(0) var<uniform> brightnessContrast : brightnessContrastUniforms;
@group(0) @binding(1) var texture: texture_2d<f32>;
@group(0) @binding(2) var sampler: sampler;

struct FragmentInputs {
  @location(0) fragUV: vec2f,
  @location(1) fragPosition: vec4f,
  @location(2) fragCoordinate: vec4f
};

@fragment
fn fragmentMain(inputs: FragmentInputs) -> @location(0) vec4f {
  let texSize = textureDimensions(texture, 0);
  var fragColor = textureSample(texture, sampler, fragUV);
  fragColor = ${n}(gl_FragColor, texSize, texCoord);
  return fragColor;
}
`:`#version 300 es

uniform sampler2D sourceTexture;

in vec2 position;
in vec2 coordinate;
in vec2 uv;

out vec4 fragColor;

void main() {
  vec2 texCoord = coordinate;
  ivec2 iTexSize = textureSize(sourceTexture, 0);
  vec2 texSize = vec2(float(iTexSize.x), float(iTexSize.y));

  fragColor = texture(sourceTexture, texCoord);
  fragColor = ${n}(fragColor, texSize, texCoord);
}
`;case"sample":let s=`${t.name}_sampleColor`;return"wgsl"===i?`// Binding 0:1 is reserved for shader passes
@group(0) @binding(0) var<uniform> brightnessContrast : brightnessContrastUniforms;
@group(0) @binding(1) var texture: texture_2d<f32>;
@group(0) @binding(2) var sampler: sampler;

struct FragmentInputs = {
  @location(0) fragUV: vec2f,
  @location(1) fragPosition: vec4f,
  @location(2) fragCoordinate: vec4f
};

@fragment
fn fragmentMain(inputs: FragmentInputs) -> @location(0) vec4f {
  let texSize = textureDimensions(texture, 0);
  var fragColor = textureSample(texture, sampler, fragUV);
  fragColor = ${s}(gl_FragColor, texSize, texCoord);
  return fragColor;
}
`:`#version 300 es

uniform sampler2D sourceTexture;

in vec2 position;
in vec2 coordinate;
in vec2 uv;

out vec4 fragColor;

void main() {
  vec2 texCoord = coordinate;
  ivec2 iTexSize = textureSize(sourceTexture, 0);
  vec2 texSize = vec2(float(iTexSize.x), float(iTexSize.y));

  fragColor = ${s}(sourceTexture, texSize, texCoord);
}
`;default:throw Error(`${t.name} no fragment shader generated for shader pass`)}}({shaderPass:t,action:r.action||r.filter&&"filter"||r.sampler&&"sample"||"filter",shadingLanguage:e.info.shadingLanguage});this.model=new ef(e,{id:`${t.name}-subpass`,source:i,fs:i,modules:[t],parameters:{depthWriteEnabled:!1}})}destroy(){this.model.destroy()}render(e){let{renderPass:t,bindings:r}=e;this.model.shaderInputs.setProps({[this.shaderPass.name]:this.shaderPass.uniforms||{}}),this.model.shaderInputs.setProps({[this.shaderPass.name]:this.subPass.uniforms||{}}),this.model.setBindings(r||{}),this.model.draw(t)}},eK=r(97175),eQ=r(80718),eJ=r(49156),e0=class{device;id;pipelineFactory;shaderFactory;userData={};bindings={};pipeline;source;shader;shaderInputs;_uniformStore;_pipelineNeedsUpdate="newly created";_getModuleUniforms;props;_destroyed=!1;constructor(e,t){var r,i,n;if("webgpu"!==e.type)throw Error("Computation is only supported in WebGPU");this.props={...e0.defaultProps,...t},t=this.props,this.id=t.id||C("model"),this.device=e,Object.assign(this.userData,t.userData);let s=Object.fromEntries((null==(r=this.props.modules)?void 0:r.map(e=>[e.name,e]))||[]);this.shaderInputs=t.shaderInputs||new z(s),this.setShaderInputs(this.shaderInputs),this.props.shaderLayout||=(0,eQ.getShaderLayoutFromWGSL)(this.props.source);let o={type:e.type,shaderLanguage:e.info.shadingLanguage,shaderLanguageVersion:e.info.shadingLanguageVersion,gpu:e.info.gpu,features:e.features},a=((null==(i=this.props.modules)?void 0:i.length)>0?this.props.modules:null==(n=this.shaderInputs)?void 0:n.getModules())||[];this.pipelineFactory=t.pipelineFactory||O.getDefaultPipelineFactory(this.device),this.shaderFactory=t.shaderFactory||F.getDefaultShaderFactory(this.device);let{source:l,getUniforms:u}=this.props.shaderAssembler.assembleWGSLShader({platformInfo:o,...this.props,modules:a});this.source=l,this._getModuleUniforms=u,this.pipeline=this._updatePipeline(),t.bindings&&this.setBindings(t.bindings),Object.seal(this)}destroy(){this._destroyed||(this.pipelineFactory.release(this.pipeline),this.shaderFactory.release(this.shader),this._uniformStore.destroy(),this._destroyed=!0)}predraw(){this.updateShaderInputs()}dispatch(e,t,r,i){try{this._logDrawCallStart(),this.pipeline=this._updatePipeline(),this.pipeline.setBindings(this.bindings),e.setPipeline(this.pipeline),e.setBindings([]),e.dispatch(t,r,i)}finally{this._logDrawCallEnd()}}setVertexCount(e){}setInstanceCount(e){}setShaderInputs(e){for(let t of(this.shaderInputs=e,this._uniformStore=new eK.UniformStore(this.shaderInputs.modules),Object.keys(this.shaderInputs.modules))){let e=this._uniformStore.getManagedUniformBuffer(this.device,t);this.bindings[`${t}Uniforms`]=e}}setShaderModuleProps(e){let t=this._getModuleUniforms(e),r=Object.keys(t).filter(e=>{let r=t[e];return!(0,eJ.isNumericArray)(r)&&"number"!=typeof r&&"boolean"!=typeof r}),i={};for(let e of r)i[e]=t[e],delete t[e]}updateShaderInputs(){this._uniformStore.setUniforms(this.shaderInputs.getUniformValues())}setBindings(e){Object.assign(this.bindings,e)}_setPipelineNeedsUpdate(e){this._pipelineNeedsUpdate=this._pipelineNeedsUpdate||e}_updatePipeline(){if(this._pipelineNeedsUpdate){let e=null;this.pipeline&&(eK.log.log(1,`Model ${this.id}: Recreating pipeline because "${this._pipelineNeedsUpdate}".`)(),e=this.shader),this._pipelineNeedsUpdate=!1,this.shader=this.shaderFactory.createShader({id:`${this.id}-fragment`,stage:"compute",source:this.source,debugShaders:this.props.debugShaders}),this.pipeline=this.pipelineFactory.createComputePipeline({...this.props,shader:this.shader}),e&&this.shaderFactory.release(e)}return this.pipeline}_lastLogTime=0;_logOpen=!1;_logDrawCallStart(){let e=eK.log.level>3?0:1e4;eK.log.level<2||Date.now()-this._lastLogTime<e||(this._lastLogTime=Date.now(),this._logOpen=!0,eK.log.group(2,`>>> DRAWING MODEL ${this.id}`,{collapsed:eK.log.level<=2})())}_logDrawCallEnd(){if(this._logOpen){let e=this.shaderInputs.getDebugTable();eK.log.table(2,e)(),eK.log.groupEnd(2)(),this._logOpen=!1}}_drawCount=0;_getBufferOrConstantValues(e,t){let r=(0,eK.getTypedArrayConstructor)(t);return(e instanceof eK.Buffer?new r(e.debugData):e).toString()}},e1=e0;l(e1,"defaultProps",{...eK.ComputePipeline.defaultProps,id:"unnamed",handle:void 0,userData:{},source:"",modules:[],defines:{},bindings:void 0,shaderInputs:void 0,pipelineFactory:void 0,shaderFactory:void 0,shaderAssembler:eQ.ShaderAssembler.getDefaultShaderAssembler(),debugShaders:void 0});var e2=`precision highp float;
precision highp int;

uniform pickingUniforms {
  int isActive;
  int indexMode;
  int batchIndex;

  int isHighlightActive;
  int highlightedBatchIndex;
  int highlightedObjectIndex;
  vec4 highlightColor;
} picking;
`,e3=`struct pickingUniforms {
  isActive: int32;
  indexMode: int32;
  batchIndex: int32;

  isHighlightActive: int32;
  highlightedBatchIndex: int32;
  highlightedObjectIndex: int32;
  highlightColor: vec4<f32>;
} picking;
`,e4={props:{},uniforms:{},name:"picking",uniformTypes:{isActive:"i32",indexMode:"i32",batchIndex:"i32",isHighlightActive:"i32",highlightedBatchIndex:"i32",highlightedObjectIndex:"i32",highlightColor:"vec4<f32>"},defaultUniforms:{isActive:!1,indexMode:0,batchIndex:0,isHighlightActive:!0,highlightedBatchIndex:-1,highlightedObjectIndex:-1,highlightColor:[0,1,1,1]},getUniforms:function(e={},t){let r={...t};switch(void 0!==e.isActive&&(r.isActive=!!e.isActive),e.indexMode){case"instance":r.indexMode=0;break;case"custom":r.indexMode=1}switch(e.highlightedObjectIndex){case void 0:break;case null:r.isHighlightActive=!1,r.highlightedObjectIndex=-1;break;default:r.isHighlightActive=!0,r.highlightedObjectIndex=e.highlightedObjectIndex}return"number"==typeof e.highlightedBatchIndex&&(r.highlightedBatchIndex=e.highlightedBatchIndex),e.highlightColor&&(r.highlightColor=e.highlightColor),r}},e6=class{device;props;pickInfo={batchIndex:null,objectIndex:null};framebuffer=null;constructor(e,t){this.device=e,this.props={...e6.defaultProps,...t}}destroy(){var e;null==(e=this.framebuffer)||e.destroy()}getFramebuffer(){return this.framebuffer||(this.framebuffer=this.device.createFramebuffer({colorAttachments:["rgba8unorm","rg32sint"],depthStencilAttachment:"depth24plus"})),this.framebuffer}clearPickState(){this.props.shaderInputs.setProps({picking:{highlightedObjectIndex:null}})}beginRenderPass(){var e;let t=this.getFramebuffer();return t.resize(this.device.getDefaultCanvasContext().getDevicePixelSize()),null==(e=this.props.shaderInputs)||e.setProps({picking:{isActive:!0}}),this.device.beginRenderPass({framebuffer:t,clearColors:[new Float32Array([0,0,0,0]),new Int32Array([-1,-1,0,0])],clearDepth:1})}async updatePickInfo(e){var t;let r=this.getFramebuffer(),[i,n]=this.getPickPosition(e),s=this.device.readPixelsToArrayWebGL(r,{sourceX:i,sourceY:n,sourceWidth:1,sourceHeight:1,sourceAttachment:1});if(!s)return null;let o={objectIndex:-1===s[0]?null:s[0],batchIndex:-1===s[1]?null:s[1]};return(o.objectIndex!==this.pickInfo.objectIndex||o.batchIndex!==this.pickInfo.batchIndex)&&(this.pickInfo=o,this.props.onObjectPicked(o)),null==(t=this.props.shaderInputs)||t.setProps({picking:{isActive:!1,highlightedBatchIndex:o.batchIndex,highlightedObjectIndex:o.objectIndex}}),this.pickInfo}getPickPosition(e){let t=this.device.getDefaultCanvasContext().cssToDevicePixels(e);return[t.x+Math.floor(t.width/2),t.y+Math.floor(t.height/2)]}},e5=e6;l(e5,"defaultProps",{shaderInputs:void 0,onObjectPicked:()=>{}});var e8=`${e3}

const INDEX_PICKING_MODE_INSTANCE = 0;
const INDEX_PICKING_MODE_CUSTOM = 1;
const INDEX_PICKING_INVALID_INDEX = -1; // 2^32 - 1

struct indexPickingFragmentInputs = {
  objectIndex: int32;
};

let indexPickingFragmentInputs: indexPickingFragmentInputs;

/**
 * Vertex shaders should call this function to set the object index.
 * If using instance or vertex mode, argument will be ignored, 0 can be supplied.
 */
fn picking_setObjectIndex(objectIndex: int32) {
  switch (picking.indexMode) {
    case INDEX_PICKING_MODE_INSTANCE, default: {
      picking_objectIndex = instance_index;
    };
    case INDEX_PICKING_MODE_CUSTOM: {
      picking_objectIndex = objectIndex;
    };
  }
}

`,e7=`${e2}

const int INDEX_PICKING_MODE_INSTANCE = 0;
const int INDEX_PICKING_MODE_CUSTOM = 1;

const int INDEX_PICKING_INVALID_INDEX = -1; // 2^32 - 1

flat out int picking_objectIndex;

/**
 * Vertex shaders should call this function to set the object index.
 * If using instance or vertex mode, argument will be ignored, 0 can be supplied.
 */
void picking_setObjectIndex(int objectIndex) {
  switch (picking.indexMode) {
    case INDEX_PICKING_MODE_INSTANCE:
      picking_objectIndex = gl_InstanceID;
      break;
    case INDEX_PICKING_MODE_CUSTOM:
      picking_objectIndex = objectIndex;
      break;
  }
}
`,e9=`${e2}

const int INDEX_PICKING_INVALID_INDEX = -1; // 2^32 - 1

flat in int picking_objectIndex;

/**
 * Check if this vertex is highlighted (part of the selected batch and object)
 */ 
bool picking_isFragmentHighlighted() {
  return 
    bool(picking.isHighlightActive) &&
    picking.highlightedBatchIndex == picking.batchIndex &&
    picking.highlightedObjectIndex == picking_objectIndex
    ;
}

/**
 * Returns highlight color if this item is selected.
 */
vec4 picking_filterHighlightColor(vec4 color) {
  // If we are still picking, we don't highlight
  if (bool(picking.isActive)) {
    return color;
  }

  // If we are not highlighted, return color as is
  if (!picking_isFragmentHighlighted()) {
    return color;
  }
   
  // Blend in highlight color based on its alpha value
  float highLightAlpha = picking.highlightColor.a;
  float blendedAlpha = highLightAlpha + color.a * (1.0 - highLightAlpha);
  float highLightRatio = highLightAlpha / blendedAlpha;

  vec3 blendedRGB = mix(color.rgb, picking.highlightColor.rgb, highLightRatio);
  return vec4(blendedRGB, blendedAlpha);
}

/*
 * Returns picking color if picking enabled else unmodified argument.
 */
ivec4 picking_getPickingColor() {
  // Assumes that colorAttachment0 is rg32int
  // TODO? - we could render indices into a second color attachment and not mess with fragColor
  return ivec4(picking_objectIndex, picking.batchIndex, 0u, 0u);  
}

vec4 picking_filterPickingColor(vec4 color) {
  if (bool(picking.isActive)) {
    if (picking_objectIndex == INDEX_PICKING_INVALID_INDEX) {
      discard;
    }
  }
  return color;
}

/*
 * Returns picking color if picking is enabled if not
 * highlight color if this item is selected, otherwise unmodified argument.
 */
vec4 picking_filterColor(vec4 color) {
  vec4 outColor = color;
  outColor = picking_filterHighlightColor(outColor);
  outColor = picking_filterPickingColor(outColor);
  return outColor;
}
`,te={...e4,name:"picking",source:e8,vs:e7,fs:e9},tt=`${e3}
`,tr=`${e2}
out vec4 picking_vRGBcolor_Avalid;

// Normalize unsigned byte color to 0-1 range
vec3 picking_normalizeColor(vec3 color) {
  return picking.useFloatColors > 0.5 ? color : color / 255.0;
}

// Normalize unsigned byte color to 0-1 range
vec4 picking_normalizeColor(vec4 color) {
  return picking.useFloatColors > 0.5 ? color : color / 255.0;
}

bool picking_isColorZero(vec3 color) {
  return dot(color, vec3(1.0)) < 0.00001;
}

bool picking_isColorValid(vec3 color) {
  return dot(color, vec3(1.0)) > 0.00001;
}

// Check if this vertex is highlighted 
bool isVertexHighlighted(vec3 vertexColor) {
  vec3 highlightedObjectColor = picking_normalizeColor(picking.highlightedObjectColor);
  return
    bool(picking.isHighlightActive) && picking_isColorZero(abs(vertexColor - highlightedObjectColor));
}

// Set the current picking color
void picking_setPickingColor(vec3 pickingColor) {
  pickingColor = picking_normalizeColor(pickingColor);

  if (bool(picking.isActive)) {
    // Use alpha as the validity flag. If pickingColor is [0, 0, 0] fragment is non-pickable
    picking_vRGBcolor_Avalid.a = float(picking_isColorValid(pickingColor));

    if (!bool(picking.isAttribute)) {
      // Stores the picking color so that the fragment shader can render it during picking
      picking_vRGBcolor_Avalid.rgb = pickingColor;
    }
  } else {
    // Do the comparison with selected item color in vertex shader as it should mean fewer compares
    picking_vRGBcolor_Avalid.a = float(isVertexHighlighted(pickingColor));
  }
}

void picking_setObjectIndex(uint objectIndex) {
  if (bool(picking.isActive)) {
    uint index = objectIndex;
    if (picking.indexMode == PICKING_INDEX_MODE_INSTANCE) {
      index = uint(gl_InstanceID);
    }
    picking_vRGBcolor_Avalid.r = float(index % 255) / 255.0;
    picking_vRGBcolor_Avalid.g = float((index / 255) % 255) / 255.0;
    picking_vRGBcolor_Avalid.b = float((index / 255 / 255) %255) / 255.0;
  }
}

void picking_setPickingAttribute(float value) {
  if (bool(picking.isAttribute)) {
    picking_vRGBcolor_Avalid.r = value;
  }
}

void picking_setPickingAttribute(vec2 value) {
  if (bool(picking.isAttribute)) {
    picking_vRGBcolor_Avalid.rg = value;
  }
}

void picking_setPickingAttribute(vec3 value) {
  if (bool(picking.isAttribute)) {
    picking_vRGBcolor_Avalid.rgb = value;
  }
}
`,ti=`${e2}

in vec4 picking_vRGBcolor_Avalid;

/*
 * Returns highlight color if this item is selected.
 */
vec4 picking_filterHighlightColor(vec4 color) {
  // If we are still picking, we don't highlight
  if (picking.isActive > 0.5) {
    return color;
  }

  bool selected = bool(picking_vRGBcolor_Avalid.a);

  if (selected) {
    // Blend in highlight color based on its alpha value
    float highLightAlpha = picking.highlightColor.a;
    float blendedAlpha = highLightAlpha + color.a * (1.0 - highLightAlpha);
    float highLightRatio = highLightAlpha / blendedAlpha;

    vec3 blendedRGB = mix(color.rgb, picking.highlightColor.rgb, highLightRatio);
    return vec4(blendedRGB, blendedAlpha);
  } else {
    return color;
  }
}

/*
 * Returns picking color if picking enabled else unmodified argument.
 */
vec4 picking_filterPickingColor(vec4 color) {
  if (bool(picking.isActive)) {
    if (picking_vRGBcolor_Avalid.a == 0.0) {
      discard;
    }
    return picking_vRGBcolor_Avalid;
  }
  return color;
}

/*
 * Returns picking color if picking is enabled if not
 * highlight color if this item is selected, otherwise unmodified argument.
 */
vec4 picking_filterColor(vec4 color) {
  vec4 highlightColor = picking_filterHighlightColor(color);
  return picking_filterPickingColor(highlightColor);
}
`,tn={...e4,name:"picking",source:tt,vs:tr,fs:ti},ts=class{device;framebuffer=null;shaderInputs;constructor(e,t){this.device=e,this.shaderInputs=t}destroy(){var e;null==(e=this.framebuffer)||e.destroy()}getFramebuffer(){return this.framebuffer||(this.framebuffer=this.device.createFramebuffer({colorAttachments:["rgba8unorm"],depthStencilAttachment:"depth24plus"})),this.framebuffer}clearPickState(){this.shaderInputs.setProps({picking:{highlightedObjectColor:null}})}beginRenderPass(){let e=this.getFramebuffer();return e.resize(this.device.getCanvasContext().getDevicePixelSize()),this.shaderInputs.setProps({picking:{isActive:!0}}),this.device.beginRenderPass({framebuffer:e,clearColor:[0,0,0,0],clearDepth:1})}updatePickState(e){let t=this.getFramebuffer(),[r,i]=this.getPickPosition(e),n=[...this.device.readPixelsToArrayWebGL(t,{sourceX:r,sourceY:i,sourceWidth:1,sourceHeight:1})].map(e=>e/255);n[0]+n[1]+n[2]>0||(n=null),this.shaderInputs.setProps({picking:{isActive:!1,highlightedObjectColor:n}})}getPickPosition(e){let t=this.device.getCanvasContext().cssToDevicePixels(e);return[t.x+Math.floor(t.width/2),t.y+Math.floor(t.height/2)]}}},80718:function(e,t,r){"use strict";let i;var n,s,o,a,l=Object.defineProperty,u=Object.getOwnPropertyDescriptor,c=Object.getOwnPropertyNames,h=Object.prototype.hasOwnProperty,f={};function d(e,t){if(!e)throw Error(t||"shadertools: assertion failed.")}((e,t)=>{for(var r in t)l(e,r,{get:t[r],enumerable:!0})})(f,{ShaderAssembler:()=>q,_getDependencyGraph:()=>C,_resolveModules:()=>x,assembleGLSLShaderPair:()=>G,capitalize:()=>er,checkShaderModuleDeprecations:()=>M,combineInjects:()=>y,convertToVec4:()=>et,dirlight:()=>ex,fp32:()=>eb,fp64:()=>ey,fp64LowPart:()=>em,fp64arithmetic:()=>eA,fp64ify:()=>e_,fp64ifyMatrix4:()=>eE,fromHalfFloat:()=>ep,generateShaderForModule:()=>ei,getPassthroughFS:()=>Q,getQualifierDetails:()=>K,getShaderInfo:()=>D,getShaderLayoutFromWGSL:()=>eo,getShaderModuleDependencies:()=>I,getShaderModuleSource:()=>z,getShaderModuleUniforms:()=>S,gouraudMaterial:()=>eP,initializeShaderModule:()=>R,initializeShaderModules:()=>T,lighting:()=>eI,pbrMaterial:()=>eB,phongMaterial:()=>eL,picking:()=>eT,preprocess:()=>X,random:()=>ev,toHalfFloat:()=>ed,typeToChannelCount:()=>ee,typeToChannelSuffix:()=>J}),e.exports=((e,t,r,i)=>{if(t&&"object"==typeof t||"function"==typeof t)for(let n of c(t))h.call(e,n)||n===r||l(e,n,{get:()=>t[n],enumerable:!(i=u(t,n))||i.enumerable});return e})(l({},"__esModule",{value:!0}),f);var p={number:{type:"number",validate:(e,t)=>Number.isFinite(e)&&"object"==typeof t&&(void 0===t.max||e<=t.max)&&(void 0===t.min||e>=t.min)},array:{type:"array",validate:(e,t)=>Array.isArray(e)||ArrayBuffer.isView(e)}};function g(e){return Array.isArray(e)||ArrayBuffer.isView(e)?"array":typeof e}var _={vertex:`#ifdef MODULE_LOGDEPTH
  logdepth_adjustPosition(gl_Position);
#endif
`,fragment:`#ifdef MODULE_MATERIAL
  fragColor = material_filterColor(fragColor);
#endif

#ifdef MODULE_LIGHTING
  fragColor = lighting_filterColor(fragColor);
#endif

#ifdef MODULE_FOG
  fragColor = fog_filterColor(fragColor);
#endif

#ifdef MODULE_PICKING
  fragColor = picking_filterHighlightColor(fragColor);
  fragColor = picking_filterPickingColor(fragColor);
#endif

#ifdef MODULE_LOGDEPTH
  logdepth_setFragDepth();
#endif
`},m=/void\s+main\s*\([^)]*\)\s*\{\n?/,E=/}\n?[^{}]*$/,v=[],b="__LUMA_INJECT_DECLARATIONS__";function A(e,t,r,i=!1){let n="vertex"===t;for(let t in r){let i=r[t];i.sort((e,t)=>e.order-t.order),v.length=i.length;for(let e=0,t=i.length;e<t;++e)v[e]=i[e].injection;let s=`${v.join("\n")}
`;switch(t){case"vs:#decl":n&&(e=e.replace(b,s));break;case"vs:#main-start":n&&(e=e.replace(m,e=>e+s));break;case"vs:#main-end":n&&(e=e.replace(E,e=>s+e));break;case"fs:#decl":n||(e=e.replace(b,s));break;case"fs:#main-start":n||(e=e.replace(m,e=>e+s));break;case"fs:#main-end":n||(e=e.replace(E,e=>s+e));break;default:e=e.replace(t,e=>e+s)}}return e=e.replace(b,""),i&&(e=e.replace(/\}\s*$/,e=>e+_[t])),e}function y(e){let t={};return d(Array.isArray(e)&&e.length>1),e.forEach(e=>{for(let r in e)t[r]=t[r]?`${t[r]}
${e[r]}`:e[r]}),t}function T(e){e.map(e=>R(e))}function R(e){if(e.instance)return;T(e.dependencies||[]);let{propTypes:t={},deprecations:r=[],inject:i={}}=e,n={normalizedInjections:function(e){let t={vertex:{},fragment:{}};for(let r in e){let i=e[r];"string"==typeof i&&(i={order:0,injection:i}),t[function(e){let t=e.slice(0,2);switch(t){case"vs":return"vertex";case"fs":return"fragment";default:throw Error(t)}}(r)][r]=i}return t}(i),parsedDeprecations:(r.forEach(e=>{"function"===e.type?e.regex=RegExp(`\\b${e.old}\\(`):e.regex=RegExp(`${e.type} ${e.old};`)}),r)};t&&(n.propValidators=function(e){let t={};for(let[r,i]of Object.entries(e))t[r]=function(e){let t=g(e);if("object"!==t)return{value:e,...p[t],type:t};if("object"==typeof e)return e?void 0!==e.type?{...e,...p[e.type],type:e.type}:void 0===e.value?{type:"object",value:e}:(t=g(e.value),{...e,...p[t],type:t}):{type:"object",value:null};throw Error("props")}(i);return t}(t)),e.instance=n;let s={};t&&(s=Object.entries(t).reduce((e,[t,r])=>{let i=null==r?void 0:r.value;return i&&(e[t]=i),e},{})),e.defaultUniforms={...e.defaultUniforms,...s}}function S(e,t,r){var i;R(e);let n=r||{...e.defaultUniforms};return t&&e.getUniforms?e.getUniforms(t,n):function(e,t,r){let i={};for(let[n,s]of Object.entries(t))e&&n in e&&!s.private?(s.validate&&d(s.validate(e[n],s),`${r}: invalid ${n}`),i[n]=e[n]):i[n]=s.value;return i}(t,null==(i=e.instance)?void 0:i.propValidators,e.name)}function M(e,t,r){var i;null==(i=e.deprecations)||i.forEach(e=>{var i;(null==(i=e.regex)?void 0:i.test(t))&&(e.deprecated?r.deprecated(e.old,e.new)():r.removed(e.old,e.new)())})}function I(e){T(e);let t={},r={};C({modules:e,level:0,moduleMap:t,moduleDepth:r});let i=Object.keys(r).sort((e,t)=>r[t]-r[e]).map(e=>t[e]);return T(i),i}function C(e){let{modules:t,level:r,moduleMap:i,moduleDepth:n}=e;if(r>=5)throw Error("Possible loop in shader dependency graph");for(let e of t)i[e.name]=e,(void 0===n[e.name]||n[e.name]<r)&&(n[e.name]=r);for(let e of t)e.dependencies&&C({modules:e.dependencies,level:r+1,moduleMap:i,moduleDepth:n})}function x(e){return function(e){T(e);let t={},r={};return C({modules:e,level:0,moduleMap:t,moduleDepth:r}),T(e=Object.keys(r).sort((e,t)=>r[t]-r[e]).map(e=>t[e])),e}(e)}var w=[[/^(#version[ \t]+(100|300[ \t]+es))?[ \t]*\n/,"#version 300 es\n"],[/\btexture(2D|2DProj|Cube)Lod(EXT)?\(/g,"textureLod("],[/\btexture(2D|2DProj|Cube)(EXT)?\(/g,"texture("]],N=[...w,[L("attribute"),"in $1"],[L("varying"),"out $1"]],O=[...w,[L("varying"),"in $1"]];function P(e,t){for(let[r,i]of t)e=e.replace(r,i);return e}function L(e){return RegExp(`\\b${e}[ \\t]+(\\w+[ \\t]+\\w+(\\[\\w+\\])?;)`,"g")}function F(e,t){let r="";for(let i in e){let n=e[i];if(r+=`void ${n.signature} {
`,n.header&&(r+=`  ${n.header}`),t[i]){let e=t[i];for(let t of(e.sort((e,t)=>e.order-t.order),e))r+=`  ${t.injection}
`}n.footer&&(r+=`  ${n.footer}`),r+="}\n"}return r}function B(e){let t={vertex:{},fragment:{}};for(let r of e){let e,i;"string"!=typeof r?i=(e=r).hook:(e={},i=r);let[n,s]=(i=i.trim()).split(":"),o=i.replace(/\(.+/,""),a=Object.assign(e,{signature:s});switch(n){case"vs":t.vertex[o]=a;break;case"fs":t.fragment[o]=a;break;default:throw Error(n)}}return t}function D(e,t){return{name:function(e,t="unnamed"){let r=/#define[^\S\r\n]*SHADER_NAME[^\S\r\n]*([A-Za-z0-9_-]+)\s*/.exec(e);return r?r[1]:t}(e,t),language:"glsl",version:function(e){let t=100,r=e.match(/[^\s]+/g);if(r&&r.length>=2&&"#version"===r[0]){let e=parseInt(r[1],10);Number.isFinite(e)&&(t=e)}if(100!==t&&300!==t)throw Error(`Invalid GLSL version ${t}`);return t}(e)}}var U=`

${b}
`,k=`precision highp float;
`;function G(e){let{vs:t,fs:r}=e,i=I(e.modules||[]);return{vs:H(e.platformInfo,{...e,source:t,stage:"vertex",modules:i}),fs:H(e.platformInfo,{...e,source:r,stage:"fragment",modules:i}),getUniforms:V(i)}}function H(e,t){var r;let{source:i,stage:n,language:s="glsl",modules:o,defines:a={},hookFunctions:l=[],inject:u={},prologue:c=!0,log:h}=t;d("string"==typeof i,"shader source must be a string");let f="glsl"===s?D(i).version:-1,p=e.shaderLanguageVersion,g=100===f?"#version 100":"#version 300 es",_=i.split("\n").slice(1).join("\n"),m={};o.forEach(e=>{Object.assign(m,e.defines)}),Object.assign(m,a);let E="";switch(s){case"wgsl":break;case"glsl":E=c?`${g}

// ----- PROLOGUE -------------------------
#define SHADER_TYPE_${n.toUpperCase()}

${function(e){switch(null==e?void 0:e.gpu.toLowerCase()){case"apple":return`#define APPLE_GPU
// Apple optimizes away the calculation necessary for emulated fp64
#define LUMA_FP64_CODE_ELIMINATION_WORKAROUND 1
#define LUMA_FP32_TAN_PRECISION_WORKAROUND 1
// Intel GPU doesn't have full 32 bits precision in same cases, causes overflow
#define LUMA_FP64_HIGH_BITS_OVERFLOW_WORKAROUND 1
`;case"nvidia":return`#define NVIDIA_GPU
// Nvidia optimizes away the calculation necessary for emulated fp64
#define LUMA_FP64_CODE_ELIMINATION_WORKAROUND 1
`;case"intel":return`#define INTEL_GPU
// Intel optimizes away the calculation necessary for emulated fp64
#define LUMA_FP64_CODE_ELIMINATION_WORKAROUND 1
// Intel's built-in 'tan' function doesn't have acceptable precision
#define LUMA_FP32_TAN_PRECISION_WORKAROUND 1
// Intel GPU doesn't have full 32 bits precision in same cases, causes overflow
#define LUMA_FP64_HIGH_BITS_OVERFLOW_WORKAROUND 1
`;case"amd":return`#define AMD_GPU
`;default:return`#define DEFAULT_GPU
// Prevent driver from optimizing away the calculation necessary for emulated fp64
#define LUMA_FP64_CODE_ELIMINATION_WORKAROUND 1
// Headless Chrome's software shader 'tan' function doesn't have acceptable precision
#define LUMA_FP32_TAN_PRECISION_WORKAROUND 1
// If the GPU doesn't have full 32 bits precision, will causes overflow
#define LUMA_FP64_HIGH_BITS_OVERFLOW_WORKAROUND 1
`}}(e)}
${"fragment"===n?k:""}

// ----- APPLICATION DEFINES -------------------------

${function(e={}){let t="";for(let r in e){let i=e[r];(i||Number.isFinite(i))&&(t+=`#define ${r.toUpperCase()} ${e[r]}
`)}return t}(m)}

`:`${g}
`}let v=B(l),b={},y={},T={};for(let e in u){let t="string"==typeof u[e]?{injection:u[e],order:0}:u[e],r=/^(v|f)s:(#)?([\w-]+)$/.exec(e);if(r){let i=r[2],n=r[3];i?"decl"===n?y[e]=[t]:T[e]=[t]:b[e]=[t]}else T[e]=[t]}for(let e of o){h&&M(e,_,h),E+=z(e,n);let t=(null==(r=e.instance)?void 0:r.normalizedInjections[n])||{};for(let e in t){let r=/^(v|f)s:#([\w-]+)$/.exec(e);if(r){let i="decl"===r[2]?y:T;i[e]=i[e]||[],i[e].push(t[e])}else b[e]=b[e]||[],b[e].push(t[e])}}return E+="// ----- MAIN SHADER SOURCE -------------------------"+U,E=A(E,n,y)+F(v[n],b)+_,E=A(E,n,T),"glsl"===s&&f!==p&&(E=function(e,t){var r;if(300!==Number((null==(r=e.match(/^#version[ \t]+(\d+)/m))?void 0:r[1])||100))throw Error("luma.gl v9 only supports GLSL 3.00 shader sources");switch(t){case"vertex":return e=P(e,N);case"fragment":return e=P(e,O);default:throw Error(t)}}(E,n)),E.trim()}function V(e){return function(t){var r;let i={};for(let n of e){let e=null==(r=n.getUniforms)?void 0:r.call(n,t,i);Object.assign(i,e)}return i}}function z(e,t){let r;switch(t){case"vertex":r=e.vs||"";break;case"fragment":r=e.fs||"";break;case"wgsl":r=e.source||"";break;default:d(!1)}if(!e.name)throw Error("Shader module must have a name");let i=e.name.toUpperCase().replace(/[^0-9a-z]/gi,"_"),n=`// ----- MODULE ${e.name} ---------------

`;return"wgsl"!==t&&(n+=`#define MODULE_${i}
`),n+=`${r}
`}var j=/^\s*\#\s*ifdef\s*([a-zA-Z_]+)\s*$/,W=/^\s*\#\s*endif\s*$/;function X(e,t){var r;let i=e.split("\n"),n=[],s=!0,o=null;for(let e of i){let i=e.match(j),a=e.match(W);i?(o=i[1],s=!!(null==(r=null==t?void 0:t.defines)?void 0:r[o])):a?s=!0:s&&n.push(e)}return n.join("\n")}var $=class{_hookFunctions=[];_defaultModules=[];static getDefaultShaderAssembler(){return $.defaultShaderAssembler=$.defaultShaderAssembler||new $,$.defaultShaderAssembler}addDefaultModule(e){this._defaultModules.find(t=>t.name===("string"==typeof e?e:e.name))||this._defaultModules.push(e)}removeDefaultModule(e){let t="string"==typeof e?e:e.name;this._defaultModules=this._defaultModules.filter(e=>e.name!==t)}addShaderHook(e,t){t&&(e=Object.assign(t,{hook:e})),this._hookFunctions.push(e)}assembleWGSLShader(e){let t=this._getModuleList(e.modules),r=this._hookFunctions,{source:i,getUniforms:n}=function(e){let t=I(e.modules||[]);return{source:function(e,t){var r;let{source:i,stage:n,modules:s,hookFunctions:o=[],inject:a={},log:l}=t;d("string"==typeof i,"shader source must be a string");let u="",c=B(o),h={},f={},p={};for(let e in a){let t="string"==typeof a[e]?{injection:a[e],order:0}:a[e],r=/^(v|f)s:(#)?([\w-]+)$/.exec(e);if(r){let i=r[2],n=r[3];i?"decl"===n?f[e]=[t]:p[e]=[t]:h[e]=[t]}else p[e]=[t]}for(let e of s){l&&M(e,i,l),u+=z(e,"wgsl");let t=(null==(r=e.injections)?void 0:r[n])||{};for(let e in t){let r=/^(v|f)s:#([\w-]+)$/.exec(e);if(r){let i="decl"===r[2]?f:p;i[e]=i[e]||[],i[e].push(t[e])}else h[e]=h[e]||[],h[e].push(t[e])}}return u+=U,u=A(u,n,f)+F(c[n],h)+i,u=A(u,n,p)}(e.platformInfo,{...e,source:e.source,stage:"vertex",modules:t}),getUniforms:V(t)}}({...e,source:e.source,modules:t,hookFunctions:r});return{source:"wgsl"===e.platformInfo.shaderLanguage?X(i):i,getUniforms:n,modules:t}}assembleGLSLShaderPair(e){let t=this._getModuleList(e.modules),r=this._hookFunctions;return{...G({...e,vs:e.vs,fs:e.fs,modules:t,hookFunctions:r}),modules:t}}_getModuleList(e=[]){let t=Array(this._defaultModules.length+e.length),r={},i=0;for(let e=0,n=this._defaultModules.length;e<n;++e){let n=this._defaultModules[e],s=n.name;t[i++]=n,r[s]=!0}for(let n=0,s=e.length;n<s;++n){let s=e[n],o=s.name;r[o]||(t[i++]=s,r[o]=!0)}return t.length=i,T(t),t}},q=$;(i="symbol"!=typeof(n="defaultShaderAssembler")?n+"":n)in q?l(q,i,{enumerable:!0,configurable:!0,writable:!0,value:s}):q[i]=s;var Y=`out vec4 transform_output;
void main() {
  transform_output = vec4(0);
}`,Z=`#version 300 es
${Y}`;function K(e,t){t=Array.isArray(t)?t:[t];let[r,i,n]=e.replace(/^\s+/,"").split(/\s+/);return t.includes(r)&&i&&n?{qualifier:r,type:i,name:n.split(";")[0]}:null}function Q(e){let{input:t,inputChannels:r,output:i}=e||{};if(!t)return Z;if(!r)throw Error("inputChannels");let n=function(e){switch(e){case 1:return"float";case 2:return"vec2";case 3:return"vec3";case 4:return"vec4";default:throw Error(`invalid channels: ${e}`)}}(r),s=et(t,r);return`#version 300 es
in ${n} ${t};
out vec4 ${i};
void main() {
  ${i} = ${s};
}`}function J(e){switch(e){case"float":return"x";case"vec2":return"xy";case"vec3":return"xyz";case"vec4":return"xyzw";default:throw Error(e)}}function ee(e){switch(e){case"float":return 1;case"vec2":return 2;case"vec3":return 3;case"vec4":return 4;default:throw Error(e)}}function et(e,t){switch(t){case 1:return`vec4(${e}, 0.0, 0.0, 1.0)`;case 2:return`vec4(${e}, 0.0, 1.0)`;case 3:return`vec4(${e}, 1.0)`;case 4:return e;default:throw Error(`invalid channels: ${t}`)}}function er(e){return"string"==typeof e?e.charAt(0).toUpperCase()+e.slice(1):e}function ei(e,t){switch(t.shaderLanguage){case"glsl":return function(e,t){let r=[];switch(t.uniforms){case"scoped-interface-blocks":case"unscoped-interface-blocks":r.push(`uniform ${er(e.name)} {`)}for(let[i,n]of Object.entries(e.uniformTypes||{})){let s={f32:"float",i32:"int",u32:"uint","vec2<f32>":"vec2","vec3<f32>":"vec3","vec4<f32>":"vec4","vec2<i32>":"ivec2","vec3<i32>":"ivec3","vec4<i32>":"ivec4","vec2<u32>":"uvec2","vec3<u32>":"uvec3","vec4<u32>":"uvec4","mat2x2<f32>":"mat2","mat2x3<f32>":"mat2x3","mat2x4<f32>":"mat2x4","mat3x2<f32>":"mat3x2","mat3x3<f32>":"mat3","mat3x4<f32>":"mat3x4","mat4x2<f32>":"mat4x2","mat4x3<f32>":"mat4x3","mat4x4<f32>":"mat4"}[n];switch(t.uniforms){case"scoped-interface-blocks":r.push(`  ${s} ${i};`);break;case"unscoped-interface-blocks":r.push(`  ${s} ${e.name}_${i};`);break;case"uniforms":r.push(`uniform ${s} ${e.name}_${i};`)}}switch(t.uniforms){case"scoped-interface-blocks":r.push(`} ${e.name};`);break;case"unscoped-interface-blocks":r.push("};")}return r.push(""),r.join("\n")}(e,t);case"wgsl":return function(e,t){let r=[];for(let[t,i]of(r.push(`struct ${er(e.name)} {`),Object.entries((null==e?void 0:e.uniformTypes)||{})))r.push(`  ${t} : ${i};`);return r.push("};"),r.push(`var<uniform> ${e.name} : ${er(e.name)};`),r.join("\n")}(e,0)}}var en=r(97175),es=r(92667);function eo(e){var t;let r;let i={attributes:[],bindings:[]};try{r=function(e){try{return new es.WgslReflect(e)}catch(t){if(t instanceof Error)throw t;let e="WGSL parse error";throw"object"==typeof t&&(null==t?void 0:t.message)&&(e+=`: ${t.message} `),"object"==typeof t&&(null==t?void 0:t.token)&&(e+=t.token.line||""),Error(e,{cause:t})}}(e)}catch(e){return en.log.error(e.message)(),i}for(let e of r.uniforms){let r=[];for(let i of(null==(t=e.type)?void 0:t.members)||[])r.push({name:i.name,type:ea(i.type)});i.bindings.push({type:"uniform",name:e.name,group:e.group,location:e.binding,members:r})}for(let e of r.textures)i.bindings.push({type:"texture",name:e.name,group:e.group,location:e.binding});for(let e of r.samplers)i.bindings.push({type:"sampler",name:e.name,group:e.group,location:e.binding});let n=r.entry.vertex[0],s=(null==n?void 0:n.inputs.length)||0;for(let e=0;e<s;e++){let t=n.inputs[e];if("location"===t.locationType){let e=ea(t.type);i.attributes.push({name:t.name,location:Number(t.location),type:e})}}return i}function ea(e){return(null==e?void 0:e.format)?`${e.name}<${e.format.name}>`:e.name}var el=r(6049),eu=null,ec=new ArrayBuffer(4),eh=new Float32Array(ec),ef=new Uint32Array(ec);function ed(e){eu||=eg(),e=(0,el.clamp)(e,-65504,65504),eh[0]=e;let t=ef[0],r=t>>23&511;return eu.baseTable[r]+((8388607&t)>>eu.shiftTable[r])}function ep(e){eu||=eg();let t=e>>10;return ef[0]=eu.mantissaTable[eu.offsetTable[t]+(1023&e)]+eu.exponentTable[t],eh[0]}function eg(){let e=new Uint32Array(512),t=new Uint32Array(512);for(let r=0;r<256;++r){let i=r-127;i<-27?(e[r]=0,e[256|r]=32768,t[r]=24,t[256|r]=24):i<-14?(e[r]=1024>>-i-14,e[256|r]=1024>>-i-14|32768,t[r]=-i-1,t[256|r]=-i-1):i<=15?(e[r]=i+15<<10,e[256|r]=i+15<<10|32768,t[r]=13,t[256|r]=13):i<128?(e[r]=31744,e[256|r]=64512,t[r]=24,t[256|r]=24):(e[r]=31744,e[256|r]=64512,t[r]=13,t[256|r]=13)}let r=new Uint32Array(2048),i=new Uint32Array(64),n=new Uint32Array(64);for(let e=1;e<1024;++e){let t=e<<13,i=0;for(;(8388608&t)==0;)t<<=1,i-=8388608;t&=-8388609,i+=947912704,r[e]=t|i}for(let e=1024;e<2048;++e)r[e]=939524096+(e-1024<<13);for(let e=1;e<31;++e)i[e]=e<<23;i[31]=1199570944,i[32]=2147483648;for(let e=33;e<63;++e)i[e]=2147483648+(e-32<<23);i[63]=3347054592;for(let e=1;e<64;++e)32!==e&&(n[e]=1024);return{baseTable:e,shiftTable:t,mantissaTable:r,exponentTable:i,offsetTable:n}}function e_(e,t=[],r=0){let i=Math.fround(e),n=e-i;return t[r]=i,t[r+1]=n,t}function em(e){return e-Math.fround(e)}function eE(e){let t=new Float32Array(32);for(let r=0;r<4;++r)for(let i=0;i<4;++i){let n=4*r+i;e_(e[4*i+r],t,2*n)}return t}var ev={name:"random",source:`fn random(scale: vec3f, seed: float) -> f32 {
  /* use the fragment position for a different seed per-pixel */
  return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
}
`,fs:`float random(vec3 scale, float seed) {
  /* use the fragment position for a different seed per-pixel */
  return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
}
`},eb={name:"fp32",vs:`#ifdef LUMA_FP32_TAN_PRECISION_WORKAROUND

// All these functions are for substituting tan() function from Intel GPU only
const float TWO_PI = 6.2831854820251465;
const float PI_2 = 1.5707963705062866;
const float PI_16 = 0.1963495463132858;

const float SIN_TABLE_0 = 0.19509032368659973;
const float SIN_TABLE_1 = 0.3826834261417389;
const float SIN_TABLE_2 = 0.5555702447891235;
const float SIN_TABLE_3 = 0.7071067690849304;

const float COS_TABLE_0 = 0.9807852506637573;
const float COS_TABLE_1 = 0.9238795042037964;
const float COS_TABLE_2 = 0.8314695954322815;
const float COS_TABLE_3 = 0.7071067690849304;

const float INVERSE_FACTORIAL_3 = 1.666666716337204e-01; // 1/3!
const float INVERSE_FACTORIAL_5 = 8.333333767950535e-03; // 1/5!
const float INVERSE_FACTORIAL_7 = 1.9841270113829523e-04; // 1/7!
const float INVERSE_FACTORIAL_9 = 2.75573188446287533e-06; // 1/9!

float sin_taylor_fp32(float a) {
  float r, s, t, x;

  if (a == 0.0) {
    return 0.0;
  }

  x = -a * a;
  s = a;
  r = a;

  r = r * x;
  t = r * INVERSE_FACTORIAL_3;
  s = s + t;

  r = r * x;
  t = r * INVERSE_FACTORIAL_5;
  s = s + t;

  r = r * x;
  t = r * INVERSE_FACTORIAL_7;
  s = s + t;

  r = r * x;
  t = r * INVERSE_FACTORIAL_9;
  s = s + t;

  return s;
}

void sincos_taylor_fp32(float a, out float sin_t, out float cos_t) {
  if (a == 0.0) {
    sin_t = 0.0;
    cos_t = 1.0;
  }
  sin_t = sin_taylor_fp32(a);
  cos_t = sqrt(1.0 - sin_t * sin_t);
}

float tan_taylor_fp32(float a) {
    float sin_a;
    float cos_a;

    if (a == 0.0) {
        return 0.0;
    }

    // 2pi range reduction
    float z = floor(a / TWO_PI);
    float r = a - TWO_PI * z;

    float t;
    float q = floor(r / PI_2 + 0.5);
    int j = int(q);

    if (j < -2 || j > 2) {
        return 1.0 / 0.0;
    }

    t = r - PI_2 * q;

    q = floor(t / PI_16 + 0.5);
    int k = int(q);
    int abs_k = int(abs(float(k)));

    if (abs_k > 4) {
        return 1.0 / 0.0;
    } else {
        t = t - PI_16 * q;
    }

    float u = 0.0;
    float v = 0.0;

    float sin_t, cos_t;
    float s, c;
    sincos_taylor_fp32(t, sin_t, cos_t);

    if (k == 0) {
        s = sin_t;
        c = cos_t;
    } else {
        if (abs(float(abs_k) - 1.0) < 0.5) {
            u = COS_TABLE_0;
            v = SIN_TABLE_0;
        } else if (abs(float(abs_k) - 2.0) < 0.5) {
            u = COS_TABLE_1;
            v = SIN_TABLE_1;
        } else if (abs(float(abs_k) - 3.0) < 0.5) {
            u = COS_TABLE_2;
            v = SIN_TABLE_2;
        } else if (abs(float(abs_k) - 4.0) < 0.5) {
            u = COS_TABLE_3;
            v = SIN_TABLE_3;
        }
        if (k > 0) {
            s = u * sin_t + v * cos_t;
            c = u * cos_t - v * sin_t;
        } else {
            s = u * sin_t - v * cos_t;
            c = u * cos_t + v * sin_t;
        }
    }

    if (j == 0) {
        sin_a = s;
        cos_a = c;
    } else if (j == 1) {
        sin_a = c;
        cos_a = -s;
    } else if (j == -1) {
        sin_a = -c;
        cos_a = s;
    } else {
        sin_a = -s;
        cos_a = -c;
    }
    return sin_a / cos_a;
}
#endif

float tan_fp32(float a) {
#ifdef LUMA_FP32_TAN_PRECISION_WORKAROUND
  return tan_taylor_fp32(a);
#else
  return tan(a);
#endif
}
`},eA={name:"fp64arithmetic",vs:`
uniform fp64arithmeticUniforms {
  uniform float ONE;
} fp64;

/*
About LUMA_FP64_CODE_ELIMINATION_WORKAROUND

The purpose of this workaround is to prevent shader compilers from
optimizing away necessary arithmetic operations by swapping their sequences
or transform the equation to some 'equivalent' form.

The method is to multiply an artifical variable, ONE, which will be known to
the compiler to be 1 only at runtime. The whole expression is then represented
as a polynomial with respective to ONE. In the coefficients of all terms, only one a
and one b should appear

err = (a + b) * ONE^6 - a * ONE^5 - (a + b) * ONE^4 + a * ONE^3 - b - (a + b) * ONE^2 + a * ONE
*/

// Divide float number to high and low floats to extend fraction bits
vec2 split(float a) {
  const float SPLIT = 4097.0;
  float t = a * SPLIT;
#if defined(LUMA_FP64_CODE_ELIMINATION_WORKAROUND)
  float a_hi = t * fp64.ONE - (t - a);
  float a_lo = a * fp64.ONE - a_hi;
#else
  float a_hi = t - (t - a);
  float a_lo = a - a_hi;
#endif
  return vec2(a_hi, a_lo);
}

// Divide float number again when high float uses too many fraction bits
vec2 split2(vec2 a) {
  vec2 b = split(a.x);
  b.y += a.y;
  return b;
}

// Special sum operation when a > b
vec2 quickTwoSum(float a, float b) {
#if defined(LUMA_FP64_CODE_ELIMINATION_WORKAROUND)
  float sum = (a + b) * fp64.ONE;
  float err = b - (sum - a) * fp64.ONE;
#else
  float sum = a + b;
  float err = b - (sum - a);
#endif
  return vec2(sum, err);
}

// General sum operation
vec2 twoSum(float a, float b) {
  float s = (a + b);
#if defined(LUMA_FP64_CODE_ELIMINATION_WORKAROUND)
  float v = (s * fp64.ONE - a) * fp64.ONE;
  float err = (a - (s - v) * fp64.ONE) * fp64.ONE * fp64.ONE * fp64.ONE + (b - v);
#else
  float v = s - a;
  float err = (a - (s - v)) + (b - v);
#endif
  return vec2(s, err);
}

vec2 twoSub(float a, float b) {
  float s = (a - b);
#if defined(LUMA_FP64_CODE_ELIMINATION_WORKAROUND)
  float v = (s * fp64.ONE - a) * fp64.ONE;
  float err = (a - (s - v) * fp64.ONE) * fp64.ONE * fp64.ONE * fp64.ONE - (b + v);
#else
  float v = s - a;
  float err = (a - (s - v)) - (b + v);
#endif
  return vec2(s, err);
}

vec2 twoSqr(float a) {
  float prod = a * a;
  vec2 a_fp64 = split(a);
#if defined(LUMA_FP64_CODE_ELIMINATION_WORKAROUND)
  float err = ((a_fp64.x * a_fp64.x - prod) * fp64.ONE + 2.0 * a_fp64.x *
    a_fp64.y * fp64.ONE * fp64.ONE) + a_fp64.y * a_fp64.y * fp64.ONE * fp64.ONE * fp64.ONE;
#else
  float err = ((a_fp64.x * a_fp64.x - prod) + 2.0 * a_fp64.x * a_fp64.y) + a_fp64.y * a_fp64.y;
#endif
  return vec2(prod, err);
}

vec2 twoProd(float a, float b) {
  float prod = a * b;
  vec2 a_fp64 = split(a);
  vec2 b_fp64 = split(b);
  float err = ((a_fp64.x * b_fp64.x - prod) + a_fp64.x * b_fp64.y +
    a_fp64.y * b_fp64.x) + a_fp64.y * b_fp64.y;
  return vec2(prod, err);
}

vec2 sum_fp64(vec2 a, vec2 b) {
  vec2 s, t;
  s = twoSum(a.x, b.x);
  t = twoSum(a.y, b.y);
  s.y += t.x;
  s = quickTwoSum(s.x, s.y);
  s.y += t.y;
  s = quickTwoSum(s.x, s.y);
  return s;
}

vec2 sub_fp64(vec2 a, vec2 b) {
  vec2 s, t;
  s = twoSub(a.x, b.x);
  t = twoSub(a.y, b.y);
  s.y += t.x;
  s = quickTwoSum(s.x, s.y);
  s.y += t.y;
  s = quickTwoSum(s.x, s.y);
  return s;
}

vec2 mul_fp64(vec2 a, vec2 b) {
  vec2 prod = twoProd(a.x, b.x);
  // y component is for the error
  prod.y += a.x * b.y;
#if defined(LUMA_FP64_HIGH_BITS_OVERFLOW_WORKAROUND)
  prod = split2(prod);
#endif
  prod = quickTwoSum(prod.x, prod.y);
  prod.y += a.y * b.x;
#if defined(LUMA_FP64_HIGH_BITS_OVERFLOW_WORKAROUND)
  prod = split2(prod);
#endif
  prod = quickTwoSum(prod.x, prod.y);
  return prod;
}

vec2 div_fp64(vec2 a, vec2 b) {
  float xn = 1.0 / b.x;
#if defined(LUMA_FP64_HIGH_BITS_OVERFLOW_WORKAROUND)
  vec2 yn = mul_fp64(a, vec2(xn, 0));
#else
  vec2 yn = a * xn;
#endif
  float diff = (sub_fp64(a, mul_fp64(b, yn))).x;
  vec2 prod = twoProd(xn, diff);
  return sum_fp64(yn, prod);
}

vec2 sqrt_fp64(vec2 a) {
  if (a.x == 0.0 && a.y == 0.0) return vec2(0.0, 0.0);
  if (a.x < 0.0) return vec2(0.0 / 0.0, 0.0 / 0.0);

  float x = 1.0 / sqrt(a.x);
  float yn = a.x * x;
#if defined(LUMA_FP64_CODE_ELIMINATION_WORKAROUND)
  vec2 yn_sqr = twoSqr(yn) * fp64.ONE;
#else
  vec2 yn_sqr = twoSqr(yn);
#endif
  float diff = sub_fp64(a, yn_sqr).x;
  vec2 prod = twoProd(x * 0.5, diff);
#if defined(LUMA_FP64_HIGH_BITS_OVERFLOW_WORKAROUND)
  return sum_fp64(split(yn), prod);
#else
  return sum_fp64(vec2(yn, 0.0), prod);
#endif
}
`,defaultUniforms:{ONE:1},uniformTypes:{ONE:"f32"},fp64ify:e_,fp64LowPart:em,fp64ifyMatrix4:eE},ey={name:"fp64",vs:`const vec2 E_FP64 = vec2(2.7182817459106445e+00, 8.254840366817007e-08);
const vec2 LOG2_FP64 = vec2(0.6931471824645996e+00, -1.9046542121259336e-09);
const vec2 PI_FP64 = vec2(3.1415927410125732, -8.742278012618954e-8);
const vec2 TWO_PI_FP64 = vec2(6.2831854820251465, -1.7484556025237907e-7);
const vec2 PI_2_FP64 = vec2(1.5707963705062866, -4.371139006309477e-8);
const vec2 PI_4_FP64 = vec2(0.7853981852531433, -2.1855695031547384e-8);
const vec2 PI_16_FP64 = vec2(0.19634954631328583, -5.463923757886846e-9);
const vec2 PI_16_2_FP64 = vec2(0.39269909262657166, -1.0927847515773692e-8);
const vec2 PI_16_3_FP64 = vec2(0.5890486240386963, -1.4906100798128818e-9);
const vec2 PI_180_FP64 = vec2(0.01745329238474369, 1.3519960498364902e-10);

const vec2 SIN_TABLE_0_FP64 = vec2(0.19509032368659973, -1.6704714833615242e-9);
const vec2 SIN_TABLE_1_FP64 = vec2(0.3826834261417389, 6.22335089017767e-9);
const vec2 SIN_TABLE_2_FP64 = vec2(0.5555702447891235, -1.1769521357507529e-8);
const vec2 SIN_TABLE_3_FP64 = vec2(0.7071067690849304, 1.2101617041793133e-8);

const vec2 COS_TABLE_0_FP64 = vec2(0.9807852506637573, 2.9739473106360492e-8);
const vec2 COS_TABLE_1_FP64 = vec2(0.9238795042037964, 2.8307490351764386e-8);
const vec2 COS_TABLE_2_FP64 = vec2(0.8314695954322815, 1.6870263741530778e-8);
const vec2 COS_TABLE_3_FP64 = vec2(0.7071067690849304, 1.2101617152815436e-8);

const vec2 INVERSE_FACTORIAL_3_FP64 = vec2(1.666666716337204e-01, -4.967053879312289e-09); // 1/3!
const vec2 INVERSE_FACTORIAL_4_FP64 = vec2(4.16666679084301e-02, -1.2417634698280722e-09); // 1/4!
const vec2 INVERSE_FACTORIAL_5_FP64 = vec2(8.333333767950535e-03, -4.34617203337595e-10); // 1/5!
const vec2 INVERSE_FACTORIAL_6_FP64 = vec2(1.3888889225199819e-03, -3.3631094437103215e-11); // 1/6!
const vec2 INVERSE_FACTORIAL_7_FP64 = vec2(1.9841270113829523e-04,  -2.725596874933456e-12); // 1/7!
const vec2 INVERSE_FACTORIAL_8_FP64 = vec2(2.4801587642286904e-05, -3.406996025904184e-13); // 1/8!
const vec2 INVERSE_FACTORIAL_9_FP64 = vec2(2.75573188446287533e-06, 3.7935713937038186e-14); // 1/9!
const vec2 INVERSE_FACTORIAL_10_FP64 = vec2(2.755731998149713e-07, -7.575112367869873e-15); // 1/10!

float nint(float d) {
    if (d == floor(d)) return d;
    return floor(d + 0.5);
}

vec2 nint_fp64(vec2 a) {
    float hi = nint(a.x);
    float lo;
    vec2 tmp;
    if (hi == a.x) {
        lo = nint(a.y);
        tmp = quickTwoSum(hi, lo);
    } else {
        lo = 0.0;
        if (abs(hi - a.x) == 0.5 && a.y < 0.0) {
            hi -= 1.0;
        }
        tmp = vec2(hi, lo);
    }
    return tmp;
}

/* k_power controls how much range reduction we would like to have
Range reduction uses the following method:
assume a = k_power * r + m * log(2), k and m being integers.
Set k_power = 4 (we can choose other k to trade accuracy with performance.
we only need to calculate exp(r) and using exp(a) = 2^m * exp(r)^k_power;
*/

vec2 exp_fp64(vec2 a) {
  // We need to make sure these two numbers match
  // as bit-wise shift is not available in GLSL 1.0
  const int k_power = 4;
  const float k = 16.0;

  const float inv_k = 1.0 / k;

  if (a.x <= -88.0) return vec2(0.0, 0.0);
  if (a.x >= 88.0) return vec2(1.0 / 0.0, 1.0 / 0.0);
  if (a.x == 0.0 && a.y == 0.0) return vec2(1.0, 0.0);
  if (a.x == 1.0 && a.y == 0.0) return E_FP64;

  float m = floor(a.x / LOG2_FP64.x + 0.5);
  vec2 r = sub_fp64(a, mul_fp64(LOG2_FP64, vec2(m, 0.0))) * inv_k;
  vec2 s, t, p;

  p = mul_fp64(r, r);
  s = sum_fp64(r, p * 0.5);
  p = mul_fp64(p, r);
  t = mul_fp64(p, INVERSE_FACTORIAL_3_FP64);

  s = sum_fp64(s, t);
  p = mul_fp64(p, r);
  t = mul_fp64(p, INVERSE_FACTORIAL_4_FP64);

  s = sum_fp64(s, t);
  p = mul_fp64(p, r);
  t = mul_fp64(p, INVERSE_FACTORIAL_5_FP64);

  // s = sum_fp64(s, t);
  // p = mul_fp64(p, r);
  // t = mul_fp64(p, INVERSE_FACTORIAL_6_FP64);

  // s = sum_fp64(s, t);
  // p = mul_fp64(p, r);
  // t = mul_fp64(p, INVERSE_FACTORIAL_7_FP64);

  s = sum_fp64(s, t);


  // At this point, s = exp(r) - 1; but after following 4 recursions, we will get exp(r) ^ 512 - 1.
  for (int i = 0; i < k_power; i++) {
    s = sum_fp64(s * 2.0, mul_fp64(s, s));
  }

#if defined(NVIDIA_FP64_WORKAROUND) || defined(INTEL_FP64_WORKAROUND)
  s = sum_fp64(s, vec2(fp64.ONE, 0.0));
#else
  s = sum_fp64(s, vec2(1.0, 0.0));
#endif

  return s * pow(2.0, m);
//   return r;
}

vec2 log_fp64(vec2 a)
{
  if (a.x == 1.0 && a.y == 0.0) return vec2(0.0, 0.0);
  if (a.x <= 0.0) return vec2(0.0 / 0.0, 0.0 / 0.0);
  vec2 x = vec2(log(a.x), 0.0);
  vec2 s;
#if defined(NVIDIA_FP64_WORKAROUND) || defined(INTEL_FP64_WORKAROUND)
  s = vec2(fp64.ONE, 0.0);
#else
  s = vec2(1.0, 0.0);
#endif

  x = sub_fp64(sum_fp64(x, mul_fp64(a, exp_fp64(-x))), s);
  return x;
}

vec2 sin_taylor_fp64(vec2 a) {
  vec2 r, s, t, x;

  if (a.x == 0.0 && a.y == 0.0) {
    return vec2(0.0, 0.0);
  }

  x = -mul_fp64(a, a);
  s = a;
  r = a;

  r = mul_fp64(r, x);
  t = mul_fp64(r, INVERSE_FACTORIAL_3_FP64);
  s = sum_fp64(s, t);

  r = mul_fp64(r, x);
  t = mul_fp64(r, INVERSE_FACTORIAL_5_FP64);
  s = sum_fp64(s, t);

  /* keep the following commented code in case we need them
  for extra accuracy from the Taylor expansion*/

  // r = mul_fp64(r, x);
  // t = mul_fp64(r, INVERSE_FACTORIAL_7_FP64);
  // s = sum_fp64(s, t);

  // r = mul_fp64(r, x);
  // t = mul_fp64(r, INVERSE_FACTORIAL_9_FP64);
  // s = sum_fp64(s, t);

  return s;
}

vec2 cos_taylor_fp64(vec2 a) {
  vec2 r, s, t, x;

  if (a.x == 0.0 && a.y == 0.0) {
    return vec2(1.0, 0.0);
  }

  x = -mul_fp64(a, a);
  r = x;
  s = sum_fp64(vec2(1.0, 0.0), r * 0.5);

  r = mul_fp64(r, x);
  t = mul_fp64(r, INVERSE_FACTORIAL_4_FP64);
  s = sum_fp64(s, t);

  r = mul_fp64(r, x);
  t = mul_fp64(r, INVERSE_FACTORIAL_6_FP64);
  s = sum_fp64(s, t);

  /* keep the following commented code in case we need them
  for extra accuracy from the Taylor expansion*/

  // r = mul_fp64(r, x);
  // t = mul_fp64(r, INVERSE_FACTORIAL_8_FP64);
  // s = sum_fp64(s, t);

  // r = mul_fp64(r, x);
  // t = mul_fp64(r, INVERSE_FACTORIAL_10_FP64);
  // s = sum_fp64(s, t);

  return s;
}

void sincos_taylor_fp64(vec2 a, out vec2 sin_t, out vec2 cos_t) {
  if (a.x == 0.0 && a.y == 0.0) {
    sin_t = vec2(0.0, 0.0);
    cos_t = vec2(1.0, 0.0);
  }

  sin_t = sin_taylor_fp64(a);
  cos_t = sqrt_fp64(sub_fp64(vec2(1.0, 0.0), mul_fp64(sin_t, sin_t)));
}

vec2 sin_fp64(vec2 a) {
    if (a.x == 0.0 && a.y == 0.0) {
        return vec2(0.0, 0.0);
    }

    // 2pi range reduction
    vec2 z = nint_fp64(div_fp64(a, TWO_PI_FP64));
    vec2 r = sub_fp64(a, mul_fp64(TWO_PI_FP64, z));

    vec2 t;
    float q = floor(r.x / PI_2_FP64.x + 0.5);
    int j = int(q);

    if (j < -2 || j > 2) {
        return vec2(0.0 / 0.0, 0.0 / 0.0);
    }

    t = sub_fp64(r, mul_fp64(PI_2_FP64, vec2(q, 0.0)));

    q = floor(t.x / PI_16_FP64.x + 0.5);
    int k = int(q);

    if (k == 0) {
        if (j == 0) {
            return sin_taylor_fp64(t);
        } else if (j == 1) {
            return cos_taylor_fp64(t);
        } else if (j == -1) {
            return -cos_taylor_fp64(t);
        } else {
            return -sin_taylor_fp64(t);
        }
    }

    int abs_k = int(abs(float(k)));

    if (abs_k > 4) {
        return vec2(0.0 / 0.0, 0.0 / 0.0);
    } else {
        t = sub_fp64(t, mul_fp64(PI_16_FP64, vec2(q, 0.0)));
    }

    vec2 u = vec2(0.0, 0.0);
    vec2 v = vec2(0.0, 0.0);

#if defined(NVIDIA_FP64_WORKAROUND) || defined(INTEL_FP64_WORKAROUND)
    if (abs(float(abs_k) - 1.0) < 0.5) {
        u = COS_TABLE_0_FP64;
        v = SIN_TABLE_0_FP64;
    } else if (abs(float(abs_k) - 2.0) < 0.5) {
        u = COS_TABLE_1_FP64;
        v = SIN_TABLE_1_FP64;
    } else if (abs(float(abs_k) - 3.0) < 0.5) {
        u = COS_TABLE_2_FP64;
        v = SIN_TABLE_2_FP64;
    } else if (abs(float(abs_k) - 4.0) < 0.5) {
        u = COS_TABLE_3_FP64;
        v = SIN_TABLE_3_FP64;
    }
#else
    if (abs_k == 1) {
        u = COS_TABLE_0_FP64;
        v = SIN_TABLE_0_FP64;
    } else if (abs_k == 2) {
        u = COS_TABLE_1_FP64;
        v = SIN_TABLE_1_FP64;
    } else if (abs_k == 3) {
        u = COS_TABLE_2_FP64;
        v = SIN_TABLE_2_FP64;
    } else if (abs_k == 4) {
        u = COS_TABLE_3_FP64;
        v = SIN_TABLE_3_FP64;
    }
#endif

    vec2 sin_t, cos_t;
    sincos_taylor_fp64(t, sin_t, cos_t);



    vec2 result = vec2(0.0, 0.0);
    if (j == 0) {
        if (k > 0) {
            result = sum_fp64(mul_fp64(u, sin_t), mul_fp64(v, cos_t));
        } else {
            result = sub_fp64(mul_fp64(u, sin_t), mul_fp64(v, cos_t));
        }
    } else if (j == 1) {
        if (k > 0) {
            result = sub_fp64(mul_fp64(u, cos_t), mul_fp64(v, sin_t));
        } else {
            result = sum_fp64(mul_fp64(u, cos_t), mul_fp64(v, sin_t));
        }
    } else if (j == -1) {
        if (k > 0) {
            result = sub_fp64(mul_fp64(v, sin_t), mul_fp64(u, cos_t));
        } else {
            result = -sum_fp64(mul_fp64(v, sin_t), mul_fp64(u, cos_t));
        }
    } else {
        if (k > 0) {
            result = -sum_fp64(mul_fp64(u, sin_t), mul_fp64(v, cos_t));
        } else {
            result = sub_fp64(mul_fp64(v, cos_t), mul_fp64(u, sin_t));
        }
    }

    return result;
}

vec2 cos_fp64(vec2 a) {
    if (a.x == 0.0 && a.y == 0.0) {
        return vec2(1.0, 0.0);
    }

    // 2pi range reduction
    vec2 z = nint_fp64(div_fp64(a, TWO_PI_FP64));
    vec2 r = sub_fp64(a, mul_fp64(TWO_PI_FP64, z));

    vec2 t;
    float q = floor(r.x / PI_2_FP64.x + 0.5);
    int j = int(q);

    if (j < -2 || j > 2) {
        return vec2(0.0 / 0.0, 0.0 / 0.0);
    }

    t = sub_fp64(r, mul_fp64(PI_2_FP64, vec2(q, 0.0)));

    q = floor(t.x / PI_16_FP64.x + 0.5);
    int k = int(q);

    if (k == 0) {
        if (j == 0) {
            return cos_taylor_fp64(t);
        } else if (j == 1) {
            return -sin_taylor_fp64(t);
        } else if (j == -1) {
            return sin_taylor_fp64(t);
        } else {
            return -cos_taylor_fp64(t);
        }
    }

    int abs_k = int(abs(float(k)));

    if (abs_k > 4) {
        return vec2(0.0 / 0.0, 0.0 / 0.0);
    } else {
        t = sub_fp64(t, mul_fp64(PI_16_FP64, vec2(q, 0.0)));
    }

    vec2 u = vec2(0.0, 0.0);
    vec2 v = vec2(0.0, 0.0);

#if defined(NVIDIA_FP64_WORKAROUND) || defined(INTEL_FP64_WORKAROUND)
    if (abs(float(abs_k) - 1.0) < 0.5) {
        u = COS_TABLE_0_FP64;
        v = SIN_TABLE_0_FP64;
    } else if (abs(float(abs_k) - 2.0) < 0.5) {
        u = COS_TABLE_1_FP64;
        v = SIN_TABLE_1_FP64;
    } else if (abs(float(abs_k) - 3.0) < 0.5) {
        u = COS_TABLE_2_FP64;
        v = SIN_TABLE_2_FP64;
    } else if (abs(float(abs_k) - 4.0) < 0.5) {
        u = COS_TABLE_3_FP64;
        v = SIN_TABLE_3_FP64;
    }
#else
    if (abs_k == 1) {
        u = COS_TABLE_0_FP64;
        v = SIN_TABLE_0_FP64;
    } else if (abs_k == 2) {
        u = COS_TABLE_1_FP64;
        v = SIN_TABLE_1_FP64;
    } else if (abs_k == 3) {
        u = COS_TABLE_2_FP64;
        v = SIN_TABLE_2_FP64;
    } else if (abs_k == 4) {
        u = COS_TABLE_3_FP64;
        v = SIN_TABLE_3_FP64;
    }
#endif

    vec2 sin_t, cos_t;
    sincos_taylor_fp64(t, sin_t, cos_t);

    vec2 result = vec2(0.0, 0.0);
    if (j == 0) {
        if (k > 0) {
            result = sub_fp64(mul_fp64(u, cos_t), mul_fp64(v, sin_t));
        } else {
            result = sum_fp64(mul_fp64(u, cos_t), mul_fp64(v, sin_t));
        }
    } else if (j == 1) {
        if (k > 0) {
            result = -sum_fp64(mul_fp64(u, sin_t), mul_fp64(v, cos_t));
        } else {
            result = sub_fp64(mul_fp64(v, cos_t), mul_fp64(u, sin_t));
        }
    } else if (j == -1) {
        if (k > 0) {
            result = sum_fp64(mul_fp64(u, sin_t), mul_fp64(v, cos_t));
        } else {
            result = sub_fp64(mul_fp64(u, sin_t), mul_fp64(v, cos_t));
        }
    } else {
        if (k > 0) {
            result = sub_fp64(mul_fp64(v, sin_t), mul_fp64(u, cos_t));
        } else {
            result = -sum_fp64(mul_fp64(u, cos_t), mul_fp64(v, sin_t));
        }
    }

    return result;
}

vec2 tan_fp64(vec2 a) {
    vec2 sin_a;
    vec2 cos_a;

    if (a.x == 0.0 && a.y == 0.0) {
        return vec2(0.0, 0.0);
    }

    // 2pi range reduction
    vec2 z = nint_fp64(div_fp64(a, TWO_PI_FP64));
    vec2 r = sub_fp64(a, mul_fp64(TWO_PI_FP64, z));

    vec2 t;
    float q = floor(r.x / PI_2_FP64.x + 0.5);
    int j = int(q);


    if (j < -2 || j > 2) {
        return vec2(0.0 / 0.0, 0.0 / 0.0);
    }

    t = sub_fp64(r, mul_fp64(PI_2_FP64, vec2(q, 0.0)));

    q = floor(t.x / PI_16_FP64.x + 0.5);
    int k = int(q);
    int abs_k = int(abs(float(k)));

    // We just can't get PI/16 * 3.0 very accurately.
    // so let's just store it
    if (abs_k > 4) {
        return vec2(0.0 / 0.0, 0.0 / 0.0);
    } else {
        t = sub_fp64(t, mul_fp64(PI_16_FP64, vec2(q, 0.0)));
    }


    vec2 u = vec2(0.0, 0.0);
    vec2 v = vec2(0.0, 0.0);

    vec2 sin_t, cos_t;
    vec2 s, c;
    sincos_taylor_fp64(t, sin_t, cos_t);

    if (k == 0) {
        s = sin_t;
        c = cos_t;
    } else {
#if defined(NVIDIA_FP64_WORKAROUND) || defined(INTEL_FP64_WORKAROUND)
        if (abs(float(abs_k) - 1.0) < 0.5) {
            u = COS_TABLE_0_FP64;
            v = SIN_TABLE_0_FP64;
        } else if (abs(float(abs_k) - 2.0) < 0.5) {
            u = COS_TABLE_1_FP64;
            v = SIN_TABLE_1_FP64;
        } else if (abs(float(abs_k) - 3.0) < 0.5) {
            u = COS_TABLE_2_FP64;
            v = SIN_TABLE_2_FP64;
        } else if (abs(float(abs_k) - 4.0) < 0.5) {
            u = COS_TABLE_3_FP64;
            v = SIN_TABLE_3_FP64;
        }
#else
        if (abs_k == 1) {
            u = COS_TABLE_0_FP64;
            v = SIN_TABLE_0_FP64;
        } else if (abs_k == 2) {
            u = COS_TABLE_1_FP64;
            v = SIN_TABLE_1_FP64;
        } else if (abs_k == 3) {
            u = COS_TABLE_2_FP64;
            v = SIN_TABLE_2_FP64;
        } else if (abs_k == 4) {
            u = COS_TABLE_3_FP64;
            v = SIN_TABLE_3_FP64;
        }
#endif
        if (k > 0) {
            s = sum_fp64(mul_fp64(u, sin_t), mul_fp64(v, cos_t));
            c = sub_fp64(mul_fp64(u, cos_t), mul_fp64(v, sin_t));
        } else {
            s = sub_fp64(mul_fp64(u, sin_t), mul_fp64(v, cos_t));
            c = sum_fp64(mul_fp64(u, cos_t), mul_fp64(v, sin_t));
        }
    }

    if (j == 0) {
        sin_a = s;
        cos_a = c;
    } else if (j == 1) {
        sin_a = c;
        cos_a = -s;
    } else if (j == -1) {
        sin_a = -c;
        cos_a = s;
    } else {
        sin_a = -s;
        cos_a = -c;
    }
    return div_fp64(sin_a, cos_a);
}

vec2 radians_fp64(vec2 degree) {
  return mul_fp64(degree, PI_180_FP64);
}

vec2 mix_fp64(vec2 a, vec2 b, float x) {
  vec2 range = sub_fp64(b, a);
  return sum_fp64(a, mul_fp64(range, vec2(x, 0.0)));
}

// Vector functions
// vec2 functions
void vec2_sum_fp64(vec2 a[2], vec2 b[2], out vec2 out_val[2]) {
    out_val[0] = sum_fp64(a[0], b[0]);
    out_val[1] = sum_fp64(a[1], b[1]);
}

void vec2_sub_fp64(vec2 a[2], vec2 b[2], out vec2 out_val[2]) {
    out_val[0] = sub_fp64(a[0], b[0]);
    out_val[1] = sub_fp64(a[1], b[1]);
}

void vec2_mul_fp64(vec2 a[2], vec2 b[2], out vec2 out_val[2]) {
    out_val[0] = mul_fp64(a[0], b[0]);
    out_val[1] = mul_fp64(a[1], b[1]);
}

void vec2_div_fp64(vec2 a[2], vec2 b[2], out vec2 out_val[2]) {
    out_val[0] = div_fp64(a[0], b[0]);
    out_val[1] = div_fp64(a[1], b[1]);
}

void vec2_mix_fp64(vec2 x[2], vec2 y[2], float a, out vec2 out_val[2]) {
  vec2 range[2];
  vec2_sub_fp64(y, x, range);
  vec2 portion[2];
  portion[0] = range[0] * a;
  portion[1] = range[1] * a;
  vec2_sum_fp64(x, portion, out_val);
}

vec2 vec2_length_fp64(vec2 x[2]) {
  return sqrt_fp64(sum_fp64(mul_fp64(x[0], x[0]), mul_fp64(x[1], x[1])));
}

void vec2_normalize_fp64(vec2 x[2], out vec2 out_val[2]) {
  vec2 length = vec2_length_fp64(x);
  vec2 length_vec2[2];
  length_vec2[0] = length;
  length_vec2[1] = length;

  vec2_div_fp64(x, length_vec2, out_val);
}

vec2 vec2_distance_fp64(vec2 x[2], vec2 y[2]) {
  vec2 diff[2];
  vec2_sub_fp64(x, y, diff);
  return vec2_length_fp64(diff);
}

vec2 vec2_dot_fp64(vec2 a[2], vec2 b[2]) {
  vec2 v[2];

  v[0] = mul_fp64(a[0], b[0]);
  v[1] = mul_fp64(a[1], b[1]);

  return sum_fp64(v[0], v[1]);
}

// vec3 functions
void vec3_sub_fp64(vec2 a[3], vec2 b[3], out vec2 out_val[3]) {
  for (int i = 0; i < 3; i++) {
    out_val[i] = sum_fp64(a[i], b[i]);
  }
}

void vec3_sum_fp64(vec2 a[3], vec2 b[3], out vec2 out_val[3]) {
  for (int i = 0; i < 3; i++) {
    out_val[i] = sum_fp64(a[i], b[i]);
  }
}

vec2 vec3_length_fp64(vec2 x[3]) {
  return sqrt_fp64(sum_fp64(sum_fp64(mul_fp64(x[0], x[0]), mul_fp64(x[1], x[1])),
    mul_fp64(x[2], x[2])));
}

vec2 vec3_distance_fp64(vec2 x[3], vec2 y[3]) {
  vec2 diff[3];
  vec3_sub_fp64(x, y, diff);
  return vec3_length_fp64(diff);
}

// vec4 functions
void vec4_fp64(vec4 a, out vec2 out_val[4]) {
  out_val[0].x = a[0];
  out_val[0].y = 0.0;

  out_val[1].x = a[1];
  out_val[1].y = 0.0;

  out_val[2].x = a[2];
  out_val[2].y = 0.0;

  out_val[3].x = a[3];
  out_val[3].y = 0.0;
}

void vec4_scalar_mul_fp64(vec2 a[4], vec2 b, out vec2 out_val[4]) {
  out_val[0] = mul_fp64(a[0], b);
  out_val[1] = mul_fp64(a[1], b);
  out_val[2] = mul_fp64(a[2], b);
  out_val[3] = mul_fp64(a[3], b);
}

void vec4_sum_fp64(vec2 a[4], vec2 b[4], out vec2 out_val[4]) {
  for (int i = 0; i < 4; i++) {
    out_val[i] = sum_fp64(a[i], b[i]);
  }
}

void vec4_dot_fp64(vec2 a[4], vec2 b[4], out vec2 out_val) {
  vec2 v[4];

  v[0] = mul_fp64(a[0], b[0]);
  v[1] = mul_fp64(a[1], b[1]);
  v[2] = mul_fp64(a[2], b[2]);
  v[3] = mul_fp64(a[3], b[3]);

  out_val = sum_fp64(sum_fp64(v[0], v[1]), sum_fp64(v[2], v[3]));
}

void mat4_vec4_mul_fp64(vec2 b[16], vec2 a[4], out vec2 out_val[4]) {
  vec2 tmp[4];

  for (int i = 0; i < 4; i++)
  {
    for (int j = 0; j < 4; j++)
    {
      tmp[j] = b[j + i * 4];
    }
    vec4_dot_fp64(a, tmp, out_val[i]);
  }
}
`,dependencies:[eA],fp64ify:e_,fp64LowPart:em,fp64ifyMatrix4:eE},eT={props:{},uniforms:{},name:"picking",uniformTypes:{isActive:"f32",isAttribute:"f32",isHighlightActive:"f32",useFloatColors:"f32",highlightedObjectColor:"vec3<f32>",highlightColor:"vec4<f32>"},defaultUniforms:{isActive:!1,isAttribute:!1,isHighlightActive:!1,useFloatColors:!0,highlightedObjectColor:[0,0,0],highlightColor:[0,1,1,1]},vs:`uniform pickingUniforms {
  float isActive;
  float isAttribute;
  float isHighlightActive;
  float useFloatColors;
  vec3 highlightedObjectColor;
  vec4 highlightColor;
} picking;

out vec4 picking_vRGBcolor_Avalid;

// Normalize unsigned byte color to 0-1 range
vec3 picking_normalizeColor(vec3 color) {
  return picking.useFloatColors > 0.5 ? color : color / 255.0;
}

// Normalize unsigned byte color to 0-1 range
vec4 picking_normalizeColor(vec4 color) {
  return picking.useFloatColors > 0.5 ? color : color / 255.0;
}

bool picking_isColorZero(vec3 color) {
  return dot(color, vec3(1.0)) < 0.00001;
}

bool picking_isColorValid(vec3 color) {
  return dot(color, vec3(1.0)) > 0.00001;
}

// Check if this vertex is highlighted 
bool isVertexHighlighted(vec3 vertexColor) {
  vec3 highlightedObjectColor = picking_normalizeColor(picking.highlightedObjectColor);
  return
    bool(picking.isHighlightActive) && picking_isColorZero(abs(vertexColor - highlightedObjectColor));
}

// Set the current picking color
void picking_setPickingColor(vec3 pickingColor) {
  pickingColor = picking_normalizeColor(pickingColor);

  if (bool(picking.isActive)) {
    // Use alpha as the validity flag. If pickingColor is [0, 0, 0] fragment is non-pickable
    picking_vRGBcolor_Avalid.a = float(picking_isColorValid(pickingColor));

    if (!bool(picking.isAttribute)) {
      // Stores the picking color so that the fragment shader can render it during picking
      picking_vRGBcolor_Avalid.rgb = pickingColor;
    }
  } else {
    // Do the comparison with selected item color in vertex shader as it should mean fewer compares
    picking_vRGBcolor_Avalid.a = float(isVertexHighlighted(pickingColor));
  }
}

void picking_setPickingAttribute(float value) {
  if (bool(picking.isAttribute)) {
    picking_vRGBcolor_Avalid.r = value;
  }
}

void picking_setPickingAttribute(vec2 value) {
  if (bool(picking.isAttribute)) {
    picking_vRGBcolor_Avalid.rg = value;
  }
}

void picking_setPickingAttribute(vec3 value) {
  if (bool(picking.isAttribute)) {
    picking_vRGBcolor_Avalid.rgb = value;
  }
}
`,fs:`uniform pickingUniforms {
  float isActive;
  float isAttribute;
  float isHighlightActive;
  float useFloatColors;
  vec3 highlightedObjectColor;
  vec4 highlightColor;
} picking;

in vec4 picking_vRGBcolor_Avalid;

/*
 * Returns highlight color if this item is selected.
 */
vec4 picking_filterHighlightColor(vec4 color) {
  // If we are still picking, we don't highlight
  if (picking.isActive > 0.5) {
    return color;
  }

  bool selected = bool(picking_vRGBcolor_Avalid.a);

  if (selected) {
    // Blend in highlight color based on its alpha value
    float highLightAlpha = picking.highlightColor.a;
    float blendedAlpha = highLightAlpha + color.a * (1.0 - highLightAlpha);
    float highLightRatio = highLightAlpha / blendedAlpha;

    vec3 blendedRGB = mix(color.rgb, picking.highlightColor.rgb, highLightRatio);
    return vec4(blendedRGB, blendedAlpha);
  } else {
    return color;
  }
}

/*
 * Returns picking color if picking enabled else unmodified argument.
 */
vec4 picking_filterPickingColor(vec4 color) {
  if (bool(picking.isActive)) {
    if (picking_vRGBcolor_Avalid.a == 0.0) {
      discard;
    }
    return picking_vRGBcolor_Avalid;
  }
  return color;
}

/*
 * Returns picking color if picking is enabled if not
 * highlight color if this item is selected, otherwise unmodified argument.
 */
vec4 picking_filterColor(vec4 color) {
  vec4 highlightColor = picking_filterHighlightColor(color);
  return picking_filterPickingColor(highlightColor);
}
`,getUniforms:function(e={},t){let r={};if(void 0===e.highlightedObjectColor);else if(null===e.highlightedObjectColor)r.isHighlightActive=!1;else{r.isHighlightActive=!0;let t=e.highlightedObjectColor.slice(0,3);r.highlightedObjectColor=t}if(e.highlightColor){let t=Array.from(e.highlightColor,e=>e/255);Number.isFinite(t[3])||(t[3]=1),r.highlightColor=t}return void 0!==e.isActive&&(r.isActive=!!e.isActive,r.isAttribute=!!e.isAttribute),void 0!==e.useFloatColors&&(r.useFloatColors=!!e.useFloatColors),r}},eR=r(97175),eS=`precision highp int;

// #if (defined(SHADER_TYPE_FRAGMENT) && defined(LIGHTING_FRAGMENT)) || (defined(SHADER_TYPE_VERTEX) && defined(LIGHTING_VERTEX))
struct AmbientLight {
  vec3 color;
};

struct PointLight {
  vec3 color;
  vec3 position;
  vec3 attenuation; // 2nd order x:Constant-y:Linear-z:Exponential
};

struct DirectionalLight {
  vec3 color;
  vec3 direction;
};

uniform lightingUniforms {
  int enabled;
  int lightType;

  int directionalLightCount;
  int pointLightCount;

  vec3 ambientColor;

  vec3 lightColor0;
  vec3 lightPosition0;
  vec3 lightDirection0;
  vec3 lightAttenuation0;

  vec3 lightColor1;
  vec3 lightPosition1;
  vec3 lightDirection1;
  vec3 lightAttenuation1;

  vec3 lightColor2;
  vec3 lightPosition2;
  vec3 lightDirection2;
  vec3 lightAttenuation2;
} lighting;

PointLight lighting_getPointLight(int index) {
  switch (index) {
    case 0:
      return PointLight(lighting.lightColor0, lighting.lightPosition0, lighting.lightAttenuation0);
    case 1:
      return PointLight(lighting.lightColor1, lighting.lightPosition1, lighting.lightAttenuation1);
    case 2:
    default:  
      return PointLight(lighting.lightColor2, lighting.lightPosition2, lighting.lightAttenuation2);
  }
}

DirectionalLight lighting_getDirectionalLight(int index) {
  switch (index) {
    case 0:
      return DirectionalLight(lighting.lightColor0, lighting.lightDirection0);
    case 1:
      return DirectionalLight(lighting.lightColor1, lighting.lightDirection1);
    case 2:
    default:   
      return DirectionalLight(lighting.lightColor2, lighting.lightDirection2);
  }
} 

float getPointLightAttenuation(PointLight pointLight, float distance) {
  return pointLight.attenuation.x
       + pointLight.attenuation.y * distance
       + pointLight.attenuation.z * distance * distance;
}

// #endif
`,eM=`// #if (defined(SHADER_TYPE_FRAGMENT) && defined(LIGHTING_FRAGMENT)) || (defined(SHADER_TYPE_VERTEX) && defined(LIGHTING_VERTEX))
struct AmbientLight {
  color: vec3<f32>,
};

struct PointLight {
  color: vec3<f32>,
  position: vec3<f32>,
  attenuation: vec3<f32>, // 2nd order x:Constant-y:Linear-z:Exponential
};

struct DirectionalLight {
  color: vec3<f32>,
  direction: vec3<f32>,
};

struct lightingUniforms {
  enabled: i32,
  pointLightCount: i32,
  directionalLightCount: i32,

  ambientColor: vec3<f32>,

  // TODO - support multiple lights by uncommenting arrays below
  lightType: i32,
  lightColor: vec3<f32>,
  lightDirection: vec3<f32>,
  lightPosition: vec3<f32>,
  lightAttenuation: vec3<f32>,

  // AmbientLight ambientLight;
  // PointLight pointLight[MAX_LIGHTS];
  // DirectionalLight directionalLight[MAX_LIGHTS];
};

// Binding 0:1 is reserved for lighting (Note: could go into separate bind group as it is stable across draw calls)
@binding(1) @group(0) var<uniform> lighting : lightingUniforms;

fn lighting_getPointLight(index: i32) -> PointLight {
  return PointLight(lighting.lightColor, lighting.lightPosition, lighting.lightAttenuation);
}

fn lighting_getDirectionalLight(index: i32) -> DirectionalLight {
  return DirectionalLight(lighting.lightColor, lighting.lightDirection);
} 

fn getPointLightAttenuation(pointLight: PointLight, distance: f32) -> f32 {
  return pointLight.attenuation.x
       + pointLight.attenuation.y * distance
       + pointLight.attenuation.z * distance * distance;
}
`;(o=a||(a={}))[o.POINT=0]="POINT",o[o.DIRECTIONAL=1]="DIRECTIONAL";var eI={props:{},uniforms:{},name:"lighting",defines:{},uniformTypes:{enabled:"i32",lightType:"i32",directionalLightCount:"i32",pointLightCount:"i32",ambientColor:"vec3<f32>",lightColor0:"vec3<f32>",lightPosition0:"vec3<f32>",lightDirection0:"vec3<f32>",lightAttenuation0:"vec3<f32>",lightColor1:"vec3<f32>",lightPosition1:"vec3<f32>",lightDirection1:"vec3<f32>",lightAttenuation1:"vec3<f32>",lightColor2:"vec3<f32>",lightPosition2:"vec3<f32>",lightDirection2:"vec3<f32>",lightAttenuation2:"vec3<f32>"},defaultUniforms:{enabled:1,lightType:a.POINT,directionalLightCount:0,pointLightCount:0,ambientColor:[.1,.1,.1],lightColor0:[1,1,1],lightPosition0:[1,1,2],lightDirection0:[1,1,1],lightAttenuation0:[1,0,0],lightColor1:[1,1,1],lightPosition1:[1,1,2],lightDirection1:[1,1,1],lightAttenuation1:[1,0,0],lightColor2:[1,1,1],lightPosition2:[1,1,2],lightDirection2:[1,1,1],lightAttenuation2:[1,0,0]},source:eM,vs:eS,fs:eS,getUniforms:function(e,t={}){if(!(e=e?{...e}:e))return{...eI.defaultUniforms};e.lights&&(e={...e,...function(e){var t,r;let i={pointLights:[],directionalLights:[]};for(let n of e||[])switch(n.type){case"ambient":i.ambientLight=n;break;case"directional":null==(t=i.directionalLights)||t.push(n);break;case"point":null==(r=i.pointLights)||r.push(n)}return i}(e.lights),lights:void 0});let{ambientLight:r,pointLights:i,directionalLights:n}=e||{};if(!(r||i&&i.length>0||n&&n.length>0))return{...eI.defaultUniforms,enabled:0};let s={...eI.defaultUniforms,...t,...function({ambientLight:e,pointLights:t=[],directionalLights:r=[]}){let i={};i.ambientColor=eC(e);let n=0;for(let e of t){i.lightType=a.POINT;let t=n;i[`lightColor${t}`]=eC(e),i[`lightPosition${t}`]=e.position,i[`lightAttenuation${t}`]=e.attenuation||[1,0,0],n++}for(let e of r){i.lightType=a.DIRECTIONAL;let t=n;i[`lightColor${t}`]=eC(e),i[`lightDirection${t}`]=e.direction,n++}return n>5&&eR.log.warn("MAX_LIGHTS exceeded")(),i.directionalLightCount=r.length,i.pointLightCount=t.length,i}({ambientLight:r,pointLights:i,directionalLights:n})};return void 0!==e.enabled&&(s.enabled=e.enabled?1:0),s}};function eC(e={}){let{color:t=[0,0,0],intensity:r=1}=e;return t.map(e=>e*r/255)}var ex={props:{},uniforms:{},name:"dirlight",dependencies:[],source:`  
struct dirlightUniforms {
  lightDirection: vec3<f32>,
};

alias DirlightNormal = vec3<f32>;

struct DirlightInputs {
  normal: DirlightNormal,
};

@binding(1) @group(0) var<uniform> dirlight : dirlightUniforms;

// For vertex
fn dirlight_setNormal(normal: vec3<f32>) -> DirlightNormal {
  return normalize(normal);
}

// Returns color attenuated by angle from light source
fn dirlight_filterColor(color: vec4<f32>, inputs: DirlightInputs) -> vec4<f32> {
  // TODO - fix default light direction
  // let lightDirection = dirlight.lightDirection;
  let lightDirection = vec3<f32>(1, 1, 1);
  let d: f32 = abs(dot(inputs.normal, normalize(lightDirection)));
  return vec4<f32>(color.rgb * d, color.a);
}
`,vs:`out vec3 dirlight_vNormal;

void dirlight_setNormal(vec3 normal) {
  dirlight_vNormal = normalize(normal);
}
`,fs:`uniform dirlightUniforms {
  vec3 lightDirection;
} dirlight;

in vec3 dirlight_vNormal;

// Returns color attenuated by angle from light source
vec4 dirlight_filterColor(vec4 color) {
  float d = abs(dot(dirlight_vNormal, normalize(dirlight.lightDirection)));
  return vec4(color.rgb * d, color.a);
}
`,uniformTypes:{lightDirection:"vec3<f32>"},defaultUniforms:{lightDirection:[1,1,2]},getUniforms:function(e=ex.defaultUniforms){let t={};return e.lightDirection&&(t.lightDirection=e.lightDirection),t}},ew=`uniform phongMaterialUniforms {
  uniform float ambient;
  uniform float diffuse;
  uniform float shininess;
  uniform vec3  specularColor;
} material;
`,eN=`#define MAX_LIGHTS 3

uniform phongMaterialUniforms {
  uniform float ambient;
  uniform float diffuse;
  uniform float shininess;
  uniform vec3  specularColor;
} material;

vec3 lighting_getLightColor(vec3 surfaceColor, vec3 light_direction, vec3 view_direction, vec3 normal_worldspace, vec3 color) {
  vec3 halfway_direction = normalize(light_direction + view_direction);
  float lambertian = dot(light_direction, normal_worldspace);
  float specular = 0.0;
  if (lambertian > 0.0) {
    float specular_angle = max(dot(normal_worldspace, halfway_direction), 0.0);
    specular = pow(specular_angle, material.shininess);
  }
  lambertian = max(lambertian, 0.0);
  return (lambertian * material.diffuse * surfaceColor + specular * material.specularColor) * color;
}

vec3 lighting_getLightColor(vec3 surfaceColor, vec3 cameraPosition, vec3 position_worldspace, vec3 normal_worldspace) {
  vec3 lightColor = surfaceColor;

  if (lighting.enabled == 0) {
    return lightColor;
  }

  vec3 view_direction = normalize(cameraPosition - position_worldspace);
  lightColor = material.ambient * surfaceColor * lighting.ambientColor;

  for (int i = 0; i < lighting.pointLightCount; i++) {
    PointLight pointLight = lighting_getPointLight(i);
    vec3 light_position_worldspace = pointLight.position;
    vec3 light_direction = normalize(light_position_worldspace - position_worldspace);
    float light_attenuation = getPointLightAttenuation(pointLight, distance(light_position_worldspace, position_worldspace));
    lightColor += lighting_getLightColor(surfaceColor, light_direction, view_direction, normal_worldspace, pointLight.color / light_attenuation);
  }

  int totalLights = min(MAX_LIGHTS, lighting.pointLightCount + lighting.directionalLightCount);
  for (int i = lighting.pointLightCount; i < totalLights; i++) {
    DirectionalLight directionalLight = lighting_getDirectionalLight(i);
    lightColor += lighting_getLightColor(surfaceColor, -directionalLight.direction, view_direction, normal_worldspace, directionalLight.color);
  }
  
  return lightColor;
}
`,eO=`struct phongMaterialUniforms {
  ambient: f32,
  diffuse: f32,
  shininess: f32,
  specularColor: vec3<f32>,
};

@binding(2) @group(0) var<uniform> phongMaterial : phongMaterialUniforms;

fn lighting_getLightColor(surfaceColor: vec3<f32>, light_direction: vec3<f32>, view_direction: vec3<f32>, normal_worldspace: vec3<f32>, color: vec3<f32>) -> vec3<f32> {
  let halfway_direction: vec3<f32> = normalize(light_direction + view_direction);
  var lambertian: f32 = dot(light_direction, normal_worldspace);
  var specular: f32 = 0.0;
  if (lambertian > 0.0) {
    let specular_angle = max(dot(normal_worldspace, halfway_direction), 0.0);
    specular = pow(specular_angle, phongMaterial.shininess);
  }
  lambertian = max(lambertian, 0.0);
  return (lambertian * phongMaterial.diffuse * surfaceColor + specular * phongMaterial.specularColor) * color;
}

fn lighting_getLightColor2(surfaceColor: vec3<f32>, cameraPosition: vec3<f32>, position_worldspace: vec3<f32>, normal_worldspace: vec3<f32>) -> vec3<f32> {
  var lightColor: vec3<f32> = surfaceColor;

  if (lighting.enabled == 0) {
    return lightColor;
  }

  let view_direction: vec3<f32> = normalize(cameraPosition - position_worldspace);
  lightColor = phongMaterial.ambient * surfaceColor * lighting.ambientColor;

  if (lighting.lightType == 0) {
    let pointLight: PointLight  = lighting_getPointLight(0);
    let light_position_worldspace: vec3<f32> = pointLight.position;
    let light_direction: vec3<f32> = normalize(light_position_worldspace - position_worldspace);
    lightColor += lighting_getLightColor(surfaceColor, light_direction, view_direction, normal_worldspace, pointLight.color);
  } else if (lighting.lightType == 1) {
    var directionalLight: DirectionalLight = lighting_getDirectionalLight(0);
    lightColor += lighting_getLightColor(surfaceColor, -directionalLight.direction, view_direction, normal_worldspace, directionalLight.color);
  }
  
  return lightColor;
  /*
  for (int i = 0; i < MAX_LIGHTS; i++) {
    if (i >= lighting.pointLightCount) {
      break;
    }
    PointLight pointLight = lighting.pointLight[i];
    vec3 light_position_worldspace = pointLight.position;
    vec3 light_direction = normalize(light_position_worldspace - position_worldspace);
    lightColor += lighting_getLightColor(surfaceColor, light_direction, view_direction, normal_worldspace, pointLight.color);
  }

  for (int i = 0; i < MAX_LIGHTS; i++) {
    if (i >= lighting.directionalLightCount) {
      break;
    }
    DirectionalLight directionalLight = lighting.directionalLight[i];
    lightColor += lighting_getLightColor(surfaceColor, -directionalLight.direction, view_direction, normal_worldspace, directionalLight.color);
  }
  */
}

fn lighting_getSpecularLightColor(cameraPosition: vec3<f32>, position_worldspace: vec3<f32>, normal_worldspace: vec3<f32>) -> vec3<f32>{
  var lightColor = vec3<f32>(0, 0, 0);
  let surfaceColor = vec3<f32>(0, 0, 0);

  if (lighting.enabled == 0) {
    let view_direction = normalize(cameraPosition - position_worldspace);

    switch (lighting.lightType) {
      case 0, default: {
        let pointLight: PointLight = lighting_getPointLight(0);
        let light_position_worldspace: vec3<f32> = pointLight.position;
        let light_direction: vec3<f32> = normalize(light_position_worldspace - position_worldspace);
        lightColor += lighting_getLightColor(surfaceColor, light_direction, view_direction, normal_worldspace, pointLight.color);
      }
      case 1: {
        let directionalLight: DirectionalLight = lighting_getDirectionalLight(0);
        lightColor += lighting_getLightColor(surfaceColor, -directionalLight.direction, view_direction, normal_worldspace, directionalLight.color);
      }
    }
  }
  return lightColor;
}
`,eP={props:{},name:"gouraudMaterial",vs:eN.replace("phongMaterial","gouraudMaterial"),fs:ew.replace("phongMaterial","gouraudMaterial"),source:eO.replaceAll("phongMaterial","gouraudMaterial"),defines:{LIGHTING_VERTEX:!0},dependencies:[eI],uniformTypes:{ambient:"f32",diffuse:"f32",shininess:"f32",specularColor:"vec3<f32>"},defaultUniforms:{ambient:.35,diffuse:.6,shininess:32,specularColor:[.15,.15,.15]},getUniforms(e){let t={...e};return t.specularColor&&(t.specularColor=t.specularColor.map(e=>e/255)),{...eP.defaultUniforms,...t}}},eL={name:"phongMaterial",dependencies:[eI],source:eO,vs:ew,fs:eN,defines:{LIGHTING_FRAGMENT:!0},uniformTypes:{ambient:"f32",diffuse:"f32",shininess:"f32",specularColor:"vec3<f32>"},defaultUniforms:{ambient:.35,diffuse:.6,shininess:32,specularColor:[.15,.15,.15]},getUniforms(e){let t={...e};return t.specularColor&&(t.specularColor=t.specularColor.map(e=>e/255)),{...eL.defaultUniforms,...t}}},eF=`uniform pbrProjectionUniforms {
  mat4 modelViewProjectionMatrix;
  mat4 modelMatrix;
  mat4 normalMatrix;
  vec3 camera;
} pbrProjection;
`,eB={props:{},uniforms:{},name:"pbrMaterial",dependencies:[eI,{name:"pbrProjection",vs:eF,fs:eF,getUniforms:e=>e,uniformTypes:{modelViewProjectionMatrix:"mat4x4<f32>",modelMatrix:"mat4x4<f32>",normalMatrix:"mat4x4<f32>",camera:"vec3<i32>"}}],source:`struct PBRFragmentInputs {
  pbr_vPosition: vec3f,
  pbr_vUV: vec2f,
  pbr_vTBN: mat3f,
  pbr_vNormal: vec3f
};

var fragmentInputs: PBRFragmentInputs;

fn pbr_setPositionNormalTangentUV(position: vec4f, normal: vec4f, tangent: vec4f, uv: vec2f)
{
  var pos: vec4f = pbrProjection.modelMatrix * position;
  pbr_vPosition = vec3(pos.xyz) / pos.w;

#ifdef HAS_NORMALS
#ifdef HAS_TANGENTS
  let normalW: vec3f = normalize(vec3(pbrProjection.normalMatrix * vec4(normal.xyz, 0.0)));
  let tangentW: vec3f = normalize(vec3(pbrProjection.modelMatrix * vec4(tangent.xyz, 0.0)));
  let bitangentW: vec3f = cross(normalW, tangentW) * tangent.w;
  fragmentInputs,pbr_vTBN = mat3(tangentW, bitangentW, normalW);
#else // HAS_TANGENTS != 1
  fragmentInputs.pbr_vNormal = normalize(vec3(pbrProjection.modelMatrix * vec4(normal.xyz, 0.0)));
#endif
#endif

#ifdef HAS_UV
  pbr_vUV = uv;
#else
  pbr_vUV = vec2(0.,0.);
#endif
}

struct pbrMaterialUniforms {
  // Material is unlit
  unlit: uint32,

  // Base color map
  baseColorMapEnabled: uint32,
  baseColorFactor: vec4f,

  normalMapEnabled : uint32,
  normalScale: f32,  // #ifdef HAS_NORMALMAP

  emissiveMapEnabled: uint32,
  emissiveFactor: vec3f, // #ifdef HAS_EMISSIVEMAP

  metallicRoughnessValues: vec2f,
  metallicRoughnessMapEnabled: uint32,

  occlusionMapEnabled: i32,
  occlusionStrength: f32, // #ifdef HAS_OCCLUSIONMAP
  
  alphaCutoffEnabled: i32,
  alphaCutoff: f32, // #ifdef ALPHA_CUTOFF
  
  // IBL
  IBLenabled: i32,
  scaleIBLAmbient: vec2f, // #ifdef USE_IBL
  
  // debugging flags used for shader output of intermediate PBR variables
  // #ifdef PBR_DEBUG
  scaleDiffBaseMR: vec4f,
  scaleFGDSpec: vec4f
  // #endif
} 
  
@binding(2) @group(0) var<uniform> material : pbrMaterialUniforms;

// Samplers
#ifdef HAS_BASECOLORMAP
uniform sampler2D pbr_baseColorSampler;
#endif
#ifdef HAS_NORMALMAP
uniform sampler2D pbr_normalSampler;
#endif
#ifdef HAS_EMISSIVEMAP
uniform sampler2D pbr_emissiveSampler;
#endif
#ifdef HAS_METALROUGHNESSMAP
uniform sampler2D pbr_metallicRoughnessSampler;
#endif
#ifdef HAS_OCCLUSIONMAP
uniform sampler2D pbr_occlusionSampler;
#endif
#ifdef USE_IBL
uniform samplerCube pbr_diffuseEnvSampler;
uniform samplerCube pbr_specularEnvSampler;
uniform sampler2D pbr_brdfLUT;
#endif

// Encapsulate the various inputs used by the various functions in the shading equation
// We store values in this struct to simplify the integration of alternative implementations
// of the shading terms, outlined in the Readme.MD Appendix.
struct PBRInfo {
  NdotL: f32,                  // cos angle between normal and light direction
  NdotV: f32,                  // cos angle between normal and view direction
  NdotH: f32,                  // cos angle between normal and half vector
  LdotH: f32,                  // cos angle between light direction and half vector
  VdotH: f32,                  // cos angle between view direction and half vector
  perceptualRoughness: f32,    // roughness value, as authored by the model creator (input to shader)
  metalness: f32,              // metallic value at the surface
  reflectance0: vec3f,            // full reflectance color (normal incidence angle)
  reflectance90: vec3f,           // reflectance color at grazing angle
  alphaRoughness: f32,         // roughness mapped to a more linear change in the roughness (proposed by [2])
  diffuseColor: vec3f,            // color contribution from diffuse lighting
  specularColor: vec3f,           // color contribution from specular lighting
  n: vec3f,                       // normal at surface point
  v: vec3f,                       // vector from surface point to camera
};

const M_PI = 3.141592653589793;
const c_MinRoughness = 0.04;

fn SRGBtoLINEAR(srgbIn: vec4f ) -> vec4f
{
#ifdef MANUAL_SRGB
#ifdef SRGB_FAST_APPROXIMATION
  var linOut: vec3f = pow(srgbIn.xyz,vec3(2.2));
#else // SRGB_FAST_APPROXIMATION
  var bLess: vec3f = step(vec3(0.04045),srgbIn.xyz);
  var linOut: vec3f = mix( srgbIn.xyz/vec3(12.92), pow((srgbIn.xyz+vec3(0.055))/vec3(1.055),vec3(2.4)), bLess );
#endif //SRGB_FAST_APPROXIMATION
  return vec4f(linOut,srgbIn.w);;
#else //MANUAL_SRGB
  return srgbIn;
#endif //MANUAL_SRGB
}

// Find the normal for this fragment, pulling either from a predefined normal map
// or from the interpolated mesh normal and tangent attributes.
fn getNormal() -> vec3f
{
  // Retrieve the tangent space matrix
#ifndef HAS_TANGENTS
  var pos_dx: vec3f = dFdx(pbr_vPosition);
  var pos_dy: vec3f = dFdy(pbr_vPosition);
  var tex_dx: vec3f = dFdx(vec3(pbr_vUV, 0.0));
  var tex_dy: vec3f = dFdy(vec3(pbr_vUV, 0.0));
  var t: vec3f = (tex_dy.t * pos_dx - tex_dx.t * pos_dy) / (tex_dx.s * tex_dy.t - tex_dy.s * tex_dx.t);

#ifdef HAS_NORMALS
  var ng: vec3f = normalize(pbr_vNormal);
#else
  var ng: vec3f = cross(pos_dx, pos_dy);
#endif

  t = normalize(t - ng * dot(ng, t));
  var b: vec3f = normalize(cross(ng, t));
  var tbn: mat3f = mat3f(t, b, ng);
#else // HAS_TANGENTS
  var tbn: mat3f = pbr_vTBN;
#endif

#ifdef HAS_NORMALMAP
  vec3 n = texture(pbr_normalSampler, pbr_vUV).rgb;
  n = normalize(tbn * ((2.0 * n - 1.0) * vec3(pbrMaterial.normalScale, pbrMaterial.normalScale, 1.0)));
#else
  // The tbn matrix is linearly interpolated, so we need to re-normalize
  vec3 n = normalize(tbn[2].xyz);
#endif

  return n;
}

// Calculation of the lighting contribution from an optional Image Based Light source.
// Precomputed Environment Maps are required uniform inputs and are computed as outlined in [1].
// See our README.md on Environment Maps [3] for additional discussion.
#ifdef USE_IBL
fn getIBLContribution(PBRInfo pbrInfo, vec3 n, vec3 reflection) -> vec3f
{
  float mipCount = 9.0; // resolution of 512x512
  float lod = (pbrInfo.perceptualRoughness * mipCount);
  // retrieve a scale and bias to F0. See [1], Figure 3
  vec3 brdf = SRGBtoLINEAR(texture(pbr_brdfLUT,
    vec2(pbrInfo.NdotV, 1.0 - pbrInfo.perceptualRoughness))).rgb;
  vec3 diffuseLight = SRGBtoLINEAR(texture(pbr_diffuseEnvSampler, n)).rgb;

#ifdef USE_TEX_LOD
  vec3 specularLight = SRGBtoLINEAR(texture(pbr_specularEnvSampler, reflection, lod)).rgb;
#else
  vec3 specularLight = SRGBtoLINEAR(texture(pbr_specularEnvSampler, reflection)).rgb;
#endif

  vec3 diffuse = diffuseLight * pbrInfo.diffuseColor;
  vec3 specular = specularLight * (pbrInfo.specularColor * brdf.x + brdf.y);

  // For presentation, this allows us to disable IBL terms
  diffuse *= pbrMaterial.scaleIBLAmbient.x;
  specular *= pbrMaterial.scaleIBLAmbient.y;

  return diffuse + specular;
}
#endif

// Basic Lambertian diffuse
// Implementation from Lambert's Photometria https://archive.org/details/lambertsphotome00lambgoog
// See also [1], Equation 1
fn diffuse(pbrInfo: PBRInfo) -> vec3<f32> {
  return pbrInfo.diffuseColor / PI;
}

// The following equation models the Fresnel reflectance term of the spec equation (aka F())
// Implementation of fresnel from [4], Equation 15
fn specularReflection(pbrInfo: PBRInfo) -> vec3<f32> {
  return pbrInfo.reflectance0 +
    (pbrInfo.reflectance90 - pbrInfo.reflectance0) *
    pow(clamp(1.0 - pbrInfo.VdotH, 0.0, 1.0), 5.0);
}

// This calculates the specular geometric attenuation (aka G()),
// where rougher material will reflect less light back to the viewer.
// This implementation is based on [1] Equation 4, and we adopt their modifications to
// alphaRoughness as input as originally proposed in [2].
fn geometricOcclusion(pbrInfo: PBRInfo) -> f32 {
  let NdotL: f32 = pbrInfo.NdotL;
  let NdotV: f32 = pbrInfo.NdotV;
  let r: f32 = pbrInfo.alphaRoughness;

  let attenuationL = 2.0 * NdotL / (NdotL + sqrt(r * r + (1.0 - r * r) * (NdotL * NdotL)));
  let attenuationV = 2.0 * NdotV / (NdotV + sqrt(r * r + (1.0 - r * r) * (NdotV * NdotV)));
  return attenuationL * attenuationV;
}

// The following equation(s) model the distribution of microfacet normals across
// the area being drawn (aka D())
// Implementation from "Average Irregularity Representation of a Roughened Surface
// for Ray Reflection" by T. S. Trowbridge, and K. P. Reitz
// Follows the distribution function recommended in the SIGGRAPH 2013 course notes
// from EPIC Games [1], Equation 3.
fn microfacetDistribution(pbrInfo: PBRInfo) -> f32 {
  let roughnessSq = pbrInfo.alphaRoughness * pbrInfo.alphaRoughness;
  let f = (pbrInfo.NdotH * roughnessSq - pbrInfo.NdotH) * pbrInfo.NdotH + 1.0;
  return roughnessSq / (PI * f * f);
}

fn PBRInfo_setAmbientLight(pbrInfo: ptr<function, PBRInfo>) {
  (*pbrInfo).NdotL = 1.0;
  (*pbrInfo).NdotH = 0.0;
  (*pbrInfo).LdotH = 0.0;
  (*pbrInfo).VdotH = 1.0;
}

fn PBRInfo_setDirectionalLight(pbrInfo: ptr<function, PBRInfo>, lightDirection: vec3<f32>) {
  let n = (*pbrInfo).n;
  let v = (*pbrInfo).v;
  let l = normalize(lightDirection);             // Vector from surface point to light
  let h = normalize(l + v);                      // Half vector between both l and v

  (*pbrInfo).NdotL = clamp(dot(n, l), 0.001, 1.0);
  (*pbrInfo).NdotH = clamp(dot(n, h), 0.0, 1.0);
  (*pbrInfo).LdotH = clamp(dot(l, h), 0.0, 1.0);
  (*pbrInfo).VdotH = clamp(dot(v, h), 0.0, 1.0);
}

fn PBRInfo_setPointLight(pbrInfo: ptr<function, PBRInfo>, pointLight: PointLight) {
  let light_direction = normalize(pointLight.position - pbr_vPosition);
  PBRInfo_setDirectionalLight(pbrInfo, light_direction);
}

fn calculateFinalColor(pbrInfo: PBRInfo, lightColor: vec3<f32>) -> vec3<f32> {
  // Calculate the shading terms for the microfacet specular shading model
  let F = specularReflection(pbrInfo);
  let G = geometricOcclusion(pbrInfo);
  let D = microfacetDistribution(pbrInfo);

  // Calculation of analytical lighting contribution
  let diffuseContrib = (1.0 - F) * diffuse(pbrInfo);
  let specContrib = F * G * D / (4.0 * pbrInfo.NdotL * pbrInfo.NdotV);
  // Obtain final intensity as reflectance (BRDF) scaled by the energy of the light (cosine law)
  return pbrInfo.NdotL * lightColor * (diffuseContrib + specContrib);
}

fn pbr_filterColor(colorUnused: vec4<f32>) -> vec4<f32> {
  // The albedo may be defined from a base texture or a flat color
  var baseColor: vec4<f32>;
  #ifdef HAS_BASECOLORMAP
  baseColor = SRGBtoLINEAR(textureSample(pbr_baseColorSampler, pbr_baseColorSampler, pbr_vUV)) * pbrMaterial.baseColorFactor;
  #else
  baseColor = pbrMaterial.baseColorFactor;
  #endif

  #ifdef ALPHA_CUTOFF
  if (baseColor.a < pbrMaterial.alphaCutoff) {
    discard;
  }
  #endif

  var color = vec3<f32>(0.0, 0.0, 0.0);

  if (pbrMaterial.unlit) {
    color = baseColor.rgb;
  } else {
    // Metallic and Roughness material properties are packed together
    // In glTF, these factors can be specified by fixed scalar values
    // or from a metallic-roughness map
    var perceptualRoughness = pbrMaterial.metallicRoughnessValues.y;
    var metallic = pbrMaterial.metallicRoughnessValues.x;
    #ifdef HAS_METALROUGHNESSMAP
    // Roughness is stored in the 'g' channel, metallic is stored in the 'b' channel.
    // This layout intentionally reserves the 'r' channel for (optional) occlusion map data
    let mrSample = textureSample(pbr_metallicRoughnessSampler, pbr_metallicRoughnessSampler, pbr_vUV);
    perceptualRoughness = mrSample.g * perceptualRoughness;
    metallic = mrSample.b * metallic;
    #endif
    perceptualRoughness = clamp(perceptualRoughness, c_MinRoughness, 1.0);
    metallic = clamp(metallic, 0.0, 1.0);
    // Roughness is authored as perceptual roughness; as is convention,
    // convert to material roughness by squaring the perceptual roughness [2].
    let alphaRoughness = perceptualRoughness * perceptualRoughness;

    let f0 = vec3<f32>(0.04);
    var diffuseColor = baseColor.rgb * (vec3<f32>(1.0) - f0);
    diffuseColor *= 1.0 - metallic;
    let specularColor = mix(f0, baseColor.rgb, metallic);

    // Compute reflectance.
    let reflectance = max(max(specularColor.r, specularColor.g), specularColor.b);

    // For typical incident reflectance range (between 4% to 100%) set the grazing
    // reflectance to 100% for typical fresnel effect.
    // For very low reflectance range on highly diffuse objects (below 4%),
    // incrementally reduce grazing reflectance to 0%.
    let reflectance90 = clamp(reflectance * 25.0, 0.0, 1.0);
    let specularEnvironmentR0 = specularColor;
    let specularEnvironmentR90 = vec3<f32>(1.0, 1.0, 1.0) * reflectance90;

    let n = getNormal();                          // normal at surface point
    let v = normalize(pbrProjection.camera - pbr_vPosition);  // Vector from surface point to camera

    let NdotV = clamp(abs(dot(n, v)), 0.001, 1.0);
    let reflection = -normalize(reflect(v, n));

    var pbrInfo = PBRInfo(
      0.0, // NdotL
      NdotV,
      0.0, // NdotH
      0.0, // LdotH
      0.0, // VdotH
      perceptualRoughness,
      metallic,
      specularEnvironmentR0,
      specularEnvironmentR90,
      alphaRoughness,
      diffuseColor,
      specularColor,
      n,
      v
    );

    #ifdef USE_LIGHTS
    // Apply ambient light
    PBRInfo_setAmbientLight(&pbrInfo);
    color += calculateFinalColor(pbrInfo, lighting.ambientColor);

    // Apply directional light
    for (var i = 0; i < lighting.directionalLightCount; i++) {
      if (i < lighting.directionalLightCount) {
        PBRInfo_setDirectionalLight(&pbrInfo, lighting_getDirectionalLight(i).direction);
        color += calculateFinalColor(pbrInfo, lighting_getDirectionalLight(i).color);
      }
    }

    // Apply point light
    for (var i = 0; i < lighting.pointLightCount; i++) {
      if (i < lighting.pointLightCount) {
        PBRInfo_setPointLight(&pbrInfo, lighting_getPointLight(i));
        let attenuation = getPointLightAttenuation(lighting_getPointLight(i), distance(lighting_getPointLight(i).position, pbr_vPosition));
        color += calculateFinalColor(pbrInfo, lighting_getPointLight(i).color / attenuation);
      }
    }
    #endif

    // Calculate lighting contribution from image based lighting source (IBL)
    #ifdef USE_IBL
    if (pbrMaterial.IBLenabled) {
      color += getIBLContribution(pbrInfo, n, reflection);
    }
    #endif

    // Apply optional PBR terms for additional (optional) shading
    #ifdef HAS_OCCLUSIONMAP
    if (pbrMaterial.occlusionMapEnabled) {
      let ao = textureSample(pbr_occlusionSampler, pbr_occlusionSampler, pbr_vUV).r;
      color = mix(color, color * ao, pbrMaterial.occlusionStrength);
    }
    #endif

    #ifdef HAS_EMISSIVEMAP
    if (pbrMaterial.emissiveMapEnabled) {
      let emissive = SRGBtoLINEAR(textureSample(pbr_emissiveSampler, pbr_emissiveSampler, pbr_vUV)).rgb * pbrMaterial.emissiveFactor;
      color += emissive;
    }
    #endif

    // This section uses mix to override final color for reference app visualization
    // of various parameters in the lighting equation.
    #ifdef PBR_DEBUG
    // TODO: Figure out how to debug multiple lights

    // color = mix(color, F, pbr_scaleFGDSpec.x);
    // color = mix(color, vec3(G), pbr_scaleFGDSpec.y);
    // color = mix(color, vec3(D), pbr_scaleFGDSpec.z);
    // color = mix(color, specContrib, pbr_scaleFGDSpec.w);

    // color = mix(color, diffuseContrib, pbr_scaleDiffBaseMR.x);
    color = mix(color, baseColor.rgb, pbrMaterial.scaleDiffBaseMR.y);
    color = mix(color, vec3<f32>(metallic), pbrMaterial.scaleDiffBaseMR.z);
    color = mix(color, vec3<f32>(perceptualRoughness), pbrMaterial.scaleDiffBaseMR.w);
    #endif
  }

  return vec4<f32>(pow(color, vec3<f32>(1.0 / 2.2)), baseColor.a);
}
`,vs:`out vec3 pbr_vPosition;
out vec2 pbr_vUV;

#ifdef HAS_NORMALS
# ifdef HAS_TANGENTS
out mat3 pbr_vTBN;
# else
out vec3 pbr_vNormal;
# endif
#endif

void pbr_setPositionNormalTangentUV(vec4 position, vec4 normal, vec4 tangent, vec2 uv)
{
  vec4 pos = pbrProjection.modelMatrix * position;
  pbr_vPosition = vec3(pos.xyz) / pos.w;

#ifdef HAS_NORMALS
#ifdef HAS_TANGENTS
  vec3 normalW = normalize(vec3(pbrProjection.normalMatrix * vec4(normal.xyz, 0.0)));
  vec3 tangentW = normalize(vec3(pbrProjection.modelMatrix * vec4(tangent.xyz, 0.0)));
  vec3 bitangentW = cross(normalW, tangentW) * tangent.w;
  pbr_vTBN = mat3(tangentW, bitangentW, normalW);
#else // HAS_TANGENTS != 1
  pbr_vNormal = normalize(vec3(pbrProjection.modelMatrix * vec4(normal.xyz, 0.0)));
#endif
#endif

#ifdef HAS_UV
  pbr_vUV = uv;
#else
  pbr_vUV = vec2(0.,0.);
#endif
}
`,fs:`precision highp float;

uniform pbrMaterialUniforms {
  // Material is unlit
  bool unlit;

  // Base color map
  bool baseColorMapEnabled;
  vec4 baseColorFactor;

  bool normalMapEnabled;  
  float normalScale; // #ifdef HAS_NORMALMAP

  bool emissiveMapEnabled;
  vec3 emissiveFactor; // #ifdef HAS_EMISSIVEMAP

  vec2 metallicRoughnessValues;
  bool metallicRoughnessMapEnabled;

  bool occlusionMapEnabled;
  float occlusionStrength; // #ifdef HAS_OCCLUSIONMAP
  
  bool alphaCutoffEnabled;
  float alphaCutoff; // #ifdef ALPHA_CUTOFF
  
  // IBL
  bool IBLenabled;
  vec2 scaleIBLAmbient; // #ifdef USE_IBL
  
  // debugging flags used for shader output of intermediate PBR variables
  // #ifdef PBR_DEBUG
  vec4 scaleDiffBaseMR;
  vec4 scaleFGDSpec;
  // #endif
} pbrMaterial;

// Samplers
#ifdef HAS_BASECOLORMAP
uniform sampler2D pbr_baseColorSampler;
#endif
#ifdef HAS_NORMALMAP
uniform sampler2D pbr_normalSampler;
#endif
#ifdef HAS_EMISSIVEMAP
uniform sampler2D pbr_emissiveSampler;
#endif
#ifdef HAS_METALROUGHNESSMAP
uniform sampler2D pbr_metallicRoughnessSampler;
#endif
#ifdef HAS_OCCLUSIONMAP
uniform sampler2D pbr_occlusionSampler;
#endif
#ifdef USE_IBL
uniform samplerCube pbr_diffuseEnvSampler;
uniform samplerCube pbr_specularEnvSampler;
uniform sampler2D pbr_brdfLUT;
#endif

// Inputs from vertex shader

in vec3 pbr_vPosition;
in vec2 pbr_vUV;

#ifdef HAS_NORMALS
#ifdef HAS_TANGENTS
in mat3 pbr_vTBN;
#else
in vec3 pbr_vNormal;
#endif
#endif

// Encapsulate the various inputs used by the various functions in the shading equation
// We store values in this struct to simplify the integration of alternative implementations
// of the shading terms, outlined in the Readme.MD Appendix.
struct PBRInfo {
  float NdotL;                  // cos angle between normal and light direction
  float NdotV;                  // cos angle between normal and view direction
  float NdotH;                  // cos angle between normal and half vector
  float LdotH;                  // cos angle between light direction and half vector
  float VdotH;                  // cos angle between view direction and half vector
  float perceptualRoughness;    // roughness value, as authored by the model creator (input to shader)
  float metalness;              // metallic value at the surface
  vec3 reflectance0;            // full reflectance color (normal incidence angle)
  vec3 reflectance90;           // reflectance color at grazing angle
  float alphaRoughness;         // roughness mapped to a more linear change in the roughness (proposed by [2])
  vec3 diffuseColor;            // color contribution from diffuse lighting
  vec3 specularColor;           // color contribution from specular lighting
  vec3 n;                       // normal at surface point
  vec3 v;                       // vector from surface point to camera
};

const float M_PI = 3.141592653589793;
const float c_MinRoughness = 0.04;

vec4 SRGBtoLINEAR(vec4 srgbIn)
{
#ifdef MANUAL_SRGB
#ifdef SRGB_FAST_APPROXIMATION
  vec3 linOut = pow(srgbIn.xyz,vec3(2.2));
#else // SRGB_FAST_APPROXIMATION
  vec3 bLess = step(vec3(0.04045),srgbIn.xyz);
  vec3 linOut = mix( srgbIn.xyz/vec3(12.92), pow((srgbIn.xyz+vec3(0.055))/vec3(1.055),vec3(2.4)), bLess );
#endif //SRGB_FAST_APPROXIMATION
  return vec4(linOut,srgbIn.w);;
#else //MANUAL_SRGB
  return srgbIn;
#endif //MANUAL_SRGB
}

// Find the normal for this fragment, pulling either from a predefined normal map
// or from the interpolated mesh normal and tangent attributes.
vec3 getNormal()
{
  // Retrieve the tangent space matrix
#ifndef HAS_TANGENTS
  vec3 pos_dx = dFdx(pbr_vPosition);
  vec3 pos_dy = dFdy(pbr_vPosition);
  vec3 tex_dx = dFdx(vec3(pbr_vUV, 0.0));
  vec3 tex_dy = dFdy(vec3(pbr_vUV, 0.0));
  vec3 t = (tex_dy.t * pos_dx - tex_dx.t * pos_dy) / (tex_dx.s * tex_dy.t - tex_dy.s * tex_dx.t);

#ifdef HAS_NORMALS
  vec3 ng = normalize(pbr_vNormal);
#else
  vec3 ng = cross(pos_dx, pos_dy);
#endif

  t = normalize(t - ng * dot(ng, t));
  vec3 b = normalize(cross(ng, t));
  mat3 tbn = mat3(t, b, ng);
#else // HAS_TANGENTS
  mat3 tbn = pbr_vTBN;
#endif

#ifdef HAS_NORMALMAP
  vec3 n = texture(pbr_normalSampler, pbr_vUV).rgb;
  n = normalize(tbn * ((2.0 * n - 1.0) * vec3(pbrMaterial.normalScale, pbrMaterial.normalScale, 1.0)));
#else
  // The tbn matrix is linearly interpolated, so we need to re-normalize
  vec3 n = normalize(tbn[2].xyz);
#endif

  return n;
}

// Calculation of the lighting contribution from an optional Image Based Light source.
// Precomputed Environment Maps are required uniform inputs and are computed as outlined in [1].
// See our README.md on Environment Maps [3] for additional discussion.
#ifdef USE_IBL
vec3 getIBLContribution(PBRInfo pbrInfo, vec3 n, vec3 reflection)
{
  float mipCount = 9.0; // resolution of 512x512
  float lod = (pbrInfo.perceptualRoughness * mipCount);
  // retrieve a scale and bias to F0. See [1], Figure 3
  vec3 brdf = SRGBtoLINEAR(texture(pbr_brdfLUT,
    vec2(pbrInfo.NdotV, 1.0 - pbrInfo.perceptualRoughness))).rgb;
  vec3 diffuseLight = SRGBtoLINEAR(texture(pbr_diffuseEnvSampler, n)).rgb;

#ifdef USE_TEX_LOD
  vec3 specularLight = SRGBtoLINEAR(texture(pbr_specularEnvSampler, reflection, lod)).rgb;
#else
  vec3 specularLight = SRGBtoLINEAR(texture(pbr_specularEnvSampler, reflection)).rgb;
#endif

  vec3 diffuse = diffuseLight * pbrInfo.diffuseColor;
  vec3 specular = specularLight * (pbrInfo.specularColor * brdf.x + brdf.y);

  // For presentation, this allows us to disable IBL terms
  diffuse *= pbrMaterial.scaleIBLAmbient.x;
  specular *= pbrMaterial.scaleIBLAmbient.y;

  return diffuse + specular;
}
#endif

// Basic Lambertian diffuse
// Implementation from Lambert's Photometria https://archive.org/details/lambertsphotome00lambgoog
// See also [1], Equation 1
vec3 diffuse(PBRInfo pbrInfo)
{
  return pbrInfo.diffuseColor / M_PI;
}

// The following equation models the Fresnel reflectance term of the spec equation (aka F())
// Implementation of fresnel from [4], Equation 15
vec3 specularReflection(PBRInfo pbrInfo)
{
  return pbrInfo.reflectance0 +
    (pbrInfo.reflectance90 - pbrInfo.reflectance0) *
    pow(clamp(1.0 - pbrInfo.VdotH, 0.0, 1.0), 5.0);
}

// This calculates the specular geometric attenuation (aka G()),
// where rougher material will reflect less light back to the viewer.
// This implementation is based on [1] Equation 4, and we adopt their modifications to
// alphaRoughness as input as originally proposed in [2].
float geometricOcclusion(PBRInfo pbrInfo)
{
  float NdotL = pbrInfo.NdotL;
  float NdotV = pbrInfo.NdotV;
  float r = pbrInfo.alphaRoughness;

  float attenuationL = 2.0 * NdotL / (NdotL + sqrt(r * r + (1.0 - r * r) * (NdotL * NdotL)));
  float attenuationV = 2.0 * NdotV / (NdotV + sqrt(r * r + (1.0 - r * r) * (NdotV * NdotV)));
  return attenuationL * attenuationV;
}

// The following equation(s) model the distribution of microfacet normals across
// the area being drawn (aka D())
// Implementation from "Average Irregularity Representation of a Roughened Surface
// for Ray Reflection" by T. S. Trowbridge, and K. P. Reitz
// Follows the distribution function recommended in the SIGGRAPH 2013 course notes
// from EPIC Games [1], Equation 3.
float microfacetDistribution(PBRInfo pbrInfo)
{
  float roughnessSq = pbrInfo.alphaRoughness * pbrInfo.alphaRoughness;
  float f = (pbrInfo.NdotH * roughnessSq - pbrInfo.NdotH) * pbrInfo.NdotH + 1.0;
  return roughnessSq / (M_PI * f * f);
}

void PBRInfo_setAmbientLight(inout PBRInfo pbrInfo) {
  pbrInfo.NdotL = 1.0;
  pbrInfo.NdotH = 0.0;
  pbrInfo.LdotH = 0.0;
  pbrInfo.VdotH = 1.0;
}

void PBRInfo_setDirectionalLight(inout PBRInfo pbrInfo, vec3 lightDirection) {
  vec3 n = pbrInfo.n;
  vec3 v = pbrInfo.v;
  vec3 l = normalize(lightDirection);             // Vector from surface point to light
  vec3 h = normalize(l+v);                        // Half vector between both l and v

  pbrInfo.NdotL = clamp(dot(n, l), 0.001, 1.0);
  pbrInfo.NdotH = clamp(dot(n, h), 0.0, 1.0);
  pbrInfo.LdotH = clamp(dot(l, h), 0.0, 1.0);
  pbrInfo.VdotH = clamp(dot(v, h), 0.0, 1.0);
}

void PBRInfo_setPointLight(inout PBRInfo pbrInfo, PointLight pointLight) {
  vec3 light_direction = normalize(pointLight.position - pbr_vPosition);
  PBRInfo_setDirectionalLight(pbrInfo, light_direction);
}

vec3 calculateFinalColor(PBRInfo pbrInfo, vec3 lightColor) {
  // Calculate the shading terms for the microfacet specular shading model
  vec3 F = specularReflection(pbrInfo);
  float G = geometricOcclusion(pbrInfo);
  float D = microfacetDistribution(pbrInfo);

  // Calculation of analytical lighting contribution
  vec3 diffuseContrib = (1.0 - F) * diffuse(pbrInfo);
  vec3 specContrib = F * G * D / (4.0 * pbrInfo.NdotL * pbrInfo.NdotV);
  // Obtain final intensity as reflectance (BRDF) scaled by the energy of the light (cosine law)
  return pbrInfo.NdotL * lightColor * (diffuseContrib + specContrib);
}

vec4 pbr_filterColor(vec4 colorUnused)
{
  // The albedo may be defined from a base texture or a flat color
#ifdef HAS_BASECOLORMAP
  vec4 baseColor = SRGBtoLINEAR(texture(pbr_baseColorSampler, pbr_vUV)) * pbrMaterial.baseColorFactor;
#else
  vec4 baseColor = pbrMaterial.baseColorFactor;
#endif

#ifdef ALPHA_CUTOFF
  if (baseColor.a < pbrMaterial.alphaCutoff) {
    discard;
  }
#endif

  vec3 color = vec3(0, 0, 0);

  if(pbrMaterial.unlit){
    color.rgb = baseColor.rgb;
  }
  else{
    // Metallic and Roughness material properties are packed together
    // In glTF, these factors can be specified by fixed scalar values
    // or from a metallic-roughness map
    float perceptualRoughness = pbrMaterial.metallicRoughnessValues.y;
    float metallic = pbrMaterial.metallicRoughnessValues.x;
#ifdef HAS_METALROUGHNESSMAP
    // Roughness is stored in the 'g' channel, metallic is stored in the 'b' channel.
    // This layout intentionally reserves the 'r' channel for (optional) occlusion map data
    vec4 mrSample = texture(pbr_metallicRoughnessSampler, pbr_vUV);
    perceptualRoughness = mrSample.g * perceptualRoughness;
    metallic = mrSample.b * metallic;
#endif
    perceptualRoughness = clamp(perceptualRoughness, c_MinRoughness, 1.0);
    metallic = clamp(metallic, 0.0, 1.0);
    // Roughness is authored as perceptual roughness; as is convention,
    // convert to material roughness by squaring the perceptual roughness [2].
    float alphaRoughness = perceptualRoughness * perceptualRoughness;

    vec3 f0 = vec3(0.04);
    vec3 diffuseColor = baseColor.rgb * (vec3(1.0) - f0);
    diffuseColor *= 1.0 - metallic;
    vec3 specularColor = mix(f0, baseColor.rgb, metallic);

    // Compute reflectance.
    float reflectance = max(max(specularColor.r, specularColor.g), specularColor.b);

    // For typical incident reflectance range (between 4% to 100%) set the grazing
    // reflectance to 100% for typical fresnel effect.
    // For very low reflectance range on highly diffuse objects (below 4%),
    // incrementally reduce grazing reflecance to 0%.
    float reflectance90 = clamp(reflectance * 25.0, 0.0, 1.0);
    vec3 specularEnvironmentR0 = specularColor.rgb;
    vec3 specularEnvironmentR90 = vec3(1.0, 1.0, 1.0) * reflectance90;

    vec3 n = getNormal();                          // normal at surface point
    vec3 v = normalize(pbrProjection.camera - pbr_vPosition);  // Vector from surface point to camera

    float NdotV = clamp(abs(dot(n, v)), 0.001, 1.0);
    vec3 reflection = -normalize(reflect(v, n));

    PBRInfo pbrInfo = PBRInfo(
      0.0, // NdotL
      NdotV,
      0.0, // NdotH
      0.0, // LdotH
      0.0, // VdotH
      perceptualRoughness,
      metallic,
      specularEnvironmentR0,
      specularEnvironmentR90,
      alphaRoughness,
      diffuseColor,
      specularColor,
      n,
      v
    );


#ifdef USE_LIGHTS
    // Apply ambient light
    PBRInfo_setAmbientLight(pbrInfo);
    color += calculateFinalColor(pbrInfo, lighting.ambientColor);

    // Apply directional light
    for(int i = 0; i < lighting.directionalLightCount; i++) {
      if (i < lighting.directionalLightCount) {
        PBRInfo_setDirectionalLight(pbrInfo, lighting_getDirectionalLight(i).direction);
        color += calculateFinalColor(pbrInfo, lighting_getDirectionalLight(i).color);
      }
    }

    // Apply point light
    for(int i = 0; i < lighting.pointLightCount; i++) {
      if (i < lighting.pointLightCount) {
        PBRInfo_setPointLight(pbrInfo, lighting_getPointLight(i));
        float attenuation = getPointLightAttenuation(lighting_getPointLight(i), distance(lighting_getPointLight(i).position, pbr_vPosition));
        color += calculateFinalColor(pbrInfo, lighting_getPointLight(i).color / attenuation);
      }
    }
#endif

    // Calculate lighting contribution from image based lighting source (IBL)
#ifdef USE_IBL
    if (pbrMaterial.IBLenabled) {
      color += getIBLContribution(pbrInfo, n, reflection);
    }
#endif

 // Apply optional PBR terms for additional (optional) shading
#ifdef HAS_OCCLUSIONMAP
    if (pbrMaterial.occlusionMapEnabled) {
      float ao = texture(pbr_occlusionSampler, pbr_vUV).r;
      color = mix(color, color * ao, pbrMaterial.occlusionStrength);
    }
#endif

#ifdef HAS_EMISSIVEMAP
    if (pbrMaterial.emissiveMapEnabled) {
      vec3 emissive = SRGBtoLINEAR(texture(pbr_emissiveSampler, pbr_vUV)).rgb * pbrMaterial.emissiveFactor;
      color += emissive;
    }
#endif

    // This section uses mix to override final color for reference app visualization
    // of various parameters in the lighting equation.
#ifdef PBR_DEBUG
    // TODO: Figure out how to debug multiple lights

    // color = mix(color, F, pbr_scaleFGDSpec.x);
    // color = mix(color, vec3(G), pbr_scaleFGDSpec.y);
    // color = mix(color, vec3(D), pbr_scaleFGDSpec.z);
    // color = mix(color, specContrib, pbr_scaleFGDSpec.w);

    // color = mix(color, diffuseContrib, pbr_scaleDiffBaseMR.x);
    color = mix(color, baseColor.rgb, pbrMaterial.scaleDiffBaseMR.y);
    color = mix(color, vec3(metallic), pbrMaterial.scaleDiffBaseMR.z);
    color = mix(color, vec3(perceptualRoughness), pbrMaterial.scaleDiffBaseMR.w);
#endif

  }

  return vec4(pow(color,vec3(1.0/2.2)), baseColor.a);
}
`,defines:{LIGHTING_FRAGMENT:!0,HAS_NORMALMAP:!1,HAS_EMISSIVEMAP:!1,HAS_OCCLUSIONMAP:!1,HAS_BASECOLORMAP:!1,HAS_METALROUGHNESSMAP:!1,ALPHA_CUTOFF:!1,USE_IBL:!1,PBR_DEBUG:!1},getUniforms:e=>e,uniformTypes:{unlit:"i32",baseColorMapEnabled:"i32",baseColorFactor:"vec4<f32>",normalMapEnabled:"i32",normalScale:"f32",emissiveMapEnabled:"i32",emissiveFactor:"vec3<f32>",metallicRoughnessValues:"vec2<f32>",metallicRoughnessMapEnabled:"i32",occlusionMapEnabled:"i32",occlusionStrength:"f32",alphaCutoffEnabled:"i32",alphaCutoff:"f32",IBLenabled:"i32",scaleIBLAmbient:"vec2<f32>",scaleDiffBaseMR:"vec4<f32>",scaleFGDSpec:"vec4<f32>"}}},6049:function(e){var t,r,i,n,s,o,a,l,u,c,h,f=Object.defineProperty,d=Object.getOwnPropertyDescriptor,p=Object.getOwnPropertyNames,g=Object.prototype.hasOwnProperty,_=(e,t)=>{for(var r in t)f(e,r,{get:t[r],enumerable:!0})},m={};_(m,{Euler:()=>nb,Matrix3:()=>ri,Matrix4:()=>iG,Pose:()=>nA,Quaternion:()=>nm,SphericalCoordinates:()=>nE,Vector2:()=>eV,Vector3:()=>tw,Vector4:()=>tN,_Euler:()=>nb,_MathUtils:()=>ny,_Pose:()=>nA,_SphericalCoordinates:()=>nE,acos:()=>P,asin:()=>O,assert:()=>V,atan:()=>L,clamp:()=>F,clone:()=>R,config:()=>b,configure:()=>A,cos:()=>w,degrees:()=>C,equals:()=>B,exactEquals:()=>function e(t,r){if(t===r)return!0;if(t&&"object"==typeof t&&r&&"object"==typeof r){if(t.constructor!==r.constructor)return!1;if(t.exactEquals)return t.exactEquals(r)}if(T(t)&&T(r)){if(t.length!==r.length)return!1;for(let i=0;i<t.length;++i)if(!e(t[i],r[i]))return!1;return!0}return!1},formatValue:()=>y,isArray:()=>T,lerp:()=>function e(t,r,i){return T(t)?t.map((t,n)=>e(t,r[n],i)):i*r+(1-i)*t},mat3:()=>tP,mat4:()=>rs,quat:()=>iV,radians:()=>I,sin:()=>x,tan:()=>N,toDegrees:()=>M,toRadians:()=>S,vec2:()=>j,vec3:()=>ez,vec4:()=>r4,withEpsilon:()=>D}),e.exports=((e,t,r,i)=>{if(t&&"object"==typeof t||"function"==typeof t)for(let n of p(t))g.call(e,n)||n===r||f(e,n,{get:()=>t[n],enumerable:!(i=d(t,n))||i.enumerable});return e})(f({},"__esModule",{value:!0}),m);var E=1/Math.PI*180,v=1/180*Math.PI;globalThis.mathgl=globalThis.mathgl||{config:{EPSILON:1e-12,debug:!1,precision:4,printTypes:!1,printDegrees:!1,printRowMajor:!0,_cartographicRadians:!1}};var b=globalThis.mathgl.config;function A(e){return Object.assign(b,e),b}function y(e,{precision:t=b.precision}={}){return e=Math.round(e/b.EPSILON)*b.EPSILON,`${parseFloat(e.toPrecision(t))}`}function T(e){return Array.isArray(e)||ArrayBuffer.isView(e)&&!(e instanceof DataView)}function R(e){return"clone"in e?e.clone():e.slice()}function S(e){return I(e)}function M(e){return C(e)}function I(e,t){return U(e,e=>e*v,t)}function C(e,t){return U(e,e=>e*E,t)}function x(e,t){return U(e,e=>Math.sin(e),t)}function w(e,t){return U(e,e=>Math.cos(e),t)}function N(e,t){return U(e,e=>Math.tan(e),t)}function O(e,t){return U(e,e=>Math.asin(e),t)}function P(e,t){return U(e,e=>Math.acos(e),t)}function L(e,t){return U(e,e=>Math.atan(e),t)}function F(e,t,r){return U(e,e=>Math.max(t,Math.min(r,e)))}function B(e,t,r){let i=b.EPSILON;r&&(b.EPSILON=r);try{if(e===t)return!0;if(T(e)&&T(t)){if(e.length!==t.length)return!1;for(let r=0;r<e.length;++r)if(!B(e[r],t[r]))return!1;return!0}if(e&&e.equals)return e.equals(t);if(t&&t.equals)return t.equals(e);if("number"==typeof e&&"number"==typeof t)return Math.abs(e-t)<=b.EPSILON*Math.max(1,Math.abs(e),Math.abs(t));return!1}finally{b.EPSILON=i}}function D(e,t){let r;let i=b.EPSILON;b.EPSILON=e;try{r=t()}finally{b.EPSILON=i}return r}function U(e,t,r){if(T(e)){r=r||(e.clone?e.clone():Array(e.length));for(let i=0;i<r.length&&i<e.length;++i){let n="number"==typeof e?e:e[i];r[i]=t(n,i,r)}return r}return t(e)}var k=class extends Array{clone(){return new this.constructor().copy(this)}fromArray(e,t=0){for(let r=0;r<this.ELEMENTS;++r)this[r]=e[r+t];return this.check()}toArray(e=[],t=0){for(let r=0;r<this.ELEMENTS;++r)e[t+r]=this[r];return e}toObject(e){return e}from(e){return Array.isArray(e)?this.copy(e):this.fromObject(e)}to(e){return e===this?this:T(e)?this.toArray(e):this.toObject(e)}toTarget(e){return e?this.to(e):this}toFloat32Array(){return new Float32Array(this)}toString(){return this.formatString(b)}formatString(e){let t="";for(let r=0;r<this.ELEMENTS;++r)t+=(r>0?", ":"")+y(this[r],e);return`${e.printTypes?this.constructor.name:""}[${t}]`}equals(e){if(!e||this.length!==e.length)return!1;for(let t=0;t<this.ELEMENTS;++t)if(!B(this[t],e[t]))return!1;return!0}exactEquals(e){if(!e||this.length!==e.length)return!1;for(let t=0;t<this.ELEMENTS;++t)if(this[t]!==e[t])return!1;return!0}negate(){for(let e=0;e<this.ELEMENTS;++e)this[e]=-this[e];return this.check()}lerp(e,t,r){if(void 0===r)return this.lerp(this,e,t);for(let i=0;i<this.ELEMENTS;++i){let n=e[i],s="number"==typeof t?t:t[i];this[i]=n+r*(s-n)}return this.check()}min(e){for(let t=0;t<this.ELEMENTS;++t)this[t]=Math.min(e[t],this[t]);return this.check()}max(e){for(let t=0;t<this.ELEMENTS;++t)this[t]=Math.max(e[t],this[t]);return this.check()}clamp(e,t){for(let r=0;r<this.ELEMENTS;++r)this[r]=Math.min(Math.max(this[r],e[r]),t[r]);return this.check()}add(...e){for(let t of e)for(let e=0;e<this.ELEMENTS;++e)this[e]+=t[e];return this.check()}subtract(...e){for(let t of e)for(let e=0;e<this.ELEMENTS;++e)this[e]-=t[e];return this.check()}scale(e){if("number"==typeof e)for(let t=0;t<this.ELEMENTS;++t)this[t]*=e;else for(let t=0;t<this.ELEMENTS&&t<e.length;++t)this[t]*=e[t];return this.check()}multiplyByScalar(e){for(let t=0;t<this.ELEMENTS;++t)this[t]*=e;return this.check()}check(){if(b.debug&&!this.validate())throw Error(`math.gl: ${this.constructor.name} some fields set to invalid numbers'`);return this}validate(){let e=this.length===this.ELEMENTS;for(let t=0;t<this.ELEMENTS;++t)e=e&&Number.isFinite(this[t]);return e}sub(e){return this.subtract(e)}setScalar(e){for(let t=0;t<this.ELEMENTS;++t)this[t]=e;return this.check()}addScalar(e){for(let t=0;t<this.ELEMENTS;++t)this[t]+=e;return this.check()}subScalar(e){return this.addScalar(-e)}multiplyScalar(e){for(let t=0;t<this.ELEMENTS;++t)this[t]*=e;return this.check()}divideScalar(e){return this.multiplyByScalar(1/e)}clampScalar(e,t){for(let r=0;r<this.ELEMENTS;++r)this[r]=Math.min(Math.max(this[r],e),t);return this.check()}get elements(){return this}};function G(e){if(!Number.isFinite(e))throw Error(`Invalid number ${JSON.stringify(e)}`);return e}function H(e,t,r=""){if(b.debug&&!function(e,t){if(e.length!==t)return!1;for(let t=0;t<e.length;++t)if(!Number.isFinite(e[t]))return!1;return!0}(e,t))throw Error(`math.gl: ${r} some fields set to invalid numbers'`);return e}function V(e,t){if(!e)throw Error(`math.gl assertion ${t}`)}var z=class extends k{get x(){return this[0]}set x(e){this[0]=G(e)}get y(){return this[1]}set y(e){this[1]=G(e)}len(){return Math.sqrt(this.lengthSquared())}magnitude(){return this.len()}lengthSquared(){let e=0;for(let t=0;t<this.ELEMENTS;++t)e+=this[t]*this[t];return e}magnitudeSquared(){return this.lengthSquared()}distance(e){return Math.sqrt(this.distanceSquared(e))}distanceSquared(e){let t=0;for(let r=0;r<this.ELEMENTS;++r){let i=this[r]-e[r];t+=i*i}return G(t)}dot(e){let t=0;for(let r=0;r<this.ELEMENTS;++r)t+=this[r]*e[r];return G(t)}normalize(){let e=this.magnitude();if(0!==e)for(let t=0;t<this.ELEMENTS;++t)this[t]/=e;return this.check()}multiply(...e){for(let t of e)for(let e=0;e<this.ELEMENTS;++e)this[e]*=t[e];return this.check()}divide(...e){for(let t of e)for(let e=0;e<this.ELEMENTS;++e)this[e]/=t[e];return this.check()}lengthSq(){return this.lengthSquared()}distanceTo(e){return this.distance(e)}distanceToSquared(e){return this.distanceSquared(e)}getComponent(e){return V(e>=0&&e<this.ELEMENTS,"index is out of range"),G(this[e])}setComponent(e,t){return V(e>=0&&e<this.ELEMENTS,"index is out of range"),this[e]=t,this.check()}addVectors(e,t){return this.copy(e).add(t)}subVectors(e,t){return this.copy(e).subtract(t)}multiplyVectors(e,t){return this.copy(e).multiply(t)}addScaledVector(e,t){return this.add(new this.constructor(e).multiplyScalar(t))}},j={};_(j,{add:()=>J,angle:()=>eM,ceil:()=>ei,clone:()=>Y,copy:()=>K,create:()=>q,cross:()=>eE,dist:()=>eF,distance:()=>ec,div:()=>eL,divide:()=>er,dot:()=>em,equals:()=>ew,exactEquals:()=>ex,floor:()=>en,forEach:()=>eU,fromValues:()=>Z,inverse:()=>eg,len:()=>eN,length:()=>ef,lerp:()=>ev,max:()=>eo,min:()=>es,mul:()=>eP,multiply:()=>et,negate:()=>ep,normalize:()=>e_,random:()=>eb,rotate:()=>eS,round:()=>ea,scale:()=>el,scaleAndAdd:()=>eu,set:()=>Q,sqrDist:()=>eB,sqrLen:()=>eD,squaredDistance:()=>eh,squaredLength:()=>ed,str:()=>eC,sub:()=>eO,subtract:()=>ee,transformMat2:()=>eA,transformMat2d:()=>ey,transformMat3:()=>eT,transformMat4:()=>eR,zero:()=>eI});var W="undefined"!=typeof Float32Array?Float32Array:Array,X=Math.random;function $(e){return e>=0?Math.round(e):e%.5==0?Math.floor(e):Math.round(e)}function q(){let e=new W(2);return W!=Float32Array&&(e[0]=0,e[1]=0),e}function Y(e){let t=new W(2);return t[0]=e[0],t[1]=e[1],t}function Z(e,t){let r=new W(2);return r[0]=e,r[1]=t,r}function K(e,t){return e[0]=t[0],e[1]=t[1],e}function Q(e,t,r){return e[0]=t,e[1]=r,e}function J(e,t,r){return e[0]=t[0]+r[0],e[1]=t[1]+r[1],e}function ee(e,t,r){return e[0]=t[0]-r[0],e[1]=t[1]-r[1],e}function et(e,t,r){return e[0]=t[0]*r[0],e[1]=t[1]*r[1],e}function er(e,t,r){return e[0]=t[0]/r[0],e[1]=t[1]/r[1],e}function ei(e,t){return e[0]=Math.ceil(t[0]),e[1]=Math.ceil(t[1]),e}function en(e,t){return e[0]=Math.floor(t[0]),e[1]=Math.floor(t[1]),e}function es(e,t,r){return e[0]=Math.min(t[0],r[0]),e[1]=Math.min(t[1],r[1]),e}function eo(e,t,r){return e[0]=Math.max(t[0],r[0]),e[1]=Math.max(t[1],r[1]),e}function ea(e,t){return e[0]=$(t[0]),e[1]=$(t[1]),e}function el(e,t,r){return e[0]=t[0]*r,e[1]=t[1]*r,e}function eu(e,t,r,i){return e[0]=t[0]+r[0]*i,e[1]=t[1]+r[1]*i,e}function ec(e,t){let r=t[0]-e[0],i=t[1]-e[1];return Math.sqrt(r*r+i*i)}function eh(e,t){let r=t[0]-e[0],i=t[1]-e[1];return r*r+i*i}function ef(e){let t=e[0],r=e[1];return Math.sqrt(t*t+r*r)}function ed(e){let t=e[0],r=e[1];return t*t+r*r}function ep(e,t){return e[0]=-t[0],e[1]=-t[1],e}function eg(e,t){return e[0]=1/t[0],e[1]=1/t[1],e}function e_(e,t){let r=t[0],i=t[1],n=r*r+i*i;return n>0&&(n=1/Math.sqrt(n)),e[0]=t[0]*n,e[1]=t[1]*n,e}function em(e,t){return e[0]*t[0]+e[1]*t[1]}function eE(e,t,r){let i=t[0]*r[1]-t[1]*r[0];return e[0]=e[1]=0,e[2]=i,e}function ev(e,t,r,i){let n=t[0],s=t[1];return e[0]=n+i*(r[0]-n),e[1]=s+i*(r[1]-s),e}function eb(e,t){t=void 0===t?1:t;let r=2*X()*Math.PI;return e[0]=Math.cos(r)*t,e[1]=Math.sin(r)*t,e}function eA(e,t,r){let i=t[0],n=t[1];return e[0]=r[0]*i+r[2]*n,e[1]=r[1]*i+r[3]*n,e}function ey(e,t,r){let i=t[0],n=t[1];return e[0]=r[0]*i+r[2]*n+r[4],e[1]=r[1]*i+r[3]*n+r[5],e}function eT(e,t,r){let i=t[0],n=t[1];return e[0]=r[0]*i+r[3]*n+r[6],e[1]=r[1]*i+r[4]*n+r[7],e}function eR(e,t,r){let i=t[0],n=t[1];return e[0]=r[0]*i+r[4]*n+r[12],e[1]=r[1]*i+r[5]*n+r[13],e}function eS(e,t,r,i){let n=t[0]-r[0],s=t[1]-r[1],o=Math.sin(i),a=Math.cos(i);return e[0]=n*a-s*o+r[0],e[1]=n*o+s*a+r[1],e}function eM(e,t){let r=e[0],i=e[1],n=t[0],s=t[1],o=Math.sqrt((r*r+i*i)*(n*n+s*s));return Math.acos(Math.min(Math.max(o&&(r*n+i*s)/o,-1),1))}function eI(e){return e[0]=0,e[1]=0,e}function eC(e){return`vec2(${e[0]}, ${e[1]})`}function ex(e,t){return e[0]===t[0]&&e[1]===t[1]}function ew(e,t){let r=e[0],i=e[1],n=t[0],s=t[1];return Math.abs(r-n)<=1e-6*Math.max(1,Math.abs(r),Math.abs(n))&&Math.abs(i-s)<=1e-6*Math.max(1,Math.abs(i),Math.abs(s))}var eN=ef,eO=ee,eP=et,eL=er,eF=ec,eB=eh,eD=ed,eU=function(){let e=q();return function(t,r,i,n,s,o){let a,l;for(r||(r=2),i||(i=0),l=n?Math.min(n*r+i,t.length):t.length,a=i;a<l;a+=r)e[0]=t[a],e[1]=t[a+1],s(e,e,o),t[a]=e[0],t[a+1]=e[1];return t}}();function ek(e,t,r){let i=t[0],n=t[1],s=r[3]*i+r[7]*n||1;return e[0]=(r[0]*i+r[4]*n)/s,e[1]=(r[1]*i+r[5]*n)/s,e}function eG(e,t,r){let i=t[0],n=t[1],s=t[2],o=r[3]*i+r[7]*n+r[11]*s||1;return e[0]=(r[0]*i+r[4]*n+r[8]*s)/o,e[1]=(r[1]*i+r[5]*n+r[9]*s)/o,e[2]=(r[2]*i+r[6]*n+r[10]*s)/o,e}function eH(e,t,r){let i=t[0],n=t[1],s=t[2];return e[0]=r[0]*i+r[3]*n+r[6]*s,e[1]=r[1]*i+r[4]*n+r[7]*s,e[2]=r[2]*i+r[5]*n+r[8]*s,e[3]=t[3],e}var eV=class extends z{constructor(e=0,t=0){super(2),T(e)&&1==arguments.length?this.copy(e):(b.debug&&(G(e),G(t)),this[0]=e,this[1]=t)}set(e,t){return this[0]=e,this[1]=t,this.check()}copy(e){return this[0]=e[0],this[1]=e[1],this.check()}fromObject(e){return b.debug&&(G(e.x),G(e.y)),this[0]=e.x,this[1]=e.y,this.check()}toObject(e){return e.x=this[0],e.y=this[1],e}get ELEMENTS(){return 2}horizontalAngle(){return Math.atan2(this.y,this.x)}verticalAngle(){return Math.atan2(this.x,this.y)}transform(e){return this.transformAsPoint(e)}transformAsPoint(e){return eR(this,this,e),this.check()}transformAsVector(e){return ek(this,this,e),this.check()}transformByMatrix3(e){return eT(this,this,e),this.check()}transformByMatrix2x3(e){return ey(this,this,e),this.check()}transformByMatrix2(e){return eA(this,this,e),this.check()}},ez={};function ej(){let e=new W(3);return W!=Float32Array&&(e[0]=0,e[1]=0,e[2]=0),e}function eW(e){let t=new W(3);return t[0]=e[0],t[1]=e[1],t[2]=e[2],t}function eX(e){let t=e[0],r=e[1],i=e[2];return Math.sqrt(t*t+r*r+i*i)}function e$(e,t,r){let i=new W(3);return i[0]=e,i[1]=t,i[2]=r,i}function eq(e,t){return e[0]=t[0],e[1]=t[1],e[2]=t[2],e}function eY(e,t,r,i){return e[0]=t,e[1]=r,e[2]=i,e}function eZ(e,t,r){return e[0]=t[0]+r[0],e[1]=t[1]+r[1],e[2]=t[2]+r[2],e}function eK(e,t,r){return e[0]=t[0]-r[0],e[1]=t[1]-r[1],e[2]=t[2]-r[2],e}function eQ(e,t,r){return e[0]=t[0]*r[0],e[1]=t[1]*r[1],e[2]=t[2]*r[2],e}function eJ(e,t,r){return e[0]=t[0]/r[0],e[1]=t[1]/r[1],e[2]=t[2]/r[2],e}function e0(e,t){return e[0]=Math.ceil(t[0]),e[1]=Math.ceil(t[1]),e[2]=Math.ceil(t[2]),e}function e1(e,t){return e[0]=Math.floor(t[0]),e[1]=Math.floor(t[1]),e[2]=Math.floor(t[2]),e}function e2(e,t,r){return e[0]=Math.min(t[0],r[0]),e[1]=Math.min(t[1],r[1]),e[2]=Math.min(t[2],r[2]),e}function e3(e,t,r){return e[0]=Math.max(t[0],r[0]),e[1]=Math.max(t[1],r[1]),e[2]=Math.max(t[2],r[2]),e}function e4(e,t){return e[0]=$(t[0]),e[1]=$(t[1]),e[2]=$(t[2]),e}function e6(e,t,r){return e[0]=t[0]*r,e[1]=t[1]*r,e[2]=t[2]*r,e}function e5(e,t,r,i){return e[0]=t[0]+r[0]*i,e[1]=t[1]+r[1]*i,e[2]=t[2]+r[2]*i,e}function e8(e,t){let r=t[0]-e[0],i=t[1]-e[1],n=t[2]-e[2];return Math.sqrt(r*r+i*i+n*n)}function e7(e,t){let r=t[0]-e[0],i=t[1]-e[1],n=t[2]-e[2];return r*r+i*i+n*n}function e9(e){let t=e[0],r=e[1],i=e[2];return t*t+r*r+i*i}function te(e,t){return e[0]=-t[0],e[1]=-t[1],e[2]=-t[2],e}function tt(e,t){return e[0]=1/t[0],e[1]=1/t[1],e[2]=1/t[2],e}function tr(e,t){let r=t[0],i=t[1],n=t[2],s=r*r+i*i+n*n;return s>0&&(s=1/Math.sqrt(s)),e[0]=t[0]*s,e[1]=t[1]*s,e[2]=t[2]*s,e}function ti(e,t){return e[0]*t[0]+e[1]*t[1]+e[2]*t[2]}function tn(e,t,r){let i=t[0],n=t[1],s=t[2],o=r[0],a=r[1],l=r[2];return e[0]=n*l-s*a,e[1]=s*o-i*l,e[2]=i*a-n*o,e}function ts(e,t,r,i){let n=t[0],s=t[1],o=t[2];return e[0]=n+i*(r[0]-n),e[1]=s+i*(r[1]-s),e[2]=o+i*(r[2]-o),e}function to(e,t,r,i){let n=Math.acos(Math.min(Math.max(ti(t,r),-1),1)),s=Math.sin(n),o=Math.sin((1-i)*n)/s,a=Math.sin(i*n)/s;return e[0]=o*t[0]+a*r[0],e[1]=o*t[1]+a*r[1],e[2]=o*t[2]+a*r[2],e}function ta(e,t,r,i,n,s){let o=s*s,a=o*(2*s-3)+1,l=o*(s-2)+s,u=o*(s-1),c=o*(3-2*s);return e[0]=t[0]*a+r[0]*l+i[0]*u+n[0]*c,e[1]=t[1]*a+r[1]*l+i[1]*u+n[1]*c,e[2]=t[2]*a+r[2]*l+i[2]*u+n[2]*c,e}function tl(e,t,r,i,n,s){let o=1-s,a=o*o,l=s*s,u=a*o,c=3*s*a,h=3*l*o,f=l*s;return e[0]=t[0]*u+r[0]*c+i[0]*h+n[0]*f,e[1]=t[1]*u+r[1]*c+i[1]*h+n[1]*f,e[2]=t[2]*u+r[2]*c+i[2]*h+n[2]*f,e}function tu(e,t){t=void 0===t?1:t;let r=2*X()*Math.PI,i=2*X()-1,n=Math.sqrt(1-i*i)*t;return e[0]=Math.cos(r)*n,e[1]=Math.sin(r)*n,e[2]=i*t,e}function tc(e,t,r){let i=t[0],n=t[1],s=t[2],o=r[3]*i+r[7]*n+r[11]*s+r[15];return o=o||1,e[0]=(r[0]*i+r[4]*n+r[8]*s+r[12])/o,e[1]=(r[1]*i+r[5]*n+r[9]*s+r[13])/o,e[2]=(r[2]*i+r[6]*n+r[10]*s+r[14])/o,e}function th(e,t,r){let i=t[0],n=t[1],s=t[2];return e[0]=i*r[0]+n*r[3]+s*r[6],e[1]=i*r[1]+n*r[4]+s*r[7],e[2]=i*r[2]+n*r[5]+s*r[8],e}function tf(e,t,r){let i=r[0],n=r[1],s=r[2],o=r[3],a=t[0],l=t[1],u=t[2],c=n*u-s*l,h=s*a-i*u,f=i*l-n*a,d=n*f-s*h,p=s*c-i*f,g=i*h-n*c,_=2*o;return c*=_,h*=_,f*=_,d*=2,p*=2,g*=2,e[0]=a+c+d,e[1]=l+h+p,e[2]=u+f+g,e}function td(e,t,r,i){let n=[],s=[];return n[0]=t[0]-r[0],n[1]=t[1]-r[1],n[2]=t[2]-r[2],s[0]=n[0],s[1]=n[1]*Math.cos(i)-n[2]*Math.sin(i),s[2]=n[1]*Math.sin(i)+n[2]*Math.cos(i),e[0]=s[0]+r[0],e[1]=s[1]+r[1],e[2]=s[2]+r[2],e}function tp(e,t,r,i){let n=[],s=[];return n[0]=t[0]-r[0],n[1]=t[1]-r[1],n[2]=t[2]-r[2],s[0]=n[2]*Math.sin(i)+n[0]*Math.cos(i),s[1]=n[1],s[2]=n[2]*Math.cos(i)-n[0]*Math.sin(i),e[0]=s[0]+r[0],e[1]=s[1]+r[1],e[2]=s[2]+r[2],e}function tg(e,t,r,i){let n=[],s=[];return n[0]=t[0]-r[0],n[1]=t[1]-r[1],n[2]=t[2]-r[2],s[0]=n[0]*Math.cos(i)-n[1]*Math.sin(i),s[1]=n[0]*Math.sin(i)+n[1]*Math.cos(i),s[2]=n[2],e[0]=s[0]+r[0],e[1]=s[1]+r[1],e[2]=s[2]+r[2],e}function t_(e,t){let r=e[0],i=e[1],n=e[2],s=t[0],o=t[1],a=t[2],l=Math.sqrt((r*r+i*i+n*n)*(s*s+o*o+a*a));return Math.acos(Math.min(Math.max(l&&ti(e,t)/l,-1),1))}function tm(e){return e[0]=0,e[1]=0,e[2]=0,e}function tE(e){return`vec3(${e[0]}, ${e[1]}, ${e[2]})`}function tv(e,t){return e[0]===t[0]&&e[1]===t[1]&&e[2]===t[2]}function tb(e,t){let r=e[0],i=e[1],n=e[2],s=t[0],o=t[1],a=t[2];return Math.abs(r-s)<=1e-6*Math.max(1,Math.abs(r),Math.abs(s))&&Math.abs(i-o)<=1e-6*Math.max(1,Math.abs(i),Math.abs(o))&&Math.abs(n-a)<=1e-6*Math.max(1,Math.abs(n),Math.abs(a))}_(ez,{add:()=>eZ,angle:()=>t_,bezier:()=>tl,ceil:()=>e0,clone:()=>eW,copy:()=>eq,create:()=>ej,cross:()=>tn,dist:()=>tR,distance:()=>e8,div:()=>tT,divide:()=>eJ,dot:()=>ti,equals:()=>tb,exactEquals:()=>tv,floor:()=>e1,forEach:()=>tC,fromValues:()=>e$,hermite:()=>ta,inverse:()=>tt,len:()=>tM,length:()=>eX,lerp:()=>ts,max:()=>e3,min:()=>e2,mul:()=>ty,multiply:()=>eQ,negate:()=>te,normalize:()=>tr,random:()=>tu,rotateX:()=>td,rotateY:()=>tp,rotateZ:()=>tg,round:()=>e4,scale:()=>e6,scaleAndAdd:()=>e5,set:()=>eY,slerp:()=>to,sqrDist:()=>tS,sqrLen:()=>tI,squaredDistance:()=>e7,squaredLength:()=>e9,str:()=>tE,sub:()=>tA,subtract:()=>eK,transformMat3:()=>th,transformMat4:()=>tc,transformQuat:()=>tf,zero:()=>tm});var tA=eK,ty=eQ,tT=eJ,tR=e8,tS=e7,tM=eX,tI=e9,tC=function(){let e=ej();return function(t,r,i,n,s,o){let a,l;for(r||(r=3),i||(i=0),l=n?Math.min(n*r+i,t.length):t.length,a=i;a<l;a+=r)e[0]=t[a],e[1]=t[a+1],e[2]=t[a+2],s(e,e,o),t[a]=e[0],t[a+1]=e[1],t[a+2]=e[2];return t}}(),tx=[0,0,0],tw=class extends z{static get ZERO(){return n||Object.freeze(n=new tw(0,0,0)),n}constructor(e=0,t=0,r=0){super(-0,-0,-0),1==arguments.length&&T(e)?this.copy(e):(b.debug&&(G(e),G(t),G(r)),this[0]=e,this[1]=t,this[2]=r)}set(e,t,r){return this[0]=e,this[1]=t,this[2]=r,this.check()}copy(e){return this[0]=e[0],this[1]=e[1],this[2]=e[2],this.check()}fromObject(e){return b.debug&&(G(e.x),G(e.y),G(e.z)),this[0]=e.x,this[1]=e.y,this[2]=e.z,this.check()}toObject(e){return e.x=this[0],e.y=this[1],e.z=this[2],e}get ELEMENTS(){return 3}get z(){return this[2]}set z(e){this[2]=G(e)}angle(e){return t_(this,e)}cross(e){return tn(this,this,e),this.check()}rotateX({radians:e,origin:t=tx}){return td(this,this,t,e),this.check()}rotateY({radians:e,origin:t=tx}){return tp(this,this,t,e),this.check()}rotateZ({radians:e,origin:t=tx}){return tg(this,this,t,e),this.check()}transform(e){return this.transformAsPoint(e)}transformAsPoint(e){return tc(this,this,e),this.check()}transformAsVector(e){return eG(this,this,e),this.check()}transformByMatrix3(e){return th(this,this,e),this.check()}transformByMatrix2(e){return!function(e,t,r){let i=t[0],n=t[1];e[0]=r[0]*i+r[2]*n,e[1]=r[1]*i+r[3]*n,e[2]=t[2]}(this,this,e),this.check()}transformByQuaternion(e){return tf(this,this,e),this.check()}},tN=class extends z{static get ZERO(){return s||Object.freeze(s=new tN(0,0,0,0)),s}constructor(e=0,t=0,r=0,i=0){super(-0,-0,-0,-0),T(e)&&1==arguments.length?this.copy(e):(b.debug&&(G(e),G(t),G(r),G(i)),this[0]=e,this[1]=t,this[2]=r,this[3]=i)}set(e,t,r,i){return this[0]=e,this[1]=t,this[2]=r,this[3]=i,this.check()}copy(e){return this[0]=e[0],this[1]=e[1],this[2]=e[2],this[3]=e[3],this.check()}fromObject(e){return b.debug&&(G(e.x),G(e.y),G(e.z),G(e.w)),this[0]=e.x,this[1]=e.y,this[2]=e.z,this[3]=e.w,this}toObject(e){return e.x=this[0],e.y=this[1],e.z=this[2],e.w=this[3],e}get ELEMENTS(){return 4}get z(){return this[2]}set z(e){this[2]=G(e)}get w(){return this[3]}set w(e){this[3]=G(e)}transform(e){return tc(this,this,e),this.check()}transformByMatrix3(e){return eH(this,this,e),this.check()}transformByMatrix2(e){return!function(e,t,r){let i=t[0],n=t[1];e[0]=r[0]*i+r[2]*n,e[1]=r[1]*i+r[3]*n,e[2]=t[2],e[3]=t[3]}(this,this,e),this.check()}transformByQuaternion(e){return tf(this,this,e),this.check()}applyMatrix4(e){return e.transform(this,this),this}},tO=class extends k{toString(){let e="[";if(b.printRowMajor){e+="row-major:";for(let t=0;t<this.RANK;++t)for(let r=0;r<this.RANK;++r)e+=` ${this[r*this.RANK+t]}`}else{e+="column-major:";for(let t=0;t<this.ELEMENTS;++t)e+=` ${this[t]}`}return e+"]"}getElementIndex(e,t){return t*this.RANK+e}getElement(e,t){return this[t*this.RANK+e]}setElement(e,t,r){return this[t*this.RANK+e]=G(r),this}getColumn(e,t=Array(this.RANK).fill(-0)){let r=e*this.RANK;for(let e=0;e<this.RANK;++e)t[e]=this[r+e];return t}setColumn(e,t){let r=e*this.RANK;for(let e=0;e<this.RANK;++e)this[r+e]=t[e];return this}},tP={};function tL(){let e=new W(9);return W!=Float32Array&&(e[1]=0,e[2]=0,e[3]=0,e[5]=0,e[6]=0,e[7]=0),e[0]=1,e[4]=1,e[8]=1,e}function tF(e,t){return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[4],e[4]=t[5],e[5]=t[6],e[6]=t[8],e[7]=t[9],e[8]=t[10],e}function tB(e){let t=new W(9);return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[8]=e[8],t}function tD(e,t){return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e[8]=t[8],e}function tU(e,t,r,i,n,s,o,a,l){let u=new W(9);return u[0]=e,u[1]=t,u[2]=r,u[3]=i,u[4]=n,u[5]=s,u[6]=o,u[7]=a,u[8]=l,u}function tk(e,t,r,i,n,s,o,a,l,u){return e[0]=t,e[1]=r,e[2]=i,e[3]=n,e[4]=s,e[5]=o,e[6]=a,e[7]=l,e[8]=u,e}function tG(e){return e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=1,e[5]=0,e[6]=0,e[7]=0,e[8]=1,e}function tH(e,t){if(e===t){let r=t[1],i=t[2],n=t[5];e[1]=t[3],e[2]=t[6],e[3]=r,e[5]=t[7],e[6]=i,e[7]=n}else e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8];return e}function tV(e,t){let r=t[0],i=t[1],n=t[2],s=t[3],o=t[4],a=t[5],l=t[6],u=t[7],c=t[8],h=c*o-a*u,f=-c*s+a*l,d=u*s-o*l,p=r*h+i*f+n*d;return p?(p=1/p,e[0]=h*p,e[1]=(-c*i+n*u)*p,e[2]=(a*i-n*o)*p,e[3]=f*p,e[4]=(c*r-n*l)*p,e[5]=(-a*r+n*s)*p,e[6]=d*p,e[7]=(-u*r+i*l)*p,e[8]=(o*r-i*s)*p,e):null}function tz(e,t){let r=t[0],i=t[1],n=t[2],s=t[3],o=t[4],a=t[5],l=t[6],u=t[7],c=t[8];return e[0]=o*c-a*u,e[1]=n*u-i*c,e[2]=i*a-n*o,e[3]=a*l-s*c,e[4]=r*c-n*l,e[5]=n*s-r*a,e[6]=s*u-o*l,e[7]=i*l-r*u,e[8]=r*o-i*s,e}function tj(e){let t=e[0],r=e[1],i=e[2],n=e[3],s=e[4],o=e[5],a=e[6],l=e[7],u=e[8];return t*(u*s-o*l)+r*(-u*n+o*a)+i*(l*n-s*a)}function tW(e,t,r){let i=t[0],n=t[1],s=t[2],o=t[3],a=t[4],l=t[5],u=t[6],c=t[7],h=t[8],f=r[0],d=r[1],p=r[2],g=r[3],_=r[4],m=r[5],E=r[6],v=r[7],b=r[8];return e[0]=f*i+d*o+p*u,e[1]=f*n+d*a+p*c,e[2]=f*s+d*l+p*h,e[3]=g*i+_*o+m*u,e[4]=g*n+_*a+m*c,e[5]=g*s+_*l+m*h,e[6]=E*i+v*o+b*u,e[7]=E*n+v*a+b*c,e[8]=E*s+v*l+b*h,e}function tX(e,t,r){let i=t[0],n=t[1],s=t[2],o=t[3],a=t[4],l=t[5],u=t[6],c=t[7],h=t[8],f=r[0],d=r[1];return e[0]=i,e[1]=n,e[2]=s,e[3]=o,e[4]=a,e[5]=l,e[6]=f*i+d*o+u,e[7]=f*n+d*a+c,e[8]=f*s+d*l+h,e}function t$(e,t,r){let i=t[0],n=t[1],s=t[2],o=t[3],a=t[4],l=t[5],u=t[6],c=t[7],h=t[8],f=Math.sin(r),d=Math.cos(r);return e[0]=d*i+f*o,e[1]=d*n+f*a,e[2]=d*s+f*l,e[3]=d*o-f*i,e[4]=d*a-f*n,e[5]=d*l-f*s,e[6]=u,e[7]=c,e[8]=h,e}function tq(e,t,r){let i=r[0],n=r[1];return e[0]=i*t[0],e[1]=i*t[1],e[2]=i*t[2],e[3]=n*t[3],e[4]=n*t[4],e[5]=n*t[5],e[6]=t[6],e[7]=t[7],e[8]=t[8],e}function tY(e,t){return e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=1,e[5]=0,e[6]=t[0],e[7]=t[1],e[8]=1,e}function tZ(e,t){let r=Math.sin(t),i=Math.cos(t);return e[0]=i,e[1]=r,e[2]=0,e[3]=-r,e[4]=i,e[5]=0,e[6]=0,e[7]=0,e[8]=1,e}function tK(e,t){return e[0]=t[0],e[1]=0,e[2]=0,e[3]=0,e[4]=t[1],e[5]=0,e[6]=0,e[7]=0,e[8]=1,e}function tQ(e,t){return e[0]=t[0],e[1]=t[1],e[2]=0,e[3]=t[2],e[4]=t[3],e[5]=0,e[6]=t[4],e[7]=t[5],e[8]=1,e}function tJ(e,t){let r=t[0],i=t[1],n=t[2],s=t[3],o=r+r,a=i+i,l=n+n,u=r*o,c=i*o,h=i*a,f=n*o,d=n*a,p=n*l,g=s*o,_=s*a,m=s*l;return e[0]=1-h-p,e[3]=c-m,e[6]=f+_,e[1]=c+m,e[4]=1-u-p,e[7]=d-g,e[2]=f-_,e[5]=d+g,e[8]=1-u-h,e}function t0(e,t){let r=t[0],i=t[1],n=t[2],s=t[3],o=t[4],a=t[5],l=t[6],u=t[7],c=t[8],h=t[9],f=t[10],d=t[11],p=t[12],g=t[13],_=t[14],m=t[15],E=r*a-i*o,v=r*l-n*o,b=r*u-s*o,A=i*l-n*a,y=i*u-s*a,T=n*u-s*l,R=c*g-h*p,S=c*_-f*p,M=c*m-d*p,I=h*_-f*g,C=h*m-d*g,x=f*m-d*_,w=E*x-v*C+b*I+A*M-y*S+T*R;return w?(w=1/w,e[0]=(a*x-l*C+u*I)*w,e[1]=(l*M-o*x-u*S)*w,e[2]=(o*C-a*M+u*R)*w,e[3]=(n*C-i*x-s*I)*w,e[4]=(r*x-n*M+s*S)*w,e[5]=(i*M-r*C-s*R)*w,e[6]=(g*T-_*y+m*A)*w,e[7]=(_*b-p*T-m*v)*w,e[8]=(p*y-g*b+m*E)*w,e):null}function t1(e,t,r){return e[0]=2/t,e[1]=0,e[2]=0,e[3]=0,e[4]=-2/r,e[5]=0,e[6]=-1,e[7]=1,e[8]=1,e}function t2(e){return`mat3(${e[0]}, ${e[1]}, ${e[2]}, ${e[3]}, ${e[4]}, ${e[5]}, ${e[6]}, ${e[7]}, ${e[8]})`}function t3(e){return Math.sqrt(e[0]*e[0]+e[1]*e[1]+e[2]*e[2]+e[3]*e[3]+e[4]*e[4]+e[5]*e[5]+e[6]*e[6]+e[7]*e[7]+e[8]*e[8])}function t4(e,t,r){return e[0]=t[0]+r[0],e[1]=t[1]+r[1],e[2]=t[2]+r[2],e[3]=t[3]+r[3],e[4]=t[4]+r[4],e[5]=t[5]+r[5],e[6]=t[6]+r[6],e[7]=t[7]+r[7],e[8]=t[8]+r[8],e}function t6(e,t,r){return e[0]=t[0]-r[0],e[1]=t[1]-r[1],e[2]=t[2]-r[2],e[3]=t[3]-r[3],e[4]=t[4]-r[4],e[5]=t[5]-r[5],e[6]=t[6]-r[6],e[7]=t[7]-r[7],e[8]=t[8]-r[8],e}function t5(e,t,r){return e[0]=t[0]*r,e[1]=t[1]*r,e[2]=t[2]*r,e[3]=t[3]*r,e[4]=t[4]*r,e[5]=t[5]*r,e[6]=t[6]*r,e[7]=t[7]*r,e[8]=t[8]*r,e}function t8(e,t,r,i){return e[0]=t[0]+r[0]*i,e[1]=t[1]+r[1]*i,e[2]=t[2]+r[2]*i,e[3]=t[3]+r[3]*i,e[4]=t[4]+r[4]*i,e[5]=t[5]+r[5]*i,e[6]=t[6]+r[6]*i,e[7]=t[7]+r[7]*i,e[8]=t[8]+r[8]*i,e}function t7(e,t){return e[0]===t[0]&&e[1]===t[1]&&e[2]===t[2]&&e[3]===t[3]&&e[4]===t[4]&&e[5]===t[5]&&e[6]===t[6]&&e[7]===t[7]&&e[8]===t[8]}function t9(e,t){let r=e[0],i=e[1],n=e[2],s=e[3],o=e[4],a=e[5],l=e[6],u=e[7],c=e[8],h=t[0],f=t[1],d=t[2],p=t[3],g=t[4],_=t[5],m=t[6],E=t[7],v=t[8];return Math.abs(r-h)<=1e-6*Math.max(1,Math.abs(r),Math.abs(h))&&Math.abs(i-f)<=1e-6*Math.max(1,Math.abs(i),Math.abs(f))&&Math.abs(n-d)<=1e-6*Math.max(1,Math.abs(n),Math.abs(d))&&Math.abs(s-p)<=1e-6*Math.max(1,Math.abs(s),Math.abs(p))&&Math.abs(o-g)<=1e-6*Math.max(1,Math.abs(o),Math.abs(g))&&Math.abs(a-_)<=1e-6*Math.max(1,Math.abs(a),Math.abs(_))&&Math.abs(l-m)<=1e-6*Math.max(1,Math.abs(l),Math.abs(m))&&Math.abs(u-E)<=1e-6*Math.max(1,Math.abs(u),Math.abs(E))&&Math.abs(c-v)<=1e-6*Math.max(1,Math.abs(c),Math.abs(v))}_(tP,{add:()=>t4,adjoint:()=>tz,clone:()=>tB,copy:()=>tD,create:()=>tL,determinant:()=>tj,equals:()=>t9,exactEquals:()=>t7,frob:()=>t3,fromMat2d:()=>tQ,fromMat4:()=>tF,fromQuat:()=>tJ,fromRotation:()=>tZ,fromScaling:()=>tK,fromTranslation:()=>tY,fromValues:()=>tU,identity:()=>tG,invert:()=>tV,mul:()=>re,multiply:()=>tW,multiplyScalar:()=>t5,multiplyScalarAndAdd:()=>t8,normalFromMat4:()=>t0,projection:()=>t1,rotate:()=>t$,scale:()=>tq,set:()=>tk,str:()=>t2,sub:()=>rt,subtract:()=>t6,translate:()=>tX,transpose:()=>tH});var re=tW,rt=t6;(t=o||(o={}))[t.COL0ROW0=0]="COL0ROW0",t[t.COL0ROW1=1]="COL0ROW1",t[t.COL0ROW2=2]="COL0ROW2",t[t.COL1ROW0=3]="COL1ROW0",t[t.COL1ROW1=4]="COL1ROW1",t[t.COL1ROW2=5]="COL1ROW2",t[t.COL2ROW0=6]="COL2ROW0",t[t.COL2ROW1=7]="COL2ROW1",t[t.COL2ROW2=8]="COL2ROW2";var rr=Object.freeze([1,0,0,0,1,0,0,0,1]),ri=class extends tO{static get IDENTITY(){return rn||Object.freeze(rn=new ri),rn}static get ZERO(){return a||Object.freeze(a=new ri([0,0,0,0,0,0,0,0,0])),a}get ELEMENTS(){return 9}get RANK(){return 3}get INDICES(){return o}constructor(e,...t){super(-0,-0,-0,-0,-0,-0,-0,-0,-0),1==arguments.length&&Array.isArray(e)?this.copy(e):t.length>0?this.copy([e,...t]):this.identity()}copy(e){return this[0]=e[0],this[1]=e[1],this[2]=e[2],this[3]=e[3],this[4]=e[4],this[5]=e[5],this[6]=e[6],this[7]=e[7],this[8]=e[8],this.check()}identity(){return this.copy(rr)}fromObject(e){return this.check()}fromQuaternion(e){return tJ(this,e),this.check()}set(e,t,r,i,n,s,o,a,l){return this[0]=e,this[1]=t,this[2]=r,this[3]=i,this[4]=n,this[5]=s,this[6]=o,this[7]=a,this[8]=l,this.check()}setRowMajor(e,t,r,i,n,s,o,a,l){return this[0]=e,this[1]=i,this[2]=o,this[3]=t,this[4]=n,this[5]=a,this[6]=r,this[7]=s,this[8]=l,this.check()}determinant(){return tj(this)}transpose(){return tH(this,this),this.check()}invert(){return tV(this,this),this.check()}multiplyLeft(e){return tW(this,e,this),this.check()}multiplyRight(e){return tW(this,this,e),this.check()}rotate(e){return t$(this,this,e),this.check()}scale(e){return Array.isArray(e)?tq(this,this,e):tq(this,this,[e,e]),this.check()}translate(e){return tX(this,this,e),this.check()}transform(e,t){let r;switch(e.length){case 2:r=eT(t||[-0,-0],e,this);break;case 3:r=th(t||[-0,-0,-0],e,this);break;case 4:r=eH(t||[-0,-0,-0,-0],e,this);break;default:throw Error("Illegal vector")}return H(r,e.length),r}transformVector(e,t){return this.transform(e,t)}transformVector2(e,t){return this.transform(e,t)}transformVector3(e,t){return this.transform(e,t)}},rn=null,rs={};function ro(){let e=new W(16);return W!=Float32Array&&(e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0),e[0]=1,e[5]=1,e[10]=1,e[15]=1,e}function ra(e){let t=new W(16);return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[8]=e[8],t[9]=e[9],t[10]=e[10],t[11]=e[11],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15],t}function rl(e,t){return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e[8]=t[8],e[9]=t[9],e[10]=t[10],e[11]=t[11],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15],e}function ru(e,t,r,i,n,s,o,a,l,u,c,h,f,d,p,g){let _=new W(16);return _[0]=e,_[1]=t,_[2]=r,_[3]=i,_[4]=n,_[5]=s,_[6]=o,_[7]=a,_[8]=l,_[9]=u,_[10]=c,_[11]=h,_[12]=f,_[13]=d,_[14]=p,_[15]=g,_}function rc(e,t,r,i,n,s,o,a,l,u,c,h,f,d,p,g,_){return e[0]=t,e[1]=r,e[2]=i,e[3]=n,e[4]=s,e[5]=o,e[6]=a,e[7]=l,e[8]=u,e[9]=c,e[10]=h,e[11]=f,e[12]=d,e[13]=p,e[14]=g,e[15]=_,e}function rh(e){return e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=1,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=1,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function rf(e,t){if(e===t){let r=t[1],i=t[2],n=t[3],s=t[6],o=t[7],a=t[11];e[1]=t[4],e[2]=t[8],e[3]=t[12],e[4]=r,e[6]=t[9],e[7]=t[13],e[8]=i,e[9]=s,e[11]=t[14],e[12]=n,e[13]=o,e[14]=a}else e[0]=t[0],e[1]=t[4],e[2]=t[8],e[3]=t[12],e[4]=t[1],e[5]=t[5],e[6]=t[9],e[7]=t[13],e[8]=t[2],e[9]=t[6],e[10]=t[10],e[11]=t[14],e[12]=t[3],e[13]=t[7],e[14]=t[11],e[15]=t[15];return e}function rd(e,t){let r=t[0],i=t[1],n=t[2],s=t[3],o=t[4],a=t[5],l=t[6],u=t[7],c=t[8],h=t[9],f=t[10],d=t[11],p=t[12],g=t[13],_=t[14],m=t[15],E=r*a-i*o,v=r*l-n*o,b=r*u-s*o,A=i*l-n*a,y=i*u-s*a,T=n*u-s*l,R=c*g-h*p,S=c*_-f*p,M=c*m-d*p,I=h*_-f*g,C=h*m-d*g,x=f*m-d*_,w=E*x-v*C+b*I+A*M-y*S+T*R;return w?(w=1/w,e[0]=(a*x-l*C+u*I)*w,e[1]=(n*C-i*x-s*I)*w,e[2]=(g*T-_*y+m*A)*w,e[3]=(f*y-h*T-d*A)*w,e[4]=(l*M-o*x-u*S)*w,e[5]=(r*x-n*M+s*S)*w,e[6]=(_*b-p*T-m*v)*w,e[7]=(c*T-f*b+d*v)*w,e[8]=(o*C-a*M+u*R)*w,e[9]=(i*M-r*C-s*R)*w,e[10]=(p*y-g*b+m*E)*w,e[11]=(h*b-c*y-d*E)*w,e[12]=(a*S-o*I-l*R)*w,e[13]=(r*I-i*S+n*R)*w,e[14]=(g*v-p*A-_*E)*w,e[15]=(c*A-h*v+f*E)*w,e):null}function rp(e,t){let r=t[0],i=t[1],n=t[2],s=t[3],o=t[4],a=t[5],l=t[6],u=t[7],c=t[8],h=t[9],f=t[10],d=t[11],p=t[12],g=t[13],_=t[14],m=t[15],E=r*a-i*o,v=r*l-n*o,b=r*u-s*o,A=i*l-n*a,y=i*u-s*a,T=n*u-s*l,R=c*g-h*p,S=c*_-f*p,M=c*m-d*p,I=h*_-f*g,C=h*m-d*g,x=f*m-d*_;return e[0]=a*x-l*C+u*I,e[1]=n*C-i*x-s*I,e[2]=g*T-_*y+m*A,e[3]=f*y-h*T-d*A,e[4]=l*M-o*x-u*S,e[5]=r*x-n*M+s*S,e[6]=_*b-p*T-m*v,e[7]=c*T-f*b+d*v,e[8]=o*C-a*M+u*R,e[9]=i*M-r*C-s*R,e[10]=p*y-g*b+m*E,e[11]=h*b-c*y-d*E,e[12]=a*S-o*I-l*R,e[13]=r*I-i*S+n*R,e[14]=g*v-p*A-_*E,e[15]=c*A-h*v+f*E,e}function rg(e){let t=e[0],r=e[1],i=e[2],n=e[3],s=e[4],o=e[5],a=e[6],l=e[7],u=e[8],c=e[9],h=e[10],f=e[11],d=e[12],p=e[13],g=e[14],_=e[15],m=t*o-r*s,E=t*a-i*s,v=r*a-i*o,b=u*p-c*d,A=u*g-h*d,y=c*g-h*p;return l*(t*y-r*A+i*b)-n*(s*y-o*A+a*b)+_*(u*v-c*E+h*m)-f*(d*v-p*E+g*m)}function r_(e,t,r){let i=t[0],n=t[1],s=t[2],o=t[3],a=t[4],l=t[5],u=t[6],c=t[7],h=t[8],f=t[9],d=t[10],p=t[11],g=t[12],_=t[13],m=t[14],E=t[15],v=r[0],b=r[1],A=r[2],y=r[3];return e[0]=v*i+b*a+A*h+y*g,e[1]=v*n+b*l+A*f+y*_,e[2]=v*s+b*u+A*d+y*m,e[3]=v*o+b*c+A*p+y*E,v=r[4],b=r[5],A=r[6],y=r[7],e[4]=v*i+b*a+A*h+y*g,e[5]=v*n+b*l+A*f+y*_,e[6]=v*s+b*u+A*d+y*m,e[7]=v*o+b*c+A*p+y*E,v=r[8],b=r[9],A=r[10],y=r[11],e[8]=v*i+b*a+A*h+y*g,e[9]=v*n+b*l+A*f+y*_,e[10]=v*s+b*u+A*d+y*m,e[11]=v*o+b*c+A*p+y*E,v=r[12],b=r[13],A=r[14],y=r[15],e[12]=v*i+b*a+A*h+y*g,e[13]=v*n+b*l+A*f+y*_,e[14]=v*s+b*u+A*d+y*m,e[15]=v*o+b*c+A*p+y*E,e}function rm(e,t,r){let i,n,s,o,a,l,u,c,h,f,d,p;let g=r[0],_=r[1],m=r[2];return t===e?(e[12]=t[0]*g+t[4]*_+t[8]*m+t[12],e[13]=t[1]*g+t[5]*_+t[9]*m+t[13],e[14]=t[2]*g+t[6]*_+t[10]*m+t[14],e[15]=t[3]*g+t[7]*_+t[11]*m+t[15]):(i=t[0],n=t[1],s=t[2],o=t[3],a=t[4],l=t[5],u=t[6],c=t[7],h=t[8],f=t[9],d=t[10],p=t[11],e[0]=i,e[1]=n,e[2]=s,e[3]=o,e[4]=a,e[5]=l,e[6]=u,e[7]=c,e[8]=h,e[9]=f,e[10]=d,e[11]=p,e[12]=i*g+a*_+h*m+t[12],e[13]=n*g+l*_+f*m+t[13],e[14]=s*g+u*_+d*m+t[14],e[15]=o*g+c*_+p*m+t[15]),e}function rE(e,t,r){let i=r[0],n=r[1],s=r[2];return e[0]=t[0]*i,e[1]=t[1]*i,e[2]=t[2]*i,e[3]=t[3]*i,e[4]=t[4]*n,e[5]=t[5]*n,e[6]=t[6]*n,e[7]=t[7]*n,e[8]=t[8]*s,e[9]=t[9]*s,e[10]=t[10]*s,e[11]=t[11]*s,e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15],e}function rv(e,t,r,i){let n,s,o,a,l,u,c,h,f,d,p,g,_,m,E,v,b,A,y,T,R,S,M,I,C=i[0],x=i[1],w=i[2],N=Math.sqrt(C*C+x*x+w*w);return N<1e-6?null:(C*=N=1/N,x*=N,w*=N,s=Math.sin(r),o=1-(n=Math.cos(r)),a=t[0],l=t[1],u=t[2],c=t[3],h=t[4],f=t[5],d=t[6],p=t[7],g=t[8],_=t[9],m=t[10],E=t[11],v=C*C*o+n,b=x*C*o+w*s,A=w*C*o-x*s,y=C*x*o-w*s,T=x*x*o+n,R=w*x*o+C*s,S=C*w*o+x*s,M=x*w*o-C*s,I=w*w*o+n,e[0]=a*v+h*b+g*A,e[1]=l*v+f*b+_*A,e[2]=u*v+d*b+m*A,e[3]=c*v+p*b+E*A,e[4]=a*y+h*T+g*R,e[5]=l*y+f*T+_*R,e[6]=u*y+d*T+m*R,e[7]=c*y+p*T+E*R,e[8]=a*S+h*M+g*I,e[9]=l*S+f*M+_*I,e[10]=u*S+d*M+m*I,e[11]=c*S+p*M+E*I,t!==e&&(e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15]),e)}function rb(e,t,r){let i=Math.sin(r),n=Math.cos(r),s=t[4],o=t[5],a=t[6],l=t[7],u=t[8],c=t[9],h=t[10],f=t[11];return t!==e&&(e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15]),e[4]=s*n+u*i,e[5]=o*n+c*i,e[6]=a*n+h*i,e[7]=l*n+f*i,e[8]=u*n-s*i,e[9]=c*n-o*i,e[10]=h*n-a*i,e[11]=f*n-l*i,e}function rA(e,t,r){let i=Math.sin(r),n=Math.cos(r),s=t[0],o=t[1],a=t[2],l=t[3],u=t[8],c=t[9],h=t[10],f=t[11];return t!==e&&(e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15]),e[0]=s*n-u*i,e[1]=o*n-c*i,e[2]=a*n-h*i,e[3]=l*n-f*i,e[8]=s*i+u*n,e[9]=o*i+c*n,e[10]=a*i+h*n,e[11]=l*i+f*n,e}function ry(e,t,r){let i=Math.sin(r),n=Math.cos(r),s=t[0],o=t[1],a=t[2],l=t[3],u=t[4],c=t[5],h=t[6],f=t[7];return t!==e&&(e[8]=t[8],e[9]=t[9],e[10]=t[10],e[11]=t[11],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15]),e[0]=s*n+u*i,e[1]=o*n+c*i,e[2]=a*n+h*i,e[3]=l*n+f*i,e[4]=u*n-s*i,e[5]=c*n-o*i,e[6]=h*n-a*i,e[7]=f*n-l*i,e}function rT(e,t){return e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=1,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=1,e[11]=0,e[12]=t[0],e[13]=t[1],e[14]=t[2],e[15]=1,e}function rR(e,t){return e[0]=t[0],e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=t[1],e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=t[2],e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function rS(e,t,r){let i,n,s,o=r[0],a=r[1],l=r[2],u=Math.sqrt(o*o+a*a+l*l);return u<1e-6?null:(o*=u=1/u,a*=u,l*=u,n=Math.sin(t),s=1-(i=Math.cos(t)),e[0]=o*o*s+i,e[1]=a*o*s+l*n,e[2]=l*o*s-a*n,e[3]=0,e[4]=o*a*s-l*n,e[5]=a*a*s+i,e[6]=l*a*s+o*n,e[7]=0,e[8]=o*l*s+a*n,e[9]=a*l*s-o*n,e[10]=l*l*s+i,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e)}function rM(e,t){let r=Math.sin(t),i=Math.cos(t);return e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=i,e[6]=r,e[7]=0,e[8]=0,e[9]=-r,e[10]=i,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function rI(e,t){let r=Math.sin(t),i=Math.cos(t);return e[0]=i,e[1]=0,e[2]=-r,e[3]=0,e[4]=0,e[5]=1,e[6]=0,e[7]=0,e[8]=r,e[9]=0,e[10]=i,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function rC(e,t){let r=Math.sin(t),i=Math.cos(t);return e[0]=i,e[1]=r,e[2]=0,e[3]=0,e[4]=-r,e[5]=i,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=1,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function rx(e,t,r){let i=t[0],n=t[1],s=t[2],o=t[3],a=i+i,l=n+n,u=s+s,c=i*a,h=i*l,f=i*u,d=n*l,p=n*u,g=s*u,_=o*a,m=o*l,E=o*u;return e[0]=1-(d+g),e[1]=h+E,e[2]=f-m,e[3]=0,e[4]=h-E,e[5]=1-(c+g),e[6]=p+_,e[7]=0,e[8]=f+m,e[9]=p-_,e[10]=1-(c+d),e[11]=0,e[12]=r[0],e[13]=r[1],e[14]=r[2],e[15]=1,e}function rw(e,t){let r=new W(3),i=-t[0],n=-t[1],s=-t[2],o=t[3],a=t[4],l=t[5],u=t[6],c=t[7],h=i*i+n*n+s*s+o*o;return h>0?(r[0]=(a*o+c*i+l*s-u*n)*2/h,r[1]=(l*o+c*n+u*i-a*s)*2/h,r[2]=(u*o+c*s+a*n-l*i)*2/h):(r[0]=(a*o+c*i+l*s-u*n)*2,r[1]=(l*o+c*n+u*i-a*s)*2,r[2]=(u*o+c*s+a*n-l*i)*2),rx(e,t,r),e}function rN(e,t){return e[0]=t[12],e[1]=t[13],e[2]=t[14],e}function rO(e,t){let r=t[0],i=t[1],n=t[2],s=t[4],o=t[5],a=t[6],l=t[8],u=t[9],c=t[10];return e[0]=Math.sqrt(r*r+i*i+n*n),e[1]=Math.sqrt(s*s+o*o+a*a),e[2]=Math.sqrt(l*l+u*u+c*c),e}function rP(e,t){let r=new W(3);rO(r,t);let i=1/r[0],n=1/r[1],s=1/r[2],o=t[0]*i,a=t[1]*n,l=t[2]*s,u=t[4]*i,c=t[5]*n,h=t[6]*s,f=t[8]*i,d=t[9]*n,p=t[10]*s,g=o+c+p,_=0;return g>0?(_=2*Math.sqrt(g+1),e[3]=.25*_,e[0]=(h-d)/_,e[1]=(f-l)/_,e[2]=(a-u)/_):o>c&&o>p?(_=2*Math.sqrt(1+o-c-p),e[3]=(h-d)/_,e[0]=.25*_,e[1]=(a+u)/_,e[2]=(f+l)/_):c>p?(_=2*Math.sqrt(1+c-o-p),e[3]=(f-l)/_,e[0]=(a+u)/_,e[1]=.25*_,e[2]=(h+d)/_):(_=2*Math.sqrt(1+p-o-c),e[3]=(a-u)/_,e[0]=(f+l)/_,e[1]=(h+d)/_,e[2]=.25*_),e}function rL(e,t,r,i){t[0]=i[12],t[1]=i[13],t[2]=i[14];let n=i[0],s=i[1],o=i[2],a=i[4],l=i[5],u=i[6],c=i[8],h=i[9],f=i[10];r[0]=Math.sqrt(n*n+s*s+o*o),r[1]=Math.sqrt(a*a+l*l+u*u),r[2]=Math.sqrt(c*c+h*h+f*f);let d=1/r[0],p=1/r[1],g=1/r[2],_=n*d,m=s*p,E=o*g,v=a*d,b=l*p,A=u*g,y=c*d,T=h*p,R=f*g,S=_+b+R,M=0;return S>0?(M=2*Math.sqrt(S+1),e[3]=.25*M,e[0]=(A-T)/M,e[1]=(y-E)/M,e[2]=(m-v)/M):_>b&&_>R?(M=2*Math.sqrt(1+_-b-R),e[3]=(A-T)/M,e[0]=.25*M,e[1]=(m+v)/M,e[2]=(y+E)/M):b>R?(M=2*Math.sqrt(1+b-_-R),e[3]=(y-E)/M,e[0]=(m+v)/M,e[1]=.25*M,e[2]=(A+T)/M):(M=2*Math.sqrt(1+R-_-b),e[3]=(m-v)/M,e[0]=(y+E)/M,e[1]=(A+T)/M,e[2]=.25*M),e}function rF(e,t,r,i){let n=t[0],s=t[1],o=t[2],a=t[3],l=n+n,u=s+s,c=o+o,h=n*l,f=n*u,d=n*c,p=s*u,g=s*c,_=o*c,m=a*l,E=a*u,v=a*c,b=i[0],A=i[1],y=i[2];return e[0]=(1-(p+_))*b,e[1]=(f+v)*b,e[2]=(d-E)*b,e[3]=0,e[4]=(f-v)*A,e[5]=(1-(h+_))*A,e[6]=(g+m)*A,e[7]=0,e[8]=(d+E)*y,e[9]=(g-m)*y,e[10]=(1-(h+p))*y,e[11]=0,e[12]=r[0],e[13]=r[1],e[14]=r[2],e[15]=1,e}function rB(e,t,r,i,n){let s=t[0],o=t[1],a=t[2],l=t[3],u=s+s,c=o+o,h=a+a,f=s*u,d=s*c,p=s*h,g=o*c,_=o*h,m=a*h,E=l*u,v=l*c,b=l*h,A=i[0],y=i[1],T=i[2],R=n[0],S=n[1],M=n[2],I=(1-(g+m))*A,C=(d+b)*A,x=(p-v)*A,w=(d-b)*y,N=(1-(f+m))*y,O=(_+E)*y,P=(p+v)*T,L=(_-E)*T,F=(1-(f+g))*T;return e[0]=I,e[1]=C,e[2]=x,e[3]=0,e[4]=w,e[5]=N,e[6]=O,e[7]=0,e[8]=P,e[9]=L,e[10]=F,e[11]=0,e[12]=r[0]+R-(I*R+w*S+P*M),e[13]=r[1]+S-(C*R+N*S+L*M),e[14]=r[2]+M-(x*R+O*S+F*M),e[15]=1,e}function rD(e,t){let r=t[0],i=t[1],n=t[2],s=t[3],o=r+r,a=i+i,l=n+n,u=r*o,c=i*o,h=i*a,f=n*o,d=n*a,p=n*l,g=s*o,_=s*a,m=s*l;return e[0]=1-h-p,e[1]=c+m,e[2]=f-_,e[3]=0,e[4]=c-m,e[5]=1-u-p,e[6]=d+g,e[7]=0,e[8]=f+_,e[9]=d-g,e[10]=1-u-h,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function rU(e,t,r,i,n,s,o){let a=1/(r-t),l=1/(n-i),u=1/(s-o);return e[0]=2*s*a,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=2*s*l,e[6]=0,e[7]=0,e[8]=(r+t)*a,e[9]=(n+i)*l,e[10]=(o+s)*u,e[11]=-1,e[12]=0,e[13]=0,e[14]=o*s*2*u,e[15]=0,e}function rk(e,t,r,i,n){let s=1/Math.tan(t/2);if(e[0]=s/r,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=s,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[11]=-1,e[12]=0,e[13]=0,e[15]=0,null!=n&&n!==1/0){let t=1/(i-n);e[10]=(n+i)*t,e[14]=2*n*i*t}else e[10]=-1,e[14]=-2*i;return e}_(rs,{add:()=>rZ,adjoint:()=>rp,clone:()=>ra,copy:()=>rl,create:()=>ro,decompose:()=>rL,determinant:()=>rg,equals:()=>r1,exactEquals:()=>r0,frob:()=>rY,fromQuat:()=>rD,fromQuat2:()=>rw,fromRotation:()=>rS,fromRotationTranslation:()=>rx,fromRotationTranslationScale:()=>rF,fromRotationTranslationScaleOrigin:()=>rB,fromScaling:()=>rR,fromTranslation:()=>rT,fromValues:()=>ru,fromXRotation:()=>rM,fromYRotation:()=>rI,fromZRotation:()=>rC,frustum:()=>rU,getRotation:()=>rP,getScaling:()=>rO,getTranslation:()=>rN,identity:()=>rh,invert:()=>rd,lookAt:()=>rX,mul:()=>r2,multiply:()=>r_,multiplyScalar:()=>rQ,multiplyScalarAndAdd:()=>rJ,ortho:()=>rj,orthoNO:()=>rz,orthoZO:()=>rW,perspective:()=>rG,perspectiveFromFieldOfView:()=>rV,perspectiveNO:()=>rk,perspectiveZO:()=>rH,rotate:()=>rv,rotateX:()=>rb,rotateY:()=>rA,rotateZ:()=>ry,scale:()=>rE,set:()=>rc,str:()=>rq,sub:()=>r3,subtract:()=>rK,targetTo:()=>r$,translate:()=>rm,transpose:()=>rf});var rG=rk;function rH(e,t,r,i,n){let s=1/Math.tan(t/2);if(e[0]=s/r,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=s,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[11]=-1,e[12]=0,e[13]=0,e[15]=0,null!=n&&n!==1/0){let t=1/(i-n);e[10]=n*t,e[14]=n*i*t}else e[10]=-1,e[14]=-i;return e}function rV(e,t,r,i){let n=Math.tan(t.upDegrees*Math.PI/180),s=Math.tan(t.downDegrees*Math.PI/180),o=Math.tan(t.leftDegrees*Math.PI/180),a=Math.tan(t.rightDegrees*Math.PI/180),l=2/(o+a),u=2/(n+s);return e[0]=l,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=u,e[6]=0,e[7]=0,e[8]=-((o-a)*l*.5),e[9]=(n-s)*u*.5,e[10]=i/(r-i),e[11]=-1,e[12]=0,e[13]=0,e[14]=i*r/(r-i),e[15]=0,e}function rz(e,t,r,i,n,s,o){let a=1/(t-r),l=1/(i-n),u=1/(s-o);return e[0]=-2*a,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=-2*l,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=2*u,e[11]=0,e[12]=(t+r)*a,e[13]=(n+i)*l,e[14]=(o+s)*u,e[15]=1,e}var rj=rz;function rW(e,t,r,i,n,s,o){let a=1/(t-r),l=1/(i-n),u=1/(s-o);return e[0]=-2*a,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=-2*l,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=u,e[11]=0,e[12]=(t+r)*a,e[13]=(n+i)*l,e[14]=s*u,e[15]=1,e}function rX(e,t,r,i){let n,s,o,a,l,u,c,h,f,d;let p=t[0],g=t[1],_=t[2],m=i[0],E=i[1],v=i[2],b=r[0],A=r[1],y=r[2];return 1e-6>Math.abs(p-b)&&1e-6>Math.abs(g-A)&&1e-6>Math.abs(_-y)?rh(e):(n=1/Math.sqrt((h=p-b)*h+(f=g-A)*f+(d=_-y)*d),h*=n,f*=n,d*=n,(n=Math.sqrt((s=E*d-v*f)*s+(o=v*h-m*d)*o+(a=m*f-E*h)*a))?(s*=n=1/n,o*=n,a*=n):(s=0,o=0,a=0),(n=Math.sqrt((l=f*a-d*o)*l+(u=d*s-h*a)*u+(c=h*o-f*s)*c))?(l*=n=1/n,u*=n,c*=n):(l=0,u=0,c=0),e[0]=s,e[1]=l,e[2]=h,e[3]=0,e[4]=o,e[5]=u,e[6]=f,e[7]=0,e[8]=a,e[9]=c,e[10]=d,e[11]=0,e[12]=-(s*p+o*g+a*_),e[13]=-(l*p+u*g+c*_),e[14]=-(h*p+f*g+d*_),e[15]=1,e)}function r$(e,t,r,i){let n=t[0],s=t[1],o=t[2],a=i[0],l=i[1],u=i[2],c=n-r[0],h=s-r[1],f=o-r[2],d=c*c+h*h+f*f;d>0&&(c*=d=1/Math.sqrt(d),h*=d,f*=d);let p=l*f-u*h,g=u*c-a*f,_=a*h-l*c;return(d=p*p+g*g+_*_)>0&&(p*=d=1/Math.sqrt(d),g*=d,_*=d),e[0]=p,e[1]=g,e[2]=_,e[3]=0,e[4]=h*_-f*g,e[5]=f*p-c*_,e[6]=c*g-h*p,e[7]=0,e[8]=c,e[9]=h,e[10]=f,e[11]=0,e[12]=n,e[13]=s,e[14]=o,e[15]=1,e}function rq(e){return`mat4(${e[0]}, ${e[1]}, ${e[2]}, ${e[3]}, ${e[4]}, ${e[5]}, ${e[6]}, ${e[7]}, ${e[8]}, ${e[9]}, ${e[10]}, ${e[11]}, ${e[12]}, ${e[13]}, ${e[14]}, ${e[15]})`}function rY(e){return Math.sqrt(e[0]*e[0]+e[1]*e[1]+e[2]*e[2]+e[3]*e[3]+e[4]*e[4]+e[5]*e[5]+e[6]*e[6]+e[7]*e[7]+e[8]*e[8]+e[9]*e[9]+e[10]*e[10]+e[11]*e[11]+e[12]*e[12]+e[13]*e[13]+e[14]*e[14]+e[15]*e[15])}function rZ(e,t,r){return e[0]=t[0]+r[0],e[1]=t[1]+r[1],e[2]=t[2]+r[2],e[3]=t[3]+r[3],e[4]=t[4]+r[4],e[5]=t[5]+r[5],e[6]=t[6]+r[6],e[7]=t[7]+r[7],e[8]=t[8]+r[8],e[9]=t[9]+r[9],e[10]=t[10]+r[10],e[11]=t[11]+r[11],e[12]=t[12]+r[12],e[13]=t[13]+r[13],e[14]=t[14]+r[14],e[15]=t[15]+r[15],e}function rK(e,t,r){return e[0]=t[0]-r[0],e[1]=t[1]-r[1],e[2]=t[2]-r[2],e[3]=t[3]-r[3],e[4]=t[4]-r[4],e[5]=t[5]-r[5],e[6]=t[6]-r[6],e[7]=t[7]-r[7],e[8]=t[8]-r[8],e[9]=t[9]-r[9],e[10]=t[10]-r[10],e[11]=t[11]-r[11],e[12]=t[12]-r[12],e[13]=t[13]-r[13],e[14]=t[14]-r[14],e[15]=t[15]-r[15],e}function rQ(e,t,r){return e[0]=t[0]*r,e[1]=t[1]*r,e[2]=t[2]*r,e[3]=t[3]*r,e[4]=t[4]*r,e[5]=t[5]*r,e[6]=t[6]*r,e[7]=t[7]*r,e[8]=t[8]*r,e[9]=t[9]*r,e[10]=t[10]*r,e[11]=t[11]*r,e[12]=t[12]*r,e[13]=t[13]*r,e[14]=t[14]*r,e[15]=t[15]*r,e}function rJ(e,t,r,i){return e[0]=t[0]+r[0]*i,e[1]=t[1]+r[1]*i,e[2]=t[2]+r[2]*i,e[3]=t[3]+r[3]*i,e[4]=t[4]+r[4]*i,e[5]=t[5]+r[5]*i,e[6]=t[6]+r[6]*i,e[7]=t[7]+r[7]*i,e[8]=t[8]+r[8]*i,e[9]=t[9]+r[9]*i,e[10]=t[10]+r[10]*i,e[11]=t[11]+r[11]*i,e[12]=t[12]+r[12]*i,e[13]=t[13]+r[13]*i,e[14]=t[14]+r[14]*i,e[15]=t[15]+r[15]*i,e}function r0(e,t){return e[0]===t[0]&&e[1]===t[1]&&e[2]===t[2]&&e[3]===t[3]&&e[4]===t[4]&&e[5]===t[5]&&e[6]===t[6]&&e[7]===t[7]&&e[8]===t[8]&&e[9]===t[9]&&e[10]===t[10]&&e[11]===t[11]&&e[12]===t[12]&&e[13]===t[13]&&e[14]===t[14]&&e[15]===t[15]}function r1(e,t){let r=e[0],i=e[1],n=e[2],s=e[3],o=e[4],a=e[5],l=e[6],u=e[7],c=e[8],h=e[9],f=e[10],d=e[11],p=e[12],g=e[13],_=e[14],m=e[15],E=t[0],v=t[1],b=t[2],A=t[3],y=t[4],T=t[5],R=t[6],S=t[7],M=t[8],I=t[9],C=t[10],x=t[11],w=t[12],N=t[13],O=t[14],P=t[15];return Math.abs(r-E)<=1e-6*Math.max(1,Math.abs(r),Math.abs(E))&&Math.abs(i-v)<=1e-6*Math.max(1,Math.abs(i),Math.abs(v))&&Math.abs(n-b)<=1e-6*Math.max(1,Math.abs(n),Math.abs(b))&&Math.abs(s-A)<=1e-6*Math.max(1,Math.abs(s),Math.abs(A))&&Math.abs(o-y)<=1e-6*Math.max(1,Math.abs(o),Math.abs(y))&&Math.abs(a-T)<=1e-6*Math.max(1,Math.abs(a),Math.abs(T))&&Math.abs(l-R)<=1e-6*Math.max(1,Math.abs(l),Math.abs(R))&&Math.abs(u-S)<=1e-6*Math.max(1,Math.abs(u),Math.abs(S))&&Math.abs(c-M)<=1e-6*Math.max(1,Math.abs(c),Math.abs(M))&&Math.abs(h-I)<=1e-6*Math.max(1,Math.abs(h),Math.abs(I))&&Math.abs(f-C)<=1e-6*Math.max(1,Math.abs(f),Math.abs(C))&&Math.abs(d-x)<=1e-6*Math.max(1,Math.abs(d),Math.abs(x))&&Math.abs(p-w)<=1e-6*Math.max(1,Math.abs(p),Math.abs(w))&&Math.abs(g-N)<=1e-6*Math.max(1,Math.abs(g),Math.abs(N))&&Math.abs(_-O)<=1e-6*Math.max(1,Math.abs(_),Math.abs(O))&&Math.abs(m-P)<=1e-6*Math.max(1,Math.abs(m),Math.abs(P))}var r2=r_,r3=rK,r4={};function r6(){let e=new W(4);return W!=Float32Array&&(e[0]=0,e[1]=0,e[2]=0,e[3]=0),e}function r5(e){let t=new W(4);return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t}function r8(e,t,r,i){let n=new W(4);return n[0]=e,n[1]=t,n[2]=r,n[3]=i,n}function r7(e,t){return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e}function r9(e,t,r,i,n){return e[0]=t,e[1]=r,e[2]=i,e[3]=n,e}function ie(e,t,r){return e[0]=t[0]+r[0],e[1]=t[1]+r[1],e[2]=t[2]+r[2],e[3]=t[3]+r[3],e}function it(e,t,r){return e[0]=t[0]-r[0],e[1]=t[1]-r[1],e[2]=t[2]-r[2],e[3]=t[3]-r[3],e}function ir(e,t,r){return e[0]=t[0]*r[0],e[1]=t[1]*r[1],e[2]=t[2]*r[2],e[3]=t[3]*r[3],e}function ii(e,t,r){return e[0]=t[0]/r[0],e[1]=t[1]/r[1],e[2]=t[2]/r[2],e[3]=t[3]/r[3],e}function is(e,t){return e[0]=Math.ceil(t[0]),e[1]=Math.ceil(t[1]),e[2]=Math.ceil(t[2]),e[3]=Math.ceil(t[3]),e}function io(e,t){return e[0]=Math.floor(t[0]),e[1]=Math.floor(t[1]),e[2]=Math.floor(t[2]),e[3]=Math.floor(t[3]),e}function ia(e,t,r){return e[0]=Math.min(t[0],r[0]),e[1]=Math.min(t[1],r[1]),e[2]=Math.min(t[2],r[2]),e[3]=Math.min(t[3],r[3]),e}function il(e,t,r){return e[0]=Math.max(t[0],r[0]),e[1]=Math.max(t[1],r[1]),e[2]=Math.max(t[2],r[2]),e[3]=Math.max(t[3],r[3]),e}function iu(e,t){return e[0]=$(t[0]),e[1]=$(t[1]),e[2]=$(t[2]),e[3]=$(t[3]),e}function ic(e,t,r){return e[0]=t[0]*r,e[1]=t[1]*r,e[2]=t[2]*r,e[3]=t[3]*r,e}function ih(e,t,r,i){return e[0]=t[0]+r[0]*i,e[1]=t[1]+r[1]*i,e[2]=t[2]+r[2]*i,e[3]=t[3]+r[3]*i,e}function id(e,t){let r=t[0]-e[0],i=t[1]-e[1],n=t[2]-e[2],s=t[3]-e[3];return Math.sqrt(r*r+i*i+n*n+s*s)}function ip(e,t){let r=t[0]-e[0],i=t[1]-e[1],n=t[2]-e[2],s=t[3]-e[3];return r*r+i*i+n*n+s*s}function ig(e){let t=e[0],r=e[1],i=e[2],n=e[3];return Math.sqrt(t*t+r*r+i*i+n*n)}function i_(e){let t=e[0],r=e[1],i=e[2],n=e[3];return t*t+r*r+i*i+n*n}function im(e,t){return e[0]=-t[0],e[1]=-t[1],e[2]=-t[2],e[3]=-t[3],e}function iE(e,t){return e[0]=1/t[0],e[1]=1/t[1],e[2]=1/t[2],e[3]=1/t[3],e}function iv(e,t){let r=t[0],i=t[1],n=t[2],s=t[3],o=r*r+i*i+n*n+s*s;return o>0&&(o=1/Math.sqrt(o)),e[0]=r*o,e[1]=i*o,e[2]=n*o,e[3]=s*o,e}function ib(e,t){return e[0]*t[0]+e[1]*t[1]+e[2]*t[2]+e[3]*t[3]}function iA(e,t,r,i){let n=r[0]*i[1]-r[1]*i[0],s=r[0]*i[2]-r[2]*i[0],o=r[0]*i[3]-r[3]*i[0],a=r[1]*i[2]-r[2]*i[1],l=r[1]*i[3]-r[3]*i[1],u=r[2]*i[3]-r[3]*i[2],c=t[0],h=t[1],f=t[2],d=t[3];return e[0]=h*u-f*l+d*a,e[1]=-(c*u)+f*o-d*s,e[2]=c*l-h*o+d*n,e[3]=-(c*a)+h*s-f*n,e}function iy(e,t,r,i){let n=t[0],s=t[1],o=t[2],a=t[3];return e[0]=n+i*(r[0]-n),e[1]=s+i*(r[1]-s),e[2]=o+i*(r[2]-o),e[3]=a+i*(r[3]-a),e}function iT(e,t){let r,i,n,s,o,a;t=void 0===t?1:t;do o=(r=2*X()-1)*r+(i=2*X()-1)*i;while(o>=1);do a=(n=2*X()-1)*n+(s=2*X()-1)*s;while(a>=1);let l=Math.sqrt((1-o)/a);return e[0]=t*r,e[1]=t*i,e[2]=t*n*l,e[3]=t*s*l,e}function iR(e,t,r){let i=t[0],n=t[1],s=t[2],o=t[3];return e[0]=r[0]*i+r[4]*n+r[8]*s+r[12]*o,e[1]=r[1]*i+r[5]*n+r[9]*s+r[13]*o,e[2]=r[2]*i+r[6]*n+r[10]*s+r[14]*o,e[3]=r[3]*i+r[7]*n+r[11]*s+r[15]*o,e}function iS(e,t,r){let i=t[0],n=t[1],s=t[2],o=r[0],a=r[1],l=r[2],u=r[3],c=u*i+a*s-l*n,h=u*n+l*i-o*s,f=u*s+o*n-a*i,d=-o*i-a*n-l*s;return e[0]=c*u+-(d*o)+-(h*l)- -(f*a),e[1]=h*u+-(d*a)+-(f*o)- -(c*l),e[2]=f*u+-(d*l)+-(c*a)- -(h*o),e[3]=t[3],e}function iM(e){return e[0]=0,e[1]=0,e[2]=0,e[3]=0,e}function iI(e){return`vec4(${e[0]}, ${e[1]}, ${e[2]}, ${e[3]})`}function iC(e,t){return e[0]===t[0]&&e[1]===t[1]&&e[2]===t[2]&&e[3]===t[3]}function ix(e,t){let r=e[0],i=e[1],n=e[2],s=e[3],o=t[0],a=t[1],l=t[2],u=t[3];return Math.abs(r-o)<=1e-6*Math.max(1,Math.abs(r),Math.abs(o))&&Math.abs(i-a)<=1e-6*Math.max(1,Math.abs(i),Math.abs(a))&&Math.abs(n-l)<=1e-6*Math.max(1,Math.abs(n),Math.abs(l))&&Math.abs(s-u)<=1e-6*Math.max(1,Math.abs(s),Math.abs(u))}_(r4,{add:()=>ie,ceil:()=>is,clone:()=>r5,copy:()=>r7,create:()=>r6,cross:()=>iA,dist:()=>iP,distance:()=>id,div:()=>iO,divide:()=>ii,dot:()=>ib,equals:()=>ix,exactEquals:()=>iC,floor:()=>io,forEach:()=>iD,fromValues:()=>r8,inverse:()=>iE,len:()=>iF,length:()=>ig,lerp:()=>iy,max:()=>il,min:()=>ia,mul:()=>iN,multiply:()=>ir,negate:()=>im,normalize:()=>iv,random:()=>iT,round:()=>iu,scale:()=>ic,scaleAndAdd:()=>ih,set:()=>r9,sqrDist:()=>iL,sqrLen:()=>iB,squaredDistance:()=>ip,squaredLength:()=>i_,str:()=>iI,sub:()=>iw,subtract:()=>it,transformMat4:()=>iR,transformQuat:()=>iS,zero:()=>iM});var iw=it,iN=ir,iO=ii,iP=id,iL=ip,iF=ig,iB=i_,iD=function(){let e=r6();return function(t,r,i,n,s,o){let a,l;for(r||(r=4),i||(i=0),l=n?Math.min(n*r+i,t.length):t.length,a=i;a<l;a+=r)e[0]=t[a],e[1]=t[a+1],e[2]=t[a+2],e[3]=t[a+3],s(e,e,o),t[a]=e[0],t[a+1]=e[1],t[a+2]=e[2],t[a+3]=e[3];return t}}();(r=l||(l={}))[r.COL0ROW0=0]="COL0ROW0",r[r.COL0ROW1=1]="COL0ROW1",r[r.COL0ROW2=2]="COL0ROW2",r[r.COL0ROW3=3]="COL0ROW3",r[r.COL1ROW0=4]="COL1ROW0",r[r.COL1ROW1=5]="COL1ROW1",r[r.COL1ROW2=6]="COL1ROW2",r[r.COL1ROW3=7]="COL1ROW3",r[r.COL2ROW0=8]="COL2ROW0",r[r.COL2ROW1=9]="COL2ROW1",r[r.COL2ROW2=10]="COL2ROW2",r[r.COL2ROW3=11]="COL2ROW3",r[r.COL3ROW0=12]="COL3ROW0",r[r.COL3ROW1=13]="COL3ROW1",r[r.COL3ROW2=14]="COL3ROW2",r[r.COL3ROW3=15]="COL3ROW3";var iU=45*Math.PI/180,ik=Object.freeze([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]),iG=class extends tO{static get IDENTITY(){return c||Object.freeze(c=new iG),c}static get ZERO(){return u||Object.freeze(u=new iG([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])),u}get ELEMENTS(){return 16}get RANK(){return 4}get INDICES(){return l}constructor(e){super(-0,-0,-0,-0,-0,-0,-0,-0,-0,-0,-0,-0,-0,-0,-0,-0),1==arguments.length&&Array.isArray(e)?this.copy(e):this.identity()}copy(e){return this[0]=e[0],this[1]=e[1],this[2]=e[2],this[3]=e[3],this[4]=e[4],this[5]=e[5],this[6]=e[6],this[7]=e[7],this[8]=e[8],this[9]=e[9],this[10]=e[10],this[11]=e[11],this[12]=e[12],this[13]=e[13],this[14]=e[14],this[15]=e[15],this.check()}set(e,t,r,i,n,s,o,a,l,u,c,h,f,d,p,g){return this[0]=e,this[1]=t,this[2]=r,this[3]=i,this[4]=n,this[5]=s,this[6]=o,this[7]=a,this[8]=l,this[9]=u,this[10]=c,this[11]=h,this[12]=f,this[13]=d,this[14]=p,this[15]=g,this.check()}setRowMajor(e,t,r,i,n,s,o,a,l,u,c,h,f,d,p,g){return this[0]=e,this[1]=n,this[2]=l,this[3]=f,this[4]=t,this[5]=s,this[6]=u,this[7]=d,this[8]=r,this[9]=o,this[10]=c,this[11]=p,this[12]=i,this[13]=a,this[14]=h,this[15]=g,this.check()}toRowMajor(e){return e[0]=this[0],e[1]=this[4],e[2]=this[8],e[3]=this[12],e[4]=this[1],e[5]=this[5],e[6]=this[9],e[7]=this[13],e[8]=this[2],e[9]=this[6],e[10]=this[10],e[11]=this[14],e[12]=this[3],e[13]=this[7],e[14]=this[11],e[15]=this[15],e}identity(){return this.copy(ik)}fromObject(e){return this.check()}fromQuaternion(e){return rD(this,e),this.check()}frustum(e){let{left:t,right:r,bottom:i,top:n,near:s=.1,far:o=500}=e;return o===1/0?(this[0]=2*s/(r-t),this[1]=0,this[2]=0,this[3]=0,this[4]=0,this[5]=2*s/(n-i),this[6]=0,this[7]=0,this[8]=(r+t)/(r-t),this[9]=(n+i)/(n-i),this[10]=-1,this[11]=-1,this[12]=0,this[13]=0,this[14]=-2*s,this[15]=0):rU(this,t,r,i,n,s,o),this.check()}lookAt(e){let{eye:t,center:r=[0,0,0],up:i=[0,1,0]}=e;return rX(this,t,r,i),this.check()}ortho(e){let{left:t,right:r,bottom:i,top:n,near:s=.1,far:o=500}=e;return rj(this,t,r,i,n,s,o),this.check()}orthographic(e){let{fovy:t=iU,aspect:r=1,focalDistance:i=1,near:n=.1,far:s=500}=e;iH(t);let o=i*Math.tan(t/2),a=o*r;return this.ortho({left:-a,right:a,bottom:-o,top:o,near:n,far:s})}perspective(e){let{fovy:t=45*Math.PI/180,aspect:r=1,near:i=.1,far:n=500}=e;return iH(t),rG(this,t,r,i,n),this.check()}determinant(){return rg(this)}getScale(e=[-0,-0,-0]){return e[0]=Math.sqrt(this[0]*this[0]+this[1]*this[1]+this[2]*this[2]),e[1]=Math.sqrt(this[4]*this[4]+this[5]*this[5]+this[6]*this[6]),e[2]=Math.sqrt(this[8]*this[8]+this[9]*this[9]+this[10]*this[10]),e}getTranslation(e=[-0,-0,-0]){return e[0]=this[12],e[1]=this[13],e[2]=this[14],e}getRotation(e,t){e=e||[-0,-0,-0,-0,-0,-0,-0,-0,-0,-0,-0,-0,-0,-0,-0,-0],t=t||[-0,-0,-0];let r=this.getScale(t),i=1/r[0],n=1/r[1],s=1/r[2];return e[0]=this[0]*i,e[1]=this[1]*n,e[2]=this[2]*s,e[3]=0,e[4]=this[4]*i,e[5]=this[5]*n,e[6]=this[6]*s,e[7]=0,e[8]=this[8]*i,e[9]=this[9]*n,e[10]=this[10]*s,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}getRotationMatrix3(e,t){e=e||[-0,-0,-0,-0,-0,-0,-0,-0,-0],t=t||[-0,-0,-0];let r=this.getScale(t),i=1/r[0],n=1/r[1],s=1/r[2];return e[0]=this[0]*i,e[1]=this[1]*n,e[2]=this[2]*s,e[3]=this[4]*i,e[4]=this[5]*n,e[5]=this[6]*s,e[6]=this[8]*i,e[7]=this[9]*n,e[8]=this[10]*s,e}transpose(){return rf(this,this),this.check()}invert(){return rd(this,this),this.check()}multiplyLeft(e){return r_(this,e,this),this.check()}multiplyRight(e){return r_(this,this,e),this.check()}rotateX(e){return rb(this,this,e),this.check()}rotateY(e){return rA(this,this,e),this.check()}rotateZ(e){return ry(this,this,e),this.check()}rotateXYZ(e){return this.rotateX(e[0]).rotateY(e[1]).rotateZ(e[2])}rotateAxis(e,t){return rv(this,this,e,t),this.check()}scale(e){return rE(this,this,Array.isArray(e)?e:[e,e,e]),this.check()}translate(e){return rm(this,this,e),this.check()}transform(e,t){return 4===e.length?(H(t=iR(t||[-0,-0,-0,-0],e,this),4),t):this.transformAsPoint(e,t)}transformAsPoint(e,t){let r;let{length:i}=e;switch(i){case 2:r=eR(t||[-0,-0],e,this);break;case 3:r=tc(t||[-0,-0,-0],e,this);break;default:throw Error("Illegal vector")}return H(r,e.length),r}transformAsVector(e,t){let r;switch(e.length){case 2:r=ek(t||[-0,-0],e,this);break;case 3:r=eG(t||[-0,-0,-0],e,this);break;default:throw Error("Illegal vector")}return H(r,e.length),r}transformPoint(e,t){return this.transformAsPoint(e,t)}transformVector(e,t){return this.transformAsPoint(e,t)}transformDirection(e,t){return this.transformAsVector(e,t)}makeRotationX(e){return this.identity().rotateX(e)}makeTranslation(e,t,r){return this.identity().translate([e,t,r])}};function iH(e){if(e>2*Math.PI)throw Error("expected radians")}var iV={};function iz(){let e=new W(4);return W!=Float32Array&&(e[0]=0,e[1]=0,e[2]=0),e[3]=1,e}function ij(e){return e[0]=0,e[1]=0,e[2]=0,e[3]=1,e}function iW(e,t,r){let i=Math.sin(r*=.5);return e[0]=i*t[0],e[1]=i*t[1],e[2]=i*t[2],e[3]=Math.cos(r),e}function iX(e,t){let r=2*Math.acos(t[3]),i=Math.sin(r/2);return i>1e-6?(e[0]=t[0]/i,e[1]=t[1]/i,e[2]=t[2]/i):(e[0]=1,e[1]=0,e[2]=0),r}function i$(e,t){let r=nn(e,t);return Math.acos(2*r*r-1)}function iq(e,t,r){let i=t[0],n=t[1],s=t[2],o=t[3],a=r[0],l=r[1],u=r[2],c=r[3];return e[0]=i*c+o*a+n*u-s*l,e[1]=n*c+o*l+s*a-i*u,e[2]=s*c+o*u+i*l-n*a,e[3]=o*c-i*a-n*l-s*u,e}function iY(e,t,r){r*=.5;let i=t[0],n=t[1],s=t[2],o=t[3],a=Math.sin(r),l=Math.cos(r);return e[0]=i*l+o*a,e[1]=n*l+s*a,e[2]=s*l-n*a,e[3]=o*l-i*a,e}function iZ(e,t,r){r*=.5;let i=t[0],n=t[1],s=t[2],o=t[3],a=Math.sin(r),l=Math.cos(r);return e[0]=i*l-s*a,e[1]=n*l+o*a,e[2]=s*l+i*a,e[3]=o*l-n*a,e}function iK(e,t,r){r*=.5;let i=t[0],n=t[1],s=t[2],o=t[3],a=Math.sin(r),l=Math.cos(r);return e[0]=i*l+n*a,e[1]=n*l-i*a,e[2]=s*l+o*a,e[3]=o*l-s*a,e}function iQ(e,t){let r=t[0],i=t[1],n=t[2];return e[0]=r,e[1]=i,e[2]=n,e[3]=Math.sqrt(Math.abs(1-r*r-i*i-n*n)),e}function iJ(e,t){let r=t[0],i=t[1],n=t[2],s=t[3],o=Math.sqrt(r*r+i*i+n*n),a=Math.exp(s),l=o>0?a*Math.sin(o)/o:0;return e[0]=r*l,e[1]=i*l,e[2]=n*l,e[3]=a*Math.cos(o),e}function i0(e,t){let r=t[0],i=t[1],n=t[2],s=t[3],o=Math.sqrt(r*r+i*i+n*n),a=o>0?Math.atan2(o,s)/o:0;return e[0]=r*a,e[1]=i*a,e[2]=n*a,e[3]=.5*Math.log(r*r+i*i+n*n+s*s),e}function i1(e,t,r){return i0(e,t),ni(e,e,r),iJ(e,e),e}function i2(e,t,r,i){let n,s,o,a,l;let u=t[0],c=t[1],h=t[2],f=t[3],d=r[0],p=r[1],g=r[2],_=r[3];return(n=u*d+c*p+h*g+f*_)<0&&(n=-n,d=-d,p=-p,g=-g,_=-_),1-n>1e-6?(l=Math.sin(s=Math.acos(n)),o=Math.sin((1-i)*s)/l,a=Math.sin(i*s)/l):(o=1-i,a=i),e[0]=o*u+a*d,e[1]=o*c+a*p,e[2]=o*h+a*g,e[3]=o*f+a*_,e}function i3(e,t){let r=t[0],i=t[1],n=t[2],s=t[3],o=r*r+i*i+n*n+s*s,a=o?1/o:0;return e[0]=-r*a,e[1]=-i*a,e[2]=-n*a,e[3]=s*a,e}function i4(e,t){return e[0]=-t[0],e[1]=-t[1],e[2]=-t[2],e[3]=t[3],e}function i6(e,t){let r;let i=t[0]+t[4]+t[8];if(i>0)r=Math.sqrt(i+1),e[3]=.5*r,r=.5/r,e[0]=(t[5]-t[7])*r,e[1]=(t[6]-t[2])*r,e[2]=(t[1]-t[3])*r;else{let i=0;t[4]>t[0]&&(i=1),t[8]>t[3*i+i]&&(i=2);let n=(i+1)%3,s=(i+2)%3;r=Math.sqrt(t[3*i+i]-t[3*n+n]-t[3*s+s]+1),e[i]=.5*r,r=.5/r,e[3]=(t[3*n+s]-t[3*s+n])*r,e[n]=(t[3*n+i]+t[3*i+n])*r,e[s]=(t[3*s+i]+t[3*i+s])*r}return e}function i5(e){return`quat(${e[0]}, ${e[1]}, ${e[2]}, ${e[3]})`}_(iV,{add:()=>nt,calculateW:()=>iQ,clone:()=>i8,conjugate:()=>i4,copy:()=>i9,create:()=>iz,dot:()=>nn,equals:()=>nf,exactEquals:()=>nh,exp:()=>iJ,fromMat3:()=>i6,fromValues:()=>i7,getAngle:()=>i$,getAxisAngle:()=>iX,identity:()=>ij,invert:()=>i3,len:()=>na,length:()=>no,lerp:()=>ns,ln:()=>i0,mul:()=>nr,multiply:()=>iq,normalize:()=>nc,pow:()=>i1,rotateX:()=>iY,rotateY:()=>iZ,rotateZ:()=>iK,rotationTo:()=>nd,scale:()=>ni,set:()=>ne,setAxes:()=>ng,setAxisAngle:()=>iW,slerp:()=>i2,sqlerp:()=>np,sqrLen:()=>nu,squaredLength:()=>nl,str:()=>i5});var i8=r5,i7=r8,i9=r7,ne=r9,nt=ie,nr=iq,ni=ic,nn=ib,ns=iy,no=ig,na=no,nl=i_,nu=nl,nc=iv,nh=iC;function nf(e,t){return Math.abs(ib(e,t))>=.999999}var nd=function(){let e=ej(),t=e$(1,0,0),r=e$(0,1,0);return function(i,n,s){let o=ti(n,s);return o<-.999999?(tn(e,t,n),1e-6>tM(e)&&tn(e,r,n),tr(e,e),iW(i,e,Math.PI),i):o>.999999?(i[0]=0,i[1]=0,i[2]=0,i[3]=1,i):(tn(e,n,s),i[0]=e[0],i[1]=e[1],i[2]=e[2],i[3]=1+o,nc(i,i))}}(),np=function(){let e=iz(),t=iz();return function(r,i,n,s,o,a){return i2(e,i,o,a),i2(t,n,s,a),i2(r,e,t,2*a*(1-a)),r}}(),ng=function(){let e=tL();return function(t,r,i,n){return e[0]=i[0],e[3]=i[1],e[6]=i[2],e[1]=n[0],e[4]=n[1],e[7]=n[2],e[2]=-r[0],e[5]=-r[1],e[8]=-r[2],nc(t,i6(t,e))}}(),n_=[0,0,0,1],nm=class extends k{constructor(e=0,t=0,r=0,i=1){super(-0,-0,-0,-0),Array.isArray(e)&&1==arguments.length?this.copy(e):this.set(e,t,r,i)}copy(e){return this[0]=e[0],this[1]=e[1],this[2]=e[2],this[3]=e[3],this.check()}set(e,t,r,i){return this[0]=e,this[1]=t,this[2]=r,this[3]=i,this.check()}fromObject(e){return this[0]=e.x,this[1]=e.y,this[2]=e.z,this[3]=e.w,this.check()}fromMatrix3(e){return i6(this,e),this.check()}fromAxisRotation(e,t){return iW(this,e,t),this.check()}identity(){return ij(this),this.check()}setAxisAngle(e,t){return this.fromAxisRotation(e,t)}get ELEMENTS(){return 4}get x(){return this[0]}set x(e){this[0]=G(e)}get y(){return this[1]}set y(e){this[1]=G(e)}get z(){return this[2]}set z(e){this[2]=G(e)}get w(){return this[3]}set w(e){this[3]=G(e)}len(){return no(this)}lengthSquared(){return nl(this)}dot(e){return nn(this,e)}rotationTo(e,t){return nd(this,e,t),this.check()}add(e){return nt(this,this,e),this.check()}calculateW(){return iQ(this,this),this.check()}conjugate(){return i4(this,this),this.check()}invert(){return i3(this,this),this.check()}lerp(e,t,r){return void 0===r?this.lerp(this,e,t):(ns(this,e,t,r),this.check())}multiplyRight(e){return iq(this,this,e),this.check()}multiplyLeft(e){return iq(this,e,this),this.check()}normalize(){let e=this.len(),t=e>0?1/e:0;return this[0]=this[0]*t,this[1]=this[1]*t,this[2]=this[2]*t,this[3]=this[3]*t,0===e&&(this[3]=1),this.check()}rotateX(e){return iY(this,this,e),this.check()}rotateY(e){return iZ(this,this,e),this.check()}rotateZ(e){return iK(this,this,e),this.check()}scale(e){return ni(this,this,e),this.check()}slerp(e,t,r){let i,n,s;switch(arguments.length){case 1:({start:i=n_,target:n,ratio:s}=e);break;case 2:i=this,n=e,s=t;break;default:i=e,n=t,s=r}return i2(this,i,n,s),this.check()}transformVector4(e,t=new tN){return iS(t,e,this),H(t,4)}lengthSq(){return this.lengthSquared()}setFromAxisAngle(e,t){return this.setAxisAngle(e,t)}premultiply(e){return this.multiplyLeft(e)}multiply(e){return this.multiplyRight(e)}},nE=class{constructor({phi:e=0,theta:t=0,radius:r=1,bearing:i,pitch:n,altitude:s,radiusScale:o=6371e3}={}){this.phi=e,this.theta=t,this.radius=r||s||1,this.radiusScale=o||1,void 0!==i&&(this.bearing=i),void 0!==n&&(this.pitch=n),this.check()}toString(){return this.formatString(b)}formatString({printTypes:e=!1}){let t=y;return`${e?"Spherical":""}[rho:${t(this.radius)},theta:${t(this.theta)},phi:${t(this.phi)}]`}equals(e){return B(this.radius,e.radius)&&B(this.theta,e.theta)&&B(this.phi,e.phi)}exactEquals(e){return this.radius===e.radius&&this.theta===e.theta&&this.phi===e.phi}get bearing(){return 180-C(this.phi)}set bearing(e){this.phi=Math.PI-I(e)}get pitch(){return C(this.theta)}set pitch(e){this.theta=I(e)}get longitude(){return C(this.phi)}get latitude(){return C(this.theta)}get lng(){return C(this.phi)}get lat(){return C(this.theta)}get z(){return(this.radius-1)*this.radiusScale}set(e,t,r){return this.radius=e,this.phi=t,this.theta=r,this.check()}clone(){return new nE().copy(this)}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this.check()}fromLngLatZ([e,t,r]){return this.radius=1+r/this.radiusScale,this.phi=I(t),this.theta=I(e),this.check()}fromVector3(e){return this.radius=eX(e),this.radius>0&&(this.theta=Math.atan2(e[0],e[1]),this.phi=Math.acos(F(e[2]/this.radius,-1,1))),this.check()}toVector3(){return new tw(0,0,this.radius).rotateX({radians:this.theta}).rotateZ({radians:this.phi})}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}check(){if(!Number.isFinite(this.phi)||!Number.isFinite(this.theta)||!(this.radius>0))throw Error("SphericalCoordinates: some fields set to invalid numbers");return this}},nv="Unknown Euler angle order";(i=h||(h={}))[i.ZYX=0]="ZYX",i[i.YXZ=1]="YXZ",i[i.XZY=2]="XZY",i[i.ZXY=3]="ZXY",i[i.YZX=4]="YZX",i[i.XYZ=5]="XYZ";var nb=class extends k{static get ZYX(){return h.ZYX}static get YXZ(){return h.YXZ}static get XZY(){return h.XZY}static get ZXY(){return h.ZXY}static get YZX(){return h.YZX}static get XYZ(){return h.XYZ}static get RollPitchYaw(){return h.ZYX}static get DefaultOrder(){return h.ZYX}static get RotationOrders(){return h}static rotationOrder(e){return h[e]}get ELEMENTS(){return 4}constructor(e=0,t=0,r=0,i=nb.DefaultOrder){super(-0,-0,-0,-0),arguments.length>0&&Array.isArray(arguments[0])?this.fromVector3(...arguments):this.set(e,t,r,i)}fromQuaternion(e){let[t,r,i,n]=e,s=r*r,o=-2*(t*i-n*r),a=Math.asin(o=(o=o>1?1:o)<-1?-1:o);return this.set(Math.atan2(2*(r*i+n*t),-2*(t*t+s)+1),a,Math.atan2(2*(t*r+n*i),-2*(s+i*i)+1),nb.RollPitchYaw)}fromObject(e){throw Error("not implemented")}copy(e){return this[0]=e[0],this[1]=e[1],this[2]=e[2],this[3]=Number.isFinite(e[3])||this.order,this.check()}set(e=0,t=0,r=0,i){return this[0]=e,this[1]=t,this[2]=r,this[3]=Number.isFinite(i)?i:this[3],this.check()}validate(){var e;return(e=this[3])>=0&&e<6&&Number.isFinite(this[0])&&Number.isFinite(this[1])&&Number.isFinite(this[2])}toArray(e=[],t=0){return e[t]=this[0],e[t+1]=this[1],e[t+2]=this[2],e}toArray4(e=[],t=0){return e[t]=this[0],e[t+1]=this[1],e[t+2]=this[2],e[t+3]=this[3],e}toVector3(e=[-0,-0,-0]){return e[0]=this[0],e[1]=this[1],e[2]=this[2],e}get x(){return this[0]}set x(e){this[0]=G(e)}get y(){return this[1]}set y(e){this[1]=G(e)}get z(){return this[2]}set z(e){this[2]=G(e)}get alpha(){return this[0]}set alpha(e){this[0]=G(e)}get beta(){return this[1]}set beta(e){this[1]=G(e)}get gamma(){return this[2]}set gamma(e){this[2]=G(e)}get phi(){return this[0]}set phi(e){this[0]=G(e)}get theta(){return this[1]}set theta(e){this[1]=G(e)}get psi(){return this[2]}set psi(e){this[2]=G(e)}get roll(){return this[0]}set roll(e){this[0]=G(e)}get pitch(){return this[1]}set pitch(e){this[1]=G(e)}get yaw(){return this[2]}set yaw(e){this[2]=G(e)}get order(){return this[3]}set order(e){this[3]=function(e){if(e<0&&e>=6)throw Error(nv);return e}(e)}fromVector3(e,t){return this.set(e[0],e[1],e[2],Number.isFinite(t)?t:this[3])}fromArray(e,t=0){return this[0]=e[0+t],this[1]=e[1+t],this[2]=e[2+t],void 0!==e[3]&&(this[3]=e[3]),this.check()}fromRollPitchYaw(e,t,r){return this.set(e,t,r,h.ZYX)}fromRotationMatrix(e,t=nb.DefaultOrder){return this._fromRotationMatrix(e,t),this.check()}getRotationMatrix(e){return this._getRotationMatrix(e)}getQuaternion(){let e=new nm;switch(this[3]){case h.XYZ:return e.rotateX(this[0]).rotateY(this[1]).rotateZ(this[2]);case h.YXZ:return e.rotateY(this[0]).rotateX(this[1]).rotateZ(this[2]);case h.ZXY:return e.rotateZ(this[0]).rotateX(this[1]).rotateY(this[2]);case h.ZYX:return e.rotateZ(this[0]).rotateY(this[1]).rotateX(this[2]);case h.YZX:return e.rotateY(this[0]).rotateZ(this[1]).rotateX(this[2]);case h.XZY:return e.rotateX(this[0]).rotateZ(this[1]).rotateY(this[2]);default:throw Error(nv)}}_fromRotationMatrix(e,t=nb.DefaultOrder){let r=e[0],i=e[4],n=e[8],s=e[1],o=e[5],a=e[9],l=e[2],u=e[6],c=e[10];switch(t=t||this[3]){case nb.XYZ:this[1]=Math.asin(F(n,-1,1)),.99999>Math.abs(n)?(this[0]=Math.atan2(-a,c),this[2]=Math.atan2(-i,r)):(this[0]=Math.atan2(u,o),this[2]=0);break;case nb.YXZ:this[0]=Math.asin(-F(a,-1,1)),.99999>Math.abs(a)?(this[1]=Math.atan2(n,c),this[2]=Math.atan2(s,o)):(this[1]=Math.atan2(-l,r),this[2]=0);break;case nb.ZXY:this[0]=Math.asin(F(u,-1,1)),.99999>Math.abs(u)?(this[1]=Math.atan2(-l,c),this[2]=Math.atan2(-i,o)):(this[1]=0,this[2]=Math.atan2(s,r));break;case nb.ZYX:this[1]=Math.asin(-F(l,-1,1)),.99999>Math.abs(l)?(this[0]=Math.atan2(u,c),this[2]=Math.atan2(s,r)):(this[0]=0,this[2]=Math.atan2(-i,o));break;case nb.YZX:this[2]=Math.asin(F(s,-1,1)),.99999>Math.abs(s)?(this[0]=Math.atan2(-a,o),this[1]=Math.atan2(-l,r)):(this[0]=0,this[1]=Math.atan2(n,c));break;case nb.XZY:this[2]=Math.asin(-F(i,-1,1)),.99999>Math.abs(i)?(this[0]=Math.atan2(u,o),this[1]=Math.atan2(n,r)):(this[0]=Math.atan2(-a,c),this[1]=0);break;default:throw Error(nv)}return this[3]=t,this}_getRotationMatrix(e){let t=e||[-0,-0,-0,-0,-0,-0,-0,-0,-0,-0,-0,-0,-0,-0,-0,-0],r=this.x,i=this.y,n=this.z,s=Math.cos(r),o=Math.cos(i),a=Math.cos(n),l=Math.sin(r),u=Math.sin(i),c=Math.sin(n);switch(this[3]){case nb.XYZ:{let e=s*a,r=s*c,i=l*a,n=l*c;t[0]=o*a,t[4]=-o*c,t[8]=u,t[1]=r+i*u,t[5]=e-n*u,t[9]=-l*o,t[2]=n-e*u,t[6]=i+r*u,t[10]=s*o;break}case nb.YXZ:{let e=o*a,r=o*c,i=u*a,n=u*c;t[0]=e+n*l,t[4]=i*l-r,t[8]=s*u,t[1]=s*c,t[5]=s*a,t[9]=-l,t[2]=r*l-i,t[6]=n+e*l,t[10]=s*o;break}case nb.ZXY:{let e=o*a,r=o*c,i=u*a,n=u*c;t[0]=e-n*l,t[4]=-s*c,t[8]=i+r*l,t[1]=r+i*l,t[5]=s*a,t[9]=n-e*l,t[2]=-s*u,t[6]=l,t[10]=s*o;break}case nb.ZYX:{let e=s*a,r=s*c,i=l*a,n=l*c;t[0]=o*a,t[4]=i*u-r,t[8]=e*u+n,t[1]=o*c,t[5]=n*u+e,t[9]=r*u-i,t[2]=-u,t[6]=l*o,t[10]=s*o;break}case nb.YZX:{let e=s*o,r=s*u,i=l*o,n=l*u;t[0]=o*a,t[4]=n-e*c,t[8]=i*c+r,t[1]=c,t[5]=s*a,t[9]=-l*a,t[2]=-u*a,t[6]=r*c+i,t[10]=e-n*c;break}case nb.XZY:{let e=s*o,r=s*u,i=l*o,n=l*u;t[0]=o*a,t[4]=-c,t[8]=u*a,t[1]=e*c+n,t[5]=s*a,t[9]=r*c-i,t[2]=i*c-r,t[6]=l*a,t[10]=n*c+e;break}default:throw Error(nv)}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}toQuaternion(){let e=Math.cos(.5*this.yaw),t=Math.sin(.5*this.yaw),r=Math.cos(.5*this.roll),i=Math.sin(.5*this.roll),n=Math.cos(.5*this.pitch),s=Math.sin(.5*this.pitch);return new nm(e*i*n-t*r*s,e*r*s+t*i*n,t*r*n-e*i*s,e*r*n+t*i*s)}},nA=class{constructor({x:e=0,y:t=0,z:r=0,roll:i=0,pitch:n=0,yaw:s=0,position:o,orientation:a}={}){Array.isArray(o)&&3===o.length?this.position=new tw(o):this.position=new tw(e,t,r),Array.isArray(a)&&4===a.length?this.orientation=new nb(a,a[3]):this.orientation=new nb(i,n,s,nb.RollPitchYaw)}get x(){return this.position.x}set x(e){this.position.x=e}get y(){return this.position.y}set y(e){this.position.y=e}get z(){return this.position.z}set z(e){this.position.z=e}get roll(){return this.orientation.roll}set roll(e){this.orientation.roll=e}get pitch(){return this.orientation.pitch}set pitch(e){this.orientation.pitch=e}get yaw(){return this.orientation.yaw}set yaw(e){this.orientation.yaw=e}getPosition(){return this.position}getOrientation(){return this.orientation}equals(e){return!!e&&this.position.equals(e.position)&&this.orientation.equals(e.orientation)}exactEquals(e){return!!e&&this.position.exactEquals(e.position)&&this.orientation.exactEquals(e.orientation)}getTransformationMatrix(){let e=Math.sin(this.roll),t=Math.sin(this.pitch),r=Math.sin(this.yaw),i=Math.cos(this.roll),n=Math.cos(this.pitch),s=Math.cos(this.yaw);return new iG().setRowMajor(s*n,-r*i+s*t*e,r*e+s*t*i,this.x,r*n,s*i+r*t*e,-s*e+r*t*i,this.y,-t,n*e,n*i,this.z,0,0,0,1)}getTransformationMatrixFromPose(e){return new iG().multiplyRight(this.getTransformationMatrix()).multiplyRight(e.getTransformationMatrix().invert())}getTransformationMatrixToPose(e){return new iG().multiplyRight(e.getTransformationMatrix()).multiplyRight(this.getTransformationMatrix().invert())}},ny={};_(ny,{EPSILON1:()=>nT,EPSILON10:()=>nO,EPSILON11:()=>nP,EPSILON12:()=>nL,EPSILON13:()=>nF,EPSILON14:()=>nB,EPSILON15:()=>nD,EPSILON16:()=>nU,EPSILON17:()=>nk,EPSILON18:()=>nG,EPSILON19:()=>nH,EPSILON2:()=>nR,EPSILON20:()=>nV,EPSILON3:()=>nS,EPSILON4:()=>nM,EPSILON5:()=>nI,EPSILON6:()=>nC,EPSILON7:()=>nx,EPSILON8:()=>nw,EPSILON9:()=>nN,PI_OVER_FOUR:()=>nj,PI_OVER_SIX:()=>nW,PI_OVER_TWO:()=>nz,TWO_PI:()=>nX});var nT=.1,nR=.01,nS=.001,nM=1e-4,nI=1e-5,nC=1e-6,nx=1e-7,nw=1e-8,nN=1e-9,nO=1e-10,nP=1e-11,nL=1e-12,nF=1e-13,nB=1e-14,nD=1e-15,nU=1e-16,nk=1e-17,nG=1e-18,nH=1e-19,nV=1e-20,nz=Math.PI/2,nj=Math.PI/4,nW=Math.PI/6,nX=2*Math.PI},14972:function(e,t,r){var i=Object.defineProperty,n=Object.getOwnPropertyDescriptor,s=Object.getOwnPropertyNames,o=Object.prototype.hasOwnProperty,a={};((e,t)=>{for(var r in t)i(e,r,{get:t[r],enumerable:!0})})(a,{Polygon:()=>m,WINDING:()=>c,_Polygon:()=>m,clipPolygon:()=>U,clipPolyline:()=>D,cutPolygonByGrid:()=>V,cutPolygonByMercatorBounds:()=>$,cutPolylineByGrid:()=>H,cutPolylineByMercatorBounds:()=>X,earcut:()=>E,forEachSegmentInPolygon:()=>g,getPolygonSignedArea:()=>p,getPolygonWindingDirection:()=>f,modifyPolygonWindingDirection:()=>h}),e.exports=((e,t,r,a)=>{if(t&&"object"==typeof t||"function"==typeof t)for(let l of s(t))o.call(e,l)||l===r||i(e,l,{get:()=>t[l],enumerable:!(a=n(t,l))||a.enumerable});return e})(i({},"__esModule",{value:!0}),a);var l=r(6049),u=r(6049),c={CLOCKWISE:1,COUNTER_CLOCKWISE:-1};function h(e,t,r={}){return f(e,r)!==t&&(function(e,t){let{start:r=0,end:i=e.length,size:n=2}=t,s=(i-r)/n,o=Math.floor(s/2);for(let t=0;t<o;++t){let i=r+t*n,o=r+(s-1-t)*n;for(let t=0;t<n;++t){let r=e[i+t];e[i+t]=e[o+t],e[o+t]=r}}}(e,r),!0)}function f(e,t={}){return Math.sign(p(e,t))}var d={x:0,y:1,z:2};function p(e,t={}){let{start:r=0,end:i=e.length,plane:n="xy"}=t,s=t.size||2,o=0,a=d[n[0]],l=d[n[1]];for(let t=r,n=i-s;t<i;t+=s)o+=(e[t+a]-e[n+a])*(e[t+l]+e[n+l]),n=t;return o/2}function g(e,t,r={}){let{start:i=0,end:n=e.length,size:s=2,isClosed:o}=r,a=(n-i)/s;for(let r=0;r<a-1;++r)t(e[i+r*s],e[i+r*s+1],e[i+(r+1)*s],e[i+(r+1)*s+1],r,r+1);let l=i+(a-1)*s;o||(0,u.equals)(e[i],e[l])&&(0,u.equals)(e[i+1],e[l+1])||t(e[l],e[l+1],e[i],e[i+1],a-1,0)}function _(e,t={}){let{start:r=0,end:i=e.length,plane:n="xy"}=t,s=0,o=d[n[0]],a=d[n[1]];for(let t=r,n=i-1;t<i;++t)s+=(e[t][o]-e[n][o])*(e[t][a]+e[n][a]),n=t;return s/2}var m=class{constructor(e,t={}){this.points=e,this.isFlatArray=!(0,l.isArray)(e[0]),this.options={start:t.start||0,end:t.end||e.length,size:t.size||2,isClosed:t.isClosed},Object.freeze(this)}getSignedArea(){return this.isFlatArray?p(this.points,this.options):_(this.points,this.options)}getArea(){return Math.abs(this.getSignedArea())}getWindingDirection(){return Math.sign(this.getSignedArea())}forEachSegment(e){this.isFlatArray?g(this.points,(t,r,i,n,s,o)=>{e([t,r],[i,n],s,o)},this.options):function(e,t,r={}){let{start:i=0,end:n=e.length,isClosed:s}=r;for(let r=i;r<n-1;++r)t(e[r],e[r+1],r,r+1);s||(0,u.equals)(e[n-1],e[0])||t(e[n-1],e[0],n-1,0)}(this.points,e,this.options)}modifyWindingDirection(e){return this.isFlatArray?h(this.points,e,this.options):function(e,t,r={}){return function(e,t={}){return Math.sign(_(e,t))}(e,r)!==t&&(e.reverse(),!0)}(this.points,e,this.options)}};function E(e,t,r=2,i,n="xy"){let s,o,a,l,u,c,h;let f=t&&t.length,d=f?t[0]*r:e.length,p=v(e,0,d,r,!0,i&&i[0],n),g=[];if(!p||p.next===p.prev)return g;if(f&&(p=function(e,t,r,i,n,s){let o,a,l,u,c;let h=[];for(o=0,a=t.length;o<a;o++)l=t[o]*i,u=o<a-1?t[o+1]*i:e.length,(c=v(e,l,u,i,!1,n&&n[o+1],s))===c.next&&(c.steiner=!0),h.push(function(e){let t=e,r=e;do(t.x<r.x||t.x===r.x&&t.y<r.y)&&(r=t),t=t.next;while(t!==e);return r}(c));for(h.sort(A),o=0;o<h.length;o++)r=function(e,t){let r=function(e,t){let r,i,n=t,s=e.x,o=e.y,a=-1/0;do{if(o<=n.y&&o>=n.next.y&&n.next.y!==n.y){let e=n.x+(o-n.y)*(n.next.x-n.x)/(n.next.y-n.y);if(e<=s&&e>a&&(a=e,r=n.x<n.next.x?n:n.next,e===s))return r}n=n.next}while(n!==t);if(!r)return null;let l=r,u=r.x,c=r.y,h=1/0;n=r;do{var f,d;s>=n.x&&n.x>=u&&s!==n.x&&T(o<c?s:a,o,u,c,o<c?a:s,o,n.x,n.y)&&(i=Math.abs(o-n.y)/(s-n.x),x(n,e)&&(i<h||i===h&&(n.x>r.x||n.x===r.x&&(f=r,d=n,0>R(f.prev,f,d.prev)&&0>R(d.next,f,f.next))))&&(r=n,h=i)),n=n.next}while(n!==l);return r}(e,t);if(!r)return t;let i=w(r,e);return b(i,i.next),b(r,r.next)}(h[o],r);return r}(e,t,p,r,i,n)),e.length>80*r){l=o=e[0],u=a=e[1];for(let t=r;t<d;t+=r)c=e[t],h=e[t+1],c<l&&(l=c),h<u&&(u=h),c>o&&(o=c),h>a&&(a=h);s=0!==(s=Math.max(o-l,a-u))?32767/s:0}return function e(t,r,i,n,s,o,a){let l,u;if(!t)return;!a&&o&&function(e,t,r,i){let n=e;do 0===n.z&&(n.z=y(n.x,n.y,t,r,i)),n.prevZ=n.prev,n.nextZ=n.next,n=n.next;while(n!==e);n.prevZ.nextZ=null,n.prevZ=null,function(e){let t,r,i,n,s,o,a,l;let u=1;do{for(n=e,e=null,l=null,i=0;n;){for(i++,o=n,s=0,r=0;r<u&&(s++,o=o.nextZ);r++);for(a=u;s>0||a>0&&o;)0!==s&&(0===a||!o||n.z<=o.z)?(t=n,n=n.nextZ,s--):(t=o,o=o.nextZ,a--),l?l.nextZ=t:e=t,t.prevZ=l,l=t;n=o}l.nextZ=null,u*=2}while(i>1)}(n)}(t,n,s,o);let c=t;for(;t.prev!==t.next;){if(l=t.prev,u=t.next,o?function(e,t,r,i){let n=e.prev,s=e.next;if(R(n,e,s)>=0)return!1;let o=n.x,a=e.x,l=s.x,u=n.y,c=e.y,h=s.y,f=o<a?o<l?o:l:a<l?a:l,d=u<c?u<h?u:h:c<h?c:h,p=o>a?o>l?o:l:a>l?a:l,g=u>c?u>h?u:h:c>h?c:h,_=y(f,d,t,r,i),m=y(p,g,t,r,i),E=e.prevZ,v=e.nextZ;for(;E&&E.z>=_&&v&&v.z<=m;){if(E.x>=f&&E.x<=p&&E.y>=d&&E.y<=g&&E!==n&&E!==s&&T(o,u,a,c,l,h,E.x,E.y)&&R(E.prev,E,E.next)>=0||(E=E.prevZ,v.x>=f&&v.x<=p&&v.y>=d&&v.y<=g&&v!==n&&v!==s&&T(o,u,a,c,l,h,v.x,v.y)&&R(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;E&&E.z>=_;){if(E.x>=f&&E.x<=p&&E.y>=d&&E.y<=g&&E!==n&&E!==s&&T(o,u,a,c,l,h,E.x,E.y)&&R(E.prev,E,E.next)>=0)return!1;E=E.prevZ}for(;v&&v.z<=m;){if(v.x>=f&&v.x<=p&&v.y>=d&&v.y<=g&&v!==n&&v!==s&&T(o,u,a,c,l,h,v.x,v.y)&&R(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}(t,n,s,o):function(e){let t=e.prev,r=e.next;if(R(t,e,r)>=0)return!1;let i=t.x,n=e.x,s=r.x,o=t.y,a=e.y,l=r.y,u=i<n?i<s?i:s:n<s?n:s,c=o<a?o<l?o:l:a<l?a:l,h=i>n?i>s?i:s:n>s?n:s,f=o>a?o>l?o:l:a>l?a:l,d=r.next;for(;d!==t;){if(d.x>=u&&d.x<=h&&d.y>=c&&d.y<=f&&T(i,o,n,a,s,l,d.x,d.y)&&R(d.prev,d,d.next)>=0)return!1;d=d.next}return!0}(t)){r.push(l.i/i|0),r.push(t.i/i|0),r.push(u.i/i|0),O(t),t=u.next,c=u.next;continue}if((t=u)===c){a?1===a?e(t=function(e,t,r){let i=e;do{let n=i.prev,s=i.next.next;!S(n,s)&&M(n,i,i.next,s)&&x(n,s)&&x(s,n)&&(t.push(n.i/r|0),t.push(i.i/r|0),t.push(s.i/r|0),O(i),O(i.next),i=e=s),i=i.next}while(i!==e);return b(i)}(b(t),r,i),r,i,n,s,o,2):2===a&&function(t,r,i,n,s,o){let a=t;do{let t=a.next.next;for(;t!==a.prev;){var l,u;if(a.i!==t.i&&(l=a,u=t,l.next.i!==u.i&&l.prev.i!==u.i&&!function(e,t){let r=e;do{if(r.i!==e.i&&r.next.i!==e.i&&r.i!==t.i&&r.next.i!==t.i&&M(r,r.next,e,t))return!0;r=r.next}while(r!==e);return!1}(l,u)&&(x(l,u)&&x(u,l)&&function(e,t){let r=e,i=!1,n=(e.x+t.x)/2,s=(e.y+t.y)/2;do r.y>s!=r.next.y>s&&r.next.y!==r.y&&n<(r.next.x-r.x)*(s-r.y)/(r.next.y-r.y)+r.x&&(i=!i),r=r.next;while(r!==e);return i}(l,u)&&(R(l.prev,l,u.prev)||R(l,u.prev,u))||S(l,u)&&R(l.prev,l,l.next)>0&&R(u.prev,u,u.next)>0))){let l=w(a,t);a=b(a,a.next),l=b(l,l.next),e(a,r,i,n,s,o,0),e(l,r,i,n,s,o,0);return}t=t.next}a=a.next}while(a!==t)}(t,r,i,n,s,o):e(b(t),r,i,n,s,o,1);break}}}(p,g,r,l,u,s,0),g}function v(e,t,r,i,n,s,o){let a,l;void 0===s&&(s=p(e,{start:t,end:r,size:i,plane:o}));let u=d[o[0]],c=d[o[1]];if(n===s<0)for(a=t;a<r;a+=i)l=N(a,e[a+u],e[a+c],l);else for(a=r-i;a>=t;a-=i)l=N(a,e[a+u],e[a+c],l);return l&&S(l,l.next)&&(O(l),l=l.next),l}function b(e,t){let r;if(!e)return e;t||(t=e);let i=e;do if(r=!1,!i.steiner&&(S(i,i.next)||0===R(i.prev,i,i.next))){if(O(i),(i=t=i.prev)===i.next)break;r=!0}else i=i.next;while(r||i!==t);return t}function A(e,t){return e.x-t.x}function y(e,t,r,i,n){return(e=((e=((e=((e=((e=(e-r)*n|0)|e<<8)&16711935)|e<<4)&252645135)|e<<2)&858993459)|e<<1)&1431655765)|(t=((t=((t=((t=((t=(t-i)*n|0)|t<<8)&16711935)|t<<4)&252645135)|t<<2)&858993459)|t<<1)&1431655765)<<1}function T(e,t,r,i,n,s,o,a){return(n-o)*(t-a)>=(e-o)*(s-a)&&(e-o)*(i-a)>=(r-o)*(t-a)&&(r-o)*(s-a)>=(n-o)*(i-a)}function R(e,t,r){return(t.y-e.y)*(r.x-t.x)-(t.x-e.x)*(r.y-t.y)}function S(e,t){return e.x===t.x&&e.y===t.y}function M(e,t,r,i){let n=C(R(e,t,r)),s=C(R(e,t,i)),o=C(R(r,i,e)),a=C(R(r,i,t));return!!(n!==s&&o!==a||0===n&&I(e,r,t)||0===s&&I(e,i,t)||0===o&&I(r,e,i)||0===a&&I(r,t,i))}function I(e,t,r){return t.x<=Math.max(e.x,r.x)&&t.x>=Math.min(e.x,r.x)&&t.y<=Math.max(e.y,r.y)&&t.y>=Math.min(e.y,r.y)}function C(e){return e>0?1:e<0?-1:0}function x(e,t){return 0>R(e.prev,e,e.next)?R(e,t,e.next)>=0&&R(e,e.prev,t)>=0:0>R(e,t,e.prev)||0>R(e,e.next,t)}function w(e,t){let r=new P(e.i,e.x,e.y),i=new P(t.i,t.x,t.y),n=e.next,s=t.prev;return e.next=t,t.prev=e,r.next=n,n.prev=r,i.next=r,r.prev=i,s.next=i,i.prev=s,i}function N(e,t,r,i){let n=new P(e,t,r);return i?(n.next=i.next,n.prev=i,i.next.prev=n,i.next=n):(n.prev=n,n.next=n),n}function O(e){e.next.prev=e.prev,e.prev.next=e.next,e.prevZ&&(e.prevZ.nextZ=e.nextZ),e.nextZ&&(e.nextZ.prevZ=e.prevZ)}var P=class{constructor(e,t,r){this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1,this.i=e,this.x=t,this.y=r}};function L(e,t){let r=t.length,i=e.length;if(i>0){let n=!0;for(let s=0;s<r;s++)if(e[i-r+s]!==t[s]){n=!1;break}if(n)return!1}for(let n=0;n<r;n++)e[i+n]=t[n];return!0}function F(e,t){let r=t.length;for(let i=0;i<r;i++)e[i]=t[i]}function B(e,t,r,i,n=[]){let s=i+t*r;for(let t=0;t<r;t++)n[t]=e[s+t];return n}function D(e,t,r){let i,n,s,o;let{size:a=2,startIndex:l=0,endIndex:u=e.length}=r||{},c=(u-l)/a,h=[],f=[],d=-1;for(let r=1;r<c;r++){for(i=B(e,r-1,a,l,i),n=B(e,r,a,l,n),d<0&&(d=G(i,t)),s=o=G(n,t);;)if(d|s){if(d&s)break;d?(k(i,n,d,t,i),d=G(i,t)):(k(i,n,s,t,n),s=G(n,t))}else{L(f,i),s!==o?(L(f,n),r<c-1&&(h.push(f),f=[])):r===c-1&&L(f,n);break}d=o}return f.length&&h.push(f),h}function U(e,t,r){let i,n,s,o,a;let{size:l=2,endIndex:u=e.length}=r||{},{startIndex:c=0}=r||{},h=(u-c)/l;for(let r=1;r<=8;r*=2){i=[],a=!(G(s=B(e,h-1,l,c,s),t)&r);for(let u=0;u<h;u++)(o=!(G(n=B(e,u,l,c,n),t)&r))!==a&&L(i,k(s,n,r,t)),o&&L(i,n),F(s,n),a=o;if(e=i,c=0,!(h=i.length/l))break}return i}function k(e,t,r,i,n=[]){let s,o;if(8&r)s=(i[3]-e[1])/(t[1]-e[1]),o=3;else if(4&r)s=(i[1]-e[1])/(t[1]-e[1]),o=1;else if(2&r)s=(i[2]-e[0])/(t[0]-e[0]),o=2;else{if(!(1&r))return null;s=(i[0]-e[0])/(t[0]-e[0]),o=0}for(let r=0;r<e.length;r++)n[r]=(1&o)===r?i[o]:s*(t[r]-e[r])+e[r];return n}function G(e,t){let r=0;return e[0]<t[0]?r|=1:e[0]>t[2]&&(r|=2),e[1]<t[1]?r|=4:e[1]>t[3]&&(r|=8),r}function H(e,t){let r,i;let{size:n=2,broken:s=!1,gridResolution:o=10,gridOffset:a=[0,0],startIndex:l=0,endIndex:u=e.length}=t||{},c=(u-l)/n,h=[],f=[h],d=B(e,0,n,l),p=j(d,o,a,[]),g=[];L(h,d);for(let t=1;t<c;t++){for(i=G(r=B(e,t,n,l,r),p);i;){var _;k(d,r,i,p,g);let e=G(g,p);e&&(k(d,g,e,p,g),i=e),L(h,g),F(d,g),8&(_=i)?(p[1]+=o,p[3]+=o):4&_?(p[1]-=o,p[3]-=o):2&_?(p[0]+=o,p[2]+=o):1&_&&(p[0]-=o,p[2]-=o),s&&h.length>n&&(h=[],f.push(h),L(h,d)),i=G(r,p)}L(h,r),F(d,r)}return s?f:f[0]}function V(e,t=null,r){if(!e.length)return[];let{size:i=2,gridResolution:n=10,gridOffset:s=[0,0],edgeTypes:o=!1}=r||{},a=[],l=[{pos:e,types:o?Array(e.length/i).fill(1):null,holes:t||[]}],u=[[],[]],c=[];for(;l.length;){let{pos:e,types:t,holes:r}=l.shift();(function(e,t,r,i){let n=1/0,s=-1/0,o=1/0,a=-1/0;for(let i=0;i<r;i+=t){let t=e[i],r=e[i+1];n=t<n?t:n,s=t>s?t:s,o=r<o?r:o,a=r>a?r:a}i[0][0]=n,i[0][1]=o,i[1][0]=s,i[1][1]=a})(e,i,r[0]||e.length,u),c=j(u[0],n,s,c);let h=G(u[1],c);if(h){let n=z(e,t,i,0,r[0]||e.length,c,h),s={pos:n[0].pos,types:n[0].types,holes:[]},a={pos:n[1].pos,types:n[1].types,holes:[]};l.push(s,a);for(let l=0;l<r.length;l++)(n=z(e,t,i,r[l],r[l+1]||e.length,c,h))[0]&&(s.holes.push(s.pos.length),s.pos=W(s.pos,n[0].pos),o&&(s.types=W(s.types,n[0].types))),n[1]&&(a.holes.push(a.pos.length),a.pos=W(a.pos,n[1].pos),o&&(a.types=W(a.types,n[1].types)))}else{let i={positions:e};o&&(i.edgeTypes=t),r.length&&(i.holeIndices=r),a.push(i)}}return a}function z(e,t,r,i,n,s,o){let a,l,u;let c=(n-i)/r,h=[],f=[],d=[],p=[],g=[],_=B(e,c-1,r,i),m=Math.sign(8&o?_[1]-s[3]:_[0]-s[2]),E=t&&t[c-1],v=0,b=0;for(let n=0;n<c;n++)a=B(e,n,r,i,a),l=Math.sign(8&o?a[1]-s[3]:a[0]-s[2]),u=t&&t[i/r+n],l&&m&&m!==l&&(k(_,a,o,s,g),L(h,g)&&d.push(E),L(f,g)&&p.push(E)),l<=0?(L(h,a)&&d.push(u),v-=l):d.length&&(d[d.length-1]=0),l>=0?(L(f,a)&&p.push(u),b+=l):p.length&&(p[p.length-1]=0),F(_,a),m=l,E=u;return[v?{pos:h,types:t&&d}:null,b?{pos:f,types:t&&p}:null]}function j(e,t,r,i){let n=Math.floor((e[0]-r[0])/t)*t+r[0],s=Math.floor((e[1]-r[1])/t)*t+r[1];return i[0]=n,i[1]=s,i[2]=n+t,i[3]=s+t,i}function W(e,t){for(let r=0;r<t.length;r++)e.push(t[r]);return e}function X(e,t){let{size:r=2,startIndex:i=0,endIndex:n=e.length,normalize:s=!0}=t||{},o=e.slice(i,n);q(o,r,0,n-i);let a=H(o,{size:r,broken:!0,gridResolution:360,gridOffset:[-180,-180]});if(s)for(let e of a)Y(e,r);return a}function $(e,t=null,r){let{size:i=2,normalize:n=!0,edgeTypes:s=!1}=r||{};t=t||[];let o=[],a=[],l=0,u=0;for(let n=0;n<=t.length;n++){let s=t[n]||e.length,c=u,h=function(e,t,r,i){let n=-1,s=-1;for(let o=r+1;o<i;o+=t){let t=Math.abs(e[o]);t>n&&(n=t,s=o-1)}return s}(e,i,l,s);for(let t=h;t<s;t++)o[u++]=e[t];for(let t=l;t<h;t++)o[u++]=e[t];q(o,i,c,u),function(e,t,r,i,n=85.051129){let s=e[r],o=e[i-t];if(Math.abs(s-o)>180){let i=B(e,0,t,r);i[0]+=360*Math.round((o-s)/360),L(e,i),i[1]=Math.sign(i[1])*n,L(e,i),i[0]=s,L(e,i)}}(o,i,c,u,null==r?void 0:r.maxLatitude),l=s,a[n]=u}a.pop();let c=V(o,a,{size:i,gridResolution:360,gridOffset:[-180,-180],edgeTypes:s});if(n)for(let e of c)Y(e.positions,i);return c}function q(e,t,r,i){let n,s=e[0];for(let o=r;o<i;o+=t){let t=(n=e[o])-s;(t>180||t<-180)&&(n-=360*Math.round(t/360)),e[o]=s=n}}function Y(e,t){let r;let i=e.length/t;for(let n=0;n<i&&((r=e[n*t])+180)%360==0;n++);let n=-(360*Math.round(r/360));if(0!==n)for(let r=0;r<i;r++)e[r*t]+=n}},11565:function(e){var t=Object.defineProperty,r=Object.getOwnPropertyDescriptor,i=Object.getOwnPropertyNames,n=Object.prototype.hasOwnProperty,s={};((e,r)=>{for(var i in r)t(e,i,{get:r[i],enumerable:!0})})(s,{getSunDirection:()=>u,getSunPosition:()=>l}),e.exports=((e,s,o,a)=>{if(s&&"object"==typeof s||"function"==typeof s)for(let l of i(s))n.call(e,l)||l===o||t(e,l,{get:()=>s[l],enumerable:!(a=r(s,l))||a.enumerable});return e})(t({},"__esModule",{value:!0}),s);var o=Math.PI/180,a=23.4397*o;function l(e,t,r){var i,n,s;let l=o*t,u=("number"==typeof(s=e)?s:s.getTime())/864e5-.5+2440588-2451545,c=function(e){var t;let r=(t=o*(357.5291+.98560028*e))+o*(1.9148*Math.sin(t)+.02*Math.sin(2*t)+3e-4*Math.sin(3*t))+102.9372*o+Math.PI;return{declination:Math.asin(0*Math.cos(a)+1*Math.sin(a)*Math.sin(r)),rightAscension:Math.atan2(Math.sin(r)*Math.cos(a)-Math.tan(0)*Math.sin(a),Math.cos(r))}}(u),h=(i=-(o*r),o*(280.147+360.9856235*u)-i-c.rightAscension);return{azimuth:Math.atan2(Math.sin(h),Math.cos(h)*Math.sin(l)-Math.tan(c.declination)*Math.cos(l)),altitude:Math.asin(Math.sin(l)*Math.sin(n=c.declination)+Math.cos(l)*Math.cos(n)*Math.cos(h))}}function u(e,t,r){let{azimuth:i,altitude:n}=l(e,t,r);return[Math.sin(i)*Math.cos(n),Math.cos(i)*Math.cos(n),-Math.sin(n)]}},49156:function(e){var t=Object.defineProperty,r=Object.getOwnPropertyDescriptor,i=Object.getOwnPropertyNames,n=Object.prototype.hasOwnProperty,s={};function o(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function a(e){return!!Array.isArray(e)&&(0===e.length||"number"==typeof e[0])}function l(e){return o(e)||a(e)}((e,r)=>{for(var i in r)t(e,i,{get:r[i],enumerable:!0})})(s,{isNumberArray:()=>a,isNumericArray:()=>l,isTypedArray:()=>o}),e.exports=((e,s,o,a)=>{if(s&&"object"==typeof s||"function"==typeof s)for(let l of i(s))n.call(e,l)||l===o||t(e,l,{get:()=>s[l],enumerable:!(a=r(s,l))||a.enumerable});return e})(t({},"__esModule",{value:!0}),s)},432:function(e,t,r){var i=Object.defineProperty,n=Object.getOwnPropertyDescriptor,s=Object.getOwnPropertyNames,o=Object.prototype.hasOwnProperty,a={};((e,t)=>{for(var r in t)i(e,r,{get:t[r],enumerable:!0})})(a,{MAX_LATITUDE:()=>b,WebMercatorViewport:()=>V,addMetersToLngLat:()=>C,altitudeToFovy:()=>O,default:()=>V,fitBounds:()=>B,flyToViewport:()=>$,fovyToAltitude:()=>P,getBounds:()=>k,getDistanceScales:()=>I,getFlyToDuration:()=>q,getMeterZoom:()=>S,getProjectionMatrix:()=>N,getProjectionParameters:()=>w,getViewMatrix:()=>x,lngLatToWorld:()=>T,normalizeViewportProps:()=>z,pixelsToWorld:()=>F,scaleToZoom:()=>y,unitsPerMeter:()=>M,worldToLngLat:()=>R,worldToPixels:()=>L,zoomToScale:()=>A}),e.exports=((e,t,r,a)=>{if(t&&"object"==typeof t||"function"==typeof t)for(let l of s(t))o.call(e,l)||l===r||i(e,l,{get:()=>t[l],enumerable:!(a=n(t,l))||a.enumerable});return e})(i({},"__esModule",{value:!0}),a);var l=r(6049);function u(){return[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]}function c(e,t){let r=l.vec4.transformMat4([],t,e);return l.vec4.scale(r,r,1/r[3]),r}function h(e,t){let r=e%t;return r<0?t+r:r}function f(e,t,r){return e<t?t:e>r?r:e}var d=Math.log2||function(e){return Math.log(e)*Math.LOG2E},p=r(6049);function g(e,t){if(!e)throw Error(t||"@math.gl/web-mercator: assertion failed.")}var _=Math.PI,m=_/4,E=_/180,v=180/_,b=85.051129;function A(e){return Math.pow(2,e)}function y(e){return d(e)}function T(e){let[t,r]=e;return g(Number.isFinite(t)),g(Number.isFinite(r)&&r>=-90&&r<=90,"invalid latitude"),[512*(t*E+_)/(2*_),512*(_+Math.log(Math.tan(m+r*E*.5)))/(2*_)]}function R(e){let[t,r]=e;return[(t/512*(2*_)-_)*v,2*(Math.atan(Math.exp(r/512*(2*_)-_))-m)*v]}function S(e){let{latitude:t}=e;return g(Number.isFinite(t)),d(4003e4*Math.cos(t*E))-9}function M(e){return 512/4003e4/Math.cos(e*E)}function I(e){let{latitude:t,longitude:r,highPrecision:i=!1}=e;g(Number.isFinite(t)&&Number.isFinite(r));let n=Math.cos(t*E),s=512/360/n,o=512/4003e4/n,a={unitsPerMeter:[o,o,o],metersPerUnit:[1/o,1/o,1/o],unitsPerDegree:[512/360,s,o],degreesPerUnit:[1/(512/360),1/s,1/o]};if(i){let e=E*Math.tan(t*E)/n,r=512/4003e4*e,i=r/s*o;a.unitsPerDegree2=[0,512/360*e/2,r],a.unitsPerMeter2=[i,0,i]}return a}function C(e,t){let[r,i,n]=e,[s,o,a]=t,{unitsPerMeter:l,unitsPerMeter2:u}=I({longitude:r,latitude:i,highPrecision:!0}),c=T(e);c[0]+=s*(l[0]+u[0]*o),c[1]+=o*(l[1]+u[1]*o);let h=R(c);return Number.isFinite(n)||Number.isFinite(a)?[h[0],h[1],(n||0)+(a||0)]:h}function x(e){let{height:t,pitch:r,bearing:i,altitude:n,scale:s,center:o}=e,a=u();p.mat4.translate(a,a,[0,0,-n]),p.mat4.rotateX(a,a,-r*E),p.mat4.rotateZ(a,a,i*E);let l=s/t;return p.mat4.scale(a,a,[l,l,l]),o&&p.mat4.translate(a,a,p.vec3.negate([],o)),a}function w(e){let{width:t,height:r,altitude:i,pitch:n=0,offset:s,center:o,scale:a,nearZMultiplier:l=1,farZMultiplier:u=1}=e,{fovy:c=O(1.5)}=e;void 0!==i&&(c=O(i));let h=c*E,d=n*E,p=P(c),g=p;o&&(g+=o[2]*a/Math.cos(d)/r);let _=h*(.5+(s?s[1]:0)/r),m=Math.sin(_)*g/Math.sin(f(Math.PI/2-d-_,.01,Math.PI-.01));return{fov:h,aspect:t/r,focalDistance:p,near:l,far:Math.min((Math.sin(d)*m+g)*u,10*g)}}function N(e){let{fov:t,aspect:r,near:i,far:n}=w(e);return p.mat4.perspective([],t,r,i,n)}function O(e){return 2*Math.atan(.5/e)*v}function P(e){return .5/Math.tan(.5*e*E)}function L(e,t){let[r,i,n=0]=e;return g(Number.isFinite(r)&&Number.isFinite(i)&&Number.isFinite(n)),c(t,[r,i,n,1])}function F(e,t,r=0){let[i,n,s]=e;if(g(Number.isFinite(i)&&Number.isFinite(n),"invalid pixel coordinate"),Number.isFinite(s))return c(t,[i,n,s,1]);let o=c(t,[i,n,0,1]),a=c(t,[i,n,1,1]),l=o[2],u=a[2];return p.vec2.lerp([],o,a,l===u?0:((r||0)-l)/(u-l))}function B(e){let{width:t,height:r,bounds:i,minExtent:n=0,maxZoom:s=24,offset:o=[0,0]}=e,[[a,l],[u,c]]=i,h=function(e=0){return"number"==typeof e?{top:e,bottom:e,left:e,right:e}:(g(Number.isFinite(e.top)&&Number.isFinite(e.bottom)&&Number.isFinite(e.left)&&Number.isFinite(e.right)),e)}(e.padding),p=T([a,f(c,-b,b)]),_=T([u,f(l,-b,b)]),m=[Math.max(Math.abs(_[0]-p[0]),n),Math.max(Math.abs(_[1]-p[1]),n)],E=[t-h.left-h.right-2*Math.abs(o[0]),r-h.top-h.bottom-2*Math.abs(o[1])];g(E[0]>0&&E[1]>0);let v=E[0]/m[0],A=E[1]/m[1],y=(h.right-h.left)/2/v,S=(h.top-h.bottom)/2/A,M=R([(_[0]+p[0])/2+y,(_[1]+p[1])/2+S]),I=Math.min(s,d(Math.abs(Math.min(v,A))));return g(Number.isFinite(I)),{longitude:M[0],latitude:M[1],zoom:I}}var D=r(6049),U=Math.PI/180;function k(e,t=0){let r,i;let{width:n,height:s,unproject:o}=e,a={targetZ:t},l=o([0,s],a),u=o([n,s],a);return(e.fovy?.5*e.fovy*U:Math.atan(.5/e.altitude))>(90-e.pitch)*U-.01?(r=G(e,0,t),i=G(e,n,t)):(r=o([0,0],a),i=o([n,0],a)),[l,u,i,r]}function G(e,t,r){let{pixelUnprojectionMatrix:i}=e,n=c(i,[t,0,1,1]),s=c(i,[t,e.height,1,1]),o=(r*e.distanceScales.unitsPerMeter[2]-n[2])/(s[2]-n[2]),a=R(D.vec2.lerp([],n,s,o));return a.push(r),a}var H=r(6049),V=class{constructor(e={width:1,height:1}){this.equals=e=>e instanceof V&&e.width===this.width&&e.height===this.height&&H.mat4.equals(e.projectionMatrix,this.projectionMatrix)&&H.mat4.equals(e.viewMatrix,this.viewMatrix),this.project=(e,t={})=>{let{topLeft:r=!0}=t,i=L(this.projectPosition(e),this.pixelProjectionMatrix),[n,s]=i,o=r?s:this.height-s;return 2===e.length?[n,o]:[n,o,i[2]]},this.unproject=(e,t={})=>{let{topLeft:r=!0,targetZ:i}=t,[n,s,o]=e,a=r?s:this.height-s,l=i&&i*this.distanceScales.unitsPerMeter[2],u=F([n,a,o],this.pixelUnprojectionMatrix,l),[c,h,f]=this.unprojectPosition(u);return Number.isFinite(o)?[c,h,f]:Number.isFinite(i)?[c,h,i]:[c,h]},this.projectPosition=e=>{let[t,r]=T(e);return[t,r,(e[2]||0)*this.distanceScales.unitsPerMeter[2]]},this.unprojectPosition=e=>{let[t,r]=R(e);return[t,r,(e[2]||0)*this.distanceScales.metersPerUnit[2]]};let{width:t,height:r,altitude:i=null,fovy:n=null}=e,{latitude:s=0,longitude:o=0,zoom:a=0,pitch:l=0,bearing:u=0,position:c=null,nearZMultiplier:h=.02,farZMultiplier:f=1.01}=e;t=t||1,r=r||1,null===n&&null===i?n=O(i=1.5):null===n?n=O(i):null===i&&(i=P(n));let d=A(a);i=Math.max(.75,i);let p=I({longitude:o,latitude:s}),g=T([o,s]);g.push(0),c&&H.vec3.add(g,g,H.vec3.mul([],c,p.unitsPerMeter)),this.projectionMatrix=N({width:t,height:r,scale:d,center:g,pitch:l,fovy:n,nearZMultiplier:h,farZMultiplier:f}),this.viewMatrix=x({height:r,scale:d,center:g,pitch:l,bearing:u,altitude:i}),this.width=t,this.height=r,this.scale=d,this.latitude=s,this.longitude=o,this.zoom=a,this.pitch=l,this.bearing=u,this.altitude=i,this.fovy=n,this.center=g,this.meterOffset=c||[0,0,0],this.distanceScales=p,this._initMatrices(),Object.freeze(this)}_initMatrices(){let{width:e,height:t,projectionMatrix:r,viewMatrix:i}=this,n=u();H.mat4.multiply(n,n,r),H.mat4.multiply(n,n,i),this.viewProjectionMatrix=n;let s=u();H.mat4.scale(s,s,[e/2,-t/2,1]),H.mat4.translate(s,s,[1,-1,0]),H.mat4.multiply(s,s,n);let o=H.mat4.invert(u(),s);if(!o)throw Error("Pixel project matrix not invertible");this.pixelProjectionMatrix=s,this.pixelUnprojectionMatrix=o}projectFlat(e){return T(e)}unprojectFlat(e){return R(e)}getMapCenterByLngLatPosition({lngLat:e,pos:t}){let r=F(t,this.pixelUnprojectionMatrix),i=T(e),n=H.vec2.add([],i,H.vec2.negate([],r));return R(H.vec2.add([],this.center,n))}fitBounds(e,t={}){let{width:r,height:i}=this,{longitude:n,latitude:s,zoom:o}=B(Object.assign({width:r,height:i,bounds:e},t));return new V({width:r,height:i,longitude:n,latitude:s,zoom:o})}getBounds(e){let t=this.getBoundingRegion(e),r=Math.min(...t.map(e=>e[0])),i=Math.max(...t.map(e=>e[0]));return[[r,Math.min(...t.map(e=>e[1]))],[i,Math.max(...t.map(e=>e[1]))]]}getBoundingRegion(e={}){return k(this,e.z||0)}getLocationAtPoint({lngLat:e,pos:t}){return this.getMapCenterByLngLatPosition({lngLat:e,pos:t})}};function z(e){let{width:t,height:r,pitch:i=0}=e,{longitude:n,latitude:s,zoom:o,bearing:a=0}=e;(n<-180||n>180)&&(n=h(n+180,360)-180),(a<-180||a>180)&&(a=h(a+180,360)-180);let l=d(r/512);if(o<=l)o=l,s=0;else{let e=r/2/Math.pow(2,o),t=R([0,e])[1];if(s<t)s=t;else{let t=R([0,512-e])[1];s>t&&(s=t)}}return{width:t,height:r,longitude:n,latitude:s,zoom:o,pitch:i,bearing:a}}var j=r(6049),W=["longitude","latitude","zoom"],X={curve:1.414,speed:1.2};function $(e,t,r,i){let{startZoom:n,startCenterXY:s,uDelta:o,w0:a,u1:l,S:u,rho:c,rho2:h,r0:f}=Y(e,t,i);if(l<.01){let i={};for(let n of W){let s=e[n],o=t[n];i[n]=r*o+(1-r)*s}return i}let p=r*u,g=n+d(1/(Math.cosh(f)/Math.cosh(f+c*p))),_=j.vec2.scale([],o,(Math.cosh(f)*Math.tanh(f+c*p)-Math.sinh(f))/h*a/l);j.vec2.add(_,_,s);let m=R(_);return{longitude:m[0],latitude:m[1],zoom:g}}function q(e,t,r){let i;let n={...X,...r},{screenSpeed:s,speed:o,maxDuration:a}=n,{S:l,rho:u}=Y(e,t,n),c=1e3*l;return i=Number.isFinite(s)?c/(s/u):c/o,Number.isFinite(a)&&i>a?0:i}function Y(e,t,r){let i=(r=Object.assign({},X,r)).curve,n=e.zoom,s=[e.longitude,e.latitude],o=A(n),a=t.zoom,l=[t.longitude,t.latitude],u=A(a-n),c=T(s),h=T(l),f=j.vec2.sub([],h,c),d=Math.max(e.width,e.height),p=d/u,g=j.vec2.length(f)*o,_=Math.max(g,.01),m=i*i,E=(p*p-d*d+m*m*_*_)/(2*d*m*_),v=(p*p-d*d-m*m*_*_)/(2*p*m*_),b=Math.log(Math.sqrt(E*E+1)-E),y=Math.log(Math.sqrt(v*v+1)-v);return{startZoom:n,startCenterXY:c,uDelta:f,w0:d,u1:g,S:(y-b)/i,rho:i,rho2:m,r0:b,r1:y}}},33278:function(e,t,r){var i=r(40257),n=Object.defineProperty,s=Object.getOwnPropertyDescriptor,o=Object.getOwnPropertyNames,a=Object.prototype.hasOwnProperty,l={};((e,t)=>{for(var r in t)n(e,r,{get:t[r],enumerable:!0})})(l,{VERSION:()=>b,assert:()=>v,console:()=>d,document:()=>h,getBrowser:()=>E,global:()=>u,isBrowser:()=>_,isElectron:()=>g,isMobile:()=>m,process:()=>f,self:()=>u,window:()=>c}),e.exports=((e,t,r,i)=>{if(t&&"object"==typeof t||"function"==typeof t)for(let l of o(t))a.call(e,l)||l===r||n(e,l,{get:()=>t[l],enumerable:!(i=s(t,l))||i.enumerable});return e})(n({},"__esModule",{value:!0}),l);var u=globalThis,c=globalThis,h=globalThis.document||{},f=globalThis.process||{},d=globalThis.console,p=globalThis.navigator||{};function g(e){var t,r;if("undefined"!=typeof window&&(null==(t=window.process)?void 0:t.type)==="renderer"||void 0!==i&&(null==(r=i.versions)?void 0:r.electron))return!0;let n="undefined"!=typeof navigator&&navigator.userAgent,s=e||n;return!!(s&&s.indexOf("Electron")>=0)}function _(){return!("object"==typeof i&&"[object process]"===String(i)&&!(null!=i))||g()}function m(){return void 0!==globalThis.orientation}function E(e){return e||_()?g(e)?"Electron":(e||p.userAgent||"").indexOf("Edge")>-1?"Edge":globalThis.chrome?"Chrome":globalThis.safari?"Safari":globalThis.mozInnerScreenX?"Firefox":"Unknown":"Node"}function v(e,t){if(!e)throw Error(t||"Assertion failed")}var b="4.1.0"},18613:function(e,t,r){var i,n,s=Object.defineProperty,o=Object.getOwnPropertyDescriptor,a=Object.getOwnPropertyNames,l=Object.prototype.hasOwnProperty,u={};((e,t)=>{for(var r in t)s(e,r,{get:t[r],enumerable:!0})})(u,{COLOR:()=>n,LocalStorage:()=>h,Log:()=>M,addColor:()=>_,autobind:()=>m,default:()=>x,getHiResTimestamp:()=>b,leftPad:()=>f,rightPad:()=>d}),e.exports=((e,t,r,i)=>{if(t&&"object"==typeof t||"function"==typeof t)for(let n of a(t))l.call(e,n)||n===r||s(e,n,{get:()=>t[n],enumerable:!(i=o(t,n))||i.enumerable});return e})(s({},"__esModule",{value:!0}),u);var c=r(33278),h=class{constructor(e,t,r="sessionStorage"){this.storage=function(e){try{let t=window[e],r="__storage_test__";return t.setItem(r,r),t.removeItem(r),t}catch(e){return null}}(r),this.id=e,this.config=t,this._loadConfiguration()}getConfiguration(){return this.config}setConfiguration(e){if(Object.assign(this.config,e),this.storage){let e=JSON.stringify(this.config);this.storage.setItem(this.id,e)}}_loadConfiguration(){let e={};if(this.storage){let t=this.storage.getItem(this.id);e=t?JSON.parse(t):{}}return Object.assign(this.config,e),this}};function f(e,t=8){let r=Math.max(t-e.length,0);return`${" ".repeat(r)}${e}`}function d(e,t=8){let r=Math.max(t-e.length,0);return`${e}${" ".repeat(r)}`}var p=r(33278);function g(e){return"string"!=typeof e?e:n[e=e.toUpperCase()]||n.WHITE}function _(e,t,r){if(!p.isBrowser&&"string"==typeof e){if(t){let r=g(t);e=`\x1b[${r}m${e}\x1b[39m`}if(r){let t=g(r);e=`\x1b[${t+10}m${e}\x1b[49m`}}return e}function m(e,t=["constructor"]){for(let r of Object.getOwnPropertyNames(Object.getPrototypeOf(e))){let i=e[r];"function"!=typeof i||t.find(e=>r===e)||(e[r]=i.bind(e))}}function E(e,t){if(!e)throw Error(t||"Assertion failed")}(i=n||(n={}))[i.BLACK=30]="BLACK",i[i.RED=31]="RED",i[i.GREEN=32]="GREEN",i[i.YELLOW=33]="YELLOW",i[i.BLUE=34]="BLUE",i[i.MAGENTA=35]="MAGENTA",i[i.CYAN=36]="CYAN",i[i.WHITE=37]="WHITE",i[i.BRIGHT_BLACK=90]="BRIGHT_BLACK",i[i.BRIGHT_RED=91]="BRIGHT_RED",i[i.BRIGHT_GREEN=92]="BRIGHT_GREEN",i[i.BRIGHT_YELLOW=93]="BRIGHT_YELLOW",i[i.BRIGHT_BLUE=94]="BRIGHT_BLUE",i[i.BRIGHT_MAGENTA=95]="BRIGHT_MAGENTA",i[i.BRIGHT_CYAN=96]="BRIGHT_CYAN",i[i.BRIGHT_WHITE=97]="BRIGHT_WHITE";var v=r(33278);function b(){var e,t,r,i,n;let s;if((0,v.isBrowser)()&&v.window.performance)s=null==(r=null==(t=null==(e=v.window)?void 0:e.performance)?void 0:t.now)?void 0:r.call(t);else if("hrtime"in v.process){let e=null==(n=null==(i=v.process)?void 0:i.hrtime)?void 0:n.call(i);s=1e3*e[0]+e[1]/1e6}else s=Date.now();return s}var A={debug:(0,c.isBrowser)()&&console.debug||console.log,log:console.log,info:console.info,warn:console.warn,error:console.error},y={enabled:!0,level:0};function T(){}var R={},S={once:!0},M=class{constructor({id:e}={id:""}){this.VERSION=c.VERSION,this._startTs=b(),this._deltaTs=b(),this.userData={},this.LOG_THROTTLE_TIMEOUT=0,this.id=e,this.userData={},this._storage=new h(`__probe-${this.id}__`,y),this.timeStamp(`${this.id} started`),m(this),Object.seal(this)}set level(e){this.setLevel(e)}get level(){return this.getLevel()}isEnabled(){return this._storage.config.enabled}getLevel(){return this._storage.config.level}getTotal(){return Number((b()-this._startTs).toPrecision(10))}getDelta(){return Number((b()-this._deltaTs).toPrecision(10))}set priority(e){this.level=e}get priority(){return this.level}getPriority(){return this.level}enable(e=!0){return this._storage.setConfiguration({enabled:e}),this}setLevel(e){return this._storage.setConfiguration({level:e}),this}get(e){return this._storage.config[e]}set(e,t){this._storage.setConfiguration({[e]:t})}settings(){console.table?console.table(this._storage.config):console.log(this._storage.config)}assert(e,t){if(!e)throw Error(t||"Assertion failed")}warn(e){return this._getLogFunction(0,e,A.warn,arguments,S)}error(e){return this._getLogFunction(0,e,A.error,arguments)}deprecated(e,t){return this.warn(`\`${e}\` is deprecated and will be removed in a later version. Use \`${t}\` instead`)}removed(e,t){return this.error(`\`${e}\` has been removed. Use \`${t}\` instead`)}probe(e,t){return this._getLogFunction(e,t,A.log,arguments,{time:!0,once:!0})}log(e,t){return this._getLogFunction(e,t,A.debug,arguments)}info(e,t){return this._getLogFunction(e,t,console.info,arguments)}once(e,t){return this._getLogFunction(e,t,A.debug||A.info,arguments,S)}table(e,t,r){return t?this._getLogFunction(e,t,console.table||T,r&&[r],{tag:function(e){for(let t in e)for(let r in e[t])return r||"untitled";return"empty"}(t)}):T}time(e,t){return this._getLogFunction(e,t,console.time?console.time:console.info)}timeEnd(e,t){return this._getLogFunction(e,t,console.timeEnd?console.timeEnd:console.info)}timeStamp(e,t){return this._getLogFunction(e,t,console.timeStamp||T)}group(e,t,r={collapsed:!1}){let i=C({logLevel:e,message:t,opts:r}),{collapsed:n}=r;return i.method=(n?console.groupCollapsed:console.group)||console.info,this._getLogFunction(i)}groupCollapsed(e,t,r={}){return this.group(e,t,Object.assign({},r,{collapsed:!0}))}groupEnd(e){return this._getLogFunction(e,"",console.groupEnd||T)}withGroup(e,t,r){this.group(e,t)();try{r()}finally{this.groupEnd(e)()}}trace(){console.trace&&console.trace()}_shouldLog(e){return this.isEnabled()&&this.getLevel()>=I(e)}_getLogFunction(e,t,r,i,n){if(this._shouldLog(e)){n=C({logLevel:e,message:t,args:i,opts:n}),E(r=r||n.method),n.total=this.getTotal(),n.delta=this.getDelta(),this._deltaTs=b();let s=n.tag||n.message;if(n.once&&s){if(R[s])return T;R[s]=b()}return t=function(e,t,r){if("string"==typeof t){var i;let n=r.time?f((i=r.total)<10?`${i.toFixed(2)}ms`:i<100?`${i.toFixed(1)}ms`:i<1e3?`${i.toFixed(0)}ms`:`${(i/1e3).toFixed(2)}s`):"";t=_(t=r.time?`${e}: ${n}  ${t}`:`${e}: ${t}`,r.color,r.background)}return t}(this.id,n.message,n),r.bind(console,t,...n.args)}return T}};function I(e){let t;if(!e)return 0;switch(typeof e){case"number":t=e;break;case"object":t=e.logLevel||e.priority||0;break;default:return 0}return E(Number.isFinite(t)&&t>=0),t}function C(e){let{logLevel:t,message:r}=e;e.logLevel=I(t);let i=e.args?Array.from(e.args):[];for(;i.length&&i.shift()!==r;);switch(typeof t){case"string":case"function":void 0!==r&&i.unshift(r),e.message=t;break;case"object":Object.assign(e,t)}"function"==typeof e.message&&(e.message=e.message());let n=typeof e.message;return E("string"===n||"object"===n),Object.assign(e,{args:i},e.opts)}M.VERSION=c.VERSION,globalThis.probe={};var x=new M({id:"@probe.gl/log"})},83406:function(e,t,r){var i=r(40257),n=Object.defineProperty,s=Object.getOwnPropertyDescriptor,o=Object.getOwnPropertyNames,a=Object.prototype.hasOwnProperty,l={};function u(){let e;if("undefined"!=typeof window&&window.performance)e=window.performance.now();else if(void 0!==i&&i.hrtime){let t=i.hrtime();e=1e3*t[0]+t[1]/1e6}else e=Date.now();return e}((e,t)=>{for(var r in t)n(e,r,{get:t[r],enumerable:!0})})(l,{Stat:()=>c,Stats:()=>h,_getHiResTimestamp:()=>u}),e.exports=((e,t,r,i)=>{if(t&&"object"==typeof t||"function"==typeof t)for(let l of o(t))a.call(e,l)||l===r||n(e,l,{get:()=>t[l],enumerable:!(i=s(t,l))||i.enumerable});return e})(n({},"__esModule",{value:!0}),l);var c=class{constructor(e,t){this.sampleSize=1,this.time=0,this.count=0,this.samples=0,this.lastTiming=0,this.lastSampleTime=0,this.lastSampleCount=0,this._count=0,this._time=0,this._samples=0,this._startTime=0,this._timerPending=!1,this.name=e,this.type=t,this.reset()}reset(){return this.time=0,this.count=0,this.samples=0,this.lastTiming=0,this.lastSampleTime=0,this.lastSampleCount=0,this._count=0,this._time=0,this._samples=0,this._startTime=0,this._timerPending=!1,this}setSampleSize(e){return this.sampleSize=e,this}incrementCount(){return this.addCount(1),this}decrementCount(){return this.subtractCount(1),this}addCount(e){return this._count+=e,this._samples++,this._checkSampling(),this}subtractCount(e){return this._count-=e,this._samples++,this._checkSampling(),this}addTime(e){return this._time+=e,this.lastTiming=e,this._samples++,this._checkSampling(),this}timeStart(){return this._startTime=u(),this._timerPending=!0,this}timeEnd(){return this._timerPending&&(this.addTime(u()-this._startTime),this._timerPending=!1,this._checkSampling()),this}getSampleAverageCount(){return this.sampleSize>0?this.lastSampleCount/this.sampleSize:0}getSampleAverageTime(){return this.sampleSize>0?this.lastSampleTime/this.sampleSize:0}getSampleHz(){return this.lastSampleTime>0?this.sampleSize/(this.lastSampleTime/1e3):0}getAverageCount(){return this.samples>0?this.count/this.samples:0}getAverageTime(){return this.samples>0?this.time/this.samples:0}getHz(){return this.time>0?this.samples/(this.time/1e3):0}_checkSampling(){this._samples===this.sampleSize&&(this.lastSampleTime=this._time,this.lastSampleCount=this._count,this.count+=this._count,this.time+=this._time,this.samples+=this._samples,this._time=0,this._count=0,this._samples=0)}},h=class{constructor(e){this.stats={},this.id=e.id,this.stats={},this._initializeStats(e.stats),Object.seal(this)}get(e,t="count"){return this._getOrCreate({name:e,type:t})}get size(){return Object.keys(this.stats).length}reset(){for(let e of Object.values(this.stats))e.reset();return this}forEach(e){for(let t of Object.values(this.stats))e(t)}getTable(){let e={};return this.forEach(t=>{e[t.name]={time:t.time||0,count:t.count||0,average:t.getAverageTime()||0,hz:t.getHz()||0}}),e}_initializeStats(e=[]){e.forEach(e=>this._getOrCreate(e))}_getOrCreate(e){let{name:t,type:r}=e,i=this.stats[t];return i||(i=e instanceof c?e:new c(t,r),this.stats[t]=i),i}}},20844:function(e,t,r){var i,n,s,o,a,l,u=Object.defineProperty,c=Object.getOwnPropertyDescriptor,h=Object.getOwnPropertyNames,f=Object.prototype.hasOwnProperty,d={};((e,t)=>{for(var r in t)u(e,r,{get:t[r],enumerable:!0})})(d,{EventManager:()=>ec,InputDirection:()=>a,InputEvent:()=>o,Pan:()=>z,Pinch:()=>$,Press:()=>K,Recognizer:()=>k,Rotate:()=>Y,Swipe:()=>W,Tap:()=>H}),e.exports=((e,t,r,i)=>{if(t&&"object"==typeof t||"function"==typeof t)for(let n of h(t))f.call(e,n)||n===r||u(e,n,{get:()=>t[n],enumerable:!(i=c(t,n))||i.enumerable});return e})(u({},"__esModule",{value:!0}),d),(i=o||(o={}))[i.Start=1]="Start",i[i.Move=2]="Move",i[i.End=4]="End",i[i.Cancel=8]="Cancel",(n=a||(a={}))[n.None=0]="None",n[n.Left=1]="Left",n[n.Right=2]="Right",n[n.Up=4]="Up",n[n.Down=8]="Down",n[n.Horizontal=3]="Horizontal",n[n.Vertical=12]="Vertical",n[n.All=15]="All",(s=l||(l={}))[s.Possible=1]="Possible",s[s.Began=2]="Began",s[s.Changed=4]="Changed",s[s.Ended=8]="Ended",s[s.Recognized=8]="Recognized",s[s.Cancelled=16]="Cancelled",s[s.Failed=32]="Failed";var p="auto",g="manipulation",_="none",m="pan-x",E="pan-y",v=class{constructor(e,t){this.actions="",this.manager=e,this.set(t)}set(e){"compute"===e&&(e=this.compute()),this.manager.element&&(this.manager.element.style.touchAction=e,this.actions=e)}update(){this.set(this.manager.options.touchAction)}compute(){let e=[];for(let t of this.manager.recognizers)t.options.enable&&(e=e.concat(t.getTouchAction()));return function(e){if(e.includes(_))return _;let t=e.includes(m),r=e.includes(E);return t&&r?_:t||r?t?m:E:e.includes(g)?g:p}(e.join(" "))}};function b(e){return e.trim().split(/\s+/g)}function A(e,t,r){if(e)for(let i of b(t))e.addEventListener(i,r,!1)}function y(e,t,r){if(e)for(let i of b(t))e.removeEventListener(i,r,!1)}function T(e){return(e.ownerDocument||e).defaultView}function R(e){let t=e.length;if(1===t)return{x:Math.round(e[0].clientX),y:Math.round(e[0].clientY)};let r=0,i=0,n=0;for(;n<t;)r+=e[n].clientX,i+=e[n].clientY,n++;return{x:Math.round(r/t),y:Math.round(i/t)}}function S(e){let t=[],r=0;for(;r<e.pointers.length;)t[r]={clientX:Math.round(e.pointers[r].clientX),clientY:Math.round(e.pointers[r].clientY)},r++;return{timeStamp:Date.now(),pointers:t,center:R(t),deltaX:e.deltaX,deltaY:e.deltaY}}function M(e,t){let r=t.x-e.x,i=t.y-e.y;return Math.sqrt(r*r+i*i)}function I(e,t){let r=t.clientX-e.clientX,i=t.clientY-e.clientY;return Math.sqrt(r*r+i*i)}function C(e,t){let r=t.clientX-e.clientX;return 180*Math.atan2(t.clientY-e.clientY,r)/Math.PI}function x(e,t){return e===t?a.None:Math.abs(e)>=Math.abs(t)?e<0?a.Left:a.Right:t<0?a.Up:a.Down}function w(e,t,r){return{x:t/e||0,y:r/e||0}}var N=class{constructor(e){this.evEl="",this.evWin="",this.evTarget="",this.domHandler=e=>{this.manager.options.enable&&this.handler(e)},this.manager=e,this.element=e.element,this.target=e.options.inputTarget||e.element}callback(e,t){!function(e,t,r){let i=r.pointers.length,n=r.changedPointers.length,s=t&o.Start&&i-n==0,a=t&(o.End|o.Cancel)&&i-n==0;r.isFirst=!!s,r.isFinal=!!a,s&&(e.session={}),r.eventType=t;let l=function(e,t){var r,i;let{session:n}=e,{pointers:s}=t,{length:a}=s;n.firstInput||(n.firstInput=S(t)),a>1&&!n.firstMultiple?n.firstMultiple=S(t):1===a&&(n.firstMultiple=!1);let{firstInput:l,firstMultiple:u}=n,c=u?u.center:l.center,h=t.center=R(s);t.timeStamp=Date.now(),t.deltaTime=t.timeStamp-l.timeStamp,t.angle=function(e,t){let r=t.x-e.x;return 180*Math.atan2(t.y-e.y,r)/Math.PI}(c,h),t.distance=M(c,h);let{deltaX:f,deltaY:d}=function(e,t){let r=t.center,i=e.offsetDelta,n=e.prevDelta,s=e.prevInput;return(t.eventType===o.Start||(null==s?void 0:s.eventType)===o.End)&&(n=e.prevDelta={x:(null==s?void 0:s.deltaX)||0,y:(null==s?void 0:s.deltaY)||0},i=e.offsetDelta={x:r.x,y:r.y}),{deltaX:n.x+(r.x-i.x),deltaY:n.y+(r.y-i.y)}}(n,t);t.deltaX=f,t.deltaY=d,t.offsetDirection=x(t.deltaX,t.deltaY);let p=w(t.deltaTime,t.deltaX,t.deltaY);t.overallVelocityX=p.x,t.overallVelocityY=p.y,t.overallVelocity=Math.abs(p.x)>Math.abs(p.y)?p.x:p.y,t.scale=u?(r=u.pointers,I(s[0],s[1])/I(r[0],r[1])):1,t.rotation=u?(i=u.pointers,C(s[1],s[0])-C(i[1],i[0])):0,t.maxPointers=n.prevInput?t.pointers.length>n.prevInput.maxPointers?t.pointers.length:n.prevInput.maxPointers:t.pointers.length;let g=e.element;return function(e,t){let r=e;for(;r;){if(r===t)return!0;r=r.parentNode}return!1}(t.srcEvent.target,g)&&(g=t.srcEvent.target),t.target=g,!function(e,t){let r,i,n,s;let a=e.lastInterval||t,l=t.timeStamp-a.timeStamp;if(t.eventType!==o.Cancel&&(l>25||void 0===a.velocity)){let o=t.deltaX-a.deltaX,u=t.deltaY-a.deltaY,c=w(l,o,u);i=c.x,n=c.y,r=Math.abs(c.x)>Math.abs(c.y)?c.x:c.y,s=x(o,u),e.lastInterval=t}else r=a.velocity,i=a.velocityX,n=a.velocityY,s=a.direction;t.velocity=r,t.velocityX=i,t.velocityY=n,t.direction=s}(n,t),t}(e,r);e.emit("hammer.input",l),e.recognize(l),e.session.prevInput=l}(this.manager,e,t)}init(){A(this.element,this.evEl,this.domHandler),A(this.target,this.evTarget,this.domHandler),A(T(this.element),this.evWin,this.domHandler)}destroy(){y(this.element,this.evEl,this.domHandler),y(this.target,this.evTarget,this.domHandler),y(T(this.element),this.evWin,this.domHandler)}},O={pointerdown:o.Start,pointermove:o.Move,pointerup:o.End,pointercancel:o.Cancel,pointerout:o.Cancel},P=class extends N{constructor(e){super(e),this.evEl="pointerdown",this.evWin="pointermove pointerup pointercancel",this.store=this.manager.session.pointerEvents=[],this.init()}handler(e){let{store:t}=this,r=!1,i=O[e.type],n=e.pointerType,s="touch"===n,a=t.findIndex(t=>t.pointerId===e.pointerId);i&o.Start&&(e.buttons||s)?a<0&&(t.push(e),a=t.length-1):i&(o.End|o.Cancel)&&(r=!0),!(a<0)&&(t[a]=e,this.callback(i,{pointers:t,changedPointers:[e],eventType:i,pointerType:n,srcEvent:e}),r&&t.splice(a,1))}},L=["","webkit","Moz","MS","ms","o"],F={touchAction:"compute",enable:!0,inputTarget:null,cssProps:{userSelect:"none",userDrag:"none",touchCallout:"none",tapHighlightColor:"rgba(0,0,0,0)"}},B=class{constructor(e,t){this.options={...F,...t,cssProps:{...F.cssProps,...t.cssProps},inputTarget:t.inputTarget||e},this.handlers={},this.session={},this.recognizers=[],this.oldCssProps={},this.element=e,this.input=new P(this),this.touchAction=new v(this,this.options.touchAction),this.toggleCssProps(!0)}set(e){return Object.assign(this.options,e),e.touchAction&&this.touchAction.update(),e.inputTarget&&(this.input.destroy(),this.input.target=e.inputTarget,this.input.init()),this}stop(e){this.session.stopped=e?2:1}recognize(e){let t;let{session:r}=this;if(r.stopped)return;this.session.prevented&&e.srcEvent.preventDefault();let{recognizers:i}=this,{curRecognizer:n}=r;(!n||n&&n.state&l.Recognized)&&(n=r.curRecognizer=null);let s=0;for(;s<i.length;)t=i[s],2!==r.stopped&&(!n||t===n||t.canRecognizeWith(n))?t.recognize(e):t.reset(),!n&&t.state&(l.Began|l.Changed|l.Ended)&&(n=r.curRecognizer=t),s++}get(e){let{recognizers:t}=this;for(let r=0;r<t.length;r++)if(t[r].options.event===e)return t[r];return null}add(e){if(Array.isArray(e)){for(let t of e)this.add(t);return this}let t=this.get(e.options.event);return t&&this.remove(t),this.recognizers.push(e),e.manager=this,this.touchAction.update(),e}remove(e){if(Array.isArray(e)){for(let t of e)this.remove(t);return this}let t="string"==typeof e?this.get(e):e;if(t){let{recognizers:e}=this,r=e.indexOf(t);-1!==r&&(e.splice(r,1),this.touchAction.update())}return this}on(e,t){if(!e||!t)return;let{handlers:r}=this;for(let i of b(e))r[i]=r[i]||[],r[i].push(t)}off(e,t){if(!e)return;let{handlers:r}=this;for(let i of b(e))t?r[i]&&r[i].splice(r[i].indexOf(t),1):delete r[i]}emit(e,t){let r=this.handlers[e]&&this.handlers[e].slice();if(!r||!r.length)return;t.type=e,t.preventDefault=function(){t.srcEvent.preventDefault()};let i=0;for(;i<r.length;)r[i](t),i++}destroy(){this.toggleCssProps(!1),this.handlers={},this.session={},this.input.destroy(),this.element=null}toggleCssProps(e){let{element:t}=this;if(t){for(let[r,i]of Object.entries(this.options.cssProps)){let n=function(e,t){let r=t[0].toUpperCase()+t.slice(1);for(let i of L){let n=i?i+r:t;if(n in e)return n}}(t.style,r);e?(this.oldCssProps[n]=t.style[n],t.style[n]=i):t.style[n]=this.oldCssProps[n]||""}e||(this.oldCssProps={})}}},D=1;function U(e){return e&l.Cancelled?"cancel":e&l.Ended?"end":e&l.Changed?"move":e&l.Began?"start":""}var k=class{constructor(e){this.options=e,this.id=D++,this.state=l.Possible,this.simultaneous={},this.requireFail=[]}set(e){return Object.assign(this.options,e),this.manager.touchAction.update(),this}recognizeWith(e){let t;if(Array.isArray(e)){for(let t of e)this.recognizeWith(t);return this}if("string"==typeof e){if(!(t=this.manager.get(e)))throw Error(`Cannot find recognizer ${e}`)}else t=e;let{simultaneous:r}=this;return r[t.id]||(r[t.id]=t,t.recognizeWith(this)),this}dropRecognizeWith(e){let t;if(Array.isArray(e)){for(let t of e)this.dropRecognizeWith(t);return this}return(t="string"==typeof e?this.manager.get(e):e)&&delete this.simultaneous[t.id],this}requireFailure(e){let t;if(Array.isArray(e)){for(let t of e)this.requireFailure(t);return this}if("string"==typeof e){if(!(t=this.manager.get(e)))throw Error(`Cannot find recognizer ${e}`)}else t=e;let{requireFail:r}=this;return -1===r.indexOf(t)&&(r.push(t),t.requireFailure(this)),this}dropRequireFailure(e){let t;if(Array.isArray(e)){for(let t of e)this.dropRequireFailure(t);return this}if(t="string"==typeof e?this.manager.get(e):e){let e=this.requireFail.indexOf(t);e>-1&&this.requireFail.splice(e,1)}return this}hasRequireFailures(){return!!this.requireFail.find(e=>e.options.enable)}canRecognizeWith(e){return!!this.simultaneous[e.id]}emit(e){if(!e)return;let{state:t}=this;t<l.Ended&&this.manager.emit(this.options.event+U(t),e),this.manager.emit(this.options.event,e),e.additionalEvent&&this.manager.emit(e.additionalEvent,e),t>=l.Ended&&this.manager.emit(this.options.event+U(t),e)}tryEmit(e){this.canEmit()?this.emit(e):this.state=l.Failed}canEmit(){let e=0;for(;e<this.requireFail.length;){if(!(this.requireFail[e].state&(l.Failed|l.Possible)))return!1;e++}return!0}recognize(e){let t={...e};if(!this.options.enable){this.reset(),this.state=l.Failed;return}this.state&(l.Recognized|l.Cancelled|l.Failed)&&(this.state=l.Possible),this.state=this.process(t),this.state&(l.Began|l.Changed|l.Ended|l.Cancelled)&&this.tryEmit(t)}getEventNames(){return[this.options.event]}reset(){}},G=class extends k{attrTest(e){let t=this.options.pointers;return 0===t||e.pointers.length===t}process(e){let{state:t}=this,{eventType:r}=e,i=t&(l.Began|l.Changed),n=this.attrTest(e);return i&&(r&o.Cancel||!n)?t|l.Cancelled:i||n?r&o.End?t|l.Ended:t&l.Began?t|l.Changed:l.Began:l.Failed}},H=class extends k{constructor(e={}){super({enable:!0,event:"tap",pointers:1,taps:1,interval:300,time:250,threshold:9,posThreshold:10,...e}),this.pTime=null,this.pCenter=null,this._timer=null,this._input=null,this.count=0}getTouchAction(){return[g]}process(e){let{options:t}=this,r=e.pointers.length===t.pointers,i=e.distance<t.threshold,n=e.deltaTime<t.time;if(this.reset(),e.eventType&o.Start&&0===this.count)return this.failTimeout();if(i&&n&&r){if(e.eventType!==o.End)return this.failTimeout();let r=!this.pTime||e.timeStamp-this.pTime<t.interval,i=!this.pCenter||M(this.pCenter,e.center)<t.posThreshold;if(this.pTime=e.timeStamp,this.pCenter=e.center,i&&r?this.count+=1:this.count=1,this._input=e,0==this.count%t.taps)return this.hasRequireFailures()?(this._timer=setTimeout(()=>{this.state=l.Recognized,this.tryEmit(this._input)},t.interval),l.Began):l.Recognized}return l.Failed}failTimeout(){return this._timer=setTimeout(()=>{this.state=l.Failed},this.options.interval),l.Failed}reset(){clearTimeout(this._timer)}emit(e){this.state===l.Recognized&&(e.tapCount=this.count,this.manager.emit(this.options.event,e))}},V=["","start","move","end","cancel","up","down","left","right"],z=class extends G{constructor(e={}){super({enable:!0,pointers:1,event:"pan",threshold:10,direction:a.All,...e}),this.pX=null,this.pY=null}getTouchAction(){let{options:{direction:e}}=this,t=[];return e&a.Horizontal&&t.push(E),e&a.Vertical&&t.push(m),t}getEventNames(){return V.map(e=>this.options.event+e)}directionTest(e){let{options:t}=this,r=!0,{distance:i}=e,{direction:n}=e,s=e.deltaX,o=e.deltaY;return n&t.direction||(t.direction&a.Horizontal?(n=0===s?a.None:s<0?a.Left:a.Right,r=s!==this.pX,i=Math.abs(e.deltaX)):(n=0===o?a.None:o<0?a.Up:a.Down,r=o!==this.pY,i=Math.abs(e.deltaY))),e.direction=n,r&&i>t.threshold&&!!(n&t.direction)}attrTest(e){return super.attrTest(e)&&(!!(this.state&l.Began)||!(this.state&l.Began)&&this.directionTest(e))}emit(e){this.pX=e.deltaX,this.pY=e.deltaY;let t=a[e.direction].toLowerCase();t&&(e.additionalEvent=this.options.event+t),super.emit(e)}},j=["","up","down","left","right"],W=class extends G{constructor(e={}){super({enable:!0,event:"swipe",threshold:10,velocity:.3,direction:a.All,pointers:1,...e})}getTouchAction(){return z.prototype.getTouchAction.call(this)}getEventNames(){return j.map(e=>this.options.event+e)}attrTest(e){let{direction:t}=this.options,r=0;return t&a.All?r=e.overallVelocity:t&a.Horizontal?r=e.overallVelocityX:t&a.Vertical&&(r=e.overallVelocityY),super.attrTest(e)&&!!(t&e.offsetDirection)&&e.distance>this.options.threshold&&e.maxPointers===this.options.pointers&&Math.abs(r)>this.options.velocity&&!!(e.eventType&o.End)}emit(e){let t=a[e.offsetDirection].toLowerCase();t&&this.manager.emit(this.options.event+t,e),this.manager.emit(this.options.event,e)}},X=["","start","move","end","cancel","in","out"],$=class extends G{constructor(e={}){super({enable:!0,event:"pinch",threshold:0,pointers:2,...e})}getTouchAction(){return[_]}getEventNames(){return X.map(e=>this.options.event+e)}attrTest(e){return super.attrTest(e)&&(Math.abs(e.scale-1)>this.options.threshold||!!(this.state&l.Began))}emit(e){if(1!==e.scale){let t=e.scale<1?"in":"out";e.additionalEvent=this.options.event+t}super.emit(e)}},q=["","start","move","end","cancel"],Y=class extends G{constructor(e={}){super({enable:!0,event:"rotate",threshold:0,pointers:2,...e})}getTouchAction(){return[_]}getEventNames(){return q.map(e=>this.options.event+e)}attrTest(e){return super.attrTest(e)&&(Math.abs(e.rotation)>this.options.threshold||!!(this.state&l.Began))}},Z=["","up"],K=class extends k{constructor(e={}){super({enable:!0,event:"press",pointers:1,time:251,threshold:9,...e}),this._timer=null,this._input=null}getTouchAction(){return[p]}getEventNames(){return Z.map(e=>this.options.event+e)}process(e){let{options:t}=this,r=e.pointers.length===t.pointers,i=e.distance<t.threshold,n=e.deltaTime>t.time;if(this._input=e,i&&r&&(!(e.eventType&(o.End|o.Cancel))||n)){if(e.eventType&o.Start)this.reset(),this._timer=setTimeout(()=>{this.state=l.Recognized,this.tryEmit()},t.time);else if(e.eventType&o.End)return l.Recognized}else this.reset();return l.Failed}reset(){clearTimeout(this._timer)}emit(e){this.state===l.Recognized&&(e&&e.eventType&o.End?this.manager.emit(`${this.options.event}up`,e):(this._input.timeStamp=Date.now(),this.manager.emit(this.options.event,this._input)))}},Q=class{constructor(e,t,r){this.element=e,this.callback=t,this.options=r}},J="undefined"!=typeof navigator&&navigator.userAgent?navigator.userAgent.toLowerCase():"";"undefined"!=typeof window?window:r.g;var ee=-1!==J.indexOf("firefox"),et=class extends Q{constructor(e,t,r){super(e,t,{enable:!0,...r}),this.handleEvent=e=>{if(!this.options.enable)return;let t=e.deltaY;globalThis.WheelEvent&&(ee&&e.deltaMode===globalThis.WheelEvent.DOM_DELTA_PIXEL&&(t/=globalThis.devicePixelRatio),e.deltaMode===globalThis.WheelEvent.DOM_DELTA_LINE&&(t*=40)),0!==t&&t%4.000244140625==0&&(t=Math.floor(t/4.000244140625)),e.shiftKey&&t&&(t*=.25),this.callback({type:"wheel",center:{x:e.clientX,y:e.clientY},delta:-t,srcEvent:e,pointerType:"mouse",target:e.target})},e.addEventListener("wheel",this.handleEvent,{passive:!1})}destroy(){this.element.removeEventListener("wheel",this.handleEvent)}enableEventType(e,t){"wheel"===e&&(this.options.enable=t)}},er=["mousedown","mousemove","mouseup","mouseover","mouseout","mouseleave"],ei=class extends Q{constructor(e,t,r){super(e,t,{enable:!0,...r}),this.handleEvent=e=>{this.handleOverEvent(e),this.handleOutEvent(e),this.handleEnterEvent(e),this.handleLeaveEvent(e),this.handleMoveEvent(e)},this.pressed=!1;let{enable:i}=this.options;this.enableMoveEvent=i,this.enableLeaveEvent=i,this.enableEnterEvent=i,this.enableOutEvent=i,this.enableOverEvent=i,er.forEach(t=>e.addEventListener(t,this.handleEvent))}destroy(){er.forEach(e=>this.element.removeEventListener(e,this.handleEvent))}enableEventType(e,t){switch(e){case"pointermove":this.enableMoveEvent=t;break;case"pointerover":this.enableOverEvent=t;break;case"pointerout":this.enableOutEvent=t;break;case"pointerenter":this.enableEnterEvent=t;break;case"pointerleave":this.enableLeaveEvent=t}}handleOverEvent(e){this.enableOverEvent&&"mouseover"===e.type&&this._emit("pointerover",e)}handleOutEvent(e){this.enableOutEvent&&"mouseout"===e.type&&this._emit("pointerout",e)}handleEnterEvent(e){this.enableEnterEvent&&"mouseenter"===e.type&&this._emit("pointerenter",e)}handleLeaveEvent(e){this.enableLeaveEvent&&"mouseleave"===e.type&&this._emit("pointerleave",e)}handleMoveEvent(e){if(this.enableMoveEvent)switch(e.type){case"mousedown":e.button>=0&&(this.pressed=!0);break;case"mousemove":0===e.buttons&&(this.pressed=!1),this.pressed||this._emit("pointermove",e);break;case"mouseup":this.pressed=!1}}_emit(e,t){this.callback({type:e,center:{x:t.clientX,y:t.clientY},srcEvent:t,pointerType:"mouse",target:t.target})}},en=["keydown","keyup"],es=class extends Q{constructor(e,t,r){super(e,t,{enable:!0,tabIndex:0,...r}),this.handleEvent=e=>{let t=e.target||e.srcElement;("INPUT"!==t.tagName||"text"!==t.type)&&"TEXTAREA"!==t.tagName&&(this.enableDownEvent&&"keydown"===e.type&&this.callback({type:"keydown",srcEvent:e,key:e.key,target:e.target}),this.enableUpEvent&&"keyup"===e.type&&this.callback({type:"keyup",srcEvent:e,key:e.key,target:e.target}))},this.enableDownEvent=this.options.enable,this.enableUpEvent=this.options.enable,e.tabIndex=this.options.tabIndex,e.style.outline="none",en.forEach(t=>e.addEventListener(t,this.handleEvent))}destroy(){en.forEach(e=>this.element.removeEventListener(e,this.handleEvent))}enableEventType(e,t){"keydown"===e&&(this.enableDownEvent=t),"keyup"===e&&(this.enableUpEvent=t)}},eo=class extends Q{constructor(e,t,r){super(e,t,r),this.handleEvent=e=>{this.options.enable&&this.callback({type:"contextmenu",center:{x:e.clientX,y:e.clientY},srcEvent:e,pointerType:"mouse",target:e.target})},e.addEventListener("contextmenu",this.handleEvent)}destroy(){this.element.removeEventListener("contextmenu",this.handleEvent)}enableEventType(e,t){"contextmenu"===e&&(this.options.enable=t)}},ea={pointerdown:1,pointermove:2,pointerup:4,mousedown:1,mousemove:2,mouseup:4},el={srcElement:"root",priority:0},eu=class{constructor(e,t){this.handleEvent=e=>{if(this.isEmpty())return;let t=this._normalizeEvent(e),r=e.srcEvent.target;for(;r&&r!==t.rootElement;){if(this._emit(t,r),t.handled)return;r=r.parentNode}this._emit(t,"root")},this.eventManager=e,this.recognizerName=t,this.handlers=[],this.handlersByElement=new Map,this._active=!1}isEmpty(){return!this._active}add(e,t,r,i=!1,n=!1){let{handlers:s,handlersByElement:o}=this,a={...el,...r},l=o.get(a.srcElement);l||(l=[],o.set(a.srcElement,l));let u={type:e,handler:t,srcElement:a.srcElement,priority:a.priority};i&&(u.once=!0),n&&(u.passive=!0),s.push(u),this._active=this._active||!u.passive;let c=l.length-1;for(;c>=0&&!(l[c].priority>=u.priority);)c--;l.splice(c+1,0,u)}remove(e,t){let{handlers:r,handlersByElement:i}=this;for(let n=r.length-1;n>=0;n--){let s=r[n];if(s.type===e&&s.handler===t){r.splice(n,1);let e=i.get(s.srcElement);e.splice(e.indexOf(s),1),0===e.length&&i.delete(s.srcElement)}}this._active=r.some(e=>!e.passive)}_emit(e,t){let r=this.handlersByElement.get(t);if(r){let t=!1,i=()=>{e.handled=!0},n=()=>{e.handled=!0,t=!0},s=[];for(let o=0;o<r.length;o++){let{type:a,handler:l,once:u}=r[o];if(l({...e,type:a,stopPropagation:i,stopImmediatePropagation:n}),u&&s.push(r[o]),t)break}for(let e=0;e<s.length;e++){let{type:t,handler:r}=s[e];this.remove(t,r)}}}_normalizeEvent(e){let t=this.eventManager.getElement();return{...e,...function(e){let t=ea[e.srcEvent.type];if(!t)return null;let{buttons:r,button:i}=e.srcEvent,n=!1,s=!1,o=!1;return 2===t?(n=!!(1&r),s=!!(4&r),o=!!(2&r)):(n=0===i,s=1===i,o=2===i),{leftButton:n,middleButton:s,rightButton:o}}(e),...function(e,t){let r=e.center;if(!r)return null;let i=t.getBoundingClientRect(),n=i.width/t.offsetWidth||1,s=i.height/t.offsetHeight||1,o={x:(r.x-i.left-t.clientLeft)/n,y:(r.y-i.top-t.clientTop)/s};return{center:r,offsetCenter:o}}(e,t),preventDefault:()=>{e.srcEvent.preventDefault()},stopImmediatePropagation:null,stopPropagation:null,handled:!1,rootElement:t}}},ec=class{constructor(e=null,t={}){if(this._onBasicInput=e=>{this.manager.emit(e.srcEvent.type,e)},this._onOtherEvent=e=>{this.manager.emit(e.type,e)},this.options={recognizers:[],events:{},touchAction:"compute",tabIndex:0,cssProps:{},...t},this.events=new Map,this.element=e,!e)return;for(let t of(this.manager=new B(e,this.options),this.options.recognizers)){let{recognizer:e,recognizeWith:r,requireFailure:i}=function(e){let t;if("recognizer"in e)return e;let r=Array.isArray(e)?[...e]:[e];return{recognizer:"function"==typeof r[0]?new(r.shift())(r.shift()||{}):r.shift(),recognizeWith:"string"==typeof r[0]?[r[0]]:r[0],requireFailure:"string"==typeof r[1]?[r[1]]:r[1]}}(t);this.manager.add(e),r&&e.recognizeWith(r),i&&e.requireFailure(i)}this.manager.on("hammer.input",this._onBasicInput),this.wheelInput=new et(e,this._onOtherEvent,{enable:!1}),this.moveInput=new ei(e,this._onOtherEvent,{enable:!1}),this.keyInput=new es(e,this._onOtherEvent,{enable:!1,tabIndex:t.tabIndex}),this.contextmenuInput=new eo(e,this._onOtherEvent,{enable:!1}),this.on(this.options.events)}getElement(){return this.element}destroy(){this.element&&(this.wheelInput.destroy(),this.moveInput.destroy(),this.keyInput.destroy(),this.contextmenuInput.destroy(),this.manager.destroy())}on(e,t,r){this._addEventHandler(e,t,r,!1)}once(e,t,r){this._addEventHandler(e,t,r,!0)}watch(e,t,r){this._addEventHandler(e,t,r,!1,!0)}off(e,t){this._removeEventHandler(e,t)}_toggleRecognizer(e,t){var r,i,n,s;let{manager:o}=this;if(!o)return;let a=o.get(e);a&&(a.set({enable:t}),o.touchAction.update()),null==(r=this.wheelInput)||r.enableEventType(e,t),null==(i=this.moveInput)||i.enableEventType(e,t),null==(n=this.keyInput)||n.enableEventType(e,t),null==(s=this.contextmenuInput)||s.enableEventType(e,t)}_addEventHandler(e,t,r,i,n){if("string"!=typeof e){for(let[s,o]of(r=t,Object.entries(e)))this._addEventHandler(s,o,r,i,n);return}let{manager:s,events:o}=this;if(!s)return;let a=o.get(e);!a&&(a=new eu(this,this._getRecognizerName(e)||e),o.set(e,a),s&&s.on(e,a.handleEvent)),a.add(e,t,r,i,n),a.isEmpty()||this._toggleRecognizer(a.recognizerName,!0)}_removeEventHandler(e,t){if("string"!=typeof e){for(let[t,r]of Object.entries(e))this._removeEventHandler(t,r);return}let{events:r}=this,i=r.get(e);if(i&&(i.remove(e,t),i.isEmpty())){let{recognizerName:e}=i,t=!1;for(let i of r.values())if(i.recognizerName===e&&!i.isEmpty()){t=!0;break}t||this._toggleRecognizer(e,!1)}}_getRecognizerName(e){var t;return null==(t=this.manager.recognizers.find(t=>t.getEventNames().includes(e)))?void 0:t.options.event}}},9930:function(e,t,r){"use strict";r.d(t,{Z:function(){return f}});var i=r(2265),n=r(76401);let s="undefined"!=typeof window?i.useLayoutEffect:i.useEffect;function o(e,t){for(;e;){if(e===t)return!0;e=Object.getPrototypeOf(e)}return!1}let a={position:"absolute",zIndex:-1};function l(e){return e&&"object"==typeof e&&"type"in e||!1}let u=(0,i.createContext)(),c={mixBlendMode:null};function h(e){e.redrawReason&&(e.deck._drawLayers(e.redrawReason),e.redrawReason=null)}var f=i.forwardRef(function(e,t){let[r,f]=(0,i.useState)(0),d=(0,i.useRef)({control:null,version:r,forceUpdate:()=>f(e=>e+1)}).current,p=(0,i.useRef)(null),g=(0,i.useRef)(null),_=(0,i.useMemo)(()=>(function(e){let{children:t,layers:r=[],views:s=null}=e,a=[],u=[],c={};return i.Children.forEach(function e(t){if("function"==typeof t)return(0,i.createElement)(n.View,{},t);if(Array.isArray(t))return t.map(e);if(l(t)){if(t.type===i.Fragment)return e(t.props.children);o(t.type,n.View)}return t}(t),e=>{if(l(e)){let t=e.type;if(o(t,n.Layer)){let r=function(e,t){let r={},i=e.defaultProps||{};for(let e in t)i[e]!==t[e]&&(r[e]=t[e]);return new e(r)}(t,e.props);u.push(r)}else a.push(e);if(o(t,n.View)&&t!==n.View&&e.props.id){let r=new t(e.props);c[r.id]=r}}else e&&a.push(e)}),Object.keys(c).length>0&&(Array.isArray(s)?s.forEach(e=>{c[e.id]=e}):s&&(c[s.id]=s),s=Object.values(c)),{layers:r=u.length>0?[...u,...r]:r,children:a,views:s}})(e),[e.layers,e.views,e.children]),m=!0,E=t=>{var r;return m&&e.viewState?(d.viewStateUpdateRequested=t,null):(d.viewStateUpdateRequested=null,null===(r=e.onViewStateChange)||void 0===r?void 0:r.call(e,t))},v=t=>{if(m)d.interactionStateUpdateRequested=t;else{var r;d.interactionStateUpdateRequested=null,null===(r=e.onInteractionStateChange)||void 0===r||r.call(e,t)}},b=(0,i.useMemo)(()=>{let t={widgets:[],...e,style:null,width:"100%",height:"100%",parent:p.current,canvas:g.current,layers:_.layers,views:_.views,onViewStateChange:E,onInteractionStateChange:v};return delete t._customRender,d.deck&&d.deck.setProps(t),t},[e]);(0,i.useEffect)(()=>{let t=e.Deck||n.Deck;return d.deck=function(e,t,r){var i,n,s;let o=new t({...r,_customRender:(null===(s=r.deviceProps)||void 0===s?void 0:null===(n=s.adapters)||void 0===n?void 0:null===(i=n[0])||void 0===i?void 0:i.type)==="webgpu"?void 0:t=>{e.redrawReason=t;let r=o.getViewports();e.lastRenderedViewports!==r?e.forceUpdate():h(e)}});return o}(d,t,{...b,parent:p.current,canvas:g.current}),()=>{var e;return null===(e=d.deck)||void 0===e?void 0:e.finalize()}},[]),s(()=>{var e;h(d);let{viewStateUpdateRequested:t,interactionStateUpdateRequested:r}=d;t&&E(t),r&&v(r),(null===(e=d.deck)||void 0===e?void 0:e.isInitialized)&&d.deck.redraw("Initial render")}),(0,i.useImperativeHandle)(t,()=>({get deck(){return d.deck},pickObject:e=>d.deck.pickObject(e),pickMultipleObjects:e=>d.deck.pickMultipleObjects(e),pickObjects:e=>d.deck.pickObjects(e)}),[]);let A=d.deck&&d.deck.isInitialized?d.deck.getViewports():void 0,{ContextProvider:y,width:T="100%",height:R="100%",id:S,style:M}=e,{containerStyle:I,canvasStyle:C}=(0,i.useMemo)(()=>(function(e){let{width:t,height:r,style:i}=e,n={position:"absolute",zIndex:0,left:0,top:0,width:t,height:r},s={left:0,top:0};if(i)for(let e in i)e in c?s[e]=i[e]:n[e]=i[e];return{containerStyle:n,canvasStyle:s}})({width:T,height:R,style:M}),[T,R,M]);if(!d.viewStateUpdateRequested&&d.lastRenderedViewports===A||d.version!==r){d.lastRenderedViewports=A,d.version=r;let e=function(e){let{children:t,deck:r,ContextProvider:s=u.Provider}=e,{viewManager:c}=r||{};if(!c||!c.views.length)return[];let h={},f=c.views[0].id;for(let e of t){let t=f,r=e;l(e)&&o(e.type,n.View)&&(t=e.props.id||f,r=e.props.children);let s=c.getViewport(t),u=c.getViewState(t);if(s){u.padding=s.padding;let{x:e,y:n,width:o,height:c}=s;r=function e(t,r){if("function"==typeof t)return t(r);if(Array.isArray(t))return t.map(t=>e(t,r));if(l(t)){if(function(e){var t;return null===(t=e.props)||void 0===t?void 0:t.mapStyle}(t))return r.style=a,(0,i.cloneElement)(t,r);if(function(e){let t=e.type;return t&&t.deckGLViewProps}(t))return(0,i.cloneElement)(t,r)}return t}(r,{x:e,y:n,width:o,height:c,viewport:s,viewState:u}),h[t]||(h[t]={viewport:s,children:[]}),h[t].children.push(r)}}return Object.keys(h).map(e=>{let{viewport:t,children:n}=h[e],{x:o,y:a,width:l,height:u}=t,c="view-".concat(e),f=(0,i.createElement)("div",{key:c,id:c,style:{position:"absolute",left:o,top:a,width:l,height:u}},...n),d={deck:r,viewport:t,container:r.canvas.offsetParent,eventManager:r.eventManager,onViewStateChange:t=>{t.viewId=e,r._onViewStateChange(t)},widgets:[]},p="view-".concat(e,"-context");return(0,i.createElement)(s,{key:p,value:d},f)})}({children:_.children,deck:d.deck,ContextProvider:y}),t=(0,i.createElement)("canvas",{key:"canvas",id:S||"deckgl-overlay",ref:g,style:C});d.control=(0,i.createElement)("div",{id:"".concat(S||"deckgl","-wrapper"),ref:p,style:I},[t,e])}return m=!1,d.control})},53230:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return i}});class i{constructor({fontSize:e=24,buffer:t=3,radius:r=8,cutoff:i=.25,fontFamily:n="sans-serif",fontWeight:s="normal",fontStyle:o="normal",lang:a=null}={}){this.buffer=t,this.cutoff=i,this.radius=r,this.lang=a;let l=this.size=e+4*t,u=this._createCanvas(l),c=this.ctx=u.getContext("2d",{willReadFrequently:!0});c.font=`${o} ${s} ${e}px ${n}`,c.textBaseline="alphabetic",c.textAlign="left",c.fillStyle="black",this.gridOuter=new Float64Array(l*l),this.gridInner=new Float64Array(l*l),this.f=new Float64Array(l),this.z=new Float64Array(l+1),this.v=new Uint16Array(l)}_createCanvas(e){let t=document.createElement("canvas");return t.width=t.height=e,t}draw(e){let{width:t,actualBoundingBoxAscent:r,actualBoundingBoxDescent:i,actualBoundingBoxLeft:s,actualBoundingBoxRight:o}=this.ctx.measureText(e),a=Math.ceil(r),l=Math.max(0,Math.min(this.size-this.buffer,Math.ceil(o-s))),u=Math.min(this.size-this.buffer,a+Math.ceil(i)),c=l+2*this.buffer,h=u+2*this.buffer,f=Math.max(c*h,0),d=new Uint8ClampedArray(f),p={data:d,width:c,height:h,glyphWidth:l,glyphHeight:u,glyphTop:a,glyphLeft:0,glyphAdvance:t};if(0===l||0===u)return p;let{ctx:g,buffer:_,gridInner:m,gridOuter:E}=this;this.lang&&(g.lang=this.lang),g.clearRect(_,_,l,u),g.fillText(e,_,_+a);let v=g.getImageData(_,_,l,u);E.fill(1e20,0,f),m.fill(0,0,f);for(let e=0;e<u;e++)for(let t=0;t<l;t++){let r=v.data[4*(e*l+t)+3]/255;if(0===r)continue;let i=(e+_)*c+t+_;if(1===r)E[i]=0,m[i]=1e20;else{let e=.5-r;E[i]=e>0?e*e:0,m[i]=e<0?e*e:0}}n(E,0,0,c,h,c,this.f,this.v,this.z),n(m,_,_,l,u,c,this.f,this.v,this.z);for(let e=0;e<f;e++){let t=Math.sqrt(E[e])-Math.sqrt(m[e]);d[e]=Math.round(255-255*(t/this.radius+this.cutoff))}return p}}function n(e,t,r,i,n,o,a,l,u){for(let c=t;c<t+i;c++)s(e,r*o+c,o,n,a,l,u);for(let c=r;c<r+n;c++)s(e,c*o+t,1,i,a,l,u)}function s(e,t,r,i,n,s,o){s[0]=0,o[0]=-1e20,o[1]=1e20,n[0]=e[t];for(let a=1,l=0,u=0;a<i;a++){n[a]=e[t+a*r];let i=a*a;do{let e=s[l];u=(n[a]-n[e]+i-e*e)/(a-e)/2}while(u<=o[l]&&--l>-1);s[++l]=a,o[l]=u,o[l+1]=1e20}for(let a=0,l=0;a<i;a++){for(;o[l+1]<a;)l++;let i=s[l],u=a-i;e[t+a*r]=n[i]+u*u}}}}]);