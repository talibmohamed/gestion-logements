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

    public function profile($jwt)
    {
        try {
            $jwtHandler = new JwtHandler();
            $token_info = $jwtHandler->verifyJwtToken($jwt);
            $res_id = $token_info['data']['id'];

            $connection = $this->db->getConnection();
            $sql = $connection->prepare('SELECT nom, prenom, cin, email, telephone, profession FROM residant WHERE res_id = ?');
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
                    $profileResult = $this->profile($newJwtToken);

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
}
