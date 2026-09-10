(() => {
  "use strict";
  const data = window.STUDY_DATA;
  const byId = (id) => document.getElementById(id);
  const views = ["introView", "setupView", "transitionView", "trialView", "completeView"];
  const audios = ["referenceAudio", "audioA", "audioB"].map(byId);
  let session = null;
  let trialIndex = 0;
  let trialStart = 0;
  let ended = {};
  let playCounts = {};
  const responses = [];

  function showView(id) {
    views.forEach((viewId) => byId(viewId).classList.toggle("hidden", viewId !== id));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function stopOtherAudio(active) { audios.forEach((audio) => { if (audio !== active) audio.pause(); }); }
  function setAudio(audio, path) { audio.pause(); audio.src = path; audio.load(); }
  function registerAudio(audio, key, statusId) {
    audio.addEventListener("play", () => { stopOtherAudio(audio); playCounts[key] = (playCounts[key] || 0) + 1; });
    audio.addEventListener("ended", () => {
      ended[key] = true;
      byId(statusId).textContent = "재생 완료";
      byId(statusId).classList.add("complete");
      updateNextState();
    });
  }
  registerAudio(byId("referenceAudio"), "reference", "endedReference");
  registerAudio(byId("audioA"), "a", "endedA");
  registerAudio(byId("audioB"), "b", "endedB");

  function makeScale(containerId, name, values) {
    const container = byId(containerId);
    values.forEach((value) => {
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.type = "radio";
      input.name = name;
      input.value = String(value);
      input.addEventListener("change", updateNextState);
      label.append(input, document.createTextNode(value > 0 ? `+${value}` : String(value)));
      container.append(label);
    });
  }
  makeScale("attributeScale", "attributeRating", [-2, -1, 0, 1, 2]);
  document.querySelectorAll('#supportPanel input[type="radio"]').forEach((input) => input.addEventListener("change", updateNextState));

  function checked(name) { return document.querySelector(`input[name="${name}"]:checked`)?.value || ""; }
  function hashParticipantId(value) {
    let hash = 2166136261;
    for (const char of value.trim().toUpperCase()) { hash ^= char.charCodeAt(0); hash = Math.imul(hash, 16777619); }
    return hash >>> 0;
  }
  function buildPresentationTrials(participantId) {
    const layout = hashParticipantId(participantId) % 2;
    return data.trials.map((trial, index) => {
      const swapped = ((index + layout) % 2) === 1;
      return {
        ...trial,
        audio_a: swapped ? trial.audio_right : trial.audio_left,
        audio_b: swapped ? trial.audio_left : trial.audio_right,
        presentation_code: swapped ? "R-L" : "L-R",
      };
    });
  }
  function resetTrialInputs() {
    document.querySelectorAll('#trialView input[type="radio"]').forEach((input) => { input.checked = false; });
    ended = {}; playCounts = {};
    ["endedReference", "endedA", "endedB"].forEach((id) => {
      byId(id).textContent = "끝까지 재생해 주세요";
      byId(id).classList.remove("complete");
    });
    byId("trialError").textContent = "";
    byId("nextButton").disabled = true;
  }
  function renderTrial() {
    const trial = session.trials[trialIndex];
    resetTrialInputs();
    const isAttribute = trial.trial_type === "attribute_rating";
    const isSupport = trial.trial_type === "support_preference";
    byId("referenceRow").classList.toggle("hidden", !isSupport);
    byId("attributePanel").classList.toggle("hidden", !isAttribute);
    byId("supportPanel").classList.toggle("hidden", !isSupport);
    byId("trialBadge").textContent = `${trial.block} · ${trial.block_label}`;
    byId("trialCounter").textContent = `${trialIndex + 1} / ${session.trials.length}`;
    byId("trialPrompt").textContent = trial.prompt;
    byId("trialHint").textContent = trial.hint;
    setAudio(byId("audioA"), trial.audio_a);
    setAudio(byId("audioB"), trial.audio_b);
    if (isSupport) setAudio(byId("referenceAudio"), trial.reference_audio);
    byId("progressText").textContent = `${trialIndex + 1} / ${session.trials.length}`;
    byId("progressBar").style.width = `${100 * trialIndex / session.trials.length}%`;
    trialStart = performance.now();
  }
  function updateNextState() {
    if (!session) return;
    const trial = session.trials[trialIndex];
    const isSupport = trial.trial_type === "support_preference";
    const listened = ended.a && ended.b && (!isSupport || ended.reference);
    const answered = isSupport
      ? checked("strengthPreference") && checked("temporalPreference") && checked("naturalnessPreference")
      : checked("attributeRating");
    byId("nextButton").disabled = !(listened && answered);
  }
  function saveResponse() {
    const trial = session.trials[trialIndex];
    responses.push({
      study_id: data.study_id, participant_id: session.participantId, experience: session.experience,
      device_type: session.deviceType, participant_layout: session.layout, trial_index: trialIndex + 1,
      trial_id: trial.trial_id, block: trial.block, trial_type: trial.trial_type,
      presentation_code: trial.presentation_code,
      response_time_sec: ((performance.now() - trialStart) / 1000).toFixed(3), completed_at_utc: new Date().toISOString(),
      attribute_ab_rating: checked("attributeRating"),
      perceived_strength_preference: checked("strengthPreference"),
      temporal_appropriateness_preference: checked("temporalPreference"),
      naturalness_preference: checked("naturalnessPreference"),
      reference_ended: Boolean(ended.reference), audio_a_ended: Boolean(ended.a), audio_b_ended: Boolean(ended.b),
      reference_play_count: playCounts.reference || 0, audio_a_play_count: playCounts.a || 0, audio_b_play_count: playCounts.b || 0,
    });
  }
  function renderTransition(nextBlock) {
    const copy = data.transitions[nextBlock];
    byId("transitionEyebrow").textContent = `${nextBlock} 블록`;
    byId("transitionTitle").textContent = copy.title;
    byId("transitionCopy").textContent = copy.copy;
    showView("transitionView");
  }

  byId("introConfirmed").addEventListener("change", (event) => { byId("introContinueButton").disabled = !event.target.checked; });
  byId("introContinueButton").addEventListener("click", () => showView("setupView"));
  byId("transitionButton").addEventListener("click", () => { showView("trialView"); renderTrial(); });
  byId("startButton").addEventListener("click", () => {
    const participantId = byId("participantId").value.trim();
    if (!participantId || !byId("consent").checked) {
      byId("setupError").textContent = "참가자 ID와 연구 참여 동의를 확인해 주세요.";
      return;
    }
    const layout = hashParticipantId(participantId) % 2;
    session = { participantId, experience: byId("experience").value, deviceType: byId("deviceType").value,
      layout, trials: buildPresentationTrials(participantId) };
    trialIndex = 0; showView("trialView"); renderTrial();
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
    if (nextBlock !== previousBlock) renderTransition(nextBlock); else renderTrial();
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
    link.click(); URL.revokeObjectURL(url);
    byId("downloadStatus").textContent = "응답 파일을 저장했습니다. 연구자에게 전달해 주세요.";
  });
})();
