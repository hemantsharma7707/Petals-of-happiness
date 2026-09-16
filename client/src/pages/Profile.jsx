import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/services';
import { validatePhone } from '../utils/helpers';
import toast from 'react-hot-toast';
import { User, Mail, Phone, MapPin, Lock, Save } from 'lucide-react';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!form.name) return toast.error('Name is required');
    if (form.phone && !validatePhone(form.phone)) return toast.error('Invalid phone number');

    setSaving(true);
    try {
      const res = await authService.updateProfile({ name: form.name, phone: form.phone });
      updateUser(res.data.user);
      toast.success('Profile updated! 🌸');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!passwords.currentPassword || !passwords.newPassword) return toast.error('Fill all password fields');
    if (passwords.newPassword.length < 6) return toast.error('New password must be at least 6 characters');
    if (passwords.newPassword !== passwords.confirmPassword) return toast.error('Passwords do not match');

    setChangingPassword(true);
    try {
      await authService.changePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password changed successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password change failed');
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="pt-24 pb-16">
      <div className="container-max px-4 sm:px-6 lg:px-8 max-w-2xl">
        <h1 className="section-title mb-8">My Profile</h1>

        {/* Profile Form */}
        <form onSubmit={handleProfileUpdate} className="card p-6 sm:p-8 mb-6">
          <h2 className="font-serif text-xl text-dark-400 mb-5">Personal Information</h2>
          <div className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-100" />
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input pl-10" />
              </div>
            </div>
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-100" />
                <input type="email" value={user?.email || ''} disabled className="input pl-10 bg-cream-100 cursor-not-allowed" />
              </div>
              <p className="text-xs text-dark-100 mt-1">Email cannot be changed</p>
            </div>
            <div>
              <label className="label">Phone</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-100" />
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input pl-10" maxLength={10} placeholder="10-digit number" />
              </div>
            </div>
          </div>
          <button type="submit" disabled={saving} className="btn-primary mt-5">
            <Save size={16} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>

        {/* Change Password */}
        <form onSubmit={handlePasswordChange} className="card p-6 sm:p-8">
          <h2 className="font-serif text-xl text-dark-400 mb-5">Change Password</h2>
          <div className="space-y-4">
            <div>
              <label className="label">Current Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-100" />
                <input type="password" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} className="input pl-10" />
              </div>
            </div>
            <div>
              <label className="label">New Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-100" />
                <input type="password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} className="input pl-10" placeholder="Min 6 characters" />
              </div>
            </div>
            <div>
              <label className="label">Confirm New Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-100" />
                <input type="password" value={passwords.confirmPassword} onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} className="input pl-10" />
              </div>
            </div>
          </div>
          <button type="submit" disabled={changingPassword} className="btn-secondary mt-5">
            <Lock size={16} />
            {changingPassword ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
