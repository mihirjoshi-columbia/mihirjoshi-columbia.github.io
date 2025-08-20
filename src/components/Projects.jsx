const Projects = () => {
  // Snake mini-game in canvas with blue aesthetic
  const canvasRef = React.useRef(null);
  const [score, setScore] = React.useState(0);
  const [running, setRunning] = React.useState(false);
  const dirRef = React.useRef({x:1, y:0});
  const stateRef = React.useRef({ grid: 24, snake: [{x:8,y:12},{x:7,y:12},{x:6,y:12}], food: {x:14,y:12} });
  const rafRef = React.useRef(0);
  const lastTickRef = React.useRef(0);
  const speedMs = 85; // faster, feels snappier
  const fxRef = React.useRef({ flash: 0 });
  const dprRef = React.useRef(Math.min(window.devicePixelRatio || 1, 2));

  function reset(){
    stateRef.current = { grid: 24, snake: [{x:8,y:12},{x:7,y:12},{x:6,y:12}], food: {x:14,y:12} };
    dirRef.current = {x:1,y:0};
    setScore(0); setRunning(false);
    draw(true);
  }
  function placeFood(){
    const {grid, snake} = stateRef.current;
    while(true){
      const f = { x: Math.floor(Math.random()*grid), y: Math.floor(Math.random()*grid) };
      if(!snake.some(s=>s.x===f.x && s.y===f.y)){ stateRef.current.food = f; return; }
    }
  }
  function key(e){
    const k=e.key.toLowerCase(); const d=dirRef.current;
    if(k==='arrowup' || k==='w'){ if(d.y!==1) dirRef.current={x:0,y:-1}; }
    if(k==='arrowdown' || k==='s'){ if(d.y!==-1) dirRef.current={x:0,y:1}; }
    if(k==='arrowleft' || k==='a'){ if(d.x!==1) dirRef.current={x:-1,y:0}; }
    if(k==='arrowright' || k==='d'){ if(d.x!==-1) dirRef.current={x:1,y:0}; }
    if(k===' '){ setRunning(r=>!r); }
  }
  React.useEffect(()=>{ window.addEventListener('keydown', key); return ()=>window.removeEventListener('keydown', key); },[]);

  function resizeCanvas(){
    const canvas = canvasRef.current; if(!canvas) return; const parent = canvas.parentElement || canvas;
    dprRef.current = Math.min(window.devicePixelRatio || 1, 2);
    const rect = parent.getBoundingClientRect();
    const w = Math.max(1, Math.floor(rect.width));
    const h = Math.max(1, Math.floor(rect.height));
    if (canvas.width !== Math.floor(w * dprRef.current) || canvas.height !== Math.floor(h * dprRef.current)){
      canvas.width = Math.floor(w * dprRef.current);
      canvas.height = Math.floor(h * dprRef.current);
    }
  }

  function draw(only=false){
    const canvas=canvasRef.current; if(!canvas) return; const ctx=canvas.getContext('2d');
    resizeCanvas();
    const {grid,snake,food}=stateRef.current;
    // Draw in CSS pixel space
    ctx.setTransform(dprRef.current, 0, 0, dprRef.current, 0, 0);
    const w = canvas.width / dprRef.current; const h = canvas.height / dprRef.current;
    // Ensure the computed grid fits entirely within the visible canvas in both dimensions
    const cell = Math.floor(Math.min(w, h) / grid);
    const playW = cell * grid;
    const playH = cell * grid;
    const offX = Math.floor((w - playW) / 2);
    const offY = Math.floor((h - playH) / 2);
    // background grid with blue tint
    ctx.fillStyle='#0b0e14'; ctx.fillRect(0,0,w,h);
    ctx.save();
    ctx.beginPath(); ctx.rect(offX, offY, playW, playH); ctx.clip();
    ctx.strokeStyle='rgba(80,120,200,0.08)'; ctx.lineWidth=1;
    for(let i=0;i<=grid;i++){
      const p=i*cell; ctx.beginPath(); ctx.moveTo(offX+p,offY); ctx.lineTo(offX+p,offY+playH); ctx.stroke(); ctx.beginPath(); ctx.moveTo(offX,offY+p); ctx.lineTo(offX+playW,offY+p); ctx.stroke();
    }
    // food
    ctx.fillStyle='rgba(64,156,255,0.95)';
    ctx.beginPath(); ctx.arc(offX+(food.x+0.5)*cell,offY+(food.y+0.5)*cell, Math.max(4, cell*0.35), 0, Math.PI*2); ctx.fill();
    // snake
    for(let i=snake.length-1;i>=0;i--){
      const s=snake[i]; const t=i/snake.length; const glow= i===0 ? 10 : 0;
      ctx.shadowColor='rgba(64,156,255,0.25)'; ctx.shadowBlur=glow;
      ctx.fillStyle=`hsla(210, 90%, ${Math.floor(60- t*25)}%, ${0.98})`;
      ctx.fillRect(offX + s.x*cell+1, offY + s.y*cell+1, cell-2, cell-2);
      ctx.shadowBlur=0;
    }
    // head eye
    const head=snake[0]; ctx.fillStyle='#0b0e14'; ctx.fillRect(offX + head.x*cell+Math.floor(cell*0.6), offY + head.y*cell+Math.floor(cell*0.25), Math.max(2,Math.floor(cell*0.15)), Math.max(2,Math.floor(cell*0.15)));
    // flash effect
    if(fxRef.current.flash>0){ ctx.fillStyle=`rgba(64,156,255,${fxRef.current.flash})`; ctx.fillRect(offX,offY,playW,playH); fxRef.current.flash=Math.max(0, fxRef.current.flash-0.06); }
    ctx.restore();
    if(only) return;
  }

  function update(){
    const now=performance.now(); if(now-lastTickRef.current < speedMs){ rafRef.current=requestAnimationFrame(update); return; }
    lastTickRef.current=now;
    const {grid,snake}=stateRef.current; const dir=dirRef.current;
    const nextX = snake[0].x + dir.x;
    const nextY = snake[0].y + dir.y;
    // collide with walls (aligns with visible bounds)
    if(nextX < 0 || nextX >= grid || nextY < 0 || nextY >= grid){ setRunning(false); return; }
    const head={x:nextX, y:nextY};
    // collide with self
    if(snake.some((s,i)=>i>0 && s.x===head.x && s.y===head.y)){ setRunning(false); return; }
    snake.unshift(head);
    // eat food
    const food=stateRef.current.food;
    if(head.x===food.x && head.y===food.y){ setScore(s=>s+10); placeFood(); fxRef.current.flash=0.22; }
    else { snake.pop(); }
    draw();
    rafRef.current=requestAnimationFrame(update);
  }

  React.useEffect(()=>{
    const ro = new ResizeObserver(()=>draw(true));
    const parent = canvasRef.current?.parentElement; if(parent){ ro.observe(parent); }
    window.addEventListener('resize', ()=>draw(true));
    draw(true);
    return ()=>{ ro.disconnect(); window.removeEventListener('resize', ()=>draw(true)); };
  },[]);
  React.useEffect(()=>{
    cancelAnimationFrame(rafRef.current);
    if(running){ rafRef.current=requestAnimationFrame(update); }
    return ()=>cancelAnimationFrame(rafRef.current);
  }, [running]);

  const snakeCard = () => (
    <div className="snake">
      <div className="snake-header">
        <h3 className="snake-title">Blue Snake</h3>
        <div className="snake-meta">
          <div className="snake-score">Score: {score}</div>
          <button className="cta" onClick={()=>setRunning(true)}>Start</button>
          <button className="cta" onClick={()=>setRunning(false)}>Pause</button>
          <button className="cta" onClick={reset}>Reset</button>
        </div>
      </div>
      <div className="snake-canvas-wrap">
        <canvas ref={canvasRef} className="snake-canvas"/>
      </div>
      <div className="snake-controls"></div>
      <div className="help" style={{marginTop:10}}>Built this in JS for fun. Use WASD/arrow keys. Space to pause.</div>
    </div>
  );

  const siteItems = (window.SITE && window.SITE.projects) || [];
  const items = [
    { type:'snake', title:'Blue Snake', tag:'Game', blurb:'A tiny canvas game.', render: snakeCard },
    ...siteItems.map(x=>({ type:'card', ...x }))
  ];

  return (
    <ProjectCarousel items={items} />
  );
};

