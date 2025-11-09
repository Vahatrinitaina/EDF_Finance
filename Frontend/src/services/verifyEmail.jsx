// src/pages/VerifyEmail.jsx
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const code = searchParams.get('code');

  const [status, setStatus] = useState('Vérification en cours...');

  useEffect(() => {
    const verify = async () => {
      if (!email || !code) {
        setStatus('Lien de vérification invalide.');
        return;
      }

      try {
        const res = await axios.post('http://localhost:5000/api/auth/verify-email', {
          email,
          verificationCode: code
        });

        setStatus(res.data.message);
      } catch (err) {
        setStatus(err.response?.data?.message || 'Erreur lors de la vérification.');
      }
    };

    verify();
  }, [email, code]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>{status}</h2>
      {status.includes('succès') && (
        <a href="/login">Se connecter</a>
      )}
    </div>
  );
}
