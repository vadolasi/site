<script lang="ts">
  import WrittenBy from "$lib/components/WrittenBy.svelte";

  const { data } = $props();
</script>

<header class="mb-16">
  <h1 class="text-4xl font-bold tracking-tight mb-4">Blog</h1>
  <p class="text-xl opacity-80 max-w-xl mb-6">
    Compartilhando conhecimento, experiências e tutoriais sobre desenvolvimento
    web e tecnologia.
  </p>
  <WrittenBy />
</header>

<div class="flex flex-col gap-8">
  {#each data.posts as post, i (post.slug)}
    <a
      href="/blog/{post.slug}"
      class="group flex flex-col md:flex-row gap-6 bg-base-100 border border-base-200 rounded-xl overflow-hidden transition-all hover:shadow-md"
    >
      {#if post.coverImage}
        <figure
          class="w-full md:w-56 shrink-0 aspect-video md:aspect-square bg-base-200 overflow-hidden"
        >
          <enhanced:img
            src={post.coverImage}
            alt={post.title}
            sizes="(max-width: 768px) 100vw, 250px"
            loading={i < 3 ? "eager" : "lazy"}
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </figure>
      {/if}

      <div class="flex flex-col p-6 md:pl-0">
        <div class="flex items-center gap-2 mb-3 text-xs opacity-60 font-mono">
          <time datetime={new Date(post.dates.created).toISOString()}>
            {new Intl.DateTimeFormat("pt-BR", {
              month: "short",
              year: "numeric",
            }).format(new Date(post.dates.created))}
          </time>
        </div>

        <h2
          class="text-xl font-bold mb-2 group-hover:text-primary transition-colors"
        >
          {post.title}
        </h2>

        <p class="text-sm opacity-70 line-clamp-2 mb-4">
          {post.description}
        </p>

        {#if post.keywords?.length > 0}
          <div class="flex flex-wrap gap-2 mt-auto">
            {#each post.keywords.slice(0, 3) as keyword}
              <span class="badge badge-sm badge-ghost opacity-70"
                >#{keyword}</span
              >
            {/each}
          </div>
        {/if}
      </div>
    </a>
  {/each}
</div>
