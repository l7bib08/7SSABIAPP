<?php
session_start();

header("Content-Type: application/json");

require_once "../db.php";

if (!isset($_SESSION["user_id"])) {
    echo json_encode([
        "success" => false,
        "error" => "Utilisateur non connecté."
    ]);
    exit;
}

$today = date("Y-m-d");
$user_id = $_SESSION["user_id"];

$sqlSales = "SELECT COALESCE(SUM(total_amount), 0) AS total_sales
             FROM sales
             WHERE user_id = :user_id
             AND DATE(created_at) = :today";

$stmtSales = $conn->prepare($sqlSales);

$stmtSales->execute([
    ":user_id" => $user_id,
    ":today" => $today
]);

$salesResult = $stmtSales->fetch(PDO::FETCH_ASSOC);

$totalSales = floatval($salesResult["total_sales"]);

$sqlExpenses = "SELECT COALESCE(SUM(amount), 0) AS total_expenses
                FROM expenses
                WHERE user_id = :user_id
                AND DATE(created_at) = :today";

$stmtExpenses = $conn->prepare($sqlExpenses);

$stmtExpenses->execute([
    ":user_id" => $user_id,
    ":today" => $today
]);

$expensesResult = $stmtExpenses->fetch(PDO::FETCH_ASSOC);

$totalExpenses = floatval($expensesResult["total_expenses"]);

$profit = $totalSales - $totalExpenses;

echo json_encode([
    "success" => true,
    "date" => $today,
    "sales_today" => $totalSales,
    "expenses_today" => $totalExpenses,
    "profit_today" => $profit
]);