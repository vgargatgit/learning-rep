"use strict";
(() => {
  const C = {
    hash:"SHA-256",
    iterations:1200000,
    salt:"PuFKJcg5B6IFHZd9eqEKs1AAB0yGXLC0KQkvTUlfdWE=",
    verifier:"7F/CURC/Ommq1ugtkSfgGjCeWifK3JFQWtV3zwiS/vg="
  };

  const chapters = [
    {
      id:"data-becomes-numbers",
      kicker:"Part 1 · Foundations",
      title:"Data becomes numbers",
      summary:"Begin with an example, identify its features, assemble a feature vector, and keep the input separate from the target.",
      lesson:"../lessons/00-data-becomes-numbers.md",
      visual:"data",
      takes:[
        "A feature is one coordinate; a representation is the complete vector at a stage.",
        "The target is what the model learns to predict, not another input feature."
      ]
    },
    {
      id:"transform-representations",
      kicker:"Part 2 · Representations",
      title:"Networks transform representations",
      summary:"See how neurons combine input features, hidden layers create new feature vectors, and a task-useful feature space can simplify prediction.",
      lesson:"../lessons/00b-networks-transform-representations.md",
      visual:"representation",
      takes:[
        "Each hidden activation is one learned feature; the full activation vector is the hidden representation.",
        "A useful representation makes the task easier for later layers, but usefulness depends on the task."
      ]
    },
    {
      id:"big-idea", kicker:"The problem", title:"The big idea",
      summary:"Why hidden units need a learning signal and how reverse differentiation supplies it.",
      lesson:"../lessons/01-big-idea.md", image:"../assets/drafts/page-01-overview.png",
      takes:["Separate prediction, loss, gradient computation, and optimisation.","Backpropagation propagates derivatives—not the raw loss value."]
    },
    {
      id:"forward-pass", kicker:"Compute", title:"Forward pass",
      summary:"Use the current inputs, weights, and bias to compute a prediction.",
      lesson:"../lessons/02-forward-pass.md", image:"../assets/drafts/page-02-forward-pass.png",
      takes:["The pre-activation is the weighted sum plus bias.","No parameter learning happens during the forward pass alone."]
    },
    {
      id:"loss", kicker:"Measure", title:"Prediction error and loss",
      summary:"Turn the prediction-target difference into one scalar objective.",
      lesson:"../lessons/03-loss.md", image:"../assets/drafts/page-03-loss.png",
      takes:["Residual, loss, and gradient are distinct quantities.","The factor one-half makes the derivative cleaner."]
    },
    {
      id:"chain-rule", kicker:"Differentiate", title:"Backpropagation and the chain rule",
      summary:"Follow the dependency graph backwards and combine local derivatives.",
      lesson:"../lessons/04-chain-rule.md", image:"../assets/drafts/page-04-chain-rule.png",
      takes:["Gradients combine local derivatives along dependency paths.","Reverse-mode differentiation reuses forward intermediates."]
    },
    {
      id:"gradient-descent", kicker:"Optimise", title:"Updating the parameters",
      summary:"Use the gradient to take a small loss-reducing step.",
      lesson:"../lessons/05-gradient-descent.md", image:"../assets/drafts/page-05-gradient-descent.png",
      takes:["Backpropagation computes gradients; gradient descent applies them.","The gradient sign describes local change."]
    },
    {
      id:"representations", kicker:"Learn", title:"Internal representations",
      summary:"See how repeated updates shape hidden activations into useful features.",
      lesson:"../lessons/06-representations.md", image:"../assets/drafts/page-06-representations.png",
      takes:["A hidden activation vector is an internal representation.","Human-readable features are examples, not guarantees."]
    }
  ];

  const $ = id => document.getElementById(id);
  const login=$("login"), app=$("app"), form=$("form"), user=$("user"), pass=$("pass"), status=$("status"), submit=$("submit"), main=$("main"), nav=$("nav");
  let failures=0;

  const b64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
  const equal = (a,b) => {
    let d=a.length^b.length, n=Math.max(a.length,b.length);
    for(let i=0;i<n;i++) d|=(a[i]||0)^(b[i]||0);
    return d===0;
  };

  async function verify(u,p) {
    const secret=new TextEncoder().encode(`${u.trim().toLowerCase()}\0${p}`);
    const material=await crypto.subtle.importKey("raw",secret,"PBKDF2",false,["deriveBits"]);
    const bits=await crypto.subtle.deriveBits({name:"PBKDF2",hash:C.hash,salt:b64(C.salt),iterations:C.iterations},material,256);
    return equal(new Uint8Array(bits),b64(C.verifier));
  }

  const esc = s => s.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
  function md(text) {
    let out=[],p=[],list=[],code=[],quote=[],inside=false;
    const inline=s=>esc(s).replace(/`([^`]+)`/g,"<code>$1</code>").replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>");
    const flushP=()=>{if(p.length){out.push(`<p>${inline(p.join(" "))}</p>`);p=[];}};
    const flushList=()=>{if(list.length){out.push(`<ul>${list.map(x=>`<li>${inline(x)}</li>`).join("")}</ul>`);list=[];}};
    const flushQuote=()=>{if(quote.length){out.push(`<blockquote>${inline(quote.join(" "))}</blockquote>`);quote=[];}};
    for(const line of text.split(/\r?\n/)) {
      if(line.startsWith("```")) {
        if(inside){out.push(`<pre><code>${esc(code.join("\n"))}</code></pre>`);code=[];}
        else {flushP();flushList();flushQuote();}
        inside=!inside; continue;
      }
      if(inside){code.push(line);continue;}
      if(!line.trim()){flushP();flushList();flushQuote();continue;}
      if(line.startsWith("# ")) continue;
      if(line.startsWith("## ")||line.startsWith("### ")){
        flushP();flushList();flushQuote();out.push(`<h3>${inline(line.replace(/^#+\s/,""))}</h3>`);
      } else if(line.startsWith("- ")) {
        flushP();flushQuote();list.push(line.slice(2));
      } else if(line.startsWith("> ")) {
        flushP();flushList();quote.push(line.slice(2));
      } else p.push(line.trim());
    }
    flushP();flushList();flushQuote();
    return out.join("");
  }

  function hero() {
    return `<section id="home" class="hero"><div class="eyebrow">An illustrated companion to the 1986 paper</div><h1>Learning representations, from features to gradients.</h1><p class="lead">Start with how one real-world example becomes numbers. Then see how a hidden layer redraws those numbers into a new feature space before learning how gradients shape that transformation.</p><div class="pills"><span>Features first</span><span>Representation explorer</span><span>Plain Python + PyTorch</span><span>Interactive gradient lab</span></div></section>`;
  }

  function dataVisual() {
    return `<div class="data-story" aria-label="A house becomes a feature vector and target"><div class="story-flow"><div class="story-card"><span class="icon">🏠</span><strong>One example</strong><small>A single house presented to the model.</small></div><span class="arrow">→</span><div class="story-card"><strong>Three features</strong><div class="feature-stack"><div class="feature-chip"><b>x₁</b><span>120 m² floor area</span></div><div class="feature-chip"><b>x₂</b><span>3 bedrooms</span></div><div class="feature-chip"><b>x₃</b><span>18 years old</span></div></div></div><span class="arrow">→</span><div class="story-card"><strong>Input and target</strong><span class="vector">x = [120, 3, 18]</span><span class="target-badge">y = 1</span><small>1 means “needs renovation”.</small></div></div><div class="definition-grid"><div class="definition"><b>Feature</b><span>One numerical property, such as floor area.</span></div><div class="definition"><b>Feature vector</b><span>The ordered collection of features for one example.</span></div><div class="definition"><b>Representation</b><span>The complete numerical encoding at a particular model stage.</span></div></div></div>`;
  }

  function plotPoint(kind,position,label) {
    return `<span class="plot-point ${kind} ${position}" aria-label="class ${label}">${label}</span>`;
  }

  function representationVisual() {
    return `<div class="representation-story" aria-label="An input representation transformed into a hidden representation">
      <div class="transform-flow">
        <div class="representation-box input-box"><span class="box-label">Input representation</span><strong>x = [x₁, x₂]</strong><small>Coordinates are input features.</small></div>
        <span class="arrow">→</span>
        <div class="layer-box"><span class="box-label">Two hidden units</span><div class="unit-card"><b>h₁</b><code>σ(0.50x₁ − 0.25x₂ + 0.10)</code></div><div class="unit-card"><b>h₂</b><code>σ(0.25x₁ + 0.50x₂ − 0.20)</code></div></div>
        <span class="arrow">→</span>
        <div class="representation-box hidden-box"><span class="box-label">Hidden representation</span><strong id="rep-vector">h = [0.52498, 0.74077]</strong><small>Coordinates are hidden activations.</small></div>
      </div>

      <div class="rep-lab">
        <div><span class="kicker">Interactive forward transformation</span><h3>Move the input; watch the representation move</h3><p>The weights stay fixed. Changing the input changes both hidden coordinates.</p></div>
        <div class="rep-controls"><label>Input x₁<input id="rep-x1" type="number" step="0.1" value="1"></label><label>Input x₂<input id="rep-x2" type="number" step="0.1" value="2"></label></div>
        <div class="rep-results"><div><span>z₁</span><strong id="rep-z1">0.100000</strong></div><div><span>h₁ = σ(z₁)</span><strong id="rep-h1">0.524979</strong></div><div><span>z₂</span><strong id="rep-z2">1.050000</strong></div><div><span>h₂ = σ(z₂)</span><strong id="rep-h2">0.740775</strong></div></div>
      </div>

      <div class="space-comparison">
        <div class="space-panel"><span class="box-label">Input feature space</span><h3>Classes can be tangled</h3><div class="mini-plot"><span class="axis axis-x">x₁</span><span class="axis axis-y">x₂</span>${plotPoint("zero","point-lb","0")}${plotPoint("one","point-lt","1")}${plotPoint("one","point-rb","1")}${plotPoint("zero","point-rt","0")}</div><small>No single straight boundary separates this XOR-like arrangement.</small></div>
        <span class="space-arrow">representation<br>transformation →</span>
        <div class="space-panel"><span class="box-label">Hidden feature space</span><h3>The same classes can become simpler</h3><div class="mini-plot"><span class="axis axis-x">h₁</span><span class="axis axis-y">h₂</span><span class="decision-boundary"></span>${plotPoint("zero","point-hl1","0")}${plotPoint("zero","point-hl2","0")}${plotPoint("one","point-hr1","1")}${plotPoint("one","point-hr2","1")}</div><small>A later output unit can now use a simple boundary.</small></div>
      </div>
      <p class="visual-note">The calculator above uses the displayed fixed weights and exact sigmoid values. The class-separation sketch is conceptual: training must learn a useful transformation rather than receiving it in advance.</p>
      <div class="definition-grid four"><div class="definition"><b>Hidden unit</b><span>One neuron that computes one new coordinate.</span></div><div class="definition"><b>Hidden feature</b><span>One activation such as h₁.</span></div><div class="definition"><b>Hidden representation</b><span>The complete activation vector h.</span></div><div class="definition"><b>Feature space</b><span>The coordinate system in which examples are located.</span></div></div>
    </div>`;
  }

  async function render() {
    main.innerHTML=hero();
    nav.innerHTML='<a href="#home"><span class="n">⌂</span>Start here</a>';
    for(let i=0;i<chapters.length;i++) {
      const chapter=chapters[i];
      const response=await fetch(chapter.lesson,{cache:"no-cache"});
      const text=response.ok?await response.text():"## Lesson text unavailable\nThe Markdown source could not be loaded.";
      nav.insertAdjacentHTML("beforeend",`<a href="#${chapter.id}"><span class="n">${i+1}</span>${chapter.title}</a>`);
      const visual=chapter.visual==="data"?dataVisual():chapter.visual==="representation"?representationVisual():(chapter.image?`<img src="${chapter.image}" alt="Illustrated ${chapter.title}">`:"");
      main.insertAdjacentHTML("beforeend",`<article id="${chapter.id}" class="chapter"><div class="heading"><span class="num">${i+1}</span><div><span class="kicker">${chapter.kicker}</span><h2>${chapter.title}</h2><p class="summary">${chapter.summary}</p></div></div>${visual}<div class="copy">${md(text)}</div><div class="takeaways">${chapter.takes.map(x=>`<div>${x}</div>`).join("")}</div></article>`);
    }
    wireRepresentationLab();
    main.insertAdjacentHTML("beforeend",lab());
    wireLab();
  }

  function wireRepresentationLab() {
    const x1Input=$("rep-x1"), x2Input=$("rep-x2");
    if(!x1Input||!x2Input) return;
    const sigmoid=value=>1/(1+Math.exp(-value));
    const calculate=()=>{
      const x1=Number(x1Input.value), x2=Number(x2Input.value);
      const z1=.50*x1-.25*x2+.10, z2=.25*x1+.50*x2-.20;
      const h1=sigmoid(z1), h2=sigmoid(z2);
      $("rep-z1").textContent=z1.toFixed(6);
      $("rep-h1").textContent=h1.toFixed(6);
      $("rep-z2").textContent=z2.toFixed(6);
      $("rep-h2").textContent=h2.toFixed(6);
      $("rep-vector").textContent=`h = [${h1.toFixed(5)}, ${h2.toFixed(5)}]`;
    };
    [x1Input,x2Input].forEach(input=>input.addEventListener("input",calculate));
    calculate();
  }

  function lab() {
    const names={x1:"Input x₁",x2:"Input x₂",w1:"Weight w₁",w2:"Weight w₂",bias:"Bias b",target:"Target y",rate:"Learning rate η"};
    return `<section id="toy-lab" class="lab"><div class="eyebrow">Executable intuition</div><h2>Toy backpropagation lab</h2><p class="summary">Change the values and observe the forward pass, gradients, and one update.</p><div class="labgrid"><div class="controls">${Object.entries(names).map(([k,v])=>`<label>${v}<input id="v-${k}" type="number" step="0.01"></label>`).join("")}</div><div class="results">${[["z","Pre-activation z"],["pred","Prediction ŷ"],["loss","Loss L"],["g1","∂L/∂w₁"],["g2","∂L/∂w₂"],["gb","∂L/∂b"],["newLoss","Loss after update"]].map(([k,v])=>`<div class="row"><span>${v}</span><strong id="r-${k}">—</strong></div>`).join("")}</div></div><div id="eq" class="equation"></div></section>`;
  }

  function wireLab() {
    const defaults={x1:1,x2:2,w1:.3,w2:.7,bias:.5,target:1,rate:.1};
    for(const[k,v]of Object.entries(defaults)) $("v-"+k).value=v;
    const calc=()=>{
      const v=k=>Number($("v-"+k).value), x1=v("x1"), x2=v("x2"), w1=v("w1"), w2=v("w2"), b=v("bias"), y=v("target"), eta=v("rate");
      const sig=z=>1/(1+Math.exp(-z));
      const z=w1*x1+w2*x2+b, p=sig(z), residual=p-y, loss=.5*residual**2, common=residual*p*(1-p), g1=common*x1, g2=common*x2, gb=common;
      const nextPrediction=sig((w1-eta*g1)*x1+(w2-eta*g2)*x2+(b-eta*gb));
      const newLoss=.5*(nextPrediction-y)**2;
      const values={z,pred:p,loss,g1,g2,gb,newLoss};
      for(const[k,val]of Object.entries(values)) $("r-"+k).textContent=val.toFixed(8);
      $("eq").textContent=`z = ${w1}×${x1} + ${w2}×${x2} + ${b} = ${z.toFixed(5)} → ŷ = ${p.toFixed(8)} → L = ${loss.toFixed(8)}`;
    };
    document.querySelectorAll(".controls input").forEach(x=>x.addEventListener("input",calc));
    calc();
  }

  async function open() {
    login.hidden=true; app.hidden=false; await render(); location.hash=location.hash||"#home";
  }

  form.addEventListener("submit",async event=>{
    event.preventDefault();
    if(!user.value||!pass.value){status.textContent="Enter both the username and password.";return;}
    submit.disabled=true; status.textContent="Verifying credentials…";
    try {
      if(await verify(user.value,pass.value)){
        failures=0; sessionStorage.setItem("backprop-auth",Date.now().toString()); pass.value=""; await open();
      } else {
        failures++;
        await new Promise(resolve=>setTimeout(resolve,Math.min(5000,500*2**Math.min(failures,4))));
        status.textContent="The username or password is incorrect."; pass.value="";
      }
    } catch(error) {
      console.error(error); status.textContent="The guide could not be opened.";
    } finally { submit.disabled=false; }
  });

  $("toggle").addEventListener("click",()=>{const show=pass.type==="password";pass.type=show?"text":"password";$("toggle").textContent=show?"Hide":"Show";});
  $("lock").addEventListener("click",()=>{sessionStorage.removeItem("backprop-auth");location.reload();});
  const saved=Number(sessionStorage.getItem("backprop-auth"));
  if(saved&&Date.now()-saved<8*60*60*1000) open(); else user.focus();
})();
