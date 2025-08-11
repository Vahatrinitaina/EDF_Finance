import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBtn,
  MDBIcon,
  MDBContainer,
  MDBTypography,
} from 'mdb-react-ui-kit';

const mockClients = [
  { id: 'c1', nom: 'Client Alpha', secteur: 'Finance' },
  { id: 'c2', nom: 'Client Beta', secteur: 'Industrie' },
  { id: 'c3', nom: 'Client Gamma', secteur: 'Tech' },
];

export default function ClientsList() {
  const navigate = useNavigate();

  const handleClientClick = (clientId) => {
    navigate(`/clients/${clientId}/projects`);
  };

  const handleAddClient = () => {
    console.log('Ajouter un client (à implémenter)');
  };

  const handleEditClient = (clientId) => {
    console.log(`Modifier client ${clientId} (à implémenter)`);
  };

  return (
    <MDBContainer className="my-5">
      <MDBTypography tag="h2" className="mb-4">
        Liste des clients
      </MDBTypography>

      <MDBBtn color="success" className="mb-3" onClick={handleAddClient}>
        <MDBIcon fas icon="plus" className="me-2" />
        Ajouter un client
      </MDBBtn>

      <MDBTable hover responsive>
        <MDBTableHead dark>
          <tr>
            <th>Nom du client</th>
            <th>Secteur d'activité</th>
            <th>Actions</th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {mockClients.map(client => (
            <tr key={client.id}>
              <td>
                <a
                  href="#!"
                  onClick={(e) => {
                    e.preventDefault();
                    handleClientClick(client.id);
                  }}
                  style={{ cursor: 'pointer', textDecoration: 'underline', color: '#0d6efd' }}
                >
                  {client.nom}
                </a>
              </td>
              <td>{client.secteur}</td>
              <td>
                <MDBBtn
                  size="sm"
                  color="primary"
                  className="me-2"
                  onClick={() => handleEditClient(client.id)}
                >
                  <MDBIcon fas icon="pen" />
                </MDBBtn>
                <MDBBtn
                  size="sm"
                  color="info"
                  onClick={() => handleClientClick(client.id)}
                >
                  Voir projets
                </MDBBtn>
              </td>
            </tr>
          ))}
        </MDBTableBody>
      </MDBTable>
    </MDBContainer>
  );
}
