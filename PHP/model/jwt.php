<?php

// Include the library for JWT
require_once '../vendor/autoload.php';

use Firebase\JWT\JWT;

class JwtHandler
{
    private $secret_key = "24fbd7f7c8891102ac209c6534e27a26";
    private $jwt_algo = "HS256";

    // Function to generate JWT token
    public function generateJwtToken($data)
    {
        $issuedAt = time();
        $expirationTime = $issuedAt + 3600; // JWT token expiration time (1 hour)

        $payload = array(
            'iat' => $issuedAt,
            'exp' => $expirationTime,
            'data' => $data
        );

        $jwt = JWT::encode($payload, $this->secret_key, $this->jwt_algo);
        return $jwt;
    }

    // // Function to verify JWT token
    // public function verifyJwtToken($jwt_token)
    // {
    //     try {
    //         $decoded = JWT::decode($jwt_token, $this->secret_key, array($this->jwt_algo));
    //         return array('valid' => true, 'data' => (array)$decoded->data);
    //     } catch (Exception $e) {
    //         return array('valid' => false, 'error' => $e->getMessage());
    //     }
    // }
}
