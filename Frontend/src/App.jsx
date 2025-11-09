import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import IncomeDashboard from './pages/Dashboards/Income/IncomeDashboard.jsx';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import NotFound from './pages/NotFound.jsx';
import ClientsList from './pages/ClientsList.jsx';
import ProjectsList from './pages/ProjectsList.jsx';
import ProjectDetails from './pages/ProjectDetails.jsx';
import VerifyEmail from './services/verifyEmail.jsx';
import ForgotPassword from './components/ForgotPassword.jsx';
import ResetPassword from './components/ResetPassword.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Redirection racine vers login */}
        <Route path="/" element={<Login />} />

        {/* Authentification */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/verify-email" element={<VerifyEmail />} /> {/*verification email*/}

        {/* Dashboard */}
        <Route path="/dashboard/income" element={<IncomeDashboard />} />

        {/* Nouvelle section clients / projets */}
        <Route path="/clients" element={<ClientsList />} />
        <Route path="/clients/:clientId/projects" element={<ProjectsList />} />
        <Route path="/clients/:clientId/projects/:projectId" element={<ProjectDetails />} />


        {/* Réinitialisation mot de passe */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />



        {/* Page 404 - Catch all */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
