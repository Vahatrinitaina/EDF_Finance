import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  MDBProgress,
  MDBProgressBar,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBtn,
  MDBInput,
  MDBFile,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBContainer,
  MDBTypography,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
} from 'mdb-react-ui-kit';
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

  // Simul utilisateur connecté (à remplacer)
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

  const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = () => setModalOpen(!modalOpen);

  const calculAvancement = () => {
    if (!project) return 0;
    const debut = new Date(project.dateDebut);
    const fin = new Date(project.deadline);
    const now = new Date();
    if (now > fin) return 100;
    if (now < debut) return 0;
    const total = fin - debut;
    const ecoule = now - debut;
    return Math.round((ecoule / total) * 100);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'fichier') {
      setForm(f => ({ ...f, fichier: files[0] }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
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
    setDepenses(prev => [...prev, nouvelleDepense]);
    setForm({ date: '', montant: '', commentaire: '', fichier: null });
    toggleModal();
  };

  const getDataChart = () => {
    const labels = [];
    const dataPoints = [];
    const now = new Date();

    if (filtreActif === 'Mois') {
      for (let i = 1; i <= 31; i++) labels.push(i.toString());
      for (let i = 1; i <= 31; i++) {
        const somme = depenses
          .filter(d => {
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
          .filter(d => {
            const dDate = new Date(d.date);
            return dDate.getDay() === i && dDate.getFullYear() === now.getFullYear();
          })
          .reduce((acc, d) => acc + d.montant, 0);
        dataPoints.push(somme);
      }
    } else if (filtreActif === 'Année') {
      const mois = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
      labels.push(...mois);
      for (let i = 0; i < 12; i++) {
        const somme = depenses
          .filter(d => {
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

  return (
    <MDBContainer className="my-5">
      {!project ? (
        <MDBTypography tag="h5">Projet non trouvé</MDBTypography>
      ) : (
        <>
          <MDBCard>
            <MDBCardHeader>
              <MDBTypography tag="h3">{project.nom}</MDBTypography>
            </MDBCardHeader>
            <MDBCardBody>
              <div className="mb-4">
                <strong>Avancement :</strong>
                <MDBProgress style={{ height: '30px', borderRadius: '15px' }}>
                  <MDBProgressBar
                    width={calculAvancement()}
                    label={`${calculAvancement()}%`}
                    style={{ borderRadius: '15px' }}
                  />
                </MDBProgress>
              </div>

              <div className="mb-4">
                <strong>Budget :</strong> {project.budget.toLocaleString('fr-FR')} Ar
              </div>

              <MDBTypography tag="h4" className="mb-3">
                Dépenses
              </MDBTypography>

              <MDBTable hover responsive>
                <MDBTableHead dark>
                  <tr>
                    <th>Nom</th>
                    <th>Date</th>
                    <th>Montant (Ar)</th>
                    <th>Commentaire</th>
                    <th>Facture</th>
                  </tr>
                </MDBTableHead>
                <MDBTableBody>
                  {depenses.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center">
                        Aucune dépense enregistrée
                      </td>
                    </tr>
                  ) : (
                    depenses.map(d => (
                      <tr key={d.id}>
                        <td>{d.nom}</td>
                        <td>{d.date}</td>
                        <td>{d.montant.toLocaleString('fr-FR')}</td>
                        <td>{d.commentaire}</td>
                        <td>{d.fichier ? d.fichier.name : '-'}</td>
                      </tr>
                    ))
                  )}
                </MDBTableBody>
              </MDBTable>

              <MDBBtn color="success" className="my-4" onClick={toggleModal}>
                Ajouter une dépense
              </MDBBtn>

              <MDBTypography tag="h4" className="mb-3">
                Récapitulatif des dépenses
              </MDBTypography>

              <MDBTabs className="mb-3">
                {filtres.map(f => (
                  <MDBTabsItem key={f}>
                    <MDBTabsLink
                      onClick={() => setFiltreActif(f)}
                      active={filtreActif === f}
                    >
                      {f}
                    </MDBTabsLink>
                  </MDBTabsItem>
                ))}
              </MDBTabs>

              <Line data={getDataChart()} />

              {/* Modal pour ajout dépense */}
              <MDBModal show={modalOpen} setShow={setModalOpen} tabIndex="-1">
                <MDBModalDialog>
                  <MDBModalContent>
                    <MDBModalHeader>
                      <MDBModalTitle>Ajouter une dépense</MDBModalTitle>
                      <MDBBtn
                        className="btn-close"
                        color="none"
                        onClick={toggleModal}
                      />
                    </MDBModalHeader>
                    <form onSubmit={handleSubmit}>
                      <MDBModalBody>
                        <MDBInput
                          label="Nom"
                          value={user.nom}
                          disabled
                          className="mb-3"
                        />
                        <MDBInput
                          type="date"
                          label="Date"
                          name="date"
                          value={form.date}
                          onChange={handleChange}
                          required
                          className="mb-3"
                        />
                        <MDBInput
                          type="number"
                          label="Montant (Ar)"
                          name="montant"
                          value={form.montant}
                          onChange={handleChange}
                          required
                          className="mb-3"
                        />
                        <MDBInput
                          type="text"
                          label="Commentaire"
                          name="commentaire"
                          value={form.commentaire}
                          onChange={handleChange}
                          required
                          className="mb-3"
                        />
                        <MDBFile
                          label="Upload facture (optionnel)"
                          name="fichier"
                          onChange={handleChange}
                          className="mb-3"
                        />
                      </MDBModalBody>
                      <MDBModalFooter>
                        <MDBBtn color="secondary" onClick={toggleModal}>
                          Annuler
                        </MDBBtn>
                        <MDBBtn type="submit" color="success">
                          Enregistrer
                        </MDBBtn>
                      </MDBModalFooter>
                    </form>
                  </MDBModalContent>
                </MDBModalDialog>
              </MDBModal>
            </MDBCardBody>
          </MDBCard>
        </>
      )}
    </MDBContainer>
  );
}
