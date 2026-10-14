---
title: 'Zero to Web Hero'
date: '2024-09-29'
context: 'Sunway Tech Club'
role: 'Education Department Committee'
summary: 'An eight-session web talk series teaching the MEVN stack, Docker and deployment, ending in a todo app with authentication. I covered the backend, Dockerisation and deployment, and a teammate covered the frontend.'
tags: ['Vue', 'Express', 'TypeScript', 'MongoDB', 'Node.js', 'Docker']
links:
  - label: 'Code'
    url: 'https://github.com/Spimy/zero-to-web-hero'
---

## Mission briefing

Sunway Tech Club wanted an event to teach web development. We did not want to rush it into a single session, so we broke it into eight. The series was open to anyone, whatever their experience, and people could join whichever sessions they wanted and download the resources to follow along.

Alex and I wanted the series to be easy for beginners to follow, so we stayed as close to vanilla HTML, CSS and JavaScript as we could. That is why we chose the MEVN stack. Vue was growing in popularity, so it was no longer only React, and Vue works closer to vanilla HTML, CSS and JavaScript than the way JSX does things.

We left Svelte out on purpose. Svelte 4 had come out in June 2023, and Svelte 5 was on the way with its new runes syntax, so the syntax was set to change again, which would have confused beginners.

## Field notes

Over the eight sessions, attendees built a full stack todo app with authentication:

1. **Introduction to Web Development.** HTML and CSS fundamentals, plus VSCode tips, to build the todo page.
2. **Getting Started with Vue.** Components, props, slots, reactivity and the other Vue basics.
3. **Building Frontend with Vue.** Turning the todo page into a Vue app, with login and register pages.
4. **Express.js and MongoDB.** A REST API for notes and their to-do items, written in TypeScript, with a project structure that separates concerns.
5. **Authentication.** JWT access and refresh tokens, password hashing and salting, and middleware to protect the API.
6. **Linking Frontend with Backend.** Connecting the Vue app to the API.
7. **Dockerizing the Project.** Docker images and containers, a Dockerfile, and Docker Compose to run the whole project.
8. **NGINX and Deployment.** Putting the project on an Oracle Cloud instance behind NGINX, with a DNS record and a free TLS certificate from [Let's Encrypt](https://letsencrypt.org/).

## Timeline

The series was planned for October to December 2024, with a week between sessions. Alex and I were both busy with uni at Sunway University, and between assignments, exams and timetables that did not line up, several sessions were pushed back. Some gaps were the planned week, but others stretched to two or three weeks, and the last session was not until February 2025. The long breaks lowered the turnout in the later sessions, but the series started strong with a full house.

## Squad

[Alex Chee Kai Hong](https://www.linkedin.com/in/alexcheekaihong/) taught the frontend sessions: 1, 2, 3 and 6. I taught the backend, Docker and deployment sessions: 4, 5, 7 and 8.
