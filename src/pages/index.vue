<template lang="pug">
main(class="w-full flex flex-col justify-center min-h-screen text-center text-gray-800")
  img(class="rounded rounded-full h-50 w-50 mx-auto" src="https://avatars.githubusercontent.com/u/39351572?v=4")
  h1(class="m-0") Vitor Daniel
  div(class="flex text-3xl gap-3 md:(text-2xl gap-2) mx-auto text-gray-800")
    a(href="https://github.com/vadolasi" target="_blank")
      IconMdi:github
    a(href="https://www.linkedin.com/in/vitor-daniel-b288a5158/" target="_blank")
      IconMdi:linkedin
    a(href="mailto:vitor036daniel@gmail.com")
      IconMdi:email
  div(class="flex flex-col md:flex-row gap-4 w-full md:w-2/3 lg:w-1/3 mx-auto px-2 mt-10")
    NuxtLink(to="/blog" class="no-underline w-full md:w-1/2 p-2 border border-gray-800 rounded rounded-lg text-gray-800 hover:(bg-gray-800 text-gray-100)") Blog
    NuxtLink(to="/portfólio" class="no-underline w-full md:w-1/2 p-2 border border-gray-800 rounded rounded-lg text-gray-800 hover:(bg-gray-800 text-gray-100)") Portfólio
</template>
