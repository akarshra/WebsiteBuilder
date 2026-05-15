# AI Website Builder

A full-stack, AI-powered website builder platform that generates production-ready, fully responsive, multi-page HTML/CSS websites purely from text prompts. 

Built with the MERN stack (MongoDB, Express, React, Node.js) and integrated with the OpenRouter API (Gemini 2.5 Flash) to translate natural language into semantic code. Features built-in hosting, monetization, version control, and real-time live preview.

## ✨ Features

- **AI Generation Engine:** Enter a prompt and get a fully functional, responsive website in seconds.
- **Live Code Editor:** Real-time dual-pane editor powered by Monaco Editor to tweak the generated code on the fly.
- **Version Control:** History panel to track and restore previous iterations of the website code.
- **Live Deployment:** Instantly deploy generated websites to a public `.site/` URL.
- **Monetization & Credits:** Stripe integration for billing and credit management. Users spend credits to generate or update websites.
- **Asset Management:** Cloudinary integration for seamless image uploading directly into the editor.
- **Instant Theming:** One-click color palette switching.
- **CI/CD Ready:** Automated GitHub Actions pipeline configured for testing, linting, and building.

---

## 🛠 Tech Stack

- **Frontend:** React 19, Vite, TailwindCSS v4, Redux Toolkit, Framer Motion
- **Backend:** Node.js, Express, Mongoose (MongoDB)
- **AI Integration:** OpenRouter (Gemini models)
- **Payments:** Stripe
- **Storage/Assets:** Cloudinary & Firebase

---

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas cluster)
- An [OpenRouter](https://openrouter.ai/) API Key
- A [Stripe](https://stripe.com/) Developer Account
- A [Cloudinary](https://cloudinary.com/) Account
- A [Firebase](https://firebase.google.com/) Project

### 1. Clone the repository
```bash
git clone https://github.com/your-username/website-builder.git
cd website-builder
```

### 2. Install Dependencies
Install packages for both the client and server.
```bash
# In the root directory (or open two terminals)
cd client && npm install
cd ../server && npm install
```

### 3. Environment Variables
Create a `.env` file in both the `client` and `server` directories based on the provided `.env.example` files.

**Server (`server/.env`):**
```env
PORT=8000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENROUTER_API_KEY=your_openrouter_api_key
FRONTEND_URL=http://localhost:5173
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

**Client (`client/.env`):**
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload_preset
VITE_API_URL=http://localhost:8000
```

### 4. Run the Development Servers
Start both servers simultaneously to use the application.

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## 📦 Deployment

This project is configured for a **PaaS (Platform as a Service)** deployment model.

### Frontend Deployment (Vercel / Netlify)
1. Import your GitHub repository into Vercel.
2. Select the `client` directory as the Root Directory.
3. Configure the environment variables found in `client/.env.example`.
4. Deploy.

### Backend Deployment (Render / Railway)
1. Create a new Web Service and connect the repository.
2. Select the `server` directory as the Root Directory.
3. Set Build Command to `npm install` and Start Command to `npm start`.
4. Configure the environment variables found in `server/.env.example` (make sure `FRONTEND_URL` points to your newly deployed Vercel URL).
5. Deploy.

### Continuous Integration
A GitHub Action (`.github/workflows/ci.yml`) is automatically configured to lint and build the application upon every push and pull request to the `main` branch.

---

## 📄 License
This project is licensed under the MIT License.
