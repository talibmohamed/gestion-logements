<?php
class residant
{
    private $db;

    public function __construct(Database $db)
    {
        $this->db = $db;
        $this->db->connect();
    }

    public function loginUser($email, $password)
    {
        try {
            $connection = $this->db->getConnection();
            $sql = $connection->prepare('SELECT res_id, password, first_login FROM residant WHERE email = ?');
            $sql->execute([$email]);
            $user = $sql->fetch(PDO::FETCH_ASSOC);

            if ($user) {
                if (password_verify($password, $user['password'])) {
                    $jwtHandler = new JwtHandler();
                    $jwt_token = $jwtHandler->generateJwtToken($user['res_id'], 'residant');

                    return array(
                        'status' => 'success',
                        'jwt_token' => $jwt_token,
                        'role' => 'residant',
                        'first_login' => $user['first_login']
                    );
                } else {
                    return array('status' => 'error', 'message' => 'Invalid password');
                }
            } else {
                return array('status' => 'error', 'message' => 'User not found');
            }
        } catch (PDOException $e) {
            return array('status' => 'error', 'message' => $e->getMessage());
        }
    }

    public function getAllnotifications($res_id)
    {
        try {
            $connection = $this->db->getConnection();
            $sql = $connection->prepare('SELECT * FROM notification WHERE res_id = ?');
            $sql->execute([$res_id]);
            $notifications = $sql->fetchAll(PDO::FETCH_ASSOC);

            if ($notifications) {
                return array(
                    'status' => 'success',
                    'notifications' => $notifications
                );
            } else {
                return array('status' => 'error', 'message' => 'No notifications found');
            }
        } catch (PDOException $e) {
            return array('status' => 'error', 'message' => $e->getMessage());
        }
    }

