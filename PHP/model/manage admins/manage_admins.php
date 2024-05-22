<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Management</title>
</head>

<body>
    <h1>Admin Management</h1>

    <?php
    $host = 'localhost';
    $db = 'houselytics';
    $user = 'postgres';
    $password = '123456789';

    $connection = pg_connect("host=$host dbname=$db user=$user password=$password");

    if (!$connection) {
        die("Error in connection: " . pg_last_error());
    }

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $nom = pg_escape_string($_POST['nom']);
        $prenom = pg_escape_string($_POST['prenom']);
        $email = pg_escape_string($_POST['email']);
        $mot_de_passe = password_hash($_POST['mot_de_passe'], PASSWORD_DEFAULT);

        $query = "INSERT INTO admin (nom, prenom, email, mot_de_passe) VALUES ('$nom', '$prenom', '$email', '$mot_de_passe')";
        $result = pg_query($connection, $query);

        if (!$result) {
            die("Error in SQL query: " . pg_last_error());
        }

        header('Location: manage_admins.php');
    }
    ?>

    <!-- Display Admins -->
    <h2>Admins List</h2>
    <table border="1">
        <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Date de création</th>
        </tr>
        <?php
        $query = "SELECT * FROM admin";
        $result = pg_query($connection, $query);

        if (!$result) {
            die("Error in SQL query: " . pg_last_error());
        }

        $admins = pg_fetch_all($result);

        foreach ($admins as $admin) {
            echo "<tr>";
            echo "<td>{$admin['adm_id']}</td>";
            echo "<td>{$admin['nom']}</td>";
            echo "<td>{$admin['prenom']}</td>";
            echo "<td>{$admin['email']}</td>";
            echo "<td>{$admin['date_creation']}</td>";
            echo "</tr>";
        }
        ?>
    </table>

    <!-- Add New User Form -->
    <h2>Add New User</h2>
    <form method="POST" action="manage_admins.php">
        <label for="nom">Nom:</label><br>
        <input type="text" id="nom" name="nom"><br>
        <label for="prenom">Prénom:</label><br>
        <input type="text" id="prenom" name="prenom"><br>
        <label for="email">Email:</label><br>
        <input type="email" id="email" name="email"><br>
        <label for="mot_de_passe">Mot de passe:</label><br>
        <input type="password" id="mot_de_passe" name="mot_de_passe"><br><br>
        <input type="submit" value="Submit">
    </form>
</body>

</html>