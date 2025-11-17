<script lang="ts">
	import { preventDefault } from 'svelte/legacy';

	import { page } from '$app/state';
	import { PUBLIC_HCAPTCHA_SITEKEY_CONTACT } from '$env/static/public';
	import Hcaptcha, { hCaptcha } from '$lib/components/hcaptcha.svelte';
	import { contactFormSchema } from '$lib/forms/contact';
	import { socialLinks } from '$lib/global';
	import { faEnvelope, faMessage, faUser } from '@fortawesome/free-solid-svg-icons';
	import { toast } from '@zerodevx/svelte-toast';
	import Fa from 'svelte-fa';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageServerData } from './$types';

	interface Props {
		data: PageServerData;
	}

	let { data }: Props = $props();
	const { form, errors, constraints, enhance, message } = superForm(data.form, {
		taintedMessage: 'Are you sure you want to leave?',
		autoFocusOnError: true,
		validators: contactFormSchema,
		clearOnSubmit: 'errors-and-message',
		resetForm: true,
		onSubmit: () => {
			const id = toast.push('Sending message...', {
				theme: { '--toastBarBackground': 'orange' },
				duration: 300,
				initial: 0,
				next: 0,
				dismissable: false
			});

			let progress = 0;

			const randomNumber = (min: number, max: number) => Math.random() * (max - min) + min;

			const updateProgress = () => {
				setTimeout(() => {
					if ($message) {
						toast.set(id, { next: 1 });
						toast.push($message, {
							duration: 5000,
							theme: {
								'--toastBarBackground': page.status === 200 ? 'green' : 'red'
							}
						});
					} else {
						if (progress < 1) progress += randomNumber(0.01, 0.04);
						toast.set(id, { next: progress });
						updateProgress();
					}
				}, Math.floor(randomNumber(500, 800)));
			};

			updateProgress();
		}
	});

	const title = "Spimy's Portfolio - Contact";
	const description =
		'Contact me through a simple contact form to save yourself the hassle of having to open up your email client or social media to get ahold of me.';
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />

	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content="http://www.spimy.dev" />

	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
</svelte:head>

<section class="contact">
	<h1>Contact</h1>

	{#if $message}
		<noscript class="contact__noscript__message">
			<p>{$message}</p>
			<p>Please enable JavaScript and try again.</p>
		</noscript>
	{/if}

	<div class="contact__content">
		<article class="contact__content__info">
			<h2>Get in Touch!</h2>
			<p>
				I will get back to you as soon as possible. It may take anywhere between 2-3 working days
				before I see your message.
			</p>
			<p>Only if it is urgent, you may also reach me through the following social links:</p>
			<ol class="contact__content__info__social-links">
				{#each socialLinks as social}
					<li>
						<a href={social.url} target="_blank">
							<i><Fa icon={social.icon} /></i>
							{social.name}
						</a>
					</li>
				{/each}
			</ol>
			<p>
				If you contact me through my social links, please state your name and your requirements
				instead of waiting for my reply so that we may further along the discussion at a faster
				rate.
			</p>
			<p>
				<em>
					This site is protected by hCaptcha and its
					<a href="https://www.hcaptcha.com/privacy">Privacy Policy</a> and
					<a href="https://www.hcaptcha.com/terms">Terms of Service</a> apply.
				</em>
			</p>
			<noscript>
				<h3>
					<span aria-label="Noscript warning"> ⚠️ Noscript:</span>
					JavaScript <u><em>must</em></u> be enabled to use the contact form.
				</h3>
			</noscript>
		</article>
		<form class="contact__content__form" method="POST" action="?/submitContactForm" use:enhance>
			<h2>Contact Form</h2>
			<Hcaptcha
				siteKey={PUBLIC_HCAPTCHA_SITEKEY_CONTACT}
				on:submit={async (event) => event.detail.form?.requestSubmit()}
				on:error={(error) => console.error(`hCaptcha error: ${error}`)}
				on:expire={() => console.warn('hCaptcha expired')}
			/>
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
				></textarea>
			</div>
			{#if $errors.message}
				<small class="contact__content__form__error">{$errors.message}</small>
			{/if}
			<button type="submit" class="btn" onclick={preventDefault(hCaptcha.execute)}>Send</button>
		</form>
	</div>
</section>

<style lang="scss">
	@use '../../../scss/pages/contact';
</style>
