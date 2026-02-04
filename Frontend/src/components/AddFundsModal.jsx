import React, { useState } from "react";
import {
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBInput,
  MDBBtn,
} from "mdb-react-ui-kit";
import axios from "axios";

export default function AddFundsModal({ show, setShow }) {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
      setMessage("Utilisateur non trouvé.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/refill", {
        userId: user.id,
        amount: parseFloat(amount),
        reason,
      });

      setMessage(response.data.message || "✅ Renflouement enregistré !");
      setAmount("");
      setReason("");

      setTimeout(() => {
        setMessage("");
        setShow(false);
      }, 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Erreur serveur");
    }
  };

  return (
    <MDBModal open={show} setOpen={setShow} tabIndex="-1">
      <MDBModalDialog centered>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>💵 Ajouter des fonds</MDBModalTitle>
            <MDBBtn className="btn-close" color="none" onClick={() => setShow(false)}></MDBBtn>
          </MDBModalHeader>

          <MDBModalBody>
            <form onSubmit={handleSubmit}>
              <MDBInput
                label="Montant à ajouter (MGA)"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="mb-3"
              />

              <MDBInput
                label="Raison du renflouement"
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                className="mb-3"
              />

              {message && (
                <p className={`text-${message.includes("✅") ? "success" : "danger"} fw-bold`}>
                  {message}
                </p>
              )}

              <div className="text-end">
                <MDBBtn color="success" type="submit">
                  Ajouter
                </MDBBtn>
              </div>
            </form>
          </MDBModalBody>

          <MDBModalFooter>
            <small className="text-muted">L’ajout sera consigné dans l’historique interne.</small>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}
