(function (global) {
  'use strict';

  function rect(x) {
    var ax = Math.abs(x);
    if (ax < 0.5) return 1;
    if (Math.abs(ax - 0.5) < 1e-9) return 0.5;
    return 0;
  }

  function tri(x) {
    var ax = Math.abs(x);
    return ax < 1 ? 1 - ax : 0;
  }

  function sinc(x) {
    if (Math.abs(x) < 1e-8) return 1;
    var px = Math.PI * x;
    return Math.sin(px) / px;
  }

  function sawtooth(t, period) {
    var u = (((t + period * 0.5) % period) + period) % period - period * 0.5;
    return (2 * u) / period;
  }

  function piecewiseLinear(points, t, period) {
    var u = t;
    if (period && period > 0) {
      var start = points[0][0];
      u = (((t - start) % period) + period) % period + start;
    }
    if (u <= points[0][0]) return points[0][1];
    for (var i = 1; i < points.length; i++) {
      if (u <= points[i][0]) {
        var x0 = points[i - 1][0];
        var y0 = points[i - 1][1];
        var x1 = points[i][0];
        var y1 = points[i][1];
        if (Math.abs(x1 - x0) < 1e-12) return y1;
        return y0 + ((y1 - y0) * (u - x0)) / (x1 - x0);
      }
    }
    return points[points.length - 1][1];
  }

  function dampedCos(a, f, t) {
    if (t < 0) return 0;
    return Math.exp(-a * t) * Math.cos(2 * Math.PI * f * t);
  }

  // Real-valued reconstruction from complex Fourier coefficients D_n
  function fourierPartialSum(dnFn, N, omega0, t) {
    var d0 = dnFn(0);
    var sum = typeof d0 === 'number' ? d0 : (d0.re || 0);
    for (var n = 1; n <= N; n++) {
      var dn = dnFn(n);
      var re = typeof dn === 'number' ? dn : (dn.re || 0);
      var im = typeof dn === 'number' ? 0 : (dn.im || 0);
      var ang = n * omega0 * t;
      // 2 * Re(D_n * e^{jn w0 t})
      sum += 2 * (re * Math.cos(ang) - im * Math.sin(ang));
    }
    return sum;
  }

  // RC Diode Envelope Detector simulation (ideal diode + capacitor + load resistor)
  function rcEnvelopeTrace(signalArr, dt, RC) {
    var n = signalArr.length;
    var trace = new Float64Array(n);
    if (n === 0) return trace;
    var vc = Math.max(0, signalArr[0]);
    var decay = Math.exp(-dt / Math.max(1e-6, RC));
    trace[0] = vc;
    for (var i = 1; i < n; i++) {
      var vin = signalArr[i];
      if (vin >= vc) {
        vc = vin;
      } else {
        vc = vc * decay;
      }
      trace[i] = vc;
    }
    return trace;
  }

  // Exact Hilbert transform of sum A_k cos(2*pi*f_k*t + phi_k)
  function hilbertToneSum(harmonics, t, df, delta) {
    var fShift = df || 0;
    var pShift = delta || 0;
    var m = 0;
    var mh = 0;
    var lsbDemod = 0;
    for (var i = 0; i < harmonics.length; i++) {
      var h = harmonics[i];
      var a = h.amp;
      var ang = 2 * Math.PI * h.freq * t + (h.phase || 0);
      m += a * Math.cos(ang);
      mh += a * Math.sin(ang);
      lsbDemod += a * Math.cos(2 * Math.PI * (h.freq + fShift) * t + (h.phase || 0) + pShift);
    }
    return { m: m, mh: mh, lsbDemod: lsbDemod };
  }

  function integrateSignal(fn, tMin, tMax, steps) {
    var N = steps || 2000;
    var dt = (tMax - tMin) / N;
    var vals = new Float64Array(N + 1);
    vals[0] = 0;
    for (var i = 1; i <= N; i++) {
      var tm = tMin + (i - 0.5) * dt;
      vals[i] = vals[i - 1] + fn(tm) * dt;
    }
    return {
      tMin: tMin,
      tMax: tMax,
      dt: dt,
      steps: N,
      values: vals,
      at: function (t) {
        if (t <= tMin) return vals[0];
        if (t >= tMax) return vals[N];
        var f = (t - tMin) / dt;
        var idx = Math.floor(f);
        if (idx >= N) return vals[N];
        var frac = f - idx;
        return vals[idx] * (1 - frac) + vals[idx + 1] * frac;
      }
    };
  }

  // First-kind Bessel function J_n(beta) via Simpson integration of cos(beta sin theta - n theta) / pi
  function besselJ(n, beta) {
    var k = Math.abs(Math.round(n));
    var b = Math.abs(beta);
    if (b < 1e-9) return k === 0 ? 1 : 0;
    var M = Math.max(64, Math.ceil(b * 6 + k * 4) * 2);
    if (M % 2 === 1) M += 1;
    var h = Math.PI / M;
    var sum = Math.cos(b * Math.sin(0) - 0) + Math.cos(b * Math.sin(Math.PI) - k * Math.PI);
    for (var i = 1; i < M; i++) {
      var theta = i * h;
      var w = i % 2 === 0 ? 2 : 4;
      sum += w * Math.cos(b * Math.sin(theta) - k * theta);
    }
    var val = (sum * h) / (3 * Math.PI);
    if (n < 0 && (Math.abs(n) % 2 === 1)) val = -val;
    if (beta < 0 && (k % 2 === 1)) val = -val;
    return val;
  }

  function muLawCompress(xNorm, mu) {
    var m = mu === undefined ? 255 : mu;
    if (m <= 0) return xNorm;
    var clamped = Math.max(-1, Math.min(1, xNorm));
    var sign = clamped < 0 ? -1 : 1;
    return (sign * Math.log(1 + m * Math.abs(clamped))) / Math.log(1 + m);
  }

  function muLawExpand(yNorm, mu) {
    var m = mu === undefined ? 255 : mu;
    if (m <= 0) return yNorm;
    var clamped = Math.max(-1, Math.min(1, yNorm));
    var sign = clamped < 0 ? -1 : 1;
    return (sign * (Math.pow(1 + m, Math.abs(clamped)) - 1)) / m;
  }

  function uniformQuantize(x, L, mp) {
    var dv = (2 * mp) / L;
    var clamped = Math.max(-mp + 1e-9, Math.min(mp - 1e-9, x));
    var idx = Math.floor((clamped + mp) / dv);
    if (idx < 0) idx = 0;
    if (idx >= L) idx = L - 1;
    var q = -mp + (idx + 0.5) * dv;
    return { q: q, err: q - x, levelIndex: idx, deltaV: dv };
  }

  function quantizeWithCompanding(x, L, mp, mu) {
    if (!mu || mu <= 0) return uniformQuantize(x, L, mp);
    var y = muLawCompress(x / mp, mu);
    var uq = uniformQuantize(y, L, 1.0);
    var qx = mp * muLawExpand(uq.q, mu);
    return { q: qx, err: qx - x, levelIndex: uq.levelIndex };
  }

  function sqnrDb(xArr, errArr) {
    var px = 0;
    var pe = 0;
    for (var i = 0; i < xArr.length; i++) {
      px += xArr[i] * xArr[i];
      pe += errArr[i] * errArr[i];
    }
    if (pe <= 1e-18) return 99.9;
    return 10 * Math.log10(px / pe);
  }

  function uniformSqnrTheory(L, Pm, mp) {
    var ratio = (3 * L * L * Pm) / (mp * mp);
    return 10 * Math.log10(ratio);
  }

  function deltaModTrack(fn, tMin, tMax, Ts, E, initMq) {
    var out = [];
    var mq = initMq === undefined ? 0 : initMq;
    var nSteps = Math.floor((tMax - tMin) / Ts + 1e-9);
    for (var i = 0; i <= nSteps; i++) {
      var t = tMin + i * Ts;
      var m = fn(t);
      var diff = m - mq;
      var bit = diff >= 0 ? 1 : 0;
      var stepE = bit === 1 ? E : -E;
      var overload = Math.abs(diff) > E * 1.05;
      mq += stepE;
      out.push({ t: t, m: m, mq: mq, bit: bit, stepE: stepE, err: mq - m, overload: overload });
    }
    return out;
  }

  function butterworthMagSq(w, wc, order) {
    var r = Math.abs(w / wc);
    return 1 / (1 + Math.pow(r, 2 * order));
  }

  function chebyshevPoly(n, x) {
    if (n === 0) return 1;
    if (n === 1) return x;
    if (Math.abs(x) <= 1) return Math.cos(n * Math.acos(x));
    return Math.cosh(n * Math.acosh(Math.abs(x))) * (x < 0 && n % 2 === 1 ? -1 : 1);
  }

  function chebyshevMagSq(w, wc, order, eps) {
    var e = eps || 0.5;
    var tn = chebyshevPoly(order, Math.abs(w / wc));
    return 1 / (1 + e * e * tn * tn);
  }

  // Exact HW 2.7-2 Gram-Schmidt 4D orthonormal basis on [0, 1]
  function gramSchmidt4D() {
    var sqrt2 = Math.SQRT2;
    var c1 = 2 / Math.PI;
    var norm4 = Math.sqrt(0.5 - (4 / (Math.PI * Math.PI))); // ~0.3077
    return {
      phi: [
        function (t) { return (t >= 0 && t <= 1) ? sqrt2 * Math.sin(2 * Math.PI * t) : 0; },
        function (t) { return (t >= 0 && t <= 1) ? sqrt2 * Math.sin(4 * Math.PI * t) : 0; },
        function (t) { return (t >= 0 && t <= 1) ? 1 : 0; },
        function (t) {
          if (t < 0 || t > 1) return 0;
          var g4 = t < 0.5 ? 1 / sqrt2 : -1 / sqrt2;
          var rem = g4 - c1 * sqrt2 * Math.sin(2 * Math.PI * t);
          return rem / norm4;
        }
      ],
      coords: [
        { name: 'x(t)', vec: [1 / sqrt2, 0, 0, 0] },
        { name: 'g1(t)', vec: [0, 1 / sqrt2, 0, 0] },
        { name: 'g2(t)', vec: [-1 / sqrt2, 0, 0, 0] },
        { name: 'g3(t)', vec: [0, 0, 1 / sqrt2, 0] },
        { name: 'g4(t)', vec: [c1, 0, 0, norm4] }
      ],
      projCoeff: c1,
      remNorm: norm4
    };
  }

  global.COMM_MATH = {
    rect: rect,
    tri: tri,
    sinc: sinc,
    sawtooth: sawtooth,
    piecewiseLinear: piecewiseLinear,
    dampedCos: dampedCos,
    fourierPartialSum: fourierPartialSum,
    rcEnvelopeTrace: rcEnvelopeTrace,
    hilbertToneSum: hilbertToneSum,
    integrateSignal: integrateSignal,
    besselJ: besselJ,
    muLawCompress: muLawCompress,
    muLawExpand: muLawExpand,
    uniformQuantize: uniformQuantize,
    quantizeWithCompanding: quantizeWithCompanding,
    sqnrDb: sqnrDb,
    uniformSqnrTheory: uniformSqnrTheory,
    deltaModTrack: deltaModTrack,
    butterworthMagSq: butterworthMagSq,
    chebyshevMagSq: chebyshevMagSq,
    gramSchmidt4D: gramSchmidt4D
  };
})(window);
