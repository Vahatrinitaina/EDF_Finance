import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput
} from 'mdb-react-ui-kit';
import './Login.css';

function Register() {
  const navigate = useNavigate();

  const fullText = `     Rejoignez EDF Finance et commencez dès maintenant à gérer vos finances avec efficacité et transparence. 
  L'inscription est gratuite pour tous les employés autorisés.
  Veillez à utiliser une adresse email valide.`;

  const [displayedText, setDisplayedText] = useState('');
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText((prev) => prev + fullText[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, []);

  const handleRegister = async () => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{8,}$/;

    if (!fullname || !email || !password || !confirmPassword) {
      setError("Tous les champs sont obligatoires.");
      return;
    }

    if (!passwordRegex.test(password)) {
      setError("Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setError('');
    setSuccess('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        name: fullname,
        email,
        password
      });

      alert('Inscription réussie ! Veuillez vérifier votre email pour activer votre compte.');

      // Réinitialiser les champs
      setFullname('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      // Redirection vers la page login
      navigate('/login');

    } catch (err) {
      setError(err.response?.data?.message || "Erreur serveur lors de l'inscription");
    }
  };

  return (
    <MDBContainer className="my-5 gradient-form">
      <MDBRow>
        <MDBCol col='6' className="mb-5">
          <div className="d-flex flex-column ms-5">
            <div className="text-center">
              <img
                src="https://scontent.ftmm1-2.fna.fbcdn.net/v/t39.30808-6/462169722_924548943026492_1298369492030758461_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGR1q_Ky7zPu4z5wP3GbsVo9nQY-ztt1lH2dBj7O23WUa8r6YUV6GijK3u7cmuHcZgEb-L30Mz4K9j_DIXuIHxy&_nc_ohc=ABZ4ztcqm1QQ7kNvwF0iG1a&_nc_oc=AdmHo_WkLKewwdYtwOuclrIesDD01bzrMomT4iNs6VWGc1mJqcerFOuh0dYtKJKiZwY&_nc_zt=23&_nc_ht=scontent.ftmm1-2.fna&_nc_gid=2yfctZUmXnbmY93GO-lsjA&oh=00_AfViV-H96HeT8M_cEjctN0mzxRuVAQbJ4i0krLoSVeRQCQ&oe=689B84AE"
                style={{ width: '185px' }}
                alt="logo"
              />
              <h4 className="mt-1 mb-5 pb-1">EDF Finance</h4>
            </div>

            <p>Créer un compte</p>

            <MDBInput wrapperClass='mb-4' label='Nom complet' id='fullname' type='text'
              value={fullname} onChange={(e) => setFullname(e.target.value)} />
            <MDBInput wrapperClass='mb-4' label='Adresse Email' id='email' type='email'
              value={email} onChange={(e) => setEmail(e.target.value)} />
            <MDBInput wrapperClass='mb-4' label='Mot de passe' id='password' type='password'
              value={password} onChange={(e) => setPassword(e.target.value)} />
            <MDBInput wrapperClass='mb-4' label='Confirmer le mot de passe' id='confirmPassword' type='password'
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

            {error && <div className="text-danger mb-3">{error}</div>}
            {success && <div className="text-success mb-3">{success}</div>}

            <div className="text-center pt-1 mb-5 pb-1">
              <MDBBtn className="mb-4 w-100 gradient-custom-2" onClick={handleRegister}>S'inscrire</MDBBtn>
            </div>

            <div className="d-flex flex-row align-items-center justify-content-center pb-4 mb-4">
              <p className="mb-0">Déjà un compte?</p>
              <a href="/login">
                <MDBBtn outline className='mx-2' color='danger'>
                  Se connecter
                </MDBBtn>
              </a>
            </div>
          </div>
        </MDBCol>

        <MDBCol col='6' className="mb-5">
          <div className="d-flex flex-column justify-content-center gradient-custom-2 h-100 mb-4">
            <div className="text-white px-3 py-4 p-md-5 mx-md-4">
              <h4 className="mb-4">Bienvenue chez EDF Finance</h4>
              <p className="small mb-0 typewriter">{displayedText}</p>
            </div>
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Register;