function ProjectCarousel({ items }){
  const [idx, setIdx] = React.useState(0);
  const has = Array.isArray(items) ? items.length : 0;
  const current = has ? items[idx % has] : null;
  React.useEffect(()=>{
    // deep-linking with hash like #projects=2
    const m = (location.hash || '').match(/projects=(\d+)/);
    if(m){ const n = parseInt(m[1], 10); if(Number.isFinite(n)){ setIdx(Math.max(0, Math.min(n, has-1))); } }
  }, [has]);
  React.useEffect(()=>{
    // update hash when slide changes (non-destructive)
    const base = (location.hash || '').replace(/projects=\d+/, '').replace(/[#&]$/, '');
    const sep = base.includes('#') ? '&' : '#';
    const nextHash = `${base}${sep}projects=${idx}`;
    history.replaceState(null, '', nextHash);
  }, [idx]);
  function prev(){ if(has) setIdx((i)=> (i-1+has)%has); }
  function next(){ if(has) setIdx((i)=> (i+1)%has); }
  // keyboard support for carousel
  React.useEffect(()=>{
    function onKey(e){
      if(e.key === 'ArrowLeft'){ prev(); }
      if(e.key === 'ArrowRight'){ next(); }
    }
    window.addEventListener('keydown', onKey);
    return ()=> window.removeEventListener('keydown', onKey);
  }, [has]);
  if(!has) return null;
  return (
    <div className="proj-carousel" role="region" aria-label="Projects carousel" aria-live="polite">
      <button className="proj-nav" aria-label="Previous" onClick={prev}>◀</button>
      <div className="proj-card">
        {current && current.render ? (
          current.render()
        ) : (
          <div className="proj-inner">
            <div className="proj-a">
              <div className="proj-tag">{current.tag}</div>
              <h3 className="proj-title">{current.title}</h3>
              <p className="proj-blurb">{current.blurb}</p>
              <div className="proj-actions">
                {current.demo && (<a className="cta" href={current.demo} target="_blank" rel="noreferrer">Live demo</a>)}
                {current.repo && (<a className="cta" href={current.repo} target="_blank" rel="noreferrer">View code</a>)}
              </div>
            </div>
            <div className="proj-b">
              {Array.isArray(current.bullets) && current.bullets.length > 0 && (
                <ul>
                  {current.bullets.map((b, i) => (
                    <li key={i} style={{color:'var(--muted)'}}>{b}</li>
                  ))}
                </ul>
              )}
              {Array.isArray(current.stack) && current.stack.length > 0 && (
                <div className="meta-chips">
                  {current.stack.map((s, i) => (
                    <span key={i} className="chip">{s}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <button className="proj-nav" aria-label="Next" onClick={next}>▶</button>
    </div>
  );
}


