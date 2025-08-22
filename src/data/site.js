window.SITE = {
  hero: {
    title: "Hi! My name is Mihir",
    subtitle: "Columbia CS. Focused on low-latency systems, core systems, and impactful work.",
    skills: [
      "C++", "Rust", "TypeScript", "Python",
      "Systems", "Low-latency", "Backend",
      "PostgreSQL", "Vim", "Infra",
    ]
  },
  files: {
    "aboutme.txt": `Hi, I'm Mihir. I'm a Columbia student who loves systems, trading infra, and building clean tools. This site is a small React app deployed on GitHub Pages.

Try: cd experience | cd projects | cd contact`,
    "interests.txt": `Interests: low-latency systems, C++/Rust, data viz, sports analytics, and good coffee.`
  },
  projects: [
    {
      title: "DealHive",
      tag: "Platform",
      blurb: "Deal origination and execution platform streamlining M&A workflows from sourcing to close.",
      bullets: [
        "Unified pipeline for deal sourcing, diligence checklists, and stakeholder communications",
        "Embedded fee-split agreements with role-based access and audit trails",
        "Realtime collaboration with activity feed, document previews, and granular permissions"
      ],
      stack: ["TypeScript", "Next.js", "PostgreSQL", "Prisma", "AWS"],
      repo: "#",
      demo: "#"
    },
    {
      title: "Kalshi Dashboard",
      tag: "Trading",
      blurb: "High-signal dashboard for event markets with fast data ingestion and custom risk views.",
      bullets: [
        "Streaming market data ETL with snapshot + delta architecture (<200ms median lag)",
        "Greeks-like risk surfaces and scenario analysis for event contracts",
        "Desktop packaging via Electron with secure auto-updates and offline cache"
      ],
      stack: ["Rust", "C#", ".NET", "Electron", "PostgreSQL"],
      repo: "#",
      demo: "#"
    },
    {
      slug: "round-robin-scheduler",
      title: "Round-Robin Scheduler",
      tag: "Systems",
      blurb: "Implemented a preemptive round-robin scheduler for process time-slicing and fairness.",
      bullets: [
        "Built core scheduling loop with fixed quantum and context-switch accounting",
        "Designed ready queue and time accounting to ensure starvation-free fairness",
        "Verified correctness with adversarial workloads and stress scenarios"
      ],
      stack: ["C/eBPF", "Operating Systems", "POSIX", "Linux"],
      repo: "#",
      demo: "#"
    },
    {
      slug: "lightweight-http-server",
      title: "Lightweight HTTP Server",
      tag: "Systems",
      blurb: "A minimal HTTP/1.1 server built entirely in C with epoll and zero-copy sendfile.",
      bullets: [
        "Implements parsing, routing, and static file serving with keep-alive",
        "Uses non-blocking sockets + epoll for high concurrency on a single thread",
        "Benchmarked with wrk; stable under thousands of concurrent connections"
      ],
      stack: ["C", "POSIX"],
      repo: "https://gist.github.com/mihirjoshi-columbia/a1cfe4c9042a94919107c81d3f5129f2"
    }
  ],
  contact: {
    email: "mnj2122@columbia.edu",
    linkedin: "https://linkedin.com/in/mihirjoshi-columbia",
    github: "https://github.com/mihirjoshi-columbia/",
    calendly: "https://calendly.com/mnj2122-columbia"
  }
};


