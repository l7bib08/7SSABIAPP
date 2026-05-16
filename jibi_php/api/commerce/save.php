<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

session_start();

header("Content-Type: application/json");

require_once "../../db.php";

if (!isset($_SESSION["user_id"])) {
    echo json_encode(["success" => false, "error" => "Non connecté."]);
    exit;
}

$data      = json_decode(file_get_contents("php://input"), true);
$nom       = trim($data["nom"]       ?? "");
$adresse   = trim($data["adresse"]   ?? "");
$telephone = trim($data["telephone"] ?? "");

if (empty($nom)) {
    echo json_encode(["success" => false, "error" => "Le nom du commerce est obligatoire."]);
    exit;
}

try {
    $sql = "INSERT INTO commerce (user_id, nom, adresse, telephone)
            VALUES (:user_id, :nom, :adresse, :telephone)
            ON DUPLICATE KEY UPDATE
                nom       = VALUES(nom),
                adresse   = VALUES(adresse),
                telephone = VALUES(telephone)";

    $stmt = $conn->prepare($sql);
    $stmt->execute([
        ":user_id"   => $_SESSION["user_id"],
        ":nom"       => $nom,
        ":adresse"   => $adresse,
        ":telephone" => $telephone
    ]);

    echo json_encode(["success" => true, "message" => "Commerce sauvegardé."]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}