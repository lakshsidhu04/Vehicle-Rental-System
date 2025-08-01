CREATE TABLE customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(50) NOT NULL UNIQUE,
    phone_number VARCHAR(15),
    password VARCHAR(255) NOT NULL, 
    address VARCHAR(100),
    license_number VARCHAR(50) NOT NULL UNIQUE,
    age INT NOT NULL
);

CREATE TABLE vehicle_models (
    model VARCHAR(50) NOT NULL PRIMARY KEY,
    brand VARCHAR(50) NOT NULL,
    vehicle_type VARCHAR(50) NOT NULL
);

CREATE TABLE vehicles (
    vehicle_id INT AUTO_INCREMENT PRIMARY KEY,
    model VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    color VARCHAR(50),
    rides INT NOT NULL DEFAULT 0,
    license_plate VARCHAR(10) NOT NULL UNIQUE,
    status ENUM('avail','maintenance') NOT NULL DEFAULT 'avail',
    price_per_day DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (model) REFERENCES vehicle_models(model)
);

CREATE TABLE bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    vehicle_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    rating DECIMAL(2,1) DEFAULT 0.0,
    feedback VARCHAR(256) DEFAULT NULL,
    status ENUM('pending','confirmed','cancelled','completed','rated') NOT NULL DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id)
);

CREATE TABLE employees (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(50) NOT NULL UNIQUE,
    phone_number VARCHAR(15),
    password VARCHAR(255) NOT NULL,  
    role ENUM('admin', 'staff', 'mechanic') NOT NULL DEFAULT 'staff',
    salary DECIMAL(10,2) NOT NULL,
    hire_date DATE NOT NULL
);

CREATE TABLE earnings (
    year INT NOT NULL,
    quarter INT NOT NULL,
    total_revenue DECIMAL(10,2) NOT NULL DEFAULT 0.00,  
    total_expenses DECIMAL(10,2) NOT NULL DEFAULT 0.00, 
    employee_expenses DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    net_profit DECIMAL(10,2) GENERATED ALWAYS AS (total_revenue - total_expenses - employee_expenses) STORED,
    PRIMARY KEY (year, quarter)
);

CREATE TABLE maintenance (
    maintenance_id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT NOT NULL,
    employee_id INT NOT NULL,
    description TEXT NOT NULL,
    cost DECIMAL(10,2) NOT NULL,
    maintenance_date DATE NOT NULL,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id),
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

CREATE TABLE transactions (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    booking_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL
    transaction_type ENUM('booking_payment','fine','refund') NOT NULL,
    transaction_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
);

CREATE TABLE fine (
    maintenance_id INT PRIMARY KEY,
    booking_id INT NOT NULL,
    FOREIGN KEY (maintenance_id) REFERENCES maintenance(maintenance_id),
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
);

-- no overlap of bookings
DELIMITER $$
CREATE TRIGGER prevent_overlapping_bookings
BEFORE INSERT ON bookings
FOR EACH ROW
BEGIN
    IF EXISTS (
        SELECT 1 FROM bookings
        WHERE vehicle_id = NEW.vehicle_id
        AND status IN ('pending', 'confirmed')
        AND (
                (NEW.start_date BETWEEN start_date AND end_date)
                OR (NEW.end_date BETWEEN start_date AND end_date)
                OR (start_date BETWEEN NEW.start_date AND NEW.end_date)
            )
    ) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Vehicle is already booked for overlapping dates.';
    END IF;
END$$
DELIMITER ;

-- add employee
DELIMITER //
CREATE PROCEDURE add_employee (
    IN e_username VARCHAR(255),
    IN e_password VARCHAR(255),
    IN e_name VARCHAR(50),
    IN e_email VARCHAR(50),
    IN e_phone_number VARCHAR(15),
    IN e_role ENUM('admin', 'staff', 'mechanic'),
    IN e_salary DECIMAL(10,2),
    IN e_hire_date DATE
)
BEGIN
    INSERT INTO employees (username, password, name, email, phone_number, role, salary, hire_date)
    VALUES (e_username, e_password, e_name, e_email, e_phone_number, e_role, e_salary, e_hire_date);
