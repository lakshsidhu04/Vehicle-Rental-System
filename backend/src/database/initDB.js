const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

const initDB = async () => {
    try {
        const createCustomersTable = `
        CREATE TABLE IF NOT EXISTS customers (
            customer_id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            email VARCHAR(50) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL, 
            age INT NOT NULL,
            phone_number VARCHAR(15),
            address VARCHAR(100),
            license_number VARCHAR(50) NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );`;

        const createVehiclesTable = `
        CREATE TABLE IF NOT EXISTS vehicles (
            vehicle_id INT AUTO_INCREMENT PRIMARY KEY,
            vehicle_type VARCHAR(50) NOT NULL,
            brand VARCHAR(50) NOT NULL,
            model VARCHAR(50) NOT NULL,
            manufacture_year INT NOT NULL,
            color VARCHAR(50),
            rides INT NOT NULL DEFAULT 0,
            rating DECIMAL(2, 1) NOT NULL DEFAULT 0.0,
            license_plate VARCHAR(15) NOT NULL UNIQUE,
            price_per_day DECIMAL(10, 2) NOT NULL,
            status VARCHAR(50) DEFAULT 'available',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );`;

        const createBookingsTable = `
        CREATE TABLE IF NOT EXISTS bookings (
            booking_id INT AUTO_INCREMENT PRIMARY KEY,
            customer_id INT NOT NULL,
            vehicle_id INT NOT NULL,
            start_date DATE NOT NULL,
            end_date DATE NOT NULL,
            status VARCHAR(50) DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE,
            FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id) ON DELETE CASCADE
        );`;

        const createEmployeesTable = `
        CREATE TABLE IF NOT EXISTS employees (
            employee_id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            email VARCHAR(50) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            phone_number VARCHAR(15),
            role ENUM('admin', 'manager', 'staff', 'mechanic') NOT NULL DEFAULT 'staff',
            salary DECIMAL(10, 2) NOT NULL,
            hire_date DATE NOT NULL,
            status VARCHAR(50) DEFAULT 'active',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );`;

        const createEarningsTable = `
        CREATE TABLE IF NOT EXISTS earnings (
            earning_id INT AUTO_INCREMENT PRIMARY KEY,
            total_revenue DECIMAL(10, 2) NOT NULL DEFAULT 0.00,  
            total_expenses DECIMAL(10, 2) NOT NULL DEFAULT 0.00, 
            net_profit DECIMAL(10, 2) GENERATED ALWAYS AS (total_revenue - total_expenses) VIRTUAL,  
            record_date DATE NOT NULL UNIQUE,  
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );`;

        const createCouponsTable = `
        CREATE TABLE IF NOT EXISTS coupons (
            coupon_id INT AUTO_INCREMENT PRIMARY KEY,
            code VARCHAR(20) NOT NULL UNIQUE,
            discount_percentage DECIMAL(5, 2) NOT NULL CHECK (discount_percentage BETWEEN 0 AND 100),
            valid_from DATE NOT NULL,
            valid_until DATE NOT NULL,
            status VARCHAR(50) DEFAULT 'active',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );`;

        const createInsuranceTable = `
        CREATE TABLE IF NOT EXISTS insurance (
            insurance_id INT AUTO_INCREMENT PRIMARY KEY,
            vehicle_id INT NOT NULL,
            provider VARCHAR(50) NOT NULL,
            policy_number VARCHAR(50) NOT NULL UNIQUE,
            coverage_details TEXT NOT NULL,
            start_date DATE NOT NULL,
            end_date DATE NOT NULL,
            status VARCHAR(50) DEFAULT 'active',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id) ON DELETE CASCADE
        );`;

        const createMaintenanceTable = `
        CREATE TABLE IF NOT EXISTS maintenance (
            maintenance_id INT AUTO_INCREMENT PRIMARY KEY,
            vehicle_id INT NOT NULL,
            description TEXT NOT NULL,
            cost DECIMAL(10, 2) NOT NULL,
            maintenance_date DATE NOT NULL,
            status VARCHAR(50) DEFAULT 'completed',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id) ON DELETE CASCADE
        );`;

        const createReviewsTable = `
        CREATE TABLE IF NOT EXISTS reviews (
            review_id INT AUTO_INCREMENT PRIMARY KEY,
            customer_id INT NOT NULL,
            vehicle_id INT NOT NULL,
            rating DECIMAL(2, 1) NOT NULL CHECK (rating BETWEEN 1.0 AND 5.0),
            review_text TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE,
            FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id) ON DELETE CASCADE
        );`;

        const createTransactionsTable = `
        CREATE TABLE IF NOT EXISTS transactions (
            transaction_id INT AUTO_INCREMENT PRIMARY KEY,
            customer_id INT NOT NULL,
            booking_id INT NULL,
            amount DECIMAL(10, 2) NOT NULL,
            transaction_type ENUM('booking_payment', 'wallet_topup', 'fine', 'refund') NOT NULL,
            payment_method VARCHAR(50) NOT NULL,
            status VARCHAR(50) DEFAULT 'pending',
            transaction_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE,
            FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE SET NULL
        );`;

        const tables = [
            createCustomersTable,
            createVehiclesTable,
            createBookingsTable,
            createEmployeesTable,
            createEarningsTable,
            createCouponsTable,
            createInsuranceTable,
            createMaintenanceTable,
            createReviewsTable,
            createTransactionsTable
        ];

        await pool.query(createCustomersTable);  
        await pool.query(createVehiclesTable);  
        await pool.query(createBookingsTable);
        await pool.query(createEmployeesTable);
        await pool.query(createEarningsTable);
        await pool.query(createCouponsTable);
        await pool.query(createInsuranceTable);
        await pool.query(createMaintenanceTable);
        await pool.query(createReviewsTable);
        await pool.query(createTransactionsTable);
        

        console.log('Database tables created successfully');
    } catch (error) {
        console.error('Error creating Database:', error);
    } finally {
        pool.end();
    }
};

initDB();
