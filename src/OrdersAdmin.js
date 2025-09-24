import React, { useState, useEffect } from "react";

export default function OrdersAdmin() {
  const [auth, setAuth] = useState(false);
  const [pin, setPin] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Charger les commandes depuis le backend
  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Erreur fetch orders:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleLogin(e) {
    e.preventDefault();
    if (pin === "1234") {
      setAuth(true);
      fetchOrders();
    } else {
      alert("Code incorrect !");
    }
  }

  async function clearOrders() {
    if (!window.confirm("Supprimer toutes les commandes ?")) return;
    try {
      await fetch("http://localhost:5000/api/orders", {
        method: "DELETE"
      });
      setOrders([]);
    } catch (err) {
      console.error("Erreur suppression:", err);
    }
  }

  // Formulaire PIN si non connecté
  if (!auth) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm">
          <h1 className="text-xl font-bold text-center mb-4">Accès Admin 🔐</h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="Code secret"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="p-2 border rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
            />
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition"
            >
              Entrer
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-xl rounded-2xl p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-red-700 mb-4">Commandes reçues 📦</h1>

        {loading ? (
          <p>Chargement...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500 text-center">Aucune commande enregistrée.</p>
        ) : (
          <ul className="divide-y">
            {orders.map((o) => (
              <li key={o.id} className="py-2">
                <span className="font-semibold">{o.prenom} {o.nom}</span> — {o.quantite} canette(s)
                <br />
                📅 {o.date} | Casier: {o.casier}
              </li>
            ))}
          </ul>
        )}

        {orders.length > 0 && (
          <button
            onClick={clearOrders}
            className="mt-6 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Supprimer toutes les commandes
          </button>
        )}
      </div>
    </div>
  );
}
