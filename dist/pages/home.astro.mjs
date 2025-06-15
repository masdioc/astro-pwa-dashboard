import { c as createComponent, b as createAstro, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_pCtNrz35.mjs';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_D_JTgUpV.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Home = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Home;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "home" }, { "default": ($$result2) => renderTemplate`   ${maybeRenderHead()}<div class="p-6"> <h1 class="text-3xl font-bold mb-4">Home</h1> <p>Selamat datang di HOMe aplikasi PWA Astro.</p> </div>  ` })}`;
}, "D:/ASTRO/astro-pwa-app/src/pages/home.astro", void 0);

const $$file = "D:/ASTRO/astro-pwa-app/src/pages/home.astro";
const $$url = "/home";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Home,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
