import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { Leaf, MapPin, Clock3, Sparkles, Footprints, Bird, Sprout, Sun, Copy, Check, Github } from "lucide-react";
import "./style.css";

const activities = [
  { id: "nature walk", label: "Nature walk", icon: Footprints, desc: "Notice small details along the way" },
  { id: "birdwatching", label: "Birdwatching", icon: Bird, desc: "Listen first, then look" },
  { id: "gardening", label: "Gardening", icon: Sprout, desc: "Connect with plants and soil" },
  { id: "mindful outdoors", label: "Mindful outdoors", icon: Sun, desc: "Slow down and use your senses" }
];

function App() {
  const [activity, setActivity] = useState("nature walk");
  const [minutes, setMinutes] = useState(30);
  const [location, setLocation] = useState("a nearby park or green space");
  const [interests, setInterests] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function createPlan() {
    setLoading(true); setError(""); setPlan(""); setCopied(false);
    try {
      const response = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activity, minutes, location, interests })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.details || data.error || "Could not generate a plan.");
      setPlan(data.plan);
    } catch (e) {
      setError(`${e.message} Start the API and Ollama, then try again.`);
    } finally { setLoading(false); }
  }

  async function copyPlan() {
    try {
      await navigator.clipboard.writeText(plan);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch { setError("Clipboard access was blocked. You can select and copy the plan manually."); }
  }

  return <div className="app-shell">
    <header className="topbar">
      <a className="brand" href="#"><span className="brand-icon"><Leaf size={20}/></span><span>trailmate<span className="brand-ai">.ai</span></span></a>
      <span className="open-pill"><span className="dot"/> OPEN-SOURCE AI</span>
    </header>

    <main>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={14}/> YOUR OUTDOOR SIDEKICK</div>
          <h1>Go outside.<br/><em>Get curious.</em></h1>
          <p className="hero-text">A little AI inspiration for a real-world adventure. Make a plan, put your phone away, and see what you notice.</p>
          <div className="hero-note"><Footprints size={17}/><span>Made for the moments between screens.</span></div>
        </div>
        <div className="hero-art" aria-label="Illustration of a sun over green hills">
          <div className="sun-disc"/><div className="hill hill-back"/><div className="hill hill-front"/>
          <div className="trail-line"/><div className="art-label">YOUR NEXT<br/>LITTLE ADVENTURE ↗</div>
          <Leaf className="floating-leaf leaf-one" size={23}/><Leaf className="floating-leaf leaf-two" size={16}/>
        </div>
      </section>

      <section className="builder">
        <div className="section-heading"><div><span className="step-label">01 / SET YOUR INTENTION</span><h2>What feels good today?</h2></div><span className="tiny-spark">✳</span></div>
        <div className="activity-grid">
          {activities.map(item => { const Icon = item.icon; return <button key={item.id} className={`activity-card ${activity === item.id ? "selected" : ""}`} onClick={() => setActivity(item.id)}>
            <span className="activity-icon"><Icon size={21}/></span><span className="activity-label">{item.label}</span><span className="activity-desc">{item.desc}</span>
            <span className="radio-mark">{activity === item.id ? "✓" : ""}</span>
          </button>; })}
        </div>

        <div className="form-grid">
          <label className="field"><span><Clock3 size={15}/> TIME YOU HAVE</span><select value={minutes} onChange={e => setMinutes(Number(e.target.value))}><option value={15}>15 minutes</option><option value={30}>30 minutes</option><option value={45}>45 minutes</option><option value={60}>1 hour</option><option value={90}>90 minutes</option></select></label>
          <label className="field"><span><MapPin size={15}/> WHERE WILL YOU GO?</span><input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. my garden, local park"/></label>
        </div>
        <label className="field interests-field"><span>ANYTHING YOU'RE CURIOUS ABOUT? <small>OPTIONAL</small></span><input value={interests} onChange={e => setInterests(e.target.value)} placeholder="e.g. birdsong, leaf shapes, wildflowers"/></label>
        <button className="generate-button" onClick={createPlan} disabled={loading || !location.trim()}><Sparkles size={18}/>{loading ? "Dreaming up your adventure..." : "Make my outdoor plan"}<span>↗</span></button>
        <p className="model-note">Powered by a local open-weight model via Ollama. Your prompt is sent to your own Ollama instance, not a hosted AI API.</p>
      </section>

      {(plan || error || loading) && <section className="result-section" aria-live="polite">
        <div className="result-top"><div><span className="step-label">02 / TAKE IT OUTSIDE</span><h2>Your little adventure</h2></div>{plan && <button className="copy-button" onClick={copyPlan}>{copied ? <Check size={15}/> : <Copy size={15}/>} {copied ? "Copied" : "Copy plan"}</button>}</div>
        {loading && <div className="loading-card"><div className="loader"/>Your local model is thinking up something good...</div>}
        {error && <div className="error-card"><strong>AI connection issue</strong><p>{error}</p><p className="hint">Quick fix: run <code>ollama pull qwen2.5:3b</code>, then start the API with <code>npm run server</code>.</p></div>}
        {plan && <div className="plan-card"><div className="plan-badge"><Leaf size={16}/> YOUR FIELD NOTES</div><pre>{plan}</pre><div className="takeaway"><span>🌿</span><div><strong>One last thing</strong><p>Once you've read your plan, lock your phone and enjoy being there. Stay on public paths and respect wildlife.</p></div></div></div>}
      </section>}

      <section className="outside-reminder"><div className="reminder-icon"><Sun size={23}/></div><div><span className="step-label">A SMALL REMINDER</span><h3>The best part isn't on this screen.</h3><p>Use the plan as a starting point, not a checklist. Be present, be safe, and leave nature as you found it.</p></div></section>
    </main>
    <footer><a className="brand footer-brand" href="#"><span className="brand-icon"><Leaf size={17}/></span><span>trailmate<span className="brand-ai">.ai</span></span></a><span>Built with open tools. Best enjoyed outdoors.</span><a className="footer-link" href="https://github.com/" target="_blank" rel="noreferrer"><Github size={16}/> Open source</a></footer>
  </div>;
}

createRoot(document.getElementById("root")).render(<App />);
