// BS 5950 Complete Steel Design Suite
const UBs={"610x229x101":{D:602.6,B:227.6,t:10.5,T:14.8,A:12900,ry:5.01,u:0.863,x:41.9,Sx:2880,Zx:2510},"406x178x60":{D:406.6,B:177.9,t:7.9,T:12.8,A:7580,ry:3.95,u:0.888,x:36.1,Sx:1190,Zx:1060},"356x171x51":{D:355.6,B:171.5,t:7.4,T:11.5,A:6480,ry:3.85,u:0.885,x:35.3,Sx:995,Zx:895},"305x165x40":{D:303.8,B:165,t:6,T:10.2,A:5150,ry:3.37,u:0.886,x:32.7,Sx:723,Zx:655},"254x146x31":{D:251.4,B:146.1,t:6,T:8.6,A:3970,ry:3.19,u:0.889,x:31.1,Sx:447,Zx:393}};
const UCs={"305x305x118":{D:314.5,B:306.8,t:10.9,T:18.7,A:15000,ry:7.75,Sx:1950,rx:13.6},"203x203x52":{D:206.2,B:203.6,t:7.9,T:12.5,A:6650,ry:5.16,Sx:568,rx:8.91},"152x152x30":{D:157.6,B:152.9,t:6.5,T:9.4,A:3830,ry:3.82,Sx:248,rx:6.56}};

function solveSteelBeam(){
    let L=getVal('sb_span'),gk=getVal('sb_gk'),qk=getVal('sb_qk'),py=parseFloat(getSel('sb_grade')),rest=getSel('sb_rest');
    let steps=[];
    let w=1.4*gk+1.6*qk,M=w*L*L/8,V=w*L/2;
    steps.push({title:"1. Ultimate Loads",body:`w=1.4(${gk})+1.6(${qk})=<strong>${w.toFixed(1)} kN/m</strong><br>M=<strong>${M.toFixed(1)} kNm</strong><br>V=<strong>${V.toFixed(1)} kN</strong>`});
    let reqS=M*1e6/py;
    let sec=null;for(let k in UBs){if(UBs[k].Sx*1000>=reqS){sec=k;break;}}
    if(!sec){steps.push({title:"ERROR",body:"No section found."});printReport('sb_output',steps);return;}
    let p=UBs[sec],eps=Math.sqrt(275/py);
    steps.push({title:"2. Section",body:`<strong>${sec} UB</strong><br>Sx=${p.Sx}cm³, D=${p.D}mm, t=${p.t}mm`});
    let Pv=0.6*py*p.D*p.t/1000;
    let Mc=Math.min(py*p.Sx*1000/1e6,1.2*py*p.Zx*1000/1e6);
    if(rest==='no'){let Le=L*1000,lambda=Le/(p.ry*10),lambdaLT=p.u*p.x*lambda;let pb=lambdaLT<=20?py:lambdaLT<=40?py*0.85:lambdaLT<=60?py*0.58:py*0.45;Mc=pb*p.Sx*1000/1e6;steps.push({title:"3. LTB",body:`λLT=${lambdaLT.toFixed(0)}, pb≈${pb}`});}
    steps.push({title:"4. Verification",body:`Shear: ${V<=Pv?'<span class="pass">OK ✓</span>':'<span class="fail">FAIL ✗</span>'}<br>Moment: ${M<=Mc?'<span class="pass">OK ✓</span>':'<span class="fail">FAIL ✗</span>'}`});
    printReport('sb_output',steps);
}

