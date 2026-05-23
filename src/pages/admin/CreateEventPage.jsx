import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { ArrowRight, Calendar, MapPin, DollarSign, Users, FileText } from 'lucide-react';

export default function CreateEventPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    ticketPrice: '',
    totalTickets: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!form.title || form.title.trim().length < 3)
      newErrors.title = 'Title must be at least 3 characters';
    if (!form.description || form.description.trim().length < 10)
      newErrors.description = 'Description must be at least 10 characters';
    if (!form.date)
      newErrors.date = 'Date is required';
    if (!form.location)
      newErrors.location = 'Location is required';
    if (!form.ticketPrice || Number(form.ticketPrice) <= 0)
      newErrors.ticketPrice = 'Ticket price must be greater than 0';
    if (!form.totalTickets || Number(form.totalTickets) <= 0)
      newErrors.totalTickets = 'Total tickets must be greater than 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await api.post('/events', {
        ...form,
        ticketPrice: Number(form.ticketPrice),
        totalTickets: Number(form.totalTickets),
      });
      toast.success('✅ Event created successfully!');
      navigate('/admin/reports');
    } catch (err) {
      if (err.response?.data?.errors) {
        err.response.data.errors.forEach(e => toast.error(e));
      } else {
        toast.error('Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field) => ({
    width: '100%', padding: '12px 16px',
    background: 'var(--surface)',
    border: `1px solid ${errors[field] ? '#ff6b6b' : 'var(--border)'}`,
    borderRadius: 10, color: 'var(--text)', fontSize: 14, outline: 'none',
    transition: 'border-color 0.2s', fontFamily: 'Tajawal, sans-serif',
  });

  const labelStyle = {
    fontSize: 12, color: 'var(--muted)', fontWeight: 700,
    letterSpacing: 0.5, display: 'block', marginBottom: 6,
    fontFamily: 'Tajawal, sans-serif',
  };

  const errorStyle = {
    fontSize: 11, color: '#ff6b6b', marginTop: 5,
    fontFamily: 'Tajawal, sans-serif',
  };

  return (
    <div style={{ minHeight: '100vh', padding: '90px 24px 80px' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>

        {/* Back */}
        <button
          onClick={() => navigate('/admin/reports')}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32,
            background: 'none', border: 'none', color: 'var(--muted)', fontSize: 14,
            transition: 'color 0.2s', fontFamily: 'Tajawal, sans-serif', cursor: 'pointer',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
        >
          <ArrowRight size={16} /> العودة للـ Dashboard
        </button>

        {/* Card */}
        <div className="page-enter" style={{
          background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: 20, padding: 36, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, #7c6dff, #ff6b6b)',
          }} />

          <h1 style={{
            fontFamily: 'Tajawal, sans-serif', fontSize: 24, fontWeight: 800, marginBottom: 8,
          }}>🎉 Create New Event</h1>
          <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 32, fontFamily: 'Tajawal, sans-serif' }}>
            Fill in the details below to create a new event
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Title */}
            <div>
              <label style={labelStyle}>
                <FileText size={12} style={{ marginLeft: 6 }} />
                Event Title
              </label>
              <input
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Cairo Tech Summit 2026"
                style={inputStyle('title')}
                onFocus={e => e.target.style.borderColor = 'rgba(124,109,255,0.5)'}
                onBlur={e => e.target.style.borderColor = errors.title ? '#ff6b6b' : 'var(--border)'}
              />
              {errors.title && <div style={errorStyle}>⚠️ {errors.title}</div>}
            </div>

            {/* Description */}
            <div>
              <label style={labelStyle}>Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Describe the event..."
                rows={4}
                style={{
                  ...inputStyle('description'),
                  resize: 'vertical', lineHeight: 1.7,
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(124,109,255,0.5)'}
                onBlur={e => e.target.style.borderColor = errors.description ? '#ff6b6b' : 'var(--border)'}
              />
              {errors.description && <div style={errorStyle}>⚠️ {errors.description}</div>}
            </div>

            {/* Date */}
            <div>
              <label style={labelStyle}>
                <Calendar size={12} style={{ marginLeft: 6 }} />
                Event Date & Time
              </label>
              <input
                type="datetime-local"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                style={{ ...inputStyle('date'), colorScheme: 'dark' }}
                onFocus={e => e.target.style.borderColor = 'rgba(124,109,255,0.5)'}
                onBlur={e => e.target.style.borderColor = errors.date ? '#ff6b6b' : 'var(--border)'}
              />
              {errors.date && <div style={errorStyle}>⚠️ {errors.date}</div>}
            </div>

            {/* Location */}
            <div>
              <label style={labelStyle}>
                <MapPin size={12} style={{ marginLeft: 6 }} />
                Location
              </label>
              <input
                value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })}
                placeholder="e.g. القاهرة، مصر"
                style={inputStyle('location')}
                onFocus={e => e.target.style.borderColor = 'rgba(124,109,255,0.5)'}
                onBlur={e => e.target.style.borderColor = errors.location ? '#ff6b6b' : 'var(--border)'}
              />
              {errors.location && <div style={errorStyle}>⚠️ {errors.location}</div>}
            </div>

            {/* Price & Tickets */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>
                  <DollarSign size={12} style={{ marginLeft: 6 }} />
                  Ticket Price (EGP)
                </label>
                <input
                  type="number" min="0"
                  value={form.ticketPrice}
                  onChange={e => setForm({ ...form, ticketPrice: e.target.value })}
                  placeholder="e.g. 299"
                  style={{ ...inputStyle('ticketPrice'), direction: 'ltr' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(124,109,255,0.5)'}
                  onBlur={e => e.target.style.borderColor = errors.ticketPrice ? '#ff6b6b' : 'var(--border)'}
                />
                {errors.ticketPrice && <div style={errorStyle}>⚠️ {errors.ticketPrice}</div>}
              </div>

              <div>
                <label style={labelStyle}>
                  <Users size={12} style={{ marginLeft: 6 }} />
                  Total Tickets
                </label>
                <input
                  type="number" min="1"
                  value={form.totalTickets}
                  onChange={e => setForm({ ...form, totalTickets: e.target.value })}
                  placeholder="e.g. 200"
                  style={{ ...inputStyle('totalTickets'), direction: 'ltr' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(124,109,255,0.5)'}
                  onBlur={e => e.target.style.borderColor = errors.totalTickets ? '#ff6b6b' : 'var(--border)'}
                />
                {errors.totalTickets && <div style={errorStyle}>⚠️ {errors.totalTickets}</div>}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              style={{
                padding: '14px', marginTop: 8,
                background: loading ? 'var(--border)' : 'linear-gradient(135deg, #7c6dff, #9f94ff)',
                border: 'none', borderRadius: 12, color: 'white',
                fontSize: 16, fontWeight: 700, fontFamily: 'Tajawal, sans-serif',
                transition: 'all 0.2s', opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? '⏳ Creating...' : '🎉 Create Event'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
