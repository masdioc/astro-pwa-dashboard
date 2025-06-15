import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_pCtNrz35.mjs';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_D_JTgUpV.mjs';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts';
export { renderers } from '../renderers.mjs';

function UserChart({ userCount }) {
  const data = [
    { name: "Pengguna", jumlah: userCount },
    { name: "Sisa Slot", jumlah: 100 - userCount }
    // misal batas 100
  ];
  return /* @__PURE__ */ React.createElement(ResponsiveContainer, { width: "100%", height: 300 }, /* @__PURE__ */ React.createElement(BarChart, { data }, /* @__PURE__ */ React.createElement(CartesianGrid, { strokeDasharray: "3 3" }), /* @__PURE__ */ React.createElement(XAxis, { dataKey: "name" }), /* @__PURE__ */ React.createElement(YAxis, { allowDecimals: false }), /* @__PURE__ */ React.createElement(Tooltip, null), /* @__PURE__ */ React.createElement(Bar, { dataKey: "jumlah", fill: "#3182ce" })));
}

const $$Dashboard = createComponent(async ($$result, $$props, $$slots) => {
  const res = await fetch("https://dummyjson.com/users");
  const json = await res.json();
  const userCount = json.users.length;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Dashboard" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="bg-white dark:bg-gray-800 p-6 rounded shadow max-w-xl mx-auto"> <h2 class="text-xl font-semibold mb-4">Grafik Jumlah Pengguna</h2> ${renderComponent($$result2, "UserChart", UserChart, { "userCount": userCount, "client:load": true, "client:component-hydration": "load", "client:component-path": "D:/ASTRO/astro-pwa-app/src/components/UserChart.jsx", "client:component-export": "default" })} </div> ` })}`;
}, "D:/ASTRO/astro-pwa-app/src/pages/dashboard.astro", void 0);

const $$file = "D:/ASTRO/astro-pwa-app/src/pages/dashboard.astro";
const $$url = "/dashboard";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Dashboard,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
