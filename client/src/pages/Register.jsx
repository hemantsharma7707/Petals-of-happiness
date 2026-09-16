import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { validatePhone } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const update = (key, val) => setForm({ ...form, [key]: val });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      return toast.error('Please fill in all required fields');
    }
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    if (form.phone && !validatePhone(form.phone)) return toast.error('Please enter a valid 10-digit phone number');

    setLoading(true);
    try {
      const user = await register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
      toast.success(`Welcome to Petals of Happiness, ${user.name}! 🌸`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen flex items-center justify-center bg-cream-100 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🌸</div>
          <h1 className="font-serif text-3xl text-dark-400">Create Account</h1>
          <p className="text-dark-100 mt-2">Join the Petals of Happiness family</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 sm:p-8 space-y-4">
          <div>
            <label htmlFor="name" className="label">Full Name *</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-100" />
              <input id="name" type="text" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Your full name" className="input pl-10" required />
            </div>
          </div>

          <div>
            <label htmlFor="reg-email" className="label">Email *</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-100" />
              <input id="reg-email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="your@email.com" className="input pl-10" required />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="label">Phone Number</label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-100" />
              <input id="phone" type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="10-digit number" className="input pl-10" maxLength={10} />
            </div>
          </div>

          <div>
            <label htmlFor="reg-password" className="label">Password *</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-100" />
              <input id="reg-password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="Min 6 characters" className="input pl-10 pr-10" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-100">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirm-password" className="label">Confirm Password *</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-100" />
              <input id="confirm-password" type="password" value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} placeholder="Re-enter password" className="input pl-10" required />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="text-center text-sm text-dark-100">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-500 font-medium hover:text-brand-700">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
