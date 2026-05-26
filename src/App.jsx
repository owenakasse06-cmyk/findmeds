import { useState } from "react";

// ── Data ────────────────────────────────────────────────────────────────────
const PHARMACIES = [
  { id: 1, name: "Pharmacie du Plateau", owner: "Dr. Kouassi Ama", phone: "+225 07 12 34 56", district: "Plateau", status: "active", stock: 142, orders: 38, revenue: 284500, joined: "2024-01-15" },
  { id: 2, name: "Pharmacie Sainte-Anne", owner: "Dr. Traoré Moussa", phone: "+225 05 98 76 54", district: "Cocody", status: "active", stock: 98, orders: 24, revenue: 196000, joined: "2024-02-03" },
  { id: 3, name: "Pharmacie de Yopougon", owner: "Dr. Bamba Fatou", phone: "+225 01 23 45 67", district: "Yopougon", status: "pending", stock: 0, orders: 0, revenue: 0, joined: "2024-05-20" },
  { id: 4, name: "Pharmacie Deux-Plateaux", owner: "Dr. Koné Ibrahim", phone: "+225 07 55 44 33", district: "Deux-Plateaux", status: "active", stock: 210, orders: 61, revenue: 415000, joined: "2024-01-28" },
  { id: 5, name: "Pharmacie Adjamé Central", owner: "Dr. Diallo Mariam", phone: "+225 05 11 22 33", district: "Adjamé", status: "suspended", stock: 55, orders: 0, revenue: 89000, joined: "2024-03-10" },
];

const MEDICINES = [
  { id: 1, name: "Amoxicilline 500mg", category: "Antibiotique", price: 1850, stock: 340, status: "available" },
  { id: 2, name: "Paracétamol 1000mg", category: "Antalgique", price: 650, stock: 820, status: "available" },
  { id: 3, name: "Metformine 500mg", category: "Antidiabétique", price: 2100, stock: 45, status: "low" },
  { id: 4, name: "Artémether 20mg", category: "Antipaludéen", price: 3400, stock: 0, status: "out" },
  { id: 5, name: "Ibuprofène 400mg", category: "Anti-inflammatoire", price: 900, stock: 210, status: "available" },
  { id: 6, name: "Oméprazole 20mg", category: "Gastro-entérologie", price: 1400, stock: 18, status: "low" },
];

const ORDERS = [
  { id: "CMD-001", patient: "Kouamé Jean", medicine: "Amoxicilline 500mg", qty: 2, total: 3700, status: "pending", time: "Il y a 5 min", pharmacyId: 1 },
  { id: "CMD-002", patient: "Adjoua Marie", medicine: "Paracétamol 1000mg", qty: 3, total: 1950, status: "confirmed", time: "Il y a 12 min", pharmacyId: 1 },
  { id: "CMD-003", patient: "Koné Salif", medicine: "Artémether 20mg", qty: 1, total: 3400, status: "delivered", time: "Il y a 1h", pharmacyId: 2 },
  { id: "CMD-004", patient: "Brou Essi", medicine: "Ibuprofène 400mg", qty: 2, total: 1800, status: "pending", time: "Il y a 2 min", pharmacyId: 4 },
  { id: "CMD-005", patient: "Touré Aminata", medicine: "Oméprazole 20mg", qty: 1, total: 1400, status: "cancelled", time: "Il y a 3h", pharmacyId: 2 },
];

