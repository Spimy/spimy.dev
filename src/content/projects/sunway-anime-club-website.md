---
title: 'Anime Club Website'
date: '2025-03-10'
context: 'Sunway University Anime Club'
role: 'Head IT Manager'
summary: "A registration portal that replaced the club's Google Forms sign-up and its leaked invite links. Members log in with Discord and registered members are added to the server automatically. It also takes event attendance with rotating QR codes and schedules announcements to Discord and Instagram."
tags: ['SvelteKit', 'TypeScript', 'PostgreSQL', 'Supabase', 'Docker']
links:
  - label: 'Live'
    url: 'https://sunwayanime.com'
---

## Mission briefing

People joined the club's Discord server through an invite link. Some students missed the link, and later spammers and scammers got in through a leaked one.

## Field notes

- **A temporary site first.** Students entered their student ID or email so we could confirm they were in the club, and only then got a link to join the Discord server. The link expired.
- **A custom Discord bot.** It handled member registration and made onboarding and verification quicker, so new members could get full access to the server sooner.
- **The full website.** Registration moved from Google Forms to the site, with a database behind it. Members log in with Discord, and as long as they are a registered member, the site adds them to the server directly. There is no invite link left to leak.

## Timeline

The digitalisation project was planned from late 2023 to early 2024, but work on the website only started on 10 March 2025. The backend took three days, followed by a week of integrating the UI and about a month of testing and refinement. I built it as my term as IT manager was coming to an end and spammers were still getting in through the leaked invite link.

## Squad

I was Head IT Manager of the club. [Alex Chee Kai Hong](https://www.linkedin.com/in/alexcheekaihong/), the other IT manager, handled most of the frontend.
