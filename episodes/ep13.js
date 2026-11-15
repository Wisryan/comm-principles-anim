(function (global) {
  'use strict';

  var P = global.COMM_VIZ.PALETTE;

  // Helper to build a custom ADPCM step-size adaptation trace vs fixed-step DM
  function simulateAdaptiveTrack(fn, tMin, tMax, Ts, initE, adaptive) {
    var out = [];
    var mq = 0;
    var E = initE;
    var lastBit = -1;
    var streak = 0;
    var nSteps = Math.floor((tMax - tMin) / Ts + 1e-9);
    for (var i = 0; i <= nSteps; i++) {
      var t = tMin + i * Ts;
      var m = fn(t);
      var diff = m - mq;
      var bit = diff >= 0 ? 1 : 0;
      if (adaptive) {
        if (bit === lastBit) {
          streak++;
          if (streak >= 2) E = Math.min(0.45, E * 1.38);
        } else {
          streak = 0;
          E = Math.max(0.035, E * 0.72);
        }
        lastBit = bit;
      }
      var stepE = bit === 1 ? E : -E;
      mq += stepE;
      out.push({ t: t, m: m, mq: mq, bit: bit, E: E, err: mq - m });
    }
    return out;
  }

  global.COMM_EPISODES.push({
    id: 'ep13',
    chapter: 'Ch.05 采样与量化（下）',
    title: '增量调制 DM、斜率过载与颗粒噪声、DPCM 与声码收官',
    slideDeck: '05sampling_XC_PKU',
    slideRange: 'pp. 47–61',
    homeworkTags: ['HW3 · 6.7-2'],
    scenes: [
      {
        id: 's00',
        tag: '推导',
        title: '为什么只编「比上一拍大还是小」？DM 1-bit 原理与极简收端',
        slideRef: '05sampling pp.47–51',
        terms: [
          { en: 'Delta Modulation (DM)', zh: '增量调制（1 比特差值跟踪）' },
          { en: 'Staircase Approximation', zh: '阶梯波逼近' },
          { en: 'Accumulator / Integrator', zh: '数字累加器 / 积分器' }
        ],
        symbols: [
          { sym: 'e_q[k] = \\pm E', desc: '仅发 1 比特：当前比预测值高就发 +E（1），低就发 -E（0）', color: P.amber },
          { sym: 'm_q[k] = m_q[k-1] + e_q[k]', desc: '发端本地反馈与收端完全同步的阶梯重建波', color: P.cyan },
          { sym: 'f_s \\gg 2B', desc: '用超高采样率代替多位 ADC 与字同步', color: P.green }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: 'e[k] = m(kT_s) - m_q\\big((k-1)T_s\\big) \\xrightarrow{\\text{1-bit 比较器}} e_q[k] = \\begin{cases} +E, & e[k] \\ge 0 \\;(\\text{发 }1) \\\\ -E, & e[k] < 0 \\;(\\text{发 }0) \\end{cases}', label: '发端核心：彻底抛弃昂贵多位 Flash ADC，只需一个正负比较器！' },
          { step: 1, latex: 'm_q[k] = m_q[k-1] + e_q[k] = \\sum_{i=0}^{k} e_q[i]', label: '收端极其简单：累加器把 ±E 阶梯堆起来再过低通滤波，甚至免去帧/字同步！' },
          { step: 2, latex: '\\text{PCM：低采样率 } (\\sim 2B) \\times \\text{多位 } n \\quad\\longleftrightarrow\\quad \\text{DM：超高采样率 } (\\gg 2B) \\times 1\\text{ bit}', label: '时间轴复杂度置换幅度轴硬件复杂度的绝妙对偶' }
        ],
        sliders: [
          { key: 'stepE', label: '阶梯固定步长 E (V)', min: 0.08, max: 0.36, step: 0.02, default: 0.16, unit: 'V', decimals: 2 }
        ],
        presets: [
          { label: '标准跟踪步长 (E=0.16)', values: { stepE: 0.16 } },
          { label: '精细步长测试 (E=0.08)', values: { stepE: 0.08 } }
        ],
        lines: [
          {
            step: 0,
            sub: '既然连续信号在高频过采样下前后相邻两个样值非常接近，为什么每一拍还要用 8 到 16 个比特从零开始报绝对高度？增量调制 DM 的天才创意是：只用 1 个比特告诉对方「我比刚才涨了一个台阶 $+E$，还是跌了一个台阶 $-E$」！',
            tts: '既然连续波形在高速采样下前后两点非常接近，为什么每一拍还要花八到十六个比特从头报出绝对高度呢？增量调制的天才想法是：干脆只发一个比特，告诉接收端我比上一拍涨了一个台阶正 E，还是跌了一个台阶负 E。'
          },
          {
            step: 1,
            sub: '看上方发收系统框图：发射端只需把原信号减去本地阶梯记忆 $m_q[k-1]$，扔进一个极简的 1 比特正负比较器即可；接收端更省事，只要把收到的 $+E/-E$ 不断放进蓄水池累加器，过一个低通滤波器就能平滑复原，甚至连 PCM 最头疼的字同步都省了！',
            tts: '看上方系统框图：发射端把原信号减去本地记忆阶梯，送进最简单的正负比较器就能输出零一比特流；接收端更是省到极致，只需一个累加器把正负 E 一步步堆成阶梯波，再过低通滤波器就还原完成了，甚至连哪八位凑成一组的字同步都彻底省掉。'
          },
          {
            step: 2,
            sub: '它和 PCM 正好形成完美互补：PCM 采样率贴近 $2B$、每样多位、怕硬件 ADC 贵；DM 每样仅需 $1$ 位、硬件极简，但代价是采样率 $f_s$ 必须远高于奈奎斯特率 $2B$，这样每步只跳一小格才跟得上波形变化！',
            tts: '它和上一集的 P C M 正好形成镜像互补：P C M 采样率低但每样位数多、需要昂贵的多位芯片；而增量调制每样只传一比特、硬件廉价，代价则是采样频率必须远远高于二倍带宽，靠步频快去追赶波形。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var E = env.params.stepE !== undefined ? env.params.stepE : 0.16;
          var narrow0 = boxes[0].w < 460;
          var narrow1 = boxes[1].w < 460;

          // Panel 0: DM Tx + Rx block diagram
          var nodes = [
            { id: 'in', nx: 0.10, ny: 0.35, nw: 0.11, nh: 0.28, label: 'm(t)', color: P.cyan, kind: 'text' },
            { id: 'sum', nx: 0.23, ny: 0.35, nw: 0.10, nh: 0.28, label: '±', color: P.cyan, kind: 'sum' },
            { id: 'cmp', nx: 0.41, ny: 0.35, nw: 0.18, nh: 0.30, label: '1-bit 比较器\n±E 编码', color: P.amber },
            { id: 'acc', nx: 0.65, ny: 0.35, nw: 0.18, nh: 0.30, label: '收端累加\nmq[k]', color: P.green },
            { id: 'lpf', nx: 0.87, ny: 0.35, nw: 0.14, nh: 0.30, label: 'LPF\n输出', color: P.purple },
            { id: 'fb', nx: 0.41, ny: 0.78, nw: 0.22, nh: 0.24, label: '本地积分延时 mq[k-1]', color: P.muted }
          ];
          var edges = [
            { from: 'in', to: 'sum' },
            { from: 'sum', to: 'cmp', label: '差 e[k]' },
            { from: 'cmp', to: 'acc', label: '0/1流', color: P.amber },
            { from: 'acc', to: 'lpf' },
            { from: 'cmp', to: 'fb', dashed: true, pulse: false },
            { from: 'fb', to: 'sum', label: '-', dashed: true, pulse: false }
          ];
          env.viz.drawBlockDiagram(ctx, boxes[0], nodes, edges, {
            time: env.time,
            activeId: ['cmp', 'acc', 'lpf'][Math.min(2, env.step)],
            title: narrow0 ? 'DM 1-bit 发收架构' : 'DM 发射端反馈编码与接收端积分还原框图'
          });

          // Panel 1: Staircase tracking with COMM_MATH.deltaModTrack
          function sig(t) {
            return 0.78 * Math.sin(2 * Math.PI * t);
          }
          var Ts = 0.04;
          var track = env.math.deltaModTrack(sig, 0, 1.4, Ts, E, 0);
          var ax = env.viz.drawAxes(ctx, boxes[1], {
            xMin: 0,
            xMax: 1.4,
            yMin: -1.15,
            yMax: 1.25,
            xGrid: 7,
            yGrid: 4,
            padL: 34,
            xTicks: [[0, '0'], [0.5, '0.5'], [1.0, '1.0'], [1.4, '1.4s']],
            yTicks: [[-1, '-1'], [0, '0'], [1, '+1']],
            title: narrow1 ? ('阶梯跟踪 (E=' + E.toFixed(2) + 'V)') : ('DM 阶梯跟踪波形（E=' + E.toFixed(2) + 'V, Ts=0.04s）')
          });

          env.viz.drawCurve(ctx, ax, sig, { color: P.cyan, lineWidth: 2.1 });
          var stepPts = [];
          for (var i = 0; i < track.length; i++) {
            stepPts.push([track[i].t, track[i].mq]);
          }
          env.viz.drawStepCurve(ctx, ax, stepPts, { color: P.amber, lineWidth: 2.0 });

          // Sample bit annotations for first 12 samples
          ctx.save();
          ctx.font = '700 9.5px ui-monospace, monospace';
          ctx.textAlign = 'center';
          for (var k = 0; k < Math.min(14, track.length); k++) {
            ctx.fillStyle = track[k].bit === 1 ? P.green : P.red;
            ctx.fillText(String(track[k].bit), ax.toX(track[k].t), ax.py + 12);
          }
          ctx.restore();
        }
      },
      {
        id: 's01',
        tag: '推导',
        title: 'DM 双头蛇矛盾：斜率过载 vs 颗粒噪声（E·fs ≥ |m\'|max）',
        slideRef: '05sampling pp.48–49 + 考点',
        terms: [
          { en: 'Slope Overload Distortion', zh: '斜率过载失真（步子小追不上陡坡）' },
          { en: 'Granular Noise', zh: '颗粒噪声（步子大平顶剧烈锯齿）' },
          { en: 'No-Overload Condition', zh: '无过载条件 E·fs ≥ |m\'(t)|max' }
        ],
        symbols: [
          { sym: 'E \\cdot f_s = \\frac{E}{T_s}', desc: '阶梯波形每秒最多能爬升或下降的速率极限 (V/s)', color: P.cyan },
          { sym: '|\\dot{m}(t)|_{\\max}', desc: '模拟原信号在最陡处的最大斜率', color: P.amber },
          { sym: 'E_{\\min} = \\frac{|\\dot{m}(t)|_{\\max}}{f_s}', desc: '恰不发生斜率过载的最小步长（同时避免过大颗粒噪声）', color: P.green }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: '\\text{阶梯波最大跟踪斜率} = \\frac{E}{T_s} = E\\,f_s \\quad(\\text{每拍最多攀升 } E)', label: '核心物理限制：斜坡爬得快不快，看步长 E 乘以步频 fs' },
          { step: 1, latex: '\\text{斜率过载：} E\\,f_s < |\\dot{m}(t)|_{\\max}\\;(\\text{陡坡滞后});\\qquad\\text{颗粒噪声：} E \\text{ 过大}\\;(\\text{平缓期剧烈锯齿})', label: 'DM 双头蛇两难：单靠调大 E 治好了过载，却立刻把平顶颗粒噪声放出来！' },
          { step: 2, latex: '\\text{无过载黄金条件：} E\\,f_s \\ge |\\dot{m}(t)|_{\\max} \\implies E_{\\min} = \\frac{|\\dot{m}(t)|_{\\max}}{f_s}', label: '同时压低两种失真的唯一出路：提高采样率 fs，就能放心地缩小步长 E！' }
        ],
        sliders: [
          { key: 'stepE', label: '阶梯步长 E (V)', min: 0.04, max: 0.50, step: 0.02, default: 0.06, unit: 'V', decimals: 2 },
          { key: 'fs', label: '采样频率 fs (Hz)', min: 15, max: 60, step: 5, default: 20, unit: 'Hz', decimals: 0 }
        ],
        presets: [
          { label: 'E太小 → 斜率过载!', values: { stepE: 0.06, fs: 20 } },
          { label: '黄金步长 (临界无过载)', values: { stepE: 0.18, fs: 30 } },
          { label: 'E太大 → 颗粒噪声!', values: { stepE: 0.44, fs: 25 } }
        ],
        lines: [
          {
            step: 0,
            sub: '固定步长的增量调制藏着一对天敌矛盾！由于每隔 $T_s$ 最多只爬一个步长 $E$，阶梯波能追上的最大爬坡速率等于 $E / T_s = E\\,f_s$。',
            tts: '固定步长的增量调制天生藏着一对互相打架的毛病。因为每隔 T s 最多只能爬高或跌落一个步长 E，所以阶梯波物理上能追上的最大斜率就等于 E 除以 T s，也就是 E 乘以 f s。'
          },
          {
            step: 1,
            sub: '亲自点一遍三个预设对比！默认 $E=0.06$ 太小，$E\\,f_s = 1.2$ 远低于正弦最大斜率 $5.34\\text{ V/s}$，红点报警亮成一串：阶梯死活爬不上陡坡，这叫「斜率过载」。切到 $E=0.44$：陡坡追上了，但波峰波谷平缓期却猛烈上下锯齿震荡，这叫「颗粒噪声」！',
            tts: '亲自点一遍下方的三个预设：第一步长太小时，E 乘以 f s 远小于波形在零点附近的最大斜率五点三四，图上红点亮成一排，阶梯波在陡坡后面苦苦追赶拉出一大截滞后，这叫斜率过载。切到步长太大预设：陡坡追上了，可到了平缓波峰波谷却大幅上下锯齿乱跳，把平缓信号涂满锯齿毛刺，这叫颗粒噪声。'
          },
          {
            step: 2,
            sub: '因此不发生斜率过载的充要条件就是 $E\\,f_s \\ge |\\dot{m}(t)|_{\\max}$，最小步长 $E_{\\min} = \\frac{|\\dot{m}(t)|_{\\max}}{f_s}$！拖动 $f_s$ 往右拉到高采样率就会发现：只有把采样率提上去，才能同时把 $E$ 缩得很小，一次性治好过载和颗粒两大顽疾！',
            tts: '所以不发生斜率过载的黄金底线就是 E 乘以 f s 必须大于等于信号导数绝对值的最大值，也就是最小步长等于最大斜率除以采样频率。把采样率滑块往右拉就能立刻明白：只有提高采样率，才能把步长 E 放心缩小，一次性治好斜率过载和颗粒噪声两个毛病。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var E = env.params.stepE !== undefined ? env.params.stepE : 0.06;
          var fs = env.params.fs !== undefined ? env.params.fs : 20;
          var Ts = 1.0 / fs;
          var maxSlope = 0.85 * 2 * Math.PI; // 5.341 V/s
          var slew = E * fs;
          var narrow0 = boxes[0].w < 460;
          var narrow1 = boxes[1].w < 460;

          function sig(t) {
            return 0.85 * Math.sin(2 * Math.PI * t);
          }

          var track = env.math.deltaModTrack(sig, 0, 1.5, Ts, E, 0);
          var stepPts = [];
          var overloadStems = [];
          var xArr = [];
          var errArr = [];
          var errPts = [];

          for (var i = 0; i < track.length; i++) {
            var item = track[i];
            stepPts.push([item.t, item.mq]);
            xArr.push(item.m);
            errArr.push(item.err);
            errPts.push([item.t, item.err]);
            if (item.overload) {
              overloadStems.push({ x: item.t, y: item.mq, color: P.red, width: 1.4 });
            }
          }
          var sqnr = env.math.sqnrDb(xArr, errArr);
          var isOverload = slew < maxSlope * 0.96;
          var isGranular = !isOverload && E > 0.28;

          // Panel 0: Waveform vs DM staircase + red overload markers
          var ax0 = env.viz.drawAxes(ctx, boxes[0], {
            xMin: 0,
            xMax: 1.5,
            yMin: -1.25,
            yMax: 1.35,
            xGrid: 6,
            yGrid: 4,
            padL: 34,
            xTicks: [[0, '0'], [0.5, '0.5'], [1.0, '1.0'], [1.5, '1.5s']],
            yTicks: [[-1, '-1'], [0, '0'], [1, '+1']],
            title: narrow0 ? ('E·fs=' + slew.toFixed(1) + ' vs 5.34') : ('DM 跟踪：斜率极限 E·fs=' + slew.toFixed(2) + ' vs |m\'|max=' + maxSlope.toFixed(2)),
            subtitle: narrow0 ? undefined : (isOverload ? '斜率过载!' : (isGranular ? '颗粒噪声偏大' : '黄金平衡!')),
            subtitleColor: isOverload ? P.red : (isGranular ? P.amber : P.green)
          });

          env.viz.drawCurve(ctx, ax0, sig, { color: P.cyan, lineWidth: 2.1 });
          env.viz.drawStepCurve(ctx, ax0, stepPts, { color: P.amber, lineWidth: 2.0 });

          // Highlight overload points clearly as bright red circles
          ctx.save();
          ctx.fillStyle = P.red;
          for (var j = 0; j < overloadStems.length; j++) {
            var px = ax0.toX(overloadStems[j].x);
            var py = ax0.toY(overloadStems[j].y);
            ctx.beginPath();
            ctx.arc(px, py, 3.6, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();

          // Panel 1: Error waveform mq - m
          var ax1 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: 0,
            xMax: 1.5,
            yMin: -0.75,
            yMax: 0.85,
            xGrid: 6,
            yGrid: 4,
            padL: 38,
            xTicks: [[0, '0'], [0.5, '0.5'], [1.0, '1.0'], [1.5, '1.5s']],
            yTicks: [[-0.5, '-0.5'], [0, '0'], [0.5, '+0.5']],
            title: narrow1 ? ('误差 & SQNR=' + sqnr.toFixed(1) + 'dB') : ('跟踪误差 mq - m（SQNR = ' + sqnr.toFixed(1) + ' dB, 过载点=' + overloadStems.length + '）')
          });
          env.viz.drawCurve(ctx, ax1, function () { return E; }, { color: 'rgba(52,211,153,0.5)', dash: [4, 4], lineWidth: 1.2 });
          env.viz.drawCurve(ctx, ax1, function () { return -E; }, { color: 'rgba(52,211,153,0.5)', dash: [4, 4], lineWidth: 1.2 });
          env.viz.drawCurve(ctx, ax1, errPts, { color: isOverload ? P.red : (isGranular ? P.amber : P.green), lineWidth: 1.8, fillAlpha: 0.16 });
          if (narrow1) {
            env.viz.drawAnnotation(
              ctx,
              ax1,
              0.75,
              0.68,
              isOverload ? ('斜率过载! 过载点 ' + overloadStems.length + ' 个') : (isGranular ? '步长太大→颗粒锯齿!' : '黄金跟踪!'),
              isOverload ? P.red : (isGranular ? P.amber : P.green),
              'center'
            );
          }
        }
      },
      {
        id: 's02',
        tag: '作业精讲',
        hwCode: '6.7-2',
        title: 'HW3 作业 6.7-2：衰减余弦波最小步长 E_min 与带内噪声',
        slideRef: 'HW3 · 6.7-2',
        terms: [
          { en: 'Damped Sinusoid Slope', zh: '高频衰减余弦最大斜率' },
          { en: 'In-Band DM Noise (No)', zh: '经低通后的带内量化噪声功率' }
        ],
        symbols: [
          { sym: 'm(t) = e^{-2t}\\cos(2000\\pi t)\\,u(t)', desc: '题给 1000 Hz 指数衰减余弦波（跳过 t=0 跳变瞬态）', color: P.cyan },
          { sym: 'E_{\\min} = \\frac{|\\dot{m}|_{\\max}}{f_s} \\approx \\frac{6.28\\times 10^3}{f_s}', desc: '无斜率过载最小步长（以未知采样率 f_s 表示）', color: P.amber },
          { sym: 'N_o = \\frac{E^2 B}{3 f_s} \\approx \\frac{1.32\\times 10^{10}}{f_s^3}\\text{ W}', desc: '总噪声 E²/3 均布 0~fs，经 B=1 kHz 低通按 1/fs³ 急降', color: P.green }
        ],
        errata: '两个必记考点：① t=0 跳变斜率无穷大属起始瞬态不计，t>0 最大斜率出现在 t≈0.25 ms 处；② DM 量化误差在 (-E, +E) 均匀分布（区间全宽 2E），故总功率是 E²/3，而非 PCM 的 Δ²/12！',
        formulas: [
          { step: 0, latex: '\\dot{m}(t) = -e^{-2t}\\big[2\\cos(2000\\pi t) + 2000\\pi\\sin(2000\\pi t)\\big]\\;(t>0) \\implies |\\dot{m}|_{\\max} \\approx 2000\\pi\\,e^{-0.0005} \\approx 6.28\\times 10^3\\text{ V/s}', label: '(a) 第一步：对 t>0 求导，最大值由 2000π 正弦项在 t≈0.25 ms 处主导' },
          { step: 1, latex: '\\frac{E}{T_s} \\ge |\\dot{m}|_{\\max} \\implies E_{\\min} = |\\dot{m}|_{\\max}\\,T_s \\approx \\frac{6.28\\times 10^3}{f_s}\\quad(\\text{例 } f_s=64\\text{ kHz} \\Rightarrow E_{\\min}\\approx 0.098)', label: '(a) 第二步：直接给出用 f_s 表示的无过载最小步长表达式' },
          { step: 2, latex: 'N_o = \\frac{E^2}{3}\\cdot\\frac{B}{f_s} = \\frac{(2000\\pi)^2}{3 f_s^2}\\cdot\\frac{1000}{f_s} \\approx \\frac{1.32\\times 10^{10}}{f_s^3}\\text{ W}\\quad(\\text{例 } f_s=64\\text{ kHz} \\Rightarrow N_o\\approx 5.0\\times 10^{-5}\\text{ W})', label: '(b) 第三步：带宽 B≈1 kHz 的低通滤出带内噪声，随采样率立方暴降！' }
        ],
        sliders: [
          { key: 'fsK', label: '采样率 fs (kHz)', min: 20, max: 128, step: 4, default: 64, unit: 'kHz', decimals: 0 }
        ],
        presets: [
          { label: '较低采样 (32 kHz)', values: { fsK: 32 } },
          { label: '作业示例 (64 kHz → E≈0.098)', values: { fsK: 64 } },
          { label: '倍频高速 (128 kHz → 噪声降8倍!)', values: { fsK: 128 } }
        ],
        lines: [
          {
            step: 0,
            sub: '最后一道作业大题 6.7-2！信号 $m(t) = e^{-2t}\\cos(2000\\pi t)\\,u(t)$。先把 $t=0$ 处从 $0$ 跳到 $1$ 的阶跃瞬态排除（任何有限步长都追不上冲激跳变），对 $t > 0$ 求导得 $\\dot{m}(t) = -e^{-2t}[2\\cos(2000\\pi t) + 2000\\pi\\sin(2000\\pi t)]$。由于 $2000\\pi \\gg 2$，最大斜率落在第一个正弦峰 $t \\approx 0.25\\text{ ms}$ 附近：$|\\dot{m}|_{\\max} \\approx 2000\\pi e^{-0.0005} \\approx 6.28 \\times 10^3\\text{ V/s}$！',
            tts: '来看最后一道作业压轴题，六点七杠二。信号是 e 的负二 t 次方乘以余弦二千派 t 乘以阶跃函数。首先注意 t 等于零处从零直接跳到一，属于起始瞬态，任何有限步长都跟不上，求最大斜率时要排除零点。对大于零求导后，两千派的正弦项远远压倒衰减系数二，所以在第一个四分之一周期约零点二五毫秒处取到最大斜率，约等于两千派，也就是六点二八乘以十的三次方伏每秒。'
          },
          {
            step: 1,
            sub: '题干未给具体采样率，第 (a) 问要求用 $f_s$ 表示最小步长！套用刚学过的无过载底线 $E_{\\min} = |\\dot{m}|_{\\max} / f_s \\approx \\frac{6.28 \\times 10^3}{f_s}$！代入作业给出的验算例子 $f_s = 64\\text{ kHz}$，得出 $E_{\\min} \\approx 0.098\\text{ V}$。',
            tts: '因为题目没有给具体的采样频率数值，第一问结果用 f s 表示。代入无过载条件，最小步长等于最大斜率除以 f s，也就是六点二八乘以十的三次方除以 f s。拿作业给的六十四千赫兹代入验算，最小步长大约等于零点零九八伏。'
          },
          {
            step: 2,
            sub: '第 (b) 问算接收端低通后的噪声功率 $N_o$！切记：DM 误差均匀落在 $(-E, +E)$ 内，总宽度是 $2E$，总功率等于 $(2E)^2 / 12 = E^2 / 3$！它近似白铺在 $0 \\sim f_s$ 频段，而调制信号频率 $1000\\text{ Hz}$ 使输出低通只放行 $B \\approx 1\\text{ kHz}$ 的比例 $B / f_s$。代回 $E = E_{\\min}$ 得 $N_o \\approx \\frac{1.32 \\times 10^{10}}{f_s^3}\\text{ W}$！$f_s = 64\\text{ kHz}$ 时约 $5.0 \\times 10^{-5}\\text{ W}$，采样率翻倍噪声立降 $8$ 倍！',
            tts: '第二问算输出端带内量化噪声功率，一定要避开平方除以十二的陷阱！增量调制误差分布在负 E 到正 E 之间，区间全宽是二 E，所以总噪声功率是 E 平方除以三。这些噪声近似均匀平铺在零到 f s 的频带里，而接收端一千赫兹低通滤波器只放行带宽 B 除以 f s 的这一小部分。代入最小步长，得到噪声功率与采样频率的立方成反比：六十四千赫兹时约为五乘以十的负五次方瓦，采样率只要翻一倍，带内噪声就会暴降八倍。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var fsK = env.params.fsK !== undefined ? env.params.fsK : 64;
          var fs = fsK * 1000;
          var Ts = 1.0 / fs;
          var maxSlope = 2000 * Math.PI * Math.exp(-0.0005); // ~ 6280 V/s
          var Emin = maxSlope / fs;
          var No = (Emin * Emin / 3) * (1000 / fs);
          var narrow0 = boxes[0].w < 460;
          var narrow1 = boxes[1].w < 460;

          // Panel 0: m(t) on [0, 2 ms] + DM track starting at t=0+ (initMq=1.0)
          function dampedSig(tMs) {
            return env.math.dampedCos(2, 1000, tMs / 1000);
          }
          var tsMs = Ts * 1000;
          var track = env.math.deltaModTrack(dampedSig, 0, 2.0, tsMs, Emin, 1.0);
          var stepPts = [];
          for (var i = 0; i < track.length; i++) {
            stepPts.push([track[i].t, track[i].mq]);
          }

          var ax0 = env.viz.drawAxes(ctx, boxes[0], {
            xMin: 0,
            xMax: 2.0,
            yMin: -1.25,
            yMax: 1.35,
            xGrid: 4,
            yGrid: 4,
            padL: 34,
            xTicks: [[0, '0'], [0.25, '0.25ms'], [1.0, '1ms'], [2.0, '2ms']],
            yTicks: [[-1, '-1'], [0, '0'], [1, '+1']],
            title: narrow0 ? ('fs=' + fsK + 'k, Emin=' + Emin.toFixed(3)) : ('6.7-2 波形追踪 (fs=' + fsK + 'kHz, Emin=' + Emin.toFixed(3) + 'V)')
          });
          env.viz.drawCurve(ctx, ax0, dampedSig, { color: P.cyan, lineWidth: 2.1 });
          env.viz.drawStepCurve(ctx, ax0, stepPts, { color: P.amber, lineWidth: 1.9 });
          env.viz.drawAnnotation(ctx, ax0, 0.28, 0.25, 't≈0.25ms最陡 |m\'|≈6.28e3', P.pink, 'left');

          // Panel 1: Cubic noise drop 10*log10(No) vs fs (20 to 128 kHz)
          function noDb(fK) {
            var fHz = fK * 1000;
            var eVal = maxSlope / fHz;
            var nVal = (eVal * eVal / 3) * (1000 / fHz);
            return 10 * Math.log10(nVal);
          }
          var curDb = 10 * Math.log10(No);
          var ax1 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: 18,
            xMax: 132,
            yMin: -58,
            yMax: -24,
            xGrid: 5,
            yGrid: 4,
            padL: 44,
            xTicks: narrow1 ? [[32, '32k'], [64, '64k'], [128, '128k']] : [[20, '20k'], [32, '32k'], [64, '64k'], [96, '96k'], [128, '128k']],
            yTicks: [[-55, '-55'], [-43, '-43'], [-30, '-30 dBW']],
            title: narrow1 ? ('No = ' + No.toExponential(1) + ' W') : ('输出噪声 No ∝ 1/fs³ 急剧下降（每倍频降 9 dB）')
          });
          env.viz.drawCurve(ctx, ax1, noDb, { from: 20, to: 128, color: P.green, lineWidth: 2.4 });
          env.viz.drawStems(ctx, ax1, [
            { x: fsK, y: curDb, color: P.amber, width: 3.0, label: No.toExponential(1) + 'W' }
          ], {});
          env.viz.drawAnnotation(ctx, ax1, 74, -31, '64kHz→No≈5.0×10⁻⁵ W', P.cyan, 'center');
        }
      },
      {
        id: 's03',
        tag: '推导',
        title: '从 DM 升级到 DPCM（预测差值）与自适应 ADPCM',
        slideRef: '05sampling pp.52–57',
        terms: [
          { en: 'DPCM (Differential PCM)', zh: '差分脉冲编码调制' },
          { en: 'Linear Predictor', zh: '线性预测器（利用相邻强相关性）' },
          { en: 'ADPCM (Adaptive DPCM)', zh: '自适应差分 PCM（动态调步长）' }
        ],
        symbols: [
          { sym: '\\hat{m}[k] = \\sum_{i=1}^{N} a_i\\, m_q[k-i]', desc: '根据过去 N 个已量化样值预测当前幅度', color: P.cyan },
          { sym: 'd[k] = m[k] - \\hat{m}[k]', desc: '不可预测的残差分量（幅度范围远小于原信号 m[k]）', color: P.amber },
          { sym: '\\Delta[k]', desc: 'ADPCM 仅靠编码比特历史自动放大/缩小量化步长', color: P.green }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: 'm[k] = \\underbrace{\\hat{m}[k]}_{\\text{可预测部分}} + \\underbrace{d[k]}_{\\text{独立新息}} \\implies \\text{用多位只量化窄范围残差 } d[k]', label: 'DPCM 省比特秘密：不再浪费比特报历史重复信息，只传差值' },
          { step: 1, latex: '\\text{统一视角：DM 是 DPCM 的特例 } (N=1,\\; a_1=1,\\; L=2\\text{ 仅 1 bit})', label: '1 阶保持预测 + 1 比特量化 = 增量调制 DM' },
          { step: 2, latex: '\\text{ADPCM 自适应：连串 } 111/000 \\Rightarrow \\text{放大 } \\Delta\\;(\\text{抗过载});\\quad 1010 \\text{ 交替} \\Rightarrow \\text{缩小 } \\Delta\\;(\\text{抑颗粒})', label: '发收两端完全靠输出比特流同步调步长，无需额外传输控制边信息！' }
        ],
        sliders: [
          { key: 'adaptive', label: '跟踪算法 (0=固定步长DM, 1=自适应ADPCM)', min: 0, max: 1, step: 1, default: 1, decimals: 0 }
        ],
        presets: [
          { label: '固定步长 DM (易过载又锯齿)', values: { adaptive: 0 } },
          { label: '开启 ADPCM 自适应缩放!', values: { adaptive: 1 } }
        ],
        lines: [
          {
            step: 0,
            sub: 'DM 虽然极简，但 1 比特能力有限；PCM 精度高却每拍都在重复编码本来就猜得八九不离十的背景值！差分脉冲编码调制 DPCM 把两者精华合二为一：用线性预测器 $\\hat{m}[k] = \\sum a_i m_q[k-i]$ 先猜出下一拍大概在哪，只对不可预测的微小残差 $d[k] = m[k] - \\hat{m}[k]$ 做多位量化！',
            tts: '增量调制虽然简单，但每拍只有一比特能力有限；P C M 虽然精度高，却每一拍都要重新报一次本来靠规律就能猜个八九不离十的数值。差分脉冲编码调制 D P C M 完美结合了两者的优点：发端先用线性预测器猜出下一拍大概在哪，然后只对猜不准的微小差值残差进行多位量化，所需比特数立刻大幅下降。'
          },
          {
            step: 1,
            sub: '仔细看上方 DPCM 方块图你会顿悟：如果我们把预测器退化成只用上一拍 $N=1, a_1=1$，把多位量化器退化成 $2$ 级（$1$ bit），DPCM 就彻底变回了刚才的增量调制 DM！所以 DM 本质上是 DPCM 最极简的特例。',
            tts: '对比上方 D P C M 框图还能顺便打通一个全局视角：如果把多阶预测器退化成只记住上一拍的一阶记忆，再把多位量化器压成一比特两级判决，D P C M 就瞬间变回了刚才的增量调制。所以增量调制其实就是 D P C M 最简单的一个特例。'
          },
          {
            step: 2,
            sub: '再进一步升级成自适应 ADPCM！看下方突发陡坡加平稳段的对比图：固定步长（设为 0）要么在陡坡严重滞后，要么在平地剧烈抖动；开启自适应（设为 1），一旦连续出现相同符号就自动猛放大步长冲上陡坡，一旦进入交替抖动期就迅速收缩步长贴紧平地，一举兼得无过载与超低颗粒噪声！',
            tts: '在此基础上再加一层自适应规则，就是大名鼎鼎的 A D P C M。看下方突发信号图：固定步长模式要么在悬崖陡坡爬不上去，要么在平地疯狂锯齿；一旦开启自适应，只要连发相同比特就自动放大步长冲过陡坡，遇到正负交替就自动缩回微步长贴紧平滑区。最巧妙的是收发两端只看同一串输出比特流，就能零开销同步缩放步长。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var adaptive = (env.params.adaptive !== undefined ? env.params.adaptive : 1) >= 0.5;
          var narrow0 = boxes[0].w < 460;
          var narrow1 = boxes[1].w < 460;

          // Panel 0: DPCM / ADPCM block diagram
          var nodes = [
            { id: 'in', nx: 0.10, ny: 0.34, nw: 0.11, nh: 0.24, label: 'm[k]', color: P.cyan, kind: 'text' },
            { id: 's1', nx: 0.23, ny: 0.34, nw: 0.10, nh: 0.24, label: '±', color: P.cyan, kind: 'sum' },
            { id: 'q', nx: 0.43, ny: 0.34, nw: 0.20, nh: 0.30, label: adaptive ? '自适应量化\nQ(Δ[k])' : '固定量化\nQ(Δ)', color: adaptive ? P.green : P.amber },
            { id: 'tx', nx: 0.67, ny: 0.34, nw: 0.16, nh: 0.28, label: '编码比特\nd_q[k]', color: P.purple },
            { id: 's2', nx: 0.87, ny: 0.34, nw: 0.10, nh: 0.24, label: '+', color: P.cyan, kind: 'sum' },
            { id: 'pr', nx: 0.55, ny: 0.78, nw: 0.26, nh: 0.26, label: '线性预测器 m̂[k]', color: P.cyan }
          ];
          var edges = [
            { from: 'in', to: 's1' },
            { from: 's1', to: 'q', label: '残差 d[k]' },
            { from: 'q', to: 'tx' },
            { from: 'tx', to: 's2' },
            { from: 's2', to: 'pr', dashed: true, pulse: false },
            { from: 'pr', to: 's1', label: '-m̂', dashed: true, pulse: false }
          ];
          if (adaptive) {
            edges.push({ from: 'tx', to: 'q', label: '步长自适应', midY: 0.14, color: P.green, dashed: true, pulse: false });
          }
          env.viz.drawBlockDiagram(ctx, boxes[0], nodes, edges, {
            time: env.time,
            activeId: adaptive ? 'q' : 'pr',
            title: narrow0 ? (adaptive ? 'ADPCM 自适应架构' : 'DPCM / 固定步长') : ('DPCM 预测反馈框图（' + (adaptive ? 'ADPCM 动态步长已开启' : '固定步长模式') + '）')
          });

          // Panel 1: Burst steep step + flat plateau simulation
          function burstSig(t) {
            // Smooth ramp + sharp steep jump + quiet high plateau
            return 0.72 / (1 + Math.exp(-16 * (t - 0.35))) + 0.12 * Math.sin(4 * Math.PI * t) * Math.exp(-3 * (t - 0.8) * (t - 0.8));
          }
          var trace = simulateAdaptiveTrack(burstSig, 0, 1.2, 0.025, 0.08, adaptive);
          var pts = [];
          var xArr = [];
          var errArr = [];
          for (var i = 0; i < trace.length; i++) {
            pts.push([trace[i].t, trace[i].mq]);
            xArr.push(trace[i].m);
            errArr.push(trace[i].err);
          }
          var sqnr = env.math.sqnrDb(xArr, errArr);
          var ax = env.viz.drawAxes(ctx, boxes[1], {
            xMin: 0,
            xMax: 1.2,
            yMin: -0.15,
            yMax: 1.05,
            xGrid: 6,
            yGrid: 4,
            padL: 34,
            xTicks: [[0, '0'], [0.35, '陡坡'], [0.8, '平缓段'], [1.2, '1.2s']],
            yTicks: [[0, '0'], [0.5, '0.5'], [1, '1.0']],
            title: narrow1 ? ((adaptive ? 'ADPCM' : '固定DM') + ' SQNR=' + sqnr.toFixed(1) + 'dB') : ((adaptive ? 'ADPCM 自适应爬坡并贴紧平缓期' : '固定步长遭遇陡坡滞后') + '（SQNR=' + sqnr.toFixed(1) + ' dB）')
          });
          env.viz.drawCurve(ctx, ax, burstSig, { color: P.cyan, lineWidth: 2.1 });
          env.viz.drawStepCurve(ctx, ax, pts, { color: adaptive ? P.green : P.red, lineWidth: 2.0 });
          env.viz.drawAnnotation(
            ctx,
            ax,
            0.78,
            0.94,
            adaptive ? '自动缩步长→贴合平缓区!' : '固定小步长→陡坡跟丢!',
            adaptive ? P.green : P.red,
            'center'
          );
        }
      },
      {
        id: 's04',
        tag: '直觉',
        title: '声码器参数编码 & Ch.1–Ch.5 全学期通信全局收官',
        slideRef: '05sampling pp.58–61',
        terms: [
          { en: 'Vocoder (Model-Based Coding)', zh: '声码器（基于发声模型参数编码）' },
          { en: 'Waveform vs Parameter Coding', zh: '波形编码 vs 参数模型编码' },
          { en: 'MPEG / Lossy Compression', zh: '音视频有损帧间压缩' }
        ],
        symbols: [
          { sym: '64 \\to 32 \\to 2.4\\text{ kbps}', desc: '从 PCM 到 ADPCM 再到声码器的语音码率压缩飞跃', color: P.green },
          { sym: '\\text{MPEG (6.2-2: 108M} \\to \\text{~4M)}', desc: '视频利用帧间双向预测与有损变换压缩数十倍', color: P.amber },
          { sym: '\\text{Ch.2} \\to \\text{Ch.3/4} \\to \\text{Ch.5}', desc: '物理信号分析 → 模拟调制传输 → 采样数字化迈向数字通信', color: P.cyan }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: '\\text{波形编码 (PCM/DPCM)：忠实记录每点波形 } (16\\text{–}64\\text{ kbps}) \\;\\text{vs}\\; \\text{声码器：提炼声带基音与声道共振参数 } (2.4\\text{ kbps})', label: '信源压缩两极：描摹波形形状 vs 传输发声器官建模参数' },
          { step: 1, latex: '\\text{无损压缩 (ZIP/RAR)} \\quad\\big|\\quad \\text{有损压缩 (MP3/MPEG 帧间双向插值)}', label: '回顾 6.2-2 未压缩视频 108 Mbps → 实际网络流只需几 Mbps' },
          { step: 2, latex: '\\text{Ch.2 信号分解} \\to \\text{Ch.3 AM/SSB} \\to \\text{Ch.4 FM/PM} \\to \\text{Ch.5 采样/PCM/DM} \\to \\text{现代数字通信}', label: '前五章全景通关：把模拟物理世界真正送入 0/1 比特信息时代！' }
        ],
        sliders: [],
        presets: [],
        lines: [
          {
            step: 0,
            sub: '如果连 ADPCM 的 32 kbps 都嫌太占带宽怎么办？波形编码（PCM、DPCM）致力于忠实描摹声音曲线的每一个起伏；而声码器（Vocoder）另辟蹊径：只提取说话人的声带基音频率和口腔共振参数发过去，收端再人工合成语音，码率直接压到惊人的 $2.4\\text{ kbps}$！',
            tts: '如果连 A D P C M 的三十二千比特每秒在极窄信道里都还嫌太宽，怎么办？看信源编码的终极招数：波形编码努力忠实记录曲线的每个起伏，而声码器干脆不传波形了，而是把说话人的声带振动频率和口腔共鸣模型参数抽出来发过去，接收端人工重新合成语音，码率立刻暴降到二点四千比特每秒。'
          },
          {
            step: 1,
            sub: '视频压缩也是同样的道理：回想 6.2-2 算出的未压缩原始电视信号高达 $108\\text{ Mbps}$；课件第 60 页的 MPEG 压缩利用前后帧极其相似的规律，做双向帧间运动预测和有损变换（就像 MP3 音频），只传帧与帧之间的变化，轻松压低二三十倍！',
            tts: '视频压缩也是同样的道理：回想上一集作业六点二杠二，未压缩电视数字流高达一百零八兆比特每秒，根本没法直接塞进普通网线；而课本提到的 M P E G 视频压缩，靠前后画面的双向预测插值和有损感知丢弃，轻松把几十兆压成几兆。'
          },
          {
            step: 2,
            sub: '至此，从第 1 章到第 5 章的全部 13 集课程与 19 道作业题全部通关！我们从第 2 章傅里叶分析与无失真滤波出发，经过第 3 章线性搬移（AM/QAM/SSB/VSB）、第 4 章非线性角度调制（FM/PM 与 Carson 带宽），终于在第 5 章通过采样、PCM、压扩与增量调制，完成了从模拟通信向现代数字通信的关键一跃！',
            tts: '到这里，通信原理第一到第五章的十三集动画与十九道作业精讲已经全部通关。回看整张地图：我们从第二章信号的矢量分解与傅里叶工具出发，穿过第三章幅度搬移与单边带调制，翻越第四章调频调相的卡森带宽，最终在第五章用采样定理、P C M 量化压扩和增量调制，真正推开了现代数字通信的大门！祝考场旗开得胜！'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var narrow0 = boxes[0].w < 460;
          var narrow1 = boxes[1].w < 460;

          // Panel 0: Bitrate compression spectrum (log10 kbps)
          // 108000 (5.03), 4000 (3.60), 1411 (3.15), 64 (1.81), 32 (1.51), 2.4 (0.38)
          var items = [
            { lbl: narrow0 ? '原视频' : '6.2-2视频', rate: '108M', val: Math.log10(108000), col: P.red },
            { lbl: 'MPEG', rate: '~4M', val: Math.log10(4000), col: P.amber },
            { lbl: 'PCM话', rate: '64k', val: Math.log10(64), col: P.cyan },
            { lbl: 'ADPCM', rate: '32k', val: Math.log10(32), col: P.purple },
            { lbl: '声码器', rate: '2.4k', val: Math.log10(2.4), col: P.green }
          ];
          var ax = env.viz.drawAxes(ctx, boxes[0], {
            xMin: 0.4,
            xMax: 5.6,
            yMin: 0,
            yMax: 5.8,
            xGrid: 5,
            yGrid: 4,
            padL: 38,
            xTicks: [[1, items[0].lbl], [2, items[1].lbl], [3, items[2].lbl], [4, items[3].lbl], [5, items[4].lbl]],
            yTicks: [[1, '10k'], [3, '1M'], [5, '100M']],
            title: narrow0 ? '信源编码码率压降 (对数)' : '从波形到模型：信源编码码率压缩对比（对数坐标）'
          });
          var stems = [];
          for (var i = 0; i < items.length; i++) {
            stems.push({
              x: i + 1,
              y: items[i].val,
              color: items[i].col,
              width: narrow0 ? 12 : 16,
              label: items[i].rate
            });
          }
          env.viz.drawStems(ctx, ax, stems, {});

          // Panel 1: Ch.1-Ch.5 Grand Mastery Map
          var nodes = [
            { id: 'c1', nx: 0.13, ny: 0.50, nw: 0.16, nh: 0.44, label: 'Ch.1\n资源权衡\nP vs B', color: P.muted },
            { id: 'c2', nx: 0.31, ny: 0.50, nw: 0.16, nh: 0.44, label: 'Ch.2\n傅里叶与\n线性滤波', color: P.cyan },
            { id: 'c3', nx: 0.50, ny: 0.50, nw: 0.17, nh: 0.44, label: 'Ch.3\nAM/QAM\nSSB/VSB', color: P.amber },
            { id: 'c4', nx: 0.69, ny: 0.50, nw: 0.17, nh: 0.44, label: 'Ch.4\nFM/PM\nCarson', color: P.pink },
            { id: 'c5', nx: 0.88, ny: 0.50, nw: 0.17, nh: 0.44, label: 'Ch.5\n采样/PCM\nDM/DPCM', color: P.green }
          ];
          var edges = [
            { from: 'c1', to: 'c2' },
            { from: 'c2', to: 'c3' },
            { from: 'c3', to: 'c4' },
            { from: 'c4', to: 'c5', color: P.green }
          ];
          var activeIdx = Math.floor(env.progress * 5) % 5;
          env.viz.drawBlockDiagram(ctx, boxes[1], nodes, edges, {
            time: env.time,
            activeId: ['c1', 'c2', 'c3', 'c4', 'c5'][activeIdx],
            title: narrow1 ? 'Ch.1–5 全学期知识全景' : '第 1–5 章通信系统知识串联收官图（13 集 + 19 题全覆盖）'
          });
        }
      }
    ]
  });
})(window);
