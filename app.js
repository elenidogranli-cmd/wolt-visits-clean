// Απλό, καθαρό JS (χωρίς imports)

const uid = () => Math.random().toString(36).slice(2, 9);
const todayISO = () => new Date().toISOString().slice(0, 10);
const save = (k,v)=>localStorage.setItem(k, JSON.stringify(v));
const load = (k,f)=>{ try{const v=JSON.parse(localStorage.getItem(k)); return v??f;}catch{return f;} };

// Δομή μενού → αλυσίδες → υποκατηγορίες
const CHAINS = [
  { name: "Μασούτης", subs: ["Αγγελάκη", "Μακεδονίας"] },
  { name: "Σκλαβενίτης", subs: ["Αγγελάκη", "Μακεδονίας"] },
];

const DEFAULT_TEAM = [
  { id: "eleni", name: "Eleni" },
  { id: "member2", name: "Μέλος 2" },
  { id: "member3", name: "Μέλος 3" },
];
const STATUSES = [
  { id: "planned", label: "Προγραμματισμένο" },
  { id: "completed", label: "Ολοκληρωμένο" },
  { id: "cancelled", label: "Ακυρωμένο" },
];

function App(){
  const [nav, setNav] = React.useState({ level: "menu", chain: null, sub: null });
  const [team, setTeam] = React.useState(()=>load("wv_team", DEFAULT_TEAM));
  const [visits, setVisits] = React.useState(()=>load("wv_visits", []));
  const [form, setForm] = React.useState({
    id:"", chain:"", sub:"", venueName:"", venueCity:"",
    visitDate: todayISO(), status:"planned", assignedTo:"eleni"
  });

  React.useEffect(()=>save("wv_team", team), [team]);
  React.useEffect(()=>save("wv_visits", visits), [visits]);

  // Όταν αλλάζει context, ενημέρωσε τη φόρμα
  React.useEffect(()=>{
    setForm(f=>({ ...f,
      chain: nav.chain || "",
      sub: nav.sub || ""
    }));
  }, [nav.chain, nav.sub]);

  function addVisit(){
    if(!form.chain || !form.sub){ alert("Διάλεξε αλυσίδα/υποκατηγορία από το μενού."); return; }
    const v = { ...form, id: uid() };
    setVisits([v, ...visits]);
    setForm(f=>({ ...f, id:"", venueName:"", venueCity:"" }));
  }
  function removeVisit(id){ if(!confirm("Διαγραφή;")) return; setVisits(visits.filter(v=>v.id!==id)); }
  function updateVisit(id, patch){ setVisits(visits.map(v=>v.id===id?{...v, ...patch}:v)); }

  // UI
  return (
    React.createElement("div", {className:"min-h-screen md:flex"},
      // Sidebar
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
        React.createElement("nav",{className:"p-2 space-y-1"},
          nav.level==="menu" && React.createElement("button",{
            className:"w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50",
            onClick:()=>setNav({level:"chains"})
          },"Αλυσίδες"),

          nav.level==="chains" && CHAINS.map(ch =>
            React.createElement("button",{
              key:ch.name,
              className:"w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50",
              onClick:()=>setNav({level:"sub", chain: ch.name})
            }, ch.name)
          ),

          nav.level==="sub" && CHAINS.find(x=>x.name===nav.chain)?.subs.map(s =>
            React.createElement("button",{
              key:s,
              className:"w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50",
              onClick:()=>setNav({level:"sub", chain: nav.chain, sub: s})
            }, `${nav.chain} ${s}`)
          )
        )
      ),

      // Main
      React.createElement("main",{className:"flex-1 p-4 space-y-4"},
        React.createElement("header",{className:"flex items-center justify-between"},
          React.createElement("h1",{className:"text-xl font-bold"},"Wolt — Επισκέψεις (Clean)"),
          React.createElement("div",{className:"text-xs text-gray-600"},
            (nav.chain||"—") + (nav.sub? ` • ${nav.sub}` : "")
          )
        ),

        // Φόρμα μόνο όταν έχεις chain + sub
        (nav.level==="sub" && nav.chain && nav.sub) &&
          React.createElement("section",{className:"bg-white rounded-2xl p-3 shadow"},
            React.createElement("h2",{className:"font-semibold mb-2"},"Νέα επίσκεψη"),
            React.createElement("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-3"},
              Input("Αλυσίδα", {value:form.chain, readOnly:true}),
              Input("Υποκατηγορία", {value:form.sub, readOnly:true}),
              Input("Venue Name", {value:form.venueName, onChange:e=>setForm({...form, venueName:e.target.value})}),
              Input("Venue City", {value:form.venueCity, onChange:e=>setForm({...form, venueCity:e.target.value})}),
              Input("Visit Date", {type:"date", value:form.visitDate, onChange:e=>setForm({...form, visitDate:e.target.value})}),
              Select("Κατάσταση", {value:form.status, onChange:e=>setForm({...form, status:e.target.value})},
                STATUSES.map(s=>React.createElement("option",{key:s.id,value:s.id},s.label))
              ),
              Select("Μέλος", {value:form.assignedTo, onChange:e=>setForm({...form, assignedTo:e.target.value})},
                team.map(t=>React.createElement("option",{key:t.id,value:t.id},t.name))
              ),
            ),
            React.createElement("div",{className:"mt-3 flex justify-end"},
              React.createElement("button",{className:"px-4 py-2 rounded-2xl bg-blue-600 text-white", onClick:addVisit},"Αποθήκευση")
            )
          ),

        // Λίστα
        (nav.chain || nav.sub) &&
          React.createElement("section",{className:"bg-white rounded-2xl p-3 shadow"},
            React.createElement("h2",{className:"font-semibold mb-2"},"Επισκέψεις"),
            visits.filter(v=>
              (!nav.chain || v.chain===nav.chain) &&
              (!nav.sub || v.sub===nav.sub)
            ).length===0
              ? React.createElement("div",{className:"text-sm text-gray-600"},"Δεν υπάρχουν εγγραφές.")
              : React.createElement("div",{className:"grid gap-2"},
                  visits.filter(v=>
                    (!nav.chain || v.chain===nav.chain) &&
                    (!nav.sub || v.sub===nav.sub)
                  ).map(v=> React.createElement(Card, {key:v.id, v, team, onUpdate:updateVisit, onRemove:removeVisit}))
                )
          ),

        // Ομάδα
        React.createElement("section",{className:"bg-white rounded-2xl p-3 shadow"},
          React.createElement("h2",{className:"font-semibold mb-2"},"Ομάδα"),
          React.createElement("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-2"},
            team.map((m,i)=>
              Input(`Μέλος ${i+1}`, {value:m.name, onChange:e=>setTeam(team.map(t=>t.id===m.id?{...t,name:e.target.value}:t))})
            )
          )
        )
      )
    )
  );
}

