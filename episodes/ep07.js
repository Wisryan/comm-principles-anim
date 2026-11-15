(function (global) {
  'use strict';

  var P = global.COMM_VIZ.PALETTE;

  function triSide(center, bw, height) {
    return function (f) {
      var u = Math.abs(f - center) / bw;
      return u < 1 ? height * (1 - u) : 0;
    };
  }

  global.COMM_EPISODES.push({
    id: 'ep07',
    chapter: 'Ch.03 幅度调制（下）',
    title: 'QAM、希尔伯特变换 SSB、VSB 与载波同步',
    slideDeck: '03AM 课件讲义',
    slideRange: 'pp. 22–45',
    homeworkTags: ['HW1 · 4.4-6', 'HW1 · 4.5-2'],
    scenes: [
      {
        id: 's00',
        tag: '推导',
        title: '正交幅度调制 QAM：同频带上 cos 与 sin 如何互不打架？',
        slideRef: '03AM pp.20–23',
        terms: [
          { en: 'QAM (Quadrature Amplitude Modulation)', zh: '正交幅度调制' },
          { en: 'In-Phase / Quadrature (I / Q)', zh: '同相支路 / 正交支路' },
          { en: 'I/Q Crosstalk', zh: '正交串扰（相差引起）' }
        ],
        symbols: [
          { sym: '\\varphi_{\\text{QAM}}(t) = m_1(t)\\cos\\omega_c t + m_2(t)\\sin\\omega_c t', desc: '两路独立信号共享同一 $2B$ 带宽', color: P.cyan },
          { sym: 'm(t) = m_1(t) + j m_2(t)', desc: '复包络视角：实部与虚部正交并行', color: P.amber },
          { sym: 'y_1(t) = m_1(t)\\cos\\delta - m_2(t)\\sin\\delta', desc: '收端相差 $\\delta \\ne 0$ 时 $m_2$ 漏入 $m_1$（串扰）', color: P.red }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: '\\varphi_{\\text{QAM}}(t) = m_1(t)\\cos\\omega_c t + m_2(t)\\sin\\omega_c t = \\operatorname{Re}\\!\\big\\{[m_1(t)+jm_2(t)]e^{-j\\omega_c t}\\big\\}', label: '复数观点：复信号 M(ω)≠M*(-ω)，正负频率各自独立携带信息' },
          { step: 1, latex: '\\int_0^{T} \\cos\\omega_c t\\sin\\omega_c t\\,dt = 0 \\implies 2\\varphi\\cos\\omega_c t \\xrightarrow{\\text{LPF}} m_1(t),\\quad 2\\varphi\\sin\\omega_c t \\xrightarrow{\\text{LPF}} m_2(t)', label: '完美同步解调：正弦与余弦严格正交（相差 90°），两路零串扰分离' },
          { step: 2, latex: '2\\varphi(t)\\cos(\\omega_c t + \\delta) \\xrightarrow{\\text{LPF}} m_1(t)\\cos\\delta - m_2(t)\\sin\\delta', label: '严苛同步要求：本地载波只要偏一点角度 δ，I/Q 立刻互相串扰' }
        ],
        sliders: [
          { key: 'deltaDeg', label: '本地载波相位偏差 δ (°)', min: -45, max: 45, step: 5, default: 0 }
        ],
        presets: [
          { label: '理想正交锁相 (δ=0°)', values: { deltaDeg: 0 } },
          { label: '相位偏斜串扰 (δ=30°)', values: { deltaDeg: 30 } },
          { label: '反向偏斜 (δ=-30°)', values: { deltaDeg: -30 } }
        ],
        lines: [
          {
            step: 0,
            sub: '上一集发现单路 DSB 只利用了实频谱的一半容量。第一把省带宽钥匙叫 QAM：同一条频带上，用 $\\cos\\omega_c t$ 载着 $m_1(t)$，同时用正交的 $\\sin\\omega_c t$ 载着完全独立的 $m_2(t)$！只占和单路 DSB 一样的 $2B$ 带宽，信息量直接翻倍！',
            tts: '上一集我们发现实信号的抑制载波双边带浪费了一半频率自由度。第一把高效钥匙叫正交幅度调制，英文简称 Q A M：在同一段二 B 带宽里，让余弦载波带着第一路信号 m 一，再让相位差九十度的正弦载波同时带着第二路信号 m 二，带宽完全不增加，传输能力直接翻倍！'
          },
          {
            step: 1,
            sub: '为什么两路混在一起发出去却互不打架？因为 $\\cos\\omega_c t$ 与 $\\sin\\omega_c t$ 恰好垂直 $90^\\circ$ 正交！接收端上臂乘 $2\\cos\\omega_c t$ 再低通，正弦项变成 $\\sin 2\\omega_c t$ 被滤光，稳稳还原出 $m_1(t)$；下臂乘 $2\\sin\\omega_c t$ 则干干净净取回 $m_2(t)$！',
            tts: '为什么两路信号混在同一段频谱里发出去却不会打架？秘诀就在余弦和正弦恰好垂直九十度正交。接收机上支路乘以二倍余弦，余弦项平方还原出 m 一，而正弦交叉项变成二倍频，直接被低通滤波器拦掉；下支路乘以二倍正弦，同样干干净净提回 m 二。'
          },
          {
            step: 2,
            sub: '从复基带 $m(t)=m_1+jm_2$ 看更透彻：复信号的频谱不再正负对称，正负半轴才真正装满了两路信息！不过代价也很明显——拖动滑块偏一点相差 $\\delta$，接收投影轴立刻歪斜，输出变成 $m_1\\cos\\delta - m_2\\sin\\delta$，两路立刻发生严重的正交串扰！',
            tts: '从复信号视角看更加透彻：把 m 一加 j 倍 m 二看成一个复基带信号，它的频谱不再正负共轭对称，正好把正负频率空间塞得满满当当。但 Q A M 对载波同步极其敏感，试着拖动相差滑块偏离零度，左右向量坐标系立刻歪斜，第二路波形直接漏进第一路里造成严重串扰！'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var deg = env.params.deltaDeg || 0;
          var rad = (deg * Math.PI) / 180;
          var narrow0 = boxes[0].w < 460;

          // Panel 1: Orthogonal I/Q phasor axes rotated by delta
          env.viz.drawPhasorWheel(ctx, boxes[0], {
            title: narrow0 ? 'I/Q 正交坐标系 (δ=' + deg + '°)' : 'I/Q 空间投影：接收轴偏转 δ=' + deg + '° 导致串扰',
            subtitle: Math.abs(deg) < 2 ? '严格垂直正交' : '产生正交串扰!',
            subtitleColor: Math.abs(deg) < 2 ? P.green : P.red,
            vectors: [
              { mag: 0.86, angle: 0, color: P.cyan, width: 2.6, label: '发 I (cos)' },
              { mag: 0.86, angle: Math.PI / 2, color: P.amber, width: 2.6, label: '发 Q (sin)' },
              { mag: 0.92, angle: rad, color: Math.abs(deg) < 2 ? P.green : P.red, width: 2.0, label: '收本地轴' }
            ]
          });

          // Panel 2: Demodulated Ch1 output = m1*cos(delta) - m2*sin(delta)
          var m1 = function (t) { return Math.sin(2 * Math.PI * t); };
          var m2 = function (t) { return 0.9 * (env.math.rect((t - 0.35) / 0.22) - env.math.rect((t - 0.72) / 0.22)); };
          var y1 = function (t) { return m1(t) * Math.cos(rad) - m2(t) * Math.sin(rad); };

          var narrow1 = boxes[1].w < 460;
          var ax = env.viz.drawAxes(ctx, boxes[1], {
            xMin: 0,
            xMax: 1.0,
            yMin: -1.45,
            yMax: 1.45,
            xGrid: 4,
            yGrid: 4,
            xTicks: [[0, '0'], [0.5, '0.5'], [1.0, '1.0s']],
            yTicks: [[-1, '-1'], [0, '0'], [1, '+1']],
            title: narrow1 ? 'I 路解调输出 y₁(t)' : 'I 路解调输出：蓝虚=原正弦 m₁(t)，实线=y₁(t)（混入方波 m₂ 串扰）'
          });
          env.viz.drawCurve(ctx, ax, m1, { samples: 240, color: P.cyan, lineWidth: 2.0, dash: [5, 3] });
          env.viz.drawCurve(ctx, ax, y1, { samples: 280, color: Math.abs(deg) < 2 ? P.green : P.red, lineWidth: 2.3 });
          if (Math.abs(deg) >= 5) {
            env.viz.drawAnnotation(ctx, ax, 0.35, 1.15, '方波 m₂ 串扰漏入!', P.red, 'center');
          }
        }
      },
      {
        id: 's01',
        tag: '推导',
        title: 'SSB 单边带原理、希尔伯特变换与移相法正负号勘误',
        slideRef: '03AM pp.25–29',
        terms: [
          { en: 'SSB (Single Sideband)', zh: '单边带调制' },
          { en: 'Hilbert Transform', zh: '希尔伯特变换（90° 全通移相）' },
          { en: 'Phase-Shift Method', zh: '移相法 SSB' }
        ],
        symbols: [
          { sym: 'H(\\omega) = -j\\operatorname{sgn}(\\omega)', desc: '希尔伯特滤波器（$\\omega>0$ 移 $-90^\\circ$，$\\omega<0$ 移 $+90^\\circ$）', color: P.cyan },
          { sym: 'j M_h(\\omega) = \\operatorname{sgn}(\\omega) M(\\omega)', desc: '正频为 $+M(\\omega)$，负频翻号为 $-M(\\omega)$', color: P.amber },
          { sym: '\\varphi_{\\text{USB}} = m\\cos\\omega_c t - m_h\\sin\\omega_c t', desc: '上边带减号，下边带加号（修正 p.27 错印）', color: P.green }
        ],
        errata: '⚠️ 课件勘误（03AM p.27）：顶部把 USB 时域公式误印成了 $\\Phi(t)=m(t)\\cos\\omega_c t + m_h(t)\\sin\\omega_c t$（加号实际是 LSB！），且第二行展开 $\\sin\\omega_c t$ 时漏掉了负号；但页面最底部画的频谱图却是正确的 USB！请牢记正确符号：USB 用减号（$-$），LSB 用加号（$+$）。',
        formulas: [
          { step: 0, latex: 'H(\\omega) = -j\\operatorname{sgn}(\\omega) \\;\\Longleftrightarrow\\; h(t) = \\frac{1}{\\pi t},\\qquad jM_h(\\omega) = \\operatorname{sgn}(\\omega)M(\\omega)', label: '希尔伯特变换：非因果 90° 宽带移相器，把所有正频乘 -j、负频乘 +j' },
          { step: 1, latex: '\\varphi_{\\text{USB}}(t) = m(t)\\cos\\omega_c t - m_h(t)\\sin\\omega_c t,\\qquad \\varphi_{\\text{LSB}}(t) = m(t)\\cos\\omega_c t + m_h(t)\\sin\\omega_c t', label: '黄金口诀：上边带减（USB=cos−mh·sin），下边带加（LSB=cos+mh·sin）' },
          { step: 2, latex: '\\varphi_{\\text{SSB}}(t)\\cdot 2\\cos\\omega_c t = m(t) + m(t)\\cos 2\\omega_c t \\mp m_h(t)\\sin 2\\omega_c t \\xrightarrow{\\text{LPF}} m(t)', label: '与 DSB-SC 共用完全相同的相干解调器，2ωc 交叉项直接被低通滤除' }
        ],
        sliders: [
          { key: 'side', label: '移相合成模式 (-1=USB减号, 0=DSB, +1=LSB加号)', min: -1, max: 1, step: 1, default: -1 }
        ],
        presets: [
          { label: 'USB 上边带 (减号 −)', values: { side: -1 } },
          { label: 'LSB 下边带 (加号 +)', values: { side: 1 } },
          { label: '无正交支路 (DSB-SC)', values: { side: 0 } }
        ],
        lines: [
          {
            step: 0,
            sub: '如果只有一路实信号 $m(t)$，如何把 DSB 带宽 $2B$ 直接腰斩成 $B$？只传一侧边带即可，这就是单边带 SSB！怎样不用陡峭滤波器就精准抵消另一半？靠希尔伯特变换！它的频响 $H(\\omega) = -j\\operatorname{sgn}(\\omega)$ 是全通 $-90^\\circ$ 移相器，乘上 $j$ 后刚好变成符号函数 $\\operatorname{sgn}(\\omega)M(\\omega)$！',
            tts: '如果手里只有一路实信号，怎样直接把两 B 的传输带宽腰斩成一半，变成只占 B 的单边带 S S B？最漂亮的数学办法叫移相法，核心工具是希尔伯特变换。希尔伯特滤波器在正频率相移负九十度，负频率相移正九十度，表达式是负 j 倍的符号函数，所以它的输出频谱乘上虚数单位 j，正频保持不变、负频全体反号！'
          },
          {
            step: 1,
            sub: '注意课件 03AM 第 27 页的一处重大勘误！上边带必须在正弦前取减号：$\\varphi_{\\text{USB}} = m\\cos\\omega_c t - m_h\\sin\\omega_c t$；下边带才取加号！因为 $\\sin\\omega_c t = \\frac{e^{j\\omega_c t}-e^{-j\\omega_c t}}{2j}$ 自带负号因子，课件第 27 页顶部错把 USB 印成了加号，下面却画着 USB 频谱图，考试千万别被带偏！',
            tts: '这里必须高亮提醒课件第二十七页的一处严重印刷错误！页面最上面把公式印成了加号，展开正弦时还漏掉一个负号，但最下面画的频谱图却是上边带。请一定死记正确符号：上边带 U S B 必须用减号，也就是 m 余弦减去 m h 正弦；下边带 L S B 才是加号！切换按钮就能亲眼看见另一半边带如何严丝合缝地正负相消。'
          },
          {
            step: 2,
            sub: '那么收端怎么解调 SSB？神奇的是，直接照搬 DSB-SC 的相干解调器：乘 $2\\cos\\omega_c t$ 过低通！因为多出来的正交项 $m_h\\sin\\omega_c t \\cos\\omega_c t = \\frac{1}{2}m_h\\sin 2\\omega_c t$ 全部跑到二倍载频去了，被低通顺手切得一干二净！',
            tts: '收到单边带信号后怎么解调呢？特别省心：直接拿 D S B S C 完全相同的相干解调器，乘二倍余弦再过低通就行了！因为多出来的希尔伯特正弦支路一乘余弦，全部变成二倍载频正弦，直接被低通滤波器拦在门外，毫无影响。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var side = Math.round(env.params.side !== undefined ? env.params.side : -1); // -1=USB, 0=DSB, +1=LSB

          // Panel 1: M(f) vs j*Mh(f) = sgn(f)*M(f)
          var narrow0 = boxes[0].w < 460;
          var ax1 = env.viz.drawAxes(ctx, boxes[0], {
            xMin: -3.2,
            xMax: 3.2,
            yMin: -1.25,
            yMax: 1.25,
            xGrid: 4,
            yGrid: 4,
            xTicks: [[-2, '-B'], [0, '0'], [2, '+B']],
            yTicks: [[-1, '-1'], [0, '0'], [1, '+1']],
            title: narrow0 ? 'M(f) 与 j·Mh(f)=sgn(f)M(f)' : 'Hilbert 奇对称魔法：实线 M(f) 偶对称，虚线 jMh(f) 正负翻号'
          });
          env.viz.drawCurve(ctx, ax1, triSide(0, 2.0, 1.0), { from: -2.1, to: 2.1, color: P.cyan, lineWidth: 2.2, fillAlpha: 0.14 });
          env.viz.drawCurve(ctx, ax1, function (f) {
            if (Math.abs(f) > 2) return 0;
            return (f >= 0 ? 1 : -1) * triSide(0, 2.0, 1.0)(f);
          }, { from: -2.1, to: 2.1, samples: 300, color: P.amber, lineWidth: 2.0, dash: [5, 3] });

          // Panel 2: Resulting SSB/DSB spectrum around +-fc
          var fc = 5.5;
          var narrow1 = boxes[1].w < 460;
          var lbl = side === -1 ? 'USB (减号 −m_h·sin)' : (side === 1 ? 'LSB (加号 +m_h·sin)' : 'DSB-SC (无正交支路)');
          var ax2 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: -9,
            xMax: 9,
            yMin: 0,
            yMax: 1.25,
            xGrid: 6,
            yGrid: 2,
            xTicks: [[-fc, '-fc'], [0, '0'], [fc, '+fc']],
            yTicks: [[0.5, '0.5'], [1, '1']],
            title: narrow1 ? lbl : '合成频谱 Φ(f) — ' + lbl,
            subtitle: side === -1 ? '仅留外侧 USB' : (side === 1 ? '仅留内侧 LSB' : '双边带全留'),
            subtitleColor: side === 0 ? P.amber : P.green
          });

          // Reference DSB dashed outline
          env.viz.drawCurve(ctx, ax2, triSide(-fc, 2.0, 0.5), { from: -fc - 2.1, to: -fc + 2.1, color: P.muted, lineWidth: 1.3, dash: [3, 3] });
          env.viz.drawCurve(ctx, ax2, triSide(fc, 2.0, 0.5), { from: fc - 2.1, to: fc + 2.1, color: P.muted, lineWidth: 1.3, dash: [3, 3] });

          var ssbFn = function (f) {
            var pos = triSide(fc, 2.0, 0.5)(f);
            var neg = triSide(-fc, 2.0, 0.5)(f);
            if (side === 0) return pos + neg;
            if (side === -1) { // USB: |f| > fc
              var keepPos = f >= fc ? pos * 2 : 0;
              var keepNeg = f <= -fc ? neg * 2 : 0;
              return keepPos + keepNeg;
            }
            // LSB: |f| < fc
            var kp = (f >= 0 && f <= fc) ? pos * 2 : 0;
            var kn = (f <= 0 && f >= -fc) ? neg * 2 : 0;
            return kp + kn;
          };
          env.viz.drawCurve(ctx, ax2, ssbFn, { from: -8.5, to: 8.5, samples: 450, color: side === -1 ? P.green : (side === 1 ? P.pink : P.cyan), lineWidth: 2.5, fillAlpha: 0.25 });
        }
      },
      {
        id: 's02',
        tag: '课件例题',
        title: '滤波法 SSB 的工程难题（过渡带与语音空隙）+ 大载波 SSB',
        slideRef: '03AM pp.30–33',
        terms: [
          { en: 'Selective Filtering SSB', zh: '滤波法单边带' },
          { en: 'Butterworth Transition Band', zh: '巴特沃斯过渡带限制' },
          { en: 'SSB + Large Carrier', zh: '插入大载波的非相干 SSB' }
        ],
        symbols: [
          { sym: '|H(\\omega)|^2 = \\frac{1}{1+(\\omega/\\omega_c)^{2n}}', desc: '实际 Butterworth 滤波器过渡带宽度正比于 $f_c$', color: P.amber },
          { sym: '300\\sim 3400\\text{ Hz}', desc: '人类语音低频天然留出 $600\\text{ Hz}$ 保护空隙', color: P.green },
          { sym: '\\sqrt{(A+m)^2 + m_h^2} \\approx A + m(t)', desc: '当 $A \\gg |m|, |m_h|$ 时 SSB 也能包络检波', color: P.cyan }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: '|H(\\omega)|^2 = \\frac{1}{1+(\\omega/\\omega_c)^{2n}} \\implies \\text{高载频 } f_c \\text{ 下无法“一刀垂直切下”}', label: 'p.30–31 滤波法困境：实际带通过渡带宽正比于中心频率 fc' },
          { step: 1, latex: '\\text{救星1：人类语音 } 300\\text{–}3400\\text{ Hz (中心有空隙)}\\quad\\big|\\quad\\text{救星2：先调到低中频 }\\omega_{\\text{IF}}\\text{ 滤波再二次上变频}', label: 'p.32 两步变频法 + 语音直流空隙解决陡峭滤波难题' },
          { step: 2, latex: '\\text{Env}(t) = \\sqrt{(A+m)^2 + m_h^2} = (A+m)\\sqrt{1 + \\Big(\\frac{m_h}{A+m}\\Big)^2} \\xrightarrow{A \\gg |m|,|m_h|} A + m(t)', label: 'p.33 课件推导：单边带只要塞入足够大的载波 A，包络检波照样近似成立' }
        ],
        sliders: [
          { key: 'order', label: 'Butterworth 滤波器阶数 n', min: 2, max: 12, step: 2, default: 4 },
          { key: 'gap', label: '信号低频留空 (0=含0Hz直流, 1=语音300Hz起)', min: 0, max: 1, step: 1, default: 1 }
        ],
        presets: [
          { label: '语音300Hz空隙 + 4阶滤波', values: { order: 4, gap: 1 } },
          { label: '视频含直流 (难切!) + 4阶', values: { order: 4, gap: 0 } },
          { label: '高阶 12阶陡峭滤波', values: { order: 12, gap: 0 } }
        ],
        lines: [
          {
            step: 0,
            sub: '用带通滤波器直接从 DSB 切掉一边带看似直观，但实际电路做不出砖墙垂直边缘！Butterworth 滤波器的过渡带宽度与中心频率成正比，载频动辄几十兆赫兹，根本无法在 $f_c$ 处一刀切而不削伤边带低频！',
            tts: '有人会问，干嘛费劲搞希尔伯特移相，直接把双边带放进带通滤波器切掉一半不就行了？现实却很骨感：帕利维纳判据告诉我们砖墙滤波器不存在，就像巴特沃斯滤波器，它的过渡带宽度和中心载频成正比，载频一高，根本没法在 f c 边界一刀垂直切下去。'
          },
          {
            step: 1,
            sub: '工程上有两大救星：第一，人类电话语音只有 $300\\sim 3400\\text{ Hz}$，上下边带之间天然留着 $600\\text{ Hz}$ 空隙，过渡带正好藏进缝里！第二，用两步法先调制到较低的固定中频 $\\omega_{\\text{IF}}$ 轻松切干净，再二次变频搬到高频！但如果像电视视频有 $0\\text{ Hz}$ 直流，滤波法 SSB 就彻底束手无策，这直接催生了后面的 VSB！',
            tts: '工程上有两大救星：第一，刚好人类语音主要在三百到三千四百赫兹，零赫兹附近本来就是空的，上下边带中间天然隔出六百赫兹缓冲缝隙，滤波器斜坡恰好顺着缝隙滑下去！第二，先把信号调到低中频切出单边带，再二次搬移到高频。但如果换成包含零赫兹直流成分的电视图像信号，这就彻底切不干净了，只能请出残留边带 V S B。'
          },
          {
            step: 2,
            sub: '顺便记住第 33 页小结论：如果往 SSB 里也加上大载波 $A\\cos\\omega_c t$，瞬时包络变成 $\\sqrt{(A+m)^2 + m_h^2}$；只要 $A$ 远大于 $|m|$ 和 $|m_h|$，平方根近似成 $A+m(t)$，用普通包络检波也能凑合听！',
            tts: '顺带记住课件第三十三页的一个小结论：如果在单边带上也加入足够大的直流载波，总包络等于根号下 A 加 m 平方加 m h 平方；只要载波幅度远大于消息和它的希尔伯特变换，根号就可以近似去掉，居然也能用普通包络检波。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var nOrd = Math.round(env.params.order || 4);
          var hasGap = Math.round(env.params.gap !== undefined ? env.params.gap : 1) === 1;
          var fc = 5.0;

          // Panel 1: DSB spectrum around fc + Butterworth highpass edge at fc
          var narrow0 = boxes[0].w < 460;
          var ax1 = env.viz.drawAxes(ctx, boxes[0], {
            xMin: 2.0,
            xMax: 8.5,
            yMin: 0,
            yMax: 1.25,
            xGrid: 5,
            yGrid: 3,
            xTicks: [[3, 'fc-B'], [fc, 'fc'], [7, 'fc+B']],
            yTicks: [[0.5, '-3dB'], [1.0, '1']],
            title: narrow0 ? 'Butterworth ' + nOrd + '阶选边带' : '滤波法切出 USB：' + (hasGap ? '语音300Hz空隙留出过渡带' : '0Hz无空隙→低频严重削波!')
          });
          var voiceEnv = function (f) {
            var d = Math.abs(f - fc);
            var low = hasGap ? 0.35 : 0.0;
            if (d < low || d > 2.2) return 0;
            return Math.sin((Math.PI * (d - low)) / (2.2 - low));
          };
          var hpButt = function (f) {
            if (f <= 0.1) return 0;
            // High-pass Butterworth centered with cutoff slightly above fc to reject LSB
            var cut = fc + 0.15;
            return 1 / Math.sqrt(1 + Math.pow(cut / f, 2 * nOrd));
          };
          env.viz.drawCurve(ctx, ax1, voiceEnv, { from: 2.6, to: 7.4, samples: 320, color: P.muted, lineWidth: 1.6, dash: [4, 3] });
          env.viz.drawCurve(ctx, ax1, hpButt, { from: 2.2, to: 8.2, samples: 260, color: P.amber, lineWidth: 2.2 });
          env.viz.drawCurve(ctx, ax1, function (f) { return voiceEnv(f) * hpButt(f); }, {
            from: 2.6, to: 7.4, samples: 320, color: P.green, lineWidth: 2.4, fillAlpha: 0.24
          });
          env.viz.drawAnnotation(ctx, ax1, 6.2, 1.04, 'USB保留', P.green, 'center');
          env.viz.drawAnnotation(ctx, ax1, 3.8, 0.35, hasGap ? '保护缝隙' : 'LSB泄漏!', hasGap ? P.cyan : P.red, 'center');

          // Panel 2: Large-carrier SSB envelope sqrt((A+m)^2 + mh^2) vs A+m
          var narrow1 = boxes[1].w < 460;
          var ax2 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: 0,
            xMax: 1.0,
            yMin: 1.8,
            yMax: 4.5,
            xGrid: 4,
            yGrid: 3,
            xTicks: [[0, '0'], [0.5, '0.5'], [1, '1.0s']],
            yTicks: [[2, '2'], [3, 'A=3'], [4, '4']],
            title: narrow1 ? '大载波 SSB 包络近似' : 'p.33 大载波 SSB：真实包络 √((A+m)²+mh²) 紧贴 A+m'
          });
          var A = 3.0;
          var mT = function (t) { return 0.7 * Math.cos(2 * Math.PI * 2 * t) + 0.3 * Math.cos(2 * Math.PI * 4 * t); };
          var mhT = function (t) { return 0.7 * Math.sin(2 * Math.PI * 2 * t) + 0.3 * Math.sin(2 * Math.PI * 4 * t); };
          env.viz.drawCurve(ctx, ax2, function (t) { return A + mT(t); }, { samples: 240, color: P.cyan, lineWidth: 2.0, dash: [5, 3] });
          env.viz.drawCurve(ctx, ax2, function (t) {
            var am = A + mT(t);
            var h = mhT(t);
            return Math.sqrt(am * am + h * h);
          }, { samples: 240, color: P.pink, lineWidth: 2.3 });
        }
      },
      {
        id: 's03',
        tag: '作业精讲',
        hwCode: '4.4-6',
        title: 'HW1 作业 4.4-6：相干解调 Δω 频移“唐老鸭效应” vs δ 相差',
        slideRef: '03AM p.45 · HW 4.4-6',
        terms: [
          { en: 'Frequency Offset (Δω)', zh: '本地载频偏移 Δf' },
          { en: 'Donald Duck Effect', zh: '唐老鸭音效（谐波比破坏）' },
          { en: 'Phase Distortion (δ)', zh: '恒定相差 δ 相位失真' }
        ],
        symbols: [
          { sym: 'y = m\\cos(\\Delta\\omega t + \\delta) - m_h\\sin(\\Delta\\omega t + \\delta)', desc: 'LSB 接收乘 $2\\cos[(\\omega_c+\\Delta\\omega)t+\\delta]$ 并低通', color: P.amber },
          { sym: 'f_k \\mapsto f_k + \\Delta f', desc: '所有正频分量整体加减 $\\Delta f$，泛音整数倍关系被毁', color: P.red },
          { sym: 'Y(f) = M(f)e^{j\\delta\\operatorname{sgn}(f)}', desc: '$\\Delta\\omega=0$ 时各频率同移常相 $\\delta$（非时延！）', color: P.cyan }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: 'y(t) = \\varphi_{\\text{LSB}}(t)\\cdot 2\\cos[(\\omega_c+\\Delta\\omega)t+\\delta]\\xrightarrow{\\text{LPF}} m(t)\\cos(\\Delta\\omega t+\\delta) - m_h(t)\\sin(\\Delta\\omega t+\\delta)', label: '总公式：与 DSB-SC 乘法只剩 cos(Δωt+δ) 完全不同，SSB 多出正交 mh 项!' },
          { step: 1, latex: '\\text{(a) }\\delta=0:\\; Y(f)=\\begin{cases}M(f-\\Delta f), & f>\\Delta f\\\\ M(f+\\Delta f), & f<-\\Delta f\\end{cases} \\;\\Big(300,600\\text{ Hz} \\to 300+\\Delta f,\\,600+\\Delta f\\Big)', label: '频移 Δω 破坏谐波 1:2:3 整数倍比例，人声变成金属唐老鸭声' },
          { step: 2, latex: '\\text{(b) }\\Delta\\omega=0:\\; Y(f)=\\begin{cases}M(f)e^{j\\delta}, & f\\ge 0\\\\ M(f)e^{-j\\delta}, & f<0\\end{cases} \\;(\\text{常相移非线性相位，听觉不敏感但图像波形畸变})', label: '纯相差 δ：对声音影响小，但方波/图像数据严重畸变' }
        ],
        sliders: [
          { key: 'df', label: '本振频偏 Δf (Hz)', min: -120, max: 240, step: 10, default: 90 },
          { key: 'deltaDeg', label: '本振相差 δ (°)', min: -180, max: 180, step: 15, default: 0 }
        ],
        presets: [
          { label: '唐老鸭频偏 (Δf=+90Hz, δ=0°)', values: { df: 90, deltaDeg: 0 } },
          { label: '纯相差波形畸变 (Δf=0Hz, δ=90°)', values: { df: 0, deltaDeg: 90 } },
          { label: '完美同步恢复 (Δf=0, δ=0°)', values: { df: 0, deltaDeg: 0 } }
        ],
        lines: [
          {
            step: 0,
            sub: '作业 4.4-6 是 SSB 解调必考压轴题！把接收到的 $\\varphi_{\\text{LSB}} = m\\cos\\omega_c t + m_h\\sin\\omega_c t$ 乘上存在误差的本地载波 $2\\cos[(\\omega_c+\\Delta\\omega)t+\\delta]$ 并低通，得到 $y(t) = m\\cos(\\Delta\\omega t+\\delta) - m_h\\sin(\\Delta\\omega t+\\delta)$。',
            tts: '来看作业四点四杠六，这是单边带解调同步误差的压轴大题。把收到的下边带信号乘上带着频偏德尔塔欧米伽和相差德尔塔的本地载波，经过低通滤掉二倍载频后，得到 m 余弦减去 m h 正弦的组合结果。它可不像双边带那样只是整体乘个余弦，而是把整条正交希尔伯特支路卷了进来！'
          },
          {
            step: 1,
            sub: '先看 (a) $\\delta=0$ 只有频偏 $\\Delta f$：这正是一个载频在 $\\Delta f$ 的 USB 信号！它把所有正频谱分量集体平移 $\\Delta f$！原本和谐的 $300\\text{ Hz}$ 基音与 $600\\text{ Hz}$ 二次谐波（$1:2$ 完美泛音）如果平移 $+90\\text{ Hz}$，立刻变成 $390$ 与 $690\\text{ Hz}$，再也不是整数倍关系——听起来就像唐老鸭或外星机器人！',
            tts: '先看第一问相差为零、只有频率偏差的情况：结果恰好是把消息信号搬到了德尔塔 f 上变成上边带！也就是说所有频率成分集体平移了相同的德尔塔 f。设想一下三百赫兹的基音和六百赫兹的泛音原本是一比二完美和谐的倍数，向右平移九十赫兹后变成三百九和六百九，谐波关系被彻底撕裂，人声听起来就像滑稽的唐老鸭！'
          },
          {
            step: 2,
            sub: '再看 (b) $\\Delta\\omega=0$ 只有相差 $\\delta$：频域相当于把正频率全乘 $e^{j\\delta}$、负频率全乘 $e^{-j\\delta}$。注意这不是线性相位 $-2\\pi f t_d$（不对应时移），而是相位失真！点按“纯相差 90°”预设看看波形：人耳对常相位差不太敏感，语音还能听清，但传输方波数据或传真图像时波形会严重塌陷畸变！',
            tts: '再看第二问频偏为零、只有常相位差德尔塔的情况：相当于正频率全部乘以 e 的 j 德尔塔次方，负频率共轭乘负德尔塔。记住它不是线性相位，不能等价成时间延迟，属于相位失真。点一下纯相差九十度预设看看波形：人耳对这种恒定相移几乎没感觉，讲话依然听得清，可如果传的是脉冲或图像波形，就会被扭曲得面目全非！'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var df = env.params.df !== undefined ? env.params.df : 90;
          var deg = env.params.deltaDeg !== undefined ? env.params.deltaDeg : 0;
          var deltaRad = (deg * Math.PI) / 180;
          var harmonics = [{ amp: 1.0, freq: 300 }, { amp: 0.5, freq: 600 }];

          // Panel 1: Time-domain original vs LSB demodulated using COMM_MATH.hilbertToneSum
          var narrow0 = boxes[0].w < 460;
          var ax1 = env.viz.drawAxes(ctx, boxes[0], {
            xMin: 0,
            xMax: 0.012,
            yMin: -1.75,
            yMax: 1.75,
            xGrid: 4,
            yGrid: 4,
            xTicks: [[0, '0'], [0.006, '6ms'], [0.012, '12ms']],
            yTicks: [[-1.5, '-1.5'], [0, '0'], [1.5, '+1.5']],
            title: narrow0 ? '波形畸变 (Δf=' + df + ', δ=' + deg + '°)' : '实时波形：蓝虚=原语音(300+600Hz)，橙实=SSB 解调输出'
          });
          env.viz.drawCurve(ctx, ax1, function (t) {
            return env.math.hilbertToneSum(harmonics, t, 0, 0).m;
          }, { samples: 280, color: P.cyan, lineWidth: 2.0, dash: [5, 3] });
          env.viz.drawCurve(ctx, ax1, function (t) {
            return env.math.hilbertToneSum(harmonics, t, df, deltaRad).lsbDemod;
          }, { samples: 340, color: (df === 0 && deg === 0) ? P.green : P.amber, lineWidth: 2.2 });

          // Panel 2: Frequency-domain harmonic shift (300, 600 -> 300+df, 600+df)
          var narrow1 = boxes[1].w < 460;
          var f1 = Math.abs(300 + df);
          var f2 = Math.abs(600 + df);
          var ratioStr = (f1 > 10) ? (f2 / f1).toFixed(2) : '∞';
          var ax2 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: 0,
            xMax: 950,
            yMin: 0,
            yMax: 1.3,
            xGrid: 5,
            yGrid: 3,
            xTicks: [[300, '300'], [600, '600'], [900, '900Hz']],
            yTicks: [[0.5, '0.5'], [1, '1.0']],
            title: narrow1 ? '泛音搬移 (比值=' + ratioStr + ')' : '谐波频谱：原300/600Hz(1:2) → 解调后 ' + Math.round(300 + df) + '/' + Math.round(600 + df) + 'Hz',
            subtitle: df === 0 ? '泛音比 2.00 ✓' : '泛音比 ' + ratioStr + ' 走音!',
            subtitleColor: df === 0 ? P.green : P.red
          });
          env.viz.drawStems(ctx, ax2, [
            { x: 300, y: 1.0, color: 'rgba(56, 189, 248, 0.45)', width: 3, label: '原300' },
            { x: 600, y: 0.5, color: 'rgba(56, 189, 248, 0.45)', width: 3, label: '原600' },
            { x: f1, y: 1.0, color: df === 0 ? P.green : P.red, width: 3.5, arrow: true, label: Math.round(300 + df) + 'Hz' },
            { x: f2, y: 0.5, color: df === 0 ? P.green : P.amber, width: 3.5, arrow: true, label: Math.round(600 + df) + 'Hz' }
          ], {});
        }
      },
      {
        id: 's04',
        tag: '推导',
        title: 'VSB 残留边带滤波原理、互补条件与 p.38 勘误',
        slideRef: '03AM pp.35–38',
        terms: [
          { en: 'VSB (Vestigial Sideband)', zh: '残留边带调制' },
          { en: 'Complementary Symmetry', zh: '互补奇对称滤波条件' }
        ],
        symbols: [
          { sym: 'H_i(\\omega)', desc: '发端边带成形滤波器（平缓过渡过 $\\omega_c$）', color: P.cyan },
          { sym: 'H_i(\\omega+\\omega_c)+H_i(\\omega-\\omega_c)=1', desc: '在 $|\\omega| < 2\\pi B$ 内互补叠加为平坦常数 $1$', color: P.green },
          { sym: 'B_T = B + f_v', desc: '仅比 SSB 多留极窄一条残留边带 $f_v$', color: P.amber }
        ],
        errata: '⚠️ 课件勘误（03AM p.38）：互补条件后写着 “If $H_i(\\omega-\\omega_c)+H_i(\\omega+\\omega_c)=1$ for $|\\omega_c| < 2\\pi B$”，此处下标 $c$ 是印刷笔误！载波 $\\omega_c$ 是固定高频，条件必须在基带频率范围 $|\\omega| < 2\\pi B$（即 $|f| < B$）内成立。',
        formulas: [
          { step: 0, latex: '\\Phi_{\\text{VSB}}(\\omega) = \\frac{1}{2}\\big[M(\\omega-\\omega_c)+M(\\omega+\\omega_c)\\big]H_i(\\omega),\\qquad B_T = B + f_v', label: '折中智慧：保留主边带全频，故意多留一小条残留边带 fv 换平滑斜坡' },
          { step: 1, latex: 'H_o(\\omega)\\big[H_i(\\omega+\\omega_c)+H_i(\\omega-\\omega_c)\\big] = 1,\\quad |\\omega| < 2\\pi B', label: '解调无失真总条件（乘 2cosωct 低通后搬回基带叠加）' },
          { step: 2, latex: '\\text{若 } H_i(\\omega+\\omega_c)+H_i(\\omega-\\omega_c)=1\\;(|\\omega|<2\\pi B) \\implies H_o(\\omega)=1\\;(\\text{仅需普通低通!})', label: '理想互补对称：发端绕 (fc, 0.5) 奇对称滚降，收端无需均衡器' }
        ],
        sliders: [
          { key: 'fv', label: '残留边带宽度 f_v (kHz，主边带 B=4kHz)', min: 0.4, max: 2.0, step: 0.2, default: 1.0 }
        ],
        presets: [
          { label: '窄残留 (fv=0.8kHz)', values: { fv: 0.8 } },
          { label: '标准电视比例 (fv=1.2kHz)', values: { fv: 1.2 } }
        ],
        lines: [
          {
            step: 0,
            sub: '既然电视视频信号直流附近内容极其丰富、SSB 滤波切不动，工程师就干脆退一步发明了残留边带 VSB：主边带全部保留，而在另一边故意放一小条宽度 $f_v$ 的尾巴（残留边带），让滤波器在 $f_c$ 处从容地斜坡滚降过去！',
            tts: '面对既有零赫兹直流成分、又想省带宽的电视图像信号，工程上诞生了绝妙折中，叫残留边带调制 V S B。它不再强求在载频处一刀垂直切死，而是放行主边带后，故意多留一小段宽度为 f v 的残留边带尾巴，让滤波器可以斜着平缓降落。'
          },
          {
            step: 1,
            sub: '为什么歪斜砍过的频谱解调后还能严丝合缝无失真？因为相干解调乘 $2\\cos\\omega_c t$ 时，左边的 $H_i(f-f_c)$ 与右边的 $H_i(f+f_c)$ 会向中间搬移并重叠相加！只要在 $|f| < B$ 内两者相加之和恒等于 $1$（也就是滤波器边沿关于点 $(f_c, 0.5)$ 中心奇对称），缺的那一块恰好被另一边多留的尾巴精准补齐！',
            tts: '为什么被斜坡砍缺一块的信号解调出来居然完全不失真？秘密就在相干解调把正负两片频谱重新推回零赫兹时，左侧上移和右侧下移刚好在原点附近重叠相加！只要发端成形滤波器在载频中心零点五处呈中心对称，少掉的那一角恰好被对面多留的尾巴补满，总和严丝合缝等于常数一！'
          },
          {
            step: 2,
            sub: '同时揪出课件 03AM 第 38 页的勘误：那行条件印成了 “for $|\\omega_c| < 2\\pi B$”，多印了个下标 $c$！载波 $\\omega_c$ 高高在上，显然要求的是基带自变量 $|\\omega| < 2\\pi B$！如果 $H_i$ 没做到完美互补相加为 $1$，接收端再补一个均衡滤波器 $H_o(f)$ 就好——这正是下一幕作业 4.5-2 的考法！',
            tts: '顺便揪出课件第三十八页的小笔误：互补公式后面的定义域被印成了绝对值欧米伽 c 小于二派 B，多印了一个下标 c。载波是固定高频，条件必须对基带自变量欧米伽成立。如果发端滤波器没做到完美对称互补，接收机后面就得再串一个均衡滤波器，这正是下一幕作业四点五杠二要算的！'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var fv = env.params.fv || 1.0;
          var fc = 6.0;
          var B = 4.0;
          var hiPos = function (f) {
            if (f < fc - fv || f > fc + B) return 0;
            if (f <= fc + fv) return 0.5 + (f - fc) / (2 * fv);
            return 1.0;
          };
          var hiSym = function (f) { return hiPos(Math.abs(f)); };

          var narrow0 = boxes[0].w < 460;
          var ax1 = env.viz.drawAxes(ctx, boxes[0], {
            xMin: 2.0,
            xMax: 11.0,
            yMin: 0,
            yMax: 1.28,
            xGrid: 5,
            yGrid: 3,
            xTicks: [[fc - fv, 'fc-fv'], [fc, 'fc'], [fc + fv, 'fc+fv'], [fc + B, 'fc+B']],
            yTicks: [[0.5, '0.5'], [1, '1']],
            title: narrow0 ? '发端成形 Hi(f) (B_T=' + (B + fv).toFixed(1) + 'k)' : '发端 VSB 滤波器 Hi(f)：绕 (fc, 0.5) 奇对称斜坡滚降'
          });
          env.viz.drawShadedBand(ctx, ax1, fc - fv, fc, 'rgba(251, 191, 36, 0.16)', '残留 fv');
          env.viz.drawCurve(ctx, ax1, hiPos, { from: 2.5, to: 10.5, samples: 300, color: P.cyan, lineWidth: 2.4, fillAlpha: 0.18 });
          env.viz.drawStems(ctx, ax1, [{ x: fc, y: 0.5, color: P.amber, width: 2, label: '(fc, 0.5)' }], {});

          var narrow1 = boxes[1].w < 460;
          var ax2 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: -4.6,
            xMax: 4.6,
            yMin: 0,
            yMax: 1.32,
            xGrid: 4,
            yGrid: 3,
            xTicks: [[-4, '-B'], [-fv, '-fv'], [0, '0'], [fv, '+fv'], [4, '+B']],
            yTicks: [[0.5, '0.5'], [1, '1.0']],
            title: narrow1 ? '解调叠加 Hi(f+fc)+Hi(f-fc)=1' : '解调搬回基带叠加：两半在 |f|<B 内精准相加成平坦常数 1'
          });
          env.viz.drawCurve(ctx, ax2, function (f) { return hiSym(f + fc); }, { from: -4.2, to: 4.2, samples: 260, color: P.amber, lineWidth: 1.8, dash: [4, 3] });
          env.viz.drawCurve(ctx, ax2, function (f) { return hiSym(f - fc); }, { from: -4.2, to: 4.2, samples: 260, color: P.pink, lineWidth: 1.8, dash: [4, 3] });
          env.viz.drawCurve(ctx, ax2, function (f) { return hiSym(f + fc) + hiSym(f - fc); }, { from: -4.0, to: 4.0, samples: 260, color: P.green, lineWidth: 2.6, fillAlpha: 0.15 });
          env.viz.drawAnnotation(ctx, ax2, 0, 1.05, '完美互补=1.0 (|f|<B)', P.green, 'center');
        }
      },
      {
        id: 's05',
        tag: '作业精讲',
        hwCode: '4.5-2',
        title: 'HW1 作业 4.5-2：VSB 传输带宽与非理想互补均衡器 Ho(f)',
        slideRef: '03AM p.45 · HW 4.5-2',
        terms: [
          { en: 'VSB Equalizer Ho(f)', zh: '接收端互补均衡滤波器' },
          { en: 'Transmission Bandwidth', zh: '残留边带传输带宽' }
        ],
        symbols: [
          { sym: 'f_c = 1500\\text{ kHz},\\; B = 4\\text{ kHz}', desc: '下边带 $1496\\text{–}1500\\text{ kHz}$ 全保留，上边带留 $1500\\text{–}1501\\text{ kHz}$', color: P.cyan },
          { sym: 'B_T = 4 + 1 = 5\\text{ kHz}', desc: '传输总带宽（占用 $1.496\\sim 1.501\\text{ MHz}$）', color: P.amber },
          { sym: 'H_o(f) = \\frac{1}{1-|f|/2}\\;(|f|<1\\text{k}),\\;1\\;(1\\le |f|\\le 4\\text{k})', desc: '分段均衡器（在 $|f|=1\\text{ kHz}$ 处由 $2$ 跳变回 $1$）', color: P.green }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: '\\text{(a) }\\varphi(t)\\cdot 4\\cos\\omega_c t \\xrightarrow{H_o(f)} M(f)\\big[H_i(f+f_c)+H_i(f-f_c)\\big]H_o(f),\\quad \\text{(b) } B_T = 4+1 = 5\\text{ kHz}', label: '(a)(b) 同步乘 4cosωct + 均衡低通 Ho(f)；传输占用 1496~1501 kHz 共 5 kHz' },
          { step: 1, latex: '0\\le |f|<1\\text{ kHz}:\\; H_i(f_c+|f|)=0.5(1-|f|),\\; H_i(f_c-|f|)=0.5 \\implies \\text{和}=1-\\frac{|f|}{2}', label: '内段重叠区：注意 1499~1500 kHz 是平顶 0.5，不是斜坡!' },
          { step: 2, latex: 'H_o(f) = \\begin{cases} \\dfrac{1}{1-|f|/2}, & |f|<1\\text{ kHz}\\\\[4pt] 1, & 1\\le|f|\\le 4\\text{ kHz} \\end{cases} \\quad\\Big(|f|\\to 1^- \\text{ 时升到 }2\\text{，过 }1\\text{ 跳回 }1\\Big)', label: '(c) 精确求得接收端分段均衡器 Ho(f)' }
        ],
        sliders: [
          { key: 'probeF', label: '探测基带频率 |f| (kHz)', min: 0, max: 4.0, step: 0.2, default: 0.6 }
        ],
        presets: [
          { label: '内段平顶缺陷区 (f=0.6 kHz)', values: { probeF: 0.6 } },
          { label: '跳变临界前 (f=0.9 kHz)', values: { probeF: 0.9 } },
          { label: '外段全通区 (f=2.5 kHz)', values: { probeF: 2.5 } }
        ],
        lines: [
          {
            step: 0,
            sub: '压轴大题作业 4.5-2！载频 $f_c = 1500\\text{ kHz}$、基带 $B=4\\text{ kHz}$，发端成形器 $H_i(f)$ 在 $1496\\sim 1499\\text{ kHz}$ 为 $1$，在 $1499\\sim 1500\\text{ kHz}$ 却是个 $0.5$ 小平台，接着 $1500\\to 1501\\text{ kHz}$ 线性降到 $0$。信号占 $1496\\sim 1501\\text{ kHz}$，所以传输带宽 $B_T = 4 + 1 = 5\\text{ kHz}$！',
            tts: '来看第三章最后一道作业大题，四点五杠二。载频一千五百千赫兹，基带带宽四千赫兹。发端滤波器保留了一四九六到一五零零千赫兹的下边带，加上一五零零到一五零一千赫兹的一段残留尾巴，所以总传输带宽等于四加一，也就是五千赫兹。接收机采用相干解调，再接一个均衡低通滤波器 H o f。'
          },
          {
            step: 1,
            sub: '关键陷阱看图左：在 $1499\\sim 1500\\text{ kHz}$ 这一段 $H_i$ 竟然横着走了个 $0.5$ 平顶，并不对称！于是当 $|f|<1\\text{ kHz}$ 时，左边取 $H_i(1500-|f|)=0.5$，右边取 $H_i(1500+|f|)=0.5(1-|f|)$，相加等于 $1 - \\frac{|f|}{2}$，越往 $|f|=1$ 走越往下塌陷！',
            tts: '题目最狡猾的设计在于一四九九到一五零零千赫兹这一小段，发端滤波器居然走了一条水平零点五的台阶，没有做到中心对称！这就导致基带 f 在零到一千赫兹之间时，左半边固定是零点五，右半边斜着往下掉到零，两边加起来等于一减去二分之 f，越靠近一千赫兹幅度塌得越低！'
          },
          {
            step: 2,
            sub: '怎么补救？均衡器取倒数 $H_o(f) = \\frac{1}{1-|f|/2}$（$|f|<1\\text{ kHz}$），一路抬升到 $|f|\\to 1^-$ 处等于 $2$！而一旦跨过 $1\\text{ kHz}$（$1\\le |f|\\le 4\\text{ kHz}$），下边带已经是完整的 $1$ 且上边带为 $0$，所以 $H_o(f)$ 突然跌落跳变回 $1$！拖动滑块在 $f=0.6$ 与 $2.5\\text{ kHz}$ 对比看这记绝妙跳变！',
            tts: '所以接收端均衡器 H o 必须对它取倒数，等于一除以括号一减二分之绝对值 f，从一一路爬升到一千赫兹左极限处的二！可一旦频率超过一千赫兹，来到一到四千赫兹外段，下边带原本就是饱满的一、上边带为零，加起来已经等于一了，所以均衡器 H o 会瞬间跳变回一，直到四千赫兹截止。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var pf = env.params.probeF !== undefined ? env.params.probeF : 0.6;
          // Hi around 1500 kHz (x in kHz offset around 1500, i.e. df = f - 1500 in [-5.5, 1.5])
          var hiOff = function (df) {
            if (df < -5 || df > 1) return 0;
            if (df < -4) return df + 5;      // 1495 -> 1496: 0 -> 1
            if (df < -1) return 1.0;         // 1496 -> 1499: 1
            if (df <= 0) return 0.5;         // 1499 -> 1500: 0.5 flat!
            return 0.5 * (1 - df);           // 1500 -> 1501: 0.5 -> 0
          };
          var sumVal = hiOff(-pf) + hiOff(pf);
          var hoVal = function (f) {
            var af = Math.abs(f);
            if (af > 4) return 0;
            return af < 1 ? 1 / (1 - af / 2) : 1;
          };

          // Panel 1: Transmitter Hi(f) around 1500 kHz + probe lines
          var narrow0 = boxes[0].w < 460;
          var ax1 = env.viz.drawAxes(ctx, boxes[0], {
            xMin: -5.4,
            xMax: 1.8,
            yMin: 0,
            yMax: 1.28,
            xGrid: 7,
            yGrid: 2,
            xTicks: [[-5, '1495'], [-4, '1496'], [-1, '1499'], [0, '1500'], [1, '1501k']],
            yTicks: [[0.5, '0.5'], [1.0, '1']],
            title: narrow0 ? 'Hi(f) (B_T=5kHz)' : '发端 Hi(f)：1496–1501 kHz 占 B_T=5 kHz（1499–1500 平顶 0.5!）'
          });
          env.viz.drawShadedBand(ctx, ax1, -4, 1, 'rgba(56, 189, 248, 0.12)', 'BT=5kHz');
          env.viz.drawCurve(ctx, ax1, hiOff, { from: -5.2, to: 1.3, samples: 350, color: P.cyan, lineWidth: 2.5, fillAlpha: 0.18 });
          env.viz.drawStems(ctx, ax1, [
            { x: -pf, y: hiOff(-pf), color: P.amber, width: 2.4, label: 'fc-' + pf.toFixed(1) },
            { x: pf, y: hiOff(pf), color: P.pink, width: 2.4, label: 'fc+' + pf.toFixed(1) }
          ], {});

          // Panel 2: Receiver Equalizer Ho(f)
          var narrow1 = boxes[1].w < 460;
          var ax2 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: -4.6,
            xMax: 4.6,
            yMin: 0,
            yMax: 2.35,
            xGrid: 4,
            yGrid: 4,
            xTicks: [[-4, '-4'], [-1, '-1'], [0, '0'], [1, '+1'], [4, '+4k']],
            yTicks: [[1, '1'], [2, '2']],
            title: narrow1 ? '均衡 Ho(f) (f=' + pf.toFixed(1) + 'k)' : '均衡器 Ho(f)：|f|<1 时爬升至 2，过 ±1 kHz 骤跳回 1',
            subtitle: '和=' + sumVal.toFixed(2) + ' → Ho=' + hoVal(pf).toFixed(2),
            subtitleColor: P.green
          });
          env.viz.drawCurve(ctx, ax2, hoVal, { from: -4, to: -1.005, samples: 80, color: P.green, lineWidth: 2.5 });
          env.viz.drawCurve(ctx, ax2, hoVal, { from: -0.995, to: 0.995, samples: 160, color: P.green, lineWidth: 2.5, fillAlpha: 0.16 });
          env.viz.drawCurve(ctx, ax2, hoVal, { from: 1.005, to: 4, samples: 80, color: P.green, lineWidth: 2.5 });
          env.viz.drawStems(ctx, ax2, [
            { x: pf, y: hoVal(pf), color: P.amber, width: 3, label: hoVal(pf).toFixed(2) }
          ], {});
        }
      },
      {
        id: 's06',
        tag: '推导',
        title: '收发载波同步：平方倍频法、PLL 锁相环与 Costas 环',
        slideRef: '03AM pp.40–43',
        terms: [
          { en: 'Carrier Synchronization', zh: '本地载波同步' },
          { en: 'Phase-Locked Loop (PLL)', zh: '锁相环' },
          { en: 'Costas Loop', zh: '科斯塔斯环（同相正交环）' }
        ],
        symbols: [
          { sym: 's^2(t) = \\tfrac{1}{2}m^2(t) + \\tfrac{1}{2}m^2(t)\\cos 2\\omega_c t', desc: '平方倍频提取 $2\\omega_c$ 后二分频（含 $180^\\circ$ 相位模糊）', color: P.amber },
          { sym: '\\lim_{t\\to\\infty}\\theta_e(t) = \\frac{\\Delta\\omega}{AK}', desc: 'PLL 能跟踪频偏 $\\Delta\\omega$ 并锁定至小常数误差', color: P.cyan },
          { sym: 'I\\cdot Q \\propto -m^2(t)\\sin 2\\theta', desc: 'Costas 环利用 $m^2(t)\\ge 0$ 彻底消除调制符号反相影响', color: P.green }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: '\\text{平方环：}\\big[m(t)\\cos\\omega_c t\\big]^2 = \\frac{1}{2}m^2(t) + \\frac{1}{2}m^2(t)\\cos 2\\omega_c t \\xrightarrow{\\text{BPF}(2\\omega_c) + \\div 2} \\pm\\cos\\omega_c t', label: '虽然 m(t) 无直流使 ±ωc 空白，但 m²(t)≥0 在 2ωc 处产生强烈离散谱线（但有 180° 模糊）' },
          { step: 1, latex: '\\theta_i(t)=\\Delta\\omega\\,t+\\phi_0,\\;H(s)=1 \\implies \\theta_e(t) = \\Big(\\phi_0 - \\frac{\\Delta\\omega}{AK}\\Big)e^{-AKt} + \\frac{\\Delta\\omega}{AK}', label: 'p.42 PLL 一阶环解析解：自动消去频偏，稳态仅留小常相差 Δω/(AK)' },
          { step: 2, latex: 'I = \\frac{1}{2}m\\cos\\theta,\\quad Q = -\\frac{1}{2}m\\sin\\theta \\implies I\\cdot Q = -\\frac{1}{8}m^2(t)\\sin 2\\theta \\xrightarrow{\\text{VCO反馈}} \\theta \\to 0', label: 'p.43 Costas 环：I 臂直接输出解调信号，I×Q 消除 m(t) 正负跳变直接驱动锁相' }
        ],
        sliders: [
          { key: 'dfNorm', label: '频率初差比 Δω / (AK)', min: 0, max: 0.5, step: 0.05, default: 0.15 },
          { key: 'phi0', label: '初始相位差 φ₀ (°)', min: 15, max: 90, step: 15, default: 60 }
        ],
        presets: [
          { label: '纯相差快速归零 (Δω=0)', values: { dfNorm: 0, phi0: 60 } },
          { label: '含频偏锁定小常差 (Δω/AK=0.2)', values: { dfNorm: 0.2, phi0: 75 } }
        ],
        lines: [
          {
            step: 0,
            sub: '除了带大载波的 AM，DSB-SC、QAM、SSB、VSB 全都需要收端精准恢复载波 $\\cos\\omega_c t$！发端不单独发载波时怎么办？先想到的叫平方环：虽然 $m(t)$ 均值为零，但平方后 $m^2(t)$ 永远非负，于是 $s^2(t)$ 必定在 $2\\omega_c$ 处冒出强烈的纯载波线谱！窄带滤波后二分频即可，缺点是二分频可能锁反 $180^\\circ$。',
            tts: '除了带大载波的标准调幅外，双边带、正交调幅、单边带和残留边带通通需要接收端生成同频同相的本地载波。如果发射端不传载波，接收机从哪把它变出来？第一种聪明办法是把收到的信号自己平方：虽然消息信号正负平均为零，可它的平方永远大于等于零，从而在二倍载频处长出一根极其明亮的纯载波尖峰！用窄带滤波器摘出来再二分频就能用，唯一毛病是二分频有二分之一概率锁定在反相一百八十度。'
          },
          {
            step: 1,
            sub: '提取和跟踪载波的核心引擎是锁相环 PLL：鉴相器比出相差，经环路滤波控制压控振荡器 VCO 的瞬时频率 $\\omega_c + c e_o(t)$！看课件第 42 页公式：即使收到信号存在多普勒频偏 $\\Delta\\omega$，只要环路增益 $AK$ 足够大，相位误差 $\\theta_e(t)$ 也会指数收敛并死死稳在极小常数 $\\frac{\\Delta\\omega}{AK}$ 上！',
            tts: '跟踪和锁住频率的核心引擎就是大名鼎鼎的锁相环 P L L。它由鉴相器、环路滤波器和压控振荡器组成闭环。看课件第四十二页推导出的一阶闭环方程：即使收到的电波因为多普勒效应带着固定频偏德尔塔欧米伽，相位误差也会按指数规律飞快衰减，最终稳稳锁定在一个极小的常数误差上，真正实现死锁同步！'
          },
          {
            step: 2,
            sub: '最后来看最优雅的科斯塔斯环 Costas Loop：直接用正交的同相 I 臂和 Q 臂分别乘 $\\cos$ 和 $\\sin$ 并低通，得到 $\\frac{1}{2}m\\cos\\theta$ 和 $-\\frac{1}{2}m\\sin\\theta$。上下两臂再一相乘，正好凑出 $-\\frac{1}{8}m^2(t)\\sin 2\\theta$——消息的过零符号反转被 $m^2$ 完美抹掉，直接送给 VCO 把 $\\theta$ 拽回零，同时 I 臂直接吐出解调后的 $m(t)$！第 3 章全章到此圆满通关！',
            tts: '最后压轴登场的是不需要平方倍频的科斯塔斯环，也是现代通信接收机最经典的载波恢复架构。它同时用余弦 I 臂和正弦 Q 臂解调再低通，一路出余弦德尔塔，一路出正弦德尔塔，然后把上下两路直接相乘。奇妙的事情发生了：消息信号正负翻转的符号被 m 平方彻底抹平，留下纯粹反映相位误差的正弦二倍德尔塔送去驱动压控振荡器，锁定后 I 臂直接吐出干净的消息信号！第三章幅度调制至此全部圆满通关！'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var dfN = env.params.dfNorm !== undefined ? env.params.dfNorm : 0.15;
          var phi0 = ((env.params.phi0 || 60) * Math.PI) / 180;

          // Panel 1: Costas Loop block diagram with orthogonal feedback
          var nodes = [
            { id: 'in', nx: 0.09, ny: 0.50, nw: 0.13, nh: 0.24, label: 's(t)', color: P.amber },
            { id: 'mi', nx: 0.28, ny: 0.24, nw: 0.11, nh: 0.20, kind: 'mul', label: '×', color: P.cyan },
            { id: 'mq', nx: 0.28, ny: 0.76, nw: 0.11, nh: 0.20, kind: 'mul', label: '×', color: P.pink },
            { id: 'lpfI', nx: 0.50, ny: 0.24, nw: 0.18, nh: 0.24, label: 'LPF (I臂)\nm·cosθ', color: P.green },
            { id: 'lpfQ', nx: 0.50, ny: 0.76, nw: 0.18, nh: 0.24, label: 'LPF (Q臂)\n-m·sinθ', color: P.pink },
            { id: 'prod', nx: 0.73, ny: 0.50, nw: 0.12, nh: 0.22, kind: 'mul', label: 'I×Q', color: P.amber },
            { id: 'vco', nx: 0.91, ny: 0.50, nw: 0.14, nh: 0.28, label: '环路滤波\n+ VCO', color: P.cyan }
          ];
          var edges = [
            { from: 'in', to: 'mi' },
            { from: 'in', to: 'mq' },
            { from: 'mi', to: 'lpfI' },
            { from: 'mq', to: 'lpfQ' },
            { from: 'lpfI', to: 'prod', label: '出 m(t)' },
            { from: 'lpfQ', to: 'prod' },
            { from: 'prod', to: 'vco', color: P.amber, label: '∝m²sin2θ' },
            { from: 'vco', to: 'mi', midY: 0.07, dashed: true, label: 'cosωct' },
            { from: 'vco', to: 'mq', midY: 0.94, dashed: true, label: 'sinωct (-90°)' }
          ];
          env.viz.drawBlockDiagram(ctx, boxes[0], nodes, edges, {
            time: env.time,
            activeId: env.step === 2 ? 'prod' : (env.step === 1 ? 'vco' : 'in'),
            title: boxes[0].w < 460 ? 'Costas 环路框图' : 'Costas 环（I/Q 双臂相乘消除 m(t) 符号跳变，直接锁定相位）'
          });

          // Panel 2: PLL transient phase error curve theta_e(t)
          var narrow1 = boxes[1].w < 460;
          var ax2 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: 0,
            xMax: 5.0,
            yMin: 0,
            yMax: 1.75,
            xGrid: 5,
            yGrid: 4,
            xTicks: [[0, '0'], [2.5, '2.5'], [5, 'AKt=5']],
            yTicks: [[dfN, 'Δω/AK'], [1.57, '90°']],
            title: narrow1 ? 'PLL 误差 θe(t) 收敛' : 'PLL 相位误差收敛 θe(t) = (φ₀−Δω/AK)e^(-AKt) + Δω/AK',
            subtitle: '稳态=' + (dfN * 57.3).toFixed(1) + '°',
            subtitleColor: P.green
          });
          var errFn = function (tau) {
            return dfN + (phi0 - dfN) * Math.exp(-tau);
          };
          env.viz.drawCurve(ctx, ax2, function () { return dfN; }, { color: P.green, dash: [4, 4], lineWidth: 1.5 });
          env.viz.drawCurve(ctx, ax2, errFn, { from: 0, to: 5.0, samples: 240, color: P.cyan, lineWidth: 2.5, fillAlpha: 0.16 });
          env.viz.drawAnnotation(ctx, ax2, 3.3, dfN + 0.08, '稳态常差 Δω/(AK)=' + dfN.toFixed(2) + ' rad', P.green, 'center');
        }
      }
    ]
  });
})(window);
