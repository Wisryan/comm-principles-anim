(function (global) {
  'use strict';

  var P = global.COMM_VIZ.PALETTE;

  function resolvePart(env, maxPart) {
    var p = env.params.part !== undefined ? Math.round(env.params.part) : 0;
    if (p >= 1 && p <= maxPart) return p - 1;
    return Math.min(maxPart - 1, Math.max(0, env.step));
  }

  function wrapPeriod(t, period, start) {
    return (((t - start) % period) + period) % period + start;
  }

  global.COMM_EPISODES.push({
    id: 'ep03',
    chapter: 'Ch.02 信号与系统（中）',
    title: '周期傅里叶级数、Parseval 定理与六大频谱速算',
    slideDeck: 'Ch.02 信号与系统（中）',
    slideRange: 'pp. 39–47',
    homeworkTags: ['HW1 · 2.9-1 (a)-(f)'],
    scenes: [
      {
        id: 's00',
        tag: '直觉',
        title: '频域正交基底分解与吉布斯现象 (Gibbs Phenomenon)',
        slideRef: '02sigsys pp.39–40',
        terms: [
          { en: 'Fourier Series', zh: '傅里叶级数' },
          { en: 'Harmonics (nω₀)', zh: '谐波分量' },
          { en: 'Gibbs Phenomenon', zh: '吉布斯现象（约 9% 过冲）' }
        ],
        symbols: [
          { sym: 'g_N(t) = \\sum_{n=-N}^{N} D_n e^{jn\\omega_0 t}', desc: '保留至 N 次谐波的有限截断合成信号', color: P.amber },
          { sym: '\\omega_0 = \\frac{2\\pi}{T_0}', desc: '基波角频率（谱线间距，周期越宽谱线越密）', color: P.cyan }
        ],
        errata: '课件第 40 页小勘误：右侧频谱图 |Ck| 与 θk 的横轴误标成了 t，实际横轴应当是频率 ω（在 kω₀ 处立起离散线谱）。',
        formulas: [
          { step: 0, latex: 'g(t) = \\sum_{n=-\\infty}^{\\infty} D_n e^{jn\\omega_0 t},\\qquad D_n = \\frac{1}{T_0}\\int_{T_0} g(t)e^{-jn\\omega_0 t}dt', label: '周期信号在完备正交基 {e^{jnω₀t}} 上的投影与合成' },
          { step: 1, latex: 'g(t) = \\pm 1\\text{ 方波} \\implies g_N(t) = \\frac{4}{\\pi}\\left(\\cos\\omega_0 t - \\frac{1}{3}\\cos 3\\omega_0 t + \\frac{1}{5}\\cos 5\\omega_0 t - \\cdots\\right)', label: '边沿跳变需要无穷高次谐波；在跳变处总留约 9% 过冲振铃' }
        ],
        sliders: [
          { key: 'N', label: '截断最高谐波阶数 N', min: 1, max: 25, step: 2, default: 5 }
        ],
        presets: [
          { label: '仅基波 (N=1)', values: { N: 1 } },
          { label: '常见截断 (N=5)', values: { N: 5 } },
          { label: '高阶逼近 (N=25, 吉布斯 9% 过冲)', values: { N: 25 } }
        ],
        lines: [
          {
            step: 0,
            sub: '上一集我们知道信号能拆到正交基上。现在给周期信号选一套最牛的正交基：不同转速的旋转指针 $e^{jn\\omega_0 t}$！每个系数 $D_n$ 就是原信号在该频率上的投影。',
            tts: '上一集我们知道信号可以拆到正交基底上。现在为周期信号选一套全学期最核心的正交基：不同转速的旋转指针，也就是基波和各次谐波复指数。每个系数 D n 就是信号在这个频率分量上的投影长度。'
          },
          {
            step: 1,
            sub: '拖动滑块把阶数 $N$ 从 $1$ 拉到 $25$ 试试：方波的竖直跳变需要无限高频去“拉直”；只要频域被有限截断，跳变边沿就永远残留约 $9\\%$ 的过冲尖峰，这就是著名的吉布斯现象！',
            tts: '拖动滑块把截断阶数从一拉到二十五看看：方波垂直的跳变沿需要无穷高次谐波一起发力才能彻底拉直。只要在频域上做有限截断，时域跳变处就永远会出现大约百分之九的过冲振荡，这就是著名的吉布斯现象。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var N = Math.round(env.params.N || 5);
          var T0 = 4;
          var w0 = Math.PI / 2;

          function dnSquare(n) {
            if (n === 0) return 0;
            return (2 / (n * Math.PI)) * Math.sin((n * Math.PI) / 2);
          }
          function idealSq(t) {
            var u = wrapPeriod(t, T0, -2);
            return Math.abs(u) < 1 ? 1 : -1;
          }

          var ax1 = env.viz.drawAxes(ctx, boxes[0], {
            xMin: -4,
            xMax: 4,
            yMin: -1.45,
            yMax: 1.45,
            xGrid: 8,
            yGrid: 4,
            xTicks: [[-2, '-T₀/2'], [0, '0'], [2, 'T₀/2']],
            yTicks: [[-1, '-1'], [0, '0'], [1, '+1']],
            title: boxes[0].w < 460 ? '方波合成 (N=' + N + ')' : 'N 项谐波合成方波（N = ' + N + '，边沿过冲 ≈ 9%）'
          });
          env.viz.drawCurve(ctx, ax1, idealSq, { color: P.muted, dash: [4, 3], lineWidth: 1.4 });
          env.viz.drawCurve(ctx, ax1, function (t) {
            return env.math.fourierPartialSum(dnSquare, N, w0, t);
          }, { color: P.amber, lineWidth: 2.3 });
          if (N >= 7) {
            env.viz.drawAnnotation(ctx, ax1, 1.0, 1.2, 'Gibbs ≈1.09', P.red, 'center');
          }

          var ax2 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: -16,
            xMax: 16,
            yMin: 0,
            yMax: 0.78,
            xGrid: 8,
            yGrid: 3,
            xTicks: [[-10, '-10'], [-5, '-5'], [0, '0'], [5, '5'], [10, '10']],
            yTicks: [[0, '0'], [0.64, '2/π']],
            title: '双边幅度谱 |D_n| (截断 |n| ≤ ' + N + ')',
            subtitle: '仅奇次谐波',
            subtitleColor: P.cyan
          });
          var stems = [];
          for (var n = -15; n <= 15; n++) {
            var mag = Math.abs(dnSquare(n));
            if (mag < 1e-6) continue;
            var inside = Math.abs(n) <= N;
            stems.push({
              x: n,
              y: mag,
              color: inside ? (Math.abs(n) === 1 ? P.amber : P.cyan) : 'rgba(148,163,184,0.28)',
              width: inside ? 3.2 : 2.0,
              label: Math.abs(n) <= 3 && inside ? ('n=' + n) : undefined
            });
          }
          env.viz.drawStems(ctx, ax2, stems, {});
        }
      },
      {
        id: 's01',
        tag: '推导',
        title: '复指数 D_n、三角式换算与对称性速判法',
        slideRef: '02sigsys p.40',
        terms: [
          { en: 'Conjugate Symmetry', zh: '共轭对称 D_{-n}=D_n^*' },
          { en: 'Half-Wave Symmetry', zh: '半波奇对称（仅剩奇次谐波）' }
        ],
        symbols: [
          { sym: 'D_{-n} = D_n^*', desc: '实信号必满足：幅度偶对称，相位奇对称', color: P.cyan },
          { sym: '2|D_n|\\cos(n\\omega_0 t + \\theta_n)', desc: '±n 一对共轭复指针合成真实余弦波', color: P.amber }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: 'g(t)\\text{ 为实} \\implies D_{-n}=D_n^* \\implies |D_{-n}|=|D_n|,\\; \\theta_{-n}=-\\theta_n', label: '正负频率成对共轭，虚部互相抵消合成实波形' },
          { step: 1, latex: 'g(-t)=g(t)\\text{（偶）}\\Rightarrow D_n\\in\\mathbb{R};\\qquad g(-t)=-g(t)\\text{（奇）}\\Rightarrow D_n\\in j\\mathbb{R}', label: '偶函数全是实系数余弦；奇函数全是纯虚系数正弦' },
          { step: 2, latex: 'g(t\\pm T_0/2)=-g(t)\\text{（半波奇对称）}\\implies D_{2k}=0\\text{（仅存奇次谐波！）}', label: '半波移半周期反号，所有偶次谐波全部抵消为零' }
        ],
        sliders: [
          { key: 'part', label: '对称性演示 (0=自动, 1=偶, 2=奇, 3=一般)', min: 0, max: 3, step: 1, default: 0 }
        ],
        presets: [
          { label: '随讲解自动切换', values: { part: 0 } },
          { label: '偶对称 (纯实谱+半波奇)', values: { part: 1 } },
          { label: '奇对称 (纯虚谱)', values: { part: 2 } },
          { label: '非奇非偶 (复数谱)', values: { part: 3 } }
        ],
        lines: [
          {
            step: 0,
            sub: '真实世界里的电信号都是实函数，所以一对正负频率系数必然共轭：$D_{-n} = D_n^*$。它们分别顺时针与逆时针等速旋转，虚部恰好相互抵消，加起来正好得到三角形式 $2|D_n|\\cos(n\\omega_0 t + \\theta_n)$！',
            tts: '真实世界里的信号都是实函数，因此正频率和负频率系数必然互为共轭对称，幅度偶对称而相位奇对称。它们一个逆时针转一个顺时针转，虚部刚好完全抵消，合起来正好还原成二倍模长乘以余弦的三角形式。'
          },
          {
            step: 1,
            sub: '做题前先瞄一眼时域对称性，能少算一半积分！如果波形左右偶对称，$D_n$ 全是实数（只有余弦，相位非 $0$ 即 $\\pi$）；如果奇对称，$D_n$ 全是纯虚数（只有正弦，相位 $\\pm\\pi/2$）。',
            tts: '考场算频谱前先看一眼对称性，能直接省掉一大半积分。如果波形左右偶对称，所有系数全都是实数，只含余弦；如果波形关于原点奇对称，所有系数全都是纯虚数，只含正弦。'
          },
          {
            step: 2,
            sub: '还有一招半波奇对称：把波形平移半个周期 $T_0/2$ 刚好等于原来取反号，比如常见对称方波，此时所有偶次谐波积分正负抵消，直接只剩 $n=\\pm 1, \\pm 3, \\pm 5$ 等奇次谐波！',
            tts: '还有一招必考的半波奇对称：如果把波形平移半个周期恰好变成原来的反号，比如标准对称方波，那么所有偶次谐波的周期积分都会彻底抵消归零，频谱里只剩下奇次谐波。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var mode = resolvePart(env, 3);
          var T0 = 4;
          var w0 = Math.PI / 2;

          var labels = ['偶对称方波：D_n 全实且仅奇次', '奇对称锯齿波：D_n 全纯虚', '偏置矩形脉冲：非奇非偶 (复数谱)'];
          var ax1 = env.viz.drawAxes(ctx, boxes[0], {
            xMin: -3,
            xMax: 3,
            yMin: -1.3,
            yMax: 1.35,
            xGrid: 6,
            yGrid: 4,
            xTicks: [[-2, '-T₀/2'], [0, '0'], [2, 'T₀/2']],
            yTicks: [[-1, '-1'], [0, '0'], [1, '+1']],
            title: boxes[0].w < 460 ? ['偶对称+半波奇', '奇对称锯齿', '偏置复数谱'][mode] : labels[mode]
          });
          env.viz.drawCurve(ctx, ax1, function (t) {
            var u = wrapPeriod(t, T0, -2);
            if (mode === 0) return Math.abs(u) < 1 ? 1 : -1;
            if (mode === 1) return u / 2;
            return (u >= 0 && u < 1.5) ? 1 : 0;
          }, { color: P.cyan, lineWidth: 2.3, fillAlpha: 0.14 });

          var ax2 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: -6.5,
            xMax: 6.5,
            yMin: -0.75,
            yMax: 0.75,
            xGrid: 6,
            yGrid: 4,
            xTicks: [[-5, '-5'], [-2, '-2'], [0, '0'], [2, '2'], [5, '5']],
            yTicks: [[-0.5, '-0.5'], [0, '0'], [0.5, '+0.5']],
            title: boxes[1].w < 460 ? '青=Re(D_n), 粉=Im(D_n)' : '系数分量：青 = Re(D_n)（实部），粉 = Im(D_n)（虚部）'
          });
          var stems = [];
          for (var n = -6; n <= 6; n++) {
            var re = 0;
            var im = 0;
            if (mode === 0) {
              re = n === 0 ? 0 : (2 / (n * Math.PI)) * Math.sin((n * Math.PI) / 2);
            } else if (mode === 1) {
              im = n === 0 ? 0 : Math.pow(-1, Math.abs(n)) / (n * Math.PI);
            } else {
              if (n === 0) {
                re = 1.5 / T0;
              } else {
                var a = n * w0 * 1.5;
                re = Math.sin(a) / (n * Math.PI * 2);
                im = (Math.cos(a) - 1) / (n * Math.PI * 2);
              }
            }
            if (Math.abs(re) > 1e-4) stems.push({ x: n - 0.14, y: re, color: P.cyan, width: 3.0 });
            if (Math.abs(im) > 1e-4) stems.push({ x: n + 0.14, y: im, color: P.pink, width: 3.0 });
          }
          env.viz.drawStems(ctx, ax2, stems, {});
        }
      },
      {
        id: 's02',
        tag: '推导',
        title: 'Parseval 功率守恒与“微分冲激法”求频谱大杀器',
        slideRef: '02sigsys p.41',
        terms: [
          { en: "Parseval's Theorem", zh: '帕塞瓦尔功率守恒定理' },
          { en: 'Impulse-Train Method', zh: '微分变冲激串速算法' }
        ],
        symbols: [
          { sym: '\\frac{1}{T_0}\\int_{T_0}|g(t)|^2 dt = \\sum_{n=-\\infty}^{\\infty}|D_n|^2', desc: '时域均方功率 = 所有谐波模平方之和', color: P.green },
          { sym: 'g^{(k)}(t) \\leftrightarrow (jn\\omega_0)^k D_n', desc: '求 k 次导直到出现 δ 冲激串，免去分部积分', color: P.amber }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: '\\text{Parseval：} P_g = \\frac{1}{T_0}\\int_{T_0}|g(t)|^2 dt = \\sum_{n=-\\infty}^{\\infty}|D_n|^2', label: '无穷维空间的勾股定理：0/1方波 P=0.5 = 1/4 + (2/π²)(1+1/9+…)' },
          { step: 1, latex: 'g\'\'(t) = \\text{冲激串 }\\sum a_i\\delta(t-t_i) \\implies (jn\\omega_0)^2 D_n = \\frac{1}{T_0}\\sum a_i e^{-jn\\omega_0 t_i}', label: '考前杀器：分段线性波求导至冲激，直接带走 D_n！' },
          { step: 2, latex: '\\text{或写成卷积：} g_0(t)=\\text{rect}_1 * \\text{rect}_2 \\implies D_n = \\frac{1}{T_0}G_0(nf_0)\\text{ 两 sinc 直接相乘}', label: '对称梯形/三角波优先用卷积，连微分都省了' }
        ],
        sliders: [
          { key: 'N', label: '纳入统计的谐波阶数 N', min: 1, max: 15, step: 2, default: 5 }
        ],
        presets: [
          { label: '仅基波 (N=1)', values: { N: 1 } },
          { label: '前 5 阶 (N=5, 功率>95%)', values: { N: 5 } },
          { label: '高阶逼近 (N=15, >98%)', values: { N: 15 } }
        ],
        lines: [
          {
            step: 0,
            sub: '在正交空间里，矢量模的平方等于各个正交坐标的平方和。换到傅里叶级数里就是 Parseval 定理：时域算一周期平均功率，严格等于频域所有谐波 $|D_n|^2$ 累加！比如 $0/1$ 方波总功率 $0.5$，基波和直流就占了 $85\\%$ 以上。',
            tts: '在正交坐标系里，向量长度的平方等于各轴分量的平方和。放到傅里叶级数里，就是大名鼎鼎的帕塞瓦尔定理：时域里算一个周期的平均功率，严格等于频域里所有谐波系数模平方的总和。哪怕只取前几阶谐波，功率往往就已经达到百分之九十五以上。'
          },
          {
            step: 1,
            sub: '另外考场上遇到三角波、斜坡或梯形波，千万别硬着头皮分部积分！记住第一大杀器“微分冲激法”：对分段直线连续求导，直到在拐点跳出 $\\delta$ 冲激，然后用 $g^{(k)}\\leftrightarrow(jn\\omega_0)^k D_n$ 直接读出 $D_n$！',
            tts: '考场上遇到三角波、锯齿波或梯形波，千万别傻傻去硬算分部积分。记住第一大杀器微分冲激法：对分段直线波反复求导，直到在拐点处跳出冲激函数，然后直接利用微分的频域因子 j n 欧米伽零，一秒读出系数 D n。'
          },
          {
            step: 2,
            sub: '如果波形正好左右对称，比如梯形波或三角波，还能用第二大杀器“卷积法”：把单个脉冲拆成两个矩形的卷积，频谱直接就是两个 $\\operatorname{sinc}$ 函数相乘，零失误秒杀！',
            tts: '如果波形正好左右对称，比如等腰梯形或三角波，第二大杀器卷积法更爽：直接把单个周期脉冲拆成两个矩形脉冲的卷积，再套用时域卷积等于频域相乘，两个辛克函数一乘立刻秒杀！'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var N = Math.round(env.params.N || 5);

          // Panel 1: Triangle wave & its 1st/2nd derivatives (impulse train)
          var ax1 = env.viz.drawAxes(ctx, boxes[0], {
            xMin: -2.2,
            xMax: 2.2,
            yMin: -2.2,
            yMax: 2.2,
            xGrid: 4,
            yGrid: 4,
            xTicks: [[-2, '-2'], [-1, '-1'], [0, '0'], [1, '1'], [2, '2']],
            yTicks: [[-2, '-2'], [0, '0'], [1, '1'], [2, '+2']],
            title: boxes[0].w < 460 ? '三角波 → 方波 → δ 冲激串' : '微分冲激法：三角波 g(t) → g\'(t) 方波 → g\'\'(t) 冲激串'
          });
          env.viz.drawCurve(ctx, ax1, function (t) {
            var u = wrapPeriod(t, 4, -2);
            return Math.abs(u) <= 1 ? 1 - Math.abs(u) : 0;
          }, { color: P.cyan, lineWidth: 2.3 });
          env.viz.drawCurve(ctx, ax1, function (t) {
            var u = wrapPeriod(t, 4, -2);
            if (u > -1 && u < 0) return 1;
            if (u > 0 && u < 1) return -1;
            return 0;
          }, { color: P.amber, dash: [4, 3], lineWidth: 1.5 });
          env.viz.drawStems(ctx, ax1, [
            { x: -1, y: 1, color: P.pink, width: 2.5, arrow: true, label: '+δ' },
            { x: 0, y: -2, color: P.pink, width: 2.8, arrow: true, label: '-2δ' },
            { x: 1, y: 1, color: P.pink, width: 2.5, arrow: true, label: '+δ' }
          ], {});

          // Panel 2: Parseval cumulative power percentage for 0/1 square wave (P_total = 0.5)
          var cum = [];
          var pTot = 0.5;
          var run = 0.25; // |D0|^2 = 0.25
          for (var k = 1; k <= 15; k++) {
            var dk = k % 2 === 1 ? (1 / (k * Math.PI)) : 0;
            run += 2 * dk * dk;
            cum.push([k, (run / pTot) * 100]);
          }
          var pctNow = cum[Math.min(14, Math.max(0, N - 1))][1];

          var ax2 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: 0.5,
            xMax: 15.5,
            yMin: 60,
            yMax: 103,
            xGrid: 5,
            yGrid: 4,
            xTicks: [[1, '1'], [5, '5'], [9, '9'], [15, '15']],
            yTicks: [[70, '70%'], [85, '85%'], [100, '100%']],
            title: 'Parseval 功率累计占比 (0/1 方波)',
            subtitle: 'N=' + N + ' → ' + pctNow.toFixed(1) + '%',
            subtitleColor: P.green
          });
          env.viz.drawCurve(ctx, ax2, function () { return 100; }, { color: P.green, dash: [4, 4], lineWidth: 1.4 });
          env.viz.drawStepCurve(ctx, ax2, cum, { color: P.cyan, lineWidth: 2.2 });
          env.viz.drawStems(ctx, ax2, [{ x: N, y: pctNow, color: P.amber, width: 3.5 }], {});
        }
      },
      {
        id: 's03',
        tag: '作业精讲',
        hwCode: '2.9-1',
        title: 'HW1 作业 2.9-1 (a)(b)(c)：方波、窄脉冲与锯齿波谱',
        slideRef: 'HW1 · 2.9-1 (a)-(c)',
        terms: [
          { en: 'Double-Sided Magnitude Spectrum', zh: '双边幅度谱 |D_n|' },
          { en: 'Sinc Envelope Zeros', zh: '辛克包络零点' }
        ],
        symbols: [
          { sym: '(a)\\; T_0=4,\\; D_n=\\frac{2}{n\\pi}\\sin\\frac{n\\pi}{2}', desc: '偶对称 ±1 方波，仅奇次实谐波', color: P.cyan },
          { sym: '(b)\\; T_0=10\\pi,\\; D_n=\\frac{\\sin(n\\pi/5)}{n\\pi}', desc: '宽 2π 矩形脉冲，n=5k 处出现谱零点', color: P.amber },
          { sym: '(c)\\; T_0=2\\pi,\\; D_n=\\frac{j}{2\\pi n}', desc: '单边锯齿波，D₀=0.5，相位 ±π/2', color: P.pink }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: '(a)\\; D_0=0,\\quad D_n=\\frac{2}{n\\pi}\\sin\\frac{n\\pi}{2}=\\frac{2(-1)^{(n-1)/2}}{n\\pi}\\ (n\\text{ 奇}),\\quad \\text{相位 }0\\text{ 或 }\\pi', label: '偶对称方波：全实系数，偶次谐波全 0' },
          { step: 1, latex: '(b)\\; D_0=0.2,\\quad D_n=\\frac{1}{10\\pi}\\int_{-\\pi}^{\\pi}e^{-j0.2nt}dt=\\frac{\\sin(n\\pi/5)}{n\\pi}\\quad(n=5k\\text{ 为零})', label: '占空比 2π/(10π)=1/5，所以第 5, 10, 15 根谱线精准归零' },
          { step: 2, latex: '(c)\\; D_0=\\frac{1}{2},\\quad D_n=\\frac{1}{4\\pi^2}\\int_0^{2\\pi}te^{-jnt}dt=\\frac{j}{2\\pi n}\\ (n\\neq 0),\\quad |D_n|=\\frac{1}{2\\pi|n|}', label: '去掉直流 0.5 后整体奇对称，故所有非零谐波全为纯虚数' }
        ],
        sliders: [
          { key: 'part', label: '小题切换 (0=自动, 1=(a), 2=(b), 3=(c))', min: 0, max: 3, step: 1, default: 0 }
        ],
        presets: [
          { label: '随讲解自动切换', values: { part: 0 } },
          { label: '(a) 偶方波 T₀=4', values: { part: 1 } },
          { label: '(b) 窄脉冲 T₀=10π', values: { part: 2 } },
          { label: '(c) 单边锯齿 T₀=2π', values: { part: 3 } }
        ],
        lines: [
          {
            step: 0,
            sub: '来看作业 2.9-1 的前三小题！先看 (a)：周期 $T_0=4$ 的偶对称 $\\pm 1$ 方波，均值 $D_0=0$，直接算得 $D_n = \\frac{2}{n\\pi}\\sin\\frac{n\\pi}{2}$。因为既偶对称又半波奇对称，系数全为实数，且只剩奇次谐波，相位随正负号在 $0$ 与 $\\pi$ 之间交替！',
            tts: '来看作业二点九杠一的前三小题。先看第 a 小题：周期为四的偶对称正负一方波，直流均值为零，算得第 n 项系数等于 n 派分之二乘以 sin 二分之 n 派。因为它既偶对称又满足半波奇对称，系数全都是实数，而且只剩下奇次谐波。'
          },
          {
            step: 1,
            sub: '再看 (b)：周期 $T_0=10\\pi$、脉冲宽 $2\\pi$ 的矩形波，占空比刚好 $1/5$！直流 $D_0=0.2$，系数 $D_n = \\frac{\\sin(n\\pi/5)}{n\\pi}$ 沿着 $\\operatorname{sinc}$ 包络起伏，在 $n = \\pm 5, \\pm 10$ 等 $5$ 的倍数处精准跌为零！',
            tts: '再看第 b 小题：周期是十派、脉冲宽度为二派的窄矩形脉冲，占空比正好是五分之一。所以直流分量是零点二，系数按照辛克函数包络起伏，每逢五的倍数，比如正负五和正负十，谱线就精准归零。'
          },
          {
            step: 2,
            sub: '接着看 (c)：单边锯齿波 $g(t)=t/(2\\pi)$（$0<t<2\\pi$），直流平均高度是三角形中值 $D_0=1/2$；算得非零项 $D_n = \\frac{j}{2\\pi n}$。注意一个小巧思：扣掉直流 $0.5$ 后它其实就是个奇函数，所以非零谐波全为纯虚数，幅度按 $1/|n|$ 慢衰减！',
            tts: '接着看第 c 小题：周期二派的单边斜坡锯齿波，直流高度正好是三角形中点二分之一；非零项算得 j 除以二派 n。其实把它往下平移零点五，就是奇对称波形，所以除了直流项以外全都是纯虚数，幅度随 n 分之一缓慢衰减。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var subIdx = resolvePart(env, 3);

          var configs = [
            {
              title: '(a) 偶方波 T₀=4',
              xMin: -4,
              xMax: 4,
              yMin: -1.35,
              yMax: 1.35,
              T0: 4,
              w0: Math.PI / 2,
              fn: function (t) { return Math.abs(wrapPeriod(t, 4, -2)) < 1 ? 1 : -1; },
              dn: function (n) { return n === 0 ? 0 : (2 / (n * Math.PI)) * Math.sin((n * Math.PI) / 2); },
              xTicks: [[-2, '-2'], [0, '0'], [2, '2']],
              yTicks: [[-1, '-1'], [0, '0'], [1, '+1']],
              specMax: 0.72,
              specSub: '仅奇次谐波'
            },
            {
              title: '(b) 窄脉冲 T₀=10π',
              xMin: -10 * Math.PI,
              xMax: 10 * Math.PI,
              yMin: -0.2,
              yMax: 1.25,
              T0: 10 * Math.PI,
              w0: 0.2,
              fn: function (t) { return Math.abs(wrapPeriod(t, 10 * Math.PI, -5 * Math.PI)) < Math.PI ? 1 : 0; },
              dn: function (n) { return n === 0 ? 0.2 : Math.sin((n * Math.PI) / 5) / (n * Math.PI); },
              xTicks: [[-5 * Math.PI, '-5π'], [0, '0'], [5 * Math.PI, '5π']],
              yTicks: [[0, '0'], [1, '1']],
              specMax: 0.24,
              specSub: 'n=±5,±10 为零'
            },
            {
              title: '(c) 锯齿波 T₀=2π',
              xMin: -2 * Math.PI,
              xMax: 2 * Math.PI,
              yMin: -0.2,
              yMax: 1.2,
              T0: 2 * Math.PI,
              w0: 1,
              fn: function (t) { return wrapPeriod(t, 2 * Math.PI, 0) / (2 * Math.PI); },
              dn: function (n) { return n === 0 ? 0.5 : { re: 0, im: 1 / (2 * Math.PI * n) }; },
              xTicks: [[-2 * Math.PI, '-2π'], [0, '0'], [2 * Math.PI, '2π']],
              yTicks: [[0, '0'], [0.5, '0.5'], [1, '1']],
              specMax: 0.56,
              specSub: 'D₀=0.5, 相位±π/2'
            }
          ];
          var cfg = configs[subIdx];

          var ax1 = env.viz.drawAxes(ctx, boxes[0], {
            xMin: cfg.xMin,
            xMax: cfg.xMax,
            yMin: cfg.yMin,
            yMax: cfg.yMax,
            xGrid: 4,
            yGrid: 4,
            xTicks: cfg.xTicks,
            yTicks: cfg.yTicks,
            title: cfg.title
          });
          env.viz.drawCurve(ctx, ax1, cfg.fn, { color: P.cyan, lineWidth: 2.3, fillAlpha: 0.14 });
          env.viz.drawCurve(ctx, ax1, function (t) {
            return env.math.fourierPartialSum(cfg.dn, 9, cfg.w0, t);
          }, { color: P.amber, dash: [4, 3], lineWidth: 1.5 });

          var ax2 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: -12.5,
            xMax: 12.5,
            yMin: 0,
            yMax: cfg.specMax,
            xGrid: 6,
            yGrid: 3,
            xTicks: [[-10, '-10'], [-5, '-5'], [0, '0'], [5, '5'], [10, '10']],
            yTicks: [[0, '0'], [cfg.specMax * 0.8, (cfg.specMax * 0.8).toFixed(2)]],
            title: boxes[1].w < 460 ? '双边谱 |D_n|' : '双边幅度谱 |D_n|（琥珀虚线=9阶重构验证）',
            subtitle: cfg.specSub,
            subtitleColor: P.amber
          });

          if (subIdx === 1) {
            env.viz.drawCurve(ctx, ax2, function (n) {
              return Math.abs(0.2 * env.math.sinc(n / 5));
            }, { color: P.muted, dash: [4, 3], lineWidth: 1.3 });
          }

          var stems = [];
          for (var n = -12; n <= 12; n++) {
            var v = cfg.dn(n);
            var mag = typeof v === 'number' ? Math.abs(v) : Math.hypot(v.re, v.im);
            var col = P.cyan;
            if (typeof v === 'number' && v < 0) col = P.pink;
            if (typeof v !== 'number') col = n === 0 ? P.green : P.amber;
            stems.push({
              x: n,
              y: mag,
              color: col,
              width: 3.2,
              label: (subIdx === 1 && (n === 5 || n === -5 || n === 10 || n === -10)) ? '0' : undefined
            });
          }
          env.viz.drawStems(ctx, ax2, stems, {});
        }
      },
      {
        id: 's04',
        tag: '作业精讲',
        hwCode: '2.9-1 (d)-(f)',
        title: 'HW1 作业 2.9-1 (d)(e)(f)：奇斜坡、非对称锯齿与卷积梯形',
        slideRef: 'HW1 · 2.9-1 (d)-(f)',
        terms: [
          { en: 'Convolution Factorization', zh: '脉冲卷积分解法' },
          { en: 'Asymmetric Complex Spectrum', zh: '非对称复数谱' }
        ],
        symbols: [
          { sym: '(d)\\; D_n=-j\\!\\left[\\frac{2\\sin(n\\pi/2)}{\\pi^2 n^2}-\\frac{\\cos(n\\pi/2)}{\\pi n}\\right]', desc: '奇对称截断斜坡（纯虚系数）', color: P.pink },
          { sym: '(e)\\; D_n=\\frac{1}{3}\\!\\left[\\frac{je^{-ja}}{a}+\\frac{e^{-ja}-1}{a^2}\\right],\\; a=\\frac{2\\pi n}{3}', desc: '一般复数谱（D₀=1/6，无奇偶性）', color: P.amber },
          { sym: '(f)\\; D_n=\\frac{6\\sin(n\\pi/2)\\sin(n\\pi/6)}{\\pi^2 n^2}', desc: '宽3与宽1矩形卷积秒出梯形谱（仅奇次）', color: P.green }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: '(d)\\; g(t)=\\frac{4}{\\pi}t\\ (|t|<\\frac{\\pi}{4}),\\; T_0=\\pi \\implies D_0=0,\\quad D_n=-j\\!\\left[\\frac{2\\sin(n\\pi/2)}{\\pi^2 n^2}-\\frac{\\cos(n\\pi/2)}{\\pi n}\\right]', label: '奇函数保证 D_n 纯虚（相位 ±π/2）' },
          { step: 1, latex: '(e)\\; g(t)=t\\ (0<t<1),\\; T_0=3,\\; a=\\frac{2\\pi n}{3} \\implies D_0=\\frac{1}{6},\\; D_n=\\frac{1}{3}\\!\\left[\\frac{je^{-ja}}{a}+\\frac{e^{-ja}-1}{a^2}\\right]', label: '既非奇也非偶：系数既有实部又有虚部，满足 D_{-n}=D_n^*' },
          { step: 2, latex: '(f)\\; \\text{梯形}=\\text{rect}(\\frac{t}{3})*\\text{rect}(t) \\implies G_0(f)=\\frac{\\sin 3\\pi f}{\\pi f}\\frac{\\sin\\pi f}{\\pi f} \\implies D_n=\\frac{1}{6}G_0(\\frac{n}{6})', label: '绝招秒杀：取 f=n/6 直接写出两个 sinc 相乘，偶次全 0！' }
        ],
        sliders: [
          { key: 'part', label: '小题切换 (0=自动, 1=(d), 2=(e), 3=(f))', min: 0, max: 3, step: 1, default: 0 }
        ],
        presets: [
          { label: '随讲解自动切换', values: { part: 0 } },
          { label: '(d) 奇斜坡 T₀=π', values: { part: 1 } },
          { label: '(e) 非对称斜坡 T₀=3', values: { part: 2 } },
          { label: '(f) 卷积秒杀梯形 T₀=6', values: { part: 3 } }
        ],
        lines: [
          {
            step: 0,
            sub: '接着完成 2.9-1 的后三小题！看 (d)：周期 $T_0=\\pi$ 内只占一半宽度的奇对称斜坡。对称性一眼锁定 $D_0=0$ 且 $D_n$ 纯虚，用分部积分一次算出包含 $\\sin(n\\pi/2)$ 与 $\\cos(n\\pi/2)$ 的表达式，注意奇偶次项都不会全丢。',
            tts: '接着完成二点九杠一的后三小题。先看第 d 小题：周期为派的局部奇对称斜坡。奇对称性直接锁死直流为零、非零系数全为纯虚数，分部积分一次算出由正弦和余弦项组合的系数表达式。'
          },
          {
            step: 1,
            sub: '看 (e)：周期 $T_0=3$ 里只在 $[0,1]$ 有斜坡 $t$，它既不偶也不奇！所以算出的 $D_n$ 是真复数，只有共轭对称性 $D_{-n}=D_n^*$ 保底，直流均值等于三角形面积 $0.5$ 除以周期 $3$，即 $D_0=1/6$。',
            tts: '再看第 e 小题：周期为三、只在零到一区间上升的斜坡脉冲，它既不偶对称也不奇对称，所以算出的傅里叶系数是带有非零相位的复数，只剩下共轭对称性，直流均值等于三角形面积零点五除以周期三，等于六分之一。'
          },
          {
            step: 2,
            sub: '压轴绝招看 (f)：顶宽 $2$、底宽 $4$、周期 $6$ 的梯形脉冲，硬积分要分三段积到天亮！把它看成宽 $3$ 和宽 $1$ 两个矩形脉冲的卷积，频谱立刻写成两个 $\\operatorname{sinc}$ 相乘，再令 $f=n/6$ 除以周期 $6$，一秒写出 $D_n$，偶次谐波因 $\\sin(n\\pi/2)=0$ 全部归零！',
            tts: '压轴绝招看第 f 小题：顶宽二、底宽四、周期为六的梯形脉冲，硬算要分三段积分到天亮。我们直接把它拆成宽度为三和宽度为一的两个矩形脉冲的卷积，单脉冲频谱立刻变成两个辛克函数相乘，再代入六分之 n 除以周期六，一步秒杀得出所有偶次谐波全部归零！'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var subIdx = resolvePart(env, 3);

          var configs = [
            {
              title: '(d) 奇对称斜坡 T₀=π',
              xMin: -Math.PI,
              xMax: Math.PI,
              yMin: -1.25,
              yMax: 1.25,
              T0: Math.PI,
              w0: 2,
              fn: function (t) {
                var u = wrapPeriod(t, Math.PI, -Math.PI / 2);
                return Math.abs(u) < Math.PI / 4 ? (4 / Math.PI) * u : 0;
              },
              dn: function (n) {
                if (n === 0) return 0;
                var term = (2 * Math.sin((n * Math.PI) / 2)) / (Math.PI * Math.PI * n * n) - Math.cos((n * Math.PI) / 2) / (Math.PI * n);
                return { re: 0, im: -term };
              },
              xTicks: [[-Math.PI / 2, '-π/2'], [0, '0'], [Math.PI / 2, 'π/2']],
              yTicks: [[-1, '-1'], [0, '0'], [1, '+1']],
              specMax: 0.36,
              specSub: '纯虚系数 (奇函数)'
            },
            {
              title: '(e) 非对称斜坡 T₀=3',
              xMin: -1.5,
              xMax: 4.5,
              yMin: -0.2,
              yMax: 1.25,
              T0: 3,
              w0: (2 * Math.PI) / 3,
              fn: function (t) {
                var u = wrapPeriod(t, 3, 0);
                return u < 1 ? u : 0;
              },
              dn: function (n) {
                if (n === 0) return 1 / 6;
                var a = (2 * Math.PI * n) / 3;
                return {
                  re: (Math.sin(a) / a + (Math.cos(a) - 1) / (a * a)) / 3,
                  im: (Math.cos(a) / a - Math.sin(a) / (a * a)) / 3
                };
              },
              xTicks: [[0, '0'], [1, '1'], [3, 'T₀=3']],
              yTicks: [[0, '0'], [1, '1']],
              specMax: 0.22,
              specSub: '复数谱 (D₀=1/6)'
            },
            {
              title: '(f) 卷积梯形波 T₀=6',
              xMin: -4.5,
              xMax: 4.5,
              yMin: -0.2,
              yMax: 1.25,
              T0: 6,
              w0: Math.PI / 3,
              fn: function (t) {
                var u = wrapPeriod(t, 6, -3);
                var au = Math.abs(u);
                if (au <= 1) return 1;
                if (au <= 2) return 2 - au;
                return 0;
              },
              dn: function (n) {
                if (n === 0) return 0.5;
                return (6 * Math.sin((n * Math.PI) / 2) * Math.sin((n * Math.PI) / 6)) / (Math.PI * Math.PI * n * n);
              },
              xTicks: [[-3, '-3'], [-1.5, '-1.5'], [0, '0'], [1.5, '1.5'], [3, '3']],
              yTicks: [[0, '0'], [0.5, '0.5'], [1, '1']],
              specMax: 0.56,
              specSub: 'rect(t/3)*rect(t) → 仅奇次'
            }
          ];
          var cfg = configs[subIdx];

          var ax1 = env.viz.drawAxes(ctx, boxes[0], {
            xMin: cfg.xMin,
            xMax: cfg.xMax,
            yMin: cfg.yMin,
            yMax: cfg.yMax,
            xGrid: 4,
            yGrid: 4,
            xTicks: cfg.xTicks,
            yTicks: cfg.yTicks,
            title: cfg.title
          });
          if (subIdx === 2) {
            env.viz.drawCurve(ctx, ax1, function (t) { return env.math.rect(t / 3); }, { color: P.purple, dash: [3, 3], lineWidth: 1.4 });
            env.viz.drawCurve(ctx, ax1, function (t) { return env.math.rect(t); }, { color: P.green, dash: [3, 3], lineWidth: 1.4 });
          }
          env.viz.drawCurve(ctx, ax1, cfg.fn, { color: P.cyan, lineWidth: 2.3, fillAlpha: 0.14 });
          env.viz.drawCurve(ctx, ax1, function (t) {
            return env.math.fourierPartialSum(cfg.dn, 12, cfg.w0, t);
          }, { color: P.amber, dash: [4, 3], lineWidth: 1.5 });

          var ax2 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: -10.5,
            xMax: 10.5,
            yMin: 0,
            yMax: cfg.specMax,
            xGrid: 5,
            yGrid: 3,
            xTicks: [[-9, '-9'], [-5, '-5'], [0, '0'], [5, '5'], [9, '9']],
            yTicks: [[0, '0'], [cfg.specMax * 0.8, (cfg.specMax * 0.8).toFixed(2)]],
            title: '双边幅度谱 |D_n|',
            subtitle: cfg.specSub,
            subtitleColor: subIdx === 2 ? P.green : P.amber
          });
          var stems = [];
          for (var n = -10; n <= 10; n++) {
            var v = cfg.dn(n);
            var mag = typeof v === 'number' ? Math.abs(v) : Math.hypot(v.re, v.im);
            var col = subIdx === 2 ? (v < 0 ? P.pink : P.green) : (subIdx === 0 ? P.pink : P.amber);
            if (n === 0) col = P.cyan;
            stems.push({ x: n, y: mag, color: col, width: 3.3 });
          }
          env.viz.drawStems(ctx, ax2, stems, {});
        }
      }
    ]
  });
})(window);
