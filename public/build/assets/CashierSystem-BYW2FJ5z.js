import{r as c,u as R,j as e,K as q,m as pe,L as he}from"./app-CoXKttN8.js";import{A as xe}from"./app-layout-8ij2nKkQ.js";import{S as fe}from"./index-kRGCB9zT.js";import{I as ge}from"./index-BRq_Oc9f.js";import{R as be}from"./BarcodeOutlined-rDPvYsdu.js";import{B as k}from"./button-DsfFQUng.js";import{R as ye}from"./SearchOutlined-BCDBW3ZC.js";import{T as U}from"./index-Dt7rcZlJ.js";import{R as ve}from"./DeleteOutlined-BQZi8Blj.js";import{F as D,R as B}from"./Table-BlIHtI_R.js";import{T as G}from"./index-VRO07ue7.js";import{M as X}from"./index-tW6eQ1jA.js";import{D as Y}from"./index-AAE4Q3Fn.js";import{T as K}from"./index-CoYvwZ5t.js";import{X as je}from"./index-B0sxA8bq.js";import{R as F,C as z}from"./row-Q--lQiZy.js";import{C as we}from"./circle-plus-D1mt_0PP.js";import{S as Q}from"./index-BcrJBACe.js";import{s as _}from"./index-DjClTqkO.js";import{C as O}from"./index-Brp1oyrZ.js";import"./button-CcGvkG1f.js";import"./index-DvOx0I6S.js";import"./index-i2yTW8u6.js";import"./index-C85uQcsJ.js";import"./index-r1U0Z8Y9.js";import"./createLucideIcon-CN5-yLR1.js";import"./app-logo-icon-DpXoyYPw.js";import"./useSize-DdazIbtM.js";import"./AntdIcon-DtyAY1B3.js";import"./colors-DxCZdjT7.js";import"./useVariants-C2zpy4FK.js";import"./getAllowClear-8q0Hx_mz.js";import"./Input-CjHprXgF.js";import"./EyeOutlined-DBbtMVcA.js";import"./TextArea-CuO2h10_.js";import"./useIcons-CfiTnf06.js";import"./CloseOutlined-CRwiKe2l.js";import"./styleChecker-C9taYto1.js";import"./EllipsisOutlined-CDA1r8G5.js";import"./Overflow-CJC26LAP.js";import"./useBreakpoint-C3N2ICND.js";import"./CheckCircleFilled-BC74THRN.js";import"./ExclamationCircleFilled-CKvz4gUz.js";import"./InfoCircleFilled-BM2Jtd5Z.js";import"./ActionButton-pVULiGwU.js";import"./index-yDQGqAM-.js";import"./fade-B0zGfLQg.js";import"./PlusOutlined-BNd7I6P2.js";const ke=c.forwardRef(({onBarcodeScan:t,onProductLookup:s},o)=>{const{t:n}=R(),[r,l]=c.useState(""),[a,u]=c.useState(""),[d,v]=c.useState(null),[y,j]=c.useState(""),[m,E]=c.useState(0),f=c.useRef(null),S=1500;c.useImperativeHandle(o,()=>({focusInput:()=>{f.current&&f.current.focus()}})),c.useEffect(()=>{f.current&&f.current.focus()},[]);const h=c.useCallback(x=>{const g=Date.now();if(x===y&&g-m<S){console.log("Duplicate scan detected and ignored");return}j(x),E(g),t(x)},[y,m,t]);c.useEffect(()=>{const x=g=>{var w;if(!(document.activeElement instanceof HTMLInputElement&&document.activeElement!==((w=f.current)==null?void 0:w.input))){if(g.key==="Enter"&&a){g.preventDefault(),h(a),u("");return}if(/^[a-zA-Z0-9]$/.test(g.key)){d&&clearTimeout(d);const i=setTimeout(()=>{u("")},100);v(i),u(b=>b+g.key)}}};return window.addEventListener("keydown",x),()=>{window.removeEventListener("keydown",x),d&&clearTimeout(d)}},[a,d,t,y,m,h]);const L=()=>{r.trim()&&(h(r.trim()),l(""),f.current&&f.current.focus())};return e.jsx("div",{style:{marginBottom:16},children:e.jsxs(fe,{style:{width:"100%"},children:[e.jsx(ge,{ref:f,placeholder:n("cashier.barcode.placeholder"),value:r,onChange:x=>l(x.target.value),onPressEnter:x=>{x.preventDefault(),L()},prefix:e.jsx(be,{}),style:{width:300},autoFocus:!0}),e.jsx(k,{onClick:s,icon:e.jsx(ye,{}),"aria-label":n("cashier.barcode.productLookup"),children:n("cashier.barcode.productLookup")})]})})}),{Text:V}=G,Se=({cartItems:t,onUpdateQuantity:s,onRemoveItem:o,total:n})=>{const{t:r}=R(),l=[{title:r("cashier.cart.product"),dataIndex:"name",key:"name"},{title:r("cashier.cart.price"),dataIndex:"price",key:"price",render:a=>`${r("common.currency")} ${a.toFixed(0)}`},{title:r("cashier.cart.quantity"),dataIndex:"quantity",key:"quantity",render:(a,u)=>e.jsx(U,{min:1,value:u.quantity,onChange:d=>s(u.id,d||1),style:{width:60}})},{title:r("cashier.cart.subtotal"),dataIndex:"subtotal",key:"subtotal",render:a=>`${r("common.currency")} ${a.toFixed(0)}`},{title:r("cashier.cart.action"),key:"action",render:(a,u)=>e.jsx(k,{type:"text",danger:!0,icon:e.jsx(ve,{}),onClick:()=>o(u.id),"aria-label":r("cashier.cart.remove")})}];return e.jsx(D,{columns:l,dataSource:t,pagination:!1,rowKey:"id",summary:()=>e.jsx(D.Summary,{fixed:!0,children:e.jsxs(D.Summary.Row,{children:[e.jsx(D.Summary.Cell,{index:0,colSpan:3,children:e.jsx(V,{strong:!0,children:r("cashier.cart.total")})}),e.jsx(D.Summary.Cell,{index:1,children:e.jsxs(V,{strong:!0,children:[r("common.currency")," ",n.toFixed(0)]})}),e.jsx(D.Summary.Cell,{index:2})]})}),locale:{emptyText:r("cashier.cart.empty")}})},Ce=({visible:t,total:s,amountPaid:o,change:n,paymentType:r,selectedDebtor:l,onAmountPaidChange:a,onPaymentTypeChange:u,onDebtorChange:d,onComplete:v,onCancel:y,loading:j})=>{const{t:m}=R(),f=q().props.debtors,[S,h]=c.useState([]),L=[{value:5e3,color:"#e6f7ff"},{value:1e4,color:"#fff7e6"},{value:25e3,color:"#f6ffed"},{value:5e4,color:"#fff2e8"}],x=i=>{const b=[...S,i];h(b);const $=b.reduce((I,C)=>I+C,0);a($)},g=()=>{h([]),a(null)},w=()=>{h([s]),a(s)};return c.useEffect(()=>{h(t?o?[o]:[]:[])},[t,o]),c.useEffect(()=>{r==="cash"&&o!==null&&(o>s?o-s:0)!==n&&a(o)},[o,s,r]),e.jsx(X,{title:m("cashier.checkout.title"),open:t,onCancel:y,width:450,bodyStyle:{padding:"12px",maxHeight:"70vh",overflowY:"auto"},footer:[e.jsx(k,{onClick:y,children:m("cashier.checkout.cancel")},"back"),e.jsx(k,{type:"primary",loading:j,onClick:v,disabled:r==="cash"&&(!o||o<s),children:m("cashier.checkout.complete")},"submit")],children:e.jsxs("div",{children:[e.jsx("div",{className:"text-lg font-semibold mb-2 p-2 bg-gray-100 rounded-md",children:m("cashier.checkout.total",{amount:s.toFixed(0)})}),e.jsx(Y,{style:{margin:"8px 0"}}),e.jsx("div",{className:"mb-2",children:e.jsxs(B.Group,{value:r,onChange:i=>u(i.target.value),className:"mb-2",buttonStyle:"solid",size:"middle",style:{width:"100%"},children:[e.jsx(B.Button,{value:"cash",style:{width:"50%",textAlign:"center"},children:m("cashier.checkout.paymentType.cash")}),e.jsx(B.Button,{value:"debt",style:{width:"50%",textAlign:"center"},children:m("cashier.checkout.paymentType.debt")})]})}),r==="cash"?e.jsxs("div",{children:[e.jsxs("div",{className:"mb-2",children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:m("cashier.checkout.amountPaid")}),e.jsx(U,{className:"w-full",min:0,step:1e3,value:o,onChange:i=>{a(i),h(i?[i]:[])},formatter:i=>`${m("common.currency")} ${i}`.replace(/\B(?=(\d{3})+(?!\d))/g,","),parser:i=>i.replace(/\IQD\s?|(,*)/g,""),size:"middle",style:{width:"100%",fontSize:"16px"},controls:!1})]}),S.length>0&&e.jsxs("div",{className:"mb-2 p-1 bg-gray-50 rounded border border-gray-200",children:[e.jsxs("div",{className:"flex flex-wrap gap-1 mb-1",children:[S.map((i,b)=>e.jsx(K,{color:"blue",style:{fontSize:"12px",padding:"2px 6px",margin:"2px"},children:Number(i).toLocaleString()},b)),e.jsx(K,{color:"red",style:{cursor:"pointer",fontSize:"12px",padding:"2px 6px",margin:"2px"},onClick:g,children:e.jsx(je,{size:12})})]}),e.jsxs("div",{className:"text-xs text-gray-500 px-2",children:[m("common.total"),": ",o==null?void 0:o.toLocaleString()," ",m("common.currency")]})]}),e.jsxs("div",{className:"mb-2",children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:m("cashier.checkout.quickPayment")}),e.jsx(F,{gutter:[3,3],children:L.map(i=>e.jsx(z,{span:12,children:e.jsxs(k,{onClick:()=>x(i.value),style:{width:"100%",height:"34px",backgroundColor:i.color,fontWeight:"bold",padding:"0 4px",fontSize:"12px"},children:[e.jsx(we,{size:16,style:{marginRight:"4px"}}),Number(i.value).toLocaleString()]})},i.value))})]}),e.jsx("div",{className:"mb-2",children:e.jsxs(F,{gutter:[4,4],children:[e.jsx(z,{span:12,children:e.jsx(k,{type:"primary",style:{width:"100%",height:"32px",fontSize:"12px"},onClick:w,children:m("cashier.checkout.exactAmount")})}),e.jsx(z,{span:12,children:e.jsx(k,{danger:!0,style:{width:"100%",height:"32px",fontSize:"12px"},onClick:g,children:m("cashier.checkout.clear")})})]})}),n>0&&e.jsx("div",{className:"mt-2 p-2 bg-green-50 rounded-md",children:e.jsxs("div",{className:"text-base font-semibold text-green-700",children:[m("cashier.checkout.change"),": ",n.toLocaleString()," IQD"]})})]}):e.jsxs("div",{children:[e.jsxs("div",{className:"mb-2",children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:m("cashier.checkout.selectDebtor")}),e.jsx(Q,{showSearch:!0,style:{width:"100%"},placeholder:m("cashier.checkout.debtorPlaceholder"),optionFilterProp:"children",value:l,onChange:d,filterOption:(i,b)=>((b==null?void 0:b.label)??"").toLowerCase().includes(i.toLowerCase()),options:f.map(i=>({value:i.id,label:`${i.name}${i.phone?` (${i.phone})`:""}`,description:i.debts_sum_balance?`${m("cashier.checkout.existingDebt")}: ${i.debts_sum_balance.toLocaleString()} IQD`:void 0})),optionRender:i=>e.jsxs("div",{children:[e.jsx("div",{children:i.label}),i.data.description&&e.jsx("div",{className:"text-xs text-red-500",children:i.data.description})]})})]}),e.jsxs("div",{className:"mt-4",children:[e.jsx("div",{className:"text-sm text-gray-600 mb-2",children:m("cashier.checkout.debtDescription")}),e.jsxs("div",{className:"p-2 bg-yellow-50 rounded-md text-sm",children:[e.jsx("div",{className:"font-medium text-yellow-800 mb-1",children:m("cashier.checkout.debtWarning")}),e.jsxs("div",{className:"text-yellow-700",children:[m("cashier.checkout.debtAmount"),": ",Number(s).toLocaleString()," ",m("common.currency")]})]})]})]})]})})},{Option:Lt}=Q,Te=({visible:t,products:s,selectedProduct:o,onProductSelect:n,onOk:r,onCancel:l})=>{const{t:a}=R(),u=d=>d.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");return e.jsx(X,{title:a("cashier.productLookup.title"),open:t,onOk:r,onCancel:l,okButtonProps:{disabled:!o},okText:a("common.ok"),cancelText:a("common.cancel"),children:e.jsx(Q,{showSearch:!0,style:{width:"100%"},placeholder:a("cashier.productLookup.searchPlaceholder"),optionFilterProp:"label",onChange:d=>n(d),filterOption:(d,v)=>((v==null?void 0:v.label)??"").toLowerCase().includes(d.toLowerCase()),options:Array.isArray(s)?s.map(d=>({value:d.id,label:`${d.name} - ${a("common.currency")} ${u(d.price)} (${a("cashier.productLookup.inStock",{stock:d.stock})})`})):[]})})},{Title:W}=G,Ne=({cartItems:t,total:s,onCheckout:o,onClearCart:n})=>{const{t:r}=R();return e.jsxs("div",{className:"flex h-full flex-col",children:[e.jsxs("div",{className:"mb-4 flex-grow",children:[e.jsxs("div",{className:"mb-4 flex justify-between",children:[e.jsxs(W,{level:4,children:[r("cashier.summary.total"),":"]}),e.jsxs(W,{level:4,children:[r("common.currency")," ",s.toFixed(0)]})]}),e.jsx(Y,{}),e.jsxs("div",{className:"mb-4",children:[e.jsxs("p",{children:[r("cashier.summary.items"),": ",t.length]}),e.jsxs("p",{children:[r("cashier.summary.totalQuantity"),": ",t.reduce((l,a)=>l+a.quantity,0)]})]})]}),e.jsxs("div",{className:"mt-auto flex flex-col gap-2",children:[e.jsx(k,{type:"primary",size:"large",block:!0,onClick:o,disabled:t.length===0,children:r("cashier.cart.checkout")}),e.jsx(k,{danger:!0,size:"large",block:!0,onClick:n,disabled:t.length===0,children:r("cashier.cart.clear")})]})]})},Le=t=>t.reduce((s,o)=>s+o.subtotal,0),De=(t,s)=>{const o=s.findIndex(n=>n.id===t.id);if(o>=0){const n=[...s],r=n[o],l=r.quantity+1;return n[o]={...r,quantity:l,subtotal:t.price*l},n}else return[...s,{id:t.id,name:t.name,price:t.price,quantity:1,subtotal:t.price}]},Re=(t,s,o)=>s<=0?Z(t,o):o.map(n=>n.id===t?{...n,quantity:s,subtotal:n.price*s}:n),Z=(t,s)=>s.filter(o=>o.id!==t),$e=async t=>{try{const s=await fetch(`/api/sales/${t}`);if(!s.ok)throw new Error("Failed to fetch sale details");const o=await s.json(),n={cartItems:o.items.map(r=>({id:r.product_id,name:r.product_name,quantity:r.quantity,price:r.unit_price,subtotal:r.subtotal})),total:o.total_amount,amountPaid:o.amount_paid,change:o.change_amount,transactionNumber:o.transaction_number};Ie(n)}catch(s){console.error("Error printing receipt:",s),J(t)}},J=t=>{const s=window.open("","_blank","width=300,height=300");if(!s){console.error("Could not open receipt window");return}const o=new Date,n=o.toLocaleDateString("ar-IQ"),r=o.toLocaleTimeString("ar-IQ");let l=`
    <html dir="ltr">
    <head>
      <title>Receipt</title>
      <style>
        body {
          font-family: 'Courier New', monospace;
          font-size: 12px;
          width: 80mm;
          margin: 0 auto;
          padding: 5px;
        }
        .header { text-align: center; margin-bottom: 10px; }
        .store-name { font-size: 16px; font-weight: bold; }
        .store-info { font-size: 10px; margin: 2px 0; }
        .footer { text-align: center; margin-top: 10px; font-size: 10px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="store-name">سوپەر ماركێت</div>
        <div class="store-info">Kurdistan Region - Iraq</div>
        <div class="store-info">Tel: 0750 000 0000</div>
        <div class="store-info">Date: ${n}</div>
        <div class="store-info">Time: ${r}</div>
        <div class="store-info">Receipt #: ${t}</div>
      </div>

      <div style="text-align: center; margin: 20px 0;">
        <p>Transaction completed successfully!</p>
        <p>Thank you for your purchase.</p>
      </div>

      <div class="footer">
        <p>Thank you for shopping with us!</p>
        <p>سوپاس بۆ کڕینەکەت</p>
      </div>

      <div style="text-align: center; margin-top: 20px;">
        <button onclick="window.print()">Print</button>
        <button onclick="window.close()">Close</button>
      </div>
    </body>
    </html>
  `;s.document.open(),s.document.write(l),s.document.close(),setTimeout(()=>{try{s.print()}catch(a){console.error("Print failed:",a)}},500)},Ie=t=>{const{cartItems:s,total:o,amountPaid:n,change:r,transactionNumber:l}=t;if(!s||!Array.isArray(s)){console.error("Invalid cartItems:",s),J(l);return}const a=window.open("","_blank","width=300,height=600");if(!a){console.error("Could not open receipt window");return}const u=new Date,d=u.toLocaleDateString("ar-IQ"),v=u.toLocaleTimeString("ar-IQ");let y=`
    <html dir="ltr">
    <head>
      <title>Receipt</title>
      <style>
        @media print {
          @page { margin: 0; }
          body { margin: 0.5cm; }
        }
        body {
          font-family: 'Courier New', monospace;
          font-size: 12px;
          width: 80mm;
          margin: 0 auto;
          padding: 5px;
        }
        .header { text-align: center; margin-bottom: 10px; }
        .store-name { font-size: 16px; font-weight: bold; }
        .store-info { font-size: 10px; margin: 2px 0; }
        .divider { border-top: 1px dotted #000; margin: 5px 0; }
        .item {
          display: flex;
          justify-content: space-between;
          margin: 3px 0;
          font-size: 11px;
        }
        .item-total { text-align: right; font-weight: bold; }
        .totals {
          margin-top: 5px;
          text-align: right;
          font-size: 12px;
        }
        .total-line {
          display: flex;
          justify-content: space-between;
          margin: 2px 0;
        }
        .grand-total {
          font-size: 14px;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          margin-top: 10px;
          font-size: 10px;
        }
        .barcode {
          text-align: center;
          margin: 10px 0;
          font-family: 'Courier', monospace;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="store-name">سوپەر ماركێت</div>
        <div class="store-info">Kurdistan Region - Iraq</div>
        <div class="store-info">Tel: 0750 000 0000</div>
        <div class="store-info">VAT Reg: 12345678</div>
        <div class="store-info">Date: ${d}</div>
        <div class="store-info">Time: ${v}</div>
        <div class="store-info">Receipt #: ${l}</div>
      </div>

      <div class="divider"></div>

      <div class="items">
        <div class="item" style="font-weight: bold;">
          <span>Item</span>
          <span>Qty</span>
          <span>Price</span>
        </div>
  `;s.forEach(j=>{y+=`
      <div class="item">
        <span>${j.name}</span>
        <span>x${j.quantity}</span>
        <span>${Number(j.price).toLocaleString()} د.ع</span>
      </div>
      <div class="item-total">
        <span>${Number(j.subtotal).toLocaleString()} د.ع</span>
      </div>
    `}),y+=`
      </div>

      <div class="divider"></div>

      <div class="totals">
        <div class="total-line grand-total">
          <span>Total:</span>
          <span>${Number(o).toLocaleString()} د.ع</span>
        </div>
        <div class="total-line">
          <span>Cash:</span>
          <span>${n?Number(n).toLocaleString():"0"} د.ع</span>
        </div>
        <div class="total-line">
          <span>Change:</span>
          <span>${Number(r).toLocaleString()} د.ع</span>
        </div>
      </div>

      <div class="divider"></div>

      <div class="footer">
        <p>Thank you for shopping with us!</p>
        <p>سوپاس بۆ کڕینەکەت</p>
      </div>

      <div class="barcode">
        |||||||||||||||||||||||||
        ${l}
      </div>

      <div style="text-align: center; margin-top: 20px;">
        <button onclick="window.print()">Print</button>
        <button onclick="window.close()">Close</button>
      </div>
    </body>
    </html>
  `,a.document.open(),a.document.write(y),a.document.close(),setTimeout(()=>{try{a.print()}catch(j){console.error("Print failed:",j)}},500)},_e=()=>{console.log("HARDWARE: Opening cash drawer");const t=document.createElement("div");t.style.position="fixed",t.style.top="50%",t.style.left="50%",t.style.transform="translate(-50%, -50%)",t.style.padding="20px",t.style.backgroundColor="rgba(0, 0, 0, 0.8)",t.style.color="white",t.style.borderRadius="5px",t.style.zIndex="9999",t.textContent="💰 Cash drawer opened!",document.body.appendChild(t),setTimeout(()=>{document.body.removeChild(t)},2e3)},Dt=()=>{const{t}=R(),s=q().props,o=s.products;s.debtors;const{flash:n}=q().props;c.useEffect(()=>{n&&n.success&&(_.success(n.success),n.transaction_number&&($e(n.transaction_number),_e()),a([]),d(0),h(null),x(0),y(null),P("cash")),n&&n.error&&_.error(n.error)},[n]);const r=[{title:"Dashboard",href:route("dashboard")},{title:"Cashiers",href:route("cashier")}],[l,a]=c.useState([]),[u,d]=c.useState(0),[v,y]=c.useState(null),[j,m]=c.useState(!1),[E,f]=c.useState(!1),[S,h]=c.useState(null),[L,x]=c.useState(0),[g,w]=c.useState(!1),[i,b]=c.useState(!1),[$,I]=c.useState(null),[C,P]=c.useState("cash"),A=c.useRef(null),{data:ee,setData:te,post:M,processing:se}=pe({payment_method:"cash",payment_type:"cash",items:[],total_amount:0,amount_paid:0,change:0,debtor_id:void 0});c.useEffect(()=>{d(Le(l))},[l]),c.useEffect(()=>{A.current&&A.current.focusInput()},[]),c.useEffect(()=>{g&&M(route("sales.store"),{preserveScroll:!0,onStart:()=>w(!0),onFinish:()=>{w(!1),f(!1)}})},[ee,g]);const oe=p=>{const N=o.find(T=>T.barcode===p);N?H(N):_.error(`Product with barcode ${p} not found`)},re=()=>{b(!0)},H=p=>{a(De(p,l)),_.success(`Added: ${p.name}`)},ne=p=>{I(p)},ae=()=>{if($){const p=o.find(N=>N.id===$);p&&H(p),b(!1),I(null)}},ie=(p,N)=>{a(Re(p,N,l))},ce=p=>{a(Z(p,l))},le=()=>{a([]),d(0)},de=()=>{if(l.length===0){_.warning("Cart is empty");return}f(!0),h(u),x(0),P("cash")},me=p=>{console.log("Amount changed to:",p),h(p),x(p&&p>=u?p-u:0)},ue=()=>{w(!0);const p=l.map(T=>({id:T.id,name:T.name,quantity:T.quantity,price:T.price,subtotal:T.quantity*T.price}));te({payment_method:C==="debt"?"debt":"cash",payment_type:C,items:p,total_amount:u,amount_paid:C==="cash"&&S||0,change:C==="cash"?L:0,debtor_id:C==="debt"?v:void 0}),M(route("sales.store"),{onStart:()=>w(!0),onFinish:()=>{w(!1),f(!1)}})};return e.jsxs(xe,{breadcrumbs:r,children:[e.jsx(he,{title:t("cashier.title")}),e.jsx("div",{className:"flex h-full flex-1 flex-col gap-4 rounded-xl p-4",children:e.jsxs(F,{gutter:[16,16],children:[e.jsx(z,{xs:24,lg:16,children:e.jsxs(O,{title:t("cashier.currentTransaction"),className:"h-full",children:[e.jsx(ke,{ref:A,onBarcodeScan:oe,onProductLookup:re}),e.jsx(Se,{cartItems:l,onUpdateQuantity:ie,onRemoveItem:ce,total:u})]})}),e.jsx(z,{xs:24,lg:8,children:e.jsx(O,{title:t("cashier.transactionSummary"),bordered:!1,className:"h-full",children:e.jsx(Ne,{cartItems:l,total:u,onCheckout:de,onClearCart:le})})})]})}),e.jsx(Ce,{visible:E,total:u,amountPaid:S,change:L,paymentType:C,selectedDebtor:v,onAmountPaidChange:me,onPaymentTypeChange:P,onDebtorChange:y,onComplete:ue,onCancel:()=>f(!1),loading:g||se}),e.jsx(Te,{visible:i,products:o,selectedProduct:$,onProductSelect:ne,onOk:ae,onCancel:()=>{b(!1),I(null)}})]})};export{Dt as default};
