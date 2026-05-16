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

$data = json_decode(file_get_contents("php://input"), true);

$name = trim($data["name"] ?? "");
$phone = trim($data["phone"] ?? "");
$limit = floatval($data["limit"] ?? 0);

if (empty($name)) {
    echo json_encode([
        "success" => false,
        "error" => "Le nom du client est obligatoire."
    ]);
    exit;
}

$sql = "INSERT INTO clients (user_id, nom_complet, telephone, credit_limit)
        VALUES (:user_id, :nom_complet, :telephone, :credit_limit)";

$stmt = $conn->prepare($sql);

$stmt->execute([
    ":user_id" => $_SESSION["user_id"],
    ":nom_complet" => $name,
    ":telephone" => $phone,
    ":credit_limit" => $limit
]);

echo json_encode([
    "success" => true,
    "message" => "Client ajouté avec succès"
]);