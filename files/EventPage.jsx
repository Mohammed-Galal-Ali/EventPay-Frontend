import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../api/axios';
import { MapPin, Calendar, Users, ArrowRight, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

const stripePromise = loadStripe('pk_test_51TZURVFBXqlaQzKNRgm9S651oS3gl4jfJGJ3UH0iYU9enZ8CV1EVtRDfk8MugfFyI8acVxwG7SqM6eOFR8PpTNZu00OM2yzzV7');

function CheckoutForm({ event, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ buyerName: '', buyerEmail: '', buyerPhone: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      // Step 1: عمل PaymentIntent
      const { data } = await api.post('/payment', {
        eventId: event.id,
        ...form,
      });

      // Step 2: تأكيد الدفع
      const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (error) {
        toast.error(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        toast.success('🎉 تم الدفع بنجاح! هيوصلك تأكيد على إيميلك');
        onSuccess();
      }
    } catch (err) {
      toast.error('حصل خطأ، حاول تاني');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px',
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 10, color: 'var(--text)', fontSize: 14, outline: 'none',
    transition: 'border-color 0.2s',
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <label style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 700, letterSpacing: 1, display: 'block', marginBottom: 6 }}>
          الاسم الكامل
        </label>
        <input
          required value={form.buyerName}
          onChange={e => setForm({ ...form, buyerName: e.target.value })}
          placeholder="Mohamed Galal"
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = 'rgba(124,109,255,0.5)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
      </div>

      <div>
        <label style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 700, letterSpacing: 1, display: 'block', marginBottom: 6 }}>
          البريد الإلكتروني
        </label>
        <input
          required type="email" value={form.buyerEmail}
          onChange={e => setForm({ ...form, buyerEmail: e.target.value })}
          placeholder="email@example.com"
          style={{ ...inputStyle, direction: 'ltr' }}
          onFocus={e => e.target.style.borderColor = 'rgba(124,109,255,0.5)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
      </div>

      <div>
        <label style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 700, letterSpacing: 1, display: 'block', marginBottom: 6 }}>
          رقم الهاتف
        </label>
        <input
          required value={form.buyerPhone}
          onChange={e => setForm({ ...form, buyerPhone: e.target.value })}
          placeholder="+201xxxxxxxxx"
          style={{ ...inputStyle, direction: 'ltr' }}
          onFocus={e => e.target.style.borderColor = 'rgba(124,109,255,0.5)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
      </div>

      <div>
        <label style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 700, letterSpacing: 1, display: 'block', marginBottom: 6 }}>
          بيانات الكارت
        </label>
        <div style={{
          padding: '14px 16px', background: 'var(--surface)',
          border: '1px solid var(--border)', borderRadius: 10,
        }}>
          <CardElement options={{
            style: {
              base: {
                color: '#eeeeff', fontSize: '14px',
                fontFamily: 'Cairo, sans-serif',
                '::placeholder': { color: '#5a5a7a' },
              },
            },
          }} />
        </div>
      </div>

      {/* Test card hint */}
      <div style={{
        background: 'rgba(0,217,166,0.06)', border: '1px solid rgba(0,217,166,0.15)',
        borderRadius: 10, padding: '10px 14px', fontSize: 12, color: '#00d9a6',
        direction: 'ltr',
      }}>
        💳 Test: 4242 4242 4242 4242 | 12/29 | 123
      </div>

      <button
        type="submit" disabled={loading || !stripe}
        style={{
          padding: '14px', marginTop: 4,
          background: loading ? 'var(--border)' : 'linear-gradient(135deg, #7c6dff, #9f94ff)',
          border: 'none', borderRadius: 12, color: 'white',
          fontSize: 16, fontWeight: 700,
          transition: 'all 0.2s', opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? '⏳ جاري الدفع...' : `💳 ادفع ${event.ticketPrice} جنيه`}
      </button>
    </form>
  );
}

