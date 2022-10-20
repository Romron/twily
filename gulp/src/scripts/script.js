const
   WIDTH = 1200,
   HEIGHT = 600,
   WIDTH_DPI = WIDTH * 2,
   HEIGHT_DPI = HEIGHT * 2,
   ROWS_AMOUNT = 5,
   PADDING = 50,
   VIEW_HEIGT = HEIGHT_DPI - PADDING * 2;



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
      canvas(prepData[2]);


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
    * разварачивает масив по датам 
    * 
    */
   let arrResultsData = [];
   let arrData = [];
   let str = JSON.parse(data);

   let candles = str['Time Series (Digital Currency Daily)'];

   // console.log("candles = ", candles);

   // console.log("Object.keys(candles) = ", Object.keys(candles));

   resultsData = Object.keys(candles).forEach((key) => {
      arrResultsData.push(candles[key]['1b. open (USD)']);
   });




   arrResultsData = arrResultsData.reverse();
   strResult = arrResultsData.join('<br>')
   arrData = [
      arrResultsData,   // для тестов
      strResult,   // для вывода на экран
      candles,    // для чистовика
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


   grid_lines(ctx, data);

   //движение мыши
   let y = 0;
   let x = 0;
   canvas.addEventListener('mousemove', (e) => {
      console.log('x1 =', x);
      console.log('y1 =', y);

      ctx.beginPath();

      ctx.lineWidth = 1;
      ctx.strokeStyle = '#f00808';

      ctx.arc(e.offsetX * 2, e.offsetY * 2, 10, 0, Math.PI * 2);

      ctx.stroke();
      ctx.closePath();
      console.log('x2 =', x);
      console.log('y2 =', y);
      y = e.offsetY;
      x = e.offsetX;
      console.log('x3 =', x);
      console.log('y3 =', y);

   });



   // отрисовка графика

   ctx.beginPath();

   ctx.lineWidth = 3;
   ctx.strokeStyle = '#f00808';

   resultsData = Object.keys(data).reverse().forEach((key, x) => {

      ctx.lineTo(x * 2.2, HEIGHT_DPI - data[key]['1b. open (USD)'] / 100 - PADDING);

   });

   ctx.stroke();
   ctx.closePath();

   return {
      destroy() {
         canvas.removeEventListener('mousemove', mousemove)
      }
   }
}

function mousemove({ clientX, clientY }, ctx) {
   console.log(clientX);
   console.log(clientY);

   ctx.beginPath();

   ctx.lineWidth = 1;
   ctx.strokeStyle = '#f00808';

   arc(clientX, clientY, 10, 0, Math.PI * 2);

   ctx.stroke();
   ctx.closePath();

}

function grid_lines(ctx, data) {
   // отрисовка горизонтальных линий сетки

   ctx.beginPath();
   ctx.lineWidth = 1;
   ctx.strokeStyle = '#b1b0b0';
   ctx.font = '30px Arial';

   for (let i = 00; i <= HEIGHT_DPI; i += 100) {
      ctx.moveTo(0, HEIGHT_DPI - i - PADDING);
      ctx.lineTo(WIDTH_DPI, HEIGHT_DPI - i - PADDING);
      ctx.fillText(i * 100, WIDTH_DPI - 100, HEIGHT_DPI - i - PADDING);
   }

   ctx.stroke();
   ctx.closePath();

   // отрисовка вертикальных линий

   ctx.beginPath();


   // ctx.lineWidth = 1;
   ctx.strokeStyle = '#b1b0b0';
   ctx.font = '20px Arial';

   resultsData = Object.keys(data).reverse().forEach((key, x) => {

      // ctx.lineTo(x * 2.2, HEIGHT_DPI - data[key]['1b. open (USD)'] / 100 - PADDING);
      ctx.fillText(key, x * 2.2, HEIGHT_DPI - 20);

   });

   ctx.stroke();
   ctx.closePath();



}