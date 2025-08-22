const { useEffect, useRef } = React;

function useSectionObserver(ids) {
  const navEl = useRef(null);
  useEffect(() => {
    navEl.current = document.getElementById("top-nav");
    const links = Array.from(navEl.current.querySelectorAll("a"));
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const id = entry.target.getAttribute("id");
          if (entry.isIntersecting) {
            links.forEach(a => a.classList.toggle("active", a.dataset.id === id));
          }
        });
      },
      { root: null, threshold: 0.6 }
    );
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids.join(",")]);
  return navEl;
}

const Section = ({ id, children, ariaLabel }) => (
  <section id={id} aria-label={ariaLabel}>
    <div className="container">{children}</div>
  </section>
);

const Contact = () => (
  <div className="contact">
    <div className="section-head" style={{justifyContent:'center'}}>
      <h2>Contact</h2>
    </div>
    <p className="subtitle">Open to collaboration, roles, and good ideas.</p>
    <div style={{display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap'}}>
      <a className="cta" href={`mailto:${window.SITE?.contact?.email || ''}`}>Email</a>
      <a className="cta" href={window.SITE?.contact?.linkedin || '#'} target="_blank" rel="noreferrer">LinkedIn</a>
      <a className="cta" href={window.SITE?.contact?.github || '#'} target="_blank" rel="noreferrer">GitHub</a>
      {window.SITE?.contact?.calendly && (
        <a className="cta" href={window.SITE.contact.calendly} target="_blank" rel="noreferrer">Book 30‑min chat</a>
      )}
    </div>
  </div>
);

function App() {
  useSectionObserver(["home","experience","projects","contact"]);
  return (
    <>
      <Section id="home" ariaLabel="Landing"><Terminal/></Section>
      <Section id="experience" ariaLabel="Experience"><ExperienceTimeline/></Section>
      <Section id="projects" ariaLabel="Projects">
        <div className="section-head" style={{justifyContent:'space-between'}}>
          <h2>Projects</h2>
          <p className="subtitle">Selected builds</p>
        </div>
        <Projects/>
      </Section>
      <Section id="contact" ariaLabel="Contact"><Contact/></Section>
    </>
  );
}


