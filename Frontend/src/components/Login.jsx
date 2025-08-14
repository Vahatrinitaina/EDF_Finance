import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput
} from 'mdb-react-ui-kit';

function Login() {
  const navigate = useNavigate();

  const fullText = `   Ce dernier servira surtout de support pour la gestion des finances de l'entreprise. 
Vous pourrez y suivre vos dépenses, établir des budgets et analyser vos habitudes de consommation. 
Une partie dédiée à la collecte des financements de l'entreprise sera par ailleurs disponible pour les utilisateurs autorisés. 
N'hésitez pas à contacter le support technique en cas de problème de connexion.    `;

  const [displayedText, setDisplayedText] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Veuillez saisir email et mot de passe.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      // Connexion réussie
      alert(res.data.message);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // Redirection vers dashboard
      navigate('/dashboard');

    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Erreur serveur';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MDBContainer className="my-5 gradient-form">
      <MDBRow>
        <MDBCol col='6' className="mb-5">
          <div className="d-flex flex-column ms-5">
            <div className="text-center">
              <img
                src="https://scontent.ftmm1-2.fna.fbcdn.net/v/t39.30808-6/462169722_924548943026492_1298369492030758461_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGR1q_Ky7zPu4z5wP3GbsVo9nQY-ztt1lH2dBj7O23WUa8r6YUV6GijK3u7cmuHcZgEb-L30Mz4K9j_DIXuIHxy&_nc_ohc=ABZ4ztcqm1QQ7kNvwEA2Ege&_nc_oc=AdlHS_uOYPWpHChsEpg0Kr1Z6dAj_wiLr0eYsYJ7g9MggVKGkonx1kLsbQnLDggOBDk&_nc_zt=23&_nc_ht=scontent.ftmm1-2.fna&_nc_gid=2Y4snJ1X_lJlQ9FnxKJBXg&oh=00_AfUs1GA5Ecu-1Ap0dQQHkMb29ARV9n__uVxygdFrZeBlpQ&oe=689A332E"
                style={{ width: '185px' }}
                alt="logo"
              />
              <h4 className="mt-1 mb-5 pb-1">EDF Finance</h4>
            </div>

            <p>Commencez par vous connecter</p>

            <MDBInput
              wrapperClass='mb-4'
              label='Adresse Email'
              id='form1'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <MDBInput
              wrapperClass='mb-4'
              label='Mot de passe'
              id='form2'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="text-center pt-1 mb-5 pb-1">
              <MDBBtn
                className="mb-4 w-100 gradient-custom-2"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </MDBBtn>
              <a className="text-muted" href="#!">Mot de passe oublié?</a>
            </div>

            <div className="d-flex flex-row align-items-center justify-content-center pb-4 mb-4">
              <p className="mb-0">Pas de compte?</p>
              <a href="/register">
                <MDBBtn outline className='mx-2' color='danger'>S'inscrire</MDBBtn>
              </a>
            </div>
          </div>
        </MDBCol>

        <MDBCol col='6' className="mb-5">
          <div className="d-flex flex-column justify-content-center gradient-custom-2 h-100 mb-4">
            <div className="text-white px-3 py-4 p-md-5 mx-md-4">
              <h4 className="mb-4">Bienvenue dans l'application EDF Finance</h4>
              <p className="small mb-0 typewriter">{displayedText}</p>
            </div>
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Login;
