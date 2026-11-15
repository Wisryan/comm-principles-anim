(function (global) {
  'use strict';

  var P = global.COMM_VIZ.PALETTE;

  function resolvePart(env, maxPart) {
    var p = env.params.part !== undefined ? Math.round(env.params.part) : 0;
    if (p >= 1 && p <= maxPart) return p - 1;
    return Math.min(maxPart - 1, Math.max(0, env.step));
  }

  global.COMM_EPISODES.push({
    id: 'ep02',
    chapter: 'Ch.02 信号与系统（上）',
    title: '信号分类、空间正交分解与 Gram-Schmidt 正交化',
    slideDeck: 'Ch.02 信号与系统（上）',
    slideRange: 'pp. 1–38',
    homeworkTags: ['HW1 · 2.5-5', 'HW1 · 2.6-1', 'HW1 · 2.7-2'],
    scenes: [
      {
        id: 's00',
        tag: '直觉',
        title: '信号分类、数字信号辨析与能量/功率判据',
        slideRef: '02sigsys pp.3–11',
        terms: [
          { en: 'Analog vs Digital', zh: '模拟信号 vs 数字信号' },
          { en: 'Energy vs Power Signal', zh: '能量信号 vs 功率信号' },
          { en: 'Fundamental Period T_0', zh: '基波周期' }
        ],
        symbols: [
          { sym: 'E_g = \\int_{-\\infty}^{\\infty} |g(t)|^2 dt', desc: '总能量（0 < E_g < ∞ 且 P_g = 0 为能量信号）', color: P.cyan },
          { sym: 'P_g = \\lim_{T\\to\\infty} \\frac{1}{T}\\int_{-T/2}^{T/2} |g(t)|^2 dt', desc: '平均功率（0 < P_g < ∞ 且 E_g = ∞ 为功率信号）', color: P.amber },
          { sym: 'A(t)e^{j\\theta(t)}', desc: '复信号欧拉表示（模长×旋转相位）', color: P.pink }
        ],
        errata: '易错陷阱：时间离散不等于数字信号！只要幅值仍是连续实数（如理想采样样值 5.31, -2.47），就依然是离散时间模拟信号；只有幅值取有限个离散符号（如 0/1）才叫数字信号。另外，周期信号之和未必周期：sin t + sin(πt) 非周期，而 cos(2t) + cos(3t) 最小公倍周期是 2π，不是 6。',
        formulas: [
          { step: 0, latex: '\\text{连续/离散（看时间轴 }t\\text{）} \\quad\\neq\\quad \\text{模拟/数字（看幅值集合是否有限离散）}', label: '课件 Fig 2.4 四象限核心辨析' },
          { step: 1, latex: 'g(t)=e^{-at}u(t)\\ (a>0):\\quad E_g=\\int_0^\\infty e^{-2at}dt=\\frac{1}{2a}<\\infty,\\quad P_g=0', label: '能量信号：限时或衰减，总能量有限' },
          { step: 2, latex: 'g(t)=A\\cos(\\omega_0 t):\\quad E_g=\\infty,\\quad P_g=\\frac{A^2}{2}<\\infty', label: '功率信号：周期信号（及直流、复指数 e^{jωt}）' }
        ],
        sliders: [
          { key: 'sigMode', label: '信号类型 (0=能量脉冲, 1=功率余弦)', min: 0, max: 1, step: 1, default: 0 },
          { key: 'rate', label: '衰减率 a 或频率倍率', min: 0.5, max: 2.5, step: 0.25, default: 1.0 }
        ],
        presets: [
          { label: '能量信号 e^(-at)u(t)', values: { sigMode: 0, rate: 1.0 } },
          { label: '功率信号 cos(ωt)', values: { sigMode: 1, rate: 1.0 } },
          { label: '快衰减脉冲 (a=2.0)', values: { sigMode: 0, rate: 2.0 } }
        ],
        lines: [
          {
            step: 0,
            sub: '先破除第 2 章第一个高频概念陷阱：时间轴离散和数字信号是两码事！只要纵轴幅值连续可取任意实数，就算隔点采样也是模拟信号；只有幅值受限于有限个电平，抗噪才容易再生还原。',
            tts: '先破除第二章第一个高频概念陷阱：时间轴离散和数字信号是两码事。只要纵轴幅值还能连续取任意实数，哪怕在时间轴上隔点采样，它依然是模拟信号；只有纵轴幅值受限于有限个离散电平，才叫数字信号，在噪声中才能完整再生。'
          },
          {
            step: 1,
            sub: '再看信号的两大家族：像 $e^{-at}u(t)$ 这样迅速衰减归零的脉冲，平方积分得到有限总能量 $E_g = 1/(2a)$，平摊到无穷时间平均功率为 $0$，这就是能量信号。',
            tts: '再看信号的两大家族：像衰减指数脉冲这样迅速归零的信号，平方积分得到的总能量是有限值，等于二 a 分之一，平摊到无穷长时间里平均功率就是零，这就是能量信号。'
          },
          {
            step: 2,
            sub: '相反，周期余弦或复指数 $e^{j\\omega_0 t}$ 永远不衰减，总能量无穷大，但单周期平均功率稳定为 $A^2/2$，属于功率信号。注意周期之和未必周期，比如 $\\cos(2t)+\\cos(3t)$ 最小公倍周期是 $2\\pi$ 而不是 $6$！',
            tts: '相反，周期余弦或旋转复指数永远不会衰减，总能量无穷大，但单周期内的平均功率稳定有限，属于功率信号。顺便提醒一个易错点：两个周期信号相加未必仍是周期的，而余弦二 t 加余弦三 t 的周期是最小公倍数二派，可千万别答成六。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var sigMode = Math.round(env.params.sigMode || 0);
          if (env.step >= 2 && env.params.sigMode === 0 && env.params.rate === 1.0) {
            sigMode = 1;
          }
          var rate = env.params.rate || 1.0;

          // Panel 1: 2x2 Signal Classification Matrix (Time Continuous/Discrete vs Amp Analog/Digital)
          var b0 = boxes[0];
          env.viz.roundRect(ctx, b0.x, b0.y, b0.w, b0.h, 10);
          ctx.fillStyle = P.panelBg;
          ctx.fill();
          ctx.strokeStyle = '#1e2948';
          ctx.stroke();

          var narrow = b0.w < 460;
          env.viz.drawBadge(ctx, b0.x + 8, b0.y + 4, narrow ? 'Fig 2.4 模拟 vs 数字四象限' : 'Fig 2.4 四类信号辨析（幅值有限离散才叫数字）', P.cyan, false);

          var padT = 28;
          var qW = (b0.w - 22) / 2;
          var qH = (b0.h - padT - 12) / 2;
          var cells = [
            { col: 0, row: 0, title: '连续时间 · 模拟', color: P.cyan, kind: 'ca' },
            { col: 1, row: 0, title: '连续时间 · 数字', color: P.green, kind: 'cd' },
            { col: 0, row: 1, title: '离散时间 · 模拟', color: P.amber, kind: 'da' },
            { col: 1, row: 1, title: '离散时间 · 数字', color: P.pink, kind: 'dd' }
          ];
          for (var i = 0; i < cells.length; i++) {
            var c = cells[i];
            var cx = b0.x + 8 + c.col * (qW + 6);
            var cy = b0.y + padT + c.row * (qH + 6);
            env.viz.roundRect(ctx, cx, cy, qW, qH, 6);
            ctx.fillStyle = 'rgba(11, 16, 32, 0.72)';
            ctx.fill();
            ctx.strokeStyle = c.col === 1 ? 'rgba(52, 211, 153, 0.45)' : '#253358';
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.font = '600 10px sans-serif';
            ctx.fillStyle = c.color;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.fillText(c.title, cx + 6, cy + 4);

            var midY = cy + qH * 0.64;
            var amp = Math.max(8, qH * 0.25);
            var x0 = cx + 8;
            var x1 = cx + qW - 8;
            ctx.strokeStyle = 'rgba(148,163,184,0.3)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x0, midY);
            ctx.lineTo(x1, midY);
            ctx.stroke();

            ctx.strokeStyle = c.color;
            ctx.fillStyle = c.color;
            ctx.lineWidth = 1.8;
            if (c.kind === 'ca') {
              ctx.beginPath();
              for (var s = 0; s <= 32; s++) {
                var u = s / 32;
                var px = x0 + u * (x1 - x0);
                var py = midY - Math.sin(u * Math.PI * 2.2) * amp;
                if (s === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
              }
              ctx.stroke();
            } else if (c.kind === 'cd') {
              var bits = [1, -1, 1, 1, -1, 1];
              ctx.beginPath();
              for (var b = 0; b < bits.length; b++) {
                var bx0 = x0 + (b / bits.length) * (x1 - x0);
                var bx1 = x0 + ((b + 1) / bits.length) * (x1 - x0);
                var by = midY - bits[b] * amp * 0.85;
                if (b === 0) ctx.moveTo(bx0, by);
                else ctx.lineTo(bx0, by);
                ctx.lineTo(bx1, by);
              }
              ctx.stroke();
            } else if (c.kind === 'da') {
              for (var d = 0; d < 8; d++) {
                var du = (d + 0.4) / 8;
                var dx = x0 + du * (x1 - x0);
                var dy = midY - Math.sin(du * Math.PI * 2.2) * amp;
                ctx.beginPath();
                ctx.moveTo(dx, midY);
                ctx.lineTo(dx, dy);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(dx, dy, 2.2, 0, Math.PI * 2);
                ctx.fill();
              }
            } else {
              var dbits = [1, -1, 1, -1, 1, 1, -1, 1];
              for (var k = 0; k < dbits.length; k++) {
                var kx = x0 + ((k + 0.4) / dbits.length) * (x1 - x0);
                var ky = midY - dbits[k] * amp * 0.85;
                ctx.beginPath();
                ctx.moveTo(kx, midY);
                ctx.lineTo(kx, ky);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(kx, ky, 2.2, 0, Math.PI * 2);
                ctx.fill();
              }
            }
          }

          // Panel 2: Energy Signal vs Power Signal interactive waveform
          var isPower = sigMode === 1;
          var ax2 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: -1.5,
            xMax: 5.5,
            yMin: -1.25,
            yMax: 1.35,
            xGrid: 7,
            yGrid: 4,
            xTicks: [[0, '0'], [2, '2'], [4, '4']],
            yTicks: [[-1, '-1'], [0, '0'], [1, '1']],
            title: isPower ? '功率信号: cos(' + rate.toFixed(1) + 'πt)' : '能量信号: e^(-' + rate.toFixed(1) + 't)u(t)',
            subtitle: isPower ? ('E=∞, P=0.5W') : ('E=' + (1 / (2 * rate)).toFixed(2) + 'J, P=0'),
            subtitleColor: isPower ? P.amber : P.green
          });
          env.viz.drawCurve(ctx, ax2, function (t) {
            if (isPower) return Math.cos(Math.PI * rate * t);
            return t >= 0 ? Math.exp(-rate * t) : 0;
          }, {
            color: isPower ? P.amber : P.cyan,
            lineWidth: 2.3,
            fillAlpha: 0.16,
            reveal: Math.min(1, 0.35 + 0.65 * env.progress)
          });
          env.viz.drawAnnotation(
            ctx,
            ax2,
            2.5,
            1.1,
            isPower ? '永不衰减 → 总能量发散，均功率有限' : '单向衰减 → 面积积分有限',
            isPower ? P.amber : P.green,
            'center'
          );
        }
      },
      {
        id: 's01',
        tag: '推导',
        title: '时域三大运算、δ(t) 筛选性与相关卷积',
        slideRef: '02sigsys pp.12–15',
        terms: [
          { en: 'Shifting / Scaling', zh: '平移 / 尺缩变换' },
          { en: 'Sifting Property', zh: '冲激筛选（取样）性' },
          { en: 'Cross-Correlation', zh: '互相关函数' }
        ],
        symbols: [
          { sym: 'g(at - b) = g\\!\\left(a\\left(t - \\frac{b}{a}\\right)\\right)', desc: '先平移 b 后缩 a 倍（或先缩 a 再移 b/a）', color: P.cyan },
          { sym: '\\int_{-\\infty}^{\\infty} f(t)\\delta(t-T)dt = f(T)', desc: '冲激筛选性：精准采出 T 时刻函数值', color: P.amber },
          { sym: 'r_{xy}(\\tau) = \\int x(t)y^*(t-\\tau)dt', desc: '相关不反转波形，直接滑动求相似度', color: P.green }
        ],
        errata: '课件第 13 页小勘误：标题写着“Time Inversion”，下方公式却给了 φ(t) = -g(t)；严格来说 -g(t) 是幅度上下反相（相位翻转 180°），真正的时间轴左右镜像反演是 g(-t)。',
        formulas: [
          { step: 0, latex: 'g(t)\\text{ 非零区 }[0,1] \\implies g(at-b)\\text{ 非零区 }\\left[\\frac{b}{a},\\;\\frac{b+1}{a}\\right]\\quad(a>0)', label: '核心避坑：把 at-b 夹进原区间解不等式最稳' },
          { step: 1, latex: 'f(t)\\delta(t-T)=f(T)\\delta(t-T),\\qquad u(t)-u(t-T)\\text{ 截出 }[0,T]\\text{ 矩形窗}', label: '单位冲激取样性与阶跃开窗' },
          { step: 2, latex: 'r_{xy}(\\tau)=x(\\tau)*y^*(-\\tau) \\quad\\longleftrightarrow\\quad R_{xy}(\\omega)=X(\\omega)Y^*(\\omega)', label: '时域相关 ↔ 频域共轭相乘（卷积须反转，相关不反转）' }
        ],
        sliders: [
          { key: 'a', label: '时间缩放因子 a', min: 0.5, max: 2.5, step: 0.5, default: 2.0 },
          { key: 'b', label: '平移参数 b（g(at - b)）', min: -1.0, max: 4.0, step: 0.5, default: 2.0 }
        ],
        presets: [
          { label: 'g(2t - 2) 区间 [1, 1.5]', values: { a: 2.0, b: 2.0 } },
          { label: '纯右移 g(t - 2) [2, 3]', values: { a: 1.0, b: 2.0 } },
          { label: '拉伸+左移 g(0.5t + 0.5)', values: { a: 0.5, b: -0.5 } }
        ],
        lines: [
          {
            step: 0,
            sub: '时域做复合变换 $g(at - b)$ 最容易把顺序搞反！牢记口诀：把 $at - b$ 整体夹回原区间求解，比如 $g(t)$ 落在 $[0,1]$，$g(2t - 2)$ 令 $0 \\le 2t - 2 \\le 1$，立刻解出区间 $[1, 1.5]$，既右移了 $1$ 又压缩成一半。',
            tts: '时域做复合变换 g a t 减 b 最容易把顺序搞反。牢记一个零出错口诀：直接把 a t 减 b 夹回原区间解不等式。例如原脉冲在零到一，求 g 二 t 减二，只要让二 t 减二介于零和一之间，立刻解出区间是一到一点五。'
          },
          {
            step: 1,
            sub: '单位冲激 $\\delta(t-T)$ 像一根无穷高、面积为 $1$ 的极细探针：与任意连续函数 $f(t)$ 相乘再积分，就会把 $T$ 时刻的瞬时值 $f(T)$ 精准抽样出来。',
            tts: '单位冲激德尔塔 t 减大 T 就像一根面积为一的极细探针：把它和任意连续函数相乘再积分，就会像相机快门一样，把大 T 时刻的函数值精准取样出来。'
          },
          {
            step: 2,
            sub: '卷积 $x*h$ 需要先反转 $h$ 再平移相乘积分；而互相关 $r_{xy}(\\tau)$ 不反转波形，直接让 $y(t-\\tau)$ 顺着时间轴滑过 $x(t)$，重合面积最大时就抓到了同步延迟！',
            tts: '卷积运算需要把波形左右反转后再平移相乘积分；而互相关函数不反转波形，直接让一个信号顺着时间轴滑过另一个信号，当两个形状对齐、重叠面积最大时，就抓出了真实的传输延迟。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var a = env.params.a || 2.0;
          var b = env.params.b !== undefined ? env.params.b : 2.0;
          var tL = b / a;
          var tR = (b + 1) / a;

          function baseRamp(u) {
            return (u >= 0 && u <= 1) ? u : 0;
          }

          var ax1 = env.viz.drawAxes(ctx, boxes[0], {
            xMin: -1.5,
            xMax: 4.5,
            yMin: -0.2,
            yMax: 1.35,
            xGrid: 6,
            yGrid: 3,
            xTicks: [[-1, '-1'], [0, '0'], [1, '1'], [2, '2'], [3, '3'], [4, '4']],
            yTicks: [[0, '0'], [1, '1']],
            title: boxes[0].w < 460 ? 'g(t) vs g(at-b) [' + tL.toFixed(1) + ',' + tR.toFixed(1) + ']' : '复合时域变换：蓝=原脉冲 g(t)，琥珀=g(at-b) [' + tL.toFixed(2) + ', ' + tR.toFixed(2) + ']'
          });
          env.viz.drawCurve(ctx, ax1, baseRamp, { color: P.cyan, dash: [5, 4], lineWidth: 2.0, fillAlpha: 0.1 });
          env.viz.drawCurve(ctx, ax1, function (t) { return baseRamp(a * t - b); }, { color: P.amber, lineWidth: 2.4, fillAlpha: 0.22 });

          // Panel 2: Sliding Correlation alignment visualization
          var tau = -1.6 + 3.2 * (0.5 - 0.5 * Math.cos(env.time * 1.1));
          if (env.step === 1) tau = 0.8;
          var ax2 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: -2.0,
            xMax: 3.5,
            yMin: -0.25,
            yMax: 1.45,
            xGrid: 5,
            yGrid: 3,
            xTicks: [[-1, '-1'], [0, '0'], [1, '1'], [2, '2'], [3, '3']],
            yTicks: [[0, '0'], [1, '1']],
            title: env.step === 1 ? 'δ(t-T) 冲激探针取样演示' : ('滑动互相关对齐 (偏移 τ = ' + tau.toFixed(2) + ')')
          });

          if (env.step === 1) {
            var Ts = 0.8;
            function fSmooth(t) { return 0.75 + 0.35 * Math.sin(1.6 * t); }
            env.viz.drawCurve(ctx, ax2, fSmooth, { color: P.cyan, lineWidth: 2.2 });
            env.viz.drawStems(ctx, ax2, [
              { x: Ts, y: fSmooth(Ts), color: P.amber, width: 3, arrow: true, label: '采样 f(T)=' + fSmooth(Ts).toFixed(2) }
            ], {});
          } else {
            function pulseA(t) { return (t >= 0 && t <= 1) ? 1 - Math.abs(2 * t - 1) : 0; }
            env.viz.drawCurve(ctx, ax2, pulseA, { color: P.cyan, lineWidth: 2.2, fillAlpha: 0.12 });
            env.viz.drawCurve(ctx, ax2, function (t) { return pulseA(t - tau); }, { color: P.green, dash: [5, 3], lineWidth: 2.0 });
            env.viz.drawCurve(ctx, ax2, function (t) { return pulseA(t) * pulseA(t - tau); }, { color: P.pink, lineWidth: 1.8, fillAlpha: 0.28 });
            env.viz.drawAnnotation(ctx, ax2, 1.8, 1.2, Math.abs(tau) < 0.2 ? '完全重合 → 相关峰值!' : '滑动乘积面积', Math.abs(tau) < 0.2 ? P.amber : P.pink, 'center');
          }
        }
      },
      {
        id: 's02',
        tag: '作业精讲',
        hwCode: '2.5-5',
        title: 'HW1 作业 2.5-5：复信号能量展开与正交勾股定理',
        slideRef: 'HW1 · 2.5-5',
        terms: [
          { en: 'Cross-Energy E_{xy}', zh: '互能量（内积）' },
          { en: 'Orthogonal Signals', zh: '正交信号' }
        ],
        symbols: [
          { sym: 'E_{xy} = \\int x(t)y^*(t)dt', desc: '复信号互能量，满足 E_{yx} = E_{xy}^*', color: P.amber },
          { sym: 'E_x + E_y', desc: '两分信号各自能量之和', color: P.cyan },
          { sym: 'E_{x\\pm y}', desc: '和/差信号总能量', color: P.green }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: '(c)\\; E_{x\\pm y} = \\int |x\\pm y|^2 dt = \\int (x\\pm y)(x^*\\pm y^*)dt = E_x + E_y \\pm (E_{xy} + E_{yx})', label: '一般复信号能量展开（交叉项为 2 Re⟨x, y⟩）' },
          { step: 1, latex: '(a)\\; x\\perp y \\implies E_{xy}=E_{yx}=0 \\implies E_{x+y} = E_{x-y} = E_x + E_y', label: '正交信号加减能量相等，即为信号空间的勾股定理' },
          { step: 2, latex: '(b)\\; E_{c_1 x \\pm c_2 y} = |c_1|^2 E_x + |c_2|^2 E_y\\quad(\\langle c_1 x, c_2 y\\rangle = c_1 c_2^* E_{xy}=0)', label: '乘复系数后依然正交，能量按模方线性叠加' }
        ],
        sliders: [
          { key: 'thetaDeg', label: '两信号夹角 θ (度)', min: 0, max: 180, step: 15, default: 90 },
          { key: 'c1', label: '缩放系数 |c₁|', min: 0.5, max: 2.0, step: 0.25, default: 1.0 }
        ],
        presets: [
          { label: '(a) 正交 θ=90° (勾股成立)', values: { thetaDeg: 90, c1: 1.0 } },
          { label: '同向 θ=0° (交叉项翻倍)', values: { thetaDeg: 0, c1: 1.0 } },
          { label: '(b) 标量倍乘 |c₁|=1.5, θ=90°', values: { thetaDeg: 90, c1: 1.5 } }
        ],
        lines: [
          {
            step: 0,
            sub: '来看作业 2.5-5，先解一般情况 (c)：求复信号 $z(t)=x(t)\\pm y(t)$ 的能量，把模的平方拆成自身乘共轭展开，得 $E_z = E_x + E_y \\pm (E_{xy} + E_{yx})$。后面两项之和其实就是夹角余弦控制的交叉项！',
            tts: '来看作业二点五杠五，我们先看一般情况第 c 问：求复信号 x 加减 y 的能量，把模长的平方拆成信号自己乘以共轭，展开后得到各自的能量加上或减去互能量 E x y 加 E y x，这就是空间夹角余弦决定的交叉项。'
          },
          {
            step: 1,
            sub: '当 $x$ 与 $y$ 正交时，互能量 $E_{xy}=E_{yx}=0$，交叉项彻底归零！这就直接推出 (a) 问：$E_{x+y}$ 和 $E_{x-y}$ 完全相等，都等于 $E_x + E_y$——这就是函数空间里的勾股定理！',
            tts: '当两个信号互相正交，也就是夹角九十度时，互能量为零，交叉项彻底消失。这就直接得出第 a 问的结论：无论是信号相加还是相减，总能量完全相等，都等于两份单独能量的和，这正是信号空间里的勾股定理。'
          },
          {
            step: 2,
            sub: '再看 (b) 问：把信号分别乘上复常数 $c_1, c_2$ 后，内积 $\\langle c_1 x, c_2 y\\rangle = c_1 c_2^* E_{xy}$ 依然等于 $0$，方向仍垂直！因此 $E_{c_1 x \\pm c_2 y} = |c_1|^2 E_x + |c_2|^2 E_y$。拖动角度滑块试试，只有 $90^\\circ$ 时红绿柱才一般高！',
            tts: '再看第 b 问：给正交信号各自乘上复常数 c 一和 c 二后，新的内积依然是零，两个矢量照样垂直！所以合能量等于 c 一模平方乘 E x 加上 c 二模平方乘 E y。拖动夹角滑块就会看到，只有九十度正交时，相加和相减的能量才完全一样大。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var deg = env.params.thetaDeg !== undefined ? env.params.thetaDeg : 90;
          var c1 = env.params.c1 || 1.0;
          var rad = (deg * Math.PI) / 180;
          var Ex = c1 * c1;
          var Ey = 1.0;
          var cross = 2 * c1 * Math.cos(rad);
          var Eplus = Ex + Ey + cross;
          var Eminus = Ex + Ey - cross;
          var ortho = Math.abs(deg - 90) < 1;

          // Panel 1: Vector geometry (c1*x, y, c1*x+y, c1*x-y)
          var magScale = 0.42;
          env.viz.drawPhasorWheel(ctx, boxes[0], {
            mode: 'phasor',
            title: boxes[0].w < 460 ? '矢量几何 θ=' + deg + '°' : '信号矢量合成几何（θ=' + deg + '°）',
            vectors: [
              { mag: c1 * magScale, angle: 0, color: P.cyan, label: 'c₁x' },
              { mag: magScale, angle: rad, color: P.amber, label: 'y' },
              {
                mag: Math.sqrt(Eplus) * magScale,
                angle: Math.atan2(Math.sin(rad), c1 + Math.cos(rad)),
                color: P.green,
                width: 2.2,
                label: 'c₁x+y'
              },
              {
                mag: Math.sqrt(Math.max(0, Eminus)) * magScale,
                angle: Math.atan2(-Math.sin(rad), c1 - Math.cos(rad)),
                color: P.pink,
                width: 2.2,
                label: 'c₁x-y'
              }
            ]
          });

          // Panel 2: Energy bar comparison
          var ax2 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: 0.4,
            xMax: 3.6,
            yMin: 0,
            yMax: Math.max(4.5, Eplus + 0.8, Eminus + 0.8),
            xGrid: 3,
            yGrid: 4,
            xTicks: [[1, 'E(c₁x)+E(y)'], [2, 'E(c₁x+y)'], [3, 'E(c₁x-y)']],
            yTicks: [[1, '1'], [2, '2'], [4, '4']],
            title: boxes[1].w < 460 ? '能量对比 (互能=' + (cross >= 0 ? '+' : '') + cross.toFixed(2) + ')' : '总能量对比（交叉项 2Re⟨c₁x,y⟩=' + cross.toFixed(2) + '）',
            subtitle: ortho ? '正交勾股成立!' : '存在交叉项',
            subtitleColor: ortho ? P.green : P.red
          });
          env.viz.drawStems(ctx, ax2, [
            { x: 1, y: Ex + Ey, color: P.cyan, width: 16, label: (Ex + Ey).toFixed(2) },
            { x: 2, y: Eplus, color: P.green, width: 16, label: Eplus.toFixed(2) },
            { x: 3, y: Eminus, color: P.pink, width: 16, label: Eminus.toFixed(2) }
          ], {});
        }
      },
      {
        id: 's03',
        tag: '推导',
        title: '最佳投影近似与误差能量最小化原理',
        slideRef: '02sigsys pp.21–33',
        terms: [
          { en: 'Orthogonal Projection', zh: '正交投影' },
          { en: 'Cauchy-Schwarz Inequality', zh: '柯西-施瓦茨不等式' },
          { en: 'Error Energy E_e', zh: '近似误差能量' }
        ],
        symbols: [
          { sym: 'g(t) \\approx c\\,x(t)', desc: '用已知基信号 x(t) 逼近目标信号 g(t)', color: P.cyan },
          { sym: 'e(t) = g(t) - c\\,x(t)', desc: '逼近误差波形（残差）', color: P.red },
          { sym: 'c^* = \\frac{\\langle g, x\\rangle}{\\|x\\|^2}', desc: '使误差能量最小的最佳投影系数', color: P.green }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: 'E_e(c) = \\int |g(t)-c\\,x(t)|^2 dt = \\|g\\|^2 - 2c\\langle g,x\\rangle + c^2\\|x\\|^2', label: '误差能量是关于系数 c 的开口向上抛物线' },
          { step: 1, latex: '\\frac{dE_e}{dc}=0 \\iff \\langle g - c^* x,\\; x\\rangle = 0 \\iff c^* = \\frac{\\langle g,x\\rangle}{E_x}', label: '几何意义：残差矢量必须与基底 x 垂直（正交投影）' }
        ],
        sliders: [
          { key: 'c', label: '逼近幅值系数 c', min: 0.0, max: 2.2, step: 0.05, default: 1.27 }
        ],
        presets: [
          { label: '最佳投影 c*=4/π≈1.27', values: { c: 1.27 } },
          { label: '偏小 c=0.60 (误差大)', values: { c: 0.60 } },
          { label: '偏大 c=2.00 (过冲误差)', values: { c: 2.00 } }
        ],
        lines: [
          {
            step: 0,
            sub: '想用一根光滑正弦波 $c\\sin(2\\pi t)$ 去尽量贴合 $\\pm 1$ 方波 $g(t)$，系数 $c$ 该选多大？不是拍脑袋选 $1$，而是要让绿色阴影部分的误差能量 $E_e = \\int |g(t)-cx(t)|^2 dt$ 降到最小！',
            tts: '如果想用一根光滑的正弦波 c 倍的 sin 二派 t 去尽量贴合正负一的方波，系数 c 应该选多大？不能随便拍脑袋选一，而要让残差平方积分出的误差能量降到最低。'
          },
          {
            step: 1,
            sub: '几何直觉一秒看透：从原点向直线 $x$ 做垂线，垂足处距离最短！对应到函数空间就是残差 $g - c^*x$ 必须与 $x$ 正交，直接算出 $c^* = \\langle g, x\\rangle / E_x = 4/\\pi \\approx 1.273$。拖动滑块偏离它，右图抛物线上的红点立刻升高！',
            tts: '几何直觉一眼就能看穿：点到直线的最短距离永远是垂线段！对应到函数空间，就是残差必须和基函数正交，直接算出最佳系数是派分之四，大约一点二七三。拖动滑块稍微偏离这个值，右边抛物线上的误差能量就会立刻抬高。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var c = env.params.c !== undefined ? env.params.c : 1.27;
          var cOpt = 4 / Math.PI;
          function sq(t) { return (t >= 0 && t < 0.5) ? 1 : ((t >= 0.5 && t <= 1) ? -1 : 0); }
          function errEnergy(cv) { return 1 - (4 / Math.PI) * cv + 0.5 * cv * cv; }
          var eNow = errEnergy(c);

          var ax1 = env.viz.drawAxes(ctx, boxes[0], {
            xMin: 0,
            xMax: 1,
            yMin: -2.3,
            yMax: 2.3,
            xGrid: 4,
            yGrid: 4,
            xTicks: [[0, '0'], [0.5, '0.5'], [1, '1']],
            yTicks: [[-2, '-2'], [0, '0'], [2, '+2']],
            title: boxes[0].w < 460 ? '方波 vs ' + c.toFixed(2) + 'sin(2πt)' : '方波近似：青=目标 g(t)，琥珀=c·sin(2πt)'
          });
          env.viz.drawCurve(ctx, ax1, sq, { color: P.cyan, lineWidth: 2.0 });
          env.viz.drawCurve(ctx, ax1, function (t) { return c * Math.sin(2 * Math.PI * t); }, { color: P.amber, lineWidth: 2.3 });
          env.viz.drawCurve(ctx, ax1, function (t) { return sq(t) - c * Math.sin(2 * Math.PI * t); }, { color: P.red, dash: [4, 3], lineWidth: 1.5, fillAlpha: 0.16 });

          var ax2 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: 0,
            xMax: 2.3,
            yMin: 0,
            yMax: 1.15,
            xGrid: 4,
            yGrid: 4,
            xTicks: [[0, '0'], [1.273, 'c*=1.27'], [2, '2']],
            yTicks: [[0.19, '0.19'], [0.5, '0.5'], [1.0, '1.0']],
            title: '误差能量抛物线 E_e(c)',
            subtitle: Math.abs(c - cOpt) < 0.04 ? '正交最小!' : ('E_e=' + eNow.toFixed(3)),
            subtitleColor: Math.abs(c - cOpt) < 0.04 ? P.green : P.amber
          });
          env.viz.drawCurve(ctx, ax2, errEnergy, { color: P.purple, lineWidth: 2.3, fillAlpha: 0.14 });
          env.viz.drawStems(ctx, ax2, [
            { x: cOpt, y: errEnergy(cOpt), color: P.green, width: 2, label: '谷底 4/π' },
            { x: c, y: eNow, color: Math.abs(c - cOpt) < 0.04 ? P.green : P.red, width: 3.5, label: '当前' }
          ], {});
        }
      },
      {
        id: 's04',
        tag: '课件例题',
        title: '正交函数空间 Ex 1–Ex 3：频域/时域隔离与匹配滤波',
        slideRef: '02sigsys pp.34–37',
        terms: [
          { en: 'Orthogonal Subspace', zh: '正交子空间' },
          { en: 'Matched Filter', zh: '匹配滤波器' }
        ],
        symbols: [
          { sym: 's(t) = x(t) + y(t)', desc: '接收混合信号（待分离）', color: P.cyan },
          { sym: '\\langle s, x \\rangle = a E_x + \\langle n, x \\rangle', desc: '内积抽取系数 a，屏蔽正交干扰 y(t)', color: P.green }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: '\\text{Ex 1：} X(\\omega)=0\\ (\\omega\\in[\\omega_1,\\omega_2]) \\implies \\text{用带阻滤波器 (Bandstop) 滤除 } [\\omega_1,\\omega_2]', label: '频域不重叠基底：用带阻保留完整的 x(t)' },
          { step: 1, latex: '\\text{Ex 2：} x(t)=0\\ (t\\in[t_1,t_2]) \\implies \\text{令 } s(t)=0\\ (t\\in[t_1,t_2])\\text{ 时域选通}', label: '时域不重叠基底：直接把该时段置零切掉干扰' },
          { step: 2, latex: '\\text{Ex 3：} s(t)=a x(t)+b y(t)+n(t)\\ (x\\perp y) \\implies \\text{乘 }x(t)\\text{ 积分（匹配滤波器 }h(t)=x(-t)\\text{）}', label: '广义正交：哪怕时域频域都重叠，只要波形正交就能分开！' }
        ],
        sliders: [
          { key: 'part', label: '例题切换 (0=随讲解自动, 1~3=Ex1~3)', min: 0, max: 3, step: 1, default: 0 }
        ],
        presets: [
          { label: '随讲解自动切换', values: { part: 0 } },
          { label: 'Ex 1 频域带阻', values: { part: 1 } },
          { label: 'Ex 2 时域切窗', values: { part: 2 } },
          { label: 'Ex 3 匹配滤波器', values: { part: 3 } }
        ],
        lines: [
          {
            step: 0,
            sub: '正交函数空间在通信里最厉害的地方，是正交信号互不干扰！看课件第 35 页 Ex 1：如果已知 $X(\\omega)$ 在 $[\\omega_1,\\omega_2]$ 上恒为零，只需让混合信号 $s(t)$ 经过一个带阻滤波器切掉这段频率，就能保住完整无缺的 $x(t)$！',
            tts: '正交函数空间在通信里最核心的价值，就是互相正交的分量互不干扰。看课件第三十五页例题一：如果已知信号 X 在欧米伽一到欧米伽二频段内为零，只需让混合信号经过一个带阻滤波器把这段频率挖掉，就能无损保住完整的 x。'
          },
          {
            step: 1,
            sub: '第 36 页 Ex 2 是时间版本：已知 $x(t)$ 在 $[t_1, t_2]$ 时段里恒等于 $0$，想从混合信号里消掉干扰 $y(t)$，直接做一个时间开关，在 $[t_1, t_2]$ 期间把接收信号强行置零即可！',
            tts: '第三十六页例题二是时间对偶版本：如果已知 x 在 t 一到 t 二时间段里恒为零，那么只要在这个时间窗里把接收端开关断开置零，就能剔除掉重叠在这段时间的干扰。'
          },
          {
            step: 2,
            sub: '第 37 页 Ex 3 更加通用：即使 $x(t)$ 与 $y(t)$ 在时间和频率上完全混叠，只要内积正交，接收端用冲激响应为 $x(-t)$ 的匹配滤波器一积，$b y(t)$ 贡献直接归零，轻松提取系数 $a$！',
            tts: '第三十七页例题三则给出了更通用的终极武器：哪怕两个信号在时间和频率上全都挤在一起，只要它们的波形相互正交，接收端用匹配的 x 波形做内积滤波，正交邻居的干扰贡献立刻全部归零，轻松读出所需系数。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var ex = resolvePart(env, 3);

          if (ex === 0) {
            // Ex 1: Bandstop filtering in frequency domain
            var ax1 = env.viz.drawAxes(ctx, boxes[0], {
              xMin: 0,
              xMax: 5,
              yMin: 0,
              yMax: 1.3,
              xGrid: 5,
              yGrid: 2,
              xTicks: [[1.6, 'ω₁'], [3.0, 'ω₂']],
              yTicks: [[0, '0'], [1, '1']],
              title: 'Ex 1 频域分布：X(ω) 避开 [ω₁,ω₂]'
            });
            env.viz.drawShadedBand(ctx, ax1, 1.6, 3.0, 'rgba(251, 113, 133, 0.22)', '带阻切除区');
            env.viz.drawCurve(ctx, ax1, function (w) {
              if (w >= 1.6 && w <= 3.0) return 0;
              return 0.85 * Math.exp(-Math.pow((w - 0.9) / 0.5, 2)) + 0.65 * Math.exp(-Math.pow((w - 3.9) / 0.55, 2));
            }, { color: P.cyan, lineWidth: 2.3, fillAlpha: 0.18 });
            env.viz.drawCurve(ctx, ax1, function (w) {
              return 0.95 * Math.exp(-Math.pow((w - 2.3) / 0.45, 2));
            }, { color: P.amber, dash: [5, 3], lineWidth: 2.0 });

            var nodes1 = [
              { id: 'in', nx: 0.16, ny: 0.5, nw: 0.2, nh: 0.34, label: 's(t)=x+y', color: P.cyan },
              { id: 'bsf', nx: 0.5, ny: 0.5, nw: 0.28, nh: 0.38, label: '带阻滤波器\n阻断 [ω₁,ω₂]', color: P.red },
              { id: 'out', nx: 0.84, ny: 0.5, nw: 0.2, nh: 0.34, label: 'x(t) + ỹ(t)', color: P.green }
            ];
            env.viz.drawBlockDiagram(ctx, boxes[1], nodes1, [
              { from: 'in', to: 'bsf', label: '输入' },
              { from: 'bsf', to: 'out', label: '滤除y带内', color: P.green }
            ], { time: env.time, activeId: 'bsf', title: 'Ex 1 解法：带阻滤波器提取 X' });
          } else if (ex === 1) {
            // Ex 2: Time gating
            var ax1b = env.viz.drawAxes(ctx, boxes[0], {
              xMin: 0,
              xMax: 5,
              yMin: 0,
              yMax: 1.3,
              xGrid: 5,
              yGrid: 2,
              xTicks: [[1.6, 't₁'], [3.0, 't₂']],
              yTicks: [[0, '0'], [1, '1']],
              title: 'Ex 2 时域分布：x(t) 在 [t₁,t₂] 为零'
            });
            env.viz.drawShadedBand(ctx, ax1b, 1.6, 3.0, 'rgba(251, 113, 133, 0.22)', '置零门控区');
            env.viz.drawCurve(ctx, ax1b, function (t) {
              if (t >= 1.6 && t <= 3.0) return 0;
              return 0.9 * Math.exp(-Math.pow((t - 0.8) / 0.45, 2)) + 0.75 * Math.exp(-Math.pow((t - 4.0) / 0.5, 2));
            }, { color: P.cyan, lineWidth: 2.3, fillAlpha: 0.18 });
            env.viz.drawCurve(ctx, ax1b, function (t) {
              return 0.95 * Math.exp(-Math.pow((t - 2.3) / 0.45, 2));
            }, { color: P.amber, dash: [5, 3], lineWidth: 2.0 });

            var nodes2 = [
              { id: 'in', nx: 0.16, ny: 0.5, nw: 0.2, nh: 0.34, label: 's(t)=x+y', color: P.cyan },
              { id: 'gate', nx: 0.5, ny: 0.5, nw: 0.3, nh: 0.38, label: '时域开关\n[t₁,t₂] 置零', color: P.amber },
              { id: 'out', nx: 0.84, ny: 0.5, nw: 0.2, nh: 0.34, label: 'x(t) + ỹ(t)', color: P.green }
            ];
            env.viz.drawBlockDiagram(ctx, boxes[1], nodes2, [
              { from: 'in', to: 'gate', label: '输入' },
              { from: 'gate', to: 'out', label: '时间选通', color: P.green }
            ], { time: env.time, activeId: 'gate', title: 'Ex 2 解法：时间开关切断 [t₁,t₂]' });
          } else {
            // Ex 3: Matched filter / projection
            var nodes3 = [
              { id: 'in', nx: 0.14, ny: 0.5, nw: 0.2, nh: 0.38, label: 's(t)=\nax+by+n', color: P.cyan },
              { id: 'mf1', nx: 0.5, ny: 0.28, nw: 0.26, nh: 0.32, label: '匹配滤 x(-t)\n⟨s, x⟩', color: P.green },
              { id: 'mf2', nx: 0.5, ny: 0.72, nw: 0.26, nh: 0.32, label: '匹配滤 y(-t)\n⟨s, y⟩', color: P.amber },
              { id: 'aout', nx: 0.86, ny: 0.28, nw: 0.18, nh: 0.3, label: 'a·E_x', color: P.green },
              { id: 'bout', nx: 0.86, ny: 0.72, nw: 0.18, nh: 0.3, label: 'b·E_y', color: P.amber }
            ];
            env.viz.drawBlockDiagram(ctx, boxes[0], nodes3, [
              { from: 'in', to: 'mf1' },
              { from: 'in', to: 'mf2' },
              { from: 'mf1', to: 'aout', color: P.green },
              { from: 'mf2', to: 'bout', color: P.amber }
            ], { time: env.time, activeId: 'mf1', title: 'Ex 3：并行匹配滤波器正交分离 a, b' });

            var ax3 = env.viz.drawAxes(ctx, boxes[1], {
              xMin: 0,
              xMax: 1,
              yMin: -1.4,
              yMax: 1.4,
              xGrid: 4,
              yGrid: 2,
              xTicks: [[0, '0'], [0.5, '0.5'], [1, '1']],
              yTicks: [[-1, '-1'], [0, '0'], [1, '+1']],
              title: '正交波形示例：sin(2πt) ⊥ sin(4πt)'
            });
            env.viz.drawCurve(ctx, ax3, function (t) { return Math.sin(2 * Math.PI * t); }, { color: P.green, lineWidth: 2.1 });
            env.viz.drawCurve(ctx, ax3, function (t) { return Math.sin(4 * Math.PI * t); }, { color: P.amber, dash: [4, 3], lineWidth: 1.8 });
            env.viz.drawAnnotation(ctx, ax3, 0.5, 1.15, '同域共存，但乘积积分为 0!', P.cyan, 'center');
          }
        }
      },
      {
        id: 's05',
        tag: '作业精讲',
        hwCode: '2.6-1',
        title: 'HW1 作业 2.6-1：相关系数 ρ 与最佳抗噪信号筛选',
        slideRef: 'HW1 · 2.6-1',
        terms: [
          { en: 'Correlation Coefficient ρ', zh: '归一化相关系数' },
          { en: 'Antipodal Signals', zh: '反极性信号（ρ = -1）' }
        ],
        symbols: [
          { sym: 'x(t) = \\sin(2\\pi t)', desc: '参考波形（[0,1] 上能量 E_x = 0.5）', color: P.cyan },
          { sym: '\\rho = \\frac{\\int_0^1 x(t)g(t)dt}{\\sqrt{E_x E_g}}', desc: '波形方向余弦 ∈ [-1, +1]', color: P.amber },
          { sym: 'd^2 = 2E(1-\\rho)', desc: '等能量两信号欧氏距离平方', color: P.green }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: 'g_1=\\sin(4\\pi t)\\Rightarrow \\rho_1=0;\\qquad g_3=\\frac{1}{\\sqrt{2}}\\Rightarrow \\rho_3=0', label: '正交候选：与 sin(2πt) 内积均为 0' },
          { step: 1, latex: 'g_4=\\pm\\frac{1}{\\sqrt{2}}:\\; \\int_0^1 x g_4 dt = \\frac{1}{\\sqrt{2}}\\cdot\\frac{2}{\\pi} \\implies \\rho_4=\\frac{2\\sqrt{2}}{\\pi}\\approx +0.90', label: '同向方波与正弦最相似（|ρ|=0.90），但距离反而最小 d²=0.2E' },
          { step: 2, latex: 'g_2=-\\sin(2\\pi t) \\implies \\rho_2=-1 \\implies d^2 = 2E(1-(-1))=4E\\text{ 最大!}', label: '二进制通信要抗噪距离最大，必选反极性一对 (x, g₂)' }
        ],
        sliders: [
          { key: 'part', label: '候选信号 (0=自动, 1~4=g₁~g₄)', min: 0, max: 4, step: 1, default: 0 }
        ],
        presets: [
          { label: '随讲解自动切换', values: { part: 0 } },
          { label: 'g₁=sin4πt (ρ=0)', values: { part: 1 } },
          { label: 'g₂=-sin2πt (ρ=-1 最佳)', values: { part: 2 } },
          { label: 'g₃=0.707 (ρ=0)', values: { part: 3 } },
          { label: 'g₄=±0.707 (ρ=+0.90)', values: { part: 4 } }
        ],
        lines: [
          {
            step: 0,
            sub: '来看作业 2.6-1：在 $[0,1]$ 上给定参考信号 $x(t)=\\sin(2\\pi t)$，它和四个候选脉冲的能量全都是 $E=0.5$。先算 $g_1=\\sin(4\\pi t)$ 和常数 $g_3=1/\\sqrt{2}$，积分正负对称刚好抵消，相关系数 $\\rho_1=\\rho_3=0$，完全正交。',
            tts: '来看作业二点六杠一：在零到一区间内给定参考信号正弦二派 t，它和四个候选信号的总能量全是零点五。先看倍频正弦 g 一和直流常数 g 三，由于和基波乘积的正负半周刚好面积抵消，它们的相关系数全都是零，处于正交状态。'
          },
          {
            step: 1,
            sub: '再看双极性方波 $g_4=\\pm 1/\\sqrt{2}$：它和 $\\sin(2\\pi t)$ 同步正负翻转，乘积处处为正，算出内积约 $0.450$，相关系数高达 $\\rho_4=2\\sqrt{2}/\\pi\\approx +0.90$！形状最像，可惜距离 $d^2=2E(1-\\rho)$ 缩水到 $0.2E$，最容易被噪声混淆。',
            tts: '再看双极性方波 g 四：它和正弦二派 t 同向翻转，乘积处处为正，算出相关性高达零点九零，外形最相似。但恰恰因为太像了，两个信号之间的欧氏距离反倒最小，抗噪声能力最差。'
          },
          {
            step: 2,
            sub: '最后看 $g_2(t)=-\\sin(2\\pi t)$：它和 $x(t)$ 彻底反相，相关系数达到最小值 $\\rho_2=-1$！代入距离公式 $d^2=2E(1-\\rho)=4E$，拉开最大间距。所以二进制通信最抗噪的一对就是 $x(t)$ 与 $g_2(t)$！',
            tts: '最后看反极性波形 g 二：它等于负的 x t，和参考波形处处反相，相关系数达到最小值负一。代入欧氏距离公式二 E 乘以一减柔，直接拉出四 E 的最大间距。因此二进制通信一定要选 x 和 g 二这一对反极性信号！'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var sel = env.params.part !== undefined ? Math.round(env.params.part) : 0;
          var idx;
          if (sel >= 1 && sel <= 4) {
            idx = sel - 1;
          } else {
            idx = env.step === 0 ? 0 : (env.step === 1 ? 3 : 1);
          }

          var invSqrt2 = Math.SQRT1_2;
          var cands = [
            { name: 'g₁ = sin(4πt)', rho: 0, fn: function (t) { return Math.sin(4 * Math.PI * t); } },
            { name: 'g₂ = -sin(2πt)', rho: -1, fn: function (t) { return -Math.sin(2 * Math.PI * t); } },
            { name: 'g₃ = 0.707', rho: 0, fn: function () { return invSqrt2; } },
            { name: 'g₄ = ±0.707', rho: (2 * Math.SQRT2) / Math.PI, fn: function (t) { return t < 0.5 ? invSqrt2 : -invSqrt2; } }
          ];
          var cur = cands[idx];
          function xFn(t) { return Math.sin(2 * Math.PI * t); }

          var ax1 = env.viz.drawAxes(ctx, boxes[0], {
            xMin: 0,
            xMax: 1,
            yMin: -1.2,
            yMax: 1.25,
            xGrid: 4,
            yGrid: 4,
            xTicks: [[0, '0'], [0.5, '0.5'], [1, '1']],
            yTicks: [[-1, '-1'], [0, '0'], [1, '+1']],
            title: 'x(t) 与 ' + cur.name + ' (ρ=' + cur.rho.toFixed(2) + ')'
          });
          env.viz.drawCurve(ctx, ax1, xFn, { color: P.cyan, lineWidth: 2.2 });
          env.viz.drawCurve(ctx, ax1, cur.fn, { color: P.amber, lineWidth: 2.2 });
          env.viz.drawCurve(ctx, ax1, function (t) { return xFn(t) * cur.fn(t); }, {
            color: cur.rho < 0 ? P.pink : P.green,
            dash: [4, 3],
            lineWidth: 1.6,
            fillAlpha: 0.18
          });

          var ax2 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: 0.4,
            xMax: 4.6,
            yMin: -1.2,
            yMax: 2.35,
            xGrid: 4,
            yGrid: 4,
            xTicks: [[1, 'g₁'], [2, 'g₂(最佳)'], [3, 'g₃'], [4, 'g₄']],
            yTicks: [[-1, '-1'], [0, '0'], [1, '+1'], [2, '2E']],
            title: boxes[1].w < 460 ? 'ρ(柱) vs 距离 d²/2E' : '四候选相关系数 ρ 与平方距离 d²/(2E)=1-ρ'
          });
          var stems = [];
          for (var i = 0; i < 4; i++) {
            var hi = i === idx;
            var dNorm = 1 - cands[i].rho;
            stems.push({ x: i + 0.85, y: cands[i].rho, color: hi ? P.amber : P.cyan, width: hi ? 7 : 5, label: cands[i].rho.toFixed(2) });
            stems.push({ x: i + 1.15, y: dNorm, color: i === 1 ? P.green : P.muted, width: hi ? 7 : 5, label: 'd²=' + (2 * dNorm).toFixed(1) + 'E' });
          }
          env.viz.drawStems(ctx, ax2, stems, {});
        }
      },
      {
        id: 's06',
        tag: '作业精讲',
        hwCode: '2.7-2',
        title: 'Gram-Schmidt 正交化算法 + HW1 作业 2.7-2 四维基',
        slideRef: '02sigsys pp.31, 38 + HW1 · 2.7-2',
        terms: [
          { en: 'Gram-Schmidt Procedure', zh: '格拉姆-施密特正交化' },
          { en: 'Orthonormal Basis', zh: '标准正交基' }
        ],
        symbols: [
          { sym: '\\varphi_1,\\varphi_2,\\varphi_3,\\varphi_4', desc: '4 维标准正交基函数（g₂=-x 被吸收）', color: P.green },
          { sym: 'g_4\' = g_4 - \\frac{2}{\\pi}\\varphi_1', desc: '减掉在 φ₁ 上的投影后的正交残差', color: P.amber }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: 'g_2=-x\\text{ 线性相关} \\implies \\text{空间维数为 }4;\\quad \\varphi_1=\\sqrt{2}\\sin2\\pi t,\\;\\varphi_2=\\sqrt{2}\\sin4\\pi t,\\;\\varphi_3=1', label: '前三个信号本身两两正交，直接归一化' },
          { step: 1, latex: '\\langle g_4,\\varphi_1\\rangle=\\frac{2}{\\pi},\\quad E_{g_4\'}=\\frac{1}{2}-\\frac{4}{\\pi^2}\\approx 0.0947 \\implies \\varphi_4=\\frac{g_4-\\frac{2}{\\pi}\\varphi_1}{\\sqrt{0.0947}}', label: 'g₄ 减去 φ₁ 方向分量后归一化，得到第 4 维基' },
          { step: 2, latex: 'x=(0.707,0,0,0),\\;g_1=(0,0.707,0,0),\\;g_2=(-0.707,0,0,0),\\;g_3=(0,0,0.707,0),\\;g_4=(0.637,0,0,0.308)', label: '5 个信号在 4 维基底下的精确坐标' }
        ],
        sliders: [
          { key: 'part', label: '基底展示 (0=自动, 1~4=φ₁~φ₄)', min: 0, max: 4, step: 1, default: 0 }
        ],
        presets: [
          { label: '随讲解自动切换', values: { part: 0 } },
          { label: 'φ₁ = √2 sin(2πt)', values: { part: 1 } },
          { label: 'φ₂ = √2 sin(4πt)', values: { part: 2 } },
          { label: 'φ₃ = 1 (直流基底)', values: { part: 3 } },
          { label: 'φ₄ (g₄ 去投影残差)', values: { part: 4 } }
        ],
        lines: [
          {
            step: 0,
            sub: '接着看作业 2.7-2，用刚才 5 个信号构建标准正交基！因为 $g_2 = -x$ 线性相关，信号空间只有 $4$ 维。前三个互相已经正交，直接除以各自根号能量 $\\sqrt{0.5}$ 归一化，得出 $\\varphi_1=\\sqrt{2}\\sin 2\\pi t$、$\\varphi_2=\\sqrt{2}\\sin 4\\pi t$、$\\varphi_3=1$。',
            tts: '接着做作业二点七杠二，用刚才这五个信号构建标准正交基。因为 g 二等于负 x，线性相关不占新维度，所以整个信号空间维数是四。前三个信号本来就彼此正交，直接除以根号能量归一化，就拿到前三个单位基函数。'
          },
          {
            step: 1,
            sub: '只剩方波 $g_4$ 与 $\\varphi_1$ 不正交，算得投影系数 $\\langle g_4, \\varphi_1 \\rangle = 2/\\pi \\approx 0.637$；它和 $\\varphi_2, \\varphi_3$ 均正交。从 $g_4$ 里剥离这段 $\\varphi_1$ 分量，剩下的毛刺残差能量为 $0.5 - 4/\\pi^2 \\approx 0.0947$，归一化即得第 4 维基 $\\varphi_4$！',
            tts: '第四个信号是方波 g 四，它和基函数一有投影交叠，投影系数是派分之二，约等于零点六三七；但它和基函数二、基函数三都正交。从方波里剥掉那一部分正弦投影，剩下的锯齿状残差能量大约零点零九四七，再归一化就得到第四维标准基！'
          },
          {
            step: 2,
            sub: '所有坐标瞬间明朗：$x, g_1, g_2, g_3$ 各占前三维正负 $0.707$ 轴线，而方波 $g_4$ 落在 $(\\varphi_1, \\varphi_4)$ 平面内，坐标是 $(0.637, 0, 0, 0.308)$，两平方相加刚好回到总能量 $0.5$！',
            tts: '这样一来五个信号的坐标就一目了然：x、g 一、g 二、g 三各自只落在前三个坐标轴的正负零点七零七位置；而方波 g 四位于一和四组成的平面里，坐标是零点六三七、零、零、零点三零八，平方和恰好等于总能量零点五！'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var gs = env.math.gramSchmidt4D();
          var sel = env.params.part !== undefined ? Math.round(env.params.part) : 0;
          var phiIdx = sel >= 1 && sel <= 4 ? sel - 1 : (env.step === 0 ? 0 : 3);
          var names = ['φ₁ = √2 sin(2πt)', 'φ₂ = √2 sin(4πt)', 'φ₃ = 1', 'φ₄ = g₄\'/√0.0947'];
          var cols = [P.cyan, P.purple, P.pink, P.green];

          var ax1 = env.viz.drawAxes(ctx, boxes[0], {
            xMin: 0,
            xMax: 1,
            yMin: -2.0,
            yMax: 2.0,
            xGrid: 4,
            yGrid: 4,
            xTicks: [[0, '0'], [0.5, '0.5'], [1, '1']],
            yTicks: [[-1.5, '-1.5'], [0, '0'], [1.5, '+1.5']],
            title: phiIdx === 3 ? 'g₄ 剥离 (2/π)φ₁ → φ₄' : names[phiIdx]
          });
          if (phiIdx === 3) {
            env.viz.drawCurve(ctx, ax1, function (t) { return t < 0.5 ? Math.SQRT1_2 : -Math.SQRT1_2; }, { color: P.amber, lineWidth: 2.0 });
            env.viz.drawCurve(ctx, ax1, function (t) { return gs.projCoeff * gs.phi[0](t); }, { color: P.cyan, dash: [5, 3], lineWidth: 1.8 });
            env.viz.drawCurve(ctx, ax1, gs.phi[3], { color: P.green, lineWidth: 2.2 });
          } else {
            env.viz.drawCurve(ctx, ax1, gs.phi[phiIdx], { color: cols[phiIdx], lineWidth: 2.4, fillAlpha: 0.16 });
          }

          // Panel 2: (φ₁, φ₄) plane projection + 4D coordinates card
          var b1 = boxes[1];
          env.viz.drawPhasorWheel(ctx, b1, {
            mode: 'phasor',
            title: b1.w < 460 ? '(φ₁, φ₄) 正交分解面' : '(φ₁, φ₄) 平面几何：g₄ = 0.637φ₁ + 0.308φ₄',
            vectors: [
              { mag: 0.707, angle: 0, color: P.cyan, label: 'x(0.707,0)' },
              { mag: 0.707, angle: Math.PI, color: P.red, label: 'g₂(-0.707,0)' },
              { mag: gs.projCoeff, angle: 0, color: P.purple, width: 2.0, label: '投影0.637' },
              { mag: 0.707, angle: Math.atan2(gs.remNorm, gs.projCoeff), color: P.amber, width: 2.8, label: 'g₄(0.637,0.308)' },
              { mag: gs.remNorm, angle: Math.PI / 2, color: P.green, width: 2.2, label: '残差0.308' }
            ]
          });
        }
      }
    ]
  });
})(window);
