-- creation of database
CREATE TABLE equipement (
    equip_id  SERIAL PRIMARY KEY,
    equip_type VARCHAR(100) NOT NULL
);

CREATE TABLE logement (
    log_id      SERIAL PRIMARY KEY,
    typelog     VARCHAR(40) NOT NULL,
    is_ameliore BOOLEAN NOT NULL,
    description VARCHAR(250),
    mc          INT NOT NULL,
    piece       INT NOT NULL,
    equip_ids   INT[],
    is_vacant BOOLEAN default true;
);

CREATE TABLE admin (
    adm_id        SERIAL PRIMARY KEY,
    nom           VARCHAR(40),
    prenom        VARCHAR(40),
    email         VARCHAR(250) UNIQUE,
    password      VARCHAR(250),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE residant (
    res_id     SERIAL PRIMARY KEY,
    log_id     INT UNIQUE,
    nom        VARCHAR(40),
    prenom     VARCHAR(40),
    cin        VARCHAR(40),
    password   VARCHAR(250),
    email      VARCHAR(40) UNIQUE,
    telephone  VARCHAR(40),
    profession VARCHAR(40),
    date_ajout TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    first_login BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (log_id)
        REFERENCES logement (log_id)
);

CREATE TABLE password_reset_tokens (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    FOREIGN KEY (email) REFERENCES residant (email)
);


CREATE TABLE facture (
    fac_id       SERIAL PRIMARY KEY,
    fac_no       VARCHAR(100),
    fac_date     DATE,
    fac_type     VARCHAR(255),
    fac_total    DOUBLE PRECISION,
    fac_etat     VARCHAR(40),
    fac_echeance DATE,
    res_id       INT,
    FOREIGN KEY (res_id)
        REFERENCES residant (res_id)
);

CREATE TABLE consommation (
    cons_id    SERIAL PRIMARY KEY,
    cons_type  VARCHAR(255),
    cons_date  DATE,
    cons_quota DOUBLE PRECISION,
    res_id     INT,
    log_id     INT,
    FOREIGN KEY (res_id)
        REFERENCES residant (res_id),
    FOREIGN KEY (log_id)
        REFERENCES logement (log_id)
);

CREATE TABLE reclamation (
    rec_id         SERIAL PRIMARY KEY,
    rec_desc       VARCHAR(255),
    rec_etat       VARCHAR(50),
    rec_date       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    rec_response   DATE,
    res_id         INT,
    log_id         INT,
    message        VARCHAR(255),
    FOREIGN KEY (res_id)
        REFERENCES residant (res_id),
    FOREIGN KEY (log_id)
        REFERENCES logement (log_id)
);

CREATE TABLE notification (
    notif_id SERIAL PRIMARY KEY,
    notif_titre VARCHAR(255),
    notif_date TIMESTAMP DEFAULT current_timestamp,
    notif_desc VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    res_id INT,
    FOREIGN KEY (res_id) REFERENCES residant (res_id)
);


-- Insert data into equipement
INSERT INTO equipement (equip_type) VALUES 
('Washing Machine'),
('Air Conditioner'),
('Refrigerator'),
('Microwave Oven'),
('Dishwasher');

-- Insert data into logement
INSERT INTO logement (typelog, is_ameliore, description, mc, piece, equip_ids) VALUES 
('Studio', true, 'Cozy studio apartment', 45, 1, ARRAY[1, 3]),
('One Bedroom', false, 'Spacious one bedroom apartment', 60, 2, ARRAY[2, 4]),
('Two Bedroom', true, 'Modern two bedroom apartment', 85, 3, ARRAY[1, 2, 3]),
('Penthouse', true, 'Luxury penthouse with a great view', 120, 4, ARRAY[2, 5]),
('Duplex', false, 'Spacious duplex with garden', 150, 5, ARRAY[1, 4]);

-- Insert data into admin
INSERT INTO admin (nom, prenom, email, password) VALUES 
('Smith', 'John', 'john.smith@example.com', 'password123'),
('Doe', 'Jane', 'jane.doe@example.com', 'securepassword'),
('Brown', 'Charlie', 'charlie.brown@example.com', 'mypassword'),
('Taylor', 'Emma', 'emma.taylor@example.com', 'password456'),
('Johnson', 'Ava', 'ava.johnson@example.com', 'strongpassword');

-- Insert data into residant
INSERT INTO residant (log_id, nom, prenom, cin, password, email, telephone, profession) VALUES 
(1, 'Miller', 'Alex', 'CIN001', 'respass1', 'alex.miller@example.com', '1234567890', 'Engineer'),
(2, 'Wilson', 'Blake', 'CIN002', 'respass2', 'blake.wilson@example.com', '2345678901', 'Doctor'),
(3, 'Davis', 'Chris', 'CIN003', 'respass3', 'chris.davis@example.com', '3456789012', 'Teacher'),
(4, 'Garcia', 'Dana', 'CIN004', 'respass4', 'dana.garcia@example.com', '4567890123', 'Designer'),
(5, 'Martinez', 'Eli', 'CIN005', 'respass5', 'eli.martinez@example.com', '5678901234', 'Chef');

-- Insert data into facture
INSERT INTO facture (fac_no, fac_date, fac_type, fac_total, fac_etat, fac_echeance, res_id) VALUES 
('FAC001', '2024-01-01', 'Electricity', 100.00, 'Paid', '2024-01-10', 1),
('FAC002', '2024-01-02', 'Water', 50.00, 'Unpaid', '2024-01-15', 2),
('FAC003', '2024-01-03', 'Gas', 75.00, 'Paid', '2024-01-20', 3),
('FAC004', '2024-01-04', 'Internet', 60.00, 'Unpaid', '2024-01-25', 4),
('FAC005', '2024-01-05', 'Rent', 1200.00, 'Paid', '2024-01-30', 5);

-- Insert data into consommation
INSERT INTO consommation (cons_type, cons_date, cons_quota, res_id, log_id) VALUES 
('Electricity', '2024-01-01', 350.00, 1, 1),
('Water', '2024-01-02', 120.00, 2, 2),
('Gas', '2024-01-03', 200.00, 3, 3),
('Internet', '2024-01-04', 300.00, 4, 4),
('Rent', '2024-01-05', 1000.00, 5, 5);

-- Insert data into reclamation
INSERT INTO reclamation (rec_desc, rec_etat, rec_date, rec_response, res_id, log_id, message) VALUES 
('No hot water', 'Pending', '2024-01-01 10:00:00', NULL, 1, 1, 'Please fix it ASAP'),
('Power outage', 'Resolved', '2024-01-02 11:00:00', '2024-01-03', 2, 2, 'Power restored quickly'),
('Broken window', 'In Progress', '2024-01-03 12:00:00', NULL, 3, 3, 'Scheduled for repair'),
('Noise complaint', 'Pending', '2024-01-04 13:00:00', NULL, 4, 4, 'Ongoing issue'),
('Pest control', 'Resolved', '2024-01-05 14:00:00', '2024-01-06', 5, 5, 'Problem solved');

-- Insert data into notification
INSERT INTO notification (notif_titre, notif_date, notif_desc, res_id) VALUES 
('Maintenance Work', '2024-01-01 08:00:00', 'Scheduled maintenance on 2024-01-10', 1),
('Rent Reminder', '2024-01-02 09:00:00', 'Rent due on 2024-01-15', 2),
('Community Meeting', '2024-01-03 10:00:00', 'Meeting on 2024-01-20', 3),
('Holiday Event', '2024-01-04 11:00:00', 'Holiday event on 2024-01-25', 4),
('New Policy Update', '2024-01-05 12:00:00', 'New policies effective from 2024-02-01', 5);

-- ------------------------------------------------------------
-- IMPORTANT !!!!!!!!!!!!!!!!!!!!!!
--if u get any conflict delete admin_user and resident_user if u did creat them before and rename the admin_role and resident_role created before the execute the following 

-- admin role

-- Step 1: Create the admin role with no inheritance of privileges by default
CREATE ROLE admin_role WITH NOINHERIT;

-- Step 2: Grant necessary privileges on the database and schema
GRANT CONNECT ON DATABASE houselytics TO admin_role;
GRANT USAGE ON SCHEMA public TO admin_role;

-- Step 3: Grant privileges on all existing tables in the schema
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO admin_role;

-- Step 4: Ensure the admin_role gets the same privileges on future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO admin_role;

-- Step 5: Create the admin user and assign the admin_role to this user
CREATE USER admin_user WITH PASSWORD 'admin_password';
GRANT admin_role TO admin_user;

GRANT SELECT, USAGE ON SEQUENCE residant_res_id_seq TO admin_role;



-- resident role

-- Step 1: Create the resident role with appropriate privileges
CREATE ROLE resident_role WITH NOINHERIT;

-- Step 2: Grant necessary privileges on the database and schema
GRANT CONNECT ON DATABASE houselytics TO resident_role;
GRANT USAGE ON SCHEMA public TO resident_role;

-- Step 3: Grant privileges on all existing tables in the schema
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO resident_role;

-- Step 4: Ensure the resident_role gets the same privileges on future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE ON TABLES TO resident_role;

-- Step 5: Create a user and assign the resident_role to this user
CREATE USER resident_user WITH PASSWORD 'resident_password';
GRANT resident_role TO resident_user;