END;
//
DELIMITER ;

-- add maintenance
DELIMITER //
CREATE PROCEDURE add_maintenance (
    IN e_vehicle_id INT,
    IN e_employee_id INT,
    IN e_description TEXT,
    IN e_cost DECIMAL(10,2),
    IN e_maintenance_date DATE
)
BEGIN
    INSERT INTO maintenance (vehicle_id, employee_id, description, cost, maintenance_date)
    VALUES (e_vehicle_id, e_employee_id, e_description, e_cost, e_maintenance_date);
END;
//
DELIMITER ;

-- update salary
DELIMITER //
CREATE PROCEDURE update_salary(IN e_employee_id INT, IN e_percent DECIMAL(5,2))
BEGIN
    UPDATE employees
       SET salary = salary * (1 + e_percent / 100)
    WHERE employee_id = e_employee_id;
END;
//

DELIMITER ;


DELIMITER //

CREATE PROCEDURE update_salary_even_year()
BEGIN
    IF MOD(YEAR(CURDATE()), 2) = 0 THEN
        UPDATE employees
           SET salary = salary * 1.1;
    END IF;
END;
//

DELIMITER ;


DELIMITER //
CREATE PROCEDURE process_transaction (
    IN e_customer_id INT,
    IN e_booking_id INT,
    IN e_amount DECIMAL(10,2),
    IN e_payment_method VARCHAR(50),
    IN e_transaction_type ENUM('booking_payment','fine','refund'),
    IN e_maintenance_id INT
)
BEGIN
    INSERT INTO transactions (customer_id,booking_id, amount, payment_method, transaction_type)
    VALUES (e_customer_id,e_booking_id, e_amount, e_payment_method, e_transaction_type);
    IF e_transaction_type = 'fine' THEN
        INSERT INTO fine (booking_id, maintenance_id)
        VALUES (e_booking_id, e_maintenance_id);
    END IF;
END;
//
DELIMITER ;


DELIMITER //
CREATE PROCEDURE add_fine (
    IN e_customer_id INT,
    IN e_booking_id INT,
    IN e_amount DECIMAL(10,2),
    IN e_payment_method VARCHAR(50),
    IN e_maintenance_id INT
)
BEGIN
    CALL process_transaction(
        e_customer_id, 
        e_booking_id, 
        e_amount, 
        e_payment_method, 
        'fine', 
        e_maintenance_id
    );
END;
//
DELIMITER ;

DELIMITER $$
CREATE TRIGGER bookings_check_availability
BEFORE INSERT ON bookings
FOR EACH ROW
BEGIN
    DECLARE v_available TINYINT;
    SET v_available = fn_get_vehicle_availability(NEW.vehicle_id, NEW.start_date, NEW.end_date);
    IF v_available = 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'The vehicle is not available for the selected dates.';
    END IF;
END$$
DELIMITER ;


-- rides++
DELIMITER $$
CREATE TRIGGER increment_vehicle_rides_after_booking_completion
AFTER UPDATE ON bookings
FOR EACH ROW
BEGIN
    -- Check if the booking status has changed to 'completed'
    IF OLD.status <> 'completed' AND NEW.status = 'completed' THEN
        UPDATE vehicles
        SET rides = rides + 1
        WHERE vehicle_id = NEW.vehicle_id;
    END IF;
END$$
DELIMITER ;

-- cust age validate
DELIMITER $$
CREATE TRIGGER validate_customer_age
BEFORE INSERT ON customers
FOR EACH ROW
BEGIN
    IF NEW.age < 18 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Customer must be at least 18 years old.';
    END IF;
END$$
DELIMITER ;

-- validate price > 0
DELIMITER $$
CREATE TRIGGER validate_vehicle_price
BEFORE INSERT ON vehicles
FOR EACH ROW
BEGIN
    IF NEW.price_per_day <= 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Price per day must be greater than zero.';
    END IF;
