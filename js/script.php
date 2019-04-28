<?php

require_once 'db.php';

$img = $_POST['img'];
$img = str_replace('data:image/png;base64,', '', $img);
$img = str_replace(' ', '+', $img);
$fileData = base64_decode($img);

//saving
$milliseconds = round(microtime(true) * 1000);
$fileName = $milliseconds.'.png';
//
$stmt = $db->prepare("INSERT INTO image (url_image) VALUES (:url_image)");
$stmt->bindParam(':url_image', $image);
$image = "/upload/".$milliseconds.".png";
$stmt->execute();

file_put_contents($_SERVER['DOCUMENT_ROOT'].'/upload/'.$fileName, $fileData);
echo "con...";