import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { authService } from '../services/services';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return toast.error('Please enter your email');

    setLoading(true);
    try {
      await authService.forgotPassword({ email });
      setSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-cream-100 px-4">
        <div className="w-full max-w-md text-center">
          <div className="card p-8 sm:p-10">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={32} className="text-green-500" />
            </div>
            <h1 className="font-serif text-2xl text-dark-400 mb-3">Check Your Email</h1>
            <p className="text-dark-100 leading-relaxed mb-6">
              If an account exists for <span className="font-medium text-dark-400">{email}</span>, 
              we've sent a password reset link. Please check your inbox and spam folder.
            </p>
            <p className="text-sm text-dark-100 mb-6">
              The link expires in <span className="font-medium text-brand-500">15 minutes</span>.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => { setSent(false); setEmail(''); }}
                className="btn-secondary w-full justify-center"
              >
                Try a different email
              </button>
              <Link to="/login" className="block text-sm text-brand-500 hover:text-brand-700 text-center">
                ← Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen flex items-center justify-center bg-cream-100 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🔐</div>
          <h1 className="font-serif text-3xl text-dark-400">Forgot Password?</h1>
          <p className="text-dark-100 mt-2 leading-relaxed">
            No worries! Enter the email linked to your account and we'll send you a reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 sm:p-8 space-y-5">
          <div>
            <label htmlFor="forgot-email" className="label">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-100" />
              <input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="input pl-10"
                required
                autoFocus
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>

          <p className="text-center text-sm text-dark-100">
            Remember your password?{' '}
            <Link to="/login" className="text-brand-500 font-medium hover:text-brand-700">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
