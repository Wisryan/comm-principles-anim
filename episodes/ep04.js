(function (global) {
  'use strict';

  var P = global.COMM_VIZ.PALETTE;

  function resolvePart(env, maxPart) {
    var p = env.params.part !== undefined ? Math.round(env.params.part) : 0;
    if (p >= 1 && p <= maxPart) return p - 1;
    return Math.min(maxPart - 1, Math.max(0, env.step));
  }

  global.COMM_EPISODES.push({
    id: 'ep04',
    chapter: 'Ch.02 信号与系统（下）',
    title: '傅里叶变换、无失真系统与滤波器物理现实',
    slideDeck: 'Ch.02 信号与系统（下）',
    slideRange: 'pp. 48–58',
    homeworkTags: ['HW1 · 3.6-1'],
    scenes: [
      {
        id: 's00',
        tag: '直觉',
        title: '从级数到傅里叶变换 (T₀→∞)、矩形↔sinc 与对偶性',
        slideRef: '02sigsys p.42',
        terms: [
          { en: 'Fourier Transform (FT)', zh: '傅里叶变换' },
          { en: 'Time-Frequency Duality', zh: '时频对偶性' }
        ],
        symbols: [
          { sym: 'G(\\omega)=\\int_{-\\infty}^{\\infty}g(t)e^{-j\\omega t}dt', desc: '连续频谱密度（由离散 T₀D_n 取极限得到）', color: P.cyan },
          { sym: '\\text{rect}(t/\\tau) \\leftrightarrow \\tau\\,\\text{sinc}(f\\tau)', desc: '时域有限矩形 ↔ 频域无限震荡 sinc', color: P.amber }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: 'T_0\\to\\infty \\implies \\omega_0=\\frac{2\\pi}{T_0}\\to d\\omega,\\quad T_0 D_n \\to G(\\omega)', label: '周期无限拉长，离散谱线越来越密，最终连成连续包络线' },
          { step: 1, latex: '\\text{rect}(t/\\tau) \\leftrightarrow \\tau\\,\\text{sinc}(f\\tau);\\qquad 2B\\,\\text{sinc}(2Bt) \\leftrightarrow \\text{rect}(f/2B)', label: '对偶定理：真带限信号（频谱有限）必在时域无限延伸（非因果拖尾）！' }
        ],
        sliders: [
          { key: 'T0', label: '脉冲重复周期 T₀ (脉冲宽 τ=1)', min: 2, max: 20, step: 1, default: 4 }
        ],
        presets: [
          { label: '密集周期 (T₀=2, 谱线很疏)', values: { T0: 2 } },
          { label: '拉宽周期 (T₀=6)', values: { T0: 6 } },
          { label: '趋近非周期 (T₀=18, 连成连续谱)', values: { T0: 18 } }
        ],
        lines: [
          {
            step: 0,
            sub: '上一集处理的周期信号，谱线只立在 $n\\omega_0$ 处。如果把脉冲重复周期 $T_0$ 越拉越长直到无穷大，单个脉冲变成孤立的非周期脉冲，谱线间隔 $1/T_0$ 缩成无穷小，离散柱状图就彻底融合为连续的傅里叶变换曲线 $G(f)$！',
            tts: '上一集处理的都是周期信号，频谱是一根根孤立的柱子。如果把重复周期越拉越大直到无穷远，周期信号就变成了单个孤立脉冲；同时相邻谱线间距周期分之一越来越密，最终所有柱子肩并肩融合成连续光滑的傅里叶变换频谱。'
          },
          {
            step: 1,
            sub: '从图中看清全书最重要的一对对偶公式：时域矩形窗 $\\operatorname{rect}(t/\\tau)$ 对应频域 $\\tau\\operatorname{sinc}(f\\tau)$；倒过来，频域理想方框带限 $\\operatorname{rect}(f/2B)$ 对应时域 $\\operatorname{sinc}(2Bt)$。因此任何严格带限的信号，在时间上绝不可能限时！',
            tts: '从这里直接看透全书最关键的一对对偶关系：时域的矩形方框脉冲，频谱是无限拖尾的辛克函数；倒过来，如果频域做成严格一刀切的方框带限，时域波形必然在正负时间轴上无限拖尾振荡。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var T0 = Math.round(env.params.T0 || 4);
          var tau = 1.0;

          var ax1 = env.viz.drawAxes(ctx, boxes[0], {
            xMin: -9,
            xMax: 9,
            yMin: -0.2,
            yMax: 1.3,
            xGrid: 6,
            yGrid: 2,
            xTicks: [[-6, '-6'], [-3, '-3'], [0, '0'], [3, '3'], [6, '6']],
            yTicks: [[0, '0'], [1, '1']],
            title: '周期矩形脉冲串 (τ=1, T₀=' + T0 + ')'
          });
          env.viz.drawCurve(ctx, ax1, function (t) {
            var u = (((t + T0 * 0.5) % T0) + T0) % T0 - T0 * 0.5;
            return Math.abs(u) < tau * 0.5 ? 1 : 0;
          }, { color: P.cyan, lineWidth: 2.2, fillAlpha: 0.18 });

          var ax2 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: -3.2,
            xMax: 3.2,
            yMin: -0.32,
            yMax: 1.2,
            xGrid: 6,
            yGrid: 3,
            xTicks: [[-3, '-3/τ'], [-1, '-1/τ'], [0, '0'], [1, '1/τ'], [3, '3/τ']],
            yTicks: [[0, '0'], [1, 'τ']],
            title: boxes[1].w < 460 ? 'T₀D_n 趋近 sinc 包络' : '归一化线谱 T₀D_n 与连续包络 τ·sinc(fτ)',
            subtitle: 'Δf = ' + (1 / T0).toFixed(2),
            subtitleColor: P.amber
          });
          env.viz.drawCurve(ctx, ax2, function (f) {
            return tau * env.math.sinc(f * tau);
          }, { color: P.muted, dash: [4, 3], lineWidth: 1.6 });

          var stems = [];
          var maxN = Math.floor(3.2 * T0);
          for (var n = -maxN; n <= maxN; n++) {
            var fn = n / T0;
            var val = tau * env.math.sinc(fn * tau);
            stems.push({
              x: fn,
              y: val,
              color: val >= 0 ? P.amber : P.pink,
              width: T0 > 10 ? 1.5 : 2.5
            });
          }
          env.viz.drawStems(ctx, ax2, stems, {});
        }
      },
      {
        id: 's01',
        tag: '推导',
        title: '傅里叶变换高频性质：调制定理、尺缩展宽与微积分',
        slideRef: '02sigsys pp.43–45',
        terms: [
          { en: 'Modulation / Freq Shift', zh: '调制与频移定理' },
          { en: 'Time-Bandwidth Inverse', zh: '时域压缩 ↔ 频域拉伸' }
        ],
        symbols: [
          { sym: 'g(at) \\leftrightarrow \\frac{1}{|a|}G\\!\\left(\\frac{\\omega}{a}\\right)', desc: '脉冲缩窄 a 倍，频带同步展宽 a 倍', color: P.cyan },
          { sym: 'g(t)\\cos\\omega_c t \\leftrightarrow \\frac{1}{2}[G(\\omega-\\omega_c)+G(\\omega+\\omega_c)]', desc: '乘余弦载波把基带频谱搬到 ±ω_c，幅度各半', color: P.amber }
        ],
        errata: '课件第 44 页勘误：最底下一行把时域相乘性质错印成了“multiplication in time = multiplication in time”，正确对应关系是“multiplication in time = convolution in frequency”（频域卷积再乘 1/(2π)）。',
        formulas: [
          { step: 0, latex: 'g(at)\\leftrightarrow\\frac{1}{|a|}G\\!\\left(\\frac{\\omega}{a}\\right);\\qquad g(t-t_0)\\leftrightarrow G(\\omega)e^{-j\\omega t_0}', label: '压扩反比定律；时移只改线性相位，不改幅度谱大小' },
          { step: 1, latex: 'g(t)\\cos\\omega_c t \\leftrightarrow \\frac{1}{2}\\big[G(\\omega-\\omega_c)+G(\\omega+\\omega_c)\\big]', label: '第 3 章所有幅度调制（AM/DSB/SSB）的共同引擎' },
          { step: 2, latex: '\\frac{dg}{dt}\\leftrightarrow j\\omega G(\\omega),\\quad g_1*g_2\\leftrightarrow G_1 G_2,\\quad g_1\\cdot g_2\\leftrightarrow \\frac{1}{2\\pi}(G_1*G_2)', label: '时域微积分对应乘除 jω；时频域卷积与乘积严格对偶' }
        ],
        sliders: [
          { key: 'scale', label: '时域压缩倍率 a', min: 0.5, max: 2.5, step: 0.25, default: 1.0 },
          { key: 'fc', label: '载波调制中心 f_c', min: 0.0, max: 3.5, step: 0.5, default: 0.0 }
        ],
        presets: [
          { label: '基带三角脉冲 (a=1, fc=0)', values: { scale: 1.0, fc: 0.0 } },
          { label: '时间压半 a=2.0 (带宽翻倍!)', values: { scale: 2.0, fc: 0.0 } },
          { label: '高频搬移调制 (a=1, fc=3.0)', values: { scale: 1.0, fc: 3.0 } }
        ],
        lines: [
          {
            step: 0,
            sub: '做通信一定要用活傅里叶变换的几大核心性质！第一条是尺缩：把脉冲在时间轴上压缩 $a$ 倍（比如扩频码片变短、高速码元变窄），频谱就会向外展宽 $a$ 倍，高度缩为 $1/a$；而单纯延时 $t_0$ 只会乘上线性相位因子 $e^{-j\\omega t_0}$，幅度谱纹丝不动。',
            tts: '学通信必须熟练驾驭傅里叶变换的几大核心性质。第一条是尺缩：把信号在时间上压缩 a 倍，它的频带就会反比例展宽 a 倍；而单纯把波形向右延迟，只会在频域乘上旋转相位，幅度谱纹丝不动。'
          },
          {
            step: 1,
            sub: '第二条是第 3 章调制的总引擎——频移调制定理！把基带信号乘以 $\\cos\\omega_c t$，欧拉公式展开成一正一负两个旋转因子，直接把基带频谱一分为二搬到 $+f_c$ 和 $-f_c$ 处，幅度各留一半！',
            tts: '第二条是下一章各种调制技术的总引擎，频移调制定理。把低频基带信号乘以高频余弦载波，用欧拉公式拆成正负两个旋转因子，就会把基带频谱一分为二，原封不动地搬移到正负载波频率处，高度各留一半。'
          },
          {
            step: 2,
            sub: '第三组是系统分析神技：时域卷积变频域相乘，时域相乘变频域卷积再除以 $2\\pi$；时域求导变频域乘 $j\\omega$ 凸显高频！注意做复合题先时移再调制时，别忘了把时移相位里的 $\\omega$ 一起平移成 $\\omega\\mp\\omega_c$！',
            tts: '第三组是系统分析神技：时域卷积变频域相乘，反过来时域相乘变频域卷积；而时域求导等于频域乘 j 欧米伽，相当于高亮放大了高频成分。注意综合题先时移再调制时，要把相位指数里的欧米伽一起替换成平移后的频率。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var a = env.params.scale || 1.0;
          var fc = env.params.fc || 0.0;
          if (env.step === 1 && env.params.fc === 0.0 && env.params.scale === 1.0) {
            fc = 3.0;
          }

          var ax1 = env.viz.drawAxes(ctx, boxes[0], {
            xMin: -2.2,
            xMax: 2.2,
            yMin: -1.25,
            yMax: 1.25,
            xGrid: 4,
            yGrid: 4,
            xTicks: [[-2, '-2'], [-1, '-1'], [0, '0'], [1, '1'], [2, '2']],
            yTicks: [[-1, '-1'], [0, '0'], [1, '+1']],
            title: fc > 0.1 ? ('tri(' + a.toFixed(1) + 't)cos(2π·' + fc.toFixed(1) + 't)') : ('三角脉冲 tri(' + a.toFixed(1) + 't)')
          });
          env.viz.drawCurve(ctx, ax1, function (t) { return env.math.tri(a * t); }, { color: P.muted, dash: [4, 3], lineWidth: 1.5 });
          env.viz.drawCurve(ctx, ax1, function (t) {
            return env.math.tri(a * t) * Math.cos(2 * Math.PI * fc * t);
          }, { color: P.cyan, lineWidth: 2.2 });

          var ax2 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: -5.5,
            xMax: 5.5,
            yMin: 0,
            yMax: 2.2,
            xGrid: 6,
            yGrid: 3,
            xTicks: [[-3, '-3'], [-1, '-1'], [0, '0'], [1, '1'], [3, '3']],
            yTicks: [[0, '0'], [1, '1'], [2, '2']],
            title: boxes[1].w < 460 ? '频谱 |G(f)| (a=' + a.toFixed(1) + ', fc=' + fc.toFixed(1) + ')' : '傅里叶频谱 |G(f)|（左/右搬移 ±f_c，压窄则变宽）'
          });
          env.viz.drawCurve(ctx, ax2, function (f) {
            var s1 = env.math.sinc((f - fc) / a);
            var s2 = env.math.sinc((f + fc) / a);
            return (0.5 / a) * (s1 * s1 + s2 * s2);
          }, { color: P.amber, lineWidth: 2.3, fillAlpha: 0.18 });
        }
      },
      {
        id: 's02',
        tag: '推导',
        title: '无失真 LTI 传输条件与人耳 vs 人眼失真敏感度',
        slideRef: '02sigsys pp.47–49',
        terms: [
          { en: 'Distortion-Less Transmission', zh: '无失真传输' },
          { en: 'Group Delay τ_g', zh: '群时延（线性相位斜率）' }
        ],
        symbols: [
          { sym: '|H(f)| = k', desc: '全通平坦幅度响应（各频率同比例缩放）', color: P.cyan },
          { sym: '\\theta_h(f) = -2\\pi f t_d', desc: '严格线性相位（等价恒定群时延 t_d，非常数相移！）', color: P.green }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: 'y(t) = k\\,x(t-t_d) \\iff H(f) = k\\,e^{-j2\\pi f t_d} \\implies |H(f)|=k,\\; \\angle H(f)=-2\\pi f t_d', label: '记住区分：恒定延时 = 线性相位斜线，不是水平常数相位！' },
          { step: 1, latex: '\\text{各谐波延迟相同 } t_d \\implies \\text{波形形状不变} \\quad\\big|\\quad \\text{非线性相位} \\implies \\text{各频成分错位散架}', label: '如果高次谐波与基波延迟不同，方波边缘直接坍塌' },
          { step: 2, latex: '\\text{人耳对幅度敏感、对相位不敏感} \\quad\\text{vs}\\quad \\text{人眼对图像相位（边缘对齐）极度敏感}', label: '课件 p.49 工程直觉：音频重幅频，视频重相频' }
        ],
        sliders: [
          { key: 'part', label: '信道模式 (0=自动, 1=无失真, 2=相位乱, 3=高频压低)', min: 0, max: 3, step: 1, default: 0 }
        ],
        presets: [
          { label: '随讲解自动切换', values: { part: 0 } },
          { label: '无失真 (平幅+线性相位)', values: { part: 1 } },
          { label: '相位失真 (波形散架!)', values: { part: 2 } },
          { label: '幅度失真 (边沿变圆)', values: { part: 3 } }
        ],
        lines: [
          {
            step: 0,
            sub: '什么叫系统“完全无失真”？输出只允许整体缩放和统一延时：$y(t)=k\\,x(t-t_d)$。对应频域必须同时满足两条：第一 $|H(f)|=k$ 平坦无衰减，第二相频特性必须是过原点的直线 $\\theta_h(f)=-2\\pi f t_d$！注意千万别把线性相位误记成“恒定相移”。',
            tts: '什么叫线性系统完全无失真传输？意思就是输出波形只能做整体放大缩小以及整体平移延迟。对应到频域，必须同时满足两条铁律：第一幅度响应平坦为常数；第二相位响应必须是过原点的线性斜线，注意恒定延时对应线性斜率相位，而不是水平常数相位。'
          },
          {
            step: 1,
            sub: '为什么相频歪掉这么致命？看画面：即使 $1$ 次、$3$ 次、$5$ 次谐波的幅度一点都没丢，只要它们的相位不再严格按 $-2\\pi f t_d$ 线性对齐，不同频率成分就各走各的时延，合成波形瞬间面目全非！',
            tts: '为什么相位响应歪掉会那么致命？看左图对比：就算基波、三次和五次谐波的幅度一点都没损失，只要它们的相位不再按线性规律同步延迟，各频率到达时间参差不齐，叠加出的脉冲瞬间扭曲散架。'
          },
          {
            step: 2,
            sub: '不过人耳和人眼偏偏长反了！课件第 49 页经典结论：人耳对音频的幅频失真非常敏感，但几乎听不出相位错位；而人眼对图像视频的边缘对齐极其挑剔，破坏 2D 相位图就会糊成雪花，对幅度失真反而宽容得多！',
            tts: '有趣的是，人类的耳朵和眼睛对这两类失真的敏感度完全相反。课件第四十九页给出了工程经典结论：人耳对声音的幅度失真极其敏感，却很难听出纯相位扭曲；而人眼对图像的边缘对齐也就是相位失真极度敏感，对幅度轻微起伏反而宽容得多。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var mode = resolvePart(env, 3);
          var td = 0.14;

          function sigIn(t) {
            return Math.sin(2 * Math.PI * t) + Math.sin(6 * Math.PI * t) / 3 + Math.sin(10 * Math.PI * t) / 5;
          }
          function sigOut(t) {
            var u = t - td;
            if (mode === 0) {
              return 0.9 * (Math.sin(2 * Math.PI * u) + Math.sin(6 * Math.PI * u) / 3 + Math.sin(10 * Math.PI * u) / 5);
            }
            if (mode === 1) {
              return 0.9 * (Math.sin(2 * Math.PI * u) + Math.sin(6 * Math.PI * u + 1.8) / 3 + Math.sin(10 * Math.PI * u - 2.3) / 5);
            }
            return 0.9 * (Math.sin(2 * Math.PI * u) + 0.35 * Math.sin(6 * Math.PI * u) / 3 + 0.1 * Math.sin(10 * Math.PI * u) / 5);
          }

          var titles = ['无失真：仅延迟 t_d', '纯相位失真：幅频平但波形散架', '幅度失真：高频被压低变圆滑'];
          var cols = [P.green, P.red, P.amber];
          var ax1 = env.viz.drawAxes(ctx, boxes[0], {
            xMin: 0,
            xMax: 1.5,
            yMin: -1.4,
            yMax: 1.4,
            xGrid: 6,
            yGrid: 4,
            xTicks: [[0, '0'], [0.5, '0.5'], [1, '1'], [1.5, '1.5']],
            yTicks: [[-1, '-1'], [0, '0'], [1, '+1']],
            title: titles[mode]
          });
          env.viz.drawCurve(ctx, ax1, sigIn, { color: P.cyan, dash: [4, 3], lineWidth: 1.6 });
          env.viz.drawCurve(ctx, ax1, sigOut, { color: cols[mode], lineWidth: 2.3 });

          var ax2 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: 0,
            xMax: 6,
            yMin: -2.2,
            yMax: 1.4,
            xGrid: 6,
            yGrid: 4,
            xTicks: [[1, 'f₀'], [3, '3f₀'], [5, '5f₀']],
            yTicks: [[-2, 'θ'], [0, '0'], [1, '|H|=1']],
            title: boxes[1].w < 460 ? '青=|H(f)|, 粉=相位 θ(f)' : '频响对照：青 = |H(f)|，粉 = θ(f)'
          });
          env.viz.drawCurve(ctx, ax2, function (f) {
            return mode === 2 ? 1 / Math.sqrt(1 + Math.pow(f / 1.8, 2)) : 0.9;
          }, { color: P.cyan, lineWidth: 2.2 });
          env.viz.drawCurve(ctx, ax2, function (f) {
            if (mode === 1) return -0.32 * f + 0.55 * Math.sin(1.1 * f);
            return -0.32 * f;
          }, { color: P.pink, dash: [5, 3], lineWidth: 2.1 });
        }
      },
      {
        id: 's03',
        tag: '作业精讲',
        hwCode: '3.6-1',
        title: 'HW1 作业 3.6-1：波纹相位信道回波与 TDM/FDM 串扰',
        slideRef: 'HW1 · 3.6-1',
        terms: [
          { en: 'Paired Echoes', zh: '成对回波（提前与延后各一）' },
          { en: 'TDM vs FDM Crosstalk', zh: '时分 vs 频分路间串话' }
        ],
        symbols: [
          { sym: 'H(f)=e^{-j2\\pi f t_0}e^{-jk\\sin 2\\pi f T}', desc: '幅频平坦全通，但相位带周期性波纹（k ≪ 1）', color: P.purple },
          { sym: '\\pm\\frac{k}{2}g(t-t_0\\mp T)', desc: '小参数展开生成前后一对微弱回波', color: P.red }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: 'k\\ll 1 \\implies e^{-jk\\sin 2\\pi f T}\\approx 1-jk\\sin 2\\pi f T = 1-\\frac{k}{2}e^{j2\\pi f T}+\\frac{k}{2}e^{-j2\\pi f T}', label: '第一步：小角度一阶泰勒 + 欧拉展开正弦项' },
          { step: 1, latex: 'y(t) \\approx g(t-t_0) + \\frac{k}{2}\\big[g(t-t_0-T) - g(t-t_0+T)\\big]', label: '第二步：乘 e^{-j2πft₀} 后用时移性质反变换出提前 T 与延后 T 的双回波' },
          { step: 2, latex: '\\text{TDM：回波落入邻近时隙} \\Rightarrow \\text{有路间串话！}\\quad\\big|\\quad \\text{FDM：LTI 不生新频} \\Rightarrow \\text{无路间串扰}', label: '考前必记结论：全通波纹伤 TDM 不伤 FDM 邻居' }
        ],
        sliders: [
          { key: 'k', label: '相位波纹幅度 k', min: 0.05, max: 0.45, step: 0.05, default: 0.25 },
          { key: 'T', label: '回波时间偏移 T', min: 0.6, max: 2.0, step: 0.2, default: 1.2 }
        ],
        presets: [
          { label: '典型波纹 (k=0.25, T=1.2)', values: { k: 0.25, T: 1.2 } },
          { label: '大偏移窜邻隙 (k=0.35, T=1.8)', values: { k: 0.35, T: 1.8 } },
          { label: '近理想信道 (k=0.05)', values: { k: 0.05, T: 1.2 } }
        ],
        lines: [
          {
            step: 0,
            sub: '压轴大题作业 3.6-1！信道给的是 $H(f) = e^{-j2\\pi f t_0} e^{-jk\\sin(2\\pi f T)}$，已知波纹很小 $k \\ll 1$。我们把后面的小相位因子做一阶近似 $1 - jk\\sin(2\\pi f T)$，再用欧拉公式把正弦拆成 $e^{j2\\pi f T}$ 和 $e^{-j2\\pi f T}$！',
            tts: '压轴大题来看作业三点六杠一。题目给了一个存在周期相位波纹的全通信道，且起伏系数 k 远小于一。突破口就在这个小系数：把指数做一阶近似等于一减 j k 正弦二派 f 大 T，再用欧拉公式拆开成正负两个复指数。'
          },
          {
            step: 1,
            sub: '乘回主延迟因子 $e^{-j2\\pi f t_0}$ 后直接做反变换，时域输出 $y(t) = g(t-t_0) + \\frac{k}{2}[g(t-t_0-T) - g(t-t_0+T)]$。主脉冲左右两边各长出一个幅度为 $k/2$ 的幽灵回波：前面提前 $T$ 的带负号，后面延后 $T$ 的带正号！',
            tts: '乘回主延迟因子再套用时移性质做反变换，时域输出立刻显形：除了在 t 零处收到主脉冲以外，左右两侧还各冒出一个幅值为二分之 k 的回波！提前大 T 出现的是负号回波，延后大 T 出现的是正号回波。'
          },
          {
            step: 2,
            sub: '最后辨析路间串扰：在时分复用 TDM 里，各个用户靠时间片排座，这俩幽灵回波会直接窜进隔壁用户的时隙造成严重串话；而在频分复用 FDM 里，由于系统是线性时不变且 $|H(f)|=1$，绝不产生任何新频率，各频段井水不犯河水，没有路间干扰！',
            tts: '最后一道关键辨析：这个信道会造成串话干扰吗？对时分复用 T D M 来说，各路靠时间槽隔开，主脉冲前后窜出的回波会直接漏进邻居的时间槽，造成严重路间串话；而对频分复用 F D M 来说，系统线性时不变且不生新频率，邻道之间完全没有串话！'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var k = env.params.k !== undefined ? env.params.k : 0.25;
          var T = env.params.T !== undefined ? env.params.T : 1.2;
          var t0 = 0;

          function pulse(u) {
            return Math.exp(-(u * u) / 0.08);
          }

          // Panel 1: TDM slots & paired echoes
          var ax1 = env.viz.drawAxes(ctx, boxes[0], {
            xMin: -2.5,
            xMax: 2.5,
            yMin: -0.38,
            yMax: 1.22,
            xGrid: 5,
            yGrid: 3,
            xTicks: [[-T, '-T(前邻隙)'], [0, 't₀(本路)'], [T, '+T(后邻隙)']],
            yTicks: [[0, '0'], [1, '1']],
            title: boxes[0].w < 460 ? 'TDM 时域：回波窜入邻隙!' : 'TDM 时域回波：主脉冲 ± 成对回波 (±k/2) 漏进邻隙'
          });
          env.viz.drawShadedBand(ctx, ax1, -2.5, -0.65, 'rgba(251, 113, 133, 0.12)', '用户0');
          env.viz.drawShadedBand(ctx, ax1, 0.65, 2.5, 'rgba(251, 113, 133, 0.12)', '用户2');
          env.viz.drawCurve(ctx, ax1, function (t) {
            return pulse(t - t0);
          }, { color: P.cyan, dash: [4, 3], lineWidth: 1.5 });
          env.viz.drawCurve(ctx, ax1, function (t) {
            return pulse(t - t0) + 0.5 * k * (pulse(t - t0 - T) - pulse(t - t0 + T));
          }, { color: P.amber, lineWidth: 2.3 });
          env.viz.drawAnnotation(ctx, ax1, -T, -0.28, '-k/2 提前回波', P.red, 'center');
          env.viz.drawAnnotation(ctx, ax1, T, 0.5 * k + 0.12, '+k/2 延后回波', P.red, 'center');

          // Panel 2: FDM bands & flat |H|=1
          var ax2 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: 0,
            xMax: 6,
            yMin: -0.55,
            yMax: 1.28,
            xGrid: 6,
            yGrid: 3,
            xTicks: [[1, 'FDM1'], [3, 'FDM2'], [5, 'FDM3']],
            yTicks: [[0, '0'], [1, '|H|=1']],
            title: boxes[1].w < 460 ? 'FDM：LTI 无邻道串扰' : 'FDM 频域：LTI 不生新频 → 无邻道串扰',
            subtitle: '仅带内畸变',
            subtitleColor: P.green
          });
          env.viz.drawShadedBand(ctx, ax2, 0.4, 1.6, 'rgba(56, 189, 248, 0.14)', 'Ch1');
          env.viz.drawShadedBand(ctx, ax2, 2.4, 3.6, 'rgba(52, 211, 153, 0.14)', 'Ch2');
          env.viz.drawShadedBand(ctx, ax2, 4.4, 5.6, 'rgba(251, 191, 36, 0.14)', 'Ch3');
          env.viz.drawCurve(ctx, ax2, function () { return 1; }, { color: P.green, dash: [5, 3], lineWidth: 1.8 });
          env.viz.drawCurve(ctx, ax2, function (f) { return -k * Math.sin(2 * Math.PI * f * T * 0.5); }, { color: P.purple, lineWidth: 2.0 });
        }
      },
      {
        id: 's04',
        tag: '直觉',
        title: '理想滤波器的非因果悖论、Paley-Wiener 与 RC 低通',
        slideRef: '02sigsys pp.50–51',
        terms: [
          { en: 'Causality (h(t)=0 for t<0)', zh: '物理因果性' },
          { en: 'Paley-Wiener Criterion', zh: '帕利-维纳可实现准则' }
        ],
        symbols: [
          { sym: 'h_{\\text{ideal}}(t) = 2B\\,\\text{sinc}(2Bt)', desc: '在 t<0 全程振铃非零 → 提前预报未来，无法造出', color: P.red },
          { sym: 'H_{\\text{RC}}(\\omega) = \\frac{1}{1+j\\omega RC}', desc: '真实一阶 RC 低通：t<0 严格为 0，频响只能衰减不能归零', color: P.green }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: 'h_{\\text{ideal}}(t)=2B\\,\\text{sinc}\\big(2B(t-t_0)\\big) \\neq 0\\ (t<0)\\quad\\forall\\, t_0', label: '不管延迟 t₀ 设多大，t<0 永远有响应（果在因前），违背因果律' },
          { step: 1, latex: '\\int_{-\\infty}^{\\infty}\\frac{\\big|\\ln|H(\\omega)|\\big|}{1+\\omega^2}d\\omega < \\infty \\implies |H(\\omega)|\\text{ 不能在任何连续频段恒为 }0', label: 'Paley-Wiener 准则：真实滤波器只能“压低”阻带，不能“绝对切零”' },
          { step: 2, latex: 'H_{\\text{RC}}(f)=\\frac{1}{1+j2\\pi f RC},\\quad h_{\\text{RC}}(t)=\\frac{1}{RC}e^{-t/(RC)}u(t),\\quad f_{3\\text{dB}}=\\frac{1}{2\\pi RC}', label: 'RC 低通：阶跃因果拖尾 vs 3dB 平滑滚降的经典物理权衡' }
        ],
        sliders: [
          { key: 'rc', label: 'RC 时间常数（秒）', min: 0.2, max: 1.4, step: 0.1, default: 0.5 }
        ],
        presets: [
          { label: '小 RC=0.25 (通带宽, 拖尾短)', values: { rc: 0.25 } },
          { label: '标准 RC=0.50', values: { rc: 0.5 } },
          { label: '大 RC=1.20 (通带窄, 拖尾长)', values: { rc: 1.2 } }
        ],
        lines: [
          {
            step: 0,
            sub: '数学里画个方框理想低通多爽，可惜现实造不出来！把频域方框反变换到时域，冲激响应 $h(t)=2B\\operatorname{sinc}(2B(t-t_0))$ 在 $t<0$ 的红色区间里剧烈震荡——零时刻才敲一下系统，负时刻居然提前响了，无论加多大的延时 $t_0$ 都救不了，彻底违背因果律！',
            tts: '数学里把频域画成一刀切的理想低通多省事，可惜物理世界根本造不出来。把理想方框反变换回时域，冲激响应是辛克函数，在零时刻左侧的负时间区域照样震荡非零。零时刻才输入脉冲，系统却在负时间提前响应，不管往右平移多少延迟都救不回来，这违背物理因果律。'
          },
          {
            step: 1,
            sub: 'Paley-Wiener 可实现准则进一步给它判了死刑：只要频响在任何一段连续带宽上严格等于零，$\\ln|H(\\omega)|$ 的积分就会发散到无穷大。所以真实世界的物理滤波器永远只能压低衰减阻带，不可能一刀切到绝对零！',
            tts: '帕利维纳准则进一步在数学上判了死刑：只要幅频特性在任何一段非零宽度的频带上严格等于零，系统就绝不可能满足因果性。所以现实中的所有物理滤波器，对阻带信号只能尽量压低衰减，永远做不到绝对归零。'
          },
          {
            step: 2,
            sub: '最朴实的物理实现就是一阶 RC 低通：脉冲响应 $h(t)=\\frac{1}{RC}e^{-t/RC}u(t)$ 在 $t<0$ 严丝合缝等于 $0$；代价比是通带滚降缓慢，而且拖动滑块会发现：把 $RC$ 调大滤得更狠，时域拖尾立刻变长，容易挤进下一比特产生码间串扰！',
            tts: '最朴实的因果滤波器就是一颗电阻配一颗电容的一阶低通：它的冲激响应在负时间严格为零，只留单边指数衰减拖尾。不过代价也非常明显：阻带衰减缓慢，而且把阻容时间常数拉大来收窄带宽时，时域拖尾就会变长。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var rc = env.params.rc || 0.5;
          var B = 1.0;

          var ax1 = env.viz.drawAxes(ctx, boxes[0], {
            xMin: -2.2,
            xMax: 3.2,
            yMin: -0.65,
            yMax: 2.3,
            xGrid: 5,
            yGrid: 4,
            xTicks: [[-2, '-2'], [-1, '-1'], [0, 't=0'], [1, '1'], [2, '2'], [3, '3']],
            yTicks: [[0, '0'], [1, '1'], [2, '2']],
            title: boxes[0].w < 460 ? '冲激响应 h(t) 因果性对比' : '冲激响应：红虚=理想 sinc (t<0 非因果)，绿=因果 RC'
          });
          env.viz.drawShadedBand(ctx, ax1, -2.2, 0, 'rgba(251, 113, 133, 0.14)', 't<0 非因果区');
          env.viz.drawCurve(ctx, ax1, function (t) {
            return 1.6 * env.math.sinc(2 * B * t);
          }, { color: P.red, dash: [4, 3], lineWidth: 1.8 });
          env.viz.drawCurve(ctx, ax1, function (t) {
            return t >= 0 ? Math.min(2.25, (1 / rc) * Math.exp(-t / rc)) : 0;
          }, { color: P.green, lineWidth: 2.3, fillAlpha: 0.18 });

          var ax2 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: 0,
            xMax: 2.5,
            yMin: 0,
            yMax: 1.2,
            xGrid: 5,
            yGrid: 4,
            xTicks: [[0, '0'], [1, 'B'], [2, '2B']],
            yTicks: [[0, '0'], [0.707, '-3dB'], [1, '1']],
            title: '幅频响应 |H(f)| (f_3dB=' + (1 / (2 * Math.PI * rc)).toFixed(2) + ')',
            subtitle: '阻带永不为零',
            subtitleColor: P.cyan
          });
          env.viz.drawCurve(ctx, ax2, function (f) { return f <= 1 ? 1 : 0; }, { color: P.red, dash: [4, 3], lineWidth: 1.6 });
          env.viz.drawCurve(ctx, ax2, function (f) {
            var x = 2 * Math.PI * f * rc;
            return 1 / Math.sqrt(1 + x * x);
          }, { color: P.cyan, lineWidth: 2.3, fillAlpha: 0.16 });
        }
      },
      {
        id: 's05',
        tag: '课件例题',
        title: '逼近理想滤波器双雄：Butterworth vs Chebyshev',
        slideRef: '02sigsys pp.52–53 (Fig 3.33)',
        terms: [
          { en: 'Butterworth Filter', zh: '巴特沃斯（最大平坦）滤波器' },
          { en: 'Chebyshev Filter', zh: '切比雪夫（等波纹陡降）滤波器' }
        ],
        symbols: [
          { sym: '|H_{\\text{BW}}(\\omega)|^2 = \\frac{1}{1+(\\omega/\\omega_c)^{2n}}', desc: '通带单调极平坦，阶数 n 越高越贴近方框', color: P.cyan },
          { sym: '|H_{\\text{CB}}(\\omega)|^2 = \\frac{1}{1+\\varepsilon^2 T_n^2(\\omega/\\omega_c)}', desc: '通带内等波纹起伏，换取过渡带悬崖式滚降', color: P.amber }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: '\\text{Butterworth：}|H(\\omega)|^2=\\frac{1}{1+(\\omega/\\omega_c)^{2n}}\\quad(\\text{在 }\\omega=0\\text{ 处 }2n-1\\text{ 阶导数为 }0\\text{，最平坦})', label: '在截止点 ω=ω_c 恒经过 -3 dB (幅度 1/√2 ≈ 0.707)' },
          { step: 1, latex: '\\text{Chebyshev：}|H(\\omega)|^2=\\frac{1}{1+\\varepsilon^2 T_n^2(\\omega/\\omega_c)}\\quad(\\text{通带落于 }\\frac{1}{\\sqrt{1+\\varepsilon^2}}\\le|H|\\le 1)', label: '牺牲通带平坦度允许等波纹起伏，阻带滚降比同阶 Butterworth 陡得多！' }
        ],
        sliders: [
          { key: 'order', label: '滤波器阶数 n', min: 1, max: 8, step: 1, default: 4 },
          { key: 'eps', label: 'Chebyshev 波纹系数 ε', min: 0.2, max: 0.9, step: 0.1, default: 0.5 }
        ],
        presets: [
          { label: '课件 Fig 3.33 (4阶对比)', values: { order: 4, eps: 0.5 } },
          { label: '高阶陡壁 (8阶, ε=0.6)', values: { order: 8, eps: 0.6 } },
          { label: '低阶温和 (2阶, ε=0.3)', values: { order: 2, eps: 0.3 } }
        ],
        lines: [
          {
            step: 0,
            sub: '工程上怎么用因果电路无限逼近理想方框？两大经典武器登场！先看蓝线的 Butterworth 巴特沃斯滤波器：它在零频附近追求“最大平坦”，通带丝般顺滑不抖动，固定在 $\\omega_c$ 处降到 $0.707$（即 $-3\\text{ dB}$），阶数 $n$ 越高越像直角方框。',
            tts: '工程上怎么用物理可实现的因果电路无限逼近理想方框？全靠两大经典滤波器家族。先看蓝色的巴特沃斯滤波器：它在通带里极其平滑，追求最大平坦特性，固定在截止频率处降到负三 d B，阶数越高拐角越锋利。'
          },
          {
            step: 1,
            sub: '如果你嫌同阶 Butterworth 过渡带太缓，就看琥珀线的 Chebyshev 切比雪夫滤波器！它故意放纵通带内产生可控的等波纹上下起伏，换取刚出通带就悬崖式暴跌的超陡滚降！看右图的对数分贝曲线，相同阶数下它的阻带压制力远胜 Butterworth！',
            tts: '如果你嫌同阶巴特沃斯的过渡斜坡不够陡峭，那就请出琥珀色的切比雪夫滤波器。它用非常聪明的工程权衡：故意容忍通带内部产生等幅度的波纹起伏，换取刚过截止频率就悬崖式俯冲的超高衰减速率，用相同器件成本获得强得多的抗邻道干扰能力。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var order = Math.round(env.params.order || 4);
          var eps = env.params.eps || 0.5;
          var wc = 1.0;

          var ax1 = env.viz.drawAxes(ctx, boxes[0], {
            xMin: 0,
            xMax: 2.5,
            yMin: 0,
            yMax: 1.18,
            xGrid: 5,
            yGrid: 4,
            xTicks: [[0, '0'], [1, 'ω_c'], [2, '2ω_c']],
            yTicks: [[0, '0'], [0.707, '0.707'], [1, '1']],
            title: boxes[0].w < 460 ? 'n=' + order + ' 阶幅频对比' : '线性幅频 |H(ω)|（n=' + order + ' 阶：青=Butterworth，琥珀=Chebyshev）'
          });
          env.viz.drawCurve(ctx, ax1, function (w) { return w <= 1 ? 1 : 0; }, { color: P.muted, dash: [4, 3], lineWidth: 1.4 });
          env.viz.drawCurve(ctx, ax1, function (w) {
            return Math.sqrt(env.math.butterworthMagSq(w, wc, order));
          }, { color: P.cyan, lineWidth: 2.3 });
          env.viz.drawCurve(ctx, ax1, function (w) {
            return Math.sqrt(env.math.chebyshevMagSq(w, wc, order, eps));
          }, { color: P.amber, lineWidth: 2.3 });

          var ax2 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: 0.1,
            xMax: 3.0,
            yMin: -45,
            yMax: 4,
            xGrid: 5,
            yGrid: 4,
            xTicks: [[0.5, '0.5'], [1, 'ω_c'], [2, '2ω_c'], [3, '3ω_c']],
            yTicks: [[-40, '-40dB'], [-20, '-20'], [-3, '-3'], [0, '0dB']],
            title: '对数衰减对比 (dB)',
            subtitle: 'Chebyshev 滚降更陡',
            subtitleColor: P.amber
          });
          env.viz.drawCurve(ctx, ax2, function (w) {
            var db = 10 * Math.log10(Math.max(1e-6, env.math.butterworthMagSq(w, wc, order)));
            return Math.max(-44, db);
          }, { color: P.cyan, lineWidth: 2.2 });
          env.viz.drawCurve(ctx, ax2, function (w) {
            var db = 10 * Math.log10(Math.max(1e-6, env.math.chebyshevMagSq(w, wc, order, eps)));
            return Math.max(-44, db);
          }, { color: P.amber, lineWidth: 2.2 });
        }
      },
      {
        id: 's06',
        tag: '推导',
        title: '线性 vs 非线性失真 & 无线多径色散直觉',
        slideRef: '02sigsys pp.54–58',
        terms: [
          { en: 'Linear vs Nonlinear Distortion', zh: '线性失真 vs 非线性失真' },
          { en: 'Multipath Selective Fading', zh: '多径频率选择性衰落' }
        ],
        symbols: [
          { sym: 'y = g_1 x + g_2 x^2 + g_3 x^3 + \\cdots', desc: '非线性放大/二极管展开 → 催生 2f₀, 3f₀ 新频率', color: P.red },
          { sym: 'B \\to 2B,\\; 3B', desc: '非线性使信号带宽成倍膨胀，重创 FDM 邻道', color: P.amber }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: '\\text{线性失真（LTI）：绝不生新频} \\Rightarrow \\text{时域拖宽码间串扰（伤 TDM）}', label: '脉冲过非理想 LTI 信道被展宽色散（Fig 3.35）' },
          { step: 1, latex: '\\text{非线性失真：} x(t)\\text{ 带宽 }B \\implies x^2(t)\\text{ 带宽 }2B,\\; x^3(t)\\text{ 带宽 }3B\\text{（伤 FDM！）}', label: '虽然伤 FDM，但 x² 的乘积效应恰恰是第 3 章调制器/混频器的核心机理' },
          { step: 2, latex: '\\text{多径：} y(t)=\\sum_i \\alpha_i x(t-\\tau_i) \\implies \\text{时延差大造成频率选择性深凹坑}', label: '直射波与反射波相差半个波长时相消，频谱出现周期性深衰落' }
        ],
        sliders: [
          { key: 'drive', label: '放大器输入驱动强度（>1 削顶饱和）', min: 0.4, max: 1.8, step: 0.1, default: 1.3 }
        ],
        presets: [
          { label: '线性小信号 (0.5, 无新谐波)', values: { drive: 0.5 } },
          { label: '饱和削顶 (1.5, 爆出 3f₀/5f₀!)', values: { drive: 1.5 } }
        ],
        lines: [
          {
            step: 0,
            sub: '第 2 章压轴对比三种现实信道失真！第一类线性失真：LTI 信道幅频不平或相位不线性，绝不会凭空变出新频率，所以主要把脉冲拖宽散开，引发时分复用 TDM 的码间干扰。',
            tts: '第二章最后对比三种工程信道失真。第一类是线性失真：线性时不变信道虽然不平坦，但它绝不会凭空造出原信号里没有的新频率，主要危害是把脉冲拖宽，让时分复用相邻符号互相串扰。'
          },
          {
            step: 1,
            sub: '第二类非线性失真（如放大器过载削顶或二极管指数特性）：泰勒展开冒出 $x^2, x^3$ 项，把原来带宽 $B$ 的信号炸成 $2B, 3B$，凭空多出 $3f_0, 5f_0$ 新谐波！这在频分复用 FDM 里会直接炸进邻道！但第 3 章我们会反过来利用非线性来做乘法调制器。',
            tts: '第二类是非线性失真，比如功放过载削顶。泰勒展开多出平方项和立方项，使信号带宽成倍膨胀，凭空炸出原信号根本没有的三次、五次等新谐波，重创频分复用的邻道。不过下一章我们会巧妙反过来利用平方项来做乘法调制器。'
          },
          {
            step: 2,
            sub: '第三类无线多径效应：电波经高楼反射后沿多条路径到达，时延差小呈平坦衰落，时延差大则在频谱上反相抵消，刻出一道道深坑，这就是无线通信最头疼的频率选择性衰落！',
            tts: '第三类是无线信道特有的多径效应：同一信号经建筑物反射后沿着长短不一的多条路径先后到达。如果路径差接近半个波长，两路信号就会在特定频率上反相抵消，让信道频响出现一道道深衰落凹坑。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var drv = env.params.drive || 1.3;
          var norm = Math.tanh(drv);

          function clipOut(t) {
            return Math.tanh(drv * Math.sin(2 * Math.PI * t)) / norm;
          }

          var ax1 = env.viz.drawAxes(ctx, boxes[0], {
            xMin: 0,
            xMax: 2,
            yMin: -1.25,
            yMax: 1.25,
            xGrid: 4,
            yGrid: 4,
            xTicks: [[0, '0'], [1, '1'], [2, '2']],
            yTicks: [[-1, '-1'], [0, '0'], [1, '+1']],
            title: boxes[0].w < 460 ? '功放削顶失真 (驱动=' + drv.toFixed(1) + ')' : '非线性饱和削顶：青虚=原正弦 f₀，红=放大器输出'
          });
          env.viz.drawCurve(ctx, ax1, function (t) { return Math.sin(2 * Math.PI * t); }, { color: P.cyan, dash: [4, 3], lineWidth: 1.5 });
          env.viz.drawCurve(ctx, ax1, clipOut, { color: drv > 1.0 ? P.red : P.green, lineWidth: 2.3 });

          // Discrete harmonic DFT of clipOut on [0, 1]
          var M = 128;
          var harms = [1, 3, 5, 7];
          var mags = [];
          for (var h = 0; h < harms.length; h++) {
            var k = harms[h];
            var s = 0;
            for (var m = 0; m < M; m++) {
              var tm = m / M;
              s += clipOut(tm) * Math.sin(2 * Math.PI * k * tm);
            }
            mags.push((2 / M) * Math.abs(s));
          }

          var ax2 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: 0.3,
            xMax: 7.7,
            yMin: 0,
            yMax: 1.25,
            xGrid: 4,
            yGrid: 3,
            xTicks: [[1, '基波 f₀'], [3, '3f₀'], [5, '5f₀'], [7, '7f₀']],
            yTicks: [[0, '0'], [0.5, '0.5'], [1, '1']],
            title: '非线性催生新谐波（炸邻道）',
            subtitle: mags[1] > 0.06 ? ('3f₀=' + (mags[1] * 100).toFixed(0) + '%!') : '近似线性',
            subtitleColor: mags[1] > 0.06 ? P.red : P.green
          });
          var stems = [];
          for (var i = 0; i < harms.length; i++) {
            stems.push({
              x: harms[i],
              y: mags[i],
              color: i === 0 ? P.cyan : (mags[i] > 0.04 ? P.red : P.muted),
              width: 12,
              label: mags[i] > 0.02 ? mags[i].toFixed(2) : undefined
            });
          }
          env.viz.drawStems(ctx, ax2, stems, {});
        }
      }
    ]
  });
})(window);
