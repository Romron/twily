<?php

require __DIR__ . '../../../../vendor/autoload.php';

// $url = 'https://ru.tradingview.com/chart/?symbol=BITSTAMP%3ABTCUSD';
// $url = 'https://ru.tradingview.com/chart/BTCUSD/Dvkxre6w-testovaya-ideya-po-rostu-bitka/';

// $client = new \GuzzleHttp\Client();
// $respons = $client->get($url);
// $html = $respons->getBody()->getContents();
// echo $html;



/**
 * Requires curl enabled in php.ini
 **/

// https://coinmarketcap.com/api/documentation/v1/#operation/getV1CryptocurrencyMap
// $url = 'https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';
$url = 'https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/listings/historical';
$parameters = [
   'start' => '1',
   'id' => '1',
   'limit' => '5000',
   'convert' => 'USD'
];

$headers = [
   'Accepts: application/json',
   'X-CMC_PRO_API_KEY: b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c',      // пробный из примера
   'X-CMC_PRO_API_KEY: 659ccdef-4ff8-48c0-8635-66a3f43876c4'      // мой

];
$qs = http_build_query($parameters); // query string encode the parameters
$request = "{$url}?{$qs}"; // create the request URL


$curl = curl_init(); // Get cURL resource
// Set cURL options
curl_setopt_array($curl, array(
   CURLOPT_URL => $request,            // set the request URL
   CURLOPT_HTTPHEADER => $headers,     // set the headers 
   CURLOPT_RETURNTRANSFER => 1         // ask for raw response instead of bool
));

$response = curl_exec($curl); // Send the request, save the response
echo '<pre>';
print_r(json_decode($response)); // print json decoded response
echo '</pre>';
curl_close($curl); // Close request

***************