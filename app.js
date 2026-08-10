(() => {
  "use strict";

  const data = window.STUDY_DATA;
  const byId = (id) => document.getElementById(id);
  const setupView = byId("setupView");
  const trialView = byId("trialView");
  const completeView = byId("completeView");
  const slotSelect = byId("slotSelect");
  const nextButton = byId("nextButton");
  const audios = [byId("audioA"), byId("audioB"), byId("referenceAudio"), byId("candidateAudio")];

  let session = null;
  let trialIndex = 0;
  let trialStart = 0;
  let ended = {};
  let playCounts = {};
  const responses = [];

  if (data.attribution) {
    const attribution = byId("attributionFooter");
    attribution.textContent = data.attribution;
    attribution.classList.remove("hidden");
  }

  const scale = (containerId, name, left, right) => {
    const container = byId(containerId);
    container.innerHTML = "";
    for (let value = 1; value <= 5; value += 1) {
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.type = "radio";
      input.name = name;
      input.value = String(value);
      input.addEventListener("change", updateNextState);
      label.append(input, document.createTextNode(String(value)));
      label.title = value === 1 ? left : value === 5 ? right : "";
      container.append(label);
    }
  };

  scale("confidenceScale", "confidence", "확신 없음", "매우 확신");
  scale("naturalnessScale", "naturalness", "매우 부자연스러움", "매우 자연스러움");
  scale("clarityScale", "clarity", "매우 불명료함", "매우 명료함");
  scale("similarityScale", "similarity", "전혀 다름", "매우 유사함");

  Object.keys(data.assignments).sort((first, second) => Number(first) - Number(second)).forEach((slot) => {
    const option = document.createElement("option");
    option.value = slot;
    option.textContent = slot;
    slotSelect.append(option);
  });

  const stopOtherAudio = (active) => {
    audios.forEach((audio) => {
      if (audio !== active) audio.pause();
    });
  };

  const registerAudio = (audio, key, stateId) => {
    audio.onplay = () => {
      stopOtherAudio(audio);
      playCounts[key] = (playCounts[key] || 0) + 1;
    };
    audio.onended = () => {
      ended[key] = true;
      const state = byId(stateId);
      state.textContent = "재생 완료";
      state.classList.add("complete");
      updateNextState();
    };
  };

  registerAudio(byId("audioA"), "a", "endedA");
  registerAudio(byId("audioB"), "b", "endedB");
  registerAudio(byId("referenceAudio"), "reference", "endedReference");
  registerAudio(byId("candidateAudio"), "candidate", "endedCandidate");

  document.querySelectorAll('input[name="directionChoice"]').forEach((input) => {
    input.addEventListener("change", updateNextState);
  });

  function checked(name) {
    const input = document.querySelector(`input[name="${name}"]:checked`);
    return input ? input.value : "";
  }

  function clearRadios() {
    document.querySelectorAll('#trialView input[type="radio"]').forEach((input) => {
      input.checked = false;
    });
  }

  function updateNextState() {
    if (!session) return;
    const trial = session.trials[trialIndex];
    if (trial.trial_type === "direction") {
      nextButton.disabled = !(ended.a && ended.b && checked("directionChoice") && checked("confidence"));
    } else {
      nextButton.disabled = !(
        ended.reference && ended.candidate && checked("naturalness") && checked("clarity") && checked("similarity")
      );
    }
  }

  function setAudio(audio, path) {
    audio.pause();
    audio.src = path;
    audio.load();
  }

  function renderTrial() {
    const trial = session.trials[trialIndex];
    clearRadios();
    ended = {};
    playCounts = {};
    ["endedA", "endedB", "endedReference", "endedCandidate"].forEach((id) => {
      const state = byId(id);
      state.textContent = "끝까지 재생해 주세요";
      state.classList.remove("complete");
    });
    nextButton.disabled = true;
    byId("progressText").textContent = `${trialIndex + 1} / ${session.trials.length}`;
    byId("progressBar").style.width = `${100 * trialIndex / session.trials.length}%`;
    const direction = trial.trial_type === "direction";
    byId("directionPanel").classList.toggle("hidden", !direction);
    byId("qualityPanel").classList.toggle("hidden", direction);
    byId("trialBadge").textContent = direction ? "방향 판단" : "품질 평가";
    byId("trialPrompt").textContent = direction ? trial.prompt : "평가 보컬을 듣고 세 항목을 판단해 주세요.";
    if (direction) {
      setAudio(byId("audioA"), trial.audio_a);
      setAudio(byId("audioB"), trial.audio_b);
    } else {
      setAudio(byId("referenceAudio"), trial.reference_audio);
      setAudio(byId("candidateAudio"), trial.candidate_audio);
    }
    trialStart = performance.now();
  }

  function saveResponse() {
    const trial = session.trials[trialIndex];
    const base = {
      study_version: data.study_version,
      participant_id: session.participantId,
      slot: session.slot,
      experience: session.experience,
      device_type: session.deviceType,
      trial_index: trialIndex + 1,
      trial_id: trial.trial_id,
      trial_type: trial.trial_type,
      response_time_sec: ((performance.now() - trialStart) / 1000).toFixed(3),
      completed_at_utc: new Date().toISOString(),
    };
    if (trial.trial_type === "direction") {
      responses.push({
        ...base,
        response_choice: checked("directionChoice"),
        confidence: checked("confidence"),
        naturalness: "",
        lyric_clarity: "",
        singer_similarity: "",
        audio_a_ended: String(Boolean(ended.a)),
        audio_b_ended: String(Boolean(ended.b)),
        reference_ended: "",
        candidate_ended: "",
        audio_a_play_count: playCounts.a || 0,
        audio_b_play_count: playCounts.b || 0,
        reference_play_count: "",
        candidate_play_count: "",
      });
    } else {
      responses.push({
        ...base,
        response_choice: "",
        confidence: "",
        naturalness: checked("naturalness"),
        lyric_clarity: checked("clarity"),
        singer_similarity: checked("similarity"),
        audio_a_ended: "",
        audio_b_ended: "",
        reference_ended: String(Boolean(ended.reference)),
        candidate_ended: String(Boolean(ended.candidate)),
        audio_a_play_count: "",
        audio_b_play_count: "",
        reference_play_count: playCounts.reference || 0,
        candidate_play_count: playCounts.candidate || 0,
      });
    }
    localStorage.setItem(`seedvc-study-${session.participantId}-${session.slot}`, JSON.stringify(responses));
  }

  byId("startButton").addEventListener("click", () => {
    const participantId = byId("participantId").value.trim();
    if (!participantId || !byId("consent").checked) {
      alert("참가자 ID와 동의 항목을 확인해 주세요.");
      return;
    }
    const slot = slotSelect.value;
    session = {
      participantId,
      slot,
      experience: byId("experience").value,
      deviceType: byId("deviceType").value,
      trials: data.assignments[slot].trials,
    };
    setupView.classList.add("hidden");
    trialView.classList.remove("hidden");
    renderTrial();
  });

  nextButton.addEventListener("click", () => {
    saveResponse();
    trialIndex += 1;
    if (trialIndex >= session.trials.length) {
      trialView.classList.add("hidden");
      completeView.classList.remove("hidden");
      byId("progressText").textContent = "완료";
      byId("progressBar").style.width = "100%";
      return;
    }
    renderTrial();
  });

  function csvEscape(value) {
    const text = String(value ?? "");
    return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
  }

  byId("downloadButton").addEventListener("click", () => {
    const columns = Object.keys(responses[0]);
    const lines = [columns.join(","), ...responses.map((row) => columns.map((column) => csvEscape(row[column])).join(","))];
    const blob = new Blob(["\ufeff" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `human_eval_${session.participantId}_${session.slot}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    byId("downloadStatus").textContent = "응답 CSV가 내려받아졌습니다.";
  });
})();
