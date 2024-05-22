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
            $sql = $connection->prepare('SELECT res_ID, password, nom, prenom FROM residant WHERE email = ?');
            $sql->execute([$email]);
            $user = $sql->fetch(PDO::FETCH_ASSOC);

            if ($user) {
                // Compare the provided password with the stored password
                if ($password == $user['password']) {
                    // Generate JWT token with res_ID
                    $jwtHandler = new JwtHandler();
                    $admin = false;
                    $jwt_token = $jwtHandler->generateJwtToken($user, $admin);

                    // Return success response with JWT token, nom, and prenom
                    return array(
                        'status' => 'success',
                        'jwt_token' => $jwt_token,
                        'nom' => $user['nom'],
                        'prenom' => $user['prenom']
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
}
?>
