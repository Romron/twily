<!DOCTYPE html>
<html lang="en">

<head>
   <meta charset="UTF-8">
   <meta http-equiv="X-UA-Compatible" content="IE=edge">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <link rel="stylesheet" href="../build/css/main.css">
   <title>Twily</title>
</head>

<body>
   <div class="wrap">
      <h1>Twily</h1>
      <form action="">
         <div class="block-controls">
            <div id='initial-data' class="initial-data">Исходные данные</div>
            <!-- <div id="formuls-block"></div> -->
            <div class="button" id="parser-start-button" type="submit">Старт парсера</div>
         </div>
      </form>
      <div id="block-results" class="block-results">
         <canvas id="canv-1" width="1800" height="600"></canvas>
      </div>
      <!-- автоматом удаляет закрывающюу кавычку тега php ???? -->
      <!-- @@include('./parts/footer.php') -->


   </div>
   <!-- <script src="../build/js/app.js"></script> -->
   <script type="module" src="../build/js/app.js"></script> работает: без babel, в новом синтаксисе
   <!-- <script src="../build/js/script.js"></script> -->
   <!-- <script type="text/javascript" src="../build/js/all.js"></script> -->
   <!-- <script type="module" src="../build/js/all.js"></script> -->
</body>

</html>