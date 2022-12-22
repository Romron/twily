<?php


// $file = $_SERVER['DOCUMENT_ROOT'] . '/twily/gulp/src/module_php/date.json';

// день
// $json = file_get_contents('https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=UAH&apikey=9PKRO03JZ2KF9LEV');
// $data = json_decode($json, true);

// echo '<pre>';
// print_r($data);
// echo '<pre>';

// $file_status = file_put_contents($file, $json);


// $data_file = file_get_contents($file); // для тестов из файла

// echo $data_file;

// echo '<pre>';
// print_r($data_file);
// echo '<pre>';


$file = $_SERVER['DOCUMENT_ROOT'] . '/twily/gulp/src/module_php/date.json';

// день

// $json = file_get_contents('https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD&api_key={c8bc9016805a75bd7e4e5e407a7ac2062e7d14da7b4cf2db90f9a788842f3d2e}');
$json = file_get_contents('https://min-api.cryptocompare.com/data/v2/histohour?fsym=BTC&tsym=USD&limit=1000&api_key={c8bc9016805a75bd7e4e5e407a7ac2062e7d14da7b4cf2db90f9a788842f3d2e}');
// 

$data = json_decode($json, true);
$file_status = file_put_contents($file, $json);

// 


$data_file = file_get_contents($file);         // для тестов из  файла

// echo '<pre>';
// print_r($data_file);
// echo $data_file->Data;
$str = json_decode($data_file);
foreach ($str->Data->Data as $kye) {

   echo '<pre>';
   print_r($kye);
   echo date("y-m-d", $str->Data->Data[0]->time);
   echo '</pre>';
}
