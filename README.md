<div align="center">

# 🎟️ EventPay

### Full-Stack Event Ticketing & Payment Platform

![.NET](https://img.shields.io/badge/.NET-10.0-purple?style=for-the-badge&logo=dotnet)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Stripe](https://img.shields.io/badge/Stripe-Payment-green?style=for-the-badge&logo=stripe)
![SQL Server](https://img.shields.io/badge/SQL_Server-Database-red?style=for-the-badge&logo=microsoftsqlserver)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge&logo=vercel)

**🌍 Live Demo → [event-pay-frontend-rouge.vercel.app](https://event-pay-frontend-rouge.vercel.app)**

</div>

---

## 📌 About

EventPay is a production-ready event ticketing platform built with **.NET 10 Web API** and **React 18**.

Users can browse events, purchase tickets securely via Stripe, and receive instant confirmations on WhatsApp, Email, and Telegram. Admins get a full dashboard with analytics, reports, and event management.

---

## ✨ Features

### 💳 Payments (Stripe)
- Webhook-based payment confirmation — server never trusts the client
- PaymentIntent flow with client secret
- Real-time ticket status update after Stripe confirms payment
- Automatic notifications triggered by webhook

### 📩 Notifications (Multi-Channel)
- **Email** confirmation via SendGrid
- **WhatsApp** confirmation via Twilio Sandbox
- **Telegram** Bot notifications
- **OTP** verification via Email — only the real owner can view their tickets

### 🎫 My Tickets (OTP Protected)
- User enters their email
- OTP sent to their email for verification
- Verified user sees all their tickets with event details + map link

### 🗺️ Maps (OpenStreetMap)
- Auto-geocoding of event location on creation
- Google Maps deep link for every event
- Distance calculation using Haversine Formula

### 📊 Admin Dashboard (JWT Protected)
- Secure login with JWT Bearer tokens
- Tickets table with server-side pagination & filtering
- Export to **Excel** (ClosedXML) + **PDF** (QuestPDF)
- Analytics → Line Chart (sales last 7 days) + Pie Chart (ticket status) + Bar Chart (top events)
- Full event management → Create & Delete events

### 🛡️ Validation & Security
- FluentValidation on all API endpoints
- Egyptian phone number format validation (01x)
- Frontend validation with inline error messages
- JWT-protected admin routes
- CORS configured for production

---

## 🏗️ Architecture

```
EventPay.API/
├── Controllers/
│   ├── AuthController         → JWT Login
│   ├── EventsController       → CRUD Events
│   ├── PaymentController      → Stripe + Webhook
│   ├── TicketsController      → My Tickets + OTP
│   ├── NotificationsController→ Email, WhatsApp, Telegram, OTP
│   ├── ReportsController      → Analytics, Excel, PDF
│   └── MapsController         → Geocoding, Distance
├── Services/
│   ├── Auth/                  → JWT Generation
│   ├── Events/                → Event Logic
│   ├── Payments/              → Stripe Integration
│   ├── Messaging/             → Email, WhatsApp, Telegram, OTP
│   ├── Maps/                  → OpenStreetMap + Haversine
│   ├── Reports/               → Excel, PDF, Analytics
│   └── Tickets/               → Ticket Queries
├── Models/                    → DB Entities
├── DTOs/                      → Request/Response Shapes
├── Validators/                → FluentValidation Rules
└── Data/                      → EF Core DbContext
```

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | .NET 10 Web API |
| Frontend | React 18 |
| Database | SQL Server + EF Core |
| Payment | Stripe |
| Email | SendGrid |
| SMS / WhatsApp | Twilio |
| Telegram | Telegram Bot API |
| Excel Export | ClosedXML |
| PDF Export | QuestPDF |
| Maps | OpenStreetMap (Nominatim) |
| Auth | JWT Bearer |
| Validation | FluentValidation |
| Charts | Recharts |
| Hosting (API) | MonsterASP |
| Hosting (Frontend) | Vercel |

---

## 🚀 Getting Started

### Prerequisites
- .NET 10 SDK
- SQL Server
- Node.js 18+
- Stripe account (test mode)
- SendGrid account
- Twilio account
- Telegram Bot Token

### Backend Setup

```bash
cd EventPay.API
```

Copy `appsettings.Example.json` → `appsettings.json` and fill in your keys:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.;Database=EventPayDB;Trusted_Connection=True;TrustServerCertificate=True"
  },
  "Stripe": {
    "SecretKey": "sk_test_...",
    "WebhookSecret": "whsec_..."
  },
  "SendGrid": {
    "ApiKey": "SG...",
    "FromEmail": "your@email.com"
  },
  "Twilio": {
    "AccountSid": "AC...",
    "AuthToken": "...",
    "FromNumber": "+1...",
    "WhatsAppNumber": "+14155238886"
  },
  "Telegram": {
    "BotToken": "..."
  },
  "Jwt": {
    "Key": "YourSuperSecretKeyThatIsAtLeast32Characters!",
    "Issuer": "EventPay",
    "Audience": "EventPay"
  },
  "Admin": {
    "Username": "admin",
    "Password": "Admin@123"
  }
}
```

```bash
dotnet ef database update
dotnet run
```

### Stripe Webhook (Development only)

```bash
stripe listen --forward-to https://localhost:7057/api/payment/webhook
```

### Frontend Setup

```bash
cd eventpay-frontend
npm install
npm start
```

Update `src/api/axios.js` with your API URL:
```javascript
baseURL: 'https://your-api-url/api'
```

---

## 📱 Pages

| Route | Description | Access |
|---|---|---|
| `/` | Browse all events | Public |
| `/event/:id` | Event details + ticket purchase | Public |
| `/my-tickets` | View tickets via OTP verification | Public |
| `/admin/login` | Admin login | Public |
| `/admin/reports` | Tickets dashboard + export | Admin |
| `/admin/analytics` | Charts & analytics | Admin |
| `/admin/events` | Manage events | Admin |
| `/admin/create-event` | Create new event | Admin |

---

## 📡 Key API Endpoints

```
Auth
POST   /api/auth/login                     → Admin JWT login

Events
GET    /api/events                         → Get all events
GET    /api/events/:id                     → Get event by ID
POST   /api/events                         → Create event [Admin]
DELETE /api/events/:id                     → Delete event [Admin]

Payments
POST   /api/payment                        → Create payment intent
POST   /api/payment/webhook               → Stripe webhook

Tickets
POST   /api/tickets/request-otp           → Send OTP to email
POST   /api/tickets/my-tickets            → Get tickets after OTP verify

Reports [Admin]
GET    /api/reports/tickets               → Paginated tickets
GET    /api/reports/tickets/excel         → Export Excel
GET    /api/reports/tickets/pdf           → Export PDF
GET    /api/reports/analytics             → Charts data

Notifications
POST   /api/notifications/send-email
POST   /api/notifications/send-whatsapp
POST   /api/notifications/send-telegram
POST   /api/notifications/send-otp/telegram
POST   /api/notifications/verify-otp

Maps
GET    /api/maps/geocode?address=...       → Geocode address
GET    /api/maps/distance                  → Calculate distance
```

---

## 🔐 Admin Access

```
URL:      /admin/login
Username: admin
Password: Admin@123
```

---

## 💡 Future Improvements

- SMS support (requires A2P 10DLC registration)
- QR code ticket generation
- Email HTML templates
- Multi-language support (Arabic / English)
- Event categories & advanced search

---

<div align="center">

Built with ❤️ by **Mohamed Galal**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=flat&logo=linkedin)](https://linkedin.com/in/mohammed-galal-ali)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-black?style=flat&logo=github)](https://github.com/Mohammed-Galal-Ali)

</div>
