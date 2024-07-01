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

    //         this is my table 

    // CREATE TABLE facture (
    //     fac_id       SERIAL PRIMARY KEY,
    //     fac_date     DATE,
    //     fac_type     fac_type_enum,
    //     fac_total    DOUBLE PRECISION,
    //     fac_etat     fac_etat_enum DEFAULT 'en attente',
    //     fac_echeance DATE,
    //     res_id       INT,
    //     FOREIGN KEY (res_id)
    //         REFERENCES residant (res_id) ON DELETE CASCADE
    // );

    // add facture

    public function addFactureAPI($data)
    {
        // Check if all required fields are present
        if (
            isset($data['fac_date']) &&
            isset($data['fac_type']) &&
            isset($data['fac_total']) &&
            isset($data['fac_etat']) &&
            isset($data['fac_echeance']) &&
            isset($data['res_id'])
        ) {
            // Sanitize and validate inputs
            $fac_date = htmlspecialchars($data['fac_date'], ENT_QUOTES, 'UTF-8');
            $fac_type = htmlspecialchars($data['fac_type'], ENT_QUOTES, 'UTF-8');
            $fac_total = filter_var($data['fac_total'], FILTER_VALIDATE_FLOAT);
            $fac_etat = htmlspecialchars($data['fac_etat'], ENT_QUOTES, 'UTF-8');
            $fac_echeance = htmlspecialchars($data['fac_echeance'], ENT_QUOTES, 'UTF-8');
            $res_id = filter_var($data['res_id'], FILTER_VALIDATE_INT);

            // Validate fac_etat against enum values
            $allowed_fac_etats = ['en attente', 'payée', 'en retard'];
            if (!in_array($fac_etat, $allowed_fac_etats)) {
                http_response_code(400); // Bad Request
                echo json_encode(['status' => 'error', 'message' => 'Invalid fac_etat value']);
                return;
            }

            // Validate fac_type against enum values
            $allowed_fac_types = ['electricite', 'eau'];
            if (!in_array($fac_type, $allowed_fac_types)) {
                http_response_code(400); // Bad Request
                echo json_encode(['status' => 'error', 'message' => 'Invalid fac_type value']);
                return;
            }

            // Validate fac_total
            if ($fac_total === false || $fac_total <= 0) {
                http_response_code(400); // Bad Request
                echo json_encode(['status' => 'error', 'message' => 'Invalid fac_total value']);
                return;
            }

            // Validate res_id
            if ($res_id === false || $res_id <= 0) {
                http_response_code(400); // Bad Request
                echo json_encode(['status' => 'error', 'message' => 'Invalid res_id value']);
                return;
            }

            // Validate date format (YYYY-MM-DD)
            $date_format = 'Y-m-d';
            $fac_date_obj = DateTime::createFromFormat($date_format, $fac_date);
            $fac_echeance_obj = DateTime::createFromFormat($date_format, $fac_echeance);

            if (!$fac_date_obj || $fac_date_obj->format($date_format) !== $fac_date) {
                http_response_code(400); // Bad Request
                echo json_encode(['status' => 'error', 'message' => 'Invalid fac_date format. Expected format: YYYY-MM-DD.']);
                return;
            }

            if (!$fac_echeance_obj || $fac_echeance_obj->format($date_format) !== $fac_echeance) {
                http_response_code(400); // Bad Request
                echo json_encode(['status' => 'error', 'message' => 'Invalid fac_echeance format. Expected format: YYYY-MM-DD.']);
                return;
            }

            // Prepare data for insertion
            $factureData = [
                'fac_date' => $fac_date,
                'fac_type' => $fac_type,
                'fac_total' => $fac_total,
                'fac_etat' => $fac_etat,
                'fac_echeance' => $fac_echeance,
                'res_id' => $res_id
            ];

            // Pass sanitized data to the model for insertion
            $response = $this->admin->addFacture($factureData);

            // Respond with success message and HTTP 200 status
            http_response_code(200);
            echo json_encode($response);
        } else {
            // Respond with 400 Bad Request if any required field is missing
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'All required fields must be provided']);
        }
    }

    // Update facture API
    public function updateFactureAPI($data)
    {
        // Check if all required fields are present
        if (
            isset($data['fac_id']) &&
            isset($data['fac_type']) &&
            isset($data['fac_etat']) &&
            isset($data['fac_total'])
        ) {
            // Sanitize and validate inputs
            $fac_id = filter_var($data['fac_id'], FILTER_VALIDATE_INT);
            $fac_type = htmlspecialchars($data['fac_type'], ENT_QUOTES, 'UTF-8');
            $fac_etat = htmlspecialchars($data['fac_etat'], ENT_QUOTES, 'UTF-8');
            $fac_total = filter_var($data['fac_total'], FILTER_VALIDATE_FLOAT);

            // Validate fac_etat against enum values
            $allowed_fac_etats = ['en attente', 'payée', 'en retard'];
            if (!in_array($fac_etat, $allowed_fac_etats)) {
                echo json_encode(['status' => 'error', 'message' => 'Invalid fac_etat value']);
                return;
            }

            // Validate fac_type against enum values
            $allowed_fac_types = ['electricite', 'eau'];
            if (!in_array($fac_type, $allowed_fac_types)) {
                echo json_encode(['status' => 'error', 'message' => 'Invalid fac_type value']);
                return;
            }

            // Check if fac_total is valid
            if ($fac_total === false || $fac_total <= 0) {
                echo json_encode(['status' => 'error', 'message' => 'Invalid fac_total value']);
                return;
            }

            // Prepare data for update
            $factureData = [
                'fac_id' => $fac_id,
                'fac_type' => $fac_type,
                'fac_etat' => $fac_etat,
                'fac_total' => $fac_total
            ];

            // Pass sanitized data to the model for update
            $response = $this->admin->updateFacture($factureData);

            // Respond with success message and HTTP 200 status
            http_response_code(200);
            echo json_encode($response);
        } else {
            // Respond with 400 Bad Request if any required field is missing
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'All required fields must be provided']);
        }
    }

    // Delete facture API
    public function deleteFactureAPI($data)
    {
        // Check if required fields are present in $data
        if (isset($data['fac_id'])) {
            // Sanitize and validate inputs
            $fac_id = filter_var($data['fac_id'], FILTER_VALIDATE_INT);

            // Check if fac_id is valid
            if ($fac_id !== false && $fac_id > 0) {
                // Pass sanitized data to the model for deletion
                $response = $this->admin->deleteFacture($fac_id);
                // Respond with success message and HTTP 200 status
                http_response_code(200);
                echo json_encode($response);
            } else {
                // Respond with 400 Bad Request if fac_id is invalid
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'Invalid fac_id']);
            }
        } else {
            // Respond with 400 Bad Request if fac_id is missing
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'fac_id parameter is required']);
        }
    }

    public function addNotificationAPI($data)
    {
        // Check if all required fields are present
        if (
            isset($data['notif_titre']) &&
            isset($data['notif_desc']) &&
            isset($data['res_id'])
        ) {
            // Sanitize and validate inputs
            $notif_titre = htmlspecialchars($data['notif_titre'], ENT_QUOTES, 'UTF-8');
            $notif_desc = htmlspecialchars($data['notif_desc'], ENT_QUOTES, 'UTF-8');
            $res_id = filter_var($data['res_id'], FILTER_VALIDATE_INT);


            // Validate res_id
            if ($res_id === false || $res_id <= 0) {
                http_response_code(400); // Bad Request
                echo json_encode(['status' => 'error', 'message' => 'Invalid res_id value']);
                return;
            }


            // Prepare data for insertion
            $notificationData = [
                'notif_titre' => $notif_titre,
                'notif_desc' => $notif_desc,
                'res_id' => $res_id,
            ];

            // Pass sanitized data to the model for insertion
            $response = $this->admin->addNotification($notificationData);

            // Respond with success message and HTTP 200 status
            http_response_code(200);
            echo json_encode($response);
        } else {
            http_response_code(400); // Bad Request
            echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
        }
    }

    //get reclamation
    public function getReclamationAPI($jwt)
    {
        if ($jwt) {
            $response = $this->admin->getReclamation();
            http_response_code(200);
            echo json_encode($response);
        } else {
            http_response_code(400);
            echo json_encode(array('status' => 'error', 'message' => 'Invalid JSON data'));
        }
    }

    //update desc only rec_etat so he will get only rec_id and rec_etat
    public function updateReclamationAPI($data)
    {
        // Check if all required fields are present
        if (
            isset($data['rec_id']) &&
            isset($data['rec_etat'])
        ) {
            // Sanitize and validate inputs
            $rec_id = filter_var($data['rec_id'], FILTER_VALIDATE_INT);
            $rec_etat = htmlspecialchars($data['rec_etat'], ENT_QUOTES, 'UTF-8');

            // Validate rec_etat against enum values
            $allowed_rec_etats = ['en attente', 'en cours', 'résolu'];
            if (!in_array($rec_etat, $allowed_rec_etats)) {
                http_response_code(400); // Bad Request
                echo json_encode(['status' => 'error', 'message' => 'Invalid rec_etat value']);
                return;
            }

            // Validate rec_id
            if ($rec_id === false || $rec_id <= 0) {
                http_response_code(400); // Bad Request
                echo json_encode(['status' => 'error', 'message' => 'Invalid rec_id value']);
                return;
            }

            // Prepare data for insertion
            $reclamationData = [
                'rec_id' => $rec_id,
                'rec_etat' => $rec_etat
            ];

            // Pass sanitized data to the model for insertion
            $response = $this->admin->updateReclamation($reclamationData);

            // Respond with success message and HTTP 200 status
            http_response_code(200);
            echo json_encode($response);
        } else {
            http_response_code(400); // Bad Request
            echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
        }
    }


    //delete raclamation
    public function deleteReclamationAPI($data)
    {
        // Check if required fields are present in $data
        if (isset($data['rec_id'])) {
            // Sanitize and validate inputs
            $rec_id = filter_var($data['rec_id'], FILTER_VALIDATE_INT);

            // Check if rec_id is valid
            if ($rec_id !== false && $rec_id > 0) {
                // Pass sanitized data to the model for deletion
                $response = $this->admin->deleteReclamation($rec_id);
                // Respond with success message and HTTP 200 status
                http_response_code(200);
                echo json_encode($response);
            } else {
                // Respond with 400 Bad Request if rec_id is invalid
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'Invalid rec_id']);
            }
        } else {
            // Respond with 400 Bad Request if rec_id is missing
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'rec_id parameter is required']);
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
