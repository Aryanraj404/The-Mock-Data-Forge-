# Mock Data Forge

📖 Introduction

Mock Data Forge is a schema-based mock data generator built as part of the **CSEA Induction Task**.

The project is a **Node.js / JavaScript-based web application** that allows users to define a data schema and generate realistic mock JSON data for development and testing purposes.

It supports:
- Running locally using npm
- Hosting as an API/web app (deployed on Vercel)
- Containerized execution using Docker (bonus)

This README provides step-by-step instructions to set up and run the project.

---

📑 Table of Contents

- Introduction  
- Requirements  
- Installation  
- Running the Project  
- Live Deployment  
- Docker Support  
- Folder Structure  
- API Usage  
- Troubleshooting  
- License  

---

⚙️ Requirements

Before running this project, make sure you have the following installed on your system:

- **Node.js** (version 14 or above recommended)
- **npm** (comes with Node.js)
- **Git**

(Optional, for Docker support):
- **Docker**

Check installation using:

node -v
npm -v
git --version

🚀 Installation

Follow these steps to get the project running on your local system.

1️⃣ Clone the Repository
git clone https://github.com/Aryanraj404/The-Mock-Data-Forge-.git

2️⃣ Navigate to Project Directory
cd The-Mock-Data-Forge-

3️⃣ Install Dependencies
npm install

▶️ Running the Project Locally

After installing dependencies, start the project using:

npm start

Default URL:

http://localhost:3000

Live Deployment (Vercel)

The project is deployed on Vercel and is publicly accessible at:https://mock-data-forge.vercel.app/

The project can also be run using Docker.

Build the Docker image
docker build -t mock-data-forge .

Run the Docker container
docker run -p 3000:3000 mock-data-forge


Open in browser:

http://localhost:3000


When you open the website you can select fiedls (left side) and the number of rows (top right,beside Load example), and click generate