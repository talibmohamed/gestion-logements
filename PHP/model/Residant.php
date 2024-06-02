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
}
