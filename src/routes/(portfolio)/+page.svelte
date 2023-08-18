<script lang="ts">
	import Avatar from '$lib/components/avatar.svelte';
	import ProjectDisplay from '$lib/components/project-display.svelte';
	import { pages } from '$lib/global';
	import type { Technology } from '$lib/types/technology';
	import type { PageServerData } from './$types';

	export let data: PageServerData;
	$: ({ age, experienceYears, projects, technologies } = data);

	function chunk(array: Technology[], size: number): Technology[][] {
		if (!array) return [];
		const firstChunk = array.slice(0, size);
		if (!firstChunk.length) return [array];
		return [firstChunk].concat(chunk(array.slice(size, array.length), size));
	}

	const contactPath = pages.find((page) => page.id == 'contact')?.path;
	const projectsPath = pages.find((page) => page.id == 'projects')?.path;

	const title = "Spimy's Portfolio - Home";
	const description = 'The hub to know more about me and the projects that I have worked on.';
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />

	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content="http://www.spimy.dev" />

	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
</svelte:head>

<section class="hero">
	<div class="hero__avatar"><Avatar /></div>
	<div class="hero__info">
		<h1>Hi there!</h1>
		<h2>I'm Spimy</h2>
		<p>
			At least that's the username that I've grown quite fond of. My name is actually William and I
			am {age} years old. Coding since 2016 (~{experienceYears} years of experience) and I got into programming
			for trying to code a
			<a href="https://spigotmc.org" rel="external" target="_blank">Spigot plugin</a>
			for
			<a href="https://minecraft.net" rel="external" target="_blank">Minecraft</a>; making Java my
			first programming language.
		</p>
		<a href={contactPath} class="hero__cta btn">Contact Me »</a>
	</div>
</section>

{#if technologies.length > 0}
	<section class="skills">
		<h1>Skills</h1>
		<div class="skills__container">
			<div class="skills__container__texture" />
			<div class="skills__container__texture" />
			<div class="skills__container__hex-grid">
				{#each chunk(technologies, 3) as skillsList, i (i)}
					<div
						class={i % 2 === 0
							? 'skills__container__hex-grid--a'
							: 'skills__container__hex-grid--b'}
					>
						{#each skillsList as skill, j (j)}
							<a href="{projectsPath}?pages=1&technologies={skill.name}">
								<div class="skills__container__hex-grid__hex">
									<img src={skill.icon} alt="{skill.name} logo" />
								</div>
							</a>
						{/each}
					</div>
				{/each}
			</div>
			<div class="skills__container__texture" />
			<div class="skills__container__texture" />
		</div>
	</section>
{/if}

<section class="projects">
	<h1><span>Latest</span><br />Projects</h1>
	<div class="projects__info">
		{#if projects.length > 0}
			<div class="projects__info__grid">
				{#each projects as project, index (index)}
					<ProjectDisplay {project} />
				{/each}
			</div>
		{:else}
			<h2 class="projects__info__no-projects">No projects have been uploaded yet.</h2>
		{/if}
		<a href={projectsPath} class="projects__info__cta btn">View More </a>
	</div>
</section>

<style lang="scss">
	@use '../../scss/pages/home';
</style>
