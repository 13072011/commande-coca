// src/ColaOrderApp.js
import React, { useState } from "react";
import "./ColaOrderApp.css"; // <-- assure-toi que ce fichier existe

export default function ColaOrderApp() {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [casier, setCasier] = useState("");
  const [quantite, setQuantite] = useState(1);
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    if (!date) return "Merci de choisir une date.";
    if (!nom.trim()) return "Merci d’indiquer votre nom.";
    if (!prenom.trim()) return "Merci d’indiquer votre prénom.";
    if (!casier.trim()) return "Merci d’indiquer votre casier.";
    if (Number(quantite) < 1) return "Quantité minimum : 1";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);
    const err = validate();
    if (err) {
      setMessage({ type: "error", text: err });
      return;
    }

    const payload = {
      date,
      nom: nom.trim(),
      prenom: prenom.trim(),
      casier: casier.trim(),
      quantite: Number(quantite),
      createdAt: new Date().toISOString(),
    };

    setSubmitting(true);

    try {
      // Remplace l'URL si ton backend tourne ailleurs
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Erreur serveur");
      }

      setMessage({ type: "success", text: "✅ Commande enregistrée, merci !" });
      // clear form
      setDate(new Date().toISOString().slice(0, 10));
      setNom("");
      setPrenom("");
      setCasier("");
      setQuantite(1);
    } catch (err) {
      console.error("Envoi commande:", err);
      setMessage({ type: "error", text: "❌ Erreur lors de l'envoi — vérifie le serveur." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="cola-page">
      <div className="cola-card">
        <h1 className="cola-title">Commander une cannette</h1>

        {message && (
          <div className={`cola-msg ${message.type === "error" ? "error" : "success"}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="cola-form">
          <label>
            Date de livraison
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>

          <label>
            Quantité
            <input type="number" min="1" value={quantite} onChange={(e) => setQuantite(e.target.value)} />
          </label>

          <label>
            Nom
            <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Ex: Dupont" />
          </label>

          <label>
            Prénom
            <input type="text" value={prenom} onChange={(e) => setPrenom(e.target.value)} placeholder="Ex: Alice" />
          </label>

          <label>
            Casier
            <input type="text" value={casier} onChange={(e) => setCasier(e.target.value)} placeholder="Ex: B12" />
          </label>

          <div className="cola-actions">
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Envoi..." : "Commander"}
            </button>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => {
                setDate(new Date().toISOString().slice(0, 10));
                setNom("");
                setPrenom("");
                setCasier("");
                setQuantite(1);
                setMessage(null);
              }}
            >
              Réinitialiser
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
