(() => {
  "use strict";

  const EXPECTED_STUDY_VERSION = "icassp2027_temporal_support_addendum_v1";
  const data = window.STUDY_DATA;
  const byId = (id) => document.getElementById(id);
  const introView = byId("introView");
  const setupView = byId("setupView");
  const trialView = byId("trialView");
  const completeView = byId("completeView");
  const nextButton = byId("nextButton");
  const slotSelect = byId("slotSelect");

  let session = null;
  let trialIndex = 0;
  let trialStart = 0;
  let ended = { a: false, b: false };
  let playCounts = { a: 0, b: 0 };
  let advancing = false;
  const responses = [];

  function failClosed(message) {
    console.error(message);
    [introView, setupView, trialView, completeView].forEach((view) => view.classList.add("hidden"));
    byId("fatalView").classList.remove("hidden");
  }

  if (!data || data.study_version !== EXPECTED_STUDY_VERSION || data.listener_slots !== 24) {
    failClosed("Study data/version mismatch. Clear the browser cache and reload.");
    return;
  }

  if (data.attribution) {
    byId("attributionFooter").textContent = data.attribution;
    byId("attributionFooter").classList.remove("hidden");
  }

  Object.keys(data.assignments)
    .sort((first, second) => Number(first) - Number(second))
    .forEach((slot) => {
      const option = document.createElement("option");
      option.value = slot;
      option.textContent = slot;
      slotSelect.append(option);
    });

  function stopOtherAudio(active) {
    [byId("audioA"), byId("audioB")].forEach((audio) => {
      if (audio !== active) audio.pause();
    });
  }

  function registerAudio(audio, side, stateId) {
    audio.addEventListener("play", () => {
      stopOtherAudio(audio);
      playCounts[side] += 1;
    });
    audio.addEventListener("ended", () => {
      ended[side] = true;
      const state = byId(stateId);
      state.textContent = "재생 완료";
      state.classList.add("complete");
      updateNextState();
    });
  }

  registerAudio(byId("audioA"), "a", "endedA");
  registerAudio(byId("audioB"), "b", "endedB");

  function checked(name) {
    const input = document.querySelector(`input[name="${name}"]:checked`);
    return input ? input.value : "";
  }

  function updateNextState() {
    if (!session || advancing) return;
    nextButton.disabled = !(ended.a && ended.b && checked("responseChoice") && checked("confidence"));
  }

  document.querySelectorAll('input[name="responseChoice"]').forEach((input) => {
    input.addEventListener("change", updateNextState);
  });

  for (let value = 1; value <= 5; value += 1) {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "confidence";
    input.value = String(value);
    input.addEventListener("change", updateNextState);
    label.append(input, document.createTextNode(String(value)));
    byId("confidenceScale").append(label);
  }

  function setAudio(audio, path) {
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
    audio.src = path;
    audio.load();
  }

  function renderTrial() {
    const trial = session.trials[trialIndex];
    advancing = false;
    ended = { a: false, b: false };
    playCounts = { a: 0, b: 0 };
    document.querySelectorAll('#trialView input[type="radio"]').forEach((input) => {
      input.checked = false;
    });
    ["endedA", "endedB"].forEach((id) => {
      const state = byId(id);
      state.textContent = "끝까지 재생해 주세요";
      state.classList.remove("complete");
    });
    nextButton.disabled = true;
    nextButton.textContent = trialIndex === session.trials.length - 1 ? "평가 완료" : "다음";
    byId("progressText").textContent = `${trialIndex + 1} / ${session.trials.length}`;
    byId("progressBar").style.width = `${100 * trialIndex / session.trials.length}%`;
    byId("trialBadge").textContent = trial.axis_label;
    byId("trialPrompt").textContent = trial.prompt;
    byId("trialHint").textContent = trial.hint;
    setAudio(byId("audioA"), trial.audio_a);
    setAudio(byId("audioB"), trial.audio_b);
    trialStart = performance.now();
  }

  function saveResponse() {
    const trial = session.trials[trialIndex];
    responses.push({
      study_version: data.study_version,
      participant_id: session.participantId,
      slot: session.slot,
      experience: session.experience,
      device_type: session.deviceType,
      consent: "true",
      trial_index: trialIndex + 1,
      trial_id: trial.trial_id,
      axis: trial.axis,
      question_type: trial.question_type,
      response_choice: checked("responseChoice"),
      confidence: checked("confidence"),
      response_time_sec: ((performance.now() - trialStart) / 1000).toFixed(3),
      audio_a_ended: String(ended.a),
      audio_b_ended: String(ended.b),
      audio_a_play_count: playCounts.a,
      audio_b_play_count: playCounts.b,
      completed_at_utc: new Date().toISOString(),
    });
    localStorage.setItem(
      `${data.study_version}:${session.participantId}:${session.slot}`,
      JSON.stringify(responses),
    );
  }

  byId("introConfirmed").addEventListener("change", (event) => {
    byId("introContinueButton").disabled = !event.target.checked;
  });

  byId("introContinueButton").addEventListener("click", () => {
    introView.classList.add("hidden");
    setupView.classList.remove("hidden");
    byId("progressText").textContent = "참가자 정보";
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  byId("startButton").addEventListener("click", () => {
    const participantId = byId("participantId").value.trim();
    const slot = slotSelect.value;
    const trials = data.assignments[slot]?.trials;
    if (!participantId || !byId("consent").checked) {
      byId("setupError").textContent = "참가자 ID와 동의 항목을 확인해 주세요.";
      return;
    }
    if (!trials || trials.length !== 9) {
      failClosed("Invalid assignment slot.");
      return;
    }
    byId("setupError").textContent = "";
    session = {
      participantId,
      slot,
      experience: byId("experience").value,
      deviceType: byId("deviceType").value,
      trials,
    };
    setupView.classList.add("hidden");
    trialView.classList.remove("hidden");
    renderTrial();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  nextButton.addEventListener("click", () => {
    if (advancing || nextButton.disabled) return;
    advancing = true;
    nextButton.disabled = true;
    saveResponse();
    trialIndex += 1;
    if (trialIndex >= session.trials.length) {
      [byId("audioA"), byId("audioB")].forEach((audio) => audio.pause());
      trialView.classList.add("hidden");
      completeView.classList.remove("hidden");
      byId("progressText").textContent = "완료";
      byId("progressBar").style.width = "100%";
      return;
    }
    renderTrial();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  function csvEscape(value) {
    const valueText = String(value ?? "");
    return /[",\n]/.test(valueText) ? `"${valueText.replaceAll('"', '""')}"` : valueText;
  }

  byId("downloadButton").addEventListener("click", () => {
    if (responses.length !== 9) return;
    const columns = Object.keys(responses[0]);
    const lines = [
      columns.join(","),
      ...responses.map((row) => columns.map((column) => csvEscape(row[column])).join(",")),
    ];
    const blob = new Blob(["\ufeff" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `temporal_support_${session.participantId}_${session.slot}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    byId("downloadStatus").textContent = "응답 CSV가 내려받아졌습니다.";
  });
})();
