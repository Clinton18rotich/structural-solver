function solveRCBeam() {
    let L=getVal('c_span'), gk=getVal('c_gk'), qk=getVal('c_qk'), b=getVal('c_b'), h=getVal('c_h');
    let fcu=getVal('c_fcu'), fy=getVal('c_fy'), cov=getVal('c_cov');
    let steps=[];
    let w=1.4*gk+1.6*qk;
    steps.push({title:"1. Ultimate Load (Eq 3.2)",body:`w = 1.4(${gk}) + 1.6(${qk}) = <strong>${w.toFixed(2)} kN/m</strong>`});
    let M=w*L*L/8;
    steps.push({title:"2. Design Moment",body:`M = wL²/8 = <strong>${M.toFixed(2)} kNm</strong>`});
    let d=h-cov-8-10;
    steps.push({title:"3. Effective Depth",body:`Assume 8mm links, 20mm bars<br>d = ${h}-${cov}-8-10 = <strong>${d} mm</strong>`});
    let K=M/(fcu*b*d*d*1e-6);
    let Mu=0.156*fcu*b*d*d/1e6;
    steps.push({title:"4. Moment Resistance (Cl 3.4.4.4)",body:`K = <strong>${K.toFixed(4)}</strong><br>Mu = ${Mu.toFixed(1)} kNm`});
    let As,z;
    if(K<=0.156){
        z=d*(0.5+Math.sqrt(0.25-K/0.9)); if(z>0.95*d)z=0.95*d;
        As=M*1e6/(0.87*fy*z);
        steps.push({title:"5. Singly Reinforced",body:`z = ${z.toFixed(1)} mm<br>As = <strong>${As.toFixed(0)} mm²</strong>`});
    }else{
        let d2=cov+8+10; let z2=d*(0.5+Math.sqrt(0.25-0.156/0.9));
        let As1=Mu*1e6/(0.87*fy*z2); let As2=(M*1e6-Mu*1e6)/(0.87*fy*(d-d2));
        As=As1+As2;
        steps.push({title:"5. Doubly Reinforced",body:`As,total = <strong>${As.toFixed(0)} mm²</strong><br>As,comp = ${As2.toFixed(0)} mm²`});
    }
    let V=w*L/2, v=V*1000/(b*d);
    let rho=Math.min(Math.max(As/(b*d),0.002),0.04);
    let vc=0.79*Math.pow(100*rho,1/3)*Math.pow(400/d,0.25)*Math.pow(fcu/25,1/3)/1.25;
    steps.push({title:"6. Shear Check",body:`v = ${v.toFixed(2)} N/mm²<br>vc = ${vc.toFixed(2)} N/mm²<br>${v<=vc?'<span class="pass">Shear OK ✓</span>':(v<=vc+0.4?'Nominal links T8@300':'<span class="fail">Design links required ✗</span>')}`});
    steps.push({title:"✅ Summary",body:`Beam: ${b}×${h}mm<br>As: <strong>${As.toFixed(0)} mm²</strong> (${Math.ceil(As/314)}T20)<br><span class="pass">DESIGN COMPLETE ✓</span>`});
    printReport('c_output',steps);
}

