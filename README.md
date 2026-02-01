MSME Sahayak - Your Digital Munshi

MSME Sahayak is a full-stack "Digital Munshi" designed to simplify financial management, payroll compliance, and credit readiness for Indian Micro, Small, and Medium Enterprises (MSMEs).

🚀 Key Features

Digital Khata: A streamlined transaction logger to track daily income and expenses.

AI Loan Eligibility Advisor: Get an instant, simple-term "Scorecard" analysis of your business's loan readiness using Groq AI (Llama 3.3 70B).

AI Scheme Finder: Discover relevant Indian government schemes tailored to your specific business category.

Bilingual Support: Fully functional interface and AI insights in both English and Hindi.

Wallet & Simulated UPI Payroll: Manage a business wallet to simulate automated employee salary payments with an integrated audit trail in the Khata.

Compliance Reports: Auto-generate payroll reports inclusive of EPF, ESI, and Professional Tax (TN standards) with Excel export functionality.

🛠️ Tech Stack

Frontend: HTML5, JavaScript (ES6+), Tailwind CSS, Chart.js, SheetJS.

Backend: Node.js, Express.js.

Database: MySQL with Sequelize ORM.

AI Engine: Groq AI (Model: llama-3.3-70b-versatile).

⚙️ Installation & Setup

1. Clone the Repository

git clone [https://github.com/Shlok0005/Msme-Sahayak.git](https://github.com/Shlok0005/Msme-Sahayak.git)
cd Msme-Sahayak


2. Backend Setup

Navigate to the server folder: cd server

Install dependencies: npm install

Create a .env file and add your credentials:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=msme_sahayak_db
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key


Start the server: npm run dev

3. Frontend Setup

Navigate to the client folder: cd client

Open index.html using VS Code Live Server (recommended) or simply double-click the file to run in your browser.

📄 License

This project is developed for the Smart India Hackathon (SIH) review.
