import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';
import api from '../services/api';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link.');
      return;
    }

    const verify = async () => {
      try {
        const { data } = await api.get(`/auth/verify-email/${token}`);
        login(data.token, data.user);
        setStatus('success');
        setMessage(data.message);

        // Redirect to home after 3 seconds
        setTimeout(() => navigate('/'), 3000);
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed.');
      }
    };

    verify();
  }, []);

  return (
    <MainLayout>
      <div className="max-w-md mx-auto mt-20 px-6">
        <div className="bg-white rounded-2xl p-10 shadow-xl border border-slate-100 text-center">

          {status === 'loading' && (
            <>
              <Loader size={64} className="mx-auto mb-4 text-blue-500 animate-spin" />
              <h2 className="text-xl font-bold text-slate-800">Verifying your email...</h2>
              <p className="text-slate-500 mt-2">Please wait a moment.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle size={64} className="mx-auto mb-4 text-emerald-500" />
              <h2 className="text-xl font-bold text-slate-800">Email Verified!</h2>
              <p className="text-slate-500 mt-2">{message}</p>
              <p className="text-slate-400 text-sm mt-4">Redirecting to home in 3 seconds...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle size={64} className="mx-auto mb-4 text-red-500" />
              <h2 className="text-xl font-bold text-slate-800">Verification Failed</h2>
              <p className="text-slate-500 mt-2">{message}</p>
              <button
                onClick={() => navigate('/register')}
                className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold cursor-pointer border-none"
              >
                Back to Register
              </button>
            </>
          )}

        </div>
      </div>
    </MainLayout>
  );
};

export default VerifyEmailPage;