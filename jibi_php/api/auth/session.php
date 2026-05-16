<?php
session_start();

header("Content-Type: application/json");

require_once "../../db.php";

if (!isset($_SESSION["user_id"])) {
    echo json_encode([
        "success" => false,
        "error" => "Non connecté."
    ]);
    exit;
}

echo json_encode([
    "success" => true,
    "user" => [
        "id"    => $_SESSION["user_id"],
        "name"  => $_SESSION["user_name"],
        "email" => $_SESSION["user_email"]
    ]
]);

?>