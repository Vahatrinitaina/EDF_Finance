import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Table, Button, Modal, Form } from "react-bootstrap";

export default function ProjectsList() {
  const navigate = useNavigate();
  const { clientId } = useParams();

  const [projects, setProjects] = useState([
    { id: "p1", nom: "Projet A", clientId: "c1", budget: 50000, deadline: "2024-09-30" },
    { id: "p2", nom: "Projet B", clientId: "c1", budget: 75000, deadline: "2024-11-15" },
    { id: "p3", nom: "Projet C", clientId: "c2", budget: 30000, deadline: "2024-10-10" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    id: "",
    nom: "",
    budget: "",
    deadline: "",
  });

  const filteredProjects = projects.filter((p) => p.clientId === clientId);

  const handleAddProject = () => {
    setForm({ id: "", nom: "", budget: "", deadline: "" });
    setEditMode(false);
    setShowModal(true);
  };

  const handleEditProject = (project) => {
    setForm({ ...project });
    setEditMode(true);
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nom.trim() || !form.budget || !form.deadline) {
      alert("Merci de remplir tous les champs obligatoires.");
      return;
    }
    if (editMode) {
      setProjects((prev) =>
        prev.map((p) => (p.id === form.id ? { ...form } : p))
      );
    } else {
      const newProject = { ...form, id: `p${Date.now()}`, clientId };
      setProjects((prev) => [...prev, newProject]);
    }
    setShowModal(false);
  };

  const handleProjectClick = (projectId) => {
    navigate(`/clients/${clientId}/projects/${projectId}`);
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4">Projets du client {clientId}</h2>

      <Button variant="success" className="mb-3" onClick={handleAddProject}>
        <i className="fas fa-plus me-2"></i> Ajouter un projet
      </Button>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>Nom du projet</th>
            <th>Budget (Ariary)</th>
            <th>Date limite</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProjects.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">
                Aucun projet
              </td>
            </tr>
          ) : (
            filteredProjects.map((project) => (
              <tr key={project.id}>
                <td>
                  <Button
                    variant="link"
                    onClick={() => handleProjectClick(project.id)}
                    style={{ padding: 0 }}
                  >
                    {project.nom}
                  </Button>
                </td>
                <td>{project.budget}</td>
                <td>{project.deadline}</td>
                <td>
                  <Button
                    variant="primary"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEditProject(project)}
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
          <Modal.Title>{editMode ? "Modifier le projet" : "Ajouter un projet"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formProjectNom">
            <Form.Label>Nom du projet</Form.Label>
            <Form.Control
              type="text"
              name="nom"
              value={form.nom}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formProjectBudget">
            <Form.Label>Budget (Ariary)</Form.Label>
            <Form.Control
              type="number"
              name="budget"
              value={form.budget}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formProjectDeadline">
            <Form.Label>Date limite</Form.Label>
            <Form.Control
              type="date"
              name="deadline"
              value={form.deadline}
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
