<script lang="ts">
	import { contactFormSchema } from '$lib/global';
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import type { PageServerData } from './$types';

	export let data: PageServerData;
	const { form, errors, constraints, enhance } = superForm(data.form, {
		taintedMessage: 'Are you sure you want to leave?',
		autoFocusOnError: true,
		validators: contactFormSchema
	});
</script>

<section class="contact">
	<div class="contact__intro">
		<h1>Get in Touch!</h1>
		<p>I'll get back to you as soon as possible.</p>
	</div>
	<SuperDebug data={$form} />
	<div class="contact__content">
		<form method="POST" action="?/submitContactForm" use:enhance>
			<div class="contact__form-group">
				<label for="name">Name</label>
				<input type="text" name="name" id="name" bind:value={$form.name} {...$constraints.name} />
				{#if $errors.name}<small>{$errors.name}</small>{/if}
			</div>
			<div class="contact__form-group">
				<label for="email">Email</label>
				<input
					type="email"
					name="email"
					id="email"
					bind:value={$form.email}
					{...$constraints.email}
				/>
				{#if $errors.email}<small>{$errors.email}</small>{/if}
			</div>
			<div class="contact__form-group">
				<label for="message">Message</label>
				<textarea
					name="message"
					id="message"
					bind:value={$form.message}
					{...$constraints.message}
				/>
				{#if $errors.message}<small>{$errors.message}</small>{/if}
			</div>
			<div class="contact__form-group">
				<button type="submit">Send</button>
			</div>
		</form>
	</div>
</section>

<style lang="scss">
	@use '../../../scss/pages/contact';
</style>
