<script lang="ts">
	import Avatar from '$lib/components/avatar.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	// Temporarily loaded on client side. Will be loaded on server side later from database.
	interface SkillsList {
		name: string;
		src: string;
	}

	const skills: SkillsList[] = [
		{ name: 'html', src: '/skills/html.png' },
		{ name: 'css', src: '/skills/css.png' },
		{ name: 'scss', src: '/skills/scss.png' },
		{ name: 'js', src: '/skills/js.png' },
		{ name: 'ts', src: '/skills/ts.png' },
		{ name: 'node', src: '/skills/node.png' },
		{ name: 'express', src: '/skills/express.png' },
		{ name: 'svelte', src: '/skills/svelte.png' },
		{ name: 'vue', src: '/skills/vue.png' },
		{ name: 'nuxt', src: '/skills/nuxt.png' },
		{ name: 'sqlite', src: '/skills/sqlite.png' },
		{ name: 'discord', src: '/skills/discord.png' },
		{ name: 'mongo', src: '/skills/mongo.png' },
		{ name: 'mysql', src: '/skills/mysql.png' },
		{ name: 'redis', src: '/skills/redis.png' },
		{ name: 'java', src: '/skills/java.png' },
		{ name: 'python', src: '/skills/python.png' },
		{ name: 'django', src: '/skills/django.png' },
		{ name: 'heroku', src: '/skills/heroku.png' },
		{ name: 'figma', src: '/skills/figma.png' },
		{ name: 'git', src: '/skills/git.png' },
		{ name: 'ubuntu', src: '/skills/ubuntu.png' },
		{ name: 'adobexd', src: '/skills/adobexd.png' },
		{ name: 'photoshop', src: '/skills/photoshop.png' },
		{ name: 'nginx', src: '/skills/nginx.png' },
		{ name: 'certbot', src: '/skills/certbot.png' }
	];

	function chunk(array: SkillsList[], size: number): SkillsList[][] {
		if (!array) return [];
		const firstChunk = array.slice(0, size);
		if (!firstChunk.length) return [array];
		return [firstChunk].concat(chunk(array.slice(size, array.length), size));
	}
</script>

<svelte:head>
	<title>Spimy's Portfolio - Home</title>
</svelte:head>

<section class="hero">
	<div class="hero__avatar"><Avatar /></div>
	<div class="hero__info">
		<h1>Hi there!</h1>
		<h2>I'm Spimy</h2>
		<p>
			At least that's the username that I've grown quite fond of. My name is actually William and I
			am {data.age} years old. Coding since 2016 (~{data.experienceYears} years of experience) and I
			got into programming for trying to code a
			<a href="https://spigotmc.org" rel="external" target="_blank">Spigot plugin</a>
			for
			<a href="https://minecraft.net" rel="external" target="_blank">Minecraft</a>; making Java my
			first programming language.
		</p>
		<a href="/contact" class="hero__cta btn">Contact Me »</a>
	</div>
</section>

<section class="skills">
	<h1>Skills</h1>
	<div class="skills__container">
		<div class="skills__container__texture skills__container__texture--left-long" />
		<div class="skills__container__texture skills__container__texture--left-short" />
		<div class="skills__container__hex-grid">
			{#each chunk(skills, 3) as skillsList, i (i)}
				<div
					class={i % 2 === 0 ? 'skills__container__hex-grid--a' : 'skills__container__hex-grid--b'}
				>
					{#each skillsList as skill, j (j)}
						<div class="skills__container__hex-grid__hex">
							<img src={skill.src} alt="{skill.name} logo" />
						</div>
					{/each}
				</div>
			{/each}
		</div>
		<div class="skills__container__texture skills__container__texture--right-short" />
		<div class="skills__container__texture skills__container__texture--right-long" />
	</div>
</section>

<style lang="scss">
	@use '../../scss/pages/home';
</style>
