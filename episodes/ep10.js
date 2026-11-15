(function (global) {
  'use strict';

  var P = global.COMM_VIZ.PALETTE;

  global.COMM_EPISODES.push({
    id: 'ep10',
    chapter: 'Ch.04 角度调制（下）',
    title: '抗非线性免疫、Armstrong 造宽带、VCO/鉴频/PLL 与立体声',
    slideDeck: '04AngM_XC_PKU.pdf',
    slideRange: 'pp. 31–42',
    homeworkTags: [],
    scenes: [
      {
        id: 's00',
        tag: '推导',
        title: '抗非线性失真免疫：为什么 FM 敢用高效率非线性功放 + 倍频器？',
        slideRef: '04AngM pp.28–30',
        terms: [
          { en: 'Nonlinear Distortion Immunity', zh: '抗非线性失真免疫' },
          { en: 'Frequency Multiplier (×n)', zh: '倍频器（非线性器件 + BPF）' },
          { en: 'Mixer vs Multiplier', zh: '混频器 vs 倍频器核心区别' }
        ],
        symbols: [
          { sym: 'y = g\\big(A\\cos\\theta(t)\\big) = \\sum c_k\\cos(k\\theta(t))', desc: '恒包络经过任意非线性后，各次谐波相位仅简单乘以 k', color: P.cyan },
          { sym: 'k=1:\\; c_1\\cos(\\omega_c t + \\phi(t))', desc: '基波带通 BPF 一切即完美复原，对 AM/DSB 却会混入 m³ 畸变', color: P.green },
          { sym: 'k=n:\\; c_n\\cos(n\\omega_c t + n\\phi(t))', desc: '非线性倍频同时把 fc 和 Δf 放大 n 倍（混频器做不到！）', color: P.amber }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: 's_{\\text{FM}}(t)=A\\cos\\theta(t) \\xrightarrow{y=b_1 s + b_3 s^3} c_1\\cos\\theta(t) + c_3\\cos(3\\theta(t)) \\xrightarrow{\\text{BPF}@\\omega_c} \\text{无失真还原 }\\theta(t)', label: 'FM 免疫原理：振幅恒定使高次幂只产生倍频谐波，不污染 ωc 附近原消息' },
          { step: 1, latex: 's_{\\text{DSB}}(t)=m(t)\\cos\\omega_c t \\xrightarrow{s^3} \\frac{3}{4}m^3(t)\\cos\\omega_c t + \\dots \\implies \\omega_c\\text{ 通带内混入 }m^3(t)\\text{ 无法滤除！}', label: '反例 DSB/AM：幅值变化经三次方后产生 m³(t) 杂散，直接落进 ωc 频带内' },
          { step: 2, latex: '\\text{非线性倍频}\\times n: (f_c,\\Delta f)\\to(n f_c, n\\Delta f) \\quad\\text{vs}\\quad \\text{乘法器混频}\\pm f_0: (f_c,\\Delta f)\\to(f_c\\pm f_0, \\Delta f)', label: '必考辨析：想放大频偏 Δf 必须用非线性器件倍频，绝不能靠乘本振混频' }
        ],
        sliders: [
          { key: 'nonlin', label: '非线性强度 b₃', min: 0.1, max: 1.0, step: 0.1, default: 0.6 },
          { key: 'bpfN', label: 'BPF 中心谐波 n×fc', min: 1, max: 3, step: 1, default: 1 }
        ],
        presets: [
          { label: '抗非线性提取原频 (n=1)', values: { nonlin: 0.6, bpfN: 1 } },
          { label: '借非线性做 ×3 倍频器 (n=3)', values: { nonlin: 0.6, bpfN: 3 } }
        ],
        lines: [
          {
            step: 0,
            sub: '既然窄带调角不能省带宽，宽带调频还猛占带宽，FM 凭什么活下来？第一大绝招就是**免疫非线性失真**！把恒包络的 $\\cos\\theta(t)$ 丢进非线性功放，因为包络不随消息起伏，展开后只在 $k\\omega_c$ 周围生成 $c_k\\cos(k\\theta)$。用 BPF 在 $1\\omega_c$ 切回基波，原信息一丁点没歪！',
            tts: '既然窄带调角省不了带宽，宽带调频还要猛占带宽，为什么无线电还这么偏爱调频？第一大绝招就是对非线性失真几乎免疫。把包络恒定不变的余弦西塔扔进廉价高效率的非线性功放里，展开后各次谐波的相位只是规规矩矩地乘了整数倍 k。用带通滤波器把一倍载频切出来，信号原封不动一点没歪！'
          },
          {
            step: 1,
            sub: '换作 **DSB 或 AM** 就惨了：它的幅度里藏着 $m(t)$，过三次方非线性项时会生出 $\\frac{3}{4}m^3(t)\\cos\\omega_c t$，不偏不倚**直接混在 $\\omega_c$ 主带正中央**，滤波器怎么切都救不回来！所以 AM 广播被迫用低效线性功放，而 FM 敢直接上饱和丙类功放！',
            tts: '可如果换作双边带或者调幅波就惨了：因为它的振幅里直接带着消息 m t，经过三次方非线性器件后会蹦出 m 三次方乘载波，不偏不倚正好落在一倍载频的主通道里面，滤波器根本切不掉。所以调幅必须用昂贵低效的线性功放，调频却敢大胆使用高效率非线性功放。'
          },
          {
            step: 2,
            sub: '不仅不坏事，把 BPF 拨到 $3\\omega_c$（滑块 `n=3`），切出的 $c_3\\cos(3\\omega_c t + 3\\phi(t))$ 居然顺手把载频和**频偏 $\\Delta f$ 一齐放大了 3 倍**！记住考试陷阱：**想扩宽频偏必须用非线性器件倍频，千万别答用乘法器加本振混频**——混频器只能搬移载频，丝毫不能放大 $\\Delta f$！',
            tts: '更有意思的是，这群原本讨厌的高次谐波还能变废为宝。把带通滤波器拨到三倍载频，切出来的三次谐波相位直接乘了三，相当于把载频和最大频偏一齐放大了三倍，这就是倍频器！记住一个高频考坑：想放大频偏只能靠非线性器件倍频，绝对不能用乘法器混频，因为混频只平移载频位置，丝毫不能拉宽频偏！'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var b3 = env.params.nonlin !== undefined ? env.params.nonlin : 0.6;
          var bpfN = Math.round(env.params.bpfN || 1);
          var narrow = boxes[0].w < 460;

          // Panel 1: Time-domain envelope distortion: DSB after x + b3 x^3 vs FM after x + b3 x^3 + BPF@fc
          var ax1 = env.viz.drawAxes(ctx, boxes[0], {
            xMin: 0,
            xMax: 2.0,
            yMin: -2.5,
            yMax: 2.5,
            xGrid: 4,
            yGrid: 4,
            xTicks: [[0, '0'], [1, '1'], [2, '2']],
            yTicks: [[-1.3, 'FM安全'], [1.3, 'DSB畸变']],
            title: narrow ? '波形抗失真: 上DSB畸变 vs 下FM纯洁' : '过非线性功放 y=x+b₃x³ 后切回 ωc：上 DSB 包络歪曲 vs 下 FM 零畸变'
          });
          // DSB with nonlinear cubic distortion in passband: m(t) -> m(t) + 0.75*b3*m(t)^3
          env.viz.drawCurve(ctx, ax1, function (t) {
            var m = 0.85 * Math.sin(Math.PI * t);
            var envDist = m + 0.75 * b3 * m * m * m;
            return 1.25 + 0.65 * envDist * Math.cos(2 * Math.PI * 10 * t);
          }, { samples: 500, color: P.pink, lineWidth: 1.7 });
          env.viz.drawCurve(ctx, ax1, function (t) {
            var m = 0.85 * Math.sin(Math.PI * t);
            return 1.25 + 0.65 * m;
          }, { color: P.muted, dash: [4, 3], lineWidth: 1.3 });
          env.viz.drawAnnotation(ctx, ax1, 0.5, 2.15, 'DSB 混入 m³(t) 失真', P.pink, 'center');

          // FM BPF@n*fc remains constant-envelope clean!
          env.viz.drawCurve(ctx, ax1, function (t) {
            var phi = 1.6 * Math.sin(Math.PI * t);
            return -1.25 + 0.85 * Math.cos(bpfN * (2 * Math.PI * 6 * t + phi));
          }, { samples: 650, color: P.cyan, lineWidth: 1.8 });
          env.viz.drawAnnotation(ctx, ax1, 1.0, -0.35, 'FM 过 BPF@' + bpfN + 'fc：包络平坦、频偏×' + bpfN, P.green, 'center');

          // Panel 2: Harmonic islands 1fc, 2fc, 3fc showing bandwidth scaling n*Δf
          var ax2 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: 0.3,
            xMax: 3.7,
            yMin: 0,
            yMax: 1.35,
            xGrid: 6,
            yGrid: 3,
            xTicks: [[1, '1fc (±Δf)'], [2, '2fc (±2Δf)'], [3, '3fc (±3Δf)']],
            yTicks: [[0, '0'], [1, '谱包络']],
            title: narrow ? '谐波岛与 BPF 选通 @' + bpfN + 'fc' : '非线性输出各次谐波谱岛（BPF 选第 ' + bpfN + ' 阶，频偏放大 ' + bpfN + ' 倍）'
          });
          env.viz.drawShadedBand(ctx, ax2, bpfN - 0.14 * bpfN - 0.08, bpfN + 0.14 * bpfN + 0.08, 'rgba(52, 211, 153, 0.22)', 'BPF选通');
          for (var k = 1; k <= 3; k++) {
            (function (ord) {
              var w = 0.09 * ord;
              var h = ord === 1 ? 1.0 : Math.min(0.95, 0.3 + b3 * (0.7 / ord));
              env.viz.drawCurve(ctx, ax2, function (f) {
                var u = (f - ord) / w;
                return Math.abs(u) <= 1.2 ? h * Math.max(0, 1 - 0.65 * u * u) : 0;
              }, { from: ord - w * 1.25, to: ord + w * 1.25, samples: 60, color: ord === bpfN ? P.green : P.amber, lineWidth: 2.0, fillAlpha: 0.22 });
            })(k);
          }
          env.viz.drawAnnotation(ctx, ax2, 2.0, 1.15, '混频器只平移 fc，不会让宽度变 k 倍!', P.red, 'center');
        }
      },
      {
        id: 's01',
        tag: '推导',
        title: 'Armstrong 间接调频全链路：窄带调制 → 倍频扩张 → 混频搬回',
        slideRef: '04AngM pp.32–33',
        terms: [
          { en: 'Armstrong Indirect FM', zh: '阿姆斯特朗间接调频法' },
          { en: 'Crystal Oscillator', zh: '高稳定度晶体振荡器' },
          { en: 'Frequency Translation (Mixer)', zh: '混频搬频（保持 Δf 不变）' }
        ],
        symbols: [
          { sym: 'f_1 = 0.5\\text{ MHz},\\; \\Delta f_1 = 1.25\\text{ kHz}', desc: '稳定晶振产生极窄带 FM（β₀=0.25，失真极小）', color: P.cyan },
          { sym: '\\times N_1,\\; \\times N_2', desc: '多级倍频器：按比例放大载频 fc 与频偏 Δf', color: P.amber },
          { sym: '\\text{Mixer }(+f_{\\text{LO}} = 10.25\\text{ MHz})', desc: '只平移载频位置以适配终值，绝不改变频偏 Δf', color: P.pink }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: '\\text{晶振 NBFM: } f_1=0.5\\text{ MHz},\\; \\Delta f_1=1.25\\text{ kHz} \\xrightarrow{\\text{倍频 }\\times N_1} f_2 = N_1 f_1,\\quad \\Delta f_2 = N_1 \\Delta f_1', label: '先在小频偏线性区用高稳晶振造窄带 FM，再靠非线性倍频把 Δf 拉宽' },
          { step: 1, latex: '\\xrightarrow{\\text{混频 } +f_{\\text{LO}}} f_3 = f_2 + f_{\\text{LO}},\\quad \\Delta f_3 = \\Delta f_2 \\;\\text{（频偏一分不涨！）}', label: '单靠倍频会把 fc 推得太高或凑不准电台频点，须用晶振混频微调中心频率' },
          { step: 2, latex: '\\xrightarrow{\\text{倍频 }\\times N_2} f_4 = N_2 f_3,\\quad \\Delta f_4 = N_2\\Delta f_3 \\quad\\text{(例：}N_1=10,N_2=6 \\Rightarrow 91.5\\text{ MHz},\\; 75\\text{ kHz)}', label: '工程标准广播台参数：总倍频 N₁N₂=60，精准落地 91.5 MHz 与 ±75 kHz' }
        ],
        sliders: [
          { key: 'n1', label: '一级倍频系数 N₁', min: 4, max: 16, step: 2, default: 10 },
          { key: 'n2', label: '二级倍频系数 N₂', min: 2, max: 10, step: 1, default: 6 }
        ],
        presets: [
          { label: '标准广播台 (N₁=10, N₂=6 → 91.5M / 75k)', values: { n1: 10, n2: 6 } },
          { label: '半倍频对比 (N₁=6, N₂=4 → 53M / 30k)', values: { n1: 6, n2: 4 } }
        ],
        lines: [
          {
            step: 0,
            sub: '直接做大频偏很难保证中心频率不漂移，于是工程师 **Armstrong** 想出一套天才间接链路：先用超稳定的低频晶体振荡器造一个极小的窄带 $\\text{NBFM}$（$\\beta_0 \\approx 0.25$，载频 $0.5\\text{ MHz}$、频偏仅 $1.25\\text{ kHz}$），然后送进第一级倍频器 $\\times N_1$，把载频和频偏齐齐拉宽 $N_1$ 倍！',
            tts: '直接制作大频偏的调频波，很容易出现中心频率乱漂移的问题。阿姆斯特朗想出了一条经典间接链路：先用稳如泰山的低频晶振和前置积分，造出调制指数很小的窄带调频，保证线性失真极微弱，再送进第一级非线性倍频器，把载频和频偏同时拉大 N 一倍！'
          },
          {
            step: 1,
            sub: '为什么中间还要横插一个**晶振混频器**？假如你要把 $\\Delta f$ 放大 $60$ 倍到广播标准 $75\\text{ kHz}$，一路倍频下去会把 $0.5\\text{ MHz}$ 推成 $30\\text{ MHz}$ 而不到目标频道 $91.5\\text{ MHz}$！混频器只搬移载频位置，**保持 $\\Delta f$ 一分不变**，正好把两条设计需求解耦！',
            tts: '为什么链路中间还要插进一个本振混频器呢？因为如果一路倍频六十倍，虽然频偏刚好凑够了七十五千赫兹，载频却可能跟目标广播电台频道对不上号！利用混频器只平移中心载频、却一点也不改变频偏的特性，就能把电台频率和所需频偏完美解耦！'
          },
          {
            step: 2,
            sub: '默认参数 $N_1=10$、混频 $+10.25\\text{ MHz}$、再经 $N_2=6$，最终完美锁定 **$91.5\\text{ MHz}$ FM 广播电台，频偏 $75\\text{ kHz}$**！拖动滑块试试看：只有倍频模块能让黄色频偏柱继续长高，混频器只让青色载频平移！',
            tts: '看默认参数：经过十倍频来到五兆赫兹，混频加上十点二五兆赫兹来到十五点二五兆赫兹，再经六倍频，精准落地九十一点五兆赫兹调频广播台、最大频偏七十五千赫兹！拖动滑块就能验证：只有倍频器推高了黄色的频偏柱，混频器只平移了青色的载频。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var n1 = Math.round(env.params.n1 || 10);
          var n2 = Math.round(env.params.n2 || 6);
          var narrow = boxes[0].w < 460;

          var f1 = 0.5;
          var df1 = 1.25;
          var f2 = f1 * n1;
          var df2 = df1 * n1;
          var f3 = f2 + 10.25;
          var df3 = df2;
          var f4 = f3 * n2;
          var df4 = df3 * n2;

          // Panel 1: Armstrong chain block diagram
          var nodes = [
            { id: 'nb', nx: 0.12, ny: 0.52, nw: 0.20, nh: 0.42, label: narrow ? 'NBFM\n0.5M' : '∫+NBFM\n0.5M / 1.25k', color: P.cyan },
            { id: 'm1', nx: 0.37, ny: 0.52, nw: 0.19, nh: 0.42, label: narrow ? '倍频×' + n1 + '\n扩Δf' : '倍频 ×' + n1 + '\n(fc,Δf)×' + n1, color: P.amber },
            { id: 'mx', nx: 0.62, ny: 0.52, nw: 0.20, nh: 0.42, label: narrow ? '混频\nΔf不变' : '混频+10.25M\nΔf 不变!', color: P.pink },
            { id: 'm2', nx: 0.87, ny: 0.52, nw: 0.19, nh: 0.42, label: narrow ? '倍频×' + n2 + '\nWBFM' : '倍频 ×' + n2 + '\n终值WBFM', color: P.green }
          ];
          var edges = [
            { from: 'nb', to: 'm1', label: narrow ? '' : 'S1' },
            { from: 'm1', to: 'mx', label: narrow ? '' : 'S2' },
            { from: 'mx', to: 'm2', label: narrow ? '' : 'S3', color: P.pink }
          ];
          var act = ['m1', 'mx', 'm2'][Math.min(2, env.step)];
          env.viz.drawBlockDiagram(ctx, boxes[0], nodes, edges, {
            time: env.time,
            activeId: act,
            title: '输出: fc=' + f4.toFixed(1) + ' MHz, Δf=' + df4.toFixed(1) + ' kHz'
          });

          // Panel 2: Stage-by-stage frequency deviation Δf (kHz) & carrier fc (MHz) evolution
          var ax2 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: 0.4,
            xMax: 4.6,
            yMin: 0,
            yMax: Math.max(120, df4 * 1.25, f4 * 1.2),
            xGrid: 4,
            yGrid: 4,
            xTicks: [[1, '1:NBFM'], [2, '2:×' + n1], [3, '3:混频'], [4, '4:×' + n2]],
            yTicks: [[0, '0'], [50, '50'], [100, '100']],
            title: narrow ? 'Δf(黄 kHz) 与 fc(青 MHz)' : '各级演化对比：黄柱 Δf (kHz) 只在倍频翻倍，青柱 fc (MHz) 同步推高'
          });
          env.viz.drawStems(ctx, ax2, [
            { x: 0.85, y: f1, color: P.cyan, width: 7, label: f1.toFixed(1) + 'M' },
            { x: 1.15, y: df1, color: P.amber, width: 7, label: df1.toFixed(1) + 'k' },
            { x: 1.85, y: f2, color: P.cyan, width: 7, label: f2.toFixed(1) + 'M' },
            { x: 2.15, y: df2, color: P.amber, width: 7, label: df2.toFixed(0) + 'k' },
            { x: 2.85, y: f3, color: P.cyan, width: 7, label: f3.toFixed(1) + 'M' },
            { x: 3.15, y: df3, color: P.amber, width: 7, label: df3.toFixed(0) + 'k=' },
            { x: 3.85, y: f4, color: P.cyan, width: 8, label: f4.toFixed(1) + 'M' },
            { x: 4.15, y: df4, color: P.green, width: 8, label: df4.toFixed(0) + 'k' }
          ], {});
        }
      },
      {
        id: 's02',
        tag: '推导',
        title: '窄带近似误差推导：幅度起伏 E(t) 与三次谐波非线性失真 β³',
        slideRef: '04AngM pp.34–35',
        terms: [
          { en: 'Envelope Distortion E(t)', zh: '窄带合成包络起伏' },
          { en: '3rd-Harmonic Phase Distortion', zh: '三次谐波相位与频率失真' }
        ],
        symbols: [
          { sym: 'E(t) = \\sqrt{1 + (k_f a(t))^2}', desc: '包络膨胀（可用限幅器 + BPF 彻底消掉）', color: P.amber },
          { sym: '\\theta(t) = \\arctan(\\beta\\sin\\omega_m t) \\approx \\beta\\sin\\omega_m t - \\tfrac{1}{3}\\beta^3\\sin^3\\omega_m t', desc: '真实相偏不再等于 βsin，而是冒出三次方非线性误差', color: P.pink },
          { sym: '\\text{三次失真占比：相位 }\\tfrac{1}{12}\\beta^2\\;\\big|\\;\\text{瞬时频偏 }\\tfrac{1}{4}\\beta^2', desc: '限幅器救不了相位误差！故 Armstrong 起始必须严格限制 β ≤ 0.2~0.3', color: P.red }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: 's(t) = A\\cos\\omega_c t - A k_f a(t)\\sin\\omega_c t = A\\underbrace{\\sqrt{1+k_f^2 a^2(t)}}_{E(t) \\xrightarrow{\\text{Limiter}} 1}\\cos\\Big(\\omega_c t + \\underbrace{\\arctan[k_f a(t)]}_{\\theta(t)}\\Big)', label: 'Armstrong 原始合成器真实极坐标分解（a(t)=∫m(τ)dτ）' },
          { step: 1, latex: '\\theta(t) \\approx \\beta\\sin\\omega_m t - \\frac{1}{3}\\beta^3\\sin^3\\omega_m t = \\beta\\!\\left(1-\\frac{\\beta^2}{4}\\right)\\sin\\omega_m t + \\frac{\\beta^3}{12}\\sin 3\\omega_m t', label: '用泰勒展开 arctan(x)≈x−x³/3 并代三倍角：相偏冒出 1/12·β² 比例的三次谐波' },
          { step: 2, latex: '\\frac{d\\theta}{dt} \\approx k_f\\alpha\\!\\left(1-\\frac{\\beta^2}{4}\\right)\\cos\\omega_m t + \\frac{k_f\\alpha\\beta^2}{4}\\cos 3\\omega_m t \\implies \\text{频率失真比 }\\frac{\\beta^2}{4}\\;(\\beta\\le 0.2\\Rightarrow 1\\%)', label: '再求导得瞬时频率（p.35）：三次谐波放大 3 倍成 β²/4，β 超 0.3 急剧恶化' }
        ],
        sliders: [
          { key: 'beta', label: '起振调制指数 β', min: 0.1, max: 1.1, step: 0.05, default: 0.2 }
        ],
        presets: [
          { label: '安全窄带 (β=0.2, 频偏失真 1%)', values: { beta: 0.2 } },
          { label: '边界区 (β=0.3, 频偏失真 2.3%)', values: { beta: 0.3 } },
          { label: '超界恶化 (β=1.0, 频偏失真 25%!)', values: { beta: 1.0 } }
        ],
        lines: [
          {
            step: 0,
            sub: '上一幕说 Armstrong 起步的 $\\beta_0$ 必须极小，到底多小才安全？把近似合成式 $A\\cos\\omega_c t - A k_f a(t)\\sin\\omega_c t$ 还原成真实的模长与相角：幅度 $E(t)=\\sqrt{1+\\beta^2\\sin^2\\omega_m t}$ 固然会轻微膨胀，但这关靠**硬件限幅器**和 BPF 就能轻松削平！',
            tts: '刚才说阿姆斯特朗起步的贝塔零必须很小，到底多小才算安全？课件第三十四页给出了严密推演：把正交加法器输出的波形化成极坐标，模长等于根号下一加贝塔平方正弦平方，这个幅度鼓包固然存在，但只要接一个硬件限幅器和带通滤波器就能轻松削平。'
          },
          {
            step: 1,
            sub: '真正棘手的是夹角本身变成反正切 $\\arctan(\\beta\\sin\\omega_m t)$！展开泰勒级数丢掉后项，立刻冒出一项 **$-\\frac{1}{3}\\beta^3\\sin^3\\omega_m t$**。化简成三倍角，发现相位里混入了占基波 $\\frac{1}{12}\\beta^2$ 比例的三次谐波失真——而限幅器对相位里的误差完全无能为力！',
            tts: '真正棘手的是合成矢量的夹角：它不是精确等于贝塔正弦，而是反正切函数。把反正切泰勒展开到三次项，立刻冒出一个负三分之一贝塔三次方的立方误差。化简三角函数后，相偏里多出了占基波十二分之一贝塔平方比例的三次谐波失真，而限幅器对这种夹角误差毫无办法！'
          },
          {
            step: 2,
            sub: '对相位求导转到瞬时频率上（课件 p.35），三次谐波被求导再放大 $3$ 倍，失真比例升到 **$\\frac{1}{4}\\beta^2$**！当 $\\beta=0.2$ 时频率失真仅 $1\\%$，一旦把滑块拉到 $\\beta=1.0$，三次谐波直接飙到 **$25\\%$**——这就是为什么窄带起振必须死守 $\\beta \\le 0.2\\sim 0.3$！',
            tts: '再对相位求一次导数还原成瞬时频率，三次谐波还会被求导吐出因子三，失真比例升高到四分之一贝塔平方！看看滑块数值：当贝塔等于零点二时，三次谐波失真只有百分之一；把滑块拉到一点零，红色三次谐波柱子瞬间飙到百分之二十五！这就是为什么窄带近似必须严控在零点二到零点三以内。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var beta = env.params.beta !== undefined ? env.params.beta : 0.2;
          var narrow = boxes[0].w < 460;

          // Panel 1: Envelope E(t) & Phase error |atan(b sin) - b sin|
          var ax1 = env.viz.drawAxes(ctx, boxes[0], {
            xMin: 0,
            xMax: 1.0,
            yMin: -0.35,
            yMax: 1.65,
            xGrid: 4,
            yGrid: 4,
            xTicks: [[0, '0'], [0.5, 'Tm/2'], [1.0, 'Tm']],
            yTicks: [[0, '0'], [1.0, '1.0'], [1.5, '1.5']],
            title: narrow ? '包络 E(t)(黄) 与相角误差(粉)' : '包络起伏 E(t)=√(1+β²sin²) (黄) 与非线性相位误差 (粉)'
          });
          env.viz.drawCurve(ctx, ax1, function () { return 1.0; }, { color: P.green, dash: [4, 3], lineWidth: 1.4 });
          env.viz.drawCurve(ctx, ax1, function (t) {
            var s = beta * Math.sin(2 * Math.PI * t);
            return Math.sqrt(1 + s * s);
          }, { color: P.amber, lineWidth: 2.3 });
          env.viz.drawCurve(ctx, ax1, function (t) {
            var s = beta * Math.sin(2 * Math.PI * t);
            return Math.atan(s) - s;
          }, { color: P.pink, lineWidth: 2.2 });
          var maxEnv = Math.sqrt(1 + beta * beta);
          env.viz.drawAnnotation(ctx, ax1, 0.5, -0.25, '峰包络=' + maxEnv.toFixed(2) + ' (限幅器可削回1.0)', P.amber, 'center');

          // Panel 2: Output frequency harmonic ratio (1fm fundamental vs 3fm distortion)
          var h1 = Math.max(0.05, 1 - 0.25 * beta * beta);
          var h3 = 0.25 * beta * beta;
          var ratioPct = (h3 / h1) * 100;
          var safe = beta <= 0.301;
          var ax2 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: 0.3,
            xMax: 3.7,
            yMin: 0,
            yMax: 1.25,
            xGrid: 3,
            yGrid: 4,
            xTicks: [[1, '1·fm (基波)'], [2, '2·fm'], [3, '3·fm (3次失真)']],
            yTicks: [[0, '0'], [0.5, '0.5'], [1.0, '1.0']],
            title: safe ? '安全区: 3次失真 ' + ratioPct.toFixed(1) + '%' : '⚠️ 超界失真: ' + ratioPct.toFixed(1) + '%!',
            titleColor: safe ? P.green : P.red
          });
          env.viz.drawStems(ctx, ax2, [
            { x: 1, y: h1, color: P.cyan, width: 12, label: h1.toFixed(2) },
            { x: 2, y: 0, color: P.muted, width: 8 },
            { x: 3, y: h3, color: safe ? P.amber : P.red, width: 12, label: h3.toFixed(3) + ' (' + ratioPct.toFixed(1) + '%)' }
          ], {});
          env.viz.drawAnnotation(ctx, ax2, 2.2, 0.96, '相位3次比 β²/12=' + (beta * beta / 12 * 100).toFixed(2) + '%', P.purple, 'center');
        }
      },
      {
        id: 's03',
        tag: '直觉',
        title: 'VCO 压控振荡器直接调频 vs 斜率鉴频器（微分 + 包络检波）解调',
        slideRef: '04AngM pp.36–37',
        terms: [
          { en: 'Voltage-Controlled Oscillator (VCO)', zh: '压控振荡器（直接调频）' },
          { en: 'Differentiator + Envelope Detector', zh: '微分器 + 包络检波（斜率鉴频）' },
          { en: 'Frequency Drift', zh: '中心载频温漂（VCO 短板）' }
        ],
        symbols: [
          { sym: '\\omega_i(t) = \\omega_c + k_f m(t)', desc: 'VCO 硬件：输入电压直接改电容，实时输出瞬时频率', color: P.cyan },
          { sym: '\\frac{d}{dt}s_{\\text{FM}}(t) = -A(\\omega_c + k_f m(t))\\sin\\theta(t)', desc: '微分神技：链式求导把隐藏的频率信息甩到振幅系数上！', color: P.pink },
          { sym: 'A\\omega_c + A k_f m(t) \\xrightarrow{\\text{隔直}} m(t)', desc: '包络直接变成标准 AM 形式，靠检波器 + 隔直电容即可还原', color: P.green }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: '\\text{直接调频 (VCO): } v_{\\text{ctrl}}(t)=m(t) \\xrightarrow{\\text{变容管改变 }LC\\text{ 谐振}} \\omega_i(t) = \\omega_c + k_f m(t)', label: 'VCO 结构极简无需倍频链，但模拟 LC 振荡中心频率易漂移，常需闭环稳频' },
          { step: 1, latex: '\\frac{d}{dt}\\Big[A\\cos\\big(\\omega_c t + k_f\\!\\int m\\big)\\Big] = -A\\big(\\omega_c + k_f m(t)\\big)\\sin\\big(\\omega_c t + k_f\\!\\int m\\big)', label: '核心解调思想：求导自动乘出内层导数 ωc + kf·m(t)，瞬间把 FM 变身成 AM！' },
          { step: 2, latex: '\\omega_c + k_f m(t) > 0 \\;(\\text{通常远大于 }0) \\implies \\text{限幅} \\to \\frac{d}{dt} \\to \\text{二极管包络检波} \\to \\text{隔直} = m(t)', label: '工程链路：先加限幅器除掉信道幅度噪声，再微分+包络检波轻松解调' }
        ],
        sliders: [
          { key: 'depth', label: '调制频偏占比 Δf/fc', min: 0.15, max: 0.55, step: 0.05, default: 0.40 }
        ],
        presets: [
          { label: '典型微分 AM 转换 (Δf/fc=0.40)', values: { depth: 0.40 } },
          { label: '微小频偏检验 (Δf/fc=0.15)', values: { depth: 0.15 } }
        ],
        lines: [
          {
            step: 0,
            sub: '除了 Armstrong 间接法，更直接的调频器叫 **VCO（压控振荡器）**：输入消息电压直接控制谐振回路里的变容二极管电容，直接吐出 $\\omega_i(t) = \\omega_c + k_f m(t)$！结构省掉了一大堆倍频混频，但缺点是温度一变中心频率就爱漂移，大功率电台常要额外稳频。',
            tts: '除了阿姆斯特朗间接法，还有一种更加直观的直接调频硬件，叫压控振荡器 V C O。顾名思义，输入电压直接控制振荡电路里的变容二极管电容，电压一变振荡频率立刻跟着线性改变。它电路简单、无需倍频阵，缺点是模拟器件受温度影响容易频率漂移。'
          },
          {
            step: 1,
            sub: '那收音机收到恒包络 FM 后，怎么把藏在相位里的 $m(t)$ 抠出来？神招只需要两步：**先过一个微分器 $\\frac{d}{dt}$**！根据链式求导法则，括号里的 $\\omega_c + k_f m(t)$ 会直接掉出来乘在正弦前面——看下图粉红波形：本来平直的 FM 瞬间变成了起伏的 **AM 包络波**！',
            tts: '那接收机收到包络平平的调频波后，怎么把藏在余弦括号里的消息抠出来呢？经典斜率鉴频器只需要一招绝活：先过一个微分器！根据微积分链式求导法则，括号里面的欧米伽 c 加 k f 乘 m t 会被原封不动地甩到幅度系数上。看下方粉色波形：平坦的调频波瞬间变成了一张一缩的调幅波！'
          },
          {
            step: 2,
            sub: '只要满足 $\\omega_c + k_f m(t) > 0$（这在载频远高于频偏时天生成立），后面接一个最廉价的**二极管包络检波器**沿着黄色波峰一描、再隔掉直流 $A\\omega_c$，就完美抽出了 $m(t)$！别忘了微分器前要先放**限幅器**，防止信道噪声混进包络里。',
            tts: '只要载波中心频率远大于最大频偏，这个系数就永远大于零不会翻转过零。于是后面只需要接上一个最廉价的二极管包络检波器，沿着黄色包络线把波峰一路描出来，再接隔直电容去掉直流偏置，就完美提取出了原消息！工程上微分前还会先放限幅器，防止信道杂波混进包络。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var depth = env.params.depth !== undefined ? env.params.depth : 0.40;
          var narrow = boxes[0].w < 460;

          // Panel 1: Slope FM demodulator block diagram
          var nodes = [
            { id: 'lim', nx: 0.13, ny: 0.52, nw: 0.19, nh: 0.40, label: '限幅+BPF\n抹平幅噪', color: P.cyan },
            { id: 'dif', nx: 0.38, ny: 0.52, nw: 0.18, nh: 0.40, label: '微分器\nd/dt', color: P.pink },
            { id: 'env', nx: 0.63, ny: 0.52, nw: 0.19, nh: 0.40, label: '包络检波\nAM 抽包', color: P.amber },
            { id: 'dc', nx: 0.88, ny: 0.52, nw: 0.16, nh: 0.40, label: '隔直滤波\nm(t)', color: P.green }
          ];
          var edges = [
            { from: 'lim', to: 'dif', label: '恒包FM' },
            { from: 'dif', to: 'env', label: '变AM', color: P.pink },
            { from: 'env', to: 'dc', label: '包络', color: P.amber }
          ];
          var act = ['lim', 'dif', 'env'][Math.min(2, env.step)];
          env.viz.drawBlockDiagram(ctx, boxes[0], nodes, edges, {
            time: env.time,
            activeId: act,
            title: '斜率鉴频解调：d/dt 把频率疏密转化成振幅高低'
          });

          // Panel 2: Differentiated wave + RC diode envelope trace
          var N = 500;
          var tMax = 2.0;
          var dt = tMax / N;
          var fc = 18.0;
          var diffArr = new Float64Array(N + 1);
          for (var i = 0; i <= N; i++) {
            var t = i * dt;
            var msg = Math.cos(2 * Math.PI * t);
            var theta = 2 * Math.PI * fc * t + (fc * depth) * Math.sin(2 * Math.PI * t);
            diffArr[i] = -(1 + depth * msg) * Math.sin(theta);
          }
          var envTrace = env.math.rcEnvelopeTrace(diffArr, dt, 0.12);

          var ax2 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: 0,
            xMax: tMax,
            yMin: -1.75,
            yMax: 1.75,
            xGrid: 4,
            yGrid: 4,
            xTicks: [[0, '0'], [0.5, '0.5'], [1, '1'], [1.5, '1.5'], [2, '2s']],
            yTicks: [[-1, '-1'], [0, '0'], [1, '+1']],
            title: narrow ? '粉=微分转AM · 黄=检波还原 m(t)' : '解调波形实测：粉=d/dt(FM) 甩出 AM 包络，黄=RC 包络检波跟踪还原'
          });
          env.viz.drawCurve(ctx, ax2, diffArr, { from: 0, to: tMax, color: P.pink, lineWidth: 1.4 });
          env.viz.drawCurve(ctx, ax2, envTrace, { from: 0, to: tMax, color: P.amber, lineWidth: 2.3 });
          env.viz.drawCurve(ctx, ax2, function (t) { return 1 + depth * Math.cos(2 * Math.PI * t); }, { color: P.green, dash: [4, 3], lineWidth: 1.5 });
        }
      },
      {
        id: 's04',
        tag: '推导',
        title: 'PLL 锁相环直接解调 FM & 超外差接收机统一中频架构',
        slideRef: '04AngM pp.38–40',
        terms: [
          { en: 'Phase-Locked Loop (PLL)', zh: '锁相环（负反馈追踪瞬时相位）' },
          { en: 'Phase Detector', zh: '鉴相器（乘法 + 低通）' },
          { en: 'Superheterodyne Receiver', zh: '超外差接收机（固定中频 IF）' }
        ],
        symbols: [
          { sym: 'e(t) \\propto \\sin\\!\\big(\\theta_i(t) - \\theta_v(t)\\big)', desc: '乘法鉴相器 + LPF 输出两路信号的相位差', color: P.pink },
          { sym: 'v(t) \\approx \\frac{k_f}{k_v}\\,m(t)', desc: '环路锁紧时，VCO 控制引脚上的电压直接就是解调出的 m(t)！', color: P.green },
          { sym: 'f_{\\text{IF}} = 10.7\\text{ MHz (FM)} / 455\\text{ kHz (AM)}', desc: '超外差接收机先把各台搬到固定中频，共用同一套高选频滤波器', color: P.cyan }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: '\\phi_{\\text{FM}}(t)=A_c\\sin(\\omega_c t+\\theta_i),\\; r(t)=2A_v\\cos(\\omega_c t+\\theta_v) \\xrightarrow{\\times,\\;\\text{LPF}} e(t)=A_c A_v\\sin(\\theta_i - \\theta_v)', label: '鉴相器原理：输入与反馈正交相乘再低通，提取瞬时相位差' },
          { step: 1, latex: '\\text{锁定时 }\\theta_i(t)-\\theta_v(t)\\approx\\text{const} \\implies \\frac{d\\theta_v}{dt}=k_v v(t) \\approx \\frac{d\\theta_i}{dt}=k_f m(t) \\implies v(t)\\approx\\frac{k_f}{k_v}m(t)', label: 'PLL 绝妙之处：只要环路紧锁住来波频率，VCO 输入脚上的电压直接就是消息！' },
          { step: 2, latex: '\\text{超外差架构: 天线 RF } \\xrightarrow{\\text{可调本振 }\\omega_c+\\omega_{\\text{IF}}} \\text{固定中频 }\\omega_{\\text{IF}}\\text{ 高阶滤波} \\to \\text{鉴频 / 检波}', label: '现代接收机核心：不给每个电台做滤波器，而把想听的电台统一搬进固定 IF 窄窗' }
        ],
        sliders: [
          { key: 'loopGain', label: 'PLL 环路锁定增益 K', min: 1.0, max: 20.0, step: 0.5, default: 16.0 }
        ],
        presets: [
          { label: '高增益紧锁还原 m(t) (K=16)', values: { loopGain: 16.0 } },
          { label: '增益不足失锁滞后 (K=1.2)', values: { loopGain: 1.2 } }
        ],
        lines: [
          {
            step: 0,
            sub: '工程上抗噪更强的解调器叫 **PLL（锁相环）**，它由三个零件闭环咬合：**乘法鉴相器**、**环路低通滤波器**和反馈通道上的 **VCO**。输入调频波与本地 VCO 输出的余弦相乘再低通，只留下一个正比于相位差的误差电压 $e(t)$。',
            tts: '工程上更高级、抗噪能力更强的调频解调器叫锁相环 P L L。它把三个模块首尾相连咬合成负反馈闭环：乘法鉴相器、低通环路滤波器，以及反馈路径上的压控振荡器 V C O。来波与本地 V C O 波形相乘低通后，输出正好代表两者的相位差。'
          },
          {
            step: 1,
            sub: '奇妙的事发生了！只要环路增益够大把来波死死锁紧，本地 VCO 的瞬时频率就必须时刻追上输入 FM 的频率！既然 $\\dot{\\theta}_v = k_v v(t)$ 等于 $k_f m(t)$，那我们根本不用拆 VCO 波形，**直接在 VCO 的控制输入脚上就把 $m(t)$ 原封不动白捡出来了**！把增益降到 $1.2$ 就会看见红线脱锁掉队！',
            tts: '最奇妙的一步来了：只要环路增益够大，把输入信号死死锁住让相位差几乎恒定，本地 V C O 产生的瞬时频率就必须时刻严密追踪来波频率！也就是说，压控振荡器控制引脚上的电压 v t 本身，直接就正比于我们要还原的原始消息！把增益滑块拉低到一点二，就会看见追踪线脱锁打滑掉队。'
          },
          {
            step: 2,
            sub: '顺便看一眼课件 p.40 的**超外差接收机**：收音机能收几十个频率各异的电台，如果每个频道都做一套高精度窄带滤波器成本太高！超外差先用可调本振把你选的台统一混频搬到一个**固定中频（FM 为 $10.7\\text{ MHz}$）**，再共用一套顶级固定中频滤波器精洗，然后送给鉴频或 PLL 解调！',
            tts: '顺便看一眼课件第四十页的超外差接收机架构。收音机要收几十个频率不同的电台，如果为每个频率都造一套高精尖带通滤波器肯定不现实。超外差接收机用可调本振把你想听的任意电台统一混频搬移到一个固定中频，比如调频广播的一十点七兆赫兹，让所有电台排队走同一套固定中频滤波器，最后再交给鉴频器或锁相环解调！'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var K = env.params.loopGain !== undefined ? env.params.loopGain : 16.0;
          var narrow = boxes[0].w < 460;

          // Panel 1: PLL feedback loop block diagram (and Superhet note on step 2)
          var nodes = [
            { id: 'pd', nx: 0.12, ny: 0.34, nw: 0.14, nh: 0.28, label: '×', kind: 'mul', color: P.cyan },
            { id: 'lpf', nx: 0.42, ny: 0.34, nw: 0.24, nh: 0.32, label: narrow ? 'LPF\n滤高频' : '环路 LPF\n滤高频倍频', color: P.pink },
            { id: 'out', nx: 0.82, ny: 0.34, nw: 0.28, nh: 0.32, label: narrow ? '输出 v(t)\n∝ m(t)' : '解调输出\n≈(kf/kv)m(t)', color: P.green },
            { id: 'vco', nx: 0.45, ny: 0.78, nw: 0.28, nh: 0.30, label: narrow ? 'VCO\ncos θv' : 'VCO 反馈\n2Av cosθv', color: P.amber }
          ];
          var edges = [
            { from: 'pd', to: 'lpf', label: narrow ? '' : 'e(t)' },
            { from: 'lpf', to: 'out', label: narrow ? '' : 'v(t)', color: P.green },
            { from: 'lpf', to: 'vco', label: '', color: P.amber },
            { from: 'vco', to: 'pd', label: narrow ? 'r(t)' : '相位锁定反馈', midY: 0.78, color: P.amber }
          ];
          var act = ['pd', 'lpf', 'out'][Math.min(2, env.step)];
          env.viz.drawBlockDiagram(ctx, boxes[0], nodes, edges, {
            time: env.time,
            activeId: act,
            title: env.step === 2 ? '超外差 IF→PLL (控制脚白捡 m(t))' : 'PLL 锁相环直接解调 FM 闭环架构'
          });

          // Panel 2: Closed-loop numerical simulation of v(t) tracking kf*m(t)
          var N = 480;
          var tMax = 4.0;
          var dt = tMax / N;
          var tau = 0.015;
          var thetaI = 0;
          var thetaV = 0;
          var vLoop = 0;
          var msgArr = new Float64Array(N + 1);
          var vArr = new Float64Array(N + 1);
          for (var i = 0; i <= N; i++) {
            var t = i * dt;
            var wm = 0.9 * Math.sin(2 * Math.PI * 0.25 * t) + 0.35 * Math.sin(2 * Math.PI * 0.5 * t);
            msgArr[i] = wm;
            vArr[i] = vLoop;
            var err = Math.sin(thetaI - thetaV);
            vLoop += (dt / tau) * (K * err - vLoop);
            thetaI += wm * dt;
            thetaV += vLoop * dt;
          }
          var locked = K >= 4.0;
          var ax2 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: 0,
            xMax: tMax,
            yMin: -1.65,
            yMax: 1.65,
            xGrid: 4,
            yGrid: 4,
            xTicks: [[0, '0'], [1, '1'], [2, '2'], [3, '3'], [4, '4s']],
            yTicks: [[-1, '-1'], [0, '0'], [1, '+1']],
            title: locked ? '锁定跟踪! 青=来波m(t) 黄=VCO电压v(t)' : '⚠️ 失锁脱轨! (K=' + K.toFixed(1) + ' 过小)',
            titleColor: locked ? P.green : P.red
          });
          env.viz.drawCurve(ctx, ax2, msgArr, { from: 0, to: tMax, color: P.cyan, lineWidth: 2.3 });
          env.viz.drawCurve(ctx, ax2, vArr, { from: 0, to: tMax, color: locked ? P.amber : P.red, dash: [5, 3], lineWidth: 2.1 });
        }
      },
      {
        id: 's05',
        tag: '课件例题',
        title: 'FM 立体声广播基带复用（L+R / 38kHz DSB-SC）与 19kHz 导频勘误',
        slideRef: '04AngM pp.41–42',
        terms: [
          { en: 'FM Stereo Multiplexing', zh: '调频立体声基带复用' },
          { en: 'Pilot Signal (19 kHz)', zh: '导频信号（精确 19 kHz）' },
          { en: 'Backward Compatibility', zh: '单声道老收音机向下兼容' }
        ],
        symbols: [
          { sym: 'L(t)+R(t)\\; (0\\sim 15\\text{ kHz})', desc: '单声道和信号直放基带，保证老式收音机 LPF 直接能听', color: P.cyan },
          { sym: '\\big(L(t)-R(t)\\big)\\cos(2\\pi\\cdot 38\\text{k}\\,t)', desc: '双声道差信号用 38 kHz DSB-SC 搬至 23~53 kHz，互不重叠', color: P.pink },
          { sym: 'f_{\\text{pilot}} = 19\\text{ kHz} \\xrightarrow{\\times 2} 38\\text{ kHz}', desc: '导频藏在 15~23 kHz 正中保护带，锁定倍频即相干解调 L−R', color: P.green }
        ],
        errata: '⚠️ 课件勘误（04AngM p.42）：第 42 页写 “Provided pilot signal at 38KHz”，这里教授笔误混用了副载波和导频频率！实际 FM 立体声广播在 $15\\text{ kHz}$ 与 $23\\text{ kHz}$ 频谱空档正中央发送的是 **$19\\text{ kHz}$ 导频**（若直接发 $38\\text{ kHz}$ 会一头撞进 $L-R$ 边带正中心没法分离）；接收机锁住 $19\\text{ kHz}$ 后经二倍频才还原出 $38\\text{ kHz}$ 副载波去相干解调 $L-R$！',
        formulas: [
          { step: 0, latex: 'm_{\\text{stereo}}(t) = \\underbrace{[L(t)+R(t)]}_{0\\sim 15\\text{ kHz}} + \\underbrace{A_p\\cos(2\\pi\\cdot 19\\text{k}\\,t)}_{19\\text{ kHz 导频}} + \\underbrace{[L(t)-R(t)]\\cos(2\\pi\\cdot 38\\text{k}\\,t)}_{23\\sim 53\\text{ kHz (DSB-SC)}}', label: '广播电台送去 FM 调制的总基带复合频谱结构（总带宽 53 kHz）' },
          { step: 1, latex: '\\text{单声道老机} \\xrightarrow{\\text{LPF}(15\\text{ kHz})} L(t)+R(t);\\qquad \\text{立体声新机} \\xrightarrow{\\text{BPF}(19\\text{k})\\to\\text{PLL}\\times 2} 38\\text{ kHz 本地载波}', label: '向下兼容与抗多普勒漂移：移动汽车靠 19kHz 导频精确跟踪副载波相位' },
          { step: 2, latex: 'L(t) = \\frac{1}{2}\\big[(L+R)+(L-R)\\big],\\qquad R(t) = \\frac{1}{2}\\big[(L+R)-(L-R)\\big]', label: '相干解调还原出 L−R 后，与 L+R 经过简单加减矩阵分离左右双声道' }
        ],
        sliders: [
          { key: 'rxMode', label: '视图 (0=标准立体声, 1=老单声道, 2=p.42勘误撞车)', min: 0, max: 2, step: 1, default: 0 }
        ],
        presets: [
          { label: '标准立体声 (19kHz 导频)', values: { rxMode: 0 } },
          { label: '老式单声道收音机 (只收 0–15k)', values: { rxMode: 1 } },
          { label: '勘误演练 (误发 38kHz 撞车)', values: { rxMode: 2 } }
        ],
        lines: [
          {
            step: 0,
            sub: '最后来看第 4 章工程收官案例：**现代 FM 立体声广播**！左右耳音频各占 $0\\sim 15\\text{ kHz}$。为了兼容只有一只喇叭的老收音机，电台不直接分别发 $L$ 和 $R$，而是先算和与差：把 **$L+R$** 原封不动放在 $0\\sim 15\\text{ kHz}$ 基带，再用 **$38\\text{ kHz}$ 的 DSB-SC** 把 **$L-R$** 搬到 $23\\sim 53\\text{ kHz}$ 高频段，两者之间留出宽阔保护缝隙！',
            tts: '最后来看第四章压轴的工程应用案例：现代调频立体声广播。左右声道各有零到十五千赫兹的音频宽度。为了兼容老式单声道收音机，电台不会直接单发左声道和右声道，而是把左右之和直接放在零到十五千赫兹基带，再用三十八千赫兹的抑制载波双边带，把左右之差搬移到二十三到五十三千赫兹，中间留出洁净的隔离带！'
          },
          {
            step: 1,
            sub: '注意右边勘误框！课件 p.42 正文写发送“38kHz 导频”，这是教授口误混用了副载波和导频！切到第三个预设看后果：若在 $38\\text{ kHz}$ 发导频，恰好一头撞在 $L-R$ 正中央没法用窄带滤出来！**真实广播在 $15$ 和 $23\\text{ kHz}$ 空档正中心发的导频是 $19\\text{ kHz}$**，车载收音机锁住 $19\\text{ kHz}$ 再倍频成 $38\\text{ kHz}$，就能抗住汽车行驶的多普勒频偏！',
            tts: '请特别盯紧右边的勘误框！课件第四十二页正文印着发送三十八千赫兹导频，这其实是教授把副载波和导频频率写混了。点下第三个预设就能明白原因：三十八千赫兹正好落在左右之差频谱正中心，直接发导频会和信号撞在一起根本滤不出来！真实标准是在十五和二十三千赫兹空档正中央发送十九千赫兹导频，汽车收音机锁住十九千赫兹后再二倍频成三十八千赫兹，完美抵消多普勒频移。'
          },
          {
            step: 2,
            sub: '拿到恢复的 $38\\text{ kHz}$ 载波去相干解调 $23\\sim 53\\text{ kHz}$ 频段就抽出 $L-R$，跟前面低通拿到的 $L+R$ 相加除以二得左耳 $L$，相减除以二得右耳 $R$！至此第 4 章角度调制从原理、Carson 带宽、硬件实现到立体声全部通关！',
            tts: '收音机用倍频还原出的三十八千赫兹相干解调高频带，就能抽出左右之差；再跟低通滤波器拿到的左右之和一相加、一相减，立刻还原出独立纯净的左声道和右声道！至此第四章角度调制从数学公式、卡森带宽到硬件鉴频锁相环全部通关！'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var rxMode = Math.round(env.params.rxMode || 0);
          var narrow = boxes[0].w < 460;

          // Panel 1: Multiplexed Baseband Spectrum (0..60 kHz)
          var ax1 = env.viz.drawAxes(ctx, boxes[0], {
            xMin: 0,
            xMax: 58,
            yMin: 0,
            yMax: 1.35,
            xGrid: 6,
            yGrid: 3,
            xTicks: [[0, '0'], [15, '15k'], [19, '19k'], [23, '23k'], [38, '38k'], [53, '53kHz']],
            yTicks: [[0, '0'], [1, '谱幅度']],
            title: rxMode === 2 ? '⚠️ 勘误演示: 38kHz导频撞进L-R中心!' : (rxMode === 1 ? '单声道兼容: LPF只截取 0–15kHz' : (narrow ? '立体声基带复合频谱' : 'FM 立体声总基带频谱：L+R (0–15k), 导频 19k, L−R (23–53k)')),
            titleColor: rxMode === 2 ? P.red : P.cyan
          });

          if (rxMode === 1) {
            env.viz.drawShadedBand(ctx, ax1, 0, 15.5, 'rgba(52, 211, 153, 0.20)', 'LPF通带');
          }
          // L+R triangle (0..15 kHz)
          env.viz.drawCurve(ctx, ax1, function (f) {
            return f <= 15 ? Math.max(0, 0.95 * (1 - f / 17)) : 0;
          }, { from: 0, to: 15.2, samples: 80, color: P.cyan, lineWidth: 2.3, fillAlpha: 0.24 });
          env.viz.drawAnnotation(ctx, ax1, 7.2, 0.62, 'L+R', P.cyan, 'center');

          // L-R DSB-SC double triangle (23..53 kHz centered at 38 kHz)
          var dimLR = rxMode === 1;
          env.viz.drawCurve(ctx, ax1, function (f) {
            if (f < 23 || f > 53) return 0;
            var d = Math.abs(f - 38);
            return d <= 15 ? 0.85 * (1 - d / 17) : 0;
          }, { from: 22.8, to: 53.2, samples: 140, color: dimLR ? P.muted : P.pink, lineWidth: 2.1, fillAlpha: dimLR ? 0.05 : 0.22 });
          env.viz.drawAnnotation(ctx, ax1, 38, 0.92, 'L−R (DSB-SC @38k)', dimLR ? P.muted : P.pink, 'center');

          if (rxMode === 2) {
            env.viz.drawStems(ctx, ax1, [
              { x: 38, y: 1.18, color: P.red, width: 3.5, arrow: true, label: '错!撞中心' }
            ], {});
          } else {
            env.viz.drawStems(ctx, ax1, [
              { x: 19, y: 1.15, color: dimLR ? P.muted : P.green, width: 3.2, arrow: true, label: '19k导频' }
            ], {});
          }

          // Panel 2: Stereo receiver decoder block diagram
          var nodes = [
            { id: 'in', nx: 0.12, ny: 0.50, nw: 0.18, nh: 0.36, label: '解调后\n总基带', color: P.cyan },
            { id: 'lpf', nx: 0.43, ny: 0.22, nw: 0.24, nh: 0.28, label: narrow ? 'LPF\nL+R' : 'LPF 0-15k\n得 L+R', color: P.cyan },
            { id: 'pil', nx: 0.43, ny: 0.54, nw: 0.24, nh: 0.26, label: narrow ? '19k→×2\n38kHz' : '19kBPF→×2\n恢复 38kHz', color: P.green },
            { id: 'dsb', nx: 0.43, ny: 0.84, nw: 0.24, nh: 0.26, label: narrow ? '38k相干\nL−R' : '23-53k相干\n得 L−R', color: P.pink },
            { id: 'mat', nx: 0.82, ny: 0.50, nw: 0.24, nh: 0.48, label: narrow ? '矩阵\nL / R' : '加减矩阵\n输出 L / R', color: P.amber }
          ];
          var edges = [
            { from: 'in', to: 'lpf', label: '' },
            { from: 'in', to: 'pil', label: '' },
            { from: 'in', to: 'dsb', label: '' },
            { from: 'pil', to: 'dsb', label: '38k', color: P.green },
            { from: 'lpf', to: 'mat', label: 'L+R', color: P.cyan },
            { from: 'dsb', to: 'mat', label: 'L-R', color: P.pink }
          ];
          env.viz.drawBlockDiagram(ctx, boxes[1], nodes, edges, {
            time: env.time,
            activeId: rxMode === 1 ? 'lpf' : (env.step === 1 ? 'pil' : 'mat'),
            title: rxMode === 1 ? '老机仅启用上方 LPF 支路 (兼容 L+R)' : '立体声接收机三支路分离 + 矩阵还原 L / R'
          });
        }
      }
    ]
  });
})(window);
