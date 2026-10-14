---
title: 'Subtitles'
date: '2020-09-23'
context: 'Collaboration with Eray Koschell'
status: 'Broken'
summary: 'A web platform for downloading subtitles for movies, TV shows and anime without clutter or ads. The APIs it depends on have since changed and I have not updated the code, so it no longer works.'
tags: ['Python', 'Django', 'Vue', 'TypeScript', 'Nginx']
links:
  - label: 'Demo'
    url: 'https://subtitles.spimy.dev'
  - label: 'Code'
    url: 'https://github.com/iNeedSubs/legacy'
---

## Mission briefing

Eray and I both found the existing websites for downloading subtitles cluttered, especially with ads, and their designs outdated. We built Subtitles with one simple goal: to search and download subtitles efficiently, without distractions.

## Field notes

- **The backend.** I built it, integrating the OpenSubtitles and TMDB APIs to retrieve the data.
- **The frontend.** Eray built it in Vue to make browsing a good experience.

## Timeline

The project started in September 2020 and was first hosted on Heroku. In March 2023 we moved it to Oracle Cloud Infrastructure because of Heroku's payment policy changes. The move taught me Bash over SSH and how to set up a working web server with NGINX.

We had planned a rebuild with cleaner code, which would also have fixed the broken APIs. That is why the repo moved to an organisation and was renamed `legacy`. In the end it never happened, because life got busy for both of us.

## Squad

Built with [Eray Koschell](https://eraykoschell.dev/). Working on it together improved our technical skills, our teamwork and our communication.