END$$
DELIMITER ;

-- make sure that employee alloted maintenance is not admin
DELIMITER $$
CREATE TRIGGER check_admin_maint
BEFORE INSERT ON maintenance
FOR EACH ROW
BEGIN
    IF (SELECT role FROM employees WHERE employee_id = NEW.employee_id) = 'admin' THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Admin cannot be alloted maintenance.';
    END IF;
END$$
    


DELIMITER $$
CREATE TRIGGER validate_vehicle_price_before_update
BEFORE UPDATE ON vehicles
FOR EACH ROW
BEGIN
    IF NEW.price_per_day <= 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Price per day must be greater than zero.';
    END IF;
END$$
DELIMITER ;


-- stored procs
-- in case of manual update on vehicle
DELIMITER $$
CREATE PROCEDURE sp_update_vehicle_status(
    IN p_vehicle_id INT,
    IN p_status ENUM('booked','avail','maintenance')
)
BEGIN
    UPDATE vehicles
    SET status = p_status
    WHERE vehicle_id = p_vehicle_id;
END$$
DELIMITER ;

-- booking duration
DELIMITER $$
CREATE FUNCTION fn_get_booking_duration(p_booking_id INT)
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE v_duration INT;
    DECLARE v_start_date DATE;
    DECLARE v_end_date DATE;
    
    SELECT start_date, end_date
    INTO v_start_date, v_end_date
    FROM bookings
    WHERE booking_id = p_booking_id;
    
    SET v_duration = DATEDIFF(v_end_date, v_start_date);
    RETURN v_duration;
END$$
DELIMITER ;

-- is vehicle available?
DELIMITER $$
CREATE FUNCTION fn_get_vehicle_availability(p_vehicle_id INT, p_start_date DATE, p_end_date DATE)
RETURNS TINYINT
DETERMINISTIC
BEGIN
    DECLARE v_count INT;
    DECLARE v_status ENUM('booked', 'avail', 'maintenance');
    
    -- First check vehicle's current status
    SELECT status INTO v_status 
    FROM vehicles 
    WHERE vehicle_id = p_vehicle_id;
    
    -- If vehicle is not available, return 0 immediately
    IF v_status != 'avail' THEN
        RETURN 0;
    END IF;
    
    -- Then check for overlapping bookings
    SELECT COUNT(*) INTO v_count
    FROM bookings
    WHERE vehicle_id = p_vehicle_id
    AND status IN ('pending', 'confirmed')
    AND (
        (p_start_date BETWEEN start_date AND end_date)
        OR (p_end_date BETWEEN start_date AND end_date)
        OR (start_date BETWEEN p_start_date AND p_end_date)
        );
    
    RETURN IF(v_count > 0, 0, 1);
END$$
DELIMITER ;

-- total bookings of a customer
DELIMITER $$
CREATE FUNCTION fn_get_customer_booking_count(p_customer_id INT)
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE v_count INT;
    
    SELECT COUNT(*)
    INTO v_count
    FROM bookings
    WHERE customer_id = p_customer_id;
    
    RETURN v_count;
END$$
DELIMITER ;

-- trigger booking pending to confirmed
DELIMITER $$
CREATE TRIGGER trg_booking_payment_confirm
AFTER INSERT ON transactions
FOR EACH ROW
BEGIN
    IF NEW.transaction_type = 'booking_payment' THEN
        UPDATE bookings
        SET status = 'confirmed'
        WHERE booking_id = NEW.booking_id
        AND status = 'pending';
    END IF;
END$$
DELIMITER ;

DELIMITER //

