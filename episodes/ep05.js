(function (global) {
  'use strict';

  var P = global.COMM_VIZ.PALETTE;

  function dome(center, bw, height) {
    return function (f) {
      var u = Math.abs(f - center) / bw;
      if (u >= 1) return 0;
      return height * 0.5 * (1 + Math.cos(Math.PI * u));
    };
  }

  global.COMM_EPISODES.push({
    id: 'ep05',
    chapter: 'Ch.03 幅度调制（上）',
    title: '载波调制直觉、DSB-SC 与三大乘法器硬件实现',
    slideDeck: '03AM 课件讲义',
    slideRange: 'pp. 1–12',
    homeworkTags: ['HW1 · 4.2-3', 'HW1 · 4.2-4', 'HW1 · 4.2-8'],
    scenes: [
      {
        id: 's00',
        tag: '直觉',
        title: '为什么要把低频信号“搬家”到高频？天线尺寸与频分复用',
        slideRef: '03AM pp.1–3',
        terms: [
          { en: 'Carrier Modulation', zh: '载波调制' },
          { en: 'Baseband vs Passband', zh: '基带与通带' },
          { en: 'FDM (Frequency Division Multiplexing)', zh: '频分复用' }
        ],
        symbols: [
          { sym: '\\lambda = c / f', desc: '电磁波波长（光速 $c = 3\\times 10^8\\text{ m/s}$）', color: P.cyan },
          { sym: 'L \\approx \\lambda / 2', desc: '半波偶极子高效辐射所需天线长度', color: P.amber },
          { sym: 'f_{c1}, f_{c2}, f_{c3}', desc: '不同电台错开的载波中心频率（互不撞频）', color: P.green }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: 'f = 3\\text{ kHz} \\implies \\lambda = 100\\text{ km} \\implies \\text{半波天线 } 50\\text{ km} \\;(\\text{绝对造不出!})', label: '低频基带直接辐射天线的物理灾难' },
          { step: 1, latex: 'f_c = 100\\text{ MHz} \\implies \\lambda = 3\\text{ m} \\implies \\text{半波天线 } 1.5\\text{ m}\\;(\\text{四分之一波长仅 }0.75\\text{ m})', label: '搬移到高频载波后，天线立即缩小到手里可拿' },
          { step: 2, latex: 'P_{\\text{rad}} \\propto \\sin^2\\!\\left(\\frac{\\pi d}{\\lambda}\\right) \\quad\\big|\\quad \\text{不同 } f_{c,k} \\text{ 划分独立频道 (FDM)}', label: '高频带来辐射效率与多电台共存双赢' }
        ],
        sliders: [
          { key: 'logF', label: '发射频率档位 (3kHz → 100MHz)', min: 0, max: 3, step: 1, default: 0 }
        ],
        presets: [
          { label: '基带直发 (3 kHz)', values: { logF: 0 } },
          { label: '中波 AM (1 MHz)', values: { logF: 1 } },
          { label: '短波电台 (10 MHz)', values: { logF: 2 } },
          { label: '调频 FM (100 MHz)', values: { logF: 3 } }
        ],
        lines: [
          {
            step: 0,
            sub: '人耳能听见的声音只有几千赫兹，为什么不直接通过天线发射，非要费劲乘上一个高频余弦“搬家”呢？',
            tts: '人耳能听见的声音只有几千赫兹，为什么不直接接上天线发射，非要费劲乘上一个高频余弦把频谱搬家呢？'
          },
          {
            step: 0,
            sub: '第一大死穴是天线尺寸！高效发射电磁波要求天线长度与波长可比，例如半波天线取 $\\lambda/2$。$3\\text{ kHz}$ 语音波长高达 $100\\text{ km}$，半波天线要 $50\\text{ km}$，手机根本塞不下，而且 $1\\text{ m}$ 短天线辐射效率低到几乎归零！',
            tts: '第一个物理原因就是天线尺寸。想要高效把能量辐射出去，天线长度必须和波长相当，典型半波天线取二分之一波长。三千赫兹语音的波长高达一百公里，半波天线就得五十公里长，根本造不出来；用一米短天线辐射功率几乎降到零。'
          },
          {
            step: 1,
            sub: '把频率档位向右拖到 $100\\text{ MHz}$ 看看：波长骤降到 $3\\text{ m}$，半波天线只需 $1.5\\text{ m}$，常用的四分之一波长单极天线更只要 $0.75\\text{ m}$！',
            tts: '把滑块拖到一百兆赫兹看看：波长立刻缩短到三米，半波天线只需要一点五米，手机和车载常用的四分之一波长天线甚至只有七十五厘米。'
          },
          {
            step: 2,
            sub: '第二大原因是频分复用 FDM！如果所有电台都发在 $0\\sim 4\\text{ kHz}$ 基带，大家的波形会在空气里糊成一团；调制到不同载频 $f_{c1}, f_{c2}, f_{c3}$ 后，接收机用带通滤波器就能各挑各的台，互不干扰！',
            tts: '第二个核心原因是频分复用。如果所有电台都直接发在基带零赫兹附近，空气里就会全部混叠成一锅粥。把各路声音分别搬移到不同的高频载波上，收音机拧动旋钮换一个带通滤波器，就能互不打架地挑出想听的电台。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var tiers = [
            { name: '3 kHz (基带)', lam: '100 km', half: '50 km', barFrac: 0.96, eff: '~0.000001%', col: P.red },
            { name: '1 MHz (中波AM)', lam: '300 m', half: '150 m', barFrac: 0.56, eff: '中型铁塔', col: P.amber },
            { name: '10 MHz (短波)', lam: '30 m', half: '15 m', barFrac: 0.28, eff: '阳台拉杆', col: P.pink },
            { name: '100 MHz (FM)', lam: '3 m', half: '1.5 m', barFrac: 0.08, eff: '手持便携!', col: P.green }
          ];
          var idx = Math.max(0, Math.min(3, Math.round(env.params.logF || 0)));
          var cur = tiers[idx];

          // Panel 1: Antenna size comparison bars
          var b0 = boxes[0];
          var narrow = b0.w < 460;
          env.viz.roundRect(ctx, b0.x, b0.y, b0.w, b0.h, 10);
          ctx.fillStyle = P.panelBg;
          ctx.fill();
          ctx.strokeStyle = '#1e2948';
          ctx.stroke();
          env.viz.drawBadge(ctx, b0.x + 8, b0.y + 5, narrow ? '半波天线尺度 (λ/2)' : '载波频率越高，所需半波天线 L = λ/2 越短', P.cyan, false);
          if (!narrow) {
            env.viz.drawBadge(ctx, b0.x + b0.w - 8, b0.y + 5, '当前: ' + cur.name, cur.col, true);
          }

          var rowH = (b0.h - 42) / tiers.length;
          var labelW = narrow ? 92 : 114;
          var barMaxW = Math.max(40, b0.w - labelW - 76);
          for (var i = 0; i < tiers.length; i++) {
            var tr = tiers[i];
            var ry = b0.y + 32 + i * rowH;
            var isSel = i === idx;
            if (isSel) {
              env.viz.roundRect(ctx, b0.x + 8, ry - 2, b0.w - 16, rowH - 2, 6);
              ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
              ctx.fill();
            }
            ctx.font = (isSel ? '700 ' : '500 ') + '11px sans-serif';
            ctx.fillStyle = isSel ? tr.col : P.muted;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(tr.name, b0.x + 14, ry + rowH * 0.44);

            var bx = b0.x + labelW;
            var bw = Math.max(10, tr.barFrac * barMaxW);
            ctx.fillStyle = isSel ? tr.col : 'rgba(148, 163, 184, 0.35)';
            env.viz.roundRect(ctx, bx, ry + rowH * 0.22, bw, rowH * 0.44, 4);
            ctx.fill();

            ctx.font = '700 11px ui-monospace, monospace';
            ctx.fillStyle = isSel ? '#fff' : P.muted;
            ctx.fillText(tr.half, bx + bw + 6, ry + rowH * 0.44);
          }

          // Panel 2: Baseband collision vs FDM separated channels
          var ax = env.viz.drawAxes(ctx, boxes[1], {
            xMin: -0.5,
            xMax: 10.5,
            yMin: 0,
            yMax: 1.35,
            xGrid: 5,
            yGrid: 3,
            xTicks: [[0.5, '基带混叠'], [3.5, 'fc1'], [6.0, 'fc2'], [8.5, 'fc3']],
            yTicks: [[1.0, '幅度']],
            title: boxes[1].w < 460 ? 'FDM 频分复用避撞' : '频域对比：基带多台撞车 vs FDM 各居其位',
            subtitle: env.step >= 2 ? 'BPF选台互不干扰' : undefined,
            subtitleColor: P.green
          });

          // Colliding baseband region around 0.5
          env.viz.drawShadedBand(ctx, ax, -0.2, 1.3, 'rgba(251, 113, 133, 0.16)', narrow ? '混叠!' : '不调制=混在一起');
          env.viz.drawCurve(ctx, ax, dome(0.55, 0.75, 0.95), { from: -0.3, to: 1.4, color: P.red, lineWidth: 1.8, dash: [4, 3] });
          env.viz.drawCurve(ctx, ax, dome(0.55, 0.65, 0.75), { from: -0.3, to: 1.4, color: P.amber, lineWidth: 1.6, dash: [2, 2] });

          // Clean FDM channels
          var fdmChs = [
            { fc: 3.5, col: P.cyan, lbl: '台1' },
            { fc: 6.0, col: P.amber, lbl: '台2' },
            { fc: 8.5, col: P.green, lbl: '台3' }
          ];
          var focusCh = idx === 0 ? -1 : idx - 1;
          for (var c = 0; c < fdmChs.length; c++) {
            var ch = fdmChs[c];
            if (c === focusCh) {
              env.viz.drawShadedBand(ctx, ax, ch.fc - 0.9, ch.fc + 0.9, 'rgba(52, 211, 153, 0.16)', 'BPF选台');
            }
            env.viz.drawCurve(ctx, ax, dome(ch.fc, 0.8, 1.0), {
              from: ch.fc - 0.95,
              to: ch.fc + 0.95,
              color: ch.col,
              lineWidth: c === focusCh ? 2.8 : 2.0,
              fillAlpha: c === focusCh ? 0.24 : 0.10
            });
            env.viz.drawAnnotation(ctx, ax, ch.fc, 1.03, ch.lbl, ch.col, 'center');
          }
        }
      },
      {
        id: 's01',
        tag: '推导',
        title: 'DSB-SC 抑制载波双边带调幅、过零反相与相干解调',
        slideRef: '03AM pp.4–6',
        terms: [
          { en: 'DSB-SC', zh: '抑制载波双边带调幅' },
          { en: 'Coherent / Synchronous Demodulation', zh: '相干 / 同步解调' },
          { en: 'Phase Reversal', zh: '过零 180° 相位反转' }
        ],
        symbols: [
          { sym: 's(t) = m(t)\\cos\\omega_c t', desc: 'DSB-SC 已调信号（线性、时变系统）', color: P.amber },
          { sym: 'S(\\omega) = \\tfrac{1}{2}[M(\\omega-\\omega_c)+M(\\omega+\\omega_c)]', desc: '双边带搬移，总带宽 $2B$', color: P.cyan },
          { sym: '|m(t)|', desc: '若误用包络检波得到的全波整流失真波形', color: P.red }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: 's(t) = m(t)\\cos\\omega_c t \\;\\Longleftrightarrow\\; S(\\omega) = \\frac{1}{2}\\big[M(\\omega-\\omega_c) + M(\\omega+\\omega_c)\\big],\\quad B_T = 2B', label: '调制：频谱搬移到 ±ωc，载波冲激被完全抑制（线性、时变）' },
          { step: 1, latex: 'm(t) < 0 \\implies s(t) = -|m(t)|\\cos\\omega_c t = |m(t)|\\cos(\\omega_c t + \\pi)', label: '关键特征：m(t) 过零变负瞬间，载波发生 180° 相位反转' },
          { step: 2, latex: 's(t)\\cdot 2\\cos\\omega_c t = m(t)\\cdot 2\\cos^2\\omega_c t = m(t) + m(t)\\cos 2\\omega_c t \\xrightarrow{\\text{LPF}} m(t)', label: '相干解调：用同频同相本地载波乘回，再低通滤除 2fc 副本' }
        ],
        sliders: [
          { key: 'fc', label: '载波与基带频率比 f_c / f_m', min: 6, max: 20, step: 2, default: 12 },
          { key: 'demodErr', label: '本地解调相位差 δ (°)', min: 0, max: 90, step: 15, default: 0 }
        ],
        presets: [
          { label: '理想相干 (δ=0°)', values: { fc: 12, demodErr: 0 } },
          { label: '正交失效 (δ=90°)', values: { fc: 12, demodErr: 90 } }
        ],
        lines: [
          {
            step: 0,
            sub: '最纯粹的调幅叫 DSB-SC：直接让消息 $m(t)$ 乘上载波 $\\cos\\omega_c t$。频域相当于把基带谱左右各搬移一半到 $\\pm f_c$，带宽翻倍成 $2B$，且在 $f_c$ 处没有任何无用的载波尖峰。注意它满足叠加性是线性的，但改变了频率，因此不是时不变系统。',
            tts: '最纯粹的调幅叫抑制载波双边带调幅，英文简称 D S B S C，直接让消息信号 m t 乘上余弦载波。在频域上，这把基带频谱一分为二搬移到正负 f c 处，带宽变成两倍 B，而且在正负 f c 中心没有多余的载波冲激。顺带记住课件上的考题：这个调制器是线性的，但不是时不变的。'
          },
          {
            step: 1,
            sub: '仔细看动画图上的红色区域！每当基带 $m(t)$ 穿过零点变负时，载波波形不是平滑缩小，而是瞬间反相 $180^\\circ$！如果用收音机的包络检波器去摸外轮廓，只能摸出绝对值 $|m(t)|$，负半周全翻正，彻底失真！',
            tts: '仔细看波形图上的过零点！每当基带信号从正变负穿过零点时，已调波的余弦振荡瞬间发生一百八十度相位反转。正因为正负符号藏在载波相位里，如果直接用普通包络检波器去描外轮廓，只会描出绝对值，负半周全部翻成正的，彻底失真。'
          },
          {
            step: 2,
            sub: '因此 DSB-SC 必须用相干解调：在接收端再生完全同频同相的 $2\\cos\\omega_c t$ 相乘，利用 $2\\cos^2\\omega_c t = 1 + \\cos 2\\omega_c t$ 把一半谱搬回 $0\\text{ Hz}$ 完美重逢，另一半推到 $\\pm 2f_c$ 用低通滤掉！但只要本地相差 $\\delta$ 偏到 $90^\\circ$，输出 $\\cos\\delta$ 直接归零！',
            tts: '所以 D S B S C 必须使用相干解调：在接收端产生完全同频同相的本地载波乘回去，利用二倍余弦平方等于一加二倍角余弦，把两份边带重新叠回零赫兹复原消息，而二倍频分量被低通滤波器直接切掉。试着拖动相差滑块到九十度，输出余弦德尔塔立刻彻底归零。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var fc = env.params.fc || 12;
          var deltaRad = ((env.params.demodErr || 0) * Math.PI) / 180;
          var mFn = function (t) { return Math.cos(2 * Math.PI * t); };
          var sFn = function (t) { return mFn(t) * Math.cos(2 * Math.PI * fc * t); };

          // Panel 1: Time-domain 180-deg phase flip vs |m(t)| distortion
          var narrow0 = boxes[0].w < 460;
          var ax1 = env.viz.drawAxes(ctx, boxes[0], {
            xMin: 0,
            xMax: 1.0,
            yMin: -1.35,
            yMax: 1.35,
            xGrid: 4,
            yGrid: 4,
            xTicks: [[0, '0'], [0.25, '过零'], [0.5, '0.5'], [0.75, '过零'], [1.0, '1.0']],
            yTicks: [[-1, '-1'], [0, '0'], [1, '+1']],
            title: narrow0 ? 'DSB-SC 过零 180° 反相' : 'DSB-SC 时域：m(t)过零时载波180°反相（非包络|m|）'
          });
          env.viz.drawShadedBand(ctx, ax1, 0.25, 0.75, 'rgba(251, 113, 133, 0.10)', narrow0 ? 'm<0 反相区' : 'm(t)<0：载波反相180°');
          env.viz.drawCurve(ctx, ax1, sFn, { samples: 640, color: P.amber, lineWidth: 1.5 });
          env.viz.drawCurve(ctx, ax1, mFn, { samples: 240, color: P.cyan, lineWidth: 2.2, dash: [5, 3] });
          env.viz.drawCurve(ctx, ax1, function (t) { return Math.abs(mFn(t)); }, { samples: 240, color: P.red, lineWidth: 1.6, dash: [2, 3] });
          env.viz.drawAnnotation(ctx, ax1, 0.5, 1.03, narrow0 ? '红虚线=|m|失真' : '红点线=|m(t)|包络检波失真', P.red, 'center');

          // Panel 2: Demodulated spectrum + LPF + delta effect
          var narrow1 = boxes[1].w < 460;
          var ax2 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: -32,
            xMax: 32,
            yMin: -0.2,
            yMax: 1.28,
            xGrid: 6,
            yGrid: 3,
            xTicks: [[-2 * fc, '-2fc'], [0, '0'], [2 * fc, '+2fc']],
            yTicks: [[0, '0'], [1, '1']],
            title: narrow1 ? '解调谱与低通 (×cos δ)' : '乘 2cos(ωct+δ) 后频谱：0 处还原 m(t)·cosδ，滤除 ±2fc',
            subtitle: '输出增益=' + Math.cos(deltaRad).toFixed(2),
            subtitleColor: Math.abs(Math.cos(deltaRad)) < 0.15 ? P.red : P.green
          });
          env.viz.drawShadedBand(ctx, ax2, -4.5, 4.5, 'rgba(52, 211, 153, 0.16)', 'LPF通带');
          var gain = Math.cos(deltaRad);
          env.viz.drawCurve(ctx, ax2, dome(0, 3.2, gain), { from: -4, to: 4, color: P.green, lineWidth: 2.4, fillAlpha: 0.22 });
          env.viz.drawCurve(ctx, ax2, dome(-2 * fc, 3.2, 0.5), { from: -2 * fc - 4, to: -2 * fc + 4, color: P.red, lineWidth: 1.8, dash: [4, 3], fillAlpha: 0.12 });
          env.viz.drawCurve(ctx, ax2, dome(2 * fc, 3.2, 0.5), { from: 2 * fc - 4, to: 2 * fc + 4, color: P.red, lineWidth: 1.8, dash: [4, 3], fillAlpha: 0.12 });
        }
      },
      {
        id: 's02',
        tag: '推导',
        title: '模拟乘法器硬件实现：对数指数乘法器 vs 非线性平方器',
        slideRef: '03AM pp.7–8',
        terms: [
          { en: 'Log / Antilog Multiplier', zh: '对数/反对数乘法器' },
          { en: 'Balanced Nonlinear Modulator', zh: '非线性平衡调制器' },
          { en: 'Carrier Leak Cancellation', zh: '载波泄漏抵消' }
        ],
        symbols: [
          { sym: 'x y = \\exp(\\ln x + \\ln y)', desc: '利用二极管指数特性取对数相加（限正输入）', color: P.cyan },
          { sym: 'y = ax + bx^2', desc: '非线性平方律器件特性', color: P.amber },
          { sym: 'z = y_1 - y_2', desc: '两路差分相减抵消 $a\\cos\\omega_c t$ 与 $b m^2$', color: P.green }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: 'x(t)y(t) = \\exp\\!\\big(\\ln x(t) + \\ln y(t)\\big),\\quad \\text{须 } x>0,\\; y>0\\;(\\text{对 } V_T \\text{ 温漂敏感})', label: '方案 1：对数相加再反对数（模拟计算极脆弱）' },
          { step: 1, latex: 'x_{1,2} = \\cos\\omega_c t \\pm m(t) \\implies y_{1,2} = a(\\cos\\omega_c t \\pm m) + b(\\cos^2\\omega_c t \\pm 2m\\cos\\omega_c t + m^2)', label: '方案 2：单路平方器混满载波泄漏与二次谐波' },
          { step: 2, latex: 'z = y_1 - y_2 = 2a\\,m(t) + 4b\\,m(t)\\cos\\omega_c t \\xrightarrow{\\text{BPF}(\\omega_c,\\,2B)} 4b\\,m(t)\\cos\\omega_c t', label: '差分平衡相减：只留低频 am 与目标 DSB-SC，BPF 轻松分离' }
        ],
        sliders: [
          { key: 'bal', label: '差分平衡模式 (0=单路未抵消, 1=完美相减)', min: 0, max: 1, step: 0.25, default: 1.0 }
        ],
        presets: [
          { label: '平衡相减 (杂项全消)', values: { bal: 1.0 } },
          { label: '单路非线性 (满屏干扰)', values: { bal: 0.0 } }
        ],
        lines: [
          {
            step: 0,
            sub: '数学里写 $m(t)\\cos\\omega_c t$ 只是一行乘法，可现实电路里做高精度模拟乘法器非常麻烦！第一种思路利用二极管伏安指数特性做对数/反对数运算：$\\exp(\\ln m + \\ln c)$，但它要求两个输入都严格为正（必须硬加偏置），还极度怕温度漂移。',
            tts: '在纸上写两个信号相乘很容易，可现实电路里直接造一个精密的模拟乘法器非常困难。第一种思路利用二极管的指数特性做对数放大再指数还原，公式写成指数里面套对数相加；但它只能处理严格大于零的正输入，必须加直流偏置，而且对温度漂移非常敏感。'
          },
          {
            step: 1,
            sub: '第二种工业思路是用两个相同的非线性器件 $y = ax + bx^2$。如果只用单路输入 $\\cos\\omega_c t + m(t)$，输出不仅有想要的 $2bm\\cos\\omega_c t$，还会残留巨大的载波尖峰 $a\\cos\\omega_c t$，以及落在低频到 $2B$ 的 $bm^2(t)$、高频 $2\\omega_c$ 干扰！',
            tts: '第二种巧妙方案利用二次非线性器件，也就是平方项会交叉乘出信号和载波。但如果只用单路，把滑块拉到零就能看见，输出里混杂着巨大的载波泄漏冲激、消息平方项和二倍频干扰，根本挑不干净。'
          },
          {
            step: 2,
            sub: '做成对称平衡调制器：上臂输 $\\cos\\omega_c t + m(t)$，下臂输 $\\cos\\omega_c t - m(t)$，输出相减 $z = y_1 - y_2$！所有偶数次方和共模载波统统正负抵消，只剩基带 $2am$ 和中心在 $f_c$ 的 $4bm\\cos\\omega_c t$，只要 $f_c > B$ 用带通一框就完美纯净！',
            tts: '于是工程师搭出对称平衡结构：上路输入余弦加消息，下路输入余弦减消息，两路输出直接相减。此时载波泄漏、消息平方和二倍载频项全部正负抵消归零，只剩下干净的低频基带和目标双边带，带通滤波器一框就完美分离。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var bal = env.params.bal !== undefined ? env.params.bal : 1.0;
          var leak = 1 - bal;

          // Panel 1: Balanced nonlinear modulator block diagram
          var nodes = [
            { id: 'inM', nx: 0.1, ny: 0.5, nw: 0.14, nh: 0.24, label: 'm(t)', color: P.cyan },
            { id: 's1', nx: 0.30, ny: 0.26, nw: 0.12, nh: 0.22, kind: 'sum', label: '+', color: P.amber },
            { id: 's2', nx: 0.30, ny: 0.74, nw: 0.12, nh: 0.22, kind: 'sum', label: '−', color: P.amber },
            { id: 'nl1', nx: 0.52, ny: 0.26, nw: 0.17, nh: 0.26, label: 'ax+bx²\ny₁', color: P.pink },
            { id: 'nl2', nx: 0.52, ny: 0.74, nw: 0.17, nh: 0.26, label: 'ax+bx²\ny₂', color: P.pink },
            { id: 'sub', nx: 0.73, ny: 0.5, nw: 0.12, nh: 0.24, kind: 'sum', label: 'y₁−y₂', color: P.green },
            { id: 'bpf', nx: 0.90, ny: 0.5, nw: 0.15, nh: 0.28, label: 'BPF\n(fc,2B)', color: P.green }
          ];
          var edges = [
            { from: 'inM', to: 's1', label: '+m' },
            { from: 'inM', to: 's2', label: '−m' },
            { from: 's1', to: 'nl1', label: 'c+m' },
            { from: 's2', to: 'nl2', label: 'c−m' },
            { from: 'nl1', to: 'sub' },
            { from: 'nl2', to: 'sub' },
            { from: 'sub', to: 'bpf', color: P.green, label: '4bm·cos' }
          ];
          env.viz.drawBlockDiagram(ctx, boxes[0], nodes, edges, {
            time: env.time,
            activeId: env.step === 2 ? 'sub' : (env.step === 1 ? 'nl1' : 'inM'),
            title: boxes[0].w < 460 ? '平衡平方律调制框图' : '非线性平衡调制器（两臂输入 cosωct ± m(t) 相减）'
          });

          // Panel 2: Output spectrum showing cancellation of carrier leak, m^2, 2fc
          var narrow = boxes[1].w < 460;
          var ax = env.viz.drawAxes(ctx, boxes[1], {
            xMin: -0.5,
            xMax: 11.5,
            yMin: 0,
            yMax: 1.35,
            xGrid: 6,
            yGrid: 3,
            xTicks: [[0, '0'], [5, 'fc'], [10, '2fc']],
            yTicks: [[0.5, '0.5'], [1.0, '1.0']],
            title: narrow ? '单边输出谱 (平衡度 ' + Math.round(bal * 100) + '%)' : '差分输出 z = y₁ − y₂ 正频段频谱（红=被抵消的杂散）',
            subtitle: leak < 0.05 ? '杂散已归零!' : '载波与2fc泄漏!',
            subtitleColor: leak < 0.05 ? P.green : P.red
          });
          env.viz.drawShadedBand(ctx, ax, 3.8, 6.2, 'rgba(52, 211, 153, 0.16)', 'BPF(fc)');
          // Baseband 2am term always remains (until BPF removes it)
          env.viz.drawCurve(ctx, ax, dome(0, 1.0, 0.55), { from: -0.2, to: 1.1, color: P.cyan, lineWidth: 2.0, fillAlpha: 0.15 });
          // Desired DSB-SC at fc=5
          env.viz.drawCurve(ctx, ax, dome(5, 1.05, 0.95), { from: 3.9, to: 6.1, color: P.green, lineWidth: 2.5, fillAlpha: 0.22 });
          // Canceled components when leak > 0: m^2 (width 2), carrier impulse at fc, 2fc impulse
          if (leak > 0.02) {
            env.viz.drawCurve(ctx, ax, dome(0, 2.0, 0.45 * leak), { from: -0.2, to: 2.1, color: P.red, lineWidth: 1.8, dash: [4, 3] });
            env.viz.drawStems(ctx, ax, [
              { x: 5, y: 1.15 * leak, color: P.red, arrow: true, label: narrow ? '泄漏' : '载波泄漏' },
              { x: 10, y: 0.72 * leak, color: P.red, arrow: true, label: '2fc' }
            ], {});
          }
        }
      },
      {
        id: 's03',
        tag: '作业精讲',
        hwCode: '4.2-3',
        title: 'HW1 作业 4.2-3：立方律调制器与奇偶次幂筛选规律',
        slideRef: '03AM p.45 · HW 4.2-3',
        terms: [
          { en: 'Cubic Nonlinearity', zh: '立方律非线性项' },
          { en: 'Harmonic Extraction', zh: '奇次谐波带通提取' },
          { en: 'Anti-Aliasing Condition', zh: '边带不混叠约束' }
        ],
        symbols: [
          { sym: '\\cos^3\\omega_c t = \\tfrac{3}{4}\\cos\\omega_c t + \\tfrac{1}{4}\\cos 3\\omega_c t', desc: '点 b 展开为基波与三次谐波', color: P.amber },
          { sym: 'f_c > B', desc: '防 $\\pm f_c$ 原点重叠且防 $f_c+B$ 与 $3f_c-B$ 相撞', color: P.green },
          { sym: '\\text{gain} = 4k / 3', desc: 'BPF 中心 $\\omega_c$、带宽 $2B$ 的必需增益', color: P.cyan }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: 'b(t) = m(t)\\cos^3\\omega_c t \\;\\Longleftrightarrow\\; \\frac{3}{8}\\big[M(f-f_c)+M(f+f_c)\\big] + \\frac{1}{8}\\big[M(f-3f_c)+M(f+3f_c)\\big]', label: '(a)(b) 点 b 频谱：±fc 高度 3A/8，±3fc 高度 A/8；BPF 增益 4k/3 得 km·cosωct' },
          { step: 1, latex: 'f_c + B < 3f_c - B \\;\\text{且}\\; f_c - B > 0 \\implies f_c > B \\quad(\\omega_{c,\\min} = 2\\pi B)', label: '(c) 互不混叠条件：极限最小载频 ωc = 2πB' },
          { step: 2, latex: '\\sin^3\\omega_c t = \\frac{3}{4}\\sin\\omega_c t - \\frac{1}{4}\\sin 3\\omega_c t \\;(\\text{可行, } \\theta=-\\frac{\\pi}{2}) \\quad\\big|\\quad \\cos^n\\omega_c t:\\text{ 奇 } n \\text{ 可行, 偶 } n \\text{ 不行}', label: '(d)(f) 正弦立方仍可行；一般 n≥2 仅奇数含基波，偶数全为偶次谐波与直流' }
        ],
        sliders: [
          { key: 'fcRatio', label: '载波/带宽比 f_c / B', min: 0.7, max: 3.5, step: 0.1, default: 3.0 },
          { key: 'powN', label: '幂次 n (cos^n ωct)', min: 2, max: 5, step: 1, default: 3 }
        ],
        presets: [
          { label: '原题 n=3, fc=3B (清晰分离)', values: { fcRatio: 3.0, powN: 3 } },
          { label: '临界条件 fc=1.0B', values: { fcRatio: 1.0, powN: 3 } },
          { label: '问(f) n=2 偶次幂失败', values: { fcRatio: 3.0, powN: 2 } },
          { label: '问(f) n=5 奇次幂可行', values: { fcRatio: 3.0, powN: 5 } }
        ],
        lines: [
          {
            step: 0,
            sub: '看作业 4.2-3：消息 $m(t)$ 乘上 $\\cos^3\\omega_c t$ 送入点 b。用三倍角公式拆开 $\\cos^3\\omega_c t = \\frac{3}{4}\\cos\\omega_c t + \\frac{1}{4}\\cos 3\\omega_c t$，频域在 $\\pm f_c$ 出现高度 $\\frac{3}{8}A$ 的副本，在 $\\pm 3f_c$ 出现高度 $\\frac{1}{8}A$ 的副本！要输出 $km\\cos\\omega_c t$，带通滤波器必须中心在 $\\omega_c$、带宽 $2B$、增益取 $\\frac{4k}{3}$！',
            tts: '来看作业四点二杠三。消息信号乘上余弦的三次方到达点 b。用三角恒等式展开：余弦立方等于四分之三倍基波余弦，加上四分之一倍三次谐波余弦。所以点 b 的频谱在正负 f c 处高度是八分之三 A，在正负三 f c 处高度是八分之一 A。想在点 c 还原出 k 倍目标信号，带通滤波器中心要对准欧米伽 c，带宽二 B，增益必须取三分之四 k。'
          },
          {
            step: 1,
            sub: '第 (c) 问：两段频谱何时不混叠？要求 $\\pm f_c$ 自己不在原点 $0$ 相撞（$f_c > B$），且 $f_c+B < 3f_c-B$（同样推出 $f_c > B$）！拖动滑块把 $f_c/B$ 降到 $1.0$ 以下，立刻看见 $\\pm f_c$ 与 $3f_c$ 的频谱边带撞在一起！所以最小可用载频极限是 $\\omega_c = 2\\pi B$。',
            tts: '第三问求载频下限：一方面正负 f c 两个副本不能在零频撞车，需要 f c 大于 B；另一方面 f c 的上边沿也不能撞进三 f c 的下边沿，还是要求 f c 大于 B。你可以把频率比滑块拉到一以下，就能亲眼看见蓝色边带和红色三次谐波撞在一起，因此极限最小载频是二派 B。'
          },
          {
            step: 2,
            sub: '第 (d)(f) 问考得很透：把 $\\cos^3$ 换成 $\\sin^3$ 行吗？展开仍有 $\\frac{3}{4}\\sin\\omega_c t = \\frac{3}{4}\\cos(\\omega_c t - \\frac{\\pi}{2})$，带通后照样是合法 DSB-SC！那推广到 $\\cos^n\\omega_c t$（$n\\ge 2$）呢？切换幂次滑块：只有奇数 $n$ 展开含 $\\cos\\omega_c t$ 基波可行；偶数 $n$ 只有直流与 $2\\omega_c, 4\\omega_c$ 偶次谐波，完全没有 $f_c$ 分量！',
            tts: '第四问和第六问最容易考概念延展：如果换成正弦的三次方，它依然包含四分之三倍正弦基波，只是相移了负九十度，仍然能得到合格的双边带。那一般 n 次方呢？把幂次滑块切到二或四就能看到：只有奇数次幂才包含基波余弦，滤波器能正常选出；所有偶数次幂展开全都是直流和偶次谐波，载频 f c 处一片空白，彻底不可行！'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var r = env.params.fcRatio || 3.0; // fc in units of B
          var nPow = Math.round(env.params.powN || 3);
          var isOdd = nPow % 2 === 1;
          var overlap = r <= 1.001;

          // Compute exact Fourier cosine coefficients of cos^n(x)
          var coeffs = {};
          if (nPow === 2) { coeffs = { 0: 0.5, 2: 0.5 }; }
          else if (nPow === 3) { coeffs = { 1: 0.75, 3: 0.25 }; }
          else if (nPow === 4) { coeffs = { 0: 0.375, 2: 0.5, 4: 0.125 }; }
          else { coeffs = { 1: 0.625, 3: 0.3125, 5: 0.0625 }; }

          var narrow0 = boxes[0].w < 460;
          var xLim = Math.max(10.5, r * 3.8 + 1.5);
          var ax1 = env.viz.drawAxes(ctx, boxes[0], {
            xMin: -xLim,
            xMax: xLim,
            yMin: 0,
            yMax: 0.55,
            xGrid: 6,
            yGrid: 3,
            xTicks: [[-3 * r, '-3fc'], [-r, '-fc'], [0, '0'], [r, 'fc'], [3 * r, '3fc']],
            yTicks: [[0.125, 'A/8'], [0.375, '3A/8'], [0.5, 'A/2']],
            title: narrow0 ? '点 b 频谱 (cos^' + nPow + ')' : '点 b 频谱 m(t)·cos^' + nPow + 'ωct（蓝=±fc目标，红=杂散）',
            subtitle: !isOdd ? '偶次幂无 ±fc 分量!' : (overlap ? 'fc≤B 混叠!' : 'BPF 可无混叠提取'),
            subtitleColor: (!isOdd || overlap) ? P.red : P.green
          });

          env.viz.drawShadedBand(ctx, ax1, r - 1, r + 1, 'rgba(52, 211, 153, 0.14)', 'BPF');
          env.viz.drawShadedBand(ctx, ax1, -r - 1, -r + 1, 'rgba(52, 211, 153, 0.14)');

          var ks = Object.keys(coeffs);
          for (var i = 0; i < ks.length; i++) {
            var k = parseInt(ks[i], 10);
            var c = coeffs[k];
            if (k === 0) {
              env.viz.drawCurve(ctx, ax1, dome(0, 1.0, c), { from: -1.1, to: 1.1, color: P.red, lineWidth: 2.0, fillAlpha: 0.18 });
            } else {
              var col = k === 1 ? P.cyan : P.red;
              var h = c * 0.5;
              env.viz.drawCurve(ctx, ax1, dome(k * r, 1.0, h), { from: k * r - 1.05, to: k * r + 1.05, color: col, lineWidth: 2.2, fillAlpha: 0.18 });
              env.viz.drawCurve(ctx, ax1, dome(-k * r, 1.0, h), { from: -k * r - 1.05, to: -k * r + 1.05, color: col, lineWidth: 2.2, fillAlpha: 0.18 });
            }
          }

          // Panel 2: Output at point c after BPF(gain = 1/c1)
          var narrow1 = boxes[1].w < 460;
          var ax2 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: -xLim,
            xMax: xLim,
            yMin: 0,
            yMax: 0.65,
            xGrid: 6,
            yGrid: 3,
            xTicks: [[-r, '-fc'], [0, '0'], [r, '+fc']],
            yTicks: [[0.5, 'A/2']],
            title: narrow1 ? '点 c 输出谱' : '点 c（经 BPF 增益 1/c₁ 后仅留 ±fc，高 A/2；n=3 时增益 4/3）'
          });
          if (isOdd) {
            var outH = 0.5;
            var outCol = overlap ? P.amber : P.green;
            env.viz.drawCurve(ctx, ax2, dome(-r, 1.0, outH), { from: -r - 1.05, to: -r + 1.05, color: outCol, lineWidth: 2.4, fillAlpha: 0.22 });
            env.viz.drawCurve(ctx, ax2, dome(r, 1.0, outH), { from: r - 1.05, to: r + 1.05, color: outCol, lineWidth: 2.4, fillAlpha: 0.22 });
            if (overlap) {
              env.viz.drawAnnotation(ctx, ax2, 0, 0.54, 'fc≤B 导致边带混叠失真!', P.red, 'center');
            } else {
              env.viz.drawAnnotation(ctx, ax2, r, 0.53, '纯净 DSB-SC (A/2)', P.green, 'center');
            }
          } else {
            env.viz.drawAnnotation(ctx, ax2, 0, 0.28, 'n=' + nPow + ' 为偶数：±fc 处输出恒为 0!', P.red, 'center');
          }
        }
      },
      {
        id: 's04',
        tag: '推导',
        title: '开关调制器（0/1）、二极管桥与环形调制器（±1）对比',
        slideRef: '03AM pp.9–11',
        terms: [
          { en: 'Switching Modulator', zh: '0/1 开关调制器' },
          { en: 'Diode Bridge Switch', zh: '二极管桥电子开关' },
          { en: 'Ring Modulator', zh: '±1 双平衡环形调制器' }
        ],
        symbols: [
          { sym: 'w_{0/1}(t) = \\tfrac{1}{2} + \\tfrac{2}{\\pi}(\\cos\\omega_c t - \\tfrac{1}{3}\\cos 3\\omega_c t + \\cdots)', desc: '单极性 0/1 开关含直流 $\\frac{1}{2}$', color: P.amber },
          { sym: 'w_{\\pm 1}(t) = \\tfrac{4}{\\pi}(\\cos\\omega_c t - \\tfrac{1}{3}\\cos 3\\omega_c t + \\cdots)', desc: '环形 ±1 反转：无直流、基波幅度翻倍', color: P.green }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: 'm(t)w_{0/1}(t) = \\frac{1}{2}m(t) + \\frac{2}{\\pi}m(t)\\cos\\omega_c t - \\frac{2}{3\\pi}m(t)\\cos 3\\omega_c t + \\cdots', label: '0/1 开关：有 1/2 m(t) 基带泄漏，但靠晶振方波控制二极管桥极易制造' },
          { step: 1, latex: 'm(t)w_{\\pm 1}(t) = \\frac{4}{\\pi}m(t)\\cos\\omega_c t - \\frac{4}{3\\pi}m(t)\\cos 3\\omega_c t + \\cdots \\xrightarrow{\\text{BPF}} \\frac{4}{\\pi}m(t)\\cos\\omega_c t', label: '±1 环形调制器：交叉导通实现正负反转，无基带泄漏且输出幅度翻倍' }
        ],
        sliders: [
          { key: 'ringMode', label: '开关类型 (0=0/1开关, 1=±1环形调制)', min: 0, max: 1, step: 1, default: 1 }
        ],
        presets: [
          { label: '0/1 开关调制器', values: { ringMode: 0 } },
          { label: '±1 环形调制器 (推荐)', values: { ringMode: 1 } }
        ],
        lines: [
          {
            step: 0,
            sub: '工程上做余弦乘法难，但用晶体振荡器生成方波去控制二极管桥开关就容易多了！大载波控制二极管导通与截止，相当于把 $m(t)$ 乘上一个 $0/1$ 方波 $w(t)$，展开后它的基波就是 $\\frac{2}{\\pi}\\cos\\omega_c t$，带通滤一挑就得到 $\\frac{2}{\\pi}m(t)\\cos\\omega_c t$。',
            tts: '相比直接做模拟乘法，用晶振放大出方波去控制二极管桥开关就太容易了。只要载波幅度远大于消息信号，二极管就会像电子开关一样交替导通和截止。如果乘的是零一单极性方波，傅里叶级数里天然带着基波余弦，带通滤波一下就能挑出目标双边带。'
          },
          {
            step: 1,
            sub: '升级成四只二极管交叉连接的环形调制器：载波为正输出 $+m(t)$，为负交叉导通输出 $-m(t)$，相当于乘 $\\pm 1$ 双极性方波！它彻底消除了 $0/1$ 开关里的 $\\frac{1}{2}m(t)$ 直流基带泄漏，而且有用信号幅度 $\\frac{4}{\\pi}$ 直接翻倍！',
            tts: '如果把电路升级成四只二极管交叉连接的环形调制器：载波正半周直接放行正 m t，负半周交叉导通输出负 m t，相当于乘上了正负一双极性方波。对比两种开关的波形和频谱可以看到：环形调制器零赫兹基带泄漏彻底归零，而且有效边带幅度直接翻了一倍！'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var isRing = Math.round(env.params.ringMode || 0) === 1;
          var mFn = function (t) { return 0.9 * Math.cos(2 * Math.PI * 0.7 * t); };
          var sqFn = function (t) {
            var s = Math.sin(2 * Math.PI * 8 * t) >= 0 ? 1 : -1;
            return isRing ? s : (s > 0 ? 1 : 0);
          };

          var narrow0 = boxes[0].w < 460;
          var ax1 = env.viz.drawAxes(ctx, boxes[0], {
            xMin: 0,
            xMax: 1.0,
            yMin: -1.15,
            yMax: 1.15,
            xGrid: 4,
            yGrid: 2,
            xTicks: [[0, '0'], [0.5, '0.5'], [1.0, '1.0']],
            yTicks: [[-1, '-1'], [0, '0'], [1, '+1']],
            title: narrow0 ? (isRing ? '±1 环形波形' : '0/1 开关波形') : (isRing ? '环形调制输出 m(t)·w±1(t)（上下对称反转）' : '0/1 开关输出 m(t)·w₀₁(t)（单边削波）')
          });
          env.viz.drawCurve(ctx, ax1, function (t) { return mFn(t) * sqFn(t); }, { samples: 640, color: isRing ? P.green : P.amber, lineWidth: 1.6 });
          env.viz.drawCurve(ctx, ax1, mFn, { samples: 240, color: P.cyan, lineWidth: 1.6, dash: [4, 3] });

          var narrow1 = boxes[1].w < 460;
          var ax2 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: -0.5,
            xMax: 4.5,
            yMin: 0,
            yMax: 0.85,
            xGrid: 5,
            yGrid: 3,
            xTicks: [[0, '0'], [1, 'fc'], [3, '3fc']],
            yTicks: [[0.318, '1/π'], [0.637, '2/π']],
            title: narrow1 ? '输出谱 (正半轴)' : '输出频谱对比：0/1 泄漏直流 vs ±1 幅度翻倍',
            subtitle: isRing ? '基波峰 2/π, 无直流' : '有 1/2 基带泄漏!',
            subtitleColor: isRing ? P.green : P.amber
          });
          env.viz.drawShadedBand(ctx, ax2, 0.55, 1.45, 'rgba(52, 211, 153, 0.14)', 'BPF');
          if (!isRing) {
            env.viz.drawCurve(ctx, ax2, dome(0, 0.4, 0.5), { from: -0.45, to: 0.45, color: P.red, lineWidth: 2.2, fillAlpha: 0.20 });
            env.viz.drawAnnotation(ctx, ax2, 0.25, 0.52, '1/2 M(f)泄漏', P.red, 'left');
          }
          var amp1 = isRing ? (2 / Math.PI) : (1 / Math.PI);
          var amp3 = amp1 / 3;
          env.viz.drawCurve(ctx, ax2, dome(1, 0.35, amp1), { from: 0.6, to: 1.4, color: P.green, lineWidth: 2.4, fillAlpha: 0.24 });
          env.viz.drawCurve(ctx, ax2, dome(3, 0.35, amp3), { from: 2.6, to: 3.4, color: P.muted, lineWidth: 1.8, fillAlpha: 0.12 });
          env.viz.drawAnnotation(ctx, ax2, 1, amp1 + 0.03, isRing ? '2/π' : '1/π', P.green, 'center');
        }
      },
      {
        id: 's05',
        tag: '作业精讲',
        hwCode: '4.2-4',
        title: 'HW1 作业 4.2-4：100 kHz 环形调制器第 5 次谐波倍频调制',
        slideRef: '03AM p.45 · HW 4.2-4',
        terms: [
          { en: '5th Harmonic Extraction', zh: '五次谐波提取' },
          { en: 'Ring Modulator Scaling', zh: '环形调制器倍频系数' }
        ],
        symbols: [
          { sym: 'f_0 = 100\\text{ kHz}', desc: '方波发生器基频（奇次谐波落在 $100, 300, 500, 700\\text{ kHz}$）', color: P.cyan },
          { sym: 'f_c = 5f_0 = 500\\text{ kHz}', desc: 'BPF 中心频率（挑出第 5 次谐波）', color: P.green },
          { sym: 'k = \\frac{4}{5\\pi} \\approx 0.255', desc: '最终输出 $k\\,m(t)\\cos\\omega_c t$ 的增益系数', color: P.amber }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: 'w(t) = \\frac{4}{\\pi}\\left(\\cos\\omega_0 t - \\frac{1}{3}\\cos 3\\omega_0 t + \\frac{1}{5}\\cos 5\\omega_0 t - \\cdots\\right),\\quad f_0 = 100\\text{ kHz}', label: '(a) 100 kHz 环形调制器输出 m(t)w(t) 在各奇次谐波处复制频谱' },
          { step: 1, latex: '500 - B > 300 + B \\implies B < 100\\text{ kHz},\\qquad y(t) = \\frac{4}{5\\pi}m(t)\\cos(2\\pi\\cdot 500\\text{k}\\,t)', label: '(a)(b) 500 kHz BPF 挑出第 5 项，防混叠要求 B < 100 kHz，系数 k = 4/(5π) ≈ 0.255' }
        ],
        sliders: [
          { key: 'bwK', label: '基带信号带宽 B (kHz)', min: 30, max: 140, step: 10, default: 60 }
        ],
        presets: [
          { label: '安全不混叠 (B=60 kHz)', values: { bwK: 60 } },
          { label: '临界极限 (B=100 kHz)', values: { bwK: 100 } },
          { label: '邻带撞车 (B=130 kHz)', values: { bwK: 130 } }
        ],
        lines: [
          {
            step: 0,
            sub: '作业 4.2-4 特别巧妙：手里只有 $100\\text{ kHz}$ 的信号发生器，怎么把基带调制到 $f_c = 500\\text{ kHz}$？直接让 $100\\text{ kHz}$ 驱动环形调制器，输出的 $\\pm 1$ 方波自带无穷多奇次谐波，分别位于 $100, 300, 500, 700\\text{ kHz}$！',
            tts: '来看作业四点二杠四：如果手里只有一百千赫兹的方波发生器，怎么调制到五百千赫兹的载波上？直接拿一百千赫兹去驱动环形调制器，因为正负一方波傅里叶展开天生包含所有奇次谐波，在一百、三百、五百和七百千赫兹处都会同时出现消息副本！'
          },
          {
            step: 1,
            sub: '只需接一个中心在 $500\\text{ kHz}$ 的带通滤波器，直接把第 5 次谐波挑出来！此时增益 $k = \\frac{4}{5\\pi} \\approx 0.255$。为了让 $500 - B$ 不撞进相邻的 $300 + B$（和 $700 - B$），基带带宽必须满足 $B < 100\\text{ kHz}$！拖动滑块验证 $B \\ge 100\\text{ kHz}$ 时的混叠红区。',
            tts: '只需要在后面放一个中心在五百千赫兹的带通滤波器，单挑出第五次谐波即可！此时系数 k 等于五派分之四，约等于零点二五五。为了保证五百千赫兹下边沿不和三百千赫兹的上边沿撞在一起，消息带宽 B 必须严格小于一百千赫兹。拖动带宽滑块到一百以上，就能看到三百和五百两段频谱发生混叠。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var B = env.params.bwK || 60;
          var collide = B >= 100;

          // Panel 1: Block diagram
          var nodes = [
            { id: 'm', nx: 0.12, ny: 0.42, nw: 0.16, nh: 0.26, label: 'm(t)\n|f|≤B', color: P.cyan },
            { id: 'osc', nx: 0.38, ny: 0.78, nw: 0.22, nh: 0.24, label: '100kHz 方波\nw(t)', color: P.amber },
            { id: 'ring', nx: 0.38, ny: 0.42, nw: 0.18, nh: 0.26, kind: 'mul', label: '×', color: P.amber },
            { id: 'bpf', nx: 0.66, ny: 0.42, nw: 0.22, nh: 0.28, label: 'BPF 500kHz\n(BW=2B)', color: P.green },
            { id: 'out', nx: 0.90, ny: 0.42, nw: 0.16, nh: 0.28, label: '0.255m·\ncos(500k)', color: P.green }
          ];
          var edges = [
            { from: 'm', to: 'ring' },
            { from: 'osc', to: 'ring' },
            { from: 'ring', to: 'bpf', label: '100/300/500k...' },
            { from: 'bpf', to: 'out', color: P.green, label: 'k=4/(5π)' }
          ];
          env.viz.drawBlockDiagram(ctx, boxes[0], nodes, edges, {
            time: env.time,
            activeId: env.step === 0 ? 'ring' : 'bpf',
            title: boxes[0].w < 460 ? '环形调制器倍频方案' : 'HW 4.2-4：100 kHz 环形调制器 + 500 kHz BPF'
          });

          // Panel 2: Positive frequency odd harmonics 100, 300, 500, 700 kHz
          var narrow = boxes[1].w < 460;
          var ax = env.viz.drawAxes(ctx, boxes[1], {
            xMin: 0,
            xMax: 840,
            yMin: 0,
            yMax: 0.85,
            xGrid: 8,
            yGrid: 3,
            xTicks: [[100, '100'], [300, '300'], [500, '500'], [700, '700k']],
            yTicks: [[2 / (5 * Math.PI), '4/(5π)/2'], [2 / Math.PI, '2/π']],
            title: narrow ? '奇次谐波搬移 (B=' + B + 'k)' : '正频段 100/300/500/700 kHz 副本分布（当前 B=' + B + ' kHz）',
            subtitle: collide ? 'B≥100k 相邻混叠!' : 'k=4/(5π)≈0.255',
            subtitleColor: collide ? P.red : P.green
          });

          var passL = Math.max(400, 500 - B);
          var passR = Math.min(600, 500 + B);
          env.viz.drawShadedBand(ctx, ax, passL, passR, collide ? 'rgba(251, 113, 133, 0.2)' : 'rgba(52, 211, 153, 0.18)', '500k BPF');

          var harms = [
            { f: 100, c: 1, col: P.muted },
            { f: 300, c: 1 / 3, col: collide ? P.red : P.amber },
            { f: 500, c: 1 / 5, col: P.green },
            { f: 700, c: 1 / 7, col: collide ? P.red : P.muted }
          ];
          var basePeak = 2 / Math.PI;
          for (var i = 0; i < harms.length; i++) {
            var h = harms[i];
            env.viz.drawCurve(ctx, ax, dome(h.f, B, basePeak * h.c), {
              from: h.f - B - 5,
              to: h.f + B + 5,
              color: h.col,
              lineWidth: h.f === 500 ? 2.6 : 1.8,
              fillAlpha: h.f === 500 ? 0.25 : 0.12
            });
          }
          env.viz.drawAnnotation(ctx, ax, 500, basePeak / 5 + 0.04, '第5次谐波', P.green, 'center');
        }
      },
      {
        id: 's06',
        tag: '作业精讲',
        hwCode: '4.2-8',
        title: '开关解调原理 + HW1 作业 4.2-8 语音频谱倒置加密',
        slideRef: '03AM p.12, p.45 · HW 4.2-8',
        terms: [
          { en: 'Switching Demodulator', zh: '开关解调器' },
          { en: 'Frequency Inversion Scrambler', zh: '语音频谱倒置加密' }
        ],
        symbols: [
          { sym: '2\\cos 30000\\pi t', desc: '本振载波（$f_0 = 15\\text{ kHz}$）', color: P.amber },
          { sym: 'Y(f) = M(15\\text{k}-f)\\;(0\\le f\\le 15\\text{k})', desc: '低频与高频左右对调（频谱倒置）', color: P.red },
          { sym: 'M(15-(15-f)) = M(f)', desc: '再过一次完全相同的系统即自动解扰！', color: P.green }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: 's(t)w(t) = \\sum_k a_k m(t)\\cos\\omega_c t\\cos k\\omega_c t \\implies \\text{仅 } k=1 \\text{ 产生低频 } \\frac{a_1}{2}m(t)', label: 'p.12 开关解调：收端乘周期方波再低通，高次谐波留在 ≥ωc 被滤除' },
          { step: 1, latex: 'M(f) \\xrightarrow{\\times 2\\cos 2\\pi\\cdot 15\\text{k}\\,t} M(f-15\\text{k}) + M(f+15\\text{k}) \\xrightarrow{\\text{LPF }15\\text{k}} Y(f)=M(15\\text{k}-f)\\;(f\\ge 0)', label: '(a) HW 4.2-8：V 形谱搬移到 ±15k 后切出低频段，高音低音彻底颠倒' },
          { step: 2, latex: 'y(t) \\xrightarrow{\\text{同一加扰器}} M\\big(15\\text{k} - (15\\text{k}-f)\\big) = M(f)', label: '(b) 对称解密：扰码器本身就是解扰器，再做一次负负得正！' }
        ],
        sliders: [
          { key: 'stage', label: '信号流阶段 (0=原谱, 1=搬移后, 2=加密倒置, 3=再次解扰)', min: 0, max: 3, step: 1, default: 2 }
        ],
        presets: [
          { label: '原始 V 形谱 M(f)', values: { stage: 0 } },
          { label: '乘 2cos(30kπt) 搬移', values: { stage: 1 } },
          { label: 'LPF 后倒置加密 Y(f)', values: { stage: 2 } },
          { label: '同系统再过一次解密', values: { stage: 3 } }
        ],
        lines: [
          {
            step: 0,
            sub: '先看课件第 12 页：接收端其实也能用方波开关解调！因为只有方波的基波 $\\cos\\omega_c t$ 和已调波相乘会产生零频信号，高次谐波相乘全在 $\\omega_c$ 以上，低通一拦就干净！',
            tts: '先看课件第十二页：其实不仅发射端能用开关，接收端也能直接用周期方波来解调。因为只有方波的基波余弦能把已调信号搬回零赫兹，其余高次谐波相乘都在载频以上，低通滤波器顺手就全部拦住了。'
          },
          {
            step: 1,
            sub: '再看经典的作业 4.2-8 语音频谱倒置保密系统：语音信号 $M(f)$ 在 $0\\sim 15\\text{ kHz}$ 呈 V 形（低音矮、高音高）。先乘上 $2\\cos(30000\\pi t)$（$f_0=15\\text{ kHz}$），把正负两片 V 形谱各搬到 $[0, 30]$ 与 $[-30, 0]\\text{ kHz}$。再用 $0\\sim 15\\text{ kHz}$ 低通切出中间段，利用偶对称得 $Y(f) = M(15\\text{k}-f)$——低频变高频，高频变低频，听起来像外星语！',
            tts: '接着看作业四点二杠八，超经典的语音频谱倒置保密通信。假设原始语音在零到十五千赫兹呈 V 形，低音成分小，高音成分大。把它乘上频率为十五千赫兹的二倍余弦，频谱就左右平移十五千赫兹，互不重叠。再经过零到十五千赫兹的低通滤波器切出中间一段，利用偶对称性，结果变成 M 十五减 f！也就是说原来零赫兹的成分跑到十五千赫兹，原本的高音跑到低音区，谱形彻底倒置，窃听者完全听不懂！'
          },
          {
            step: 2,
            sub: '第 (b) 问最神奇：怎么解扰？把密文 $y(t)$ 原封不动送进完全相同的系统（再乘 $2\\cos 30000\\pi t$ 过 $15\\text{ kHz}$ 低通）！由于 $15\\text{k} - (15\\text{k} - f) = f$，频谱再翻一次立刻恢复原样！扰码器本身就是解扰器！',
            tts: '第二问怎么解密呢？把加密后的信号原封不动送进一个完全一模一样的模块，再乘十五千赫兹余弦并低通，相当于又做了一次十五减 f 的翻转，负负得正完美恢复原样。所以扰码器自己就是解扰器！'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var st = Math.round(env.params.stage !== undefined ? env.params.stage : 2);
          var vSpec = function (f) {
            var af = Math.abs(f);
            return af <= 15 ? af / 15 : 0;
          };

          // Panel 1: Original M(f)
          var narrow0 = boxes[0].w < 460;
          var ax1 = env.viz.drawAxes(ctx, boxes[0], {
            xMin: -32,
            xMax: 32,
            yMin: 0,
            yMax: 1.28,
            xGrid: 4,
            yGrid: 2,
            xTicks: [[-30, '-30'], [-15, '-15k'], [0, '0'], [15, '+15k'], [30, '30']],
            yTicks: [[1, '1']],
            title: narrow0 ? '原频谱 M(f) (V形)' : '原始基带 M(f)（低频=0，±15 kHz 最高）'
          });
          env.viz.drawCurve(ctx, ax1, vSpec, { from: -15, to: 15, samples: 240, color: P.cyan, lineWidth: 2.4, fillAlpha: 0.20 });
          env.viz.drawAnnotation(ctx, ax1, 12, 0.88, '高音强', P.cyan, 'center');
          env.viz.drawAnnotation(ctx, ax1, 2.5, 0.22, '低音弱', P.muted, 'center');

          // Panel 2: Stage output
          var narrow1 = boxes[1].w < 460;
          var titles = [
            narrow1 ? '阶段0: 未调制' : '阶段 0：尚未经过加扰器（与原谱相同）',
            narrow1 ? '阶段1: 搬移±15k' : '阶段 1：乘 2cos(30kπt) 搬移至 [-30, 30] kHz',
            narrow1 ? '阶段2: 倒置加密!' : '阶段 2：过 15kHz LPF → Y(f)=M(15−f) 左右倒置!',
            narrow1 ? '阶段3: 再翻复原!' : '阶段 3：再次通过同模块 → M(15−(15−f))=M(f) 复原!'
          ];
          var ax2 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: -32,
            xMax: 32,
            yMin: 0,
            yMax: 1.28,
            xGrid: 4,
            yGrid: 2,
            xTicks: [[-30, '-30'], [-15, '-15k'], [0, '0'], [15, '+15k'], [30, '30']],
            yTicks: [[1, '1']],
            title: titles[st],
            subtitle: st === 2 ? '高低音倒置!' : (st === 3 ? '完美解密!' : undefined),
            subtitleColor: st === 2 ? P.red : P.green
          });

          if (st >= 1) {
            env.viz.drawShadedBand(ctx, ax2, -15, 15, 'rgba(52, 211, 153, 0.13)', 'LPF 0~15k');
          }

          if (st === 0) {
            env.viz.drawCurve(ctx, ax2, vSpec, { from: -15, to: 15, samples: 240, color: P.cyan, lineWidth: 2.3, fillAlpha: 0.18 });
          } else if (st === 1) {
            env.viz.drawCurve(ctx, ax2, function (f) { return vSpec(f - 15); }, { from: 0, to: 30, samples: 240, color: P.amber, lineWidth: 2.2, fillAlpha: 0.16 });
            env.viz.drawCurve(ctx, ax2, function (f) { return vSpec(f + 15); }, { from: -30, to: 0, samples: 240, color: P.amber, lineWidth: 2.2, fillAlpha: 0.16 });
          } else if (st === 2) {
            env.viz.drawCurve(ctx, ax2, function (f) { return Math.abs(f) <= 15 ? vSpec(15 - Math.abs(f)) : 0; }, {
              from: -15, to: 15, samples: 240, color: P.red, lineWidth: 2.5, fillAlpha: 0.24
            });
            env.viz.drawAnnotation(ctx, ax2, 0, 1.03, '原15k高音落到0Hz!', P.red, 'center');
          } else {
            env.viz.drawCurve(ctx, ax2, vSpec, { from: -15, to: 15, samples: 240, color: P.green, lineWidth: 2.5, fillAlpha: 0.22 });
            env.viz.drawAnnotation(ctx, ax2, 0, 0.85, '再次翻转=复原M(f)', P.green, 'center');
          }
        }
      }
    ]
  });
})(window);
