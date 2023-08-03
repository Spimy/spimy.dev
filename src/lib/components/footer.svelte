<script lang="ts">
	import { pages } from '$lib/global';
	import {
		faDiscord,
		faGithub,
		faInstagram,
		faTwitter,
		faYoutube
	} from '@fortawesome/free-brands-svg-icons';
	import Fa from 'svelte-fa';

	export let currentYear: number;
</script>

<footer class="footer">
	<p class="footer__issue">
		Find an issue with this page? <a
			href="https://github.com/spimy/spimy.dev/issues"
			target="_blank">Fix it on GitHub</a
		>.
	</p>
	<ul role="list" class="footer__socials">
		<li>
			<a href="https://youtube.com/@officialspimy" target="_blank">
				<i aria-label="YouTube icon"><Fa icon={faYoutube} /></i>
			</a>
		</li>
		<li>
			<a href="https://instagram.com/william3001_lhw" target="_blank">
				<i aria-label="Instagram icon"><Fa icon={faInstagram} /></i>
			</a>
		</li>
		<li>
			<a href="https://twitter.com/officialspimy" target="_blank">
				<i aria-label="Twitter icon"><Fa icon={faTwitter} /></i>
			</a>
		</li>
		<li>
			<a href="https://github.com/spimy" target="_blank">
				<i aria-label="GitHub icon"><Fa icon={faGithub} /></i>
			</a>
		</li>
		<li>
			<a href="https://discord.spimy.dev" target="_blank"
				><i aria-label="Discord icon"><Fa icon={faDiscord} /></i>
			</a>
		</li>
	</ul>
	<div class="footer__links">
		<h2 class="footer__links__title">Helpful Links</h2>
		<div class="footer__links__container">
			{#each pages as page, index (index)}
				<a href={page.path}>{page.name}</a> |
			{/each}
			<a href="/sitemap.xml" target="_blank">Sitemap</a>
		</div>
	</div>
	<p class="footer__copyright">Copyright © {currentYear} Spimy - All Rights Reserved.</p>
</footer>

<style lang="scss">
	@use '../../scss/layout/footer';
</style>
