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
    public function getAllnotifications($data) {
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



    //other resident methodes

}
