const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;
const ORDERS_FILE = "orders.json";

app.use(cors());
app.use(bodyParser.json());

// Endpoint pour recevoir une commande
app.post("/api/orders", (req, res) => {
  const order = req.body;

  // Lire les commandes existantes
  let orders = [];
  if (fs.existsSync(ORDERS_FILE)) {
    orders = JSON.parse(fs.readFileSync(ORDERS_FILE));
  }

  // Ajouter la nouvelle commande
  orders.push(order);
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));

  res.status(201).json({ message: "Commande enregistrée !" });
});

// Endpoint admin pour lire les commandes
app.get("/api/orders", (req, res) => {
  if (fs.existsSync(ORDERS_FILE)) {
    const orders = JSON.parse(fs.readFileSync(ORDERS_FILE));
    res.json(orders);
  } else {
    res.json([]);
  }
});

app.listen(PORT, () => {
  console.log(`✅ Serveur backend lancé sur http://localhost:${PORT}`);
});
// Supprimer toutes les commandes
app.delete("/api/orders", (req, res) => {
  try {
    fs.writeFileSync(ORDERS_FILE, "[]");
    res.json({ message: "Toutes les commandes ont été supprimées" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Impossible de supprimer les commandes" });
  }
});

