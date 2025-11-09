import {
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBBtn,
  MDBModalBody,
  MDBModalFooter,
  MDBInput
} from 'mdb-react-ui-kit';

const mockClients = ["Jean Dupont", "Marie Curie", "Paul Rabe", "Alice Rakoto"];

export default function IncomeForm({ newPayment, setNewPayment, onClose, onSubmit, editMode }) {
  return (
    <MDBModalDialog>
      <MDBModalContent>
        <MDBModalHeader>
          <MDBModalTitle>{editMode ? "Modifier l'entrée" : "Ajouter une entrée"}</MDBModalTitle>
          <MDBBtn className='btn-close' color='none' onClick={onClose}></MDBBtn>
        </MDBModalHeader>
        <MDBModalBody>
          <MDBInput label='Date' type='date' className='mb-3'
            value={newPayment.date}
            onChange={(e) => setNewPayment({ ...newPayment, date: e.target.value })}
          />
          <MDBInput label='Montant' type='number' className='mb-3'
            value={newPayment.amount}
            onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
          />
          <select className='form-select mb-3'
            value={newPayment.paymentMethod}
            onChange={(e) => setNewPayment({ ...newPayment, paymentMethod: e.target.value })}
          >
            <option value="">-- Mode de paiement --</option>
            <option value="Virement bancaire">Virement bancaire</option>
            <option value="Chèque">Chèque</option>
            <option value="Mobile Money">Mobile Money</option>
            <option value="Espèces">Espèces</option>
          </select>
          <select className='form-select mb-3'
            value={newPayment.client}
            onChange={(e) => setNewPayment({ ...newPayment, client: e.target.value })}
          >
            <option value="">-- Sélectionner un client --</option>
            {mockClients.map((client, index) => (
              <option key={index} value={client}>{client}</option>
            ))}
          </select>
          <MDBInput label='Commentaire' type='text' className='mb-3'
            value={newPayment.comment}
            onChange={(e) => setNewPayment({ ...newPayment, comment: e.target.value })}
          />
          <MDBInput label='Reçu par' className='mb-3'
            value={newPayment.receivedBy}
            readOnly
          />
        </MDBModalBody>
        <MDBModalFooter>
          <MDBBtn color='secondary' onClick={onClose}>Annuler</MDBBtn>
          <MDBBtn onClick={onSubmit}>{editMode ? "Mettre à jour" : "Ajouter"}</MDBBtn>
        </MDBModalFooter>
      </MDBModalContent>
    </MDBModalDialog>
  );
}
