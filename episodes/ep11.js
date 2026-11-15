(function (global) {
  'use strict';

  var P = global.COMM_VIZ.PALETTE;

  function snapWheelRatio(r) {
    var anchors = [1 / 12, 1 / 10, 1 / 8, 1 / 6, 1 / 3, 1 / 2, 11 / 12, 1.0];
    for (var i = 0; i < anchors.length; i++) {
      if (Math.abs(r - anchors[i]) < 0.0018) return anchors[i];
    }
    return r;
  }

  function formatWheelRatioLabel(r) {
    if (Math.abs(r - 1 / 12) < 1e-4) return 'T/12';
    if (Math.abs(r - 1 / 10) < 1e-4) return 'T/10';
    if (Math.abs(r - 1 / 8) < 1e-4) return 'T/8';
    if (Math.abs(r - 1 / 6) < 1e-4) return 'T/6';
    if (Math.abs(r - 1 / 3) < 1e-4) return 'T/3';
    if (Math.abs(r - 1 / 2) < 1e-4) return 'T/2';
    if (Math.abs(r - 11 / 12) < 1e-4) return '11T/12';
    if (Math.abs(r - 1.0) < 1e-4) return 'T';
    return r.toFixed(2) + 'T';
  }

  global.COMM_EPISODES.push({
    id: 'ep11',
    chapter: 'Ch.05 采样与量化（上）',
    title: '采样定理、频闪车轮倒转与 PAM/TDM 多路复用',
    slideDeck: '05sampling_XC_PKU',
    slideRange: 'pp. 1–31',
    homeworkTags: [],
    scenes: [
      {
        id: 's00',
        tag: '课件例题',
        title: '为什么飞驰的车轮会倒转、静止甚至晃动？(Ex 1 & Ex 2 频闪直观)',
        slideRef: '05sampling pp.6–14',
        terms: [
          { en: 'Sampling / Aliasing', zh: '采样 / 频谱混叠（高频伪装）' },
          { en: 'Stroboscopic Wheel', zh: '频闪车轮效应（Ex 1）' },
          { en: 'Spatial Aliasing (Stripes)', zh: '空间条纹混叠（Ex 2）' }
        ],
        symbols: [
          { sym: 'T,\\; f = 1/T', desc: '车轮真实旋转周期与转速频率', color: P.cyan },
          { sym: 'T_s,\\; f_s = 1/T_s', desc: '快门频闪采样周期与采样频率', color: P.amber },
          { sym: 'f_{\\text{app}} = f - k f_s', desc: '折叠进 [-f_s/2, f_s/2] 的表观假频率', color: P.red }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: '\\Delta\\theta = 2\\pi \\frac{T_s}{T} = 2\\pi\\frac{f}{f_s}\\qquad\\big(T_s = \\tfrac{T}{12} \\Rightarrow +30^\\circ/\\text{帧},\\text{ 忠实正转}\\big)', label: '快门每次闪烁时车轮真实转过的顺时针角度' },
          { step: 1, latex: 'T_s = \\tfrac{T}{2}\\;(f_s=2f) \\Rightarrow \\Delta\\theta=180^\\circ\\text{ 临界模糊};\\qquad T_s = T\\;(f_s=f) \\Rightarrow \\Delta\\theta=360^\\circ\\text{ 彻底静止!}', label: '半周期正反难辨，整周期原地定格' },
          { step: 2, latex: 'T_s = \\tfrac{11}{12}T \\Rightarrow \\Delta\\theta = 330^\\circ \\equiv -30^\\circ\\!\\pmod{360^\\circ}\\quad\\big(\\text{视觉倒转 } f_{\\text{app}} < 0\\big)', label: '混叠本质：采样低于两倍最高频时，高频偷梁换柱冒充低频' }
        ],
        sliders: [
          { key: 'ratio', label: '采样间隔比 Ts / T (= f / fs)', min: 0.050, max: 1.050, step: 0.001, default: 0.083, unit: 'T', decimals: 3 }
        ],
        presets: [
          { label: 'Ts=T/12 (清晰正转)', values: { ratio: 0.083 } },
          { label: 'Ts=T/10 (正转+36°)', values: { ratio: 0.100 } },
          { label: 'Ts=T/8 (正转+45°)', values: { ratio: 0.125 } },
          { label: 'Ts=T/6 (变疏+60°)', values: { ratio: 0.167 } },
          { label: 'Ts=T/3 (交错+120°)', values: { ratio: 0.333 } },
          { label: 'Ts=T/2 (180°临界!)', values: { ratio: 0.500 } },
          { label: 'Ts=11T/12 (经典倒转!)', values: { ratio: 0.917 } },
          { label: 'Ts=T (彻底静止!)', values: { ratio: 1.000 } }
        ],
        lines: [
          {
            step: 0,
            sub: '先看课件 Ex 1 经典频闪车轮：蓝色虚线是真实顺时针飞转的车轮（周期 $T$），橙色辐条是你用闪光灯每隔 $T_s$ 拍下的快照。当 $T_s = T/12$ 时，每帧前进 $30^\\circ$，连起来就是清晰顺滑的正转；拉到 $T/10$、$T/8$、$T/6$，步伐越来越跨大、画面开始断续。',
            tts: '先看课件第一个经典例子，频闪车轮实验。蓝色虚线是真实顺时针飞转的车轮，周期为 T，橙色辐条是你用闪光灯每隔采样周期 T s 拍下的照片。当 T s 等于十二分之 T 时，每帧前进三十度，连起来就是清晰顺滑的正转；逐步拉开到十分之 T、八分之 T、六分之 T，步伐越来越稀疏。'
          },
          {
            step: 1,
            sub: '继续放慢快门！到 $T_s = T/3$ 时每帧跳 $120^\\circ$，几乎分不清旋转方向；正卡在奈奎斯特临界 $T_s = T/2$（即 $f_s = 2f$）时，辐条每次对翻 $180^\\circ$，正转倒转彻底相等！而一旦 $T_s = T$（$f_s = f$），每次闪光轮子刚转满一圈回到原位，橙色车轮直接彻底定格静止！',
            tts: '继续放慢快门。到三分之 T 时每帧猛跳一百二十度，已经开始凌乱；正卡在二分之 T 的临界线时，辐条每次对翻一百八十度，正转还是倒转彻底无法区分。而一旦 T s 等于 T，每次闪光车轮恰好转满整整三百六十度回到原位，橙色辐条就会像施了定身术一样彻底静止。'
          },
          {
            step: 2,
            sub: '最神奇的一幕出现在 $T_s = 11T/12$（或课件里 $f=10/T, f_s=12/T$）：每拍实际顺时针转了 $330^\\circ$，差 $30^\\circ$ 满一圈，大脑自动按最短路径脑补成逆时针倒转 $-30^\\circ$！课件 Ex 2 密条纹衬衫拍出宽波浪摩尔纹也是同一原理：采样率低于两倍信号频率时，高频必伪装成假低频，这就是混叠（Aliasing）。',
            tts: '最神奇的一幕出现在十二分之十一 T：两次闪光之间车轮其实顺时针狂转了三百三十度，只差三十度就满一圈，大脑却按最短路径把它脑补成了逆时针倒转三十度。课件第二个例子，细密条纹拍出虚假粗大波浪纹，也是完全一样的道理：采样率低于两倍信号频率时，高频一定会被认错成假低频，这就是混叠效应。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var rawR = env.params.ratio !== undefined ? env.params.ratio : (1 / 12);
          var r = snapWheelRatio(rawR);
          var ratioLabel = formatWheelRatioLabel(r);

          // Wall-clock wheel rotation period T_rot = 2.4 s
          var Trot = 2.4;
          var Ts = r * Trot;
          var trueAngle = (2 * Math.PI * env.time) / Trot;
          var k = Math.floor(env.time / Math.max(1e-4, Ts));
          var tSampled = k * Ts;
          var sampledAngle = (2 * Math.PI * tSampled) / Trot;
          var sinceFlash = env.time - tSampled;
          var flashAlpha = Math.max(0, 1 - sinceFlash / Math.min(0.28, Ts * 0.65));

          // Apparent aliased normalized frequency f_app / f_true
          var nearestInt = Math.round(r);
          var stepDeg = r * 360;
          var wrapDeg = ((stepDeg + 180) % 360 + 360) % 360 - 180;
          if (Math.abs(r - 0.5) < 1e-3) wrapDeg = 180;
          if (Math.abs(r - 1.0) < 1e-3) wrapDeg = 0;

          var stateText = '';
          var stateCol = P.green;
          if (Math.abs(r - 1.0) < 0.015) {
            stateText = '彻底静止! (每拍转360°)';
            stateCol = P.purple;
          } else if (Math.abs(r - 0.5) < 0.015) {
            stateText = '临界180° (正反混沌)';
            stateCol = P.amber;
          } else if (wrapDeg < -1) {
            stateText = '视觉倒转! (' + wrapDeg.toFixed(0) + '°/拍)';
            stateCol = P.red;
          } else {
            stateText = r <= 0.17 ? ('顺向正转 (+' + wrapDeg.toFixed(0) + '°/拍)') : ('稀疏正转 (+' + wrapDeg.toFixed(0) + '°/拍)');
            stateCol = r <= 0.2 ? P.green : P.amber;
          }

          var narrow0 = boxes[0].w < 460;
          env.viz.drawPhasorWheel(ctx, boxes[0], {
            mode: 'wheel',
            trueAngle: trueAngle,
            sampledAngle: sampledAngle,
            flashAlpha: flashAlpha,
            color: stateCol,
            title: narrow0 ? ('频闪 Ts=' + ratioLabel) : ('车轮频闪 (虚线=真转, 实线=采样 Ts=' + ratioLabel + ')'),
            subtitle: narrow0 ? undefined : ('fs/f = ' + (1 / r).toFixed(2)),
            titleColor: P.cyan,
            subtitleColor: P.amber,
            bottomText: stateText,
            bottomColor: stateCol
          });

          // Panel 1: Horizontal projection cos(2pi t/T) vs aliased cosine passing through samples
          var fApp = (1 - nearestInt / r); // normalized to true f=1 -> period 1
          var narrow1 = boxes[1].w < 460;
          var ax = env.viz.drawAxes(ctx, boxes[1], {
            xMin: 0,
            xMax: 3.2,
            yMin: -1.35,
            yMax: 1.45,
            xGrid: 6,
            yGrid: 4,
            padL: 34,
            xTicks: narrow1 ? [[0, '0'], [1.5, '1.5T'], [3, '3T']] : [[0, '0'], [1, 'T'], [2, '2T'], [3, '3T']],
            yTicks: [[-1, '-1'], [0, '0'], [1, '+1']],
            title: narrow1 ? '时域波形与混叠假波' : '时域投影：真波 cos(2πt/T) vs 采样连出的假低频波',
            subtitle: narrow1 ? undefined : (wrapDeg < 0 ? '混叠成低频波' : (Math.abs(r - 1) < 0.015 ? '混叠成直流' : '保真跟踪')),
            subtitleColor: stateCol
          });

          // True wave
          env.viz.drawCurve(ctx, ax, function (tau) {
            return Math.cos(2 * Math.PI * tau);
          }, { color: 'rgba(56, 189, 248, 0.45)', dash: [5, 4], lineWidth: 1.8 });

          // Apparent aliased wave passing through all sample dots: cos(2*pi*(r - round(r))/r * tau)
          var fAlias = (r - nearestInt) / r;
          env.viz.drawCurve(ctx, ax, function (tau) {
            return Math.cos(2 * Math.PI * fAlias * tau);
          }, { color: stateCol, lineWidth: 2.3 });

          // Sample stems
          var stems = [];
          var maxK = Math.floor(3.15 / Math.max(0.05, r));
          for (var i = 0; i <= maxK; i++) {
            var tk = i * r;
            stems.push({
              x: tk,
              y: Math.cos(2 * Math.PI * tk),
              color: P.amber,
              width: 1.8
            });
          }
          env.viz.drawStems(ctx, ax, stems, {});
          if (env.step >= 2) {
            env.viz.drawAnnotation(ctx, ax, 1.6, 1.18, 'Ex2条纹同理：像素稀疏变宽波纹', P.pink, 'center');
          }
        }
      },
      {
        id: 's01',
        tag: '推导',
        title: '采样定理数学全貌：g(t)·δ_Ts(t) 与频谱周期延拓',
        slideRef: '05sampling pp.1–6, 15–21',
        terms: [
          { en: 'Impulse Train Sampling', zh: '理想冲激串采样' },
          { en: 'Spectral Replication', zh: '频谱周期延拓' },
          { en: 'Band-Limited Signal', zh: '带限信号 (|f| ≤ B)' }
        ],
        symbols: [
          { sym: '\\delta_{T_s}(t) = \\sum_n \\delta(t-nT_s)', desc: '周期为 T_s 的理想采样脉冲序列', color: P.amber },
          { sym: 'g_s(t) = g(t)\\delta_{T_s}(t)', desc: '时域乘积：只保留 nT_s 瞬间的波形样本', color: P.cyan },
          { sym: 'G_s(f) = f_s \\sum_k G(f - k f_s)', desc: '频域按间隔 f_s = 1/T_s 复制成无限周期阵列', color: P.green }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: 'g_s(t) = g(t)\\sum_{n=-\\infty}^{\\infty} \\delta(t - nT_s) = \\sum_{n=-\\infty}^{\\infty} g(nT_s)\\,\\delta(t - nT_s)', label: '第一步：时域乘以冲激串把连续信号切成离散样值' },
          { step: 1, latex: '\\delta_{T_s}(t) \\xleftrightarrow{\\mathcal{F}} f_s \\sum_{k=-\\infty}^{\\infty} \\delta(f - k f_s) \\implies G_s(f) = G(f) * \\mathcal{F}\\{\\delta_{T_s}(t)\\}', label: '第二步：时域相乘等于频域卷积' },
          { step: 2, latex: 'G_s(f) = f_s \\sum_{k=-\\infty}^{\\infty} G(f - k f_s),\\qquad f_s - B \\ge B \\iff f_s \\ge 2B', label: '第三步：频谱以 f_s 为周期无限复制，相邻不碰头即无失真条件' }
        ],
        sliders: [
          { key: 'fsRatio', label: '采样率带宽比 fs / B', min: 1.5, max: 3.5, step: 0.1, default: 2.6, decimals: 1 }
        ],
        presets: [
          { label: '安全过采样 (fs=2.8B)', values: { fsRatio: 2.8 } },
          { label: '奈奎斯特临界 (fs=2.0B)', values: { fsRatio: 2.0 } }
        ],
        lines: [
          {
            step: 0,
            sub: '为什么几个离散的点能装下整条连续曲线？在数学上，我们把理想采样写成原信号 $g(t)$ 乘以一串周期为 $T_s$ 的理想冲激串 $\\delta_{T_s}(t)$，结果只在采样时刻 $nT_s$ 留下带权重的尖峰。',
            tts: '为什么区区几个离散的点能装下整条连续曲线？数学上把理想采样写成原信号 g t 乘以一串周期为 T s 的冲激串，结果只在每一个采样时刻留下与信号高度相等的尖峰脉冲。'
          },
          {
            step: 1,
            sub: '切到傅里叶频域看奇迹！间隔 $T_s$ 的冲激串做傅里叶变换，变成间隔 $f_s = 1/T_s$ 的频域冲激串；而时域相乘恰好对应频域卷积！',
            tts: '切换到傅里叶频域就能看到奇迹：时域间隔 T s 的冲激串，变换到频域是一串间隔为 f s 的频域冲激串；而时域相乘恰好对应频域卷积。'
          },
          {
            step: 2,
            sub: '频谱 $G(f)$ 与搬移冲激卷积后，就被原封不动地以 $f_s$ 为步长复制成一排副本 $G(f - kf_s)$！只要第 1 份副本的左边缘 $f_s - B$ 不撞上基带的右边缘 $B$，也就是 $f_s \\ge 2B$，就能用低通滤波器完美抠回原频谱！',
            tts: '频谱 G f 和这串频域冲激卷积后，就像盖印章一样被隔着 f s 原封不动复制成一长排副本。只要右侧第一份副本的左边缘 f s 减 B，不撞上基带信号自己的右边缘 B，也就是采样频率至少大于等于二倍带宽，副本之间相安无事，用低通滤波器就能完美切回原信号。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var fsB = env.params.fsRatio !== undefined ? env.params.fsRatio : 2.6;
          var narrow0 = boxes[0].w < 460;
          var narrow1 = boxes[1].w < 460;

          // Panel 0: Time domain g(t) * impulse train
          var ax0 = env.viz.drawAxes(ctx, boxes[0], {
            xMin: -2.0,
            xMax: 2.0,
            yMin: -1.25,
            yMax: 1.35,
            xGrid: 8,
            yGrid: 4,
            padL: 34,
            xTicks: narrow0 ? [[-2, '-2'], [0, '0'], [2, '2']] : [[-2, '-2'], [-1, '-1'], [0, '0'], [1, '1'], [2, '2']],
            yTicks: [[-1, '-1'], [0, '0'], [1, '+1']],
            title: narrow0 ? '时域乘积 g(t)·δ_Ts(t)' : '时域采样：连续波 g(t) × 冲激串 δ_Ts(t)'
          });

          function sig(t) {
            return 0.62 * Math.cos(1.4 * Math.PI * t) + 0.36 * Math.sin(0.9 * Math.PI * t);
          }

          env.viz.drawCurve(ctx, ax0, sig, { color: P.cyan, lineWidth: 2.1, fillAlpha: 0.09 });
          var Ts = 1 / fsB; // normalized B=1 -> Ts = 1/fsB (scaled slightly for visual clarity: 0.7/B)
          var dtVis = 0.85 / fsB;
          var stems = [];
          var revealFrac = env.step === 0 ? Math.max(0.2, env.stepProgress) : 1;
          var maxN = Math.floor(1.9 / dtVis);
          for (var n = -maxN; n <= maxN; n++) {
            var tn = n * dtVis;
            if ((tn + 2) / 4 > revealFrac) continue;
            stems.push({ x: tn, y: sig(tn), color: P.amber, width: 2.0, arrow: true });
          }
          env.viz.drawStems(ctx, ax0, stems, {});

          // Panel 1: Frequency domain periodic replication G_s(f) = fs sum G(f - k*fs)
          var ax1 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: -5.2,
            xMax: 5.2,
            yMin: -0.1,
            yMax: 1.35,
            xGrid: 8,
            yGrid: 3,
            padL: 32,
            xTicks: narrow1 ? [[-fsB, '-fs'], [-1, '-B'], [1, 'B'], [fsB, 'fs']] : [[-fsB, '-fs'], [-1, '-B'], [0, '0'], [1, 'B'], [fsB, 'fs']],
            yTicks: [[0, '0'], [1, 'fs·G']],
            title: narrow1 ? ('频谱复制 (fs=' + fsB.toFixed(1) + 'B)') : ('频域周期延拓 G_s(f)（间隔 fs = ' + fsB.toFixed(1) + 'B）'),
            subtitle: narrow1 ? undefined : (fsB >= 2.0 ? '无重叠' : '发生混叠!'),
            subtitleColor: fsB >= 2.0 ? P.green : P.red
          });

          if (env.step >= 2) {
            env.viz.drawShadedBand(ctx, ax1, -fsB / 2, fsB / 2, 'rgba(52, 211, 153, 0.14)', narrow1 ? 'LPF' : '理想LPF通带');
          }

          function triSpec(u) {
            var au = Math.abs(u);
            return au < 1 ? (1 - au) : 0;
          }

          // Replicas k = -2, -1, +1, +2
          var ks = [-2, -1, 1, 2];
          for (var ki = 0; ki < ks.length; ki++) {
            (function (kVal) {
              if (env.step < 1 && Math.abs(kVal) > 0) return;
              env.viz.drawCurve(ctx, ax1, function (f) {
                return triSpec(f - kVal * fsB);
              }, { color: P.amber, lineWidth: 1.8, dash: [4, 3], fillAlpha: 0.12 });
            })(ks[ki]);
          }
          // Baseband k = 0
          env.viz.drawCurve(ctx, ax1, triSpec, { color: P.cyan, lineWidth: 2.5, fillAlpha: 0.20 });

          if (fsB >= 2.0 && env.step >= 2) {
            env.viz.drawAnnotation(ctx, ax1, (1 + (fsB - 1)) / 2, 0.35, fsB > 2.05 ? '保护带' : '临界相接', P.green, 'center');
          } else if (fsB < 2.0) {
            env.viz.drawShadedBand(ctx, ax1, fsB - 1, 1, 'rgba(251, 113, 133, 0.26)', '混叠!');
          }
        }
      },
      {
        id: 's02',
        tag: '易错辨析',
        title: '三种采样状态对比：过采样、奈奎斯特临界与欠采样混叠',
        slideRef: '05sampling pp.19–22',
        terms: [
          { en: 'Oversampling (fs > 2B)', zh: '过采样（留出过渡保护带）' },
          { en: 'Nyquist Rate (fs = 2B)', zh: '奈奎斯特临界速率' },
          { en: 'Undersampling / Aliasing', zh: '欠采样混叠（高频折返）' }
        ],
        symbols: [
          { sym: 'f_s > 2B', desc: '实际工程留出保护带 [B, f_s-B]，普通低通即可复原', color: P.green },
          { sym: 'f_s = 2B', desc: '理论极限，须用不可实现的理想砖墙低通滤波器', color: P.amber },
          { sym: 'f_s < 2B', desc: '频谱折叠加和，必须预先在采样前加抗混叠低通滤波', color: P.red }
        ],
        errata: '易错提醒：抗混叠低通滤波器（Anti-aliasing LPF）必须放在采样器「之前」，一旦欠采样发生混叠，采样之后再怎么滤波都救不回来了！',
        formulas: [
          { step: 0, latex: '\\text{Case 1 (} f_s > 2B \\text{)：副本间隙 } \\Delta f = f_s - 2B > 0 \\implies \\text{非理想斜坡低通即可无失真提取}', label: '过采样是唯一能用现实滤波器实现的方案（如语音 3.4k 用 8k 采样）' },
          { step: 1, latex: '\\text{Case 2 (} f_s = 2B \\text{)：副本尖对尖贴合} \\implies \\text{需理想矩形滤波，且临界正弦 } \\sin(2\\pi B t) \\text{ 刚好采在零点消失}', label: '奈奎斯特边界陷阱：带宽若恰在 B 有冲激（纯正弦），fs=2B 未必能采全' },
          { step: 2, latex: '\\text{Case 3 (} f_s < 2B \\text{)：} f_0 > \\frac{f_s}{2} \\text{ 折返成假低频 } f_{\\text{alias}} = |f_0 - k f_s|', label: '时域表现：稀疏样点完美串出一条根本不存在的低频正弦波' }
        ],
        sliders: [
          { key: 'fsOverB', label: '采样率比 fs / B (设原频 f0 = B = 1)', min: 1.2, max: 4.0, step: 0.1, default: 1.4, decimals: 1 }
        ],
        presets: [
          { label: 'Case 1: 过采样 (fs=3.0B)', values: { fsOverB: 3.0 } },
          { label: 'Case 2: 奈奎斯特临界 (fs=2.0B)', values: { fsOverB: 2.0 } },
          { label: 'Case 3: 欠采样混叠! (fs=1.4B)', values: { fsOverB: 1.4 } }
        ],
        lines: [
          {
            step: 0,
            sub: '拖动滑块把三种采样一次看透！当 $f_s / B > 2$（比如 $3.0$），相邻频谱副本之间有宽敞的绿色保护带，现实电路里带过渡斜坡的低通滤波器就能轻松切出基带。这也是为什么 $3.4\\text{ kHz}$ 电话不用 $6.8\\text{ kHz}$ 而用 $8\\text{ kHz}$ 采样！',
            tts: '把滑块拖起来，一次性看透采样定理的三种状态。当 f s 比 B 大于二，比如三倍时，相邻频谱副本之间留有宽敞的绿色保护带，实际电路里的过渡带滤波器就能轻松把基带切出来。所以三点四千赫兹电话要用八千赫兹采样，留出富余。'
          },
          {
            step: 1,
            sub: '卡在临界点 $f_s / B = 2.0$：左右副本肩并肩正好贴死在 $f = B$ 处。理论上矩形低通仍能复原，但需要现实中不存在的砖墙滤波器；甚至如果正弦波恰好采在所有过零点上，样值全为零直接丢失！',
            tts: '如果死死卡在临界点 f s 等于两倍 B，相邻频谱正好肩并肩顶死。这不仅要求现实中造不出来的理想砖墙滤波器，而且对于恰好踩在最高频 B 处的正弦波，只要采样点全落在过零点，采出来就是一条全零平线。'
          },
          {
            step: 2,
            sub: '一旦降到 $f_s / B < 2$（当前默认 $1.4$），红色阴影区就是发生折叠相加的混叠灾难！看下方时域图：蓝色高频正弦 $f_0=1$ 采出的橙色点，竟严丝合缝串出一条红色假低频波 $|1 - 1.4|=0.4$！记住考点：防混叠低通滤波必须放在采样之前！',
            tts: '一旦降到两倍 B 以下，比如一点四倍，上方红色阴影区就发生了不可逆的混叠重叠。看下方时域图最震撼：原本快速震荡的蓝色正弦波，被采出的橙色点居然严丝合缝地连成了一条根本不存在的红色低频假波！记住考前铁律：抗混叠滤波器一定要加在采样之前。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var fs = env.params.fsOverB !== undefined ? env.params.fsOverB : 1.4;
          var B = 1.0;
          var narrow0 = boxes[0].w < 460;
          var narrow1 = boxes[1].w < 460;

          // Panel 0: Spectrum & overlap
          var ax0 = env.viz.drawAxes(ctx, boxes[0], {
            xMin: -3.2,
            xMax: 3.2,
            yMin: -0.1,
            yMax: 1.45,
            xGrid: 6,
            yGrid: 3,
            padL: 32,
            xTicks: narrow0 ? [[-fs, '-fs'], [-1, '-B'], [1, 'B'], [fs, 'fs']] : [[-fs, '-fs'], [-1, '-B'], [0, '0'], [1, 'B'], [fs, 'fs']],
            yTicks: [[0, '0'], [1, '1']],
            title: narrow0 ? ('频谱状态 fs=' + fs.toFixed(1) + 'B') : ('频域对比：fs = ' + fs.toFixed(1) + 'B（B=1）'),
            subtitle: narrow0 ? undefined : (fs > 2.02 ? 'Case1 过采样' : (Math.abs(fs - 2.0) <= 0.02 ? 'Case2 临界' : 'Case3 混叠!')),
            subtitleColor: fs > 2.02 ? P.green : (Math.abs(fs - 2.0) <= 0.02 ? P.amber : P.red)
          });

          function tri(u) {
            var au = Math.abs(u);
            return au < 1 ? 1 - au : 0;
          }

          if (fs > 2.02) {
            env.viz.drawShadedBand(ctx, ax0, 1, fs - 1, 'rgba(52, 211, 153, 0.16)', '保护带');
            env.viz.drawShadedBand(ctx, ax0, -(fs - 1), -1, 'rgba(52, 211, 153, 0.16)');
          } else if (fs < 1.98) {
            env.viz.drawShadedBand(ctx, ax0, fs - 1, 1, 'rgba(251, 113, 133, 0.25)', '混叠区!');
            env.viz.drawShadedBand(ctx, ax0, -1, -(fs - 1), 'rgba(251, 113, 133, 0.25)', '混叠区!');
          }

          env.viz.drawCurve(ctx, ax0, function (f) { return tri(f - fs); }, { color: P.amber, dash: [4, 3], lineWidth: 1.7, fillAlpha: 0.1 });
          env.viz.drawCurve(ctx, ax0, function (f) { return tri(f + fs); }, { color: P.amber, dash: [4, 3], lineWidth: 1.7, fillAlpha: 0.1 });
          env.viz.drawCurve(ctx, ax0, tri, { color: P.cyan, lineWidth: 2.2, fillAlpha: 0.16 });
          if (fs < 1.98) {
            env.viz.drawCurve(ctx, ax0, function (f) {
              return tri(f) + tri(f - fs) + tri(f + fs) + tri(f - 2 * fs) + tri(f + 2 * fs);
            }, { color: P.red, lineWidth: 2.3 });
          }

          // Panel 1: Time domain aliasing demonstration for single tone f0 = 1.0
          var fAlias = Math.abs(1.0 - fs * Math.round(1.0 / fs));
          var aliased = fs < 1.98;
          var ax1 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: 0,
            xMax: 4.2,
            yMin: -1.35,
            yMax: 1.4,
            xGrid: 8,
            yGrid: 4,
            padL: 32,
            xTicks: narrow1 ? [[0, '0'], [2, '2s'], [4, '4s']] : [[0, '0'], [1, '1s'], [2, '2s'], [3, '3s'], [4, '4s']],
            yTicks: [[-1, '-1'], [0, '0'], [1, '+1']],
            title: narrow1 ? (aliased ? ('假波 f=' + fAlias.toFixed(1)) : '时域保真恢复') : ('时域对比：真频 f0=1.0 vs ' + (aliased ? ('假低频 ' + fAlias.toFixed(2)) : '无混叠复原'))
          });

          env.viz.drawCurve(ctx, ax1, function (t) { return Math.cos(2 * Math.PI * t); }, { color: P.cyan, lineWidth: 2.0 });
          if (aliased) {
            env.viz.drawCurve(ctx, ax1, function (t) { return Math.cos(2 * Math.PI * fAlias * t); }, { color: P.red, lineWidth: 2.4 });
          }
          var stems = [];
          var count = Math.floor(4.15 * fs);
          for (var n = 0; n <= count; n++) {
            var tn = n / fs;
            stems.push({ x: tn, y: Math.cos(2 * Math.PI * tn), color: P.amber, width: 1.9 });
          }
          env.viz.drawStems(ctx, ax1, stems, {});
          if (aliased) {
            env.viz.drawAnnotation(ctx, ax1, 2.1, 1.12, '红线穿全了所有采样点→彻底冒充低频!', P.red, 'center');
          } else {
            env.viz.drawAnnotation(ctx, ax1, 2.1, 1.12, '采样足够密，只能唯一还原蓝波', P.green, 'center');
          }
        }
      },
      {
        id: 's03',
        tag: '推导',
        title: '时域 sinc 内插完美复原 vs 阶梯保持 (ZOH) 与平顶抽样',
        slideRef: '05sampling pp.23–26',
        terms: [
          { en: 'Sinc Interpolation', zh: '辛克脉冲内插重构' },
          { en: 'Zero-Order Hold (ZOH)', zh: '零阶保持 / 阶梯近似' },
          { en: 'Flat-Top Aperture Effect', zh: '平顶抽样与孔径滚降失真' }
        ],
        symbols: [
          { sym: 'h(t) = \\operatorname{sinc}(f_s t)', desc: '理想低通滤波器冲激响应（每步恰好在其余采样点过零）', color: P.cyan },
          { sym: 'H_{\\text{ZOH}}(f) = T_s \\operatorname{sinc}(f T_s) e^{-j\\pi f T_s}', desc: '平顶宽度为 T_s 的矩形保持频响（带高频滚降）', color: P.amber },
          { sym: 'H_{\\text{eq}}(f) = 1 / \\operatorname{sinc}(f \\tau)', desc: '用逆 sinc 均衡器抵消平顶孔径滚降失真', color: P.green }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: 'g(t) = \\sum_{n=-\\infty}^{\\infty} g(nT_s)\\,\\operatorname{sinc}\\!\\big(f_s(t - nT_s)\\big)\\qquad\\big(f_s = 2B\\big)', label: '频域乘理想矩形低通 ⟺ 时域把每个样点展开成一朵 sinc 波纹相加' },
          { step: 1, latex: '\\operatorname{sinc}(k - n) = \\begin{cases} 1, & k = n \\\\ 0, & k \\neq n \\end{cases} \\implies \\text{各样点的插值拖尾在采样点处正交零串扰}', label: '拖尾虽无限长，但在所有邻居的整数时刻精确穿过零点' },
          { step: 2, latex: 'g_{\\text{flat}}(t) = \\sum_n g(nT_s)\\,\\operatorname{rect}\\!\\left(\\frac{t - nT_s}{\\tau}\\right) \\xleftrightarrow{\\mathcal{F}} \\tau\\operatorname{sinc}(f\\tau)\\,G_s(f)', label: '实际采样保持电路带来 sinc(fτ) 高频衰减（孔径效应），需均衡补平' }
        ],
        sliders: [
          { key: 'nCount', label: '叠加 sinc 样点个数', min: 1, max: 9, step: 1, default: 9, decimals: 0 },
          { key: 'zohMode', label: '对比零阶保持 ZOH (0关 / 1开)', min: 0, max: 1, step: 1, default: 0, decimals: 0 }
        ],
        presets: [
          { label: '看 3 点 sinc 正交过零', values: { nCount: 3, zohMode: 0 } },
          { label: '9 点完美加回原曲线', values: { nCount: 9, zohMode: 0 } },
          { label: '打开 ZOH 平顶保持对比', values: { nCount: 9, zohMode: 1 } }
        ],
        lines: [
          {
            step: 0,
            sub: '在频域用理想矩形低通切出基带，回到时域到底发生了什么？矩形的逆傅里叶变换正是 $\\operatorname{sinc}$ 函数！于是每个离散样值都会向右左辐射出一朵 $\\operatorname{sinc}\\big(f_s(t - nT_s)\\big)$ 波纹。',
            tts: '在频域用理想矩形低通滤出基带，翻译回时域究竟发生了什么？矩形窗的傅里叶逆变换正是辛克函数。于是每一个采样冲激点经过低通滤波器后，都会向左右各展开成一朵辛克波纹。'
          },
          {
            step: 1,
            sub: '仔细看画布上每条彩色细线：每朵 $\\operatorname{sinc}$ 曲线在自己峰值处等于 $g(nT_s)$，而在其他所有采样点 $kT_s$ 上居然全部精确穿过零点！把所有波纹叠加起来（绿色粗线），严丝合缝还原出原始蓝色信号！',
            tts: '仔细观察画布上每一条彩色细线：每朵辛克波纹在自己的采样时刻顶到样本值，而在其他所有邻居的采样时刻，全部精确地穿过零点、互不打扰。把这些波纹加在一起，绿色粗线就严丝合缝地重新拼回了原始平滑曲线。'
          },
          {
            step: 2,
            sub: '然而真实硬件造不出宽度为零的理想冲激与无限长的 $\\operatorname{sinc}$。实际电路用采样保持器把每个样值拉成平顶矩形脉冲（橙色 ZOH 阶梯），这在频域等价于乘上 $\\operatorname{sinc}(f\\tau)$，导致高频边缘略微滚降（孔径效应），在前后级加一个 $1/\\operatorname{sinc}(f\\tau)$ 均衡器就能补平！',
            tts: '不过真实硬件造不出无限窄的冲激和无限长的辛克滤波器。实际电路用采样保持器把每个样值拉成矩形平顶，比如橙色的零阶保持阶梯，这在频域相当于乘上了一个辛克滚降因子，让高频略微变暗。工程上只要在滤波前后加上逆辛克均衡器，就能轻松补平这段滚降。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var nCount = Math.round(env.params.nCount !== undefined ? env.params.nCount : 9);
          var showZoh = (env.params.zohMode || 0) >= 0.5 || env.step >= 2;
          var narrow0 = boxes[0].w < 460;
          var narrow1 = boxes[1].w < 460;

          // Bandlimited signal with B = 0.45 < 0.5 = fs/2 (Ts = 1), fast 1/t^2 decay at tails
          function origSig(t) {
            return 0.88 * Math.pow(env.math.sinc(0.45 * t), 2) + 0.52 * Math.pow(env.math.sinc(0.45 * (t - 1.3)), 2) - 0.35 * Math.pow(env.math.sinc(0.45 * (t + 1.5)), 2);
          }

          var ax0 = env.viz.drawAxes(ctx, boxes[0], {
            xMin: -4.2,
            xMax: 4.2,
            yMin: -0.55,
            yMax: 1.25,
            xGrid: 8,
            yGrid: 4,
            padL: 34,
            xTicks: narrow0 ? [[-4, '-4'], [0, '0'], [4, '4']] : [[-4, '-4Ts'], [-2, '-2Ts'], [0, '0'], [2, '2Ts'], [4, '4Ts']],
            yTicks: [[0, '0'], [0.5, '0.5'], [1, '1']],
            title: narrow0 ? ('sinc 叠加 (' + nCount + '点)') : ('时域 sinc 内插叠加（绿色=合成, 蓝色虚线=原信号）')
          });

          var half = Math.floor(nCount / 2);
          var compCols = [P.purple, P.pink, P.amber, P.cyan];
          var activeIndices = [];
          for (var n = -half; n <= half; n++) {
            if (activeIndices.length < nCount) activeIndices.push(n);
          }

          // Individual component sinc waves
          for (var i = 0; i < activeIndices.length; i++) {
            (function (idx, nVal) {
              var amp = origSig(nVal);
              env.viz.drawCurve(ctx, ax0, function (t) {
                return amp * env.math.sinc(t - nVal);
              }, { color: compCols[idx % compCols.length], lineWidth: 1.1, dash: [2, 2] });
            })(i, activeIndices[i]);
          }

          // Original target dashed
          env.viz.drawCurve(ctx, ax0, origSig, { color: P.cyan, lineWidth: 2.0, dash: [5, 4] });

          // Summed sinc reconstruction
          env.viz.drawCurve(ctx, ax0, function (t) {
            var sum = 0;
            for (var j = 0; j < activeIndices.length; j++) {
              var nv = activeIndices[j];
              sum += origSig(nv) * env.math.sinc(t - nv);
            }
            return sum;
          }, { color: P.green, lineWidth: 2.4 });

          // ZOH staircase if enabled
          if (showZoh) {
            var zohPts = [];
            for (var z = -4; z <= 4; z++) {
              zohPts.push([z - 0.5, origSig(z)]);
            }
            zohPts.push([4.5, origSig(4)]);
            env.viz.drawStepCurve(ctx, ax0, zohPts, { color: P.amber, lineWidth: 1.8 });
          }

          // Sample points
          var stems = [];
          for (var si = 0; si < activeIndices.length; si++) {
            var sn = activeIndices[si];
            stems.push({ x: sn, y: origSig(sn), color: P.amber, width: 2 });
          }
          env.viz.drawStems(ctx, ax0, stems, {});

          // Panel 1: Frequency domain aperture rolloff sinc(f * Ts) vs equalizer 1/sinc(f * Ts)
          var ax1 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: 0,
            xMax: 1.0,
            yMin: 0,
            yMax: 1.75,
            xGrid: 5,
            yGrid: 4,
            padL: 34,
            xTicks: [[0, '0'], [0.45, 'B'], [0.5, 'fs/2'], [1.0, 'fs']],
            yTicks: [[0.5, '0.5'], [1.0, '1.0'], [1.5, '1.5']],
            title: narrow1 ? 'ZOH孔径滚降与均衡' : '平顶保持频响 |sinc(fTs)| 滚降与 1/sinc 均衡补偿'
          });
          env.viz.drawShadedBand(ctx, ax1, 0, 0.45, 'rgba(56, 189, 248, 0.12)', '信号通带');
          env.viz.drawCurve(ctx, ax1, function (f) { return f <= 0.5 ? 1.0 : 0.0; }, { color: P.cyan, dash: [5, 4], lineWidth: 1.8 });
          env.viz.drawCurve(ctx, ax1, function (f) { return Math.abs(env.math.sinc(f)); }, { color: P.amber, lineWidth: 2.3 });
          env.viz.drawCurve(ctx, ax1, function (f) {
            if (f > 0.58) return 1.72;
            var s = Math.abs(env.math.sinc(f));
            return Math.min(1.72, 1.0 / Math.max(0.2, s));
          }, { color: P.green, lineWidth: 2.0 });
          env.viz.drawAnnotation(ctx, ax1, 0.30, 0.72, 'ZOH高频滚降', P.amber, 'center');
          env.viz.drawAnnotation(ctx, ax1, 0.34, 1.25, '逆sinc均衡器', P.green, 'center');
        }
      },
      {
        id: 's04',
        tag: '直觉',
        title: '脉冲调制家族 PAM / PWM / PPM 与抗噪优势',
        slideRef: '05sampling pp.27–28',
        terms: [
          { en: 'PAM (Pulse Amplitude Mod.)', zh: '脉冲幅度调制' },
          { en: 'PWM (Pulse Width Mod.)', zh: '脉冲宽度调制' },
          { en: 'PPM (Pulse Position Mod.)', zh: '脉冲位置调制' }
        ],
        symbols: [
          { sym: '\\text{PAM（调高度）}', desc: '脉冲高度随采样值变（实现最简，但最怕幅值噪声）', color: P.cyan },
          { sym: '\\text{PWM（调宽度）}', desc: '等高脉冲只变宽窄（削波即可消幅值噪声）', color: P.amber },
          { sym: '\\text{PPM（调位置）}', desc: '窄等高脉冲只变前后位置（省功耗且极抗噪，需同步）', color: P.green }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: 'm(nT_s) \\xrightarrow{\\text{模拟脉冲调制}} \\text{时间已离散，但脉冲高度/宽度/位置仍取连续实数值}', label: '重要概念：PAM / PWM / PPM 属于模拟脉冲体制，尚未进入 0/1 编码' },
          { step: 1, latex: '\\text{抗幅值噪声排序：} \\text{PPM} > \\text{PWM} \\gg \\text{PAM} \\quad(\\text{以占用更宽脉冲带宽换取抗噪能力})', label: '类比：PAM 像调幅 AM；PWM/PPM 把信息躲到时间轴，像调频 FM！' }
        ],
        sliders: [
          { key: 'noise', label: '信道幅值噪声干扰强度', min: 0.0, max: 0.35, step: 0.05, default: 0.0, decimals: 2 }
        ],
        presets: [
          { label: '无噪纯净三胞胎波形', values: { noise: 0.0 } },
          { label: '加入信道幅值毛刺 (0.3)', values: { noise: 0.30 } }
        ],
        lines: [
          {
            step: 0,
            sub: '注意别混淆概念：采样只是把时间离散成样本序列 $m(nT_s)$，每个样本的数值依然是连续实数，还没有变成 $0/1$ 比特！把这些离散样本分别塞进脉冲的三个几何特征里，就诞生了脉冲调制家族：PAM、PWM 和 PPM。',
            tts: '注意一个很容易考混的概念：采样只是让时间变成离散的，每个采样点依然可以是任意小数，还没变成零一数字比特。如果我们直接用矩形脉冲的三个不同几何特征去承载这些样值，就得到了脉冲调制三兄弟：PAM、PWM 和 PPM。'
          },
          {
            step: 1,
            sub: '对比右侧三行脉冲：PAM 直接调高度，一旦信道混入幅值干扰就被直接破坏；PWM 脉冲全等高、信息藏在宽度里，接收端一刀限幅就抹掉噪声；PPM 把能量缩成超窄等高尖刺只改位置，省电又抗噪，代价是带宽更宽且需要精准同步时钟！',
            tts: '对比三行同步波形：第一行 P A M 直接调高度，实现最简单，但一旦加上滑块里的信道幅值噪声，脉冲顶部高度直接被污染。第二行 P W M 脉冲全等高、靠宽窄传递信息，接收端砍掉顶部毛刺照样认出宽度。第三行 P P M 连宽度也固定到极窄，只移动脉冲左右位置，最省功耗最抗噪，代价比是要更宽带宽和精准时钟同步。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var noise = env.params.noise !== undefined ? env.params.noise : 0.0;
          var narrow0 = boxes[0].w < 460;

          function msg(t) {
            return 0.78 * Math.sin((2 * Math.PI * t) / 4.0);
          }

          var ax0 = env.viz.drawAxes(ctx, boxes[0], {
            xMin: 0,
            xMax: 4.0,
            yMin: -1.15,
            yMax: 1.25,
            xGrid: 8,
            yGrid: 4,
            padL: 32,
            xTicks: [[0, '0'], [1, 'T'], [2, '2T'], [3, '3T'], [4, '4T']],
            yTicks: [[-1, '-1'], [0, '0'], [1, '+1']],
            title: narrow0 ? '原信号与样值' : '原连续信号 m(t) 与等间隔采样点'
          });
          env.viz.drawCurve(ctx, ax0, msg, { color: P.cyan, lineWidth: 2.2, fillAlpha: 0.12 });
          var nSamp = 8;
          var Ts = 4.0 / nSamp;
          var stems = [];
          for (var i = 0; i < nSamp; i++) {
            var ts = (i + 0.5) * Ts;
            stems.push({ x: ts, y: msg(ts), color: P.amber, width: 2.2 });
          }
          env.viz.drawStems(ctx, ax0, stems, {});

          // Panel 1: 3 custom lanes for PAM, PWM, PPM
          var b1 = boxes[1];
          env.viz.roundRect(ctx, b1.x, b1.y, b1.w, b1.h, 10);
          ctx.fillStyle = P.panelBg;
          ctx.fill();
          ctx.strokeStyle = '#1e2948';
          ctx.stroke();
          env.viz.drawBadge(ctx, b1.x + 8, b1.y + 4, b1.w < 460 ? 'PAM / PWM / PPM' : '三种脉冲调制对比（幅值噪=' + noise.toFixed(2) + '）', P.cyan, false);

          var padL = 48;
          var padR = 12;
          var padT = 30;
          var padB = 10;
          var plotW = Math.max(40, b1.w - padL - padR);
          var laneH = (b1.h - padT - padB) / 3;
          var slotW = plotW / nSamp;
          var noiseOffsets = [0.7, -0.9, 0.5, -0.6, 0.85, -0.75, 0.4, -0.95];

          var laneDefs = [
            { name: 'PAM', col: P.cyan, sub: '调高度' },
            { name: 'PWM', col: P.amber, sub: '调宽度' },
            { name: 'PPM', col: P.green, sub: '调位置' }
          ];

          for (var ln = 0; ln < 3; ln++) {
            var lyTop = b1.y + padT + ln * laneH;
            var baseLine = lyTop + laneH * 0.72;
            var maxH = laneH * 0.56;

            ctx.font = '700 11px sans-serif';
            ctx.fillStyle = laneDefs[ln].col;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(laneDefs[ln].name, b1.x + 8, lyTop + laneH * 0.44);
            ctx.font = '10px sans-serif';
            ctx.fillStyle = P.muted;
            ctx.fillText(laneDefs[ln].sub, b1.x + 8, lyTop + laneH * 0.72);

            // Baseline
            ctx.strokeStyle = P.grid;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(b1.x + padL, baseLine);
            ctx.lineTo(b1.x + padL + plotW, baseLine);
            ctx.stroke();

            for (var s = 0; s < nSamp; s++) {
              var sx0 = b1.x + padL + s * slotW;
              // Slot divider
              ctx.strokeStyle = 'rgba(100,116,139,0.22)';
              ctx.beginPath();
              ctx.moveTo(sx0, lyTop + 4);
              ctx.lineTo(sx0, lyTop + laneH - 4);
              ctx.stroke();

              var val = msg((s + 0.5) * Ts); // in [-0.78, 0.78]
              var norm01 = (val + 0.85) / 1.70; // in (0, 1)
              var jitter = noise * noiseOffsets[s];

              ctx.fillStyle = laneDefs[ln].col;
              if (ln === 0) {
                // PAM: bipolar or shifted height + noise pollution on top
                var h = Math.max(4, (norm01 * 0.82 + 0.1 + jitter * 0.45) * maxH);
                var pw = slotW * 0.46;
                ctx.fillRect(sx0 + (slotW - pw) / 2, baseLine - h, pw, h);
              } else if (ln === 1) {
                // PWM: constant height (+ top jitter ripple visually clipped)
                var h2 = maxH * 0.78;
                var w2 = slotW * (0.14 + 0.66 * norm01);
                ctx.fillRect(sx0 + 3, baseLine - h2, w2, h2);
                if (noise > 0.05) {
                  ctx.fillStyle = 'rgba(251, 113, 133, 0.7)';
                  ctx.fillRect(sx0 + 3, baseLine - h2 - Math.abs(jitter) * 8, w2, 3);
                }
              } else {
                // PPM: narrow fixed pulse shifted in slot
                var h3 = maxH * 0.82;
                var w3 = Math.max(4, slotW * 0.16);
                var xOff = 3 + (slotW - w3 - 6) * norm01;
                ctx.fillRect(sx0 + xOff, baseLine - h3, w3, h3);
                if (noise > 0.05) {
                  ctx.fillStyle = 'rgba(251, 113, 133, 0.7)';
                  ctx.fillRect(sx0 + xOff, baseLine - h3 - Math.abs(jitter) * 8, w3, 3);
                }
              }
            }
          }
        }
      },
      {
        id: 's05',
        tag: '直觉',
        title: '时分复用 TDM：多路低速话音如何排着队挤进一根光纤？',
        slideRef: '05sampling pp.28–29',
        terms: [
          { en: 'TDM (Time-Division Multiplexing)', zh: '时分复用' },
          { en: 'Commutator / Decommutator', zh: '发送分配开关 / 接收解复用开关' },
          { en: 'Guard Time & Frame Sync', zh: '保护时隙与帧同步头' }
        ],
        symbols: [
          { sym: 'T_s', desc: '整帧周期（每路每 T_s 秒各被轮询采样 1 次）', color: P.cyan },
          { sym: 'T_s / M', desc: 'M 路复用时每路占用的窄时隙', color: P.amber },
          { sym: 'B_{\\text{TDM}} \\propto M \\cdot B', desc: 'M 路共享一根高速线，总脉冲率扩展 M 倍', color: P.green }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: '\\text{FDM（第3章）：同时间分跑道 } (\\Delta f) \\quad\\text{vs}\\quad \\text{TDM（第5章）：同跑道分时隙 } (\\Delta t)', label: '时域复用与频域复用的完美对偶' },
          { step: 1, latex: 'M\\text{ 路复用} \\implies \\text{脉宽压窄至 } \\le \\frac{T_s}{M} \\implies \\text{须留保护时隙防串道 + 帧同步标记对齐号}', label: '护卫带宽（FDM）对应 保护时隙与帧同步头（TDM）' }
        ],
        sliders: [
          { key: 'channels', label: '复用用户路数 M', min: 2, max: 4, step: 1, default: 3, decimals: 0 }
        ],
        presets: [
          { label: '2 路轮流', values: { channels: 2 } },
          { label: '3 路交织', values: { channels: 3 } },
          { label: '4 路满帧', values: { channels: 4 } }
        ],
        lines: [
          {
            step: 0,
            sub: '脉冲采样把信号变成极窄的脉冲，结果两个采样点之间绝大多数时间信道都在闲着！时分复用 TDM 顺势而生：在发端装一个高速旋转切换开关，在 $T_s$ 周期内轮流把 Ch1、Ch2、Ch3 的窄脉冲排队插进空隙，共享同一根光纤！',
            tts: '采样后每个脉冲都变得特别窄，也就是说绝大多数时间整条光纤其实空着闲着。时分复用 T D M 顺势而生：只要在发射端装一个高速旋转开关，在一个采样周期里轮流把第一路、第二路、第三路的窄脉冲排队挤进同一根信道。'
          },
          {
            step: 1,
            sub: '对比第 3 章学的频分复用 FDM：FDM 是大家同时发但各自占不同频段跑道，中间留保护带宽；TDM 是大家共用一整条大马路但按微秒分时隙轮流发，中间必须留保护时隙（Guard Time）防止脉冲拖尾串道，并在每帧开头加上帧同步头以免接收开关找错人！',
            tts: '对比第三章学过的频分复用 F D M：频分复用是大家同时开口说话，各自占用不同频段跑道，中间留保护带宽；而时分复用是大家共用一条超宽带跑道，排好队列分时隙依次通行，中间同样要留一点点保护时间隙，并在每帧开头打上帧同步头，防止接收开关把甲的声音分给乙。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var M = Math.round(env.params.channels !== undefined ? env.params.channels : 3);
          var chCols = [P.cyan, P.amber, P.pink, P.green];
          var t = env.time;

          // Panel 0: Animated Commutator -> Shared Line -> Decommutator
          var b0 = boxes[0];
          env.viz.roundRect(ctx, b0.x, b0.y, b0.w, b0.h, 10);
          ctx.fillStyle = P.panelBg;
          ctx.fill();
          ctx.strokeStyle = '#1e2948';
          ctx.stroke();
          env.viz.drawBadge(ctx, b0.x + 8, b0.y + 4, b0.w < 460 ? (M + '路同步旋转开关') : ('TDM 发收同步切换开关（M=' + M + '路）'), P.cyan, false);

          var activeCh = Math.floor(t * 2.2) % M;
          var xIn = b0.x + 14;
          var xSwL = b0.x + b0.w * 0.30;
          var xSwR = b0.x + b0.w * 0.70;
          var xOut = b0.x + b0.w - 14;
          var yMid = b0.y + b0.h * 0.56;
          var spanY = Math.min(b0.h * 0.62, 130);

          // Draw shared highway in middle
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(xSwL, yMid);
          ctx.lineTo(xSwR, yMid);
          ctx.stroke();

          ctx.font = '600 10.5px sans-serif';
          ctx.fillStyle = P.muted;
          ctx.textAlign = 'center';
          ctx.fillText('共享高速信道 (TDM帧)', (xSwL + xSwR) / 2, yMid - 14);

          // Moving packets along shared line
          for (var pkt = 0; pkt < 4; pkt++) {
            var pFrac = ((t * 0.55 + pkt * 0.25) % 1);
            var pCh = (Math.floor(t * 0.55 * 4) - pkt + 100 * M) % M;
            var px = xSwL + pFrac * (xSwR - xSwL);
            ctx.fillStyle = chCols[pCh];
            ctx.fillRect(px - 6, yMid - 6, 12, 12);
          }

          for (var c = 0; c < M; c++) {
            var cy = yMid - spanY / 2 + (M === 1 ? 0.5 : c / (M - 1)) * spanY;
            var isAct = c === activeCh;
            ctx.strokeStyle = chCols[c];
            ctx.lineWidth = isAct ? 2.6 : 1.4;

            // Left input wire
            ctx.beginPath();
            ctx.moveTo(xIn, cy);
            ctx.lineTo(xSwL - 28, cy);
            ctx.stroke();

            // Right output wire
            ctx.beginPath();
            ctx.moveTo(xSwR + 28, cy);
            ctx.lineTo(xOut, cy);
            ctx.stroke();

            // Wiper arm if active
            if (isAct) {
              ctx.strokeStyle = chCols[c];
              ctx.lineWidth = 2.6;
              ctx.beginPath();
              ctx.moveTo(xSwL - 28, cy);
              ctx.lineTo(xSwL, yMid);
              ctx.moveTo(xSwR, yMid);
              ctx.lineTo(xSwR + 28, cy);
              ctx.stroke();
            }

            // Channel dots & labels
            ctx.fillStyle = chCols[c];
            ctx.beginPath();
            ctx.arc(xSwL - 28, cy, isAct ? 4.5 : 3, 0, Math.PI * 2);
            ctx.arc(xSwR + 28, cy, isAct ? 4.5 : 3, 0, Math.PI * 2);
            ctx.fill();

            ctx.font = '700 10.5px sans-serif';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'bottom';
            ctx.fillText('Ch' + (c + 1), xIn, cy - 3);
            ctx.textAlign = 'right';
            ctx.fillText('Ch' + (c + 1), xOut, cy - 3);
          }

          // Panel 1: Time-slot TDM Frame stream
          var ax = env.viz.drawAxes(ctx, boxes[1], {
            xMin: 0,
            xMax: 2.0,
            yMin: 0,
            yMax: 1.35,
            xGrid: 2 * M,
            yGrid: 2,
            padL: 28,
            xTicks: [[0, '0'], [0.5, '帧1'], [1.0, 'Ts'], [1.5, '帧2'], [2.0, '2Ts']],
            yTicks: [[0, '0'], [1, '1']],
            title: boxes[1].w < 460 ? '交织时隙帧结构' : 'TDM 输出时隙波形（各路占 Ts/' + M + ' + 保护隙）'
          });

          var heights = [0.95, 0.55, 0.78, 0.42];
          var slotDur = 1.0 / M;
          for (var fr = 0; fr < 2; fr++) {
            // Frame sync marker at start of frame
            var fStart = fr * 1.0;
            ctx.save();
            ctx.fillStyle = 'rgba(148, 163, 184, 0.25)';
            var sxSync = ax.toX(fStart);
            ctx.fillRect(sxSync, ax.toY(1.18), 5, ax.toY(0) - ax.toY(1.18));
            ctx.restore();

            for (var sIdx = 0; sIdx < M; sIdx++) {
              var slotStart = fStart + sIdx * slotDur + slotDur * 0.14;
              var slotEnd = fStart + (sIdx + 1) * slotDur - slotDur * 0.14;
              var hVal = heights[sIdx] * (fr === 0 ? 1.0 : 0.85);
              ctx.save();
              ctx.fillStyle = chCols[sIdx];
              var px0 = ax.toX(slotStart);
              var px1 = ax.toX(slotEnd);
              var py0 = ax.toY(0);
              var py1 = ax.toY(hVal);
              ctx.fillRect(px0, py1, Math.max(4, px1 - px0), py0 - py1);
              ctx.font = '700 10px sans-serif';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'bottom';
              ctx.fillText('C' + (sIdx + 1), (px0 + px1) / 2, py1 - 2);
              ctx.restore();
            }
          }
          env.viz.drawAnnotation(ctx, ax, 1.0, 1.18, '帧同步头 + 保护隙', P.muted, 'center');
        }
      }
    ]
  });
})(window);
