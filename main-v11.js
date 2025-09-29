// Wolt Visits — main-v11 (chains shown by default, no chain/sub fields in form)
// Kill any service workers so old cached JS doesn’t stick
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then(rs => rs.forEach(r => r.unregister().catch(()=>{})));
  // Also clear old caches (best effort)
  if (window.caches && caches.keys) caches.keys().then(keys => keys.forEach(k => caches.delete(k)));
}

const uid = () => Math.random().toString(36).slice(2, 9);
const todayISO = () => new Date().toISOString().slice(0, 10);
const save = (k,v)=>localStorage.setItem(k, JSON.stringify(v));
const load = (k,f)=>{ try{const v=JSON.parse(localStorage.getItem(k)); return v ?? f;}catch{return f;} };

// ===== Δεδομένα Μενού
const CHAINS = [
  { name: "Μασούτης",   subs: ["Αγγελάκη", "Μακεδονίας"] },
  { name: "Σκλαβενίτης", subs: ["Αγγελάκη", "Μακεδονίας"] },
];

// ===== Σταθερές επιλογές φόρμας
const OWNERS = ["Ελένη", "Τάσος", "Παρασκευή"];
const VISIT_STATUSES = ["planned", "done"];

function App(){
  // -> Ξεκινάμε κατευθείαν στα Chains (όχι “Αλυσίδες” κουμπί)
  const [nav, setNav] = React.useState({ level: "chains", chain: null, sub: null });
  const [menuQuery, setMenuQuery] = React.useState("");
  const [visits, setVisits] = React.useState(()=>load("wfv_visits", []));
  const [form, setForm] = React.useState({
    id: "",
    chain: "",
    sub: "",
    ownerName: OWNERS[0],
    venueCity: "",
    visitDate: todayISO(),
    needsFollowUp: "no",       // "yes" | "no"
    visitStatus: "planned",    // "planned" | "done"
  });

  React.useEffect(()=>save("wfv_visits", visits), [visits]);

  // sync τρέχουσα επιλογή μενού στη φόρμα (χωρίς να την εμφανίζουμε)
  React.useEffect(()=>{
    setForm(f => ({ ...f, chain: nav.chain || "", sub: nav.sub || "" }));
  }, [nav.chain, nav.sub]);

  function addVisit(){
    if (!form.chain || !form.sub) { alert("Διάλεξε υποκατάστημα από το μενού."); return; }
    const v = { ...form, id: uid() };
    setVisits(prev => [v, ...prev]);
    setForm(f => ({ ...f, id:"", venueCity:"" })); // καθάρισε πεδία κειμένου
  }
  function removeVisit(id){
    if (!confirm("Διαγραφή;")) return;
    setVisits(prev => prev.filter(v => v.id !== id));
  }
  function updateVisit(id, patch){
    setVisits(prev => prev.map(v => v.id === id ? ({...v, ...patch}) : v));
  }

  // ===== UI
  return React.createElement("div", {className:"min-h-screen md:flex bg-gray-50"},

    // Sidebar
    React.createElement("aside", {className:"md:w-72 border-r bg-white"},
      React.createElement("div", {className:"p-3 border-b flex items-center justify-between"},
        React.createElement("div",{className:"text-sm font-semibold"},"Μενού"),
        nav.level === "sub" && React.createElement("button", {
          className:"text-xs px-2 py-1 rounded border",
          onClick:()=> setNav({ level:"chains", chain:null, sub:null })
        },"Πίσω")
      ),

      // Αναζήτηση
      React.createElement("div",{className:"p-2"},
        React.createElement("input",{
          placeholder:"Αναζήτηση…",
          value: menuQuery,
          onChange: e=>setMenuQuery(e.target.value),
          className:"w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
        })
      ),

      // Περιεχόμενο μενού
      React.createElement("nav",{className:"p-2 space-y-1"},
        // Επίπεδο: Chains (default)
        nav.level === "chains" &&
          CHAINS
            .filter(ch => ch.name.toLowerCase().includes(menuQuery.toLowerCase()))
            .map(ch => React.createElement("button",{
                key: ch.name,
                className:"w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50",
                onClick:()=> setNav({ level:"sub", chain: ch.name, sub:null })
              }, ch.name)
            ),

        // Επίπεδο: Subchains
        nav.level === "sub" &&
          (CHAINS.find(c=>c.name===nav.chain)?.subs || [])
            .filter(s => (`${nav.chain} ${s}`).toLowerCase().includes(menuQuery.toLowerCase()))
            .map(s => React.createElement("button",{
                key:s,
                className:`w-full text-left px-3 py-2 rounded-xl ${nav.sub===s?"bg-blue-50":"hover:bg-gray-50"}`,
                onClick:()=> setNav({ level:"sub", chain: nav.chain, sub: s })
              }, `${nav.chain} ${s}`)
            )
      )
    ),

    // Main
    React.createElement("main",{className:"flex-1 p-4 space-y-4"},
      React.createElement("header",{className:"flex items-center justify-between"},
        React.createElement("h1",{className:"text-xl font-bold"},"Wolt — Επισκέψεις"),
        React.createElement("div",{className:"text-xs text-gray-600"},
          [nav.chain, nav.sub].filter(Boolean).join(" • ") || "—"
        )
      ),

      // Φόρμα (μόνο όταν έχουμε επιλέξει υποκατάστημα)
      (nav.level==="sub" && nav.chain && nav.sub) &&
        React.createElement("section",{className:"bg-white rounded-2xl p-3 shadow"},
          React.createElement("h2",{className:"font-semibold mb-2"},"Νέα επίσκεψη"),
          React.createElement("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-3"},
            // 🔻 ΜΟΝΟ αυτά τα 5 πεδία — ΧΩΡΙΣ Αλυσίδα/Υποκατηγορία στη φόρμα
            Select("Owner Name", {
              value:form.ownerName,
              onChange:e=>setForm({...form, ownerName:e.target.value})
            }, OWNERS.map(n=>React.createElement("option",{key:n,value:n},n))),

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
            },
              VISIT_STATUSES.map(s=>React.createElement("option",{key:s,value:s},s))
            )
          ),
          React.createElement("div",{className:"mt-3 flex justify-end"},
            React.createElement("button",{className:"px-4 py-2 rounded-2xl bg-blue-600 text-white", onClick:addVisit},"Αποθήκευση")
          )
        ),

      // Λίστα επισκέψεων του τρέχοντος scope
      (nav.chain) &&
        React.createElement("section",{className:"bg-white rounded-2xl p-3 shadow"},
          React.createElement("h2",{className:"font-semibold mb-2"},"Επισκέψεις"),
          visits.filter(v =>
            (!nav.chain || v.chain===nav.chain) &&
            (!nav.sub   || v.sub===nav.sub)
          ).length === 0
            ? React.createElement("div",{className:"text-sm text-gray-600"},"Δεν υπάρχουν εγγραφές.")
            : React.createElement("div",{className:"grid gap-2"},
                visits
                  .filter(v =>
                    (!nav.chain || v.chain===nav.chain) &&
                    (!nav.sub   || v.sub===nav.sub)
                  )
                  .map(v => React.createElement(Card, { key:v.id, v, onUpdate:updateVisit, onRemove:removeVisit }))
              )
        )
    )
  );
}

/* ===== Μικρά UI helpers (χωρίς JSX) ===== */
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
function Card({ v, onUpdate, onRemove }){
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
          onChange:e=>onUpdate(v.id, { visitStatus: e.target.value })
        }, React.createElement("option",{value:"planned"},"planned"), React.createElement("option",{value:"done"},"done")),
        React.createElement("button",{className:"rounded-xl border px-2 py-1 text-xs hover:bg-red-50", onClick:()=>onRemove(v.id)},"Διαγραφή")
      )
    )
  );
}

/* ===== Auto-mount ===== */
(function(){
  const el = document.getElementById("root");
  const root = ReactDOM.createRoot(el);
  root.render(React.createElement(App));
})();
