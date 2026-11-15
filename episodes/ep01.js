(function (global) {
  'use strict';

  var P = global.COMM_VIZ.PALETTE;

  global.COMM_EPISODES.push({
    id: 'ep01',
    chapter: 'Ch.01 绪论浓缩篇',
    title: '通信系统全景、核心机理与高频概念陷阱辨析',
    slideDeck: '01Introduction.pdf',
    slideRange: 'pp. 1–28',
    homeworkTags: [],
    scenes: [
      {
        id: 's00',
        tag: '直觉',
        title: '一张框图看懂全学期 + 课件第 24 页比特错判实战',
        slideRef: '01Intro pp.23–24',
        terms: [
          { en: 'Source Encoder / Decoder', zh: '信源编解码器' },
          { en: 'Modulator / Demodulator', zh: '调制器 / 解调器' },
          { en: 'Signal-to-Noise Ratio (SNR)', zh: '信噪比' }
        ],
        symbols: [
          { sym: 'b_k \\in \\{0,1\\}', desc: '信源编码输出的二进制比特流', color: P.cyan },
          { sym: 's_k = \\pm A', desc: '双极性调制电平（±A）', color: P.amber },
          { sym: 'r_k = s_k + n_k', desc: '过信道加噪后的接收样值', color: P.red }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: '\\text{Source} \\to \\text{Encoder} \\to \\text{Modulator} \\xrightarrow{\\text{Channel }+n(t)} \\text{Demodulator} \\to \\text{Decoder} \\to \\text{Sink}', label: '极简通信系统五环节链路' },
          { step: 1, latex: '1 \\mapsto +A,\\quad 0 \\mapsto -A,\\qquad \\text{判据：} r_k > 0 \\Rightarrow 1,\\; r_k < 0 \\Rightarrow 0', label: '0/1 映射与零阈值硬判决' },
          { step: 2, latex: 'P = A^2,\\quad \\text{第3位出错条件：} n_3 < -A \\quad(\\text{例：} 1 - 3.2466 = -2.2466 < 0)', label: '错判根因：噪声方向相反且幅值盖过门限 A' }
        ],
        sliders: [
          { key: 'amp', label: '发射信号幅度 A', min: 1.0, max: 4.0, step: 0.2, default: 1.0 }
        ],
        presets: [
          { label: '课件原例 (A=1.0, 错第3位)', values: { amp: 1.0 } },
          { label: '加大功率 (A=3.4, 全对)', values: { amp: 3.4 } }
        ],
        lines: [
          {
            step: 0,
            sub: '通信原理整门课都在解决同一件事：怎样把 $0101$ 数据变成适合信道传播的波形，到达后再尽可能少出错地还原出来。',
            tts: '通信原理整门课都在解决同一件事：怎样把零一数据变成适合信道传播的波形，到达接收端后再尽可能少出错地还原出来。'
          },
          {
            step: 1,
            sub: '看课件第 24 页的经典例子：发射端要传 $1\\,0\\,1\\,1\\,0$，调制器先把它变成 $+1, -1, +1, +1, -1$。',
            tts: '看课件第 24 页的经典例子：发射端要传一零一一零，调制器先把它调制成正一、负一、正一、正一、负一。'
          },
          {
            step: 2,
            sub: '穿过信道叠加随机噪声后，收到 $1.3810, -0.9547, -2.2466, 1.7491, -2.7484$。按正负判决，第 3 位明明发 $+1$ 却被判成了 $0$！',
            tts: '穿过信道叠加随机噪声后，收到一点三八一、负零点九五四七、负二点二四六六、一点七四九一和负二点七四八四。按正负判决，第三位明明发正一，却被噪声推过零点判成了零。'
          },
          {
            step: 2,
            sub: '而第 5 位噪声是 $-1.7484$ 却没错，因为第 5 位发的是 $-1$，噪声恰好同向推得更远！想救回第 3 位，拖动滑块把幅度加到 $3.4$，功率代价比是 $3.4^2 = 11.6$ 倍！',
            tts: '有意思的是，第五位噪声也有负一点七五，却没有出错，因为第五位本身发负一，噪声恰好同向帮忙推得更远。如果想救回第三位，你可以把滑块拉到三点四，但功率代价立刻变成十一点六倍，这就是通信的资源权衡。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var A = env.params.amp !== undefined ? env.params.amp : 1.0;

          // Panel 1: Animated system block diagram
          var nodes = [
            { id: 'src', nx: 0.1, ny: 0.35, nw: 0.15, nh: 0.34, label: '信源编码\nSource', color: P.cyan },
            { id: 'mod', nx: 0.31, ny: 0.35, nw: 0.16, nh: 0.34, label: '调制器\n±A', color: P.amber },
            { id: 'ch', nx: 0.52, ny: 0.35, nw: 0.14, nh: 0.34, label: '信道\n+ n(t)', color: P.red },
            { id: 'dem', nx: 0.72, ny: 0.35, nw: 0.15, nh: 0.34, label: '解调判决\nr > 0 ?', color: P.green },
            { id: 'dec', nx: 0.91, ny: 0.35, nw: 0.14, nh: 0.34, label: '信源译码\nSink', color: P.purple }
          ];
          var activeMap = ['src', 'mod', 'ch', 'dem'][Math.min(3, env.step + 1)];
          var edges = [
            { from: 'src', to: 'mod', label: '1 0 1 1 0' },
            { from: 'mod', to: 'ch', label: '±' + A.toFixed(1) },
            { from: 'ch', to: 'dem', color: P.red, label: '加噪 r_k' },
            { from: 'dem', to: 'dec', color: P.green, label: '判决比特' }
          ];
          env.viz.drawBlockDiagram(ctx, boxes[0], nodes, edges, {
            time: env.time,
            activeId: env.step === 0 ? 'mod' : activeMap,
            title: '通信系统五级流程（功率 P = A² = ' + (A * A).toFixed(1) + ' W）'
          });

          // Panel 2: Bit-by-bit slide p.24 noise push visualization
          var noises = [0.3810, 0.0453, -3.2466, 0.7491, -1.7484];
          var bits = [1, 0, 1, 1, 0];
          var ax = env.viz.drawAxes(ctx, boxes[1], {
            xMin: 0.3,
            xMax: 5.7,
            yMin: -5.2,
            yMax: 5.2,
            xGrid: 5,
            yGrid: 4,
            xTicks: [[1, '位1(发1)'], [2, '位2(发0)'], [3, '位3(发1)'], [4, '位4(发1)'], [5, '位5(发0)']],
            yTicks: [[-4, '-4'], [0, '门限0'], [4, '+4']],
            title: boxes[1].w < 460 ? '逐比特判决 (蓝=发±A)' : '逐比特抗噪判决对比（蓝色=原信号±A，红/绿=收到样值 r_k）'
          });

          // Decision threshold highlight
          var stems = [];
          var errCount = 0;
          var narrow = boxes[1].w < 460;
          for (var i = 0; i < 5; i++) {
            var s = bits[i] === 1 ? A : -A;
            var r = s + noises[i];
            var dec = r > 0 ? 1 : 0;
            var wrong = dec !== bits[i];
            if (wrong) errCount++;
            stems.push({ x: i + 0.80, y: s, color: P.cyan, width: 5, label: narrow ? undefined : ((s > 0 ? '+' : '') + s.toFixed(1)) });
            stems.push({
              x: i + 1.18,
              y: r,
              color: wrong ? P.red : P.green,
              width: 5,
              label: r.toFixed(2) + (wrong ? '✗' : '✓')
            });
          }
          env.viz.drawStems(ctx, ax, stems, {});
          env.viz.drawBadge(
            ctx,
            boxes[1].x + boxes[1].w - 10,
            boxes[1].y + 4,
            errCount === 0 ? '全部判对! (×' + (A * A).toFixed(1) + ')' : '第3位反向噪声→误判!',
            errCount === 0 ? P.green : P.red,
            true
          );
        }
      },
      {
        id: 's01',
        tag: '易错辨析',
        title: '电路交换 vs 分组交换 & 无线为什么更容易撞车？',
        slideRef: '01Intro pp.4–7 + 错题本',
        terms: [
          { en: 'Circuit Switching', zh: '电路交换' },
          { en: 'Packet Switching', zh: '分组交换' },
          { en: 'Best Effort Service', zh: '尽力而为服务' }
        ],
        symbols: [
          { sym: '300\\text{–}3400\\text{ Hz}', desc: '传统电话语音通带（传真须调制到音调）', color: P.cyan },
          { sym: '\\text{LAN vs WLAN}', desc: '有线物理隔离 vs 无线共用同一片空气', color: P.amber }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: '\\text{电话网（电路交换）：} \\text{独占通路，时延稳} \\quad\\big|\\quad \\text{传真方波} \\xrightarrow{\\text{调制进语音频带}} \\text{不失真}', label: '错题辨析：传真不是因为好听，而是方波高频会超出语音通带' },
          { step: 1, latex: '\\text{有线 LAN：各自一根线物理隔开} \\quad\\text{vs}\\quad \\text{无线 WLAN：共用空气（Shared Access）}', label: '错题辨析：无线撞车根因不是词面“shared”，而是发在同一片物理空间' },
          { step: 2, latex: '\\text{Best Effort：不保速率、不保时延} \\Rightarrow \\text{看视频可缓存缓冲，打电话实时卡顿掉话}', label: '错题辨析：别用技术名词糊弄，要回答对两类业务体验的影响' }
        ],
        sliders: [
          { key: 'load', label: '网络同时并发用户数', min: 1, max: 6, step: 1, default: 3 }
        ],
        presets: [
          { label: '轻载流畅 (2人)', values: { load: 2 } },
          { label: '并发拥堵与撞车 (5人)', values: { load: 5 } }
        ],
        lines: [
          {
            step: 0,
            sub: '电话网是典型的电路交换：通话前先霸占一条专属通道。顺便避开一个高频考坑：为什么老式传真要先把 $0/1$ 数据调制成嗡嗡音调？因为电话线只为 $300\\sim 3400\\text{ Hz}$ 人声设计，方波直接送进去会被截断失真！',
            tts: '电话网是典型的电路交换：通话前先霸占一条专属通道。顺便避开一个考前易错坑：为什么老式传真要先把零一数据调制成声音音调？因为电话线只为三百到三千四百赫兹的人声通带设计，方波高频成分太多，直接发会严重失真。'
          },
          {
            step: 1,
            sub: '再看分组交换的局域网：为什么无线 WLAN 比有线 LAN 更难避免同时发送干扰？有线每台电脑独享网线彼此隔开；无线则共用同一片空气，大家同时喊话就会直接撞波混叠。',
            tts: '再看分组交换的局域网：为什么无线局域网比有线更容易发生同时发送干扰？记住物理本质：有线每台电脑都有自己的网线彼此隔开；无线只能共用同一片空气，同时发射电波必然叠在一起干扰。'
          },
          {
            step: 2,
            sub: '互联网主干提供的是 Best Effort 服务，意思是既不保证带宽也不保证时延。这对看网络视频和打实时电话有何影响？看视频可以提前开缓冲区扛过抖动，实时通话需要你来我往，一旦卡顿几百毫秒对话就会彻底混乱！',
            tts: '互联网主干提供的是尽力而为服务，也就是既不保证速率也不保证延迟。考题常问这对看视频和打电话有何影响：看视频是单向的，可以用缓冲区扛住抖动；而打电话是双向实时交互，延迟抖动就会让人不停插话卡壳。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var load = env.params.load || 3;
          var t = env.time;

          // Top panel: Circuit vs Packet switch lanes
          var b0 = boxes[0];
          env.viz.roundRect(ctx, b0.x, b0.y, b0.w, b0.h, 10);
          ctx.fillStyle = P.panelBg;
          ctx.fill();
          ctx.strokeStyle = '#1e2948';
          ctx.stroke();
          env.viz.drawBadge(ctx, b0.x + 8, b0.y + 5, '独占电路 vs 无线空气碰撞', P.cyan, false);

          var laneY1 = b0.y + b0.h * 0.42;
          var laneY2 = b0.y + b0.h * 0.74;
          var xL = b0.x + 18;
          var xR = b0.x + b0.w - 18;
          ctx.strokeStyle = P.green;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(xL, laneY1);
          ctx.lineTo(xR, laneY1);
          ctx.stroke();
          ctx.font = '11px sans-serif';
          ctx.fillStyle = P.green;
          ctx.textAlign = 'left';
          ctx.fillText('电路交换：专道稳态传输（传真调制进 300-3400Hz）', xL, laneY1 - 10);

          var pPos = xL + ((t * 0.45) % 1) * (xR - xL);
          ctx.fillStyle = P.cyan;
          ctx.fillRect(pPos - 14, laneY1 - 6, 28, 12);

          // Wireless shared medium with colliding waves
          ctx.strokeStyle = load >= 4 ? P.red : P.amber;
          ctx.setLineDash([5, 4]);
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(xL, laneY2);
          ctx.lineTo(xR, laneY2);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.fillStyle = load >= 4 ? P.red : P.amber;
          ctx.fillText('无线共享空气：' + load + '台设备同时发包' + (load >= 4 ? '（严重碰撞重传!）' : '（勉强穿插）'), xL, laneY2 - 10);

          for (var u = 0; u < load; u++) {
            var frac = ((t * (0.3 + u * 0.13) + u * 0.27) % 1);
            var px = xL + frac * (xR - xL);
            ctx.fillStyle = u % 2 === 0 ? P.amber : P.pink;
            ctx.beginPath();
            ctx.arc(px, laneY2, 7, 0, Math.PI * 2);
            ctx.fill();
          }

          // Bottom panel: Best Effort impact (Video Buffer vs Voice Call)
          var ax = env.viz.drawAxes(ctx, boxes[1], {
            xMin: 0,
            xMax: 10,
            yMin: 0,
            yMax: 1.5,
            xGrid: 5,
            yGrid: 3,
            xTicks: [[0, '0s'], [5, '拥堵峰值'], [10, '10s']],
            yTicks: [[0.5, '卡顿阈值'], [1.2, '流畅']],
            title: 'Best Effort 网络抖动对两种业务的实际影响'
          });
          env.viz.drawCurve(ctx, ax, function (x) {
            var congestion = load >= 4 ? 0.72 : 0.35;
            var dip = congestion * Math.exp(-Math.pow((x - 5) / 1.4, 2));
            return 1.25 - dip;
          }, { color: P.pink, lineWidth: 2.2, fillAlpha: 0.14 });
          env.viz.drawCurve(ctx, ax, function () { return 0.5; }, { color: P.red, dash: [4, 4], lineWidth: 1.4 });
          env.viz.drawAnnotation(ctx, ax, 2.2, 1.25, '视频靠预缓存扛过波谷', P.green, 'center');
          env.viz.drawAnnotation(ctx, ax, 6.2, load >= 4 ? 0.42 : 0.78, load >= 4 ? '实时通话跌破阈值→卡顿' : '实时通话勉强流畅', load >= 4 ? P.red : P.cyan, 'center');
        }
      },
      {
        id: 's02',
        tag: '推导',
        title: '蜂窝系统与频率复用（同频干扰的物理权衡）',
        slideRef: '01Intro p.5',
        terms: [
          { en: 'Cellular Frequency Reuse', zh: '蜂窝频率复用' },
          { en: 'Co-channel Interference', zh: '同频干扰' },
          { en: 'Handoff', zh: '越区切换' }
        ],
        symbols: [
          { sym: 'K', desc: '簇大小（多少个小区共分总频段）', color: P.cyan },
          { sym: 'D/R = \\sqrt{3K}', desc: '同频小区距离比（K 越大干扰越小，单区频率越少）', color: P.amber }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: '\\text{把区域切成六边形蜂窝} \\implies \\text{同色基站相隔足够远复用同一组频率}', label: '有限频谱服务海量用户的核心创意' },
          { step: 1, latex: '\\frac{D}{R} = \\sqrt{3K} \\quad(K=3,4,7,\\dots)', label: '同频中心距 D 与小区半径 R 的几何关系' }
        ],
        sliders: [
          { key: 'cluster', label: '簇大小 K（色数）', min: 0, max: 2, step: 1, default: 1 }
        ],
        presets: [
          { label: 'K=3 (容量大但易同频干扰)', values: { cluster: 0 } },
          { label: 'K=4 (折中)', values: { cluster: 1 } },
          { label: 'K=7 (抗同频干扰强)', values: { cluster: 2 } }
        ],
        lines: [
          {
            step: 0,
            sub: '全城只有有限的一段无线电频谱，怎么办？蜂窝系统把城市切成密密麻麻的六边形小区，让距离够远的小区复用同一套频率！',
            tts: '全城只有有限的一段无线电频谱，不够所有手机一人分一段怎么办？蜂窝系统把城市切成密密麻麻的六边形小区，让相隔够远的小区复用完全相同的一组频率。'
          },
          {
            step: 1,
            sub: '画面上同颜色的六边形代表使用同一组频率。注意这个考法：簇大小 $K$ 越大，同色小区隔得越远，同频干扰就越小，但代价是每个小区能分到的信道变少、总容量下降。',
            tts: '画面上同一种颜色的六边形，就是用同一组频率的同频小区。这里有一个核心折中：一个簇里的颜色数 K 越大，同色小区之间隔得越远，同频干扰就越小，但代价比是每个小区能分到的可用信道变少、容量下降。'
          }
        ],
        render: function (ctx, env) {
          var ks = [3, 4, 7];
          var K = ks[Math.round(env.params.cluster || 1)];
          var b = env.rect;
          env.viz.roundRect(ctx, b.x, b.y, b.w, b.h, 10);
          ctx.fillStyle = P.panelBg;
          ctx.fill();
          ctx.strokeStyle = '#1e2948';
          ctx.stroke();

          var cols = [P.cyan, P.amber, P.pink, P.green, P.purple, '#fb923c', '#38bdf8'];
          var r = env.isPortrait ? 20 : 25;
          var dx = r * 1.732;
          var dy = r * 1.5;
          var cx0 = b.x + b.w * 0.5;
          var cy0 = b.y + b.h * 0.53;

          for (var q = -3; q <= 3; q++) {
            for (var row = -2; row <= 2; row++) {
              var x = cx0 + (row + (q % 2 === 0 ? 0 : 0.5)) * dx;
              var y = cy0 + q * dy;
              if (x < b.x + r + 10 || x > b.x + b.w - r - 10 || y < b.y + r + 28 || y > b.y + b.h - r - 24) continue;
              var cIdx = ((row * 2 + q * 3) % K + K) % K;
              var col = cols[cIdx];

              ctx.beginPath();
              for (var k = 0; k < 6; k++) {
                var ang = (Math.PI / 180) * (60 * k - 30);
                var px = x + r * Math.cos(ang);
                var py = y + r * Math.sin(ang);
                if (k === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
              }
              ctx.closePath();
              ctx.fillStyle = cIdx === 0 ? 'rgba(56, 189, 248, 0.35)' : 'rgba(255, 255, 255, 0.05)';
              ctx.fill();
              ctx.strokeStyle = col;
              ctx.lineWidth = cIdx === 0 ? 2.4 : 1.2;
              ctx.stroke();

              ctx.fillStyle = col;
              ctx.font = '700 10.5px sans-serif';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText('F' + (cIdx + 1), x, y);
            }
          }
          env.viz.drawBadge(ctx, b.x + 10, b.y + 8, '簇大小 K=' + K + ' · 高亮 F1 为同频干扰小区', P.cyan, false);
          env.viz.drawBadge(ctx, b.x + b.w - 10, b.y + 8, '距离比 D/R = ' + Math.sqrt(3 * K).toFixed(2), P.amber, true);
        }
      },
      {
        id: 's03',
        tag: '推导',
        title: 'DSSS 直接序列扩频与抗干扰机理（必懂重点）',
        slideRef: '01Intro p.8 + 错题本',
        terms: [
          { en: 'DSSS (Direct Sequence Spread Spectrum)', zh: '直接序列扩频' },
          { en: 'Chip / Processing Gain', zh: '码片 / 处理增益' }
        ],
        symbols: [
          { sym: 'b = \\pm 1', desc: '原始信息比特（持续时间 T_b）', color: P.cyan },
          { sym: 'c_1\\dots c_{11} = \\pm 1', desc: '11 位平衡伪随机扩频码（每片 T_c = T_b / 11）', color: P.amber },
          { sym: 'J', desc: '信道中的窄带直流干扰（所有频率集中在一处）', color: P.red }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: 's(t) = b \\cdot c(t) \\quad(\\text{每片翻转一次} \\implies \\text{带宽膨胀 } N\\text{ 倍})', label: '切块并乘 ±1 才真扩频（全 +1 无法展宽）' },
          { step: 1, latex: 'r(t) = b\\,c(t) + J', label: '信道混入窄带恒定干扰 J' },
          { step: 2, latex: 'y = \\sum_{i=1}^{N} r_i c_i = b\\underbrace{\\sum_{i=1}^{N} c_i^2}_{=N} + \\underbrace{J\\sum_{i=1}^{N} c_i}_{\\approx \\pm 1\\cdot J}', label: '相干解扩：信号放大 N 倍，干扰因正负平衡被抑制' }
        ],
        sliders: [
          { key: 'jam', label: '窄带直流干扰幅度 J', min: 0, max: 8, step: 0.5, default: 3.0 }
        ],
        presets: [
          { label: '常见干扰 (J=3，不扩频必错)', values: { jam: 3.0 } },
          { label: '强干扰测试 (J=7，DSSS照样对)', values: { jam: 7.0 } }
        ],
        lines: [
          {
            step: 0,
            sub: '记住：只把一个比特 $b$ 切成 $N$ 段并不会变宽，必须让每一小片都乘上快速翻转的 $\\pm 1$ 扩频码 $c_i$，波形跳变加快 $N$ 倍，频谱才展宽 $N$ 倍！',
            tts: '记住一个核心问题：只是把一个比特切成 N 份并不会扩大带宽，必须让每一小片乘上正负一快速翻转的扩频码 c i，波形跳变速度加快 N 倍，频谱才会跟着展宽 N 倍。'
          },
          {
            step: 1,
            sub: '假设发 $b = -1$，在信道里不幸遇到幅值为 $+3$ 的窄带直流干扰 $J$。不扩频直接收会得到 $-1 + 3 = +2$，彻底误判成 $+1$。',
            tts: '假设发送负一这个比特，中途不幸遇上幅值为正三的窄带常数干扰 J。如果不扩频直接加起来收到正二，接收端一定会惨遭误判成正一。'
          },
          {
            step: 2,
            sub: '使用 11 位平衡码接收解扩：有用信号同码再乘一次全变成 $+1$，同相叠加出 $11 \\times (-1) = -11$；而干扰只乘一次平衡码，正负抵消只剩 $+1 \\times 3 = +3$！总结果 $-8 < 0$，照样一判一个准！',
            tts: '换成十一位平衡扩频码，接收端再乘同一串码片解扩：信号自己乘自己全是正一，相干叠加放大成负十一；而干扰只乘了一次正负交替的平衡码，正负抵消只剩正三，总和负八稳稳判成负一。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var code = [1, -1, 1, 1, -1, 1, 1, 1, -1, -1, -1];
          var J = env.params.jam !== undefined ? env.params.jam : 3.0;
          var N = code.length;
          var b = -1; // show b = -1 clearly against +J

          // Panel 1: Chip-by-chip waveform (sent b*c_i vs received with jammer)
          var ax1 = env.viz.drawAxes(ctx, boxes[0], {
            xMin: 0,
            xMax: 11,
            yMin: -2 - J * 0.85,
            yMax: 2 + J * 1.1,
            xGrid: 11,
            yGrid: 2,
            xTicks: [[0, '片0'], [5.5, '11个码片'], [11, 'T_b']],
            yTicks: [[-1, '-1'], [0, '0'], [J, '+J']],
            title: '发送 b=-1 经扩频码调制 c 与干扰 J=+ ' + J.toFixed(1)
          });
          var sentSteps = [];
          var recvSteps = [];
          for (var i = 0; i <= N; i++) {
            var c = code[Math.min(i, N - 1)];
            sentSteps.push([i, b * c]);
            recvSteps.push([i, b * c + J]);
          }
          env.viz.drawStepCurve(ctx, ax1, sentSteps, { color: P.cyan, lineWidth: 2.0 });
          env.viz.drawStepCurve(ctx, ax1, recvSteps, { color: P.red, lineWidth: 2.0 });

          // Panel 2: Unspread vs Despread output comparison bar/stems
          var sumC = 0;
          for (var k = 0; k < N; k++) sumC += code[k];
          var noSpread = b + J;
          var dsssOut = b * N + J * sumC;
          var ax2 = env.viz.drawAxes(ctx, boxes[1], {
            xMin: 0.4,
            xMax: 2.6,
            yMin: -13,
            yMax: 13,
            xGrid: 2,
            yGrid: 4,
            xTicks: [[1, '不扩频 (b+J)'], [2, 'DSSS 解扩 (11b+JΣc)']],
            yTicks: [[-11, '-11'], [0, '判决0'], [11, '+11']],
            title: '接收端判决对比（期望负值 < 0）'
          });
          env.viz.drawStems(ctx, ax2, [
            { x: 1, y: noSpread, color: noSpread < 0 ? P.green : P.red, width: 18, label: noSpread.toFixed(1) + (noSpread < 0 ? ' ✓对' : ' ✗误判!') },
            { x: 2, y: dsssOut, color: dsssOut < 0 ? P.green : P.red, width: 18, label: dsssOut.toFixed(1) + (dsssOut < 0 ? ' ✓稳对!' : ' ✗失守') }
          ], {});
        }
      },
      {
        id: 's04',
        tag: '推导',
        title: 'OFDM 正交子载波复用与 MIMO 多天线直觉',
        slideRef: '01Intro p.8',
        terms: [
          { en: 'OFDM', zh: '正交频分复用' },
          { en: 'MIMO', zh: '多输入多输出' }
        ],
        symbols: [
          { sym: '\\Delta f = 1/T_s', desc: '子载波正交间隔（隔壁峰值刚好落在自己零点）', color: P.cyan },
          { sym: '\\text{sinc}(\\pi(f-k\\Delta f)T_s)', desc: '每个子载波矩形窗对应的频率形状', color: P.amber }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: '\\text{传统 FDM 须留保护带} \\quad\\longrightarrow\\quad \\text{OFDM 故意重叠：}\\Delta f = \\frac{1}{T_s}', label: '频谱效率提升一倍的关键密码' },
          { step: 1, latex: '\\text{MIMO 利用多径空间选择性：同时开辟多条独立空间流}', label: '802.11n 从 54 Mbps 跃升至 600 Mbps 的推手' }
        ],
        sliders: [
          { key: 'df', label: '子载波间隔比例 Δf·T_s', min: 0.6, max: 1.8, step: 0.1, default: 1.0 }
        ],
        presets: [
          { label: '正交黄金点 (1.0/T_s)', values: { df: 1.0 } },
          { label: '破坏正交串扰 (0.6/T_s)', values: { df: 0.6 } },
          { label: '传统FDM保护带 (1.6/T_s)', values: { df: 1.6 } }
        ],
        lines: [
          {
            step: 0,
            sub: '老式频分复用生怕邻频道打架，中间留满空白保护带。OFDM 则大胆让子载波的 $\\operatorname{sinc}$ 频谱交叠，只要把间距严格卡在 $\\Delta f = 1/T_s$，一个载波冲顶时所有邻居恰好全部为零，互不串扰！',
            tts: '老式频分复用生怕邻频道打架，中间要留空白保护带，太浪费频谱。而 O F D M 大胆让相邻子载波的辛克频谱相互交叠，只要把间隔严格卡在符号周期分之一，任意子载波的波峰处所有邻居恰好全部穿过零点，这就是正交！'
          },
          {
            step: 1,
            sub: '如果拖偏滑块就会看到：间隔小于 $1$ 时邻居不再过零，发生子载波间串扰；间隔太大又回到低效的传统 FDM。MIMO 则利用发收多副天线，把电磁波在空间里反射出的多径转化成并行高速数据管道。',
            tts: '拖动滑块偏离一点零就能发现：间隔太密时邻居不再过零，立刻串扰；间隔拉开虽然不串扰，却浪费了宝贵带宽。至于多输入多输出技术 M I M O，则是利用发射端和接收端的多副天线，把空间多径转化成几条同时传送的高速通道。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var df = env.params.df || 1.0;

          var ax1 = env.viz.drawAxes(ctx, boxes[0], {
            xMin: -3.2,
            xMax: 4.8,
            yMin: -0.28,
            yMax: 1.18,
            xGrid: 6,
            yGrid: 3,
            xTicks: [[0, 'k=0'], [df, 'k=1'], [2 * df, 'k=2'], [3 * df, 'k=3']],
            yTicks: [[0, '0'], [1, '1']],
            title: 'OFDM 子载波频谱（间隔 ' + df.toFixed(1) + '/T_s）'
          });
          var scColors = [P.cyan, P.amber, P.pink, P.green];
          var interference = 0;
          for (var k = 0; k < 4; k++) {
            (function (idx) {
              var fc = idx * df;
              if (idx > 0) interference += Math.abs(env.math.sinc(-fc));
              env.viz.drawCurve(ctx, ax1, function (f) {
                return env.math.sinc(f - fc);
              }, { color: scColors[idx], lineWidth: 2.0 });
            })(k);
          }
          env.viz.drawBadge(
            ctx,
            boxes[0].x + boxes[0].w - 10,
            boxes[0].y + 4,
            Math.abs(df - 1.0) < 0.05 ? '完美正交 (k=0处邻居=0)!' : (df < 1 ? '邻道串扰泄露出零点!' : '冗余保护带浪费'),
            Math.abs(df - 1.0) < 0.05 ? P.green : P.red,
            true
          );

          // Panel 2: MIMO spatial channels
          var nodes = [
            { id: 't1', nx: 0.14, ny: 0.28, nw: 0.16, nh: 0.28, label: 'TX 天线1', color: P.cyan },
            { id: 't2', nx: 0.14, ny: 0.72, nw: 0.16, nh: 0.28, label: 'TX 天线2', color: P.amber },
            { id: 'r1', nx: 0.86, ny: 0.28, nw: 0.16, nh: 0.28, label: 'RX 天线1', color: P.green },
            { id: 'r2', nx: 0.86, ny: 0.72, nw: 0.16, nh: 0.28, label: 'RX 天线2', color: P.pink }
          ];
          var edges = [
            { from: 't1', to: 'r1', label: 'h11' },
            { from: 't1', to: 'r2', label: 'h21', dashed: true },
            { from: 't2', to: 'r1', label: 'h12', dashed: true },
            { from: 't2', to: 'r2', label: 'h22', color: P.amber }
          ];
          env.viz.drawBlockDiagram(ctx, boxes[1], nodes, edges, {
            time: env.time,
            title: 'MIMO 多天线利用空间选择性倍增速率 (2×2 示意)'
          });
        }
      },
      {
        id: 's05',
        tag: '易错辨析',
        title: 'OSI 分层职责、GEO 卫星延迟与蓝牙定位辨析',
        slideRef: '01Intro pp.9–12 + 错题本',
        terms: [
          { en: 'Physical / Transport Layer', zh: '物理层 / 传输层' },
          { en: 'GEO vs LEO', zh: '静止轨道 vs 低轨卫星' },
          { en: 'Bluetooth vs WLAN', zh: '蓝牙 vs 无线局域网' }
        ],
        symbols: [
          { sym: 't_{\\text{RTT}} \\approx 0.5\\text{ s}', desc: 'GEO (35,000 km) 地面-卫星往返传播延迟', color: P.amber },
          { sym: '\\text{Layer 1 vs Layer 4}', desc: '经典通信在物理层；丢包确认重传在传输层', color: P.cyan }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: '\\text{快递丢件补发类比} \\implies \\text{端到端确认重传} = \\text{传输层 (Transport)，非应用层}', label: '错题辨析：应用层只管“要什么货”' },
          { step: 1, latex: '\\text{GEO } 35000\\text{ km} \\implies \\text{单程 } \\approx 0.12\\text{ s},\\text{ 往返 } \\approx 0.5\\text{ s} \\implies \\text{宜广播电视，难做双向电话}', label: '错题辨析：关键在“单向无需回话 vs 双向交互等人开口”' },
          { step: 2, latex: '\\text{蓝牙 (10–100m)：点对点取代线缆} \\quad\\text{vs}\\quad \\text{WLAN：组网接入互联网，高速大范围}', label: '错题辨析：区别在产品定位与组网能力，不是“不能移动”' }
        ],
        sliders: [],
        lines: [
          {
            step: 0,
            sub: '再来清扫另外 3 个极易答偏的概念题！第一：网上买东西快递半路丢了要求补发，这对应 OSI 哪一层？答案是**传输层**（Transport Layer），负责端到端可靠性确认与重传，应用层只管下订单要什么。而本门课的核心战场是第一层**物理层**。',
            tts: '再来扫清另外三个非常容易答偏的概念题。第一：如果快递半路丢件需要补发，这对应开放系统互联七层模型里的哪一层？答案是第四层传输层，它专门负责端到端确认和重传，应用层只负责提出需求。至于本门通信原理课，主战场在最底层的物理层。'
          },
          {
            step: 1,
            sub: '第二：高轨同步卫星 GEO 高度约 $35000$ 公里，光速跑一趟大约 $0.12$ 秒，打一通地面到卫星再回地面的往返延迟将近 $0.5$ 秒！考试必须点明：看电视是单向的，晚半秒毫无影响；但打电话是双向对谈，双方每句话都会僵硬等半秒！',
            tts: '第二：高轨同步卫星在三万五千公里高空，电波单程就要约零点一二秒，加上链路往返将近零点五秒。为什么它非常适合卫星电视直播，却做不好双向卫星电话？答题一定要点破单向与双向的差异：看电视只是单向接收，晚半秒毫无察觉；打电话要等对方回应，每句话卡半秒就没法正常聊天。'
          },
          {
            step: 2,
            sub: '第三：对比蓝牙和 WLAN（Wi-Fi）不能只答“WLAN 固定、蓝牙移动”，因为手机连 Wi-Fi 也能走着逛！真正差异在于定位：蓝牙主打短距点对点“取代线缆”（721 kbps），WLAN 主打高性能无线组网接入互联网。',
            tts: '第三：对比蓝牙和无线局域网时，千万不要答成蓝牙可以移动而 Wi-Fi 相对固定，笔记本电脑连着 Wi-Fi 照样满屋走。真正区分在于系统定位：蓝牙专门负责点对点短距离取代数据线，速率不到一兆；而无线局域网核心定位是高速无线组网并接入整个互联网。'
          }
        ],
        render: function (ctx, env) {
          var boxes = env.viz.splitPanels(env.rect, 2, env.isPortrait, 8);
          var p = env.progress;

          // Panel 1: GEO satellite round-trip delay visualization
          var b0 = boxes[0];
          env.viz.roundRect(ctx, b0.x, b0.y, b0.w, b0.h, 10);
          ctx.fillStyle = P.panelBg;
          ctx.fill();
          ctx.strokeStyle = '#1e2948';
          ctx.stroke();
          env.viz.drawBadge(ctx, b0.x + 8, b0.y + 5, 'GEO 卫星 35,000 km 往返 ~0.5 s', P.amber, false);

          var sx = b0.x + b0.w * 0.5;
          var sy = b0.y + b0.h * 0.34;
          var gx1 = b0.x + b0.w * 0.18;
          var gx2 = b0.x + b0.w * 0.82;
          var gy = b0.y + b0.h * 0.82;

          ctx.strokeStyle = P.cyan;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(gx1, gy);
          ctx.lineTo(sx, sy);
          ctx.lineTo(gx2, gy);
          ctx.stroke();

          // Moving pulse along uplink-downlink
          var ph = (env.time * 0.6) % 1;
          var px = ph < 0.5 ? gx1 + (sx - gx1) * (ph * 2) : sx + (gx2 - sx) * ((ph - 0.5) * 2);
          var py = ph < 0.5 ? gy + (sy - gy) * (ph * 2) : sy + (gy - sy) * ((ph - 0.5) * 2);
          ctx.fillStyle = P.amber;
          ctx.beginPath();
          ctx.arc(px, py, 5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = P.text;
          ctx.font = '700 11px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('🛰️ GEO (单程0.12s)', sx, sy - 10);
          ctx.fillText('发射端 A', gx1, gy + 12);
          ctx.fillText('接收端 B', gx2, gy + 12);

          // Panel 2: OSI 7-layer highlight card
          var b1 = boxes[1];
          env.viz.roundRect(ctx, b1.x, b1.y, b1.w, b1.h, 10);
          ctx.fillStyle = P.panelBg;
          ctx.fill();
          ctx.strokeStyle = '#1e2948';
          ctx.stroke();
          env.viz.drawBadge(ctx, b1.x + 8, b1.y + 5, 'OSI 分层核心考向定位', P.cyan, false);

          var layers = [
            { name: 'L7 应用层 Application', desc: '只管发什么内容', col: P.muted, act: false },
            { name: 'L4 传输层 Transport', desc: '端到端确认、丢包重传', col: P.amber, act: env.step === 0 },
            { name: 'L3/2 网络与链路层', desc: 'IP 路由 / MAC 碰撞避让', col: P.purple, act: false },
            { name: 'L1 物理层 Physical', desc: '调制、波形、抗噪（本课核心!）', col: P.cyan, act: true }
          ];
          var rowH = (b1.h - 36) / layers.length;
          for (var i = 0; i < layers.length; i++) {
            var ry = b1.y + 30 + i * rowH;
            env.viz.roundRect(ctx, b1.x + 12, ry, b1.w - 24, rowH - 5, 6);
            ctx.fillStyle = layers[i].act ? 'rgba(56, 189, 248, 0.14)' : 'rgba(255,255,255,0.03)';
            ctx.fill();
            ctx.strokeStyle = layers[i].act ? layers[i].col : '#253358';
            ctx.stroke();
            ctx.font = '700 11.5px sans-serif';
            ctx.fillStyle = layers[i].col;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(layers[i].name, b1.x + 20, ry + (rowH - 5) / 2);
            ctx.textAlign = 'right';
            ctx.fillStyle = P.text;
            ctx.font = '11px sans-serif';
            ctx.fillText(layers[i].desc, b1.x + b1.w - 20, ry + (rowH - 5) / 2);
          }
        }
      },
      {
        id: 's06',
        tag: '课件例题',
        title: '通信两大根本资源：功率受限 vs 带宽受限折中',
        slideRef: '01Intro p.25',
        terms: [
          { en: 'Power-Limited Channel', zh: '功率受限信道' },
          { en: 'Band-Limited Channel', zh: '带宽受限信道' },
          { en: 'Channel Fading', zh: '信道衰落（时/频/空选择性）' }
        ],
        symbols: [
          { sym: 'P_t', desc: '平均发射功率（受电池/散热/邻区干扰限制）', color: P.amber },
          { sym: 'B', desc: '信道可用通带带宽（受频率牌照/器件响应限制）', color: P.cyan },
          { sym: 'C = B \\log_2\\!\\left(1+\\frac{P_t}{N_0 B}\\right)', desc: '香农容量：功率与带宽可互相置换', color: P.green }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: '\\text{功率受限：无线、卫星、深空、水声} \\quad\\big|\\quad \\text{带限：有线电话、电视、水声}', label: '注意：水声信道（Underwater Acoustic）同时被列在两张受限清单中！' },
          { step: 1, latex: 'C = B\\log_2\\!\\left(1 + \\frac{P_t}{N_0 B}\\right) \\implies \\text{宽带可以省功率，高功率可省带宽}', label: 'Ch.3 AM/SSB（省带宽）vs Ch.4 宽带 FM（多占带宽换高抗噪）的总伏笔' }
        ],
        sliders: [
          { key: 'bw', label: '分配带宽 B (MHz)', min: 1, max: 12, step: 0.5, default: 3.0 }
        ],
        presets: [
          { label: '窄带省谱高耗能 (B=1.5M)', values: { bw: 1.5 } },
          { label: '宽带换低功耗 (B=10M)', values: { bw: 10.0 } }
        ],
        lines: [
          {
            step: 0,
            sub: '通信工程只有两大核心硬资源：**发射功率 $P_t$** 与 **信道带宽 $B$**。考前必背例子：无线、卫星、深空链路受限在功率；有线电话、广播电视受限在带宽；而**水声信道**最惨，两边同时受限！',
            tts: '通信工程只有两大核心硬资源：发射功率和信道带宽。考前要记清典型信道归属：无线、卫星、深空链路主要受限于电池和发射功率；有线电话和电视主要受限于通带宽度；而水声信道最惨，功率和带宽同时受限。'
          },
          {
            step: 1,
            sub: '为什么全书要学那么多调制方式？秘密全在香农公式曲线里！保持目标速率 $C$ 不变，如果你给的带宽 $B$ 很宽（像后面第 4 章宽带调频 FM 或刚才的 DSSS），需要的发射功率就可以大幅降下来；反之通道窄就得靠高信噪比强行硬塞比特！',
            tts: '为什么全书要发明这么多调制方式？秘密就在香农资源权衡曲线里。保持同样的数据传输速率不变，如果你多占用几倍带宽，比如刚学的直接序列扩频或者第四章的宽带调频，所需功率就能大幅降低；反过来信道特别窄，就得花大功率维持高信噪比。'
          }
        ],
        render: function (ctx, env) {
          var B = env.params.bw || 3.0;
          var Ctarget = 6.0;
          function reqP(b) {
            return b * (Math.pow(2, Ctarget / b) - 1);
          }
          var pNow = reqP(B);
          var ax = env.viz.drawAxes(ctx, env.rect, {
            xMin: 0.8,
            xMax: 13,
            yMin: 0,
            yMax: 24,
            xGrid: 6,
            yGrid: 4,
            xTicks: [[2, '2MHz'], [6, '6MHz'], [10, '10MHz']],
            yTicks: [[6, '6'], [12, '12'], [18, '18']],
            title: '等容量 C 下的带宽-功率置换曲线（P/N₀ vs 带宽 B）'
          });
          env.viz.drawCurve(ctx, ax, reqP, { from: 1.25, to: 12.5, color: P.cyan, lineWidth: 2.5, fillAlpha: 0.14 });
          env.viz.drawCurve(ctx, ax, function () { return Ctarget * Math.LN2; }, { color: P.green, dash: [5, 4], lineWidth: 1.5 });
          env.viz.drawStems(ctx, ax, [
            { x: B, y: Math.min(23, pNow), color: P.amber, width: 3, label: '当前(B=' + B.toFixed(1) + ', P=' + pNow.toFixed(1) + ')' }
          ], {});
          env.viz.drawAnnotation(ctx, ax, 8.8, Ctarget * Math.LN2 + 0.6, '香农极限下界 P/N₀ ≥ C·ln2 ≈ 4.16', P.green, 'center');
        }
      },
      {
        id: 's07',
        tag: '直觉',
        title: '全课程路线图：Ch.2 → Ch.5 怎么一步步搭出整个系统？',
        slideRef: '01Intro pp.22, 26–27',
        terms: [
          { en: 'Analog Modulation (AM/FM)', zh: '模拟调制（Ch.3–4）' },
          { en: 'Sampling & PCM', zh: '采样量化脉冲编码（Ch.5）' }
        ],
        symbols: [
          { sym: '\\text{Ch.2}', desc: '数学工具箱：信号内积空间 + 傅里叶频谱 + 滤波器失真', color: P.cyan },
          { sym: '\\text{Ch.3–4}', desc: '频谱搬移与载波调制（AM/QAM/SSB/VSB 与 PM/FM）', color: P.amber },
          { sym: '\\text{Ch.5}', desc: '模拟转数字全链路（采样定理→均匀/非均匀量化→PCM/DM）', color: P.green }
        ],
        errata: null,
        formulas: [
          { step: 0, latex: '\\text{Ch.2 数学底座} \\to \\text{Ch.3 线性调制} \\to \\text{Ch.4 角度调制} \\to \\text{Ch.5 模数转换}', label: '接下来 12 集的四大战役主线' }
        ],
        sliders: [],
        lines: [
          {
            step: 0,
            sub: '第 1 章的宏观地图到此通关！从下一集开始，我们逐章逐题打通：**第 2 章**用信号空间和傅里叶变换看穿频率本质；**第 3 章**玩转 AM/QAM/SSB/VSB 幅度搬移；**第 4 章**攻克 FM/PM 相位微积分与 Carson 带宽；**第 5 章**实现车轮采样混叠、PCM 量化信噪比和增量调制！',
            tts: '第一章的宏观蓝图到此全部通关。从下一集开始，我们将严格按课本顺序逐章逐题打通全部重点与十九道作业题：第二章建立信号空间和傅里叶变换的数学双眼；第三章玩转幅度调制与单边带残留边带；第四章攻克最抽象的调频调相与卡森带宽；第五章直观拿下采样定理车轮混叠、脉码调制和增量调制。'
          }
        ],
        render: function (ctx, env) {
          var nodes = [
            { id: 'c2', nx: 0.14, ny: 0.5, nw: 0.2, nh: 0.5, label: 'Ch.2 (EP02-04)\n傅里叶与无失真\n作业: 5道', color: P.cyan },
            { id: 'c3', nx: 0.38, ny: 0.5, nw: 0.2, nh: 0.5, label: 'Ch.3 (EP05-07)\nAM/QAM/SSB/VSB\n作业: 7道', color: P.amber },
            { id: 'c4', nx: 0.62, ny: 0.5, nw: 0.2, nh: 0.5, label: 'Ch.4 (EP08-10)\nFM/PM 与 Carson\n作业: 3道', color: P.pink },
            { id: 'c5', nx: 0.86, ny: 0.5, nw: 0.2, nh: 0.5, label: 'Ch.5 (EP11-13)\n采样/PCM/DM\n作业: 4道', color: P.green }
          ];
          var edges = [
            { from: 'c2', to: 'c3' },
            { from: 'c3', to: 'c4' },
            { from: 'c4', to: 'c5' }
          ];
          var activeIdx = Math.floor(env.progress * 4) % 4;
          env.viz.drawBlockDiagram(ctx, env.rect, nodes, edges, {
            time: env.time,
            activeId: ['c2', 'c3', 'c4', 'c5'][activeIdx],
            title: '全课程 Ch.1–Ch.5 学习地图（共 13 集 + 19 题全覆盖）'
          });
        }
      }
    ]
  });
})(window);
