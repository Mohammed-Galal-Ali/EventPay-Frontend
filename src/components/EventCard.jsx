import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users } from 'lucide-react';

export default function EventCard({ event, index }) {
  const navigate = useNavigate();

  const soldPercent = (event.soldTickets / event.totalTickets) * 100;
  const isSoldOut = event.availableTickets === 0;
  const isAlmostFull = event.availableTickets <= event.totalTickets * 0.2;

  return (
    <div
      onClick={() => !isSoldOut && navigate(`/event/${event.id}`)}
      className="page-enter"
      style={{
        animationDelay: `${index * 0.08}s`,
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 20,
        padding: 28,
        cursor: isSoldOut ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
        position: 'relative',
        overflow: 'hidden',
        opacity: isSoldOut ? 0.6 : 1,
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={e => {
        if (!isSoldOut) {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.borderColor = 'rgba(124,109,255,0.4)';
          e.currentTarget.style.boxShadow = '0 20px 40px rgba(124,109,255,0.1)';
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: 'linear-gradient(90deg, #7c6dff, #ff6b6b)',
        opacity: 0.6,
      }} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{
          background: isSoldOut ? 'rgba(255,107,107,0.1)' : 'rgba(124,109,255,0.1)',
          border: `1px solid ${isSoldOut ? 'rgba(255,107,107,0.2)' : 'rgba(124,109,255,0.2)'}`,
          borderRadius: 8, padding: '4px 12px', fontSize: 11, fontWeight: 700,
          color: isSoldOut ? '#ff6b6b' : '#7c6dff', letterSpacing: 1,
        }}>
          {isSoldOut ? 'SOLD OUT' : isAlmostFull ? '🔥 ALMOST FULL' : 'LIVE'}
        </div>

        <div style={{ fontSize: 22, fontWeight: 900, color: '#00d9a6', fontFamily: 'Tajawal, sans-serif' }}>
          {event.ticketPrice} <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--muted)' }}>جنيه</span>
        </div>
      </div>

      {/* Title */}
      <h3 style={{
        fontSize: 19, fontWeight: 800, marginBottom: 8,
        lineHeight: 1.4, fontFamily: 'Tajawal, sans-serif',
      }}>
        {event.title}
      </h3>

      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20, lineHeight: 1.8, flexGrow: 1 }}>
        {event.description?.slice(0, 80)}{event.description?.length > 80 ? '...' : ''}
      </p>

      {/* Info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--muted)' }}>
          <Calendar size={14} color="#7c6dff" strokeWidth={2} />
          <span>{new Date(event.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--muted)' }}>
          <MapPin size={14} color="#ff6b6b" strokeWidth={2} />
          <span>{event.location}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--muted)' }}>
          <Users size={14} color="#00d9a6" strokeWidth={2} />
          <span style={{ color: isAlmostFull ? '#ffb84d' : 'var(--muted)' }}>
            {event.availableTickets} متاحة
          </span>
          <span style={{ color: 'var(--border)', userSelect: 'none' }}>•</span>
          <span>{event.totalTickets} إجمالي</span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ background: 'var(--border)', borderRadius: 4, height: 4, marginBottom: 20, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 4,
          width: `${soldPercent}%`,
          background: isAlmostFull
            ? 'linear-gradient(90deg, #ffb84d, #ff6b6b)'
            : 'linear-gradient(90deg, #7c6dff, #00d9a6)',
          transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1)',
        }} />
      </div>

      {/* CTA */}
      <button style={{
        width: '100%', padding: '13px',
        background: isSoldOut
          ? 'var(--border)'
          : 'linear-gradient(135deg, #7c6dff, #9f94ff)',
        border: 'none', borderRadius: 12, color: 'white',
        fontSize: 15, fontWeight: 700,
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', gap: 8,
        transition: 'all 0.2s',
        fontFamily: 'Tajawal, sans-serif',
        letterSpacing: 0.3,
      }}>
        {isSoldOut ? '🚫 نفدت التذاكر' : '🎟️  احجز تذكرتك'}
      </button>
    </div>
  );
}
