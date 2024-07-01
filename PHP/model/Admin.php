<?php

require_once 'Jwt.php';
require_once 'send_email.php';

class admin
{

    private $nom;
    private $prenom;
    private $email;
    private $password;
    private $date_creation;

    //setters and getters
    public function getNom()
    {
        return $this->nom;
    }
    public function setNom($nom)
    {
        $this->nom = $nom;
    }
    public function getPrenom()
    {
        return $this->prenom;
    }
    public function setPrenom($prenom)
    {
        $this->prenom = $prenom;
    }
    public function getEmail()
    {
        return $this->email;
    }
    public function setEmail($email)
    {
        $this->email = $email;
    }
    public function getPassword()
    {
        return $this->password;
    }
    public function setPassword($password)
    {
        $this->password = $password;
    }
    public function getDate_creation()
    {
        return $this->date_creation;
    }
    public function setDate_creation($date_creation)
    {
        $this->date_creation = $date_creation;
    }

    private $db;

    public function __construct(Database $db)
    {
        $this->db = $db;
        $this->db->connect();
    }

    // API endpoint function to handle admin login
    public function loginadmin($email, $password)
    {
        try {
            $connection = $this->db->getConnection();
            $sql = $connection->prepare('SELECT adm_id, password, nom, prenom FROM admin WHERE email = ?');
            $sql->execute([$email]);
            $user = $sql->fetch(PDO::FETCH_ASSOC);

            if ($user) {
                // Check if the password is correct
                if (password_verify($password, $user['password'])) {
                    // Generate JWT token with admin role
                    $jwtHandler = new JwtHandler();
                    $jwt_token = $jwtHandler->generateJwtToken($user['adm_id'], 'admin');

                    return array(
                        'status' => 'success',
                        'jwt_token' => $jwt_token,
                        'nom' => $user['nom'],
                        'prenom' => $user['prenom'],
                        'role' => 'admin',
                        'first_login' => false,
                    );
                } else {
                    // Return error response if password is incorrect
                    return array('status' => 'error', 'message' => 'Invalid password');
                }
            } else {
                // Return error response if user does not exist
                return array('status' => 'error', 'message' => 'User not found');
            }
        } catch (PDOException $e) {
            // Return error response if an exception occurs
            return array('status' => 'error', 'message' => $e->getMessage());
        }
    }

    // API endpoint function to handle admin profile
    public function profile($jwt)
    {
        try {
            $jwtHandler = new JwtHandler();
            $token_info = $jwtHandler->verifyJwtToken($jwt);

            if ($token_info['valid']) {
                $connection = $this->db->getConnection();
                $sql = $connection->prepare('SELECT nom, prenom, email, telephone, TO_CHAR(date_creation, \'DD-MM-YYYY\') as date_creation FROM admin WHERE adm_id = ?');
                $sql->execute([$token_info['data']['id']]);
                $admin = $sql->fetch(PDO::FETCH_ASSOC);

                if ($admin) {
                    return array(
                        'status' => 'success',
                        'admin' => $admin
                    );
                } else {
                    return array('status' => 'error', 'message' => 'Admin not found');
                }
            } else {
                return array('status' => 'error', 'message' => 'Invalid token');
            }
        } catch (PDOException $e) {
            return array('status' => 'error', 'message' => $e->getMessage());
        }
    }



