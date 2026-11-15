(function (global) {
  'use strict';

  var STORAGE_KEY = 'comm_anim_player_v1';
  var RATES = [0.75, 1.0, 1.25, 1.5, 2.0];

  var dom = {};
  var state = {
    episodes: [],
    epIdx: 0,
    sceneIdx: 0,
    playing: false,
    muted: false,
    rate: 1.0,
    elapsed: 0,       // current scene elapsed time in seconds (in unscaled narration timeline)
    params: {},
    drawerTab: 'episodes',
    rafId: null,
    lastTs: 0,
    audioReady: false,
    lastRenderedEpScene: ''
  };

  function $(id) {
    return document.getElementById(id);
  }

  function formatTime(sec) {
    var s = Math.max(0, Math.floor(sec || 0));
    var m = Math.floor(s / 60);
    var r = s % 60;
    return (m < 10 ? '0' : '') + m + ':' + (r < 10 ? '0' : '') + r;
  }

  function currentEpisode() {
    return state.episodes[state.epIdx] || null;
  }

  function currentScene() {
    var ep = currentEpisode();
    if (!ep) return null;
    return ep.scenes[state.sceneIdx] || null;
  }

  function getSceneTiming(ep, scene) {
    var tRoot = global.COMM_TIMINGS || {};
    var epT = tRoot[ep.id];
    if (epT && epT.scenes && epT.scenes[scene.id]) {
      return epT.scenes[scene.id];
    }
    // Graceful fallback before TTS timings are built
    var lines = scene.lines || [];
    var dur = Math.max(8, lines.length * 4.8);
    var per = dur / Math.max(1, lines.length);
    var mapped = [];
    for (var i = 0; i < lines.length; i++) {
      mapped.push({
        start: i * per,
        end: (i + 1) * per,
        step: lines[i].step || 0
      });
    }
    return { duration: dur, hasAudio: false, lines: mapped };
  }

  function saveState() {
    try {
      var ep = currentEpisode();
      var sc = currentScene();
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        epId: ep ? ep.id : 'ep01',
        sceneId: sc ? sc.id : 's00',
        rate: state.rate,
        muted: state.muted
      }));
      if (ep && sc) {
        var newHash = '#ep=' + ep.id + '&s=' + sc.id;
        if (location.hash !== newHash) {
          history.replaceState(null, '', newHash);
        }
      }
    } catch (e) { /* ignore storage errors */ }
  }

  function parseInitialRoute() {
    var epId = null;
    var sceneId = null;
    if (location.hash) {
      var mEp = location.hash.match(/ep=([a-zA-Z0-9_-]+)/);
      var mSc = location.hash.match(/s=([a-zA-Z0-9_-]+)/);
      if (mEp) epId = mEp[1];
      if (mSc) sceneId = mSc[1];
    }
    try {
      var saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      if (!epId && saved.epId) epId = saved.epId;
      if (!sceneId && saved.sceneId) sceneId = saved.sceneId;
      if (saved.rate && RATES.indexOf(saved.rate) >= 0) state.rate = saved.rate;
      if (typeof saved.muted === 'boolean') state.muted = saved.muted;
    } catch (e) { /* ignore */ }

    if (epId) {
      for (var i = 0; i < state.episodes.length; i++) {
        if (state.episodes[i].id === epId) {
          state.epIdx = i;
          if (sceneId) {
            for (var j = 0; j < state.episodes[i].scenes.length; j++) {
              if (state.episodes[i].scenes[j].id === sceneId) {
                state.sceneIdx = j;
                break;
              }
            }
          }
          break;
        }
      }
    }
  }

  function renderMathInto(el, latex, displayMode) {
    if (!el) return;
    if (global.katex && typeof global.katex.render === 'function') {
      try {
        global.katex.render(latex, el, { throwOnError: false, displayMode: !!displayMode });
        return;
      } catch (e) { /* fallback below */ }
    }
    el.textContent = latex;
  }

  function appendMathSegments(targetEl, raw) {
    var parts = String(raw || '').split(/(\$\$[^$]+\$\$|\$[^$]+\$)/g);
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      if (!p) continue;
      if (p.startsWith('$$') && p.endsWith('$$')) {
        var spanD = document.createElement('span');
        renderMathInto(spanD, p.slice(2, -2), true);
        targetEl.appendChild(spanD);
      } else if (p.startsWith('$') && p.endsWith('$')) {
        var spanI = document.createElement('span');
        renderMathInto(spanI, p.slice(1, -1), false);
        targetEl.appendChild(spanI);
      } else {
        targetEl.appendChild(document.createTextNode(p));
      }
    }
  }

  function renderRichText(el, text) {
    el.innerHTML = '';
    var s = String(text || '');
    var chunks = s.split(/\*\*([\s\S]+?)\*\*/g);
    for (var i = 0; i < chunks.length; i++) {
      var chunk = chunks[i];
      if (!chunk) continue;
      if (i % 2 === 1) {
        var strong = document.createElement('strong');
        strong.className = 'rich-bold';
        appendMathSegments(strong, chunk);
        el.appendChild(strong);
      } else {
        appendMathSegments(el, chunk);
      }
    }
  }

  function initParamsForScene(scene) {
    state.params = {};
    var sliders = scene.sliders || [];
    for (var i = 0; i < sliders.length; i++) {
      state.params[sliders[i].key] = sliders[i].default;
    }
  }

  function buildSceneStaticUI() {
    var ep = currentEpisode();
    var sc = currentScene();
    if (!ep || !sc) return;

    dom.epPill.textContent = ep.id.toUpperCase();
    dom.topTitle.textContent = ep.title;
    dom.topSub.textContent = ep.chapter + ' · 第 ' + (state.sceneIdx + 1) + '/' + ep.scenes.length + ' 幕';
    dom.slideBadge.textContent = sc.slideRef || ep.slideRange || '';

    dom.tagBadge.textContent = sc.hwCode ? (sc.tag + ' · ' + sc.hwCode) : sc.tag;
    dom.tagBadge.className = 'tag-badge tag-' + sc.tag;
    dom.sceneRef.textContent = sc.slideRef ? ('对应课件 ' + sc.slideRef) : '';
    dom.sceneTitle.textContent = sc.title;
    dom.canvasOverlay.textContent = sc.sliders && sc.sliders.length ? '可拖拽下方滑块调参' : (ep.slideDeck || '');

    // Terms
    dom.termsWrap.innerHTML = '';
    var terms = sc.terms || [];
    dom.termsCard.style.display = terms.length ? '' : 'none';
    for (var t = 0; t < terms.length; t++) {
      var chip = document.createElement('div');
      chip.className = 'term-chip';
      chip.innerHTML = '<span class="term-en"></span><span class="term-zh"></span>';
      chip.querySelector('.term-en').textContent = terms[t].en;
      chip.querySelector('.term-zh').textContent = terms[t].zh;
      dom.termsWrap.appendChild(chip);
    }

    // Symbols
    dom.symbolList.innerHTML = '';
    var syms = sc.symbols || [];
    dom.symbolCard.style.display = syms.length ? '' : 'none';
    for (var s = 0; s < syms.length; s++) {
      var scItem = syms[s];
      var sEl = document.createElement('div');
      sEl.className = 'symbol-chip';
      var dot = document.createElement('span');
      dot.className = 'symbol-dot';
      dot.style.background = scItem.color || '#38bdf8';
      var symSpan = document.createElement('span');
      symSpan.className = 'symbol-sym';
      renderMathInto(symSpan, scItem.sym, false);
      var descSpan = document.createElement('span');
      descSpan.className = 'symbol-desc';
      renderRichText(descSpan, scItem.desc);
      sEl.appendChild(dot);
      sEl.appendChild(symSpan);
      sEl.appendChild(descSpan);
      dom.symbolList.appendChild(sEl);
    }

    // Errata
    if (sc.errata) {
      dom.errataBox.classList.remove('hidden');
      renderRichText(dom.errataBox, sc.errata);
    } else {
      dom.errataBox.classList.add('hidden');
    }

    // Formulas
    dom.formulaList.innerHTML = '';
    var forms = sc.formulas || [];
    dom.formulaCard.style.display = forms.length ? '' : 'none';
    for (var f = 0; f < forms.length; f++) {
      var fm = forms[f];
      var card = document.createElement('div');
      card.className = 'formula-card';
      card.dataset.step = String(fm.step);
      var lbl = document.createElement('div');
      lbl.className = 'formula-label';
      lbl.textContent = 'Step ' + (fm.step + 1) + ' · ' + fm.label;
      var math = document.createElement('div');
      math.className = 'formula-math';
      renderMathInto(math, fm.latex, true);
      card.appendChild(lbl);
      card.appendChild(math);
      dom.formulaList.appendChild(card);
    }

    // Sliders & Presets
    initParamsForScene(sc);
    buildControlsCard(sc);
    buildTimelinePillsAndMarkers(ep);
    renderDrawer();
    syncAudioSource(ep, sc);
  }

  function buildControlsCard(sc) {
    var sliders = sc.sliders || [];
    var presets = sc.presets || [];
    if (!sliders.length && !presets.length) {
      dom.controlsCard.classList.add('hidden');
      return;
    }
    dom.controlsCard.classList.remove('hidden');
    dom.presetRow.innerHTML = '';
    dom.sliderGrid.innerHTML = '';

    for (var p = 0; p < presets.length; p++) {
      (function (pr) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'preset-btn';
        btn.textContent = pr.label;
        btn.addEventListener('click', function () {
          var ks = Object.keys(pr.values || {});
          for (var i = 0; i < ks.length; i++) {
            state.params[ks[i]] = pr.values[ks[i]];
          }
          syncSliderInputsFromState(sc);
          drawFrame();
        });
        dom.presetRow.appendChild(btn);
      })(presets[p]);
    }

    for (var s = 0; s < sliders.length; s++) {
      (function (sl) {
        var item = document.createElement('div');
        item.className = 'slider-item';
        var row = document.createElement('div');
        row.className = 'slider-label-row';
        var nameEl = document.createElement('span');
        nameEl.textContent = sl.label;
        var valEl = document.createElement('span');
        valEl.className = 'slider-val';
        valEl.id = 'sl-val-' + sl.key;
        valEl.textContent = formatParamVal(sl, state.params[sl.key]);
        row.appendChild(nameEl);
        row.appendChild(valEl);

        var input = document.createElement('input');
        input.type = 'range';
        input.className = 'slider-input';
        input.id = 'sl-in-' + sl.key;
        input.min = String(sl.min);
        input.max = String(sl.max);
        input.step = String(sl.step);
        input.value = String(state.params[sl.key]);
        input.addEventListener('input', function () {
          state.params[sl.key] = parseFloat(input.value);
          valEl.textContent = formatParamVal(sl, state.params[sl.key]);
          updatePresetHighlights(sc);
          drawFrame();
        });

        item.appendChild(row);
        item.appendChild(input);
        dom.sliderGrid.appendChild(item);
      })(sliders[s]);
    }
    updatePresetHighlights(sc);
  }

  function formatParamVal(sl, v) {
    if (sl.unit) return Number(v).toFixed(sl.decimals !== undefined ? sl.decimals : 2) + ' ' + sl.unit;
    if (Math.abs(sl.step) >= 1) return String(Math.round(v));
    if (Math.abs(sl.step) >= 0.1) return Number(v).toFixed(1);
    return Number(v).toFixed(2);
  }

  function syncSliderInputsFromState(sc) {
    var sliders = sc.sliders || [];
    for (var i = 0; i < sliders.length; i++) {
      var sl = sliders[i];
      var inp = $('sl-in-' + sl.key);
      var val = $('sl-val-' + sl.key);
      if (inp) inp.value = String(state.params[sl.key]);
      if (val) val.textContent = formatParamVal(sl, state.params[sl.key]);
    }
    updatePresetHighlights(sc);
  }

  function updatePresetHighlights(sc) {
    var presets = sc.presets || [];
    var btns = dom.presetRow.querySelectorAll('.preset-btn');
    for (var i = 0; i < presets.length; i++) {
      var match = true;
      var ks = Object.keys(presets[i].values || {});
      for (var k = 0; k < ks.length; k++) {
        if (Math.abs((state.params[ks[k]] || 0) - presets[i].values[ks[k]]) > 1e-4) {
          match = false;
          break;
        }
      }
      if (btns[i]) btns[i].classList.toggle('active', match);
    }
  }

  function buildTimelinePillsAndMarkers(ep) {
    dom.scenePills.innerHTML = '';
    for (var i = 0; i < ep.scenes.length; i++) {
      (function (idx, sc) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'scene-pill' + (idx === state.sceneIdx ? ' active' : '') + (sc.hwCode ? ' hw' : '');
        btn.textContent = (idx + 1) + '. [' + (sc.hwCode ? ('作业 ' + sc.hwCode) : sc.tag) + ']';
        btn.title = sc.title;
        btn.addEventListener('click', function () {
          loadScene(state.epIdx, idx, state.playing);
        });
        dom.scenePills.appendChild(btn);
      })(i, ep.scenes[i]);
    }

    // Auto scroll active pill into view
    var activePill = dom.scenePills.querySelector('.scene-pill.active');
    if (activePill && activePill.scrollIntoView) {
      activePill.scrollIntoView({ inline: 'center', block: 'nearest' });
    }

    // Build step bookmark markers on timeline bar for current scene
    var bar = dom.timelineTrack.querySelector('.timeline-bar');
    if (bar) {
      var oldMarks = bar.querySelectorAll('.timeline-marker');
      for (var m = 0; m < oldMarks.length; m++) oldMarks[m].remove();
      var sc = currentScene();
      var timing = getSceneTiming(ep, sc);
      var dur = Math.max(1, timing.duration || 10);
      var seenStep = {};
      var tLines = timing.lines || [];
      for (var li = 0; li < tLines.length; li++) {
        var st = tLines[li].step || 0;
        if (st > 0 && !seenStep[st]) {
          seenStep[st] = true;
          var dot = document.createElement('span');
          dot.className = 'timeline-marker' + (sc.hwCode ? ' hw' : (sc.tag === '课件例题' ? ' ex' : ''));
          dot.style.left = Math.min(98, Math.max(2, (tLines[li].start / dur) * 100)).toFixed(1) + '%';
          dot.title = 'Step ' + (st + 1);
          bar.appendChild(dot);
        }
      }
    }
  }

  function syncAudioSource(ep, sc) {
    var timing = getSceneTiming(ep, sc);
    var audio = dom.audio;
    state.audioReady = false;
    state.audioBuffering = false;
    state.audioFailed = false;
    state.pendingSeek = null;
    audio.pause();
    audio.currentTime = 0;
    if (timing.hasAudio) {
      var expectedSrc = 'audio/' + ep.id + '/' + sc.id + '.mp3';
      audio.src = expectedSrc;
      audio.playbackRate = state.rate;
      audio.muted = state.muted;
      audio.load();
    } else {
      audio.removeAttribute('src');
    }
  }

  function prefetchNextSceneAudio(ep) {
    if (!ep) return;
    var nextEpIdx = state.epIdx;
    var nextSceneIdx = state.sceneIdx + 1;
    if (nextSceneIdx >= ep.scenes.length) {
      nextEpIdx += 1;
      nextSceneIdx = 0;
    }
    var nextEp = state.episodes[nextEpIdx];
    var nextSc = nextEp && nextEp.scenes[nextSceneIdx];
    if (!nextEp || !nextSc) return;
    var key = nextEp.id + '/' + nextSc.id;
    if (state.prefetchedKey === key) return;
    state.prefetchedKey = key;
    var timing = getSceneTiming(nextEp, nextSc);
    if (!timing.hasAudio) return;
    try {
      if (!state.prefetcher) {
        state.prefetcher = new Audio();
        state.prefetcher.preload = 'auto';
      }
      state.prefetcher.src = 'audio/' + nextEp.id + '/' + nextSc.id + '.mp3';
      state.prefetcher.load();
    } catch (e) { /* ignore */ }
  }

  function getActiveLineAndStep(sc, timing, elapsed) {
    var lines = sc.lines || [];
    var tLines = timing.lines || [];
    if (!lines.length) {
      return { lineIdx: 0, line: null, step: 0, stepProgress: 0, subIdx: 0, subText: '', globalSubIdx: 0, totalSubs: 1 };
    }

    var activeIdx = lines.length - 1;
    for (var i = 0; i < tLines.length; i++) {
      if (elapsed < tLines[i].end - 0.015) {
        activeIdx = i;
        break;
      }
    }
    var curLine = lines[activeIdx] || lines[0];
    var curT = tLines[activeIdx] || { start: 0, end: timing.duration, step: curLine.step || 0 };
    var step = curLine.step !== undefined ? curLine.step : 0;
    var span = Math.max(0.1, curT.end - curT.start);
    var stepProg = Math.max(0, Math.min(1, (elapsed - curT.start) / span));

    // Locate fine-grained spoken sub-clause if available
    var totalSubs = 0;
    var subsBefore = 0;
    var hasSubArray = false;
    for (var k = 0; k < tLines.length; k++) {
      var arr = tLines[k].subs;
      if (arr && arr.length) {
        hasSubArray = true;
        totalSubs += arr.length;
        if (k < activeIdx) subsBefore += arr.length;
      } else {
        totalSubs += 1;
        if (k < activeIdx) subsBefore += 1;
      }
    }
    if (!hasSubArray) totalSubs = Math.max(1, lines.length);

    var subIdx = 0;
    var subText = curLine.sub || '';
    var subs = curT.subs;
    if (subs && subs.length) {
      subIdx = subs.length - 1;
      for (var j = 0; j < subs.length; j++) {
        if (elapsed < subs[j].end - 0.015) {
          subIdx = j;
          break;
        }
      }
      subText = subs[subIdx].text || subText;
    }

    return {
      lineIdx: activeIdx,
      line: curLine,
      step: step,
      stepProgress: stepProg,
      subIdx: subIdx,
      subText: subText,
      globalSubIdx: subsBefore + subIdx,
      totalSubs: Math.max(1, totalSubs)
    };
  }

  function drawFrame() {
    var ep = currentEpisode();
    var sc = currentScene();
    if (!ep || !sc || !global.COMM_VIZ || !global.COMM_MATH) return;

    var timing = getSceneTiming(ep, sc);
    var dur = Math.max(1, timing.duration || 10);
    var progress = Math.max(0, Math.min(1, state.elapsed / dur));
    var active = getActiveLineAndStep(sc, timing, state.elapsed);

    // Update subtitle & progress bar
    dom.timeLabel.textContent = formatTime(state.elapsed) + ' / ' + formatTime(dur);
    dom.timelineFill.style.width = (progress * 100).toFixed(2) + '%';
    if (state.playing && state.audioBuffering) {
      dom.subProgress.textContent = '⏳ 配音缓冲中...';
    } else {
      dom.subProgress.textContent = '字幕 ' + (active.globalSubIdx + 1) + '/' + active.totalSubs;
    }

    var subKey = ep.id + '/' + sc.id + '/' + active.lineIdx + '/' + active.subIdx;
    if (state.lastSubKey !== subKey) {
      state.lastSubKey = subKey;
      if (active.line) {
        renderRichText(dom.subtitleText, active.subText || active.line.sub);
      } else {
        dom.subtitleText.textContent = sc.title;
      }
    }

    if (dom.subtitleNote) {
      var noteKey = ep.id + '/' + sc.id + '/' + active.lineIdx;
      if (state.lastNoteKey !== noteKey) {
        state.lastNoteKey = noteKey;
        if (active.line && active.line.sub && active.subText && active.subText !== active.line.sub) {
          dom.subtitleNote.classList.remove('hidden');
          renderRichText(dom.subtitleNote, '📌 要点：' + active.line.sub);
        } else {
          dom.subtitleNote.classList.add('hidden');
          dom.subtitleNote.textContent = '';
        }
      }
    }

    if (progress > 0.7) {
      prefetchNextSceneAudio(ep);
    }

    // Highlight active formula card
    var cards = dom.formulaList.querySelectorAll('.formula-card');
    for (var i = 0; i < cards.length; i++) {
      var st = parseInt(cards[i].dataset.step || '0', 10);
      cards[i].classList.toggle('active', st === active.step);
      cards[i].classList.toggle('past', st < active.step);
    }

    // Setup HiDPI Canvas & call scene render
    var frame = global.COMM_VIZ.setupCanvas(dom.canvas);
    try {
      sc.render(frame.ctx, {
        width: frame.width,
        height: frame.height,
        rect: frame.rect,
        isPortrait: frame.isPortrait,
        fontSm: frame.fontSm,
        fontMd: frame.fontMd,
        fontLg: frame.fontLg,
        progress: progress,
        step: active.step,
        stepProgress: active.stepProgress,
        time: state.elapsed,
        params: state.params,
        math: global.COMM_MATH,
        viz: global.COMM_VIZ
      });
    } catch (err) {
      frame.ctx.fillStyle = '#fb7185';
      frame.ctx.font = '13px sans-serif';
      frame.ctx.fillText('绘图出错: ' + err.message, 16, 28);
      console.error(err);
    }
  }

  function loadScene(epIdx, sceneIdx, autoPlay) {
    if (epIdx < 0 || epIdx >= state.episodes.length) return;
    var ep = state.episodes[epIdx];
    if (sceneIdx < 0) sceneIdx = 0;
    if (sceneIdx >= ep.scenes.length) sceneIdx = ep.scenes.length - 1;

    if (state.rafId) {
      cancelAnimationFrame(state.rafId);
      state.rafId = null;
    }

    state.epIdx = epIdx;
    state.sceneIdx = sceneIdx;
    state.elapsed = 0;
    state.playing = !!autoPlay;
    state.lastSubKey = '';
    state.lastNoteKey = '';
    state.prefetchedKey = '';

    buildSceneStaticUI();
    saveState();
    drawFrame();

    if (state.playing) {
      startPlayback();
    } else {
      updateTransportButtons();
    }
  }

  function startPlayback() {
    state.playing = true;
    state.lastTs = performance.now();
    updateTransportButtons();

    var ep = currentEpisode();
    var sc = currentScene();
    var timing = getSceneTiming(ep, sc);
    if (timing.hasAudio && !state.muted && !state.audioFailed && dom.audio.src) {
      try {
        var targetT = Math.min(state.elapsed, Math.max(0, timing.duration - 0.05));
        if (dom.audio.readyState >= 1) {
          if (Math.abs(dom.audio.currentTime - targetT) > 0.08) {
            dom.audio.currentTime = targetT;
          }
          state.pendingSeek = null;
        } else if (targetT > 0.05) {
          state.pendingSeek = targetT;
          state.audioBuffering = true;
        } else {
          state.pendingSeek = null;
        }
        dom.audio.playbackRate = state.rate;
        dom.audio.muted = false;
        var p = dom.audio.play();
        if (p && typeof p.catch === 'function') {
          p.catch(function (err) {
            if (err && err.name === 'NotAllowedError') {
              pausePlayback();
            }
          });
        }
      } catch (e) { /* ignore */ }
    }
    ensureRafLoop();
  }

  function pausePlayback() {
    state.playing = false;
    state.audioBuffering = false;
    if (state.rafId) {
      cancelAnimationFrame(state.rafId);
      state.rafId = null;
    }
    try { dom.audio.pause(); } catch (e) { /* ignore */ }
    updateTransportButtons();
    drawFrame();
  }

  function togglePlay() {
    if (state.playing) pausePlayback();
    else startPlayback();
  }

  function ensureRafLoop() {
    if (state.rafId) return;
    function tick(now) {
      state.rafId = null;
      if (!state.playing) {
        return;
      }
      var dt = Math.min(0.1, (now - state.lastTs) / 1000);
      state.lastTs = now;

      var ep = currentEpisode();
      var sc = currentScene();
      var timing = getSceneTiming(ep, sc);
      var dur = Math.max(1, timing.duration || 10);

      var wantAudioClock = timing.hasAudio && !state.muted && !state.audioFailed;
      if (wantAudioClock) {
        if (dom.audio.ended) {
          state.elapsed = dur;
          drawFrame();
          advanceNextScene(true);
          return;
        }
        if (state.pendingSeek === null && !dom.audio.seeking && !dom.audio.paused && dom.audio.readyState >= 2) {
          state.elapsed = dom.audio.currentTime;
          state.audioBuffering = false;
        } else {
          state.audioBuffering = true;
        }
      } else {
        state.elapsed += dt * state.rate;
        if (state.elapsed >= dur) {
          state.elapsed = dur;
          drawFrame();
          advanceNextScene(true);
          return;
        }
      }

      drawFrame();
      if (state.playing && !state.rafId) {
        state.rafId = requestAnimationFrame(tick);
      }
    }
    state.rafId = requestAnimationFrame(tick);
  }

  function advanceNextScene(autoContinue) {
    var ep = currentEpisode();
    if (!ep) return;
    if (state.sceneIdx + 1 < ep.scenes.length) {
      loadScene(state.epIdx, state.sceneIdx + 1, autoContinue);
    } else if (state.epIdx + 1 < state.episodes.length) {
      loadScene(state.epIdx + 1, 0, autoContinue);
    } else {
      pausePlayback();
      state.elapsed = 0;
      drawFrame();
    }
  }

  function prevScene() {
    if (state.elapsed > 3) {
      seekSceneFraction(0);
      return;
    }
    if (state.sceneIdx > 0) {
      loadScene(state.epIdx, state.sceneIdx - 1, state.playing);
    } else if (state.epIdx > 0) {
      var prevEp = state.episodes[state.epIdx - 1];
      loadScene(state.epIdx - 1, prevEp.scenes.length - 1, state.playing);
    }
  }

  function seekSceneFraction(frac) {
    var ep = currentEpisode();
    var sc = currentScene();
    if (!ep || !sc) return;
    var timing = getSceneTiming(ep, sc);
    var t = Math.max(0, Math.min(timing.duration - 0.05, frac * timing.duration));
    state.elapsed = t;
    if (timing.hasAudio && dom.audio.src) {
      if (dom.audio.readyState >= 1) {
        state.pendingSeek = null;
        try {
          dom.audio.currentTime = t;
        } catch (e) { /* ignore */ }
      } else {
        state.pendingSeek = t;
      }
    }
    drawFrame();
  }

  function updateTransportButtons() {
    dom.playBtn.textContent = state.playing ? '⏸ 暂停' : '▶ 播放';
    dom.rateBtn.textContent = state.rate + 'x';
    dom.muteBtn.textContent = state.muted ? '🔇 静音' : '🔊 声音';
    dom.muteBtn.classList.toggle('muted-on', state.muted);
  }

  function openDrawer(tab) {
    if (tab) state.drawerTab = tab;
    dom.drawerBackdrop.classList.remove('hidden');
    renderDrawer();
  }

  function closeDrawer() {
    dom.drawerBackdrop.classList.add('hidden');
  }

  function renderDrawer() {
    dom.tabEpisodes.classList.toggle('active', state.drawerTab === 'episodes');
    dom.tabHomework.classList.toggle('active', state.drawerTab === 'homework');
    dom.drawerBody.innerHTML = '';

    if (state.drawerTab === 'episodes') {
      var timings = global.COMM_TIMINGS || {};
      for (var i = 0; i < state.episodes.length; i++) {
        (function (idx, ep) {
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'ep-item' + (idx === state.epIdx ? ' active' : '');
          var epDur = timings[ep.id] && timings[ep.id].totalDuration
            ? formatTime(timings[ep.id].totalDuration)
            : (ep.scenes.length + ' 幕');

          var top = document.createElement('div');
          top.className = 'ep-item-top';
          top.innerHTML = '<span>' + ep.id.toUpperCase() + ' · ' + ep.chapter + '</span><span>' + epDur + '</span>';

          var title = document.createElement('div');
          title.className = 'ep-item-title';
          title.textContent = ep.title;

          btn.appendChild(top);
          btn.appendChild(title);

          if (ep.homeworkTags && ep.homeworkTags.length) {
            var hwWrap = document.createElement('div');
            hwWrap.className = 'ep-item-hw';
            for (var h = 0; h < ep.homeworkTags.length; h++) {
              var sp = document.createElement('span');
              sp.className = 'mini-hw';
              sp.textContent = ep.homeworkTags[h];
              hwWrap.appendChild(sp);
            }
            btn.appendChild(hwWrap);
          }

          btn.addEventListener('click', function () {
            closeDrawer();
            loadScene(idx, 0, true);
          });
          dom.drawerBody.appendChild(btn);
        })(i, state.episodes[i]);
      }
      return;
    }

    // Homework & Key Examples Direct Index
    var hwHeading = document.createElement('div');
    hwHeading.className = 'hw-group-title';
    hwHeading.textContent = '19 道作业题直跳书签';
    dom.drawerBody.appendChild(hwHeading);

    for (var ei = 0; ei < state.episodes.length; ei++) {
      var epObj = state.episodes[ei];
      for (var si = 0; si < epObj.scenes.length; si++) {
        var scObj = epObj.scenes[si];
        if (!scObj.hwCode && scObj.tag !== '作业精讲') continue;
        (function (eIdx, sIdx, epR, scR) {
          var item = document.createElement('button');
          item.type = 'button';
          item.className = 'ep-item' + (eIdx === state.epIdx && sIdx === state.sceneIdx ? ' active' : '');
          item.innerHTML =
            '<div class="ep-item-top"><span>作业 ' + (scR.hwCode || '') + '</span><span>' + epR.id.toUpperCase() + ' 第 ' + (sIdx + 1) + ' 幕</span></div>' +
            '<div class="ep-item-title">' + scR.title + '</div>';
          item.addEventListener('click', function () {
            closeDrawer();
            loadScene(eIdx, sIdx, true);
          });
          dom.drawerBody.appendChild(item);
        })(ei, si, epObj, scObj);
      }
    }

    var exHeading = document.createElement('div');
    exHeading.className = 'hw-group-title';
    exHeading.textContent = '课件经典例题 / 易错辨析';
    dom.drawerBody.appendChild(exHeading);

    for (var ej = 0; ej < state.episodes.length; ej++) {
      var ep2 = state.episodes[ej];
      for (var sj = 0; sj < ep2.scenes.length; sj++) {
        var sc2 = ep2.scenes[sj];
        if (sc2.tag !== '课件例题' && sc2.tag !== '易错辨析') continue;
        (function (eIdx, sIdx, epR, scR) {
          var item = document.createElement('button');
          item.type = 'button';
          item.className = 'ep-item' + (eIdx === state.epIdx && sIdx === state.sceneIdx ? ' active' : '');
          item.innerHTML =
            '<div class="ep-item-top"><span>' + scR.tag + ' · ' + (scR.slideRef || '') + '</span><span>' + epR.id.toUpperCase() + '</span></div>' +
            '<div class="ep-item-title">' + scR.title + '</div>';
          item.addEventListener('click', function () {
            closeDrawer();
            loadScene(eIdx, sIdx, true);
          });
          dom.drawerBody.appendChild(item);
        })(ej, sj, ep2, sc2);
      }
    }
  }

  function bindTimelineScrub() {
    var dragging = false;
    function handlePointer(ev) {
      var rect = dom.timelineTrack.getBoundingClientRect();
      var frac = (ev.clientX - rect.left) / Math.max(1, rect.width);
      seekSceneFraction(Math.max(0, Math.min(1, frac)));
    }
    dom.timelineTrack.addEventListener('pointerdown', function (ev) {
      dragging = true;
      dom.timelineTrack.setPointerCapture(ev.pointerId);
      handlePointer(ev);
    });
    dom.timelineTrack.addEventListener('pointermove', function (ev) {
      if (dragging) handlePointer(ev);
    });
    dom.timelineTrack.addEventListener('pointerup', function () {
      dragging = false;
    });
    dom.timelineTrack.addEventListener('pointercancel', function () {
      dragging = false;
    });
  }

  function init() {
    dom = {
      epPill: $('ep-pill'),
      topTitle: $('topbar-title'),
      topSub: $('topbar-sub'),
      slideBadge: $('slide-badge'),
      btnDrawer: $('btn-drawer'),
      btnHwIndex: $('btn-hw-index'),
      tagBadge: $('tag-badge'),
      sceneRef: $('scene-ref'),
      sceneTitle: $('scene-title'),
      canvas: $('viz-canvas'),
      canvasOverlay: $('canvas-overlay'),
      subProgress: $('sub-progress'),
      subtitleText: $('subtitle-text'),
      subtitleNote: $('subtitle-note'),
      controlsCard: $('controls-card'),
      presetRow: $('preset-row'),
      sliderGrid: $('slider-grid'),
      termsCard: $('terms-card'),
      termsWrap: $('terms-wrap'),
      symbolCard: $('symbol-card'),
      symbolList: $('symbol-list'),
      errataBox: $('errata-box'),
      formulaCard: $('formula-card'),
      formulaList: $('formula-list'),
      timelineTrack: $('timeline-track'),
      timelineFill: $('timeline-fill'),
      timeLabel: $('time-label'),
      scenePills: $('scene-pills'),
      prevBtn: $('btn-prev'),
      playBtn: $('btn-play'),
      nextBtn: $('btn-next'),
      rateBtn: $('btn-rate'),
      muteBtn: $('btn-mute'),
      drawerBackdrop: $('drawer-backdrop'),
      drawerClose: $('drawer-close'),
      tabEpisodes: $('tab-episodes'),
      tabHomework: $('tab-homework'),
      drawerBody: $('drawer-body'),
      audio: $('narrator-audio')
    };

    state.episodes = (global.COMM_EPISODES || []).slice().sort(function (a, b) {
      return a.id.localeCompare(b.id);
    });

    if (!state.episodes.length) {
      dom.topTitle.textContent = '暂无已加载的剧集';
      return;
    }

    parseInitialRoute();

    dom.playBtn.addEventListener('click', togglePlay);
    dom.prevBtn.addEventListener('click', prevScene);
    dom.nextBtn.addEventListener('click', function () { advanceNextScene(state.playing); });
    dom.rateBtn.addEventListener('click', function () {
      var idx = RATES.indexOf(state.rate);
      state.rate = RATES[(idx + 1) % RATES.length];
      dom.audio.playbackRate = state.rate;
      updateTransportButtons();
      saveState();
    });
    dom.muteBtn.addEventListener('click', function () {
      state.muted = !state.muted;
      dom.audio.muted = state.muted;
      updateTransportButtons();
      saveState();
    });

    dom.btnDrawer.addEventListener('click', function () { openDrawer('episodes'); });
    dom.btnHwIndex.addEventListener('click', function () { openDrawer('homework'); });
    dom.drawerClose.addEventListener('click', closeDrawer);
    dom.drawerBackdrop.addEventListener('click', function (ev) {
      if (ev.target === dom.drawerBackdrop) closeDrawer();
    });
    dom.tabEpisodes.addEventListener('click', function () { state.drawerTab = 'episodes'; renderDrawer(); });
    dom.tabHomework.addEventListener('click', function () { state.drawerTab = 'homework'; renderDrawer(); });

    dom.audio.addEventListener('loadedmetadata', function () {
      dom.audio.playbackRate = state.rate;
      dom.audio.muted = state.muted;
      if (state.pendingSeek !== null) {
        var target = state.pendingSeek;
        state.pendingSeek = null;
        try {
          dom.audio.currentTime = target;
        } catch (e) { /* ignore */ }
      }
      if (state.playing) drawFrame();
    });
    dom.audio.addEventListener('waiting', function () {
      state.audioBuffering = true;
      if (state.playing) drawFrame();
    });
    dom.audio.addEventListener('playing', function () {
      state.audioBuffering = false;
      if (state.playing) {
        ensureRafLoop();
        drawFrame();
      }
    });
    dom.audio.addEventListener('canplaythrough', function () {
      state.audioReady = true;
      state.audioBuffering = false;
      if (state.playing) drawFrame();
    });
    dom.audio.addEventListener('seeked', function () {
      state.audioBuffering = false;
      if (state.playing || !dom.audio.paused) {
        state.elapsed = dom.audio.currentTime;
      }
      drawFrame();
    });
    dom.audio.addEventListener('timeupdate', function () {
      if (state.playing && state.pendingSeek === null && !dom.audio.seeking && !dom.audio.paused && dom.audio.readyState >= 2) {
        state.elapsed = dom.audio.currentTime;
        state.audioBuffering = false;
        drawFrame();
      }
    });
    dom.audio.addEventListener('ended', function () {
      if (state.playing) advanceNextScene(true);
    });
    dom.audio.addEventListener('canplay', function () {
      state.audioReady = true;
    });
    dom.audio.addEventListener('error', function () {
      state.audioFailed = true;
      state.audioBuffering = false;
    });

    bindTimelineScrub();

    if (typeof ResizeObserver !== 'undefined') {
      var ro = new ResizeObserver(function () {
        drawFrame();
      });
      ro.observe(dom.canvas);
    } else {
      window.addEventListener('resize', drawFrame);
    }

    // Keyboard shortcuts on desktop
    window.addEventListener('keydown', function (ev) {
      if (ev.target && (ev.target.tagName === 'INPUT' || ev.target.tagName === 'TEXTAREA')) return;
      if (ev.code === 'Space') { ev.preventDefault(); togglePlay(); }
      else if (ev.code === 'ArrowRight') advanceNextScene(state.playing);
      else if (ev.code === 'ArrowLeft') prevScene();
    });

    loadScene(state.epIdx, state.sceneIdx, false);
  }

  // Expose debug/test helper for verification script
  global.COMM_PLAYER = {
    jumpTo: function (epId, sceneId, autoPlay) {
      for (var i = 0; i < state.episodes.length; i++) {
        if (state.episodes[i].id === epId) {
          var sIdx = 0;
          if (sceneId) {
            for (var j = 0; j < state.episodes[i].scenes.length; j++) {
              if (state.episodes[i].scenes[j].id === sceneId) {
                sIdx = j;
                break;
              }
            }
          }
          loadScene(i, sIdx, !!autoPlay);
          return true;
        }
      }
      return false;
    },
    seekFraction: seekSceneFraction,
    setParam: function (k, v) {
      state.params[k] = v;
      var sc = currentScene();
      if (sc) syncSliderInputsFromState(sc);
      drawFrame();
    },
    getState: function () {
      return {
        epId: currentEpisode() && currentEpisode().id,
        sceneId: currentScene() && currentScene().id,
        episodeCount: state.episodes.length,
        elapsed: state.elapsed,
        playing: state.playing,
        captionText: dom.subtitleText ? dom.subtitleText.textContent : ''
      };
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(window);
