// ---------- TABLE 3.11 (RC vc) ----------
function get_vc(As, b, d, fcu){
    let rho = 100 * As / (b * d);
    let vc_base = 0.79 * Math.pow(rho, 1/3) * Math.pow(400/d, 0.25) * Math.pow(fcu/25, 1/3) / 1.25;
    return Math.min(Math.max(vc_base, 0.4), 4.0);
}
// ---------- TABLE 3.24/3.25 (Two-Way Slab) ----------
function get_beta_sx(ratio){ if(ratio <= 1.0) return 0.024; if(ratio <= 1.2) return 0.032; if(ratio <= 1.4) return 0.040; if(ratio <= 1.6) return 0.048; return 0.055; }
function get_beta_sy(ratio){ return 0.024; }
function get_beta_vx(ratio){ if(ratio <= 1.0) return 0.33; if(ratio <= 1.2) return 0.39; if(ratio <= 1.4) return 0.45; if(ratio <= 1.6) return 0.51; return 0.60; }
function get_beta_vy(ratio){ return 0.33; }

// ---------- TABLE 4.7 (Bending Strength pb for rolled sections, D/T based) ----------
function get_pb_table_4_7(lambdaLT, DT, py) {
    let base = 275; if(py === 355) base = 355;
    if(lambdaLT <= 30) return base;
    let pb = base - (base - 200)/30*(lambdaLT-30);
    if(lambdaLT <= 50) pb = 200 - (200-130)/20*(lambdaLT-50);
    if(lambdaLT <= 75) pb = 130 - (130-85)/25*(lambdaLT-75);
    return Math.max(pb, 50);
}

// ---------- TABLE 4.8 (Slenderness factor v) ----------
function get_v_factor(lambda_x){
    if(lambda_x <= 15) return 1.0;
    if(lambda_x <= 30) return 1.0 - (lambda_x-15)/15*0.1;
    if(lambda_x <= 50) return 0.9 - (lambda_x-30)/20*0.2;
    return 0.7 - (lambda_x-50)/20*0.2;
}

// ---------- TABLE 4.9 (Bending strength pb for LTB) ----------
function get_bending_strength(lambdaLT, py) {
    let pb = py;
    if(py === 275) {
        if(lambdaLT <= 30) pb = 275;
        else if(lambdaLT <= 40) pb = 275 - (275-238)/10*(lambdaLT-30);
        else if(lambdaLT <= 60) pb = 238 - (238-181)/20*(lambdaLT-40);
        else if(lambdaLT <= 80) pb = 181 - (181-132)/20*(lambdaLT-60);
        else if(lambdaLT <= 100) pb = 132 - (132-95)/20*(lambdaLT-80);
        else pb = 95 - (95-70)/20*(lambdaLT-100);
    } else if(py === 355) {
        if(lambdaLT <= 30) pb = 355;
        else if(lambdaLT <= 40) pb = 355 - (355-315)/10*(lambdaLT-30);
        else if(lambdaLT <= 60) pb = 315 - (315-240)/20*(lambdaLT-40);
        else if(lambdaLT <= 80) pb = 240 - (240-175)/20*(lambdaLT-60);
        else if(lambdaLT <= 100) pb = 175 - (175-125)/20*(lambdaLT-80);
        else pb = 125 - (125-95)/20*(lambdaLT-100);
    } else {
        if(lambdaLT <= 30) pb = py;
        else if(lambdaLT <= 40) pb = py - (py-350)/10*(lambdaLT-30);
        else if(lambdaLT <= 60) pb = 350 - (350-250)/20*(lambdaLT-40);
        else if(lambdaLT <= 80) pb = 250 - (250-180)/20*(lambdaLT-60);
        else if(lambdaLT <= 100) pb = 180 - (180-130)/20*(lambdaLT-80);
        else pb = 130 - (130-95)/20*(lambdaLT-100);
    }
    return Math.max(pb, 50);
}

// ---------- TABLE 4.10 (Equivalent Uniform Moment Factor mLT) ----------
function get_mLT(beta) {
    if(beta >= 1.0) return 1.00;
    if(beta >= 0.8) return 0.96 - (1-beta)/0.2*0.04;
    if(beta >= 0.6) return 0.92 - (0.8-beta)/0.2*0.04;
    if(beta >= 0.4) return 0.88 - (0.6-beta)/0.2*0.04;
    if(beta >= 0.2) return 0.84 - (0.4-beta)/0.2*0.04;
    if(beta >= 0.0) return 0.80 - (0.2-beta)/0.2*0.04;
    if(beta >= -0.2) return 0.76 - (0-beta)/0.2*0.04;
    if(beta >= -0.4) return 0.72 - (-0.2-beta)/0.2*0.04;
    if(beta >= -0.6) return 0.68 - (-0.4-beta)/0.2*0.04;
    if(beta >= -0.8) return 0.64 - (-0.6-beta)/0.2*0.04;
    if(beta >= -1.0) return 0.60 - (-0.8-beta)/0.2*0.04;
    return 0.60;
}

// ---------- TABLE 4.13 (Compressive strength pc for Columns) ----------
function get_pc(lambda, py){
    let pc = py;
    if(py === 275) {
        if(lambda <= 15) pc = 275;
        else if(lambda <= 30) pc = 275 - (275-245)/15*(lambda-15);
        else if(lambda <= 50) pc = 245 - (245-190)/20*(lambda-30);
        else if(lambda <= 70) pc = 190 - (190-140)/20*(lambda-50);
        else pc = 140 - (140-90)/20*(lambda-70);
    } else if(py === 355) {
        if(lambda <= 15) pc = 355;
        else if(lambda <= 30) pc = 355 - (355-315)/15*(lambda-15);
        else if(lambda <= 50) pc = 315 - (315-250)/20*(lambda-30);
        else if(lambda <= 70) pc = 250 - (250-180)/20*(lambda-50);
        else pc = 180 - (180-110)/20*(lambda-70);
    }
    return Math.max(pc, 50);
}

// ---------- TABLE 4.25 (Weld Design Strength pw) ----------
function get_weld_strength(py, electrode){
    let pw = 220;
    if(electrode === 42) pw = 220;
    if(electrode === 50) pw = 250;
    return Math.min(pw, py * 1.0);
}

// ---------- BOLT STRENGTHS (Tables 4.19, 4.20) ----------
function get_bolt_strengths(grade, d){
    let ps = grade === '8.8' ? 375 : 160;
    let pbs = 460;
    return {ps, pbs, As: Math.PI*d*d/4};
}

// ---------- APPENDIX B STEEL DATABASE ----------
const UBs = {
    "610x229x101": {D:602.6,B:227.6,t:10.5,T:14.8,Sx:2880,Zx:2510,ry:5.01,u:0.863,x:41.9},
    "406x178x60":  {D:406.6,B:177.9,t:7.9,T:12.8,Sx:1190,Zx:1060,ry:3.95,u:0.888,x:36.1},
    "356x171x51":  {D:355.6,B:171.5,t:7.4,T:11.5,Sx:995,Zx:895,ry:3.85,u:0.885,x:35.3},
    "305x165x40":  {D:303.8,B:165,t:6,T:10.2,Sx:723,Zx:655,ry:3.37,u:0.886,x:32.7}
};
const UCs = {
    "305x305x118": {A:15000,ry:7.75,Sx:1950},
    "203x203x52":  {A:6650,ry:5.16,Sx:568}
};
