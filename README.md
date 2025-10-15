# 🚀 Credit Report Processor v2.0

Modern full-stack MERN application for processing XML credit reports from Experian.

## ✨ Features

- **TypeScript** everywhere for type safety
- **Modern UI** with Tailwind CSS v4 & React 19
- **Drag & Drop** file upload
- **Real-time** validation and error handling
- **Dashboard** with statistics
- **Pagination** and filtering
- **Secure** API with rate limiting
- **Production-ready** with proper logging

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI
npm run dev
```
Backend runs on http://localhost:8000

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on http://localhost:5173

## 📁 Tech Stack

**Backend:** TypeScript, Express, MongoDB, Zod, Winston
**Frontend:** React 19, TypeScript, Vite, Tailwind v4, React Query, Zustand

## 🔌 API Endpoints

- `POST /api/v1/reports/upload` - Upload XML
- `GET /api/v1/reports` - List reports (paginated)
- `GET /api/v1/reports/:id` - Get report details
- `DELETE /api/v1/reports/:id` - Delete report
- `GET /api/v1/reports/stats` - Get statistics
- `GET /health` - Health check


## 🔧 Environment Variables

**Backend (.env)**
```
MONGODB_URI=mongodb://localhost:27017/credit-reports
PORT=8000
FRONTEND_URL=http://localhost:5173
```

**Frontend (.env)**
```
VITE_API_URL=http://localhost:8000/api/v1
```

---

Built for CreditSea Assignment | Made with ❤️ using TypeScript
