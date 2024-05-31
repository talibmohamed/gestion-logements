<?php
// require __DIR__ . '../vendor/autoload.php';

// define('APPLICATION_NAME', 'Gmail API PHP Quickstart');
// define('CREDENTIALS_PATH', '~/.credentials/gmail-php-quickstart.json');
// define('CLIENT_SECRET_PATH', __DIR__ . '/client_secret.json');
// define('SCOPES', implode(' ', array(
//     Google_Service_Gmail::MAIL_GOOGLE_COM,
// )));

// /**
//  * Returns an authorized API client.
//  * @return Google_Client the authorized client object
//  */
// function getClient() {
//     $client = new Google_Client();
//     $client->setApplicationName(APPLICATION_NAME);
//     $client->setScopes(SCOPES);
//     $client->setAuthConfig(CLIENT_SECRET_PATH);
//     $client->setAccessType('offline');

//     // Load previously authorized credentials from a file.
//     $credentialsPath = expandHomeDirectory(CREDENTIALS_PATH);
//     if (file_exists($credentialsPath)) {
//         $accessToken = json_decode(file_get_contents($credentialsPath), true);
//     } else {
//         // Request authorization from the user.
//         $authUrl = $client->createAuthUrl();
//         printf("Open the following link in your browser:\n%s\n", $authUrl);
//         print 'Enter verification code: ';
//         $authCode = trim(fgets(STDIN));

//         // Exchange authorization code for an access token.
//         $accessToken = $client->fetchAccessTokenWithAuthCode($authCode);

//         // Store the credentials to disk.
//         if (!file_exists(dirname($credentialsPath))) {
//             mkdir(dirname($credentialsPath), 0700, true);
//         }
//         file_put_contents($credentialsPath, json_encode($accessToken));
//         printf("Credentials saved to %s\n", $credentialsPath);
//     }
//     $client->setAccessToken($accessToken);

//     // Refresh the token if it's expired.
//     if ($client->isAccessTokenExpired()) {
//         $client->fetchAccessTokenWithRefreshToken($client->getRefreshToken());
//         file_put_contents($credentialsPath, json_encode($client->getAccessToken()));
//     }
//     return $client;
// }

// /**
//  * Expands the home directory alias '~' to the full path.
//  * @param string $path the path to expand.
//  * @return string the expanded path.
//  */
// function expandHomeDirectory($path) {
//     $homeDirectory = getenv('HOME');
//     if (empty($homeDirectory)) {
//         $homeDirectory = getenv('HOMEDRIVE') . getenv('HOMEPATH');
//     }
//     return str_replace('~', realpath($homeDirectory), $path);
// }

// /**
//  * Creates a MIME email message.
//  * @param string $to Recipient email address
//  * @param string $from Sender email address
//  * @param string $subject Email subject
//  * @param string $messageText Email body
//  * @return Google_Service_Gmail_Message
//  */
// function createMessage($to, $from, $subject, $messageText) {
//     $strRawMessage = "From: $from\r\n";
//     $strRawMessage .= "To: $to\r\n";
//     $strRawMessage .= "Subject: $subject\r\n";
//     $strRawMessage .= "MIME-Version: 1.0\r\n";
//     $strRawMessage .= "Content-Type: text/plain; charset=utf-8\r\n";
//     $strRawMessage .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
//     $strRawMessage .= "$messageText\r\n";

//     $rawMessage = base64_encode($strRawMessage);
//     $rawMessage = str_replace(array('+', '/', '='), array('-', '_', ''), $rawMessage); // url safe
//     $message = new Google_Service_Gmail_Message();
//     $message->setRaw($rawMessage);
//     return $message;
// }

// /**
//  * Sends an email message.
//  * @param $service Google_Service_Gmail an authorized Gmail API service instance.
//  * @param $userId string User's email address
//  * @param $message Google_Service_Gmail_Message
//  * @return null|Google_Service_Gmail_Message
//  */
// function sendMessage($service, $userId, $message) {
//     try {
//         $message = $service->users_messages->send($userId, $message);
//         print 'Message with ID: ' . $message->getId() . ' sent.';
//         return $message;
//     } catch (Exception $e) {
//         print 'An error occurred: ' . $e->getMessage();
//     }
//     return null;
// }

// $client = getClient();
// $service = new Google_Service_Gmail($client);

// // Create and send the email
// $to = 'recipient@example.com';
// $from = 'your-email@gmail.com';
// $subject = 'Test Subject';
// $messageText = 'This is a test email.';

// $message = createMessage($to, $from, $subject, $messageText);
// sendMessage($service, 'me', $message);

// ?>


// ! redo this sith GMAIL API AND PHP MAILER 
