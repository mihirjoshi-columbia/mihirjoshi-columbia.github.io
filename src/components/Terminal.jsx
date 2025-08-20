const Terminal = () => {
  const [lines, setLines] = React.useState(["Welcome to mihir@columbia — type 'help' to get started."]); 
  const [value, setValue] = React.useState("");
  const outRef = React.useRef(null);
  React.useEffect(() => { if(outRef.current){ outRef.current.scrollTop = outRef.current.scrollHeight; } }, [lines]);
  
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
      <div className="hero-foreground">
        <div className="hero-grid">
          <div className="terminal-wrap">
            <div className="hero-intro">
              <h1 className="hero-title">{window.SITE?.hero?.title || ""}</h1>
              <p className="hero-subtitle">{window.SITE?.hero?.subtitle || ""}</p>
              {Array.isArray(window.SITE?.hero?.skills) && window.SITE.hero.skills.length > 0 && (
                <div className="skills">
                  <div className="skills-chips">
                    {window.SITE.hero.skills.map((s, i) => (
                      <span key={i} className="chip">{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
          <aside className="profile-card" aria-label="Profile summary">
            <img className="profile-headshot" src="Headshot.png" alt="Headshot of Mihir Joshi" loading="eager" width="320" height="320" />
            <div>
              <p className="profile-meta">About</p>
              <h3 className="profile-name">Mihir Joshi</h3>
              <p className="profile-about">Columbia CS — systems, trading infra, and clean tooling. Building fast, reliable things.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};


