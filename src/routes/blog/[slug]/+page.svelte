<script lang="ts">
  import { ArrowLeft } from "@lucide/svelte";
  import type { TechArticle, WithContext } from "schema-dts";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import WrittenBy from "$lib/components/WrittenBy.svelte";
  import { getRelativeTime } from "$lib/utils";
  import TableOfContents from "./TableOfContents.svelte";

  const { data } = $props();
  const {
    Content,
    meta: { title, description, keywords, toc },
    coverImage,
    seriesPosts,
    dates,
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

  let elapsed = $state(0);
  const startTime = Date.now();

  setInterval(() => {
    elapsed += 1;
  }, 1000);

  $effect(() => {
    const interval = setInterval(() => {
      elapsed = Date.now() - startTime;
    }, 1000);

    return () => clearInterval(interval);
  });
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

<div class="mb-16">
  <div class="mb-8">
    <a
      href="/blog"
      class="btn btn-sm btn-ghost gap-2 pl-0 hover:bg-transparent hover:underline text-base-content/80 hover:text-base-content"
    >
      <ArrowLeft size={20} />
      Ir para o blog
    </a>
  </div>

  <h1
    class="text-xl lg:text-5xl font-bold mb-6 text-base-content leading-tight"
  >
    {title}
  </h1>

  <p class="text-lg text-base-content/80 leading-relaxed mb-8">
    {description}
  </p>

  <div
    class="flex flex-wrap items-center gap-4 text-sm font-medium text-base-content/60 mb-12"
  >
    <time datetime={new Date(dates.created).toISOString()}>
      {new Intl.DateTimeFormat("pt-BR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(dates.created))}
    </time>
    <span class="-ml-2">
      {#key elapsed}
        ({getRelativeTime(new Date(dates.created))})
      {/key}
    </span>
    {#if keywords && keywords.length > 0}
      <span class="hidden sm:inline">•</span>
      <div class="flex gap-2">
        {#each keywords as keyword}
          <span class="badge badge-outline">{keyword}</span>
        {/each}
      </div>
    {/if}
  </div>

  {#if coverImage}
    <figure
      class="w-full aspect-video overflow-hidden rounded-2xl shadow-lg bg-base-200"
    >
      <enhanced:img
        src={coverImage}
        alt={title}
        class="w-full h-full object-cover"
      />
    </figure>
  {/if}
</div>

{#if seriesPosts && seriesPosts.length > 0}
  <nav
    class="bg-base-200 p-6 rounded-xl mb-12 border border-base-300"
    aria-label="Nesta série"
  >
    <h2 class="font-bold text-sm uppercase tracking-wider mb-4 opacity-70">
      Nesta série
    </h2>
    <ul class="steps steps-vertical w-full">
      {#each seriesPosts as post}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <li
          class="step {post.slug === page.params.slug
            ? 'step-primary'
            : ''} text-left cursor-pointer"
          onclick={(e) => {
            if (e.target instanceof Element && e.target.closest("a")) return;
            goto(`/blog/${post.slug}`);
          }}
        >
          <a
            href="/blog/{post.slug}"
            class="text-left hover:text-primary transition-colors {post.slug ===
            page.params.slug
              ? 'font-bold'
              : ''}"
            aria-current={post.slug === page.params.slug ? "page" : undefined}
          >
            {post.title}
          </a>
        </li>
      {/each}
    </ul>
  </nav>
{/if}

<div class="relative">
  <main class="min-w-0 w-full">
    <article
      class="prose prose-lg max-w-none prose-headings:scroll-mt-24"
      id="scrollspy-content"
    >
      <Content />

      <div class="mt-16 not-prose">
        <WrittenBy />
      </div>
    </article>
  </main>

  <aside class="hidden xl:block absolute left-full top-0 ml-16 w-64 h-full">
    <div class="sticky top-24">
      <TableOfContents {toc} />
    </div>
  </aside>
</div>
