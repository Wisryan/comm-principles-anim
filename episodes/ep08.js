(function (global) {
  'use strict';

  var P = global.COMM_VIZ.PALETTE;

  global.COMM_EPISODES.push({
    id: 'ep08',
    chapter: 'Ch.04 角度调制（上）',
    title: '为什么朴素“频率乘 t”会失败？瞬时频率与 PM/FM 统一公式',
    slideDeck: '04AngM_XC_PKU.pdf',
    slideRange: 'pp. 1–19',
    homeworkTags: ['HW2 · 5.1-3'],
    scenes: [
      {
        id: 's00',
        tag: '直觉',
        title: '角度调制 False Start 惨案：为什么不能直接写 cos([ωc + kf·m(t)]t)？',
        slideRef: '04AngM pp.3–5',
        terms: [
          { en: 'Angle Modulation', zh: '角度调制（FM 与 PM 统称）' },
          { en: 'Phase Continuity', zh: '相位连续性' },
          { en: 'Instantaneous Phase', zh: '瞬时相位' }
        ],
        symbols: [
          { sym: '\\omega_c t + k_f m(t) t', desc: '错误直觉：直接乘 t 导致跳变瞬间相位暴跳 t₀Δω', color: P.red },
          { sym: '\\omega_c t + k_f\\!\\int_{-\\infty}^{t} m(\\tau)\\,d\\tau', desc: '正确 FM 相位：累积过去所有面积，永远平滑衔接', color: P.green }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: 's_{\\text{naive}}(t) = A\\cos\\big([\\omega_c + k_f m(t)]t\\big) \\quad\\text{（历史误区：以为 }k_f\\text{ 极小就能把带宽缩成 }0\\text{）}', label: 'False Start：早期把频率直接乘时间 t 的天真写法' },
          { step: 1, latex: '\\Delta\\theta(t_0) = t_0\\,k_f\\Delta m,\\qquad \\omega_i(t) = \\frac{d\\theta}{dt} = \\omega_c + k_f m(t) + k_f\\,t\\,m\'(t)', label: '灾难根源：t 越大跳变撕裂越惨，额外冒出 t·m\'(t) 项' },
          { step: 2, latex: '\\theta_{\\text{FM}}(t) = \\omega_c t + k_f\\!\\int_{-\\infty}^{t} m(\\tau)\\,d\\tau \\quad\\Longleftrightarrow\\quad \\text{每段阶梯必须接续前面全部历史相位}', label: '正确 FM：必须用积分累加历史，无法摆脱记忆效应' }
        ],
        sliders: [
          { key: 'tJump', label: '阶梯跳变时刻 t₀ (s)', min: 0.8, max: 3.8, step: 0.2, default: 2.8 },
          { key: 'kfVal', label: '频偏强度参数', min: 1.0, max: 4.0, step: 0.5, default: 2.5 }
        ],
        presets: [
          { label: '晚期跳变惨案 (t₀=3.4s)', values: { tJump: 3.4, kfVal: 2.5 } },
          { label: '早期跳变对比 (t₀=1.0s)', values: { tJump: 1.0, kfVal: 2.5 } }
        ],
        lines: [
          {
            step: 0,
            sub: '历史上大家刚琢磨调频时有个天真想法：AM 带宽至少要 $2B$，那我把载波写成 $\\cos([\\omega_c + k_f m(t)]t)$，让 $k_f$ 小到极致，频率只在 $\\omega_c \\pm k_f m_p$ 之间抖动，岂不是零带宽通信？',
            tts: '历史上大家刚琢磨调频时有个天真想法：调幅带宽至少要两倍基带带宽，那我把载波直接写成余弦欧米伽 c 加 k f 乘 m t 再整体乘时间 t，让 k f 小到极致，频率就只在一个极窄缝里晃动，岂不是零带宽通信？'
          },
          {
            step: 1,
            sub: '然而这会酿成灾难！看红色曲线：假设消息 $m(t)$ 在 $t_0$ 时刻只跳变了一小步 $\\Delta m$，因为外面乘了越来越大的时间 $t_0$，相位瞬间暴增 $t_0 k_f \\Delta m$，波形直接撕裂断层；拖动滑块把 $t_0$ 往后拉，撕裂越来越离谱！',
            tts: '然而这会酿成巨大惨案。看画面上的红色曲线：哪怕消息在 t 零时刻只跳高了一小步，因为公式外面直接乘着越来越大的时间 t，相位会在跳变瞬间暴增 t 零乘以频偏，波形当场撕裂断层。你把跳变时刻滑块往后拖，撕裂会越往后越离谱！'
          },
          {
            step: 2,
            sub: '就算你把 $m(t)$ 拆成一连串微小阶梯，每一段新波形的初相位也必须接住前面走完的所有角度，不能凭空归零重算！这就是为什么真正 FM 相位必须写成积分 $\\int_{-\\infty}^t m(\\tau)\\,d\\tau$——绿线永远平滑衔接，绝不跳变。',
            tts: '就算你把消息拆成一连串微小阶梯去近似，每一段新波形的起点也必须接住前面走完的所有相位角度，绝不能乘一个当前时间 t 凭空跳转。这就是为什么真正的调频相位必须写成对过去时间的积分，绿色曲线在跳变沿永远平滑衔接。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var t0 = env.params.tJump !== undefined ? env.params.tJump : 2.8;
          var kf = env.params.kfVal !== undefined ? env.params.kfVal : 2.5;
          var narrow = boxes[0].w < 460;

          function msg(t) {
            if (t < t0) return 0;
            if (t < t0 + 0.9) return 1.0;
            return -0.6;
          }
          function truePhi(t) {
            if (t < t0) return 0;
            if (t < t0 + 0.9) return kf * (t - t0);
            return kf * 0.9 - 0.6 * kf * (t - (t0 + 0.9));
          }
          function naivePhi(t) {
            return kf * msg(t) * t;
          }

          // Panel 1: Phase comparison (naive jump vs true continuous integral)
          var ax1 = env.viz.drawAxes(ctx, boxes[0], {
            xMin: 0,
            xMax: 5.0,
            yMin: -4.5,
            yMax: 12.5,
            xGrid: 5,
            yGrid: 4,
            xTicks: [[0, '0'], [t0, 't₀=' + t0.toFixed(1)], [5, '5s']],
            yTicks: [[0, '0'], [5, '5'], [10, '10']],
            title: narrow ? '相位 φ(t): 红错跳 vs 绿连续' : '附加相位 φ(t) 对比：错乘 t 导致跳变断层 vs 积分连续衔接'
          });
          env.viz.drawShadedBand(ctx, ax1, t0 - 0.06, t0 + 0.06, 'rgba(251, 113, 133, 0.22)', 't₀');
          env.viz.drawCurve(ctx, ax1, function (t) { return msg(t) * 2.2; }, { color: P.amber, dash: [4, 3], lineWidth: 1.5 });
          env.viz.drawCurve(ctx, ax1, naivePhi, { samples: 400, color: P.red, lineWidth: 2.1 });
          env.viz.drawCurve(ctx, ax1, truePhi, { samples: 400, color: P.green, lineWidth: 2.4 });
          env.viz.drawAnnotation(ctx, ax1, Math.min(4.5, t0 + 0.45), Math.min(11.3, kf * t0 + 0.4), '跳变 Δφ=' + (kf * t0).toFixed(1) + ' rad!', P.red, 'center');
          env.viz.drawAnnotation(ctx, ax1, 1.3, -3.7, '黄虚线: 阶梯 m(t)  绿实线: 积分 ∫m', P.green, 'center');

          // Panel 2: Resulting waveforms
          var wc = 11.0;
          var ax2 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: 0,
            xMax: 5.0,
            yMin: -2.7,
            yMax: 2.7,
            xGrid: 5,
            yGrid: 2,
            xTicks: [[0, '0'], [t0, 't₀'], [5, '5s']],
            yTicks: [[-1.3, '真FM'], [1.3, '错式']],
            title: narrow ? '波形对比: 上撕裂 vs 下平滑' : '调制波形对比：上错乘 t 在 t₀ 撕裂 vs 下真 FM 连续过渡'
          });
          env.viz.drawShadedBand(ctx, ax2, t0 - 0.06, t0 + 0.06, 'rgba(251, 113, 133, 0.20)', '');
          env.viz.drawCurve(ctx, ax2, function (t) {
            return 1.3 + 0.92 * Math.cos(wc * t + naivePhi(t));
          }, { samples: 650, color: P.red, lineWidth: 1.8 });
          env.viz.drawCurve(ctx, ax2, function (t) {
            return -1.3 + 0.92 * Math.cos(wc * t + truePhi(t));
          }, { samples: 650, color: P.cyan, lineWidth: 1.9 });
          env.viz.drawAnnotation(ctx, ax2, t0, 2.25, '相位撕裂断口', P.red, 'center');
          env.viz.drawAnnotation(ctx, ax2, t0, -0.35, '无缝平滑变频', P.green, 'center');
        }
      },
      {
        id: 's01',
        tag: '推导',
        title: '广义相位角 θ(t)、瞬时频率 ωi(t) = dθ/dt 与漏积分号勘误',
        slideRef: '04AngM pp.6–8',
        terms: [
          { en: 'Instantaneous Frequency', zh: '瞬时频率（相位对时间的导数）' },
          { en: 'Phase Deviation φ(t)', zh: '瞬时附加相偏' },
          { en: 'Frequency Sensitivity kf', zh: '调频灵敏度' }
        ],
        symbols: [
          { sym: '\\theta(t) = \\omega_c t + \\phi(t)', desc: '广义总相位角（含载波线性角与调制相偏）', color: P.cyan },
          { sym: '\\omega_i(t) = \\frac{d\\theta(t)}{dt}', desc: '瞬时角频率：相当于相位路程曲线在 t 处的瞬时斜率', color: P.amber },
          { sym: '\\phi_{\\text{FM}}(t) = k_f\\!\\int_{-\\infty}^{t} m(\\tau)\\,d\\tau', desc: 'FM 相偏为消息面积累积；PM 为 k_p m(t)', color: P.green }
        ],
        errata: '⚠️ 课件勘误（04AngM p.6）：第 6 页底部写 Assume θ₀=0 时将 s_FM(t) 错印漏掉了积分号，写成了 $\\cos[(\\omega_c + k_f m(t))t]$；紧接着第 7 页推导即改回了正确的积分形式 $\\cos\\big(\\omega_c t + k_f\\!\\int_0^t m(\\tau)\\,d\\tau\\big)$，复习切勿被 p.6 误导！',
        formulas: [
          { step: 0, latex: 's(t) = A_c\\cos\\theta(t),\\qquad \\theta(t) = \\omega_c t + \\phi(t)', label: '角度调制统一模型：幅度恒为 Ac，信息全藏在总相位 θ(t)' },
          { step: 1, latex: '\\omega_i(t) \\triangleq \\frac{d\\theta(t)}{dt} = \\omega_c + \\frac{d\\phi(t)}{dt} \\iff \\theta(t) = \\int_{-\\infty}^{t} \\omega_i(\\tau)\\,d\\tau', label: '物理直觉：相位是走过的总路程，瞬时频率是此刻油门速度' },
          { step: 2, latex: '\\phi_{\\text{PM}}(t) = k_p m(t) \\;(\\omega_i = \\omega_c + k_p m\'(t)) \\quad\\big|\\quad \\phi_{\\text{FM}}(t) = k_f\\!\\int_0^t m(\\tau)\\,d\\tau \\;(\\omega_i = \\omega_c + k_f m(t))', label: 'PM 让相偏追随 m(t)；FM 让频偏追随 m(t)（积分才能求导变回 m）' }
        ],
        sliders: [
          { key: 'tStar', label: '观察时刻指针 t* (s)', min: 0.4, max: 3.6, step: 0.1, default: 1.6 },
          { key: 'kf', label: '调频斜率 kf', min: 1.0, max: 5.0, step: 0.5, default: 3.0 }
        ],
        presets: [
          { label: '踩油门加速峰 (t*=1.0s)', values: { tStar: 1.0, kf: 3.0 } },
          { label: '滑行最大累计相位 (t*=2.0s)', values: { tStar: 2.0, kf: 3.0 } },
          { label: '反向减速恢复 (t*=3.0s)', values: { tStar: 3.0, kf: 3.0 } }
        ],
        lines: [
          {
            step: 0,
            sub: '把调角信号统一写作 $A_c\\cos\\theta(t)$。记住右方勘误框：课件第 6 页底部的 FM 公式印漏了积分号，真正决定“瞬时（instantaneous）”概念的是总相位角 $\\theta(t) = \\omega_c t + \\phi(t)$！',
            tts: '把调相和调频统一写成 A c 乘余弦西塔 t。记住右边勘误提示：课件第 6 页底下把调频公式印漏了积分号，千万别背错。真正理解瞬时频率，要抓住总相位角西塔 t 等于欧米伽 c t 加附加相偏法伊 t。'
          },
          {
            step: 1,
            sub: '用开车瞬间秒懂导数关系：**总相位 $\\theta(t)$ 就是表盘上累积走过的总里程，而瞬时频率 $\\omega_i(t) = d\\theta/dt$ 就是此刻踩油门的瞬时车速！**图中黄线在 $t^*$ 处的切线斜率越大，此刻波浪就越密集！',
            tts: '用开车瞬间秒懂这里的微积分：总相位角就是里程表走过的总路程，而瞬时频率等于相位对时间求导，就是此刻踩油门的速度。看图上 t 星号处的切线斜率：切线越陡，此刻频率就越高，波形也就越密。'
          },
          {
            step: 2,
            sub: '反过来，速度对时间积分才是路程：所以当信息直接充当相偏 $\\phi_{\\text{PM}}(t) = k_p m(t)$ 就是**调相 PM**；当信息充当额外车速，必须先积分成路程 $\\phi_{\\text{FM}}(t) = k_f \\int m(\\tau)\\,d\\tau$，才是**调频 FM**！',
            tts: '反过来，速度对时间积分才能变成路程。所以当消息直接决定附加相偏时就是调相 P M；当消息直接决定瞬时频率偏移时，它充当的是速度，必须先积分累加出路程才能放进余弦括号里，这就是调频 F M。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var tStar = env.params.tStar !== undefined ? env.params.tStar : 1.6;
          var kf = env.params.kf !== undefined ? env.params.kf : 3.0;
          var narrow = boxes[0].w < 460;

          function msg(t) {
            return Math.sin(Math.PI * t / 2);
          }
          function phi(t) {
            return kf * (2 / Math.PI) * (1 - Math.cos(Math.PI * t / 2));
          }

          // Panel 1: Speed m(t) (shaded integral up to t*) and distance phi(t) with tangent slope
          var ax1 = env.viz.drawAxes(ctx, boxes[0], {
            xMin: 0,
            xMax: 4.0,
            yMin: -1.4,
            yMax: 7.2,
            xGrid: 4,
            yGrid: 4,
            xTicks: [[0, '0'], [1, '1s'], [2, '2s'], [3, '3s'], [4, '4s']],
            yTicks: [[-1, '-1'], [0, '0'], [3, '3'], [6, '6']],
            title: narrow ? '速度 m(t) 积分 → 相偏 φ(t)' : '物理图景：黄线 m(t) 面积积分 = 蓝线累积相偏 φ(t)'
          });
          env.viz.drawShadedBand(ctx, ax1, 0, tStar, 'rgba(251, 191, 36, 0.14)', '');
          env.viz.drawCurve(ctx, ax1, msg, { color: P.amber, lineWidth: 2.0, fillAlpha: 0.14 });
          env.viz.drawCurve(ctx, ax1, phi, { color: P.cyan, lineWidth: 2.4 });

          // Tangent line on phi(t) at tStar
          var phi0 = phi(tStar);
          var slope = kf * msg(tStar);
          env.viz.drawCurve(ctx, ax1, function (t) {
            return phi0 + slope * (t - tStar);
          }, { from: Math.max(0.05, tStar - 0.55), to: Math.min(3.95, tStar + 0.55), color: P.green, lineWidth: 2.2, dash: [4, 3] });
          env.viz.drawStems(ctx, ax1, [
            { x: tStar, y: phi0, color: P.green, width: 2, label: '斜率=' + slope.toFixed(1) }
          ], {});

          // Panel 2: Resulting FM wave and instantaneous frequency curve
          var ax2 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: 0,
            xMax: 4.0,
            yMin: -1.5,
            yMax: 1.5,
            xGrid: 4,
            yGrid: 2,
            xTicks: [[0, '0'], [tStar, 't*=' + tStar.toFixed(1)], [4, '4s']],
            yTicks: [[-1, '-Ac'], [0, '0'], [1, '+Ac']],
            title: narrow ? 'FM 波形 (红点=当前时刻)' : '对应 FM 调制波（切线斜率大处最密，斜率负处最疏）'
          });
          env.viz.drawShadedBand(ctx, ax2, tStar - 0.08, tStar + 0.08, 'rgba(52, 211, 153, 0.24)', '');
          var wc = 11.5;
          env.viz.drawCurve(ctx, ax2, function (t) {
            return Math.cos(wc * t + phi(t));
          }, { samples: 650, color: P.cyan, lineWidth: 2.0 });
          var yDot = Math.cos(wc * tStar + phi0);
          env.viz.drawStems(ctx, ax2, [
            { x: tStar, y: yDot, color: P.amber, width: 2, label: msg(tStar) > 0.2 ? '加密区' : (msg(tStar) < -0.2 ? '稀疏区' : '原载频') }
          ], {});
        }
      },
      {
        id: 's02',
        tag: '推导',
        title: 'PM 与 FM 本质同源：微积分前置转换 & 恒包络恒功率特性',
        slideRef: '04AngM pp.7–8',
        terms: [
          { en: 'Constant Envelope', zh: '恒定包络' },
          { en: 'Average Power', zh: '平均发射功率' },
          { en: 'Pre-differentiation / Integration', zh: '前置微分 / 前置积分等效' }
        ],
        symbols: [
          { sym: '\\text{PM}(m) \\equiv \\text{FM}(\\dot{m})', desc: '对消息先微分再 FM 调制，输出与 PM 完全相同', color: P.cyan },
          { sym: '\\text{FM}(m) \\equiv \\text{PM}(\\textstyle\\int m)', desc: '对消息先积分再 PM 调制，输出与 FM 完全相同', color: P.amber },
          { sym: 'P_{\\text{avg}} = A_c^2 / 2', desc: '恒包络带来平均功率恒定，不随 m(t) 强弱涨落', color: P.green }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: 'k_p m(t) = k_p\\!\\int_{-\\infty}^{t} \\dot{m}(\\tau)\\,d\\tau \\implies \\text{PM}(m, k_p) \\equiv \\text{FM}(\\dot{m}, k_f=k_p)', label: '同源等价 1：用 FM 硬件造 PM，只需前端加个微分器' },
          { step: 1, latex: 'k_f\\!\\int_0^t m(\\tau)\\,d\\tau = k_p\\Big(\\int_0^t m(\\tau)\\,d\\tau\\Big) \\implies \\text{FM}(m, k_f) \\equiv \\text{PM}\\!\\left(\\int_0^t m(\\tau)\\,d\\tau,\\; k_p=k_f\\right)', label: '同源等价 2：用 PM 硬件造 FM，只需前端加个积分器' },
          { step: 2, latex: 'P_{\\text{FM}} = P_{\\text{PM}} = \\lim_{T\\to\\infty}\\frac{1}{T}\\int_{-T/2}^{T/2} A_c^2\\cos^2(\\omega_c t + \\phi(t))\\,dt = \\frac{A_c^2}{2}', label: '核心优势：无论消息怎么摆动，调角波瞬时包络平如直尺' }
        ],
        sliders: [
          { key: 'mode', label: '等价结构 (0=造PM, 1=造FM)', min: 0, max: 1, step: 1, default: 0 },
          { key: 'amp', label: '载波振幅 Ac (V)', min: 0.6, max: 2.0, step: 0.2, default: 1.2 },
          { key: 'modDepth', label: '消息幅度倍数', min: 0.2, max: 1.5, step: 0.1, default: 0.8 }
        ],
        presets: [
          { label: '微分+FM = PM', values: { mode: 0, amp: 1.2, modDepth: 0.8 } },
          { label: '积分+PM = FM', values: { mode: 1, amp: 1.2, modDepth: 0.8 } },
          { label: '加大消息看恒功率', values: { mode: 1, amp: 1.2, modDepth: 1.5 } }
        ],
        lines: [
          {
            step: 0,
            sub: '从公式看，PM 和 FM 简直是双胞胎：把 $m(t)$ 先求一次导数 $\\dot{m}(t)$ 再送入 FM 调制器，积分把导数抵消掉，吐出来的就是货真价实的 **PM** 信号！',
            tts: '从公式上看，调相和调频简直是一对双胞胎。如果你手里只有一个调频器却想输出调相波，只需要把消息先求一次导数再喂进调频器，内部的积分把导数一抵消，出来的就是货真价实的调相波形。'
          },
          {
            step: 1,
            sub: '反过来，给 **PM** 相位调制器前面接一个积分器，再输入 $m(t)$，相位就变成 $k_f\\int m(\\tau)\\,d\\tau$，直接变成 **FM**！大名鼎鼎的 Armstrong 间接调频法正是靠这一招起家的。',
            tts: '反过来，给调相调制器前面接一个积分器再送入消息，附加相偏就变成了积分形式，直接摇身一变成为了调频波。后面第三集要学的阿姆斯特朗间接调频法，正是靠这手前置积分起家的。'
          },
          {
            step: 2,
            sub: '最后看一个极省心的物理特性：不管你把“消息幅度”滑块拉得多大，调角波 $\\cos(\\omega_c t + \\phi(t))$ 的包络永远钉死在 $\\pm A_c$，平均功率永远是 $A_c^2/2$；而粉红虚线的 AM 波功率却跟着消息拼命起伏！',
            tts: '最后看一个极省心的物理特性：不管你把消息幅度滑块调得多大，调角波的包络始终像直尺一样平直，平均发射功率永远锁死在 A c 平方除以二，不随说话声音大小起伏；对比之下，粉色虚线的调幅波包络和功率都在剧烈晃动。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var mode = Math.round(env.params.mode || 0);
          var Ac = env.params.amp !== undefined ? env.params.amp : 1.2;
          var depth = env.params.modDepth !== undefined ? env.params.modDepth : 0.8;
          var narrow = boxes[0].w < 460;

          // Panel 1: Equivalence block diagram
          var nodes = mode === 0 ? [
            { id: 'in', nx: 0.11, ny: 0.50, nw: 0.15, nh: 0.34, label: 'm(t)', color: P.amber },
            { id: 'pre', nx: 0.36, ny: 0.50, nw: 0.22, nh: 0.38, label: '微分器\nd/dt', color: P.cyan },
            { id: 'mod', nx: 0.63, ny: 0.50, nw: 0.22, nh: 0.38, label: 'FM 调制器\n∫ dt', color: P.green },
            { id: 'out', nx: 0.89, ny: 0.50, nw: 0.16, nh: 0.34, label: '等价输出\nPM 波', color: P.pink }
          ] : [
            { id: 'in', nx: 0.11, ny: 0.50, nw: 0.15, nh: 0.34, label: 'm(t)', color: P.amber },
            { id: 'pre', nx: 0.36, ny: 0.50, nw: 0.22, nh: 0.38, label: '积分器\n∫ dt', color: P.cyan },
            { id: 'mod', nx: 0.63, ny: 0.50, nw: 0.22, nh: 0.38, label: 'PM 调制器\n直接加相', color: P.green },
            { id: 'out', nx: 0.89, ny: 0.50, nw: 0.16, nh: 0.34, label: '等价输出\nFM 波', color: P.pink }
          ];
          var edges = [
            { from: 'in', to: 'pre', label: narrow ? '' : '输入' },
            { from: 'pre', to: 'mod', label: mode === 0 ? 'm\'(t)' : '∫m' },
            { from: 'mod', to: 'out', label: mode === 0 ? 'PM' : 'FM', color: P.green }
          ];
          var activeIds = ['pre', 'mod', 'out'];
          env.viz.drawBlockDiagram(ctx, boxes[0], nodes, edges, {
            time: env.time,
            activeId: activeIds[Math.min(2, env.step)],
            title: mode === 0 ? '前置微分 + FM = PM' : '前置积分 + PM = FM'
          });

          // Panel 2: Constant envelope vs AM envelope
          var pAvg = 0.5 * Ac * Ac;
          var ax2 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: 0,
            xMax: 2.0,
            yMin: -2.9,
            yMax: 2.9,
            xGrid: 4,
            yGrid: 4,
            xTicks: [[0, '0'], [1, '1s'], [2, '2s']],
            yTicks: [[-Ac, '-Ac'], [0, '0'], [Ac, '+Ac']],
            title: narrow ? '恒包络 P=' + pAvg.toFixed(2) + 'W' : '恒包络对比：FM/PM 功率恒为 Ac²/2 = ' + pAvg.toFixed(2) + ' W'
          });
          env.viz.drawCurve(ctx, ax2, function (t) {
            return Ac * (1 + 0.45 * depth * Math.cos(Math.PI * 2 * t));
          }, { color: P.pink, dash: [4, 3], lineWidth: 1.5 });
          env.viz.drawCurve(ctx, ax2, function () { return Ac; }, { color: P.green, dash: [5, 4], lineWidth: 1.5 });
          env.viz.drawCurve(ctx, ax2, function () { return -Ac; }, { color: P.green, dash: [5, 4], lineWidth: 1.5 });
          env.viz.drawCurve(ctx, ax2, function (t) {
            var ph = mode === 0
              ? 3.2 * depth * Math.cos(2 * Math.PI * t)
              : 3.2 * depth * Math.sin(2 * Math.PI * t);
            return Ac * Math.cos(28 * t + ph);
          }, { samples: 650, color: P.cyan, lineWidth: 1.9 });
          env.viz.drawAnnotation(ctx, ax2, 1.0, Math.min(2.65, Ac + 0.2), '绿线恒包络 ±Ac · 粉虚线为 AM 起伏包络', P.green, 'center');
        }
      },
      {
        id: 's03',
        tag: '课件例题',
        title: '课件 Ex 5.2：双极性方波调出的 FM (CP-FSK) 与 PM (PSK) + 跳变冲激',
        slideRef: '04AngM pp.8–10',
        terms: [
          { en: 'CP-FSK (Continuous-Phase FSK)', zh: '连续相位频移键控' },
          { en: 'PSK (Phase Shift Keying)', zh: '相移键控' },
          { en: 'Dirac Impulse in Derivative', zh: '阶跃跳变导数中的冲激' }
        ],
        symbols: [
          { sym: 'f_i \\in \\{99.9,\\; 100.1\\}\\text{ MHz}', desc: 'Ex 5.2 方波 FM：m=±1 时在两载频间无缝切换', color: P.cyan },
          { sym: '\\mp A\\sin(\\omega_c t)', desc: 'Ex 5.2 方波 PM (kp=π/2)：在跳变沿瞬间相位反转', color: P.pink },
          { sym: '\\dot{m}(t) \\supset \\pm 2\\delta(t-t_k)', desc: '跳变沿对 PM 瞬时频率产生冲激（理论需无限带宽）', color: P.red }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: 'f_c = 100\\text{ MHz},\\; k_f = 2\\pi\\times 10^5 \\implies f_i = \\begin{cases}100.1\\text{ MHz}, & m(t)=+1\\\\ 99.9\\text{ MHz}, & m(t)=-1\\end{cases}\\;(\\text{CP-FSK})', label: 'Ex 5.2 (a) 方波 FM：瞬时频率两档切换，但积分相位连续' },
          { step: 1, latex: 'k_p = \\frac{\\pi}{2} \\implies s_{\\text{PM}}(t) = A\\cos\\!\\left(\\omega_c t \\pm \\frac{\\pi}{2}\\right) = \\begin{cases}-A\\sin\\omega_c t, & m(t)=+1\\\\ +A\\sin\\omega_c t, & m(t)=-1\\end{cases}\\;(\\text{PSK})', label: 'Ex 5.2 (b) 方波 PM：跳变沿发生 180° 相位翻转' },
          { step: 2, latex: '\\Delta f_{\\text{range}} = 0.2\\text{ MHz} \\neq B_{\\text{FM}},\\qquad \\text{方波沿跳变} \\implies \\omega_{i,\\text{PM}} \\to \\infty \\;(\\text{需无限带宽})', label: '必考结论：瞬时频率摆幅不等于信号带宽，方波 PM 沿处带宽无穷大' }
        ],
        sliders: [
          { key: 'view', label: '切换查看 (0=FM, 1=PM)', min: 0, max: 1, step: 1, default: 0 },
          { key: 'kpPi', label: 'PM 相偏倍数 kp/π', min: 0.25, max: 0.75, step: 0.25, default: 0.5 }
        ],
        presets: [
          { label: 'Ex 5.2 FM (CP-FSK)', values: { view: 0, kpPi: 0.5 } },
          { label: 'Ex 5.2 PM (PSK, kp=π/2)', values: { view: 1, kpPi: 0.5 } }
        ],
        lines: [
          {
            step: 0,
            sub: '来看课件经典例题 Ex 5.2：输入 $m(t)$ 是正负 $1$ 交替的数字方波。先看 **FM**：$f_c=100\\text{ MHz}$，正一对应 $100.1\\text{ MHz}$ 密波，负一对应 $99.9\\text{ MHz}$ 疏波。注意虽然频率突变，因为相位是面积积分，波形在跳变沿完全连续不断裂，这就是大名鼎鼎的连续相位 **CP-FSK**！',
            tts: '来看课件经典例题五点二：输入是一个在正一和负一之间跳变的数字方波。先看调频模式：中心载频一百兆赫兹，发正一时跳到一百点一兆赫兹变密，发负一时跳到九十九点九兆赫兹变疏。注意虽然频率在跳，因为相位靠面积积分而来，波形在切换瞬间严丝合缝，这就是连续相位频移键控。'
          },
          {
            step: 1,
            sub: '把滑块切到 **PM**：当 $k_p = \\pi/2$ 时，$m=+1$ 是 $-A\\sin\\omega_c t$，$m=-1$ 是 $+A\\sin\\omega_c t$。一旦方波在边沿跳变，输出波立刻在原地猛翻 $180^\\circ$ 撕裂掉头——这就是数字通信里的相移键控 **PSK**！',
            tts: '把滑块切到调相模式：按照例题取 k p 等于二分之派，正一对应负正弦，负一对应正正弦。每当方波在边沿跳变，调相波就在原地硬生生翻转一百八十度掉头，这就是数字通信里的相移键控 P S K。'
          },
          {
            step: 2,
            sub: '最后死记课件两句红字考题：第一，方波 **FM** 瞬时频率只在 $99.9\\sim 100.1\\text{ MHz}$ 间差了 $0.2\\text{ MHz}$，但方波本身有无穷高频谐波，所以**瞬时频率范围绝不等于真正带宽**！第二，方波 **PM** 的导数 $\\dot{m}(t)$ 在边沿冒出 $\\delta$ 冲激，物理上要维持这种瞬间直角折返需要**无穷大带宽**！',
            tts: '最后记牢课件上两句核心考题结论：第一，方波调频的瞬时频率范围只有零点二兆赫兹，但方波本身含无穷高频分量，所以瞬时频率范围绝对不等于信号带宽；第二，方波调相在边沿导数出现狄拉克冲激，想要支撑这种瞬间掉头需要无穷大的理论带宽。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var view = Math.round(env.params.view || 0);
          var kpPi = env.params.kpPi !== undefined ? env.params.kpPi : 0.5;
          var narrow = boxes[0].w < 460;

          function sq(t) {
            return (Math.floor(t) % 2 === 0) ? 1 : -1;
          }
          var sqInt = env.math.integrateSignal(sq, 0, 3.0, 1200);

          // Panel 1: Square wave m(t) + integral (cyan) or derivative impulses (red arrows)
          var ax1 = env.viz.drawAxes(ctx, boxes[0], {
            xMin: 0,
            xMax: 3.0,
            yMin: -1.6,
            yMax: 1.6,
            xGrid: 3,
            yGrid: 2,
            xTicks: [[0, '0'], [1, 'T'], [2, '2T'], [3, '3T']],
            yTicks: [[-1, '-1'], [0, '0'], [1, '+1']],
            title: view === 0 ? (narrow ? 'm(t) 方波与积分相偏' : '方波 m(t) 与连续积分相偏 ∫m(τ)dτ (用于 FM)') : (narrow ? 'm(t) 方波与跳变冲激' : '方波 m(t) 与跳变沿导数冲激 ±2δ (用于 PM)')
          });
          env.viz.drawStepCurve(ctx, ax1, [[0, 1], [1, -1], [2, 1], [3, 1]], { color: P.amber, lineWidth: 2.3 });
          if (view === 0) {
            env.viz.drawCurve(ctx, ax1, function (t) { return sqInt.at(t); }, { from: 0, to: 3.0, color: P.cyan, lineWidth: 2.0 });
            env.viz.drawAnnotation(ctx, ax1, 1.5, 1.05, '三角积分连续→CP-FSK无断点', P.cyan, 'center');
          } else {
            env.viz.drawStems(ctx, ax1, [
              { x: 1, y: -1.35, color: P.red, width: 2.5, arrow: true, label: '-2δ' },
              { x: 2, y: 1.35, color: P.red, width: 2.5, arrow: true, label: '+2δ' }
            ], {});
          }

          // Panel 2: Resulting FM (CP-FSK) or PM (PSK) modulated wave
          var ax2 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: 0,
            xMax: 3.0,
            yMin: -1.45,
            yMax: 1.45,
            xGrid: 3,
            yGrid: 2,
            xTicks: [[0, '0'], [1, 'T'], [2, '2T'], [3, '3T']],
            yTicks: [[-1, '-A'], [0, '0'], [1, '+A']],
            title: view === 0 ? 'FM: CP-FSK (100.1 / 99.9 MHz)' : 'PM: PSK (kp=' + kpPi.toFixed(2) + 'π 沿处撕裂)'
          });
          env.viz.drawShadedBand(ctx, ax2, 0.96, 1.04, view === 0 ? 'rgba(52, 211, 153, 0.22)' : 'rgba(251, 113, 133, 0.24)', '');
          env.viz.drawShadedBand(ctx, ax2, 1.96, 2.04, view === 0 ? 'rgba(52, 211, 153, 0.22)' : 'rgba(251, 113, 133, 0.24)', '');

          if (view === 0) {
            env.viz.drawCurve(ctx, ax2, function (t) {
              return Math.cos(2 * Math.PI * (6.0 * t + 2.8 * sqInt.at(t)));
            }, { samples: 700, color: P.cyan, lineWidth: 2.0 });
            env.viz.drawAnnotation(ctx, ax2, 0.5, 1.12, '100.1MHz (密)', P.cyan, 'center');
            env.viz.drawAnnotation(ctx, ax2, 1.5, 1.12, '99.9MHz (疏)', P.amber, 'center');
            env.viz.drawAnnotation(ctx, ax2, 2.5, 1.12, '相位连续无断口', P.green, 'center');
          } else {
            env.viz.drawCurve(ctx, ax2, function (t) {
              return Math.cos(2 * Math.PI * 5.0 * t + kpPi * Math.PI * sq(t));
            }, { samples: 700, color: P.pink, lineWidth: 2.0 });
            env.viz.drawAnnotation(ctx, ax2, 1.0, 1.12, '跳变翻转!', P.red, 'center');
            env.viz.drawAnnotation(ctx, ax2, 2.0, 1.12, '跳变翻转!', P.red, 'center');
          }
        }
      },
      {
        id: 's04',
        tag: '易错辨析',
        title: '单值区陷阱：为什么离散跳跃 PM 必须限制 kp|m(t)| < π？',
        slideRef: '04AngM p.11',
        terms: [
          { en: 'Phase Ambiguity', zh: '相位模糊（2π 周期折叠）' },
          { en: 'Unambiguous Range [-π, π)', zh: '相位单值可辨区' }
        ],
        symbols: [
          { sym: 'k_p m(t) \\in [-\\pi, \\pi)', desc: '离散跳变消息必须满足的单值条件，否则正负电平重合', color: P.red },
          { sym: '\\cos(\\omega_c t + \\pi) \\equiv \\cos(\\omega_c t - \\pi)', desc: '当 kp=π 时，m=+1 与 m=-1 波形完全相同无法解码', color: P.amber }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: 'k_p = \\pi,\\; m(t) = \\pm 1 \\implies \\cos(\\omega_c t + \\pi) = -\\cos\\omega_c t = \\cos(\\omega_c t - \\pi)', label: '惨案现场：总跨度达到 2π 时，+1 和 -1 绕圆半圈撞在同一点' },
          { step: 1, latex: '\\text{非连续跳变 } m(t) \\implies \\text{必须约束 } k_p |m(t)| < \\pi \\;\\big(\\text{即 } k_p m(t)\\in[-\\pi,\\pi)\\big)', label: '防模糊铁律：接收机只能分辨 2π 周期内的唯一相位角' },
          { step: 2, latex: '\\text{连续信号 } m(t) \\;(\\text{如 }\\text{5.1-3 } k_p m_p=1.5\\pi) \\implies \\text{可连续跟踪展开，无需局限于 }[-\\pi,\\pi)', label: '重要例外：连续变化时可用历史连续性解卷绕，后面 5.1-3 就是例子' }
        ],
        sliders: [
          { key: 'kpPi', label: 'PM 相偏幅度 kp/π', min: 0.25, max: 1.25, step: 0.05, default: 1.0 }
        ],
        presets: [
          { label: '安全单值区 (kp=0.5π)', values: { kpPi: 0.5 } },
          { label: '模糊撞车点 (kp=1.0π!)', values: { kpPi: 1.0 } },
          { label: '超界卷绕混淆 (kp=1.2π)', values: { kpPi: 1.2 } }
        ],
        lines: [
          {
            step: 0,
            sub: '调相有个隐蔽大坑！把滑块停在 $k_p = \\pi$ 看相量圆盘：当方波 $m=+1$ 时，载波逆时针转 $+180^\\circ$；当 $m=-1$ 时，顺时针转 $-180^\\circ$——两个矢量**在正左方彻底撞在一起完全重合**！',
            tts: '调相有个非常隐蔽的考前大坑。把滑块停在 k p 等于派，看左边的相量圆盘：当方波发正一时，载波逆时针转一百八十度；当发负一时，顺时针转负一百八十度，两个矢量在正左方彻底撞在一起，变成完全相同的反相余弦！'
          },
          {
            step: 1,
            sub: '右边波形图也清楚证明：红蓝两条波一模一样，接收端根本无从分辨你发的是正一还是负一！因此对于离散跳变信号，为了避免 $2\\pi$ 相位模糊，必须硬性限制 $k_p m(t) \\in [-\\pi, \\pi)$。',
            tts: '右边波形图也清楚证明：两条波形严丝合缝地叠成一条线，接收端根本猜不出你发的是正一还是负一。因此对于不连续的跳变消息，为了避免二派相位模糊，必须硬性限制附加相偏落在负派到正派的单值区里。'
          },
          {
            step: 2,
            sub: '那要是连续信号呢？如果 $m(t)$ 像马上要讲的作业 5.1-3 三角波那样连续变化，相偏哪怕冲到了 $\\pm 1.5\\pi$ 也不会导致模糊，因为接收端能顺着连续轨迹一路展开追踪上去！',
            tts: '那么连续信号为什么可以豁免呢？因为如果消息像马上要讲的作业五点一杠三三角波那样连续过渡，附加相偏哪怕冲到一点五派也不会产生多解，接收端可以沿着连续的相位轨迹一路解卷绕追踪下去。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var kpPi = env.params.kpPi !== undefined ? env.params.kpPi : 1.0;
          var ang = kpPi * Math.PI;
          var collide = Math.abs((ang % Math.PI) - 0) < 0.08 && kpPi >= 0.9;
          var wrapped = kpPi >= 1.0;

          // Panel 1: Phasor wheel comparing +1 and -1 states
          env.viz.drawPhasorWheel(ctx, boxes[0], {
            mode: 'phasor',
            title: '相偏角 ±' + kpPi.toFixed(2) + 'π',
            subtitle: Math.abs(kpPi - 1.0) < 0.06 ? '⚠️ 两矢量重合!' : (wrapped ? '卷绕过界!' : '可区分单值区'),
            subtitleColor: wrapped ? P.red : P.green,
            vectors: [
              { mag: 0.72, angle: 0, color: P.muted, width: 1.4, label: '0°参考' },
              { mag: 0.95, angle: ang, color: P.cyan, width: 3.0, label: 'm=+1' },
              { mag: 0.95, angle: -ang, color: P.pink, width: 2.6, label: 'm=-1' }
            ]
          });

          // Panel 2: Waveforms for m=+1 vs m=-1
          var ax2 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: 0,
            xMax: 2.0,
            yMin: -1.45,
            yMax: 1.45,
            xGrid: 4,
            yGrid: 2,
            xTicks: [[0, '0'], [1, '1'], [2, '2']],
            yTicks: [[-1, '-A'], [0, '0'], [1, '+A']],
            title: Math.abs(kpPi - 1.0) < 0.06 ? '红蓝完全重合 → 解码彻底模糊!' : '蓝=m(+1) 粉=m(-1) 波形对比'
          });
          env.viz.drawCurve(ctx, ax2, function (t) {
            return Math.cos(2 * Math.PI * 2.5 * t + ang);
          }, { color: P.cyan, lineWidth: 2.8 });
          env.viz.drawCurve(ctx, ax2, function (t) {
            return Math.cos(2 * Math.PI * 2.5 * t - ang);
          }, { color: P.pink, dash: [6, 4], lineWidth: 2.2 });
          if (Math.abs(kpPi - 1.0) < 0.06 || collide) {
            env.viz.drawAnnotation(ctx, ax2, 1.0, 1.12, 'cos(ωct+π) ≡ cos(ωct−π) 无法区分!', P.red, 'center');
          }
        }
      },
      {
        id: 's05',
        tag: '作业精讲',
        hwCode: '5.1-3',
        title: 'HW2 作业 5.1-3：周期三角波下 FM vs PM 瞬时频率与波形全解',
        slideRef: 'HW2 · 5.1-3',
        terms: [
          { en: 'Instantaneous Frequency Deviation', zh: '瞬时频偏 Δf(t)' },
          { en: 'Piecewise Linear Slope', zh: '分段线性斜率 m\'(t)' }
        ],
        symbols: [
          { sym: 'T_0 = 0.25\\text{ s},\\; f_c = 1000\\text{ Hz}', desc: '周期信号（基频 4 Hz），峰值 mp=3，斜率 ±60 / 0', color: P.cyan },
          { sym: 'f_{i,\\text{FM}} = 1000 + 10\\,m(t)', desc: 'k_f=20π → 随 m(t) 线性在 970~1030 Hz 间变化', color: P.pink },
          { sym: 'f_{i,\\text{PM}} = 1000 + \\tfrac{1}{4}\\dot{m}(t)', desc: 'k_p=π/2 → 随导数跃变于 {985, 1000, 1015} Hz', color: P.green }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: 'm(t):\\; (-0.05\\to 0): 0\\!\\to\\!3\\;(\\dot{m}=+60),\\quad (0\\to 0.10): 3\\!\\to\\!-3\\;(\\dot{m}=-60),\\quad (0.10\\to 0.15): -3\\!\\to\\!0\\;(\\dot{m}=+60),\\quad (0.15\\to 0.20): 0', label: '先精准写出一个周期 T₀=0.25s 内各段数值与斜率' },
          { step: 1, latex: '\\textbf{(a) FM:}\\quad f_i(t) = f_c + \\frac{k_f}{2\\pi}m(t) = 1000 + 10\\,m(t) \\in [970,\\; 1030]\\text{ Hz}', label: 'FM 密疏看 m(t) 本身：t=0 (m=3) 最密 1030Hz，t=0.1 (m=-3) 最疏 970Hz' },
          { step: 2, latex: '\\textbf{(b) PM:}\\quad \\phi = \\frac{\\pi}{2}m(t) \\in \\left[-\\frac{3\\pi}{2},\\frac{3\\pi}{2}\\right],\\quad f_i(t) = 1000 + \\frac{\\dot{m}(t)}{4} = \\begin{cases}1015\\text{ Hz}, & \\dot{m}=+60\\\\ 985\\text{ Hz}, & \\dot{m}=-60\\\\ 1000\\text{ Hz}, & \\dot{m}=0\\end{cases}', label: 'PM 密疏看斜率 m\'(t)：上升段最密 1015Hz，下降段最疏 985Hz，平段载频' }
        ],
        sliders: [
          { key: 'viewMode', label: '切换对照 (0=fi曲线, 1=FM波, 2=PM波)', min: 0, max: 2, step: 1, default: 0 },
          { key: 'exag', label: '示意波频偏放大倍率', min: 1.0, max: 2.5, step: 0.5, default: 1.5 }
        ],
        presets: [
          { label: '瞬时频率 fi(t) 对照', values: { viewMode: 0, exag: 1.5 } },
          { label: '(a) FM 示意波形', values: { viewMode: 1, exag: 1.5 } },
          { label: '(b) PM 示意波形', values: { viewMode: 2, exag: 1.5 } }
        ],
        lines: [
          {
            step: 0,
            sub: '来看第二次作业第一题 **5.1-3**：消息 $m(t)$ 周期 $0.25\\text{ s}$，$-0.05$ 到 $0$ 线性升至 $3$（斜率 $+60$）；$0$ 到 $0.10$ 降到 $-3$（斜率 $-60$）；$0.10$ 到 $0.15$ 回 $0$（斜率 $+60$）；$0.15$ 到 $0.20$ 保持 $0$ 平段。载频 $f_c = 1000\\text{ Hz}$。',
            tts: '来看第二次作业第一题五点一杠三：消息 m t 周期零点二五秒，基频四赫兹。在负零点零五到零秒从零升到三，斜率正六十；零到零点一零秒降到负三，斜率负六十；零点一零到零点一五秒回到零，斜率正六十；零点一五到零点二零秒保持平坦为零。载频为一千赫兹。'
          },
          {
            step: 1,
            sub: '先解 **(a) FM** ($k_f=20\\pi$)：$f_i = 1000 + \\frac{20\\pi}{2\\pi}m(t) = 1000 + 10\\,m(t)$。所以 $f_i$ 在 **$970$ 到 $1030\\text{ Hz}$** 随 $m(t)$ 呈相同折线摆动！切到波形模式就能看到：$t=0$ 峰顶处载波最密，$t=0.1$ 谷底处最疏！',
            tts: '先解第一小问调频：k f 等于二十派，除以二派得十，所以瞬时频率等于一千加十倍的 m t。于是频率随波形在九百七十到一千零三十赫兹之间呈同形折线摆动。切到 F M 波形预设就能看到：t 等于零波峰处载波最密，t 等于零点一波谷处最疏。'
          },
          {
            step: 2,
            sub: '再解 **(b) PM** ($k_p=\\pi/2$)：相偏在 $\\pm \\frac{3\\pi}{2}$ 间连续变化，瞬时频率 $f_i = 1000 + \\frac{\\pi/2}{2\\pi}\\dot{m}(t) = 1000 + \\frac{1}{4}\\dot{m}(t)$！上升段（斜率 $+60$）恒为 $1015\\text{ Hz}$ 最密，下降段（$-60$）恒为 $985\\text{ Hz}$ 最疏，平段 $1000\\text{ Hz}$——变成**三阶方波频率**！',
            tts: '再解第二小问调相：k p 等于二分之派，除以二派得四分之一，所以瞬时频率等于一千加四分之一倍的导数。整个上升段斜率正六十，频率恒为一千零一十五赫兹最密；整个下降段斜率负六十，频率恒为九百八十五赫兹最疏；平段为一千赫兹，完美变成三阶方波频率！'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var viewMode = Math.round(env.params.viewMode || 0);
          var exag = env.params.exag !== undefined ? env.params.exag : 1.5;
          var narrow = boxes[0].w < 460;

          function mf(t) {
            return env.math.piecewiseLinear([
              [-0.10, 0],
              [-0.05, 0],
              [0.00, 3.0],
              [0.10, -3.0],
              [0.15, 0],
              [0.20, 0]
            ], t, 0.25);
          }
          function dmScaled(t) {
            var u = (((t + 0.10) % 0.25) + 0.25) % 0.25 - 0.10;
            if (u < -0.05) return 0;
            if (u < 0.00) return 60;
            if (u < 0.10) return -60;
            if (u < 0.15) return 60;
            return 0;
          }

          // Panel 1: Message m(t) & Derivative m'(t)/20
          var ax1 = env.viz.drawAxes(ctx, boxes[0], {
            xMin: -0.08,
            xMax: 0.32,
            yMin: -3.6,
            yMax: 3.6,
            xGrid: 4,
            yGrid: 4,
            xTicks: [[-0.05, '-0.05'], [0, '0'], [0.1, '0.1'], [0.2, '0.2'], [0.3, '0.3s']],
            yTicks: [[-3, '-3'], [0, '0'], [3, '+3']],
            title: narrow ? 'm(t) 与斜率 m\'/20' : '原消息 m(t) (青) 与导数阶梯 m\'(t)/20 (黄, 峰±60)'
          });
          env.viz.drawCurve(ctx, ax1, mf, { samples: 400, color: P.cyan, lineWidth: 2.3 });
          env.viz.drawCurve(ctx, ax1, function (t) { return dmScaled(t) / 20; }, { samples: 500, color: P.amber, dash: [4, 3], lineWidth: 1.7 });

          // Panel 2: Instantaneous frequency OR schematic modulated waveform
          if (viewMode === 0) {
            var ax2 = env.viz.drawAxes(ctx, boxes[1], {
              xMin: -0.08,
              xMax: 0.32,
              yMin: 960,
              yMax: 1040,
              xGrid: 4,
              yGrid: 4,
              xTicks: [[-0.05, '-0.05'], [0, '0'], [0.1, '0.1'], [0.2, '0.2'], [0.3, '0.3s']],
              yTicks: [[970, '970'], [1000, '1kHz'], [1030, '1030']],
              title: narrow ? 'fi(t): 粉FM vs 绿PM' : '瞬时频率 fi(t) 对比：FM [970,1030]Hz vs PM {985,1000,1015}Hz'
            });
            env.viz.drawCurve(ctx, ax2, function (t) { return 1000 + 10 * mf(t); }, { samples: 400, color: P.pink, lineWidth: 2.3 });
            env.viz.drawCurve(ctx, ax2, function (t) { return 1000 + 0.25 * dmScaled(t); }, { samples: 600, color: P.green, lineWidth: 2.2 });
            env.viz.drawAnnotation(ctx, ax2, 0.0, 1031, 'FM:1030', P.pink, 'center');
            env.viz.drawAnnotation(ctx, ax2, 0.1, 963, 'FM:970', P.pink, 'center');
            env.viz.drawAnnotation(ctx, ax2, 0.05, 978, 'PM:985', P.green, 'center');
            env.viz.drawAnnotation(ctx, ax2, 0.225, 1016, 'PM:1015', P.green, 'center');
          } else if (viewMode === 1) {
            var integ = env.math.integrateSignal(mf, -0.08, 0.32, 1600);
            var axF = env.viz.drawAxes(ctx, boxes[1], {
              xMin: -0.08,
              xMax: 0.32,
              yMin: -1.45,
              yMax: 1.45,
              xGrid: 4,
              yGrid: 2,
              xTicks: [[-0.05, '-0.05'], [0, '0'], [0.1, '0.1'], [0.2, '0.2'], [0.3, '0.3s']],
              yTicks: [[-1, '-A'], [0, '0'], [1, '+A']],
              title: narrow ? '(a) FM 波(示意放大)' : '(a) FM 示意波 (fc缩放至可视)：m大处密(1030Hz)，m小处疏(970Hz)'
            });
            env.viz.drawShadedBand(ctx, axF, -0.015, 0.015, 'rgba(244, 114, 182, 0.22)', '最密');
            env.viz.drawShadedBand(ctx, axF, 0.085, 0.115, 'rgba(56, 189, 248, 0.20)', '最疏');
            env.viz.drawCurve(ctx, axF, function (t) {
              return Math.cos(2 * Math.PI * (90 * (t + 0.08) + 18 * exag * integ.at(t)));
            }, { samples: 900, color: P.pink, lineWidth: 1.7 });
          } else {
            var axP = env.viz.drawAxes(ctx, boxes[1], {
              xMin: -0.08,
              xMax: 0.32,
              yMin: -1.45,
              yMax: 1.45,
              xGrid: 4,
              yGrid: 2,
              xTicks: [[-0.05, '-0.05'], [0, '0'], [0.1, '0.1'], [0.2, '0.2'], [0.3, '0.3s']],
              yTicks: [[-1, '-A'], [0, '0'], [1, '+A']],
              title: narrow ? '(b) PM 波(示意放大)' : '(b) PM 示意波：上升段密(1015Hz)，下降段疏(985Hz)，平段载频'
            });
            env.viz.drawShadedBand(ctx, axP, -0.05, 0.0, 'rgba(52, 211, 153, 0.20)', '上升密');
            env.viz.drawShadedBand(ctx, axP, 0.15, 0.20, 'rgba(148, 163, 184, 0.16)', '平段fc');
            env.viz.drawCurve(ctx, axP, function (t) {
              return Math.cos(2 * Math.PI * 90 * (t + 0.08) + exag * (Math.PI / 2) * mf(t));
            }, { samples: 900, color: P.green, lineWidth: 1.7 });
          }
        }
      }
    ]
  });
})(window);
