<?php

class residant
{
    // public $res_ID;
    // public $log_ID;
    // public $nom;
    // public $prenom;
    // public $cin;
    // public $mot_de_passe;
    // public $email;
    // public $telephone;
    // public $profession;
    // public $date_ajout;

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
            $sql = $connection->prepare('SELECT password FROM residant WHERE email = ?');
            $sql->execute([$email]);
            $user = $sql->fetch(PDO::FETCH_ASSOC);

            if ($user) {
                // we gonna unhased the password from the db cuz the database store the password hashed
                if ($password == $user['password']) { //compare the unhashed pass with the password we get from the request
                    // Generate JWT token
                    $jwtHandler = new JwtHandler();
                    $jwt_token = $jwtHandler->generateJwtToken($user);

                    // Return success response with JWT token
                    return array('status' => 'success', 'jwt_token' => $jwt_token);
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
}

?>