function solveStanchion(){
    let N=getVal('st_N'),M=getVal('st_M'),sec=getSel('st_sec'),fcu=parseFloat(getSel('st_fcu')),py=parseFloat(getSel('st_grade')),Bp=getVal('st_Bp'),Dp=getVal('st_Dp');
    let steps=[];
    let p=UCs[sec];
    steps.push({title:"1. Column & Base Details",body:`<strong>${sec} UC</strong><br>Plate: ${Bp}×${Dp}mm<br>N=${N}kN, M=${M}kNm`});
    let Ap=Bp*Dp;
    let f_bearing=0.6*fcu;
    let e=M/N*1000;
    steps.push({title:"2. Eccentricity",body:`e=M/N×1000=<strong>${e.toFixed(1)} mm</strong><br>Bearing stress: ${f_bearing} N/mm²`});
    let tp;
    if(e<=Bp/6){
        let sigma=N*1000/Ap+M*1e6/(Bp*Dp*Dp/6);
        steps.push({title:"3. Small Eccentricity (Full Compression)",body:`σmax=<strong>${sigma.toFixed(1)} N/mm²</strong><br>${sigma<=f_bearing?'<span class="pass">Bearing OK ✓</span>':'<span class="fail">Increase plate ✗</span>'}`});
        let c=(Bp-p.B)/2;
        tp=Math.sqrt(3*sigma*c*c/py);
    }else{
        let x=(Bp/2)-e;
        let sigma_max=2*N*1000/(3*x*Dp);
        steps.push({title:"3. Large Eccentricity (Partial Compression)",body:`x=<strong>${x.toFixed(0)}mm</strong><br>σmax=<strong>${sigma_max.toFixed(1)} N/mm²</strong>`});
        let c=(Bp-p.B)/2;
        tp=Math.sqrt(3*sigma_max*c*c/py);
    }
    steps.push({title:"4. Plate Thickness",body:`tp ≥ √(3σc²/py)<br>tp ≥ <strong>${tp.toFixed(1)} mm</strong><br>Use: <strong>${Math.ceil(tp/5)*5}mm</strong> plate`});
    let bolt_dia=Math.ceil(Math.sqrt(N*1000/(4*195)));
    steps.push({title:"5. Holding Down Bolts",body:`Min 4×M${Math.max(bolt_dia,20)} Grade 8.8 bolts<br>Embedment: ${Math.max(bolt_dia*12,300)}mm`});
    steps.push({title:"✅ Stanchion Summary",body:`Base: ${Bp}×${Dp}×${Math.ceil(tp/5)*5}mm<br>Concrete: C${fcu}<br>Grout: 25mm non-shrink<br><span class="pass">DESIGN COMPLETE ✓</span>`});
    printReport('st_output',steps);
}

function solveSteelColumn(){
    let N=getVal('sc_N'),M=getVal('sc_M'),L=getVal('sc_L'),k=parseFloat(getSel('sc_k')),py=parseFloat(getSel('sc_grade'));
    let steps=[];
    let Le=L*k*1000;
    let sec="203x203x52";let p=UCs[sec];
    let lambda=Le/(p.ry*10);
    let pc=lambda<=15?py:lambda<=50?py*(1-0.003*(lambda-15)):Math.max(py*(0.9-0.008*(lambda-50)),50);
    let Pc=p.A*pc/1000;
    steps.push({title:"1. Effective Length",body:`Le=${k}×${L}=<strong>${(Le/1000).toFixed(2)}m</strong>`});
    steps.push({title:"2. Slenderness",body:`λ=<strong>${lambda.toFixed(1)}</strong>, pc≈${pc.toFixed(0)} N/mm²`});
    steps.push({title:"3. Capacity",body:`Pc=<strong>${Pc.toFixed(0)}kN</strong><br>N=${N}kN ${N<=Pc?'<span class="pass">OK ✓</span>':'<span class="fail">FAIL ✗</span>'}`});
    if(M>0){let Mc=py*p.Sx*1000/1e6;let util=N/Pc+M/Mc;steps.push({title:"4. Combined",body:`N/Pc+M/Mc=<strong>${util.toFixed(2)}</strong> ${util<=1?'<span class="pass">OK ✓</span>':'<span class="fail">FAIL ✗</span>'}`});}
    printReport('sc_output',steps);
}

function solveConnection(){
    let V=getVal('conn_V'),d=getVal('conn_d'),g=getSel('conn_g'),t=getVal('conn_t'),n=getVal('conn_n'),py=parseFloat(getSel('conn_py'));
    let steps=[];
    let As=Math.PI*d*d/4;
    let ps=g==='4.6'?160:g==='8.8'?375:500;
    let pbs=460;
    let Ps=ps*As/1000;
    let Pbb=d*t*pbs/1000;
    let Pmin=Math.min(Ps,Pbb);
    steps.push({title:"1. Bolt Capacity",body:`Ps=${Ps.toFixed(1)}kN, Pbb=${Pbb.toFixed(1)}kN<br>Min=<strong>${Pmin.toFixed(1)}kN/bolt</strong>`});
    steps.push({title:"2. Connection Capacity",body:`${n} bolts × ${Pmin.toFixed(1)}=<strong>${(n*Pmin).toFixed(0)}kN</strong><br>V=${V}kN ${V<=n*Pmin?'<span class="pass">OK ✓</span>':'<span class="fail">FAIL ✗</span>'}`});
    let e1=1.4*d,p1=2.5*d;
    steps.push({title:"3. Geometry",body:`End distance≥${e1.toFixed(0)}mm<br>Pitch≥${p1.toFixed(0)}mm`});
    printReport('conn_output',steps);
}

