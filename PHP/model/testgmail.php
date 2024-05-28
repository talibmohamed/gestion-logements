<?php

// use PHPMailer\PHPMailer\PHPMailer;
// use PHPMailer\PHPMailer\Exception;

// require '../vendor/autoload.php';

// function sendEmail($recipient, $subject, $message) {
//     $mail = new PHPMailer(true);

//     try {
//         $mail->isSMTP();
//         $mail->Host = 'smtp.gmail.com';
//         $mail->SMTPAuth = true;
//         $mail->Username = 'houselytics.email@gmail.com'; 
//         $mail->Password = 'houselytics123';  
//         $mail->SMTPSecure = 'tls';
//         $mail->Port = 587;

//         $mail->setFrom('houselytics.email@gmail.com', 'Houselytics');
//         $mail->addAddress($recipient);
//         $mail->Subject = $subject;
//         $mail->isHTML(true);
//         $mail->Body = $message;

//         $mail->send();
//         return true;
//     } catch (Exception $e) {
//         echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
//         return false;
//     }
// }

// // Example usage
// $recipient = "talibmed11@gmail.com";
// $subject = "Test Email";
// $message = "<p>This is a test email sent from PHP using PHPMailer and Gmail's SMTP server.</p>";

// if (sendEmail($recipient, $subject, $message)) {
//     echo "Email sent successfully.";
// } else {
//     echo "Failed to send email.";
// }


// ! redo this sith GMAIL API AND PHP MAILER 
