import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 40px',
      background: 'rgba(8,8,16,0.8)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(124,109,255,0.1)',
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 36, height: 36,
          background: 'linear-gradient(135deg, #7c6dff, #ff6b6b)',
          borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18,
        }}>🎟️</div>
        <span style={{
          fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20,
          background: 'linear-gradient(135deg, #7c6dff, #ff6b6b)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>EventPay</span>
      </Link>

      <div style={{ display: 'flex', gap: 8 }}>
        <Link to="/" style={{
          padding: '8px 20px', borderRadius: 8, fontSize: 14, fontWeight: 600,
          background: location.pathname === '/' ? 'rgba(124,109,255,0.15)' : 'transparent',
          color: location.pathname === '/' ? '#7c6dff' : '#5a5a7a',
          border: '1px solid', borderColor: location.pathname === '/' ? 'rgba(124,109,255,0.3)' : 'transparent',
          transition: 'all 0.2s',
        }}>الفعاليات</Link>
      </div>
    </nav>
  );
}
