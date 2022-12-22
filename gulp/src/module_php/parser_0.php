<?php

// день
$data_source = 'https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=CNY&apikey=AH6Q8FIVTHBGOJLC';
$file = $_SERVER['DOCUMENT_ROOT'] . '/twily/gulp/src/module_php/date.json';
$json = file_get_contents($data_source);

$data = json_decode($json, true);

$data["Meta Data"]['data_source'] = $data_source;



$file_status = file_put_contents($file, json_encode($data));

$data_file = file_get_contents($file);         // для тестов из  файла

// $data_file->data_source = $data_source;

echo $data_file;
