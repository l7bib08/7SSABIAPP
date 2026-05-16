<?php
require_once "db.php";

$errors = [];

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $full_name = trim($_POST["nom"]);
    $email = trim($_POST["email"]);
    $password = $_POST["password"];
    $confirm = $_POST["confirm_password"];

    if (empty($full_name)) {
        $errors[] = "Le nom complet est obligatoire.";
    }

    if (empty($email)) {
        $errors[] = "L'email est obligatoire.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Format d'email invalide.";
    }

    if (strlen($password) < 8) {
        $errors[] = "Le mot de passe doit contenir au moins 8 caractères.";
    }

    if (!preg_match('/[A-Z]/', $password)) {
        $errors[] = "Le mot de passe doit contenir au moins une majuscule.";
    }

    if (!preg_match('/[a-z]/', $password)) {
        $errors[] = "Le mot de passe doit contenir au moins une minuscule.";
    }

    if (!preg_match('/[0-9]/', $password)) {
        $errors[] = "Le mot de passe doit contenir au moins un chiffre.";
    }

    if (!preg_match('/[^a-zA-Z0-9]/', $password)) {
        $errors[] = "Le mot de passe doit contenir au moins un caractère spécial.";
    }

    if ($password !== $confirm) {
        $errors[] = "Les mots de passe ne correspondent pas.";
    }

    if (empty($errors)) {
        $sql = "SELECT id FROM users WHERE email = :email";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ":email" => $email
        ]);

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            $errors[] = "Un compte avec cet email existe déjà.";
        }
    }

    if (empty($errors)) {
        $hash_password = password_hash($password, PASSWORD_DEFAULT);

        $sql = "INSERT INTO users (nom_complet, email, password)
                VALUES (:nom_complet, :email, :password)";

        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ":nom_complet" => $full_name,
            ":email" => $email,
            ":password" => $hash_password
        ]);

        header("Location: ../index.php");
        exit;
    }
}
?>