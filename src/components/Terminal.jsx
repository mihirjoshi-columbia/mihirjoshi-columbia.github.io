const Terminal = () => {
  const [lines, setLines] = React.useState(["Welcome to mihir@columbia — type 'help' to get started."]); 
  const [value, setValue] = React.useState("");
  const outRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const webglRef = React.useRef(null);
  React.useEffect(() => { if(outRef.current){ outRef.current.scrollTop = outRef.current.scrollHeight; } }, [lines]);
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    let rafId; let running = true; let phase = 0; let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const parent = canvas.parentElement || canvas;
    function resize(){
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = parent.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width * dpr));
      const h = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function draw(){
      if(!running) return;
      // Clear in device pixels irrespective of current transform
      ctx.save();
      ctx.setTransform(1,0,0,1,0,0);
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.restore();
      const w = canvas.width / dpr, h = canvas.height / dpr;
      if (w <= 0 || h <= 0) { rafId = requestAnimationFrame(draw); return; }
      // Subtle backdrop to ensure visibility even on very dark screens
      const grad = ctx.createLinearGradient(0,0,0,h);
      grad.addColorStop(0, 'rgba(30, 40, 70, 0.10)');
      grad.addColorStop(1, 'rgba(20, 30, 60, 0.06)');
      ctx.fillStyle = grad;
      ctx.fillRect(0,0,w,h);
      const cx = w/2, cy = h/2;
      const radius = Math.min(w, h) * 0.42;
      const curves = 22;
      for(let i=0;i<curves;i++){
        const a = 2 + (i%5)*0.3;
        const b = 3 + ((i*2)%7)*0.25;
        // Blue family tones
        ctx.beginPath();
        for(let t=0;t<Math.PI*2; t+=0.02){
          const x = cx + radius * Math.sin(a*t + phase + i*0.12) * Math.cos(t*0.5);
          const y = cy + radius * Math.sin(b*t + phase*0.9 + i*0.07);
          if(t===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
        }
        const l = 56 + (i%4)*5; // slight variance
        const alpha = 0.45;
        ctx.strokeStyle = `hsla(210, 85%, ${l}%, ${alpha})`;
        ctx.shadowColor = 'rgba(64, 156, 255, 0.15)';
        ctx.shadowBlur = 10;
        ctx.lineWidth = 1.25;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
      phase += 0.012;
      rafId = requestAnimationFrame(draw);
    }
    const ro = new ResizeObserver(resize); ro.observe(parent);
    window.addEventListener('resize', resize);
    resize(); draw();
    return () => { running = false; cancelAnimationFrame(rafId); ro.disconnect(); window.removeEventListener('resize', resize); };
  }, []);

  // Backup: WebGL particles (if 2D canvas too subtle on some displays)
  React.useEffect(() => {
    const glCanvas = document.createElement('canvas');
    glCanvas.className = 'hero-bg-canvas';
    webglRef.current = glCanvas;
    const host = document.querySelector('.hero-area');
    if (!host) return;
    host.insertBefore(glCanvas, host.firstChild);
    const gl = glCanvas.getContext('webgl', { premultipliedAlpha: true, alpha: true });
    if(!gl) { glCanvas.remove(); return; }

    // Simple point field shader (blue glow)
    const vs = `
      attribute vec2 a; uniform vec2 r; uniform float t;
      void main(){
        float x = a.x + 0.05 * sin(0.7*a.y + t*0.6);
        float y = a.y + 0.05 * cos(0.9*a.x + t*0.5);
        gl_Position = vec4(vec2(2.0*(vec2(x,y)/r - 0.5)), 0.0, 1.0);
        gl_PointSize = 1.5;
      }
    `;
    const fs = `
      precision mediump float; void main(){
        float d = length(gl_PointCoord - vec2(0.5));
        float a = smoothstep(0.5, 0.0, d);
        gl_FragColor = vec4(0.35, 0.55, 1.0, 0.25*a);
      }
    `;
    function compile(type, src){ const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; }
    const prog = gl.createProgram(); gl.attachShader(prog, compile(gl.VERTEX_SHADER, vs)); gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(prog); gl.useProgram(prog);
    const locA = gl.getAttribLocation(prog, 'a');
    const locR = gl.getUniformLocation(prog, 'r');
    const locT = gl.getUniformLocation(prog, 't');

    const COUNT = 1200;
    const data = new Float32Array(COUNT*2);
    for(let i=0;i<COUNT;i++){ data[2*i] = Math.random(); data[2*i+1] = Math.random(); }
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(locA); gl.vertexAttribPointer(locA, 2, gl.FLOAT, false, 0, 0);

    let rafId; let start=performance.now();
    function resize(){ const r = host.getBoundingClientRect(); glCanvas.width = r.width; glCanvas.height = r.height; gl.viewport(0,0,glCanvas.width, glCanvas.height); }
    function frame(){ const now = performance.now(); const t = (now-start)/1000; gl.uniform2f(locR, glCanvas.width, glCanvas.height); gl.uniform1f(locT, t); gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.POINTS, 0, COUNT); rafId = requestAnimationFrame(frame); }
    const ro = new ResizeObserver(resize); ro.observe(host); window.addEventListener('resize', resize); resize(); frame();
    return () => { cancelAnimationFrame(rafId); ro.disconnect(); window.removeEventListener('resize', resize); glCanvas.remove(); };
  }, []);
  const FILE_LIST = `aboutme.txt  interests.txt  surprise*\nexperience/  projects/  contact/`;
  function goto(section){ const el = document.getElementById(section); if(el) el.scrollIntoView({behavior:'smooth', block:'start'}); }
  function run(cmd){
    const raw = cmd.trim(); if(!raw) return;
    const tokens = raw.trim().split(' ').filter(Boolean); const head = tokens[0]; const arg = tokens[1];
    const append = (text) => setLines(prev => [...prev, `$ ${raw}`, ...(text? [text]: [])]);
    if(head === 'help'){ append(`Available: ls, cat <file>, cd <dir>, ./surprise, clear\nFiles: aboutme.txt, interests.txt\nDirs: experience/ projects/ contact/`); }
    else if(head === 'ls'){ append(FILE_LIST); }
    else if(head === 'cat'){
      if(!arg) append("cat: missing file operand");
      else if(window.SITE?.files?.[arg]) append(window.SITE.files[arg]);
      else append(`cat: ${arg}: No such file`);
    } else if(head === 'cd'){
      if(["experience","projects","contact"].includes(arg)){ append(""); goto(arg); }
      else append(`cd: ${arg}: Not a directory`);
    } else if(head === './surprise'){
      append("Launching video…"); window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ','_blank');
    } else if(head === 'clear'){ setLines([]); }
    else { append(`command not found: ${head}`); }
  }
  function onKeyDown(e){ if(e.key==='Enter'){ run(value); setValue(''); } }
  return (
    <div className="hero-area">
      <canvas ref={canvasRef} className="hero-bg-canvas" aria-hidden="true"></canvas>
      <div className="hero-foreground">
        <div className="terminal-wrap">
          <div className="terminal" role="region" aria-label="Interactive terminal">
            <div className="term-topbar">
              <span className="dot r"></span><span className="dot y"></span><span className="dot g"></span>
              <span className="term-title">bash — ~</span>
            </div>
            <div className="term-body" ref={outRef}>
              <div className="term-output">
                {lines.map((ln, i) => <div key={i}>{ln}</div>)}
                <div className="term-line">
                  <span className="prompt">mihir@columbia:~$</span>
                  <input className="input" autoFocus value={value} onChange={e=>setValue(e.target.value)} onKeyDown={onKeyDown} aria-label="terminal input" />
                </div>
                <div className="help">Try: <code>ls</code>, <code>cat aboutme.txt</code>, <code>cd experience</code>, <code>./surprise</code></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


