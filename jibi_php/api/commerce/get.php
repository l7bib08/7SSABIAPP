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

try {
    $sql  = "SELECT nom, adresse, telephone FROM commerce WHERE user_id = :user_id";
    $stmt = $conn->prepare($sql);
    $stmt->execute([":user_id" => $_SESSION["user_id"]]);
    $row  = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        "success"  => true,
        "commerce" => $row ?: ["nom" => "", "adresse" => "", "telephone" => ""]
    ]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}