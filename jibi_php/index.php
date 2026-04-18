<?php
require_once "db.php";


$editMode = false;
$idEdit = "";
$nomEdit = "";
$prenomEdit = "";
$telephoneEdit = "";
$detteEdit = "";


if (isset($_GET["delete"])) {
    $id = $_GET["delete"];

    $sql = "DELETE FROM clients WHERE id = :id";
    $stmt = $conn->prepare($sql);
    $stmt->execute([
        ":id" => $id
    ]);

    header("Location: index.php");
    exit;
}


if (isset($_GET["edit"])) {
    $editMode = true;
    $id = $_GET["edit"];

    $sql = "SELECT * FROM clients WHERE id = :id";
    $stmt = $conn->prepare($sql);
    $stmt->execute([
        ":id" => $id
    ]);

    $client = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($client) {
        $idEdit = $client["id"];
        $nomEdit = $client["nom"];
        $prenomEdit = $client["prenom"];
        $telephoneEdit = $client["telephone"];
        $detteEdit = $client["dette"];
    }
}



if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nom = $_POST["nom"];
    $prenom = $_POST["prenom"];
    $telephone = $_POST["telephone"];
    $dette = $_POST["dette"];

    if (isset($_POST["id"]) && !empty($_POST["id"])) {
        $id = $_POST["id"];

        $sql = "UPDATE clients
                SET nom = :nom, prenom = :prenom, telephone = :telephone, dette = :dette
                WHERE id = :id";

        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ":nom" => $nom,
            ":prenom" => $prenom,
            ":telephone" => $telephone,
            ":dette" => $dette,
            ":id" => $id
        ]);
    } else {
        $sql = "INSERT INTO clients (user_id, nom, prenom, telephone, dette)
                VALUES (1, :nom, :prenom, :telephone, :dette)";

        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ":nom" => $nom,
            ":prenom" => $prenom,
            ":telephone" => $telephone,
            ":dette" => $dette
        ]);
    }

    header("Location: index.php");
    exit;
}



$sql = "SELECT * FROM clients";
$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Gestion des clients</title>
</head>
<body>

    <h1><?php echo $editMode ? "Modifier un client" : "Ajouter un client"; ?></h1>

    <form method="POST">
        <input type="hidden" name="id" value="<?php echo $idEdit; ?>">

        <input type="text" name="nom" placeholder="Nom" required value="<?php echo $nomEdit; ?>">
        <br><br>

        <input type="text" name="prenom" placeholder="Prénom" required value="<?php echo $prenomEdit; ?>">
        <br><br>

        <input type="text" name="telephone" placeholder="Téléphone" required value="<?php echo $telephoneEdit; ?>">
        <br><br>

        <input type="number" name="dette" placeholder="Dette" required value="<?php echo $detteEdit; ?>">
        <br><br>

        <button type="submit">
            <?php echo $editMode ? "Modifier" : "Ajouter"; ?>
        </button>
    </form>

    <hr>

    <h1>Liste des clients</h1>

    <table border="1" cellpadding="10" cellspacing="0">
        <thead>
            <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Téléphone</th>
                <th>Dette</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            <?php while ($ligne = $result->fetch(PDO::FETCH_ASSOC)) { ?>
                <tr>
                    <td><?php echo $ligne["id"]; ?></td>
                    <td><?php echo $ligne["nom"]; ?></td>
                    <td><?php echo $ligne["prenom"]; ?></td>
                    <td><?php echo $ligne["telephone"]; ?></td>
                    <td><?php echo $ligne["dette"]; ?></td>
                    <td>
                        <a href="index.php?edit=<?php echo $ligne['id']; ?>">Modifier</a>
                        |
                        <a href="index.php?delete=<?php echo $ligne['id']; ?>" onclick="return confirm('Supprimer ce client ?');">
                            Supprimer
                        </a>
                    </td>
                </tr>
            <?php } ?>
        </tbody>
    </table>

</body>
</html>