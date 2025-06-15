import"./hoisted.ptXHx6UZ.js";let o=10,n=1,r=[],c=[],d="";async function p(){const t=document.getElementById("loading");t.classList.remove("hidden");try{r=(await(await fetch("https://dummyjson.com/users")).json()).users,i()}catch{t.textContent="❌ Gagal memuat data."}finally{t.classList.add("hidden")}}function i(){const t=d?c:r,e=Math.ceil(t.length/o);n>e&&(n=e||1);const a=(n-1)*o,l=a+o,m=t.slice(a,l).map(s=>`
      <tr class="hover:bg-blue-50 transition">
        <td class="px-6 py-4 border-b border-gray-200">${s.id}</td>
        <td class="px-6 py-4 border-b border-gray-200">${s.firstName} ${s.lastName}</td>
        <td class="px-6 py-4 border-b border-gray-200">${s.email}</td>
        <td class="px-6 py-4 border-b border-gray-200">
          <button onclick="showDetail(${s.id})"
            class="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700">
            Detail
          </button>
        </td>
      </tr>`).join("");document.getElementById("data-table-body").innerHTML=m,document.getElementById("page-info").textContent=`Page ${n} of ${e}`,document.getElementById("btnPrev").disabled=n===1,document.getElementById("btnNext").disabled=n===e,document.getElementById("userTable").classList.remove("hidden")}function u(){const e=Math.ceil((d?c:r).length/o);n<e&&(n++,i())}function b(){n>1&&(n--,i())}function y(t){const e=r.find(g=>g.id===t);if(!e)return;const a=document.getElementById("detail-box"),l=document.getElementById("detail-content");l.innerHTML=`
      <p><strong>Nama:</strong> ${e.firstName} ${e.lastName}</p>
      <p><strong>Email:</strong> ${e.email}</p>
      <p><strong>Phone:</strong> ${e.phone}</p>
      <p><strong>Gender:</strong> ${e.gender}</p>
      <p><strong>Alamat:</strong> ${e.address.address}, ${e.address.city}</p>
      <p><strong>Perusahaan:</strong> ${e.company.name}</p>
    `,a.classList.remove("hidden")}document.getElementById("searchInput").addEventListener("input",t=>{d=t.target.value.trim().toLowerCase(),c=r.filter(e=>`${e.firstName} ${e.lastName}`.toLowerCase().includes(d)||e.email.toLowerCase().includes(d)),n=1,i()});document.getElementById("pageSize").addEventListener("change",t=>{o=parseInt(t.target.value,10),n=1,i()});window.nextPage=u;window.prevPage=b;window.showDetail=y;window.addEventListener("DOMContentLoaded",p);
