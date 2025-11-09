import React from 'react';
import {
  MDBTable,
  MDBTableBody,
  MDBTableHead,
  MDBBtn
} from 'mdb-react-ui-kit';

export default function IncomeList({ payments, onEdit, connectedUser, showAll, setShowAll }) {
  const displayedData = showAll ? payments : payments.slice(-10);

  return (
    <>
      <MDBTable striped bordered hover>
        <MDBTableHead>
          <tr>
            <th>Date</th>
            <th>Montant (MGA)</th>
            <th>Mode de paiement</th>
            <th>Client</th>
            <th>Reçu par</th>
            <th>Commentaire</th>
            <th>Action</th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {displayedData.map(p => (
            <tr key={p.id}>
              <td>{p.date}</td>
              <td>{p.amount.toLocaleString()}</td>
              <td>{p.paymentMethod}</td>
              <td>{p.client}</td>
              <td>{p.receivedBy}</td>
              <td>{p.comment || "-"}</td>
              <td>
                {p.receivedBy === connectedUser && (
                  <MDBBtn size="sm" color="warning" onClick={() => onEdit(p)}>Modifier</MDBBtn>
                )}
              </td>
            </tr>
          ))}
        </MDBTableBody>
      </MDBTable>
      {!showAll && payments.length > 10 && (
        <div className="text-center mt-3">
          <MDBBtn onClick={() => setShowAll(true)}>Afficher tout</MDBBtn>
        </div>
      )}
    </>
  );
}