    public function profile($res_id)
    {
        try {
            $connection = $this->db->getConnection();
            $sql = $connection->prepare('
                SELECT r.nom, r.prenom, r.cin, r.email, r.telephone, r.profession, 
                       TO_CHAR(r.date_ajout, \'YYYY-MM-DD\') as date_ajout, l.address 
                FROM residant r
                LEFT JOIN logement l ON r.log_id = l.log_id
                WHERE r.res_id = ?
            ');
            $sql->execute([$res_id]);
            $user = $sql->fetch(PDO::FETCH_ASSOC);

            if ($user) {
                return array(
                    'status' => 'success',
                    'user' => $user
                );
            } else {
                return array('status' => 'error', 'message' => 'User not found');
            }
        } catch (PDOException $e) {
            return array('status' => 'error', 'message' => $e->getMessage());
        }
    }

    //get logement 
    public function getlogement($res_id)
    {
        try {
            // Assuming $this->db is your database connection object
            $connection = $this->db->getConnection();

            // Fetch logement with typelog_info details, resident information, and equipment names for a specific resident
            $sql = $connection->prepare('
            SELECT 
                l.typelog, l.is_ameliore, l.mc, l.piece, l.address,
                t.quotas_electricite, t.quotas_eau,
                CONCAT(r.nom, \' \', r.prenom) AS nom,
                json_agg(e.equip_type) FILTER (WHERE e.equip_type IS NOT NULL) AS equipment_names
            FROM logement l
            JOIN typelog_info t ON l.typelog = t.typelog AND l.is_ameliore = t.is_ameliore
            LEFT JOIN residant r ON l.log_id = r.log_id
            LEFT JOIN unnest(t.equipement_ids) WITH ORDINALITY AS u(equip_id) ON TRUE
            LEFT JOIN equipement e ON e.equip_id = u.equip_id
            WHERE r.res_id = ?
            GROUP BY l.log_id, t.quotas_electricite, t.quotas_eau, r.res_id, r.nom, r.prenom
        ');

            $sql->execute([$res_id]);
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


    //old password shoudlt be the same as new password
    public function changepassword($jwt, $password, $confirmedpassword)
    {
        try {
            if ($password != $confirmedpassword) {
                return array('status' => 'error', 'message' => 'Passwords do not match');
            }
            $jwtHandler = new JwtHandler();
            $token_info = $jwtHandler->verifyJwtToken($jwt);
            $res_id = $token_info['data']['id'];


            $connection = $this->db->getConnection();
            $sql = $connection->prepare('SELECT password FROM residant WHERE res_id = ?');
            $sql->execute([$res_id]);
            $user = $sql->fetch(PDO::FETCH_ASSOC);

            if ($user) {
                if (password_verify($password, $user['password'])) {
                    return array('status' => 'error', 'message' => 'New password should be different from the old password');
                } else {
                    $password = password_hash($password, PASSWORD_DEFAULT);
                    $sql = $connection->prepare('UPDATE residant SET password = ? WHERE res_id = ?');
                    $sql->execute([$password, $res_id]);

                    //first time should become false
                    $sql = $connection->prepare('UPDATE residant SET first_login = FALSE WHERE res_id = ?');
                    $sql->execute([$res_id]);

                    // we should update the redux

                    return array('status' => 'success', 'message' => 'Password changed successfully');
                }
            } else {
                return array('status' => 'error', 'message' => 'User not found');
            }
        } catch (PDOException $e) {
            return array('status' => 'error', 'message' => $e->getMessage());
        }
    }

    public function checktoken($jwt)
    {
        try {
            $jwtHandler = new JwtHandler();
            $token_info = $jwtHandler->verifyJwtToken($jwt);
            $res_id = $token_info['data']['id'];

            $connection = $this->db->getConnection();
            $sql = $connection->prepare('SELECT login_token FROM residant WHERE res_id = ?');
            $sql->execute([$res_id]);
            $user = $sql->fetch(PDO::FETCH_ASSOC);

            if ($user) {
                if ($user['login_token'] == $jwt) {
                    // Remove the jwt form db so it be used only 1 time
                    $sql = $connection->prepare('UPDATE residant SET login_token = NULL WHERE res_id = ?');
                    $sql->execute([$res_id]);

                    // Generate a new JWT token for the user
                    $newJwtHandler = new JwtHandler();
                    $newJwtToken = $newJwtHandler->generateJwtToken($res_id, 'residant');

                    // Call the profile function with the new JWT token
                    $profileResult = $this->profile($res_id);

                    // Check if the profile call was successful
                    if ($profileResult['status'] === 'success') {
                        // Return both the new JWT token and the user profile
                        return array(
                            'status' => 'success',
                            'jwt_token' => $newJwtToken,
                            'user' => $profileResult['user']
                        );
                    } else {
                        // Return the error message from the profile call
                        return array(
                            'status' => 'error',
                            'message' => $profileResult['message']
                        );
                    }
                } else {
                    return array('status' => 'error1', 'message' => 'Token is invalid');
                }
            } else {
                return array('status' => 'error2', 'message' => 'Token is invalid');
            }
        } catch (PDOException $e) {
            return array('status' => 'error3', 'message' => $e->getMessage());
        }
    }

    //statistics
    public function getStatistics($jwt)
    {
        try {
            $jwtHandler = new JwtHandler();
            $token_info = $jwtHandler->verifyJwtToken($jwt);
            $res_id = $token_info['data']['id'];

            $connection = $this->db->getConnection();

            // Query to get total electricity and water usage and remaining quotas
            $sql = $connection->prepare('
                SELECT
                    SUM(c.elec_actuel) AS total_electricity_used,
                    COALESCE(SUM(t.quotas_electricite - c.elec_actuel), 0) AS electricity_quota_left,
                    SUM(c.eau_actuel) AS total_water_used,
                    COALESCE(SUM(t.quotas_eau - c.eau_actuel), 0) AS water_quota_left
                FROM
                    consommation c
                JOIN
                    logement l ON c.log_id = l.log_id
                JOIN
                    typelog_info t ON l.typelog = t.typelog AND l.is_ameliore = t.is_ameliore
                WHERE
                    c.res_id = ?
            ');

            $sql->execute([$res_id]);
            $statistics = $sql->fetch(PDO::FETCH_ASSOC);

            if ($statistics !== false) {
                return [
                    'status' => 'success',
                    'statistics' => [
                        'total_electricity_used' => $statistics['total_electricity_used'] ?? 0,
                        'electricity_quota_left' => $statistics['electricity_quota_left'] ?? 0,
                        'total_water_used' => $statistics['total_water_used'] ?? 0,
                        'water_quota_left' => $statistics['water_quota_left'] ?? 0,
                    ]
                ];
            } else {
                return [
                    'status' => 'error',
                    'message' => 'No statistics found'
                ];
            }
        } catch (PDOException $e) {
            return [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }
    }

    //get facture 
    public function getFactures($jwt)
    {
        try {
            $jwtHandler = new JwtHandler();
            $token_info = $jwtHandler->verifyJwtToken($jwt);
            $res_id = $token_info['data']['id'];

            $connection = $this->db->getConnection();

            // Query to get all factures of the resident
            $sql = $connection->prepare('
                SELECT
                    f.fac_id,
                    f.fac_date,
                    f.fac_type,
                    f.fac_total,
                    f.fac_etat,
                    f.fac_echeance
                FROM
                    facture f
                WHERE
                    f.res_id = ?
            ');

            $sql->execute([$res_id]);
            $factures = $sql->fetchAll(PDO::FETCH_ASSOC);

            if ($factures !== false) {
                return [
                    'status' => 'success',
                    'factures' => $factures
                ];
            } else {
                return [
                    'status' => 'error',
                    'message' => 'No factures found for this resident'
                ];
            }
        } catch (PDOException $e) {
            return [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }
    }


    //get reclamations
    public function getReclamations($jwt)
    {
        try {
            $jwtHandler = new JwtHandler();
            $token_info = $jwtHandler->verifyJwtToken($jwt);
            $res_id = $token_info['data']['id'];

            $connection = $this->db->getConnection();

            // Query to get all reclamations of the resident
            $sql = $connection->prepare('
                SELECT
                    r.rec_id,
                    TO_CHAR(r.rec_date, \'YYYY-MM-DD\') as rec_date,
                    r.rec_type,
                    r.rec_desc as rec_description,
                    r.rec_etat,
                    r.rec_response
                FROM
                    reclamation r
                WHERE
                    r.res_id = ?
            ');

            $sql->execute([$res_id]);
            $reclamations = $sql->fetchAll(PDO::FETCH_ASSOC);

            if ($reclamations !== false) {
                return [
                    'status' => 'success',
                    'reclamations' => $reclamations
                ];
            } else {
                return [
                    'status' => 'error',
                    'message' => 'No reclamations found for this resident'
                ];
            }
        } catch (PDOException $e) {
            return [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }
    }

    // Update reclamation status to 'annuler'
    // Update reclamation status to 'annulée'
    // Update reclamation status to 'annulé'
    public function updateReclamationStatus($jwt, $reclamation_id)
    {
        try {
            $jwtHandler = new JwtHandler();
            $token_info = $jwtHandler->verifyJwtToken($jwt);
            $res_id = $token_info['data']['id'];

            $connection = $this->db->getConnection();

            // Requête pour vérifier l'état actuel de la réclamation
            $checkStatusQuery = $connection->prepare('
                SELECT rec_etat
                FROM reclamation
                WHERE rec_id = ? AND res_id = ?
            ');
            $checkStatusQuery->execute([$reclamation_id, $res_id]);
            $currentStatus = $checkStatusQuery->fetchColumn();

            if ($currentStatus === 'annulé') {
                return [
                    'status' => 'error',
                    'message' => 'La réclamation est déjà annulée'
                ];
            }

            if ($currentStatus !== 'en attente') {
                return [
                    'status' => 'error',
                    'message' => 'Seules les réclamations en attente peuvent être annulées'
                ];
            }

            // Définir la valeur de l'état
            $status = 'annulé';

            // Requête pour mettre à jour l'état de la réclamation
            $updateStatusQuery = $connection->prepare('
                UPDATE reclamation
                SET rec_etat = ?
                WHERE rec_id = ? AND res_id = ?
            ');
            $updateStatusQuery->execute([$status, $reclamation_id, $res_id]);

            // Vérifier si des lignes ont été affectées
            if ($updateStatusQuery->rowCount() > 0) {
                return [
                    'status' => 'success',
                    'message' => 'Réclamation annulée avec succès'
                ];
            } else {
                return [
                    'status' => 'error',
                    'message' => 'Réclamation non trouvée ou vous n\'êtes pas autorisé à la mettre à jour'
                ];
            }
        } catch (PDOException $e) {
            return [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }
    }

    // addReclamation
    public function addReclamation($res_id, $rec_type, $rec_desc)
    {
        try {
            $connection = $this->db->getConnection();

            // Query to insert a new reclamation
            $sql = $connection->prepare('
            INSERT INTO reclamation (res_id, rec_type, rec_desc, rec_date, rec_etat)
            VALUES (?, ?, ?, NOW(), \'en attente\')
        ');

            $sql->execute([$res_id, $rec_type, $rec_desc]);

            if ($sql->rowCount() > 0) {
                return [
                    'status' => 'success',
                    'message' => 'Réclamation ajoutée avec succès'
                ];
            } else {
                return [
                    'status' => 'error',
                    'message' => 'Erreur lors de l\'ajout de la réclamation'
                ];
            }
        } catch (PDOException $e) {
            return [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }
    }

    //get statistics
    // Method to fetch consumption statistics for the last 6 months with month names
    public function StatisticsQuota($res_id)
    {
        try {
            $connection = $this->db->getConnection();

            // Query to fetch consumption statistics with month names in French
            $sql = $connection->prepare('
                WITH months AS (
                    SELECT 
                        to_char(date_trunc(\'month\', current_date) - interval \'1 month\' * generate_series(0, 5), \'YYYY-MM\') AS month_year,
                        EXTRACT(MONTH FROM date_trunc(\'month\', current_date) - interval \'1 month\' * generate_series(0, 5)) AS month_number
                )
                SELECT 
                    m.month_year,
                    CASE m.month_number
                        WHEN 1 THEN \'Janvier\'
                        WHEN 2 THEN \'Février\'
                        WHEN 3 THEN \'Mars\'
                        WHEN 4 THEN \'Avril\'
                        WHEN 5 THEN \'Mai\'
                        WHEN 6 THEN \'Juin\'
                        WHEN 7 THEN \'Juillet\'
                        WHEN 8 THEN \'Août\'
                        WHEN 9 THEN \'Septembre\'
                        WHEN 10 THEN \'Octobre\'
                        WHEN 11 THEN \'Novembre\'
                        WHEN 12 THEN \'Décembre\'
                    END AS month_name,
                    COALESCE(SUM(c.elec_actuel), 0) AS elec_actuel,
                    COALESCE(SUM(c.eau_actuel), 0) AS eau_actuel
                FROM 
                    months m
                LEFT JOIN 
                    consommation c ON m.month_year = to_char(c.cons_date, \'YYYY-MM\') AND c.res_id = ?
                GROUP BY 
                    m.month_year, m.month_number
                ORDER BY 
                    m.month_year
            ');

            $sql->execute([$res_id]);
            $statistics = $sql->fetchAll(PDO::FETCH_ASSOC);

            if ($statistics !== false) {
                $electricity = [];
                $water = [];
                $months = [];

                foreach ($statistics as $stat) {
                    $electricity[] = $stat['elec_actuel'];
                    $water[] = $stat['eau_actuel'];
                    $months[] = $stat['month_name'];
                }

                return [
                    'status' => 'success',
                    'statistics' => [
                        'electricity' => $electricity,
                        'water' => $water,
                        'months' => $months
                    ]
                ];
            } else {
                return [
                    'status' => 'error',
                    'message' => 'No statistics found'
                ];
            }
        } catch (PDOException $e) {
            return [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }
    }

    public function forgotPassword($email)
    {
        try {
            $connection = $this->db->getConnection();

            // Check if the email exists in the database
            $stmt = $connection->prepare("SELECT * FROM residant WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$user) {
                return [
                    'status' => 'error',
                    'message' => 'Aucun utilisateur trouvé avec cet email.'
                ];
            }

            // Generate JWT token and update login token
            $jwtHandler = new JwtHandler();
            $login_token = $jwtHandler->generateJwtToken($user['res_id'], 'residant');

            // Insert the token into the database
            $stmt = $connection->prepare("UPDATE residant SET login_token = ? WHERE email = ?");
            $stmt->execute([$login_token, $email]);

            // Send email with reset link
            $resetLink = "http://localhost:5173/reset-password?token=$login_token";
            $subject = 'Réinitialisation du mot de passe';
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
                    <h2>Mot de passe oublié</h2>
                    <p>Vous avez demandé une réinitialisation de mot de passe. Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
                    <p><a href='$resetLink'>Réinitialiser le mot de passe</a></p>
                    <p>Si vous n'avez pas demandé de réinitialisation de mot de passe, ignorez cet email.</p>
                    <p>Cordialement,<br>houselytics</p>
                    <p class='footer'>Ceci est un email automatique, merci de ne pas y répondre.</p>
                </div>
            </body>
            </html>
        ";

            if (sendEmail($email, $user['nom'], $user['prenom'], $subject, $body)) {
                return [
                    'status' => 'success',
                    'message' => 'Un email de réinitialisation a été envoyé à votre adresse.'
                ];
            } else {
                return [
                    'status' => 'error',
                    'message' => 'Erreur lors de l\'envoi de l\'email de réinitialisation.'
                ];
            }
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
}
