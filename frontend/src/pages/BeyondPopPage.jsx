import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './BeyondPopPage.css';

export default function BeyondPopPage() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [jumpOverlayActive, setJumpOverlayActive] = useState(false);
  const [jumpInputValue, setJumpInputValue] = useState('');
  
  const TOTAL = 14; // Slides s1 to s14
  
  const touchStartX = useRef(0);
  const jumpInputRef = useRef(null);

  // Sync / Poll iPad Server (optional mock, matching original script)
  useEffect(() => {
    const pollInterval = setInterval(() => {
      fetch('/get_state')
        .then(r => r.json())
        .then(data => {
          if (typeof data.slide === 'number' && data.slide !== current) {
            goTo(data.slide);
          }
          if (typeof data.focus === 'boolean') {
            setFocusMode(data.focus);
          }
        })
        .catch(e => { /* Ignore */ });
    }, 1000);
    return () => clearInterval(pollInterval);
  }, [current]);

  const goTo = (idx) => {
    if (idx < 0 || idx >= TOTAL || idx === current) return;
    
    // Sync slide state with sync server if needed
    fetch('/set_state', {
      method: 'POST',
      body: JSON.stringify({ slide: idx }),
    }).catch(e => {});

    setCurrent(idx);
  };

  const toggleFocusMode = () => {
    const newFocus = !focusMode;
    setFocusMode(newFocus);
    fetch('/set_state', {
      method: 'POST',
      body: JSON.stringify({ focus: newFocus }),
    }).catch(e => {});
  };

  const toggleSpeakerNote = () => {
    setShowNotes(!showNotes);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      
      // If jump overlay is active, handle overlay inputs only
      if (jumpOverlayActive) {
        if (e.key === 'Escape') {
          setJumpOverlayActive(false);
        }
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        goTo(current + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp' || e.key === 'Backspace') {
        e.preventDefault();
        goTo(current - 1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        goTo(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goTo(TOTAL - 1);
      } else if (key === 'n') {
        toggleSpeakerNote();
      } else if (key === 'h') {
        toggleFocusMode();
      } else if (key === 'j') {
        setJumpOverlayActive(true);
      } else if (e.key === 'Escape') {
        setShowNotes(false);
        setJumpOverlayActive(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [current, jumpOverlayActive, focusMode, showNotes]);

  // Touch Swipe navigation
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) {
      if (dx < 0) {
        goTo(current + 1);
      } else {
        goTo(current - 1);
      }
    }
  };

  // Mouse move cursor
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [isCursorBig, setIsCursorBig] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Jump Input Handle
  const handleJumpSubmit = (e) => {
    if (e.key === 'Enter') {
      const num = parseInt(jumpInputValue, 10);
      if (!isNaN(num) && num >= 1 && num <= TOTAL) {
        goTo(num - 1);
      }
      setJumpOverlayActive(false);
    }
  };

  useEffect(() => {
    if (jumpOverlayActive && jumpInputRef.current) {
      jumpInputRef.current.focus();
    }
  }, [jumpOverlayActive]);

  // Adapt cursor color depending on current slide (s2, s5, s6, s8 are light slides in the original code)
  const isLightSlide = [1, 4, 5, 7].includes(current); // 0-indexed equivalents of s2, s5, s6, s8
  const cursorColor = isLightSlide ? 'var(--navy)' : 'var(--teal)';

  // Speaker notes content mapping
  const speakerNotes = [
    "Open by asking how many people feel pressure about what comes after service. Frame the session as practical, not hype: everyone should leave with one useful AI skill and one project they can build within 7 days.",
    "Most graduates enter a job market built for the 2010s, but we are in 2026. Highlight the stark divergence: traditional employment is shrinking, but global opportunities for value-creators are expanding. AI is the equalizer.",
    "Transition from 'AI is a threat' to 'AI is my lever'. The three levels of adoption: Consumer (passive), Builder (creating workflows), and Expert (consulting/integrating). We are aiming for Level 2 and 3 today.",
    "Explain the 'Double Leverage' concept: combining domain expertise (e.g. accounting, design, marketing) with AI prompt engineering and automation. Show how this multiplies output value by 10x.",
    "Walk through the non-technical use case. Highlight that you do NOT need to write code to build digital products or services anymore. Focus on copywriting, local marketing automation, and content creation workflows.",
    "Walk through the technical use case. Focus on rapid prototyping, code assistance (cursor/copilot), and API integration. This is for the CS/Eng graduates wanting to ship software in days, not months.",
    "Walk through the creator/creative use case. Modern design workflows, AI-assisted graphic assets, video editing automation, and digital publishing. Focus on monetizable creative outputs.",
    "Explore global opportunities. Platforms like Upwork, Fiverr, TopTal, and direct cold outreach using AI-optimized pitches. Emphasize that location is no longer a barrier if the value is world-class.",
    "Introduce the 30-Day Plan: Week 1 is for foundation and choosing a niche; Week 2 is for building a portfolio project; Week 3 is for launch and outreach; Week 4 is for optimization and first client acquisition.",
    "Explain Week 1 details: select one AI tool stack, master prompt techniques, and set up your local development or workspace environment. Focus on deep learning and curation.",
    "Explain Week 2 details: build one high-quality, practical proof of concept. If you are creative, design a brand kit; if technical, ship a mini SaaS; if marketer, run an automated funnel case study.",
    "Explain Week 3 details: optimize LinkedIn/X profiles, publish your Week 2 case study publicly, and send 20 AI-assisted high-personalization cold pitches. Focus on outbound volume.",
    "Explain Week 4 details: follow up on pitches, refine your project based on feedback, and set up invoicing/payment gateways (like Stripe or local alternatives). Prepare for onboarding.",
    "Final challenge: Don't let this be another passive lecture. Ask each attendee to write down the ONE project they will start tomorrow morning. Provide resources, links, and contact info. Close strong."
  ];

  return (
    <div 
      className={`bp-body ${focusMode ? 'focus-mode' : ''}`} 
      onTouchStart={handleTouchStart} 
      onTouchEnd={handleTouchEnd}
      style={{ backgroundColor: isLightSlide ? '#F4F3EF' : '#0B0F19', color: isLightSlide ? '#0B0F19' : '#FFFFFF', transition: 'background-color 0.5s ease, color 0.5s ease' }}
    >
      <div 
        id="cursor" 
        className={isCursorBig ? 'big' : ''}
        style={{ left: cursorPos.x, top: cursorPos.y, background: cursorColor }}
      />

      <div id="counter"><span id="cur">{String(current + 1).padStart(2, '0')}</span> / <span id="total">{String(TOTAL).padStart(2, '0')}</span></div>

      {/* Jump Overlay */}
      <div id="jump-overlay" className={jumpOverlayActive ? 'active' : ''}>
        <div className="jump-box">
          <button 
            id="btn-close-jump" 
            aria-label="Close"
            onClick={() => setJumpOverlayActive(false)}
            style={{ position: 'absolute', top: '12px', right: '16px', background: 'none', border: 'none', fontSize: '28px', color: 'var(--muted)', cursor: 'pointer', lineHeight: '1' }}
          >&times;</button>
          <div className="jump-title">Jump to Slide</div>
          <input 
            type="number" 
            ref={jumpInputRef}
            value={jumpInputValue}
            onChange={(e) => setJumpInputValue(e.target.value)}
            onKeyDown={handleJumpSubmit}
            className="jump-input" 
            min="1" 
            max={TOTAL} 
            autoComplete="off" 
          />
          <div className="hint-text">Type number and press Enter</div>
        </div>
      </div>

      {/* Touch Controls for iPad */}
      <div id="touch-controls">
        <button id="btn-notes" className="touch-btn" onClick={toggleSpeakerNote} aria-label="Toggle Notes" title="Speaker Notes (N)">📝</button>
        <button id="btn-focus" className="touch-btn" onClick={toggleFocusMode} aria-label="Toggle Focus Mode" title="Focus Mode (H)">🔦</button>
        <button id="btn-jump" className="touch-btn" onClick={() => setJumpOverlayActive(true)} aria-label="Jump to Slide" title="Jump (J)">🔢</button>
        <button className="touch-btn" onClick={() => navigate('/assets')} aria-label="Back to Assets" title="Back to Assets">⬅️</button>
      </div>

      {/* Nav */}
      <button className="nav-btn" id="prev" onClick={() => goTo(current - 1)} aria-label="Previous slide" disabled={current === 0}>←</button>
      <button className="nav-btn" id="next" onClick={() => goTo(current + 1)} aria-label="Next slide" disabled={current === TOTAL - 1}>→</button>

      {/* Dots */}
      <div id="dots">
        {Array.from({ length: TOTAL }).map((_, i) => (
          <button 
            key={i}
            className={`dot ${i === current ? 'active' : ''}`}
            aria-label={`Slide ${i + 1}`}
            aria-current={i === current ? 'true' : undefined}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
      
      <div id="speakerNote" className={showNotes ? 'visible' : ''} aria-live="polite">
        {speakerNotes[current]}
      </div>

      {/* DECK */}
      <div id="deck">

        {/* ■ SLIDE 1 — TITLE ─────────────────────────── */}
        <div className={`slide ${current === 0 ? "active" : ""}`} id="s1">
            <div className="left-bar"></div>
            <div className="glow-orb"></div>
            <div className="s-inner">
                <div className="anim">
                    <h1 className="display">BEYOND<span className="accent">P.O.P.</span></h1>
                </div>
                <div className="anim">
                    <p className="subtitle">Using AI to Build Work, Skill & Opportunity After NYSC</p>
                </div>
                <div className="anim">
                    <p className="tagline">For every corps member — technical, creative, business-minded, or still figuring
                        it out.</p>
                </div>
                <div className="anim pills">
                    <span className="pill">Mindset</span>
                    <span className="pill">Use Cases</span>
                    <span className="pill">Tools</span>
                    <span className="pill">30-Day Plan</span>
                </div>
                <div className="anim" style={{marginTop: '10px'}}>
                    <p style={{fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.12em', fontFamily: 'var(--f-head)'}}>
                        POST-NYSC CAREER TALK</p>
                </div>
            </div>
            
        </div>

        {/* ■ SLIDE 2 — NEW REALITY ───────────────────── */}
        <div  className={`slide ${current === 1 ? "active" : ""}`} id="s2">
            <div className="s-inner" style={{paddingTop: '48px', paddingBottom: '48px'}}>
                <div className="anim"><span className="badge"
                        style={{background: 'var(--navy)', color: 'var(--teal)', border: '1px solid rgba(0,201,141,0.3)'}}>The New
                        Reality</span></div>
                <div className="anim">
                    <h2 className="slide-title">What makes you useful, employable & hard to ignore?</h2>
                </div>
                <div className="anim truth-grid">
                    <div className="truth-card">
                        <div className="truth-header"><span className="truth-num">Truth 01</span></div>
                        <div className="truth-body">
                            <div className="truth-head">Your certificate opens the door.</div>
                            <div className="truth-desc">Your skill, evidence, and speed keep you in the room. The POP is the
                                starting gun — not the finish line.</div>
                        </div>
                    </div>
                    <div className="truth-card">
                        <div className="truth-header"><span className="truth-num">Truth 02</span></div>
                        <div className="truth-body">
                            <div className="truth-head">AI will not replace serious people.</div>
                            <div className="truth-desc">But people who use AI well will outperform those who ignore it. That
                                gap compounds every single day.</div>
                        </div>
                    </div>
                    <div className="truth-card">
                        <div className="truth-header"><span className="truth-num">Truth 03</span></div>
                        <div className="truth-body">
                            <div className="truth-head">No tech degree required.</div>
                            <div className="truth-desc">You don't need to become a programmer first. Start by using AI to
                                improve what you already do.</div>
                        </div>
                    </div>
                </div>
                <div className="anim core-msg">Core message: Learn AI as a practical work partner — not as hype.</div>
            </div>
            
        </div>

        {/* ■ SLIDE 3 — PRACTICAL SKILL ──────────────── */}
        <div  className={`slide ${current === 2 ? "active" : ""}`} id="s3">
            <div className="s-inner" style={{paddingTop: '44px', paddingBottom: '44px', gap: '18px'}}>
                <div className="anim"><span className="badge">Practical Skill</span></div>
                <div className="anim">
                    <h2 className="slide-title light">AI in Plain Language & The Prompt Formula</h2>
                </div>
                <div className="anim two-col" style={{flex: '1'}}>
                    <div className="intern-card">
                        <div className="intern-title">The Pro-Max Digital Intern</div>
                        <div className="intern-bullets">
                            <div className="bullet-item">
                                <div className="bullet-dot"></div>
                                <div className="bullet-text">Reads, writes, analyzes, codes, brainstorms — 24/7</div>
                            </div>
                            <div className="bullet-item">
                                <div className="bullet-dot"></div>
                                <div className="bullet-text">Has read the entire internet; just needs clear instructions
                                </div>
                            </div>
                            <div className="bullet-item">
                                <div className="bullet-dot"></div>
                                <div className="bullet-text">Drafts CVs, emails, proposals, presentations in minutes</div>
                            </div>
                            <div className="bullet-item">
                                <div className="bullet-dot"></div>
                                <div className="bullet-text">Researches any industry or market trend instantly</div>
                            </div>
                            <div className="bullet-item">
                                <div className="bullet-dot"></div>
                                <div className="bullet-text">Your judgment remains the final quality control</div>
                            </div>
                        </div>
                    </div>
                    <div className="formula-card">
                        <div className="formula-title">The Prompt Formula — Works in ChatGPT, Claude, Gemini</div>
                        <div className="formula-step">
                            <div className="step-num">1</div>
                            <div className="step-label">Role</div>
                            <div className="step-desc" style={{color: 'white'}}>Tell AI who to act as — e.g. career coach,
                                editor, researcher</div>
                        </div>
                        <div className="formula-step">
                            <div className="step-num">2</div>
                            <div className="step-label">Context</div>
                            <div className="step-desc" style={{color: 'white'}}>Give relevant background about your situation
                            </div>
                        </div>
                        <div className="formula-step">
                            <div className="step-num">3</div>
                            <div className="step-label">Task</div>
                            <div className="step-desc" style={{color: 'white'}}>State exactly what you want produced</div>
                        </div>
                        <div className="formula-step">
                            <div className="step-num">4</div>
                            <div className="step-label">Format</div>
                            <div className="step-desc" style={{color: 'white'}}>Specify how the answer should look (list, table,
                                bullets…)</div>
                        </div>
                        <div className="formula-step">
                            <div className="step-num">5</div>
                            <div className="step-label">Review</div>
                            <div className="step-desc" style={{color: 'white'}}>Ask it to improve, verify, or simplify the
                                output</div>
                        </div>
                        <div className="example-prompt">💬 "Act as a career coach. I just finished my NYSC program and
                            graduated with a degree in [field]. Give me 5 ways I can use AI to become more valuable,
                            with one 7-day practical project."</div>
                    </div>
                </div>
            </div>
            
        </div>

        {/* ■ SLIDE 5 — USE CASES ────────────────────── */}
        <div  className={`slide ${current === 3 ? "active" : ""}`} id="s4">
            <div className="s-inner" style={{paddingTop: '44px', paddingBottom: '44px', gap: '18px'}}>
                <div className="anim"><span className="badge">Tool Stacks by Role</span></div>
                <div className="anim">
                    <h2 className="slide-title light">Practical AI Use Cases Across Every Career Path</h2>
                </div>
                <div className="anim usecase-grid">
                    <div className="usecase-card">
                        <div className="usecase-header" style={{background: '#7C3AED'}}>🎬 Content Creators</div>
                        <div className="usecase-body">
                            <div className="uc-bullets">
                                <div className="uc-item">Plan weekly content from one niche idea</div>
                                <div className="uc-item">Turn rough thoughts into scripts, hooks & CTAs</div>
                                <div className="uc-item">Create faceless content with AI voiceovers & avatars</div>
                            </div>
                            <div className="uc-stack">Stack: YarnGPT · ElevenLabs · Synthesia · HeyGen · CapCut</div>
                        </div>
                    </div>
                    <div className="usecase-card">
                        <div className="usecase-header" style={{background: '#0891B2'}}>💻 Tech & Developers</div>
                        <div className="usecase-body">
                            <div className="uc-bullets">
                                <div className="uc-item">Debug, explain & complete code in any language</div>
                                <div className="uc-item">Build portfolio projects faster with AI scaffolding</div>
                                <div className="uc-item">Turn raw data into insights, charts & SQL queries</div>
                            </div>
                            <div className="uc-stack">Stack: Cursor · ChatGPT · Claude · Anthropic Academy</div>
                        </div>
                    </div>
                    <div className="usecase-card">
                        <div className="usecase-header" style={{background: '#D97706'}}>🏪 Entrepreneurs</div>
                        <div className="usecase-body">
                            <div className="uc-bullets">
                                <div className="uc-item">Launch a website from a prompt — no agency needed</div>
                                <div className="uc-item">Write better product descriptions & sales messages</div>
                                <div className="uc-item">Set up Instagram DM flows for 24/7 lead capture</div>
                            </div>
                            <div className="uc-stack">Stack: 10Web · Dora AI · Butternut AI · ManyChat</div>
                        </div>
                    </div>
                    <div className="usecase-card">
                        <div className="usecase-header" style={{background: '#059669'}}>🏠 VAs & Remote Workers</div>
                        <div className="usecase-body">
                            <div className="uc-bullets">
                                <div className="uc-item">Turn voice notes & calls into clean summaries</div>
                                <div className="uc-item">Draft client emails, SOPs & weekly reports instantly</div>
                                <div className="uc-item">Automate repetitive tasks across 1,700+ apps</div>
                            </div>
                            <div className="uc-stack">Stack: Wispr Flow · n8n · ChatGPT</div>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>

        {/* ■ SLIDE 6 — CONTENT PLAYBOOK ─────────────── */}
        <div  className={`slide ${current === 4 ? "active" : ""}`} id="s5">
            <div className="s-inner" style={{paddingTop: '44px', paddingBottom: '44px', gap: '22px'}}>
                <div className="anim"><span className="badge"
                        style={{background: 'var(--navy)', color: 'var(--teal)', border: '1px solid rgba(0,201,141,0.3)'}}>Content
                        Playbook</span></div>
                <div className="anim">
                    <h2 className="slide-title">How a Solo Creator Competes with Production Studios</h2>
                </div>
                <div className="anim steps-row">
                    <div className="step-card">
                        <div className="step-top">
                            <div className="step-big">01</div>
                        </div>
                        <div className="step-content">
                            <div className="step-name">Script It</div>
                            <div className="step-tool">ChatGPT / YarnGPT</div>
                            <div className="step-desc">Write a punchy, relatable explainer script in your chosen niche</div>
                        </div>
                    </div>
                    <div className="step-card">
                        <div className="step-top">
                            <div className="step-big">02</div>
                        </div>
                        <div className="step-content">
                            <div className="step-name">Voice It</div>
                            <div className="step-tool">ElevenLabs.io</div>
                            <div className="step-desc">Paste script → choose a voice → download studio-quality audio in
                                seconds</div>
                        </div>
                    </div>
                    <div className="step-card">
                        <div className="step-top">
                            <div className="step-big">03</div>
                        </div>
                        <div className="step-content">
                            <div className="step-name">Animate It</div>
                            <div className="step-tool">Gemini + Grok AI</div>
                            <div className="step-desc">Build viral stickman or explainer animations from images + video AI
                            </div>
                        </div>
                    </div>
                    <div className="step-card">
                        <div className="step-top">
                            <div className="step-big">04</div>
                        </div>
                        <div className="step-content">
                            <div className="step-name">Publish It</div>
                            <div className="step-tool">CapCut / Premiere</div>
                            <div className="step-desc">Edit, add captions & schedule. Repeat the formula weekly</div>
                        </div>
                    </div>
                </div>
                <div className="anim footnote">Consistency beats perfection. Run the formula weekly.</div>
            </div>
            
        </div>

        {/* ■ SLIDE 8 — RESPONSIBLE USE ──────────────── */}
        <div  className={`slide ${current === 5 ? "active" : ""}`} id="s6">
            <div className="s-inner" style={{paddingTop: '44px', paddingBottom: '44px', gap: '20px'}}>
                <div className="anim"><span className="badge"
                        style={{background: 'var(--navy)', color: 'var(--teal)', border: '1px solid rgba(0,201,141,0.3)'}}>Professional
                        Standard</span></div>
                <div className="anim">
                    <h2 className="slide-title" style={{marginBottom: '0'}}>Use AI Responsibly</h2>
                </div>
                <div className="anim two-col" style={{alignItems: 'start', gap: '24px', flex: '1'}}>
                    <div className="principle-list">
                        <div className="principle">
                            <div className="p-num">1</div>
                            <div className="p-title">Fact-Check Everything</div>
                            <div className="p-desc">AI can confidently generate wrong information. Verify before submitting
                                client work or public content.</div>
                        </div>
                        <div className="principle">
                            <div className="p-num">2</div>
                            <div className="p-title">Protect Privacy</div>
                            <div className="p-desc">Never paste confidential client, company, or personal data carelessly
                                into public AI tools.</div>
                        </div>
                        <div className="principle">
                            <div className="p-num">3</div>
                            <div className="p-title">Add Local Context</div>
                            <div className="p-desc">Make outputs fit your audience, culture, and real conditions — not
                                generic Western defaults.</div>
                        </div>
                        <div className="principle">
                            <div className="p-num">4</div>
                            <div className="p-title">Avoid Lazy Copying</div>
                            <div className="p-desc">Use AI as a draft partner, not your final brain. Add your voice,
                                judgment & editing.</div>
                        </div>
                        <div className="principle">
                            <div className="p-num">5</div>
                            <div className="p-title">Build Evidence</div>
                            <div className="p-desc">Save your best prompts, projects, and results. AI output without proof
                                of authorship is invisible.</div>
                        </div>
                    </div>
                    <div className="salt-card">
                        <div style={{fontSize: '32px'}}>🧂</div>
                        <div className="salt-quote">"AI is the ingredient.<br />You are the chef."</div>
                        <div className="salt-label">The Salt Principle</div>
                    </div>
                </div>
            </div>
            
        </div>

        {/* ■ SLIDE 9 — 30-DAY PLAN ──────────────────── */}
        <div  className={`slide ${current === 6 ? "active" : ""}`} id="s7">
            <div className="s-inner" style={{paddingTop: '44px', paddingBottom: '44px', gap: '18px'}}>
                <div className="anim"><span className="badge">30-Day Plan</span></div>
                <div className="anim">
                    <h2 className="slide-title light" style={{marginBottom: '0'}}>Your AI Integration Roadmap</h2>
                </div>
                <div className="anim week-list">
                    <div className="week-row">
                        <div className="week-strip" style={{background: 'var(--teal)'}}></div>
                        <div><span className="week-badge" style={{background: 'var(--teal)', color: 'var(--navy)'}}>Week 1</span>
                        </div>
                        <div className="week-title">Learn Prompting</div>
                        <div className="week-desc">Create 10 prompts tailored to your field. Experiment with the
                            Role–Context–Task–Format–Review formula and save your best results.</div>
                    </div>
                    <div className="week-row">
                        <div className="week-strip" style={{background: '#7C3AED'}}></div>
                        <div><span className="week-badge" style={{background: '#7C3AED', color: '#fff'}}>Week 2</span></div>
                        <div className="week-title">Build One Proof</div>
                        <div className="week-desc">Make a CV upgrade, mini website, content pack, dashboard, or business
                            automation. Something you can show to someone.</div>
                    </div>
                    <div className="week-row">
                        <div className="week-strip" style={{background: '#F5A623'}}></div>
                        <div><span className="week-badge" style={{background: '#F5A623', color: '#000'}}>Week 3</span></div>
                        <div className="week-title">Automate One Task</div>
                        <div className="week-desc">Pick one repetitive task and create a simple AI-assisted workflow using
                            n8n, ManyChat, or a Custom GPT.</div>
                    </div>
                    <div className="week-row">
                        <div className="week-strip" style={{background: '#DC2626'}}></div>
                        <div><span className="week-badge" style={{background: '#DC2626', color: '#fff'}}>Week 4</span></div>
                        <div className="week-title">Publish Evidence</div>
                        <div className="week-desc">Share your before/after, lessons, and next steps on LinkedIn or your
                            portfolio. Your network is your net worth.</div>
                    </div>
                </div>
                <div className="anim plan-footer">The goal is not to "know AI". The goal is to show what AI helped you do.
                </div>
            </div>
            
        </div>

        {/* ■ SLIDE 10 — PROJECT IDEAS ───────────────── */}
        <div  className={`slide ${current === 7 ? "active" : ""}`} id="s8">
            <div className="s-inner" style={{paddingTop: '44px', paddingBottom: '44px', gap: '20px'}}>
                <div className="anim"><span className="badge"
                        style={{background: 'var(--navy)', color: 'var(--teal)', border: '1px solid rgba(0,201,141,0.3)'}}>Project
                        Ideas</span></div>
                <div className="anim">
                    <h2 className="slide-title" style={{marginBottom: '0'}}>Turn Learning Into Proof — By Your Background</h2>
                </div>
                <div className="anim projects-grid">
                    <div className="proj-card">
                        <div className="proj-field">📚 Education</div>
                        <div className="proj-desc">AI-generated lesson pack + quiz bank for a topic in your subject</div>
                    </div>
                    <div className="proj-card">
                        <div className="proj-field">🏥 Health</div>
                        <div className="proj-desc">Patient education flyers + draft FAQ chatbot for a common condition</div>
                    </div>
                    <div className="proj-card">
                        <div className="proj-field">🌿 Agriculture</div>
                        <div className="proj-desc">Market price tracker + advisory content plan for local farmers</div>
                    </div>
                    <div className="proj-card">
                        <div className="proj-field">💼 Finance / Admin</div>
                        <div className="proj-desc">Expense tracker with automated monthly insight report</div>
                    </div>
                    <div className="proj-card">
                        <div className="proj-field">🎙️ Media</div>
                        <div className="proj-desc">30-day niche content calendar + 4 scripted posts ready to publish</div>
                    </div>
                    <div className="proj-card">
                        <div className="proj-field">⚙️ Engineering</div>
                        <div className="proj-desc">Maintenance checklist + safety training guide for a real system</div>
                    </div>
                </div>
                <div className="anim footnote"
                    style={{fontSize: '11px', fontStyle: 'italic', fontWeight: '600', color: 'var(--slate)', textAlign: 'center'}}>Rule:
                    Your first AI project should solve a small real problem — not impress everybody.</div>
            </div>
            
        </div>

        {/* ■ SLIDE 12 — LIVE DEMO ───────────────────── */}
        <div  className={`slide ${current === 8 ? "active" : ""}`} id="s9">
            <div className="s-inner" style={{paddingTop: '44px', paddingBottom: '44px', gap: '20px'}}>
                <div className="anim"><span className="badge">Live Demo</span></div>
                <div className="anim">
                    <h2 className="slide-title light" style={{marginBottom: '0'}}>One Prompt, Many Careers</h2>
                </div>
                <div className="anim demo-card">
                    <div className="demo-prompt">"Act as a career coach. I just finished NYSC. My field is <strong>[insert
                            field]</strong>. Give me 5 ways I can use AI to become more valuable, with one practical
                        project I can complete in 7 days."</div>
                    <div className="demo-steps">
                        <div className="demo-step">
                            <div className="demo-step-title">1. Ask</div>
                            <div className="demo-step-desc">Run the prompt with one field from the room.</div>
                        </div>
                        <div className="demo-step">
                            <div className="demo-step-title">2. Improve</div>
                            <div className="demo-step-desc">Ask AI to make the answer practical, low-budget, and locally
                                relevant.</div>
                        </div>
                        <div className="demo-step">
                            <div className="demo-step-title">3. Act</div>
                            <div className="demo-step-desc">Choose one 7-day project from the output.</div>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>

        {/* ■ SLIDE 13 — WORKFLOW PROOF ───────────────── */}
        <div  className={`slide ${current === 9 ? "active" : ""}`} id="s10">
            <div className="s-inner" style={{paddingTop: '44px', paddingBottom: '44px', gap: '20px'}}>
                <div className="anim"><span className="badge">Build Proof</span></div>
                <div className="anim">
                    <h2 className="slide-title light" style={{marginBottom: '0'}}>Turn AI Use Into Visible Work</h2>
                </div>
                <div className="anim proof-grid">
                    <div className="proof-card">
                        <div className="proof-header">Tech, Data & Product</div>
                        <div className="proof-body">
                            <div className="proof-title">Understand → Ask → Build → Document</div>
                            <div className="proof-desc">Use AI to explain, debug, structure, and document a mini app,
                                dashboard, report, or technical write-up.</div>
                        </div>
                    </div>
                    <div className="proof-card">
                        <div className="proof-header" style={{background: '#D97706', color: '#fff'}}>Business</div>
                        <div className="proof-body">
                            <div className="proof-title">Offer → Website → Replies → Leads</div>
                            <div className="proof-desc">Clarify what you sell, draft a simple web presence, answer customers
                                faster, and capture conversations.</div>
                        </div>
                    </div>
                    <div className="proof-card">
                        <div className="proof-header" style={{background: '#059669', color: '#fff'}}>Admin & VA</div>
                        <div className="proof-body">
                            <div className="proof-title">Capture → Convert → Organize → Automate</div>
                            <div className="proof-desc">Turn voice notes, meetings, and repeat tasks into clean reports,
                                SOPs, templates, and workflows.</div>
                        </div>
                    </div>
                </div>
                <div className="anim plan-footer" style={{color: 'white'}}>Visible proof beats private learning.</div>
            </div>
            
        </div>

        {/* ■ SLIDE 14 — ACTION / CLOSING ────────────── */}
        <div  className={`slide ${current === 10 ? "active" : ""}`} id="s11">
            <div className="left-bar"></div>
            <div className="glow-orb"></div>
            <div className="s-inner">
                <div className="anim"><span className="badge">Action Slide</span></div>
                <div className="anim">
                    <h2 className="slide-title light" style={{marginBottom: '8px'}}>What To Do Today</h2>
                </div>
                <div className="anim action-list">
                    <div className="action-row">
                        <div className="action-num">1</div>
                        <div className="action-title">Choose One Lane</div>
                        <div className="action-desc">Employment, business, freelancing, content, tech, admin, education, or
                            research.</div>
                    </div>
                    <div className="action-row">
                        <div className="action-num">2</div>
                        <div className="action-title">Choose One Tool</div>
                        <div className="action-desc">Pick the tool that matches the work you want to improve first. Start
                            this week.</div>
                    </div>
                    <div className="action-row">
                        <div className="action-num">3</div>
                        <div className="action-title">Create One Proof</div>
                        <div className="action-desc">Build a practical project you can show within 7 days. Show the before
                            and after.</div>
                    </div>
                    <div className="action-row">
                        <div className="action-num">4</div>
                        <div className="action-title">Share & Stay Curious</div>
                        <div className="action-desc">AI tools evolve monthly. Set aside 30 min/week. Your network is your
                            net worth.</div>
                    </div>
                </div>
                <div className="anim closing">Start small. Build evidence. Let AI multiply the skill you already have.</div>
            </div>
            
        </div>

        {/* ■ SLIDE 12 — ULTIMATE AI TOOLKIT ─────────── */}
        <div  className={`slide ${current === 11 ? "active" : ""}`} id="s12">
            <div className="s-inner" style={{paddingTop: '44px', paddingBottom: '44px', gap: '20px'}}>
                <div className="anim"><span className="badge" style={{background: 'var(--teal)', color: 'var(--navy)'}}>Appendix
                        A</span></div>
                <div className="anim">
                    <h2 className="slide-title light">The Ultimate AI Toolkit</h2>
                </div>
                <div className="anim lane-grid" style={{gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px'}}>
                    <div className="res-card">
                        <div className="res-header" style={{background: '#7C3AED'}}>Content Creation</div>
                        <div className="res-body" style={{gridTemplateColumns: '1fr', gap: '16px'}}>
                            <div className="res-item">
                                <div className="res-name">ElevenLabs (Voiceovers)</div>
                                <div className="res-url">elevenlabs.io</div>
                            </div>
                            <div className="res-item">
                                <div className="res-name">Synthesia (AI Avatars)</div>
                                <div className="res-url">synthesia.io</div>
                            </div>
                            <div className="res-item">
                                <div className="res-name">YarnGPT (African Context)</div>
                                <div className="res-url">yarngpt.ai</div>
                            </div>
                            <div className="res-item">
                                <div className="res-name">Sora (Text-to-Video)</div>
                                <div className="res-url">openai.com/sora</div>
                            </div>
                        </div>
                    </div>
                    <div className="res-card">
                        <div className="res-header" style={{background: '#0891B2'}}>Website Builders</div>
                        <div className="res-body" style={{gridTemplateColumns: '1fr', gap: '16px'}}>
                            <div className="res-item">
                                <div className="res-name">10Web</div>
                                <div className="res-url">10web.io</div>
                            </div>
                            <div className="res-item">
                                <div className="res-name">Dora AI</div>
                                <div className="res-url">dora.run/ai</div>
                            </div>
                            <div className="res-item">
                                <div className="res-name">Butternut AI</div>
                                <div className="res-url">butternut.ai</div>
                            </div>
                        </div>
                    </div>
                    <div className="res-card">
                        <div className="res-header" style={{background: '#059669'}}>Core Workflow</div>
                        <div className="res-body" style={{gridTemplateColumns: '1fr', gap: '16px'}}>
                            <div className="res-item">
                                <div className="res-name">n8n (Automation)</div>
                                <div className="res-url">n8n.io</div>
                            </div>
                            <div className="res-item">
                                <div className="res-name">ManyChat (DM Flows)</div>
                                <div className="res-url">manychat.com</div>
                            </div>
                            <div className="res-item">
                                <div className="res-name">Cursor (Coding)</div>
                                <div className="res-url">cursor.com</div>
                            </div>
                            <div className="res-item">
                                <div className="res-name">Wispr Flow (Voice Notes)</div>
                                <div className="res-url">wisprflow.ai</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* ■ SLIDE 13 — NEXT-GEN & CASE STUDIES ─────── */}
        <div  className={`slide ${current === 12 ? "active" : ""}`} id="s13">
            <div className="s-inner" style={{paddingTop: '44px', paddingBottom: '44px', gap: '20px'}}>
                <div className="anim"><span className="badge" style={{background: '#D97706', color: '#fff'}}>Appendix B</span></div>
                <div className="anim">
                    <h2 className="slide-title light">Next-Gen Resources & Case Studies</h2>
                </div>
                <div className="anim lane-grid" style={{gridTemplateColumns: '1fr 1fr', gap: '40px'}}>
                    <div>
                        <h3 style={{color: 'var(--teal)', marginBottom: '16px', fontFamily: 'var(--f-head)'}}>AI & Coding For
                            Kids</h3>
                        <div className="projects-grid" style={{gridTemplateColumns: '1fr', gap: '12px'}}>
                            <div className="proj-card" style={{padding: '16px'}}>
                                <div className="proj-field">LittleLit</div>
                                <div className="proj-desc">AI storytelling & games (littlelit.ai)</div>
                            </div>
                            <div className="proj-card" style={{padding: '16px'}}>
                                <div className="proj-field">ChatGPT for Kids</div>
                                <div className="proj-desc">Safe interface (chatgpt4kids.org)</div>
                            </div>
                            <div className="proj-card" style={{padding: '16px'}}>
                                <div className="proj-field">Elements of AI</div>
                                <div className="proj-desc">Free course (elementsofai.com)</div>
                            </div>
                            <div className="proj-card" style={{padding: '16px'}}>
                                <div className="proj-field">Scratch</div>
                                <div className="proj-desc">Visual coding (scratch.mit.edu)</div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 style={{color: 'var(--teal)', marginBottom: '16px', fontFamily: 'var(--f-head)'}}>Video References
                        </h3>
                        <div className="uc-bullets" style={{gap: '16px'}}>
                            <div className="uc-item" style={{fontSize: '20px', color: 'var(--white)'}}>1. Strategy Case 1: <a
                                    href="https://www.youtube.com/watch?v=LkC0rkA0sxo" target="_blank"
                                    style={{color: 'var(--teal)'}}>Watch Video</a></div>
                            <div className="uc-item" style={{fontSize: '20px', color: 'var(--white)'}}>2. Strategy Case 2: <a
                                    href="https://www.youtube.com/watch?v=pr91PIsrwy0" target="_blank"
                                    style={{color: 'var(--teal)'}}>Watch Video</a></div>
                            <div className="uc-item" style={{fontSize: '20px', color: 'var(--white)'}}>3. Strategy Case 3: <a
                                    href="https://www.youtube.com/watch?v=s4b8iU3ecTs" target="_blank"
                                    style={{color: 'var(--teal)'}}>Watch Video</a></div>
                        </div>
                        <div className="core-msg" style={{marginTop: '32px', fontSize: '16px', color: 'white'}}>Review these
                            real-world AI
                            applications to see the exact workflow in action.</div>
                    </div>
                </div>
            </div>
        </div>
        {/* ■ SLIDE 14 — ABOUT ME ──────────────────────── */}
        <div  className={`slide ${current === 13 ? "active" : ""}`} id="s14">
            <div className="s-inner" style={{paddingTop: '44px', paddingBottom: '44px'}}>
                <div className="anim"
                    style={{display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '80px', alignItems: 'center', height: '100%'}}>

                    {/* Left side: Images (Infinite Slider) */}
                    <div
                        style={{position: 'relative', width: '100%', aspectRatio: '1/1', overflow: 'hidden', borderRadius: '20px', border: '4px solid var(--teal)', boxShadow: '0 20px 60px rgba(0,201,141,0.2)'}}>
                        <div style={{display: 'flex', width: '200%', height: '100%', animation: 'imageSlide 6s infinite'}}>
                            <img src="https://peincqeqcufbkoccyneo.supabase.co/storage/v1/object/public/gallery-media/a0d59774-0f13-406d-9dcd-9f363d74ebc3.png"
                                alt="Ajibola Akelebe"
                                style={{width: '50%', height: '100%', objectFit: 'cover', flexShrink: '0'}} />
                            <img src="https://peincqeqcufbkoccyneo.supabase.co/storage/v1/object/public/gallery-media/0ad52a9b-3c40-497c-bd4b-c32d3432bb8c.webp"
                                alt="Avatar" style={{width: '50%', height: '100%', objectFit: 'cover', flexShrink: '0'}} />
                        </div>
                    </div>

                    {/* Right side: Text */}
                    <div style={{textAlign: 'left'}}>
                        <h2 className="slide-title light"
                            style={{marginBottom: '8px', textAlign: 'left', fontSize: '52px', fontWeight: '800', lineHeight: '1.1'}}>
                            Ajibola Akelebe <br /><span
                                style={{color: 'var(--teal)', fontSize: '32px', fontWeight: '800'}}>(Don_Genius)</span></h2>

                        {/* Section 1: Role */}
                        <div
                            style={{marginTop: '32px', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '16px'}}>
                            <div
                                style={{width: '52px', height: '52px', borderRadius: '12px', background: 'rgba(0,201,141,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', border: '2px solid rgba(0,201,141,0.4)', flexShrink: '0'}}>
                                💡</div>
                            <p
                                style={{color: 'var(--white)', fontWeight: '800', margin: '0', fontSize: '18px', lineHeight: '1.4'}}>
                                AI Enthusiast, Designer, Developer & Tech Educator</p>
                        </div>

                        {/* Section 2: Bio */}
                        <div style={{marginBottom: '40px', display: 'flex', gap: '16px'}}>
                            <div
                                style={{width: '52px', height: '52px', borderRadius: '12px', background: 'rgba(124,58,237,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', border: '2px solid rgba(124,58,237,0.4)', flexShrink: '0'}}>
                                🌍</div>
                            <p
                                style={{fontSize: '16px', color: 'var(--white)', fontWeight: '600', lineHeight: '1.8', margin: '0', paddingTop: '4px'}}>
                                A developer and designer based in Nigeria, creating for a global audience. I teach what
                                I know and share what I learn.</p>
                        </div>

                        {/* Section 3: Connect */}
                        <h3
                            style={{fontFamily: 'var(--f-head)', fontSize: '15px', fontWeight: '800', color: 'var(--teal)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '20px'}}>
                            Connect & Collaborate</h3>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                            <a href="https://ajibolagenius.vercel.app" target="_blank" className="connect-link">
                                <span>🌐</span>
                                <span>Portfolio — ajibolagenius.vercel.app</span>
                            </a>
                            <a href="https://github.com/ajibolagenius" target="_blank" className="connect-link">
                                <span>💻</span>
                                <span>GitHub — @ajibolagenius</span>
                            </a>
                            <a href="https://x.com/ajibolagenius" target="_blank" className="connect-link">
                                <span>🐦</span>
                                <span>X — @ajibolagenius</span>
                            </a>
                            <a href="https://wa.me/2348063281921" target="_blank" className="connect-link">
                                <span>📞</span>
                                <span>WhatsApp — 08063281921</span>
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </div>

    </div>
      </div>
  );
}
