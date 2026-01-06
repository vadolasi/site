<script>
export let title = ""
</script>

<section class="mb-12">
	{#if title}
		<h2
			class="text-xl font-bold mb-4 tracking-tight border-b border-base-300 pb-1 inline-block"
		>
			{title}
		</h2>
	{/if}
	<div class="space-y-4">
		<slot/>
	</div>
</section>
