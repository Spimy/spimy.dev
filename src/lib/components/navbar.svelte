<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';

	$: path = $page.url.pathname;
</script>

<aside class="navbar">
	<div class="navbar__logo">
		<a href="/"><img src="/logos/icon.png" alt="home-logo" /></a>
	</div>

	<nav class="navbar__items">
		<!-- WIP theme switcher ignore for now -->
		<form method="POST" use:enhance>
			<button aria-label="Toggle theme" type="submit" class="navbar__items__theme-switcher">
				<img aria-hidden="true" src="icons/theme-toggle/light.svg" alt="theme-toggler-icon" />
			</button>
		</form>

		<input aria-label="Toggle menu" type="checkbox" name="burger" id="burger" />
		<label aria-hidden="true" for="burger">
			<img src="icons/burger.svg" alt="burger-menu-icon" />
		</label>

		<ul role="list" class="navbar__items__menu">
			<li>
				<a
					href="/"
					aria-current={path === '/' ? 'page' : undefined}
					class="navbar__items__menu__item">Home</a
				>
			</li>
			<li>
				<a
					href="/projects"
					aria-current={path === '/projects' ? 'page' : undefined}
					class="navbar__items__menu__item">Past Projects</a
				>
			</li>
			<li>
				<a
					href="/contact"
					aria-current={path === '/contact' ? 'page' : undefined}
					class="navbar__items__menu__item">Contact</a
				>
			</li>
		</ul>
	</nav>
</aside>

<style lang="scss">
	@use '../../scss/layout/navbar.scss' as *;
</style>
