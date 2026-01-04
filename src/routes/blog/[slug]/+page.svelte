<script lang="ts">
  import type { TechArticle, WithContext } from "schema-dts";
  import { page } from "$app/state";

  const { data } = $props();
  const {
    Content,
    meta: { title, description, keywords },
    coverImage,
    seriesPosts,
    dates,
    // svelte-ignore state_referenced_locally
  } = $derived(data);

  const coverSrc = $derived(
    typeof coverImage === "string" ? coverImage : coverImage?.img?.src,
  );

  const jsonLd: WithContext<TechArticle> = $derived({
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: title,
    image: [coverSrc],
    description,
    keywords,
    author: {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Vitor Daniel Lopes dos Santos",
      url: "https://vitordaniel.is-a.dev",
      image: "https://github.com/vadolasi.png",
      jobTitle: "Desenvolvedor Web Full Stack",
      additionalName: "vadolasi",
    },
    inLanguage: "pt-BR",
    isFamilyFriendly: true,
  });

  const jsonLdString = $derived(
    JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
  );
</script>

<svelte:head>
  <title>{title}</title>

  <meta name="description" content={description} />
  <meta name="keywords" content={keywords.join(", ")} />
  <meta name="author" content="Vitor Daniel" />

  <meta property="og:type" content="article" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />

  {#if coverSrc}
    <meta property="og:image" content={coverSrc} />
    <meta name="twitter:image" content={coverSrc} />
  {/if}
</svelte:head>

{@html `<script type="application/ld+json">${jsonLdString}</script>`}

<div class="relative w-full h-120 lg:h-160">
  {#if coverImage}
    <div class="absolute inset-0">
      <enhanced:img
        src={coverImage}
        alt=""
        class="w-full h-full object-cover"
      />
      <div
        class="absolute inset-0 bg-linear-to-t from-base-100 via-base-100/50 to-transparent lg:via-base-100/20"
      ></div>
    </div>
  {/if}

  <div class="absolute bottom-0 left-0 w-full p-4 lg:p-12">
    <div class="container mx-auto">
      <div class="max-w-4xl mx-auto text-center">
        <p
          class="font-bold uppercase tracking-wider mb-4 text-sm text-base-content/80"
        >
          <time datetime={new Date(dates.created).toISOString()}>
            {new Intl.DateTimeFormat("pt-BR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }).format(new Date(dates.created))}
          </time>
        </p>
        <h1
          class="text-4xl lg:text-6xl font-bold mb-4 text-base-content leading-tight"
        >
          {title}
        </h1>
        <p class="text-xl lg:text-2xl text-base-content/80 max-w-3xl mx-auto">
          {description}
        </p>
      </div>
    </div>
  </div>
</div>

<div class="container mx-auto px-4 py-12 max-w-4xl">
  <main>
    <article class="prose lg:prose-xl max-w-none">
      {#if seriesPosts && seriesPosts.length > 0}
        <nav
          class="not-prose bg-base-200 p-6 rounded-xl mb-8 border border-base-300 text-base"
          aria-label="Nesta série"
        >
          <h2 class="font-bold text-lg mb-4 uppercase tracking-wide">
            Nesta série
          </h2>
          <ul class="steps steps-vertical w-full">
            {#each seriesPosts as post}
              <li
                class="step {post.slug === page.params.slug
                  ? 'step-primary'
                  : ''} text-left"
              >
                <a
                  href="/blog/{post.slug}"
                  class="text-left hover:text-primary transition-colors {post.slug ===
                  page.params.slug
                    ? 'font-bold'
                    : ''}"
                  aria-current={post.slug === page.params.slug
                    ? "page"
                    : undefined}
                >
                  {post.title}
                </a>
              </li>
            {/each}
          </ul>
        </nav>
      {/if}
      <Content />
      <div class="mt-8 pt-4 border-t border-base-300">
        <p class="text-base-content font-semibold">Escrito por Vitor Daniel</p>
      </div>
    </article>
  </main>
</div>