const PHARMA_STOCK = [
  { id: 1, name: "Amoxicilline 500mg", category: "Antibiotique", qty: 48, price: 1850, threshold: 10, status: "ok" },
  { id: 2, name: "Paracétamol 1000mg", category: "Antalgique", qty: 120, price: 650, threshold: 20, status: "ok" },
  { id: 3, name: "Metformine 500mg", category: "Antidiabétique", qty: 7, price: 2100, threshold: 10, status: "low" },
  { id: 4, name: "Artémether 20mg", category: "Antipaludéen", qty: 0, price: 3400, threshold: 5, status: "out" },
  { id: 5, name: "Ibuprofène 400mg", category: "Anti-inflammatoire", qty: 34, price: 900, threshold: 10, status: "ok" },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => n.toLocaleString("fr-FR") + " FCFA";

const StatusBadge = ({ status }) => {
  const map = {
    active:    { bg: "#e1f5ee", color: "#0f6e56", label: "Actif" },
    pending:   { bg: "#faeeda", color: "#854f0b", label: "En attente" },
    suspended: { bg: "#fcebeb", color: "#a32d2d", label: "Suspendu" },
    available: { bg: "#e1f5ee", color: "#0f6e56", label: "Disponible" },
    low:       { bg: "#faeeda", color: "#854f0b", label: "Stock faible" },
    out:       { bg: "#fcebeb", color: "#a32d2d", label: "Rupture" },
    ok:        { bg: "#e1f5ee", color: "#0f6e56", label: "OK" },
    confirmed: { bg: "#e6f1fb", color: "#185fa5", label: "Confirmée" },
    delivered: { bg: "#e1f5ee", color: "#0f6e56", label: "Livrée" },
    cancelled: { bg: "#fcebeb", color: "#a32d2d", label: "Annulée" },
  };
  const s = map[status] || map.pending;
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 100 }}>
      {s.label}
    </span>
  );
};

