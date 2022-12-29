<?php

$file_data_minute = $_SERVER['DOCUMENT_ROOT'] . '/twily/gulp/src/data/data_minute.json';
$file_data_hour = $_SERVER['DOCUMENT_ROOT'] . '/twily/gulp/src/data/data_hour.json';
$file_data_day = $_SERVER['DOCUMENT_ROOT'] . '/twily/gulp/src/data/data_day.json';


switch ($_GET['timefraime']) {
   case 'minute':
      $json = file_get_contents('https://min-api.cryptocompare.com/data/v2/histominute?fsym=BTC&tsym=USD&limit=1000&api_key={c8bc9016805a75bd7e4e5e407a7ac2062e7d14da7b4cf2db90f9a788842f3d2e}');
      $data = json_decode($json, true);
      $file_status = file_put_contents($file_data_minute, $json);

      // для тестов
      $data = file_get_contents($file_data_minute);

      break;
   case 'hour':
      $json = file_get_contents('https://min-api.cryptocompare.com/data/v2/histohour?fsym=BTC&tsym=USD&limit=1000&api_key={c8bc9016805a75bd7e4e5e407a7ac2062e7d14da7b4cf2db90f9a788842f3d2e}');
      $data = json_decode($json, true);
      $file_status = file_put_contents($file_data_hour, $json);

      // для тестов
      $data = file_get_contents($file_data_hour);

      break;
   case 'day':
      $json = file_get_contents('https://min-api.cryptocompare.com/data/v2/histoday?fsym=BTC&tsym=USD&limit=1000&api_key={c8bc9016805a75bd7e4e5e407a7ac2062e7d14da7b4cf2db90f9a788842f3d2e}');
      $data = json_decode($json, true);
      $file_status = file_put_contents($file_data_day, $json);

      // для тестов
      $data = file_get_contents($file_data_day);

      break;
   default:
      # code...
      break;
}


echo $data;


// echo "<pre>";
// print_r($data);
// echo "</pre>";
