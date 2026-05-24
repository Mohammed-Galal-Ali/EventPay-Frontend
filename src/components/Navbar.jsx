import { Link, useLocation } from 'react-router-dom';
import { Ticket, Calendar } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const navLink = (to, label, icon) => {
    const active = location.pathname === to;
    return (
      <Link to={to} style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '8px 18px', borderRadius: 10, fontSize: 14, fontWeight: 600,
        fontFamily: 'Tajawal, sans-serif',
        background: active ? 'rgba(124,109,255,0.12)' : 'transparent',
        color: active ? '#7c6dff' : '#5a5a7a',
        border: '1px solid',
        borderColor: active ? 'rgba(124,109,255,0.25)' : 'transparent',
        transition: 'all 0.2s',
        textDecoration: 'none',
      }}
        onMouseEnter={e => {
          if (!active) {
            e.currentTarget.style.color = 'var(--text)';
            e.currentTarget.style.borderColor = 'var(--border)';
          }
        }}
        onMouseLeave={e => {
          if (!active) {
            e.currentTarget.style.color = '#5a5a7a';
            e.currentTarget.style.borderColor = 'transparent';
          }
        }}
      >
        {icon} {label}
      </Link>
    );
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 40px',
      background: 'rgba(8,8,16,0.85)',
      backdropFilter: 'blur(24px)',
      borderBottom: '1px solid rgba(124,109,255,0.08)',
      boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
    }}>

      {/* Logo */}
      <Link to="/" style={{
        display: 'flex', alignItems: 'center', gap: 10,
        textDecoration: 'none',
      }}>
        <div style={{
          width: 38, height: 38,
          background: 'linear-gradient(135deg, #7c6dff, #ff6b6b)',
          borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 19, boxShadow: '0 4px 12px rgba(124,109,255,0.3)',
        }}>🎟️</div>
        <span style={{
          fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20,
          background: 'linear-gradient(135deg, #7c6dff, #ff6b6b)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          letterSpacing: -0.5,
        }}>EventPay</span>
      </Link>

      {/* Links */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        {navLink('/', 'الفعاليات', <Calendar size={14} />)}
        {navLink('/my-tickets', 'تذاكري', <Ticket size={14} />)}
      </div>

    </nav>
  );
}
