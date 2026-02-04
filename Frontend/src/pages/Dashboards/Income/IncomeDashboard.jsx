import React, { useState, useEffect } from 'react';
import NavbarUser from '../../../components/NavbarUser';
import AddFundsModal from "../../../components/AddFundsModal";

import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBBtn,
  MDBDropdown,
  MDBDropdownMenu,
  MDBDropdownToggle,
  MDBDropdownItem,
  MDBModal,
  MDBInput
} from 'mdb-react-ui-kit';
import { Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';

import mockPayments from '../../../data/mockPayments';
import IncomeForm from './IncomeForm';
import IncomeList from './IncomeList'; // Note: J'ai laissé l'import original IncomeList

export default function IncomeDashboard() {
  // Récupération du nom de l'utilisateur connecté
  const [connectedUser, setConnectedUser] = useState('Utilisateur');
  const [users, setUsers] = useState([]); // Liste des utilisateurs pour les destinataires
  const [modalOpen, setModalOpen] = useState(false);
  const [newPayment, setNewPayment] = useState({
    date: '',
    amount: '',
    receivedBy: connectedUser,
    client: '',
    comment: '',
    recipient: '' // Destinataire ajouté ici
  });

  const [payments, setPayments] = useState(mockPayments);
  const [methodFilter, setMethodFilter] = useState('');
  const [receiverFilter, setReceiverFilter] = useState('');
  const [dateRangeFilter, setDateRangeFilter] = useState('jour');
  const [showAll, setShowAll] = useState(false);
  const [editPaymentId, setEditPaymentId] = useState(null);
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [userRole, setUserRole] = useState("user");

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (username) {
      setConnectedUser(username);
    }
  }, []);

  useEffect(() => {
    // Simulation de la récupération des utilisateurs depuis le backend
    const fetchUsers = async () => {
      // Remplace cette partie par une vraie requête API pour récupérer les utilisateurs
      const mockUsers = [
        { id: '1', name: 'Andry' },
        { id: '2', name: 'Hery' },
        { id: '3', name: 'Mickaël' }
      ];
      setUsers(mockUsers);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.role) {
      setUserRole(storedUser.role);
    }
  }, []);

  // Filtrage des paiements
  const filteredData = payments.filter(p =>
    (methodFilter ? p.paymentMethod === methodFilter : true) &&
    (receiverFilter ? p.receivedBy === receiverFilter : true)
  );

  const totalAmount = filteredData.reduce((acc, curr) => acc + curr.amount, 0);

  // Graph 1 : Total par méthode
  const chartDataByPaymentMethod = {
    labels: [...new Set(filteredData.map(p => p.paymentMethod))],
    datasets: [
      {
        label: 'Total reçu par mode de paiement',
        data: [...new Set(filteredData.map(p => p.paymentMethod))].map(method =>
          filteredData.filter(p => p.paymentMethod === method).reduce((sum, p) => sum + p.amount, 0)
        ),
        backgroundColor: ['#4dc9f6', '#f67019', '#f53794', '#537bc4']
      }
    ]
  };

  // Graph 2 : Rentrées par période
  const now = new Date();
  const chart2DataFiltered = filteredData.filter(p => {
    const d = new Date(p.date);
    if (dateRangeFilter === 'jour') {
      return d.toDateString() === now.toDateString();
    } else if (dateRangeFilter === 'semaine') {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      return d >= weekStart && d <= weekEnd;
    } else if (dateRangeFilter === 'mois') {
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    } else if (dateRangeFilter === 'annee') {
      return d.getFullYear() === now.getFullYear();
    }
    return true;
  });

  const chartDataByDate = {
    labels: chart2DataFiltered.map(p => p.date),
    datasets: [
      {
        label: `Rentrées (${dateRangeFilter})`,
        data: chart2DataFiltered.map(p => p.amount),
        fill: false,
        borderColor: '#36a2eb',
        tension: 0.4,
        backgroundColor: '#36a2eb'
      }
    ]
  };

  // Fonction pour gérer l'ajout ou l'édition d'un paiement
  const handleAddOrEditPayment = () => {
    if (newPayment.recipient === '') {
      alert('Veuillez sélectionner un destinataire pour le transfert.');
      return;
    }

    if (editPaymentId) {
      setPayments(payments.map(p =>
        p.id === editPaymentId && p.receivedBy === connectedUser
          ? { ...p, ...newPayment, amount: parseInt(newPayment.amount) }
          : p
      ));
      setEditPaymentId(null);
    } else {
      setPayments([
        ...payments,
        { id: payments.length + 1, ...newPayment, amount: parseInt(newPayment.amount), paymentMethod: 'Transfert' } // Ajout d'une méthode de paiement pour les transferts
      ]);
    }

    setNewPayment({ date: '', amount: '', receivedBy: connectedUser, client: '', comment: '', recipient: '' });
    setModalOpen(false);
  };

  // Edition d'un paiement
  const handleEditPayment = (payment) => {
    if (payment.receivedBy !== connectedUser) {
      alert("Vous ne pouvez modifier que vos propres entrées.");
      return;
    }
    setEditPaymentId(payment.id);
    setNewPayment(payment);
    setModalOpen(true);
  };

  return (
    <>
      <NavbarUser />
      <MDBContainer className="py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>📈 Dashboard des rentrées d'argent</h2>

          {/* Visible uniquement si directeur */}
          {userRole === "directeur" && (
            <>
              <MDBBtn color="success" onClick={() => setShowAddFundsModal(true)}>
                💵 Ajouter des fonds
              </MDBBtn>
              {/* Bouton Transfert de fonds */}
              <MDBBtn color="primary" onClick={() => setModalOpen(true)}>
                💸 Transférer des fonds
              </MDBBtn>
            </>
          )}
        </div>

        {/* Modal d’ajout de fonds */}
        <AddFundsModal show={showAddFundsModal} setShow={setShowAddFundsModal} />
      </MDBContainer>

      {/* Modal de transfert de fonds (MISE EN FORME CORRIGÉE) */}
      <MDBModal open={modalOpen} setOpen={setModalOpen} tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">💸 Transfert de Fonds</h5>
              {/* Bouton de fermeture MDB */}
              <MDBBtn className='btn-close' color='none' onClick={() => setModalOpen(false)}></MDBBtn>
            </div>
            <div className="modal-body">
              <MDBCardBody className="px-4"> 
                  
                {/* Champ Montant */}
                <MDBRow className="mb-3">
                  <MDBCol>
                    <MDBInput
                      label="Montant du transfert"
                      type="number"
                      value={newPayment.amount}
                      onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                      required
                    />
                  </MDBCol>
                </MDBRow>

                {/* Champ Destinataire */}
                <MDBRow className="mb-3">
                  <MDBCol>
                    <label className="form-label">Destinataire :</label> 
                    <select
                      value={newPayment.recipient}
                      onChange={(e) => setNewPayment({ ...newPayment, recipient: e.target.value })}
                      className="form-select" 
                      required
                    >
                      <option value="" disabled>Sélectionner un destinataire</option>
                      {users.map(user => (
                        <option key={user.id} value={user.name}>{user.name}</option>
                      ))}
                    </select>
                  </MDBCol>
                </MDBRow>

                {/* Champ Commentaire */}
                <MDBRow className="mb-3">
                  <MDBCol>
                    <MDBInput
                      label="Commentaire (Optionnel)"
                      type="textarea"
                      value={newPayment.comment}
                      onChange={(e) => setNewPayment({ ...newPayment, comment: e.target.value })}
                    />
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </div>
            <div className="modal-footer">
              {/* Boutons d'action */}
              <MDBBtn color='secondary' onClick={() => setModalOpen(false)}>Annuler</MDBBtn>
              <MDBBtn color="primary" onClick={handleAddOrEditPayment}>Transférer</MDBBtn>
            </div>
          </div>
        </div>
      </MDBModal>

      {/* Reste du Dashboard */}
      <MDBContainer className="py-5">
        <MDBRow>
          <MDBCol md="12">
            <h5 className="mb-4">Filtres des paiements</h5>
          </MDBCol>
        </MDBRow>

        <MDBRow className="mb-4">
          <MDBCol md="4">
            <MDBDropdown>
              <MDBDropdownToggle>Filtrer par mode de paiement</MDBDropdownToggle>
              <MDBDropdownMenu>
                <MDBDropdownItem link onClick={() => setMethodFilter('')}>Tous</MDBDropdownItem>
                <MDBDropdownItem link onClick={() => setMethodFilter('Virement bancaire')}>Virement bancaire</MDBDropdownItem>
                <MDBDropdownItem link onClick={() => setMethodFilter('Chèque')}>Chèque</MDBDropdownItem>
                <MDBDropdownItem link onClick={() => setMethodFilter('Mobile Money')}>Mobile Money</MDBDropdownItem>
                <MDBDropdownItem link onClick={() => setMethodFilter('Espèces')}>Espèces</MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>
          </MDBCol>

          <MDBCol md="4">
            <MDBDropdown>
              <MDBDropdownToggle>Filtrer par réceptionnaire</MDBDropdownToggle>
              <MDBDropdownMenu>
                <MDBDropdownItem link onClick={() => setReceiverFilter('')}>Tous</MDBDropdownItem>
                <MDBDropdownItem link onClick={() => setReceiverFilter('Andry')}>Andry</MDBDropdownItem>
                <MDBDropdownItem link onClick={() => setReceiverFilter('Hery')}>Hery</MDBDropdownItem>
                <MDBDropdownItem link onClick={() => setReceiverFilter('Mickaël')}>Mickaël</MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>
          </MDBCol>

          <MDBCol md="4">
            <MDBCard>
              <MDBCardBody>
                <h5>Total filtré :</h5>
                <h4 className="text-success">{totalAmount.toLocaleString()} MGA</h4>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>

        {/* Graphiques */}
        <MDBRow className="mb-4">
          <MDBCol md="6">
            <Bar data={chartDataByPaymentMethod} />
          </MDBCol>

          <MDBCol md="6">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="mb-0">Rentrées par période</h5>
              <select
                className="form-select w-auto"
                value={dateRangeFilter}
                onChange={(e) => setDateRangeFilter(e.target.value)}
              >
                <option value="jour">Aujourd'hui</option>
                <option value="semaine">Cette semaine</option>
                <option value="mois">Ce mois</option>
                <option value="annee">Cette année</option>
              </select>
            </div>
            <Line data={chartDataByDate} />
          </MDBCol>
        </MDBRow>

        {/* Liste */}
        <MDBRow>
          <MDBCol>
            <IncomeList
              payments={filteredData}
              onEdit={handleEditPayment}
              connectedUser={connectedUser}
              showAll={showAll}
              setShowAll={setShowAll}
            />
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </>
  );
}
