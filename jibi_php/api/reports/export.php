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

$data    = json_decode(file_get_contents("php://input"), true);
$date    = $data["date"] ?? date("Y-m-d");
$user_id = $_SESSION["user_id"];

try {
    $stmtC = $conn->prepare("SELECT nom, adresse, telephone FROM commerce WHERE user_id = :uid");
    $stmtC->execute([":uid" => $user_id]);
    $commerce = $stmtC->fetch(PDO::FETCH_ASSOC) ?: ["nom" => "Mon Commerce", "adresse" => "", "telephone" => ""];

    $stmtCash = $conn->prepare("SELECT COALESCE(SUM(total_amount),0) AS total FROM sales WHERE user_id=:uid AND type='cash' AND DATE(created_at)=:date");
    $stmtCash->execute([":uid" => $user_id, ":date" => $date]);
    $cashSales = floatval($stmtCash->fetch(PDO::FETCH_ASSOC)["total"]);

    $stmtCr = $conn->prepare("SELECT COALESCE(SUM(total_amount),0) AS total FROM sales WHERE user_id=:uid AND type='credit' AND DATE(created_at)=:date");
    $stmtCr->execute([":uid" => $user_id, ":date" => $date]);
    $creditSales = floatval($stmtCr->fetch(PDO::FETCH_ASSOC)["total"]);

    $stmtExp = $conn->prepare("SELECT COALESCE(SUM(amount),0) AS total FROM expenses WHERE user_id=:uid AND DATE(created_at)=:date");
    $stmtExp->execute([":uid" => $user_id, ":date" => $date]);
    $expenses = floatval($stmtExp->fetch(PDO::FETCH_ASSOC)["total"]);

    $stmtTrans = $conn->prepare("
        SELECT 'Vente Cash' AS title, total_amount AS amount, TIME(created_at) AS time
        FROM sales WHERE user_id=:uid AND type='cash' AND DATE(created_at)=:date
        UNION ALL
        SELECT CONCAT('Vente Crédit - ', c.nom_complet), s.total_amount, TIME(s.created_at)
        FROM sales s JOIN clients c ON s.client_id=c.id
        WHERE s.user_id=:uid2 AND s.type='credit' AND DATE(s.created_at)=:date2
        UNION ALL
        SELECT CONCAT('Dépense - ', title), amount, TIME(created_at)
        FROM expenses WHERE user_id=:uid3 AND DATE(created_at)=:date3
        ORDER BY time ASC
    ");

    $stmtTrans->execute([":uid"=>$user_id,":date"=>$date,":uid2"=>$user_id,":date2"=>$date,":uid3"=>$user_id,":date3"=>$date]);
    $transactions = $stmtTrans->fetchAll(PDO::FETCH_ASSOC);

    $stmtD = $conn->prepare("SELECT nom_complet AS name, dette AS debt FROM clients WHERE user_id=:uid AND dette>0 ORDER BY dette DESC");
    $stmtD->execute([":uid" => $user_id]);
    $debtors = $stmtD->fetchAll(PDO::FETCH_ASSOC);

    $profit    = ($cashSales + $creditSales) - $expenses;
    $totalDebt = array_sum(array_column($debtors, "debt"));

    echo json_encode([
        "success" => true,
        "data"    => [
            "date"         => $date,
            "commerce"     => $commerce,
            "cashSales"    => $cashSales,
            "creditSales"  => $creditSales,
            "expenses"     => $expenses,
            "profit"       => $profit,
            "totalDebt"    => $totalDebt,
            "transactions" => $transactions,
            "debtors"      => $debtors
        ]
    ]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}