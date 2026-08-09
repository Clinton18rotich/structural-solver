const UBs = {
    "610x229x101": {D:602.6,B:227.6,t:10.5,T:14.8,A:12900,ry:5.01,u:0.863,x:41.9,Sx:2880,Zx:2510},
    "406x178x60":  {D:406.6,B:177.9,t:7.9,T:12.8,A:7580,ry:3.95,u:0.888,x:36.1,Sx:1190,Zx:1060},
    "356x171x51":  {D:355.6,B:171.5,t:7.4,T:11.5,A:6480,ry:3.85,u:0.885,x:35.3,Sx:995,Zx:895},
    "305x165x40":  {D:303.8,B:165.0,t:6.0,T:10.2,A:5150,ry:3.37,u:0.886,x:32.7,Sx:723,Zx:655}
};
function solveSteel() {
    let L=getVal('s_span'), gk=getVal('s_gk'), qk=getVal('s_qk'), py=getVal('s_grade'), rest=getSel('s_rest');
    let steps = [];
    let w = 1.4*gk + 1.6*qk; let M = w*L*L/8; let V = w*L/2;
    steps.push({title:"1. Loads & Moments", body:`w = ${w.toFixed(1)} kN/m<br>M = ${M.toFixed(1)} kNm | V = ${V.toFixed(1)} kN`});
    let reqS = M * 1e6 / py; 
    steps.push({title:"2. Selection (Eq 4.3)", body:`Required Sx ≥ ${reqS.toFixed(0)} mm³`});
    let sec = null; for(let k in UBs){ if(UBs[k].Sx >= reqS){ sec=k; break; } }
    if(!sec){ steps.push({title:"ERROR", body:"No section in database meets this moment."}); printReport('s_output', steps); return; }
    let p = UBs[sec]; let eps = Math.sqrt(275/py);
    steps.push({title:"3. Selected Section", body:`Choose <strong>${sec}</strong> UB<br>Sx = ${p.Sx} cm³, Zx = ${p.Zx} cm³`});
    let bT = p.B/(2*p.T); let dt = p.D/p.t;
    let classRes = (bT <= 9*eps && dt <= 80*eps) ? "Class 1 Plastic" : "Class 2 Compact";
    steps.push({title:"4. Classification (Table 4.4)", body:`ε = ${eps.toFixed(3)}<br>b/T = ${bT.toFixed(2)}, d/t = ${dt.toFixed(2)}<br>Section is <strong>${classRes}</strong>`});
    let Pv = 0.6 * py * p.D * p.t / 1000;
    steps.push({title:"5. Shear Capacity (Eq 4.5)", body:`Pv = 0.6 py D t = ${Pv.toFixed(1)} kN<br>Fv (${V.toFixed(1)}) ${V <= Pv ? '<span class="pass">≤</span>' : '<span class="fail">></span>'} Pv (${Pv.toFixed(1)}) -> ${V <= Pv ? 'OK' : 'FAIL'}`});
    let Mc = py * p.Sx / 1000; let McLim = 1.2 * py * p.Zx / 1000; Mc = Math.min(Mc, McLim);
    if(rest === 'no'){
        let Le = L * 1000; let lambda = Le / (p.ry * 10); 
        steps.push({title:"6. LTB (Unrestrained)", body:`Simplified LTB check (Eq 4.19):<br>λ = ${lambda.toFixed(1)}<br>Moment capacity = ${Mc.toFixed(1)} kNm`});
    }
    steps.push({title:"Final Check", body:`Design Moment (${M.toFixed(1)} kNm) ${M <= Mc ? '<span class="pass">≤</span>' : '<span class="fail">></span>'} Moment Capacity (${Mc.toFixed(1)} kNm) -> <strong>${M <= Mc ? 'SECTION IS ADEQUATE' : 'SECTION FAILS'}</strong>`});
    printReport('s_output', steps);
}
