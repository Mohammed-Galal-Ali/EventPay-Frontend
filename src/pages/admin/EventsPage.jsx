import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Plus, Trash2, MapPin, Calendar, Users, DollarSign } from 'lucide-react';

export default function EventsPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/admin/login'); return; }

    fetchEvents();
  }, [navigate]);

  const fetchEvents = async () => {
    try {
      const { data } = await api.get('/events');
      setEvents(data);
    } catch {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    setDeletingId(id);
    try {
      await api.delete(`/events/${id}`);
      toast.success('Event deleted successfully');
      setEvents(events.filter(e => e.id !== id));
    } catch {
      toast.error('Failed to delete event');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{
        width: 40, height: 40, border: '3px solid var(--border)',
        borderTopColor: '#7c6dff', borderRadius: '50%', animation: 'spin 0.7s linear infinite',
      }} />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', padding: '90px 24px 80px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: 28, fontWeight: 800, marginBottom: 4 }}>
              🎯 Manage Events
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: 13, fontFamily: 'Tajawal, sans-serif' }}>
              {events.length} event{events.length !== 1 ? 's' : ''} total
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => navigate('/admin/reports')} style={{
              padding: '10px 18px', borderRadius: 10,
              background: 'transparent', border: '1px solid var(--border)',
              color: 'var(--muted)', fontSize: 13, fontWeight: 700,
              fontFamily: 'Tajawal, sans-serif', cursor: 'pointer',
            }}>
              ← Reports
            </button>

            <button onClick={() => navigate('/admin/create-event')} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 18px', borderRadius: 10,
              background: 'linear-gradient(135deg, #7c6dff, #9f94ff)',
              border: 'none', color: 'white', fontSize: 13, fontWeight: 700,
              fontFamily: 'Tajawal, sans-serif', cursor: 'pointer',
            }}>
              <Plus size={14} /> New Event
            </button>
          </div>
        </div>

        {/* Events Grid */}
        {events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
            <p style={{ fontFamily: 'Tajawal, sans-serif', fontSize: 16 }}>No events yet</p>
            <button onClick={() => navigate('/admin/create-event')} style={{
              marginTop: 16, padding: '12px 24px', borderRadius: 12,
              background: 'linear-gradient(135deg, #7c6dff, #9f94ff)',
              border: 'none', color: 'white', fontSize: 14, fontWeight: 700,
              fontFamily: 'Tajawal, sans-serif', cursor: 'pointer',
            }}>
              + Create First Event
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 20,
          }}>
            {events.map(event => (
              <div key={event.id} style={{
                background: 'var(--card)', border: '1px solid var(--border)',
                borderRadius: 16, padding: 24, position: 'relative', overflow: 'hidden',
              }}>
                {/* Top accent */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                  background: 'linear-gradient(90deg, #7c6dff, #ff6b6b)',
                }} />

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{
                    background: 'rgba(124,109,255,0.1)', border: '1px solid rgba(124,109,255,0.2)',
                    borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 700, color: '#7c6dff',
                  }}>#{event.id}</div>

                  <button
                    onClick={() => handleDelete(event.id, event.title)}
                    disabled={deletingId === event.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '6px 12px', borderRadius: 8,
                      background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.2)',
                      color: '#ff6b6b', fontSize: 12, fontWeight: 700,
                      fontFamily: 'Tajawal, sans-serif', cursor: 'pointer',
                      opacity: deletingId === event.id ? 0.5 : 1,
                    }}
                  >
                    <Trash2 size={12} />
                    {deletingId === event.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>

                {/* Title */}
                <h3 style={{
                  fontFamily: 'Tajawal, sans-serif', fontSize: 18, fontWeight: 800,
                  marginBottom: 8, lineHeight: 1.3,
                }}>{event.title}</h3>

                <p style={{
                  fontSize: 13, color: 'var(--muted)', marginBottom: 16,
                  lineHeight: 1.7, fontFamily: 'Tajawal, sans-serif',
                }}>
                  {event.description?.slice(0, 80)}{event.description?.length > 80 ? '...' : ''}
                </p>

                {/* Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--muted)' }}>
                    <Calendar size={13} color="#7c6dff" />
                    {new Date(event.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--muted)' }}>
                    <MapPin size={13} color="#ff6b6b" />
                    {event.location}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--muted)' }}>
                      <Users size={13} color="#00d9a6" />
                      {event.soldTickets} / {event.totalTickets} sold
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 900, color: '#00d9a6', fontFamily: 'Tajawal, sans-serif' }}>
                      {event.ticketPrice} EGP
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div style={{ background: 'var(--border)', borderRadius: 4, height: 4, marginTop: 16, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 4,
                    width: `${(event.soldTickets / event.totalTickets) * 100}%`,
                    background: 'linear-gradient(90deg, #7c6dff, #00d9a6)',
                  }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
