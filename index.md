---
layout: page
title: Home
---

# Daivi
**IT • Project Management • Systems • Automation**

Short intro (2–3 sentences):
- What you do
- What you’re strong at
- What you’re looking for (roles, contract, etc.)

---

## Featured Projects
{% for p in site.data.projects %}
{% if p.featured == true %}
### [{{ p.name }}]({{ p.link }})
**{{ p.category }}** — {{ p.one_liner }}

**Outcomes:** {{ p.outcomes }}

**Stack:** {{ p.stack }}
{% endif %}
{% endfor %}

---

## Skills Snapshot
- **IT:** Networking, Windows/Linux, virtualization, backups, identity/access, monitoring
- **Project Management:** scoping, stakeholder comms, documentation, delivery, risk mgmt
- **Automation:** scripting, CI/CD basics, infrastructure-as-code (if applicable)

---

## Contact
- Email: **you@example.com**
- LinkedIn: (link)
- GitHub: (link)
