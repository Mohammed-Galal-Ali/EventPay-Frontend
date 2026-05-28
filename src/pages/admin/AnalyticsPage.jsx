import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  BarChart, Bar,
} from 'recharts';
import { TrendingUp, ArrowRight } from 'lucide-react';

const COLORS = ['#00d9a6', '#ffb84d', '#ff6b6b'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: 10, padding: '10px 14px', fontSize: 13,
        fontFamily: 'Tajawal, sans-serif',
      }}>
        <p style={{ color: 'var(--muted)', marginBottom: 4 }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color, fontWeight: 700 }}>
            {p.value} {p.name === 'sales' ? 'EGP' : ''}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/admin/login'); return; }

    api.get('/reports/analytics')
      .then(r => setAnalytics(r.data))
      .catch(() => toast.error('Failed to load analytics'))
      .finally(() => setLoading(false));
  }, [navigate]);

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 36 }}>
          <div>
            <h1 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: 28, fontWeight: 800, marginBottom: 4 }}>
              📈 Analytics
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: 13, fontFamily: 'Tajawal, sans-serif' }}>
              EventPay Dashboard
            </p>
          </div>

          <button onClick={() => navigate('/admin/reports')} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 18px', borderRadius: 10,
            background: 'transparent', border: '1px solid var(--border)',
            color: 'var(--muted)', fontSize: 13, fontWeight: 700,
            fontFamily: 'Tajawal, sans-serif', cursor: 'pointer',
          }}>
            <ArrowRight size={14} /> Reports
          </button>
        </div>

        {/* Line Chart — المبيعات آخر 7 أيام */}
        <div style={{
          background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: 20, padding: 28, marginBottom: 24,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'rgba(124,109,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <TrendingUp size={16} color="#7c6dff" />
            </div>
            <div>
              <h2 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: 16, fontWeight: 800 }}>
                المبيعات — آخر 7 أيام
              </h2>
              <p style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'Tajawal, sans-serif' }}>
                إجمالي الإيرادات بالجنيه
              </p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={analytics?.salesLast7Days || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: '#5a5a7a', fontSize: 12 }} />
              <YAxis tick={{ fill: '#5a5a7a', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone" dataKey="sales" name="sales"
                stroke="#7c6dff" strokeWidth={3}
                dot={{ fill: '#7c6dff', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, fill: '#9f94ff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Row — Pie + Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

          {/* Pie Chart — حالة التذاكر */}
          <div style={{
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: 20, padding: 28,
          }}>
            <h2 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: 16, fontWeight: 800, marginBottom: 24 }}>
              🥧 حالة التذاكر
            </h2>

            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={analytics?.statusBreakdown || []}
                  cx="50%" cy="50%"
                  innerRadius={55} outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {(analytics?.statusBreakdown || []).map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'var(--card)', border: '1px solid var(--border)',
                    borderRadius: 10, fontFamily: 'Tajawal, sans-serif',
                  }}
                />
                <Legend
                  formatter={(value) => (
                    <span style={{ color: 'var(--muted)', fontSize: 12, fontFamily: 'Tajawal, sans-serif' }}>
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart — أكتر Events */}
          <div style={{
            background: 'var(--card)', border: '1px solid var(--border)',
            borderRadius: 20, padding: 28,
          }}>
            <h2 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: 16, fontWeight: 800, marginBottom: 24 }}>
              🏆 أكتر Events مبيعاً
            </h2>

            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={analytics?.topEvents || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#5a5a7a', fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fill: '#5a5a7a', fontSize: 11 }} width={80} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--card)', border: '1px solid var(--border)',
                    borderRadius: 10, fontFamily: 'Tajawal, sans-serif',
                  }}
                />
                <Bar dataKey="tickets" name="Tickets" fill="#7c6dff" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
