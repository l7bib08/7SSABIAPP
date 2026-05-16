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

    $sqlDelete = "DELETE FROM clients
                  WHERE id      = :client_id
                  AND user_id   = :user_id";

    $stmtDelete = $conn->prepare($sqlDelete);
    $stmtDelete->execute([
        ":client_id" => $client_id,
        ":user_id"   => $_SESSION["user_id"]
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Client supprimé avec succès."
    ]);

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "error"   => $e->getMessage()
    ]);
}