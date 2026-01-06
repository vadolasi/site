<script lang="ts">
  import "./layout.css";
  import { load as fingerprintLoad } from "@fingerprintjs/fingerprintjs";
  import { onMount } from "svelte";
  import { onNavigate } from "$app/navigation";
  import favicon from "$lib/assets/favicon.svg";

  const { children, data } = $props();

  let visitorId: string | null = null;

  onMount(() => {
    fingerprintLoad()
      .then((fp) => fp.get())
      .then((result) => {
        visitorId = result.visitorId;
        fetch("/api/data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            event: "identity",
            visitorId,
            navigationId: data.navigationId,
            hostname: window.location.hostname,
            language: navigator.language,
            referrer: document.referrer,
            screen: `${window.screen.width}x${window.screen.height}`,
            title: document.title,
            url: window.location.pathname,
          }),
        });
      });
  });

  onNavigate(() => {
    fetch("/api/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event: "pageview",
        visitorId: visitorId ?? undefined,
        navigationId: data.navigationId,
        hostname: window.location.hostname,
        language: navigator.language,
        referrer: document.referrer,
        screen: `${window.screen.width}x${window.screen.height}`,
        title: document.title,
        url: window.location.pathname,
      }),
    });
  });
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
