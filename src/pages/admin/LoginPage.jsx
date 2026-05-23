import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Lock } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      localStorage.setItem('token', data.token);
      toast.success('Welcome Admin!');
      navigate('/admin/reports');
    } catch {
      toast.error('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px',
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 10, color: 'var(--text)', fontSize: 14, outline: 'none',
    fontFamily: 'Tajawal, sans-serif', transition: 'border-color 0.2s',
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div className="page-enter" style={{
        background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: 20, padding: 40, width: '100%', maxWidth: 400,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: 'linear-gradient(90deg, #7c6dff, #ff6b6b)',
        }} />

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, background: 'linear-gradient(135deg, #7c6dff, #ff6b6b)',
            borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', fontSize: 24,
          }}>
            <Lock size={24} color="white" />
          </div>
          <h1 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: 22, fontWeight: 800, marginBottom: 4 }}>
            Admin Login
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 13, fontFamily: 'Tajawal, sans-serif' }}>
            EventPay Dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{
              fontSize: 12, color: 'var(--muted)', fontWeight: 700,
              display: 'block', marginBottom: 6, fontFamily: 'Tajawal, sans-serif',
            }}>Username</label>
            <input
              required value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              placeholder="admin"
              style={{ ...inputStyle, direction: 'ltr' }}
              onFocus={e => e.target.style.borderColor = 'rgba(124,109,255,0.5)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          <div>
            <label style={{
              fontSize: 12, color: 'var(--muted)', fontWeight: 700,
              display: 'block', marginBottom: 6, fontFamily: 'Tajawal, sans-serif',
            }}>Password</label>
            <input
              required type="password" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              style={{ ...inputStyle, direction: 'ltr' }}
              onFocus={e => e.target.style.borderColor = 'rgba(124,109,255,0.5)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          <button
            type="submit" disabled={loading}
            style={{
              padding: '13px', marginTop: 8,
              background: loading ? 'var(--border)' : 'linear-gradient(135deg, #7c6dff, #9f94ff)',
              border: 'none', borderRadius: 12, color: 'white',
              fontSize: 15, fontWeight: 700, fontFamily: 'Tajawal, sans-serif',
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? '⏳ جاري الدخول...' : '🔐 Login'}
          </button>
        </form>
      </div>
    </div>
  );
}