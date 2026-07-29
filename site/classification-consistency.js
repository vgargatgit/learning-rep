"use strict";

(() => {
  const $ = id => document.getElementById(id);
  const sigmoid = value => 1 / (1 + Math.exp(-value));
  const clampProbability = value => Math.min(Math.max(value, 1e-12), 1 - 1e-12);
  const binaryCrossEntropy = (probability, target) => {
    const p = clampProbability(probability);
    return -(target * Math.log(p) + (1 - target) * Math.log(1 - p));
  };

  function replaceTakeaways(chapter, items) {
    const container = chapter.querySelector(".takeaways");
    if (!container) return;
    container.innerHTML = items.map(item => `<div>${item}</div>`).join("");
  }

  function patchLossLesson() {
    const chapter = $("loss");
    if (!chapter || chapter.dataset.classificationPatched) return;
    chapter.dataset.classificationPatched = "true";

    chapter.querySelector(":scope > img")?.remove();
    chapter.querySelector("h2").textContent = "Binary classification loss";
    chapter.querySelector(".summary").textContent =
      "Measure how well the predicted class-1 probability matches a binary target using binary cross-entropy.";

    const visual = document.createElement("div");
    visual.className = "data-story";
    visual.setAttribute("aria-label", "Binary classification probability and loss");
    visual.innerHTML = `
      <div class="story-flow">
        <div class="story-card"><strong>Logit</strong><span class="vector">z = 2.20</span><small>An unrestricted classifier score.</small></div>
        <span class="arrow">→</span>
        <div class="story-card"><strong>Class-1 probability</strong><span class="vector">p = 0.90025</span><small>With threshold 0.5, the predicted class is 1.</small></div>
        <span class="arrow">→</span>
        <div class="story-card"><strong>Binary cross-entropy</strong><span class="vector">L = 0.10508</span><small>Target y = 1. Lower is better.</small></div>
      </div>
      <div class="definition-grid">
        <div class="definition"><b>Target</b><span>y is either 0 or 1.</span></div>
        <div class="definition"><b>Probability</b><span>p estimates class 1.</span></div>
        <div class="definition"><b>Output delta</b><span>For sigmoid + BCE: dL/dz = p - y.</span></div>
      </div>`;
    chapter.querySelector(".heading").after(visual);

    replaceTakeaways(chapter, [
      "The logit, probability, predicted class, and BCE loss are distinct quantities.",
      "For sigmoid plus binary cross-entropy, the output delta simplifies to p − y."
    ]);
  }

  function patchChainRuleLesson() {
    const chapter = $("chain-rule");
    if (!chapter || chapter.dataset.classificationPatched) return;
    chapter.dataset.classificationPatched = "true";

    chapter.querySelector(":scope > img")?.remove();
    chapter.querySelector("h2").textContent = "Classification gradients and the chain rule";
    chapter.querySelector(".summary").textContent =
      "Follow binary cross-entropy backward through sigmoid and every dense connection.";

    const visual = document.createElement("div");
    visual.className = "representation-story";
    visual.setAttribute("aria-label", "Dense layer connectivity and representation dimensions");
    visual.innerHTML = `
      <div class="transform-flow">
        <div class="representation-box"><span class="box-label">Previous representation</span><strong>a ∈ Rⁿ</strong><small>All n coordinates are available.</small></div>
        <span class="arrow">→</span>
        <div class="layer-box"><span class="box-label">Dense layer: m neurons</span><div class="unit-card"><b>1</b><code>receives a₁ … aₙ</code></div><div class="unit-card"><b>m</b><code>receives a₁ … aₙ</code></div></div>
        <span class="arrow">→</span>
        <div class="representation-box"><span class="box-label">Layer output</span><strong>h ∈ Rᵐ</strong><small>One activation per neuron.</small></div>
      </div>
      <div class="definition-grid">
        <div class="definition"><b>Weight matrix</b><span>W has shape (m, n).</span></div>
        <div class="definition"><b>Full connectivity</b><span>Every dense neuron receives all n previous coordinates.</span></div>
        <div class="definition"><b>Output dimension</b><span>m neurons produce m representation coordinates.</span></div>
      </div>`;
    chapter.querySelector(".heading").after(visual);

    replaceTakeaways(chapter, [
      "Sigmoid plus binary cross-entropy gives the compact output delta p − y.",
      "A dense layer with m neurons emits an m-dimensional representation."
    ]);
  }

  function patchPart3DenseRule() {
    const chapter = $("training-reshapes-space");
    const story = chapter?.querySelector(".learning-story");
    if (!story || story.querySelector(".dense-rule-reminder")) return;

    const reminder = document.createElement("div");
    reminder.className = "definition-grid four dense-rule-reminder";
    reminder.innerHTML = `
      <div class="definition"><b>Binary classification</b><span>One logit, sigmoid probability, target 0/1, and BCE loss.</span></div>
      <div class="definition"><b>Every neuron sees all</b><span>Each dense neuron receives the complete previous representation.</span></div>
      <div class="definition"><b>Layer dimension</b><span>m neurons emit an m-dimensional representation.</span></div>
      <div class="definition"><b>Output classifier</b><span>Its one neuron receives all hidden coordinates and draws the line.</span></div>`;
    story.prepend(reminder);
  }

  function patchClassificationLab() {
    const lab = $("toy-lab");
    if (!lab || lab.dataset.classificationPatched) return;
    lab.dataset.classificationPatched = "true";

    const fields = {
      x1: "Input x₁", x2: "Input x₂", w1: "Weight w₁", w2: "Weight w₂",
      bias: "Bias b", target: "Binary target y", rate: "Learning rate η"
    };

    lab.innerHTML = `
      <div class="eyebrow">Binary classification</div>
      <h2>Toy classification backpropagation lab</h2>
      <p class="summary">Change the values and observe the class-1 probability, binary cross-entropy gradients, and one update.</p>
      <div class="labgrid">
        <div class="controls">${Object.entries(fields).map(([key, label]) => `<label>${label}<input id="v-${key}" type="number" step="0.01"></label>`).join("")}</div>
        <div class="results">${[
          ["z", "Classification logit z"], ["pred", "Class-1 probability p"],
          ["loss", "BCE loss L"], ["g1", "dL/dw₁"], ["g2", "dL/dw₂"],
          ["gb", "dL/db"], ["newLoss", "BCE after update"]
        ].map(([key, label]) => `<div class="row"><span>${label}</span><strong id="r-${key}">—</strong></div>`).join("")}</div>
      </div>
      <div id="eq" class="equation"></div>`;

    const defaults = {x1:1, x2:2, w1:.3, w2:.7, bias:.5, target:1, rate:.1};
    for (const [key, value] of Object.entries(defaults)) $("v-" + key).value = value;

    const calculate = () => {
      const value = key => Number($("v-" + key).value);
      const x1=value("x1"), x2=value("x2"), w1=value("w1"), w2=value("w2");
      const bias=value("bias"), target=value("target"), rate=value("rate");
      const z=w1*x1+w2*x2+bias, probability=sigmoid(z), loss=binaryCrossEntropy(probability,target);
      const delta=probability-target, g1=delta*x1, g2=delta*x2, gb=delta;
      const nextProbability=sigmoid((w1-rate*g1)*x1+(w2-rate*g2)*x2+(bias-rate*gb));
      const nextLoss=binaryCrossEntropy(nextProbability,target);
      const values={z,pred:probability,loss,g1,g2,gb,newLoss:nextLoss};
      for (const [key, result] of Object.entries(values)) $("r-" + key).textContent=result.toFixed(8);
      $("eq").textContent=`z = ${z.toFixed(5)} → p(class 1) = ${probability.toFixed(8)} → BCE = ${loss.toFixed(8)}`;
    };

    lab.querySelectorAll(".controls input").forEach(input => input.addEventListener("input", calculate));
    calculate();
  }

  function patch() {
    patchLossLesson();
    patchChainRuleLesson();
    patchPart3DenseRule();
    patchClassificationLab();
  }

  new MutationObserver(patch).observe(document.body, {childList:true, subtree:true});
  patch();
})();
