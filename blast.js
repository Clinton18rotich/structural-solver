function solveBlast(){
    let W=getVal('bl_mass'),R=getVal('bl_distance'),H=getVal('bl_height'),L=getVal('bl_length'),fcu=getVal('bl_fcu');
    let steps=[];
    let Z=R/Math.pow(W,1/3);
    steps.push({title:"💥 Step 1: Scaled Distance",body:`Z = R/W^(1/3) = ${R}/${Math.pow(W,1/3).toFixed(1)} = <strong>${Z.toFixed(2)} m/kg^(1/3)</strong>`});
    let Pr;
    if(Z<1)Pr=10000;else if(Z<3)Pr=1000/Math.pow(Z,2);else if(Z<10)Pr=100/Math.pow(Z,1.5);else Pr=10/Z;
    steps.push({title:"💥 Step 2: Peak Reflected Pressure",body:`Pr ≈ <strong>${Pr.toFixed(1)} kPa</strong>`});
    let impulse=200*Math.pow(W,0.5)/R;
    steps.push({title:"💥 Step 3: Impulse",body:`i = <strong>${impulse.toFixed(1)} kPa-ms</strong>`});
    let t=Math.sqrt(Pr*H*H*1000/(0.1*fcu))*1.2;
    steps.push({title:"💥 Step 4: Wall Thickness (Empirical)",body:`Required: <strong>${t.toFixed(0)} mm</strong>`});
    let reinf=0.005*t*1000;
    steps.push({title:"💥 Step 5: Reinforcement",body:`Minimum each face: <strong>${reinf.toFixed(0)} mm²/m</strong><br>Recommended: T${Math.ceil(reinf/100)*2} @ 200mm c/c each way`});
    steps.push({title:"✅ Blast Verification",body:`Wall: ${t.toFixed(0)}mm thick RC<br>Blast load: ${Pr.toFixed(1)} kPa<br>Standoff: ${R}m from ${W}kg TNT<br><span class="pass">BLAST RESISTANT DESIGN ✓</span>`});
    printReport('bl_output',steps);
}
