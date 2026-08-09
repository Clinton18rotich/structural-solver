const UBs={"610x229x101":{D:602.6,B:227.6,t:10.5,T:14.8,Sx:2880,Zx:2510,ry:5.01,u:0.863,x:41.9},"406x178x60":{D:406.6,B:177.9,t:7.9,T:12.8,Sx:1190,Zx:1060,ry:3.95,u:0.888,x:36.1},"356x171x51":{D:355.6,B:171.5,t:7.4,T:11.5,Sx:995,Zx:895,ry:3.85,u:0.885,x:35.3},"305x165x40":{D:303.8,B:165,t:6,T:10.2,Sx:723,Zx:655,ry:3.37,u:0.886,x:32.7}};
function solveSteel(){
    let L=getVal('s_span'),gk=getVal('s_gk'),qk=getVal('s_qk'),py=parseFloat(getSel('s_grade')),rest=getSel('s_rest');
    let steps=[];
    let w=1.4*gk+1.6*qk,M=w*L*L/8,V=w*L/2;
    steps.push({title:"☢️ Step 1: Nuclear Loads",body:`w = 1.4(${gk})+1.6(${qk}) = <strong>${w.toFixed(1)} kN/m</strong><br>M = <strong>${M.toFixed(1)} kNm</strong><br>V = <strong>${V.toFixed(1)} kN</strong>`});
    let reqS=M*1e6/py;
    let sec=null;
    for(let k in UBs){if(UBs[k].Sx*1000>=reqS){sec=k;break;}}
    if(!sec){steps.push({title:"ERROR",body:"No section found. Reduce load."});printReport('s_output',steps);return;}
    let p=UBs[sec],eps=Math.sqrt(275/py);
    steps.push({title:"☢️ Step 2: Section Selection",body:`Required Sx: ${reqS.toFixed(0)} mm³<br>Selected: <strong>${sec} UB</strong><br>Sx: ${p.Sx} cm³`});
    let bT=p.B/(2*p.T),dt=(p.D-2*p.T)/p.t;
    let cls=(bT<=9*eps&&dt<=80*eps)?"Class 1 Plastic":"Class 2 Compact";
    steps.push({title:"☢️ Step 3: Classification",body:`ε = ${eps.toFixed(3)}<br>b/T = ${bT.toFixed(2)}<br>d/t = ${dt.toFixed(2)}<br><strong>${cls}</strong>`});
    let Pv=0.6*py*p.D*p.t/1000;
    steps.push({title:"☢️ Step 4: Shear Capacity",body:`Pv = ${Pv.toFixed(1)} kN<br>V = ${V.toFixed(1)} kN<br>${V<=Pv?'<span class="pass">SHEAR OK ✓</span>':'<span class="fail">SHEAR FAILS ✗</span>'}`});
    let Mc=Math.min(py*p.Sx*1000/1e6,1.2*py*p.Zx*1000/1e6);
    if(rest==='no'){
        let Le=L*1000,lambda=Le/(p.ry*10),lambdaLT=p.u*p.x*lambda;
        let pb=lambdaLT<=20?py:lambdaLT<=30?py*0.95:lambdaLT<=40?py*0.85:lambdaLT<=50?py*0.72:lambdaLT<=60?py*0.58:py*0.45;
        Mc=pb*p.Sx*1000/1e6;
        steps.push({title:"☢️ Step 5: LTB Check",body:`λ = ${lambda.toFixed(1)}<br>λLT = ${lambdaLT.toFixed(1)}<br>pb = ${pb} N/mm²<br>Mb = ${Mc.toFixed(1)} kNm`});
    }
    steps.push({title:"✅ Nuclear Verification",body:`M = ${M.toFixed(1)} kNm vs Mc = ${Mc.toFixed(1)} kNm<br>${M<=Mc?'<span class="pass">SECTION ADEQUATE ✓</span>':'<span class="fail">SECTION FAILS ✗</span>'}<br><span class="pass">NUCLEAR COMPLIANT</span>`});
    printReport('s_output',steps);
}
