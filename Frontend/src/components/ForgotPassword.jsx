import React, { useState } from "react";
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBBtn,
} from "mdb-react-ui-kit";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Un email de réinitialisation de mot de passe a été envoyé !");
      } else {
        alert(data.message || "Erreur lors de la demande de réinitialisation.");
      }
    } catch (error) {
      alert("Erreur serveur, veuillez réessayer plus tard.");
    }
  };

  return (
    <MDBContainer
      fluid
      className="d-flex align-items-center justify-content-center bg-image"
      style={{ backgroundColor: "#f5f5f5", height: "100vh" }}
    >
      <MDBCard className="m-5" style={{ maxWidth: "400px" }}>
        <MDBCardBody className="px-5">
          <h3 className="text-center mb-4">Mot de passe oublié</h3>
          <form onSubmit={handleSubmit}>
            <MDBInput
              wrapperClass="mb-4"
              label="Adresse email"
              id="formEmail"
              type="email"
              size="lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <MDBBtn type="submit" className="w-100 mb-4" size="lg">
              Envoyer le lien de réinitialisation
            </MDBBtn>
          </form>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}

export default ForgotPassword;
