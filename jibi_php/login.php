<?php

session_start();
require_once "db.php";

$errors = [];

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $email = trim($_POST["email"]);
    $password = $_POST["password"];

    if (empty($email)) {
        $errors[] = "L'email est obligatoire.";
    }

    if (empty($password)) {
        $errors[] = "Le mot de passe est obligatoire.";
    }

    if (empty($errors)) {
        $sql = "SELECT id, nom_complet, email, password FROM users WHERE email = :email";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ":email" => $email
        ]);

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            $errors[] = "Email ou mot de passe incorrect.";
        } else {
            if (password_verify($password, $user["password"])) {
                $_SESSION["user_id"] = $user["id"];
                $_SESSION["user_name"] = $user["nom_complet"];
                $_SESSION["user_email"] = $user["email"];

                header("Location: ../index.php");
                exit;
            } else {
                $errors[] = "Email ou mot de passe incorrect.";
            }
        }
    }
}




?>