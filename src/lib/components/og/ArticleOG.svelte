<svelte:options css="injected" />

<script lang="ts">
	export let title: string
	export let cover: string | null = null
</script>

<div
	style="width:100%;height:100%;display:flex;align-items:center;justify-content:space-between;padding:56px;background:#0b1220;color:#ffffff;font-family:Inter, ui-sans-serif, system-ui, -apple-system;"
>
	<div
		style="flex:1;padding-right:32px;min-width:0;display:flex;flex-direction:column;"
	>
		<div style="font-size:20px;opacity:0.8;margin-bottom:8px;">
			vitordaniel.is-a.dev
		</div>
		<h1 style="font-size:56px;line-height:1.02;margin:0;word-break:break-word;">
			{title}
		</h1>
	</div>

	{#if cover}
		<div
			style="width:360px;height:240px;flex-shrink:0;border-radius:16px;overflow:hidden;display:flex;align-items:center;justify-content:center;background:#0f1724;margin-left:32px;"
		>
			<img
				src={cover}
				alt="cover"
				width="360"
				height="240"
				style="width:100%;height:100%;object-fit:cover;display:block;"
			/>
		</div>
	{/if}
</div>
