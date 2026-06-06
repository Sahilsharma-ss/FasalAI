# FasalAI

AI-Powered Crop Disease Detection and Farmer Advisory System.

FasalAI is a mobile-friendly full-stack web application that helps farmers identify crop diseases from leaf images, receive instant treatment guidance, and ask agriculture-related questions in plain language. The platform combines a custom CNN-based disease classifier with an AI advisory chatbot to make expert-level support more accessible to small and marginal farmers.

## Project Overview

Agricultural losses often increase when crop diseases are detected too late or diagnosed incorrectly. FasalAI addresses this problem by providing a simple web interface where a farmer can upload an image of an affected crop, get a predicted disease label with confidence scoring, and view practical next-step recommendations.

The application is designed for rural users who may have limited digital literacy and basic smartphones, so the experience focuses on clarity, speed, and mobile responsiveness.

## Key Features

- Crop Disease Detection: Upload a crop image and get an AI-generated disease prediction.
- Confidence Score: View the model’s confidence for the predicted result.
- Treatment Advisory: Receive disease-specific treatment steps, preventive measures, and remedy suggestions.
- AI Chatbot: Ask open-ended crop and farming questions using the Gemini API.
- Crop Health History: Track previous diagnoses and monitor recurring disease patterns over time.
- Farmer Dashboard: View recent detections, health trends, and quick access to advisory support.

## AI Capabilities

- Disease Detection Model: A custom Convolutional Neural Network trained with TensorFlow and Keras on the PlantVillage dataset.
- Advisory Assistant: Gemini API integration for contextual, easy-to-understand responses.

## Tech Stack

- Frontend: React.js with Vite
- Styling: Tailwind CSS
- Backend: Node.js with Express.js
- Database: MongoDB with Mongoose ODM
- Authentication: JWT with bcrypt
- Machine Learning: TensorFlow / Keras
- AI Chat: Google Gemini API
- Tools: GitHub, Visual Studio Code, Postman
- Deployment: Vercel for frontend, Render for backend

## Why FasalAI

FasalAI is built to bridge the gap between farmers and timely agricultural expertise. Instead of waiting for in-person support, users can get immediate disease insights and guidance from anywhere, helping reduce crop loss and improve decision-making.

## Intended Users

- Small and marginal farmers
- Rural agricultural workers
- Field support teams and farm advisors
- Students and researchers exploring AI in agriculture

## Suggested Workflow

1. Create an account and sign in.
2. Upload a clear image of the affected crop leaf.
3. Review the disease prediction and confidence score.
4. Read the suggested treatment and prevention steps.
5. Ask follow-up questions through the chatbot if needed.
6. Revisit the dashboard to view past diagnoses and crop health history.

## Setup

If you are running the application locally, the usual setup is:

1. Clone the repository.
2. Install dependencies for both frontend and backend.
3. Configure environment variables for MongoDB, JWT, and Gemini API access.
4. Start the backend server.
5. Start the frontend development server.

Example environment variables:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```

## Project Structure

This repository contains the FasalAI project documentation for the TBI-GEU Summer Internship Program 2026.

## Deployment

- Frontend: Vercel
- Backend: Render

## Future Enhancements

- Support for more crop types and disease classes
- Multilingual advisory responses
- Offline-friendly or low-bandwidth mode
- Voice input for farmers with limited typing access
- Integration with weather and local advisory alerts

## Internship Details

TBI-GEU Summer Internship Program 2026

Intern: Sahil Sharma

Track: AI-Assisted Full Stack Web Development

Sector: Agri-Allied

## License

This project is currently shared for internship and academic demonstration purposes.
