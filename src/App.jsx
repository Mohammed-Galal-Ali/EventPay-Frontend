import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import EventPage from './pages/EventPage';
import './index.css';
import LoginPage from './pages/admin/LoginPage';
import ReportsPage from './pages/admin/ReportsPage';
import CreateEventPage from './pages/admin/CreateEventPage';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#13131f',
            color: '#eeeeff',
            border: '1px solid #1e1e32',
            fontFamily: 'Cairo, sans-serif',
            fontSize: 14,
          },
          success: { iconTheme: { primary: '#00d9a6', secondary: '#13131f' } },
          error: { iconTheme: { primary: '#ff6b6b', secondary: '#13131f' } },
        }}
      />
      <Navbar />
      <Routes>
         <Route path="/" element={<HomePage />} />
  <Route path="/event/:id" element={<EventPage />} />
  <Route path="/admin/login" element={<LoginPage />} />
  <Route path="/admin/reports" element={<ReportsPage />} />
  <Route path="/admin/create-event" element={<CreateEventPage />} />

      </Routes>
    </BrowserRouter>
  );
}
