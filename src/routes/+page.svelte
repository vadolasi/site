<script lang="ts">
	import { SiWhatsapp } from "@icons-pack/svelte-simple-icons"
	import { Github, Instagram, Linkedin, Mail, ArrowRight } from "@lucide/svelte"
	import type { Person, WebSite, WithContext } from "schema-dts"
	import BlurFade from "$lib/components/BlurFade.svelte"

	let { data } = $props()
	let { latestPosts, bioHtml } = $derived(data)

	let links = [
		{ label: "Github", icon: Github, href: "https://github.com/vadolasi" },
		{
			label: "LinkedIn",
			icon: Linkedin,
			href: "https://www.linkedin.com/in/vitordanieldevrn"
		},
		{
			label: "Email",
			icon: Mail,
			href: "mailto:vitor@vitordaniel.is-a.dev"
		},
		{
			label: "WhatsApp",
			icon: SiWhatsapp,
			href: "https://wa.me/5584981437676"
		},
		{
			label: "Instagram",
			icon: Instagram,
			href: "https://www.instagram.com/vitordaniel.dev/"
		}
	]

	const personSchema: WithContext<Person> = $derived({
		"@context": "https://schema.org",
		"@type": "Person",
		name: "Vitor Daniel Lopes dos Santos",
		url: "https://vitordaniel.is-a.dev",
		image: "https://github.com/vadolasi.png",
		jobTitle: "Desenvolvedor Web Full Stack",
		additionalName: "vadolasi"
	})

	const websiteSchema: WithContext<WebSite> = {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: "Vitor Daniel",
		alternateName: ["Vitor Daniel Portfolio"],
		url: "https://vitordaniel.is-a.dev"
	}

	const jsonLdString = $derived(
		JSON.stringify([personSchema, websiteSchema]).replace(/</g, "\\u003c")
	)
</script>

<svelte:head>
	<title>Vitor Daniel - Desenvolvedor Web Full Stack</title>
	<meta
		name="description"
		content="Site pessoal de Vitor Daniel, desenvolvedor web full stack apaixonado por tecnologia e por criar soluções inovadoras."
	/>
	<meta
		name="keywords"
		content="Vitor Daniel, desenvolvedor web, full stack, portfólio, blog, tecnologia, programação, JavaScript, TypeScript, Svelte, SvelteKit, Node.js, React, desenvolvimento de software"
	/>
	<meta name="author" content="Vitor Daniel" />
	<link rel="preconnect" href="https://github.com" />
	<link rel="preconnect" href="https://www.linkedin.com" />
</svelte:head>

{@html `<script type="application/ld+json">${jsonLdString}</script>`}

<BlurFade delay={0.1}>
	<header
		class="mb-12 flex flex-col-reverse gap-4 items-center sm:flex-row sm:justify-between"
	>
		<div
			class="flex flex-col items-center sm:items-start text-center sm:text-left"
		>
			<h1 class="text-5xl font-bold tracking-tight">Vitor Daniel</h1>
			<p class="mt-4 text-lg opacity-80 max-w-md">
				Desenvolvedor Web Full Stack apaixonado por tecnologia e por criar
				soluções inovadoras
			</p>
			<div class="mt-6 flex flex-wrap gap-2 justify-center sm:justify-start">
				{#each links as item (item.href)}
					{@const Icon = item.icon}
					<a
						href={item.href}
						target={item.href.startsWith("http") ? "_blank" : undefined}
						rel={item.href.startsWith("http")
							? "noopener noreferrer"
							: undefined}
						class="btn btn-ghost btn-circle btn-sm"
						aria-label={item.label}
					>
						<Icon size={20} />
					</a>
				{/each}
			</div>
		</div>
		<div
			class="relative size-40 overflow-hidden rounded-4xl border border-base-300 shadow-sm"
		>
			<enhanced:img
				src="$lib/assets/photo.webp?enhanced=true&w=360"
				alt="Vitor Daniel"
				class="h-full w-full object-cover bg-primary"
				sizes="360px"
			/>
		</div>
	</header>
</BlurFade>

<BlurFade delay={0.2}>
	<section title="Sobre Mim" class="mb-12">
		<h2 class="text-xl font-bold tracking-tight">Sobre Mim</h2>
		<p class="opacity-70 leading-relaxed">
			{@html bioHtml}
		</p>
		<a
			href="/about"
			class="mt-4 inline-block text-primary font-semibold hover:underline"
		>
			Saiba mais sobre meu trabalho &rarr;
		</a>
	</section>
</BlurFade>

<BlurFade delay={0.3}>
	<section title="Últimas Postagens">
		<h2 class="text-xl font-bold tracking-tight mb-8">Últimas Postagens</h2>
		<div class="flex flex-col gap-8">
			{#each latestPosts as post}
				<article>
					<a
						href="/blog/{post.slug}"
						class="card bg-base-100 border border-base-300 overflow-hidden transition-all duration-300 hover:shadow-lg group"
					>
						{#if post.coverImage}
							<figure class="aspect-21/9 overflow-hidden bg-base-200">
								<enhanced:img
									src={post.coverImage as unknown as string}
									alt={post.title}
									sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
									loading="lazy"
									class="transition-transform duration-500 group-hover:scale-105"
								/>
							</figure>
						{/if}
						<div class="card-body p-6">
							<h1 class="card-title text-xl font-bold text-base-content">
								{post.title}
							</h1>
							<div class="text-xs text-base-content/60 font-mono mb-2">
								{new Intl.DateTimeFormat("pt-BR", {
									month: "short",
									year: "numeric"
								}).format(new Date(post.dates.created))}
							</div>
							<p class="text-sm text-base-content/70 mb-4">
								{post.description}
							</p>
							{#if post.keywords && post.keywords.length > 0}
								<div class="flex flex-wrap gap-2">
									{#each post.keywords as keyword}
										<span class="badge badge-sm badge-outline opacity-80"
											>{keyword}</span
										>
									{/each}
								</div>
							{/if}
						</div>
					</a>
				</article>
			{/each}
		</div>
		<div class="mt-8 flex justify-center">
			<a href="/blog" class="btn btn-ghost btn-sm gap-2">
				Ver todas as postagens
				<ArrowRight size={16} />
			</a>
		</div>
	</section>
</BlurFade>
