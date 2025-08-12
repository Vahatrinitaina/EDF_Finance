import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import IncomeDashboard from './pages/Dashboards/Income/IncomeDashboard.jsx';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';

import ClientsList from './pages/ClientsList.jsx';
import ProjectsList from './pages/ProjectsList.jsx';
import ProjectDetails from './pages/ProjectDetails.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>

{/* Redirection racine vers login */}
        <Route path="/" element={<Login />} />

        {/* Authentification */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard */}
        <Route path="/dashboard/income" element={<IncomeDashboard />} />

        {/* Nouvelle section clients / projets */}
        <Route path="/clients" element={<ClientsList />} />
        <Route path="/clients/:clientId/projects" element={<ProjectsList />} />
        <Route path="/clients/:clientId/projects/:projectId" element={<ProjectDetails />} />

        {/* Fallback 404 simple */}
        <Route path="*" element={<h2>Page non trouvée</h2>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;





