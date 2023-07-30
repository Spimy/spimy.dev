<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { pages } from '$lib/global';
	import type { SubmitFunction } from '@sveltejs/kit';

	const submitUpdateTheme: SubmitFunction = ({ action }) => {
		const theme = action.searchParams.get('theme') as Theme;
		if (theme) {
			document.documentElement.setAttribute('data-theme', theme);
		}
	};

	export let data: { theme: Theme | undefined };
	$: path = $page.url.pathname;
</script>

<aside class="navbar">
	<div class="navbar__logo">
		<a href="/"><img src="/logos/icon.png" alt="home-logo" /></a>
	</div>

	<nav class="navbar__items">
		<form method="POST" use:enhance={submitUpdateTheme}>
			{#if !data.theme || data.theme === 'light'}
				<button
					aria-label="Toggle theme"
					class="navbar__items__theme-toggler"
					type="submit"
					formaction="/?/setTheme&theme=dark&redirectTo={path}"
				>
					<img aria-hidden="true" src="/icons/theme-toggle/to-dark.svg" alt="theme-toggler-icon" />
				</button>
			{:else}
				<button
					aria-label="Toggle theme"
					class="navbar__items__theme-toggler"
					type="submit"
					formaction="/?/setTheme&theme=light&redirectTo={path}"
				>
					<img aria-hidden="true" src="/icons/theme-toggle/to-light.svg" alt="theme-toggler-icon" />
				</button>
			{/if}
		</form>

		<input aria-label="Toggle menu" type="checkbox" name="burger" id="burger" />
		<label aria-hidden="true" for="burger">
			<img src="icons/burger.svg" alt="burger-menu-icon" />
		</label>

		<ul role="list" class="navbar__items__menu">
			{#each pages as page, index (index)}
				<li>
					<a
						href={page.path}
						aria-current={path === page.path ? 'page' : undefined}
						class="navbar__items__menu__item">{page.name}</a
					>
				</li>
			{/each}
		</ul>
	</nav>
</aside>

<style lang="scss">
	@use '../../scss/layout/navbar.scss' as *;
</style>
