<?php

sleep(3);

if ( !isset( $_GET['file'] ) ) {
    echo '{"result":"ok"}';
    exit;
}

$mimes = array(
    'jpg'=>'image/jpeg',
    'jpeg'=>'image/jpeg',
    'gif'=>'image/gif',
    'png'=>'image/png',
    'json'=>'application/json',
    'js'=>'text/javascript'
);

$file = realpath(dirname(__FILE__)) . '/' . $_GET['file'];

$fileinfo = pathinfo($file);
$ext = $fileinfo['extension'];

if ( isset( $mimes[$ext] ) ) {
    header("Content-Type: " . $mimes[$ext]);
}

echo file_get_contents($file);