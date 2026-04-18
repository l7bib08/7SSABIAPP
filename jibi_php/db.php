<?php

$host = "localhost";
$username = "root";
$password = "";
$databasename = "gestion_boutique";

try {
    $conn = new PDO("mysql:host=$host;dbname=$databasename", $username, $password);
} catch (PDOException $e) {
    die("Erreur de connexion : " . $e->getMessage());
}

?>