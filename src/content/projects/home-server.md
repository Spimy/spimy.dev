---
title: 'Home Server'
date: '2026-10'
context: 'Personal project'
summary: 'An old laptop turned into a home server, running Jellyfin and a custom dashboard in Docker behind Traefik. My home network sits behind CGNAT, so the server dials out to my VPS over WireGuard, and family get their own isolated tunnel to watch from anywhere.'
tags: ['Docker', 'Traefik', 'WireGuard']
---

## Mission briefing

I had an old Acer laptop doing nothing. It had already been repaired once, when its hard drive failed and was swapped for an SSD, so I backed up what mattered, gave it a light dusting and wiped it for Ubuntu. I wanted a media server my family could use from anywhere and a dashboard to keep an eye on everything, all managed from my phone.

The catch is that my home internet runs through a SIM router behind CGNAT, so nothing on the internet can connect in to it. Every part of the setup had to work around that.

## Field notes

- **Compose files where I want them.** Everything runs in Docker Engine, managed through Dockge. I picked it because it keeps each stack as a plain compose file in a folder I choose, so I can still edit, back up and version everything by hand.
- **Dialling out instead of in.** Since nothing can reach my home network directly, the server connects out to my VPS, which acts as the WireGuard hub. My phone connects to the same hub, so I can manage the server from anywhere as if I were at home.
- **A separate tunnel for family.** My parents can watch Jellyfin remotely through a second WireGuard network that only allows traffic between its own peers. They can reach the media server, but nothing else on my VPS.
- **Routing and HTTPS.** Traefik routes each service by its subdomain, the same label-based setup I use on my VPS. Let's Encrypt's usual HTTP check can't reach a server behind CGNAT, so certificates come from a DNS challenge through Cloudflare instead.
- **Hardware transcoding.** Jellyfin uses the laptop's Intel integrated GPU to transcode video, so streaming to a weak device doesn't max out the CPU.
- **A dashboard that does things.** The Glance dashboard shows server health from Beszel, plus custom widgets I built on AniList's GraphQL API to track the anime I'm watching. Each one has a button that marks the next episode as watched. Glance strips script tags from widgets, so getting that button to work took a workaround.

## What broke

- **A boot loop.** While fixing the laptop's UEFI boot entry, I copied a fallback boot file that didn't belong there, and the laptop got stuck rebooting. Removing it and reinstalling GRUB fixed it.
- **The Wi-Fi bottleneck.** The built-in Wi-Fi card connected at over 390 Mbit/s but never moved more than about 20 Mbit/s of real data. I tested it with iperf3, swapped firmware and compared it against USB tethering, and narrowed it down to a limit of the card and its driver, not my network. For now, an old phone on Wi-Fi, plugged in for USB tethering, gets the server far better speeds. A better USB Wi-Fi adapter is the long-term fix.
- **PCIe errors.** The kernel log filled with PCIe bus errors, which turned out to be PCIe power management. Turning it off with a kernel parameter stopped them.
- **Sleeping on the job.** Closing the lid suspended the laptop, taking every service down with it. I overrode the lid setting and disabled sleep entirely.
