(() => {
  "use strict";

  const data = window.STUDY_DATA;
  const byId = (id) => document.getElementById(id);
  const introView = byId("introView");
  const setupView = byId("setupView");
  const trialView = byId("trialView");
  const completeView = byId("completeView");
  const slotSelect = byId("slotSelect");
  const nextButton = byId("nextButton");

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

  const allAudios = () => Array.from(document.querySelectorAll("audio"));
  const stopOtherAudio = (active) => {
    allAudios().forEach((audio) => {
      if (audio !== active) audio.pause();
    });
  };

  function makeAudio(src, label) {
    const audio = document.createElement("audio");
    audio.controls = true;
    audio.preload = "metadata";
    audio.src = src;
    audio.setAttribute("aria-label", label);
    audio.addEventListener("play", () => stopOtherAudio(audio));
    return audio;
  }

  function renderTutorial() {
    const tutorial = data.tutorial;
    if (!tutorial) {
      byId("tutorialOverview").closest(".guide-section").classList.add("hidden");
      byId("tutorialAxes").closest(".guide-section").classList.add("hidden");
      return;
    }

    const overview = byId("tutorialOverview");
    tutorial.overview.forEach((entry, index) => {
      const item = document.createElement("article");
      item.className = "tutorial-audio-item";
      const step = document.createElement("span");
      step.className = "step-number";
      step.textContent = String(index + 1);
      const heading = document.createElement("h3");
      heading.textContent = entry.label;
      const description = document.createElement("p");
      description.textContent = entry.description;
      item.append(step, heading, description, makeAudio(entry.audio, entry.label));
      overview.append(item);
    });

    const axes = byId("tutorialAxes");
    tutorial.axis_examples.forEach((entry) => {
      const section = document.createElement("section");
      section.className = "axis-example";
      const heading = document.createElement("h3");
      heading.textContent = entry.title;
      const description = document.createElement("p");
      description.textContent = entry.description;
      const listenFor = document.createElement("p");
      listenFor.className = "listen-for";
      listenFor.textContent = `청취 포인트: ${entry.listen_for}`;
      const pair = document.createElement("div");
      pair.className = "example-pair";
      [
        [entry.low_label, entry.low_audio],
        [entry.high_label, entry.high_audio],
      ].forEach(([labelText, audioPath]) => {
        const item = document.createElement("div");
        item.className = "example-audio";
        const label = document.createElement("strong");
        label.textContent = labelText;
        item.append(label, makeAudio(audioPath, `${entry.title} ${labelText}`));
        pair.append(item);
      });
      section.append(heading, description, listenFor, pair);
      axes.append(section);
    });

    if (tutorial.secondary_axis) {
      byId("secondaryAxisTitle").textContent = tutorial.secondary_axis.title;
      byId("secondaryAxisDescription").textContent = tutorial.secondary_axis.description;
      byId("secondaryAxisSection").classList.remove("hidden");
    }
  }

  renderTutorial();

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

  Object.keys(data.assignments)
    .sort((first, second) => Number(first) - Number(second))
    .forEach((slot) => {
      const option = document.createElement("option");
      option.value = slot;
      option.textContent = slot;
      slotSelect.append(option);
    });

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
    byId("trialBadge").textContent = direction ? "표현 방향 판단" : "음질 평가";
    byId("trialPrompt").textContent = direction ? trial.prompt : "두 음원을 듣고 변환 결과를 평가해 주세요.";
    byId("trialHint").textContent = direction
      ? (trial.hint || "질문의 특징이 더 강하게 들리는 쪽을 선택하세요.")
      : "목표 목소리는 음색 비교용이며, 변환 결과와 멜로디나 가사가 달라도 괜찮습니다.";
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

  byId("introConfirmed").addEventListener("change", (event) => {
    byId("introContinueButton").disabled = !event.target.checked;
  });

  byId("introContinueButton").addEventListener("click", () => {
    allAudios().forEach((audio) => audio.pause());
    introView.classList.add("hidden");
    setupView.classList.remove("hidden");
    byId("progressText").textContent = "참가자 정보";
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

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
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    window.scrollTo({ top: 0, behavior: "smooth" });
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