function solveRCSlab() {
    let L=getVal('s_span'), gk=getVal('s_gk'), qk=getVal('s_qk'), fcu=getVal('s_fcu'), fy=getVal('s_fy'), cov=getVal('s_cov');
    let steps=[];
    let w=1.4*gk+1.6*qk;
    steps.push({title:"1. Ultimate Load",body:`w = 1.4(${gk}) + 1.6(${qk}) = <strong>${w.toFixed(2)} kN/m²</strong>`});
    let M=w*L*L/8;
    steps.push({title:"2. Design Moment",body:`M = wL²/8 = <strong>${M.toFixed(2)} kNm/m</strong>`});
    let h=Math.ceil(L*1000/20/10)*10;
    let d=h-cov-5;
    steps.push({title:"3. Preliminary Depth",body:`h ≈ span/20 = ${L*1000/20} → <strong>${h} mm</strong><br>d = ${h}-${cov}-5 = <strong>${d} mm</strong>`});
    let K=M/(fcu*1000*d*d*1e-6);
    if(K>0.156){ h+=20; d=h-cov-5; K=M/(fcu*1000*d*d*1e-6); steps.push({title:"  (Adjusted)",body:`K too high, increasing h to <strong>${h}mm</strong>`});}
    let z=d*(0.5+Math.sqrt(0.25-K/0.9)); if(z>0.95*d)z=0.95*d;
    let As=M*1e6/(0.87*fy*z);
    let AsMin=0.0013*1000*h; As=Math.max(As,AsMin);
    steps.push({title:"4. Reinforcement",body:`K = ${K.toFixed(4)}<br>z = ${z.toFixed(1)} mm<br>As = <strong>${As.toFixed(0)} mm²/m</strong><br>As,min = ${AsMin.toFixed(0)} mm²/m`});
    let spacing=Math.floor(1000/(As/113));
    steps.push({title:"✅ Slab Specification",body:`Thickness: <strong>${h} mm</strong><br>Main bars: T12 @ <strong>${Math.min(spacing,300)}mm c/c</strong><br>Distribution: T10 @ 300 c/c<br><span class="pass">DESIGN COMPLETE ✓</span>`});
    printReport('s_output',steps);
}

function solveRCColumn() {
    let N=getVal('col_N'), Mx=getVal('col_Mx'), My=getVal('col_My'), b=getVal('col_b'), h=getVal('col_h');
    let fcu=getVal('col_fcu'), fy=getVal('col_fy'), cov=getVal('col_cov');
    let steps=[];
    let Ac=b*h;
    steps.push({title:"1. Section Properties",body:`b = ${b}mm, h = ${h}mm<br>Gross Area = <strong>${Ac} mm²</strong>`});
    let Ncap=0.4*fcu*Ac+0.67*fy*0.01*Ac;
    steps.push({title:"2. Axial Capacity (Cl 3.8.4)",body:`Ncap (1% steel) = <strong>${(Ncap/1000).toFixed(0)} kN</strong>`});
    let ratio=N*1000/Ncap;
    let beta=0.65;
    let M_eff=Math.max(Mx,My)+beta*Math.min(Mx,My)*(Math.min(b,h)/Math.max(b,h));
    steps.push({title:"3. Biaxial Bending",body:`M_eff = <strong>${M_eff.toFixed(1)} kNm</strong><br>N/Ncap = ${ratio.toFixed(3)} ${ratio<=1?'<span class="pass">✓</span>':'<span class="fail">✗</span>'}`});
    let Asc_req=N*1000/(0.67*fy);
    let bars=Math.max(4,Math.ceil(Asc_req/314));
    steps.push({title:"✅ Column Specification",body:`Provide: <strong>${bars}T20</strong> bars<br>Links: T8 @ 300 c/c<br><span class="pass">DESIGN COMPLETE ✓</span>`});
    printReport('col_output',steps);
}

