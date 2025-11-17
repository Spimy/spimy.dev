<script lang="ts">
	import { pages, socialLinks } from '$lib/global';
	import Fa from 'svelte-fa';

	interface Props {
		currentYear: number;
	}

	let { currentYear }: Props = $props();
</script>

<footer class="footer">
	<p class="footer__issue">
		Find an issue with this page? <a
			href="https://github.com/spimy/spimy.dev/issues"
			target="_blank">Report it</a
		>.
	</p>
	<ul role="list" class="footer__socials">
		{#each socialLinks as social}
			<li>
				<a href={social.url} target="_blank">
					<i aria-label="{social.name} icon"><Fa icon={social.icon} /></i>
				</a>
			</li>
		{/each}
	</ul>
	<div class="footer__links">
		<h2 class="footer__links__title">Helpful Links</h2>
		<div class="footer__links__container">
			{#each pages as page, index (index)}
				<a href={page.path}>{page.display}</a>
				{#if index !== pages.length - 1} | {/if}
			{/each}
		</div>
	</div>
	<p class="footer__copyright">Copyright © {currentYear} Spimy - All Rights Reserved.</p>
</footer>

<style lang="scss">
	@use '../../scss/layout/footer';
</style>
