<script lang="ts">
	export let project: Project;
</script>

<div class="project">
	<img
		class="project__preview"
		src={project.previewImageUrl}
		alt="{project.title} project preview"
	/>
	<div class="project__info">
		<header>
			<h2 class="project__info__title">{project.title}</h2>
			{#if project.technologies}
				<div class="project__info__techs">
					{#each project.technologies as technology}
						<img
							src="/skills/{technology.toLowerCase()}.png"
							alt="{technology.toLowerCase()} logo"
						/>
					{/each}
				</div>
			{/if}
		</header>
		<p class="project__info__description">
			{project.description}
		</p>
		<footer>
			<a href={project.link} class="project__info__cta btn btn--invert">View Project</a>
		</footer>
	</div>
</div>

<style lang="scss">
	@use '../../scss/components/project-display';
</style>
