<!DOCTYPE html>
<html lang="en">

<head>
   <meta charset="UTF-8">
   <meta http-equiv="X-UA-Compatible" content="IE=edge">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <link rel="stylesheet" href="./style/normalize.css">
   <link rel="stylesheet" href="./style/index.css">
   <title>Twily</title>
</head>


<body>
   <!-- //http://localhost/twily/simpl_php/index.php -->
   <div class="wrap">
      <h1>Twily</h1>
      <form action="">
         <div class="block-controls">
            <div class="initial-data">
               <h3>Источник данных pro.coinmarketcap.com</h3>
            </div>
            <div class="button" id="parser-start-button" type="submit">Старт парсера</div>
         </div>
      </form>
      <div id="block-results" class="block-results">
         Блок результатов


      </div>
   </div>

   <script src="./libs/module_js/main.js"></script>
</body>

</html>