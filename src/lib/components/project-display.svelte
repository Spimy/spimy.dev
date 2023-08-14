<script lang="ts">
	import MarkdownIt from 'markdown-it';
	import markdownItSanitizer from 'markdown-it-sanitizer';

	export let project: Project;
	const md = new MarkdownIt();
	md.use(markdownItSanitizer);
</script>

<div class="project">
	<img
		class="project__preview"
		src={project.previewImageUrl}
		alt="{project.title} project preview"
	/>
	<article class="project__info">
		<header>
			<h2 class="project__info__title">{project.title}</h2>
			{#if project.technologies}
				<div class="project__info__techs">
					<div class="sr-only">List of technologies used:</div>
					{#each project.technologies as technology}
						<div class="project__info__techs__item">
							<div class="project__info__techs__item__tooltip">
								<p>{technology.name}</p>
							</div>
							<a href="?page=1&technologies={technology.name}">
								<img src={technology.icon} alt="{technology.name} logo" />
							</a>
						</div>
					{/each}
				</div>
			{/if}
		</header>
		<div class="sr-only">Project description:</div>
		<p class="project__info__description">
			{@html md.renderInline(project.description)}
		</p>
		<footer>
			<a href={project.link} target="_blank" class="project__info__cta btn btn--invert"
				>View Project</a
			>
		</footer>
	</article>
</div>

<style lang="scss">
	@use '../../scss/components/project-display';
</style>
