create table equipement (
    equip_id  serial primary key,
    equip_nom varchar(100)
);

--
-- Inserting data for table `Equipement`
--

insert into equipement ( equip_nom ) values ( 'WiFi' ),( 'Kitchen' ),( 'TV' ),( 'Air Conditioning' ),( 'Parking' );



--
-- Table structure for tble 'Logement'
--

create table logement (
    log_id      serial primary key,
    typelog     varchar(40),
    description varchar(250),
    mc          int not null,
    ville       varchar(250),
    nbr_ppl     int not null,
    piece       int not null,
    equip_id    int,
    etat        varchar(40) default 'vacant',
    img         varchar(250),
    foreign key ( equip_id )
        references equipement ( equip_id )
);

--
--  Inserting data for table 'Logement'
--

insert into logement (
    typelog,
    description,
    mc,
    ville,
    nbr_ppl,
    piece,
    equip_id,
    etat,
    img
) values (
    'Riad Dar Yasaman',
    'riad de luxe',
    32,
    'Marrakech',
    2,
    2,
    1,
    'vacant',
    'a link??'
);

-- ------------------------------------------------------------

--
-- Table structure for table 'admin'
--

create table admin (
    adm_id        serial primary key,
    nom           varchar(40),
    prenom        varchar(40),
    email         varchar(250) unique,
    mot_de_passe  varchar(250),
    date_creation timestamp default current_timestamp
);

--
--  Inserting data for table 'admin'
--

insert into admin (
    nom,
    prenom,
    email,
    mot_de_passe
) values (
    'Ali',
    'Ali',
    'ali@example.com',
    'pwd'
);


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
    foreign key ( log_id )
        references logement ( log_id )
);

--
--  Inserting data for table 'tenants'
--'
insert into residant (
    log_id,
    nom,
    prenom,
    cin,
    mot_de_passe,
    email,
    telephone,
    profession
) values (
    1,
    'Paul',
    'Paul',
    'k2160902',
    'qadsad1',
    'paulnyaxx@gmail.com',
    '+2126313138',
    'CADRE'
);

-- ------------------------------------------------------------

--
-- Table structure for table 'invoices'
--

create table facture (
    fac_id       serial primary key,
    fac_no       varchar(100),
    fac_mois     date,
    fac_type     varchar(255),
    fac_total    double precision,
    fac_etat     varchar(40),
    fac_echeance date,
    message      varchar(250),
    res_id       int,
    foreign key ( res_id )
        references residant ( res_id )
);

--
-- Inserting data for table `invoices`
--

insert into facture (
    fac_no,
    fac_mois,
    fac_type,
    fac_total,
    fac_etat,
    fac_echeance,
    message,
    res_id
) values (
    'INV-4657',
    '2024-08-20',
    'Electricity',
    100.00,
    'UNPAID',
    '2022-08-30',
    'smthing',
    1
);
    
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

insert into consommation (
    cons_type,
    cons_date,
    cons_quota,
    res_id,
    log_id
) values (
    'Electricity',
    '2024-08-01',
    4.0,
    1,
    1
);


-- ------------------------------------------------------------

--
-- Table structure for table 'Reclamation'
--

create table reclamation (
    rec_id         serial primary key,
    rec_desc       varchar(255),
    rec_etat       varchar(50),
    rec_mois       date,
    rec_completion date,
    res_id         int,
    log_id         int,
    foreign key ( res_id )
        references residant ( res_id )
);

--
-- Inserting data for table `Reclamation`
--

insert into reclamation (
    rec_desc,
    rec_etat,
    rec_mois,
    rec_completion,
    res_id,
    log_id
) values (
    'Electricity not working',
    'unsolved',
    '2024-05-24',
    null,
    1,
    1
);


-- ------------------------------------------------------------

--
-- Table structure for table 'Notification'
--

create table notification (
    notif_id    serial primary key,
    notif_titre varchar(255),
    notif_etat  varchar(50),
    notif_date  date,
    res_id      int,
    foreign key ( res_id )
        references residant ( res_id )
);

--
-- Inserting data for table `Notification`
--

insert into notification (
    notif_titre,
    notif_etat,
    notif_date,
    res_id
) values (
    'Reclamation verifie',
    'unread',
    '2024-05-24',
    1
);


-- ------------------------------------------------------------

--
-- Table structure for table 'Equipment'
--