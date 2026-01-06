<script lang="ts">
  import "./layout.css";
  import favicon from "$lib/assets/favicon.svg";

  const { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <link
    rel="alternate"
    type="application/atom+xml"
    title="Feed do blog de Vitor Daniel"
    href="/atom.xml"
  />
</svelte:head>

<div
  class="container mx-auto px-6 md:px-0 py-12 max-w-prose font-sans antialiased mb-24"
>
  {@render children()}

  <footer
    class="mt-24 pt-8 border-t border-base-200 text-center text-sm text-base-content/60"
  >
    <p>
      &copy; {new Date().getFullYear()} Vitor Daniel. Todos os direitos reservados.
    </p>
  </footer>
</div>
