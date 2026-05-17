<?php
session_start();

header("Content-Type: application/json");

require_once "../../db.php";

if (!isset($_SESSION["user_id"])) {
    echo json_encode([
        "success" => false,
        "error" => "Utilisateur non connecté."
    ]);
    exit;
}

$sql = "SELECT 
            id,
            nom_complet AS name,
            telephone AS phone,
            credit_limit,
            dette AS debt,
            image
        FROM clients
        WHERE user_id = :user_id
        ORDER BY id DESC";

$stmt = $conn->prepare($sql);

$stmt->execute([
    ":user_id" => $_SESSION["user_id"]
]);

$clients = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    "success" => true,
    "clients" => $clients
]);