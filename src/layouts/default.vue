<template lang="pug">
div(class="bg-gray-100 dark:bg-gray-800 relative w-full min-h-screen transition ease-in-out")
  button(@click="toggleColorMode" class="absolute bg-gray-100 dark:(bg-gray-800 text-gray-100) top-0 right-0 m-2 text-xl m-2 focus:outline-none transition ease-in-out")
    IconIon:sunny(v-if="colorMode.value == 'dark'")
    IconIon:moon(v-else)
  slot
</template>

<script setup lang="ts">
const colorMode = useColorMode()

const toggleColorMode = () => {
  if (colorMode.value !== "dark") {
    colorMode.preference = "dark"
  } else {
    colorMode.preference = "light"
  }
}
</script>