    // API endpoint function to handle admin changing password
    public function changePassword($jwt, $password, $confirmedPassword)
    {
        try {
            $jwtHandler = new JwtHandler();
            $token_info = $jwtHandler->verifyJwtToken($jwt);

            if ($token_info['valid']) {
                $connection = $this->db->getConnection();
                $sql = $connection->prepare('SELECT password FROM admin WHERE adm_id = ?');
                $sql->execute([$token_info['data']['id']]);
                $admin = $sql->fetch(PDO::FETCH_ASSOC);

                if ($admin) {
                    if ($password !== $confirmedPassword) {
                        return array('status' => 'error', 'message' => 'Passwords do not match');
                    }


                    if (password_verify($password, $admin['password'])) {
                        return array('status' => 'error', 'message' => 'New password cannot be the same as the old password');
                    }


                    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
                    $updateQuery = "UPDATE admin SET password = ? WHERE adm_id = ?";
                    $stmt = $connection->prepare($updateQuery);
                    $stmt->execute([$hashedPassword, $token_info['data']['id']]);

                    return array('status' => 'success', 'message' => 'Password changed successfully');
                } else {
                    return array('status' => 'error', 'message' => 'Admin not found');
                }
            } else {
                return array('status' => 'error', 'message' => 'Invalid token');
            }
        } catch (PDOException $e) {
            return array('status' => 'error', 'message' => $e->getMessage());
        }
    }



