
function addAdmin($nom, $prenom, $email, $mot_de_passe)
{
    global $conn;
    // Hash the password
    $hashed_password = password_hash($mot_de_passe, PASSWORD_DEFAULT);
    // Use prepared statements to prevent SQL injection
    $query = "INSERT INTO admin (nom, prenom, email, mot_de_passe) VALUES ($1, $2, $3, $4)";
    $params = array($nom, $prenom, $email, $hashed_password);
    return pg_query_params($conn, $query, $params);
}