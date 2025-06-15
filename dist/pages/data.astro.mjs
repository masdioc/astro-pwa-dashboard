import { c as createComponent, a as renderTemplate, m as maybeRenderHead, r as renderComponent } from '../chunks/astro/server_pCtNrz35.mjs';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_D_JTgUpV.mjs';
import 'clsx';
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$AddUserForm = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate(_a || (_a = __template(["", '<div id="addUserModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden"> <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative"> <button onclick="closeModal()" class="absolute top-2 right-2 text-gray-600 hover:text-red-500">\n\u2715\n</button> <h2 class="text-xl font-bold mb-4">Tambah Pengguna</h2> <form id="addUserForm" class="grid grid-cols-1 md:grid-cols-2 gap-4"> <input type="text" id="firstName" placeholder="Nama Depan" class="border p-2 rounded" required> <input type="text" id="lastName" placeholder="Nama Belakang" class="border p-2 rounded" required> <input type="email" id="email" placeholder="Email" class="border p-2 rounded" required> <input type="text" id="phone" placeholder="No. Telepon" class="border p-2 rounded"> <div class="md:col-span-2 flex justify-end"> <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">\nSimpan\n</button> </div> </form> </div> </div> <script type="module">\n  const form = document.getElementById("addUserForm");\n  const modal = document.getElementById("addUserModal");\n\n  form.addEventListener("submit", async (e) => {\n    e.preventDefault();\n\n    const newUser = {\n      firstName: document.getElementById("firstName").value.trim(),\n      lastName: document.getElementById("lastName").value.trim(),\n      email: document.getElementById("email").value.trim(),\n      phone: document.getElementById("phone").value.trim(),\n    };\n\n    try {\n      const res = await fetch("https://dummyjson.com/users/add", {\n        method: "POST",\n        headers: { "Content-Type": "application/json" },\n        body: JSON.stringify(newUser),\n      });\n\n      const result = await res.json();\n\n      window.dispatchEvent(new CustomEvent("user-added", { detail: result }));\n      form.reset();\n      modal.classList.add("hidden");\n      alert("User berhasil ditambahkan!");\n    } catch (err) {\n      console.error("Gagal menambahkan user:", err);\n      alert("Gagal menambahkan user.");\n    }\n  });\n\n  window.openModal = function () {\n    modal.classList.remove("hidden");\n  };\n\n  window.closeModal = function () {\n    modal.classList.add("hidden");\n  };\n<\/script>'])), maybeRenderHead());
}, "D:/ASTRO/astro-pwa-app/src/components/AddUserForm.astro", void 0);

const $$Data = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "data" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<h1 class="text-3xl font-bold mb-4">Data Pengguna</h1> ${renderComponent($$result2, "AddUserForm", $$AddUserForm, {})} <div class="mb-4 flex gap-4 items-center"> <input type="text" id="searchInput" placeholder="Cari nama atau email..." class="px-4 py-2 border rounded w-full max-w-md shadow-sm"> <button onclick="resetSearch()" class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm">
Reset
</button> <button onclick="exportToExcel()" class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded text-sm">
Export Excel
</button> <button onclick="openModal()" class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded text-sm">
+ Tambah Pengguna
</button> </div> <div id="loading" class="text-blue-600 mb-4">⏳ Memuat data...</div> <div class="mb-4 flex items-center gap-2"> <label for="pageSize" class="text-sm font-medium">Tampilkan</label> <select id="pageSize" class="border px-2 py-1 rounded text-sm"> <option value="5">5</option> <option value="10" selected>10</option> <option value="20">20</option> <option value="50">50</option> </select> <span class="text-sm">baris per halaman</span> </div> <table class="min-w-full bg-white border border-gray-300 hidden" id="userTable"> <thead class="bg-blue-100"> <tr> <th class="border px-4 py-2 text-left">ID</th> <th class="border px-4 py-2 text-left">Nama</th> <th class="border px-4 py-2 text-left">Email</th> <th class="border px-4 py-2 text-left">Aksi</th> </tr> </thead> <tbody id="data-table-body"> <!-- Data baris diisi oleh JS --> </tbody> </table>  <div class="flex justify-between items-center mt-4 gap-2"> <button id="btnPrev" onclick="prevPage()" class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50">Prev</button> <span id="page-info" class="text-sm text-gray-700"></span> <button id="btnNext" onclick="nextPage()" class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50">Next</button> </div>  ` })}`;
}, "D:/ASTRO/astro-pwa-app/src/pages/data.astro", void 0);

const $$file = "D:/ASTRO/astro-pwa-app/src/pages/data.astro";
const $$url = "/data";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Data,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
