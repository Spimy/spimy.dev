---
title: 'BursaGo'
date: '2026-05'
context: 'CSC3209 Software Architecture and Design Patterns · Team of 5'
role: 'Prototype Developer'
summary: 'A prototype of a mobile stock trading platform for students and beginners, built in SvelteKit. Instead of a Figma mockup, I coded it, because that felt faster and more fun than dragging things around.'
tags: ['SvelteKit', 'TypeScript', 'Docker']
links:
  - label: 'Demo'
    url: 'https://bursago.spimy.dev'
  - label: 'Code'
    url: 'https://github.com/Spimy/bursago-prototype'
---

## Mission briefing

For CSC3209 Software Architecture and Design Patterns, our group chose a project, planned out its requirements, and then implemented a few of them as a prototype to show the interactions that would happen. Ours was a mobile trading platform for students and beginners.

## Field notes

A Figma prototype would have done the job, but coding it was faster and more fun than dragging things around. It runs entirely in the browser with no backend, so it shows how the app behaves rather than the infrastructure behind it.

- **A live watchlist.** Prices update on a timer, with a chart of each stock's change since the market opened. A High Load Mode swaps the charts for a placeholder to show how the app would degrade under load.
- **Price alerts.** Pick a target price with a number pad, and the app notifies you the moment the price crosses it.
- **Market and limit orders.** A market order executes straight away. A limit order waits until the price reaches its target. Either way, the wallet, holdings and history update together.
- **An identity check step.** A one-time password step stands in for real identity verification.

I set up a dev container for local development and a Dockerfile for deploying to Vercel. That way anyone on the team who wanted to run it could open it in a VS Code dev container, or build the Dockerfile, without installing anything else by hand.

## Squad

Our group of five wrote the requirements and the architecture, an event-driven design with a utility tree to prioritise the requirements. I was the UX and usability architect and built the prototype.
