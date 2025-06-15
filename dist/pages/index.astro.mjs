import { c as createComponent, e as renderHead, a as renderTemplate } from '../chunks/astro/server_pCtNrz35.mjs';
import 'kleur/colors';
import 'html-escaper';
import 'clsx';
/* empty css                                     */
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="id"> <head><meta charset="UTF-8"><title>Login</title><meta name="viewport" content="width=device-width, initial-scale=1.0">${renderHead()}</head> <body class="bg-gray-100 dark:bg-gray-900 flex items-center justify-center min-h-screen px-4"> <div class="max-w-4xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row border border-gray-200 dark:border-gray-700"> <!-- Gambar --> <div class="hidden md:block md:w-1/2"> <img src="/images/bg-login.png" alt="Login Image" class="w-full h-full object-cover"> </div> <!-- Form --> <div class="w-full md:w-1/2 p-8"> <h2 class="text-2xl font-bold text-center text-gray-700 dark:text-white mb-6">
Login ke Aplikasi
</h2> <form id="loginForm" onsubmit="handleLogin(event)" class="space-y-4"> <div> <label for="username" class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Username</label> <input type="text" id="username" required class="w-full px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:border-blue-400 dark:bg-gray-700 dark:text-white"> </div> <div class="relative"> <label for="password" class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Password</label> <input type="password" id="password" required class="w-full px-4 py-2 border rounded pr-10 shadow-sm focus:outline-none focus:ring focus:border-blue-400 dark:bg-gray-700 dark:text-white"> <button type="button" id="togglePassword" class="absolute right-3 top-9 text-sm text-gray-600 dark:text-gray-300">
👁️
</button> </div> <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded">
Login
</button> </form> </div> </div>  </body> </html> `;
}, "D:/ASTRO/astro-pwa-app/src/pages/index.astro", void 0);

const $$file = "D:/ASTRO/astro-pwa-app/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
