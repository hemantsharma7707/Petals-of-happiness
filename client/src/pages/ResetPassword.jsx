import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { authService } from '../services/services';
import toast from 'react-hot-toast';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);
    try {
      const res = await authService.resetPassword(token, { password });
      toast.success(res.data.message);
      setSuccess(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-cream-100 px-4">
        <div className="w-full max-w-md text-center">
          <div className="card p-8 sm:p-10">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={32} className="text-green-500" />
            </div>
            <h1 className="font-serif text-2xl text-dark-400 mb-3">Password Reset!</h1>
            <p className="text-dark-100 leading-relaxed mb-6">
              Your password has been successfully reset. You can now sign in with your new password.
            </p>
            <Link to="/login" className="btn-primary w-full justify-center">
              Sign In Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen flex items-center justify-center bg-cream-100 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🔑</div>
          <h1 className="font-serif text-3xl text-dark-400">Create New Password</h1>
          <p className="text-dark-100 mt-2">Your new password must be at least 6 characters long.</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 sm:p-8 space-y-5">
          <div>
            <label htmlFor="new-password" className="label">New Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-100" />
              <input
                id="new-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="input pl-10 pr-10"
                required
                minLength={6}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-100 hover:text-dark-300"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirm-password" className="label">Confirm Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-100" />
              <input
                id="confirm-password"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="input pl-10"
                required
                minLength={6}
              />
            </div>
            {confirmPassword && password !== confirmPassword && (
              <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
            )}
          </div>

          {/* Password strength indicator */}
          <div>
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    password.length >= level * 3
                      ? password.length >= 10
                        ? 'bg-green-400'
                        : password.length >= 6
                        ? 'bg-yellow-400'
                        : 'bg-red-400'
                      : 'bg-cream-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-dark-100 mt-1.5">
              {password.length === 0
                ? 'Enter a password'
                : password.length < 6
                ? 'Too short — minimum 6 characters'
                : password.length < 10
                ? 'Good — try adding more characters'
                : 'Strong password! 💪'}
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || password.length < 6 || password !== confirmPassword}
            className="btn-primary w-full justify-center"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>

          <p className="text-center text-sm text-dark-100">
            <Link to="/login" className="text-brand-500 font-medium hover:text-brand-700">
              ← Back to Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