    // Get all admin notifications
    public function getAllnotifications($jwt)
    {
        try {
            $jwtHandler = new JwtHandler();
            $token_info = $jwtHandler->verifyJwtToken($jwt);

            if ($token_info['valid']) {
                $connection = $this->db->getConnection();
                $sql = $connection->prepare('SELECT notif_id, notif_titre, notif_date, notif_desc, is_read FROM notification WHERE adm_id = ?');
                $sql->execute([$token_info['data']['id']]);
                $notifications = $sql->fetchAll(PDO::FETCH_ASSOC);

                return [
                    'status' => 'success',
                    'notifications' => $notifications
                ];
            } else {
                return [
                    'status' => 'error',
                    'message' => 'Invalid token'
                ];
            }
        } catch (PDOException $e) {
            return [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }
    }

    //getAllreclamation
    public function getAllreclamation($jwt)
    {
        try {
            $jwtHandler = new JwtHandler();
            $token_info = $jwtHandler->verifyJwtToken($jwt);

            if ($token_info['valid']) {
                $connection = $this->db->getConnection();
                $sql = $connection->prepare('SELECT * FROM reclamation');
                $sql->execute();
                $reclamations = $sql->fetchAll(PDO::FETCH_ASSOC);

                return [
                    'status' => 'success',
                    'reclamations' => $reclamations
                ];
            } else {
                return [
                    'status' => 'error',
                    'message' => 'Invalid token'
                ];
            }
        } catch (PDOException $e) {
            return [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }
    }



    public function getStatistics()
    {
        $connection = $this->db->getConnection();
        $curmois = date('n'); // Current month
        $curyear = date('Y'); // Current year

        // Logement Statistics
        // Prepare and execute the query to count all logements
        $allStmt = $connection->prepare("SELECT COUNT(*) FROM logement");
        $allStmt->execute();
        $allLogements = $allStmt->fetchColumn();

        // Prepare and execute the query to count logements by statut
        $statutStmt = $connection->prepare("SELECT statut, COUNT(*) AS count FROM logement GROUP BY statut");
        $statutStmt->execute();
        $statutCounts = $statutStmt->fetchAll(PDO::FETCH_ASSOC);

        // Facture Statistics
        // Calculate the number of paid factures for the current month
        $paidStmt = $connection->prepare("SELECT COUNT(*) FROM facture WHERE fac_etat = 'payée' AND DATE_PART('month', fac_date) = :curmois AND DATE_PART('year', fac_date) = :curyear");
        $paidStmt->bindValue(':curmois', $curmois, PDO::PARAM_INT);
        $paidStmt->bindValue(':curyear', $curyear, PDO::PARAM_INT);
        $paidStmt->execute();
        $paidCount = $paidStmt->fetchColumn();

        // Calculate the number of overdue factures for the current month
        $overdueStmt = $connection->prepare("SELECT COUNT(*) FROM facture WHERE fac_etat = 'en attente' AND DATE_PART('month', fac_date) = :curmois AND DATE_PART('year', fac_date) = :curyear");
        $overdueStmt->bindValue(':curmois', $curmois, PDO::PARAM_INT);
        $overdueStmt->bindValue(':curyear', $curyear, PDO::PARAM_INT);
        $overdueStmt->execute();
        $overdueCount = $overdueStmt->fetchColumn();

        // Calculate the number of unpaid factures for the previous month
        $lastMonth = $curmois - 1;
        if ($lastMonth == 0) {
            $lastMonth = 12; // Handle December of the previous year
            $lastYear = $curyear - 1;
        } else {
            $lastYear = $curyear;
        }
        $unpaidStmt = $connection->prepare("SELECT COUNT(*) FROM facture WHERE fac_etat = 'en retard' AND DATE_PART('month', fac_date) = :lastMonth AND DATE_PART('year', fac_date) = :lastYear");
        $unpaidStmt->bindValue(':lastMonth', $lastMonth, PDO::PARAM_INT);
        $unpaidStmt->bindValue(':lastYear', $lastYear, PDO::PARAM_INT);
        $unpaidStmt->execute();
        $unpaidCount = $unpaidStmt->fetchColumn();

        // Combine results into a single associative array
        $logementStats = array();
        foreach ($statutCounts as $statutCount) {
            $logementStats[$statutCount['statut']] = $statutCount['count'];
        }

        $response = array(
            'statistics' => array(
                'facture' => array(
                    'total_paid_count' => $paidCount,
                    'total_overdue_count' => $overdueCount,
                    'total_unpaid_count' => $unpaidCount,
                    'last_update_date' => date('Y-m-d H:i:s') // Current date in standard format
                ),
                'logement' => array_merge(
                    ['total_logements_count' => $allLogements],
                    $logementStats
                )
            )
        );

        // Set the content type header to application/json
        header('Content-Type: application/json');

        // Return the JSON response
        echo json_encode($response);
        exit; // Ensure no further output is appended
    }


    public function getAllLogement()
    {
        try {
            // Assuming $this->db is your database connection object
            $connection = $this->db->getConnection();

            // Fetch all logements with typelog_info details, resident information, and equipment names
            $sql = $connection->prepare('
                SELECT 
                    l.log_id, l.typelog, l.is_ameliore, l.mc, l.piece, l.address, l.statut,
                    t.quotas_electricite, t.quotas_eau,
                    r.res_id, CONCAT(r.nom, \' \', r.prenom) AS nom,
                    json_agg(e.equip_type) FILTER (WHERE e.equip_type IS NOT NULL) AS equipment_names
                FROM logement l
                JOIN typelog_info t ON l.typelog = t.typelog AND l.is_ameliore = t.is_ameliore
                LEFT JOIN residant r ON l.log_id = r.log_id
                LEFT JOIN unnest(t.equipement_ids) WITH ORDINALITY AS u(equip_id) ON TRUE
                LEFT JOIN equipement e ON e.equip_id = u.equip_id
                GROUP BY l.log_id, t.quotas_electricite, t.quotas_eau, r.res_id, r.nom, r.prenom
            ');

            $sql->execute();
            $logements = $sql->fetchAll(PDO::FETCH_ASSOC);

            // Decode JSON arrays back to PHP arrays
            foreach ($logements as &$logement) {
                if (isset($logement['equipment_names'])) {
                    $logement['equipment_names'] = json_decode($logement['equipment_names']);
                }
            }

            return [
                'status' => 'success',
                'logements' => $logements
            ];
        } catch (PDOException $e) {
            return [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }
    }




    // Add logement
    public function addLogement($data)
    {
        try {
            // Establish database connection
            $connection = $this->db->getConnection();

            // Extract data from $data array
            $type_log = $data['type_log'];
            $is_ameliore = $data['is_ameliore'] ? 'TRUE' : 'FALSE'; // Ensure this is correctly passed as a boolean value
            $piece = $data['piece'];
            $mc = $data['mc'];
            $address = $data['address'];
            $statut = $data['statut']; // Ensure you pass statut from $data

            // Prepare SQL statement
            $sql = $connection->prepare('INSERT INTO logement (typelog, is_ameliore, piece, mc, address, statut) VALUES (?, ?, ?, ?, ?, ?)');

            // Execute SQL statement with data bindings
            $sql->execute([$type_log, $is_ameliore, $piece, $mc, $address, $statut]);

            return [
                'status' => 'success',
                'message' => 'Logement added successfully'
            ];
        } catch (PDOException $e) {
            // Return error response if an exception occurs
            return [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }
    }




    // Method to update logement in the database
    public function updateLogement($data)
    {
        try {
            // Establish database connection
            $connection = $this->db->getConnection();

            // Extract data from $data array
            $log_id = $data['log_id'];
            $type_log = $data['type_log'];
            $is_ameliore = $data['is_ameliore'] ? 'TRUE' : 'FALSE'; // Ensure this is correctly passed as a boolean value
            $piece = $data['piece'];
            $mc = $data['mc'];
            $address = $data['address'];
            $statut = $data['statut'];

            // Prepare SQL statement
            $sql = $connection->prepare('UPDATE logement SET typelog = ?, is_ameliore = ?, piece = ?, mc = ?, address = ?, statut = ? WHERE log_id = ?');

            // Execute SQL statement with data bindings
            $sql->execute([$type_log, $is_ameliore, $piece, $mc, $address, $statut, $log_id]);

            // Check if any rows were affected
            $rowsAffected = $sql->rowCount();

            if ($rowsAffected > 0) {
                return [
                    'status' => 'success',
                    'message' => 'Logement updated successfully'
                ];
            } else {
                return [
                    'status' => 'error',
                    'message' => 'Logement not found or no changes made'
                ];
            }
        } catch (PDOException $e) {
            // Return error response if an exception occurs
            return [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }
    }


    // Delete logement
    public function deleteLogement($log_id)
    {
        try {
            // Establish database connection
            $connection = $this->db->getConnection();

            // Check if the logement is occupé
            $sql_check_statut = $connection->prepare('SELECT statut FROM logement WHERE log_id = ?');
            $sql_check_statut->execute([$log_id]);
            $statut_result = $sql_check_statut->fetch(PDO::FETCH_ASSOC);

            if (!$statut_result || $statut_result['statut'] === 'occupé') {
                // Logement is occupied, cannot delete
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'Logement cannot be deleted because it is occupied']);
                return;
            }

            // Prepare SQL statement to delete the logement
            $sql_delete_logement = $connection->prepare('DELETE FROM logement WHERE log_id = ?');
            $sql_delete_logement->execute([$log_id]);

            // Check if any rows were affected
            $rowsAffected = $sql_delete_logement->rowCount();

            if ($rowsAffected > 0) {
                return [
                    'status' => 'success',
                    'message' => 'Logement deleted successfully'
                ];
            } else {
                return [
                    'status' => 'error',
                    'message' => 'Logement not found or could not be deleted'
                ];
            }
        } catch (PDOException $e) {
            return [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }
    }

    // Get all residant
    public function getAllResidant()
    {
        try {
            // Assuming $this->db is your database connection object
            $connection = $this->db->getConnection();

            // Fetch all residants with logement information
            $sql = $connection->prepare('
                SELECT 
                    r.res_id, r.nom, r.prenom, r.email, r.telephone, r.profession, r.cin, l.address
                FROM residant r
                JOIN logement l ON r.log_id = l.log_id
            ');

            $sql->execute();
            $residants = $sql->fetchAll(PDO::FETCH_ASSOC);

            return [
                'status' => 'success',
                'residants' => $residants
            ];
        } catch (PDOException $e) {
            return [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }
    }

    public function addResident($userData)
    {
        try {
            $connection = $this->db->getConnection();

            $userData['is_ameliore'] = $userData['is_ameliore'] ? 'TRUE' : 'FALSE';

            // Check if email already exists
            $stmt = $connection->prepare("SELECT COUNT(*) FROM residant WHERE email = ?");
            $stmt->execute([$userData['email']]);
            if ($stmt->fetchColumn() > 0) {
                return [
                    'status' => 'alert',
                    'message' => 'Un utilisateur avec cet email existe déjà.'
                ];
            }

            // Find available logement
            $stmt = $connection->prepare("
                SELECT * 
                FROM logement 
                WHERE typelog = :typelog 
                  AND is_ameliore = :is_ameliore 
                  AND statut = 'disponible'
                ORDER BY log_id 
                LIMIT 1
            ");
            $stmt->execute([
                ':typelog' => $userData['profession'],
                ':is_ameliore' => $userData['is_ameliore']
            ]);
            $logement = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$logement) {
                return [
                    'status' => 'alert',
                    'message' => 'Aucun logement disponible trouvé correspondant aux critères.'
                ];
            }

            // Generate random password
            $password = bin2hex(random_bytes(5));
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

            // Insert user data into the database
            $stmt = $connection->prepare("
                INSERT INTO residant (email, password, nom, prenom, cin, telephone, profession, log_id)
                VALUES (:email, :password, :nom, :prenom, :cin, :telephone, :profession, :log_id)
            ");
            $stmt->execute([
                ':email' => $userData['email'],
                ':password' => $hashedPassword,
                ':nom' => $userData['nom'],
                ':prenom' => $userData['prenom'],
                ':cin' => $userData['cin'],
                ':telephone' => $userData['telephone'] ?? null,
                ':profession' => $userData['profession'],
                ':log_id' => $logement['log_id']
            ]);

            $res_id = $connection->lastInsertId();

            // Generate JWT token and update login token
            $jwtHandler = new JwtHandler();
            $login_token = $jwtHandler->generateJwtToken($res_id, 'residant');

            $stmt = $connection->prepare("UPDATE residant SET login_token = ? WHERE res_id = ?");
            $stmt->execute([$login_token, $res_id]);

            // Mark the logement as occupied
            $stmt = $connection->prepare("UPDATE logement SET statut = 'occupé' WHERE log_id = ?");
            $stmt->execute([$logement['log_id']]);

            // Send email with login link and credentials
            $loginLink = "http://localhost:5173/form?login_token=$login_token";
            $subject = 'Vos informations de compte';
            $body = "
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                    }
                    .container {
                        max-width: 600px;
                        margin: 20px auto;
                        padding: 20px;
                        border: 1px solid #ccc;
                        border-radius: 5px;
                        background-color: #f9f9f9;
                    }
                    h2 {
                        font-size: 24px;
                        color: #333;
                    }
                    p {
                        margin: 10px 0;
                    }
                    a {
                        color: #007bff;
                        text-decoration: none;
                    }
                    a:hover {
                        text-decoration: underline;
                    }
                    .footer {
                        margin-top: 20px;
                        font-size: 14px;
                        color: #555;
                    }
                </style>
            </head>
            <body>
                <div class='container'>
                    <h2>Cher/Chère " . htmlentities($userData['nom'], ENT_QUOTES, 'UTF-8') . " " . htmlentities($userData['prenom'], ENT_QUOTES, 'UTF-8') . ",</h2>
                    <p>Votre compte a été créé avec succès. Vous pouvez vous connecter en utilisant le lien suivant :</p>
                    <p><a href='$loginLink'>Connectez-vous à votre compte</a></p>
                    <p>Vos identifiants de connexion sont :</p>
                    <ul>
                        <li><strong>Email :</strong> " . htmlentities($userData['email'], ENT_QUOTES, 'UTF-8') . "</li>
                        <li><strong>Mot de passe :</strong> $password</li>
                    </ul>
                    <p>Assurez-vous de changer votre mot de passe après vous être connecté.</p>
                    <p>Cordialement,<br>houselytics</p>
                    <p class='footer'>Ceci est un email automatique, merci de ne pas y répondre.</p>
                </div>
            </body>
            </html>
        ";

            if (!sendEmail($userData['email'], $userData['nom'], $userData['prenom'], $subject, $body)) {
                error_log('Failed to send email after adding resident.');
                return [
                    'status' => 'error',
                    'message' => 'Résidant créé. Échec de l\'envoi de l\'email.'
                ];
            }

            return [
                'status' => 'success',
                'message' => 'Utilisateur ajouté. Email envoyé avec le lien de connexion et les identifiants.',
            ];
        } catch (PDOException $e) {
            return [
                'status' => 'error',
                'message' => 'Erreur de base de données: ' . $e->getMessage()
            ];
        } catch (Exception $e) {
            return [
                'status' => 'error',
                'message' => 'Erreur: ' . $e->getMessage()
            ];
        }
    }

    // Model method to update resident in the database
    public function updateResident($userData)
    {
        try {
            $connection = $this->db->getConnection();

            $userData['is_ameliore'] = $userData['is_ameliore'] ? 'TRUE' : 'FALSE';

            // Check if the resident exists and fetch current data
            $stmt = $connection->prepare("
            SELECT r.*, l.is_ameliore
            FROM residant r
            JOIN logement l ON r.log_id = l.log_id
            WHERE r.res_id = ?
        ");
            $stmt->execute([$userData['res_id']]);
            $resident = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$resident) {
                return [
                    'status' => 'error',
                    'message' => 'Resident not found.',
                ];
            }

            // Check if the new email already exists (except for the current resident)
            if ($resident['email'] !== $userData['email']) {
                $stmt = $connection->prepare("SELECT COUNT(*) FROM residant WHERE email = ?");
                $stmt->execute([$userData['email']]);
                if ($stmt->fetchColumn() > 0) {
                    return [
                        'status' => 'error',
                        'message' => 'An account with this email already exists.',
                    ];
                }
            }

            // Check if profession or is_ameliore has changed
            $professionChanged = $resident['profession'] !== $userData['profession'];
            $amelioChanged = (bool)$resident['is_ameliore'] !== (bool)$userData['is_ameliore'];

            // Prepare update data
            $updateData = [
                'email' => $userData['email'],
                'nom' => $userData['nom'],
                'prenom' => $userData['prenom'],
                'cin' => $userData['cin'],
                'telephone' => $userData['telephone'] ?? null,
                'profession' => $userData['profession'],
                'log_id' => $resident['log_id'],
                'res_id' => $userData['res_id']
            ];

            // Only update profession and is_ameliore if changed and a suitable logement is found
            if ($professionChanged || $amelioChanged) {
                // Find available logement for the new profession and is_ameliore status
                $stmt = $connection->prepare("
                SELECT * 
                FROM logement 
                WHERE typelog = :typelog 
                  AND is_ameliore = :is_ameliore 
                  AND statut = 'disponible'
                ORDER BY log_id 
                LIMIT 1
            ");
                $stmt->execute([
                    ':typelog' => $userData['profession'],
                    ':is_ameliore' => $userData['is_ameliore']
                ]);
                $newLogement = $stmt->fetch(PDO::FETCH_ASSOC);

                if ($newLogement) {
                    // Update resident's logement assignment
                    $updateData['log_id'] = $newLogement['log_id'];

                    // Mark the old logement as available
                    $stmt = $connection->prepare("UPDATE logement SET statut = 'disponible' WHERE log_id = ?");
                    $stmt->execute([$resident['log_id']]);
                } else {
                    // No suitable logement found, handle accordingly (e.g., notify resident)
                    return [
                        'status' => 'alert',
                        'message' => 'No suitable logement available for the updated profession and amelioration status.',
                    ];
                }
            }

            // Update resident's data
            $stmt = $connection->prepare("
            UPDATE residant 
            SET email = :email, 
                nom = :nom, 
                prenom = :prenom, 
                cin = :cin, 
                telephone = :telephone, 
                profession = :profession, 
                log_id = :log_id
            WHERE res_id = :res_id
        ");
            $stmt->execute($updateData);

            return [
                'status' => 'success',
                'message' => 'Resident updated successfully.',
            ];
        } catch (PDOException $e) {
            return [
                'status' => 'error11',
                'message' => 'Database error: ' . $e->getMessage(),
            ];
        } catch (Exception $e) {
            return [
                'status' => 'error22',
                'message' => 'Error: ' . $e->getMessage(),
            ];
        }
    }

    // Delete resident

    // Assuming this is within your AdminController or similar class

    // Delete resident API
    public function deleteResidentAPI($data)
    {
        // Check if required fields are present in $data
        if (isset($data['res_id'])) {
            // Sanitize and validate inputs
            $res_id = filter_var($data['res_id'], FILTER_VALIDATE_INT);

            // Check if res_id is valid
            if ($res_id !== false && $res_id > 0) {
                try {
                    // Connect to database (assuming $this->db->getConnection() is your database connection)
                    $connection = $this->db->getConnection();

                    // Check if the resident exists
                    $stmt = $connection->prepare("SELECT * FROM residant WHERE res_id = ?");
                    $stmt->execute([$res_id]);
                    $resident = $stmt->fetch(PDO::FETCH_ASSOC);

                    if (!$resident) {
                        http_response_code(404); // Not Found
                        echo json_encode(['status' => 'error', 'message' => 'Resident not found.']);
                        return;
                    }

                    // Perform deletion
                    $stmt = $connection->prepare("DELETE FROM residant WHERE res_id = ?");
                    $stmt->execute([$res_id]);

                    // Check if deletion was successful
                    if ($stmt->rowCount() > 0) {
                        http_response_code(200); // OK
                        echo json_encode(['status' => 'success', 'message' => 'Resident deleted successfully.']);
                    } else {
                        http_response_code(500); // Internal Server Error
                        echo json_encode(['status' => 'error', 'message' => 'Failed to delete resident.']);
                    }
                } catch (PDOException $e) {
                    http_response_code(500); // Internal Server Error
                    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
                }
            } else {
                // Respond with 400 Bad Request if res_id is invalid
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'Invalid res_id']);
            }
        } else {
            // Respond with 400 Bad Request if res_id is missing
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'res_id parameter is required']);
        }
    }

    // Method to delete a resident from the database
    public function deleteResident($res_id)
    {
        try {
            $connection = $this->db->getConnection();

            // Check if the resident exists
            $stmt = $connection->prepare("SELECT log_id FROM residant WHERE res_id = ?");
            $stmt->execute([$res_id]);
            $log_id = $stmt->fetchColumn();

            if (!$log_id) {
                return [
                    'status' => 'error',
                    'message' => 'Resident not found.',
                ];
            }

            // Start a transaction
            $connection->beginTransaction();

            // Update the logement to mark it as disponible
            $stmt = $connection->prepare("UPDATE logement SET statut = 'disponible' WHERE log_id = ?");
            $stmt->execute([$log_id]);

            // Delete the resident
            $stmt = $connection->prepare("DELETE FROM residant WHERE res_id = ?");
            $stmt->execute([$res_id]);

            // Commit the transaction
            $connection->commit();

            return [
                'status' => 'success',
                'message' => 'Resident deleted successfully.',
            ];
        } catch (PDOException $e) {
            // Rollback transaction on database error
            $connection->rollBack();
            return [
                'status' => 'error',
                'message' => 'Database error: ' . $e->getMessage(),
            ];
        } catch (Exception $e) {
            // Rollback transaction on generic exception
            $connection->rollBack();
            return [
                'status' => 'error',
                'message' => 'Error: ' . $e->getMessage(),
            ];
        }
    }


    //get all facture 
    public function getAllfacture($jwt)
    {
        try {
            $jwtHandler = new JwtHandler();
            $token_info = $jwtHandler->verifyJwtToken($jwt);

            if ($token_info['valid']) {
                $connection = $this->db->getConnection();
                $sql = $connection->prepare("
                    SELECT 
                        f.fac_id, 
                        f.res_id, 
                        (r.nom || ' ' || r.prenom) AS nom,
                        f.fac_type, 
                        f.fac_date, 
                        f.fac_echeance, 
                        f.fac_etat, 
                        f.fac_total 
                    FROM 
                        facture f
                    JOIN 
                        residant r 
                    ON 
                        f.res_id = r.res_id
                ");
                $sql->execute();
                $factures = $sql->fetchAll(PDO::FETCH_ASSOC);

                return [
                    'status' => 'success',
                    'factures' => $factures
                ];
            } else {
                return [
                    'status' => 'error',
                    'message' => 'Invalid token'
                ];
            }
        } catch (PDOException $e) {
            return [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }
    }

    // Add facture
    public function addFacture($data)
    {
        try {
            $connection = $this->db->getConnection();
            $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            // Extract data from $data array
            $res_id = $data['res_id'];
            $fac_type = $data['fac_type'];
            $fac_date = $data['fac_date'];
            $fac_echeance = $data['fac_echeance'];
            $fac_etat = $data['fac_etat'];
            $fac_total = $data['fac_total'];

            //check if user id exist 
            $stmt = $connection->prepare("SELECT COUNT(*) FROM residant WHERE res_id = ?");
            $stmt->execute([$res_id]);
            if ($stmt->fetchColumn() == 0) {
                return [
                    'status' => 'error',
                    'message' => 'User not found.'
                ];
            }

            // Prepare SQL statement with named placeholders
            $sql = $connection->prepare('INSERT INTO facture (res_id, fac_type, fac_date, fac_echeance, fac_etat, fac_total) VALUES (:res_id, :fac_type, :fac_date, :fac_echeance, :fac_etat, :fac_total)');

            // Execute SQL statement with data bindings
            $sql->execute([
                ':res_id' => $res_id,
                ':fac_type' => $fac_type,
                ':fac_date' => $fac_date,
                ':fac_echeance' => $fac_echeance,
                ':fac_etat' => $fac_etat,
                ':fac_total' => $fac_total
            ]);

            // Close the connection
            $connection = null;

            return [
                'status' => 'success',
                'message' => 'Facture added successfully'
            ];
        } catch (PDOException $e) {
            // Return error response if an exception occurs
            return [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }
    }

    // Update facture in the database
    public function updateFacture($data)
    {
        try {
            $connection = $this->db->getConnection();

            // Extract data from $data array
            $fac_id = $data['fac_id'];
            $fac_type = $data['fac_type'];
            $fac_etat = $data['fac_etat'];
            $fac_total = $data['fac_total'];

            // Prepare SQL statement with named placeholders
            $sql = $connection->prepare('UPDATE facture SET fac_type = :fac_type, fac_etat = :fac_etat, fac_total = :fac_total WHERE fac_id = :fac_id');

            // Execute SQL statement with data bindings
            $sql->execute([
                ':fac_id' => $fac_id,
                ':fac_type' => $fac_type,
                ':fac_etat' => $fac_etat,
                ':fac_total' => $fac_total
            ]);

            return [
                'status' => 'success',
                'message' => 'Facture updated successfully'
            ];
        } catch (PDOException $e) {
            // Return error response if an exception occurs
            return [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }
    }

    // Delete facture
    public function deleteFacture($fac_id)
    {
        try {
            $connection = $this->db->getConnection();

            $sql = $connection->prepare('DELETE FROM facture WHERE fac_id = ?');

            $sql->execute([$fac_id]);

            // Check if any rows were affected
            $rowsAffected = $sql->rowCount();

            if ($rowsAffected > 0) {
                return [
                    'status' => 'success',
                    'message' => 'Facture deleted successfully'
                ];
            } else {
                return [
                    'status' => 'error',
                    'message' => 'Facture not found or could not be deleted'
                ];
            }
        } catch (PDOException $e) {
            // Return error response if an exception occurs
            return [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }
    }
}
