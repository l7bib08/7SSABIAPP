<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
session_start();
require_once "db.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $full_name = trim($_POST["nom"] ?? "");
    $email     = trim($_POST["email"] ?? "");
    $password  = $_POST["password"] ?? "";
    $confirm   = $_POST["confirm_password"] ?? "";

    $errors = [];

    if (empty($full_name)) $errors[] = "Le nom complet est obligatoire.";
    if (empty($email))     $errors[] = "L'email est obligatoire.";
    if (strlen($password) < 8) $errors[] = "Le mot de passe doit contenir au moins 8 caractères.";
    if ($password !== $confirm) $errors[] = "Les mots de passe ne correspondent pas.";

    if (empty($errors)) {
        $stmt = $conn->prepare("SELECT id FROM users WHERE email = :email");
        $stmt->execute([":email" => $email]);
        if ($stmt->fetch()) {
            $errors[] = "Un compte avec cet email existe déjà.";
        }
    }

    if (empty($errors)) {
        $hash = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $conn->prepare("INSERT INTO users (nom_complet, email, password) VALUES (:nom, :email, :password)");
        $stmt->execute([
            ":nom"      => $full_name,
            ":email"    => $email,
            ":password" => $hash
        ]);
        $_SESSION["signup_errors"] = [];
        header("Location: ../index.php");
        exit;
    }

    $_SESSION["signup_errors"] = $errors;
    header("Location: ../index.php?screen=signup");
    exit;
}

header("Location: ../index.php");
exit;
?>