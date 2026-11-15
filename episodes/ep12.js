(function (global) {
  'use strict';

  var P = global.COMM_VIZ.PALETTE;

  function toBinaryPad(num, bits) {
    var s = Math.max(0, Math.round(num)).toString(2);
    while (s.length < bits) s = '0' + s;
    return s;
  }

  global.COMM_EPISODES.push({
    id: 'ep12',
    chapter: 'Ch.05 采样与量化（中）',
    title: 'PCM 编解码、6n dB 量化律、μ/A 律压扩与硬件瓶颈',
    slideDeck: '05sampling_XC_PKU',
    slideRange: 'pp. 32–52',
    homeworkTags: ['HW3 · 6.2-2', 'HW3 · 6.2-3', 'HW3 · 6.2-4'],
    scenes: [
      {
        id: 's00',
        tag: '直觉',
        title: 'PCM 脉冲编码调制三步曲 + 电话 64 kbps 与 CD 706 kbps 真算',
        slideRef: '05sampling pp.29–34',
        terms: [
          { en: 'PCM (Pulse Code Modulation)', zh: '脉冲编码调制（采-量-编）' },
          { en: 'Quantization Levels (L = 2^n)', zh: '量化级数与每样本比特数' },
          { en: 'Bit Rate (Rb)', zh: '二进制比特率 (bps)' }
        ],
        symbols: [
          { sym: 'L = 2^n', desc: '将幅度区间 [-m_p, +m_p] 均分成 L 级，用 n 位表示', color: P.cyan },
          { sym: 'R_b = n \\cdot f_s', desc: '单路 PCM 输出总比特率', color: P.amber },
          { sym: '64\\text{ kbps} \\;/\\; 705.6\\text{ kbps}', desc: '数字电话与单声道 CD 音频的经典参考码率', color: P.green }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: 'm(t) \\xrightarrow{\\text{采样 } f_s} m(kT_s) \\xrightarrow{\\text{量化 } L=2^n} m_q(kT_s) \\xrightarrow{\\text{编码}} \\text{0/1 二进制比特流}', label: 'PCM 三步曲：时间离散 + 幅度离散 + 二进制映射' },
          { step: 1, latex: '\\text{数字电话：} B=3.4\\text{ kHz} \\Rightarrow f_s=8\\text{ kHz},\\; L=256\\,(n=8) \\implies R_b = 8000\\times 8 = 64\\text{ kbps}', label: '课件例题 1：为什么传统一路语音通道恒占 64 kbps' },
          { step: 2, latex: '\\text{CD 单声道：} B=15\\text{ kHz} \\Rightarrow f_s=44.1\\text{ kHz},\\; L=65536\\,(n=16) \\implies R_b \\approx 705.6\\text{ kbps}', label: '课件例题 2：立体声双声道再翻倍约 1.41 Mbps' }
        ],
        sliders: [
          { key: 'bits', label: '量化比特数 n (L = 2^n 级)', min: 2, max: 4, step: 1, default: 3, decimals: 0 }
        ],
        presets: [
          { label: '2 bit (4级阶梯)', values: { bits: 2 } },
          { label: '3 bit (8级阶梯)', values: { bits: 3 } },
          { label: '4 bit (16级细腻)', values: { bits: 4 } }
        ],
        lines: [
          {
            step: 0,
            sub: '前面只完成了时间离散，PCM 脉冲编码调制才是真正的模数转换：第一步采样，第二步把连续幅度四舍五入吸附到最近的 $L = 2^n$ 个标准台阶中点，第三步把台阶编号写成 $n$ 位二进制 $01$ 流。',
            tts: '前面只完成了时间离散，P C M 脉冲编码调制才是彻底的模数转换。它只有三步：第一步采样，把时间变离散；第二步量化，把幅度四舍五入吸附到 L 等于二的 n 次方个标准台阶中点；第三步编码，把台阶编号写成 n 位零一二进制比特流。'
          },
          {
            step: 1,
            sub: '来看考前必背的第一个经典真算：数字电话。语音有效带宽 $3.4\\text{ kHz}$，为留滤波保护带取 $f_s = 8\\text{ kHz}$；量化成 $L = 256$ 级（$n = 8\\text{ bit}$），每秒输出 $8000 \\times 8 = 64\\text{ kbps}$！这就是电信网标准语音速率 $64\\text{ k}$ 的来历。',
            tts: '来看考前必记的第一个经典真算：数字电话。语音带宽三点四千赫兹，为了给滤波器留出保护带，采样率定为八千赫兹；分两百五十六个量化台阶，也就是每个样本八比特，乘起来正好等于六十四千比特每秒，这就是标准语音通道的由来。'
          },
          {
            step: 2,
            sub: '再算高保真 CD 音频：人耳可听上限 $15\\text{ kHz}$，抗混叠取 $f_s = 44.1\\text{ kHz}$，高精度分出 $L = 65536$ 级（$n = 16\\text{ bit}$），单声道码率等于 $44.1\\text{k} \\times 16 = 705.6\\text{ kbps}$（约 $706\\text{ kbps}$），立体声双声道再翻倍就是 $1.41\\text{ Mbps}$！',
            tts: '再算第二个经典例子，高保真音乐光盘。信号带宽十五千赫兹，取四十四点一千赫兹采样，用十六比特分出六万五千五百三十六级，乘起来单声道约七百零五点六千比特每秒；如果是左右双声道立体声，再翻一倍就是一点四一兆比特每秒。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var nBits = Math.round(env.params.bits !== undefined ? env.params.bits : 3);
          var L = Math.pow(2, nBits);

          // Panel 0: PCM 3-step pipeline
          var nodes = [
            { id: 'sig', nx: 0.12, ny: 0.42, nw: 0.16, nh: 0.34, label: '模拟信号\nm(t)', color: P.cyan },
            { id: 'smp', nx: 0.36, ny: 0.42, nw: 0.17, nh: 0.34, label: '采样\nfs ≥ 2B', color: P.amber },
            { id: 'qnt', nx: 0.62, ny: 0.42, nw: 0.18, nh: 0.34, label: '均匀量化\nL=' + L + '级', color: P.purple },
            { id: 'enc', nx: 0.88, ny: 0.42, nw: 0.17, nh: 0.34, label: '二进制编码\n' + nBits + ' bit/样', color: P.green }
          ];
          var edges = [
            { from: 'sig', to: 'smp', label: '连续' },
            { from: 'smp', to: 'qnt', label: 'm(kTs)' },
            { from: 'qnt', to: 'enc', label: '台阶号' }
          ];
          env.viz.drawBlockDiagram(ctx, boxes[0], nodes, edges, {
            time: env.time,
            activeId: ['smp', 'qnt', 'enc'][Math.min(2, env.step)],
            title: boxes[0].w < 460 ? 'PCM 采-量-编流程' : 'PCM 脉冲编码调制三环节（L=2^' + nBits + '=' + L + '级）'
          });
          // Footer comparison strip inside Panel 0
          ctx.save();
          ctx.font = '600 11px sans-serif';
          ctx.fillStyle = P.amber;
          ctx.textAlign = 'center';
          ctx.fillText(
            boxes[0].w < 460 ? '电话 8k×8=64k | CD 44.1k×16≈706k' : '电话: 8kHz×8bit = 64 kbps   |   CD单声道: 44.1kHz×16bit = 705.6 kbps',
            boxes[0].x + boxes[0].w / 2,
            boxes[0].y + boxes[0].h - 10
          );
          ctx.restore();

          // Panel 1: Quantization levels & binary labels
          var ax = env.viz.drawAxes(ctx, boxes[1], {
            xMin: 0,
            xMax: 1.0,
            yMin: -1.15,
            yMax: 1.25,
            xGrid: 5,
            yGrid: 4,
            padL: 34,
            xTicks: [[0, '0'], [0.25, '0.25'], [0.5, '0.5'], [0.75, '0.75'], [1.0, '1.0s']],
            yTicks: [[-1, '-mp'], [0, '0'], [1, '+mp']],
            title: boxes[1].w < 460 ? ('量化阶梯 (L=' + L + ')') : ('采样点吸附到中点电平并编成 ' + nBits + ' bit 码字')
          });

          function sig(t) {
            return 0.82 * Math.sin(2 * Math.PI * t) + 0.14 * Math.cos(4 * Math.PI * t);
          }

          // Quantizer mid-point grid lines
          var dv = 2.0 / L;
          ctx.save();
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.18)';
          ctx.lineWidth = 1;
          for (var lv = 0; lv < L; lv++) {
            var yMid = -1.0 + (lv + 0.5) * dv;
            var py = ax.toY(yMid);
            ctx.beginPath();
            ctx.moveTo(ax.px, py);
            ctx.lineTo(ax.px + ax.pw, py);
            ctx.stroke();
          }
          ctx.restore();

          env.viz.drawCurve(ctx, ax, sig, { color: P.cyan, lineWidth: 2.0, fillAlpha: 0.08 });

          var nPts = 6;
          var stems = [];
          var stepPts = [];
          for (var i = 0; i < nPts; i++) {
            var ts = (i + 0.5) / nPts;
            var val = sig(ts);
            var qRes = env.math.uniformQuantize(val, L, 1.0);
            var codeStr = nBits <= 3 ? toBinaryPad(qRes.levelIndex, nBits) : String(qRes.levelIndex);
            stems.push({
              x: ts,
              y: qRes.q,
              color: P.amber,
              width: 2.0,
              label: codeStr
            });
            stepPts.push([i / nPts, qRes.q]);
          }
          stepPts.push([1.0, stepPts[stepPts.length - 1][1]]);
          env.viz.drawStepCurve(ctx, ax, stepPts, { color: 'rgba(52, 211, 153, 0.75)', lineWidth: 1.8 });
          env.viz.drawStems(ctx, ax, stems, {});
        }
      },
      {
        id: 's01',
        tag: '推导',
        title: '均匀量化噪声功率 Δ²/12 与「每多 1 bit 涨 6 dB」黄金律',
        slideRef: '05sampling pp.35–37',
        terms: [
          { en: 'Quantization Noise Power', zh: '量化噪声平均功率 (Δ²/12)' },
          { en: 'SQNR', zh: '信号量化噪声比' },
          { en: '6.02 dB per Bit', zh: '每比特信噪比增益 6 dB 律' }
        ],
        symbols: [
          { sym: '\\Delta = \\frac{2 m_p}{L}', desc: '总摆幅 2m_p 均分为 L 个等宽台阶的间距', color: P.cyan },
          { sym: 'N_q = \\frac{\\Delta^2}{12} = \\frac{m_p^2}{3 L^2}', desc: '均匀落在 [-Δ/2, +Δ/2] 的量化误差功率', color: P.red },
          { sym: '\\text{SQNR} = \\frac{3 L^2 P_m}{m_p^2}', desc: '任意信号通用公式；满幅正弦即 6.02n + 1.76 dB', color: P.green }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: 'q_e = m_q - m \\sim \\text{Uniform}\\!\\left[-\\frac{\\Delta}{2},\\, \\frac{\\Delta}{2}\\right] \\implies N_q = \\int_{-\\Delta/2}^{\\Delta/2} \\frac{q_e^2}{\\Delta}\\,dq_e = \\frac{\\Delta^2}{12} = \\frac{m_p^2}{3 L^2}', label: '核心积分推导：由 Δ = 2m_p/L 直接化简出分母 3L²' },
          { step: 1, latex: '\\text{SQNR} = \\frac{P_m}{N_q} = \\frac{3 L^2 P_m}{m_p^2} \\quad\\xrightarrow{\\text{满幅正弦 } P_m = m_p^2 / 2}\\quad \\text{SQNR} = \\frac{3}{2}\\,L^2 = \\frac{3}{2}\\cdot 2^{2n}', label: '通用公式记牢 3L²Pm / mp²（第 6.2-4 题非正弦正要用它！）' },
          { step: 2, latex: '\\text{SQNR}_{\\text{dB}} = 10\\log_{10}\\!\\left(\\frac{3}{2}\\cdot 2^{2n}\\right) = 6.02\\,n + 1.76\\text{ dB}', label: '黄金规律：每增加 1 个编码比特，SQNR 整整提升 6.02 dB！' }
        ],
        sliders: [
          { key: 'nBits', label: '编码位数 n (L = 2^n)', min: 2, max: 8, step: 1, default: 3, decimals: 0 }
        ],
        presets: [
          { label: '3 bit (19.8 dB)', values: { nBits: 3 } },
          { label: '5 bit (31.9 dB)', values: { nBits: 5 } },
          { label: '8 bit (49.9 dB)', values: { nBits: 8 } }
        ],
        lines: [
          {
            step: 0,
            sub: '四舍五入必然带来不可挽回的量化误差 $q_e = m_q - m$。由于落入每个宽度为 $\\Delta$ 的区间几乎等概，误差在 $[-\\Delta/2, +\\Delta/2]$ 之间均匀分布，对其平方求均值就得到通信最著名的常数之一：$N_q = \\Delta^2 / 12 = m_p^2 / (3 L^2)$！',
            tts: '把连续幅值四舍五入吸附到台阶中点，必然产生误差。如果台阶比较密，量化误差就会均匀分布在负二分之德尔塔到正二分之德尔塔之间，积分求方差得到一个必背常数：量化噪声功率等于德尔塔平方除以十二，代入间距公式就等于峰值平方除以三倍 L 平方。'
          },
          {
            step: 1,
            sub: '信号平均功率 $P_m$ 除以噪声功率 $N_q$，立得全书万能公式：$\\text{SQNR} = \\frac{3 L^2 P_m}{m_p^2}$。如果是满幅正弦波，功率 $P_m = m_p^2 / 2$，代入正好消掉峰值，只剩 $\\frac{3}{2} \\cdot 2^{2n}$！',
            tts: '用信号平均功率除以量化噪声功率，就得到了全章最重要的通用信噪比公式：三倍 L 平方乘以信号功率，再除以峰值平方。对于满幅度正弦波，平均功率刚好是峰值平方的一半，代进去正好简化成二分之三乘以二的二 n 次方。'
          },
          {
            step: 2,
            sub: '两边取 $10\\log_{10}$ 化成分贝，立刻得出工程金律：$\\text{SQNR}_{\\text{dB}} = 6.02n + 1.76\\text{ dB}$！向右拖动比特数滑块体验：每多加 $1$ 比特，阶梯误差砍半、功率减为四分之一，量化信噪比稳稳暴涨 $6\\text{ dB}$！',
            tts: '两边取对数换算成分贝，立刻得到工程师人人会背的六 n 规律：满幅正弦的量化信噪比等于六点零二 n 加一点七六分贝。拖动滑块感受一下：每多给一比特，台阶误差直接减半，噪声功率缩成四分之一，信噪比稳稳猛涨六分贝。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var nBits = Math.round(env.params.nBits !== undefined ? env.params.nBits : 3);
          var L = Math.pow(2, nBits);
          var dv = 2.0 / L;
          var narrow0 = boxes[0].w < 460;
          var narrow1 = boxes[1].w < 460;

          var N = 240;
          var xArr = [];
          var qArr = [];
          var errArr = [];
          var stepPts = [];
          for (var i = 0; i <= N; i++) {
            var t = i / N;
            var val = Math.sin(2 * Math.PI * t);
            var res = env.math.uniformQuantize(val, L, 1.0);
            xArr.push(val);
            qArr.push(res.q);
            errArr.push([t, res.err]);
            if (i === 0 || Math.abs(res.q - stepPts[stepPts.length - 1][1]) > 1e-6 || i === N) {
              stepPts.push([t, res.q]);
            }
          }
          var errVals = [];
          for (var j = 0; j < errArr.length; j++) errVals.push(errArr[j][1]);
          var measDb = env.math.sqnrDb(xArr, errVals);
          var theoryDb = env.math.uniformSqnrTheory(L, 0.5, 1.0);

          // Panel 0: Original sine vs Quantized staircase
          var ax0 = env.viz.drawAxes(ctx, boxes[0], {
            xMin: 0,
            xMax: 1.0,
            yMin: -1.18,
            yMax: 1.25,
            xGrid: 4,
            yGrid: 4,
            padL: 32,
            xTicks: [[0, '0'], [0.5, 'T/2'], [1, 'T']],
            yTicks: [[-1, '-1'], [0, '0'], [1, '+1']],
            title: narrow0 ? ('n=' + nBits + ' bit (L=' + L + ')') : ('满幅正弦均匀量化：原波形 vs ' + L + '级阶梯')
          });
          env.viz.drawCurve(ctx, ax0, function (t) { return Math.sin(2 * Math.PI * t); }, { color: P.cyan, lineWidth: 2.0 });
          env.viz.drawStepCurve(ctx, ax0, stepPts, { color: P.amber, lineWidth: 2.0 });
          env.viz.drawAnnotation(ctx, ax0, 0.5, 1.04, 'Δ = 2/' + L + ' = ' + dv.toFixed(4), P.amber, 'center');

          // Panel 1: Quantization error q_e within [-Delta/2, +Delta/2]
          var halfD = dv / 2;
          var yBound = Math.max(0.05, halfD * 1.45);
          var ax1 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: 0,
            xMax: 1.0,
            yMin: -yBound,
            yMax: yBound * 1.25,
            xGrid: 4,
            yGrid: 4,
            padL: 42,
            xTicks: [[0, '0'], [0.5, 'T/2'], [1, 'T']],
            yTicks: [[-halfD, (-halfD).toFixed(2)], [0, '0'], [halfD, '+' + halfD.toFixed(2)]],
            title: narrow1 ? ('误差 & SQNR=' + theoryDb.toFixed(1) + 'dB') : ('量化锯齿误差 q_e ∈ [-Δ/2, +Δ/2]'),
            subtitle: narrow1 ? undefined : ('实测 ' + measDb.toFixed(1) + ' / 理论 ' + theoryDb.toFixed(1) + ' dB'),
            subtitleColor: P.green
          });
          env.viz.drawCurve(ctx, ax1, function () { return halfD; }, { color: P.green, dash: [4, 3], lineWidth: 1.3 });
          env.viz.drawCurve(ctx, ax1, function () { return -halfD; }, { color: P.green, dash: [4, 3], lineWidth: 1.3 });
          env.viz.drawCurve(ctx, ax1, errArr, { color: P.red, lineWidth: 1.7, fillAlpha: 0.16 });
          if (narrow1) {
            env.viz.drawAnnotation(ctx, ax1, 0.5, yBound * 0.92, '理论 6.02n+1.76 = ' + theoryDb.toFixed(1) + ' dB', P.green, 'center');
          }
        }
      },
      {
        id: 's02',
        tag: '作业精讲',
        hwCode: '6.2-2',
        title: 'HW3 作业 6.2-2：超采 20% 视频编码速率与最小带宽',
        slideRef: 'HW3 · 6.2-2',
        terms: [
          { en: '20% Oversampling', zh: '高于奈奎斯特速率 20%' },
          { en: 'Binary PCM Bandwidth', zh: '二进制 PCM 基带最小带宽' }
        ],
        symbols: [
          { sym: 'B = 4.5\\text{ MHz}', desc: '题给模拟视频信号带宽', color: P.cyan },
          { sym: 'f_s = 1.2 \\times 2B = 10.8\\text{ MHz}', desc: '比奈奎斯特速率 9 MHz 高 20% 后的实际采样率', color: P.amber },
          { sym: 'R_b = 108\\text{ Mbit/s},\\; B_{\\min} = 54\\text{ MHz}', desc: '1024 级 (10 bit) 输出比特率与最低所需信道带宽', color: P.green }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: '\\text{(a) 奈奎斯特速率 } 2B = 2\\times 4.5 = 9\\text{ MHz} \\implies f_s = 1.2\\times 9 = 10.8\\text{ MHz}', label: '第一问：先算基准 2B，再乘以超采系数 1.20' },
          { step: 1, latex: '\\text{(b) } L = 1024 = 2^{10} \\implies \\text{每个样本需要 } n = \\log_2 L = 10\\text{ 个二进制脉冲}', label: '第二问：由量化等级数取以 2 为底的对数得比特位数' },
          { step: 2, latex: '\\text{(c) } R_b = 10.8\\times 10^6 \\times 10 = 108\\text{ Mbit/s},\\qquad B_{\\min} = \\frac{R_b}{2} = 54\\text{ MHz}', label: '第三问：带宽 B 的无噪信道最多每秒传 2B 个二进制脉冲，故 B_min = R_b / 2' }
        ],
        sliders: [
          { key: 'overPct', label: '超采比例 (%)', min: 0, max: 50, step: 5, default: 20, unit: '%', decimals: 0 }
        ],
        presets: [
          { label: '作业原题 (+20% → 108 Mbps)', values: { overPct: 20 } },
          { label: '无超采极限 (0% → 90 Mbps)', values: { overPct: 0 } }
        ],
        lines: [
          {
            step: 0,
            sub: '直奔第三次作业 6.2-2！已知视频信号带宽 $B = 4.5\\text{ MHz}$。它的奈奎斯特速率是 $2B = 9\\text{ MHz}$，题目要求采样率高出 $20\\%$，所以第 (a) 问：$f_s = 1.2 \\times 9 = 10.8\\text{ MHz}$。',
            tts: '直接来看第三次作业六点二杠二题。已知电视视频信号带宽四点五兆赫兹，那么奈奎斯特速率就是两倍带宽等于九兆赫兹。题目要求比奈奎斯特速率高出百分之二十，所以第一问实际采样率就是一点二乘以九，等于十点八兆赫兹。'
          },
          {
            step: 1,
            sub: '第 (b) 问：样本量化成 $L = 1024$ 个电平，问每个样本用几个二进制脉冲？因为 $1024 = 2^{10}$，所以每个样本需要 $n = \\log_2 1024 = 10$ 个二进制脉冲（10 bit）。',
            tts: '第二问：如果每个采样点量化成一千零二十四个均匀电平，需要几个二进制脉冲？因为一千零二十四正好是二的十次方，所以每个样本需要十个二进制脉冲，也就是十比特。'
          },
          {
            step: 2,
            sub: '第 (c) 问算比特率与最小带宽：$R_b = 10.8\\text{ MHz} \\times 10 = 108\\text{ Mbit/s}$！又由课件结论，带宽为 $B_{\\min}$ 的信道每秒最多无混叠传送 $2B_{\\min}$ 个脉冲，所以最小信道带宽 $B_{\\min} = R_b / 2 = 54\\text{ MHz}$！注意未压缩数字视频暴涨了 $12$ 倍带宽！',
            tts: '第三问算总比特率与最小带宽：每秒十点八兆个样本，每个样本十比特，总比特率直接就是一百零八兆比特每秒。记住奈奎斯特脉冲传速率极限，带宽 B 的无噪信道每秒最多无码间串扰地传二 B 个脉冲，所以所需最小基带带宽等于速率除以二，等于五十四兆赫兹。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var pct = env.params.overPct !== undefined ? env.params.overPct : 20;
          var B = 4.5;
          var fNyq = 9.0;
          var fs = fNyq * (1 + pct / 100);
          var nBits = 10;
          var Rb = fs * nBits;
          var Bmin = Rb / 2;

          // Panel 0: Interactive calculation flow
          var nodes = [
            { id: 'b', nx: 0.13, ny: 0.45, nw: 0.17, nh: 0.36, label: '信号带宽\nB=4.5 MHz', color: P.cyan },
            { id: 'fs', nx: 0.38, ny: 0.45, nw: 0.18, nh: 0.36, label: '超采 +' + pct + '%\n' + fs.toFixed(1) + ' MHz', color: P.amber },
            { id: 'rb', nx: 0.64, ny: 0.45, nw: 0.19, nh: 0.36, label: '×10 bit/样\n' + Rb.toFixed(1) + ' Mbps', color: P.purple },
            { id: 'bw', nx: 0.88, ny: 0.45, nw: 0.18, nh: 0.36, label: '÷2 基带限\n' + Bmin.toFixed(1) + ' MHz', color: P.green }
          ];
          var edges = [
            { from: 'b', to: 'fs', label: '×2×' + (1 + pct / 100).toFixed(2) },
            { from: 'fs', to: 'rb', label: 'L=1024' },
            { from: 'rb', to: 'bw', label: 'Rb/2' }
          ];
          env.viz.drawBlockDiagram(ctx, boxes[0], nodes, edges, {
            time: env.time,
            activeId: ['fs', 'rb', 'bw'][Math.min(2, env.step)],
            title: boxes[0].w < 460 ? '6.2-2 链路核算' : 'HW 6.2-2 逐级参数换算链路'
          });

          // Panel 1: Bandwidth & Rate Expansion Bar comparison
          var narrow1 = boxes[1].w < 460;
          var ax = env.viz.drawAxes(ctx, boxes[1], {
            xMin: 0.4,
            xMax: 4.6,
            yMin: 0,
            yMax: 145,
            xGrid: 4,
            yGrid: 4,
            padL: 38,
            xTicks: narrow1 ? [[1, 'B'], [2, '2B'], [3, 'Bmin'], [4, 'Rb']] : [[1, '原带宽B'], [2, '奈氏2B'], [3, '最小Bmin'], [4, '比特率Rb']],
            yTicks: [[0, '0'], [54, '54'], [108, '108']],
            title: narrow1 ? '带宽膨胀对比 (MHz/Mbps)' : 'PCM 数字化带来的带宽膨胀（MHz / Mbps）'
          });
          env.viz.drawStems(ctx, ax, [
            { x: 1, y: B, color: P.cyan, width: 14, label: B.toFixed(1) + 'M' },
            { x: 2, y: fs, color: P.amber, width: 14, label: fs.toFixed(1) + 'M' },
            { x: 3, y: Bmin, color: P.green, width: 14, label: Bmin.toFixed(1) + 'M' },
            { x: 4, y: Rb, color: P.purple, width: 14, label: Rb.toFixed(0) + 'Mb' }
          ], {});
        }
      },
      {
        id: 's03',
        tag: '作业精讲',
        hwCode: '6.2-3',
        title: 'HW3 作业 6.2-3：量化误差上限反推位数与 128 路立体声复用',
        slideRef: 'HW3 · 6.2-3',
        terms: [
          { en: 'Peak Error Bound (mp / L)', zh: '最大量化误差上限 Δv/2 = mp/L' },
          { en: '128 Stereo Stations (256 ch)', zh: '128 立体声电台 = 256 路音频' },
          { en: 'Sync Overhead (+5%)', zh: '5% 帧同步与控制开销' }
        ],
        symbols: [
          { sym: '\\frac{\\Delta v}{2} = \\frac{m_p}{L} \\le 0.25\\%\\, m_p', desc: '关键易错点：最大误差是 m_p/L（得 L ≥ 400 → n = 9）', color: P.cyan },
          { sym: 'N_{\\text{ch}} = 128\\times 2 = 256\\text{ 路}', desc: '立体声含左右两声道，每路 15 kHz 超采 20% 得 36 kHz', color: P.amber },
          { sym: 'R_b\' = 87.0912\\text{ Mbit/s}', desc: '加 5% 比特后速率，对应最小传输带宽 43.55 MHz', color: P.green }
        ],
        errata: '两个考场必避陷阱：① 最大量化误差为半个区间 Δv/2 = m_p/L，不是 2m_p/L；② 立体声（Stereo）电台是左右双声道，128 个电台对应 256 路独立信号！',
        formulas: [
          { step: 0, latex: '\\text{(a) } \\frac{\\Delta v}{2} = \\frac{m_p}{L} \\le 0.0025\\,m_p \\implies L \\ge 400 \\implies n = \\lceil \\log_2 400 \\rceil = 9\\text{ 位 } (L=512)', label: '2⁸=256 不够，必须向上取整为 9 位 (L=512)' },
          { step: 1, latex: '\\text{(b) } 256\\text{ 路},\\; f_s = 1.2\\times 2\\times 15000 = 36\\text{ kHz} \\implies R_b = 256\\times 36000\\times 9 = 82.944\\text{ Mbit/s}', label: '每路独立采样编码后按时分复用拼接' },
          { step: 2, latex: '\\text{(c) 加 5\\% 开销：} R_b\' = 1.05\\times 82.944 = 87.0912\\text{ Mbit/s},\\qquad B_{\\min} = \\frac{R_b\'}{2} \\approx 43.55\\text{ MHz}', label: '含同步开销的最终总比特率与最小传输带宽' }
        ],
        sliders: [
          { key: 'nPick', label: '测试选择位数 n (L = 2^n)', min: 7, max: 11, step: 1, default: 9, decimals: 0 }
        ],
        presets: [
          { label: '试选 8 位 (误差0.39%✗超标)', values: { nPick: 8 } },
          { label: '9 位正解 (误差0.195%✓)', values: { nPick: 9 } },
          { label: '试选 10 位 (冗余多耗带宽)', values: { nPick: 10 } }
        ],
        lines: [
          {
            step: 0,
            sub: '紧接着攻克 6.2-3 的两处高危陷阱！第 (a) 问要求最大量化误差不超过峰值的 $0.25\\%$。千万牢记：间隔总宽是 $\\Delta v = 2m_p / L$，中点最大偏差是一半 $\\frac{\\Delta v}{2} = \\frac{m_p}{L}$！令 $1/L \\le 0.0025$ 解出 $L \\ge 400$。$8$ 位只有 $256$ 级不够，必须向上取整到 $n = 9$ 位（$L = 512$）！',
            tts: '接着攻克六点二杠三的两处经典考场陷阱。第一问要求最大量化误差不超过峰值的千分之二点五。千万记住：区间宽是二 m p 除以 L，中点最大偏差只有半个区间，也就是 m p 除以 L。解出 L 大于等于四百。八比特只有两百五十六级不够用，必须向上取整用九比特，对应五百一十二级。'
          },
          {
            step: 1,
            sub: '第 (b) 问藏着第二个坑：复用 $128$ 个调频立体声电台！因为立体声含左右两声道，实际是 $128 \\times 2 = 256$ 路音频！每路带宽 $15\\text{ kHz}$ 超采 $20\\%$ 得 $f_s = 1.2 \\times 30\\text{ kHz} = 36\\text{ kHz}$，总净速率 $R_b = 256 \\times 36000 \\times 9 = 82.944\\text{ Mbit/s}$！',
            tts: '第二问藏着第二个坑：要把一百二十八个立体声调频电台时分复用。立体声有左右两个声道，所以总路数是两百五十六路，千万别漏乘以二。每路音频带宽十五千赫兹，同样超采百分之二十，采样率等于三十六千赫兹。三项相乘得到净比特率八十二点九四四兆比特每秒。'
          },
          {
            step: 2,
            sub: '第 (c) 问加上 $5\\%$ 的帧同步与信令开销：$R_b\' = 1.05 \\times 82.944 = 87.0912\\text{ Mbit/s}$；用老规矩除以 $2$，得到复用传输所需最小基带带宽 $B_{\\min} = R_b\' / 2 \\approx 43.55\\text{ MHz}$！',
            tts: '第三问还要加上百分之五的同步与控制额外比特：一点零五乘以八十二点九四四，得到总比特率八十七点零九一二兆比特每秒；再除以二，就算出最小所需信道带宽约为四十三点五五兆赫兹。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var nPick = Math.round(env.params.nPick !== undefined ? env.params.nPick : 9);
          var narrow0 = boxes[0].w < 460;
          var narrow1 = boxes[1].w < 460;

          // Panel 0: Relative peak error 100 / 2^n (%) vs 0.25% ceiling
          var ax0 = env.viz.drawAxes(ctx, boxes[0], {
            xMin: 6.4,
            xMax: 11.6,
            yMin: 0,
            yMax: 0.92,
            xGrid: 5,
            yGrid: 4,
            padL: 38,
            xTicks: [[7, 'n=7'], [8, 'n=8'], [9, 'n=9'], [10, 'n=10'], [11, 'n=11']],
            yTicks: [[0, '0%'], [0.25, '0.25%'], [0.5, '0.5%'], [0.8, '0.8%']],
            title: narrow0 ? '最大误差 1/L vs 0.25%' : '最大量化误差占比 1/2^n vs 0.25% 红线'
          });
          env.viz.drawCurve(ctx, ax0, function () { return 0.25; }, { color: P.red, dash: [5, 4], lineWidth: 1.8 });
          var stems = [];
          for (var n = 7; n <= 11; n++) {
            var errPct = 100 / Math.pow(2, n);
            var pass = errPct <= 0.25;
            var isSel = n === nPick;
            stems.push({
              x: n,
              y: errPct,
              color: isSel ? (pass ? P.green : P.red) : (pass ? 'rgba(52,211,153,0.45)' : 'rgba(251,113,133,0.45)'),
              width: isSel ? 12 : 6,
              label: errPct.toFixed(n >= 9 ? 3 : 2) + '%'
            });
          }
          env.viz.drawStems(ctx, ax0, stems, {});
          env.viz.drawAnnotation(ctx, ax0, 9.8, 0.27, '上限 0.25% (L≥400)', P.red, 'center');

          // Panel 1: Bitrate breakdown for selected nPick
          var Lpick = Math.pow(2, nPick);
          var rbPayload = (256 * 36000 * nPick) / 1e6;
          var rbTotal = rbPayload * 1.05;
          var bMin = rbTotal / 2;

          var b1 = boxes[1];
          env.viz.roundRect(ctx, b1.x, b1.y, b1.w, b1.h, 10);
          ctx.fillStyle = P.panelBg;
          ctx.fill();
          ctx.strokeStyle = '#1e2948';
          ctx.stroke();
          env.viz.drawBadge(ctx, b1.x + 8, b1.y + 4, narrow1 ? ('n=' + nPick + ' (L=' + Lpick + ')') : ('128台×2声道=256路 复用核算 (n=' + nPick + ')'), P.cyan, false);

          var pad = 16;
          var barW = Math.max(40, b1.w - pad * 2);
          var barH = 26;
          var yBar = b1.y + b1.h * 0.42;
          var maxRate = 110;
          var wPay = Math.min(barW, (rbPayload / maxRate) * barW);
          var wOver = Math.min(barW - wPay, ((rbTotal - rbPayload) / maxRate) * barW);

          ctx.fillStyle = '#1d2744';
          ctx.fillRect(b1.x + pad, yBar, barW, barH);
          ctx.fillStyle = nPick >= 9 ? P.cyan : P.red;
          ctx.fillRect(b1.x + pad, yBar, wPay, barH);
          ctx.fillStyle = P.amber;
          ctx.fillRect(b1.x + pad + wPay, yBar, wOver, barH);

          ctx.font = '600 11.5px sans-serif';
          ctx.fillStyle = P.text;
          ctx.textAlign = 'left';
          ctx.textBaseline = 'bottom';
          ctx.fillText('净数据率 Rb = 256 × 36k × ' + nPick + ' = ' + rbPayload.toFixed(3) + ' Mbps', b1.x + pad, yBar - 6);

          ctx.textBaseline = 'top';
          ctx.fillStyle = P.amber;
          ctx.fillText('+5%同步总速率 Rb\' = ' + rbTotal.toFixed(4) + ' Mbps', b1.x + pad, yBar + barH + 10);
          ctx.fillStyle = P.green;
          ctx.font = '700 12.5px sans-serif';
          ctx.fillText('最小信道带宽 Bmin = Rb\'/2 = ' + bMin.toFixed(2) + ' MHz' + (nPick === 9 ? '  ✓ 正解' : (nPick < 9 ? '  ✗ 精度不达标' : '  (非最小)')), b1.x + pad, yBar + barH + 30);
        }
      },
      {
        id: 's04',
        tag: '作业精讲',
        hwCode: '6.2-4',
        title: 'HW3 作业 6.2-4：已知目标 SQNR 43 dB 与功率反推位数 n',
        slideRef: 'HW3 · 6.2-4',
        terms: [
          { en: 'Normalized Peak & Power', zh: '归一化峰值 mp 与平均功率 Pm' },
          { en: 'Non-Sinusoidal SQNR', zh: '非正弦通用公式 3L²Pm / mp²' }
        ],
        symbols: [
          { sym: 'm_p = 1\\text{ V},\\; P_m = 0.02\\text{ W}', desc: '题给峰值电压 1V 与信号功率 20 mW = 0.02 W', color: P.cyan },
          { sym: '10^{4.3} \\approx 1.995\\times 10^4', desc: '目标 43 dB 对应的线性信噪比门限', color: P.amber },
          { sym: 'n = 10\\; (L = 1024,\\; 48.0\\text{ dB})', desc: '最小达标位数及回代算出的实际输出信噪比', color: P.green }
        ],
        errata: '高频踩坑警告：题给信号峰均功率比 m_p²/P_m = 50，远大于正弦波的 2！若误套 6.02n + 1.76 会错算出 n=7，必须代通用公式 3L²P_m/m_p²！',
        formulas: [
          { step: 0, latex: '\\text{SQNR} = \\frac{3 L^2 P_m}{m_p^2} = \\frac{3 L^2 \\times 0.02}{1^2} = 0.06\\, L^2', label: '第一步：代入 m_p = 1 V 与 P_m = 20 mW = 0.02 W' },
          { step: 1, latex: '0.06\\, L^2 \\ge 10^{43/10} = 10^{4.3} \\approx 1.995\\times 10^4 \\implies L^2 \\ge 3.325\\times 10^5 \\implies L \\ge 576.7', label: '第二步：分贝换算线性值求解电平数下界 L ≥ 577' },
          { step: 2, latex: 'L = 2^n \\ge 577 \\implies n = 10\\;(L=1024),\\quad \\text{实际 SQNR} = 0.06\\times 1024^2 \\approx 6.29\\times 10^4 \\approx 48.0\\text{ dB}', label: '第三步：9 位只有 42.0 dB 不及格，必须取 10 位得 48.0 dB' }
        ],
        sliders: [
          { key: 'nBits', label: '编码位数 n (观察跨越 43 dB 及格线)', min: 7, max: 12, step: 1, default: 10, decimals: 0 }
        ],
        presets: [
          { label: 'n=8 (35.9 dB ✗)', values: { nBits: 8 } },
          { label: 'n=9 (42.0 dB ✗差1dB)', values: { nBits: 9 } },
          { label: 'n=10 (48.0 dB ✓正解)', values: { nBits: 10 } }
        ],
        lines: [
          {
            step: 0,
            sub: '看 6.2-4 的经典考坑！题目给信号峰值 $m_p = 1\\text{ V}$、平均功率 $P_m = 20\\text{ mW} = 0.02\\text{ W}$。千万别一见 SQNR 就去套 $6.02n + 1.76$！那条捷径只适用于峰均比为 $2$ 的满幅正弦；这道题功率小得多，必须用原始通用公式 $\\text{SQNR} = \\frac{3 L^2 P_m}{m_p^2} = 0.06\\, L^2$！',
            tts: '来看六点二杠四题的超级考坑。题目给出信号峰值一伏，平均功率二十毫瓦也就是零点零二瓦。千万不要条件反射去套六点零二 n 加一点七六，那个捷径只适用于满幅正弦波！这道题波形的峰均比远大于正弦波，必须老老实实代回原始公式：三 L 平方 P m 除以 m p 平方，算出来等于零点零六乘以 L 平方。'
          },
          {
            step: 1,
            sub: '接下来把目标 $43\\text{ dB}$ 还原成线性比值：$10^{43/10} = 10^{4.3} \\approx 19953$。解不等式 $0.06\\, L^2 \\ge 19953$，得到 $L^2 \\ge 3.325 \\times 10^5$，开方得 $L \\ge 576.7$（即至少 $577$ 级）。',
            tts: '接下来把要求信噪比四十三分贝换回线性比例，就是十的四点三次方，大约一万九千九百五十三。解不等式零点零六 L 平方大于等于一万九千九百五十三，开平方算出量化级数 L 至少需要五百七十七级。'
          },
          {
            step: 2,
            sub: '在 $2$ 的整次幂里挨个试：取 $n=9$ 得 $L=512$，回代 $\\text{SQNR} = 41.96\\text{ dB}$，离 $43\\text{ dB}$ 还差一口气！只有取到 $n=10$（$L=1024$），实际 $\\text{SQNR} = 0.06 \\times 1024^2 \\approx 6.29 \\times 10^4 \\approx 48.0\\text{ dB}$，稳稳跨过及格线！',
            tts: '拿二的整次幂来验证：如果取九比特，L 等于五百一十二，回代只有大约四十二分贝，离四十三分贝还差一分贝不及格。必须取到十比特，L 等于一千零二十四，回代算出实际信噪比大约六点二九乘以十的四次方，也就是四十八点零分贝，稳稳跨越红线。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var nSel = Math.round(env.params.nBits !== undefined ? env.params.nBits : 10);
          var narrow0 = boxes[0].w < 460;
          var narrow1 = boxes[1].w < 460;

          // Panel 0: SQNR(n) vs 43 dB line & misleading sine curve
          var ax0 = env.viz.drawAxes(ctx, boxes[0], {
            xMin: 6.4,
            xMax: 12.6,
            yMin: 25,
            yMax: 78,
            xGrid: 6,
            yGrid: 5,
            padL: 38,
            xTicks: [[7, 'n=7'], [8, '8'], [9, '9'], [10, '10'], [11, '11'], [12, '12']],
            yTicks: [[30, '30'], [43, '43dB'], [60, '60']],
            title: narrow0 ? 'SQNR(n) 跨 43dB 线' : '本题实际 SQNR (0.06L²) vs 误用正弦公式对比'
          });

          // Target threshold 43 dB
          env.viz.drawCurve(ctx, ax0, function () { return 43; }, { color: P.amber, dash: [5, 4], lineWidth: 1.8 });
          // Misleading 6.02n + 1.76 line
          env.viz.drawCurve(ctx, ax0, function (x) { return 6.02 * x + 1.76; }, { color: 'rgba(244, 114, 182, 0.55)', dash: [3, 3], lineWidth: 1.5 });

          var stems = [];
          for (var n = 7; n <= 12; n++) {
            var L = Math.pow(2, n);
            var db = env.math.uniformSqnrTheory(L, 0.02, 1.0);
            var pass = db >= 43;
            var isSel = n === nSel;
            stems.push({
              x: n,
              y: db,
              color: isSel ? (pass ? P.green : P.red) : (pass ? 'rgba(52,211,153,0.45)' : 'rgba(251,113,133,0.45)'),
              width: isSel ? 12 : 6,
              label: db.toFixed(1)
            });
          }
          env.viz.drawStems(ctx, ax0, stems, {});
          env.viz.drawAnnotation(ctx, ax0, 10.6, 67, '误套6n+1.76(高虚14dB)', P.pink, 'center');
          env.viz.drawAnnotation(ctx, ax0, 8.2, 44.5, '及格线 43 dB', P.amber, 'center');

          // Panel 1: Live computation meter
          var Lsel = Math.pow(2, nSel);
          var linSqnr = 0.06 * Lsel * Lsel;
          var dbSel = 10 * Math.log10(linSqnr);
          var b1 = boxes[1];
          env.viz.roundRect(ctx, b1.x, b1.y, b1.w, b1.h, 10);
          ctx.fillStyle = P.panelBg;
          ctx.fill();
          ctx.strokeStyle = '#1e2948';
          ctx.stroke();
          env.viz.drawBadge(ctx, b1.x + 8, b1.y + 4, '当前试选 n=' + nSel + ' (L=' + Lsel + ')', dbSel >= 43 ? P.green : P.red, false);

          var pad = 16;
          var y0 = b1.y + b1.h * 0.36;
          ctx.font = '600 12px sans-serif';
          ctx.fillStyle = P.text;
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillText('线性倍数: 0.06 × ' + Lsel + '² = ' + Math.round(linSqnr).toLocaleString(), b1.x + pad, y0);
          ctx.fillStyle = P.amber;
          ctx.fillText('门限要求: 10^4.3 ≈ 19,953 (即 L ≥ 577)', b1.x + pad, y0 + 24);

          var meterY = y0 + 50;
          var meterW = Math.max(40, b1.w - pad * 2);
          ctx.fillStyle = '#1d2744';
          ctx.fillRect(b1.x + pad, meterY, meterW, 20);
          var fillW = Math.min(meterW, Math.max(0, (dbSel / 65) * meterW));
          ctx.fillStyle = dbSel >= 43 ? P.green : P.red;
          ctx.fillRect(b1.x + pad, meterY, fillW, 20);

          // 43 dB marker
          var thrX = b1.x + pad + (43 / 65) * meterW;
          ctx.strokeStyle = P.amber;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(thrX, meterY - 5);
          ctx.lineTo(thrX, meterY + 25);
          ctx.stroke();

          ctx.font = '700 13px sans-serif';
          ctx.fillStyle = dbSel >= 43 ? P.green : P.red;
          ctx.fillText('实际 SQNR = ' + dbSel.toFixed(2) + ' dB  ' + (dbSel >= 43 ? (nSel === 10 ? '✓ 最小达标正解!' : '✓ 达标') : '✗ 未达 43 dB'), b1.x + pad, meterY + 38);
        }
      },
      {
        id: 's05',
        tag: '直觉',
        title: '为什么小声音必须用非均匀压扩（μ 律 / A 律）？',
        slideRef: '05sampling pp.40–44',
        terms: [
          { en: 'Nonuniform Quantization', zh: '非均匀量化（小密大疏）' },
          { en: 'Companding (μ-law / A-law)', zh: '压扩曲线（μ=255 / A=87.6）' }
        ],
        symbols: [
          { sym: 'y = \\operatorname{sgn}(x)\\frac{\\ln(1+\\mu|x|)}{\\ln(1+\\mu)}', desc: 'μ 律对数压缩特征（北美/日本采用 μ=255）', color: P.cyan },
          { sym: 'A = 87.6', desc: '欧洲与中国标准 A 律压扩常数（小信号用线性斜率保护）', color: P.amber },
          { sym: '\\text{SQNR}_{\\text{弱语音}}', desc: '开启压扩后，弱信号也能稳住 30+ dB 高信噪比', color: P.green }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: '\\text{均匀量化困境：强弱声音共用固定 } \\Delta \\implies \\text{大声 50 dB，小声只跳 1–2 阶，SQNR 暴跌!}', label: '人声动态范围超过 40 dB，均匀分格让小音量几乎只剩粗暴方波' },
          { step: 1, latex: 'x \\xrightarrow{\\text{对数压缩}} y \\xrightarrow{\\text{标准均匀 ADC}} y_q \\xrightarrow{\\text{指数扩张}} x_q', label: '工程妙招：只需在现成均匀 ADC 前后各加对数压缩与反扩张' },
          { step: 2, latex: '\\mu\\text{ 律：} y=\\operatorname{sgn}(x)\\frac{\\ln(1+\\mu|x|)}{\\ln(1+\\mu)}\\;(\\mu=255);\\quad A\\text{ 律：}\\begin{cases}\\frac{A|x|}{1+\\ln A},&|x|<\\frac{1}{A}\\\\\\frac{1+\\ln(A|x|)}{1+\\ln A},&\\frac{1}{A}\\le|x|\\le1\\end{cases}', label: '小幅度处切分超细密，大幅度处适当放宽，全音量范围 SQNR 平坦' }
        ],
        sliders: [
          { key: 'ampScale', label: '语音输入相对幅度 |m|/mp', min: 0.08, max: 1.00, step: 0.04, default: 0.16, decimals: 2 },
          { key: 'mu', label: 'μ 律压扩强度 (0=纯均匀, 255=标准)', min: 0, max: 255, step: 15, default: 255, decimals: 0 }
        ],
        presets: [
          { label: '弱语音 无压扩 (|m|=0.16, μ=0)', values: { ampScale: 0.16, mu: 0 } },
          { label: '弱语音 开μ=255压扩!', values: { ampScale: 0.16, mu: 255 } },
          { label: '强语音 开μ=255', values: { ampScale: 0.96, mu: 255 } }
        ],
        lines: [
          {
            step: 0,
            sub: '电话里既有震耳欲聋的大喊，也有轻声细语的耳语。如果用均匀量化，大声和耳语共用同一个固定的台阶间距 $\\Delta$：点击「弱语音 无压扩」预设看看，小声只有峰值百分之十六时，在十六级均匀量化下几乎只跨一两格，波形碎成粗方波、SQNR 惨跌！',
            tts: '真实通话里既有洪亮的大嗓门，也有轻声细语。如果一直用均匀量化，大小声共享同一套死板的固定台阶，点击弱语音无压扩预设就能看到：当声音降到满幅的百分之十六时，波形只敢在零点附近的两三个台阶来回跳，严重失真，信噪比惨跌。'
          },
          {
            step: 1,
            sub: '解决办法是让零点附近小幅度区域的量化台阶特别密集、大声区域稍粗犷！而且根本不用重造非均匀硬件：只需在均匀量化器前面加一个对数压缩器（Compressor），把微弱信号先拉高，收端再做一次反扩张（Expander）还原即可！',
            tts: '解决办法很简单：零点附近小声音区域的量化刻度必须密密麻麻，大声音区域稍微宽松一点。工程上更绝的是，压根不用专门定制非均匀硬件，只需要在标准均匀量化器前面串一个对数压缩曲线，把小信号先猛地抬起来量化，到达接收端再反向扩张还原就行了。'
          },
          {
            step: 2,
            sub: '现在把 $\\mu$ 律滑块切到标准值 $255$（北美/日本标准；欧洲和中国采用折线 $A=87.6$ 律）！左图显示对数压缩把均匀的 $y$ 轴刻线精准映射成零点附近高密度刻线；右图原本方波化的弱语音瞬间恢复丝滑正弦，弱信号 SQNR 凭空猛涨将近 $20\\text{ dB}$！',
            tts: '现在把缪律系数切到标准值两百五十五，记住北美和日本用缪等于两百五十五，欧洲和中国通信网用 A 等于八十七点六。看左图的映射：均匀输出格网穿过对数曲线后，零点附近的输入刻度瞬间密集成群；右边原本方波化的弱语音立刻恢复顺滑，量化信噪比凭空救回将近二十分贝。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var amp = env.params.ampScale !== undefined ? env.params.ampScale : 0.16;
          var mu = Math.round(env.params.mu !== undefined ? env.params.mu : 255);
          var L = 16; // 4-bit visual so non-uniform vs uniform steps are super vivid
          var narrow0 = boxes[0].w < 460;
          var narrow1 = boxes[1].w < 460;

          // Panel 0: mu-Law Compression characteristic + non-uniform input grid mapping
          var ax0 = env.viz.drawAxes(ctx, boxes[0], {
            xMin: -1.05,
            xMax: 1.05,
            yMin: -1.05,
            yMax: 1.05,
            xGrid: 4,
            yGrid: 4,
            padL: 34,
            xTicks: [[-1, '-1'], [0, '0'], [1, '+1']],
            yTicks: [[-1, '-1'], [0, '0'], [1, '+1']],
            title: narrow0 ? ('μ=' + mu + ' 压扩映射') : ('压扩特性 y(x)：均匀输出纵轴 → 零点加密横轴 (μ=' + mu + ')')
          });

          // Linear reference
          env.viz.drawCurve(ctx, ax0, function (x) { return x; }, { color: 'rgba(148,163,184,0.35)', dash: [4, 4], lineWidth: 1.3 });
          // Highlight active weak-signal window [-amp, amp]
          env.viz.drawShadedBand(ctx, ax0, -amp, amp, 'rgba(56, 189, 248, 0.12)', narrow0 ? undefined : '弱信号区');
          // Non-uniform ticks on x-axis from uniform y-levels
          ctx.save();
          ctx.strokeStyle = 'rgba(251, 191, 36, 0.25)';
          ctx.lineWidth = 1;
          for (var lv = 1; lv < L; lv++) {
            var yEdge = -1 + (2 * lv) / L;
            var xEdge = mu > 0 ? env.math.muLawExpand(yEdge, mu) : yEdge;
            ctx.beginPath();
            ctx.moveTo(ax0.px, ax0.toY(yEdge));
            ctx.lineTo(ax0.toX(xEdge), ax0.toY(yEdge));
            ctx.lineTo(ax0.toX(xEdge), ax0.py + ax0.ph);
            ctx.stroke();
          }
          ctx.restore();

          env.viz.drawCurve(ctx, ax0, function (x) {
            return env.math.muLawCompress(x, mu);
          }, { color: P.cyan, lineWidth: 2.5 });

          // Panel 1: Weak signal waveform under uniform vs mu-law companded quantization
          var N = 160;
          var xArr = [];
          var errArr = [];
          var qPts = [];
          for (var i = 0; i <= N; i++) {
            var t = i / N;
            var xVal = amp * Math.sin(2 * Math.PI * t);
            var qRes = env.math.quantizeWithCompanding(xVal, L, 1.0, mu);
            xArr.push(xVal);
            errArr.push(qRes.err);
            qPts.push([t, qRes.q]);
          }
          var measSqnr = env.math.sqnrDb(xArr, errArr);
          var yLim = Math.max(0.25, amp * 1.45);
          var ax1 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: 0,
            xMax: 1.0,
            yMin: -yLim,
            yMax: yLim * 1.15,
            xGrid: 4,
            yGrid: 4,
            padL: 38,
            xTicks: [[0, '0'], [0.5, '0.5'], [1, '1']],
            yTicks: [[-amp, (-amp).toFixed(2)], [0, '0'], [amp, '+' + amp.toFixed(2)]],
            title: narrow1 ? ('实测 SQNR=' + measSqnr.toFixed(1) + 'dB') : ('L=16 量化波形对比（幅值=' + amp.toFixed(2) + ', μ=' + mu + '）'),
            subtitle: narrow1 ? undefined : ('SQNR = ' + measSqnr.toFixed(1) + ' dB'),
            subtitleColor: measSqnr >= 20 ? P.green : P.red
          });
          env.viz.drawCurve(ctx, ax1, function (t) { return amp * Math.sin(2 * Math.PI * t); }, { color: P.cyan, lineWidth: 2.0 });
          env.viz.drawStepCurve(ctx, ax1, qPts, { color: mu > 0 ? P.green : P.red, lineWidth: 2.0 });
          if (narrow1) {
            env.viz.drawAnnotation(ctx, ax1, 0.5, yLim * 0.92, (mu === 0 ? '无压扩阶梯粗糙!' : 'μ=' + mu + ' 丝滑恢复!'), mu > 0 ? P.green : P.red, 'center');
          }
        }
      },
      {
        id: 's06',
        tag: '课件例题',
        title: '高速高精度 ADC 硬件瓶颈 & PCM 速率-带宽三类换算',
        slideRef: '05sampling pp.38–39, 44–46',
        terms: [
          { en: 'Parallel / Flash ADC Cost', zh: '高速全并行 ADC 指数级比较器代价' },
          { en: 'PCM Channel Limits', zh: '信道 B、信号 W 与电平 L 互求（Ex 1–3）' }
        ],
        symbols: [
          { sym: '2^n - 1', desc: '全并行 Flash ADC 随比特数 n 指数暴增的比较器数量', color: P.red },
          { sym: 'W_{\\max} = \\frac{B}{\\lceil\\log_2 L\\rceil}', desc: '课件 Ex 2：固定信道 B 与电平 L 下的最大信号带宽', color: P.cyan },
          { sym: 'L_{\\max} = 2^{\\lfloor B/W \\rfloor}', desc: '课件 Ex 3：固定信道 B 与信号 W 下的最多量化级数', color: P.green }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: 'n\\text{ 位 Flash ADC} \\implies 2^n - 1\\text{ 个比较器}\\;\\big(8\\text{位}\\to 255,\\; 12\\text{位}\\to 4095,\\; 16\\text{位}\\to 65535\\big)', label: '硬件代价：高速与高精度不可兼得，逼出多片交替或后面的 1-bit DM' },
          { step: 1, latex: '\\text{已知 } (B,\\, L) \\implies \\text{至多 } 2B\\text{ bit/s} \\implies W_{\\max} = \\frac{B}{\\lceil \\log_2 L \\rceil}\\quad(\\text{Ex 2})', label: '课件例题 2：除以每样所需比特数，再除以 2 得信号最大带宽' },
          { step: 2, latex: '\\text{已知 } (B,\\, W) \\implies \\text{至少 } 2W\\text{ 样/s} \\implies n_{\\max} = \\lfloor B/W \\rfloor \\implies L_{\\max} = 2^{\\lfloor B/W \\rfloor}\\quad(\\text{Ex 3})', label: '课件例题 3：注意向上取整 ⌈log₂L⌉ 与向下取整 ⌊B/W⌋ 的方向区别！' }
        ],
        sliders: [
          { key: 'bwRatio', label: '信道与信号带宽比 B / W (Ex 3)', min: 2, max: 10, step: 1, default: 6, decimals: 0 }
        ],
        presets: [
          { label: '窄信道 B=4W (最多4bit, 16级)', values: { bwRatio: 4 } },
          { label: '宽信道 B=8W (最多8bit, 256级)', values: { bwRatio: 8 } }
        ],
        lines: [
          {
            step: 0,
            sub: '讲完 PCM 编码，来看课件第 38–39 页点出的工程现实瓶颈：高速高精度 ADC 极度昂贵！全并行高速闪存式 ADC 需要 $2^n - 1$ 个精密比较器：$8$ 位只要 $255$ 个，涨到 $12$ 位就要 $4095$ 个，$16$ 位更是超过六万个，往往被迫用多片 ADC 交替轮采才赶得上时钟！',
            tts: '讲完 P C M，最后打通课件第三十八到四十六页的两个高频考向。第一是硬件瓶颈：高速高精度模数转换芯片极其昂贵。全并行高速 A D C 需要的电压比较器个数随比特数呈二的 n 次方指数暴增，十二位就要四千多个，工程上经常不得不拆出好几片芯片并排交替采样。'
          },
          {
            step: 1,
            sub: '第二是课件第 45–46 页的三道姊妹换算题，全由一句基石推出来：带宽 $B$ 的无噪信道最多每秒传 $2B$ 比特。除开 Ex 1 的 $B_{\\min} = \\frac{1}{2}f_s\\lceil\\log_2 L\\rceil$，若题目反过来给你信道 $B$ 和级数 $L$（Ex 2），最大允许信号带宽就是 $W_{\\max} = \\frac{B}{\\lceil\\log_2 L\\rceil}$。',
            tts: '第二是课件第四十五页的速率与带宽三姐妹考题，根源都在同一句话：带宽 B 的信道每秒最多传二 B 个二进制脉冲。如果题目已知信道带宽 B 和量化级数 L，那么每样本比特数是上取整的 log 以二为底 L，算出来的最大信号带宽就是 B 除以这个比特数。'
          },
          {
            step: 2,
            sub: '如果题目已知信道 $B$ 和信号带宽 $W$（Ex 3），那么每秒至少得采 $2W$ 个点，平均分到每个样最多只能用 $\\lfloor B/W \\rfloor$ 个比特，所以最大均匀级数是 $L_{\\max} = 2^{\\lfloor B/W \\rfloor}$！看到没有：想要高位数、高保真，就必须花多倍带宽，这正好引出下一集 1-bit 增量调制！',
            tts: '第三种考法是已知信道带宽 B 和信号带宽 W，反推最多能分多少个量化等级。因为每秒至少采两倍 W 个点，每个样本最多分到下取整的 B 除以 W 个比特，所以最大级数就是二的这么多次方。想省下昂贵的多比特 A D C，就要请出下一集的主角：一比特增量调制。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var bw = Math.round(env.params.bwRatio !== undefined ? env.params.bwRatio : 6);
          var narrow0 = boxes[0].w < 460;
          var narrow1 = boxes[1].w < 460;

          // Panel 0: Exponential Flash ADC comparator explosion (2^n - 1)
          var ax0 = env.viz.drawAxes(ctx, boxes[0], {
            xMin: 3.4,
            xMax: 12.6,
            yMin: 0,
            yMax: 4500,
            xGrid: 4,
            yGrid: 4,
            padL: 42,
            xTicks: [[4, '4bit'], [6, '6bit'], [8, '8bit'], [10, '10bit'], [12, '12bit']],
            yTicks: [[0, '0'], [1023, '1023'], [4095, '4095']],
            title: narrow0 ? 'ADC 比较器指数暴增 2^n-1' : '高精度高速 ADC 硬件代价：比较器个数 2^n - 1'
          });
          var adcStems = [];
          var bitsList = [4, 6, 8, 10, 12];
          for (var i = 0; i < bitsList.length; i++) {
            var nb = bitsList[i];
            var cnt = Math.pow(2, nb) - 1;
            adcStems.push({
              x: nb,
              y: cnt,
              color: nb >= 10 ? P.red : (nb === 8 ? P.amber : P.cyan),
              width: 11,
              label: String(cnt)
            });
          }
          env.viz.drawStems(ctx, ax0, adcStems, {});

          // Panel 1: PCM Ex 3 Bandwidth-Level Tradeoff readout
          var b1 = boxes[1];
          env.viz.roundRect(ctx, b1.x, b1.y, b1.w, b1.h, 10);
          ctx.fillStyle = P.panelBg;
          ctx.fill();
          ctx.strokeStyle = '#1e2948';
          ctx.stroke();
          env.viz.drawBadge(ctx, b1.x + 8, b1.y + 4, narrow1 ? ('Ex3: B/W=' + bw) : ('课件 Ex 2 & 3：B/W = ' + bw + ' 换算看板'), P.cyan, false);

          var nMax = Math.floor(bw);
          var Lmax = Math.pow(2, nMax);
          var sqnrMax = 6.02 * nMax + 1.76;

          var pad = 16;
          var topY = b1.y + 42;
          ctx.font = '600 12px sans-serif';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'top';
          ctx.fillStyle = P.muted;
          ctx.fillText('信道上限 2B bps ÷ 最低采样率 2W 样/s：', b1.x + pad, topY);

          ctx.font = '700 14px sans-serif';
          ctx.fillStyle = P.amber;
          ctx.fillText('单样本最多比特 n_max = ⌊B/W⌋ = ' + nMax + ' bit', b1.x + pad, topY + 24);

          ctx.fillStyle = P.green;
          ctx.fillText('最大均匀电平 L_max = 2^' + nMax + ' = ' + Lmax + ' 级', b1.x + pad, topY + 50);

          ctx.fillStyle = P.cyan;
          ctx.fillText('对应满幅正弦 SQNR = ' + sqnrMax.toFixed(1) + ' dB', b1.x + pad, topY + 76);

          ctx.font = '600 11px sans-serif';
          ctx.fillStyle = P.muted;
          ctx.fillText('反之已知 L=' + Lmax + ' 与 B，最大信号带宽 W_max = B/' + nMax, b1.x + pad, b1.y + b1.h - 24);
        }
      }
    ]
  });
})(window);
