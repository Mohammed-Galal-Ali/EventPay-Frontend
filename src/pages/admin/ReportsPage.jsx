import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { LogOut, Download, FileText, Users, DollarSign, TrendingUp } from 'lucide-react';

export default function ReportsPage() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({ total: 0, paid: 0, pending: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;

  // جيب الـ stats مرة واحدة من كل التذاكر
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/admin/login'); return; }

    api.get('/reports/tickets?page=1&pageSize=1000')
      .then(r => {
        const all = r.data.data;
        setStats({
          total: r.data.totalCount,
          paid: all.filter(t => t.status === 'Paid').length,
          pending: all.filter(t => t.status === 'Pending').length,
          revenue: all.filter(t => t.status === 'Paid').reduce((s, t) => s + t.pricePaid, 0),
        });
      })
      .catch(() => {
        toast.error('Session expired');
        localStorage.removeItem('token');
        navigate('/admin/login');
      });
  }, [navigate]);

  // جيب الـ tickets بالـ pagination والـ filter
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoading(true);
    api.get(`/reports/tickets?page=${currentPage}&pageSize=${itemsPerPage}&status=${filter}`)
      .then(r => {
        setTickets(r.data.data);
        setTotalPages(r.data.totalPages);
        setTotalCount(r.data.totalCount);
      })
      .catch(() => {
        toast.error('Failed to load tickets');
      })
      .finally(() => setLoading(false));
  }, [currentPage, filter, navigate]);

  const handleFilter = (f) => {
    setFilter(f);
    setCurrentPage(1);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  const handleDownload = async (type) => {
    try {
      const response = await api.get(`/reports/tickets/${type}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = type === 'excel' ? 'tickets.xlsx' : 'tickets.pdf';
      link.click();
      toast.success(`${type.toUpperCase()} downloaded!`);
    } catch {
      toast.error('Download failed');
    }
  };

  const statusColor = (status) => {
    if (status === 'Paid') return { bg: 'rgba(0,217,166,0.1)', color: '#00d9a6', border: 'rgba(0,217,166,0.2)' };
    if (status === 'Pending') return { bg: 'rgba(255,184,77,0.1)', color: '#ffb84d', border: 'rgba(255,184,77,0.2)' };
    return { bg: 'rgba(255,107,107,0.1)', color: '#ff6b6b', border: 'rgba(255,107,107,0.2)' };
  };

  return (
    <div style={{ minHeight: '100vh', padding: '90px 24px 80px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: 28, fontWeight: 800, marginBottom: 4 }}>
              📊 Admin Reports
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: 13, fontFamily: 'Tajawal, sans-serif' }}>
              EventPay Dashboard
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => navigate('/admin/events')} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 18px', borderRadius: 10,
              background: 'rgba(124,109,255,0.1)', border: '1px solid rgba(124,109,255,0.3)',
              color: '#7c6dff', fontSize: 13, fontWeight: 700,
              fontFamily: 'Tajawal, sans-serif', cursor: 'pointer',
            }}>
              🎯Mange Events
            </button>
<button onClick={() => navigate('/admin/analytics')} style={{
  display: 'flex', alignItems: 'center', gap: 8,
  padding: '10px 18px', borderRadius: 10,
  background: 'rgba(0,217,166,0.1)', border: '1px solid rgba(0,217,166,0.2)',
  color: '#00d9a6', fontSize: 13, fontWeight: 700,
  fontFamily: 'Tajawal, sans-serif', cursor: 'pointer',
}}>
  📈 Analytics
</button>

            <button onClick={() => handleDownload('excel')} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 18px', borderRadius: 10,
              background: 'rgba(0,217,166,0.1)', border: '1px solid rgba(0,217,166,0.2)',
              color: '#00d9a6', fontSize: 13, fontWeight: 700,
              fontFamily: 'Tajawal, sans-serif', cursor: 'pointer',
            }}>
              <Download size={14} /> Excel
            </button>

            <button onClick={() => handleDownload('pdf')} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 18px', borderRadius: 10,
              background: 'rgba(124,109,255,0.1)', border: '1px solid rgba(124,109,255,0.2)',
              color: '#7c6dff', fontSize: 13, fontWeight: 700,
              fontFamily: 'Tajawal, sans-serif', cursor: 'pointer',
            }}>
              <FileText size={14} /> PDF
            </button>

            <button onClick={handleLogout} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 18px', borderRadius: 10,
              background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.2)',
              color: '#ff6b6b', fontSize: 13, fontWeight: 700,
              fontFamily: 'Tajawal, sans-serif', cursor: 'pointer',
            }}>
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { icon: <Users size={20} color="#7c6dff" />, label: 'Total Tickets', value: stats.total, color: '#7c6dff' },
            { icon: <TrendingUp size={20} color="#00d9a6" />, label: 'Paid', value: stats.paid, color: '#00d9a6' },
            { icon: <FileText size={20} color="#ffb84d" />, label: 'Pending', value: stats.pending, color: '#ffb84d' },
            { icon: <DollarSign size={20} color="#ff6b6b" />, label: 'Total Revenue', value: `${stats.revenue} EGP`, color: '#ff6b6b' },
          ].map((stat, i) => (
            <div key={i} style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: 16, padding: '20px 24px',
              display: 'flex', alignItems: 'center', gap: 16,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: `${stat.color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>{stat.icon}</div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700, marginBottom: 4 }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: 22, fontWeight: 900, color: stat.color, fontFamily: 'Tajawal, sans-serif' }}>
                  {stat.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {[
            { label: `All (${stats.total})`, value: 'All' },
            { label: `Paid (${stats.paid})`, value: 'Paid' },
            { label: `Pending (${stats.pending})`, value: 'Pending' },
            { label: 'Cancelled', value: 'Cancelled' },
          ].map(f => (
            <button key={f.value} onClick={() => handleFilter(f.value)} style={{
              padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700,
              fontFamily: 'Tajawal, sans-serif', cursor: 'pointer',
              background: filter === f.value ? 'rgba(124,109,255,0.15)' : 'transparent',
              color: filter === f.value ? '#7c6dff' : 'var(--muted)',
              border: '1px solid', borderColor: filter === f.value ? 'rgba(124,109,255,0.3)' : 'transparent',
              transition: 'all 0.2s',
            }}>{f.label}</button>
          ))}
        </div>

        {/* Table */}
        <div style={{
          background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: 16, overflow: 'hidden',
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--surface)' }}>
                  {['#', 'الاسم', 'الإيميل', 'الهاتف', 'الفعالية', 'المبلغ', 'الحالة', 'التاريخ'].map((h, i) => (
                    <th key={i} style={{
                      padding: '14px 16px', textAlign: 'right',
                      fontSize: 11, fontWeight: 700, color: 'var(--muted)',
                      letterSpacing: 0.5, fontFamily: 'Tajawal, sans-serif',
                      borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                      {Array.from({ length: 8 }).map((_, j) => (
                        <td key={j} style={{ padding: '14px 16px' }}>
                          <div style={{
                            height: 12, borderRadius: 6,
                            background: 'linear-gradient(90deg, var(--border) 25%, var(--surface) 50%, var(--border) 75%)',
                            backgroundSize: '200% 100%',
                            animation: 'shimmer 1.5s infinite',
                            width: j === 0 ? '30px' : j === 6 ? '60px' : '80%',
                          }} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : tickets.map((ticket) => {
                  const sc = statusColor(ticket.status);
                  return (
                    <tr key={ticket.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,109,255,0.03)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--muted)', fontFamily: 'Tajawal, sans-serif' }}>#{ticket.id}</td>
                      <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, fontFamily: 'Tajawal, sans-serif', whiteSpace: 'nowrap' }}>{ticket.buyerName}</td>
                      <td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--muted)', direction: 'ltr', whiteSpace: 'nowrap' }}>{ticket.buyerEmail}</td>
                      <td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--muted)', direction: 'ltr', whiteSpace: 'nowrap' }}>{ticket.buyerPhone}</td>
                      <td style={{ padding: '14px 16px', fontSize: 12, fontFamily: 'Tajawal, sans-serif', whiteSpace: 'nowrap' }}>{ticket.eventTitle}</td>
                      <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 700, color: '#00d9a6', fontFamily: 'Tajawal, sans-serif', whiteSpace: 'nowrap' }}>{ticket.pricePaid} EGP</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700,
                          background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
                          fontFamily: 'Tajawal, sans-serif',
                        }}>{ticket.status}</span>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                        {new Date(ticket.createdAt).toLocaleDateString('ar-EG')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {!loading && tickets.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--muted)', fontFamily: 'Tajawal, sans-serif' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🎫</div>
              No tickets found
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '16px 20px', borderTop: '1px solid var(--border)',
            }}>
              <span style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
                صفحة {currentPage} من {totalPages} — {totalCount} نتيجة
              </span>

              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  style={{
                    padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                    background: currentPage === 1 ? 'transparent' : 'rgba(124,109,255,0.1)',
                    border: '1px solid', borderColor: currentPage === 1 ? 'var(--border)' : 'rgba(124,109,255,0.3)',
                    color: currentPage === 1 ? 'var(--muted)' : '#7c6dff',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    fontFamily: 'Tajawal, sans-serif',
                  }}
                >← السابق</button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button key={page} onClick={() => setCurrentPage(page)} style={{
                    width: 34, height: 34, borderRadius: 8, fontSize: 13, fontWeight: 700,
                    background: currentPage === page ? 'linear-gradient(135deg, #7c6dff, #9f94ff)' : 'transparent',
                    border: '1px solid', borderColor: currentPage === page ? 'transparent' : 'var(--border)',
                    color: currentPage === page ? 'white' : 'var(--muted)',
                    cursor: 'pointer', fontFamily: 'Tajawal, sans-serif',
                  }}>{page}</button>
                ))}

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                    background: currentPage === totalPages ? 'transparent' : 'rgba(124,109,255,0.1)',
                    border: '1px solid', borderColor: currentPage === totalPages ? 'var(--border)' : 'rgba(124,109,255,0.3)',
                    color: currentPage === totalPages ? 'var(--muted)' : '#7c6dff',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    fontFamily: 'Tajawal, sans-serif',
                  }}
                >التالي →</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
