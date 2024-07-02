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


        case '/api/v1/user/notification':
            $jwtHandler = new JwtHandler();
            $jwt_token = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
            $jwt_token = str_replace('Bearer ', '', $jwt_token);
            $token_info = $jwtHandler->verifyJwtToken($jwt_token);

            if ($token_info['valid'] && $token_info['data']['role'] === 'admin') {
                $adminController = new AdminController();
                $userController = new UserController();
                $data = json_decode(file_get_contents("php://input"), true);

                switch ($method) {
                    case 'GET':
                        // $adminController->getAllNotifications($data);
                        break;

                    case 'POST':
                        $adminController->addNotificationAPI($data);
                        break;

                    default:
                        http_response_code(405);
                        echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
                        break;
                }
            } else {
                http_response_code(401);
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Unauthorized',
                ]);
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

        case '/api/v1/user/statistics':
            if ($method === 'GET') {
                $jwtHandler = new JwtHandler();
                $jwt_token = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
                $jwt_token = str_replace('Bearer ', '', $jwt_token);

                // Validate the JWT token
                $token_info = $jwtHandler->verifyJwtToken($jwt_token);

                if ($token_info['valid']) {
                    $data['jwt'] = $jwt_token;
                    $userController = new UserController();
                    $response = $userController->getStatisticsAPI($data);

                    // Output the response as JSON
                    http_response_code(200);
                    echo json_encode($response);
                } else {
                    http_response_code(401); // Unauthorized
                    echo json_encode([
                        'status' => 'error',
                        'message' => 'Unauthorized',
                    ]);
                }
            } else {
                http_response_code(405); // Method Not Allowed
                echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
            }
            break;


            //get user facure 
        case '/api/v1/user/facture':
            if ($method === 'GET') {
                $jwtHandler = new JwtHandler();
                $jwt_token = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
                $jwt_token = str_replace('Bearer ', '', $jwt_token);

                // Validate the JWT token
                $token_info = $jwtHandler->verifyJwtToken($jwt_token);

                if ($token_info['valid']) {
                    $data['jwt'] = $jwt_token;
                    $userController = new UserController();
                    $userController->getFactureAPI($data);
                } else {
                    http_response_code(401); // Unauthorized
                    echo json_encode([
                        'status' => 'error',
                        'message' => 'Unauthorized',
                    ]);
                    exit;
                }
            } else {
                http_response_code(405); // Method Not Allowed
                echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
                exit;
            }
            break;

        case '/api/v1/user/reclamation':
            switch ($method) {
                case 'GET':
                    $jwtHandler = new JwtHandler();
                    $jwt_token = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
                    $jwt_token = str_replace('Bearer ', '', $jwt_token);
                    // Check the JWT validation
                    $token_info = $jwtHandler->verifyJwtToken($jwt_token);
                    if ($token_info['valid']) {
                        $data['jwt'] = $jwt_token;
                        $userController = new UserController();
                        $userController->getReclamationAPI($data);
                    } else {
                        http_response_code(401); // Unauthorized
                        echo json_encode([
                            'status' => 'error',
                            'message' => 'Unauthorized',
                        ]);
                        exit;
                    }
                    break;

                case 'POST':
                    $jwtHandler = new JwtHandler();
                    $jwt_token = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
                    $jwt_token = str_replace('Bearer ', '', $jwt_token);

                    // Validate the JWT token
                    $token_info = $jwtHandler->verifyJwtToken($jwt_token);

                    if ($token_info['valid']) {
                        // Get the input data from the PUT request
                        $input = json_decode(file_get_contents('php://input'), true);

                        if (isset($input['rec_id'])) {
                            $data['jwt'] = $jwt_token;
                            $data['rec_id'] = $input['rec_id'];
                            $userController = new UserController();
                            $response = $userController->updateReclamationStatusAPI($data);

                            // Check if the update was successful
                            if ($response['status'] === 'success') {
                                http_response_code(200); // OK
                                echo json_encode($response);
                            } else {
                                http_response_code(400); // Bad Request or other appropriate code
                                echo json_encode($response);
                            }
                        } else {
                            http_response_code(400); // Bad Request
                            echo json_encode([
                                'status' => 'error',
                                'message' => 'Missing required parameters',
                            ]);
                        }
                    } else {
                        http_response_code(401); // Unauthorized
                        echo json_encode([
                            'status' => 'error',
                            'message' => 'Unauthorized',
                        ]);
                    }
                    exit;
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


            // Handle /api/v1/admin/facture endpoint
        case '/api/v1/admin/facture':
            $jwtHandler = new JwtHandler();
            $jwt_token = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
            $jwt_token = str_replace('Bearer ', '', $jwt_token);
            $token_info = $jwtHandler->verifyJwtToken($jwt_token);

            if ($token_info['valid'] && $token_info['data']['role'] === 'admin') {
                $adminController = new AdminController();

                // Method Handling
                switch ($method) {
                    case 'GET':
                        $adminController->getAllfactureAPI($jwt_token);
                        break;
                    case 'POST':
                        $data = json_decode(file_get_contents('php://input'), true);
                        $adminController->addFactureAPI($data);
                        break;

                    case 'PUT':
                        // For PUT method (update facture)
                        $data = json_decode(file_get_contents('php://input'), true);
                        $adminController->updateFactureAPI($data);
                        break;

                    case 'DELETE':
                        // For DELETE method (delete facture)
                        $data = json_decode(file_get_contents('php://input'), true);
                        $adminController->deleteFactureAPI($data);
                        break;

                    default:
                        http_response_code(405); // Method Not Allowed
                        echo json_encode([
                            'status' => 'error',
                            'message' => 'Method Not Allowed',
                        ]);
                        break;
                }
            } else {
                http_response_code(401); // Unauthorized
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Unauthorized - Invalid token or role',
                ]);
            }
            break;

        case '/api/v1/admin/statistics':
            $jwtHandler = new JwtHandler();
            $jwt_token = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
            $jwt_token = str_replace('Bearer ', '', $jwt_token);
            $token_info = $jwtHandler->verifyJwtToken($jwt_token);

            if ($token_info['valid'] && $token_info['data']['role'] === 'admin') {
                $adminController = new AdminController();

                switch ($method) {
                    case 'GET':
                        $adminController->getStatisticsAPI();
                        break;

                    default:
                        http_response_code(405); // Method Not Allowed
                        echo json_encode([
                            'status' => 'error',
                            'message' => 'Method Not Allowed',
                        ]);
                        break;
                }
            } else {
                http_response_code(401); // Unauthorized
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Unauthorized',
                ]);
            }
            break;


        case '/api/v1/admin/logement':
            $jwtHandler = new JwtHandler();
            $jwt_token = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
            $jwt_token = str_replace('Bearer ', '', $jwt_token);
            $token_info = $jwtHandler->verifyJwtToken($jwt_token);

            if ($token_info['valid'] && $token_info['data']['role'] === 'admin') {
                $adminController = new AdminController();

                switch ($method) {
                    case 'GET':
                        $adminController->getAllLogmentAPI($jwt_token);
                        break;
                    case 'POST':
                        $data = json_decode(file_get_contents('php://input'), true);
                        $adminController->addLogementAPI($data);
                        break;
                    case 'PUT':
                        $data = json_decode(file_get_contents('php://input'), true);
                        $adminController->updateLogementAPI($data);
                        break;
                    case 'DELETE':
                        $data = json_decode(file_get_contents('php://input'), true);
                        $adminController->deleteLogementAPI($data);
                        break;
                    default:
                        http_response_code(405); // Method Not Allowed
                        echo json_encode([
                            'status' => 'error',
                            'message' => 'Method Not Allowed',
                        ]);
                        break;
                }
            } else {
                http_response_code(401); // Unauthorized
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Unauthorized',
                ]);
            }
            break;

            //do the same to residants
        case '/api/v1/admin/residant':
            $jwtHandler = new JwtHandler();
            $jwt_token = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
            $jwt_token = str_replace('Bearer ', '', $jwt_token);
            $token_info = $jwtHandler->verifyJwtToken($jwt_token);

            if ($token_info['valid'] && $token_info['data']['role'] === 'admin') {
                $adminController = new AdminController();

                switch ($method) {
                    case 'GET':
                        $adminController->getAllResidantAPI($jwt_token);
                        break;
                    case 'POST':
                        $data = json_decode(file_get_contents('php://input'), true);
                        $adminController->addResidentAPI($data);
                        break;
                    case 'PUT':
                        $data = json_decode(file_get_contents('php://input'), true);
                        $adminController->updateResidentAPI($data);
                        break;
                    case 'DELETE':
                        $data = json_decode(file_get_contents('php://input'), true);
                        $adminController->deleteResidentAPI($data);
                        break;
                    default:
                        http_response_code(405); // Method Not Allowed
                        echo json_encode([
                            'status' => 'error',
                            'message' => 'Method Not Allowed',
                        ]);
                        break;
                }
            } else {
                http_response_code(401); // Unauthorized
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Unauthorized',
                ]);
            }
            break;


        case '/api/v1/admin/notification':
            $jwtHandler = new JwtHandler();
            $jwt_token = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
            $jwt_token = str_replace('Bearer ', '', $jwt_token);
            $token_info = $jwtHandler->verifyJwtToken($jwt_token);

            if ($token_info['valid'] && $token_info['data']['role'] === 'admin') {
                $adminController = new AdminController();
                $data = json_decode(file_get_contents("php://input"), true);

                switch ($method) {
                    case 'GET':
                        // $adminController->getAllNotifications($data);
                        break;

                    case 'POST':
                        $adminController->addNotificationAPI($data);
                        break;

                    default:
                        http_response_code(405);
                        echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
                        break;
                }
            } else {
                http_response_code(401);
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Unauthorized',
                ]);
            }
            break;

        case '/api/v1/admin/reclamation':
            $jwtHandler = new JwtHandler();
            $jwt_token = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
            $jwt_token = str_replace('Bearer ', '', $jwt_token);
            $token_info = $jwtHandler->verifyJwtToken($jwt_token);

            if ($token_info['valid'] && $token_info['data']['role'] === 'admin') {
                $adminController = new AdminController();

                switch ($method) {
                    case 'GET':
                        $adminController->getReclamationAPI($jwt_token);
                        break;
                    case 'PUT':
                        $data = json_decode(file_get_contents('php://input'), true);
                        $adminController->updateReclamationAPI($data);
                        break;
                    case 'DELETE':
                        $data = json_decode(file_get_contents('php://input'), true);
                        $adminController->deleteReclamationAPI($data);
                        break;
                    default:
                        http_response_code(405); // Method Not Allowed
                        echo json_encode([
                            'status' => 'error',
                            'message' => 'Method Not Allowed',
                        ]);
                        break;
                }
            } else {
                http_response_code(401); // Unauthorized
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Unauthorized',
                ]);
            }
            break;

        case '/api/v1/admin/consommation':
            $jwtHandler = new JwtHandler();
            $jwt_token = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
            $jwt_token = str_replace('Bearer ', '', $jwt_token);
            $token_info = $jwtHandler->verifyJwtToken($jwt_token);

            if ($token_info['valid'] && $token_info['data']['role'] === 'admin') {
                $adminController = new AdminController();

                switch ($method) {
                    case 'GET':
                        $adminController->getConsommationAPI($jwt_token);
                        break;
                    case 'PUT':
                        $data = json_decode(file_get_contents('php://input'), true);
                        $adminController->updateConsommationAPI($data);
                        break;

                    default:
                        http_response_code(405); // Method Not Allowed
                        echo json_encode([
                            'status' => 'error',
                            'message' => 'Method Not Allowed',
                        ]);
                        break;
                }
            } else {
                http_response_code(401); // Unauthorized
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Unauthorized',
                ]);
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
