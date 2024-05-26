<?php
require_once '../vendor/autoload.php';
require_once '../API/admincontroller.php';
require_once '../API/residentcontoller.php';

// Set headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get the base path (directory containing index.php)
$basePath = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/');

// Parse the request URI and method
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Remove the base path and index.php from the request URI
$uri = preg_replace('#^' . preg_quote($basePath . '/index.php') . '#', '', $uri);



// Simple router function
function route($uri, $method) {
    $data = json_decode(file_get_contents('php://input'), true);

    switch ($uri) {
        // User routes
        case '/api/v1/user/login':
            if ($method === 'POST') {
                $userController = new UserController();
                $userController->loginUser($data);
            } else {
                http_response_code(405);
                echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
            }
            break;

        case '/api/v1/user/Allnotification':
            if ($method === 'POST') {
                $userController = new UserController();
                $userController->getAllnotifications($data);
            } else {
                http_response_code(405);
                echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
            }
            break;

        // Admin routes
        case '/api/v1/admin/login':
            if ($method === 'POST') {
                $adminController = new AdminController();
                $adminController->loginAdminAPI($data);
            } else {
                http_response_code(405);
                echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
            }
            break;
        


        // Add more routes for user and admin actions as needed

        default:
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'api not found']);
            break;
    }
}

// Call the router function
route($uri, $_SERVER['REQUEST_METHOD']);
?>
