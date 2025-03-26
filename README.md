# StartNet

**StartNet** is an open-source platform I created to connect visionary entrepreneurs with forward-thinking investors. Powered by AI-driven risk assessment and intelligent matching, it bridges the gap between startups and investors for a seamless funding process while mitigating risks. Join me in building a platform that fosters innovation and empowers the startup ecosystem!

| ![License: MIT](https://img.shields.io/badge/License-MIT-green.svg) | [![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen.svg)](https://startnet-web.vercel.app/) | [![GitHub Issues](https://img.shields.io/github/issues/Praveen22042005/StartNet-Web)](https://github.com/Praveen22042005/StartNet-Web/issues) | [![GitHub Stars](https://img.shields.io/github/stars/Praveen22042005/StartNet-Web)](https://github.com/Praveen22042005/StartNet-Web/stargazers) | 

---
![StartNet Dashboard](https://github.com/user-attachments/assets/ec2b0c9b-ceec-490e-831b-6f6050d85311)

---

## 🚀 Features

- **Entrepreneur Profiles**: Create and manage detailed startup profiles to showcase your vision.
- **Investor Dashboards**: Discover and track potential investment opportunities with ease.
- **AI-Driven Matching**: Leverage intelligent algorithms to connect the right investors with the right startups.
- **Secure Authentication**: Robust user authentication using JWT and bcrypt.
- **Cloud Storage**: Securely store startup logos and documents with Azure Blob Storage.
- **Real-time Updates**: Stay informed with instant notifications and updates.
- **Responsive Design**: Fully responsive UI that works on desktop, tablet, and mobile devices.

| Entrepreneur | Investor |
|--------------|----------|
| **Manage Your Startups**<br>Track and update your startup details seamlessly.<br>![Screenshot 2025-03-25 110949](https://github.com/user-attachments/assets/5dd61ac4-ffe5-442a-9984-156ebff3734d) | **Discover Startups**<br>Browse and filter startups to find promising investment opportunities.<br>![Screenshot 2025-03-25 111031](https://github.com/user-attachments/assets/e82bc149-406f-4526-a94b-b1db5360698c) |
| **Real-time Updates**<br>Get instant updates on your startups’ progress and funding.<br>![Screenshot 2025-03-25 110923](https://github.com/user-attachments/assets/77b63116-21ff-4510-9d23-e80cf491a4d0)  | **Detailed Startup Profiles**<br>Access in-depth startup information to make informed decisions.<br>![Cognito Overview](https://github.com/Praveen22042005/StartNet-Web/raw/main/images/cognito-overview.png) |
| **Secure Account Management**<br>Update your password and manage account settings securely.<br>![Screenshot 2025-03-25 111614](https://github.com/user-attachments/assets/7e23fbe4-b805-41f2-a35b-e28f42e8ff85)  | **Financial Insights**<br>Review financial projections and key metrics for startups.<br>![Screenshot 2025-03-25 111435](https://github.com/user-attachments/assets/5180740d-deca-40e4-9a00-a402bc7f7aab) |
| **Personal Profile Management**<br>Customize your profile to showcase your vision.<br>![Screenshot 2025-03-25 110937](https://github.com/user-attachments/assets/cfaea707-03bf-4535-866b-4e6c01cc86c7) | **Contact Startups**<br>Connect with founders to explore investment opportunities.<br>![Screenshot 2025-03-25 111559](https://github.com/user-attachments/assets/572bbc47-8f9b-4129-8ecb-1f0573a844de) |

---

## 🔧 Tech Stack

### Backend
- **Runtime**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, bcrypt
- **Storage**: Azure Blob Storage
- **AI/ML**: OpenAI integration for risk assessment and matching

### Frontend
- **Framework**: Next.js 14 (React)
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context API
- **Form Handling**: React Hook Form with Zod validation
- **API Communication**: Fetch API with custom hooks

---

## 📂 Project Structure

### Frontend Structure
```
frontend/
├── public/               # Static files and images
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── auth/         # Authentication pages (signin, signup)
│   │   ├── entrepreneur/ # Entrepreneur dashboard and features
│   │   ├── investor/     # Investor dashboard and features
│   │   └── sidebar/      # Sidebar navigation components
│   ├── components/       # Reusable UI components
│   │   ├── startups/     # Startup-related components
│   │   └── ui/           # Base UI components
│   ├── config/           # Configuration files
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   └── types/            # TypeScript type definitions
├── .env.local.sample     # Sample environment variables
├── next.config.ts        # Next.js configuration
└── tailwind.config.ts    # Tailwind CSS configuration
```

### Backend Structure
```
backend/
├── config/               # Configuration files
│   ├── azureStorage.js   # Azure Blob Storage configuration
│   └── multer.js         # File upload configuration
├── controllers/          # Request handlers
│   ├── auth/             # Authentication controllers
│   ├── entrepreneur/     # Entrepreneur controllers
│   └── investor/         # Investor controllers
├── middleware/           # Express middleware
│   └── auth.js           # Authentication middleware
├── models/               # Mongoose data models
│   ├── entrepreneur/     # Entrepreneur-related models
│   └── investor/         # Investor-related models
├── routes/               # API route definitions
│   ├── auth/             # Authentication routes
│   ├── entrepreneur/     # Entrepreneur routes
│   └── investor/         # Investor routes
├── .env.example          # Sample environment variables
└── server.js             # Express application entry point
```

---

## 🛠️ Getting Started

### Prerequisites
Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **MongoDB** (local or cloud instance)
- **Azure Storage Account** (required for production; optional for development)
- **Git**

### Installation Steps

#### 1. Clone the Repository
```bash
git clone https://github.com/Praveen22042005/StartNet-Web.git
cd StartNet-Web
```

#### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file by copying the `.env.example` template and filling in your credentials:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/startnet
   JWT_SECRET=your_secret_key
   AZURE_STORAGE_CONNECTION_STRING=your_azure_storage_connection_string
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```

#### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file by copying the `.env.local.sample` template:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
5. Access the application at `http://localhost:3000`.

---

## 🖥️ User Interface

### Authentication
- Sign in and sign up pages with validation.
- Password reset functionality.
- Email verification.

![Authentication](https://github.com/user-attachments/assets/ca7a82e6-ae1f-48aa-b617-34be347a46ce)

### Entrepreneur Dashboard
- Create and manage startup profiles.
- Track investor interest.
- Upload documents and logos.
- View analytics and metrics.

![Entrepreneur-Dashboard](https://github.com/user-attachments/assets/6e02115b-d97d-41a6-b682-19a877e8682b)

### Investor Portal
- Browse startups by industry and metrics.
- Save favorites and build a portfolio.
- Contact promising entrepreneurs.
- Track investment opportunities.

![Investor-Dashboard](https://github.com/user-attachments/assets/b1279f0e-06e2-4a48-bb33-8d6ca06f016b)

---

## 🔒 Security Features

- **JWT Authentication**: Secure user sessions with JSON Web Tokens.
- **Password Hashing**: Protect user passwords using bcrypt.
- **Rate Limiting**: Prevent abuse with request rate limiting.
- **File Upload Validation**: Ensure safe file uploads to cloud storage.
- **Input Sanitization**: Guard against injection attacks.
- **CORS Protection**: Restrict cross-origin requests to trusted domains.
- **Content Security Policy**: Prevent XSS attacks with strict CSP.

---

## 🚀 Roadmap

I’m excited about the future of StartNet-Web! Here’s what I have planned:
- [ ] Enhanced AI matching algorithms for better recommendations.
- [ ] Real-time chat system for seamless communication.
- [ ] Mobile app for iOS and Android.
- [ ] Blockchain integration for secure funding transactions.
- [ ] Advanced analytics dashboard for investors and entrepreneurs.

Want to help shape the future of StartNet-Web? Check out my [issues page](https://github.com/Praveen22042005/StartNet-Web/issues) for opportunities to contribute!

---

## 🤝 Contributing

I welcome contributions from the community! Whether you’re fixing a bug, adding a feature, or improving documentation, your help is greatly appreciated.

### How to Contribute
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Make your changes and commit them (`git commit -m "Add your message"`).
4. Push to your branch (`git push origin feature/your-feature-name`).
5. Open a pull request with a detailed description of your changes.

For more details, please read my [Contributing Guidelines](CONTRIBUTING.md). If you’re new to open-source, I’ve marked some issues with the `good first issue` label to help you get started!

---

## 🧪 Testing

StartNet-Web includes comprehensive testing to ensure reliability:

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### E2E Tests
```bash
npm run test:e2e
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) - see the [LICENSE](LICENSE) file for details. Feel free to use, modify, and distribute this code as per the license terms.

---

## 🌐 Live Demo

Check out the live demo of StartNet-Web: [https://startnet-web.vercel.app/](https://startnet-web.vercel.app/)

![Signup-to-see-this-page](https://github.com/user-attachments/assets/9bb6816f-e446-43b3-81c6-40bcef02723a)

---

## 👨‍💻 Author

**Praveen BV**  
I’m passionate about this world — it’s as simple as learning something new today that I didn’t know yesterday. There’s so much more to explore, so much more to experience. Let’s connect!

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue.svg)](https://www.linkedin.com/in/praveenbv/)  
[![GitHub](https://img.shields.io/badge/GitHub-Follow-black.svg)](https://github.com/Praveen22042005)

---

## 📧 Contact

Have questions, feedback, or ideas? Reach out to me:  
- **Email**: [bvpraveenvignesh2005@gmail.com](mailto:bvpraveenvignesh2005@gmail.com)  
- **LinkedIn**: [Praveen BV](https://www.linkedin.com/in/praveenbv/)  
- **GitHub**: [@Praveen22042005](https://github.com/Praveen22042005)

---

## 🔗 Links

- **Project Repository**: [https://github.com/Praveen22042005/StartNet-Web](https://github.com/Praveen22042005/StartNet-Web)  
- **Live Demo**: [https://startnet-web.vercel.app/](https://startnet-web.vercel.app/)  
- **Issues**: [https://github.com/Praveen22042005/StartNet-Web/issues](https://github.com/Praveen22042005/StartNet-Web/issues)

---

## 🙌 Acknowledgments

- Thanks to the open-source community for the amazing tools and libraries that made this project possible.
- Special shoutout to [Next.js](https://nextjs.org/), [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/), and [MongoDB](https://www.mongodb.com/) for their fantastic frameworks and services.
- Thanks to all contributors who have helped shape and improve this project.

---

## 📊 Project Statistics

![GitHub Contributors](https://img.shields.io/github/contributors/Praveen22042005/StartNet-Web)  
![GitHub Forks](https://img.shields.io/github/forks/Praveen22042005/StartNet-Web)  
![GitHub Issues](https://img.shields.io/github/issues/Praveen22042005/StartNet-Web)  
![GitHub Pull Requests](https://img.shields.io/github/issues-pr/Praveen22042005/StartNet-Web)

---

⭐ **If you find StartNet-Web useful, please give it a star on GitHub!** It helps me reach more people and grow the community. Let’s build the future of startup funding together! 🚀
