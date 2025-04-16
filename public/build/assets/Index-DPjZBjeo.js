import{r as v,u as R,j as r,L as T}from"./app-CoXKttN8.js";import{A as $}from"./app-layout-8ij2nKkQ.js";import j from"./ReportHeader-DX929aaL.js";import _ from"./ReportTable-DYmrvlM-.js";import w from"./ReportSummary-De30BIv9.js";import C from"./FormulaExplanation-BT8pXK2e.js";import{f as i,a as x}from"./formatters-D4l3l5B6.js";import{C as P,T as y}from"./index-Brp1oyrZ.js";import{D as S}from"./index-AAE4Q3Fn.js";import"./button-CcGvkG1f.js";import"./index-B0sxA8bq.js";import"./createLucideIcon-CN5-yLR1.js";import"./index-DvOx0I6S.js";import"./index-C85uQcsJ.js";import"./index-i2yTW8u6.js";import"./index-r1U0Z8Y9.js";import"./app-logo-icon-DpXoyYPw.js";import"./row-Q--lQiZy.js";import"./useSize-DdazIbtM.js";import"./AntdIcon-DtyAY1B3.js";import"./index-yDQGqAM-.js";import"./useBreakpoint-C3N2ICND.js";import"./index-VRO07ue7.js";import"./useVariants-C2zpy4FK.js";import"./styleChecker-C9taYto1.js";import"./colors-DxCZdjT7.js";import"./getAllowClear-8q0Hx_mz.js";import"./TextArea-CuO2h10_.js";import"./button-DsfFQUng.js";import"./index-CLZVf3S0.js";import"./dayjs.min-DS2Laxzw.js";import"./useIcons-CfiTnf06.js";import"./CloseOutlined-CRwiKe2l.js";import"./SearchOutlined-BCDBW3ZC.js";import"./Overflow-CJC26LAP.js";import"./Table-BlIHtI_R.js";import"./index-BcrJBACe.js";import"./EllipsisOutlined-CDA1r8G5.js";import"./index-kRGCB9zT.js";import"./Input-CjHprXgF.js";import"./StatisticCard-DIQL5qbj.js";import"./DollarOutlined-D83yMSQ_.js";import"./index-BQ7OAAuD.js";import"./CheckCircleFilled-BC74THRN.js";import"./ExclamationCircleFilled-CKvz4gUz.js";import"./InfoCircleFilled-BM2Jtd5Z.js";import"./PlusOutlined-BNd7I6P2.js";const A=(d,p,s)=>{const[o,m]=v.useState("daily"),a=()=>{switch(o){case"daily":return d;case"weekly":return p;case"monthly":return s;default:return d}},c=(l=>{const n=l.reduce((h,g)=>h+g.total_revenue,0),t=l.reduce((h,g)=>h+g.cost_of_goods,0),e=l.reduce((h,g)=>h+g.gross_profit,0),f=n>0?e/n:0;return{totalRevenue:n,totalCost:t,totalProfit:e,avgMargin:f}})(a());return{activeTab:o,setActiveTab:m,getActiveData:a,summary:c}},k=()=>({printReport:(p,s)=>{const o=window.open("","_blank");if(!o)return;const m=p==="daily"?"Daily Sales Report":p==="weekly"?"Weekly Sales Report":"Monthly Sales Report",a=s.reduce((t,e)=>t+e.total_revenue,0),u=s.reduce((t,e)=>t+e.gross_profit,0),c=s.reduce((t,e)=>t+e.cost_of_goods,0),l=a>0?u/a:0;let n=`
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
    `;s.forEach(t=>{n+=`
        <tr>
            <td>${t.date}</td>
            <td class="count">${t.sales_count.toLocaleString("en-US")}</td>
            <td class="currency">${i(t.total_revenue)}</td>
            <td class="currency">${i(t.cost_of_goods)}</td>
            <td class="currency">${i(t.gross_profit)}</td>
            <td class="percent">${x(t.profit_margin)}</td>
        </tr>
      `}),n+=`
        </tbody>
        <tfoot>
            <tr>
                <td colspan="2">Total</td>
                <td class="currency">${i(a)}</td>
                <td class="currency">${i(c)}</td>
                <td class="currency">${i(u)}</td>
                <td class="percent">${x(l)}</td>
            </tr>
        </tfoot>
        </table>
        <div class="summary">
            <p>Total Revenue: ${i(a)}</p>
            <p>Total Cost: ${i(c)}</p>
            <p>Total Profit: ${i(u)}</p>
            <p>Average Profit Margin: ${x(l)}</p>
        </div>
      </body>
      </html>
    `,o.document.write(n),o.document.close(),o.focus(),setTimeout(()=>{o.print()},250)}}),{TabPane:b}=y,_t=({dailyProfits:d,weeklyProfits:p,monthlyProfits:s})=>{const{t:o}=R(),{activeTab:m,setActiveTab:a,getActiveData:u,summary:c}=A(d,p,s),{printReport:l}=k(),n=[{title:o("dashboard.title"),href:route("dashboard")},{title:o("reports.title"),href:route("reports.index")}],t=()=>{l(m,u())},e=f=>r.jsxs(r.Fragment,{children:[r.jsx(_,{data:f,summary:c}),r.jsx(S,{}),r.jsx(w,{summary:c})]});return r.jsxs($,{breadcrumbs:n,children:[r.jsx(T,{title:o("reports.salesReports")}),r.jsxs("div",{className:"flex h-full flex-1 flex-col gap-4 rounded-xl p-4",children:[r.jsx(j,{onPrint:t}),r.jsxs(P,{children:[r.jsx(C,{}),r.jsxs(y,{defaultActiveKey:"daily",onChange:f=>a(f),children:[r.jsx(b,{tab:o("reports.tabs.daily"),children:e(d)},"daily"),r.jsx(b,{tab:o("reports.tabs.weekly"),children:e(p)},"weekly"),r.jsx(b,{tab:o("reports.tabs.monthly"),children:e(s)},"monthly")]})]})]})]})};export{_t as default};
