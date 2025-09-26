// Wolt — Επισκέψεις / app.js (v9) — χωρίς πεδία Αλυσίδα/Υποκατηγορία στη φόρμα
console.log("Wolt Visits — JS version 9");

const uid = () => Math.random().toString(36).slice(2, 9);
const todayISO = () => new Date().toISOString().slice(0, 10);
const save = (k,v)=>localStorage.setItem(k, JSON.stringify(v));
const load = (k,f)=>{ try{const v=JSON.parse(localStorage.getItem(k)); return v??f;}catch{return f;} };

const CHAINS = [
  { name: "Μασούτης",   subs: ["Αγγελάκη", "Μακεδονίας"] },
  { name: "Σκλαβενίτης", subs: ["Αγγελάκη", "Μακεδονίας"] },
];

const MEMBERS = ["Ελένη", "Τάσος", "Παρασκευή"];
const VISIT_STATUSES = [
  { id: "planned", label: "planned" },
  { id: "done",    label: "done"    },
];

function App(){
  const [nav, setNav] = React.useState({ level: "menu", chain: null, sub: null });
  const [menuQuery, setMenuQuery] = React.useState("");
  const [visits, setVisits] = React.useState(()=>load("wv_visits", []));
  const [form, setForm] = React.useState({
    id:"", chain:"", sub:"",
    ownerName: MEMBERS[0],
    venueCity: "",
    visitDate: todayISO(),
    needsFollowUp: "no",
    visitStatus: "planned",
  });

  React.useEffect(()=>save("wv_visits", visits), [visits]);

  // Κρατάμε chain/sub μόνο εσωτερικά (για αποθήκευση και φίλτρα), δεν τα δείχνουμε στη φόρμα
  React.useEffect(()=>{
    setForm(f=>({ ...f, chain: nav.chain || "", sub: nav.sub || "" }));
  }, [nav.chain, nav.sub]);

  function addVisit(){
    if(!form.chain || !form.sub){ alert("Διάλεξε αλυσίδα/υποκατηγορία από το μενού."); return; }
    const v = { ...form, id: uid() };
    setVisits([v, ...visits]);
    setForm(f=>({ ...f, id:"", venueCity:"" }));
  }
  function removeVisit(id){ if(!confirm("Διαγραφή;")) return; setVisits(visits.filter(v=>v.id!==id)); }
  function updateVisit(id, patch){ setVisits(visits.map(v=>v.id===id?{...v, ...patch}:v)); }

  return (
    React.createElement("div", {className:"min-h-screen md:flex bg-gray-50"},
      /* ===== Sidebar ===== */
      React.createElement("aside", {className:"md:w-72 border-r bg-white"},
        React.createElement("div", {className:"p-3 border-b flex items-center justify-between"},
          React.createElement("div",{className:"text-sm font-semibold"},"Μενού"),
          nav.level!=="menu" && React.createElement("button", {
            className:"text-xs px-2 py-1 rounded border",
            onClick:()=> setNav(
              nav.level==="sub" ? {level:"chains"} :
              nav.level==="chains" ? {level:"menu"} : {level:"menu"}
            )
          },"Πίσω")
        ),
        React.createElement("div",{className:"p-2"},
          React.createElement("input",{
            placeholder:"Αναζήτηση αλυσίδας/υποκατηγορίας...",
            value: menuQuery,
            onChange: e=>setMenuQuery(e.target.value),
            className:"w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          })
        ),
        React.createElement("nav",{className:"p-2 space-y-1"},
          nav.level==="menu" && React.createElement("button",{
            className:"w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50",
            onClick:()=>setNav({level:"chains"})
          },"Αλυσίδες"),
          nav.level==="chains" && CHAINS
            .filter(ch => ch.name.toLowerCase().includes(menuQuery.toLowerCase()))
            .map(ch =>
              React.createElement("button",{
                key:ch.name,
                className:"w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50",
                onClick:()=>setNav({level:"sub", chain: ch.name})
              }, ch.name)
            ),
          nav.level==="sub" && CHAINS
            .find(x=>x.name===nav.chain)?.subs
            .filter(s => (`${nav.chain} ${s}`).toLowerCase().includes(menuQuery.toLowerCase()))
            .map(s =>
              React.createElement("button",{
                key:s,
                className:"w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50",
                onClick:()=>setNav({level:"sub", chain: nav.chain, sub: s})
              }, `${nav.chain} ${s}`)
            )
        )
      ),
      /* ===== Main ===== */
      React.createElement("main",{className:"flex-1 p-4 space-y-4"},
        React.createElement("header",{className:"flex items-center justify-between"},
          React.createElement("h1",{className:"text-xl font-bold"},"Wolt — Επισκέψεις"),
          React.createElement("div",{className:"text-xs text-gray-600"},
            (nav.chain||"—") + (nav.sub? ` • ${nav.sub}` : "")
          )
        ),
        (nav.level==="sub" && nav.chain && nav.sub) &&
          React.createElement("section",{className:"bg-white rounded-2xl p-3 shadow"},
            React.createElement("h2",{className:"font-semibold mb-2"},"Νέα επίσκεψη"),
            // ✅ ΜΟΝΟ τα 5 πεδία που ζήτησες
            React.createElement("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-3"},
              Select("Owner Name", {
                value:form.ownerName,
                onChange:e=>setForm({...form, ownerName:e.target.value})
              }, MEMBERS.map(n=>React.createElement("option",{key:n,value:n},n))),
              Input("Venue city", {
                value:form.venueCity,
                onChange:e=>setForm({...form, venueCity:e.target.value})
              }),
              Input("Visit Date", {
                type:"date",
                value:form.visitDate,
                onChange:e=>setForm({...form, visitDate:e.target.value})
              }),
              Select("Needs Follow Up", {
                value:form.needsFollowUp,
                onChange:e=>setForm({...form, needsFollowUp:e.target.value})
              },
                React.createElement("option",{value:"no"},"no"),
                React.createElement("option",{value:"yes"},"yes"),
              ),
              Select("Visit Status", {
                value:form.visitStatus,
                onChange:e=>setForm({...form, visitStatus:e.target.value})
              }, VISIT_STATUSES.map(s=>React.createElement("option",{key:s.id,value:s.id},s.label))),
            ),
            React.createElement("div",{className:"mt-3 flex justify-end"},
              React.createElement("button",{className:"px-4 py-2 rounded-2xl bg-blue-600 text-white", onClick:addVisit},"Αποθήκευση")
            )
          ),
        (nav.chain || nav.sub) &&
          React.createElement("section",{className:"bg-white rounded-2xl p-3 shadow"},
            React.createElement("h2",{className:"font-semibold mb-2"},"Επισκέψεις"),
            visits.filter(v=>
              (!nav.chain || v.chain===nav.chain) &&
              (!nav.sub  || v.sub===nav.sub)
            ).length===0
              ? React.createElement("div",{className:"text-sm text-gray-600"},"Δεν υπάρχουν εγγραφές.")
              : React.createElement("div",{className:"grid gap-2"},
                  visits.filter(v=>
                    (!nav.chain || v.chain===nav.chain) &&
                    (!nav.sub  || v.sub===nav.sub)
                  ).map(v=> React.createElement(Card, {key:v.id, v, onUpdate:updateVisit, onRemove:removeVisit}))
                )
          ),
      )
    )
  );
}

/* UI helpers */
function Label(text){ return React.createElement("span",{className:"mb-1 block text-sm font-medium text-gray-700"}, text); }
function Input(label, props){
  return React.createElement("label",{className:"block"},
    Label(label),
    React.createElement("input",{...props, className:"w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"})
  );
}
function Select(label, props, children){
  return React.createElement("label",{className:"block"},
    Label(label),
    React.createElement("select",{...props, className:"w-full rounded-xl border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"}, children)
  );
}
function Card({v, onUpdate, onRemove}){
  return React.createElement("div",{className:"rounded-2xl border p-3 shadow-sm"},
    React.createElement("div",{className:"flex items-start justify-between gap-2"},
      React.createElement("div",null,
        React.createElement("div",{className:"text-xs text-gray-600"}, `${v.chain} • ${v.sub} • ${v.visitDate}`),
        React.createElement("div",{className:"text-sm"}, `Owner: ${v.ownerName}`),
        React.createElement("div",{className:"text-xs text-gray-600"}, `City: ${v.venueCity}`),
        React.createElement("div",{className:"text-xs"}, `Follow up: ${v.needsFollowUp} • Status: ${v.visitStatus}`)
      ),
      React.createElement("div",{className:"flex items-center gap-2"},
        React.createElement("select",{
          className:"rounded-xl border px-2 py-1 text-xs",
          value:v.visitStatus,
          onChange:e=>onUpdate(v.id,{ visitStatus: e.target.value })
        },
          React.createElement("option",{value:"planned"},"planned"),
          React.createElement("option",{value:"done"},"done"),
        ),
        React.createElement("button",{className:"rounded-xl border px-2 py-1 text-xs hover:bg-red-50", onClick:()=>onRemove(v.id)},"Διαγραφή")
      )
    )
  );
}

/* Auto-mount */
(function(){
  const el = document.getElementById("root");
  const root = ReactDOM.createRoot(el);
  root.render(React.createElement(App));
})();
