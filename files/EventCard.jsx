import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Ticket, Users } from 'lucide-react';

export default function EventCard({ event, index }) {
  const navigate = useNavigate();

  const availability = ((event.totalTickets - event.soldTickets) / event.totalTickets) * 100;
  const isSoldOut = event.availableTickets === 0;

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
          background: 'rgba(124,109,255,0.1)', border: '1px solid rgba(124,109,255,0.2)',
          borderRadius: 8, padding: '4px 12px', fontSize: 12, fontWeight: 700,
          color: '#7c6dff', letterSpacing: 1,
        }}>LIVE</div>

        <div style={{ fontSize: 22, fontWeight: 900, color: '#00d9a6', fontFamily: 'Syne, sans-serif' }}>
          {event.ticketPrice} <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--muted)' }}>جنيه</span>
        </div>
      </div>

      {/* Title */}
      <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8, fontFamily: 'Syne, sans-serif', lineHeight: 1.3 }}>
        {event.title}
      </h3>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20, lineHeight: 1.7 }}>
        {event.description?.slice(0, 80)}{event.description?.length > 80 ? '...' : ''}
      </p>

      {/* Info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--muted)' }}>
          <Calendar size={14} color="#7c6dff" />
          {new Date(event.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--muted)' }}>
          <MapPin size={14} color="#ff6b6b" />
          {event.location}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--muted)' }}>
          <Users size={14} color="#00d9a6" />
          {event.availableTickets} تذكرة متاحة من {event.totalTickets}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ background: 'var(--border)', borderRadius: 4, height: 4, marginBottom: 16, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 4,
          width: `${100 - availability}%`,
          background: availability > 30 ? 'linear-gradient(90deg, #7c6dff, #00d9a6)' : 'linear-gradient(90deg, #ff6b6b, #ffb84d)',
          transition: 'width 0.5s',
        }} />
      </div>

      {/* CTA */}
      <button style={{
        width: '100%', padding: '12px',
        background: isSoldOut ? 'var(--border)' : 'linear-gradient(135deg, #7c6dff, #9f94ff)',
        border: 'none', borderRadius: 12, color: 'white',
        fontSize: 14, fontWeight: 700, letterSpacing: 0.5,
        transition: 'all 0.2s',
      }}>
        {isSoldOut ? '🚫 نفدت التذاكر' : '🎟️ احجز تذكرتك'}
      </button>
    </div>
  );
}
