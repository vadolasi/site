<script lang="ts">
  import { SiGooglemeet, SiWhatsapp } from "@icons-pack/svelte-simple-icons";
  import {
    ArrowLeft,
    ArrowRight,
    Download,
    ExternalLink,
    FileText,
    Github,
    Info,
    Linkedin,
    Mail,
  } from "@lucide/svelte";
  import About from "$content/about/about.md";

  let { data } = $props();
  let { projects } = $derived(data);

  let featuredProjects = $derived(projects.filter((p) => p.featured));
  let otherProjects = $derived(projects.filter((p) => !p.featured));
</script>

<svelte:head>
  <title>Sobre | Vitor Daniel</title>
  <meta
    name="description"
    content="Saiba mais sobre Vitor Daniel, um desenvolvedor web full stack apaixonado por tecnologia e inovação."
  />
</svelte:head>

<div class="mb-12">
  <a
    href="/"
    class="btn btn-ghost gap-2 pl-0 hover:bg-transparent hover:underline mb-8"
  >
    <ArrowLeft size={20} /> Ir para o início
  </a>

  <div
    class="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start"
  >
    <enhanced:img
      src="$lib/assets/photo2.webp?enhanced&w=256&aspect=1:1"
      sizes="256px"
      alt="Vitor Daniel"
      class="relative w-64 h-64 object-cover rounded-full z-10 bg-primary"
    />

    <div class="flex-1 w-full text-center md:text-left">
      <h1 class="text-4xl font-bold mb-6">Vitor Daniel</h1>
      <div class="flex flex-wrap gap-3 justify-center md:justify-start">
        <a href="cv.pdf" download class="btn btn-outline btn-sm gap-2">
          <Download size={18} /> Baixar Currículo
        </a>
        <a
          href="mailto:vitor@vitordaniel.is-a.dev"
          class="btn btn-outline btn-sm gap-2"
        >
          <Mail size={18} /> E-mail
        </a>
        <a
          href="https://github.com/vadolasi"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-outline btn-sm gap-2"
        >
          <Github size={18} /> GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/vitordanieldevrn"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-outline btn-sm gap-2"
        >
          <Linkedin size={18} /> LinkedIn
        </a>
        <a
          href=" https://lattes.cnpq.br/4766140829742525"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-outline btn-sm gap-2"
        >
          <FileText size={18} /> Currículo Lattes
        </a>
        <a
          href="https://wa.me/5599981234567"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-outline btn-sm gap-2"
        >
          <SiWhatsapp size={18} /> WhatsApp
        </a>
        <a
          href="https://calendar.app.google/UmkMxty9HuHraYaeA"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-outline btn-sm gap-2"
        >
          <SiGooglemeet size={18} /> Agendar chamada de vídeo
        </a>
      </div>
    </div>
  </div>
</div>

<div class="prose min-w-full">
  <About />
</div>

<section class="mt-16">
  <h2 class="text-2xl font-bold mb-8 tracking-tight">Projetos em Destaque</h2>
  <div class="flex flex-col gap-12">
    {#each featuredProjects as project}
      <article
        class="card bg-base-100 border border-base-300 overflow-hidden group"
      >
        {#if project.coverImage}
          <figure
            class="w-full aspect-video overflow-hidden bg-base-200 border-b border-base-300"
          >
            <enhanced:img
              src={project.coverImage}
              alt={project.title}
              class="transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 720px) 100vw, 672px"
            />
          </figure>
        {/if}
        <div class="card-body p-6 sm:p-8">
          <h1 class="text-xl font-bold text-base-content mb-1">
            {project.title}
          </h1>

          <p class="mb-6 leading-relaxed text-md">
            {project.description}
          </p>

          {#if project.tags && project.tags.length > 0}
            <div class="flex flex-wrap gap-2 mb-8">
              {#each project.tags as tag}
                <span class="badge badge-lg badge-neutral">{tag}</span>
              {/each}
            </div>
          {/if}

          <div class="flex flex-wrap gap-4 mt-auto">
            {#if project.about}
              <a
                href={project.about}
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-outline btn-sm"
              >
                <Info size={18} /> Veja mais sobre o projeto
              </a>
            {/if}
            {#if project.link}
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-outline btn-sm"
              >
                Ver online <ExternalLink size={14} />
              </a>
            {/if}

            {#if project.site}
              <a
                href={project.site}
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-primary"
              >
                Acessar Site <ArrowRight size={18} />
              </a>
            {/if}

            {#if project.repo}
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-outline btn-sm"
              >
                <Github size={18} /> Ver Código
              </a>
            {/if}
          </div>
        </div>
      </article>
    {/each}
  </div>
</section>

<section class="mt-16">
  <h2 class="text-2xl font-bold mb-8 tracking-tight">Outros Projetos</h2>
  <div class="columns-1 sm:columns-2 gap-4">
    {#each otherProjects as project}
      <article
        class="card bg-base-100 border border-base-300 break-inside-avoid mb-4 overflow-hidden h-fit"
      >
        {#if project.coverImage}
          <figure class="w-full">
            <enhanced:img
              src={project.coverImage}
              alt={project.title}
              class="w-full object-cover"
              sizes="(max-width: 640px) 100vw, 320px"
            />
          </figure>
        {/if}
        <div class="card-body p-5">
          <h3 class="card-title text-lg font-bold text-base-content mb-2">
            {project.title}
          </h3>
          <p class="text-sm text-base-content/70 mb-4 leading-relaxed">
            {project.description}
          </p>

          {#if project.tags && project.tags.length > 0}
            <div class="flex flex-wrap gap-1.5 mb-4">
              {#each project.tags as tag}
                <span class="badge badge-sm badge-neutral">{tag}</span>
              {/each}
            </div>
          {/if}

          <div class="flex flex-wrap gap-2">
            {#if project.about}
              <a
                href={project.about}
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-outline btn-xs"
              >
                <Info size={14} /> Sobre
              </a>
            {/if}
            {#if project.link}
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-outline btn-xs"
              >
                <ExternalLink size={14} /> Ver
              </a>
            {/if}

            {#if project.site}
              <a
                href={project.site}
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-primary btn-xs"
              >
                Site <ArrowRight size={14} />
              </a>
            {/if}

            {#if project.repo}
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-outline btn-xs"
              >
                <Github size={14} /> Code
              </a>
            {/if}
          </div>
        </div>
      </article>
    {/each}
  </div>
</section>
