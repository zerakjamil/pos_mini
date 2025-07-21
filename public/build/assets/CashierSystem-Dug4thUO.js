import{r as c,u as _,j as e,K as z,m as me,L as he}from"./app-D4DCDOZQ.js";import{A as fe}from"./app-layout-BqJZD1sD.js";import{S as xe}from"./index-CTVambiV.js";import{I as be}from"./index-DdIRk21t.js";import{R as ge}from"./BarcodeOutlined-Eq6_3BHi.js";import{B as $}from"./button-hbvwzErM.js";import{R as ye}from"./SearchOutlined-CF0vCKpW.js";import{T as V}from"./index-B04Be4rP.js";import{R as ve}from"./DeleteOutlined-8KglWjor.js";import{F as L}from"./Table-DKMuPZsZ.js";import{T as Z}from"./index-BTVY_glA.js";import{M as X}from"./index-nXUiSdnG.js";import{D as K}from"./index-wcTg0bi6.js";import{R as F}from"./index-tppyBkZd.js";import{T as O}from"./index-DaRKGPOp.js";import{X as we}from"./index-CwJfRHb2.js";import{R as M,C as B}from"./row-BN0tTg4T.js";import{C as ke}from"./circle-plus-DVgt7HFb.js";import{S as Q}from"./index-B_Q9WRCk.js";import{s as I}from"./index-DVCkdZh4.js";import{C as W}from"./index-C-1qfStk.js";/* empty css            */import"./button-5FXeRgr7.js";import"./index-BdH-dA-v.js";import"./index-BDhkmi6J.js";import"./index-C6vAHNA7.js";import"./index-BdYed6gh.js";import"./createLucideIcon-CbOnka2L.js";import"./app-logo-icon-CePpD4Ea.js";import"./useSize-pRZNKIr-.js";import"./AntdIcon-DdBdtrI_.js";import"./colors-CRoBDNKI.js";import"./useVariants-BM6369mv.js";import"./getAllowClear-BRA64n-f.js";import"./Input-CHON0BCf.js";import"./EyeOutlined-BHDWCuwK.js";import"./TextArea-Bdn4-cEU.js";import"./DownOutlined-CXBG03rs.js";import"./styleChecker-CmR1XX-_.js";import"./dropdown-t9-7qTYI.js";import"./EllipsisOutlined-CSgxm_ox.js";import"./Overflow-Bv3_dQRx.js";import"./useBreakpoint-BmaFcyfY.js";import"./CheckCircleFilled-DY9YuE73.js";import"./ExclamationCircleFilled-C3TGKWWm.js";import"./InfoCircleFilled-BCPqy-pF.js";import"./ActionButton-DgIMB6Z9.js";import"./CloseOutlined-B-oUf7GQ.js";import"./useClosable--XwrD891.js";import"./Skeleton-BUFQSbKq.js";import"./index-C2AQWsWD.js";import"./fade-CA8tt2lJ.js";import"./useIcons-Cby93fj4.js";import"./context-CHGQhKsl.js";import"./PlusOutlined-COwSgne2.js";const Se=c.forwardRef(({onBarcodeScan:n,onProductLookup:r},a)=>{const{t:i}=_(),[t,o]=c.useState(""),[s,f]=c.useState(""),[p,k]=c.useState(null),[N,A]=c.useState(""),[l,E]=c.useState(0),g=c.useRef(null),S=1500;c.useImperativeHandle(a,()=>({focusInput:()=>{g.current&&g.current.focus()}})),c.useEffect(()=>{g.current&&g.current.focus()},[]);const b=c.useCallback(x=>{const u=Date.now();if(x===N&&u-l<S){console.log("Duplicate scan detected and ignored");return}A(x),E(u),n(x)},[N,l,n]);c.useEffect(()=>{const x=u=>{var y;if(!(document.activeElement instanceof HTMLInputElement&&document.activeElement!==((y=g.current)==null?void 0:y.input))){if(u.key==="Enter"&&s){u.preventDefault(),b(s),f("");return}if(/^[a-zA-Z0-9]$/.test(u.key)){p&&clearTimeout(p);const d=setTimeout(()=>{f("")},100);k(d),f(v=>v+u.key)}}};return window.addEventListener("keydown",x),()=>{window.removeEventListener("keydown",x),p&&clearTimeout(p)}},[s,p,n,N,l,b]);const j=()=>{t.trim()&&(b(t.trim()),o(""),g.current&&g.current.focus())};return e.jsx("div",{style:{marginBottom:16},children:e.jsxs(xe,{style:{width:"100%"},children:[e.jsx(be,{ref:g,placeholder:i("cashier.barcode.placeholder"),value:t,onChange:x=>o(x.target.value),onPressEnter:x=>{x.preventDefault(),j()},prefix:e.jsx(ge,{}),style:{width:300},autoFocus:!0}),e.jsx($,{onClick:r,icon:e.jsx(ye,{}),"aria-label":i("cashier.barcode.productLookup"),children:i("cashier.barcode.productLookup")})]})})}),{Text:Y}=Z,je=({cartItems:n,onUpdateQuantity:r,onRemoveItem:a,total:i})=>{const{t}=_(),o=[{title:t("cashier.cart.product"),dataIndex:"name",key:"name"},{title:t("cashier.cart.price"),dataIndex:"price",key:"price",render:s=>`${t("common.currency")} ${s.toFixed(0)}`},{title:t("cashier.cart.quantity"),dataIndex:"quantity",key:"quantity",render:(s,f)=>e.jsx(V,{min:1,value:f.quantity,onChange:p=>r(f.id,p||1),style:{width:60}})},{title:t("cashier.cart.subtotal"),dataIndex:"subtotal",key:"subtotal",render:s=>`${t("common.currency")} ${s.toFixed(0)}`},{title:t("cashier.cart.action"),key:"action",render:(s,f)=>e.jsx($,{type:"text",danger:!0,icon:e.jsx(ve,{}),onClick:()=>a(f.id),"aria-label":t("cashier.cart.remove")})}];return e.jsx(L,{columns:o,dataSource:n,pagination:!1,rowKey:"id",summary:()=>e.jsx(L.Summary,{fixed:!0,children:e.jsxs(L.Summary.Row,{children:[e.jsx(L.Summary.Cell,{index:0,colSpan:3,children:e.jsx(Y,{strong:!0,children:t("cashier.cart.total")})}),e.jsx(L.Summary.Cell,{index:1,children:e.jsxs(Y,{strong:!0,children:[t("common.currency")," ",i.toFixed(0)]})}),e.jsx(L.Summary.Cell,{index:2})]})}),locale:{emptyText:t("cashier.cart.empty")}})},Ce=({visible:n,total:r,amountPaid:a,change:i,paymentType:t,selectedDebtor:o,onAmountPaidChange:s,onPaymentTypeChange:f,onDebtorChange:p,onComplete:k,onCancel:N,loading:A})=>{const{t:l}=_(),g=z().props.debtors,[S,b]=c.useState([]),j=[{value:5e3,color:"#e6f7ff"},{value:1e4,color:"#fff7e6"},{value:25e3,color:"#f6ffed"},{value:5e4,color:"#fff2e8"}],x=d=>{const v=[...S,d];b(v);const w=v.reduce((m,C)=>m+C,0);s(w)},u=()=>{b([]),s(null)},y=()=>{b([r]),s(r)};return c.useEffect(()=>{b(n?a?[a]:[]:[])},[n,a]),c.useEffect(()=>{t==="cash"&&a!==null&&(a>r?a-r:0)!==i&&s(a)},[a,r,t]),e.jsx(X,{title:l("cashier.checkout.title"),open:n,onCancel:N,width:450,bodyStyle:{padding:"12px",maxHeight:"70vh",overflowY:"auto"},footer:[e.jsx($,{onClick:N,children:l("cashier.checkout.cancel")},"back"),e.jsx($,{type:"primary",loading:A,onClick:k,disabled:t==="cash"&&(!a||a<r),children:l("cashier.checkout.complete")},"submit")],children:e.jsxs("div",{children:[e.jsx("div",{className:"text-lg font-semibold mb-2 p-2 bg-gray-100 rounded-md",children:l("cashier.checkout.total",{amount:r.toFixed(0)})}),e.jsx(K,{style:{margin:"8px 0"}}),e.jsx("div",{className:"mb-2",children:e.jsxs(F.Group,{value:t,onChange:d=>f(d.target.value),className:"mb-2",buttonStyle:"solid",size:"middle",style:{width:"100%"},children:[e.jsx(F.Button,{value:"cash",style:{width:"50%",textAlign:"center"},children:l("cashier.checkout.paymentType.cash")}),e.jsx(F.Button,{value:"debt",style:{width:"50%",textAlign:"center"},children:l("cashier.checkout.paymentType.debt")})]})}),t==="cash"?e.jsxs("div",{children:[e.jsxs("div",{className:"mb-2",children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:l("cashier.checkout.amountPaid")}),e.jsx(V,{className:"w-full",min:0,step:1e3,value:a,onChange:d=>{s(d),b(d?[d]:[])},formatter:d=>`${l("common.currency")} ${d}`.replace(/\B(?=(\d{3})+(?!\d))/g,","),parser:d=>d.replace(/\IQD\s?|(,*)/g,""),size:"middle",style:{width:"100%",fontSize:"16px"},controls:!1})]}),S.length>0&&e.jsxs("div",{className:"mb-2 p-1 bg-gray-50 rounded border border-gray-200",children:[e.jsxs("div",{className:"flex flex-wrap gap-1 mb-1",children:[S.map((d,v)=>e.jsx(O,{color:"blue",style:{fontSize:"12px",padding:"2px 6px",margin:"2px"},children:Number(d).toLocaleString()},v)),e.jsx(O,{color:"red",style:{cursor:"pointer",fontSize:"12px",padding:"2px 6px",margin:"2px"},onClick:u,children:e.jsx(we,{size:12})})]}),e.jsxs("div",{className:"text-xs text-gray-500 px-2",children:[l("common.total"),": ",a==null?void 0:a.toLocaleString()," ",l("common.currency")]})]}),e.jsxs("div",{className:"mb-2",children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:l("cashier.checkout.quickPayment")}),e.jsx(M,{gutter:[3,3],children:j.map(d=>e.jsx(B,{span:12,children:e.jsxs($,{onClick:()=>x(d.value),style:{width:"100%",height:"34px",backgroundColor:d.color,fontWeight:"bold",padding:"0 4px",fontSize:"12px"},children:[e.jsx(ke,{size:16,style:{marginRight:"4px"}}),Number(d.value).toLocaleString()]})},d.value))})]}),e.jsx("div",{className:"mb-2",children:e.jsxs(M,{gutter:[4,4],children:[e.jsx(B,{span:12,children:e.jsx($,{type:"primary",style:{width:"100%",height:"32px",fontSize:"12px"},onClick:y,children:l("cashier.checkout.exactAmount")})}),e.jsx(B,{span:12,children:e.jsx($,{danger:!0,style:{width:"100%",height:"32px",fontSize:"12px"},onClick:u,children:l("cashier.checkout.clear")})})]})}),i>0&&e.jsx("div",{className:"mt-2 p-2 bg-green-50 rounded-md",children:e.jsxs("div",{className:"text-base font-semibold text-green-700",children:[l("cashier.checkout.change"),": ",i.toLocaleString()," IQD"]})})]}):e.jsxs("div",{children:[e.jsxs("div",{className:"mb-2",children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:l("cashier.checkout.selectDebtor")}),e.jsx(Q,{showSearch:!0,style:{width:"100%"},placeholder:l("cashier.checkout.debtorPlaceholder"),optionFilterProp:"children",value:o,onChange:p,filterOption:(d,v)=>((v==null?void 0:v.label)??"").toLowerCase().includes(d.toLowerCase()),options:g.map(d=>({value:d.id,label:`${d.name}${d.phone?` (${d.phone})`:""}`,description:d.debts_sum_balance?`${l("cashier.checkout.existingDebt")}: ${d.debts_sum_balance.toLocaleString()} IQD`:void 0})),optionRender:d=>e.jsxs("div",{children:[e.jsx("div",{children:d.label}),d.data.description&&e.jsx("div",{className:"text-xs text-red-500",children:d.data.description})]})})]}),e.jsxs("div",{className:"mt-4",children:[e.jsx("div",{className:"text-sm text-gray-600 mb-2",children:l("cashier.checkout.debtDescription")}),e.jsxs("div",{className:"p-2 bg-yellow-50 rounded-md text-sm",children:[e.jsx("div",{className:"font-medium text-yellow-800 mb-1",children:l("cashier.checkout.debtWarning")}),e.jsxs("div",{className:"text-yellow-700",children:[l("cashier.checkout.debtAmount"),": ",Number(r).toLocaleString()," ",l("common.currency")]})]})]})]})]})})},{Option:Bt}=Q,Ne=({visible:n,products:r,selectedProduct:a,onProductSelect:i,onOk:t,onCancel:o})=>{const{t:s}=_(),f=p=>p.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");return e.jsx(X,{title:s("cashier.productLookup.title"),open:n,onOk:t,onCancel:o,okButtonProps:{disabled:!a},okText:s("common.ok"),cancelText:s("common.cancel"),children:e.jsx(Q,{showSearch:!0,style:{width:"100%"},placeholder:s("cashier.productLookup.searchPlaceholder"),optionFilterProp:"label",onChange:p=>i(p),filterOption:(p,k)=>((k==null?void 0:k.label)??"").toLowerCase().includes(p.toLowerCase()),options:Array.isArray(r)?r.map(p=>({value:p.id,label:`${p.name} - ${s("common.currency")} ${f(p.price)} (${p.stock>0?s("cashier.productLookup.inStock",{stock:p.stock}):"Out of Stock"})`})):[]})})},{Title:H}=Z,Te=({cartItems:n,total:r,onCheckout:a,onClearCart:i})=>{const{t}=_();return e.jsxs("div",{className:"flex h-full flex-col",children:[e.jsxs("div",{className:"mb-4 flex-grow",children:[e.jsxs("div",{className:"mb-4 flex justify-between",children:[e.jsxs(H,{level:4,children:[t("cashier.summary.total"),":"]}),e.jsxs(H,{level:4,children:[t("common.currency")," ",r.toFixed(0)]})]}),e.jsx(K,{}),e.jsxs("div",{className:"mb-4",children:[e.jsxs("p",{children:[t("cashier.summary.items"),": ",n.length]}),e.jsxs("p",{children:[t("cashier.summary.totalQuantity"),": ",n.reduce((o,s)=>o+s.quantity,0)]})]})]}),e.jsxs("div",{className:"mt-auto flex flex-col gap-2",children:[e.jsx($,{type:"primary",size:"large",block:!0,onClick:a,disabled:n.length===0,children:t("cashier.cart.checkout")}),e.jsx($,{danger:!0,size:"large",block:!0,onClick:i,disabled:n.length===0,children:t("cashier.cart.clear")})]})]})},$e=n=>n.reduce((r,a)=>r+a.subtotal,0),De=(n,r)=>{const a=r.findIndex(i=>i.id===n.id);if(a>=0){const i=[...r],t=i[a],o=t.quantity+1;return i[a]={...t,quantity:o,subtotal:n.price*o},i}else return[...r,{id:n.id,name:n.name,price:n.price,quantity:1,subtotal:n.price}]},Ie=(n,r,a)=>r<=0?G(n,a):a.map(i=>i.id===n?{...i,quantity:r,subtotal:i.price*r}:i),G=(n,r)=>r.filter(a=>a.id!==n),Ae=async n=>{var r,a;try{const i=await fetch(`/api/sales/${n}`);if(!i.ok)throw new Error("Failed to fetch sale details");const t=await i.json(),o={cartItems:t.items.map(s=>({id:s.product_id||s.id,name:s.product_name||s.name,quantity:s.quantity,price:s.unit_price||s.price,subtotal:s.subtotal||s.quantity*s.price,exteriorColor:s.exterior_color||s.exteriorColor||"",interiorColor:s.interior_color||s.interiorColor||"",modelYear:s.model_year||s.modelYear||"",chassisNumbers:s.chassis_numbers||s.chassisNumbers||[]})),total:t.total_amount||t.total||0,customer:{name:t.customer_name||((r=t.debtor)==null?void 0:r.name)||"",tel:t.customer_tel||((a=t.debtor)==null?void 0:a.phone)||"",address:t.customer_address||"",email:t.customer_email||"",exportTo:t.export_to||"Iraq"},salesInfo:{quoteNumber:t.transaction_number||n,quoteDate:t.created_at?new Date(t.created_at).toLocaleDateString("en-US"):new Date().toLocaleDateString("en-US"),validity:t.validity||"7 days",salesRef:t.sales_ref||t.reference||""},bankDetails:t.bank_details||{bankName:"WIO BUSINESS",accountName:"DELUXE CARS FZE",accountNumber:"9756950749",swiftCode:"WIOBAEAD",iban:"AE140860000009756950749",currency:"AED",address:"Etihad Airways centre, Floor 5, Al Monira, abu dhabi"},transactionNumber:n,paymentMethod:t.payment_method||"cash",paymentType:t.payment_type||"cash",amountPaid:t.amount_paid||0,change:t.change||0,notes:t.notes||""};Ee(o)}catch(i){console.error("Error printing invoice:",i),J(n)}},J=n=>{const r=window.open("","_blank","width=800,height=800");if(!r){console.error("Could not open invoice window");return}const i=new Date().toLocaleDateString("en-US");let t=`
    <html>
    <head>
      <title>Proforma Invoice</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          font-size: 12px;
          margin: 0;
          padding: 20px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .company-info {
          text-align: left;
        }
        .logo {
          text-align: center;
        }
        .invoice-title {
          text-align: right;
          font-size: 18px;
          font-weight: bold;
        }
        .customer-info {
          margin-bottom: 20px;
        }
        .info-row {
          display: flex;
          margin-bottom: 5px;
        }
        .info-label {
          width: 80px;
          font-weight: bold;
        }
        .info-value {
          flex-grow: 1;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
        }
        .footer {
          margin-top: 50px;
          display: flex;
          justify-content: space-between;
        }
        .signature {
          width: 45%;
        }
        .page-number {
          text-align: center;
          margin-top: 20px;
        }
        .buttons {
          text-align: center;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-info">
          <p>P.O.BOX : 93934</p>
          <p>00971 4 262 7925</p>
          <p>www.deluxecarsfze.com</p>
          <p>deluxecarsfze@gmail.com</p>
          <p>Al Aweer Free Auto Zone Showroom No. 143</p>
          <p>Dubai, UAE</p>
        </div>
        <div class="logo">
          <h2>DELUXE CARS FZE</h2>
        </div>
        <div class="invoice-title">
          <p>Proforma Invoice</p>
          <p>Sales Quote # : ${n}</p>
          <p>Quote Date : ${i}</p>
        </div>
      </div>

      <div class="customer-info">
        <div class="info-row">
          <div class="info-label">Name</div>
          <div class="info-value">: </div>
        </div>
        <div class="info-row">
          <div class="info-label">Tel</div>
          <div class="info-value">: </div>
        </div>
        <div class="info-row">
          <div class="info-label">Address</div>
          <div class="info-value">: </div>
        </div>
        <div class="info-row">
          <div class="info-label">email</div>
          <div class="info-value">: </div>
        </div>
        <div class="info-row">
          <div class="info-label">Export To</div>
          <div class="info-value">: </div>
        </div>
        <div class="info-row">
          <div class="info-label">Note</div>
          <div class="info-value">: </div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Description</th>
            <th>Ext. Color</th>
            <th>Int. Color</th>
            <th>Model Year</th>
            <th>QTY</th>
            <th>Unit Price IQD</th>
            <th>Total Amount IQD</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="8">No items available</td>
          </tr>
        </tbody>
      </table>

      <div class="footer">
        <div class="signature">
          <p>Customer Acceptance</p>
          <div style="border-bottom: 1px solid #000; height: 40px;"></div>
        </div>
        <div class="signature">
          <p>Prepared by</p>
          <div style="border-bottom: 1px solid #000; height: 40px;"></div>
        </div>
      </div>

      <div class="page-number">
        Page 1 of 1
      </div>

      <div class="buttons">
        <button onclick="window.print()">Print</button>
        <button onclick="window.close()">Close</button>
      </div>
    </body>
    </html>
  `;r.document.open(),r.document.write(t),r.document.close(),setTimeout(()=>{try{r.print()}catch(o){console.error("Print failed:",o)}},500)},Ee=n=>{const{cartItems:r,total:a,customer:i,salesInfo:t,bankDetails:o,transactionNumber:s,paymentMethod:f,paymentType:p,amountPaid:k,change:N,notes:A}=n;if(!r||!Array.isArray(r)){console.error("Invalid cartItems:",r),J(s);return}const l=window.open("","_blank","width=800,height=800");if(!l){console.error("Could not open invoice window");return}const E=new Date,g=t.quoteDate||E.toLocaleDateString("en-US"),S=Math.ceil(r.length/2)||1,b=r.length,j=2,x=[];for(let u=0;u<S;u++){const y=u*j,d=Math.min(y+j,b);x.push(r.slice(y,d))}for(let u=0;u<x.length;u++){const y=x[u],d=u+1,v=d===S;let w=`
      <html>
      <head>
        <title>Proforma Invoice</title>
        <style>
          @media print {
            @page { margin: 0.5cm; }
            body { margin: 0; }
            .buttons { display: none; }
          }
          body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            margin: 0;
            padding: 20px;
          }
          .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
          }
          .company-info {
            text-align: left;
            font-size: 11px;
            line-height: 1.2;
          }
          .logo {
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          .logo-text {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .logo-subtext {
            font-size: 14px;
            letter-spacing: 4px;
          }
          .invoice-title {
            text-align: right;
            font-size: 18px;
            font-weight: bold;
          }
          .customer-info {
            margin-bottom: 20px;
          }
          .info-row {
            display: flex;
            margin-bottom: 5px;
          }
          .info-label {
            width: 80px;
            font-weight: normal;
          }
          .info-value {
            flex-grow: 1;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
            font-size: 11px;
          }
          th {
            background-color: #f2f2f2;
          }
          .chassis-list {
            padding-left: 20px;
            margin: 5px 0;
          }
          .footer {
            margin-top: 30px;
            display: flex;
            justify-content: space-between;
          }
          .signature {
            width: 45%;
          }
          .page-number {
            text-align: center;
            margin-top: 20px;
            font-size: 11px;
          }
          .total-section {
            width: 100%;
            margin-top: 20px;
          }
          .total-section table {
            width: 100%;
          }
          .total-section td {
            text-align: right;
          }
          .bank-details {
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
          }
          .bank-column {
            width: 48%;
          }
          .bank-column-title {
            font-weight: bold;
            margin-bottom: 5px;
            text-align: center;
          }
          .terms-column {
            width: 48%;
          }
          .buttons {
            text-align: center;
            margin-top: 20px;
          }
          .amount-in-words {
            margin: 10px 0;
            font-style: italic;
          }
          .payment-info {
            margin: 10px 0;
            padding: 5px;
            background-color: #f9f9f9;
            border: 1px solid #eee;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-info">
            <p>P.O.BOX : 93934</p>
            <p>00971 4 262 7925</p>
            <p>www.deluxecarsfze.com</p>
            <p>deluxecarsfze@gmail.com</p>
            <p>Al Aweer Free Auto Zone Showroom No. 143</p>
            <p>Dubai, UAE</p>
          </div>
          <div class="logo">
            <div class="logo-text">DELUXE CARS</div>
            <div class="logo-subtext">F Z E</div>
          </div>
          <div class="invoice-title">
            <p>Proforma Invoice</p>
            <table style="border:none; width: auto; float: right;">
              <tr>
                <td style="border:none; padding: 2px; text-align: left;">Sales Quote #</td>
                <td style="border:none; padding: 2px; text-align: left;">: ${t.quoteNumber}</td>
              </tr>
              <tr>
                <td style="border:none; padding: 2px; text-align: left;">Quote Date</td>
                <td style="border:none; padding: 2px; text-align: left;">: ${g}</td>
              </tr>
              <tr>
                <td style="border:none; padding: 2px; text-align: left;">Validity</td>
                <td style="border:none; padding: 2px; text-align: left;">: ${t.validity}</td>
              </tr>
              <tr>
                <td style="border:none; padding: 2px; text-align: left;">Sales Ref</td>
                <td style="border:none; padding: 2px; text-align: left;">: ${t.salesRef}</td>
              </tr>
            </table>
          </div>
        </div>

        <div class="customer-info">
          <div class="info-row">
            <div class="info-label">Name</div>
            <div class="info-value">: ${i.name}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Tel</div>
            <div class="info-value">: ${i.tel}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Address</div>
            <div class="info-value">: ${i.address}</div>
          </div>
          <div class="info-row">
            <div class="info-label">email</div>
            <div class="info-value">: ${i.email}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Export To</div>
            <div class="info-value">: ${i.exportTo}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Note</div>
            <div class="info-value">: ${A||""}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Description</th>
              <th>Ext. Color</th>
              <th>Int. Color</th>
              <th>Model Year</th>
              <th>QTY</th>
              <th>Unit Price IQD</th>
              <th>Total Amount IQD</th>
            </tr>
          </thead>
          <tbody>
    `;if(y.forEach((m,C)=>{const P=u*j+C+1;w+=`
        <tr>
          <td>${P}</td>
          <td>
            ${m.name}
            ${m.chassisNumbers&&m.chassisNumbers.length>0?`<div>CHASSIS:</div>
               <div class="chassis-list">
                 ${m.chassisNumbers.map(R=>`${R}<br>`).join("")}
               </div>`:""}
          </td>
          <td>${m.exteriorColor||""}</td>
          <td>${m.interiorColor||""}</td>
          <td>${m.modelYear||""}</td>
          <td>${m.quantity}</td>
          <td>${Number(m.price).toLocaleString()}</td>
          <td>${Number(m.subtotal).toLocaleString()}</td>
        </tr>
      `}),y.length<j&&!v)for(let m=y.length;m<j;m++)w+=`
          <tr>
            <td colspan="8">&nbsp;</td>
          </tr>
        `;if(w+=`
          </tbody>
        </table>
    `,v&&(w+=`
        <div class="payment-info">
          <strong>Payment Information:</strong>
          <div>Payment Type: ${(p||"").toUpperCase()}</div>
          <div>Payment Method: ${(f||"").toUpperCase()}</div>
          ${p==="cash"?`
          <div>Amount Paid: ${Number(k||0).toLocaleString()} IQD</div>
          <div>Change: ${Number(N||0).toLocaleString()} IQD</div>
          `:""}
        </div>
        `,w+=`
        <div class="total-section">
          <table>
            <tr>
              <td style="text-align: left; width: 70%;">Total of Units</td>
              <td style="width: 15%;">${r.reduce((m,C)=>m+C.quantity,0)}</td>
              <td style="width: 15%;">Total Amount</td>
              <td style="width: 15%;">${Number(a).toLocaleString()} IQD</td>
            </tr>
            <tr>
              <td style="text-align: left;" colspan="2"></td>
              <td>VAT</td>
              <td>0.00 IQD</td>
            </tr>
            <tr>
              <td style="text-align: left;" colspan="2" class="amount-in-words">
                ${Le(a)} Only
              </td>
              <td style="font-weight: bold;">Grand Total</td>
              <td style="font-weight: bold;">${Number(a).toLocaleString()} IQD</td>
            </tr>
          </table>
        </div>

        <div class="bank-details">
          <div class="bank-column">
            <div class="bank-column-title">Bank Detail</div>
            <table style="border:none;">
              <tr>
                <td style="border:none; padding: 2px;">Bank Name:</td>
                <td style="border:none; padding: 2px;">${o.bankName}</td>
              </tr>
              <tr>
                <td style="border:none; padding: 2px;">Account Name:</td>
                <td style="border:none; padding: 2px;">${o.accountName}</td>
              </tr>
              <tr>
                <td style="border:none; padding: 2px;">Account No.:</td>
                <td style="border:none; padding: 2px;">${o.accountNumber}</td>
              </tr>
              <tr>
                <td style="border:none; padding: 2px;">SWIFT CODE:</td>
                <td style="border:none; padding: 2px;">${o.swiftCode}</td>
              </tr>
              <tr>
                <td style="border:none; padding: 2px;">IBAN (${o.currency}):</td>
                <td style="border:none; padding: 2px;">${o.iban}</td>
              </tr>
            </table>
          </div>
          <div class="terms-column">
            <div class="bank-column-title">Terms & Conditions</div>
            <table style="border:none;">
              <tr>
                <td style="border:none; padding: 2px;">Payment Terms:</td>
                <td style="border:none; padding: 2px;"></td>
              </tr>
              <tr>
                <td style="border:none; padding: 2px; font-weight: bold;">BANK Details</td>
                <td style="border:none; padding: 2px;"></td>
              </tr>
              <tr>
                <td style="border:none; padding: 2px;">TITLE:- ${o.accountName}</td>
                <td style="border:none; padding: 2px;"></td>
              </tr>
              <tr>
                <td style="border:none; padding: 2px;">BANK NAME:- ${o.bankName}</td>
                <td style="border:none; padding: 2px;"></td>
              </tr>
              <tr>
                <td style="border:none; padding: 2px;">ACCOUNT NO:- ${o.accountNumber}</td>
                <td style="border:none; padding: 2px;"></td>
              </tr>
              <tr>
                <td style="border:none; padding: 2px;">IBAN NO:- ${o.iban}</td>
                <td style="border:none; padding: 2px;"></td>
              </tr>
              <tr>
                <td style="border:none; padding: 2px;">SWIFT CODE:- ${o.swiftCode}</td>
                <td style="border:none; padding: 2px;"></td>
              </tr>
              <tr>
                <td style="border:none; padding: 2px;">ACCOUNT CURRENCY:- ${o.currency}</td>
                <td style="border:none; padding: 2px;"></td>
              </tr>
              <tr>
                <td style="border:none; padding: 2px;">ADDRESS: ${o.address}</td>
                <td style="border:none; padding: 2px;"></td>
              </tr>
              <tr>
                <td style="border:none; padding: 2px;">Inco terms:</td>
                <td style="border:none; padding: 2px;"></td>
              </tr>
              <tr>
                <td style="border:none; padding: 2px;">Delivery:</td>
                <td style="border:none; padding: 2px;"></td>
              </tr>
              <tr>
                <td style="border:none; padding: 2px;">Vehicle availability:</td>
                <td style="border:none; padding: 2px;"></td>
              </tr>
            </table>
          </div>
        </div>
      `),w+=`
        <div class="footer">
          <div class="signature">
            <p>Customer Acceptance</p>
            <div style="border-bottom: 1px solid #000; height: 40px;"></div>
          </div>
          <div class="signature">
            <p>Prepared by</p>
            <div style="border-bottom: 1px solid #000; height: 40px;"></div>
            <p>Dubai - UAE</p>
          </div>
        </div>

        <div class="page-number">
          Page ${d} of ${S}
        </div>

        <div class="buttons">
          <button onclick="window.print()" style="padding: 10px 15px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; margin-right: 10px;">Print Receipt</button>
          <button onclick="window.close()" style="padding: 10px 15px; background-color: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">Close</button>
        </div>
      </body>
      </html>
    `,u===0)l.document.open(),l.document.write(w),l.document.close();else{const m=window.open("",`_blank_${u}`,"width=800,height=800");m&&(m.document.open(),m.document.write(w),m.document.close())}}l&&l.focus()};function Le(n){const r=["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"],a=["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];if(n===0)return"Zero";function i(o){return o<20?r[o]:o<100?a[Math.floor(o/10)]+(o%10!==0?" "+r[o%10]:""):r[Math.floor(o/100)]+" Hundred"+(o%100!==0?" "+i(o%100):"")}function t(o){return o<1e3?i(o):o<1e6?i(Math.floor(o/1e3))+" Thousand"+(o%1e3!==0?" "+t(o%1e3):""):o<1e9?i(Math.floor(o/1e6))+" Million"+(o%1e6!==0?" "+t(o%1e6):""):i(Math.floor(o/1e9))+" Billion"+(o%1e9!==0?" "+t(o%1e9):"")}return t(Math.floor(n))}const _e=async n=>{console.warn("printReceiptByTransactionNumber is deprecated. Use printInvoiceByTransactionNumber instead."),Ae(n)},Pe=()=>{console.log("HARDWARE: Opening cash drawer");const n=document.createElement("div");n.style.position="fixed",n.style.top="50%",n.style.left="50%",n.style.transform="translate(-50%, -50%)",n.style.padding="20px",n.style.backgroundColor="rgba(0, 0, 0, 0.8)",n.style.color="white",n.style.borderRadius="5px",n.style.zIndex="9999",n.textContent="💰 Cash drawer opened!",document.body.appendChild(n),setTimeout(()=>{document.body.removeChild(n)},2e3)},Ft=()=>{const{t:n}=_(),r=z().props,a=r.products;r.debtors;const{flash:i}=z().props;c.useEffect(()=>{i&&i.success&&(I.success(i.success),i.transaction_number&&(_e(i.transaction_number),Pe()),s([]),p(0),b(null),x(0),N(null),P("cash")),i&&i.error&&I.error(i.error)},[i]);const t=[{title:"Dashboard",href:route("dashboard")},{title:"Cashiers",href:route("cashier")}],[o,s]=c.useState([]),[f,p]=c.useState(0),[k,N]=c.useState(null),[A,l]=c.useState(!1),[E,g]=c.useState(!1),[S,b]=c.useState(null),[j,x]=c.useState(0),[u,y]=c.useState(!1),[d,v]=c.useState(!1),[w,m]=c.useState(null),[C,P]=c.useState("cash"),R=c.useRef(null),{data:ee,setData:te,post:U,processing:oe}=me({payment_method:"cash",payment_type:"cash",items:[],total_amount:0,amount_paid:0,change:0,debtor_id:void 0});c.useEffect(()=>{p($e(o))},[o]),c.useEffect(()=>{R.current&&R.current.focusInput()},[]),c.useEffect(()=>{u&&U(route("sales.store"),{preserveScroll:!0,onStart:()=>y(!0),onFinish:()=>{y(!1),g(!1)}})},[ee,u]);const ne=h=>{const T=a.find(D=>D.barcode===h);T?T.stock>0?q(T):I.warning(`${T.name} is out of stock (${T.stock} remaining)`):I.error(`Product with barcode ${h} not found`)},re=()=>{v(!0)},q=h=>{s(De(h,o)),I.success(`Added: ${h.name}`)},ie=h=>{m(h)},se=()=>{if(w){const h=a.find(T=>T.id===w);h&&(h.stock>0?q(h):I.warning(`${h.name} is out of stock (${h.stock} remaining)`)),v(!1),m(null)}},ae=(h,T)=>{s(Ie(h,T,o))},de=h=>{s(G(h,o))},le=()=>{s([]),p(0)},ce=()=>{if(o.length===0){I.warning("Cart is empty");return}g(!0),b(f),x(0),P("cash")},pe=h=>{console.log("Amount changed to:",h),b(h),x(h&&h>=f?h-f:0)},ue=()=>{y(!0);const h=o.map(D=>({id:D.id,name:D.name,quantity:D.quantity,price:D.price,subtotal:D.quantity*D.price}));te({payment_method:C==="debt"?"debt":"cash",payment_type:C,items:h,total_amount:f,amount_paid:C==="cash"&&S||0,change:C==="cash"?j:0,debtor_id:C==="debt"?k:void 0}),U(route("sales.store"),{onStart:()=>y(!0),onFinish:()=>{y(!1),g(!1)}})};return e.jsxs(fe,{breadcrumbs:t,children:[e.jsx(he,{title:n("cashier.title")}),e.jsx("div",{className:"flex h-full flex-1 flex-col gap-4 rounded-xl p-4",children:e.jsxs(M,{gutter:[16,16],children:[e.jsx(B,{xs:24,lg:16,children:e.jsxs(W,{title:n("cashier.currentTransaction"),className:"h-full",children:[e.jsx(Se,{ref:R,onBarcodeScan:ne,onProductLookup:re}),e.jsx(je,{cartItems:o,onUpdateQuantity:ae,onRemoveItem:de,total:f})]})}),e.jsx(B,{xs:24,lg:8,children:e.jsx(W,{title:n("cashier.transactionSummary"),bordered:!1,className:"h-full",children:e.jsx(Te,{cartItems:o,total:f,onCheckout:ce,onClearCart:le})})})]})}),e.jsx(Ce,{visible:E,total:f,amountPaid:S,change:j,paymentType:C,selectedDebtor:k,onAmountPaidChange:pe,onPaymentTypeChange:P,onDebtorChange:N,onComplete:ue,onCancel:()=>g(!1),loading:u||oe}),e.jsx(Ne,{visible:d,products:a,selectedProduct:w,onProductSelect:ie,onOk:se,onCancel:()=>{v(!1),m(null)}})]})};export{Ft as default};
//# sourceMappingURL=CashierSystem-Dug4thUO.js.map
