<script lang="ts">
	import Navbar from '$lib/components/navbar.svelte';
	import '../scss/main.scss';
	import type { LayoutServerData } from './$types';

	export let data: LayoutServerData;
</script>

<Navbar {data} />

<main>
	<slot />
</main>

<style>
	main {
		padding: 10rem var(--content-padding);
	}
</style>
