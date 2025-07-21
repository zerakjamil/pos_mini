import{r as v,u as R,j as r,L as T}from"./app-D4DCDOZQ.js";import{A as $}from"./app-layout-BqJZD1sD.js";import j from"./ReportHeader-Ct1-WcqD.js";import _ from"./ReportTable-Cl-q_1lk.js";import w from"./ReportSummary-DTStFz6-.js";import C from"./FormulaExplanation-CE3giabY.js";import{f as n,a as x}from"./formatters-D4l3l5B6.js";import{C as P,T as y}from"./index-C-1qfStk.js";import{D as S}from"./index-wcTg0bi6.js";/* empty css            */import"./button-5FXeRgr7.js";import"./index-CwJfRHb2.js";import"./createLucideIcon-CbOnka2L.js";import"./index-BdH-dA-v.js";import"./index-C6vAHNA7.js";import"./index-BDhkmi6J.js";import"./index-BdYed6gh.js";import"./app-logo-icon-CePpD4Ea.js";import"./row-BN0tTg4T.js";import"./useSize-pRZNKIr-.js";import"./AntdIcon-DdBdtrI_.js";import"./index-C2AQWsWD.js";import"./useBreakpoint-BmaFcyfY.js";import"./index-BTVY_glA.js";import"./useVariants-BM6369mv.js";import"./styleChecker-CmR1XX-_.js";import"./colors-CRoBDNKI.js";import"./getAllowClear-BRA64n-f.js";import"./TextArea-Bdn4-cEU.js";import"./button-hbvwzErM.js";import"./index-Bli4VTgt.js";import"./dayjs.min-DhVhDCGv.js";import"./DownOutlined-CXBG03rs.js";import"./Overflow-Bv3_dQRx.js";import"./useIcons-Cby93fj4.js";import"./CloseOutlined-B-oUf7GQ.js";import"./SearchOutlined-CF0vCKpW.js";import"./Table-DKMuPZsZ.js";import"./index-B_Q9WRCk.js";import"./index-tppyBkZd.js";import"./dropdown-t9-7qTYI.js";import"./EllipsisOutlined-CSgxm_ox.js";import"./index-CTVambiV.js";import"./Input-CHON0BCf.js";import"./StatisticCard-COeGFLYv.js";import"./DollarOutlined-DZrG_nLk.js";import"./index-BRx4oT1e.js";import"./CheckCircleFilled-DY9YuE73.js";import"./ExclamationCircleFilled-C3TGKWWm.js";import"./InfoCircleFilled-BCPqy-pF.js";import"./Skeleton-BUFQSbKq.js";import"./PlusOutlined-COwSgne2.js";const A=(d,l,s)=>{const[o,m]=v.useState("daily"),a=()=>{switch(o){case"daily":return d;case"weekly":return l;case"monthly":return s;default:return d}},c=(p=>{const i=p.reduce((h,g)=>h+g.total_revenue,0),t=p.reduce((h,g)=>h+g.cost_of_goods,0),e=p.reduce((h,g)=>h+g.gross_profit,0),f=i>0?e/i:0;return{totalRevenue:i,totalCost:t,totalProfit:e,avgMargin:f}})(a());return{activeTab:o,setActiveTab:m,getActiveData:a,summary:c}},k=()=>({printReport:(l,s)=>{const o=window.open("","_blank");if(!o)return;const m=l==="daily"?"Daily Sales Report":l==="weekly"?"Weekly Sales Report":"Monthly Sales Report",a=s.reduce((t,e)=>t+e.total_revenue,0),u=s.reduce((t,e)=>t+e.gross_profit,0),c=s.reduce((t,e)=>t+e.cost_of_goods,0),p=a>0?u/a:0;let i=`
      <html>
      <head>
        <title>${m}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { text-align: center; color: #1890ff; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; }
          th { background-color: #f2f2f2; font-weight: bold; text-align: left; }
          .summary { margin-top: 20px; font-weight: bold; }
          .print-date { text-align: right; margin-bottom: 20px; }
          .formula-box { border: 1px solid #ddd; padding: 10px; margin: 10px 0; background-color: #f9f9f9; }
          .currency { text-align: right; }
          .percent { text-align: right; }
          .count { text-align: center; }
          tfoot td { font-weight: bold; background-color: #f9f9f9; }
        </style>
      </head>
      <body>
        <div class="print-date">Generated: ${new Date().toLocaleString()}</div>
        <h1>${m}</h1>

        <div class="formula-box">
          <h3>How Profits Are Calculated:</h3>
          <p>• <strong>Cost of Goods</strong> = (Batch Price ÷ Units per Batch) × Quantity Sold</p>
          <p>• <strong>Gross Profit</strong> = Total Revenue − Cost of Goods</p>
          <p>• <strong>Profit Margin</strong> = (Gross Profit ÷ Total Revenue) × 100%</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Sales Count</th>
              <th>Total Revenue</th>
              <th>Cost of Goods</th>
              <th>Gross Profit</th>
              <th>Profit Margin</th>
            </tr>
          </thead>
          <tbody>
    `;s.forEach(t=>{i+=`
        <tr>
            <td>${t.date}</td>
            <td class="count">${t.sales_count.toLocaleString("en-US")}</td>
            <td class="currency">${n(t.total_revenue)}</td>
            <td class="currency">${n(t.cost_of_goods)}</td>
            <td class="currency">${n(t.gross_profit)}</td>
            <td class="percent">${x(t.profit_margin)}</td>
        </tr>
      `}),i+=`
        </tbody>
        <tfoot>
            <tr>
                <td colspan="2">Total</td>
                <td class="currency">${n(a)}</td>
                <td class="currency">${n(c)}</td>
                <td class="currency">${n(u)}</td>
                <td class="percent">${x(p)}</td>
            </tr>
        </tfoot>
        </table>
        <div class="summary">
            <p>Total Revenue: ${n(a)}</p>
            <p>Total Cost: ${n(c)}</p>
            <p>Total Profit: ${n(u)}</p>
            <p>Average Profit Margin: ${x(p)}</p>
        </div>
      </body>
      </html>
    `,o.document.write(i),o.document.close(),o.focus(),setTimeout(()=>{o.print()},250)}}),{TabPane:b}=y,At=({dailyProfits:d,weeklyProfits:l,monthlyProfits:s})=>{const{t:o}=R(),{activeTab:m,setActiveTab:a,getActiveData:u,summary:c}=A(d,l,s),{printReport:p}=k(),i=[{title:o("dashboard.title"),href:route("dashboard")},{title:o("reports.title"),href:route("reports.index")}],t=()=>{p(m,u())},e=f=>r.jsxs(r.Fragment,{children:[r.jsx(_,{data:f,summary:c}),r.jsx(S,{}),r.jsx(w,{summary:c})]});return r.jsxs($,{breadcrumbs:i,children:[r.jsx(T,{title:o("reports.salesReports")}),r.jsxs("div",{className:"flex h-full flex-1 flex-col gap-4 rounded-xl p-4",children:[r.jsx(j,{onPrint:t}),r.jsxs(P,{children:[r.jsx(C,{}),r.jsxs(y,{defaultActiveKey:"daily",onChange:f=>a(f),children:[r.jsx(b,{tab:o("reports.tabs.daily"),children:e(d)},"daily"),r.jsx(b,{tab:o("reports.tabs.weekly"),children:e(l)},"weekly"),r.jsx(b,{tab:o("reports.tabs.monthly"),children:e(s)},"monthly")]})]})]})]})};export{At as default};
//# sourceMappingURL=Index-DcKHNcwu.js.map
