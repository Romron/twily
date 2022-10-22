const
   WIDTH = 1800,
   HEIGHT = 600,
   WIDTH_DPI = WIDTH * 2,
   HEIGHT_DPI = HEIGHT * 2,
   ROWS_AMOUNT = 5,
   PADDING_Y = 30,
   VIEW_HEIGT = HEIGHT_DPI - PADDING_Y * 2,
   scaleX = 3.5,
   scaleY = 1;



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

function canvas(data) {

   const canvas = document.getElementById('canv-1');
   const ctx = canvas.getContext('2d');
   canvas.style.width = WIDTH;
   canvas.style.height = HEIGHT;
   canvas.width = WIDTH_DPI;
   canvas.height = HEIGHT_DPI;
   let raf;



   const proxy = new Proxy({}, {
      set(...args) {
         const result = Reflect.set(...args);
         raf = requestAnimationFrame(paint)

         return result;
      }
   });

   function clear() {
      ctx.clearRect(0, 0, WIDTH_DPI, HEIGHT_DPI);
   }
   canvas.addEventListener('mousemove', mousemove);
   function mousemove({ clientX, clientY }, ctx) {
      // console.log('X = ', clientX);
      // console.log('Y = ', clientY);
      proxy.mouse = {
         x: clientX,
         y: clientY,
      }


   }

   function paint() {
      console.log("proxy.mouse.x = ", proxy.mouse.x);
      console.log("proxy.mouse.y = ", proxy.mouse.y);
      clear();

      grid_lines(ctx, data);
      // отрисовка графика
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#f00808';
      resultsData = Object.keys(data).reverse().forEach((key, x) => {
         ctx.lineTo(x * scaleX, HEIGHT_DPI - data[key]['1b. open (USD)'] / 100 * scaleY - PADDING_Y);
      });

      ctx.stroke();
      ctx.closePath();



      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#f00808';

      ctx.arc(proxy.mouse.x, proxy.mouse.y, 10, 0, Math.PI * 2);

      ctx.stroke();
      ctx.closePath();
   }




   return {
      destroy() {
         cancelAnimationFrame(raf);
         canvas.removeEventListener('mousemove', mousemove);
      }
   }
}








function grid_lines(ctx, data) {
   // отрисовка горизонтальных линий сетки
   ctx.beginPath();
   ctx.lineWidth = 1;
   ctx.strokeStyle = '#B1AFB3';
   ctx.font = '30px Arial';
   for (let i = 0; i < HEIGHT_DPI; i = i + 100) {
      ctx.moveTo(0, HEIGHT_DPI - Math.abs(HEIGHT_DPI - i) * scaleY - PADDING_Y);
      ctx.lineTo(WIDTH_DPI, HEIGHT_DPI - Math.abs(HEIGHT_DPI - i) * scaleY - PADDING_Y);
      ctx.fillText((HEIGHT_DPI - i) * 100, WIDTH_DPI - 110, HEIGHT_DPI - Math.abs(HEIGHT_DPI - i) * scaleY - PADDING_Y);
   }
   ctx.font = '20px Arial';

   let str = '';
   let str_1 = '';
   let str_2 = '';
   let str_3 = '';
   resultsData = Object.keys(data).reverse().forEach((key, x) => {
      if (key.endsWith('01')) {
         str_1 = key.slice(8, 10);
         str_2 = key.slice(5, 7);
         str_3 = key.slice(0, 4).slice(2, 4);
         str = `${str_1}.${str_2}.${str_3}`;
         ctx.moveTo(Math.round(x * scaleX), 0);
         ctx.lineTo(Math.round(x * scaleX), HEIGHT_DPI - PADDING_Y);
         ctx.fillText(str, Math.round(x * scaleX) - 50, HEIGHT_DPI - 10);
      }
   });

   ctx.stroke();
   ctx.closePath();
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
   // initBlock_3.CreateBlock('#block-results', "auto");
   // initBlock_3.CreateBlock('.block-controls', "auto");
}


// ============   черновик   ======================


function canvasScaling() {

}




   // ctx.beginPath();

   // ctx.lineWidth = 1;
   // ctx.strokeStyle = '#f00808';

   // arc(clientX, clientY, 10, 0, Math.PI * 2);

   // ctx.stroke();
   // ctx.closePath();
