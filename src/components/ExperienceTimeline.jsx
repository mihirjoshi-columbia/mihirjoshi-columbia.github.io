const ExperienceTimeline = () => {
  const entries = (window.EXPERIENCE_ENTRIES || []).slice().sort((a, b) => {
    const ay = a.endISO ? Date.parse(a.endISO) : 0;
    const by = b.endISO ? Date.parse(b.endISO) : 0;
    return by - ay;
  });

  function tenure(a){
    if(!a.startISO || !a.endISO) return null;
    const ms = Math.max(0, Date.parse(a.endISO) - Date.parse(a.startISO));
    const months = Math.round(ms / (1000*60*60*24*30));
    return months > 0 ? `${months} mos` : null;
  }
  const categoryLabel = { quant: 'Quant', swe: 'SWE', research: 'Research', founder: 'Founder' };
  return (
    <>
      <div className="section-head">
        <h2>Experience</h2>
        <p>Selected roles & impact</p>
      </div>
      <div className="timeline" role="list" aria-label="Experience timeline">
        {entries.map((x) => (
          <div key={x.id} className="timeline-item" role="listitem">
            <span className="timeline-node" aria-hidden="true"></span>
            <span className="timeline-connector" aria-hidden="true"></span>
            <article className="card timeline-card">
              <div className="meta-row">
                <span className="meta">{x.start} – {x.end}</span>
                <span className="sep">•</span>
                <span className="meta">{x.location}</span>
                {tenure(x) && (<><span className="sep">•</span><span className="meta">{tenure(x)}</span></>)}
              </div>
              <h3 style={{marginTop:8}}>{x.role} · {x.company}</h3>
              <div className="meta-chips" style={{marginTop:8}}>
                {x.category && (<span className="chip">{categoryLabel[x.category] || x.category}</span>)}
              </div>
              {x.bullets && x.bullets.length > 0 && (
                <ul>
                  {x.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              )}
            </article>
          </div>
        ))}
      </div>
    </>
  );
};


