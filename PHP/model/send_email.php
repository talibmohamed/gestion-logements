<?php
require '../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

function sendEmail($recipientEmail, $recipientNom, $recipientPrenom, $subject, $body){
    $mail = new PHPMailer(true);

    try {
        // Server settings
        $mail->isSMTP();
        $mail->SMTPAuth = true;
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        // email credentials
        $mail->Username = 'houselytics.help@gmail.com'; 
        $mail->Password = 'hnzb lxwq ddsl ahqf'; 

        // Recipients
        $mail->setFrom('mohamedrafik8.mr@gmail.com', 'houselytics');
        $mail->addAddress($recipientEmail, $recipientNom.' '.$recipientPrenom); 

        // Content
        $mail->isHTML(true); 
        $mail->Subject = $subject; 
        $mail->Body = $body; 
        $mail->AltBody = strip_tags($body); 

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Email could not be sent. Mailer Error: {$mail->ErrorInfo}");
        return false;
    }
}


?>
