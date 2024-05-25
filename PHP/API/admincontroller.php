<?php
require_once '../model/Admin.php';
require_once '../model/Database.php';


class AdminController {
    private $admin;

    public function __construct() {
        $database = new Database('admin');
        $this->admin = new Admin($database);
    }

    public function loginAdminAPI($data) {
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
}
?>
