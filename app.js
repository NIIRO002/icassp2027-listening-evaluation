(() => {
  "use strict";

  const data = window.STUDY_DATA;
  const byId = (id) => document.getElementById(id);
  const views = ["introView", "setupView", "transitionView", "trialView", "completeView"];
  const audioElements = ["referenceAudio", "audioA", "audioB"].map(byId);
  const responses = [];
  let session = null;
  let trialIndex = 0;
  let trialStart = 0;
  let playCounts = {};

  function showView(id) {
    views.forEach((viewId) => byId(viewId).classList.toggle("hidden", viewId !== id));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function stopOtherAudio(active) {
    audioElements.forEach((audio) => { if (audio !== active) audio.pause(); });
  }

  function setAudio(audio, path) {
    audio.pause();
    audio.src = path || "";
    audio.load();
  }

  function registerAudio(audio, key) {
    audio.addEventListener("play", () => {
      stopOtherAudio(audio);
      playCounts[key] = (playCounts[key] || 0) + 1;
      updateListenRequirement();
      updateNextState();
    });
  }

  registerAudio(byId("referenceAudio"), "reference");
  registerAudio(byId("audioA"), "a");
  registerAudio(byId("audioB"), "b");

  function checked(name) {
    return document.querySelector(`input[name="${name}"]:checked`)?.value || "";
  }

  function signed(value) {
    const numeric = Number(value);
    return numeric > 0 ? `+${numeric}` : String(numeric);
  }

  function hashString(value) {
    let hash = 2166136261;
    for (let index = 0; index < value.length; index += 1) {
      hash ^= value.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function mulberry32(seed) {
    return () => {
      let value = seed += 0x6D2B79F5;
      value = Math.imul(value ^ value >>> 15, value | 1);
      value ^= value + Math.imul(value ^ value >>> 7, value | 61);
      return ((value ^ value >>> 14) >>> 0) / 4294967296;
    };
  }

  function counterbalancedTrials(participantId) {
    const trials = data.trials.map((trial) => ({ ...trial, presentation_code: "A-B" }));
    const blocks = [...new Set(trials.map((trial) => trial.block))];
    blocks.forEach((block) => {
      const blockTrials = trials.filter((trial) => trial.block === block);
      const flags = blockTrials.map((_, index) => index < Math.floor(blockTrials.length / 2));
      const random = mulberry32(hashString(`${data.study_id}|${participantId}|${block}`));
      for (let index = flags.length - 1; index > 0; index -= 1) {
        const target = Math.floor(random() * (index + 1));
        [flags[index], flags[target]] = [flags[target], flags[index]];
      }
      blockTrials.forEach((trial, index) => {
        if (!flags[index]) return;
        [trial.audio_a, trial.audio_b] = [trial.audio_b, trial.audio_a];
        trial.presentation_code = "B-A";
      });
    });
    return trials;
  }

  function bindSlider(sliderId, outputId) {
    const slider = byId(sliderId);
    const output = byId(outputId);
    slider.addEventListener("input", () => {
      slider.dataset.touched = "true";
      output.value = signed(slider.value);
      updateNextState();
    });
  }

  bindSlider("naturalnessSlider", "naturalnessValue");
  bindSlider("similaritySlider", "similarityValue");
  document.querySelectorAll('input[name="directionChoice"]').forEach((input) => input.addEventListener("change", updateNextState));

  function resetTrialInputs() {
    document.querySelectorAll('#trialView input[type="radio"]').forEach((input) => { input.checked = false; });
    for (const [sliderId, outputId] of [
      ["naturalnessSlider", "naturalnessValue"],
      ["similaritySlider", "similarityValue"],
    ]) {
      const slider = byId(sliderId);
      slider.value = "0";
      slider.dataset.touched = "false";
      byId(outputId).value = "0";
    }
    playCounts = {};
    byId("nextButton").disabled = true;
  }

  function renderTrial() {
    const trial = session.trials[trialIndex];
    resetTrialInputs();
    const isDirection = trial.trial_type === "direction_ab";
    const isQuality = trial.trial_type === "quality_cmos";
    byId("directionPanel").classList.toggle("hidden", !isDirection);
    byId("qualityPanel").classList.toggle("hidden", !isQuality);
    byId("referenceRow").classList.toggle("hidden", !isQuality);
    byId("trialBadge").textContent = `${trial.block} · ${trial.block_label}`;
    byId("trialCounter").textContent = `${trialIndex + 1} / ${session.trials.length}`;
    byId("trialPrompt").textContent = trial.prompt;
    byId("trialHint").textContent = trial.hint;
    setAudio(byId("audioA"), trial.audio_a);
    setAudio(byId("audioB"), trial.audio_b);
    setAudio(byId("referenceAudio"), isQuality ? trial.reference_audio : "");
    byId("progressText").textContent = `${trialIndex + 1} / ${session.trials.length}`;
    byId("progressBar").style.width = `${100 * trialIndex / session.trials.length}%`;
    byId("nextButton").textContent = trialIndex + 1 === session.trials.length ? "평가 완료" : "다음";
    updateListenRequirement();
    trialStart = performance.now();
  }

  function updateListenRequirement() {
    if (!session) return;
    const trial = session.trials[trialIndex];
    const required = trial.trial_type === "quality_cmos" ? ["reference", "a", "b"] : ["a", "b"];
    const labels = { reference: "목표 목소리 예시", a: "A", b: "B" };
    const remaining = required.filter((key) => !(playCounts[key] > 0));
    byId("listenRequirement").textContent = remaining.length
      ? `다음으로 이동하려면 먼저 재생해 주세요: ${remaining.map((key) => labels[key]).join(", ")}`
      : "필요한 음원을 모두 재생했습니다. 응답을 선택해 주세요.";
  }

  function updateNextState() {
    if (!session) return;
    const trial = session.trials[trialIndex];
    let answered = false;
    const requiredAudio = trial.trial_type === "quality_cmos" ? ["reference", "a", "b"] : ["a", "b"];
    const listened = requiredAudio.every((key) => playCounts[key] > 0);
    if (trial.trial_type === "direction_ab") answered = Boolean(checked("directionChoice"));
    if (trial.trial_type === "quality_cmos") {
      answered = byId("naturalnessSlider").dataset.touched === "true" && byId("similaritySlider").dataset.touched === "true";
    }
    byId("nextButton").disabled = !(answered && listened);
  }

  function saveResponse() {
    const trial = session.trials[trialIndex];
    responses.push({
      study_id: data.study_id,
      participant_id: session.participantId,
      experience: session.experience,
      device_type: session.deviceType,
      trial_index: trialIndex + 1,
      trial_id: trial.trial_id,
      block: trial.block,
      trial_type: trial.trial_type,
      presentation_code: trial.presentation_code,
      direction_choice: checked("directionChoice"),
      naturalness_cmos: trial.trial_type === "quality_cmos" ? byId("naturalnessSlider").value : "",
      speaker_similarity_cmos: trial.trial_type === "quality_cmos" ? byId("similaritySlider").value : "",
      response_time_sec: ((performance.now() - trialStart) / 1000).toFixed(3),
      completed_at_utc: new Date().toISOString(),
      reference_play_count: playCounts.reference || 0,
      audio_a_play_count: playCounts.a || 0,
      audio_b_play_count: playCounts.b || 0,
      required_audio_played: "true",
    });
  }

  function renderTransition(nextBlock) {
    const copy = data.transitions[nextBlock];
    byId("transitionEyebrow").textContent = `${nextBlock} 블록`;
    byId("transitionTitle").textContent = copy.title;
    byId("transitionCopy").textContent = copy.copy;
    showView("transitionView");
  }

  byId("introConfirmed").addEventListener("change", (event) => {
    byId("introContinueButton").disabled = !event.target.checked;
  });
  byId("introContinueButton").addEventListener("click", () => showView("setupView"));
  byId("transitionButton").addEventListener("click", () => { showView("trialView"); renderTrial(); });
  byId("startButton").addEventListener("click", () => {
    const participantId = byId("participantId").value.trim();
    if (!participantId || !byId("consent").checked) {
      byId("setupError").textContent = "참가자 ID와 연구 참여 동의를 확인해 주세요.";
      return;
    }
    session = {
      participantId,
      experience: byId("experience").value,
      deviceType: byId("deviceType").value,
      trials: counterbalancedTrials(participantId),
    };
    trialIndex = 0;
    showView("trialView");
    renderTrial();
  });
  byId("nextButton").addEventListener("click", () => {
    saveResponse();
    const previousBlock = session.trials[trialIndex].block;
    trialIndex += 1;
    if (trialIndex >= session.trials.length) {
      byId("progressText").textContent = "완료";
      byId("progressBar").style.width = "100%";
      showView("completeView");
      return;
    }
    const nextBlock = session.trials[trialIndex].block;
    if (nextBlock !== previousBlock) renderTransition(nextBlock);
    else renderTrial();
  });

  function csvEscape(value) {
    const stringValue = String(value ?? "");
    return /[",\n]/.test(stringValue) ? `"${stringValue.replaceAll('"', '""')}"` : stringValue;
  }

  byId("downloadButton").addEventListener("click", () => {
    const fields = Object.keys(responses[0]);
    const rows = [fields.join(","), ...responses.map((row) => fields.map((field) => csvEscape(row[field])).join(","))];
    const blob = new Blob(["\ufeff" + rows.join("\r\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${data.study_id}_${session.participantId.replace(/[^a-zA-Z0-9_-]/g, "_")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    byId("downloadStatus").textContent = "응답 파일을 저장했습니다. 연구자에게 전달해 주세요.";
  });
})();
