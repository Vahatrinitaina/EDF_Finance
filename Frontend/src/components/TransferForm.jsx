import React, { useState, useEffect } from "react";
import { MDBInput, MDBBtn, MDBModalBody, MDBDropdown, MDBDropdownItem, MDBDropdownMenu, MDBDropdownToggle } from "mdb-react-ui-kit";
import axios from "axios";

export default function TransferForm({
  handleTransferSubmit,
  setRecipientId,
  setAmount,
  setReason,
  recipientId,
  amount,
  reason,
  users
}) {
  return (
    <MDBModalBody>
      <h5>💸 Transférer des fonds</h5>

      {/* Sélectionner le destinataire */}
      <MDBDropdown>
        <MDBDropdownToggle>Choisir un destinataire</MDBDropdownToggle>
        <MDBDropdownMenu>
          {users.map((user) => (
            <MDBDropdownItem
              key={user.id}
              onClick={() => setRecipientId(user.id)}
            >
              {user.name}
            </MDBDropdownItem>
          ))}
        </MDBDropdownMenu>
      </MDBDropdown>

      {/* Montant à transférer */}
      <MDBInput
        label="Montant"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
        className="mb-3"
      />

      {/* Raison du transfert */}
      <MDBInput
        label="Raison du transfert"
        type="text"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        required
        className="mb-3"
      />

      <div className="text-end">
        <MDBBtn color="success" onClick={handleTransferSubmit}>
          Transférer
        </MDBBtn>
      </div>
    </MDBModalBody>
  );
}
