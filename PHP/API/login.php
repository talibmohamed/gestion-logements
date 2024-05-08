<?php

include_once '../model/database.php';
include_once '../model/residant.php';
include_once '../model/jwt.php';
require_once '../../vendor/autoload.php';

use \Firebase\JWT\JWT;

// Set headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Instantiate Database and residant classes
$database = new Database();
$residant = new residant($database);

// Get POST data
$data = json_decode(file_get_contents("php://input"));

// if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
//     http_response_code(200);
//     exit();
// }

// Check if $data is not null and contains the expected properties
if ($data && isset($data->email) && isset($data->password)) {
    // Process the login request
    $email = $data->email;
    $password = $data->password;

    // Call loginUser function from residant class
    $response = $residant->loginUser($email, $password);

    // Return JSON response
    http_response_code(200);
    echo json_encode($response);
} else {
    // Return error response if $data is null or doesn't contain expected properties
    http_response_code(400);
    echo json_encode(array('status' => 'error', 'message' => 'Invalid JSON data'));
}
