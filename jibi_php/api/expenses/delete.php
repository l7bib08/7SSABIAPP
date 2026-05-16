<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

session_start();

header("Content-Type: application/json");

require_once "db.php";

if (!isset($_SESSION["user_id"])) {
    echo json_encode([
        'success' => false,
        'error' => "Utilisateur non connecté."
    ]);
    exit;
}

