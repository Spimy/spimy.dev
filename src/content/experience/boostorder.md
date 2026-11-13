---
company: 'Boostorder'
logo: 'boostorder'
role: 'Software Engineer Intern'
type: 'Internship'
location: 'Kuala Lumpur, MY'
start: '2026-01'
end: '2026-04'
summary: 'First production codebase: a Laravel and Vue.js platform, worked on in an agile team with QA and staging.'
url: 'https://www.boostorder.com'
bonuses:
  - { label: 'Codebase', before: 'Personal', after: 'Production' }
  - { label: 'Workflow', before: 'Solo', after: 'Agile team + QA' }
  - { label: 'Catalog load', before: '~12 s', after: '~2 s' }
  - { label: 'Catalog payload', before: '3 MB', after: '500 KB' }
tags: ['Laravel', 'PHP', 'MySQL', 'Vue', 'Docker']
---

- Shipped full-stack Laravel and Vue.js features from Figma specs, including an e-invoicing compliance feature.
- Wrote Laravel data migrations that transformed large existing tables in chunks, avoiding memory exhaustion and table locks, with `down()` logic to roll the data changes back. Tested locally and in staging before release.
- Fixed an urgent client bug that blocked field representatives from checking in, by calculating day boundaries in each user's local timezone instead of server UTC.
- Found the cause of a long-standing "cannot reproduce" date bug (`0000-00-00` values): a MySQL `sql_mode` difference between environments, written up as an RCA for the senior team.
- Unblocked checkout for fully discounted carts (such as free gifts), which had been stuck at the payment step, across all supported currencies.
- Closed a security gap found by QA by moving e-invoice API routes behind authentication middleware.
