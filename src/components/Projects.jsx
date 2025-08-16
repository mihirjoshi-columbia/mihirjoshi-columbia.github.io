const Projects = () => {
  const list = window.SITE?.projects || [];
  return (
    <>
      <div className="section-head">
        <h2>Projects</h2>
        <p>Things I built or shipped</p>
      </div>
      <div className="projects-grid">
        {list.map((p, i) => (
          <article key={i} className="project-card" aria-label={p.title}>
            <div className="project-head">
              <span className="project-tag">{p.tag}</span>
              <h3 className="project-title">{p.title}</h3>
            </div>
            <p className="project-blurb">{p.blurb}</p>
          </article>
        ))}
      </div>
    </>
  );
};


