const ExperienceTimeline = () => {
  const entries = (window.EXPERIENCE_ENTRIES || []).slice().sort((a, b) => {
    // Sort by end date (current / later first). For simplicity, compare by year strings where possible.
    const ay = (a.end || "").match(/\d{4}/);
    const by = (b.end || "").match(/\d{4}/);
    return (by ? parseInt(by[0], 10) : 0) - (ay ? parseInt(ay[0], 10) : 0);
  });
  return (
    <>
      <div className="section-head">
        <h2>Experience</h2>
        <p>Selected roles & impact</p>
      </div>
      <div className="timeline" role="list" aria-label="Experience timeline">
        {entries.map((x) => (
          <div key={x.id} className="timeline-item" role="listitem">
            <article className="card timeline-card">
              <div className="meta-row">
                <span className="meta">{x.start} – {x.end}</span>
                <span className="sep">•</span>
                <span className="meta">{x.location}</span>
              </div>
              <h3 style={{marginTop:8}}>{x.role} · {x.company}</h3>
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


