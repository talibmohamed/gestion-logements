<?php

require_once '../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;

class JwtHandler
{
    private $secret_key = "24fbd7f7c8891102ac209c6534e27a26";
    private $jwt_algo = 'HS256';

    // Function to generate JWT token
    public function generateJwtToken($id, $role)
    {
        $issuedAt = time();
        $expirationTime = $issuedAt + 3600; // 1 hour

        $payload = array(
            'iat' => $issuedAt,
            'exp' => $expirationTime,
            'id' => $id,
            'role' => $role
        );
        
        $jwt = JWT::encode($payload, $this->secret_key, $this->jwt_algo);
        return $jwt;
    }

    // Function to verify JWT token
    public function verifyJwtToken($jwt_token)
    {
        try {
            // Decode JWT token
            $decoded = JWT::decode($jwt_token, new key( $this->secret_key, $this->jwt_algo));
            $current_time = time();
            if ($decoded->exp < $current_time) {
                // Token is expired
                return array('valid' => false, 'error' => 'Token has expired');
            }
            return array('valid' => true, 'data' => (array)$decoded);
        } catch (ExpiredException $e) {
            // Token is expired
            return array('valid' => false, 'error1' => 'Token has expired');
        } catch (Exception $e) {
            return array('valid' => false, 'error2' => $e->getMessage());
        }
    }
}

?>
