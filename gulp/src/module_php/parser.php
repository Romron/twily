<?php

// require __DIR__ . '../../../../vendor/autoload.php';

// $url = 'https://ru.tradingview.com/chart/?symbol=BITSTAMP%3ABTCUSD';
// $url = 'https://ru.tradingview.com/chart/BTCUSD/Dvkxre6w-testovaya-ideya-po-rostu-bitka/';

// $client = new \GuzzleHttp\Client();
// $respons = $client->get($url);
// $html = $respons->getBody()->getContents();
// echo $html;



/**
 * Requires curl enabled in php.ini
 **/

// // https://coinmarketcap.com/api/documentation/v1/#operation/getV1CryptocurrencyMap
// // $url = 'https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';
// $url = 'https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/listings/historical';
// $parameters = [
//    // 'start' => '1',
//    // 'limit' => '5000',
//    // 'convert' => 'USD',
//    'id' => '1',
//    'time_period' => 'daily',
//    'time_start' => "2021-01-01",
//    'time_end' => "2021-09-01",
//    'count' => '10',
//    // 'interval' => 'daily',
//    'convert' => 'USD',
//    'skip_invalid' => 'true',     // true - пропускать ошибки в запросах
// ];

// $headers = [
//    'Accepts: application/json',
//    'X-CMC_PRO_API_KEY: b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c',      // пробный из примера
//    'X-CMC_PRO_API_KEY: 659ccdef-4ff8-48c0-8635-66a3f43876c4'      // мой

// ];
// $qs = http_build_query($parameters); // query string encode the parameters
// $request = "{$url}?{$qs}"; // create the request URL


// $curl = curl_init(); // Get cURL resource
// // Set cURL options
// curl_setopt_array($curl, array(
//    CURLOPT_URL => $request,            // set the request URL
//    CURLOPT_HTTPHEADER => $headers,     // set the headers 
//    CURLOPT_RETURNTRANSFER => 1         // ask for raw response instead of bool
// ));

// $response = curl_exec($curl); // Send the request, save the response
// echo '<pre>';
// print_r(json_decode($response)); // print json decoded response
// echo '</pre>';
// curl_close($curl); // Close request


// работает но цены за btc не даёт в usd 

// $queryString = http_build_query([
//    'access_key' => 'f0a98a938f4aa2111367bf6fa5297b35',
//    'exchange' => 'usd',
//    'symbols' => 'btc',
//    'date_from' => '2022-01-01',
//    'date_to' => '2022-09-27',
//    'limit' => '1000',
//    'sort' => 'DESC',


// ]);

// $q = sprintf('%s?%s', 'http://api.marketstack.com/v1/eod', $queryString);

// $ch = curl_init($q);
// curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// $json = curl_exec($ch);
// curl_close($ch);

// $apiResult = json_decode($json, true);


// echo '<pre>';
// print_r($apiResult); // print json decoded response
// echo '</pre>';




// рабочий вариант
$dir = $_SERVER['DOCUMENT_ROOT'] . '/twily/gulp/src/data/';
$file = $dir . 'date.json';

if (!is_dir($dir)) {
   mkdir($dir);
}

// $json = file_get_contents('https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=UAH&apikey=9PKRO03JZ2KF9LEV');
// $data = json_decode($json, true);
// $file_status = file_put_contents($file, $json);

$data_file = file_get_contents($file);         // для тестов из  файла
// echo $data_file;


echo "<pre>";
print_r($data_file);
echo "</pre>";