CREATE PROCEDURE update_quarterly_earnings()
BEGIN
    DECLARE yr INT;
    DECLARE qtr INT;
    DECLARE quarter_end DATE;
    DECLARE quarter_start DATE;

    SET yr = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 QUARTER));
    SET qtr = QUARTER(DATE_SUB(CURDATE(), INTERVAL 1 QUARTER));

    SET quarter_start = CASE 
        WHEN qtr = 1 THEN CONCAT(yr, '-01-01')
        WHEN qtr = 2 THEN CONCAT(yr, '-04-01')
        WHEN qtr = 3 THEN CONCAT(yr, '-07-01')
        WHEN qtr = 4 THEN CONCAT(yr, '-10-01')
    END;

    SET quarter_end = CASE 
        WHEN qtr = 1 THEN CONCAT(yr, '-03-31')
        WHEN qtr = 2 THEN CONCAT(yr, '-06-30')
        WHEN qtr = 3 THEN CONCAT(yr, '-09-30')
        WHEN qtr = 4 THEN CONCAT(yr, '-12-31')
    END;

    INSERT INTO earnings (year, quarter, total_revenue, total_expenses, employee_expenses)
    VALUES (
        yr,
        qtr,
        (
            SELECT 
                IFNULL(SUM(
                    CASE 
                        WHEN transaction_type IN ('booking_payment', 'fine') THEN amount 
                        WHEN transaction_type = 'refund' THEN -amount 
                        ELSE 0 
                    END
                ), 0)
            FROM transactions
            WHERE YEAR(transaction_at) = yr AND QUARTER(transaction_at) = qtr
        ),
        (
            SELECT IFNULL(SUM(cost), 0)
            FROM maintenance
            WHERE YEAR(maintenance_date) = yr AND QUARTER(maintenance_date) = qtr
        ),
        (
            SELECT IFNULL(SUM(
                salary * (LEAST(TIMESTAMPDIFF(MONTH, GREATEST(hire_date, quarter_start), quarter_end) + 1, 3))
            ), 0)
            FROM employees
            WHERE hire_date <= quarter_end
        )
    )
    ON DUPLICATE KEY UPDATE 
        total_revenue = VALUES(total_revenue),
        total_expenses = VALUES(total_expenses),
        employee_expenses = VALUES(employee_expenses);
END;
//
DELIMITER ;

DELIMITER //
CREATE EVENT IF NOT EXISTS event_update_quarterly_earnings
ON SCHEDULE EVERY 1 QUARTER
STARTS '2025-04-01 00:00:00'
DO
BEGIN
    CALL update_quarterly_earnings();
END;
//
DELIMITER ;

DELIMITER //
CREATE EVENT IF NOT EXISTS event_update_salary_even_year
ON SCHEDULE EVERY 1 YEAR
STARTS '2025-01-01 00:00:00'
DO
BEGIN
    CALL update_salary_even_year();
END;
//
DELIMITER ;

DELIMITER //
CREATE EVENT IF NOT EXISTS event_update_vehicle_status
ON SCHEDULE EVERY 1 DAY
STARTS '2025-01-01 00:00:00'
DO
BEGIN
    UPDATE vehicles
    SET status = 'avail'
    WHERE status = 'maintenance'
    AND vehicle_id NOT IN (
        SELECT vehicle_id
        FROM maintenance
        WHERE maintenance_date = CURDATE()
    );
END;
//
DELIMITER ;

DELIMITER $$

CREATE TRIGGER trg_process_refund
BEFORE UPDATE ON bookings
FOR EACH ROW
BEGIN
DECLARE original_amount DECIMAL(10,2);

IF OLD.status <> 'cancelled' AND NEW.status = 'cancelled' THEN

    SELECT amount INTO original_amount 
    FROM transactions 
    WHERE booking_id = NEW.booking_id 
    AND transaction_type = 'booking_payment';
    
    IF original_amount IS NULL THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'No booking payment found for refund.';
    END IF;

    INSERT INTO transactions (customer_id, booking_id, amount, payment_method, transaction_type)
    VALUES (NEW.customer_id, NEW.booking_id, original_amount * 0.5, 'online', 'refund');
END IF;
END$$

DELIMITER ;


CREATE INDEX idx_bookings_vehicle_dates ON bookings (start_date, end_date);

