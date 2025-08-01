Hi
# 📁 Google Drive Clone - Project

ijust created the drive clone using the plane html and css.
and i backend i used javascript.
for server hendling i use the multer curl and express.
for storing the metadata of files i used the sqldb.
and after this i used to docker for dockerrization of my web application.
and the core part of the project. AWS I used the Ec2 instance for accessing the web using the public ip address.
and use the S3 buckets for storing the file's .

## 🧩 Features

- 🚀 Upload files from browser
- 📂 List and display uploaded files with icons
- 📥 Download files from the interface
- 🧠 Backend API built with Express.js
- 💾 Data stored in SQLite database
- 🐳 Dockerized for easy deployment
- ☁️ Ready for AWS deployment (EC2/S3)


##structure 
datamonk-internship-projects/
├── backend/ # Node.js backend with Express & SQLite
├── frontend/ # HTML/CSS/JS frontend
├── icons/ # File type icons
├── Dockerfile # Docker setup
├── docker-compose.yml # Optional Docker Compose file
└── .env # Environment config


---

## 🔧 How to Run

### 🛠️ Locally

```bash
# Clone the repo
git clone https://github.com/IamHarru/Datamonk-Internship-Projects.git
cd Datamonk-Internship-Projects

# Install dependencies
cd backend
npm install

# Start backend server
node index.js

# Open frontend in browser
cd ../frontend
open drive_first.html   # Or open it manually in your browser
