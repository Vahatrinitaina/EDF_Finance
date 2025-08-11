// mockPayments.js
const mockPayments = [
  { id: 1, date: '2025-08-01', amount: 150000, paymentMethod: 'Virement bancaire', receivedBy: 'Andry', client: 'Société X', comment: 'Paiement mensuel habituel' },
  { id: 2, date: '2025-08-02', amount: 120000, paymentMethod: 'Chèque', receivedBy: 'Hery', client: 'Société Y', comment: 'Règlement facture #452' },
  { id: 3, date: '2025-08-03', amount: 95000, paymentMethod: 'Espèces', receivedBy: 'Andry', client: 'Client direct', comment: 'Acompte sur prestation' },
  { id: 4, date: '2025-08-04', amount: 110000, paymentMethod: 'Mobile Money', receivedBy: 'Mickaël', client: 'Société Z', comment: 'Remboursement avance' },
  { id: 5, date: '2025-08-05', amount: 135000, paymentMethod: 'Chèque', receivedBy: 'Hery', client: 'Société W', comment: 'Paiement commande #102' },

  // Entrées supplémentaires
  { id: 6, date: '2025-08-06', amount: 90000, paymentMethod: 'Virement bancaire', receivedBy: 'Andry', client: 'Société X', comment: 'Paiement partiel' },
  { id: 7, date: '2025-08-07', amount: 100000, paymentMethod: 'Chèque', receivedBy: 'Hery', client: 'Société Y', comment: 'Règlement final projet Alpha' },
  { id: 8, date: '2025-08-08', amount: 85000, paymentMethod: 'Espèces', receivedBy: 'Andry', client: 'Client direct', comment: 'Paiement comptant' },
  { id: 9, date: '2025-08-09', amount: 120000, paymentMethod: 'Mobile Money', receivedBy: 'Mickaël', client: 'Société Z', comment: 'Facture de maintenance' },
  { id: 10, date: '2025-08-10', amount: 130000, paymentMethod: 'Chèque', receivedBy: 'Hery', client: 'Société W', comment: 'Commande récurrente' },

  { id: 11, date: '2025-07-25', amount: 110000, paymentMethod: 'Espèces', receivedBy: 'Andry', client: 'Société A', comment: 'Paiement rapide' },
  { id: 12, date: '2025-07-15', amount: 150000, paymentMethod: 'Mobile Money', receivedBy: 'Mickaël', client: 'Société B', comment: 'Acompte projet Bêta' },
  { id: 13, date: '2025-06-30', amount: 140000, paymentMethod: 'Virement bancaire', receivedBy: 'Hery', client: 'Société C', comment: 'Clôture trimestre' },
  { id: 14, date: '2025-05-20', amount: 115000, paymentMethod: 'Chèque', receivedBy: 'Andry', client: 'Société D', comment: 'Facture d’installation' },
  { id: 15, date: '2024-12-31', amount: 200000, paymentMethod: 'Espèces', receivedBy: 'Mickaël', client: 'Société E', comment: 'Solde fin d’année' },

  // Tests pour filtres par période
  { id: 16, date: '2025-08-11', amount: 125000, paymentMethod: 'Mobile Money', receivedBy: 'Hery', client: 'Société F', comment: 'Remboursement frais' },
  { id: 17, date: '2025-08-12', amount: 115000, paymentMethod: 'Virement bancaire', receivedBy: 'Andry', client: 'Société G', comment: 'Paiement anticipé' },
  { id: 18, date: '2025-08-13', amount: 90000, paymentMethod: 'Chèque', receivedBy: 'Mickaël', client: 'Société H', comment: 'Avance sur projet' },
  { id: 19, date: '2025-08-14', amount: 105000, paymentMethod: 'Espèces', receivedBy: 'Hery', client: 'Société I', comment: 'Solde final' },
  { id: 20, date: '2025-08-15', amount: 95000, paymentMethod: 'Mobile Money', receivedBy: 'Andry', client: 'Société J', comment: 'Paiement express' },
];

export default mockPayments;
