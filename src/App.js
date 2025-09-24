import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ColaOrderApp from "./ColaOrderApp";
import OrdersAdmin from "./OrdersAdmin";

function App() {
  return (
    <Router>
      <div className="App-container">
        <nav>
          <Link to="/">Accueil</Link> |{" "}
          <Link to="/admin">Admin</Link>
        </nav>

        <Routes>
          <Route path="/" element={<ColaOrderApp />} />
          <Route path="/admin" element={<OrdersAdmin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
