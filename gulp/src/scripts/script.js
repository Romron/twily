const
   WIDTH = 1200,
   HEIGHT = 600,
   WIDTH_DPI = WIDTH * 2,
   HEIGHT_DPI = HEIGHT * 2;


window.onload = function () {
   let url = './module_php/parser.php';

   let jaxPromise = new Promise(function (resolve, reject) {
      ajaxGet(url, function (data) { resolve(data); });
   });

   jaxPromise.then((result) => {
      let data = result;
      // для визуализации на экране
      let usrStr = '<pre>' + data + '<pre>';    // что бы можно было нормально читать
      const initBlock_1 = new Init('#initBlock_1', usrStr);
      let prepData = PreparationData(data);
      const initBlock_2 = new Init('#initBlock_2', prepData[1]);
      initBlock_1.CreateBlock('#initial-data', '400px');
      initBlock_2.CreateBlock('#initial-data', "auto");
      formulas();

      // работа canvas
      canvas(prepData[0]);


   },
   );

}


function ajaxGet(url, callbackfunction) {
   let func = callbackfunction || function (data) { }

   let request = new XMLHttpRequest();
   request.onreadystatechange = function () {
      if (request.readyState == 4 && request.status == 200) {
         func(request.responseText);
      }
   }

   request.open('GET', url);
   request.send();

}

class Init {
   constructor(idNewBlock, data) {
      this.idNewBlock = idNewBlock;
      this.data = data;
   }

   CreateBlock(idTargetBlock, widthNewBlock = '') {
      this.widthNewBlock = widthNewBlock;

      if (!document.getElementById(this.idNewBlock)) {
         this.NewBlock = document.createElement('div');
         this.NewBlock.id = this.idNewBlock;
         this.NewBlock.classList.add('initBlocks');
         this.NewBlock.innerHTML = this.data;

         let str = document.querySelector(idTargetBlock).textContent;
         if ((/Исходные данные/i).test(str) != false) {
            document.querySelector(idTargetBlock).textContent = '';
         }
         this.NewBlock.style.width = this.widthNewBlock;
         document.querySelector(idTargetBlock).append(this.NewBlock);
      }
      return this.NewBlock;
   }

}

function PreparationData(data) {
   /**
    * Преобразует данные в удобный формат
    * 
    */
   let arrResultsData = [];
   let arrData = [];
   let str = JSON.parse(data);


   let candles = str['Time Series (Digital Currency Daily)'];

   resultsData = Object
      // .keys(str['Time Series (Digital Currency Daily)'])
      .keys(candles)
      .forEach((key) => {

         // console.log(str['Time Series (Digital Currency Daily)'][key]['1b. open (USD)']);
         // console.log(candles[key]);
         // console.log(candles[key]['1b. open (USD)']);
         arrResultsData.push(candles[key]['1b. open (USD)']);
      });

   strResult = arrResultsData.join('<br>')
   arrData = [
      arrResultsData,   // для дальнейшей обработки в коде
      strResult   // для вывода на экран
   ]
   return arrData;
}

function formulas() {

   let arrFormuls = [
      'yi = hCanvas - y` - инверсия координат',
      'xi = x`',
      '',
      'h - высота canvas в CSS',
      'hd = h*2- высота canvas в HTML',
      'wd = w*2- ширина canvas в HTML',
      'p - padding  canvas для поля графика ',
      'hv = hd - p*2  - высота поля графика в canvas',
      'wv = wd',
      'Y = hd - p - yi * yRatio ',
      'yRatio = hv / deltaY',
      'deltaY = maxY - minY',
      'xRatio = wv / (lengthX-2)',
      'lengthX - количество точек по Х',
      'count_Y = 5, количество горизонтальных линий сетки',
      'textSize = (maxY - minY)/count_Y, количество горизонтальных линий сетки',

   ];

   strResult = arrFormuls.join('<br>')
   const initBlock_3 = new Init('#formuls-block', strResult);
   initBlock_3.CreateBlock('#block-results', "auto");
}

function canvas(data) {

   const canvas = document.getElementById('canv-1');
   const ctx = canvas.getContext('2d');
   canvas.style.width = WIDTH;
   canvas.style.height = HEIGHT;
   canvas.width = WIDTH_DPI;
   canvas.height = HEIGHT_DPI;

   let dataTest = data.slice(0, 10);
   // console.log("dataTest = ", dataTest);

   ctx.beginPath();
   let k = [];

   let dataTest_2 = data.map((num, index) => {
      return k = [index * 10, num / 100];
      // return num * 2;

   })

   ctx.lineWidth = 4;
   ctx.strokeStyle = '#f00808';

   console.log("dataTest_2 = ", dataTest_2);

   for (const [x, y] of dataTest_2) {

      console.log("x = ", x);
      console.log("y = ", y);

      ctx.lineTo(x, HEIGHT_DPI - y);
   }
   ctx.stroke();
   ctx.closePath();


   let dataTest1 = [
      [0, 0],
      [200, 200],
      [400, 100],
      [600, 300],
      [800, 50],

   ]

   ctx.beginPath();
   ctx.lineWidth = 4;
   ctx.strokeStyle = '#055a13';




   for (const [x, y] of dataTest1) {

      // console.log("x = ", x);
      // console.log("y = ", HEIGHT_DPI - y);

      ctx.lineTo(x, HEIGHT_DPI - y);
   }
   ctx.stroke();
   ctx.closePath()


}

