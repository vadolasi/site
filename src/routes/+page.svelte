<script lang="ts">
  import type { Person, WithContext } from "schema-dts";

  const jsonLd: WithContext<Person> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Vitor Daniel Lopes dos Santos",
    url: "https://vitordaniel.is-a.dev",
    image: "https://github.com/vadolasi.png",
    jobTitle: "Desenvolvedor Web Full Stack",
    additionalName: "vadolasi",
  };

  const jsonLdString = JSON.stringify(jsonLd).replace(/</g, "\\u003c");
</script>

{@html `<script type="application/ld+json">${jsonLdString}</script>`}

<section
  class="flex flex-col lg:flex-row items-center justify-center h-screen lg:gap-20 bg-linear-to-br from-base-100 to-base-300 overflow-hidden"
>
  <div class="p-10 h-full flex flex-col justify-center">
    <h1
      class="text-5xl font-bold tracking-tighter text-base-content sm:text-6xl md:text-7xl lg:text-8xl"
    >
      Vitor Daniel
    </h1>

    <div>
      <h2
        class="mt-2 text-2xl font-semibold tracking-tight md:text-3xl bg-clip-text text-transparent bg-linear-to-r from-sky-500 via-indigo-500 to-fuchsia-500 animate-gradient bg-size[200%_auto]"
      >
        Desenvolvedor Full Stack
      </h2>
    </div>
  </div>

  <div class="flex justify-center items-center h-full">
    <div>
      <enhanced:img
        src="../lib/assets/photo.webp"
        alt="Foto de Vitor Daniel"
        class="max-w-150"
      />
    </div>
  </div>
</section>

<section
  class="flex flex-col items-center justify-center min-h-screen px-10 py-30 mx-auto prose lg:prose-lg"
>
  <div>
    <h1>Sobre mim</h1>

    <p>
      Sou desenvolvedor full stack com mais de 5 anos de experiência prática e
      dezenas de projetos concluídos e clientes satisfeitos. Meu foco é entender
      o problema e desenvolver soluções completas.
    </p>

    <p>
      Sou apaixonado por tecnologia desde que me entendo por gente. Eu era
      aquela criança curiosa que desmontava os brinquedos para tentar entender
      como funcionava. Essa curiosidade me levou a aprender programação bem
      cedo. Além de curioso, sempre tive vontade de por meus conhecimentos em
      prática e criar soluções para o mundo real. Por isso comecei a fazer
      freelancer quando eu tinha por volta de 14 anos.
    </p>
  </div>
</section>
