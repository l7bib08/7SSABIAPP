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

$user_id = $_SESSION["user_id"];
$today   = date("Y-m-d");

try {
    $sqlCash = "SELECT COALESCE(SUM(total_amount), 0) AS total
                FROM sales
                WHERE user_id = :user_id
                AND type = 'cash'
                AND DATE(created_at) = :today";

    $stmtCash = $conn->prepare($sqlCash);
    $stmtCash->execute([":user_id" => $user_id, ":today" => $today]);
    $cashSales = floatval($stmtCash->fetch(PDO::FETCH_ASSOC)["total"]);

    
    $sqlCredit = "SELECT COALESCE(SUM(total_amount), 0) AS total
                  FROM sales
                  WHERE user_id = :user_id
                  AND type = 'credit'
                  AND DATE(created_at) = :today";

    $stmtCredit = $conn->prepare($sqlCredit);
    $stmtCredit->execute([":user_id" => $user_id, ":today" => $today]);
    $creditSales = floatval($stmtCredit->fetch(PDO::FETCH_ASSOC)["total"]);

    
    $sqlExp = "SELECT COALESCE(SUM(amount), 0) AS total
               FROM expenses
               WHERE user_id = :user_id
               AND DATE(created_at) = :today";

    $stmtExp = $conn->prepare($sqlExp);
    $stmtExp->execute([":user_id" => $user_id, ":today" => $today]);
    $expenses = floatval($stmtExp->fetch(PDO::FETCH_ASSOC)["total"]);

    
    $sqlTrans = "SELECT
                    'Vente Cash'              AS title,
                    total_amount              AS amount,
                    TIME(created_at)          AS time
                 FROM sales
                 WHERE user_id = :user_id
                 AND type = 'cash'
                 AND DATE(created_at) = :today

                 UNION ALL

                 SELECT
                    CONCAT('Vente Crédit - ', c.nom_complet)  AS title,
                    s.total_amount                            AS amount,
                    TIME(s.created_at)                        AS time
                 FROM sales s
                 JOIN clients c ON s.client_id = c.id
                 WHERE s.user_id = :user_id2
                 AND s.type = 'credit'
                 AND DATE(s.created_at) = :today2

                 UNION ALL

                 SELECT
                    CONCAT('Dépense - ', title) AS title,
                    amount                      AS amount,
                    TIME(created_at)            AS time
                 FROM expenses
                 WHERE user_id = :user_id3
                 AND DATE(created_at) = :today3

                 ORDER BY time ASC";

    $stmtTrans = $conn->prepare($sqlTrans);
    $stmtTrans->execute([
        ":user_id"  => $user_id,
        ":today"    => $today,
        ":user_id2" => $user_id,
        ":today2"   => $today,
        ":user_id3" => $user_id,
        ":today3"   => $today
    ]);
    $transactions = $stmtTrans->fetchAll(PDO::FETCH_ASSOC);

    
    $sqlDebtors = "SELECT
                       nom_complet AS name,
                       dette       AS debt
                   FROM clients
                   WHERE user_id = :user_id
                   AND dette > 0
                   ORDER BY dette DESC";

    $stmtDebtors = $conn->prepare($sqlDebtors);
    $stmtDebtors->execute([":user_id" => $user_id]);
    $debtors = $stmtDebtors->fetchAll(PDO::FETCH_ASSOC);

    
    $profit       = ($cashSales + $creditSales) - $expenses;
    $totalEncashed = $cashSales;
    $totalDebt    = array_sum(array_column($debtors, "debt"));

   
    echo json_encode([
        "success" => true,
        "report"  => [
            "cashSales"     => $cashSales,
            "creditSales"   => $creditSales,
            "expenses"      => $expenses,
            "profit"        => $profit,
            "totalEncashed" => $totalEncashed,
            "totalDebt"     => $totalDebt,
            "transactions"  => $transactions,
            "debtors"       => $debtors
        ]
    ]);

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "error"   => $e->getMessage()
    ]);
}