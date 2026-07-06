import { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';
import api from '../services/api';
import toast from 'react-hot-toast';
import { ShieldCheck, RefreshCw } from 'lucide-react';

const VerifyOTPPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputs = useRef([]);

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').slice(0, 6).split('');
    if (pasted.every(c => /\d/.test(c))) {
      setOtp([...pasted, ...Array(6 - pasted.length).fill('')]);
      inputs.current[Math.min(pasted.length, 5)].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length !== 6) return toast.error('Please enter the 6-digit code');

    setLoading(true);
    try {
      const { data } = await api.post('/auth/verify-otp', { email, otp: otpCode });
      login(data.token, data.user);
      toast.success('Email verified successfully! 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid code');
      setOtp(['', '', '', '', '', '']);
      inputs.current[0].focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await api.post('/auth/resend-otp', { email });
      toast.success('New code sent to your email!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend');
    } finally {
      setResending(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-md mx-auto mt-16 px-6">
        <div className="bg-white rounded-2xl p-10 shadow-xl border border-slate-100 text-center">

          {/* Icon */}
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
            <ShieldCheck size={28} color="white" />
          </div>

          <h1 className="text-2xl font-extrabold text-slate-800">Verify Your Email</h1>
          <p className="text-slate-500 mt-2 mb-1">We sent a 6-digit code to</p>
          <p className="text-blue-500 font-semibold mb-6">{email}</p>

          {/* OTP Inputs */}
          <form onSubmit={handleSubmit}>
            <div className="flex justify-center gap-3 mb-6">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={el => inputs.current[i] = el}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleChange(e.target.value, i)}
                  onKeyDown={e => handleKeyDown(e, i)}
                  onPaste={handlePaste}
                  className="w-12 h-14 text-center text-2xl font-bold border-2 border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:shadow-md bg-slate-50 text-slate-800 transition-all"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-200 cursor-pointer border-none disabled:opacity-60"
            >
              <ShieldCheck size={18} />
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>

          {/* Resend */}
          <div className="mt-6">
            <p className="text-slate-400 text-sm mb-2">Didn't receive the code?</p>
            <button
              onClick={handleResend}
              disabled={resending}
              className="flex items-center gap-2 text-blue-500 hover:text-blue-600 font-semibold text-sm mx-auto bg-transparent border-none cursor-pointer"
            >
              <RefreshCw size={14} />
              {resending ? 'Sending...' : 'Resend Code'}
            </button>
          </div>

        </div>
      </div>
    </MainLayout>
  );
};

export default VerifyOTPPage;