<script lang="ts">
	import { page } from '$app/stores';
	import { pages } from '$lib/global';
	import BurgerIcon from './burger-icon.svelte';
	import ThemeToggler from './theme-toggler.svelte';

	export let data: { theme: Theme | undefined };

	$: path = $page.url.pathname;
</script>

<aside class="navbar">
	<div class="navbar__logo">
		<a href="/"><img src="/logos/icon.png" alt="home-logo" /></a>
	</div>

	<nav class="navbar__items">
		<ThemeToggler {path} currentTheme={data.theme} />

		<input aria-label="Toggle menu" type="checkbox" name="burger" id="burger" />
		<label aria-hidden="true" for="burger">
			<BurgerIcon />
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
