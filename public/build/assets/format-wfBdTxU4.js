const n=(t,e="$")=>{const r=typeof t=="string"?parseFloat(t):t;return`${e} ${r.toFixed(2).replace(/\d(?=(\d{3})+\.)/g,"$&,")}`},o=t=>{const e=typeof t=="string"?new Date(t):t;return isNaN(e.getTime())?"":e.toLocaleDateString("en-CA")};export{o as a,n as f};
//# sourceMappingURL=format-wfBdTxU4.js.map