// ── Admin Pages ──────────────────────────────────────────────────────────────
const AdminDashboard = ({ lang }) => {
  const t = lang === "fr";
  const stats = [
    { label: t ? "Pharmacies actives" : "Active Pharmacies", value: 3, icon: "🏥", color: "#1d9e75" },
    { label: t ? "Médicaments listés" : "Listed Medicines", value: 6, icon: "💊", color: "#185fa5" },
    { label: t ? "Commandes aujourd'hui" : "Orders Today", value: 18, icon: "📦", color: "#854f0b" },
    { label: t ? "Revenus ce mois" : "This Month Revenue", value: "985 500 FCFA", icon: "💰", color: "#0f6e56" },
  ];
  return (
    <div>
      <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 24 }}>
        {t ? "Tableau de bord" : "Dashboard"}
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 28 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: "#fff", border: "0.5px solid #e5e5e5", borderRadius: 12, padding: "18px 16px" }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color, fontFamily: "Syne, sans-serif" }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 3 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ background: "#fff", border: "0.5px solid #e5e5e5", borderRadius: 12, padding: 18 }}>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 14 }}>{t ? "Dernières commandes" : "Recent Orders"}</div>
          {ORDERS.slice(0, 4).map(o => (
            <div key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderTop: "0.5px solid #f0f0f0" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{o.patient}</div>
                <div style={{ fontSize: 11, color: "#888" }}>{o.medicine} · {o.time}</div>
              </div>
              <StatusBadge status={o.status} />
            </div>
          ))}
        </div>
        <div style={{ background: "#fff", border: "0.5px solid #e5e5e5", borderRadius: 12, padding: 18 }}>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 14 }}>{t ? "Pharmacies récentes" : "Recent Pharmacies"}</div>
          {PHARMACIES.slice(0, 4).map(p => (
            <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderTop: "0.5px solid #f0f0f0" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: "#888" }}>{p.district} · {p.owner}</div>
              </div>
              <StatusBadge status={p.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AdminPharmacies = ({ lang }) => {
  const t = lang === "fr";
  const [search, setSearch] = useState("");
  const filtered = PHARMACIES.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.district.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 700 }}>
          {t ? "Pharmacies" : "Pharmacies"}
        </h2>
        <button style={{ background: "#1d9e75", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
          + {t ? "Ajouter" : "Add"}
        </button>
      </div>
      <input
        value={search} onChange={e => setSearch(e.target.value)}
        placeholder={t ? "Rechercher une pharmacie..." : "Search pharmacy..."}
        style={{ width: "100%", padding: "10px 14px", border: "0.5px solid #e0e0e0", borderRadius: 8, fontSize: 14, marginBottom: 16, outline: "none", boxSizing: "border-box" }}
      />
      <div style={{ background: "#fff", border: "0.5px solid #e5e5e5", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f8f8f8" }}>
              {[t?"Nom":"Name", t?"Propriétaire":"Owner", "District", t?"Commandes":"Orders", t?"Revenus":"Revenue", "Statut"].map(h => (
                <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontWeight: 600, fontSize: 12, color: "#666", borderBottom: "0.5px solid #eee" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} style={{ borderBottom: "0.5px solid #f5f5f5" }}>
                <td style={{ padding: "12px 14px", fontWeight: 500 }}>{p.name}</td>
                <td style={{ padding: "12px 14px", color: "#555" }}>{p.owner}</td>
                <td style={{ padding: "12px 14px", color: "#555" }}>{p.district}</td>
                <td style={{ padding: "12px 14px" }}>{p.orders}</td>
                <td style={{ padding: "12px 14px", fontWeight: 500, color: "#1d9e75" }}>{fmt(p.revenue)}</td>
                <td style={{ padding: "12px 14px" }}><StatusBadge status={p.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdminMedicines = ({ lang }) => {
  const t = lang === "fr";
  const [search, setSearch] = useState("");
  const filtered = MEDICINES.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 700 }}>
          {t ? "Médicaments" : "Medicines"}
        </h2>
        <button style={{ background: "#1d9e75", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
          + {t ? "Ajouter" : "Add"}
        </button>
      </div>
      <input
        value={search} onChange={e => setSearch(e.target.value)}
        placeholder={t ? "Rechercher un médicament..." : "Search medicine..."}
        style={{ width: "100%", padding: "10px 14px", border: "0.5px solid #e0e0e0", borderRadius: 8, fontSize: 14, marginBottom: 16, outline: "none", boxSizing: "border-box" }}
      />
      <div style={{ background: "#fff", border: "0.5px solid #e5e5e5", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f8f8f8" }}>
              {[t?"Nom":"Name", t?"Catégorie":"Category", t?"Prix":"Price", "Stock", t?"Statut":"Status"].map(h => (
                <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontWeight: 600, fontSize: 12, color: "#666", borderBottom: "0.5px solid #eee" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => (
              <tr key={m.id} style={{ borderBottom: "0.5px solid #f5f5f5" }}>
                <td style={{ padding: "12px 14px", fontWeight: 500 }}>{m.name}</td>
                <td style={{ padding: "12px 14px", color: "#555" }}>{m.category}</td>
                <td style={{ padding: "12px 14px", fontWeight: 500, color: "#1d9e75" }}>{fmt(m.price)}</td>
                <td style={{ padding: "12px 14px" }}>{m.stock}</td>
                <td style={{ padding: "12px 14px" }}><StatusBadge status={m.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdminOrders = ({ lang }) => {
  const t = lang === "fr";
  return (
    <div>
      <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 20 }}>
        {t ? "Toutes les commandes" : "All Orders"}
      </h2>
      <div style={{ background: "#fff", border: "0.5px solid #e5e5e5", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f8f8f8" }}>
              {["ID", t?"Patient":"Patient", t?"Médicament":"Medicine", "Qté", t?"Total":"Total", t?"Statut":"Status", t?"Heure":"Time"].map(h => (
                <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontWeight: 600, fontSize: 12, color: "#666", borderBottom: "0.5px solid #eee" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ORDERS.map(o => (
              <tr key={o.id} style={{ borderBottom: "0.5px solid #f5f5f5" }}>
                <td style={{ padding: "12px 14px", fontFamily: "monospace", fontSize: 11, color: "#888" }}>{o.id}</td>
                <td style={{ padding: "12px 14px", fontWeight: 500 }}>{o.patient}</td>
                <td style={{ padding: "12px 14px", color: "#555" }}>{o.medicine}</td>
                <td style={{ padding: "12px 14px" }}>{o.qty}</td>
                <td style={{ padding: "12px 14px", fontWeight: 500, color: "#1d9e75" }}>{fmt(o.total)}</td>
                <td style={{ padding: "12px 14px" }}><StatusBadge status={o.status} /></td>
                <td style={{ padding: "12px 14px", color: "#888", fontSize: 11 }}>{o.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ── Pharmacy Pages ────────────────────────────────────────────────────────────
const PharmaOrders = ({ lang }) => {
  const t = lang === "fr";
  const myOrders = ORDERS.filter(o => o.pharmacyId === 1);
  const [orders, setOrders] = useState(myOrders);
  const confirm = (id) => setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "confirmed" } : o));
  return (
    <div>
      <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 20 }}>
        {t ? "Commandes reçues" : "Received Orders"}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {orders.map(o => (
          <div key={o.id} style={{ background: "#fff", border: o.status === "pending" ? "0.5px solid #ef9f27" : "0.5px solid #e5e5e5", borderRadius: 12, padding: "16px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{o.patient}</div>
              <div style={{ fontSize: 13, color: "#555", marginTop: 3 }}>{o.medicine} × {o.qty}</div>
              <div style={{ fontSize: 11, color: "#888", marginTop: 3 }}>{o.time}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontWeight: 700, color: "#1d9e75", fontFamily: "Syne, sans-serif" }}>{fmt(o.total)}</div>
              {o.status === "pending" ? (
                <button onClick={() => confirm(o.id)} style={{ background: "#1d9e75", color: "#fff", border: "none", borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 500, cursor: "pointer" }}>
                  {t ? "Confirmer" : "Confirm"}
                </button>
              ) : <StatusBadge status={o.status} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PharmaStock = ({ lang }) => {
  const t = lang === "fr";
  const [stock, setStock] = useState(PHARMA_STOCK);
  const [editing, setEditing] = useState(null);
  const [editVal, setEditVal] = useState("");
  const save = (id) => {
    setStock(prev => prev.map(s => s.id === id ? {
      ...s,
      qty: parseInt(editVal) || s.qty,
      status: parseInt(editVal) === 0 ? "out" : parseInt(editVal) <= s.threshold ? "low" : "ok"
    } : s));
    setEditing(null);
  };
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 700 }}>
          {t ? "Gestion des stocks" : "Stock Management"}
        </h2>
        <button style={{ background: "#1d9e75", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
          + {t ? "Ajouter" : "Add"}
        </button>
      </div>
      <div style={{ background: "#fff", border: "0.5px solid #e5e5e5", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f8f8f8" }}>
              {[t?"Médicament":"Medicine", t?"Catégorie":"Category", t?"Prix":"Price", t?"Quantité":"Quantity", t?"Statut":"Status", ""].map((h, i) => (
                <th key={i} style={{ padding: "12px 14px", textAlign: "left", fontWeight: 600, fontSize: 12, color: "#666", borderBottom: "0.5px solid #eee" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stock.map(m => (
              <tr key={m.id} style={{ borderBottom: "0.5px solid #f5f5f5" }}>
                <td style={{ padding: "12px 14px", fontWeight: 500 }}>{m.name}</td>
                <td style={{ padding: "12px 14px", color: "#555" }}>{m.category}</td>
                <td style={{ padding: "12px 14px", color: "#1d9e75", fontWeight: 500 }}>{fmt(m.price)}</td>
                <td style={{ padding: "12px 14px" }}>
                  {editing === m.id ? (
                    <input
                      type="number" value={editVal}
                      onChange={e => setEditVal(e.target.value)}
                      style={{ width: 64, padding: "4px 8px", border: "1px solid #1d9e75", borderRadius: 6, fontSize: 13 }}
                    />
                  ) : (
                    <span style={{ fontWeight: m.status !== "ok" ? 700 : 400, color: m.status === "out" ? "#a32d2d" : m.status === "low" ? "#854f0b" : "inherit" }}>
                      {m.qty}
                    </span>
                  )}
                </td>
                <td style={{ padding: "12px 14px" }}><StatusBadge status={m.status} /></td>
                <td style={{ padding: "12px 14px" }}>
                  {editing === m.id ? (
                    <button onClick={() => save(m.id)} style={{ background: "#1d9e75", color: "#fff", border: "none", borderRadius: 6, padding: "5px 12px", fontSize: 12, cursor: "pointer" }}>
                      {t ? "Sauver" : "Save"}
                    </button>
                  ) : (
                    <button onClick={() => { setEditing(m.id); setEditVal(String(m.qty)); }}
                      style={{ background: "transparent", border: "0.5px solid #ddd", borderRadius: 6, padding: "5px 12px", fontSize: 12, cursor: "pointer", color: "#555" }}>
                      {t ? "Modifier" : "Edit"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PharmaDashboard = ({ lang }) => {
  const t = lang === "fr";
  const stats = [
    { label: t ? "Commandes aujourd'hui" : "Today's Orders", value: 12, color: "#185fa5" },
    { label: t ? "En attente" : "Pending", value: 3, color: "#854f0b" },
    { label: t ? "Revenus ce mois" : "Monthly Revenue", value: "284 500 FCFA", color: "#1d9e75" },
    { label: t ? "Médicaments en rupture" : "Out of Stock", value: 1, color: "#a32d2d" },
  ];
  return (
    <div>
      <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 24 }}>
        {t ? "Mon tableau de bord" : "My Dashboard"}
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 28 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: "#fff", border: "0.5px solid #e5e5e5", borderRadius: 12, padding: "18px 16px" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color, fontFamily: "Syne, sans-serif" }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "#fff", border: "0.5px solid #e5e5e5", borderRadius: 12, padding: 18 }}>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 14 }}>{t ? "Alertes stock" : "Stock Alerts"}</div>
        {PHARMA_STOCK.filter(s => s.status !== "ok").map(m => (
          <div key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderTop: "0.5px solid #f5f5f5" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{m.name}</div>
              <div style={{ fontSize: 11, color: "#888" }}>{t ? "Quantité" : "Quantity"}: {m.qty}</div>
            </div>
            <StatusBadge status={m.status} />
          </div>
        ))}
      </div>
    </div>
  );
};

const PharmaProfile = ({ lang }) => {
  const t = lang === "fr";
  const pharma = PHARMACIES[0];
  return (
    <div>
      <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 20 }}>
        {t ? "Mon profil" : "My Profile"}
      </h2>
      <div style={{ background: "#fff", border: "0.5px solid #e5e5e5", borderRadius: 12, padding: 24, maxWidth: 520 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: "#e1f5ee", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🏥</div>
          <div>
            <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 16 }}>{pharma.name}</div>
            <div style={{ fontSize: 13, color: "#666", marginTop: 2 }}>{pharma.owner}</div>
          </div>
        </div>
        {[
          [t ? "Téléphone" : "Phone", pharma.phone],
          [t ? "District" : "District", pharma.district],
          [t ? "Membre depuis" : "Member since", pharma.joined],
          [t ? "Statut" : "Status", <StatusBadge key="s" status={pharma.status} />],
        ].map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "0.5px solid #f5f5f5" }}>
            <span style={{ fontSize: 13, color: "#666" }}>{k}</span>
            <span style={{ fontSize: 13, fontWeight: 500 }}>{v}</span>
          </div>
        ))}
        <button style={{ marginTop: 20, width: "100%", background: "#1d9e75", color: "#fff", border: "none", borderRadius: 8, padding: "10px", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
          {t ? "Modifier le profil" : "Edit Profile"}
        </button>
      </div>
    </div>
  );
};

// ── Login ─────────────────────────────────────────────────────────────────────
const Login = ({ onLogin, lang }) => {
  const t = lang === "fr";
  const [role, setRole] = useState("admin");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const handle = () => {
    if (email && pass) onLogin(role);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f3", padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 36, width: "100%", maxWidth: 400, border: "0.5px solid #e5e5e5" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#e1f5ee", borderRadius: 100, padding: "6px 16px", marginBottom: 16 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#1d9e75", display: "inline-block" }}></span>
            <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, color: "#0f6e56", fontSize: 14 }}>FindMeds</span>
          </div>
          <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 22, fontWeight: 800 }}>
            {t ? "Connexion" : "Sign In"}
          </h1>
          <p style={{ fontSize: 13, color: "#888", marginTop: 6 }}>
            {t ? "Accédez à votre espace" : "Access your workspace"}
          </p>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {["admin", "pharmacy"].map(r => (
            <button key={r} onClick={() => setRole(r)}
              style={{ flex: 1, padding: "8px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", border: role === r ? "none" : "0.5px solid #e0e0e0", background: role === r ? "#1d9e75" : "#fff", color: role === r ? "#fff" : "#555" }}>
              {r === "admin" ? (t ? "Admin" : "Admin") : (t ? "Pharmacie" : "Pharmacy")}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input type="email" placeholder={t ? "Email" : "Email"} value={email} onChange={e => setEmail(e.target.value)}
            style={{ padding: "10px 14px", border: "0.5px solid #e0e0e0", borderRadius: 8, fontSize: 14, outline: "none" }} />
          <input type="password" placeholder={t ? "Mot de passe" : "Password"} value={pass} onChange={e => setPass(e.target.value)}
            style={{ padding: "10px 14px", border: "0.5px solid #e0e0e0", borderRadius: 8, fontSize: 14, outline: "none" }} />
          <button onClick={handle}
            style={{ background: "#1d9e75", color: "#fff", border: "none", borderRadius: 8, padding: "11px", fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: 4 }}>
            {t ? "Se connecter" : "Sign In"}
          </button>
        </div>
        <p style={{ fontSize: 11, color: "#bbb", textAlign: "center", marginTop: 16 }}>
          {t ? "Démo : entrez n'importe quel email/mot de passe" : "Demo: enter any email/password"}
        </p>
      </div>
    </div>
  );
};

// ── Shell ─────────────────────────────────────────────────────────────────────
const NAV_ADMIN = (t) => [
  { key: "dashboard", icon: "📊", label: t ? "Tableau de bord" : "Dashboard" },
  { key: "pharmacies", icon: "🏥", label: t ? "Pharmacies" : "Pharmacies" },
  { key: "medicines", icon: "💊", label: t ? "Médicaments" : "Medicines" },
  { key: "orders", icon: "📦", label: t ? "Commandes" : "Orders" },
];

const NAV_PHARMA = (t) => [
  { key: "dashboard", icon: "📊", label: t ? "Tableau de bord" : "Dashboard" },
  { key: "orders", icon: "📦", label: t ? "Commandes" : "Orders" },
  { key: "stock", icon: "🗃️", label: t ? "Stock" : "Stock" },
  { key: "profile", icon: "👤", label: t ? "Mon profil" : "My Profile" },
];

export default function App() {
  const [lang, setLang] = useState("fr");
  const [role, setRole] = useState(null);
  const [page, setPage] = useState("dashboard");

  const t = lang === "fr";

  if (!role) return <Login onLogin={(r) => { setRole(r); setPage("dashboard"); }} lang={lang} />;

  const navItems = role === "admin" ? NAV_ADMIN(t) : NAV_PHARMA(t);

  const renderPage = () => {
    if (role === "admin") {
      if (page === "dashboard") return <AdminDashboard lang={lang} />;
      if (page === "pharmacies") return <AdminPharmacies lang={lang} />;
      if (page === "medicines") return <AdminMedicines lang={lang} />;
      if (page === "orders") return <AdminOrders lang={lang} />;
    } else {
      if (page === "dashboard") return <PharmaDashboard lang={lang} />;
      if (page === "orders") return <PharmaOrders lang={lang} />;
      if (page === "stock") return <PharmaStock lang={lang} />;
      if (page === "profile") return <PharmaProfile lang={lang} />;
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "DM Sans, sans-serif", background: "#f5f5f3" }}>
      {/* Sidebar */}
      <div style={{ width: 220, background: "#04342c", display: "flex", flexDirection: "column", padding: "24px 0" }}>
        <div style={{ padding: "0 20px 24px", borderBottom: "0.5px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#5dcaa5", display: "inline-block" }}></span>
            <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, color: "#fff", fontSize: 16 }}>FindMeds</span>
          </div>
          <div style={{ marginTop: 8, fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>
            {role === "admin" ? (t ? "Espace Admin" : "Admin Space") : (t ? "Espace Pharmacie" : "Pharmacy Space")}
          </div>
        </div>

        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
          {navItems.map(item => (
            <button key={item.key} onClick={() => setPage(item.key)}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8, border: "none", cursor: "pointer", textAlign: "left", fontSize: 13, fontWeight: page === item.key ? 600 : 400, background: page === item.key ? "rgba(93,202,165,0.15)" : "transparent", color: page === item.key ? "#5dcaa5" : "rgba(255,255,255,0.6)" }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: "0 12px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
          <button onClick={() => setLang(l => l === "fr" ? "en" : "fr")}
            style={{ background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "7px 12px", color: "rgba(255,255,255,0.6)", fontSize: 12, cursor: "pointer" }}>
            🌐 {lang === "fr" ? "English" : "Français"}
          </button>
          <button onClick={() => { setRole(null); setPage("dashboard"); }}
            style={{ background: "transparent", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "7px 12px", color: "rgba(255,255,255,0.4)", fontSize: 12, cursor: "pointer" }}>
            {t ? "Se déconnecter" : "Sign out"}
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflow: "auto", padding: 28 }}>
        {renderPage()}
      </div>
    </div>
  );
}
