# 🚗 Vehicle Rental System 

A full-stack vehicle rental application built with React with Vite(frontend), Express.js (backend) and MySQL (database).

---


## 🚀 Features

* User signup & login (customers, employees, admins)
* Browse and manage vehicle listings.
* Customers can book, view, and manage bookings.
* Employees can see their maintenance jobs.
* Admin has control over Employees, Maintenances, Fines etc.
* Responsive React UI with React Router

---

## 🛠️ Tech Stack

* **Frontend**: React, React Router, Axios, Vite
* **Backend**: Node.js, Express.js, dotenv, CORS, JsonWebToken
* **Database**: MySQL
* **ORM / Query**: (plain `mysql2` or your preferred query lib)

---

## ⚙️ Prerequisites

* [Node.js](https://nodejs.org/) (v14+)
* [npm](https://www.npmjs.com/) (v6+)
* [MySQL](https://www.mysql.com/) server

---

## 💾 Database Setup

1. **Start MySQL** and log in:

   ```bash
   mysql -u root -p
   ```

2. **Create database**:

   ```sql
   CREATE DATABASE vehicle_rental;
   ```

3. **Create a `.env` file** in `backend/` (see below) with your DB credentials.

4. **Run any SQL seed/migration scripts** you have under `backend/db/` (or manually create tables):

   ```sql
   USE vehicle_rental;
   -- Example table:
   CREATE TABLE users (
     id INT AUTO_INCREMENT PRIMARY KEY,
     username VARCHAR(50) NOT NULL UNIQUE,
     password_hash VARCHAR(255) NOT NULL,
     role ENUM('customer','employee','admin') NOT NULL
   );
   -- Create other tables: vehicles, bookings, maintenance, earnings, fines, transactions, etc. for the database to be up for the queries.
   ```

---

## 🔧 Installation & Setup

### Backend

1. **Navigate to backend folder**:

   ```bash
   cd backend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure environment**:
   Create a `.env` file in `backend/` with the following variables:

   ```ini
   PORT=5050
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   DB_NAME=vehicle_rental
   JWT_SECRET=your_jwt_secret
   ```

4. **Start the server**:

   ```bash
   npm start
   ```

   The API server will run at `http://localhost:5050`.

---

### Frontend

1. **Navigate to frontend folder**:

   ```bash
   cd frontend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```


3. **Start the dev server**:

   ```bash
   npm run dev
   ```

   The React app will run at `http://localhost:5073`.

---

## 📂 Project Structure

```
.
├── backend
│   ├── config
│   │   └── db.js
│   ├── routes
│   │   ├── vehicle.js
│   │   ├── login.js
│   │   ├── bookings.js
│   │   ├── signup.js
│   │   └── … other route files …
│   ├── models
│   │   └── (optional ORM models)
│   ├── .env
│   └── server.js
└── frontend
    ├── src
    │   ├── pages
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── SignUp.jsx
    │   │   └── … other pages …
    │   ├── App.js
    │   └── index.js
    ├── public
    ├── package.json
    └── .env
```

---

## 📝 API Endpoints

> All endpoints are prefixed with `http://localhost:5050`

### Authentication

* **POST** `/signup` – Create a new user
* **POST** `/login` – Authenticate and get JWT

### Vehicles

* **GET** `/vehicles` – List all vehicles
* **POST** `/vehicles` – Create a vehicle (admin)
* **PUT** `/vehicles/:id` – Update a vehicle (admin)
* **DELETE** `/vehicles/:id` – Delete a vehicle (admin)

### Bookings

* **GET** `/bookings` – Get user bookings
* **POST** `/bookings` – Create a booking
* **GET** `/bookings/history` – Get past bookings

… *and similarly for* `/employees`, `/customers`, `/maintenance`, `/earnings`, `/fines`, `/transactions`.

### Employees
* **GET** `/`

---

## ▶️ Running the App

1. **Make sure MySQL is running** and database is set up.
2. **Run backend** (port 5050).
3. **Run frontend** (port 5073).
4. **Open** `http://localhost:5073` in your browser.

---


## 📄 License

This project is licensed under the MIT License.
