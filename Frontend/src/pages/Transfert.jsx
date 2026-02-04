import React, { useState, useEffect } from 'react';
import axios from '../services/api'; // ton fichier api.js pour les appels backend
import api from "../services/api";

const Transfers = ({ currentUser, users }) => {
  const [recipientId, setRecipientId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [balance, setBalance] = useState(currentUser.solde);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Charger l'historique des transactions
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get('/transactions'); // adapter selon ton endpoint
      // filtrer uniquement les transferts de l'utilisateur actuel
      const userTransfers = res.data.filter(t => t.utilisateur_id === currentUser.id || t.cible_id === currentUser.id);
      setHistory(userTransfers);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!recipientId || !amount) return alert("Veuillez remplir tous les champs");

    try {
      const res = await axios.post('/transfers', {
        from_user_id: currentUser.id,
        to_user_id: recipientId,
        amount: parseFloat(amount),
        description
      });

      alert(res.data.message);

      // Mise à jour du solde local
      setBalance(res.data.new_balance_sender);

      // Recharger l'historique
      fetchHistory();

      // Réinitialiser le formulaire
      setRecipientId('');
      setAmount('');
      setDescription('');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Erreur lors du transfert");
    }
  };

  return (
    <div>
      <h2>Transfert interne</h2>
      <p>Solde actuel : {balance} €</p>
      <form onSubmit={handleTransfer}>
        <label>Destinataire :</label>
        <select value={recipientId} onChange={(e) => setRecipientId(e.target.value)}>
          <option value="">-- Sélectionner --</option>
          {users.filter(u => u.id !== currentUser.id).map(user => (
            <option key={user.id} value={user.id}>{user.nom}</option>
          ))}
        </select>

        <label>Montant :</label>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />

        <label>Description :</label>
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />

        <button type="submit">Transférer</button>
      </form>

      <h3>Historique des transferts</h3>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>De</th>
            <th>À</th>
            <th>Montant</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {history.map(t => (
            <tr key={t.id}>
              <td>{new Date(t.date).toLocaleString()}</td>
              <td>{users.find(u => u.id === t.utilisateur_id)?.nom}</td>
              <td>{users.find(u => u.id === t.cible_id)?.nom}</td>
              <td>{t.montant} €</td>
              <td>{t.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Transfers;
