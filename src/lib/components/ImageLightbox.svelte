<script lang="ts">
	import { onMount } from "svelte"

	let isOpen = $state(false)
	let currentSrc = $state("")
	let currentAlt = $state("")

	$effect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden"
		} else {
			document.body.style.overflow = ""
		}
	})

	onMount(() => {
		// Adicionar event listeners em todas as imagens do artigo
		const images = document.querySelectorAll(
			"article picture img, article img:not(picture img)"
		)

		images.forEach((img) => {
			if (img instanceof HTMLImageElement) {
				img.style.cursor = "zoom-in"
				img.addEventListener("click", () => {
					currentSrc = img.src
					currentAlt = img.alt
					isOpen = true
				})
			}
		})

		// Fechar com ESC
		const handleKeydown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isOpen) {
				isOpen = false
			}
		}

		document.addEventListener("keydown", handleKeydown)

		return () => {
			document.removeEventListener("keydown", handleKeydown)
		}
	})

	function close() {
		isOpen = false
	}
</script>

{#if isOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
		onclick={close}
	>
		<button
			class="btn btn-circle btn-ghost absolute top-4 right-4 text-white hover:bg-white/10"
			onclick={close}
			aria-label="Fechar"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M6 18L18 6M6 6l12 12"
				/>
			</svg>
		</button>

		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<img
			src={currentSrc}
			alt={currentAlt}
			class="max-h-[90vh] max-w-full object-contain cursor-zoom-out"
			onclick={(e) => {
				e.stopPropagation()
				close()
			}}
		/>
	</div>
{/if}
