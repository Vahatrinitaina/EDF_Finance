import React, { useState } from 'react';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBBtn,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
  MDBDropdown,
  MDBDropdownMenu,
  MDBDropdownToggle,
  MDBDropdownItem,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBInput
} from 'mdb-react-ui-kit';
import { Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';

import mockPayments from '../../data/mockPayments';  // <-- import mock data

export default function IncomeDashboard() {
  const [payments, setPayments] = useState(mockPayments);
  const [methodFilter, setMethodFilter] = useState('');
  const [receiverFilter, setReceiverFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [dateRangeFilter, setDateRangeFilter] = useState('jour');

  const [newPayment, setNewPayment] = useState({
    date: '',
    amount: '',
    paymentMethod: '',
    receivedBy: '',
    client: ''
  });

  const handleAddPayment = () => {
    setPayments([
      ...payments,
      { id: payments.length + 1, ...newPayment, amount: parseInt(newPayment.amount) }
    ]);
    setNewPayment({ date: '', amount: '', paymentMethod: '', receivedBy: '', client: '' });
    setModalOpen(false);
  };

  const filteredData = payments.filter(p =>
    (methodFilter ? p.paymentMethod === methodFilter : true) &&
    (receiverFilter ? p.receivedBy === receiverFilter : true)
  );

  const totalAmount = filteredData.reduce((acc, curr) => acc + curr.amount, 0);

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
        tension: 0.4, // courbe lissée
        backgroundColor: '#36a2eb'
      }
    ]
  };

  return (
    <MDBContainer className="py-5">
      <h2 className="mb-4 text-center">📈 Dashboard des rentrées d'argent</h2>

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

      <MDBRow className="mb-4">
        <MDBCol>
          <MDBBtn onClick={() => setModalOpen(true)}>➕ Ajouter une entrée</MDBBtn>
        </MDBCol>
      </MDBRow>

      <MDBRow>
        <MDBCol>
          <MDBTable striped bordered hover>
            <MDBTableHead>
              <tr>
                <th>Date</th>
                <th>Montant (MGA)</th>
                <th>Mode de paiement</th>
                <th>Client</th>
                <th>Reçu par</th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {filteredData.map(p => (
                <tr key={p.id}>
                  <td>{p.date}</td>
                  <td>{p.amount.toLocaleString()}</td>
                  <td>{p.paymentMethod}</td>
                  <td>{p.client}</td>
                  <td>{p.receivedBy}</td>
                </tr>
              ))}
            </MDBTableBody>
          </MDBTable>
        </MDBCol>
      </MDBRow>

      <MDBModal open={modalOpen} setOpen={setModalOpen} tabIndex='-1'>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Ajouter une entrée</MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={() => setModalOpen(false)}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <MDBInput label='Date' type='date' className='mb-3' value={newPayment.date} onChange={(e) => setNewPayment({ ...newPayment, date: e.target.value })} />
              <MDBInput label='Montant' type='number' className='mb-3' value={newPayment.amount} onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })} />
              <MDBInput label='Mode de paiement' className='mb-3' value={newPayment.paymentMethod} onChange={(e) => setNewPayment({ ...newPayment, paymentMethod: e.target.value })} />
              <MDBInput label='Client' className='mb-3' value={newPayment.client} onChange={(e) => setNewPayment({ ...newPayment, client: e.target.value })} />
              <MDBInput label='Reçu par' className='mb-3' value={newPayment.receivedBy} onChange={(e) => setNewPayment({ ...newPayment, receivedBy: e.target.value })} />
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color='secondary' onClick={() => setModalOpen(false)}>Annuler</MDBBtn>
              <MDBBtn onClick={handleAddPayment}>Ajouter</MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </MDBContainer>
  );
}
