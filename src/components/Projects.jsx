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

  function draw(only=false){
    const canvas=canvasRef.current; if(!canvas) return; const ctx=canvas.getContext('2d');
    const {grid,snake,food}=stateRef.current; const size=Math.min(canvas.clientWidth, 420); canvas.width=size; canvas.height=420;
    const cell = Math.floor(Math.min(canvas.width, canvas.height)/grid);
    // background grid with blue tint
    ctx.fillStyle='#0b0e14'; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle='rgba(80,120,200,0.08)'; ctx.lineWidth=1; for(let i=0;i<=grid;i++){ const p=i*cell; ctx.beginPath(); ctx.moveTo(p,0); ctx.lineTo(p,canvas.height); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0,p); ctx.lineTo(canvas.width,p); ctx.stroke(); }
    // food
    ctx.fillStyle='rgba(64,156,255,0.95)';
    ctx.beginPath(); ctx.arc((food.x+0.5)*cell,(food.y+0.5)*cell, Math.max(4, cell*0.35), 0, Math.PI*2); ctx.fill();
    // snake
    for(let i=snake.length-1;i>=0;i--){
      const s=snake[i]; const t=i/snake.length; const glow= i===0 ? 10 : 0;
      ctx.shadowColor='rgba(64,156,255,0.25)'; ctx.shadowBlur=glow;
      ctx.fillStyle=`hsla(210, 90%, ${Math.floor(60- t*25)}%, ${0.98})`;
      ctx.fillRect(s.x*cell+1, s.y*cell+1, cell-2, cell-2);
      ctx.shadowBlur=0;
    }
    // head eye
    const head=snake[0]; ctx.fillStyle='#0b0e14'; ctx.fillRect(head.x*cell+Math.floor(cell*0.6), head.y*cell+Math.floor(cell*0.25), Math.max(2,Math.floor(cell*0.15)), Math.max(2,Math.floor(cell*0.15)));
    // flash effect
    if(fxRef.current.flash>0){ ctx.fillStyle=`rgba(64,156,255,${fxRef.current.flash})`; ctx.fillRect(0,0,canvas.width,canvas.height); fxRef.current.flash=Math.max(0, fxRef.current.flash-0.06); }
    if(only) return;
  }

  function update(){
    const now=performance.now(); if(now-lastTickRef.current < speedMs){ rafRef.current=requestAnimationFrame(update); return; }
    lastTickRef.current=now;
    const {grid,snake}=stateRef.current; const dir=dirRef.current;
    const head={x:(snake[0].x+dir.x+grid)%grid, y:(snake[0].y+dir.y+grid)%grid};
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

  React.useEffect(()=>{ draw(true); },[]);
  React.useEffect(()=>{
    cancelAnimationFrame(rafRef.current);
    if(running){ rafRef.current=requestAnimationFrame(update); }
    return ()=>cancelAnimationFrame(rafRef.current);
  }, [running]);

  return (
    <>
      <div className="section-head">
        <h2>Snake</h2>
        <p>Use WASD/arrow keys. Space to pause.</p>
      </div>
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
      </div>
    </>
  );
};


