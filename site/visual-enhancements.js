"use strict";

(() => {
  const SVG_NS = "http://www.w3.org/2000/svg";
  const CLASSIFIER_IMAGE = "../assets/drafts/page-xx-toy-classifier.png";

  const svgNode = (name, attributes = {}, text = "") => {
    const node = document.createElementNS(SVG_NS, name);
    for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, String(value));
    if (text) node.textContent = text;
    return node;
  };

  const previousHeading = element => {
    let cursor = element.previousElementSibling;
    while (cursor) {
      if (/^H[1-4]$/.test(cursor.tagName)) return cursor.textContent.trim();
      cursor = cursor.previousElementSibling;
    }
    return "Concept";
  };

  const looksExecutable = source => {
    const codeSignals = [
      /^\s*(from|import|def|class|for|while|if|with|return|raise|assert)\b/m,
      /\b(torch|nn\.|optimizer\.|loss_function|print\(|\.backward\(|\.zero_grad\(|\.step\()/,
      /^\s*self\.[A-Za-z_]\w*\s*=/m,
      /zip\(|range\(|append\(|tensor\(/
    ];
    return codeSignals.some(pattern => pattern.test(source));
  };

  const splitLongLine = (line, maxLength = 72) => {
    if (line.length <= maxLength) return [line];
    const indent = line.match(/^\s*/)?.[0] || "";
    const words = line.trim().split(/\s+/);
    const output = [];
    let current = indent;
    for (const word of words) {
      if ((current + " " + word).trim().length > maxLength && current.trim()) {
        output.push(current);
        current = indent + "  " + word;
      } else {
        current += (current.trim() ? " " : "") + word;
      }
    }
    if (current.trim()) output.push(current);
    return output;
  };

  const classifyBlock = source => {
    if (/\b(FORWARD|BACKWARD|UPDATE)\b/.test(source) || /→|←|↓/.test(source)) return "flow";
    if (/shape|dimension|coordinates|neurons|representation/i.test(source)) return "shape";
    if (/class 0|class 1|y\s*=\s*0|y\s*=\s*1/i.test(source)) return "classes";
    return "formula";
  };

  const shortLabel = (heading, kind) => {
    if (kind === "flow") return "Process map";
    if (kind === "shape") return "Representation shape";
    if (kind === "classes") return "Binary classes";
    if (/loss/i.test(heading)) return "Classification formula";
    if (/gradient|chain rule|backprop/i.test(heading)) return "Gradient formula";
    return "Visual equation";
  };

  const buildConceptSvg = (source, heading) => {
    const kind = classifyBlock(source);
    const originalLines = source.replace(/\t/g, "    ").split("\n");
    const lines = originalLines.flatMap(line => splitLongLine(line)).filter((line, index, all) => line.trim() || (index > 0 && index < all.length - 1));
    const lineHeight = kind === "flow" ? 31 : 29;
    const topPadding = 76;
    const bottomPadding = 34;
    const height = Math.max(150, topPadding + lines.length * lineHeight + bottomPadding);
    const svg = svgNode("svg", {
      class: `concept-svg concept-svg-${kind}`,
      viewBox: `0 0 920 ${height}`,
      role: "img",
      "aria-label": `${shortLabel(heading, kind)}: ${source.replace(/\s+/g, " ").trim()}`,
      preserveAspectRatio: "xMidYMid meet"
    });

    svg.append(svgNode("rect", {class: "concept-bg", x: 2, y: 2, width: 916, height: height - 4, rx: 24}));
    svg.append(svgNode("rect", {class: "concept-accent", x: 2, y: 2, width: 13, height: height - 4, rx: 7}));
    svg.append(svgNode("text", {class: "concept-label", x: 42, y: 40}, shortLabel(heading, kind)));
    svg.append(svgNode("line", {class: "concept-divider", x1: 42, y1: 55, x2: 878, y2: 55}));

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      const isPhase = /^(FORWARD|BACKWARD|UPDATE)$/.test(trimmed);
      const isArrow = /→|←|↓/.test(line);
      const isResult = /≈|has shape|dimension\s*=|class\s+[01]/i.test(line);
      const className = ["concept-line", isPhase ? "concept-phase" : "", isArrow ? "concept-arrow-line" : "", isResult ? "concept-result" : ""].filter(Boolean).join(" ");
      const x = isPhase ? 58 : 54 + Math.min((line.match(/^\s*/)?.[0].length || 0) * 7, 70);
      const y = topPadding + index * lineHeight;
      svg.append(svgNode("text", {class: className, x, y}, trimmed || " "));
    });

    return svg;
  };

  const convertConceptBlocks = () => {
    document.querySelectorAll(".copy pre:not([data-visualised])").forEach(pre => {
      const code = pre.querySelector("code");
      const source = code?.textContent.trimEnd() || "";
      pre.dataset.visualised = "true";
      if (!source || looksExecutable(source)) {
        pre.classList.add("runnable-code");
        return;
      }

      const figure = document.createElement("figure");
      figure.className = "concept-figure";
      figure.append(buildConceptSvg(source, previousHeading(pre)));
      pre.replaceWith(figure);
    });
  };

  const integrateClassifierImage = () => {
    const chapter = document.getElementById("training-reshapes-space");
    const copy = chapter?.querySelector(".copy");
    if (!copy || copy.querySelector(".classifier-architecture")) return;

    const denseHeading = [...copy.querySelectorAll("h3")].find(heading => /dense-layer connectivity/i.test(heading.textContent));
    if (!denseHeading) return;

    const glossary = document.createElement("section");
    glossary.className = "beginner-glossary";
    glossary.setAttribute("aria-label", "Beginner definitions for hidden units and hidden layers");
    glossary.innerHTML = `
      <div class="beginner-glossary-heading">
        <span class="box-label">Before reading the network</span>
        <h3>What are a hidden unit and a hidden layer?</h3>
        <p>These are ordinary neural-network building blocks. “Hidden” only means they sit between the input and the final output.</p>
      </div>
      <div class="beginner-term-grid">
        <div class="beginner-term"><span class="term-number">1</span><div><strong>Neuron or unit</strong><p>One small computation. It receives values, forms a weighted sum plus a bias, applies an activation function, and emits one number.</p></div></div>
        <div class="beginner-term"><span class="term-number">2</span><div><strong>Hidden unit</strong><p>One neuron inside an internal layer. In a dense layer, it receives the entire representation from the previous layer and emits one activation.</p></div></div>
        <div class="beginner-term"><span class="term-number">3</span><div><strong>Hidden layer</strong><p>A group of hidden units operating at the same stage. Their activations, taken together, are the layer's output representation.</p></div></div>
        <div class="beginner-term"><span class="term-number">4</span><div><strong>Dimension rule</strong><p>If the hidden layer contains m units, it emits m activations. Therefore its output representation has dimension m.</p></div></div>
      </div>`;

    const figure = document.createElement("figure");
    figure.className = "classifier-architecture";

    const image = document.createElement("img");
    image.src = CLASSIFIER_IMAGE;
    image.alt = "Toy 2 to 2 to 1 binary classifier showing two input features fully connected to two hidden units, followed by one output unit.";
    image.loading = "lazy";
    image.decoding = "async";

    const caption = document.createElement("figcaption");
    caption.innerHTML = "<strong>Toy binary classifier.</strong> Each hidden unit receives the complete input representation. Together, the hidden units form the hidden layer and emit the hidden representation used by the output classifier.";

    figure.append(image, caption);
    denseHeading.before(glossary, figure);
  };

  const patch = () => {
    integrateClassifierImage();
    convertConceptBlocks();
  };

  new MutationObserver(patch).observe(document.body, {childList: true, subtree: true});
  patch();
})();