// Μικρά helpers για UI (χωρίς JSX)
function Input(label, props){
  return React.createElement("label",{className:"block"},
    React.createElement("span",{className:"mb-1 block text-sm font-medium text-gray-700"}, label),
    React.createElement("input",{...props, className:"w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"})
  );
}
function Select(label, props, children){
  return React.createElement("label",{className:"block"},
    React.createElement("span",{className:"mb-1 block text-sm font-medium text-gray-700"}, label),
    React.createElement("select",{...props, className:"w-full rounded-xl border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"}, children)
  );
}
function Card({v, team, onUpdate, onRemove}){
  const memberName = team.find(t=>t.id===v.assignedTo)?.name || "—";
  return React.createElement("div",{className:"rounded-2xl border p-3 shadow-sm"},
    React.createElement("div",{className:"flex items-start justify-between"},
      React.createElement("div",null,
        React.createElement("div",{className:"text-xs text-gray-600"}, `${v.chain} • ${v.sub} • ${v.visitDate}`),
        React.createElement("div",{className:"font-semibold"}, v.venueName || "—"),
        React.createElement("div",{className:"text-xs text-gray-600"}, v.venueCity)
      ),
      React.createElement("div",{className:"flex gap-2"},
        React.createElement("select",{className:"rounded-xl border px-2 py-1 text-xs", value:v.status, onChange:e=>onUpdate(v.id,{status:e.target.value})},
          STATUSES.map(s=>React.createElement("option",{key:s.id,value:s.id},s.label))
        ),
        React.createElement("button",{className:"rounded-xl border px-2 py-1 text-xs hover:bg-red-50", onClick:()=>onRemove(v.id)},"Διαγραφή")
      )
    ),
    React.createElement("div",{className:"mt-2 text-xs text-gray-700"}, `Μέλος: ${memberName}`)
  );
}

// Auto-mount
(function(){
  const el = document.getElementById("root");
  const root = ReactDOM.createRoot(el);
  root.render(React.createElement(App));
})();
