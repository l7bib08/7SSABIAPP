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

$data      = json_decode(file_get_contents("php://input"), true);

$client_id = intval($data["client_id"] ?? 0);
$amount    = floatval($data["amount"]    ?? 0);

if (empty($client_id)) {
    echo json_encode([
        "success" => false,
        "error"   => "Client invalide."
    ]);
    exit;
}

if ($amount <= 0) {
    echo json_encode([
        "success" => false,
        "error"   => "Le montant doit être supérieur à 0."
    ]);
    exit;
}

try {
    $conn->beginTransaction();

    // 1. Insérer le paiement
    $sql = "INSERT INTO payments (client_id, user_id, amount)
            VALUES (:client_id, :user_id, :amount)";

    $stmt = $conn->prepare($sql);

    $stmt->execute([
        ":client_id" => $client_id,
        ":user_id"   => $_SESSION["user_id"],
        ":amount"    => $amount
    ]);

    $id = $conn->lastInsertId();

    if (!$id) {
        throw new Exception("Impossible d'enregistrer le paiement.");
    }

    // 2. Réduire la dette du client
    $sqlDebt = "UPDATE clients
                SET dette = dette - :amount
                WHERE id = :client_id
                AND user_id = :user_id";

    $stmtDebt = $conn->prepare($sqlDebt);

    $stmtDebt->execute([
        ":amount"    => $amount,
        ":client_id" => $client_id,
        ":user_id"   => $_SESSION["user_id"]
    ]);

    $conn->commit();

    echo json_encode([
        "success" => true,
        "message" => "Paiement enregistré avec succès."
    ]);

} catch (Exception $e) {
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }

    echo json_encode([
        "success" => false,
        "error"   => $e->getMessage()
    ]);
}