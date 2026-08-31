import { useEffect } from 'react';
import './planner.css';
import { mountPlanner } from './planner';

/* Markup is intentionally plain: ids and classNames are what planner.js binds to.
   Keep the ids; restyle freely in planner.css. */
export default function App() {
  useEffect(() => { mountPlanner(); }, []);
  return (
    <>


<svg width="0" height="0" style={{position:'absolute'}} aria-hidden="true">
  <defs>
    <symbol id="d-flower" viewBox="0 0 40 50"><circle cx="20" cy="16" r="4"/><circle cx="27" cy="16" r="3.4"/><circle cx="23.5" cy="22" r="3.4"/><circle cx="16.5" cy="22" r="3.4"/><circle cx="13" cy="16" r="3.4"/><circle cx="16.5" cy="10" r="3.4"/><circle cx="23.5" cy="10" r="3.4"/><path d="M20 25.5C21 31 19 38 20 46"/><path d="M20 37C15 35 12 31 12 27C16 28 19 32 20 37"/></symbol>
    <symbol id="d-mushroom" viewBox="0 0 40 50"><path d="M6 26C8 8 32 8 34 26Z"/><path d="M14 18h.4M20 13h.4M26 18h.4M20 22h.4" strokeWidth="3"/><path d="M15 26C15 32 15 38 16 45L24 45C25 38 25 32 25 26"/></symbol>
    <symbol id="d-bee" viewBox="0 0 40 50"><ellipse cx="20" cy="30" rx="8" ry="11"/><path d="M13 26h14M12.5 31h15M14 36h12"/><ellipse cx="13" cy="17" rx="5" ry="8" transform="rotate(-30 13 17)"/><ellipse cx="27" cy="17" rx="5" ry="8" transform="rotate(30 27 17)"/><path d="M17 20L14 13M23 20L26 13M20 41V45"/></symbol>
    <symbol id="d-rose" viewBox="0 0 40 50"><path d="M20 15c3 0 5 3 3 5c-2 2-6 1-5-2c1-3 6-3 8 0c2 3 0 8-4 8c-5 0-8-4-6-9c2-5 9-6 13-1c3 4 1 11-4 13"/><path d="M20 29V46"/><path d="M20 41c-5-1-8-4-8-8c4 1 7 4 8 8"/></symbol>
    <symbol id="d-grass" viewBox="0 0 40 50"><path d="M4 45L9 24L13 41L17 18L21 43L25 23L30 41L34 27L36 45"/><path d="M4 45H36"/></symbol>
    <symbol id="d-tree" viewBox="0 0 40 50"><circle cx="20" cy="19" r="12"/><path d="M20 31V46M20 38L14 34M20 42L26 37"/><path d="M14 16c2-3 5-4 8-3" opacity=".6"/></symbol>
    <symbol id="d-tulip" viewBox="0 0 40 50"><path d="M12 22c0-8 4-12 8-6c4-6 8-2 8 6c0 6-4 10-8 10c-4 0-8-4-8-10Z"/><path d="M16 15L17 21M24 15L23 21"/><path d="M20 32V46"/><path d="M20 42c-6-2-8-6-8-10c5 2 7 6 8 10"/></symbol>
    <symbol id="d-pin" viewBox="0 0 24 32"><path d="M12 30C6 22 3 16 3 11a9 9 0 0 1 18 0c0 5-3 11-9 19z"/><circle cx="12" cy="11" r="3.5"/></symbol>
  </defs>
</svg>

<div className="app setup" id="setupApp" style={{display:'none'}}>

  <header className="card hero">
    <div className="eyebrow" id="setupStepLabel">Step 1 of 5</div>
    <h1>Start the trip</h1>
    <div className="lead">Five short screens. Under two minutes, then you send a link and go back to your evening.</div>
    <div className="steps" aria-hidden="true"><i id="t1"></i><i id="t2"></i><i id="t3"></i><i id="t4"></i><i id="t5"></i></div>
  </header>

  <section className="card setup-step" id="st1">
    <h2>Name it</h2>
    <div className="hint">This becomes the title everyone sees on the form.</div>
    <label className="fld"><span>Trip name</span><input className="field" id="gName" type="text" maxLength={60} placeholder="Batch of &rsquo;22 &middot; winter meet" /></label>
    <label className="fld"><span>Your name</span><input className="field" id="gOrg" type="text" maxLength={40} placeholder="Antwin" /></label>
  </section>

  <section className="card setup-step" id="st2" style={{display:'none'}}>
    <h2>When could it be?</h2>
    <div className="hint">A window, not a date. Everyone picks inside it.</div>
    <div className="facts">
      <label className="fld"><span>From</span><input className="field" id="gFrom" type="date" /></label>
      <label className="fld"><span>Until</span><input className="field" id="gTo" type="date" /></label>
    </div>
    <div className="lbl">How long a trip?</div>
    <div className="opts" id="gLen"></div>
    <label className="fld"><span>Answers by</span><input className="field" id="gVoteBy" type="date" /></label>
  </section>

  <section className="card setup-step" id="st3" style={{display:'none'}}>
    <h2>Holidays that count</h2>
    <div className="hint">Tick the states your group actually lives in, then untick any holiday you know nobody gets. What&rsquo;s left becomes the long-weekend options on the form.</div>
    <div className="lbl">States in the group</div>
    <div className="chips" id="gStates"></div>
    <div className="lbl">Holidays in your window</div>
    <div id="gHols" className="hol-list"></div>
    <div className="hint" id="gHolsNote"></div>
  </section>

  <section className="card setup-step" id="st4" style={{display:'none'}}>
    <h2>Money &amp; people</h2>
    <div className="hint">Per head, for stay + food + local travel. Not the journey there.</div>
    <div id="gTiers" className="tier-list"></div>
    <div className="lbl">How should the group&rsquo;s number be decided?</div>
    <div className="opts" id="gRule"></div>
    <div className="lbl">Anything to switch off?</div>
    <div className="opts" id="gToggles"></div>
  </section>

  <section className="card setup-step" id="st5" style={{display:'none'}}>
    <h2>Send it round</h2>
    <div className="hint" id="gDoneHint">Your trip is live. This link is the key &mdash; anyone who has it can join, so keep it to the group and don&rsquo;t post it publicly.</div>
    <div className="linkbox" id="gLinkBox"><code id="gLink"></code></div>
    <div className="actions">
      <button className="btn ink" id="gShare">Share the link</button>
      <button className="btn" id="gCopyLink">Copy link</button>
      <button className="btn" id="gCopyMsg">Copy the WhatsApp message</button>
    </div>
    <div className="warn" id="gAdminNote"></div>
    <button className="link" id="gOpenTrip">Open the trip &rarr;</button>
  </section>

  <div className="setup-nav" id="setupNav">
    <button className="btn" id="setupBack">Back</button>
    <button className="btn ink" id="setupNext">Next</button>
  </div>
  <div id="setupWarn"></div>

</div>

<div className="app" id="memberApp">

  
  <header className="card hero">
    <div className="eyebrow" id="sub">Sept–Oct 2026</div>
    <h1 id="headline">Batch trip. Finally.</h1>
    <div className="lead">Answers by Thu 3rd Sept. Then we begin booking.</div>
    <div className="pills"><span className="pill">the group’s picks, in one place</span><span className="pill">so we can actually plan</span></div>
    <figure className="ill" data-slot="intro"></figure>
    <div className="steps" aria-hidden="true"><i id="s1"></i><i id="s2"></i><i id="s3"></i><i id="s4"></i></div>
  </header>

  
  <div className="strip" id="count" style={{display:'none'}}></div>

  
  <section className="card" id="who">
    <div className="sec-head"><div><span className="num">1 / 6</span><h2>Who’s this?</h2><div className="hint" id="whoHint">Pet name or full name — both work. Your name picks your doodle.</div></div></div>
    <label className="lbl" htmlFor="name">Name</label>
    <div className="who">
      <input id="name" className="field" placeholder="e.g. Rapha / Raphane" autoComplete="off" autoCapitalize="words" enterKeyHint="next" maxLength={24} />
      <svg className="me-doodle d-svg" id="meDoodle" aria-hidden="true"></svg>
    </div>
    <div className="hint" id="nameNote" style={{marginTop:'8px'}}></div>
    <div className="q"><b>How sure are you?</b><span>we plan around the “in”s</span></div>
    <div className="opts eq3" id="sure"></div>
  </section>

  
  <section className="card" id="where">
    <figure className="ill banner" data-slot="map"></figure>
    <div className="sec-head"><div><span className="num">2 / 6</span><h2>Where has life put you?</h2><div className="hint">So we know how far you’re coming from.</div></div></div>
    <label className="lbl" htmlFor="q">City</label>
    <div className="row">
      <input id="q" className="field" type="search" placeholder="Search a city" autoComplete="off" enterKeyHint="search" />
      <button className="btn" id="go">Find</button>
    </div>
    <div className="results" id="results"></div>
    <div className="map-wrap"><svg id="map" viewBox="0 0 360 340"></svg></div>
    <div className="hint" style={{marginTop:'8px'}}>Or tap the paper to drop a pin. Drag it if you overshot.</div>
    <div className="mypin" id="mypin"></div>
    <div className="q"><b>Got a place in mind already?</b><span>a spot you’ve been dying to drag everyone to</span></div>
    <div className="opts eq2" id="rec"></div>
    <div id="recBox" style={{display:'none'}}>
      <label className="lbl" htmlFor="recText">Your recommendation</label>
      <input id="recText" className="field" placeholder="e.g. that homestay in Chikmagalur with the dog" autoComplete="off" enterKeyHint="done" maxLength={80} />
      <div className="counter" id="recCount">80</div>
    </div>
  </section>

  
  <section className="card" id="when">
    <div className="sec-head"><div><span className="num">3 / 6</span><h2>When can you escape?</h2><div className="hint">Tap a long weekend, or pick your own start and end below. We won’t tell HR.</div></div></div>
    <div className="chips" id="chips"></div>
    <div className="cal" id="cal"></div>
    <div className="range" id="range"></div>
    <div className="note">Dashed = long weekend · bold = the holiday itself · leave rules depend on your office, obviously.</div>
    <div className="q"><b>Leave you can realistically take</b><span>what HR will actually sign</span></div>
    <div className="opts" id="leave"></div>
  </section>

  
  <section className="card" id="kind">
    <div className="sec-head"><div><span className="num">4 / 6</span><h2>Salt or altitude?</h2><div className="hint">Pick one. Beach people and hill people can be friends; they just can’t share a booking.</div></div></div>
    <div id="vibes"></div>
    <div className="q"><b>And the mood</b><span>pick two. Three and you’re the problem.</span></div>
    <div className="opts" id="types"></div>
  </section>

  
  <section className="card" id="practical">
    <figure className="ill banner" data-slot="wallet"></figure>
    <div className="sec-head"><div><span className="num">5 / 6</span><h2>Money talk, quietly.</h2></div></div>
    <div className="q"><b>Comfortable spend, per head</b><span>stay + food + getting around there. Not the flight to reach it — that’s between you and your city.</span></div>
    <div className="opts" id="spend"></div>
    <div className="q"><b>Coming as</b></div>
    <div className="opts" id="plus"></div>
  </section>

  
  <section className="card" id="needs">
    <figure className="ill banner" data-slot="wish"></figure>
    <div className="sec-head"><div><span className="num">6 / 6</span><h2>Finish the sentence.</h2><div className="hint">One line. It goes in the garden where everyone can see it. e.g. “a sunrise we’re awake for”, “Ashish’s speaker”.</div></div></div>
    <label className="lbl" htmlFor="need">This trip needs…</label>
    <input id="need" className="field" placeholder="the 2am rooftop talk" autoComplete="off" enterKeyHint="done" maxLength={60} />
    <div className="counter" id="needCount">60</div>
  </section>

  
  <div className="card lilac prog" id="progressCard">
    <div><div className="eyebrow">Your progress</div><div className="txt" id="progTxt"></div></div>
    <div className="pct" id="progPct">0%</div>
  </div>
  <button className="btn ink wide" id="save">Plant me in</button>
  <div id="storeWarn"></div>

  
  <section className="card lime" id="done" style={{display:'none'}}>
    <figure className="ill" data-slot="bloom"></figure>
    <h2 id="doneTitle"></h2>
    <div className="hint" id="doneSub"></div>
    <div className="actions">
      <button className="btn" id="share" style={{display:'none'}}>Share the link</button>
      <button className="btn" id="copy">Copy summary for WhatsApp</button>
      <button className="btn" id="nudge">Copy a nudge for the quiet ones</button>
      <button className="btn secondary" id="waUpdate">Send update to whatsapp</button>
    </div>
  </section>

  
  <section className="card" id="gardenSec">
    <div className="sec-head"><div><h2>The garden</h2><div className="hint" id="gardenHint">Nobody’s planted yet. Be the first. Be the legend.</div></div></div>
    <div id="gardenEmpty"><figure className="ill" data-slot="empty"></figure><div className="hint">An empty pot. It’s giving “group chat with 22 people and zero plans”.</div></div>
    <svg className="garden" id="garden" viewBox="0 0 360 120"></svg>
    <div className="res" id="res"></div>

    <div className="ai-panel" id="aiPanel">
      <div className="ai-head"><h3>Turn this into a plan</h3><span className="ai-badge">AI</span></div>
      <p className="hint">We’ve written a prompt from everyone’s answers — where you’re all coming from, the vibe, budget, dates and wishes. Paste it into any AI and it’ll suggest where to actually go, popular and underrated, with rough costs.</p>
      <div className="ai-with">
        <span className="ai-with-label">Works with</span>
        <span className="ai-mark" data-brand="gemini"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81"/></svg>Gemini</span>
        <span className="ai-mark" data-brand="claude"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z"/></svg>Claude</span>
        <span className="ai-mark" data-brand="gpt"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M21 11.5a7.5 7.5 0 0 1-7.5 7.5H8l-4 3v-4.9A7.5 7.5 0 0 1 3 11.5 7.5 7.5 0 0 1 10.5 4h3A7.5 7.5 0 0 1 21 11.5Z"/></svg>ChatGPT</span>
      </div>
      <div className="ai-rec">Recommended: <b>Gemini</b> — it can drop the picks straight onto a <b>Google My Map</b> you can share.</div>
      <div className="ai-btns">
        <button className="btn ink" id="openGemini">Open Gemini &amp; copy prompt</button>
        <button className="btn" id="openClaude">Claude</button>
        <button className="btn" id="openGPT">ChatGPT</button>
      </div>
      <button className="link" id="copyPrompt">or just copy the prompt</button>
    </div>

    <div className="actions">
      <button className="link" id="csv">Download all answers (csv)</button>
      <button className="link" id="notme" style={{display:'none'}}>Not you? Start a fresh form</button>
      <button className="link" id="remove" style={{display:'none'}}>Remove me from the garden</button>
    </div>
  </section>

</div>
<div className="bar" id="bar" aria-hidden="true"><div className="bar-in"><div className="bar-txt" id="barTxt">0 of 9</div><button className="btn ink" id="barBtn">Plant me in</button></div></div>
<div className="toast" id="toast"></div>


    </>
  );
}
