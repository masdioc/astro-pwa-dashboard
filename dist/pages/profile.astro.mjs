import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_pCtNrz35.mjs';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_D_JTgUpV.mjs';
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Profile = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Profil Pengguna" }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([" ", '<main class="ml-60 flex-1 p-6"> <h1 class="text-2xl font-bold mb-4">Profil Pengguna</h1> <div id="profileBox" class="bg-white p-6 rounded shadow w-full max-w-lg border"> <p>Memuat data pengguna...</p> </div> <script type="module">\n      const user = JSON.parse(localStorage.getItem("user") || "{}");\n      const box = document.getElementById("profileBox");\n\n      if (user?.id) {\n        box.innerHTML = `\n          <p><strong>Nama:</strong> ${user.firstName} ${user.lastName}</p>\n          <p><strong>Email:</strong> ${user.email}</p>\n          <p><strong>Username:</strong> ${user.username}</p>\n          <p><strong>Phone:</strong> ${user.phone}</p>\n          <p><strong>Gender:</strong> ${user.gender}</p>\n        `;\n      } else {\n        box.innerHTML = `<p class="text-red-500">Gagal memuat data pengguna.</p>`;\n      }\n    <\/script> </main> '], [" ", '<main class="ml-60 flex-1 p-6"> <h1 class="text-2xl font-bold mb-4">Profil Pengguna</h1> <div id="profileBox" class="bg-white p-6 rounded shadow w-full max-w-lg border"> <p>Memuat data pengguna...</p> </div> <script type="module">\n      const user = JSON.parse(localStorage.getItem("user") || "{}");\n      const box = document.getElementById("profileBox");\n\n      if (user?.id) {\n        box.innerHTML = \\`\n          <p><strong>Nama:</strong> \\${user.firstName} \\${user.lastName}</p>\n          <p><strong>Email:</strong> \\${user.email}</p>\n          <p><strong>Username:</strong> \\${user.username}</p>\n          <p><strong>Phone:</strong> \\${user.phone}</p>\n          <p><strong>Gender:</strong> \\${user.gender}</p>\n        \\`;\n      } else {\n        box.innerHTML = \\`<p class="text-red-500">Gagal memuat data pengguna.</p>\\`;\n      }\n    <\/script> </main> '])), maybeRenderHead()) })}`;
}, "D:/ASTRO/astro-pwa-app/src/pages/profile.astro", void 0);

const $$file = "D:/ASTRO/astro-pwa-app/src/pages/profile.astro";
const $$url = "/profile";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Profile,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
