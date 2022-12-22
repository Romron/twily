<?php

// час
// $data = file_get_contents("https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY_EXTENDED&symbol=IBM&interval=60min&slice=year1month1&apikey=AH6Q8FIVTHBGOJLC");
// $data = file_get_contents("https://www.alphavantage.co/query?function=CRYPTO_INTRADAY&symbol=BTC&market=UAH&interval=60min&apikey=AH6Q8FIVTHBGOJLC");
$data = file_get_contents("https://www.alphavantage.co/query?function=CRYPTO_INTRADAY&symbol=ETH&market=USD&interval=5min&apikey=AH6Q8FIVTHBGOJLC");
//  ('https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY       &symbol=BTC&market=UAH&apikey=9PKRO03JZ2KF9LEV');
echo '<pre>';
print_r($data);
echo '<pre>';

// $rows = explode("\n", $data);
// $s = array();
// foreach ($rows as $row) {
//    $s[] = str_getcsv($row);
//    print_r($s);
// }

// $data_file = file_get_contents($file);         // для тестов из  файла

// echo $data_file;