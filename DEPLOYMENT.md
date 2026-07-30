# 🚀 Complete Deployment Guide: FasalAI

This guide provides step-by-step instructions for deploying **FasalAI** with the **Frontend on Vercel** and the **Backend on Render**, connected to **MongoDB Atlas**.

---

## 📋 Prerequisites & Architecture Overview

- **Frontend**: Hosted on [Vercel](https://vercel.com) (React + Vite)
- **Backend**: Hosted on [Render](https://render.com) (Node.js + Express)
- **Database**: Hosted on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free Cluster)

```
┌──────────────────────────────────────┐                ┌──────────────────────────────────────┐
│           Vercel Frontend            │                │            Render Backend            │
│  https://fasalai.vercel.app          │ ── (HTTPS) ──► │  https://fasalai-api.onrender.com    │
└──────────────────────────────────────┘                └──────────────────────────────────────┘
                                                                           │
                                                                           ▼
                                                        ┌──────────────────────────────────────┐
                                                        │            MongoDB Atlas             │
                                                        └──────────────────────────────────────┘
```

---

## Step 1: Set Up MongoDB Atlas (Database)

1. Sign in or create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new **M0 Free Cluster**.
3. **Database User Setup**:
   - Go to **Security** -> **Database Access**.
   - Add a new database user (e.g., username `fasaladmin`). Choose a strong password and save it securely.
4. **Network Access (IP Whitelist)**:
   - Go to **Security** -> **Network Access**.
   - Click **Add IP Address** -> Select **Allow Access from Anywhere** (`0.0.0.0/0`).
   - *Reason*: Render servers use dynamic IP addresses.
5. **Get Connection String**:
   - Go to **Database** -> **Connect** -> **Drivers**.
   - Copy the MongoDB connection URI. It looks like:
     ```text
     mongodb+srv://fasaladmin:<password>@cluster0.abcde.mongodb.net/fasalai?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your actual database user password.

---

## Step 2: Deploy Backend on Render

1. Sign in or create an account at [Render](https://render.com).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository containing `FasalAI`.
4. Fill in the following deployment settings:

| Setting Field | Value |
| :--- | :--- |
| **Name** | `fasalai-backend` (or your custom name) |
| **Region** | Select closest region (e.g., Singapore or Frankfurt) |
| **Branch** | `main` (or `master`) |
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |

5. **Configure Environment Variables**:
   Under **Environment Variables**, add the following keys:

| Environment Variable Key | Description / Example Value |
| :--- | :--- |
| `NODE_ENV` | `production` |
| `PORT` | `10000` (Render's default port) |
| `MONGODB_URI` | `mongodb+srv://fasaladmin:YourPass@cluster0.abcde.mongodb.net/fasalai?retryWrites=true&w=majority` |
| `JWT_SECRET` | Generate a random 32+ character secret string |
| `JWT_EXPIRES_IN` | `7d` |
| `OPENROUTER_API_KEY` | Your OpenRouter API Key (`sk-or-v1-...`) |
| `CLIENT_ORIGIN` | Your Vercel domain URL (e.g. `https://fasalai.vercel.app`) |
| `APP_URL` | Your Render Backend URL (e.g. `https://fasalai-backend.onrender.com`) |
| `GITHUB_CLIENT_ID` | *(Optional)* Your GitHub OAuth App Client ID |
| `GITHUB_CLIENT_SECRET` | *(Optional)* Your GitHub OAuth App Client Secret |

6. Click **Deploy Web Service**.
7. Once deployed, test the backend health route in your browser:
   `https://<your-render-backend-url>.onrender.com/api/health`
   You should see: `{"status":"ok","service":"FasalAI API",...}`.

---

## Step 3: Deploy Frontend on Vercel

1. Sign in or create an account at [Vercel](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository (`FasalAI`).
4. Configure Project Settings:

| Setting Field | Value |
| :--- | :--- |
| **Framework Preset** | `Vite` |
| **Root Directory** | Click **Edit** and select `frontend` |
| **Build Command** | `npm run build` (automatic) |
| **Output Directory** | `dist` (automatic) |

5. **Configure Environment Variables**:
   Expand the **Environment Variables** section and add:

| Variable Name | Value |
| :--- | :--- |
| `VITE_API_URL` | `https://<your-render-backend-url>.onrender.com/api` |
| `VITE_GITHUB_CLIENT_ID` | *(Optional)* GitHub OAuth Client ID |

6. Click **Deploy**.
7. Vercel will build and publish your app. You will receive a URL such as `https://fasalai.vercel.app`.

---

## Step 4: GitHub OAuth Setup (Optional)

If you use GitHub login:
1. Go to **GitHub Settings** -> **Developer Settings** -> **OAuth Apps** -> Select your app.
2. Set **Homepage URL**: `https://fasalai.vercel.app`
3. Set **User authorization callback URL**: `https://fasalai.vercel.app/auth/github/callback`
4. Update `CLIENT_ORIGIN` on Render to `https://fasalai.vercel.app`.

---

## 🛠️ Verification & Troubleshooting Checklist

- [ ] **Backend Health Check**: Open `https://<render-backend>/api/health` -> Status 200 OK.
- [ ] **CORS Error Fix**: If the browser console shows a CORS error on Vercel, ensure `CLIENT_ORIGIN` on Render matches your exact Vercel URL without a trailing slash (or set `CLIENT_ORIGIN` to `*` for initial testing).
- [ ] **Render Free Tier Spin-Down**: On Render's free tier, the backend sleeps after 15 minutes of inactivity. The initial cold request may take ~30 seconds to spin up.
- [ ] **MongoDB IP Access**: Ensure MongoDB Atlas Network Access permits `0.0.0.0/0`.
