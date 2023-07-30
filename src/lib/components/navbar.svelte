<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';

	$: path = $page.url.pathname;
</script>

<aside class="navbar">
	<div class="navbar__logo">
		<a href="/"><img src="/logos/icon.png" alt="home-logo" /></a>
	</div>

	<nav class="navbar__menu-container">
		<!-- WIP theme switcher ignore for now -->
		<form method="POST" use:enhance>
			<button type="submit" class="navbar__theme-switcher">Toggle Theme</button>
		</form>

		<ul role="list" class="navbar__menu">
			<li>
				<a href="/" aria-current={path === '/' ? 'page' : undefined} class="navbar__menu__item"
					>Home</a
				>
			</li>
			<li>
				<a
					href="/projects"
					aria-current={path === '/projects' ? 'page' : undefined}
					class="navbar__menu__item">Past Projects</a
				>
			</li>
			<li>
				<a
					href="/contact"
					aria-current={path === '/contact' ? 'page' : undefined}
					class="navbar__menu__item">Contact</a
				>
			</li>
		</ul>
	</nav>
</aside>

<style lang="scss">
	@use '../../scss/layout/navbar.scss' as *;
</style>
