<?php

$file = $_SERVER['DOCUMENT_ROOT'] . '/twily/gulp/src/module_php/date.json';

// рабочий вариант  https://www.alphavantage.co/   Welcome to Alpha Vantage! Your API key is: AH6Q8FIVTHBGOJLC. Please record this API key at a safe place for future data access.
// предидущий ключ  9PKRO03JZ2KF9LEV
// $file = $_SERVER['DOCUMENT_ROOT'] . '/twily/gulp/src/module_php/date_0.json';    // резервная копия данных

// обновить данные в файле
// $data_source = 'https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=CNY&apikey=AH6Q8FIVTHBGOJLC';
// $json = file_get_contents($data_source);
// $data = json_decode($json, true);
// $data["Meta Data"]['data_source'] = $data_source;
// $file_status = file_put_contents($file, json_encode($data));

// использовать данные из файла
$data_file = file_get_contents($file);

echo $data_file;

// https://www.cryptocompare.com/
//  API Key: c8bc9016805a75bd7e4e5e407a7ac2062e7d14da7b4cf2db90f9a788842f3d2e
