<template lang="pug">
h1 {{ route.params.slug }}
h2 test
</template>

<script setup lang="ts">
const route = useRoute()
</script>
