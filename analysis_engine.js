function buildAnalysisUI() {
    document.getElementById('analysis-tab').innerHTML = `
        <h2>📊 Structural Analysis (Resultants & Stresses)</h2>
        <div class="input-grid">
            <label>Load 1 (kN): <input type="number" id="a_P1" value="400"></label>
            <label>x1 (mm): <input type="number" id="a_x1" value="150"></label>
            <label>y1 (mm): <input type="number" id="a_y1" value="100"></label>
            <label>Load 2 (kN): <input type="number" id="a_P2" value="200"></label>
            <label>x2 (mm): <input type="number" id="a_x2" value="400"></label>
            <label>y2 (mm): <input type="number" id="a_y2" value="100"></label>
            <label>Load 3 (kN): <input type="number" id="a_P3" value="100"></label>
            <label>x3 (mm): <input type="number" id="a_x3" value="150"></label>
            <label>y3 (mm): <input type="number" id="a_y3" value="0"></label>
            <label>Column Width (mm): <input type="number" id="a_b" value="200"></label>
            <label>Column Depth (mm): <input type="number" id="a_h" value="400"></label>
            <label>Hole Diameter (mm): <input type="number" id="a_hole" value="100"></label>
        </div>
        <button class="action-btn" onclick="solveAnalysis()">📊 Run Structural Analysis</button>
        <div id="a_output" class="report-box"></div>
    `;
}

function solveAnalysis() {
    let steps = [];
    let P = [getVal('a_P1'), getVal('a_P2'), getVal('a_P3')];
    let x = [getVal('a_x1'), getVal('a_x2'), getVal('a_x3')];
    let y = [getVal('a_y1'), getVal('a_y2'), getVal('a_y3')];
    let b = getVal('a_b'), h = getVal('a_h'), hole_d = getVal('a_hole');
    let PR = P.reduce((a, b) => a + b, 0);
    steps.push({title: "1. Determine Resultant Load", body: `P_R = Sum of all loads<br>P_R = ${P.join(' + ')} = <strong>${PR} kN</strong>`});
    let x_bar = P.reduce((sum, p, i) => sum + p * x[i], 0) / PR;
    let y_bar = P.reduce((sum, p, i) => sum + p * y[i], 0) / PR;
    steps.push({title: "2. Position of Resultant (Centroid)", body: `x̄ = (ΣP·x) / ΣP = ${x_bar.toFixed(1)} mm<br>ȳ = (ΣP·y) / ΣP = ${y_bar.toFixed(1)} mm<br><strong>Resultant acts at (${x_bar.toFixed(1)}, ${y_bar.toFixed(1)}) mm</strong>`});
    let A_gross = b * h;
    let A_hole = Math.PI * (hole_d/2) * (hole_d/2);
    let A_net = A_gross - A_hole;
    let I_x = (b * h * h * h / 12) - (Math.PI * Math.pow(hole_d, 4) / 64);
    let I_y = (h * b * b * b / 12) - (Math.PI * Math.pow(hole_d, 4) / 64);
    steps.push({title: "3. Section Properties (Net)", body: `A_net = ${A_gross} - ${A_hole.toFixed(0)} = <strong>${A_net} mm²</strong><br>I_x = <strong>${(I_x/1e6).toFixed(3)} × 10⁶ mm⁴</strong><br>I_y = <strong>${(I_y/1e6).toFixed(3)} × 10⁶ mm⁴</strong>`});
    let ex = x_bar - (b/2);
    let ey = y_bar - (h/2);
    steps.push({title: "4. Eccentricities (e_x, e_y)", body: `e_x = x̄ - (b/2) = <strong>${ex.toFixed(1)} mm</strong><br>e_y = ȳ - (h/2) = <strong>${ey.toFixed(1)} mm</strong>`});
    let Mx = PR * ey / 1000;
    let My = PR * ex / 1000;
    let sigma_direct = PR * 1000 / A_net;
    let sigma_A = sigma_direct - (Mx*1e6*h/2/I_x) - (My*1e6*b/2/I_y);
    let sigma_B = sigma_direct - (Mx*1e6*h/2/I_x) + (My*1e6*b/2/I_y);
    let sigma_C = sigma_direct + (Mx*1e6*h/2/I_x) + (My*1e6*b/2/I_y);
    let sigma_D = sigma_direct + (Mx*1e6*h/2/I_x) - (My*1e6*b/2/I_y);
    steps.push({title: "5. Stresses at Corners A, B, C, D", body: `σ = P/A ± M_x y / I_x ± M_y x / I_y<br>σ_A = <strong>${sigma_A.toFixed(2)} N/mm²</strong><br>σ_B = <strong>${sigma_B.toFixed(2)} N/mm²</strong><br>σ_C = <strong>${sigma_C.toFixed(2)} N/mm²</strong><br>σ_D = <strong>${sigma_D.toFixed(2)} N/mm²</strong><br><i>Positive = Tension, Negative = Compression</i>`});
    printReport('a_output', steps);
}
