(function (global) {
  'use strict';

  var P = global.COMM_VIZ.PALETTE;

  global.COMM_EPISODES.push({
    id: 'ep09',
    chapter: 'Ch.04 角度调制（中）',
    title: '窄带近似、贝塞尔无穷边带与 Carson 带宽法则',
    slideDeck: '04AngM_XC_PKU.pdf',
    slideRange: 'pp. 20–30',
    homeworkTags: ['HW2 · 5.2-1', 'HW2 · 5.2-7'],
    scenes: [
      {
        id: 's00',
        tag: '推导',
        title: '窄带调角 NBFM/NBPM：小角度线性化、90° 垂直相量与限幅器',
        slideRef: '04AngM pp.13–16',
        terms: [
          { en: 'Narrowband FM / PM (NBFM/NBPM)', zh: '窄带调频 / 窄带调相' },
          { en: 'Quadrature Carrier', zh: '正交（90°）载波分量' },
          { en: 'Amplitude Limiter', zh: '限幅器（消除包络微小起伏）' }
        ],
        symbols: [
          { sym: '|\\phi(t)| \\ll 1', desc: '窄带假设：sin φ ≈ φ，cos φ ≈ 1，丢弃高阶项', color: P.cyan },
          { sym: 'A_c\\cos\\omega_c t - A_c\\phi(t)\\sin\\omega_c t', desc: '窄带调角近似式：主载波 + 正交 DSB-SC 边带', color: P.amber },
          { sym: 'E(t) = \\sqrt{1 + \\phi^2(t)} > 1', desc: '切线外凸导致的微小幅度膨胀（须加限幅器抹平）', color: P.pink }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: 's(t) = A_c\\cos(\\omega_c t + \\phi(t)) = A_c\\cos\\phi(t)\\cos\\omega_c t - A_c\\sin\\phi(t)\\sin\\omega_c t \\approx A_c\\cos\\omega_c t - A_c\\phi(t)\\sin\\omega_c t', label: '小角度展开：把乘法里的非线性角转化为正交线性叠加' },
          { step: 1, latex: '\\phi(t)=\\beta\\sin\\omega_m t \\implies s_{\\text{NB}}(t) \\approx A_c\\cos\\omega_c t + \\frac{A_c\\beta}{2}\\cos(\\omega_c+\\omega_m)t - \\frac{A_c\\beta}{2}\\cos(\\omega_c-\\omega_m)t', label: '对比 AM：下边带前多了负号！这让合成边带与载波从同向变成 90° 垂直' },
          { step: 2, latex: 'B_{\\text{NBFM}} = 2B,\\qquad |\\vec{s}_{\\text{NB}}| = A_c\\sqrt{1 + \\phi^2(t)} \\xrightarrow{\\text{Limiter}} A_c', label: '窄带下带宽仍为 2B（不能省带宽），末尾加限幅器抹平切线外凸' }
        ],
        sliders: [
          { key: 'beta', label: '峰值相偏 β (rad)', min: 0.1, max: 1.1, step: 0.05, default: 0.35 },
          { key: 'mode', label: '对比模式 (0=NBFM正交, 1=AM同相)', min: 0, max: 1, step: 1, default: 0 }
        ],
        presets: [
          { label: '标准 NBFM (β=0.35)', values: { beta: 0.35, mode: 0 } },
          { label: '大 β 露出外凸包络 (β=0.9)', values: { beta: 0.9, mode: 0 } },
          { label: '对照 AM 同相伸缩', values: { beta: 0.35, mode: 1 } }
        ],
        lines: [
          {
            step: 0,
            sub: '既然角度调制是非线性的，怎样先摸清它的带宽？当相偏 $|\\phi(t)| \\ll 1$ 时，利用 $\\cos\\phi \\approx 1$ 与 $\\sin\\phi \\approx \\phi$ 拆开余弦，调角信号立刻化简成“主载波减去正交边带”的线性形式！',
            tts: '既然角度调制是非线性的，怎么先摸清它的频谱？当附加相偏远小于一弧度时，利用小角度近似余弦约等于一、正弦约等于相偏本身，调角波立刻简化为主载波减去正交边带的线性组合。'
          },
          {
            step: 1,
            sub: '代入单音正弦一看吓一跳：窄带 FM 跟 AM 同样长出 $\\omega_c \\pm \\omega_m$ 两个边带、带宽一样是 $2B$，唯一区别是**下边带前面多了一个负号**！看左图相量圆盘：AM 的上下边带合成后顺着载波主轴左右伸缩；而 NBFM 因为下边带反号，合成矢量被拧到了 **90° 垂直切线方向**摆动！',
            tts: '代入单音正弦一看很神奇：窄带调频和调幅一样只长出上下两个边带，带宽也都是两倍基带带宽，唯一区别是下边带前面多了一个负号。看左边相量圆盘：调幅的上下边带顺着载波主轴同向伸缩；而窄带调频因为下边带反号，合成边带矢量直接转了九十度，沿着切线方向垂直摆动！'
          },
          {
            step: 2,
            sub: '沿着直线切线摆动会悄悄离开圆弧，使包络略微膨胀为 $\\sqrt{1+\\phi^2}$。所以工程上窄带调频末端都要串联一个**限幅器**把多出的毛刺削平，再通过带通滤波器送出。拖动 $\\beta$ 到 $0.9$，就能直观看到相量箭头突出虚线圆外！',
            tts: '因为直来直去的切线矢量在偏转时会稍微离开圆弧，造成包络略微膨胀成根号下一加法伊平方。所以工程上窄带调频发端都要接一个限幅器把凸出来的包络削平，再过带通滤波器。把贝塔滑块拉到零点九，就能清楚看见矢量箭头冲出了虚线圆外！'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var beta = env.params.beta !== undefined ? env.params.beta : 0.35;
          var isAM = Math.round(env.params.mode || 0) === 1;
          var narrow = boxes[0].w < 460;

          var wt = env.time * 1.8;
          var dAngle = wt;
          var magSB = beta / 2;
          // In carrier-stationary frame (carrier along +x):
          // AM: USB at +wt, LSB at -wt -> sum is (beta*cos(wt), 0)
          // NBFM: USB at +wt + pi/2, LSB at -wt + pi/2 -> Wait: -sin(wc t)*sin(wm t) = 0.5[cos((wc+wm)t) - cos((wc-wm)t)]
          // Actually at wt=0, cos(wc t) + beta*sin(wm t)*(-sin(wc t)) = (1, 0) + (0, -beta*sin(wt)) in (cos, -sin) phasor plane!
          // Using standard Re{ e^{j wc t} (1 + j * beta * sin(wt)) }:
          // USB = (beta/2) e^{j wt}, LSB = -(beta/2) e^{-j wt} -> sum = j * beta * sin(wt) (purely vertical +90 deg!)
          var uAng = dAngle;
          var lAng = isAM ? -dAngle : (Math.PI - dAngle);
          var ux = magSB * Math.cos(uAng);
          var uy = magSB * Math.sin(uAng);
          var lx = magSB * Math.cos(lAng);
          var ly = magSB * Math.sin(lAng);
          var sumX = 1 + ux + lx;
          var sumY = uy + ly;
          var resMag = Math.hypot(sumX, sumY);
          var resAng = Math.atan2(sumY, sumX);

          var vectors = [
            { mag: 1.0, angle: 0, color: P.cyan, width: 2.5, label: '载波Ac' },
            { originX: 1.0, originY: 0, mag: magSB, angle: uAng, color: P.amber, width: 1.8, label: narrow ? 'USB' : '+边带' },
            { originX: 1.0 + ux, originY: uy, mag: magSB, angle: lAng, color: P.pink, width: 1.8, label: narrow ? 'LSB' : (isAM ? '+下边带' : '-下边带') },
            { mag: resMag, angle: resAng, color: P.green, width: 2.8, label: isAM ? 'AM合' : '90°合成' }
          ];
          env.viz.drawPhasorWheel(ctx, boxes[0], {
            mode: 'phasor',
            title: isAM ? 'AM: 同向伸缩' : 'NBFM: 90°切线摆动',
            subtitle: '模长 ' + resMag.toFixed(2) + 'Ac',
            subtitleColor: (!isAM && resMag > 1.1) ? P.red : P.green,
            vectors: vectors
          });

          // Panel 2: Sideband spectrum showing sign inversion of LSB
          var ax2 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: -0.2,
            xMax: 2.2,
            yMin: -0.7,
            yMax: 1.25,
            xGrid: 4,
            yGrid: 4,
            xTicks: [[0.4, 'fc-fm'], [1.0, 'fc'], [1.6, 'fc+fm']],
            yTicks: [[-0.5, '-0.5'], [0, '0'], [0.5, '0.5'], [1.0, 'Ac']],
            title: isAM ? 'AM 频谱：下边带同向(+)' : (narrow ? 'NBFM谱: 下边带反号!' : 'NBFM 频谱：带宽仍为 2fm，但下边带反号(-)')
          });
          env.viz.drawShadedBand(ctx, ax2, 0.4, 1.6, 'rgba(56, 189, 248, 0.14)', 'B=2fm');
          env.viz.drawStems(ctx, ax2, [
            { x: 0.4, y: isAM ? magSB : -magSB, color: P.pink, width: 4, label: (isAM ? '+' : '-') + magSB.toFixed(2) },
            { x: 1.0, y: 1.0, color: P.cyan, width: 5, label: '1.0' },
            { x: 1.6, y: magSB, color: P.amber, width: 4, label: '+' + magSB.toFixed(2) }
          ], {});
        }
      },
      {
        id: 's01',
        tag: '推导',
        title: '宽带单音调频：贝塞尔函数 Jn(β) 展开、无穷边带与 J0 载波熄灭',
        slideRef: '04AngM pp.17–18',
        terms: [
          { en: 'Modulation Index β', zh: '调频指数（最大相偏）' },
          { en: 'Bessel Function Jn(β)', zh: '第一类 n 阶贝塞尔函数' },
          { en: 'Carrier Null (J0 = 0)', zh: '载波零点 / 熄灭点' }
        ],
        symbols: [
          { sym: '\\beta = \\frac{\\Delta f}{f_m} = \\frac{k_f A_m}{\\omega_m}', desc: '单音调制指数：窄带看 β≪1，宽带看 β>1', color: P.cyan },
          { sym: 'J_n(\\beta),\\; J_{-n}(\\beta) = (-1)^n J_n(\\beta)', desc: '第 n 阶边带幅度权重；总归一化功率 ΣJn²(β)=1', color: P.amber },
          { sym: '\\beta \\approx 2.405 \\implies J_0(\\beta) = 0', desc: '神奇载波熄灭点：载频能量 100% 转移到边带中', color: P.red }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: 's_{\\text{FM}}(t) = A_c\\cos(\\omega_c t + \\beta\\sin\\omega_m t) = A_c\\sum_{n=-\\infty}^{\\infty} J_n(\\beta)\\cos\\big((\\omega_c + n\\omega_m)t\\big)', label: '周期相位展开为傅里叶级数：产生无穷多个间距 fm 的离散谱线' },
          { step: 1, latex: '\\sum_{n=-\\infty}^{\\infty} J_n^2(\\beta) = 1,\\qquad |n| > \\beta + 1 \\implies J_n(\\beta) \\to 0', label: '能量守恒与截断特性：红框 ±(β+1)fm 内通常包含超过 98% 的功率' },
          { step: 2, latex: 'J_0(2.405) = 0,\\quad J_0(5.520) = 0 \\implies \\text{载波彻底消失，实验室常借此标定 }\\beta', label: '调参验证：预设切到 β=2.405，fc 处谱线瞬间归零' }
        ],
        sliders: [
          { key: 'beta', label: '调制指数 β', min: 0.2, max: 8.0, step: 0.05, default: 2.4 }
        ],
        presets: [
          { label: '窄带回归 (β=0.3)', values: { beta: 0.3 } },
          { label: '载波熄灭奇景 J₀=0 (β=2.405)', values: { beta: 2.405 } },
          { label: '宽带展开 (β=5.0)', values: { beta: 5.0 } },
          { label: '二次熄灭 (β=5.52)', values: { beta: 5.52 } }
        ],
        lines: [
          {
            step: 0,
            sub: '一旦 $\\beta$ 变大不再满足小角度近似，必须把周期因子 $e^{j\\beta\\sin\\omega_m t}$ 展开成傅里叶级数！系数恰是第一类贝塞尔函数 $J_n(\\beta)$——理论上调频波在 $f_c \\pm n f_m$ 处生出**无穷多条边带**！',
            tts: '一旦调制指数贝塔变大，小角度近似就彻底失效了。我们需要把周期复指数因子展开成傅里叶级数，每一项的系数正好就是第一类贝塞尔函数 J n 贝塔。理论上，单音调频在载频两侧每隔 f m 都会长出无穷多条离散边带！'
          },
          {
            step: 1,
            sub: '不过不用绝望！拖动 $\\beta$ 滑块看红色透明窗：窗外那些阶数 $|n| > \\beta + 1$ 的边带幅度雪崩式衰减，窗口内 $2(\\beta+1)f_m$ 已经包揽了超过 $98\\%$ 的总功率，这正是下面 **Carson 带宽法则**的数学铁证！',
            tts: '不过这无穷多条边带并不可怕。拖动贝塔滑块看看图上红色的透明遮罩框：只要边带阶数超过贝塔加一，贝塞尔系数就会像雪崩一样衰减到可以忽略，红框宽度二倍贝塔加一乘 f m 里面，往往已经囊括了超过百分之九十八的总功率！'
          },
          {
            step: 2,
            sub: '点击预设 $\\beta = 2.405$ 欣赏全章最酷的物理奇景：中心载波 $J_0(2.405) = 0$ 彻底熄灭归零！因为总功率 $\\sum J_n^2(\\beta) = 1$ 恒定不变，此时载波能量被 $100\\%$ 搬进了旁边边带里，工程上常借“找载波消失点”精准标定频偏！',
            tts: '再点一下贝塔等于二点四零五的预设，欣赏全章最奇妙的景象：正中间的载波分量 J 零彻底熄灭成零！因为所有边带的平方和永远守恒等于一，这一刻载波把自己的全部能量都分给了左右边带。工程实验室里常靠寻找载波消失点来精准校准频偏！'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var beta = env.params.beta !== undefined ? env.params.beta : 2.4;
          var narrow = boxes[0].w < 460;

          // Panel 1: Discrete Bessel spectrum |J_n(beta)| with Carson shaded band
          var nMax = 11;
          var nCarson = Math.ceil(beta + 1);
          var inBandPower = 0;
          var stems = [];
          for (var n = -nMax; n <= nMax; n++) {
            var jv = env.math.besselJ(n, beta);
            var mag = Math.abs(jv);
            if (Math.abs(n) <= nCarson) inBandPower += jv * jv;
            var inBand = Math.abs(n) <= (beta + 1);
            var isCarrier = n === 0;
            var col = isCarrier ? (mag < 0.04 ? P.red : P.amber) : (inBand ? P.cyan : P.muted);
            stems.push({
              x: n,
              y: mag,
              color: col,
              width: isCarrier ? 4 : 3,
              label: (isCarrier && mag < 0.04) ? 'J0≈0!' : (isCarrier ? 'J0=' + mag.toFixed(2) : undefined)
            });
          }
          var pct = Math.min(100, inBandPower * 100);
          var ax1 = env.viz.drawAxes(ctx, boxes[0], {
            xMin: -nMax - 0.6,
            xMax: nMax + 0.6,
            yMin: 0,
            yMax: 1.12,
            xGrid: 6,
            yGrid: 4,
            xTicks: [[-8, '-8'], [-4, '-4'], [0, 'fc'], [4, '+4'], [8, '+8']],
            yTicks: [[0, '0'], [0.5, '0.5'], [1.0, '1']],
            title: narrow ? 'β=' + beta.toFixed(2) + ' 框内功率 ' + pct.toFixed(1) + '%' : '边带幅度 |Jn(β)| 与有效带宽框 (β=' + beta.toFixed(2) + ', 框内功率 ' + pct.toFixed(1) + '%)'
          });
          env.viz.drawShadedBand(ctx, ax1, -(beta + 1), beta + 1, 'rgba(251, 113, 133, 0.16)', '±(β+1)fm');
          env.viz.drawStems(ctx, ax1, stems, {});

          // Panel 2: Bessel curves J0, J1, J2 vs beta with cursor
          var ax2 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: 0,
            xMax: 8.2,
            yMin: -0.5,
            yMax: 1.1,
            xGrid: 4,
            yGrid: 4,
            xTicks: [[0, '0'], [2.405, '2.405'], [5.52, '5.52'], [8, '8']],
            yTicks: [[-0.4, '-0.4'], [0, '0'], [0.5, '0.5'], [1, '1']],
            title: narrow ? 'Jn(β) 曲线 (J0=0 熄灭点)' : '贝塞尔函数随 β 演化：J0(青) J1(黄) J2(粉)'
          });
          env.viz.drawCurve(ctx, ax2, function (b) { return env.math.besselJ(0, b); }, { samples: 160, color: P.cyan, lineWidth: 2.2 });
          env.viz.drawCurve(ctx, ax2, function (b) { return env.math.besselJ(1, b); }, { samples: 160, color: P.amber, lineWidth: 1.8 });
          env.viz.drawCurve(ctx, ax2, function (b) { return env.math.besselJ(2, b); }, { samples: 160, color: P.pink, lineWidth: 1.8 });
          env.viz.drawStems(ctx, ax2, [
            { x: beta, y: env.math.besselJ(0, beta), color: P.red, width: 2.2, label: 'β=' + beta.toFixed(2) }
          ], {});
        }
      },
      {
        id: 's02',
        tag: '推导',
        title: 'Carson 法则物理直觉：为什么带宽是 2(Δf + B) 而不是单纯 2Δf？',
        slideRef: '04AngM pp.19–21',
        terms: [
          { en: 'Carson\'s Rule', zh: '卡森带宽公式' },
          { en: 'Peak Frequency Deviation Δf', zh: '最大频偏' },
          { en: 'Wideband vs Narrowband Limit', zh: '宽带极限与窄带极限' }
        ],
        symbols: [
          { sym: 'B_T \\approx 2(\\Delta f + B) = 2(\\beta + 1)B', desc: '卡森公式：来回游走宽度 2Δf + 两端调制包络延展 2B', color: P.green },
          { sym: '\\Delta f_{\\text{FM}} = \\frac{k_f m_p}{2\\pi},\\quad \\Delta f_{\\text{PM}} = \\frac{k_p |\\dot{m}|_{\\max}}{2\\pi}', desc: 'PM 的 Δf 取决于斜率最大值 m\'p，FM 取决于幅度峰值 mp', color: P.amber }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: 'm(t) \\text{ 带宽为 } B \\xrightarrow{\\text{Nyquist}} \\text{宽 } \\frac{1}{2B} \\text{ 的阶梯脉冲} \\implies \\text{每段站点的频谱呈宽 } 2B\\text{ 的 }\\text{sinc}', label: '矩形近似推导：瞬间频率停靠在各处，每停一次就要被宽度 1/(2B) 截断' },
          { step: 1, latex: '\\text{站点在 } [f_c-\\Delta f,\\; f_c+\\Delta f] \\text{ 摆动} + \\text{端点外扩 } \\pm B \\implies B_T \\approx 2(\\Delta f + B) = 2(\\beta+1)B', label: 'Carson 法则：摆幅宽度 2Δf 加上两端 sinc 边带外溢 2B' },
          { step: 2, latex: '\\beta \\ll 1\\;(\\Delta f\\ll B) \\implies B_T \\to 2B;\\qquad \\beta \\gg 1\\;(\\Delta f\\gg B) \\implies B_T \\to 2\\Delta f', label: '两端极限完美吻合：永远不会低于 2B，极宽带时才逼近摆幅 2Δf' }
        ],
        sliders: [
          { key: 'df', label: '最大频偏 Δf (kHz)', min: 1.0, max: 50.0, step: 1.0, default: 20.0 },
          { key: 'bwB', label: '消息带宽 B (kHz)', min: 2.0, max: 20.0, step: 1.0, default: 5.0 }
        ],
        presets: [
          { label: '窄带极限 (Δf=1, B=15)', values: { df: 1.0, bwB: 15.0 } },
          { label: '常规调频 (Δf=20, B=5)', values: { df: 20.0, bwB: 5.0 } },
          { label: '宽带广播 (Δf=50, B=10)', values: { df: 50.0, bwB: 10.0 } }
        ],
        lines: [
          {
            step: 0,
            sub: '贝塞尔级数只管得了单音正弦，一般任意信号怎么办？用香农采样直觉把带宽为 $B$ 的 $m(t)$ 拆成宽 $\\frac{1}{2B}$ 的微阶梯：每小段载波虽停在瞬时频率 $f_i$ 上，但因为只持续 $\\frac{1}{2B}$ 秒，乘矩形窗的频谱必然向左右外扩出一个主瓣宽 $2B$ 的 $\\operatorname{sinc}$ 裙摆！',
            tts: '贝塞尔展开只能算单音正弦，任意一般信号怎么办？课件用矩形近似给出了极妙的物理直觉：带宽为 B 的消息每隔二分之一 B 秒取一个样形成微阶梯。每个阶梯内载波虽然只停在某一个瞬时频率上，但因为只持续了二分之一 B 秒，截断矩形窗会让频谱自动向左右各长出宽度为 B 的辛克裙摆。'
          },
          {
            step: 1,
            sub: '所以把所有瞬时频率站点从 $f_c - \\Delta f$ 扫到 $f_c + \\Delta f$，再算上最左、最右两个边界往外伸出的各 $B$ 宽边带，总带宽立刻得到 **Carson 公式**：$B_T \\approx 2(\\Delta f + B) = 2(\\beta + 1)B$！',
            tts: '于是所有瞬时频率在载频正负德尔塔 f 之间来回扫荡，再把最左边和最右边两个端点向外各伸出一份宽度 B 的调制速率边带，总带宽立刻相加得出卡森公式：等于二倍的括号德尔塔 f 加 B，或者二倍的括号贝塔加一乘 B。'
          },
          {
            step: 2,
            sub: '看右图这条红绿分叉曲线：天真以为带宽只有 $2\\Delta f$ 的红虚线在窄带时会跌成 $0$，而绿色的 Carson 曲线自动兜底退化回 $2B$！还要铭记：**FM 里 $\\Delta f = \\frac{k_f m_p}{2\\pi}$，PM 里则是 $\\Delta f = \\frac{k_p |\\dot{m}|_{\\max}}{2\\pi}$**！',
            tts: '看右边这张对比曲线：天真认为带宽等于两倍德尔塔 f 的红色虚线在窄带极限会直接跌成零，这正是第一集讲的错误幻觉；而绿色的卡森公式在窄带时稳稳兜底退化回两倍基带带宽，宽带时才逼近两倍德尔塔 f。考试务必分清：调频的德尔塔 f 用峰值幅度算，调相用最大斜率算！'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var df = env.params.df !== undefined ? env.params.df : 20.0;
          var B = env.params.bwB !== undefined ? env.params.bwB : 5.0;
          var bt = 2 * (df + B);
          var beta = df / B;
          var narrow = boxes[0].w < 460;

          // Panel 1: Frequency excursion + edge sinc skirts
          var span = Math.max(25, df + B + 8);
          var ax1 = env.viz.drawAxes(ctx, boxes[0], {
            xMin: -span,
            xMax: span,
            yMin: 0,
            yMax: 1.25,
            xGrid: 4,
            yGrid: 3,
            xTicks: [[-(df + B), '-' + (df + B).toFixed(0)], [-df, '-Δf'], [0, 'fc'], [df, '+Δf'], [df + B, '+' + (df + B).toFixed(0)]],
            yTicks: [[0, '0'], [1, '谱包络']],
            title: narrow ? '2Δf + 2B = ' + bt.toFixed(0) + 'kHz' : '频谱物理构成：中间摆幅 2Δf (' + (2 * df).toFixed(0) + ') + 两端裙摆 2B (' + (2 * B).toFixed(0) + ')'
          });
          env.viz.drawShadedBand(ctx, ax1, -df, df, 'rgba(56, 189, 248, 0.16)', '2Δf');
          env.viz.drawShadedBand(ctx, ax1, -(df + B), -df, 'rgba(251, 191, 36, 0.22)', 'B');
          env.viz.drawShadedBand(ctx, ax1, df, df + B, 'rgba(251, 191, 36, 0.22)', 'B');

          // Draw sample sinc lobes across [-df, +df]
          var lobeCenters = [-df, -df * 0.5, 0, df * 0.5, df];
          for (var i = 0; i < lobeCenters.length; i++) {
            (function (fcOff) {
              env.viz.drawCurve(ctx, ax1, function (f) {
                var u = (f - fcOff) / B;
                return 0.85 * Math.pow(env.math.sinc(u), 2);
              }, { from: fcOff - 1.4 * B, to: fcOff + 1.4 * B, samples: 80, color: Math.abs(fcOff) > df * 0.8 ? P.amber : P.cyan, lineWidth: 1.6 });
            })(lobeCenters[i]);
          }

          // Panel 2: Asymptotic curve B_T/(2B) = beta + 1 vs naive beta
          var ax2 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: 0,
            xMax: 10.5,
            yMin: 0,
            yMax: 12.0,
            xGrid: 5,
            yGrid: 4,
            xTicks: [[0, '0'], [2, '2'], [5, '5'], [10, 'β=10']],
            yTicks: [[1, '2B'], [5, '10B'], [10, '20B']],
            title: narrow ? 'β=' + beta.toFixed(2) + ' · BT=' + bt.toFixed(0) + 'kHz' : 'Carson (绿 β+1) vs 误区 (红 β)：窄带必兜底 2B'
          });
          env.viz.drawCurve(ctx, ax2, function (x) { return x + 1; }, { color: P.green, lineWidth: 2.5 });
          env.viz.drawCurve(ctx, ax2, function (x) { return x; }, { color: P.red, dash: [5, 4], lineWidth: 1.8 });
          var curX = Math.min(10.2, beta);
          env.viz.drawStems(ctx, ax2, [
            { x: curX, y: Math.min(11.4, curX + 1), color: P.amber, width: 2.5, label: 'β=' + beta.toFixed(1) }
          ], {});
          env.viz.drawAnnotation(ctx, ax2, 2.6, 1.4, '窄带兜底 B_T ≥ 2B!', P.green, 'center');
        }
      },
      {
        id: 's03',
        tag: '课件例题',
        title: '课件 Ex 5.3：周期三角波 3 次谐波截断 + 幅度加倍 vs 时间展宽',
        slideRef: '04AngM pp.22–26',
        terms: [
          { en: 'Essential Bandwidth (3rd Harmonic)', zh: '3 次谐波有效带宽' },
          { en: 'Amplitude Scaling vs Time Scaling', zh: '幅度缩放与时间展宽对比' }
        ],
        symbols: [
          { sym: 'f_0 = 5\\text{ kHz},\\; B = 3 f_0 = 15\\text{ kHz}', desc: '原周期三角波取前 3 次谐波估算带宽', color: P.cyan },
          { sym: 'k_f = 2\\pi\\times 10^5,\\; k_p = 5\\pi', desc: '原参 m_p=1, |m\'|_max=20000 → FM 230kHz / PM 130kHz', color: P.amber },
          { sym: 'm(t/2) \\implies B\\downarrow\\tfrac{1}{2},\\; |\\dot{m}|_{\\max}\\downarrow\\tfrac{1}{2}', desc: '时间展宽 2 倍：FM 仅降到 215kHz，PM 暴跌一半到 65kHz', color: P.pink }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: '\\textbf{(a) 原题: } B=15\\text{ kHz},\\; m_p=1,\\; m\'_p=20000 \\implies \\begin{cases}\\Delta f_{\\text{FM}}=100\\text{ kHz} \\Rightarrow B_{\\text{FM}}=2(100+15)=230\\text{ kHz}\\\\ \\Delta f_{\\text{PM}}=50\\text{ kHz} \\Rightarrow B_{\\text{PM}}=2(50+15)=130\\text{ kHz}\\end{cases}', label: 'Ex 5.3 (a) 基准：三角波从 -1 到 +1 用半周期 0.1ms，故斜率为 20000' },
          { step: 1, latex: '\\textbf{(b) 幅度翻倍 }2m(t):\\; m_p=2,\\; m\'_p=40000 \\implies B_{\\text{FM}}=2(200+15)=430\\text{ kHz},\\quad B_{\\text{PM}}=2(100+15)=230\\text{ kHz}', label: 'Ex 5.3 (b) 幅度加倍：m_p 与 m\'_p 同步翻倍，FM 和 PM 带宽齐齐暴涨约两倍' },
          { step: 2, latex: '\\textbf{(c) 时间展宽 }m(t/2):\\; B=7.5\\text{ kHz},\\; m\'_p=10000 \\implies B_{\\text{FM}}=2(100+7.5)=215\\text{ kHz},\\quad B_{\\text{PM}}=2(25+7.5)=65\\text{ kHz}', label: 'Ex 5.3 (c) 分水岭：展宽后斜率减半，PM 对时间尺度极端敏感，FM 几乎纹丝不动' }
        ],
        sliders: [
          { key: 'ampScale', label: '幅度缩放倍数 A', min: 1.0, max: 2.0, step: 0.5, default: 1.0 },
          { key: 'timeScale', label: '时间展宽倍数 τ', min: 1.0, max: 2.0, step: 0.5, default: 1.0 }
        ],
        presets: [
          { label: '(a) 原题基准 (230 / 130 kHz)', values: { ampScale: 1.0, timeScale: 1.0 } },
          { label: '(b) 幅度加倍 2m(t) (430 / 230)', values: { ampScale: 2.0, timeScale: 1.0 } },
          { label: '(c) 时间展宽 m(t/2) (215 / 65)', values: { ampScale: 1.0, timeScale: 2.0 } }
        ],
        lines: [
          {
            step: 0,
            sub: '来看课件名场面例题 **Ex 5.3**：周期三角波基频 $f_0 = 5\\text{ kHz}$，截断到第 $3$ 次谐波得到 $B = 15\\text{ kHz}$。它半周期 $0.1\\text{ ms}$ 内从 $-1$ 爬到 $+1$，最大斜率 $20000$。代入 Carson 公式算出原参基准：**FM 占 $230\\text{ kHz}$，PM 占 $130\\text{ kHz}$**。',
            tts: '来看课件经典例题五点三：周期三角波基频五千赫兹，取前三次谐波作为有效带宽，得到 B 等于十五千赫兹。三角波在零点一毫秒内从负一爬升到正一，最大斜率两万。代入卡森公式算出原题基准：调频占二百三十千赫兹，调相占一百三十千赫兹。'
          },
          {
            step: 1,
            sub: '点第二个预设把**幅度加倍到 $2m(t)$**：峰高翻倍成 $2$，同时斜率也直接翻倍成 $40000$！于是 FM 频偏从 $100$ 翻成 $200$，带宽激增到 **$430\\text{ kHz}$**；PM 频偏从 $50$ 翻成 $100$，带宽激增到 **$230\\text{ kHz}$**——幅度翻倍，两边带宽统统几乎翻倍！',
            tts: '点第二个预设，把消息幅度加倍成两倍 m t：不仅波峰高了一倍，斜率也跟着陡了一倍变成四万。于是调频最大频偏翻倍到两百千赫兹，带宽暴涨到四百三十千赫兹；调相频偏翻倍到一百千赫兹，带宽暴涨到二百三十千赫兹，两边都翻了将近一倍。'
          },
          {
            step: 2,
            sub: '再点第三个预设做**时间展宽 $m(t/2)$**：波形横着拉长两倍，带宽 $B$ 减半到 $7.5\\text{ kHz}$，斜率 $m\'_p$ 也拦腰砍半到 $10000$！结果奇迹出现了：FM 峰高没变，带宽只微降到 **$215\\text{ kHz}$**；而依赖斜率的 PM 直接暴跌整整一半到 **$65\\text{ kHz}$**！',
            tts: '再点第三个预设，把信号时间展宽两倍变成 m 二分之 t：信号横着拉扁了一倍，带宽 B 减半到七点五千赫兹，最大斜率也拦腰砍半只剩一万。这下分水岭出现了：调频只看波峰高度，所以带宽几乎不动只微调到二百一十五千赫兹；而依赖导数斜率的调相直接腰斩，暴跌一半到六十五千赫兹！'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var A = env.params.ampScale !== undefined ? env.params.ampScale : 1.0;
          var tau = env.params.timeScale !== undefined ? env.params.timeScale : 1.0;
          var narrow = boxes[0].w < 460;

          var B = 15.0 / tau;
          var dfFM = 100.0 * A;
          var dfPM = (50.0 * A) / tau;
          var bFM = 2 * (dfFM + B);
          var bPM = 2 * (dfPM + B);
          var slope = (20000 * A) / tau;

          // Panel 1: Triangle wave m(t) with amp and time scaling (time in ms, T0 = 0.2 ms)
          var ax1 = env.viz.drawAxes(ctx, boxes[0], {
            xMin: -0.2,
            xMax: 0.2,
            yMin: -2.4,
            yMax: 2.4,
            xGrid: 4,
            yGrid: 4,
            xTicks: [[-0.2, '-0.2'], [-0.1, '-0.1'], [0, '0'], [0.1, '0.1'], [0.2, '0.2ms']],
            yTicks: [[-2, '-2'], [-1, '-1'], [0, '0'], [1, '1'], [2, '2']],
            title: narrow ? 'mp=' + A.toFixed(1) + ', m\'=' + (slope / 1000).toFixed(0) + 'k/s' : '三角波演化：mp=' + A.toFixed(1) + ', |m\'|max=' + Math.round(slope) + '/s, B=' + B.toFixed(1) + 'kHz'
          });
          env.viz.drawCurve(ctx, ax1, function (tms) {
            var T = 0.2 * tau;
            var u = (((tms % T) + T) % T) / T; // 0..1
            var tri = u < 0.5 ? (1 - 4 * u) : (-1 + 4 * (u - 0.5));
            return A * tri;
          }, { samples: 400, color: P.cyan, lineWidth: 2.3 });

          // Panel 2: Bandwidth bars comparing current FM/PM vs baseline (230 / 130 kHz)
          var ax2 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: 0.4,
            xMax: 4.6,
            yMin: 0,
            yMax: 480,
            xGrid: 4,
            yGrid: 4,
            xTicks: [[1, '基准FM'], [2, '当前FM'], [3, '基准PM'], [4, '当前PM']],
            yTicks: [[0, '0'], [130, '130'], [230, '230'], [430, '430k']],
            title: narrow ? 'FM:' + bFM.toFixed(0) + 'k vs PM:' + bPM.toFixed(0) + 'k' : 'Carson 带宽对比 (kHz)：基准 vs 当前变换'
          });
          env.viz.drawStems(ctx, ax2, [
            { x: 1, y: 230, color: P.muted, width: 14, label: '230' },
            { x: 2, y: bFM, color: P.pink, width: 16, label: bFM.toFixed(0) + 'k' },
            { x: 3, y: 130, color: P.muted, width: 14, label: '130' },
            { x: 4, y: bPM, color: P.green, width: 16, label: bPM.toFixed(0) + 'k' }
          ], {});
        }
      },
      {
        id: 's04',
        tag: '作业精讲',
        hwCode: '5.2-1',
        title: 'HW2 作业 5.2-1：非正弦周期信号 5 次谐波带宽与 Carson 实战',
        slideRef: 'HW2 · 5.2-1',
        terms: [
          { en: 'Fifth Harmonic Bandwidth', zh: '五次谐波有效带宽' },
          { en: 'Peak Deviation vs Derivative', zh: '幅度峰值 vs 导数峰值' }
        ],
        symbols: [
          { sym: 'T_0 = 0.25\\text{ s} \\implies f_0 = 4\\text{ Hz}', desc: '沿用 5.1-3 消息波形，取 5 次谐波得 B = 20 Hz', color: P.cyan },
          { sym: '\\Delta f_{\\text{FM}} = 30\\text{ Hz} \\implies B_{\\text{FM}} = 100\\text{ Hz}', desc: 'kf=20π, mp=3 → 2(30 + 20) = 100 Hz', color: P.pink },
          { sym: '\\Delta f_{\\text{PM}} = 15\\text{ Hz} \\implies B_{\\text{PM}} = 70\\text{ Hz}', desc: 'kp=π/2, |m\'|_max=60 → 2(15 + 20) = 70 Hz', color: P.green }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: 'f_0 = \\frac{1}{T_0} = \\frac{1}{0.25} = 4\\text{ Hz} \\xrightarrow{\\text{题设取 }5\\text{ 次谐波}} B = 5 \\times 4 = 20\\text{ Hz},\\quad m_p = 3,\\; |\\dot{m}|_{\\max} = 60', label: '先锁定消息三大数字：带宽 B=20Hz、峰高 mp=3、最陡斜率 60' },
          { step: 1, latex: '\\textbf{(a) FM:}\\quad \\Delta f_{\\text{FM}} = \\frac{k_f m_p}{2\\pi} = \\frac{20\\pi \\cdot 3}{2\\pi} = 30\\text{ Hz} \\implies B_{\\text{FM}} \\approx 2(\\Delta f_{\\text{FM}} + B) = 2(30 + 20) = 100\\text{ Hz}', label: 'FM 直接乘峰值 mp=3，得出总带宽 100 Hz' },
          { step: 2, latex: '\\textbf{(b) PM:}\\quad \\Delta f_{\\text{PM}} = \\frac{k_p |\\dot{m}|_{\\max}}{2\\pi} = \\frac{(\\pi/2)\\cdot 60}{2\\pi} = 15\\text{ Hz} \\implies B_{\\text{PM}} \\approx 2(\\Delta f_{\\text{PM}} + B) = 2(15 + 20) = 70\\text{ Hz}', label: 'PM 务必乘最大斜率 60（绝对不能直接乘 mp=3！），得出总带宽 70 Hz' }
        ],
        sliders: [
          { key: 'harmN', label: '题设取第 N 次谐波估算 B', min: 3, max: 7, step: 1, default: 5 }
        ],
        presets: [
          { label: 'HW2 原题解 (5次谐波 B=20Hz)', values: { harmN: 5 } },
          { label: '对比 3 次谐波 (B=12Hz)', values: { harmN: 3 } }
        ],
        lines: [
          {
            step: 0,
            sub: '接着用 Carson 公式解作业 **5.2-1**：它用的正是上一题 **5.1-3** 的周期波形。周期 $0.25\\text{ s}$ 对应基频 $f_0 = 4\\text{ Hz}$，题干规定用第 $5$ 次谐波估算消息有效带宽，所以 $B = 5 \\times 4 = 20\\text{ Hz}$。看左图谐波谱：第 $5$ 次之后幅度确实已很小！',
            tts: '接着用卡森公式解作业五点二杠一：它用的正是上一题五点一杠三里的周期波形。周期零点二五秒对应基频四赫兹，题目明确说明用第五次谐波作为有效带宽，所以 B 等于五乘四，等于二十赫兹。看左图傅里叶谐波谱，五次之后确实已经衰减得很小了。'
          },
          {
            step: 1,
            sub: '先算 **(a) FM**：查参数 $k_f = 20\\pi$、波峰 $m_p = 3$，于是最大频偏 $\\Delta f = \\frac{20\\pi \\times 3}{2\\pi} = 30\\text{ Hz}$。套进 Carson 公式：$B_{\\text{FM}} \\approx 2(30 + 20) = 100\\text{ Hz}$！',
            tts: '先算第一小问调频：题目给的 k f 等于二十派，消息峰值等于三，最大频偏等于二十派乘三除以二派，得到三十赫兹。再把二十赫兹带宽代进卡森公式，二乘以三十加二十，答案刚好一百赫兹。'
          },
          {
            step: 2,
            sub: '再算 **(b) PM**：最常见错法就是拿 $k_p = \\pi/2$ 去乘 $m_p = 3$！千万记住 **PM 的瞬时频偏看导数**，所以必须拿最大斜率 $|\\dot{m}|_{\\max} = 60$ 来乘：$\\Delta f = \\frac{(\\pi/2) \\times 60}{2\\pi} = 15\\text{ Hz}$，从而 $B_{\\text{PM}} \\approx 2(15 + 20) = 70\\text{ Hz}$！',
            tts: '再算第二小问调相：考试最容易错的就是拿 k p 直接去乘波峰三！千万牢记调相的频偏看斜率，必须拿最大导数六十来乘。二分之派乘六十再除以二派，得到最大频偏十五赫兹。套进卡森公式二乘以十五加二十，得出调相带宽七十赫兹。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var N = Math.round(env.params.harmN !== undefined ? env.params.harmN : 5);
          var narrow = boxes[0].w < 460;

          function mf513(t) {
            return env.math.piecewiseLinear([
              [-0.10, 0],
              [-0.05, 0],
              [0.00, 3.0],
              [0.10, -3.0],
              [0.15, 0],
              [0.20, 0]
            ], t, 0.25);
          }

          // Compute exact harmonic amplitudes |C_k| for k=1..8
          var stems = [];
          var M = 200;
          var T0 = 0.25;
          var dt = T0 / M;
          for (var k = 1; k <= 8; k++) {
            var re = 0;
            var im = 0;
            for (var i = 0; i < M; i++) {
              var t = -0.10 + (i + 0.5) * dt;
              var val = mf513(t);
              var ang = 2 * Math.PI * k * 4 * t;
              re += val * Math.cos(ang) * dt;
              im -= val * Math.sin(ang) * dt;
            }
            var ck = Math.hypot(re, im) / T0;
            stems.push({
              x: k,
              y: ck,
              color: k <= N ? P.cyan : P.muted,
              width: 5,
              label: k === N ? 'B=' + (4 * N) + 'Hz' : undefined
            });
          }

          var ax1 = env.viz.drawAxes(ctx, boxes[0], {
            xMin: 0.3,
            xMax: 8.7,
            yMin: 0,
            yMax: 1.45,
            xGrid: 8,
            yGrid: 3,
            xTicks: [[1, '4Hz'], [3, '12'], [5, '20Hz'], [7, '28']],
            yTicks: [[0, '0'], [0.5, '0.5'], [1.0, '1.0']],
            title: narrow ? '取前 ' + N + ' 次谐波 (B=' + (4 * N) + 'Hz)' : '5.1-3 波形谐波幅度 |Ck|：截断至第 ' + N + ' 次 (B=' + (4 * N) + ' Hz)'
          });
          env.viz.drawShadedBand(ctx, ax1, 0.5, N + 0.45, 'rgba(56, 189, 248, 0.14)', '有效带');
          env.viz.drawStems(ctx, ax1, stems, {});

          // Panel 2: Carson bandwidth calculation breakdown
          var B = 4 * N;
          var bFM = 2 * (30 + B);
          var bPM = 2 * (15 + B);
          var ax2 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: 0.4,
            xMax: 2.6,
            yMin: 0,
            yMax: 135,
            xGrid: 2,
            yGrid: 4,
            xTicks: [[1, 'FM: 2(30+' + B + ')'], [2, 'PM: 2(15+' + B + ')']],
            yTicks: [[0, '0'], [50, '50'], [100, '100Hz']],
            title: narrow ? 'FM=' + bFM + 'Hz vs PM=' + bPM + 'Hz' : 'Carson 总带宽结果：FM=' + bFM + ' Hz vs PM=' + bPM + ' Hz'
          });
          env.viz.drawStems(ctx, ax2, [
            { x: 1, y: bFM, color: P.pink, width: 18, label: bFM + ' Hz' },
            { x: 2, y: bPM, color: P.green, width: 18, label: bPM + ' Hz' }
          ], {});
          env.viz.drawAnnotation(ctx, ax2, 1, 30, '2Δf=60', P.amber, 'center');
          env.viz.drawAnnotation(ctx, ax2, 2, 15, '2Δf=30', P.amber, 'center');
        }
      },
      {
        id: 's05',
        tag: '作业精讲',
        hwCode: '5.2-7',
        title: 'HW2 作业 5.2-7：单音幅度翻倍 vs 频率翻倍三连对比（PM 灵敏度铁律）',
        slideRef: 'HW2 · 5.2-7',
        terms: [
          { en: 'Spectrum Sensitivity', zh: '带宽对消息幅/频的敏感性' },
          { en: 'Carson Bandwidth Comparison', zh: 'FM 与 PM 带宽对比' }
        ],
        symbols: [
          { sym: 'm(t)=\\sin(2000\\pi t)\\implies B=1\\text{ kHz}', desc: 'kf=200000π, kp=10 → 基准 Δf_FM=100kHz, Δf_PM=10kHz', color: P.cyan },
          { sym: 'A_m\\times 2 \\implies B_{\\text{FM}}:202\\to 402\\text{ kHz},\\; B_{\\text{PM}}:22\\to 42\\text{ kHz}', desc: '幅度加倍时，FM 和 PM 频偏与总带宽同时约翻倍', color: P.amber },
          { sym: 'B\\times 2 \\implies B_{\\text{FM}}:202\\to 204\\text{ kHz},\\; B_{\\text{PM}}:22\\to 44\\text{ kHz}', desc: '频率加倍时，FM 几乎不变，PM 因导数带出 2 直接翻倍！', color: P.green }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: '\\textbf{(a) 基准 }(A_m=1,\\;B=1\\text{ kHz}):\\; \\Delta f_{\\text{FM}}=100\\text{ kHz}\\Rightarrow B_{\\text{FM}}=202\\text{ kHz};\\quad \\Delta f_{\\text{PM}}=10\\text{ kHz}\\Rightarrow B_{\\text{PM}}=22\\text{ kHz}', label: '基准情况：m(t)=sin(2000πt)，导数峰值 |m\'|_max = 2000π' },
          { step: 1, latex: '\\textbf{(b) 幅度翻倍 }(A_m=2,\\;B=1\\text{ kHz}):\\; B_{\\text{FM}}\\approx 2(200+1)=402\\text{ kHz},\\quad B_{\\text{PM}}\\approx 2(20+1)=42\\text{ kHz}', label: '幅度翻倍：峰值和导数全翻倍，FM 与 PM 带宽一起接近翻倍' },
          { step: 2, latex: '\\textbf{(c) 频率翻倍 }(A_m=1,\\;B=2\\text{ kHz}):\\; B_{\\text{FM}}\\approx 2(100+2)=204\\text{ kHz},\\quad B_{\\text{PM}}\\approx 2(20+2)=44\\text{ kHz}\\;\\big|\\; \\textbf{(d) }\\text{FM 靠幅度，PM 幅频双敏}', label: '核心总结：FM 对消息频谱宽度极钝感（仅+B微增），PM 对高频斜率极敏感' }
        ],
        sliders: [
          { key: 'ampMult', label: '幅度倍数 Am', min: 1.0, max: 2.0, step: 0.5, default: 1.0 },
          { key: 'freqMult', label: '消息频率 B (kHz)', min: 1.0, max: 2.0, step: 0.5, default: 1.0 }
        ],
        presets: [
          { label: '(a) 基准 (202 / 22 kHz)', values: { ampMult: 1.0, freqMult: 1.0 } },
          { label: '(b) 幅度翻倍 (402 / 42 kHz)', values: { ampMult: 2.0, freqMult: 1.0 } },
          { label: '(c) 频率翻倍 (204 / 44 kHz)', values: { ampMult: 1.0, freqMult: 2.0 } }
        ],
        lines: [
          {
            step: 0,
            sub: '来看作业 **5.2-7**，把刚才 Ex 5.3 的洞察在单音正弦上再练一遍！已知 $m(t) = \\sin(2000\\pi t)$，峰高 $1$、频率 $B = 1\\text{ kHz}$、导数最大 $2000\\pi$。第 **(a)** 问基准：$k_f = 200000\\pi$ 算出 $\\Delta f_{\\text{FM}} = 100\\text{ kHz}$，总带宽 **$202\\text{ kHz}$**；$k_p=10$ 算出 $\\Delta f_{\\text{PM}} = 10\\text{ kHz}$，总带宽 **$22\\text{ kHz}$**。',
            tts: '来看作业五点二杠七，这是极爱考的对比大题。题目给单音信号正弦两千派 t，幅度为一，频率 B 等于一千赫兹，导数最大值两千派。第一小问基准：k f 等于二十万派，算出调频频偏一百千赫兹，总带宽二百零二千赫兹；k p 等于十，算出调相频偏十千赫兹，总带宽二十二千赫兹。'
          },
          {
            step: 1,
            sub: '第 **(b)** 问把消息**幅度翻倍**：$m_p$ 变成 $2$，导数也连带变成 $4000\\pi$。于是 FM 频偏升到 $200\\text{ kHz}$、带宽暴涨为 **$402\\text{ kHz}$**；PM 频偏升到 $20\\text{ kHz}$、带宽暴涨为 **$42\\text{ kHz}$**，两兄弟一齐翻倍！',
            tts: '第二小问把消息幅度翻倍：不仅高度变成二，求导后的最大斜率也同步翻倍成四千派。因此调频带宽直接涨到四百零二千赫兹，调相带宽直接涨到四十二千赫兹，两兄弟同步接近翻倍。'
          },
          {
            step: 2,
            sub: '点下预设 **(c)** 把**频率翻倍成 $B=2\\text{ kHz}$**：振幅仍为 $1$，所以 FM 带宽只从 $202$ 微调到 **$204\\text{ kHz}$**（几乎不变！）；而 $m\'(t)$ 求导会吐出系数 $2$，让 PM 带宽直接翻倍冲上 **$44\\text{ kHz}$**！第 **(d)** 问必背结论：**FM 带宽主要由幅度决定，对消息频率极钝感；PM 带宽则对幅度和频率都敏感**！',
            tts: '再点预设看第三小问把消息频率翻倍到两千赫兹：振幅还是幺，所以调频最大频偏还是一百，带宽只从二百零二微涨到二百零四千赫兹，几乎不动；但正弦求导会吐出频率因子，使调相斜率翻倍，带宽直接从二十二跃升到四十四千赫兹！记住第四小问标准答案：调频带宽主要由幅度决定、对消息频率不敏感，而调相带宽对幅度和频率都很敏感。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var A = env.params.ampMult !== undefined ? env.params.ampMult : 1.0;
          var F = env.params.freqMult !== undefined ? env.params.freqMult : 1.0;
          var narrow = boxes[0].w < 460;

          var dfFM = 100 * A;
          var dfPM = 10 * A * F;
          var bFM = 2 * (dfFM + F);
          var bPM = 2 * (dfPM + F);

          // Panel 1: Sine message waveform with tangent slope arrow at t=0
          var ax1 = env.viz.drawAxes(ctx, boxes[0], {
            xMin: 0,
            xMax: 1.0,
            yMin: -2.4,
            yMax: 2.4,
            xGrid: 4,
            yGrid: 4,
            xTicks: [[0, '0'], [0.5, '0.5ms'], [1.0, '1.0ms']],
            yTicks: [[-2, '-2'], [-1, '-1'], [0, '0'], [1, '+1'], [2, '+2']],
            title: narrow ? 'Am=' + A.toFixed(1) + ', B=' + F.toFixed(1) + 'kHz' : 'm(t) = ' + A.toFixed(1) + '·sin(2π·' + F.toFixed(1) + 'k·t)，峰值斜率 ∝ Am·B = ' + (A * F).toFixed(1)
          });
          env.viz.drawCurve(ctx, ax1, function (tms) {
            return A * Math.sin(2 * Math.PI * F * tms);
          }, { samples: 300, color: P.cyan, lineWidth: 2.3 });
          // Tangent line at t=0 showing derivative sensitivity
          env.viz.drawCurve(ctx, ax1, function (tms) {
            return A * 2 * Math.PI * F * tms;
          }, { from: 0, to: 0.16 / F, color: P.amber, dash: [4, 3], lineWidth: 2.0 });
          env.viz.drawAnnotation(ctx, ax1, 0.28, 1.8, '陡峭度 |m\'|max=' + Math.round(2 * A * F) + '000π', P.amber, 'center');

          // Panel 2: Grouped comparison of FM vs PM against baseline (202 / 22 kHz)
          var ax2 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: 0.4,
            xMax: 4.6,
            yMin: 0,
            yMax: 450,
            xGrid: 4,
            yGrid: 4,
            xTicks: [[1, '基准FM'], [2, '当前FM'], [3, '基准PM'], [4, '当前PM']],
            yTicks: [[0, '0'], [200, '200'], [400, '400k']],
            title: narrow ? 'FM:' + bFM.toFixed(0) + 'k | PM:' + bPM.toFixed(0) + 'k' : '5.2-7 三连对比 (kHz)：FM(粉) vs PM(绿)'
          });
          env.viz.drawStems(ctx, ax2, [
            { x: 1, y: 202, color: P.muted, width: 14, label: '202' },
            { x: 2, y: bFM, color: P.pink, width: 16, label: bFM.toFixed(0) + 'k' },
            { x: 3, y: 22, color: P.muted, width: 14, label: '22' },
            { x: 4, y: bPM, color: P.green, width: 16, label: bPM.toFixed(0) + 'k' }
          ], {});
          env.viz.drawAnnotation(ctx, ax2, 3.5, Math.max(95, bPM + 45), 'PM 对频率高度敏感!', P.green, 'center');
        }
      }
    ]
  });
})(window);
