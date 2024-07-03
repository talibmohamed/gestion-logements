<?php
require_once '../model/database.php';
require_once '../model/residant.php';
require_once '../model/jwt.php';

class UserController
{
    private $residant;

    public function __construct()
    {
        $database = new Database('resident');
        $this->residant = new Residant($database);
    }

    public function loginUser($data)
    {
        if ($data && isset($data['email']) && isset($data['password'])) {
            $email = $data['email'];
            $password = $data['password'];
            $response = $this->residant->loginUser($email, $password);
            http_response_code(200);
            echo json_encode($response);
        } else {
            http_response_code(400);
            echo json_encode(array('status' => 'error', 'message' => 'Invalid JSON data'));
        }
    }

    // we wont pass the red_id in the data but we will get it from the jwt
    public function getAllnotifications($data)
    {
        if ($data && isset($data['res_id'])) {
            $res_id = $data['res_id'];
            $response = $this->residant->getAllnotifications($res_id);
            http_response_code(200);
            echo json_encode($response);
        } else {
            http_response_code(400);
            echo json_encode(array('status' => 'error', 'message' => 'Invalid JSON data'));
        }
    }

    //profile where we gonna
    public function profile($jwt)
    {
        if ($jwt) {
            $response = $this->residant->profile($jwt);
            http_response_code(200);
            echo json_encode($response);
        } else {
            http_response_code(400);
            echo json_encode(array('status' => 'error', 'message' => 'Invalid JSON data'));
        }
    }

    //change password
    public function changepassword($data)
    {
        if ($data && isset($data['jwt']) && isset($data['password']) && isset($data['confirmedPassword'])) {
            $jwt = $data['jwt'];
            $password = $data['password'];
            $confirmedPassword = $data['confirmedPassword'];
            $response = $this->residant->changepassword($jwt, $password, $confirmedPassword);

            http_response_code(200);
            echo json_encode($response);
        } else {
            http_response_code(400);
            echo json_encode(array('status' => 'error', 'message' => 'Invalid JSON data'));
        }
    }

    //check token
    public function checktoken($data)
    {
        if ($data && isset($data['jwt'])) {
            $jwt = $data['jwt'];
            $response = $this->residant->checktoken($jwt);
            http_response_code(200);
            echo json_encode($response);
        } else {
            http_response_code(400);
            echo json_encode(array('status' => 'error', 'message' => 'Invalid JSON data'));
        }
    }


    public function getStatisticsAPI($data)
    {
        if ($data && isset($data['jwt'])) {
            $jwtHandler = new JwtHandler();
            $token_info = $jwtHandler->verifyJwtToken($data['jwt']);

            if ($token_info['valid']) {
                // Call the method to get statistics
                $response = $this->residant->getStatistics($data['jwt']);

                // Output the response as JSON and stop further execution
                http_response_code(200);
                echo json_encode($response);
                exit;
            } else {
                http_response_code(401); // Unauthorized
                echo json_encode(array('status' => 'error', 'message' => 'Unauthorized'));
                exit;
            }
        } else {
            http_response_code(400);
            echo json_encode(array('status' => 'error', 'message' => 'Invalid JSON data'));
            exit;
        }
    }

    public function getFactureAPI($data)
    {
        if ($data && isset($data['jwt'])) {
            $jwtHandler = new JwtHandler();
            $token_info = $jwtHandler->verifyJwtToken($data['jwt']);

            if ($token_info['valid']) {
                // Extract user ID from the decoded token data

                // Call the method to get facture data
                $response = $this->residant->getFactures($data['jwt']);

                // Output the response as JSON and stop further execution
                http_response_code(200);
                echo json_encode($response);
                exit;
            } else {
                http_response_code(401); // Unauthorized
                echo json_encode(array('status' => 'error', 'message' => 'Unauthorized'));
                exit;
            }
        } else {
            http_response_code(400);
            echo json_encode(array('status' => 'error', 'message' => 'Invalid JSON data'));
            exit;
        }
    }

    //getReclamationAPI
    public function getReclamationAPI($data)
    {
        if ($data && isset($data['jwt'])) {
            $jwtHandler = new JwtHandler();
            $token_info = $jwtHandler->verifyJwtToken($data['jwt']);

            if ($token_info['valid']) {
                // Extract user ID from the decoded token data

                // Call the method to get facture data
                $response = $this->residant->getReclamations($data['jwt']);

                // Output the response as JSON and stop further execution
                http_response_code(200);
                echo json_encode($response);
                exit;
            } else {
                http_response_code(401); // Unauthorized
                echo json_encode(array('status' => 'error', 'message' => 'Unauthorized'));
                exit;
            }
        } else {
            http_response_code(400);
            echo json_encode(array('status' => 'error', 'message' => 'Invalid JSON data'));
            exit;
        }
    }

    //updateReclamationStatusAPI
    public function updateReclamationStatusAPI($data)
    {
        if ($data && isset($data['jwt']) && isset($data['rec_id'])) {

            // Extract user ID from the decoded token 

            $rec_id = filter_var($data['rec_id'], FILTER_VALIDATE_INT);

            // Call the method to get facture data
            $response = $this->residant->updateReclamationStatus($data['jwt'], $rec_id);

            // Output the response as JSON and stop further execution
            http_response_code(200);
            echo json_encode($response);
            exit;
        } else {
            http_response_code(400);
            echo json_encode(array('status' => 'error11', 'message' => 'Invalid JSON data'));
            exit;
        }
    }
    // Method to add a reclamation
    public function addReclamationAPI($data)
    {
        // Check if all required data is present
        if (isset($data['res_id'], $data['rec_type'], $data['rec_desc'])) {

            // Sanitize input data
            $title = filter_var($data['rec_type']);
            $description = filter_var($data['rec_desc']);

            // Call the method to add reclamation
            $response = $this->residant->addReclamation($data['res_id'], $title, $description);

            // Output the response as JSON and stop further execution
            http_response_code(200);
            echo json_encode($response);
            exit;
        } else {
            // Handle missing or invalid data
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Missing or invalid data']);
            exit;
        }
    }
}
