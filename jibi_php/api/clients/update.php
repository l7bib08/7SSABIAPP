<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

session_start();

header("Content-Type: application/json");

require_once "../../db.php";

if (!isset($_SESSION["user_id"])) {
    echo json_encode([
        "success" => false,
        "error"   => "Utilisateur non connecté."
    ]);
    exit;
}

$client_id = intval($_GET["id"] ?? 0);

if (empty($client_id)) {
    echo json_encode([
        "success" => false,
        "error"   => "ID client invalide."
    ]);
    exit;
}

$data  = json_decode(file_get_contents("php://input"), true);

$name  = trim($data["name"]  ?? "");
$phone = trim($data["phone"] ?? "");
$limit = floatval($data["limit"] ?? 0);

if (empty($name)) {
    echo json_encode([
        "success" => false,
        "error"   => "Le nom du client est obligatoire."
    ]);
    exit;
}

if (empty($phone)) {
    echo json_encode([
        "success" => false,
        "error"   => "Le téléphone est obligatoire."
    ]);
    exit;
}

try {

    $sqlCheck = "SELECT id FROM clients
                 WHERE id = :client_id
                 AND user_id = :user_id";

    $stmtCheck = $conn->prepare($sqlCheck);
    $stmtCheck->execute([
        ":client_id" => $client_id,
        ":user_id"   => $_SESSION["user_id"]
    ]);

    if (!$stmtCheck->fetch()) {
        echo json_encode([
            "success" => false,
            "error"   => "Client introuvable."
        ]);
        exit;
    }

    $sqlUpdate = "UPDATE clients
                  SET nom_complet   = :name,
                      telephone     = :phone,
                      credit_limit  = :limit
                  WHERE id          = :client_id
                  AND user_id       = :user_id";

    $stmtUpdate = $conn->prepare($sqlUpdate);
    $stmtUpdate->execute([
        ":name"      => $name,
        ":phone"     => $phone,
        ":limit"     => $limit,
        ":client_id" => $client_id,
        ":user_id"   => $_SESSION["user_id"]
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Client mis à jour avec succès."
    ]);

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "error"   => $e->getMessage()
    ]);
}


?>