<script lang="ts">
	import Navbar from '$lib/components/navbar.svelte';
	import '../../scss/main.scss';
	import type { LayoutServerData } from './$types';

	export let data: LayoutServerData;
</script>

<Navbar {data} />

<main>
	<slot />
</main>

<style lang="scss">
	@use '../../scss/abstracts/mixins' as *;

	main {
		padding-inline: var(--content-padding);
		padding-block: 8rem;

		@include mq(small) {
			padding-block: 12rem;
		}
	}
</style>
