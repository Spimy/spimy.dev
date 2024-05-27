<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { pages } from '$lib/global';
	import type { Theme } from '$lib/types/theme';
	import BurgerIcon from './burger-icon.svelte';
	import ThemeToggler from './theme-toggler.svelte';

	export let theme: Theme | undefined;
	$: path = $page.url.pathname;

	let scrollPosition: number = 0;
	if (browser) window.addEventListener('scroll', () => (scrollPosition = window.scrollY));

	let burgerMenu: HTMLInputElement;
	const closeNav = () => (burgerMenu.checked = false);
</script>

<header class="navbar" data-scroll={scrollPosition}>
	<div class="navbar__logo">
		<a href="/"><img src="/logos/icon.png" alt="home-logo" /></a>
	</div>

	<nav class="navbar__items">
		<ThemeToggler currentTheme={theme} />

		<input
			aria-label="Toggle menu"
			type="checkbox"
			name="burger"
			id="burger"
			bind:this={burgerMenu}
		/>
		<label aria-hidden="true" for="burger"><BurgerIcon /></label>

		<ul role="list" class="navbar__items__menu">
			{#each pages.filter((page) => page.navbar) as page, index (index)}
				<li>
					<a
						href={page.path}
						aria-current={path === page.path ? 'page' : undefined}
						class="navbar__items__menu__item"
						on:click={closeNav}
						>{page.display}
					</a>
				</li>
			{/each}
		</ul>
	</nav>
</header>

<style lang="scss">
	@use '../../scss/layout/navbar';
</style>
