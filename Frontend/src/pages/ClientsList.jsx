import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Modal, Form } from "react-bootstrap";

export default function ClientsList() {
  const navigate = useNavigate();

  const [clients, setClients] = useState([
    { id: "c1", nom: "Client Alpha", secteur: "Finance", depuis: "2021-01-10" },
    { id: "c2", nom: "Client Beta", secteur: "Industrie", depuis: "2020-05-23" },
    { id: "c3", nom: "Client Gamma", secteur: "Tech", depuis: "2022-07-15" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ id: "", nom: "", secteur: "", depuis: "" });

  const handleAddClient = () => {
    setForm({ id: "", nom: "", secteur: "", depuis: "" });
    setEditMode(false);
    setShowModal(true);
  };

  const handleEditClient = (client) => {
    setForm({ ...client });
    setEditMode(true);
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nom.trim() || !form.secteur.trim() || !form.depuis) {
      alert("Merci de remplir tous les champs obligatoires.");
      return;
    }
    if (editMode) {
      setClients((prev) =>
        prev.map((c) => (c.id === form.id ? { ...form } : c))
      );
    } else {
      const newClient = { ...form, id: `c${Date.now()}` };
      setClients((prev) => [...prev, newClient]);
    }
    setShowModal(false);
  };

  const handleClientClick = (clientId) => {
    navigate(`/clients/${clientId}/projects`);
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4">Liste des clients</h2>

      <Button variant="success" className="mb-3" onClick={handleAddClient}>
        <i className="fas fa-plus me-2"></i> Ajouter un client
      </Button>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>Nom du client</th>
            <th>Secteur d'activité</th>
            <th>Client depuis</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">
                Aucun client
              </td>
            </tr>
          ) : (
            clients.map((client) => (
              <tr key={client.id}>
                <td>
                  <Button
                    variant="link"
                    onClick={() => handleClientClick(client.id)}
                    style={{ padding: 0 }}
                  >
                    {client.nom}
                  </Button>
                </td>
                <td>{client.secteur}</td>
                <td>{client.depuis}</td>
                <td>
                  <Button
                    variant="primary"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEditClient(client)}
                  >
                    <i className="fas fa-pen"></i>
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Modal */}
      <ModalForm
        show={showModal}
        handleClose={() => setShowModal(false)}
        editMode={editMode}
        form={form}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

function ModalForm({ show, handleClose, editMode, form, handleChange, handleSubmit }) {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? "Modifier le client" : "Ajouter un client"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formClientNom">
            <Form.Label>Nom du client</Form.Label>
            <Form.Control
              type="text"
              name="nom"
              value={form.nom}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formClientSecteur">
            <Form.Label>Secteur d'activité</Form.Label>
            <Form.Control
              type="text"
              name="secteur"
              value={form.secteur}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formClientDepuis">
            <Form.Label>Client depuis</Form.Label>
            <Form.Control
              type="date"
              name="depuis"
              value={form.depuis}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Annuler
          </Button>
          <Button variant="success" type="submit">
            {editMode ? "Enregistrer" : "Ajouter"}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
