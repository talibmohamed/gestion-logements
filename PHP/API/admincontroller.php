<?php
require_once '../model/Admin.php';
require_once '../model/Database.php';


class AdminController
{
    private $admin;

    public function __construct()
    {
        $database = new Database('admin');
        $this->admin = new Admin($database);
    }

    public function loginAdminAPI($data)
    {
        if ($data && isset($data['email']) && isset($data['password'])) {
            $email = $data['email'];
            $password = $data['password'];
            $response = $this->admin->loginAdmin($email, $password);
            http_response_code(200);
            echo json_encode($response);
        } else {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Invalid JSON data']);
        }
    }

    // other methods for the admin

    public function profile($jwt)
    {
        if ($jwt) {
            $response = $this->admin->profile($jwt);
            http_response_code(200);
            echo json_encode($response);
        } else {
            http_response_code(400);
            echo json_encode(array('status' => 'error', 'message' => 'Invalid JSON data'));
        }
    }

    public function changepassword($data)
    {
        if ($data && isset($data['password']) && isset($data['confirmedPassword'])) {
            $jwt = $data['jwt'];
            $password = $data['password'];
            $confirmedPassword = $data['confirmedPassword'];
            $response = $this->admin->changePassword($jwt, $password, $confirmedPassword);
            http_response_code(200);
            echo json_encode($response);
        } else {
            http_response_code(400);
            echo json_encode(array('status' => 'error', 'message' => 'Invalid JSON data'));
        }
    }

    // get all admin notifications
    public function getAllnotificationsAPI($jwt)
    {
        if ($jwt) {
            $response = $this->admin->getAllnotifications($jwt);
            http_response_code(200);
            echo json_encode($response);
        } else {
            http_response_code(400);
            echo json_encode(array('status' => 'error1111', 'message' => 'Invalid JSON data'));
        }
    }


    public function addUserAPI($data)
    {
        if ($data && isset($data['email']) && isset($data['nom']) && isset($data['prenom']) && isset($data['cin']) && isset($data['profession']) && isset($data['is_ameliore'])) {
            $email = $data['email'];
            $userData = [
                'email' => $email,
                'nom' => $data['nom'],
                'prenom' => $data['prenom'],
                'cin' => $data['cin'],
                'profession' => $data['profession'],
                'is_ameliore' => $data['is_ameliore']
            ];

            // Check which optional fields are provided
            $optionalFields = ['telephone'];
            foreach ($optionalFields as $field) {
                if (isset($data[$field])) {
                    $userData[$field] = $data[$field];
                }
            }

            // Add user and send email
            $response = $this->admin->addUserAndSendEmail($userData);

            http_response_code(200);
            echo json_encode($response);
        } else {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Missing required fields.']);
        }
    }

    //all getAllreclamationAPI
    public function getAllreclamationAPI($jwt)
    {
        if ($jwt) {
            $response = $this->admin->getAllreclamation($jwt);
            http_response_code(200);
            echo json_encode($response);
        } else {
            http_response_code(400);
            echo json_encode(array('status' => 'error', 'message' => 'Invalid JSON data'));
        }
    }

    //get all facture 
    public function getAllfactureAPI($jwt)
    {
        if ($jwt) {
            $response = $this->admin->getAllfacture($jwt);
            http_response_code(200);
            echo json_encode($response);
        } else {
            http_response_code(400);
            echo json_encode(array('status' => 'error', 'message' => 'Invalid JSON data'));
        }
    }

    //get statistics
    public function getStatisticsAPI()
    {
        $response = $this->admin->getStatistics();
        http_response_code(200);
        echo json_encode($response);
    }

    //get all logement 
    public function getAlllogmentAPI($jwt)
    {
        if ($jwt) {
            $response = $this->admin->getAlllogement();
            http_response_code(200);
            echo json_encode($response);
        } else {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Invalid JSON data']);
        }
    }

