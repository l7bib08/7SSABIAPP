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

$data  = json_decode(file_get_contents("php://input"), true);

$type  = $data["title"]  ?? "";
$price = floatval($data["amount"] ?? 0);
$note  = $data["notes"]  ?? "";

if (empty($type)) {
    echo json_encode([
        "success" => false,
        "error"   => "Type de dépense non saisi."
    ]);
    exit;
}

if ($price <= 0) {
    echo json_encode([
        "success" => false,
        "error"   => "Le total doit être supérieur à 0."
    ]);
    exit;
}

try {
    $conn->beginTransaction();

    $sql = "INSERT INTO expenses (user_id, title, amount, notes)
            VALUES (:user_id, :type, :price, :note)";

    $stmt = $conn->prepare($sql);

    $stmt->execute([
        ":user_id" => $_SESSION["user_id"],
        ":type"    => $type,
        ":price"   => $price,
        ":note"    => $note
    ]);

    $id = $conn->lastInsertId();

    if (!$id) {
        throw new Exception("Impossible de créer la dépense.");
    }

    $conn->commit();

    echo json_encode([
        "success" => true,
        "message" => "Dépense bien enregistrée."
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