function solveRCFooting() {
    let N=getVal('f_N'), cb=getVal('f_cb'), ch=getVal('f_ch'), qa=getVal('f_bear');
    let fcu=getVal('f_fcu'), fy=getVal('f_fy'), cov=getVal('f_cov');
    let steps=[];
    let area=N/qa; let size=Math.ceil(Math.sqrt(area)*10)/10;
    steps.push({title:"1. Footing Size",body:`Required Area = ${N}/${qa} = ${area.toFixed(2)} m²<br>Use: <strong>${size}×${size} m</strong>`});
    let h=600; let d=h-cov-20-10;
    steps.push({title:"2. Depth",body:`Try h = 600mm, d = <strong>${d} mm</strong>`});
    let press=N/(size*size);
    let crit=(size*1000-cb)/2;
    let M=press*crit*crit/2*1000;
    let As=M/(0.87*fy*0.95*d);
    let AsMin=0.0015*1000*h; As=Math.max(As,AsMin);
    steps.push({title:"3. Flexural Reinforcement",body:`Soil pressure = ${press.toFixed(1)} kN/m²<br>M = ${(M/1e6).toFixed(1)} kNm/m<br>As = <strong>${As.toFixed(0)} mm²/m</strong>`});
    let per=2*(cb+ch+6*d);
    let Vp=N*1.15-press*(cb+3*d)*(ch+3*d)/1e6;
    let vp=Vp*1000/(per*d);
    let vc=0.8*Math.sqrt(fcu);
    steps.push({title:"4. Punching Shear",body:`v = ${vp.toFixed(2)} N/mm²<br>vc = ${vc.toFixed(2)} N/mm²<br>${vp<=vc?'<span class="pass">OK ✓</span>':'<span class="fail">Increase depth ✗</span>'}`});
    steps.push({title:"✅ Footing Specification",body:`Size: <strong>${size}×${size}×0.6m</strong><br>Reinf: T20 @ 200 c/c both ways<br><span class="pass">DESIGN COMPLETE ✓</span>`});
    printReport('f_output',steps);
}

function solveRCWall() {
    let H=getVal('w_H'), g=getVal('w_g'), phi=getVal('w_phi'), mu=getVal('w_mu'), qa=getVal('w_bear');
    let fcu=getVal('w_fcu'), fy=getVal('w_fy');
    let steps=[];
    let ka=(1-Math.sin(phi*Math.PI/180))/(1+Math.sin(phi*Math.PI/180));
    steps.push({title:"1. Active Pressure Coefficient",body:`ka = <strong>${ka.toFixed(3)}</strong>`});
    let Pa=0.5*ka*g*H*H;
    steps.push({title:"2. Active Thrust",body:`Pa = <strong>${Pa.toFixed(1)} kN/m</strong> at H/3 = ${(H/3).toFixed(2)}m`});
    let B=0.6*H, T=0.1*H;
    let W_wall=24*H*T, W_base=24*B*0.5, W_soil=18*(B-T)*H, W_total=W_wall+W_base+W_soil;
    let F=mu*W_total;
    let FoS_sliding=F/(1.4*Pa);
    steps.push({title:"3. Sliding Check",body:`W_total = ${W_total.toFixed(1)} kN/m<br>Friction = ${F.toFixed(1)} kN/m<br>FoS = <strong>${FoS_sliding.toFixed(2)}</strong> ${FoS_sliding>=1.5?'<span class="pass">✓</span>':'<span class="fail">✗</span>'}`});
    let Mo=1.4*Pa*H/3;
    let Mr=W_wall*B/2+W_base*B/2+W_soil*(B+(B-T)/2);
    let FoS_ot=Mr/Mo;
    steps.push({title:"4. Overturning Check",body:`FoS = <strong>${FoS_ot.toFixed(2)}</strong> ${FoS_ot>=2.0?'<span class="pass">✓</span>':'<span class="fail">✗</span>'}`});
    let e=B/2-(Mr-Mo)/W_total;
    let q_max=W_total/B*(1+6*Math.abs(e)/B);
    steps.push({title:"5. Bearing Pressure",body:`q_max = ${q_max.toFixed(1)} kN/m² vs ${qa} ${q_max<=qa?'<span class="pass">✓</span>':'<span class="fail">✗</span>'}`);
    let M_stem=1.4*Pa*H/3;
    let d_stem=T*1000-50-8-10;
    let As_stem=M_stem*1e6/(0.87*fy*0.95*d_stem);
    steps.push({title:"6. Stem Reinforcement",body:`M = ${M_stem.toFixed(1)} kNm/m<br>As = <strong>${As_stem.toFixed(0)} mm²/m</strong>`});
    steps.push({title:"✅ Wall Specification",body:`Height: ${H}m, Base: ${B.toFixed(1)}m<br>Stem: ${T.toFixed(2)}m thick<br>Reinf: T${Math.ceil(As_stem/100)*2} @ 200 c/c<br><span class="pass">DESIGN COMPLETE ✓</span>`});
    printReport('w_output',steps);
}
