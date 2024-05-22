<?php

$password ="pwd";

$hash = password_hash($password, PASSWORD_DEFAULT);

echo $hash;