export default function EventPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api.get(`/events/${id}`)
      .then(r => setEvent(r.data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{
        width: 40, height: 40, border: '3px solid var(--border)',
        borderTopColor: '#7c6dff', borderRadius: '50%', animation: 'spin 0.7s linear infinite',
      }} />
    </div>
  );

  if (!event) return null;

  return (
    <div style={{ minHeight: '100vh', paddingTop: 80 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Back */}
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32,
            background: 'none', border: 'none', color: 'var(--muted)', fontSize: 14,
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
        >
          <ArrowRight size={16} /> العودة للفعاليات
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 32, alignItems: 'start' }}>

          {/* Left — Event Info */}
          <div className="page-enter">
            <div style={{
              background: 'rgba(124,109,255,0.08)', border: '1px solid rgba(124,109,255,0.2)',
              borderRadius: 8, padding: '4px 12px', display: 'inline-block',
              fontSize: 11, fontWeight: 700, color: '#7c6dff', letterSpacing: 1, marginBottom: 20,
            }}>🎯 FEATURED EVENT</div>

            <h1 style={{
              fontFamily: 'Syne, sans-serif', fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 800, lineHeight: 1.2, marginBottom: 16,
            }}>{event.title}</h1>

            <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.9, marginBottom: 32 }}>
              {event.description}
            </p>

            {/* Details */}
            <div style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24,
            }}>
              {[
                { icon: <Calendar size={16} color="#7c6dff" />, label: 'التاريخ', value: new Date(event.date).toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) },
                { icon: <MapPin size={16} color="#ff6b6b" />, label: 'المكان', value: event.location },
                { icon: <Users size={16} color="#00d9a6" />, label: 'التذاكر', value: `${event.availableTickets} متاحة من ${event.totalTickets}` },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 36, height: 36, background: 'var(--surface)',
                    borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>{item.icon}</div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700, letterSpacing: 0.5 }}>{item.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Map Link */}
            {event.mapLink && (
              <a href={event.mapLink} target="_blank" rel="noopener noreferrer" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '10px 18px', borderRadius: 10,
                background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.2)',
                color: '#ff6b6b', fontSize: 13, fontWeight: 600,
                transition: 'all 0.2s',
              }}>
                <MapPin size={14} /> عرض على الخريطة <ExternalLink size={12} />
              </a>
            )}
          </div>

          {/* Right — Payment Form */}
          <div className="page-enter" style={{ animationDelay: '0.1s' }}>
            <div style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: 20, padding: 28, position: 'sticky', top: 100,
              overflow: 'hidden',
            }}>
              {/* Top accent */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                background: 'linear-gradient(90deg, #7c6dff, #ff6b6b)',
              }} />

              {success ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
                  <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 800, marginBottom: 8 }}>
                    تم الحجز بنجاح!
                  </h3>
                  <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>
                    هيوصلك تأكيد على إيميلك وواتساب
                  </p>
                  <button onClick={() => navigate('/')} style={{
                    padding: '12px 24px', background: 'linear-gradient(135deg, #7c6dff, #9f94ff)',
                    border: 'none', borderRadius: 12, color: 'white', fontSize: 14, fontWeight: 700,
                  }}>
                    العودة للفعاليات
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: 24 }}>
                    <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 800, marginBottom: 4 }}>
                      احجز تذكرتك
                    </h2>
                    <p style={{ fontSize: 13, color: 'var(--muted)' }}>ادفع بأمان عن طريق Stripe</p>
                  </div>

                  {/* Price */}
                  <div style={{
                    background: 'rgba(0,217,166,0.06)', border: '1px solid rgba(0,217,166,0.15)',
                    borderRadius: 12, padding: '14px 16px', marginBottom: 24,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <span style={{ fontSize: 13, color: 'var(--muted)' }}>سعر التذكرة</span>
                    <span style={{ fontSize: 22, fontWeight: 900, color: '#00d9a6', fontFamily: 'Syne, sans-serif' }}>
                      {event.ticketPrice} جنيه
                    </span>
                  </div>

                  <Elements stripe={stripePromise}>
                    <CheckoutForm event={event} onSuccess={() => setSuccess(true)} />
                  </Elements>

                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: 6, marginTop: 16, color: 'var(--muted)', fontSize: 11,
                  }}>
                    🔒 مدفوعات آمنة بواسطة Stripe
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
