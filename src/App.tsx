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

<div className="app">

  
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
    <div className="sec-head"><div><span className="num">6 / 6</span><h2>Finish the sentence.</h2><div className="hint">One line. It goes in the garden where everyone can see it. e.g. “a sunrise we’re awake for”, “Rahul’s speaker”.</div></div></div>
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
      <button className="btn" id="copy">Copy summary for WhatsApp</button>
      <button className="btn" id="nudge">Copy a nudge for the quiet ones</button>
    </div>
  </section>

  
  <section className="card" id="gardenSec">
    <div className="sec-head"><div><h2>The garden</h2><div className="hint" id="gardenHint">Nobody’s planted yet. Be the first. Be the legend.</div></div></div>
    <div id="gardenEmpty"><figure className="ill" data-slot="empty"></figure><div className="hint">An empty pot. It’s giving “group chat with 22 people and zero plans”.</div></div>
    <svg className="garden" id="garden" viewBox="0 0 360 120"></svg>
    <div className="res" id="res"></div>
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
