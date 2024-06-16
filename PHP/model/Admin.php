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

    // API endpoint function to handle admin adding a user 
    public function addUserAndSendEmail($userData)
    {
        try {
            $connection = $this->db->getConnection();

            $typelog = $userData['profession'];
            $is_ameliore = $userData['is_ameliore'];

            $logementQuery = "
                SELECT * 
                FROM logement 
                WHERE typelog = :typelog 
                  AND is_ameliore = :is_ameliore 
                  AND is_vacant = TRUE
                ORDER BY log_id 
                LIMIT 1;
            ";
            $stmt = $connection->prepare($logementQuery);
            $stmt->bindParam(':typelog', $typelog, PDO::PARAM_STR);
            $stmt->bindParam(':is_ameliore', $is_ameliore, PDO::PARAM_BOOL);
            $stmt->execute();
            $logement = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$logement) {
                return [
                    'status' => 'error1',
                    'message' => 'No vacant logement found that matches the criteria.'
                ];
            }

            $characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            $password = '';
            for ($i = 0; $i < 10; $i++) {
                $password .= $characters[rand(0, strlen($characters) - 1)];
            }
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

            $fields = ['email', 'password', 'nom', 'prenom', 'cin', 'telephone', 'profession', 'log_id'];
            $values = [
                $userData['email'],
                $hashedPassword,
                $userData['nom'],
                $userData['prenom'],
                $userData['cin'],
                $userData['telephone'] ?? null,
                $userData['profession'],
                $logement['log_id']
            ];

            // Insert user data into the database
            $placeholders = rtrim(str_repeat('?,', count($fields)), ',');
            $query = "INSERT INTO residant (" . implode(',', $fields) . ") VALUES (" . $placeholders . ")";
            $stmt = $connection->prepare($query);
            $stmt->execute($values);

            // Retrieve the inserted user's ID
            $res_id = $connection->lastInsertId();

            // Generate the jwt login token and store it in login_token in residant table with user id
            $jwtHandler = new JwtHandler();
            $login_token = $jwtHandler->generateJwtToken($res_id, 'residant');

            // Update the user's login_token in the database
            $updateTokenQuery = "UPDATE residant SET login_token = ? WHERE res_id = ?";
            $stmt = $connection->prepare($updateTokenQuery);
            $stmt->execute([$login_token, $res_id]);

            // Mark the logement as occupied
            $updateQuery = "UPDATE logement SET is_vacant = false WHERE log_id = ?";
            $stmt = $connection->prepare($updateQuery);
            $stmt->execute([$logement['log_id']]);

            // Send email with login link and credentials
            $loginLink = "http://localhost:5173/form?login_token=$login_token";
            $subject = 'Your account information';
            $body = "<p>Dear {$userData['nom']} {$userData['prenom']},</p>
                     <p>Your account has been created successfully. You can login using the following link:</p>
                     <p><a href='$loginLink'>Log in to your account</a></p>
                     <p>Your login credentials are:</p>
                     <p>Email: {$userData['email']}</p>
                     <p>Password: $password</p>
                     <p>Make sure to change your password after logging in.</p>
                     <p>Best regards,</p>
                     <p>houselytics</p>";

            if (!sendEmail($userData['email'], $userData['nom'], $userData['prenom'], $subject, $body)) {
                return [
                    'status' => 'error',
                    'message' => 'Failed to send email.'
                ];
            }

            return [
                'status' => 'success',
                'message' => 'User added successfully. Email sent with login link and credentials.',
            ];
        } catch (PDOException $e) {
            return [
                'status' => 'error2',
                'message' => $e->getMessage()
            ];
        } catch (Exception $e) {
            return [
                'status' => 'error3',
                'message' => $e->getMessage()
            ];
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
}
