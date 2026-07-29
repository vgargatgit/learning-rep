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
    return `<section id="home" class="hero"><div class="eyebrow">An illustrated companion to the 1986 paper</div><h1>Learning representations, from features to gradients.</h1><p class="lead">Start with how one real-world example becomes numbers. Then build an exact mental model of the forward pass, loss, chain rule, reverse gradient flow, parameter updates, and the internal representations that emerge from training.</p><div class="pills"><span>Features first</span><span>Cartoon memory aids</span><span>Plain Python + PyTorch</span><span>Interactive gradient lab</span></div></section>`;
  }

  function dataVisual() {
    return `<div class="data-story" aria-label="A house becomes a feature vector and target"><div class="story-flow"><div class="story-card"><span class="icon">🏠</span><strong>One example</strong><small>A single house presented to the model.</small></div><span class="arrow">→</span><div class="story-card"><strong>Three features</strong><div class="feature-stack"><div class="feature-chip"><b>x₁</b><span>120 m² floor area</span></div><div class="feature-chip"><b>x₂</b><span>3 bedrooms</span></div><div class="feature-chip"><b>x₃</b><span>18 years old</span></div></div></div><span class="arrow">→</span><div class="story-card"><strong>Input and target</strong><span class="vector">x = [120, 3, 18]</span><span class="target-badge">y = 1</span><small>1 means “needs renovation”.</small></div></div><div class="definition-grid"><div class="definition"><b>Feature</b><span>One numerical property, such as floor area.</span></div><div class="definition"><b>Feature vector</b><span>The ordered collection of features for one example.</span></div><div class="definition"><b>Representation</b><span>The complete numerical encoding at a particular model stage.</span></div></div></div>`;
  }

  async function render() {
    main.innerHTML=hero();
    nav.innerHTML='<a href="#home"><span class="n">⌂</span>Start here</a>';
    for(let i=0;i<chapters.length;i++) {
      const chapter=chapters[i];
      const response=await fetch(chapter.lesson,{cache:"no-cache"});
      const text=response.ok?await response.text():"## Lesson text unavailable\nThe Markdown source could not be loaded.";
      nav.insertAdjacentHTML("beforeend",`<a href="#${chapter.id}"><span class="n">${i+1}</span>${chapter.title}</a>`);
      const visual=chapter.visual==="data"?dataVisual():(chapter.image?`<img src="${chapter.image}" alt="Illustrated ${chapter.title}">`:"");
      main.insertAdjacentHTML("beforeend",`<article id="${chapter.id}" class="chapter"><div class="heading"><span class="num">${i+1}</span><div><span class="kicker">${chapter.kicker}</span><h2>${chapter.title}</h2><p class="summary">${chapter.summary}</p></div></div>${visual}<div class="copy">${md(text)}</div><div class="takeaways">${chapter.takes.map(x=>`<div>${x}</div>`).join("")}</div></article>`);
    }
    main.insertAdjacentHTML("beforeend",lab());
    wireLab();
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
