import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email) {
      setError('Vul je e-mailadres in');
      return false;
    }
    if (!email.includes('@')) {
      setError('Voer een geldig e-mailadres in');
      return false;
    }
    if (!password) {
      setError('Voer je wachtwoord in');
      return false;
    }
    if (password.length < 6) {
      setError('Wachtwoord moet minstens 6 tekens lang zijn.');
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        if (signInError.message === 'Ongeldige inloggegevens.') {
          setError(
            'Onjuist e-mailadres of wachtwoord. Probeer het opnieuw of klik op "Registreren" om een nieuw account aan te maken.'
          );
        } else {
          setError(signInError.message);
        }
        return;
      }

      navigate('/chat');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
           Login met je account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Vul je gegevens in om in te loggen
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email adres
              </label>
              <input
                id="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email adres"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Wachtwoord
              </label>
              <input
                id="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Wachtwoord"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                loading 
                  ? 'bg-indigo-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }`}
            >
              {loading ? 'Inloggen...' : 'Login'} 
            </button>
          </div>
        </form>
        <div className="text-center space-y-2">
          <Link to="/register" className="text-indigo-600 hover:text-indigo-500 block">
            Heb je geen account? Regisreer dan hier.
          </Link>
          <p className="text-sm text-gray-600">
          Zorg ervoor dat je de juiste e-mail en het juiste wachtwoord gebruikt waarmee je je geregistreerd hebt.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;