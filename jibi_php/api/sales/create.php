<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

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

$type = $data["type"] ?? "cash";
$items = $data["items"] ?? [];
$total = floatval($data["total"] ?? 0);

if ($type !== "cash") {
    echo json_encode([
        "success" => false,
        "error" => "Type de vente invalide."
    ]);
    exit;
}

if (empty($items) || !is_array($items)) {
    echo json_encode([
        "success" => false,
        "error" => "Ajoute au moins un article."
    ]);
    exit;
}

if ($total <= 0) {
    echo json_encode([
        "success" => false,
        "error" => "Le total doit être supérieur à 0."
    ]);
    exit;
}

try {
    $conn->beginTransaction();

    $sql = "INSERT INTO sales (user_id, client_id, type, total_amount)
            VALUES (:user_id, NULL, :type, :total)";

    $stmt = $conn->prepare($sql);

    $stmt->execute([
        ":user_id" => $_SESSION["user_id"],
        ":type" => $type,
        ":total" => $total
    ]);

    $sale_id = $conn->lastInsertId();

    if (!$sale_id) {
        throw new Exception("Impossible de créer la vente.");
    }

    $itemSql = "INSERT INTO sale_items 
                (sale_id, product_name, unit_price, quantity, subtotal)
                VALUES (:sale_id, :product_name, :unit_price, :quantity, :subtotal)";

    $itemStmt = $conn->prepare($itemSql);

    foreach ($items as $item) {
        $productName = trim($item["name"] ?? "");
        $unitPrice = floatval($item["price"] ?? 0);
        $quantity = intval($item["qty"] ?? 0);
        $subtotal = floatval($item["subtotal"] ?? 0);

        if ($productName === "" || $unitPrice <= 0 || $quantity <= 0 || $subtotal <= 0) {
            throw new Exception("Article invalide.");
        }

        $itemStmt->execute([
            ":sale_id" => $sale_id,
            ":product_name" => $productName,
            ":unit_price" => $unitPrice,
            ":quantity" => $quantity,
            ":subtotal" => $subtotal
        ]);
    }

    $conn->commit();

    echo json_encode([
        "success" => true,
        "message" => "Vente cash enregistrée avec succès."
    ]);

} catch (Exception $e) {
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }

    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}