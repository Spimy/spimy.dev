<script lang="ts">
	import { contactFormSchema } from '$lib/global';
	import { faEnvelope, faMessage, faUser } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageServerData } from './$types';

	export let data: PageServerData;
	const { form, errors, constraints, enhance } = superForm(data.form, {
		taintedMessage: 'Are you sure you want to leave?',
		autoFocusOnError: true,
		validators: contactFormSchema
	});
</script>

<svelte:head>
	<title>Spimy's Portfolio - Contact</title>
</svelte:head>

<section class="contact">
	<div class="contact__intro">
		<h1>Get in Touch!</h1>
		<p>I'll get back to you as soon as possible.</p>
	</div>
	<!-- <SuperDebug data={$form} /> -->
	<div class="contact__content">
		<form class="contact__content__form" method="POST" action="?/submitContactForm" use:enhance>
			<div class="contact__content__form__group">
				<label for="name"><i><Fa icon={faUser} /></i></label>
				<input
					type="text"
					name="name"
					id="name"
					placeholder="Name"
					bind:value={$form.name}
					{...$constraints.name}
				/>
			</div>
			{#if $errors.name}<small class="contact__content__form__error">{$errors.name}</small>{/if}
			<div class="contact__content__form__group">
				<label for="email"><i><Fa icon={faEnvelope} /></i></label>
				<input
					type="email"
					name="email"
					id="email"
					placeholder="Email"
					bind:value={$form.email}
					{...$constraints.email}
				/>
			</div>
			{#if $errors.email}<small class="contact__content__form__error">{$errors.email}</small>{/if}
			<div class="contact__content__form__group">
				<label for="message"><i><Fa icon={faMessage} /></i></label>
				<textarea
					name="message"
					id="message"
					placeholder="Message"
					bind:value={$form.message}
					{...$constraints.message}
				/>
			</div>
			{#if $errors.message}<small class="contact__content__form__error">{$errors.message}</small
				>{/if}
			<button type="submit" class="btn">Send</button>
		</form>
	</div>
</section>

<style lang="scss">
	@use '../../../scss/pages/contact';
</style>
