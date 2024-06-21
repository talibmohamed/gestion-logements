<?php
require_once '../vendor/autoload.php';
require '../API/admincontroller.php';
require '../API/residentcontroller.php';

// Import JwtHandler class
require_once '../model/jwt.php';

// Set headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE, PUT");


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

// Debugging: log the parsed URI and method
error_log("Parsed URI: " . $uri);
error_log("Request Method: " . $_SERVER['REQUEST_METHOD']);

// Simple router function
function route($uri, $method)
{
    $data = json_decode(file_get_contents('php://input'), true);

    switch (strtolower($uri)) { // Use strtolower for case-insensitive matching
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

        case '/api/v1/user/allnotification':
            if ($method === 'POST') {
                $userController = new UserController();
                $userController->getAllnotifications($data);
            } else {
                http_response_code(405);
                echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
            }
            break;
            // case '/api/v1/user/firstloginwithtoken':
            //     if ($method === 'POST') {
            //         $userController = new UserController();
            //         //am sending the token in the usrl
            //         $data['token'] = $_GET['token'];
            //         $userController->firstloginwithtoken($data);
            //     } else {
            //         http_response_code(405);
            //         echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
            //     }

        case '/api/v1/user/profile':
            if ($method === 'GET') {
                $jwtHandler = new JwtHandler();
                $jwt_token = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
                $jwt_token = str_replace('Bearer ', '', $jwt_token);
                $userController = new UserController();
                $userController->profile($jwt_token);
            } else {
                http_response_code(405);
                echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
            }
            break;

            //change password
        case '/api/v1/user/change-password':
            if ($method === 'POST') {
                $jwtHandler = new JwtHandler();
                $jwt_token = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
                $jwt_token = str_replace('Bearer ', '', $jwt_token);
                $data['jwt'] = $jwt_token;
                $userController = new UserController();
                $userController->changepassword($data);
            } else {
                http_response_code(405);
                echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
            }
            break;
            //check token
        case '/api/v1/user/check-token':
            if ($method === 'POST') {
                $jwtHandler = new JwtHandler();
                $jwt_token = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
                $jwt_token = str_replace('Bearer ', '', $jwt_token);
                //check the jwt validation
                $token_info = $jwtHandler->verifyJwtToken($jwt_token);
                if ($token_info['valid']) {
                    $data['jwt'] = $jwt_token;
                    $userController = new UserController();
                    $userController->checktoken($data);
                } else {
                    http_response_code(401); // Unauthorized
                    echo json_encode([
                        'status' => 'error1',
                        'message' => 'Unauthorized',
                    ]);
                }
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

        case '/api/v1/admin/profile':
            if ($method === 'GET') {
                $jwtHandler = new JwtHandler();
                $jwt_token = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
                $jwt_token = str_replace('Bearer ', '', $jwt_token);
                $token_info = $jwtHandler->verifyJwtToken($jwt_token);
                if ($token_info['valid']) {
                    $adminController = new AdminController();
                    $adminController->profile($jwt_token);
                } else {
                    http_response_code(401); // Unauthorized
                    echo json_encode([
                        'status' => 'error111',
                        'message' => 'Unauthorized',
                    ]);
                }
            } else {
                http_response_code(405);
                echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
            }
            break;
            //admin change password 
        case '/api/v1/admin/change-password':
            if ($method === 'POST') {
                $jwtHandler = new JwtHandler();
                $jwt_token = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
                $jwt_token = str_replace('Bearer ', '', $jwt_token);
                $token_info = $jwtHandler->verifyJwtToken($jwt_token);
                if ($token_info['valid']) {
                    $data['jwt'] = $jwt_token;
                    $adminController = new AdminController();
                    $adminController->changepassword($data);
                } else {
                    http_response_code(401); // Unauthorized
                    echo json_encode([
                        'status' => 'error',
                        'message' => 'Unauthorized',
                    ]);
                }
            } else {
                http_response_code(405);
                echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
            }
            break;

        case '/api/v1/admin/user':
            if ($method === 'POST') {
                $jwtHandler = new JwtHandler();
                $jwt_token = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
                $jwt_token = str_replace('Bearer ', '', $jwt_token);
                $token_info = $jwtHandler->verifyJwtToken($jwt_token);

                if ($token_info['valid'] && $token_info['data']['role'] === 'admin') {
                    $adminController = new AdminController();
                    $adminController->addUserAPI($data);
                } else {
                    http_response_code(401); // Unauthorized
                    echo json_encode([
                        'status' => 'error',
                        'message' => 'Unauthorized',
                    ]);
                }
            } else {
                http_response_code(405);
                echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
            }
            break;

        case '/api/v1/admin/allnotification':
            if ($method === 'GET') {
                $jwtHandler = new JwtHandler();
                $jwt_token = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
                $jwt_token = str_replace('Bearer ', '', $jwt_token);
                $token_info = $jwtHandler->verifyJwtToken($jwt_token);

                if ($token_info['valid'] && $token_info['data']['role'] === 'admin') {
                    $adminController = new AdminController();
                    $adminController->getAllnotificationsAPI($jwt_token);
                } else {
                    http_response_code(401);
                    echo json_encode([
                        'status' => 'error',
                        'message' => 'Unauthorized',
                    ]);
                }
            } else {
                http_response_code(405);
                echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
            }
            break;

            //all reaclamation
        case '/api/v1/admin/allreclamation':
            if ($method === 'GET') {
                $jwtHandler = new JwtHandler();
                $jwt_token = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
                $jwt_token = str_replace('Bearer ', '', $jwt_token);
                $token_info = $jwtHandler->verifyJwtToken($jwt_token);

                if ($token_info['valid'] && $token_info['data']['role'] === 'admin') {
                    $adminController = new AdminController();
                    $adminController->getAllreclamationAPI($jwt_token);
                } else {
                    http_response_code(401);
                    echo json_encode([
                        'status' => 'error',
                        'message' => 'Unauthorized',
                    ]);
                }
            } else {
                http_response_code(405);
                echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
            }
            break;

            //get all facture
        case '/api/v1/admin/allfacture':
            if ($method === 'GET') {
                $jwtHandler = new JwtHandler();
                $jwt_token = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
                $jwt_token = str_replace('Bearer ', '', $jwt_token);
                $token_info = $jwtHandler->verifyJwtToken($jwt_token);

                if ($token_info['valid'] && $token_info['data']['role'] === 'admin') {
                    $adminController = new AdminController();
                    $adminController->getAllfactureAPI($jwt_token);
                } else {
                    http_response_code(401);
                    echo json_encode([
                        'status' => 'error',
                        'message' => 'Unauthorized',
                    ]);
                }
            } else {
                http_response_code(405);
                echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
            }
            break;

        case '/api/v1/admin/statistics':
            if ($method === 'GET') {
                $jwtHandler = new JwtHandler();
                $jwt_token = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
                $jwt_token = str_replace('Bearer ', '', $jwt_token);
                $token_info = $jwtHandler->verifyJwtToken($jwt_token);

                if ($token_info['valid'] && $token_info['data']['role'] === 'admin') {
                    $adminController = new AdminController();
                    $adminController->getStatisticsAPI();
                } else {
                    http_response_code(401);
                    echo json_encode([
                        'status' => 'error',
                        'message' => 'Unauthorized',
                    ]);
                }
            } else {
                http_response_code(405);
                echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
            }
            break;

        default:
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'API not found']);
            break;
    }
}

// Call the router function
route($uri, $_SERVER['REQUEST_METHOD']);
