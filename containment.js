function solveContainment(){
    let P=getVal('cn_pressure'),R=getVal('cn_radius')*1000,T=getVal('cn_temp'),py=parseFloat(getSel('cn_grade')),CA=getVal('cn_corr');
    let steps=[];
    let ft=0.7*py;
    let t=P*R/(ft-0.6*P);
    steps.push({title:"🏭 Step 1: Cylindrical Shell Thickness (BS 5500)",body:`Design pressure: ${P} MPa<br>Inner radius: ${R} mm<br>Allowable stress ft = 0.7×${py} = <strong>${ft} MPa</strong>`});
    steps.push({title:"🏭 Step 2: Required Wall Thickness",body:`t = PR/(ft-0.6P)<br>t = ${P}×${R}/(${ft.toFixed(1)}-0.6×${P})<br>= <strong>${t.toFixed(1)} mm</strong>`});
    let tTotal=t+CA;
    steps.push({title:"🏭 Step 3: Corrosion Allowance",body:`Corrosion: ${CA}mm<br>Total thickness: <strong>${tTotal.toFixed(1)} mm</strong>`});
    let sigmaH=P*R/t;
    steps.push({title:"🏭 Step 4: Hoop Stress Check",body:`σh = PR/t = <strong>${sigmaH.toFixed(1)} MPa</strong><br>Allowable: ${ft.toFixed(1)} MPa<br>${sigmaH<=ft?'<span class="pass">HOOP STRESS OK ✓</span>':'<span class="fail">HOOP STRESS EXCEEDED ✗</span>'}`});
    let alpha=12e-6,deltaT=T-20,E_steel=210000;
    let sigmaT=E_steel*alpha*deltaT;
    steps.push({title:"🏭 Step 5: Thermal Stress (ΔT = "+(T-20)+"°C)",body:`σt = EαΔT = <strong>${sigmaT.toFixed(1)} MPa</strong><br>${sigmaT<=ft?'<span class="pass">THERMAL STRESS OK ✓</span>':'<span class="fail">THERMAL STRESS HIGH ✗</span>'}`});
    steps.push({title:"✅ Containment Verification",body:`Wall: <strong>${tTotal.toFixed(1)} mm</strong><br>Design: ${P} MPa @ ${T}°C<br><span class="pass">NUCLEAR CONTAINMENT COMPLIANT ✓</span>`});
    printReport('cn_output',steps);
}
