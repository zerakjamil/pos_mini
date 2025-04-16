import{r as l,ag as U,af as W,E as D,d as w,U as x,b as s,f as k,c as q,t as h,e as F,N as G}from"./app-CoXKttN8.js";function H(n,o){if(n==null)return{};var e={};for(var r in n)if({}.hasOwnProperty.call(n,r)){if(o.indexOf(r)!==-1)continue;e[r]=n[r]}return e}function I(n,o){if(n==null)return{};var e,r,t=H(n,o);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(n);for(r=0;r<a.length;r++)e=a[r],o.indexOf(e)===-1&&{}.propertyIsEnumerable.call(n,e)&&(t[e]=n[e])}return t}var S=l.createContext({});function R(n){var o;return n==null||(o=n.getRootNode)===null||o===void 0?void 0:o.call(n)}function J(n){return R(n)instanceof ShadowRoot}function K(n){return J(n)?R(n):null}function M(n){return n.replace(/-(.)/g,function(o,e){return e.toUpperCase()})}function Q(n,o){D(n,"[@ant-design/icons] ".concat(o))}function N(n){return w(n)==="object"&&typeof n.name=="string"&&typeof n.theme=="string"&&(w(n.icon)==="object"||typeof n.icon=="function")}function _(){var n=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return Object.keys(n).reduce(function(o,e){var r=n[e];switch(e){case"class":o.className=r,delete o.class;break;default:delete o[e],o[M(e)]=r}return o},{})}function p(n,o,e){return e?x.createElement(n.tag,s(s({key:o},_(n.attrs)),e),(n.children||[]).map(function(r,t){return p(r,"".concat(o,"-").concat(n.tag,"-").concat(t))})):x.createElement(n.tag,s({key:o},_(n.attrs)),(n.children||[]).map(function(r,t){return p(r,"".concat(o,"-").concat(n.tag,"-").concat(t))}))}function E(n){return U(n)[0]}function O(n){return n?Array.isArray(n)?n:[n]:[]}var V=`
.anticon {
  display: inline-flex;
  align-items: center;
  color: inherit;
  font-style: normal;
  line-height: 0;
  text-align: center;
  text-transform: none;
  vertical-align: -0.125em;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.anticon > * {
  line-height: 1;
}

.anticon svg {
  display: inline-block;
}

.anticon::before {
  display: none;
}

.anticon .anticon-icon {
  display: block;
}

.anticon[tabindex] {
  cursor: pointer;
}

.anticon-spin::before,
.anticon-spin {
  display: inline-block;
  -webkit-animation: loadingCircle 1s infinite linear;
  animation: loadingCircle 1s infinite linear;
}

@-webkit-keyframes loadingCircle {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes loadingCircle {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
`,X=function(o){var e=l.useContext(S),r=e.csp,t=e.prefixCls,a=e.layer,i=V;t&&(i=i.replace(/anticon/g,t)),a&&(i="@layer ".concat(a,` {
`).concat(i,`
}`)),l.useEffect(function(){var u=o.current,m=K(u);W(i,"@ant-design-icons",{prepend:!a,csp:r,attachTo:m})},[])},Y=["icon","className","onClick","style","primaryColor","secondaryColor"],C={primaryColor:"#333",secondaryColor:"#E6E6E6",calculated:!1};function Z(n){var o=n.primaryColor,e=n.secondaryColor;C.primaryColor=o,C.secondaryColor=e||E(o),C.calculated=!!e}function nn(){return s({},C)}var d=function(o){var e=o.icon,r=o.className,t=o.onClick,a=o.style,i=o.primaryColor,u=o.secondaryColor,m=I(o,Y),y=l.useRef(),f=C;if(i&&(f={primaryColor:i,secondaryColor:u||E(i)}),X(y),Q(N(e),"icon should be icon definiton, but got ".concat(e)),!N(e))return null;var c=e;return c&&typeof c.icon=="function"&&(c=s(s({},c),{},{icon:c.icon(f.primaryColor,f.secondaryColor)})),p(c.icon,"svg-".concat(c.name),s(s({className:r,onClick:t,style:a,"data-icon":c.name,width:"1em",height:"1em",fill:"currentColor","aria-hidden":"true"},m),{},{ref:y}))};d.displayName="IconReact";d.getTwoToneColors=nn;d.setTwoToneColors=Z;function j(n){var o=O(n),e=k(o,2),r=e[0],t=e[1];return d.setTwoToneColors({primaryColor:r,secondaryColor:t})}function on(){var n=d.getTwoToneColors();return n.calculated?[n.primaryColor,n.secondaryColor]:n.primaryColor}var en=["className","icon","spin","rotate","tabIndex","onClick","twoToneColor"];j(G.primary);var T=l.forwardRef(function(n,o){var e=n.className,r=n.icon,t=n.spin,a=n.rotate,i=n.tabIndex,u=n.onClick,m=n.twoToneColor,y=I(n,en),f=l.useContext(S),c=f.prefixCls,g=c===void 0?"anticon":c,z=f.rootClassName,P=q(z,g,h(h({},"".concat(g,"-").concat(r.name),!!r.name),"".concat(g,"-spin"),!!t||r.name==="loading"),e),v=i;v===void 0&&u&&(v=-1);var $=a?{msTransform:"rotate(".concat(a,"deg)"),transform:"rotate(".concat(a,"deg)")}:void 0,A=O(m),b=k(A,2),B=b[0],L=b[1];return l.createElement("span",F({role:"img","aria-label":r.name},y,{ref:o,tabIndex:v,onClick:u,className:P}),l.createElement(d,{icon:r,primaryColor:B,secondaryColor:L,style:$}))});T.displayName="AntdIcon";T.getTwoToneColor=on;T.setTwoToneColor=j;export{T as I,I as _,S as a,K as g};
