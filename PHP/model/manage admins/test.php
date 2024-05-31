<?php

// $password ="qadsad1";

// $hash = password_hash($password, PASSWORD_DEFAULT);

// echo $hash;

$current_time = date('Y-m-d H:i:s');
$expiration_time = date('Y-m-d H:i:s', strtotime('+1 hour'));

echo "Current Time: $current_time\n";
echo "Expiration Time: $expiration_time\n";
