const starterItems = [
  {id:1,name:"Blue water bottle",type:"Lost",category:"Accessories",location:"Library, first floor",date:"2026-11-25",description:"Matte blue bottle with a silver cap.",icon:"▣"},
  {id:2,name:"Black notebook",type:"Found",category:"Books & stationery",location:"Canteen seating area",date:"2026-11-24",description:"Plain black notebook found near the window.",icon:"▤"},
  {id:3,name:"Wireless earbuds case",type:"Found",category:"Electronics",location:"Computer lab",date:"2026-11-23",description:"Small white charging case. No brand details.",icon:"◉"}
];
let reports = JSON.parse(localStorage.getItem("campusfind-reports") || "null") || starterItems;
let activeFilter = "All";
const grid = document.getElementById("itemsGrid");
const search = document.getElementById("searchInput");
const empty = document.getElementById("emptyState");
const icons = {"Accessories":"▣","Electronics":"◉","Books & stationery":"▤","Clothing":"♧","Other":"◇"};

function renderItems(){
  const term = search.value.trim().toLowerCase();
  const visible = reports.filter(item => (activeFilter==="All" || item.type===activeFilter) &&
    [item.name,item.location,item.category,item.description].join(" ").toLowerCase().includes(term));
  grid.innerHTML = visible.map(item => `
    <article class="item-card">
      <div class="item-top"><span class="item-icon">${icons[item.category] || "◇"}</span><span class="pill ${item.type}">${item.type}</span></div>
      <h3>${escapeHTML(item.name)}</h3>
      <p>${escapeHTML(item.description)}</p>
      <div class="item-meta"><span>⌖ ${escapeHTML(item.location)}</span><span>${escapeHTML(item.date)}</span></div>
    </article>`).join("");
  empty.hidden = visible.length !== 0;
}
function escapeHTML(value){
  return String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}
document.querySelectorAll(".filter").forEach(button => button.addEventListener("click",()=>{
  document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));
  button.classList.add("active"); activeFilter=button.dataset.filter; renderItems();
}));
search.addEventListener("input",renderItems);
document.getElementById("reportForm").addEventListener("submit",event=>{
  event.preventDefault();
  const form = new FormData(event.target);
  const report = {
    id:Date.now(), name:form.get("name").trim(), type:form.get("type"),
    category:form.get("category"), location:form.get("location").trim(),
    date:form.get("date"), description:form.get("description").trim()
  };
  reports.unshift(report);
  localStorage.setItem("campusfind-reports",JSON.stringify(reports));
  activeFilter="All";
  document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b.dataset.filter==="All"));
  search.value="";
  renderItems();
  event.target.reset();
  document.getElementById("formMessage").textContent="Your report has been added to this browser's demo board.";
  document.getElementById("browse").scrollIntoView({behavior:"smooth"});
});
renderItems();
