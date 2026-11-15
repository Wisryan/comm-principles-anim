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
    id: 'ep06',
    chapter: 'Ch.03 幅度调制（中）',
    title: '标准 AM、包络检波、RC 失真与功率效率极限',
    slideDeck: '03AM 课件讲义',
    slideRange: 'pp. 13–21',
    homeworkTags: ['HW1 · 4.3-2', 'HW1 · 4.3-5'],
    scenes: [
      {
        id: 's00',
        tag: '直觉',
        title: '标准 AM 为何要硬塞直流载波？调制指数 μ 与过调制失真',
        slideRef: '03AM pp.13–16',
        terms: [
          { en: 'Amplitude Modulation (AM)', zh: '常规调幅（带载波）' },
          { en: 'Modulation Index (μ)', zh: '调幅指数 / 调制度' },
          { en: 'Overmodulation', zh: '过调制相位反转失真' }
        ],
        symbols: [
          { sym: '\\varphi_{\\text{AM}}(t) = [A + m(t)]\\cos\\omega_c t', desc: '在消息上强加直流偏置 $A$ 再乘载波', color: P.amber },
          { sym: '\\mu = \\frac{m_p}{A} \\le 1', desc: '不发生包络反转失真的充要条件（对称消息）', color: P.cyan },
          { sym: '\\pi A[\\delta(\\omega+\\omega_c)+\\delta(\\omega-\\omega_c)]', desc: '角频率域载波冲激（修正课件 p.14 错印的 $A/2$）', color: P.red }
        ],
        errata: '⚠️ 课件勘误（03AM p.14）：角频率 $\\omega$ 域写载波冲激项时，误用了 $f$ 域系数 $\\frac{A}{2}[\\delta(\\omega+\\omega_c)+\\delta(\\omega-\\omega_c)]$。由于 $1 \\leftrightarrow 2\\pi\\delta(\\omega)$，角频率域正确表达式应为 $\\pi A[\\delta(\\omega+\\omega_c)+\\delta(\\omega-\\omega_c)]$（若横轴用 $f$ 才是 $\\frac{A}{2}[\\delta(f+f_c)+\\delta(f-f_c)]$）。',
        formulas: [
          { step: 0, latex: '\\varphi_{\\text{AM}}(t) = [A + m(t)]\\cos\\omega_c t = A\\cos\\omega_c t + m(t)\\cos\\omega_c t', label: '标准 AM = 纯直流载波 + DSB-SC 边带' },
          { step: 1, latex: 'A + m(t) \\ge 0 \\;\\forall t \\iff \\mu = \\frac{m_p}{A} \\le 1 \\quad(\\text{若 }\\mu > 1\\text{，检波输出 } |A+m(t)| \\text{ 失真})', label: '包络不失真黄金条件：瞬时包络必须永远非负' },
          { step: 2, latex: '\\Phi_{\\text{AM}}(\\omega) = \\frac{1}{2}\\big[M(\\omega-\\omega_c)+M(\\omega+\\omega_c)\\big] + \\pi A\\big[\\delta(\\omega-\\omega_c)+\\delta(\\omega+\\omega_c)\\big]', label: '正确角频率频谱（修正 p.14 课件系数 A/2 → πA）' }
        ],
        sliders: [
          { key: 'mu', label: '调制指数 μ = m_p / A', min: 0.2, max: 2.0, step: 0.1, default: 0.8 }
        ],
        presets: [
          { label: '欠调制正常 (μ=0.5)', values: { mu: 0.5 } },
          { label: '满调制临界 (μ=1.0)', values: { mu: 1.0 } },
          { label: '过调制反转失真 (μ=1.6)', values: { mu: 1.6 } }
        ],
        lines: [
          {
            step: 0,
            sub: 'DSB-SC 接收机必须配精密本地振荡器做相干解调，早期老式收音机根本负担不起！工程师想出个聪明“笨办法”：发送端在 $m(t)$ 上硬加一个正直流偏置 $A$，变成 $[A + m(t)]\\cos\\omega_c t$！',
            tts: '上一集我们看到 D S B S C 接收机必须生成同频同相的本地载波，这在早期的便携收音机里成本太高。工程师于是想出一个巧妙办法：发送端主动在消息上硬加一个大直流偏置 A，让总振幅永远保持正数，再乘上余弦载波，这就是常规调幅 A M。'
          },
          {
            step: 1,
            sub: '只要保证 $A + m(t) \\ge 0$（即调制度 $\\mu = m_p / A \\le 1$），载波就永远不发生 $180^\\circ$ 反相，外轮廓线就是原汁原味的 $A + m(t)$！拖动滑块让 $\\mu$ 超过 $1$ 试试：波谷直接穿破零线凹陷反转，包络检波器只能拾取绝对值 $|A + m(t)|$，底边翻折严重失真！',
            tts: '只要调制度缪等于峰值 m p 除以 A 不超过一，括号里的瞬时包络就永远不会变成负数，载波也就不再发生一百八十度反相，外轮廓完全忠实地贴着消息信号起伏。把滑块拉过一点零试试看：谷底穿破零线后发生反相，红色包络变成向上翻折的绝对值，声音就会刺耳失真。'
          },
          {
            step: 2,
            sub: '特别注意 03AM 第 14 页有一个经典课件勘误：频谱在角频率 $\\omega$ 域把 $A\\cos\\omega_c t$ 的冲激系数印成了 $\\frac{A}{2}$，那是 $f$ 域的系数！在 $\\omega$ 域必须乘 $2\\pi$，即 $\\pi A[\\delta(\\omega-\\omega_c)+\\delta(\\omega+\\omega_c)]$！',
            tts: '顺便标出课件第十四页的一个经典勘误：课件在角频率欧米伽域写载波冲激项时，误用了频率 f 域的系数二分之 A。因为直流一对应二派德尔塔欧米伽，角频率域的正确系数必须是派倍的 A，答题时千万看清横轴是 f 还是欧米伽。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var mu = env.params.mu || 0.8;
          var A = 1.0;
          var mp = mu * A;
          var fc = 22;
          var envTrue = function (t) { return A + mp * Math.cos(2 * Math.PI * 1.5 * t); };
          var envDet = function (t) { return Math.abs(envTrue(t)); };
          var amFn = function (t) { return envTrue(t) * Math.cos(2 * Math.PI * fc * t); };
          var over = mu > 1.001;

          var narrow0 = boxes[0].w < 460;
          var yLim = Math.max(2.6, A + mp + 0.4);
          var ax1 = env.viz.drawAxes(ctx, boxes[0], {
            xMin: 0,
            xMax: 1.0,
            yMin: -yLim,
            yMax: yLim,
            xGrid: 4,
            yGrid: 4,
            xTicks: [[0, '0'], [0.5, '0.5'], [1.0, '1.0']],
            yTicks: [[-A, '-A'], [0, '0'], [A, '+A']],
            title: narrow0 ? 'AM波形 (μ=' + mu.toFixed(1) + ')' : 'AM 波形与包络对比（蓝虚=真实 A+m，红=检波输出 |A+m|）',
            subtitle: over ? '过调制失真!' : (Math.abs(mu - 1) < 0.05 ? '临界 μ=1' : '正常包络'),
            subtitleColor: over ? P.red : P.green
          });
          env.viz.drawCurve(ctx, ax1, amFn, { samples: 700, color: P.amber, lineWidth: 1.3 });
          env.viz.drawCurve(ctx, ax1, envTrue, { samples: 240, color: P.cyan, lineWidth: 2.0, dash: [5, 3] });
          env.viz.drawCurve(ctx, ax1, envDet, { samples: 240, color: over ? P.red : P.green, lineWidth: 2.2 });
          if (over) {
            env.viz.drawAnnotation(ctx, ax1, 0.33, envDet(0.33) + 0.15, 'A+m<0 底边翻折!', P.red, 'center');
          }

          var narrow1 = boxes[1].w < 460;
          var ax2 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: -32,
            xMax: 32,
            yMin: 0,
            yMax: 1.35,
            xGrid: 6,
            yGrid: 3,
            xTicks: [[-fc, '-fc'], [0, '0'], [fc, '+fc']],
            yTicks: [[0.5, '边带'], [1.1, '载波δ']],
            title: narrow1 ? 'AM 频谱 (含载波冲激)' : 'AM 频谱：双边带 + 中心载波冲激（f 域 A/2，ω 域 πA）'
          });
          var sbH = Math.min(0.85, 0.45 * mu);
          env.viz.drawCurve(ctx, ax2, dome(-fc, 4.5, sbH), { from: -fc - 5, to: -fc + 5, color: P.cyan, lineWidth: 2.2, fillAlpha: 0.20 });
          env.viz.drawCurve(ctx, ax2, dome(fc, 4.5, sbH), { from: fc - 5, to: fc + 5, color: P.cyan, lineWidth: 2.2, fillAlpha: 0.20 });
          env.viz.drawStems(ctx, ax2, [
            { x: -fc, y: 1.12, color: P.amber, width: 2.4, arrow: true, label: narrow1 ? 'A/2' : 'f域A/2 (ω域πA)' },
            { x: fc, y: 1.12, color: P.amber, width: 2.4, arrow: true, label: narrow1 ? 'A/2' : 'f域A/2 (ω域πA)' }
          ], {});
        }
      },
      {
        id: 's01',
        tag: '作业精讲',
        hwCode: '4.3-2',
        title: 'HW1 作业 4.3-2：锯齿波 AM 波形与调制指数反推载波 A',
        slideRef: '03AM p.45 · HW 4.3-2',
        terms: [
          { en: 'Sawtooth Baseband', zh: '周期锯齿调制波' },
          { en: 'Envelope Polarity Flip', zh: '过零反转与 DSB-SC 退化' }
        ],
        symbols: [
          { sym: 'm_p = 2,\\; T = 0.1\\text{ s}', desc: '原题锯齿波幅值 $\\pm 2\\text{ V}$，斜率 $40\\text{ V/s}$', color: P.cyan },
          { sym: 'A = m_p / \\mu = 2 / \\mu', desc: '由目标调制度 $\\mu$ 反推直流载波 $A$', color: P.amber },
          { sym: '\\pm(A + m(t))', desc: '上下包络轮廓线（$A < 2$ 时交叉反相）', color: P.green }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: '\\mu = \\frac{m_p}{A} \\implies A = \\frac{2}{\\mu} \\quad\\Longrightarrow\\quad \\text{(a) }\\mu=0.5\\Rightarrow A=4;\\quad \\text{(b) }\\mu=1\\Rightarrow A=2', label: '(a)(b) 正常与临界包络：A=4 时包络 2~6；A=2 时谷底刚好触零 0~4' },
          { step: 1, latex: '\\text{(c) }\\mu=2\\Rightarrow A=1\\;(\\text{当 }m<-1\\text{ 时 }A+m<0\\text{ 反转 }180^\\circ,\\text{ 检波成 }|A+m|)', label: '(c) 过调制：A+m 出现负区，包络交叉并发生相位突变' },
          { step: 2, latex: '\\text{(d) }\\mu=\\infty \\Rightarrow A=0 \\implies \\varphi(t)=m(t)\\cos\\omega_c t\\;(\\text{彻底退化为 DSB-SC!})', label: '(d) 无载波极限：A=0 变成纯 DSB-SC，每次锯齿过零都反相' }
        ],
        sliders: [
          { key: 'A', label: '直流载波幅度 A = 2 / μ', min: 0, max: 4.5, step: 0.5, default: 4.0 }
        ],
        presets: [
          { label: '(a) μ=0.5 (A=4)', values: { A: 4.0 } },
          { label: '(b) μ=1.0 (A=2 临界)', values: { A: 2.0 } },
          { label: '(c) μ=2.0 (A=1 过调制)', values: { A: 1.0 } },
          { label: '(d) μ=∞ (A=0 DSB-SC)', values: { A: 0.0 } }
        ],
        lines: [
          {
            step: 0,
            sub: '作业 4.3-2 给了一个周期 $T=0.1\\text{ s}$、峰值 $\\pm 2$ 的锯齿波 $m(t)$（斜率 $40\\text{ V/s}$），要求分别画出 $\\mu = 0.5, 1, 2, \\infty$ 的 AM 波形！记住核心公式 $\\mu = m_p / A$，反推 $A = 2/\\mu$：当 $\\mu=0.5$ 时 $A=4$，包络在 $2\\sim 6$ 起伏；当 $\\mu=1$ 时 $A=2$，包络斜坡底端刚好触及零线，是无失真的临界点！',
            tts: '来看作业四点三杠二：题图给出了周期零点一秒、峰值正负二的锯齿波，斜率是每秒四十伏。记住公式，调制度缪等于峰值 m p 除以载波幅度 A，所以反推 A 等于二除以缪。当缪等于零点五时，A 等于四，包络稳稳在二到六之间起伏；当缪等于一时，A 等于二，锯齿底端刚好碰到零伏，是不过调制的临界线。'
          },
          {
            step: 1,
            sub: '点按预设 (c) $\\mu=2$（$A=1$）：在锯齿左边 $m < -1$ 的一段，$A+m(t)$ 变成了负数！此时上下两条包络线交叉打结，高频载波在这里发生 $180^\\circ$ 反相，普通包络检波器只能输出红色的绝对值 $|A+m(t)|$，斜坡底端硬生生折出一个向上的小三角尖！',
            tts: '切到第三小问缪等于二，此时 A 等于一。在锯齿前半段 m 小于负一时，A 加 m 变成负数，上下两条绿色虚线包络在零点处交叉打结，高频载波立刻发生一百八十度反相。普通包络检波只能得到红色绝对值曲线，在底部折出一个倒三角失真。'
          },
          {
            step: 2,
            sub: '点按预设 (d) $\\mu=\\infty$（$A=0$）：载波直流分量彻底归零，信号变成 $m(t)\\cos\\omega_c t$——这正是我们上集学的 DSB-SC！每次锯齿从 $-2$ 升到 $+2$ 穿过零点，以及周期跳回时，相位都要狠狠翻转！',
            tts: '最后一问缪等于无穷大，也就是没有载波，A 等于零。信号直接退化成纯粹的 D S B S C，每当锯齿过零点，载波就发生一次干脆的一百八十度相位反转。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var A = env.params.A !== undefined ? env.params.A : 4.0;
          var muText = A < 0.05 ? '∞ (DSB-SC)' : (2.0 / A).toFixed(2);
          var mFn = function (t) { return 2 * env.math.sawtooth(t, 0.1); };
          var envFn = function (t) { return A + mFn(t); };
          var amFn = function (t) { return envFn(t) * Math.cos(2 * Math.PI * 150 * t); };
          var over = A < 1.99;

          // Panel 1: Baseband sawtooth m(t)
          var narrow0 = boxes[0].w < 460;
          var ax1 = env.viz.drawAxes(ctx, boxes[0], {
            xMin: -0.1,
            xMax: 0.1,
            yMin: -2.8,
            yMax: 2.8,
            xGrid: 4,
            yGrid: 4,
            xTicks: [[-0.1, '-0.1'], [-0.05, '-0.05'], [0, '0'], [0.05, '0.05'], [0.1, '0.1s']],
            yTicks: [[-2, '-2'], [0, '0'], [2, '+2']],
            title: narrow0 ? '原锯齿波 m(t) (mp=2)' : '原调制信号 m(t)：周期 T=0.1s，峰值 ±2（斜率 40 V/s）'
          });
          env.viz.drawCurve(ctx, ax1, mFn, { samples: 400, color: P.cyan, lineWidth: 2.2 });
          if (over) {
            env.viz.drawCurve(ctx, ax1, function () { return -A; }, { color: P.red, dash: [4, 4], lineWidth: 1.5 });
            env.viz.drawAnnotation(ctx, ax1, -0.025, -A - 0.55, 'm<-A=' + (-A).toFixed(1) + ' 必反相', P.red, 'center');
          }

          // Panel 2: AM modulated sawtooth + envelopes
          var narrow1 = boxes[1].w < 460;
          var ax2 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: -0.1,
            xMax: 0.1,
            yMin: -7,
            yMax: 7,
            xGrid: 4,
            yGrid: 4,
            xTicks: [[-0.1, '-0.1'], [0, '0'], [0.1, '0.1s']],
            yTicks: [[-6, '-6'], [0, '0'], [6, '+6']],
            title: narrow1 ? 'AM波 μ=' + muText + ' (A=' + A.toFixed(1) + ')' : 'AM 已调波：A=' + A.toFixed(1) + '，μ=' + muText + '（±(A+m) 与检波 |A+m|）',
            subtitle: over ? (A < 0.05 ? '退化DSB-SC' : '过调制交叉!') : '无失真包络',
            subtitleColor: over ? P.red : P.green
          });
          env.viz.drawCurve(ctx, ax2, amFn, { samples: 800, color: P.amber, lineWidth: 1.1 });
          env.viz.drawCurve(ctx, ax2, envFn, { samples: 400, color: P.green, lineWidth: 1.8, dash: [5, 3] });
          env.viz.drawCurve(ctx, ax2, function (t) { return -envFn(t); }, { samples: 400, color: P.green, lineWidth: 1.6, dash: [5, 3] });
          if (over) {
            env.viz.drawCurve(ctx, ax2, function (t) { return Math.abs(envFn(t)); }, { samples: 400, color: P.red, lineWidth: 2.2 });
          }
        }
      },
      {
        id: 's02',
        tag: '推导',
        title: '包络检波（整流 + RC 低通）与时间常数黄金窗',
        slideRef: '03AM pp.15–16',
        terms: [
          { en: 'Envelope Detector', zh: '二极管包络检波器' },
          { en: 'Diagonal Clipping', zh: '对角线切割失真（惰性失真）' },
          { en: 'Carrier Ripple', zh: '载波纹波失真' }
        ],
        symbols: [
          { sym: 'RC', desc: '检波回路放电时间常数（决定电容掉压快慢）', color: P.red },
          { sym: '\\frac{1}{\\omega_c} \\ll RC \\ll \\frac{1}{2\\pi B}', desc: '无载波纹波且不发生斜率切割的黄金窗', color: P.green }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: '\\text{二极管半波整流} \\implies \\text{正向给电容 } C \\text{ 快速充至波峰，负向截止靠 } R \\text{ 慢放电}', label: '工作原理：只需 1 个二极管 + RC 电阻电容，无需知道载频 ωc' },
          { step: 1, latex: 'RC \\text{ 太小} \\;\\Big(RC \\lesssim \\frac{1}{f_c}\\Big) \\implies \\text{载波周期内漏电太多，锯齿纹波大}', label: '左边界失真：抓不住波峰之间的电压' },
          { step: 2, latex: 'RC \\text{ 太大} \\;\\Big(RC \\gtrsim \\frac{1}{2\\pi B}\\Big) \\implies \\text{包络陡降时电容放太慢，发生对角线切割失真}', label: '右边界失真：黄金条件 1/ωc ≪ RC ≪ 1/(2πB)' }
        ],
        sliders: [
          { key: 'rcMs', label: '时间常数 RC (ms)', min: 2, max: 350, step: 2, default: 42 }
        ],
        presets: [
          { label: 'RC 太小 (3 ms 载波纹波)', values: { rcMs: 3 } },
          { label: '黄金区间 (42 ms 紧贴包络)', values: { rcMs: 42 } },
          { label: 'RC 太大 (300 ms 对角线切割)', values: { rcMs: 300 } }
        ],
        lines: [
          {
            step: 0,
            sub: '包络检波器电路简单到用天然矿石晶体都能搭出来：AM 信号先过单向导通的二极管，把负半周砍掉；每当正弦冲到波峰就瞬间把电容充满，载波掉下来时二极管反偏截止，电容只好通过电阻 $R$ 慢慢泄放电压！',
            tts: '包络检波器的结构简直简单到不可思议，早期矿石收音机只用一块天然晶体就能搭出来。工作原理就像接水漏水：A M 信号穿过单向导通的二极管，每当高频波峰比电容电压高时就瞬间给电容充电；一旦高频往下掉，二极管截止，电容只能通过并联电阻缓慢漏电。'
          },
          {
            step: 1,
            sub: '点按预设“RC 太小 (3 ms)”看看红色曲线！如果 $RC$ 比载波周期还短，载波刚过完波峰，电容电就漏掉一大半，追出的红线锯齿密布，充满高频纹波！',
            tts: '这就带来了时间常数 R C 的双面夹击。先点一下 R C 太小的预设：如果电阻电容乘积小到跟载波周期差不多，高频刚一离开波峰，电容里的电就哗哗漏掉一大截，红色输出线变成满屏剧烈抖动的锯齿纹波！'
          },
          {
            step: 2,
            sub: '再点“RC 太大 (300 ms)”看看！电容漏得太死板，当包络 $A+m(t)$ 急速下坡时，电容电压根本降不下来，像拉滑索一样直直斜切过谷底，这就是著名的对角线切割失真！只有卡在 $\\frac{1}{\\omega_c} \\ll RC \\ll \\frac{1}{2\\pi B}$ 黄金窗口（预设 42 ms），红线才能丝滑紧贴原始信号！',
            tts: '再点一下 R C 太大的预设：如果 R C 选得太大，电容漏电像老牛拉车一样慢吞吞，当消息包络快速下坡时，电容电压跟不上下降斜率，直接斜着切过整个波谷，这就是经典的对角线切割失真。只有把 R C 稳稳卡在载频倒数与消息带宽倒数之间的黄金区间，红色曲线才会丝滑贴合原包络！'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var rcMs = env.params.rcMs || 42;
          var RC = rcMs / 1000;

          // Panel 1: Diode + RC detector block schematic
          var nodes = [
            { id: 'in', nx: 0.10, ny: 0.50, nw: 0.16, nh: 0.28, label: 'AM输入\n(A+m)cos', color: P.amber },
            { id: 'dio', nx: 0.36, ny: 0.50, nw: 0.20, nh: 0.28, label: '二极管整流\n(单向导通)', color: P.cyan },
            { id: 'rc', nx: 0.64, ny: 0.50, nw: 0.22, nh: 0.30, label: 'RC 充放电\nRC=' + rcMs + 'ms', color: P.red },
            { id: 'out', nx: 0.90, ny: 0.50, nw: 0.16, nh: 0.28, label: '检波输出\n≈ A+m(t)', color: P.green }
          ];
          var edges = [
            { from: 'in', to: 'dio' },
            { from: 'dio', to: 'rc', label: '峰值充电' },
            { from: 'rc', to: 'out', label: '隔直还原' }
          ];
          env.viz.drawBlockDiagram(ctx, boxes[0], nodes, edges, {
            time: env.time,
            activeId: 'rc',
            title: boxes[0].w < 460 ? '二极管+RC 包络检波' : '无需知道载频 ωc 的非相干检波电路（黄金窗 1/ωc ≪ RC ≪ 1/(2πB)）'
          });

          // Panel 2: Live rcEnvelopeTrace simulation
          var N = 1800;
          var tMax = 1.0;
          var dt = tMax / N;
          var fc = 180;
          var fm = 2.0;
          var amArr = new Float64Array(N + 1);
          var envArr = new Float64Array(N + 1);
          for (var i = 0; i <= N; i++) {
            var t = i * dt;
            var e = 1.0 + 0.65 * Math.cos(2 * Math.PI * fm * t);
            envArr[i] = e;
            amArr[i] = e * Math.cos(2 * Math.PI * fc * t);
          }
          var trace = env.math.rcEnvelopeTrace(amArr, dt, RC);

          var status = rcMs < 12 ? '载波纹波太大!' : (rcMs > 95 ? '对角线切割失真!' : '黄金窗完美追踪!');
          var statusCol = (rcMs >= 12 && rcMs <= 95) ? P.green : P.red;
          var narrow1 = boxes[1].w < 460;
          var ax2 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: 0,
            xMax: 1.0,
            yMin: -1.8,
            yMax: 1.9,
            xGrid: 4,
            yGrid: 4,
            xTicks: [[0, '0'], [0.25, '0.25'], [0.5, '0.5'], [0.75, '0.75'], [1.0, '1s']],
            yTicks: [[-1.5, '-1.5'], [0, '0'], [1.5, '+1.5']],
            title: narrow1 ? 'RC=' + rcMs + 'ms 实时仿真' : '实时电路仿真：蓝虚=理想包络，红线=RC 电容电压',
            subtitle: status,
            subtitleColor: statusCol
          });
          // Subsample AM wave cleanly for fast crisp rendering
          var amSub = [];
          var stepIdx = 2;
          for (var k = 0; k <= N; k += stepIdx) amSub.push(amArr[k]);
          env.viz.drawCurve(ctx, ax2, amSub, { from: 0, to: 1.0, color: 'rgba(251, 191, 36, 0.45)', lineWidth: 1.0 });
          env.viz.drawCurve(ctx, ax2, envArr, { from: 0, to: 1.0, color: P.cyan, lineWidth: 2.0, dash: [5, 3] });
          env.viz.drawCurve(ctx, ax2, trace, { from: 0, to: 1.0, color: P.red, lineWidth: 2.4 });
        }
      },
      {
        id: 's03',
        tag: '课件例题',
        title: 'AM 功率效率与单音极限 η_max = 33.3%（收发代价权衡）',
        slideRef: '03AM p.17',
        terms: [
          { en: 'Power Efficiency (η)', zh: '调幅功率效率' },
          { en: 'Carrier vs Sideband Power', zh: '载波功率 vs 边带功率' },
          { en: 'Peak-to-Average Power Ratio', zh: '峰均比对效率的压制' }
        ],
        symbols: [
          { sym: 'P_c = \\frac{A^2}{2}', desc: '纯载波浪费掉的平均功率（不携带任何信息）', color: P.red },
          { sym: 'P_s = \\frac{1}{2}\\overline{m^2(t)}', desc: '真正携带信息的双边带总功率', color: P.green },
          { sym: '\\eta = \\frac{P_s}{P_c + P_s}', desc: '有用边带功率占总发射功率的百分比', color: P.amber }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: '\\varphi_{\\text{AM}}(t) = A\\cos\\omega_c t + m(t)\\cos\\omega_c t \\implies P_c = \\frac{A^2}{2},\\quad P_s = \\frac{\\overline{m^2(t)}}{2}', label: '正交分解：载波项与过零调制项平均功率直接相加' },
          { step: 1, latex: '\\eta = \\frac{\\overline{m^2(t)}}{A^2 + \\overline{m^2(t)}} \\xrightarrow{m=m_p\\cos\\omega_m t} \\eta = \\frac{\\mu^2}{2 + \\mu^2} \\le \\frac{1}{3} \\approx 33.3\\%', label: '课件 p.17 例题：单音 μ=1 时 m²平均为 A²/2，效率极限仅 33.3%' },
          { step: 2, latex: '\\text{实际语音峰均比更高 }(\\overline{m^2} \\approx 0.1\\sim 0.2\\,m_p^2) \\implies \\eta < 20\\%\\;(\\text{而 DSB-SC/SSB } \\eta=100\\%)', label: '广播电台宁可浪费 >2/3 功率，换取百万台一元收音机廉价检波' }
        ],
        sliders: [
          { key: 'mu', label: '调制度 μ = m_p / A', min: 0.1, max: 1.0, step: 0.05, default: 1.0 },
          { key: 'sigType', label: '信号波形 (0=单音正弦, 1=三角波, 2=语音高PAR)', min: 0, max: 2, step: 1, default: 0 }
        ],
        presets: [
          { label: '单音极限 (μ=1 → 33.3%)', values: { mu: 1.0, sigType: 0 } },
          { label: '半调制度单音 (μ=0.5 → 11.1%)', values: { mu: 0.5, sigType: 0 } },
          { label: '实际语音 (μ=1 → ~16.7%)', values: { mu: 1.0, sigType: 2 } }
        ],
        lines: [
          {
            step: 0,
            sub: '包络检波虽好，天底下却没有免费午餐！把 AM 拆成无信息载波 $A\\cos\\omega_c t$ 和有用边带 $m(t)\\cos\\omega_c t$，总发射功率等于两者相加：载波功率 $P_c = \\frac{A^2}{2}$，边带功率 $P_s = \\frac{1}{2}\\overline{m^2(t)}$。',
            tts: '包络检波虽然让收音机便宜到极点，但发射台付出的电费代价却惊人。把调幅波拆成纯载波项和携带信息的边带项，两者频率或平均交叉为零，总功率直接相加：载波功率等于二分之 A 平方，真正有用的边带功率等于二分之一 m 平方的均值。'
          },
          {
            step: 1,
            sub: '来看课件第 17 页必考例题：单音信号 $m(t)=m_p\\cos\\omega_m t$ 下，功率效率 $\\eta = \\frac{\\mu^2}{2+\\mu^2}$。即使开到不失真的满格极限 $\\mu=1$，也才 $\\frac{1}{2+1} = 33.3\\%$！这意味着至少三分之二的电费都白白烧在了毫无信息量的空载波上！',
            tts: '来看课件第十七页的必考例题：代入单音正弦消息，推导出效率公式等于缪平方除以二加缪平方。哪怕把调制度拉满到不失真极限一，最高效率也仅仅只有三分之一，也就是百分之三十三点三！意味着至少三分之二的发射机功率白白耗费在空载波上。'
          },
          {
            step: 2,
            sub: '如果是现实人类语音，平平时静静说话、偶尔爆出尖峰，峰均比比正弦高得多（把波形切到“语音”看看），效率甚至跌破 $20\\%$！那为什么 AM 广播还要用？因为一个大功率电台服务几百万台只用一颗二极管的廉价收音机极其划算；而点对点骨干通信发射端电池宝贵，果断选效率 $100\\%$ 的 DSB-SC 或 SSB！',
            tts: '更扎心的是，真实人类语音的峰值高但平均能量低，把波形切到语音就能看到，实用效率甚至掉到百分之二十以下。不过工程上非常划算：一个广播电台贵一点，却能让几百万听众买一元钱的极简收音机；而在点对点卫星或手机通信里，发射机省电更关键，就会果断换成效率百分之百的抑制载波或单边带。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var mu = env.params.mu || 1.0;
          var st = Math.round(env.params.sigType || 0);
          // m^2 / m_p^2 factor: sine = 0.5, tri = 1/3, speech = 0.20
          var factors = [
            { name: '单音正弦 (0.5 mp²)', k: 0.5 },
            { name: '三角/锯齿波 (0.33 mp²)', k: 1 / 3 },
            { name: '典型语音 (0.20 mp²)', k: 0.2 }
          ];
          var fac = factors[st];
          var m2OverA2 = fac.k * mu * mu;
          var eta = m2OverA2 / (1 + m2OverA2);
          var etaPct = eta * 100;

          // Panel 1: Stacked power bar breakdown (Carrier waste vs Sideband info)
          var b0 = boxes[0];
          var narrow0 = b0.w < 460;
          env.viz.roundRect(ctx, b0.x, b0.y, b0.w, b0.h, 10);
          ctx.fillStyle = P.panelBg;
          ctx.fill();
          ctx.strokeStyle = '#1e2948';
          ctx.stroke();
          env.viz.drawBadge(ctx, b0.x + 8, b0.y + 5, narrow0 ? '功率配比 η=' + etaPct.toFixed(1) + '%' : '总发射功率分配：有用边带 vs 浪费载波', P.amber, false);

          var barX = b0.x + 18;
          var barW = b0.w - 36;
          var barY = b0.y + b0.h * 0.42;
          var barH = Math.max(26, b0.h * 0.20);
          var sideW = barW * eta;
          var carW = barW - sideW;

          ctx.fillStyle = P.green;
          env.viz.roundRect(ctx, barX, barY, Math.max(6, sideW), barH, 6);
          ctx.fill();
          ctx.fillStyle = 'rgba(251, 113, 133, 0.78)';
          env.viz.roundRect(ctx, barX + sideW + 2, barY, Math.max(6, carW - 2), barH, 6);
          ctx.fill();

          ctx.font = '700 12px sans-serif';
          ctx.fillStyle = '#fff';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          if (sideW > 52) ctx.fillText('边带 ' + etaPct.toFixed(1) + '%', barX + sideW / 2, barY + barH / 2);
          if (carW > 70) ctx.fillText('空载波浪费 ' + (100 - etaPct).toFixed(1) + '%', barX + sideW + carW / 2, barY + barH / 2);

          ctx.font = '600 11.5px sans-serif';
          ctx.fillStyle = P.cyan;
          ctx.textAlign = 'left';
          ctx.fillText('波形类型：' + fac.name + '   |   μ = ' + mu.toFixed(2), barX, barY - 16);
          ctx.fillStyle = P.muted;
          ctx.fillText('对比：DSB-SC / SSB 无载波开销，功率效率恒为 100%', barX, barY + barH + 20);

          // Panel 2: Efficiency curve vs mu
          var narrow1 = boxes[1].w < 460;
          var ax2 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: 0,
            xMax: 1.05,
            yMin: 0,
            yMax: 42,
            xGrid: 5,
            yGrid: 4,
            xTicks: [[0, '0'], [0.5, '0.5'], [1.0, 'μ=1']],
            yTicks: [[10, '10%'], [20, '20%'], [33.3, '33.3%']],
            title: narrow1 ? '效率曲线 η(μ)' : 'AM 效率随调制度 μ 变化曲线（单音极限 33.3%）'
          });
          env.viz.drawCurve(ctx, ax2, function (u) {
            var r = fac.k * u * u;
            return (r / (1 + r)) * 100;
          }, { from: 0, to: 1.0, color: P.cyan, lineWidth: 2.5, fillAlpha: 0.16 });
          env.viz.drawCurve(ctx, ax2, function () { return 33.33; }, { color: P.amber, dash: [4, 4], lineWidth: 1.5 });
          env.viz.drawStems(ctx, ax2, [
            { x: mu, y: etaPct, color: P.green, width: 3.5, label: 'η=' + etaPct.toFixed(1) + '%' }
          ], {});
        }
      },
      {
        id: 's04',
        tag: '作业精讲',
        hwCode: '4.3-5',
        title: 'HW1 作业 4.3-5：因果指数信号 e^{-3t}u(t-2) 的 DSB 频谱',
        slideRef: '03AM p.45 · HW 4.3-5',
        terms: [
          { en: 'Time-Shifted Exponential', zh: '时移因果衰减指数' },
          { en: 'DSB Spectral Shifting', zh: '双边带搬移与幅度减半' }
        ],
        symbols: [
          { sym: 'm(t) = e^{-6}e^{-3(t-2)}u(t-2)', desc: '先拆出常数因子 $e^{-6}$ 才能套时移性质！', color: P.cyan },
          { sym: '|M(0)| = e^{-6}/3', desc: '基带幅度谱峰值（出现在 $f=0$）', color: P.green },
          { sym: '|S(\\pm 1000)| = e^{-6}/6', desc: '乘 $\\cos 2000\\pi t$ 搬至 $\\pm 1000\\text{ Hz}$ 后峰值减半', color: P.amber }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: 'm(t) = e^{-3t}u(t-2) = e^{-6}\\,e^{-3(t-2)}u(t-2)', label: '关键改写：指数里的 t 必须配成 (t-2)，吐出 e^{-6} 常数系数' },
          { step: 1, latex: 'M(f) = e^{-6}\\frac{e^{-j4\\pi f}}{3 + j2\\pi f} \\implies |M(f)| = \\frac{e^{-6}}{\\sqrt{9 + 4\\pi^2 f^2}},\\quad \\angle M = -4\\pi f - \\arctan\\frac{2\\pi f}{3}', label: '(a) 由单边指数傅里叶对 + 时移 2 秒直接写出幅频与相频' },
          { step: 2, latex: 's(t) = m(t)\\cos 2000\\pi t \\;\\Longleftrightarrow\\; S(f) = \\frac{1}{2}\\big[M(f-1000)+M(f+1000)\\big]\\;\\Big(\\text{峰值 }\\frac{e^{-6}}{6}\\Big)', label: '(b) f_c=1000 Hz 调制：把 (a) 的幅频和相频搬到 ±1000 Hz 且幅度减半' }
        ],
        sliders: [
          { key: 'decay', label: '衰减率 a (原题 a=3)', min: 1.5, max: 5.0, step: 0.5, default: 3.0 }
        ],
        presets: [
          { label: '原题参数 (a=3, t₀=2)', values: { decay: 3.0 } },
          { label: '更慢衰减 (a=1.5 → 谱更尖)', values: { decay: 1.5 } }
        ],
        lines: [
          {
            step: 0,
            sub: '作业 4.3-5 是极高频的傅里叶时移与调制结合题：$m(t) = e^{-3t}u(t-2)$。千万别直接套公式，因为阶跃 $u(t-2)$ 平移了 $2$ 秒，必须先把 $e^{-3t}$ 凑成 $e^{-6}\\,e^{-3(t-2)}$！',
            tts: '来看作业四点三杠五，这是一道极其经典的时移和调制综合题。信号写成 e 的负三 t 次方乘以阶跃 u t 减二。解题第一步最容易栽跟头：千万不能直接套公式，必须先把指数也凑成 t 减二的形式，吐出一个常数因子 e 的负六次方。'
          },
          {
            step: 1,
            sub: '套用 $e^{-at}u(t) \\leftrightarrow \\frac{1}{a+j2\\pi f}$ 并加上 $2$ 秒延迟因子 $e^{-j4\\pi f}$，立刻得 $M(f) = e^{-6}\\frac{e^{-j4\\pi f}}{3+j2\\pi f}$。它的幅度谱是单峰钟形，最高点在直流 $f=0$ 处等于 $\\frac{e^{-6}}{3}$；相位谱包含线性时延项 $-4\\pi f$ 与反正切项！',
            tts: '凑好之后直接套用单边指数的傅里叶变换对，再乘上两秒延迟带来的相位因子 e 的负 j 四派 f 次方，就得到完整的 M f。在频域上，它的幅度谱是一个关于零频对称的钟形单峰，顶点高度是三分之 e 的负六次方；相位谱则是线性时延项减去反正切项。'
          },
          {
            step: 2,
            sub: '第 (b) 问把 $m(t)$ 乘上 $\\cos(2000\\pi t)$（载频 $f_c = 1000\\text{ Hz}$），这就是 DSB-SC 调制！频谱只需把 $M(f)$ 的幅度与相位原样搬到 $\\pm 1000\\text{ Hz}$ 两处，高度除以 $2$ 变成 $\\frac{e^{-6}}{6}$！注意主瓣带宽只有约 $1\\text{ Hz}$，相对 $1000\\text{ Hz}$ 非常窄，图上按示意尺度展现双峰搬移。',
            tts: '第二问乘上频率为一千赫兹的余弦载波，本质上就是做一次抑制载波双边带调制。只需要把第一问求出的幅度谱和相位谱，原封不动平移到正负一千赫兹两侧，高度全部减半变成六分之 e 的负六次方。注意实际信号主瓣宽度只有约一赫兹，相对于一千赫兹载频非常尖细，画示意图时要特别标出横轴比例。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var a = env.params.decay || 3.0;
          var peak0 = 1 / a;

          // Panel 1: Time domain m(t) * e^(2a) normalized starting at t=2
          var narrow0 = boxes[0].w < 460;
          var ax1 = env.viz.drawAxes(ctx, boxes[0], {
            xMin: 0,
            xMax: 4.0,
            yMin: -1.15,
            yMax: 1.15,
            xGrid: 4,
            yGrid: 2,
            xTicks: [[0, '0'], [2, 't=2'], [3, '3'], [4, '4s']],
            yTicks: [[-1, '-e^-6'], [0, '0'], [1, '+e^-6']],
            title: narrow0 ? '时域波形 (t≥2 起跳)' : '归一化波形（已提常数 e^-' + (2 * a).toFixed(0) + '）：蓝=m(t)，橙=s(t)'
          });
          env.viz.drawCurve(ctx, ax1, function (t) {
            return t < 2 ? 0 : Math.exp(-a * (t - 2)) * Math.cos(2 * Math.PI * 16 * t);
          }, { samples: 640, color: P.amber, lineWidth: 1.3 });
          env.viz.drawCurve(ctx, ax1, function (t) {
            return t < 2 ? 0 : Math.exp(-a * (t - 2));
          }, { samples: 360, color: P.cyan, lineWidth: 2.3 });
          env.viz.drawAnnotation(ctx, ax1, 2.05, 1.0, 't=2 阶跃起跳', P.cyan, 'left');

          // Panel 2: Magnitude spectra |M(f)| vs |S(f)| (normalized by e^{2a})
          var narrow1 = boxes[1].w < 460;
          var yLim = Math.max(0.45, peak0 * 1.22);
          var ax2 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: -2.2,
            xMax: 2.2,
            yMin: 0,
            yMax: yLim,
            xGrid: 4,
            yGrid: 3,
            xTicks: [[-1, '-1000'], [0, '0'], [1, '+1000Hz']],
            yTicks: [[peak0 * 0.5, '1/' + (2 * a).toFixed(0)], [peak0, '1/' + a.toFixed(0)]],
            title: narrow1 ? '|M(f)| 与 |S(f)| (×e^' + (2 * a).toFixed(0) + ')' : '幅度谱（乘 e^' + (2 * a).toFixed(0) + '）：虚线=|M(f)|，实线=|S(f)| 在 ±1000Hz 减半（横轴示意）'
          });
          env.viz.drawCurve(ctx, ax2, function (f) {
            return 1 / Math.sqrt(a * a + 4 * Math.PI * Math.PI * f * f);
          }, { from: -2.1, to: 2.1, samples: 300, color: P.cyan, lineWidth: 2.0, dash: [5, 3] });

          var lobe = function (c) {
            return function (f) {
              var df = (f - c) * 4.5; // compressed visual scale (1000 Hz vs ~1 Hz lobe)
              return 0.5 / Math.sqrt(a * a + 4 * Math.PI * Math.PI * df * df);
            };
          };
          env.viz.drawCurve(ctx, ax2, lobe(-1), { from: -1.8, to: -0.2, samples: 240, color: P.amber, lineWidth: 2.4, fillAlpha: 0.22 });
          env.viz.drawCurve(ctx, ax2, lobe(1), { from: 0.2, to: 1.8, samples: 240, color: P.amber, lineWidth: 2.4, fillAlpha: 0.22 });
          env.viz.drawAnnotation(ctx, ax2, 1, peak0 * 0.5 + 0.02, '峰值 e^-6/' + (2 * a).toFixed(0), P.amber, 'center');
        }
      },
      {
        id: 's05',
        tag: '直觉',
        title: '接收端补载波也能包络检波？以及 DSB 四份冗余引出 QAM/SSB',
        slideRef: '03AM p.18',
        terms: [
          { en: 'Carrier Reinsertion', zh: '接收端注入本地载波' },
          { en: 'Hermitian Symmetry', zh: '实信号共轭对称（4份冗余）' }
        ],
        symbols: [
          { sym: 'M(-\\omega) = M^*(\\omega)', desc: '实信号正负半轴信息完全相同（先冗余一半）', color: P.cyan },
          { sym: '\\Phi(-\\omega) = \\Phi^*(\\omega)', desc: '实已调信号又对称一次（正频内还有上下双边带）', color: P.amber }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: 's_{\\text{DSB}}(t) + A\\cos\\omega_c t = [A + m(t)]\\cos\\omega_c t \\xrightarrow{\\text{包络检波}} A + m(t)', label: '课件 p.18 思考1：发端省掉载波发 DSB-SC，若收端能同步补回 A cosωct 同样可用包络检波' },
          { step: 1, latex: '\\text{原信息 } 1 \\text{ 份} \\xrightarrow{\\text{实数 } M(-\\omega)=M^*(\\omega)} 2 \\text{ 份} \\xrightarrow{\\text{DSB 搬移}} 4 \\text{ 份半边带}\\;(\\text{只剩 } \\tfrac{1}{4} \\text{ 有效!})', label: '课件 p.18 思考2：DSB 竟然复制了 4 份相同内容，引出下集 QAM 与 SSB 革命' }
        ],
        sliders: [
          { key: 'injectA', label: '接收端本地补充载波 A', min: 0, max: 1.6, step: 0.2, default: 1.2 }
        ],
        presets: [
          { label: '不加本地载波 (A=0 → 失真)', values: { injectA: 0 } },
          { label: '收端补足载波 (A=1.2 → 还原)', values: { injectA: 1.2 } }
        ],
        lines: [
          {
            step: 0,
            sub: '在进入下集 QAM 和单边带之前，先看课件第 18 页留下的两个深度思考！第一：如果发送端为了省电发 DSB-SC，接收端自己加上同频同相的 $A\\cos\\omega_c t$，不就立刻变回 $[A+m(t)]\\cos\\omega_c t$，然后接包络检波器吗？没错，但这仍要求收端精确同步 $\\omega_c$！',
            tts: '在进入下一集正交调制和单边带之前，来看课件第十八页的两个灵魂发问。第一问：如果发端为了省电只发抑制载波双边带，收端在进门之前自己加上一个本地正弦载波，能不能重新变成标准调幅用包络检波？理论上完全可以，但这要求本地载波和发端精确同步，并没有真正省掉同步器。'
          },
          {
            step: 1,
            sub: '第二问直击全章痛点：实信号频谱正负对称，本身就带 $2$ 份一样的信息；经 DSB 搬移到 $\\pm f_c$ 后，每边又有对称的 USB 和 LSB，整张频谱里竟然塞了 4 份完全相同的半边带拷贝！下一集我们就用两把钥匙消除浪费：要么在同一带宽里塞两路（QAM），要么干脆砍掉一半边带（SSB）！',
            tts: '第二个发问更绝：实信号的频谱天生正负对称，原本就藏着两份重复信息；经过双边带调制一搬移，正负频率各有上下两条边带，整张频谱图里竟然同时出现了四份完全等价的拷贝，四分之三的频宽都在重复搬运！下一集我们就用两把钥匙消除这种浪费：要么同频带硬塞两路做 Q A M，要么干脆砍掉一半边带做单边带。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var A = env.params.injectA !== undefined ? env.params.injectA : 1.2;
          var mFn = function (t) { return Math.cos(2 * Math.PI * 1.5 * t); };
          var sig = function (t) { return (A + mFn(t)) * Math.cos(2 * Math.PI * 20 * t); };

          var narrow0 = boxes[0].w < 460;
          var ax1 = env.viz.drawAxes(ctx, boxes[0], {
            xMin: 0,
            xMax: 1.0,
            yMin: -2.8,
            yMax: 2.8,
            xGrid: 4,
            yGrid: 4,
            xTicks: [[0, '0'], [0.5, '0.5'], [1, '1']],
            yTicks: [[-2, '-2'], [0, '0'], [2, '+2']],
            title: narrow0 ? '收端补载波 A=' + A.toFixed(1) : '接收端注入本地 A·cosωct 后的包络 |A+m(t)|',
            subtitle: A >= 1.0 ? '包络无失真' : '包络反转!',
            subtitleColor: A >= 1.0 ? P.green : P.red
          });
          env.viz.drawCurve(ctx, ax1, sig, { samples: 640, color: P.amber, lineWidth: 1.2 });
          env.viz.drawCurve(ctx, ax1, function (t) { return Math.abs(A + mFn(t)); }, { samples: 240, color: A >= 1.0 ? P.green : P.red, lineWidth: 2.3 });

          // Panel 2: 4 redundant copies in DSB-SC
          var narrow1 = boxes[1].w < 460;
          var ax2 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: -10,
            xMax: 10,
            yMin: 0,
            yMax: 1.3,
            xGrid: 4,
            yGrid: 2,
            xTicks: [[-6, '-fc'], [0, '0'], [6, '+fc']],
            yTicks: [[1, '1']],
            title: narrow1 ? 'DSB 的 4 份冗余半边带' : '实信号 DSB-SC 频谱中的 4 份等价副本（各带全部信息!）'
          });
          var halfL = function (c, side) {
            return function (f) {
              var d = f - c;
              if (side < 0 && (d < -2.4 || d > 0)) return 0;
              if (side > 0 && (d < 0 || d > 2.4)) return 0;
              return 1 - Math.abs(d) / 2.4;
            };
          };
          env.viz.drawCurve(ctx, ax2, halfL(-6, -1), { from: -8.5, to: 0, samples: 120, color: P.muted, lineWidth: 2, fillAlpha: 0.12 });
          env.viz.drawCurve(ctx, ax2, halfL(-6, 1), { from: -6, to: -3.5, samples: 120, color: P.muted, lineWidth: 2, fillAlpha: 0.12 });
          env.viz.drawCurve(ctx, ax2, halfL(6, -1), { from: 3.5, to: 6, samples: 120, color: P.pink, lineWidth: 2.2, fillAlpha: 0.2 });
          env.viz.drawCurve(ctx, ax2, halfL(6, 1), { from: 6, to: 8.5, samples: 120, color: P.green, lineWidth: 2.5, fillAlpha: 0.26 });
          env.viz.drawAnnotation(ctx, ax2, 7.2, 0.85, '仅传此1份=SSB!', P.green, 'center');
          env.viz.drawAnnotation(ctx, ax2, 4.8, 0.55, 'LSB', P.pink, 'center');
        }
      }
    ]
  });
})(window);
