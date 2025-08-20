window.SITE = {
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
      link: "#"
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
      link: "#"
    },
    {
      title: "Geospatial Live",
      tag: "Civic Tech",
      blurb: "Operational dashboard for real-time infrastructure telemetry and incident response.",
      bullets: [
        "Device twin model with health scoring and anomaly detection on location/time features",
        "Vector tiles rendering for millions of points with smooth zoom and cluster aggregation",
        "Role-based alerts with runbooks, on-call rotations, and SLA reporting"
      ],
      stack: ["Python", "FastAPI", "Kafka", "Mapbox GL", "TimescaleDB"],
      link: "#"
    }
  ],
  contact: {
    email: "mnj2122@columbia.edu",
    linkedin: "https://linkedin.com/in/mihirjoshi-columbia",
    github: "https://github.com/mihirjoshi-columbia/"
  }
};


