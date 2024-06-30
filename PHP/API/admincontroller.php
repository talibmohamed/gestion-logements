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

    // Add logement via API
    public function addLogementAPI($data)
    {
        // Check if all required fields are present
        if (
            isset($data['type_log']) &&
            isset($data['is_ameliore']) &&
            isset($data['piece']) &&
            isset($data['mc']) &&
            isset($data['address']) &&
            isset($data['statut'])
        ) {
            // Sanitize and validate inputs
            $type_log = htmlspecialchars($data['type_log'], ENT_QUOTES, 'UTF-8');
            $is_ameliore = filter_var($data['is_ameliore'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            $piece = filter_var($data['piece'], FILTER_VALIDATE_INT);
            $mc = filter_var($data['mc'], FILTER_VALIDATE_FLOAT);
            $address = htmlspecialchars($data['address'], ENT_QUOTES, 'UTF-8');
            $statut = htmlspecialchars($data['statut'], ENT_QUOTES, 'UTF-8');

            // Validate statut against enum values
            $allowed_statuts = ['disponible', 'en_maintenance', 'occupé', 'non_disponible', 'autre'];
            if (!in_array($statut, $allowed_statuts)) {
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'Invalid statut value']);
                return;
            }

            // Ensure boolean values are correctly interpreted
            if ($is_ameliore === null) {
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'Invalid is_ameliore value']);
                return;
            }

            // Check if all inputs are valid
            if ($type_log && $piece !== false && $mc !== false && $address) {
                // Pass sanitized data to the model for insertion
                $response = $this->admin->addLogement([
                    'type_log' => $type_log,
                    'is_ameliore' => $is_ameliore,
                    'piece' => $piece,
                    'mc' => $mc,
                    'address' => $address,
                    'statut' => $statut
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


    public function updateLogementAPI($data)
    {
        // Check if required fields are present in $data
        if (
            isset($data['log_id']) &&
            isset($data['type_log']) &&
            isset($data['is_ameliore']) &&
            isset($data['piece']) &&
            isset($data['mc']) &&
            isset($data['address']) &&
            isset($data['statut'])
        ) {
            // Sanitize and validate inputs
            $log_id = filter_var($data['log_id'], FILTER_VALIDATE_INT);
            $type_log = htmlspecialchars($data['type_log'], ENT_QUOTES, 'UTF-8');
            $is_ameliore = filter_var($data['is_ameliore'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            $piece = filter_var($data['piece'], FILTER_VALIDATE_INT);
            $mc = filter_var($data['mc'], FILTER_VALIDATE_FLOAT);
            $address = htmlspecialchars($data['address'], ENT_QUOTES, 'UTF-8');
            $statut = htmlspecialchars($data['statut'], ENT_QUOTES, 'UTF-8');

            // Validate statut against enum values
            $allowed_statuts = ['disponible', 'en_maintenance', 'occupé', 'non_disponible'];
            if (!in_array($statut, $allowed_statuts)) {
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'Invalid statut value']);
                return;
            }

            // Check if all inputs are valid
            if ($log_id !== false && $type_log && $is_ameliore !== null && $piece !== false && $mc !== false && $address) {
                // Pass sanitized data to the model for update
                $response = $this->admin->updateLogement([
                    'log_id' => $log_id,
                    'type_log' => $type_log,
                    'is_ameliore' => $is_ameliore,
                    'piece' => $piece,
                    'mc' => $mc,
                    'address' => $address,
                    'statut' => $statut
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


    // Delete logement API
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

    //get all user
    public function getAllResidantAPI($jwt)
    {
        if ($jwt) {
            $response = $this->admin->getAllResidant();
            http_response_code(200);
            echo json_encode($response);
        } else {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Invalid JSON data']);
        }
    }


 public function addResidentAPI($data)
{
    if ($data) {
        // Define required fields and initialize missing fields array
        $requiredFields = ['email', 'nom', 'prenom', 'cin', 'profession'];
        $missingFields = [];

        $data['is_ameliore'] = $data['is_ameliore'] ? 'TRUE' : 'FALSE';


        // Trim and sanitize fields
        $data = array_map('trim', $data);
        $data['email'] = filter_var($data['email'], FILTER_SANITIZE_EMAIL);

        // Check for missing required fields
        foreach ($requiredFields as $field) {
            if (!isset($data[$field]) || empty($data[$field])) {
                $missingFields[] = $field;
            }
        }

        // If there are missing required fields, return an error response
        if (!empty($missingFields)) {
            echo json_encode(['status' => 'error', 'message' => 'Missing required fields: ' . implode(', ', $missingFields)]);
            return;
        }

        // Validate email format
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            echo json_encode(['status' => 'error', 'message' => 'Invalid email format.']);
            return;
        }

        // Validate CIN format (assuming alphanumeric with specific length)
        if (!preg_match('/^[a-zA-Z0-9]{4,10}$/', $data['cin'])) {
            echo json_encode(['status' => 'error', 'message' => 'Invalid CIN format.']);
            return;
        }

        // Validate is_ameliore (ensure it's a boolean)
        $isAmeliore = filter_var($data['is_ameliore'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
        if ($isAmeliore === null) {
            echo json_encode(['status' => 'error', 'message' => 'Invalid value for is_ameliore. Must be a boolean.']);
            return;
        }

        // Prepare user data
        $userData = [
            'email' => $data['email'],
            'nom' => $data['nom'],
            'prenom' => $data['prenom'],
            'cin' => $data['cin'],
            'profession' => $data['profession'],
            'is_ameliore' => $isAmeliore
        ];

        // Check if telephone field is provided and add to user data
        if (isset($data['telephone'])) {
            $userData['telephone'] = $data['telephone'];
        }

        // Add resident and send response
        $response = $this->admin->addResident($userData);

        http_response_code(200);
        echo json_encode($response);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No data provided.']);
    }
}
    
    // Controller method to update resident information
    public function updateResidentAPI($data)
    {
        if ($data) {
            // Check for required fields including res_id
            $requiredFields = ['res_id', 'email', 'nom', 'prenom', 'cin', 'profession', 'is_ameliore'];
            $missingFields = [];

            $data['is_ameliore'] = $data['is_ameliore'] ? 'TRUE' : 'FALSE';

            // Check for missing required fields
            foreach ($requiredFields as $field) {
                if (!isset($data[$field]) || empty($data[$field])) {
                    $missingFields[] = $field;
                }
            }
    
            if (!empty($missingFields)) {
                echo json_encode(['status' => 'error', 'message' => 'Missing required fields: ' . implode(', ', $missingFields)]);
                return;
            }
    
            // Validate email
            if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                echo json_encode(['status' => 'error', 'message' => 'Invalid email format.']);
                return;
            }
    
            // Validate CIN (assuming it's alphanumeric and of a certain length)
            if (!preg_match('/^[a-zA-Z0-9]{6,10}$/', $data['cin'])) {
                echo json_encode(['status' => 'error', 'message' => 'Invalid CIN format.']);
                return;
            }
    
            // Convert is_ameliore to boolean
            $isAmeliore = filter_var($data['is_ameliore'], FILTER_VALIDATE_BOOLEAN);
    
            if ($isAmeliore === null) {
                echo json_encode(['status' => 'error', 'message' => 'Invalid value for is_ameliore. Must be a boolean.']);
                return;
            }
    
            // Prepare user data
            $res_id = $data['res_id'];
            $email = $data['email'];
            $userData = [
                'res_id' => $res_id,
                'email' => $email,
                'nom' => $data['nom'],
                'prenom' => $data['prenom'],
                'cin' => $data['cin'],
                'profession' => $data['profession'],
                'is_ameliore' => $isAmeliore
            ];
    
            // Check which optional fields are provided
            $optionalFields = ['telephone'];
            foreach ($optionalFields as $field) {
                if (isset($data[$field])) {
                    $userData[$field] = $data[$field];
                }
            }
    
            // Update resident in the model
            $response = $this->admin->updateResident($userData);
    
            http_response_code(200);
            echo json_encode($response);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'No data provided.']);
        }
    }
    

    // Delete resident API
    public function deleteResidentAPI($data)
    {
        // Check if required fields are present in $data
        if (isset($data['res_id'])) {
            // Sanitize and validate inputs
            $res_id = filter_var($data['res_id'], FILTER_VALIDATE_INT);

            // Check if res_id is valid
            if ($res_id !== false && $res_id > 0) {
                // Pass sanitized data to the model for deletion
                $response = $this->admin->deleteResident($res_id);
                // Respond with success message and HTTP 200 status
                http_response_code(200);
                echo json_encode($response);
            } else {
                // Respond with 400 Bad Request if res_id is invalid
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'Invalid res_id']);
            }
        } else {
            // Respond with 400 Bad Request if res_id is missing
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'res_id parameter is required']);
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

        //add facture 
        // public function addFactureAPI($data)
        // {
        //     // Check if all required fields are present
        //     if (
        //         isset($data['montant']) &&
        //         isset($data['date']) &&
        //         isset($data['res_id']) &&
        //         isset($data['log_id'])
        //     ) {
        //         // Sanitize and validate inputs
        //         $montant = filter_var($data['montant'], FILTER_VALIDATE_FLOAT);
        //         $date = htmlspecialchars($data['date'], ENT_QUOTES, 'UTF-8');
        //         $res_id = filter_var($data['res_id'], FILTER_VALIDATE_INT);
        //         $log_id = filter_var($data['log_id'], FILTER_VALIDATE_INT);

        //         // Check if all inputs are valid
        //         if ($montant !== false && $date && $res_id !== false && $log_id !== false) {
        //             // Pass sanitized data to the model for insertion
        //             $response = $this->admin->addFacture([
        //                 'montant' => $montant,
        //                 'date' => $date,
        //                 'res_id' => $res_id,
        //                 'log_id' => $log_id
        //             ]);

        //             // Respond with success message and HTTP 200 status
        //             http_response_code(200);
        //             echo json_encode($response);
        //         } else {
        //             // Respond with 400 Bad Request if input validation fails
        //             http_response_code(400);
        //             echo json_encode(['status' => 'error', 'message' => 'Invalid input data']);
        //         }
        //     } else {
        //         // Respond with 400 Bad Request if required fields are missing
        //         http_response_code(400);
        //         echo json_encode(['status' => 'error', 'message' => 'Invalid JSON data']);
        //     }
        // }



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
