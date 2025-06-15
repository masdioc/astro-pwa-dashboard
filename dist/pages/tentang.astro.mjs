import { c as createComponent, b as createAstro, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_pCtNrz35.mjs';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_D_JTgUpV.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Tentang = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Tentang;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "dashboard" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="p-6"> <h1 class="text-3xl font-bold mb-4">Tentang</h1> <p>
Aplikasi ini dibuat menggunakan Astro, React, dan Tailwind CSS untuk
      performa dan kemudahan pengembangan.
</p> </div> ` })}`;
}, "D:/ASTRO/astro-pwa-app/src/pages/tentang.astro", void 0);

const $$file = "D:/ASTRO/astro-pwa-app/src/pages/tentang.astro";
const $$url = "/tentang";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Tentang,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
