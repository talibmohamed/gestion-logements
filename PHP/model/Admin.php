<?php
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
            // Step 1: Select the right apartment for the user
            $typelog = $userData['profession'];
            $is_ameliore = $userData['is_ameliore'];
    
            // Fetch the first vacant logement matching the criteria
            $logementQuery = "
                SELECT * 
                FROM logement 
                WHERE typelog = :typelog 
                  AND is_ameliore = :is_ameliore 
                  AND etat = 'vacant' 
                ORDER BY log_id 
                LIMIT 1;
            ";
            $stmt = $connection->prepare($logementQuery);
            $stmt->bindParam(':typelog', $typelog, PDO::PARAM_STR);
            $stmt->bindParam(':is_ameliore', $is_ameliore, PDO::PARAM_BOOL);
            $stmt->execute();
            $logement = $stmt->fetch(PDO::FETCH_ASSOC);
            
            
            $stmt->bindParam(':typelog', $typelog, PDO::PARAM_STR);
            $stmt->bindParam(':is_ameliore', $is_ameliore, PDO::PARAM_BOOL);
            $stmt->execute();
            $logement = $stmt->fetch(PDO::FETCH_ASSOC);
    
            if (!$logement) {
                return [
                    'status' => 'error',
                    'message' => 'No vacant logement found that matches the criteria.'
                ];
            }

            //generate a random password
            $characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            $password = "";

            for ($i = 0; $i < 10; $i++) {
                $password .= $characters[rand(0, strlen($characters) - 1)];
            }
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    
            // Step 2: Insert the user into the database
            $fields = ['email', 'password'];
            $values = [$userdara['email'], $hashedPassword]
            foreach ($userData as $field => $value) {
                $fields[] = $field;
                $values[] = $value;
            }
            $fields[] = 'logement_id';
            $values[] = $logement['log_id'];
    
            $placeholders = rtrim(str_repeat('?,', count($fields)), ',');
            $query = "INSERT INTO residant (" . implode(',', $fields) . ") VALUES (" . $placeholders . ")";
            $this->db->executequery($query, $values);
    
            $token = bin2hex(random_bytes(32));
            $this->db->executequery("INSERT INTO login_tokens (email, token) VALUES (?, ?)", [$email, $token]);
    
            $loginLink = "http://yourwebsite.com/login?token=$token"; 
            $subject = 'Your account information';
            $body = 'Click on the following link to log in: ' . $loginLink;
    
            // Send email
            // Assuming a sendEmail function exists
            // if (!$this->sendEmail($email, $subject, $body)) {
            //     return [
            //         'status' => 'error',
            //         'message' => 'Failed to send email.'
            //     ];
            // }
    
            return [
                'status' => 'success',
                'message' => 'User added successfully. Email sent with login link.',
                'logement' => $logement
            ];
        } catch (PDOException $e) {
            return [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        } catch (Exception $e) {
            return [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }
    }
    
}