    //add logement
    public function addLogementAPI($data)
    {
        if ($data && isset($data['type_log']) && isset($data['is_ameliore']) && isset($data['piece']) && isset($data['mc']) && isset($data['address'])) {

            // Sanitize and validate inputs
            $type_log = htmlspecialchars($data['type_log'], ENT_QUOTES, 'UTF-8');
            $is_ameliore = filter_var($data['is_ameliore'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            $piece = filter_var($data['piece'], FILTER_VALIDATE_INT);
            $mc = filter_var($data['mc'], FILTER_VALIDATE_FLOAT);
            $address = htmlspecialchars($data['address'], ENT_QUOTES, 'UTF-8');

            if ($type_log && $is_ameliore !== null && $piece !== false && $mc !== false && $address) {
                // Pass sanitized data to the model
                $response = $this->admin->addLogement([
                    'type_log' => $type_log,
                    'is_ameliore' => $is_ameliore,
                    'piece' => $piece,
                    'mc' => $mc,
                    'address' => $address
                ]);
                http_response_code(200);
                echo json_encode($response);
            } else {
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'Invalid input data11']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Invalid JSON data22']);
        }
    }
    public function updateLogementAPI($data)
    {
        // Check if required fields are present in $data
        if (
            isset($data['log_id']) &&
            isset($data['type_log']) &&
            isset($data['is_ameliore']) &&
            isset($data['piece']) &&
            isset($data['mc']) &&
            isset($data['address'])
        ) {
            // Sanitize and validate inputs
            $log_id = filter_var($data['log_id'], FILTER_VALIDATE_INT);
            $type_log = htmlspecialchars($data['type_log'], ENT_QUOTES, 'UTF-8');
            $is_ameliore = filter_var($data['is_ameliore'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            $piece = filter_var($data['piece'], FILTER_VALIDATE_INT);
            $mc = filter_var($data['mc'], FILTER_VALIDATE_FLOAT);
            $address = htmlspecialchars($data['address'], ENT_QUOTES, 'UTF-8');

            // Check if all inputs are valid
            if ($log_id !== false && $type_log && $is_ameliore !== null && $piece !== false && $mc !== false && $address) {
                // Pass sanitized data to the model for update
                $response = $this->admin->updateLogement([
                    'log_id' => $log_id,
                    'type_log' => $type_log,
                    'is_ameliore' => $is_ameliore,
                    'piece' => $piece,
                    'mc' => $mc,
                    'address' => $address
                ]);

                // Respond with success message and HTTP 200 status
                http_response_code(200);
                echo json_encode($response);
            } else {
                // Respond with 400 Bad Request if input validation fails
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'Invalid input data']);
            }
        } else {
            // Respond with 400 Bad Request if required fields are missing
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Invalid JSON data']);
        }
    }


    // Delete logement
    public function deleteLogementAPI($data)
    {
        // Check if required fields are present in $data
        if (isset($data['log_id'])) {
            // Sanitize and validate inputs
            $log_id = filter_var($data['log_id'], FILTER_VALIDATE_INT);

            // Check if log_id is valid
            if ($log_id !== false && $log_id > 0) {
                // Pass sanitized data to the model for deletion
                $response = $this->admin->deleteLogement($log_id);
                // Respond with success message and HTTP 200 status
                http_response_code(200);
                echo json_encode($response);
            } else {
                // Respond with 400 Bad Request if log_id is invalid
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'Invalid log_id']);
            }
        } else {
            // Respond with 400 Bad Request if log_id is missing
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'log_id parameter is required']);
        }
    }





    //the web socket controller 
    // public function broadcastMessage($message)
    // {
    //     // Connect to the WebSocket server and broadcast the message
    //     $host = '127.0.0.1';
    //     $port = 8080;
    //     $socket = fsockopen($host, $port, $errno, $errstr, 30);
    //     if (!$socket) {
    //         echo "$errstr ($errno)<br />\n";
    //     } else {
    //         fwrite($socket, $message);
    //         fclose($socket);
    //     }
    // }
}
