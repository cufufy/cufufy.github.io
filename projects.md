---
layout: page
title: Projects
---

# Projects

{% assign cats = "Infrastructure,Automation,Documentation/PM,Software/Tools" | split: "," %}

{% for cat in cats %}
## {{ cat }}

{% for p in site.data.projects %}
{% if p.category == cat %}
### [{{ p.name }}]({{ p.link }})
{{ p.one_liner }}

- **Outcomes:** {{ p.outcomes }}
- **Stack:** {{ p.stack }}
- **Proof:** {% if p.proof %}{{ p.proof }}{% else %}Repo + screenshots{% endif %}

{% endif %}
{% endfor %}

{% endfor %}
