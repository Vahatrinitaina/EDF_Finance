import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBtn,
  MDBIcon,
  MDBContainer,
  MDBTypography,
} from 'mdb-react-ui-kit';

const mockProjects = {
  c1: [
    { id: 'p1', nom: 'Projet Alpha', budget: 10000000, deadline: '2025-12-31' },
    { id: 'p2', nom: 'Projet Beta', budget: 5000000, deadline: '2025-06-30' },
  ],
  c2: [
    { id: 'p3', nom: 'Projet Gamma', budget: 20000000, deadline: '2026-03-31' },
  ],
  c3: [
    { id: 'p4', nom: 'Projet Delta', budget: 15000000, deadline: '2025-09-30' },
    { id: 'p5', nom: 'Projet Epsilon', budget: 7000000, deadline: '2025-11-15' },
  ],
};

export default function ProjectsList() {
  const { clientId } = useParams();
  const navigate = useNavigate();

  const projects = mockProjects[clientId] || [];

  const handleProjectClick = (projectId) => {
    navigate(`/clients/${clientId}/projects/${projectId}`);
  };

  const handleAddProject = () => {
    console.log('Ajouter un projet (à implémenter)');
  };

  const handleEditProject = (projectId) => {
    console.log(`Modifier projet ${projectId} (à implémenter)`);
  };

  return (
    <MDBContainer className="my-5">
      <MDBTypography tag="h2" className="mb-4">
        Projets du client {clientId}
      </MDBTypography>

      <MDBBtn color="success" className="mb-3" onClick={handleAddProject}>
        <MDBIcon fas icon="plus" className="me-2" />
        Ajouter un projet
      </MDBBtn>

      <MDBTable hover responsive>
        <MDBTableHead dark>
          <tr>
            <th>Nom du projet</th>
            <th>Budget (Ar)</th>
            <th>Deadline</th>
            <th>Actions</th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {projects.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">Aucun projet trouvé</td>
            </tr>
          ) : (
            projects.map(project => (
              <tr key={project.id}>
                <td>
                  <a
                    href="#!"
                    onClick={(e) => {
                      e.preventDefault();
                      handleProjectClick(project.id);
                    }}
                    style={{ cursor: 'pointer', textDecoration: 'underline', color: '#0d6efd' }}
                  >
                    {project.nom}
                  </a>
                </td>
                <td>{project.budget.toLocaleString('fr-FR')}</td>
                <td>{project.deadline}</td>
                <td>
                  <MDBBtn
                    size="sm"
                    color="primary"
                    className="me-2"
                    onClick={() => handleEditProject(project.id)}
                  >
                    <MDBIcon fas icon="pen" />
                  </MDBBtn>
                  <MDBBtn
                    size="sm"
                    color="info"
                    onClick={() => handleProjectClick(project.id)}
                  >
                    Voir détails
                  </MDBBtn>
                </td>
              </tr>
            ))
          )}
        </MDBTableBody>
      </MDBTable>
    </MDBContainer>
  );
}
