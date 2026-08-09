function solveConcrete() {
    let L=getVal('c_span'), gk=getVal('c_gk'), qk=getVal('c_qk'), b=getVal('c_b'), h=getVal('c_h');
    let fcu=getVal('c_fcu'), fy=getVal('c_fy'), cov=getVal('c_cov');
    let steps = [];
    let w = 1.4*gk + 1.6*qk;
    steps.push({title: "1. Ultimate Load (Eq 3.2)", body: `w = 1.4(${gk}) + 1.6(${qk}) = <strong>${w.toFixed(2)} kN/m</strong>`});
    let M = w * L * L / 8;
    steps.push({title: "2. Design Moment", body: `M = wL²/8 = ${w.toFixed(2)}(${L})²/8 = <strong>${M.toFixed(2)} kNm</strong>`});
    let d = h - cov - 8 - 10;
    steps.push({title: "3. Effective Depth", body: `Assume 8mm links, 20mm bars. d = ${h} - ${cov} - 8 - 10 = <strong>${d} mm</strong>`});
    let Mu = 0.156 * fcu * b * d * d / 1e6;
    let K = M / (fcu * b * d * d * 1e-6);
    steps.push({title: "4. Moment Resistance (Eq 3.11)", body: `Mu = 0.156 fcu b d² = ${Mu.toFixed(2)} kNm<br>K = M / fcu b d² = <strong>${K.toFixed(4)}</strong>`});
    let As = 0, z = 0;
    if (K <= 0.156) {
        z = d * (0.5 + Math.sqrt(0.25 - K/0.9)); if (z > 0.95*d) z = 0.95*d;
        As = (M * 1e6) / (0.87 * fy * z);
        steps.push({title: "5. Singly Reinforced (Eq 3.12, 3.13)", body: `K ≤ 0.156. Lever arm z = ${z.toFixed(1)} mm<br>As = M / (0.87 fy z) = <strong>${As.toFixed(0)} mm²</strong>`});
    } else {
        let d2 = cov + 8 + 10; let Kp = 0.156;
        let z2 = d * (0.5 + Math.sqrt(0.25 - Kp/0.9));
        let As2 = (M * 1e6 - Mu * 1e6) / (0.87 * fy * (d - d2));
        let As1 = Mu * 1e6 / (0.87 * fy * z2); As = As1 + As2;
        steps.push({title: "5. Doubly Reinforced", body: `K > 0.156. Compression steel needed.<br>As = <strong>${As.toFixed(0)} mm²</strong>`});
    }
    let V = w * L / 2; let v = V * 1000 / (b * d);
    steps.push({title: "6. Shear Stress (Eq 3.14)", body: `V = ${V.toFixed(2)} kN<br>v = V/bd = <strong>${v.toFixed(2)} N/mm²</strong>`});
    let vc = 0.6 * Math.pow(fcu/25, 1/3);
    if (v > vc + 0.4) {
        let sv = b * (v - vc) / (0.87 * 250);
        steps.push({title: "7. Shear Links (Eq 3.15)", body: `v > vc+0.4. Design links: Asv/sv = <strong>${sv.toFixed(3)}</strong>`});
    } else { steps.push({title: "7. Shear Links", body: `v < vc+0.4. Nominal links only.`}); }
    printReport('c_output', steps);
}
