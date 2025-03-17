(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[974],{296:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>y});var r=s(5155),a=s(2115),i=s(6597),n=s(6118),l=s(4065),o=s(2699),d=s.n(o),c=s(5028),m=s(2502);function h(e){let t=0,s=[],r=[];return e.forEach((e,a)=>{let i=t;t+=e.burstTime,s.push({processId:e.id,completionTime:t}),r.push({processId:e.id,startTime:i,endTime:t})}),{result:s,timeline:r}}function u(e){let t=0,s=[],r=[];return e.sort((e,t)=>e.burstTime-t.burstTime),e.forEach(e=>{let a=t;t+=e.burstTime,s.push({processId:e.id,completionTime:t}),r.push({processId:e.id,startTime:a,endTime:t})}),{result:s,timeline:r}}function p(e,t){let s=0,r=[],a=[],i=e.map(e=>({...e})),n={},l=Object.fromEntries(e.map(e=>[e.id,e.burstTime]));for(;i.length>0;){let e=i.shift(),r=s,l=Math.min(e.burstTime,t);s+=l,e.burstTime-=l,e.burstTime>0&&i.push(e),a.push({processId:e.id,startTime:r,endTime:s}),n[e.id]=s}return Object.entries(n).forEach(e=>{let[t,s]=e;r.push({processId:parseInt(t),completionTime:s})}),{result:r,timeline:a,processes:e.map(e=>({id:e.id,burstTime:l[e.id]}))}}function x(e,t){let s=0,r=[],a=[],i=t.map(()=>[]);for(e.forEach(e=>i[0].push({...e,remainingTime:e.burstTime,currentQueue:0}));i.some(e=>e.length>0);)for(let e=0;e<i.length;e++){let n=i[e],l=t[e];if(0===n.length)continue;let o=n.shift(),d=Math.min(o.remainingTime,l),c=s;s+=d,o.remainingTime-=d,a.push({processId:o.id,startTime:c,endTime:s}),o.remainingTime>0?(o.currentQueue=Math.min(e+1,i.length-1),i[o.currentQueue].push(o)):r.push({processId:o.id,completionTime:s});break}return{result:r,timeline:a}}function b(e){let t=0,s=[],r=[],a=[...e];for(;a.length>0;){a.sort((e,t)=>e.burstTime-t.burstTime);let e=a.shift(),i=t;t+=e.burstTime,s.push({processId:e.id,completionTime:t}),r.push({processId:e.id,startTime:i,endTime:t})}return{result:s,timeline:r}}function g(e){let{data:t}=e,s=(0,a.useRef)(),i=.45*window.innerWidth,n={labels:t.map(e=>"Process ".concat(e.processId)),datasets:[{label:"Completion Time",data:t.map(e=>e.completionTime),backgroundColor:"rgba(75, 192, 192, 0.2)",borderColor:"rgba(75, 192, 192, 1)",borderWidth:1}]};return(0,r.jsx)("div",{style:{width:"".concat(i,"px"),height:"".concat(.5625*i,"px"),margin:"auto",padding:"10px"},children:(0,r.jsx)(l.Bar,{ref:s,data:n})})}function f(e){let{data:t}=e,s=(0,a.useRef)(),i=.45*window.innerWidth,n=Math.max(200,25*t.length),o={},d=new Set,c=e=>(o[e]||(o[e]="hsl(".concat(137*e%360,", 70%, 50%)")),o[e]),m={labels:["Processes"],datasets:t.map(e=>{let t=d.has(e.processId)?"":"Process ".concat(e.processId);return d.add(e.processId),{label:t,data:[{x:[e.startTime,e.endTime],y:0}],backgroundColor:c(e.processId),borderColor:"black",borderWidth:1,barThickness:20}})};return(0,r.jsx)("div",{style:{width:"".concat(i,"px"),height:"".concat(n,"px"),margin:"auto",padding:"10px"},children:(0,r.jsx)(l.Bar,{ref:s,data:m,options:{responsive:!0,indexAxis:"y",scales:{x:{type:"linear",position:"bottom",title:{display:!0,text:"Time"}},y:{display:!1}},plugins:{legend:{display:!0},tooltip:{callbacks:{label:function(e){let{x:t}=e.raw,s=t[0],r=t[1],a=e.dataset.label.replace("Process ","");return"Process ".concat(a,": Execution Time ").concat(r-s)}}}}}})})}function y(){let[e,t]=(0,a.useState)(5),[s,l]=(0,a.useState)(3),[o,c]=(0,a.useState)([]),[m,y]=(0,a.useState)([]),[j,T]=(0,a.useState)("FIFO"),[w,v]=(0,a.useState)([]),[C,F]=(0,a.useState)([2,4,6]),[N,I]=(0,a.useState)(null),S=async()=>{let e=new i.uE("landscape","mm","a4"),t=(e.internal.pageSize.width-30)/2,s=(e.internal.pageSize.height-30)/2,r=async(t,s,r,a,i,n)=>{if(t){let l=await d()(t,{scale:2}),o=l.toDataURL("image/png"),c=l.width,m=l.height,h=Math.min(i/c,n/m);e.setFontSize(14),e.text(s,r,a),e.addImage(o,"PNG",r,a+5,c*h,m*h)}},a=async(a,i,l,o)=>{e.setFontSize(18),e.text("CPU Scheduling Simulation (".concat(a,")"),10,10);let d=10+t+10,c=20+s+10;e.setFontSize(14),e.text("Process Burst Times",10,20),(0,n.Ay)(e,{startY:25,margin:{left:10},head:[["Process ID","Burst Time"]],body:i.map(e=>[e.id,e.burstTime]),theme:"grid",styles:{fontSize:10},tableWidth:t-10}),e.setFontSize(14),e.text("Process Completion Times",d,20);let m=i.map(e=>{let t=l.filter(t=>t.processId===e.id);return[e.id,t[0].startTime,t[t.length-1].endTime]});(0,n.Ay)(e,{startY:25,margin:{left:d},head:[["Process ID","Start Time","Completion Time"]],body:m,theme:"grid",styles:{fontSize:10},tableWidth:t-10});let h=document.getElementById("completionChart-".concat(a));await r(h,"Completion Time Chart",10,c,t-5,s-5);let u=document.getElementById("timelineChart-".concat(a));await r(u,"Execution Timeline Chart",d,c,t-5,s-5)};if(N){let t=Object.keys(N.results);for(let s=0;s<t.length;s++){let r=t[s];s>0&&e.addPage(),await a(r,w,N.timelines[r],N.results[r])}}else await a(j,w,m,o);e.save("CPU_Scheduling_Report.pdf")};return(0,r.jsxs)("div",{className:"bg-gray-900 min-h-screen p-8 pb-20 text-white",children:[(0,r.jsx)("header",{className:"bg-blue-700 text-white w-full py-6 text-center font-bold text-3xl shadow-lg mb-8",children:"CPU Scheduling Simulator"}),(0,r.jsxs)("main",{className:"flex flex-col gap-6 items-center",children:[(0,r.jsxs)("div",{className:"flex flex-col sm:flex-row gap-4 items-center",children:[(0,r.jsx)("label",{className:"text-lg text-gray-300",children:"Number of Processes:"}),(0,r.jsx)("input",{type:"number",value:e,onChange:e=>t(parseInt(e.target.value)),className:"border border-gray-500 bg-gray-800 text-white rounded px-3 py-2 shadow-md"}),(0,r.jsx)("label",{className:"text-lg text-gray-300",children:"Select Algorithm:"}),(0,r.jsxs)("select",{value:j,onChange:e=>T(e.target.value),className:"border border-gray-500 bg-gray-800 text-white rounded px-3 py-2 shadow-md",children:[(0,r.jsx)("option",{value:"FIFO",children:"FIFO"}),(0,r.jsx)("option",{value:"SJF",children:"SJF"}),(0,r.jsx)("option",{value:"RR",children:"RR"}),(0,r.jsx)("option",{value:"STCF",children:"STCF"}),(0,r.jsx)("option",{value:"MLFQ",children:"MLFQ"})]}),"RR"===j&&(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("label",{className:"text-lg text-gray-300",children:"Time Quantum (RR):"}),(0,r.jsx)("input",{type:"number",value:s,onChange:e=>l(parseInt(e.target.value)),className:"border border-gray-500 bg-gray-800 text-white rounded px-3 py-2 shadow-md"})]})]}),"MLFQ"===j&&(0,r.jsxs)("div",{className:"flex flex-col sm:flex-row gap-4 items-center mt-4",children:[(0,r.jsx)("label",{className:"text-lg text-gray-300",children:"MLFQ Queue Quantum Times:"}),C.map((e,t)=>(0,r.jsx)("input",{type:"number",value:e,onChange:e=>{let s=[...C];s[t]=parseInt(e.target.value)||1,F(s)},className:"border border-gray-500 bg-gray-800 text-white rounded px-3 py-2 shadow-md",placeholder:"Queue ".concat(t+1)},t))]}),(0,r.jsx)("button",{onClick:()=>{v(function(e){let t=[];for(let s=0;s<e;s++)t.push({id:s+1,burstTime:Math.floor(10*Math.random())+1});return t}(e))},className:"bg-gray-700 text-white font-semibold rounded px-6 py-3 mt-4 hover:bg-gray-600 transition-all",children:"Generate Processes"}),w.length>0&&(0,r.jsxs)("table",{className:"border-collapse border border-gray-600 mt-6 w-full max-w-md",children:[(0,r.jsx)("thead",{children:(0,r.jsxs)("tr",{className:"bg-gray-700 text-white",children:[(0,r.jsx)("th",{className:"border border-gray-600 px-4 py-2",children:"Process ID"}),(0,r.jsx)("th",{className:"border border-gray-600 px-4 py-2",children:"Burst Time"})]})}),(0,r.jsx)("tbody",{children:w.map((e,t)=>(0,r.jsxs)("tr",{className:t%2==0?"bg-gray-800":"bg-gray-700",children:[(0,r.jsx)("td",{className:"border border-gray-600 px-4 py-2 text-center",children:e.id}),(0,r.jsx)("td",{className:"border border-gray-600 px-4 py-2 text-center",children:e.burstTime})]},e.id))})]}),(0,r.jsxs)("div",{className:"flex gap-4",children:[(0,r.jsx)("button",{onClick:()=>{let e,t;if(0!==w.length){switch(j){case"FIFO":({result:e,timeline:t}=h(w));break;case"SJF":({result:e,timeline:t}=u(w));break;case"RR":({result:e,timeline:t}=p(w,s));break;case"STCF":({result:e,timeline:t}=b(w));break;case"MLFQ":({result:e,timeline:t}=x(w,C));break;default:e=[],t=[]}c(e),y(t)}},className:"bg-blue-500 text-white font-semibold rounded px-6 py-3 mt-4 hover:bg-blue-400 transition-all",children:"Run Algorithm"}),(0,r.jsx)("button",{onClick:()=>{if(0===w.length)return;let e=parseInt(prompt("Enter RR Time Quantum:",s))||s;l(e);let t=C.map((e,t)=>parseInt(prompt("Enter Quantum Time for MLFQ Queue ".concat(t+1,":"),e))||e);F(t);let r={},a={};["FIFO","SJF","RR","STCF","MLFQ"].forEach(s=>{let i,n;switch(s){case"FIFO":({result:i,timeline:n}=h(w));break;case"SJF":({result:i,timeline:n}=u(w));break;case"RR":({result:i,timeline:n}=p(w,e));break;case"STCF":({result:i,timeline:n}=b(w));break;case"MLFQ":({result:i,timeline:n}=x(w,t));break;default:i=[],n=[]}r[s]=i,a[s]=n}),I({results:r,timelines:a})},className:"bg-purple-500 text-white font-semibold rounded px-6 py-3 mt-4 hover:bg-purple-400 transition-all",children:"Run All Algorithms"})]}),o.length>0&&!N&&(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)("div",{style:{display:"flex",justifyContent:"center",flexWrap:"wrap",gap:"10px"},children:[(0,r.jsx)("div",{id:"completionChart-".concat(j),children:(0,r.jsx)(g,{data:o})}),(0,r.jsx)("div",{id:"timelineChart-".concat(j),children:(0,r.jsx)(f,{data:m})})]}),(0,r.jsx)("button",{onClick:S,className:"bg-green-500 text-white font-semibold rounded px-6 py-3 mt-4 hover:bg-green-400 transition-all",children:"Download PDF"})]}),N&&(0,r.jsxs)("div",{className:"mt-10",children:[(0,r.jsx)("h2",{className:"text-2xl font-bold text-center mb-4",children:"Comparison of All Algorithms"}),(0,r.jsx)("div",{className:"flex flex-wrap justify-center gap-8",children:Object.keys(N.results).map(e=>(0,r.jsxs)("div",{className:"bg-gray-800 p-4 rounded shadow-md",children:[(0,r.jsx)("h3",{className:"text-xl font-semibold text-center mb-2",children:e}),(0,r.jsx)("div",{id:"completionChart-".concat(e),children:(0,r.jsx)(g,{data:N.results[e]})}),(0,r.jsx)("div",{id:"timelineChart-".concat(e),children:(0,r.jsx)(f,{data:N.timelines[e]})})]},e))}),(0,r.jsx)("button",{onClick:S,className:"bg-green-500 text-white font-semibold rounded px-6 py-3 mt-8 hover:bg-green-400 transition-all block mx-auto",children:"Download PDF"})]})]})]})}(0,c.default)(()=>Promise.resolve().then(s.bind(s,4065)).then(e=>e.Chart),{loadableGenerated:{webpack:()=>[null]},ssr:!1}),m.t1.register(m.PP,m.kc,m.E8,m.hE,m.m_,m.s$)},844:(e,t,s)=>{Promise.resolve().then(s.bind(s,296))}},e=>{var t=t=>e(e.s=t);e.O(0,[647,930,316,939,441,684,358],()=>t(844)),_N_E=e.O()}]);