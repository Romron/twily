const
   WIDTH = 1200,
   HEIGHT = 600,
   WIDTH_DPI = WIDTH * 2,
   HEIGHT_DPI = HEIGHT * 2;


window.onload = function () {
   let url = './module_php/parser.php';

   // document.querySelector('#parser-start-button').onclick = function () {
   ajaxGet(url);

   canvas();




   // }
}


function ajaxGet() {

   return new Promise((resolve, reject) => {
      q().then(data => {
         console.log(data);
      })

   })


}


function q() {
   let request = new XMLHttpRequest();
   let url = './module_php/parser.php'

   request.onreadystatechange = function () {
      if (request.readyState == 4 && request.status == 200) {
         return request.responseText
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

function canvas() {

   const canvas = document.getElementById('canv-1');
   const ctx = canvas.getContext('2d');
   canvas.style.width = WIDTH;
   canvas.style.height = HEIGHT;
   canvas.width = WIDTH_DPI;
   canvas.height = HEIGHT_DPI;

   ctx.fillRect(100, 100, 50, 50);

   ctx.beginPath();
   ctx.moveTo(500, 300);
   ctx.lineTo(400, 550);
   ctx.stroke();

   // console.log("data = ", data);

}

function formulas() {
   let Canvas = document.querySelector('#canv-1');
   // let arrFormuls;

   let hCanvas = Canvas.height;
   let wCanvas = Canvas.width;

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



   // let strResult = arrFormuls.map((q) => {
   //    console.log(q);
   //    q = q + '<br>';
   //    console.log(q);
   // })


   strResult = arrFormuls.join('<br>')

   // console.log("strResult = ", strResult);

   // strResult = form_1 + '<br>' + form_2 + '<br>' + form_3 + '<br>' + form_4 + '<br>' + form_5 + '<br>' + form_6;
   const initBlock_3 = new Init('#formuls-block', strResult);
   initBlock_3.CreateBlock('#block-results', "auto");
}
