<script lang="ts">
	import Footer from '$lib/components/footer.svelte';
	import Navbar from '$lib/components/navbar.svelte';
	import '../../scss/main.scss';
	import type { LayoutServerData } from './$types';

	export let data: LayoutServerData;
	$: ({ theme, currentYear } = data);
</script>

<noscript>
	<input type="checkbox" id="close-noscript" name="close-noscript" class="btn btn--invert" />
	<label for="close-noscript" class="btn btn--invert">X</label>
	<div>Enable JavaScript for the best experience while using this portfolio.</div>
</noscript>

<Navbar {theme} />

<main>
	<slot />
</main>

<Footer {currentYear} />

<style lang="scss">
	@use '../../scss/abstracts/mixins' as *;

	noscript {
		position: fixed;
		bottom: 0;
		text-align: center;
		width: 100%;
		z-index: 9999;

		label {
			cursor: pointer;
			position: absolute;
			right: 1rem;
			top: 1rem;
			padding: 0.1rem 0.4rem;
		}

		input {
			display: none;

			&:checked ~ * {
				display: none;
			}
		}

		div {
			background-color: black;
			padding: 3rem;
		}
	}

	main {
		padding-inline: var(--content-padding);
		padding-top: 8rem;
		padding-bottom: 3rem;
		display: flex;
		flex-direction: column;
		gap: 6rem;

		@include mq(small) {
			gap: 12rem;
		}
	}
</style>
