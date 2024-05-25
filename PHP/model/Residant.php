<?php
class residant
{
    private $db;

    public function __construct(Database $db)
    {
        $this->db = $db;
        $this->db->connect();
    }

    // API endpoint function to handle user login
    public function loginUser($email, $password)
    {
        try {
            // Get the established connection
            $connection = $this->db->getConnection();
            $sql = $connection->prepare('SELECT res_id, password, nom, prenom FROM residant WHERE email = ?');
            $sql->execute([$email]);
            $user = $sql->fetch(PDO::FETCH_ASSOC);

            if ($user) {
                // Compare the provided password with the stored password
                if ($password == $user['password']) {
                    // Generate JWT token with res_ID
                    $jwtHandler = new JwtHandler();
                    $jwt_token = $jwtHandler->generateJwtToken($user['res_id'], 'residant');

                    // Return success response with JWT token, nom, prenom
                    return array(
                        'status' => 'success',
                        'jwt_token' => $jwt_token,
                        'nom' => $user['nom'],
                        'prenom' => $user['prenom'],
                        'role' => 'residant'
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

    public function getAllnotifications($res_id){
        try {
            // Get the established connection
            $connection = $this->db->getConnection();
            $sql = $connection->prepare('SELECT * FROM notification WHERE res_id = ?');
            $sql->execute([$res_id]);
            $notifications = $sql->fetchAll(PDO::FETCH_ASSOC);

            if ($notifications) {
                // Return success response with notifications
                return array(
                    'status' => 'success',
                    'notifications' => $notifications
                );
            } else {
                // Return error response if no notifications found
                return array('status' => 'error', 'message' => 'No notifications found');
            }
        } catch (PDOException $e) {
            // Return error response if an exception occurs
            return array('status' => 'error', 'message' => $e->getMessage());
        }
    }
}

?>