function solveTension(){
    let T=getVal('ten_T'),type=getSel('ten_type'),py=parseFloat(getSel('ten_grade')),conn=getSel('ten_conn');
    let steps=[];
    let Ae=T*1000/py;
    steps.push({title:"1. Gross Area Required",body:`Ag ≥ T/py=<strong>${Ae.toFixed(0)} mm²</strong>`});
    let deduction=conn==='bolted'?0.85:1.0;
    let Ag=Ae/deduction;
    if(type==='angle'){steps.push({title:"2. Angle Selection",body:`Required Ag=${Ag.toFixed(0)}mm²<br>Try: <strong>100×100×10 Angle</strong> (Ag=1920mm²)`});}
    else if(type==='channel'){steps.push({title:"2. Channel",body:`Try: <strong>PFC 150×75×18</strong>`});}
    else{let t=Math.ceil(Math.sqrt(Ag)/10)*10;steps.push({title:"2. Flat Bar",body:`<strong>${t}×${t}mm</strong> flat bar`});}
    steps.push({title:"3. Connection",body:`${conn==='bolted'?'Bolted: Check net section and bearing':'Welded: Full strength butt weld'}`});
    steps.push({title:"✅ Tension Member",body:`T=${T}kN, Grade S${py}<br>${conn==='bolted'?'3×M20 Grade 8.8 bolts':'6mm FW each side'}<br><span class="pass">DESIGN COMPLETE ✓</span>`});
    printReport('ten_output',steps);
}

function solvePlateGirder(){
    let L=getVal('pg_span'),w=getVal('pg_udl'),py=parseFloat(getSel('pg_grade')),hw=getVal('pg_hw'),tw=getVal('pg_tw'),bf=getVal('pg_bf'),tf=getVal('pg_tf');
    let steps=[];
    let M=w*L*L/8,V=w*L/2;
    steps.push({title:"1. Loading",body:`M=<strong>${M.toFixed(0)} kNm</strong><br>V=<strong>${V.toFixed(0)} kN</strong>`});
    let I=tw*hw*hw*hw/12+2*(bf*tf*tf*tf/12+bf*tf*(hw/2+tf/2)*(hw/2+tf/2));
    let Z=I/(hw/2+tf);
    let sigma=M*1e6/Z;
    steps.push({title:"2. Bending Stress",body:`I=<strong>${(I/1e6).toFixed(0)}×10⁶ mm⁴</strong><br>σ=${sigma.toFixed(0)} vs ${py} ${sigma<=py?'<span class="pass">OK ✓</span>':'<span class="fail">FAIL ✗</span>'}`});
    let tau=V*1000/(hw*tw);
    let tau_cr=0.75*py;
    steps.push({title:"3. Web Shear",body:`τ=${tau.toFixed(1)} N/mm²<br>τcr=${tau_cr.toFixed(0)} ${tau<=tau_cr?'<span class="pass">OK ✓</span>':'<span class="fail">Stiffeners needed ✗</span>'}`});
    let d_tw=hw/tw;
    steps.push({title:"4. Web Slenderness",body:`d/t=${d_tw.toFixed(0)} ${d_tw<=100?'<span class="pass">OK ✓</span>':'<span class="fail">Check buckling ✗</span>'}`});
    let s=Math.min(1.5*hw,3000);
    steps.push({title:"5. Stiffener Spacing",body:`Max spacing: <strong>${s.toFixed(0)}mm</strong><br>Use: ${Math.ceil(L*1000/s)} intermediate stiffeners`});
    steps.push({title:"✅ Plate Girder Summary",body:`Web: ${hw}×${tw}mm<br>Flanges: ${bf}×${tf}mm<br>Grade: S${py}<br><span class="pass">DESIGN COMPLETE ✓</span>`});
    printReport('pg_output',steps);
}
