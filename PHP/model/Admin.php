<?php

require_once 'Jwt.php';
class admin
{
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
                        'role' => 'admin'
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

    // API endpoint function to handle admmin adding a user 
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
            $login_token = bin2hex(random_bytes(32));
            //add the login_token to the resisdant table 
            array_push($fields, 'login_token');
            array_push($values, $login_token);

            $placeholders = rtrim(str_repeat('?,', count($fields)), ',');
            $query = "INSERT INTO residant (" . implode(',', $fields) . ") VALUES (" . $placeholders . ")";
            $stmt = $connection->prepare($query);
            $stmt->execute($values);

            //now that avartment is_vacant should become false
            // $updateQuery = "UPDATE logement SET etat = 'occupe' WHERE log_id = ?";
            // $stmt = $connection->prepare($updateQuery);
            // $stmt->execute([$logement['log_id']]);



            $loginLink = "http://localhost:5173/form?login_token=$login_token";
            $subject = 'Your account information';
            $body = 'Click on the following link to log in: ' . $loginLink . "\n\n" .
                    'If the link does not work, you can use the following credentials to log in manually:' . "\n" .
                    'Email: ' . $userData['email'] . "\n" .
                    'Password: ' . $password;

            // if (!$this->sendEmail($userData['email'], $subject, $body)) {
            //     return [
            //         'status' => 'error',
            //         'message' => 'Failed to send email.'
            //     ];
            // }

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
    
}
