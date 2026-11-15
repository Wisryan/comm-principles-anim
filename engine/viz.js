(function (global) {
  'use strict';

  var PALETTE = {
    bg: '#0b1020',
    panelBg: '#10172d',
    grid: '#1d2744',
    axis: '#64748b',
    text: '#e2e8f0',
    muted: '#94a3b8',
    cyan: '#38bdf8',
    amber: '#fbbf24',
    pink: '#f472b6',
    green: '#34d399',
    red: '#fb7185',
    purple: '#a78bfa'
  };

  function setupCanvas(canvas) {
    var rect = canvas.getBoundingClientRect();
    var cssW = Math.max(280, Math.round(rect.width));
    var cssH = Math.max(220, Math.round(rect.height));
    var dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    var targetW = Math.round(cssW * dpr);
    var targetH = Math.round(cssH * dpr);
    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }
    var ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = PALETTE.bg;
    ctx.fillRect(0, 0, cssW, cssH);

    var isPortrait = cssW < 560;
    var scale = isPortrait ? Math.max(0.95, Math.min(1.08, cssW / 370)) : Math.max(1.0, Math.min(1.22, cssW / 760));
    return {
      ctx: ctx,
      width: cssW,
      height: cssH,
      isPortrait: isPortrait,
      fontSm: Math.round(11 * scale),
      fontMd: Math.round(12.5 * scale),
      fontLg: Math.round(14.5 * scale),
      rect: { x: 8, y: 8, w: cssW - 16, h: cssH - 16 }
    };
  }

  function splitPanels(rect, count, isPortrait, gap) {
    var g = gap === undefined ? 8 : gap;
    var res = [];
    if (count <= 1) return [rect];
    if (isPortrait) {
      var eachH = (rect.h - g * (count - 1)) / count;
      for (var i = 0; i < count; i++) {
        res.push({ x: rect.x, y: rect.y + i * (eachH + g), w: rect.w, h: eachH });
      }
      return res;
    }
    if (count === 2) {
      var eachW = (rect.w - g) / 2;
      return [
        { x: rect.x, y: rect.y, w: eachW, h: rect.h },
        { x: rect.x + eachW + g, y: rect.y, w: eachW, h: rect.h }
      ];
    }
    if (count === 3) {
      var w3 = (rect.w - g) / 2;
      var h3 = (rect.h - g) / 2;
      return [
        { x: rect.x, y: rect.y, w: w3, h: h3 },
        { x: rect.x + w3 + g, y: rect.y, w: w3, h: h3 },
        { x: rect.x, y: rect.y + h3 + g, w: rect.w, h: h3 }
      ];
    }
    var cols = Math.ceil(Math.sqrt(count));
    var rows = Math.ceil(count / cols);
    var cw = (rect.w - g * (cols - 1)) / cols;
    var ch = (rect.h - g * (rows - 1)) / rows;
    for (var idx = 0; idx < count; idx++) {
      var r = Math.floor(idx / cols);
      var c = idx % cols;
      res.push({ x: rect.x + c * (cw + g), y: rect.y + r * (ch + g), w: cw, h: ch });
    }
    return res;
  }

  function roundRect(ctx, x, y, w, h, r) {
    var rr = Math.min(r || 8, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  function drawBadge(ctx, x, y, text, color, alignRight) {
    ctx.save();
    ctx.font = '600 11px -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif';
    var padX = 7;
    var w = ctx.measureText(text).width + padX * 2;
    var h = 20;
    var bx = alignRight ? x - w : x;
    roundRect(ctx, bx, y, w, h, 6);
    ctx.fillStyle = 'rgba(11, 16, 32, 0.85)';
    ctx.fill();
    ctx.strokeStyle = color || PALETTE.cyan;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = color || PALETTE.text;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, bx + padX, y + h / 2 + 0.5);
    ctx.restore();
  }

  function drawAxes(ctx, box, opts) {
    var o = opts || {};
    var xMin = o.xMin !== undefined ? o.xMin : -1;
    var xMax = o.xMax !== undefined ? o.xMax : 1;
    var yMin = o.yMin !== undefined ? o.yMin : -1.2;
    var yMax = o.yMax !== undefined ? o.yMax : 1.2;

    var padL = o.padL !== undefined ? o.padL : 34;
    var padR = o.padR !== undefined ? o.padR : 10;
    var padT = o.padT !== undefined ? o.padT : (o.title ? 24 : 10);
    var padB = o.padB !== undefined ? o.padB : 20;

    ctx.save();
    roundRect(ctx, box.x, box.y, box.w, box.h, 10);
    ctx.fillStyle = PALETTE.panelBg;
    ctx.fill();
    ctx.strokeStyle = '#1e2948';
    ctx.lineWidth = 1;
    ctx.stroke();

    var px = box.x + padL;
    var py = box.y + padT;
    var pw = Math.max(20, box.w - padL - padR);
    var ph = Math.max(20, box.h - padT - padB);

    function toX(x) {
      return px + ((x - xMin) / (xMax - xMin)) * pw;
    }
    function toY(y) {
      return py + ph - ((y - yMin) / (yMax - yMin)) * ph;
    }

    // Subtle background grid
    ctx.strokeStyle = PALETTE.grid;
    ctx.lineWidth = 0.8;
    var nxGrid = o.xGrid || 4;
    var nyGrid = o.yGrid || 4;
    ctx.beginPath();
    for (var gx = 0; gx <= nxGrid; gx++) {
      var xx = px + (gx / nxGrid) * pw;
      ctx.moveTo(xx, py);
      ctx.lineTo(xx, py + ph);
    }
    for (var gy = 0; gy <= nyGrid; gy++) {
      var yy = py + (gy / nyGrid) * ph;
      ctx.moveTo(px, yy);
      ctx.lineTo(px + pw, yy);
    }
    ctx.stroke();

    // Zero crosshairs
    ctx.strokeStyle = PALETTE.axis;
    ctx.lineWidth = 1.1;
    if (yMin <= 0 && yMax >= 0) {
      var y0 = toY(0);
      ctx.beginPath();
      ctx.moveTo(px, y0);
      ctx.lineTo(px + pw, y0);
      ctx.stroke();
    }
    if (xMin <= 0 && xMax >= 0) {
      var x0 = toX(0);
      ctx.beginPath();
      ctx.moveTo(x0, py);
      ctx.lineTo(x0, py + ph);
      ctx.stroke();
    }

    // Ticks
    ctx.font = '10.5px ui-monospace, SFMono-Regular, Consolas, sans-serif';
    ctx.fillStyle = PALETTE.muted;
    if (o.xTicks) {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      for (var i = 0; i < o.xTicks.length; i++) {
        var tk = o.xTicks[i];
        var val = Array.isArray(tk) ? tk[0] : tk;
        var lbl = Array.isArray(tk) ? tk[1] : String(tk);
        var tx = toX(val);
        if (tx >= px - 4 && tx <= px + pw + 4) {
          ctx.fillText(lbl, tx, py + ph + 4);
        }
      }
    }
    if (o.yTicks) {
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      for (var j = 0; j < o.yTicks.length; j++) {
        var yk = o.yTicks[j];
        var yv = Array.isArray(yk) ? yk[0] : yk;
        var yl = Array.isArray(yk) ? yk[1] : String(yk);
        var ty = toY(yv);
        if (ty >= py - 4 && ty <= py + ph + 4) {
          ctx.fillText(yl, px - 4, ty);
        }
      }
    }

    if (o.xLabel) {
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.fillStyle = PALETTE.muted;
      ctx.fillText(o.xLabel, px + pw, py + ph - 2);
    }

    if (o.title) {
      drawBadge(ctx, box.x + 8, box.y + 4, o.title, o.titleColor || PALETTE.cyan, false);
    }
    if (o.subtitle) {
      drawBadge(ctx, box.x + box.w - 8, box.y + 4, o.subtitle, o.subtitleColor || PALETTE.amber, true);
    }
    ctx.restore();

    return {
      box: box,
      px: px,
      py: py,
      pw: pw,
      ph: ph,
      xMin: xMin,
      xMax: xMax,
      yMin: yMin,
      yMax: yMax,
      toX: toX,
      toY: toY
    };
  }

  function drawShadedBand(ctx, ax, x0, x1, color, label) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(ax.px, ax.py, ax.pw, ax.ph);
    ctx.clip();
    var sx0 = Math.max(ax.px, ax.toX(x0));
    var sx1 = Math.min(ax.px + ax.pw, ax.toX(x1));
    if (sx1 > sx0) {
      ctx.fillStyle = color || 'rgba(52, 211, 153, 0.14)';
      ctx.fillRect(sx0, ax.py, sx1 - sx0, ax.ph);
      if (label) {
        ctx.font = '600 10.5px sans-serif';
        ctx.fillStyle = PALETTE.text;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(label, (sx0 + sx1) / 2, ax.py + 4);
      }
    }
    ctx.restore();
  }

  function drawCurve(ctx, ax, fnOrArr, opts) {
    var o = opts || {};
    var samples = o.samples || 360;
    var reveal = o.reveal !== undefined ? Math.max(0.01, Math.min(1, o.reveal)) : 1;
    var xStart = o.from !== undefined ? o.from : ax.xMin;
    var xEndFull = o.to !== undefined ? o.to : ax.xMax;
    var xEnd = xStart + (xEndFull - xStart) * reveal;

    ctx.save();
    ctx.beginPath();
    ctx.rect(ax.px - 1, ax.py - 1, ax.pw + 2, ax.ph + 2);
    ctx.clip();

    if (o.dash) ctx.setLineDash(Array.isArray(o.dash) ? o.dash : [5, 4]);
    ctx.strokeStyle = o.color || PALETTE.cyan;
    ctx.lineWidth = o.lineWidth || 2.1;

    var pts = [];
    if (typeof fnOrArr === 'function') {
      var nPts = Math.max(24, Math.round(samples * reveal));
      for (var i = 0; i <= nPts; i++) {
        var x = xStart + ((xEnd - xStart) * i) / nPts;
        var y = fnOrArr(x);
        if (!Number.isFinite(y)) continue;
        pts.push([ax.toX(x), ax.toY(y), y]);
      }
    } else if (Array.isArray(fnOrArr) || ArrayBuffer.isView(fnOrArr)) {
      var arr = fnOrArr;
      var maxIdx = Math.max(1, Math.floor((arr.length - 1) * reveal));
      for (var k = 0; k <= maxIdx; k++) {
        var item = arr[k];
        if (Array.isArray(item)) {
          pts.push([ax.toX(item[0]), ax.toY(item[1]), item[1]]);
        } else {
          var xv = xStart + ((xEndFull - xStart) * k) / Math.max(1, arr.length - 1);
          pts.push([ax.toX(xv), ax.toY(item), item]);
        }
      }
    }

    if (pts.length > 0) {
      if (o.fillAlpha) {
        ctx.beginPath();
        var baseY = ax.toY(Math.max(ax.yMin, Math.min(ax.yMax, 0)));
        ctx.moveTo(pts[0][0], baseY);
        for (var f = 0; f < pts.length; f++) ctx.lineTo(pts[f][0], pts[f][1]);
        ctx.lineTo(pts[pts.length - 1][0], baseY);
        ctx.closePath();
        ctx.fillStyle = o.fillColor || o.color || PALETTE.cyan;
        ctx.globalAlpha = o.fillAlpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      ctx.beginPath();
      for (var p = 0; p < pts.length; p++) {
        if (p === 0) ctx.moveTo(pts[p][0], pts[p][1]);
        else ctx.lineTo(pts[p][0], pts[p][1]);
      }
      ctx.stroke();

      if (o.cursor && pts.length > 1) {
        var last = pts[pts.length - 1];
        ctx.setLineDash([]);
        ctx.fillStyle = o.color || PALETTE.cyan;
        ctx.beginPath();
        ctx.arc(last[0], last[1], 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.beginPath();
        ctx.arc(last[0], last[1], 7.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  function drawStepCurve(ctx, ax, stepPts, opts) {
    if (!stepPts || stepPts.length < 2) return;
    var o = opts || {};
    ctx.save();
    ctx.beginPath();
    ctx.rect(ax.px - 1, ax.py - 1, ax.pw + 2, ax.ph + 2);
    ctx.clip();
    ctx.strokeStyle = o.color || PALETTE.amber;
    ctx.lineWidth = o.lineWidth || 2;
    ctx.beginPath();
    for (var i = 0; i < stepPts.length; i++) {
      var sx = ax.toX(stepPts[i][0]);
      var sy = ax.toY(stepPts[i][1]);
      if (i === 0) {
        ctx.moveTo(sx, sy);
      } else {
        var prevY = ax.toY(stepPts[i - 1][1]);
        ctx.lineTo(sx, prevY);
        ctx.lineTo(sx, sy);
      }
    }
    ctx.stroke();
    ctx.restore();
  }

  function drawStems(ctx, ax, stems, opts) {
    var o = opts || {};
    ctx.save();
    ctx.beginPath();
    ctx.rect(ax.px - 2, ax.py - 2, ax.pw + 4, ax.ph + 4);
    ctx.clip();
    var y0 = ax.toY(0);
    for (var i = 0; i < stems.length; i++) {
      var st = stems[i];
      var x = Array.isArray(st) ? st[0] : st.x;
      var y = Array.isArray(st) ? st[1] : st.y;
      var col = (st && st.color) || o.color || PALETTE.amber;
      var sx = ax.toX(x);
      var sy = ax.toY(y);
      ctx.strokeStyle = col;
      ctx.lineWidth = (st && st.width) || o.lineWidth || 2.1;
      ctx.beginPath();
      ctx.moveTo(sx, y0);
      ctx.lineTo(sx, sy);
      ctx.stroke();

      if ((st && st.arrow) || o.arrow) {
        var dir = y >= 0 ? 1 : -1;
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx - 4, sy + dir * 7);
        ctx.lineTo(sx + 4, sy + dir * 7);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.arc(sx, sy, 3.2, 0, Math.PI * 2);
        ctx.fill();
      }

      if (st && st.label) {
        ctx.font = '600 10.5px sans-serif';
        ctx.fillStyle = col;
        ctx.textAlign = 'center';
        ctx.textBaseline = y >= 0 ? 'bottom' : 'top';
        ctx.fillText(st.label, sx, sy + (y >= 0 ? -3 : 3));
      }
    }
    ctx.restore();
  }

  function drawBlockDiagram(ctx, box, nodes, edges, opts) {
    var o = opts || {};
    var time = o.time || 0;
    ctx.save();
    roundRect(ctx, box.x, box.y, box.w, box.h, 10);
    ctx.fillStyle = PALETTE.panelBg;
    ctx.fill();
    ctx.strokeStyle = '#1e2948';
    ctx.lineWidth = 1;
    ctx.stroke();

    if (o.title) {
      drawBadge(ctx, box.x + 8, box.y + 5, o.title, o.titleColor || PALETTE.cyan, false);
    }

    var padX = 14;
    var padT = o.title ? 30 : 12;
    var padB = 12;
    var iw = Math.max(40, box.w - padX * 2);
    var ih = Math.max(40, box.h - padT - padB);

    var posMap = {};
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      posMap[n.id] = {
        cx: box.x + padX + n.nx * iw,
        cy: box.y + padT + n.ny * ih,
        bw: (n.nw || 0.16) * iw,
        bh: (n.nh || 0.24) * ih,
        node: n
      };
    }

    // Draw edges + moving signal pulses first, collect labels to draw cleanly on top
    var deferredLabels = [];
    for (var e = 0; e < edges.length; e++) {
      var ed = edges[e];
      var a = posMap[ed.from];
      var b = posMap[ed.to];
      if (!a || !b) continue;

      var x1 = a.cx;
      var y1 = a.cy;
      var x2 = b.cx;
      var y2 = b.cy;
      var col = ed.color || PALETTE.cyan;

      ctx.strokeStyle = ed.dashed ? 'rgba(148,163,184,0.65)' : col;
      ctx.lineWidth = ed.width || 1.8;
      if (ed.dashed) ctx.setLineDash([4, 3]);
      else ctx.setLineDash([]);

      ctx.beginPath();
      if (ed.midY !== undefined) {
        var my = box.y + padT + ed.midY * ih;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1, my);
        ctx.lineTo(x2, my);
        ctx.lineTo(x2, y2);
      } else {
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Moving pulse dot if straight line and active
      if (!ed.midY && ed.pulse !== false) {
        var phase = ((time * (ed.speed || 0.65) + e * 0.23) % 1 + 1) % 1;
        var px = x1 + (x2 - x1) * phase;
        var py = y1 + (y2 - y1) * phase;
        ctx.fillStyle = PALETTE.amber;
        ctx.beginPath();
        ctx.arc(px, py, 3.2, 0, Math.PI * 2);
        ctx.fill();
      }

      if (ed.label) {
        var lx = (x1 + x2) / 2;
        var tightHoriz = ed.midY === undefined && Math.abs(x2 - x1) < 115 && Math.abs(y2 - y1) < 16;
        var ly;
        var baseline = 'bottom';
        if (tightHoriz) {
          var halfH = Math.max(28, a.bh, b.bh) / 2;
          if (e % 2 === 0) {
            ly = (y1 + y2) / 2 - halfH - 5;
            baseline = 'bottom';
          } else {
            ly = (y1 + y2) / 2 + halfH + 5;
            baseline = 'top';
          }
        } else {
          ly = ed.midY !== undefined ? (box.y + padT + ed.midY * ih - 7) : ((y1 + y2) / 2 - 8);
        }
        deferredLabels.push({
          text: ed.label,
          x: lx,
          y: ly,
          baseline: baseline,
          color: ed.labelColor || PALETTE.text
        });
      }
    }

    // Draw nodes on top of edges
    for (var j = 0; j < nodes.length; j++) {
      var nd = nodes[j];
      var pm = posMap[nd.id];
      var active = nd.active || (o.activeId && o.activeId === nd.id);
      var strokeCol = nd.color || (active ? PALETTE.amber : PALETTE.cyan);
      var fillCol = active ? 'rgba(251, 191, 36, 0.16)' : '#16203d';

      if (nd.kind === 'mul' || nd.kind === 'sum') {
        var rad = Math.min(18, Math.max(12, Math.min(pm.bw, pm.bh) * 0.45));
        ctx.fillStyle = fillCol;
        ctx.strokeStyle = strokeCol;
        ctx.lineWidth = active ? 2.4 : 1.6;
        ctx.beginPath();
        ctx.arc(pm.cx, pm.cy, rad, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#fff';
        ctx.font = '700 13px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(nd.label || (nd.kind === 'mul' ? '×' : '+'), pm.cx, pm.cy + 0.5);
      } else if (nd.kind === 'text') {
        ctx.fillStyle = strokeCol;
        ctx.font = '700 11.5px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(nd.label, pm.cx, pm.cy);
      } else {
        var bw = Math.max(46, pm.bw);
        var bh = Math.max(28, pm.bh);
        roundRect(ctx, pm.cx - bw / 2, pm.cy - bh / 2, bw, bh, 7);
        ctx.fillStyle = fillCol;
        ctx.fill();
        ctx.strokeStyle = strokeCol;
        ctx.lineWidth = active ? 2.4 : 1.6;
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        var lines = String(nd.label || '').split('\n');
        ctx.font = '600 ' + (lines.length > 1 ? '10.5px' : '11.5px') + ' sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        for (var ln = 0; ln < lines.length; ln++) {
          var dy = (ln - (lines.length - 1) / 2) * 13;
          ctx.fillText(lines[ln], pm.cx, pm.cy + dy);
        }
      }
    }

    // Draw edge labels cleanly above everything
    ctx.font = '600 10.5px sans-serif';
    ctx.textAlign = 'center';
    for (var dl = 0; dl < deferredLabels.length; dl++) {
      var item = deferredLabels[dl];
      ctx.fillStyle = item.color;
      ctx.textBaseline = item.baseline;
      ctx.fillText(item.text, item.x, item.y);
    }
    ctx.restore();
  }

  function drawPhasorWheel(ctx, box, opts) {
    var o = opts || {};
    ctx.save();
    roundRect(ctx, box.x, box.y, box.w, box.h, 10);
    ctx.fillStyle = PALETTE.panelBg;
    ctx.fill();
    ctx.strokeStyle = '#1e2948';
    ctx.lineWidth = 1;
    ctx.stroke();

    if (o.title) drawBadge(ctx, box.x + 8, box.y + 4, o.title, o.titleColor || PALETTE.cyan, false);
    if (o.subtitle) drawBadge(ctx, box.x + box.w - 8, box.y + 4, o.subtitle, o.subtitleColor || PALETTE.amber, true);

    var cx = box.x + box.w / 2;
    var cy = box.y + box.h / 2 + 8;
    var r = Math.max(28, Math.min(box.w, box.h - 32) * 0.36);

    if (o.mode === 'wheel') {
      // Rotating wheel with continuous shadow spoke vs sampled strobe spoke
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();

      // Ghost real spoke
      var ta = o.trueAngle || 0;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.setLineDash([4, 3]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + r * Math.cos(ta), cy + r * Math.sin(ta));
      ctx.stroke();
      ctx.setLineDash([]);

      // Cross reference spokes
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.16)';
      ctx.lineWidth = 1;
      for (var sp = 1; sp <= 3; sp++) {
        var sa = ta + (sp * Math.PI) / 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + r * Math.cos(sa), cy + r * Math.sin(sa));
        ctx.stroke();
      }

      // Strobe sampled spoke (thick bright amber/red)
      var samp = o.sampledAngle !== undefined ? o.sampledAngle : ta;
      var col = o.color || PALETTE.amber;
      ctx.strokeStyle = col;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + (r - 2) * Math.cos(samp), cy + (r - 2) * Math.sin(samp));
      ctx.stroke();

      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(cx + (r - 6) * Math.cos(samp), cy + (r - 6) * Math.sin(samp), 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fill();

      if (o.flashAlpha > 0.05) {
        ctx.strokeStyle = 'rgba(255, 255, 255, ' + Math.min(0.9, o.flashAlpha) + ')';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cx, cy, r + 5, 0, Math.PI * 2);
        ctx.stroke();
      }

      if (o.bottomText) {
        ctx.font = '600 11.5px sans-serif';
        ctx.fillStyle = o.bottomColor || PALETTE.text;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(o.bottomText, cx, box.y + box.h - 5);
      }
      ctx.restore();
      return;
    }

    // Standard phasor mode
    ctx.strokeStyle = PALETTE.grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - r * 1.15, cy);
    ctx.lineTo(cx + r * 1.15, cy);
    ctx.moveTo(cx, cy - r * 1.15);
    ctx.lineTo(cx, cy + r * 1.15);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    var vecs = o.vectors || [];
    for (var v = 0; v < vecs.length; v++) {
      var vc = vecs[v];
      var vx = (vc.originX || 0) * r;
      var vy = -(vc.originY || 0) * r;
      var ex = vx + vc.mag * r * Math.cos(-vc.angle);
      var ey = vy + vc.mag * r * Math.sin(-vc.angle);
      var vcol = vc.color || PALETTE.cyan;
      ctx.strokeStyle = vcol;
      ctx.lineWidth = vc.width || 2.5;
      ctx.beginPath();
      ctx.moveTo(cx + vx, cy + vy);
      ctx.lineTo(cx + ex, cy + ey);
      ctx.stroke();

      ctx.fillStyle = vcol;
      ctx.beginPath();
      ctx.arc(cx + ex, cy + ey, 3.8, 0, Math.PI * 2);
      ctx.fill();

      if (vc.label) {
        ctx.font = '600 11px sans-serif';
        ctx.fillText(vc.label, cx + ex + 6, cy + ey - 4);
      }
    }
    ctx.restore();
  }

  function drawAnnotation(ctx, ax, x, y, text, color, align) {
    ctx.save();
    ctx.font = '600 11px sans-serif';
    ctx.fillStyle = color || PALETTE.amber;
    ctx.textAlign = align || 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(text, ax.toX(x), ax.toY(y) - 4);
    ctx.restore();
  }

  global.COMM_VIZ = {
    PALETTE: PALETTE,
    setupCanvas: setupCanvas,
    splitPanels: splitPanels,
    roundRect: roundRect,
    drawBadge: drawBadge,
    drawAxes: drawAxes,
    drawShadedBand: drawShadedBand,
    drawCurve: drawCurve,
    drawStepCurve: drawStepCurve,
    drawStems: drawStems,
    drawBlockDiagram: drawBlockDiagram,
    drawPhasorWheel: drawPhasorWheel,
    drawAnnotation: drawAnnotation
  };
})(window);
