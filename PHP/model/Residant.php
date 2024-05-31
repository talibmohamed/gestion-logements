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
            $sql = $connection->prepare('SELECT res_id, password, nom, prenom FROM residant WHERE email = ?');
            $sql->execute([$email]);
            $user = $sql->fetch(PDO::FETCH_ASSOC);

            if ($user) {
                if (password_verify($password, $user['password'])) {
                    $jwtHandler = new JwtHandler();
                    $jwt_token = $jwtHandler->generateJwtToken($user['res_id'], 'residant');

                    return array(
                        'status' => 'success',
                        'jwt_token' => $jwt_token,
                        'nom' => $user['nom'],
                        'prenom' => $user['prenom'],
                        'role' => 'residant'
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

    public function getAllnotifications($res_id){
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
}

?>
