import { useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Mail, Key,  MapPin, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function MyTicketsPage() {
  const [step, setStep] = useState('email'); // email → otp → tickets
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await api.post('/tickets/request-otp', { recipient: email });
      toast.success('✅ OTP sent to your email!');
      setStep('otp');
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return;

    setLoading(true);
    try {
      const { data } = await api.post('/tickets/my-tickets', {
        email,
        otpCode: otp,
      });
      setTickets(data);
      setStep('tickets');
    } catch (err) {
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error('Invalid or expired OTP');
      }
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = (status) => {
    if (status === 'Paid') return { color: '#00d9a6', bg: 'rgba(0,217,166,0.1)', border: 'rgba(0,217,166,0.2)', icon: <CheckCircle size={14} />, label: 'مدفوع' };
    if (status === 'Pending') return { color: '#ffb84d', bg: 'rgba(255,184,77,0.1)', border: 'rgba(255,184,77,0.2)', icon: <Clock size={14} />, label: 'قيد الانتظار' };
    return { color: '#ff6b6b', bg: 'rgba(255,107,107,0.1)', border: 'rgba(255,107,107,0.2)', icon: <XCircle size={14} />, label: 'ملغي' };
  };

  const inputStyle = {
    width: '100%', padding: '13px 16px',
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 10, color: 'var(--text)', fontSize: 14, outline: 'none',
    transition: 'border-color 0.2s', fontFamily: 'Tajawal, sans-serif',
    direction: 'ltr',
  };

  const labelStyle = {
    fontSize: 12, color: 'var(--muted)', fontWeight: 700,
    letterSpacing: 0.5, display: 'block', marginBottom: 6,
    fontFamily: 'Tajawal, sans-serif',
  };

  return (
    <div style={{ minHeight: '100vh', paddingTop: 80, padding: '100px 24px 80px' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 64, height: 64,
            background: 'linear-gradient(135deg, #7c6dff, #ff6b6b)',
            borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', fontSize: 28,
          }}>🎟️</div>
          <h1 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
            تذاكري
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 14, fontFamily: 'Tajawal, sans-serif' }}>
            ادخل إيميلك عشان تشوف تذاكرك
          </p>
        </div>

        {/* Step Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 40 }}>
          {['email', 'otp', 'tickets'].map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: step === s ? 'linear-gradient(135deg, #7c6dff, #9f94ff)' :
                  ['email', 'otp', 'tickets'].indexOf(step) > i ? 'rgba(0,217,166,0.2)' : 'var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700,
                color: step === s ? 'white' : ['email', 'otp', 'tickets'].indexOf(step) > i ? '#00d9a6' : 'var(--muted)',
                transition: 'all 0.3s',
              }}>
                {['email', 'otp', 'tickets'].indexOf(step) > i ? '✓' : i + 1}
              </div>
              {i < 2 && <div style={{
                width: 40, height: 2,
                background: ['email', 'otp', 'tickets'].indexOf(step) > i ? '#00d9a6' : 'var(--border)',
                transition: 'background 0.3s',
              }} />}
            </div>
          ))}
        </div>

        {/* Step 1 — Email */}
        {step === 'email' && (
          <div className="page-enter" style={{
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: 20, padding: 32, position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 2,
              background: 'linear-gradient(90deg, #7c6dff, #ff6b6b)',
            }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'rgba(124,109,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Mail size={16} color="#7c6dff" />
              </div>
              <div>
                <h2 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: 16, fontWeight: 800 }}>ادخل إيميلك</h2>
                <p style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'Tajawal, sans-serif' }}>هنبعتلك كود تحقق</p>
              </div>
            </div>

            <form onSubmit={handleRequestOtp} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>البريد الإلكتروني</label>
                <input
                  type="email" required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'rgba(124,109,255,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>

              <button type="submit" disabled={loading} style={{
                padding: '13px', borderRadius: 12,
                background: loading ? 'var(--border)' : 'linear-gradient(135deg, #7c6dff, #9f94ff)',
                border: 'none', color: 'white', fontSize: 15, fontWeight: 700,
                fontFamily: 'Tajawal, sans-serif', cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}>
                {loading ? '⏳ جاري الإرسال...' : '📧 ابعتلي الكود'}
              </button>
            </form>
          </div>
        )}

        {/* Step 2 — OTP */}
        {step === 'otp' && (
          <div className="page-enter" style={{
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: 20, padding: 32, position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 2,
              background: 'linear-gradient(90deg, #7c6dff, #ff6b6b)',
            }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'rgba(0,217,166,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Key size={16} color="#00d9a6" />
              </div>
              <div>
                <h2 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: 16, fontWeight: 800 }}>ادخل الكود</h2>
                <p style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'Tajawal, sans-serif' }}>
                  اتبعت على {email}
                </p>
              </div>
            </div>

            <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>كود التحقق</label>
                <input
                  required maxLength={6}
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  style={{ ...inputStyle, fontSize: 24, letterSpacing: 8, textAlign: 'center' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(0,217,166,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>

              <button type="submit" disabled={loading || otp.length !== 6} style={{
                padding: '13px', borderRadius: 12,
                background: loading || otp.length !== 6 ? 'var(--border)' : 'linear-gradient(135deg, #00d9a6, #00b894)',
                border: 'none', color: 'white', fontSize: 15, fontWeight: 700,
                fontFamily: 'Tajawal, sans-serif',
                cursor: loading || otp.length !== 6 ? 'not-allowed' : 'pointer',
                opacity: loading || otp.length !== 6 ? 0.7 : 1,
              }}>
                {loading ? '⏳ جاري التحقق...' : '✅ تحقق وشوف تذاكري'}
              </button>

              <button type="button" onClick={() => setStep('email')} style={{
                padding: '10px', borderRadius: 10, background: 'transparent',
                border: '1px solid var(--border)', color: 'var(--muted)',
                fontSize: 13, fontFamily: 'Tajawal, sans-serif', cursor: 'pointer',
              }}>
                ← رجوع
              </button>
            </form>
          </div>
        )}

        {/* Step 3 — Tickets */}
        {step === 'tickets' && (
          <div className="page-enter">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: 18, fontWeight: 800 }}>
                تذاكرك ({tickets.length})
              </h2>
              <button onClick={() => { setStep('email'); setEmail(''); setOtp(''); setTickets([]); }} style={{
                padding: '7px 14px', borderRadius: 8, background: 'transparent',
                border: '1px solid var(--border)', color: 'var(--muted)',
                fontSize: 12, fontFamily: 'Tajawal, sans-serif', cursor: 'pointer',
              }}>
                بحث جديد
              </button>
            </div>

            {tickets.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '60px 24px',
                background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 20,
              }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🎫</div>
                <p style={{ fontFamily: 'Tajawal, sans-serif', color: 'var(--muted)', fontSize: 15 }}>
                  مفيش تذاكر على الإيميل ده
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {tickets.map(ticket => {
                  const sc = statusConfig(ticket.status);
                  return (
                    <div key={ticket.id} style={{
                      background: 'var(--card)', border: '1px solid var(--border)',
                      borderRadius: 16, padding: 24, position: 'relative', overflow: 'hidden',
                    }}>
                      <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                        background: 'linear-gradient(90deg, #7c6dff, #ff6b6b)',
                      }} />

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                        <div>
                          <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>تذكرة #{ticket.id}</div>
                          <h3 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: 17, fontWeight: 800 }}>
                            {ticket.eventTitle}
                          </h3>
                        </div>
                        <span style={{
                          display: 'flex', alignItems: 'center', gap: 5,
                          padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                          background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
                          fontFamily: 'Tajawal, sans-serif',
                        }}>
                          {sc.icon} {sc.label}
                        </span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--muted)' }}>
                          <Calendar size={14} color="#7c6dff" />
                          <span style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {new Date(ticket.eventDate).toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--muted)' }}>
                          <MapPin size={14} color="#ff6b6b" />
                          <span style={{ fontFamily: 'Tajawal, sans-serif' }}>{ticket.eventLocation}</span>
                        </div>
                      </div>

                      <div style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        paddingTop: 16, borderTop: '1px solid var(--border)',
                      }}>
                        <span style={{ fontSize: 13, color: 'var(--muted)', fontFamily: 'Tajawal, sans-serif' }}>
                          المبلغ المدفوع
                        </span>
                        <span style={{ fontSize: 20, fontWeight: 900, color: '#00d9a6', fontFamily: 'Tajawal, sans-serif' }}>
                          {ticket.pricePaid} جنيه
                        </span>
                      </div>

                      {ticket.eventMapLink && (
                        <a href={ticket.eventMapLink} target="_blank" rel="noopener noreferrer" style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          marginTop: 12, padding: '8px 14px', borderRadius: 8,
                          background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.2)',
                          color: '#ff6b6b', fontSize: 12, fontWeight: 600,
                          fontFamily: 'Tajawal, sans-serif', textDecoration: 'none',
                        }}>
                          <MapPin size={12} /> عرض على الخريطة
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
