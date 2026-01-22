export interface Project {
  name: string;
  link: string;
  category: string;
  featured: boolean;
  one_liner: string;
  outcomes: string;
  stack: string;
  proof: string;
}

export const projects: Project[] = [
  {
    name: "Homelab Virtualization & Services",
    link: "https://github.com/YOURUSERNAME/REPO",
    category: "Infrastructure",
    featured: true,
    one_liner: "Proxmox-based lab hosting core services with backups, monitoring, and segmented networking.",
    outcomes: "Improved service uptime, standardized deployments, simplified recovery.",
    stack: "Proxmox, Linux, Docker, ZFS, Networking",
    proof: "Architecture diagram + screenshots + config snippets (redacted)"
  },
  {
    name: "Automated Backups & Restore Testing",
    link: "https://github.com/YOURUSERNAME/REPO",
    category: "Automation",
    featured: true,
    one_liner: "Backup automation with verification and documented restore drills.",
    outcomes: "Reduced manual effort, faster restores, clearer incident response.",
    stack: "Shell/Python, cron/systemd timers, storage tooling",
    proof: "Runbook + logs + demo video (optional)"
  },
  {
    name: "IT Operations Documentation Pack",
    link: "https://github.com/YOURUSERNAME/REPO",
    category: "Documentation/PM",
    featured: false,
    one_liner: "Runbooks, checklists, and change-control templates for consistent support.",
    outcomes: "Faster onboarding, fewer repeat issues, improved handoffs.",
    stack: "Markdown, diagrams, templates",
    proof: "Docs + examples"
  }
];
