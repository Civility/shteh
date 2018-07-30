<?php
	$to = "oleg.orlov@utsrus.com";
	$email = $_POST['email'];

	$err = '';
	if(trim($_POST['name']) == "" && trim($_POST['email']) == "" && trim($_POST['tel']) == "" && trim($_POST['message']) == "")
		$err = "Заполните поля";
	else if (trim($_POST['name']) == "")
		$err = "Имя не указано";
	else if (!((strpos($email, ".") > 0 ) && (strpos($email, "@") > 0)))
		$err = "Неправильный e-mail";
	else if (trim($_POST['message']) == "")
		$err = "Сообщение не указано";
	if($err != ""){
		echo $err;
		exit;
	}

	$msg = "Сообщение отправлено" .$_POST['name']."<br> Телефон:".$_POST['tel']."<br> email:".$_POST['email']."<br> Текст сообщения: </b><br>".$_POST['message']."<br><br>Форма обратной связи SHTECH";

$subject = "=?utf-8?B?".base64_encode("Сообщение с SHTECH")."?=";
$headers = "From: $email\r\nReply-to: $mail\r\nContent-type: text/html; charset=utf-8\r\n";
$success = mail ($to, $subject, $msg, $headers);
	echo $success;
	?>