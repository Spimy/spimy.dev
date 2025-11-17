<script lang="ts">
	import { page } from '$app/state';
</script>

<section class="error">
	<h1>{page.status}</h1>
	{#if page.status == 404}
		<p>Page not found</p>
	{:else}
		<p>
			{page.error?.message === `Error: ${page.status}`
				? 'Something went wrong'
				: page.error?.message}
		</p>
	{/if}
	<a href="/" class="btn">Go back home</a>
</section>

<style lang="scss">
	@use '../scss/layout/error';
</style>
