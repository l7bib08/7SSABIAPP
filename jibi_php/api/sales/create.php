<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

session_start();

header("Content-Type: application/json");

require_once "../../db.php";

if (!isset($_SESSION["user_id"])) {
    echo json_encode(["success" => false, "error" => "Utilisateur non connecté."]);
    exit;
}

$data      = json_decode(file_get_contents("php://input"), true);
$type      = $data["type"]       ?? "cash";
$items     = $data["items"]      ?? [];
$total     = floatval($data["total_amount"] ?? $data["total"] ?? 0);
$client_id = isset($data["client_id"]) ? intval($data["client_id"]) : null;

if ($type !== "cash" && $type !== "credit") {
    echo json_encode(["success" => false, "error" => "Type de vente invalide."]);
    exit;
}

if ($type === "credit" && empty($client_id)) {
    echo json_encode(["success" => false, "error" => "Un client est obligatoire pour une vente à crédit."]);
    exit;
}

if (empty($items) || !is_array($items)) {
    echo json_encode(["success" => false, "error" => "Ajoute au moins un article."]);
    exit;
}

if ($total <= 0) {
    echo json_encode(["success" => false, "error" => "Le total doit être supérieur à 0."]);
    exit;
}

try {
    $conn->beginTransaction();

    $sqlSale = "INSERT INTO sales (user_id, client_id, type, total_amount)
                VALUES (:user_id, :client_id, :type, :total)";

    $stmtSale = $conn->prepare($sqlSale);
    $stmtSale->execute([
        ":user_id"   => $_SESSION["user_id"],
        ":client_id" => $client_id,
        ":type"      => $type,
        ":total"     => $total
    ]);

    $sale_id = $conn->lastInsertId();

    if (!$sale_id) {
        throw new Exception("Impossible de créer la vente.");
    }

    $sqlItem = "INSERT INTO sale_items (sale_id, product_name, unit_price, quantity, subtotal)
                VALUES (:sale_id, :product_name, :unit_price, :quantity, :subtotal)";

    $stmtItem = $conn->prepare($sqlItem);

    foreach ($items as $item) {
        $productName = trim($item["name"] ?? $item["product_name"] ?? "");
        $unitPrice   = floatval($item["price"] ?? $item["unit_price"] ?? 0);
        $quantity    = intval($item["qty"]   ?? $item["quantity"]   ?? 0);
        $subtotal    = floatval($item["subtotal"] ?? 0);

        if ($productName === "" || $unitPrice <= 0 || $quantity <= 0 || $subtotal <= 0) {
            throw new Exception("Article invalide.");
        }

        $stmtItem->execute([
            ":sale_id"      => $sale_id,
            ":product_name" => $productName,
            ":unit_price"   => $unitPrice,
            ":quantity"     => $quantity,
            ":subtotal"     => $subtotal
        ]);
    }

    if ($type === "credit") {
        $sqlDebt = "UPDATE clients
                    SET dette = dette + :total
                    WHERE id = :client_id
                    AND user_id = :user_id";

        $stmtDebt = $conn->prepare($sqlDebt);
        $stmtDebt->execute([
            ":total"     => $total,
            ":client_id" => $client_id,
            ":user_id"   => $_SESSION["user_id"]
        ]);
    }

    $conn->commit();

    $message = $type === "cash"
        ? "Vente cash enregistrée avec succès."
        : "Vente à crédit enregistrée avec succès.";

    echo json_encode(["success" => true, "message" => $message]);

} catch (Exception $e) {
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}