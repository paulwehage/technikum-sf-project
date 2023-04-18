# Explain shortly why our use-case is not a good fit for build-time rendering.

The data of our application is changing rapidly, thus using a static site generator like Gatsby or Astro doesn't make sense. Next.js (like SolidStart, SvelteKit etc.) is a perfect fit here. We get the benefit of SSR (like fast page load and SEO) and the benefits of CSR (like responsiveness) through hydration.
