<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $nom = htmlspecialchars($_POST["nom"]);
  $email = htmlspecialchars($_POST["email"]);
  $message = htmlspecialchars($_POST["message"]);

  $to = "ton.email@example.com"; // remplace par ton adresse perso
  $subject = "Nouveau message de $nom";
  $body = "Nom: $nom\nEmail: $email\n\nMessage:\n$message";
  $headers = "From: $email";

  if (mail($to, $subject, $body, $headers)) {
    header("Location: ../../index.php#contact?success=true");
    exit;
  } else {
    header("Location: ../../index.php#contact?error=true");
    exit;
  }
}
?>
