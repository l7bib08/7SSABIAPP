<?php
session_start();

header("Content-Type: application/json");

require_once "../../db.php";

if (!isset($_SESSION["user_id"])) {
    echo json_encode(["success" => false, "error" => "Utilisateur non connecté."]);
    exit;
}

$name  = trim($_POST["name"]  ?? "");
$phone = trim($_POST["phone"] ?? "");
$limit = floatval($_POST["limit"] ?? 0);

if (empty($name)) {
    echo json_encode(["success" => false, "error" => "Le nom du client est obligatoire."]);
    exit;
}

$imagePath = null;

if (isset($_FILES["image"]) && $_FILES["image"]["error"] === UPLOAD_ERR_OK) {
    $uploadDir  = "../../../assets/clients/";
    $extension  = pathinfo($_FILES["image"]["name"], PATHINFO_EXTENSION);
    $filename   = uniqid("client_") . "." . $extension;
    $targetPath = $uploadDir . $filename;

    if (move_uploaded_file($_FILES["image"]["tmp_name"], $targetPath)) {
        $imagePath = "assets/clients/" . $filename;
    } else {
        error_log("Upload échoué: " . $targetPath);
        error_log("Dossier existe: " . (is_dir($uploadDir) ? "OUI" : "NON"));
        error_log("Dossier writable: " . (is_writable($uploadDir) ? "OUI" : "NON"));
    }
}

$sql  = "INSERT INTO clients (user_id, nom_complet, telephone, credit_limit, image)
         VALUES (:user_id, :nom_complet, :telephone, :credit_limit, :image)";

$stmt = $conn->prepare($sql);
$stmt->execute([
    ":user_id"      => $_SESSION["user_id"],
    ":nom_complet"  => $name,
    ":telephone"    => $phone,
    ":credit_limit" => $limit,
    ":image"        => $imagePath
]);

echo json_encode([
    "success" => true,
    "message" => "Client ajouté avec succès"
]);