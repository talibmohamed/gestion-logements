-- creation of database

CREATE DATABASE houselytics;


create table equipement (
    equip_id  serial primary key,
    equip_type varchar(100) not null
);

--
-- Inserting data for table `Equipement`
--

-- Televisions

-- ------------------------------------------------------------

--
-- Table structure for tble 'Logement'
--

CREATE TABLE logement (
    log_id      SERIAL PRIMARY KEY,
    typelog     VARCHAR(40),
    description VARCHAR(250),
    mc          INT NOT NULL,
    piece       INT NOT NULL,
    equip_ids   INT[],
    etat        VARCHAR(40) DEFAULT 'vacant'
);


--
--  Inserting data for table 'Logement'
--

-- for the equipment we can add it later

-- ------------------------------------------------------------

--
-- Table structure for table 'admin'
--

create table admin (
    adm_id        serial primary key,
    nom           varchar(40),
    prenom        varchar(40),
    email         varchar(250) unique,
    password  varchar(250),
    date_creation timestamp default current_timestamp
);

--
--  Inserting data for table 'admin'
--




-- ------------------------------------------------------------

--
-- Table structure for table 'tenants'
--

create table residant (
    res_id     serial primary key,
    log_id     int unique,
    nom        varchar(40),
    prenom     varchar(40),
    cin        varchar(40),
    password   varchar(250),
    email      varchar(40) unique,
    telephone  varchar(40),
    profession varchar(40),
    date_ajout timestamp default current_timestamp,
    first_login boolean default true,
    foreign key ( log_id )
        references logement ( log_id )
);

--
--  Inserting data for table 'tenants'
--'


-- ------------------------------------------------------------

--
-- Table structure for table 'invoices'
--

create table facture (
    fac_id       serial primary key,
    fac_no       varchar(100),
    fac_date     date,
    fac_type     varchar(255),
    fac_total    double precision,
    fac_etat     varchar(40),
    fac_echeance date,
    res_id       int,
    foreign key ( res_id )
        references residant ( res_id )
);

--
-- Inserting data for table `invoices`
--y


    
-- ------------------------------------------------------------

--
-- Table structure for table 'Cons_Meas'
--

create table consommation (
    cons_id    serial primary key,
    cons_type  varchar(255),
    cons_date  date,
    cons_quota double precision,
    res_id     int,
    log_id     int,
    foreign key ( res_id )
        references residant ( res_id ),
    foreign key ( log_id )
        references residant ( log_id )
);

--
-- Inserting data for table `Cons_Meas`
--




-- ------------------------------------------------------------

--
-- Table structure for table 'Reclamation'
--

create table reclamation (
    rec_id         serial primary key,
    rec_desc       varchar(255),
    rec_etat       varchar(50),
    rec_date       timestamp default current_timestamp,
    rec_response date,
    res_id         int,
    log_id         int,
    message        varchar(255),
    foreign key ( res_id )
        references residant ( res_id )
);

--
-- Inserting data for table `Reclamation`
--


-- ------------------------------------------------------------

--
-- Table structure for table 'Notification'
--

create table notification (
    notif_id    serial primary key,
    notif_titre varchar(255),
    notif_date  timestamp default current_timestamp,
    notif_desc  varchar(255),
    res_id      int,
    foreign key ( res_id )
        references residant ( res_id )
);

--


-- ------------------------------------------------------------

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