CREATE INDEX idx_transactions_booking_id ON transactions (booking_id);

CREATE INDEX idx_maintenance_vehicle_id ON maintenance (vehicle_id);

CREATE INDEX idx_bookings_vehicle_id ON bookings (vehicle_id);

CREATE INDEX idx_bookings_customer_id ON bookings (customer_id);

CREATE INDEX idx_bookings_created_at ON bookings (created_at);

CREATE INDEX idx_transactions_payment_status ON transactions (transaction_type);

CREATE INDEX idx_vehicle_status ON vehicles (status);

-- Booking Payment Transaction
DELIMITER $$
CREATE PROCEDURE process_booking_payment (
    IN e_customer_id INT,
    IN e_booking_id INT,
    IN e_amount DECIMAL(10,2),
    IN e_payment_method VARCHAR(50)
)
BEGIN
    -- Insert transaction record
    INSERT INTO transactions (customer_id, booking_id, amount, payment_method, transaction_type)
    VALUES (e_customer_id, e_booking_id, e_amount, e_payment_method, 'booking_payment');
    
    -- Update booking status to 'confirmed'
    UPDATE bookings
    SET status = 'confirmed'
    WHERE booking_id = e_booking_id
    AND status = 'pending';
END$$
DELIMITER ;


-- Fine Payment Transaction
DELIMITER $$
CREATE PROCEDURE process_fine_payment (
    IN e_customer_id INT,
    IN e_booking_id INT,
    IN e_amount DECIMAL(10,2),
    IN e_payment_method VARCHAR(50),
    IN e_maintenance_id INT
)
BEGIN
    -- Insert transaction record
    INSERT INTO transactions (customer_id, booking_id, amount, payment_method, transaction_type)
    VALUES (e_customer_id, e_booking_id, e_amount, e_payment_method, 'fine');
    
    -- Link fine to maintenance
    INSERT INTO fine (maintenance_id, booking_id)
    VALUES (e_maintenance_id, e_booking_id);
END$$
DELIMITER ;


-- Refund Transaction
DELIMITER $$
CREATE PROCEDURE process_refund (
    IN e_customer_id INT,
    IN e_booking_id INT,
    IN e_amount DECIMAL(10,2),
    IN e_payment_method VARCHAR(50)
)
BEGIN
    -- Common Table Expression to fetch recent transactions for the customer
    WITH recent_transactions AS (
        SELECT transaction_id, customer_id, booking_id, amount, transaction_type, created_at
        FROM transactions
        WHERE customer_id = e_customer_id
        ORDER BY created_at DESC
        LIMIT 5
    )
    
    -- Insert transaction record
    INSERT INTO transactions (customer_id, booking_id, amount, payment_method, transaction_type)
    VALUES (e_customer_id, e_booking_id, -e_amount, e_payment_method, 'refund');
    
    -- Update booking status to 'cancelled'
    UPDATE bookings
    SET status = 'cancelled'
    WHERE booking_id = e_booking_id
    AND status IN ('pending', 'confirmed');
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER trg_booking_payment_confirm
AFTER INSERT ON transactions
FOR EACH ROW
BEGIN
    IF NEW.transaction_type = 'booking_payment' THEN
        UPDATE bookings
        SET status = 'confirmed'
        WHERE booking_id = NEW.booking_id
        AND status = 'pending';
    END IF;
END$$
DELIMITER ;



BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;

SELECT 1
  FROM rentals
 WHERE vehicle_id = :vehicleId
   AND NOT (
         :requestedEnd <= start_time
     OR  :requestedStart >= end_time
   )
 FOR UPDATE;   

INSERT INTO rentals
  (user_id, vehicle_id, start_time, end_time, status)
VALUES
  (:userId, :vehicleId, :requestedStart, :requestedEnd, 'CONFIRMED');

UPDATE vehicles
   SET status = 'RENTED'
 WHERE id = :vehicleId
   AND status = 'AVAILABLE';

COMMIT;
