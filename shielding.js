function solveShielding(){
    let A=getVal('sh_activity'),R=getVal('sh_distance'),limit=getVal('sh_limit'),mat=getSel('sh_material'),E=getVal('sh_energy');
    let steps=[];
    let TVL;
    if(mat==='concrete')TVL={1:0.18,2:0.25,5:0.3}[E]||0.2;
    else if(mat==='lead')TVL={1:0.025,2:0.04,5:0.05}[E]||0.03;
    else TVL={1:0.07,2:0.1,5:0.12}[E]||0.08;
    let doseR=A*0.1/(R*R);
    steps.push({title:"☢️ Step 1: Unshielded Dose",body:`Activity: ${A} GBq<br>Distance: ${R}m<br>Dose rate at ${R}m = <strong>${doseR.toFixed(2)} μSv/h</strong>`});
    let reduction=limit/doseR;
    let TVLs=Math.log10(1/reduction);
    let thickness=TVLs*TVL;
    steps.push({title:"☢️ Step 2: Required Attenuation",body:`Allowable: ${limit} μSv/h<br>Reduction factor: <strong>${(1/reduction).toFixed(0)}x</strong><br>TVLs needed: <strong>${TVLs.toFixed(2)}</strong>`});
    steps.push({title:"☢️ Step 3: Shield Thickness",body:`Material: ${mat}<br>TVL at ${E} MeV: <strong>${TVL} m</strong><br>Required thickness: <strong>${thickness.toFixed(3)} m (${(thickness*1000).toFixed(0)} mm)</strong>`});
    steps.push({title:"✅ Nuclear Safety Check",body:`Shielded dose: ${(doseR*Math.pow(10,-TVLs)).toFixed(4)} μSv/h<br>${doseR*Math.pow(10,-TVLs)<=limit?'<span class="pass">DOSE WITHIN LIMITS ✓</span>':'<span class="fail">INSUFFICIENT SHIELDING ✗</span>'}`});
    printReport('sh_output',steps);
}
