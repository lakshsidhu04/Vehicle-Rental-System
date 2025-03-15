CREATE TABLE IF NOT EXISTS customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(15),
    address VARCHAR(100),
    license_number VARCHAR(50) NOT NULL UNIQUE,
    age INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vehicle_models (
    model VARCHAR(50) NOT NULL PRIMARY KEY,
    brand VARCHAR(50) NOT NULL,
    vehicle_type VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS vehicles (
    vehicle_id INT AUTO_INCREMENT PRIMARY KEY,
    model VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    color VARCHAR(50),
    rides INT NOT NULL DEFAULT 0,
    rating DECIMAL(2,1) DEFAULT 0.0,
    license_plate VARCHAR(10) NOT NULL UNIQUE,
    status ENUM('booked','avail','maintenance') NOT NULL DEFAULT 'avail',
    price_per_day DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (model) REFERENCES vehicle_models(model)
);

CREATE TABLE IF NOT EXISTS bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    vehicle_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('pending','confirmed','cancelled','completed') NOT NULL DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id)
);

CREATE TABLE IF NOT EXISTS employees (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    phone_number VARCHAR(15),
    role ENUM('admin', 'staff', 'mechanic') NOT NULL DEFAULT 'staff',
    salary DECIMAL(10,2) NOT NULL,
    hire_date DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS earnings (
    year INT NOT NULL,
    quarter INT NOT NULL,
    total_revenue DECIMAL(10,2) NOT NULL DEFAULT 0.00,  
    total_expenses DECIMAL(10,2) NOT NULL DEFAULT 0.00, 
    net_profit DECIMAL(10,2) GENERATED ALWAYS AS (total_revenue - total_expenses) STORED,
    PRIMARY KEY (year, quarter)
);

CREATE TABLE IF NOT EXISTS coupons (
    code VARCHAR(20) NOT NULL PRIMARY KEY,
    discount_percentage DECIMAL(5,2) NOT NULL CHECK (discount_percentage BETWEEN 0 AND 100),
    valid_from DATE NOT NULL,
    valid_until DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS insurance (
    insurance_id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT NOT NULL,
    provider VARCHAR(50) NOT NULL,
    policy_number VARCHAR(50) NOT NULL UNIQUE,
    coverage_details TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('active','expired','cancelled') NOT NULL DEFAULT 'active',
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id)
);

CREATE TABLE IF NOT EXISTS maintenance (
    maintenance_id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT NOT NULL,
    description TEXT NOT NULL,
    cost DECIMAL(10,2) NOT NULL,
    maintenance_date DATE NOT NULL,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id)
);

CREATE TABLE IF NOT EXISTS transactions (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    transaction_type ENUM('booking_payment','fine','refund') NOT NULL,
    transaction_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
);
CREATE TABLE IF NOT EXISTS booking_payment (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
);

CREATE TABLE IF NOT EXISTS fine (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    maintenance_id INT,
    booking_id INT NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
);

CREATE TABLE IF NOT EXISTS refund (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
);
