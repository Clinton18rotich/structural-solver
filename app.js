function switchTab(tabId,e){document.querySelectorAll('.tab-content').forEach(el=>el.classList.remove('active'));document.querySelectorAll('.tab-btn').forEach(el=>el.classList.remove('active'));document.getElementById(tabId+'-tab').classList.add('active');if(e)e.target.classList.add('active')}
function getVal(id){return parseFloat(document.getElementById(id).value)||0}
function getSel(id){return document.getElementById(id).value}
function printReport(id,steps){let html="<h3>📋 Design Report</h3>";steps.forEach(s=>{html+=`<hr><span class="step-title">${s.title}</span><div class="step-body">${s.body}</div>`});document.getElementById(id).innerHTML=html}
