<?php

require_once 'Jwt.php'; // Assuming JwtHandler.php contains the JwtHandler class definition

// Instantiate JwtHandler
$jwtHandler = new JwtHandler();

// Example usage: Generate a JWT token
$user_id = 123;
$user_role = 'admin';
$jwt_token = $jwtHandler->generateJwtToken($user_id, $user_role);
echo "Generated JWT token: $jwt_token\n\n";

// Example usage: Verify a JWT token
$verification_result = $jwtHandler->verifyJwtToken($jwt_token);
if ($verification_result['valid']) {
    echo "Token is valid.\n";
    echo "Decoded token data:\n";
    print_r($verification_result['data']);
} else {
    echo "Token is not valid. Error: " . $verification_result['error'] . "\n";
}

?>
