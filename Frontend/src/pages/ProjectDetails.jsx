import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Card,
  ProgressBar,
  Table,
  Button,
  Modal,
  Form,
  Tabs,
  Tab,
} from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const mockProjects = {
  p1: {
    nom: 'Projet Alpha',
    budget: 10000000,
    deadline: '2025-12-31',
    dateDebut: '2025-01-01',
  },
};

const mockDepensesInit = [
  {
    id: 1,
    nom: 'Jean Dupont',
    date: '2025-01-10',
    montant: 250000,
    commentaire: 'Achat matériel',
    fichier: null,
  },
  {
    id: 2,
    nom: 'Marie Curie',
    date: '2025-02-15',
    montant: 400000,
    commentaire: 'Consultant externe',
    fichier: null,
  },
];

const filtres = ['Semaine', 'Mois', 'Année'];

export default function ProjectDetails() {
  const { clientId, projectId } = useParams();

  const user = { nom: 'Utilisateur Connecté', role: 'employe' };

  const project = mockProjects[projectId] || null;

  const [depenses, setDepenses] = useState(mockDepensesInit);
  const [form, setForm] = useState({
    date: '',
    montant: '',
    commentaire: '',
    fichier: null,
  });
  const [filtreActif, setFiltreActif] = useState('Mois');
  const [modalShow, setModalShow] = useState(false);

  const calculAvancement = () => {
    if (!project) return 0;
    const debut = new Date(project.dateDebut);
    const fin = new Date(project.deadline);
    const now = new Date();
    if (now > fin) return 100;
    if (now < debut) return 0;
    const total = fin.getTime() - debut.getTime();
    const ecoule = now.getTime() - debut.getTime();
    return Math.round((ecoule / total) * 100);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'fichier') {
      setForm((f) => ({ ...f, fichier: files[0] || null }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.date || !form.montant || !form.commentaire) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    const nouvelleDepense = {
      id: depenses.length + 1,
      nom: user.nom,
      date: form.date,
      montant: parseInt(form.montant, 10),
      commentaire: form.commentaire,
      fichier: form.fichier,
    };
    setDepenses((prev) => [...prev, nouvelleDepense]);
    setForm({ date: '', montant: '', commentaire: '', fichier: null });
    setModalShow(false);
  };

  const getDataChart = () => {
    const labels = [];
    const dataPoints = [];
    const now = new Date();

    if (filtreActif === 'Mois') {
      for (let i = 1; i <= 31; i++) labels.push(i.toString());
      for (let i = 1; i <= 31; i++) {
        const somme = depenses
          .filter((d) => {
            const dDate = new Date(d.date);
            return (
              dDate.getDate() === i &&
              dDate.getMonth() === now.getMonth() &&
              dDate.getFullYear() === now.getFullYear()
            );
          })
          .reduce((acc, d) => acc + d.montant, 0);
        dataPoints.push(somme);
      }
    } else if (filtreActif === 'Semaine') {
      const jours = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
      labels.push(...jours);
      for (let i = 0; i < 7; i++) {
        const somme = depenses
          .filter((d) => {
            const dDate = new Date(d.date);
            return dDate.getDay() === i && dDate.getFullYear() === now.getFullYear();
          })
          .reduce((acc, d) => acc + d.montant, 0);
        dataPoints.push(somme);
      }
    } else if (filtreActif === 'Année') {
      const mois = [
        'Jan',
        'Fév',
        'Mar',
        'Avr',
        'Mai',
        'Juin',
        'Juil',
        'Aoû',
        'Sep',
        'Oct',
        'Nov',
        'Déc',
      ];
      labels.push(...mois);
      for (let i = 0; i < 12; i++) {
        const somme = depenses
          .filter((d) => {
            const dDate = new Date(d.date);
            return dDate.getMonth() === i && dDate.getFullYear() === now.getFullYear();
          })
          .reduce((acc, d) => acc + d.montant, 0);
        dataPoints.push(somme);
      }
    }

    return {
      labels,
      datasets: [
        {
          label: 'Dépenses (Ar)',
          data: dataPoints,
          fill: false,
          borderColor: '#0d6efd',
          tension: 0.3,
        },
      ],
    };
  };

  if (!project) {
    return (
      <Container className="my-5">
        <h5>Projet non trouvé</h5>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Card>
        <Card.Header>
          <h3>{project.nom}</h3>
        </Card.Header>
        <Card.Body>
          <div className="mb-4">
            <strong>Avancement :</strong>
            <ProgressBar
              now={calculAvancement()}
              label={`${calculAvancement()}%`}
              style={{ height: '30px', borderRadius: '15px' }}
            />
          </div>

          <div className="mb-4">
            <strong>Budget :</strong> {project.budget.toLocaleString('fr-FR')} Ar
          </div>

          <h4 className="mb-3">Dépenses</h4>

          <Table hover responsive>
            <thead className="table-dark">
              <tr>
                <th>Nom</th>
                <th>Date</th>
                <th>Montant (Ar)</th>
                <th>Commentaire</th>
                <th>Facture</th>
              </tr>
            </thead>
            <tbody>
              {depenses.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    Aucune dépense enregistrée
                  </td>
                </tr>
              ) : (
                depenses.map((d) => (
                  <tr key={d.id}>
                    <td>{d.nom}</td>
                    <td>{d.date}</td>
                    <td>{d.montant.toLocaleString('fr-FR')}</td>
                    <td>{d.commentaire}</td>
                    <td>{d.fichier ? d.fichier.name : '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          <Button variant="success" className="my-4" onClick={() => setModalShow(true)}>
            Ajouter une dépense
          </Button>

          <h4 className="mb-3">Récapitulatif des dépenses</h4>

          <Tabs
            activeKey={filtreActif}
            onSelect={(k) => setFiltreActif(k)}
            className="mb-3"
          >
            {filtres.map((f) => (
              <Tab eventKey={f} title={f} key={f} />
            ))}
          </Tabs>

          <Line data={getDataChart()} />

          {/* Modal ajout dépense */}
          <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Ajouter une dépense</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
              <Modal.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Nom</Form.Label>
                  <Form.Control value={user.nom} disabled />
                </Form.Group>

                <Form.Group className="mb-3" controlId="depenseDate">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="depenseMontant">
                  <Form.Label>Montant (Ar)</Form.Label>
                  <Form.Control
                    type="number"
                    name="montant"
                    value={form.montant}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="depenseCommentaire">
                  <Form.Label>Commentaire</Form.Label>
                  <Form.Control
                    type="text"
                    name="commentaire"
                    value={form.commentaire}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="depenseFichier">
                  <Form.Label>Upload facture (optionnel)</Form.Label>
                  <Form.Control
                    type="file"
                    name="fichier"
                    onChange={handleChange}
                  />
                </Form.Group>
              </Modal.Body>

              <Modal.Footer>
                <Button variant="secondary" onClick={() => setModalShow(false)}>
                  Annuler
                </Button>
                <Button variant="success" type="submit">
                  Enregistrer
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>
        </Card.Body>
      </Card>
    </Container>
  );
}
