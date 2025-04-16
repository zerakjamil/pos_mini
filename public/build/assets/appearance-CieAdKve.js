import{u as i,ax as h,j as e,L as u}from"./app-CoXKttN8.js";import{c as o}from"./button-CcGvkG1f.js";import{c as r}from"./createLucideIcon-CN5-yLR1.js";import{H as x}from"./heading-small-lD7RqMwy.js";import{A as y}from"./app-layout-8ij2nKkQ.js";import{S as k}from"./layout-WjraYdBY.js";import"./index-B0sxA8bq.js";import"./index-DvOx0I6S.js";import"./index-C85uQcsJ.js";import"./index-i2yTW8u6.js";import"./index-r1U0Z8Y9.js";import"./app-logo-icon-DpXoyYPw.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=[["rect",{width:"20",height:"14",x:"2",y:"3",rx:"2",key:"48i651"}],["line",{x1:"8",x2:"16",y1:"21",y2:"21",key:"1svkeh"}],["line",{x1:"12",x2:"12",y1:"17",y2:"21",key:"vw1qmm"}]],b=r("Monitor",g);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",key:"a7tn18"}]],f=r("Moon",j);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]],M=r("Sun",v);function N({className:t="",...a}){const{t:n}=i("settings/appearance"),{appearance:c,updateAppearance:p}=h(),l=[{value:"light",icon:M,label:n("modes.light")},{value:"dark",icon:f,label:n("modes.dark")},{value:"system",icon:b,label:n("modes.system")}];return e.jsx("div",{className:o("inline-flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800",t),...a,children:l.map(({value:s,icon:d,label:m})=>e.jsxs("button",{onClick:()=>p(s),className:o("flex items-center rounded-md px-3.5 py-1.5 transition-colors",c===s?"bg-white shadow-xs dark:bg-neutral-700 dark:text-neutral-100":"text-neutral-500 hover:bg-neutral-200/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-700/60"),children:[e.jsx(d,{className:"h-4 w-4 ml-1"}),e.jsx("span",{className:"ml-1.5 text-sm",children:m})]},s))})}function I(){const{t}=i("settings/appearance"),a=[{title:t("breadcrumb"),href:"/settings/appearance"}];return e.jsxs(y,{breadcrumbs:a,children:[e.jsx(u,{title:t("page_title")}),e.jsx(k,{children:e.jsxs("div",{className:"space-y-6",children:[e.jsx(x,{title:t("heading.title"),description:t("heading.description")}),e.jsx(N,{})]})})]})}export{I as default};
