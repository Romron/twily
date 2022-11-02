
export class Chart {
   /**
    * график и всё что на нём
    * 
    * получает в формате json
    *    idTargetBlock -- html блок в котором нужно разместить canvas 
      *  idCanvas --  id  canvas 
    *    canvasHight -- высота canvas 
    *    canvasWidht -- ширина canvas 
    * создаёт canvas -- singlTone
    * рисует график -- singlTone
    * 
    * */

   data = {};

   constructor(params) {
      this.params = params;
      this.HEIGHT_DPI = params.canvasHight * 2;
      this.WIDTH_DPI = params.canvasWidht * 2;
      this.scaleX = params.scaleX;
      this.scaleY = params.scaleY;
      this.PADDING_Y = params.PADDING_Y;

      if (!document.getElementById(params.idCanvas)) {
         this.canvas = document.createElement("canvas");
         this.canvas.id = params.idCanvas;
         document.getElementById(params.idTargetBlock).append(this.canvas);
         this.canvas.style.width = params.canvasWidht + 'px';
         this.canvas.style.height = params.canvasHight + 'px';
         this.canvas.width = this.WIDTH_DPI;
         this.canvas.height = this.HEIGHT_DPI;
         this.ctx = this.canvas.getContext('2d');
      }

      this.init();

   }


   init() {

      const boundCircul = this.circul.bind(this);
      const boundPaint = this.paint.bind(this);
      const boundClear = this.clear.bind(this);
      const boundHorizontalPointer = this.horizontalPointer.bind(this);
      const boundHorizontalPointerText = this.horizontalPointerText.bind(this);

      const proxy = new Proxy({}, {
         set(...args) {
            const result = Reflect.set(...args);
            requestAnimationFrame(() => {
               boundClear(proxy.mouse);
               boundPaint();
               boundCircul(proxy.mouse);
               boundHorizontalPointer(proxy.mouse);
               boundHorizontalPointerText(proxy.mouse)
            });

            return result;
         }
      });

      this.canvas.addEventListener('mousemove', ({ clientX, clientY }) => {
         const { left, top } = this.canvas.getBoundingClientRect()      // т.к. координаты канваса не савпадают с координатами экрана  
         proxy.mouse = {
            x: (clientX - left) * 2,      // преобразование в WIDTH_DPI
            y: (clientY - top) * 2,       // преобразование в HEIGHT_DPI
         }
      });



   }

   horizontalPointerText(mouse) {
      this.ctx.font = '30px Arial';
      this.ctx.fillText(Math.ceil((this.HEIGHT_DPI - mouse.y - this.PADDING_Y) * 100), this.WIDTH_DPI - 80, mouse.y);
      this.ctx.fillText(Math.ceil(mouse.x), mouse.x, this.HEIGHT_DPI - 10);
   }

   grid_lines() {
      // отрисовка горизонтальных линий сетки
      this.ctx.beginPath();
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = '#ADB5D9';
      this.ctx.font = '20px Arial';
      for (let i = 0; i < this.HEIGHT_DPI; i = i + 100) {
         this.ctx.moveTo(0, this.HEIGHT_DPI - Math.abs(this.HEIGHT_DPI - i) * this.scaleY - this.PADDING_Y);
         this.ctx.lineTo(this.WIDTH_DPI, this.HEIGHT_DPI - Math.abs(this.HEIGHT_DPI - i) * this.scaleY - this.PADDING_Y);
         this.ctx.strokeText((this.HEIGHT_DPI - i) * 100, this.WIDTH_DPI - 70, this.HEIGHT_DPI - Math.abs(this.HEIGHT_DPI - i) * this.scaleY - this.PADDING_Y);
      }

      let str = '';
      let str_1 = '';
      let str_2 = '';
      let str_3 = '';
      Object.keys(this.data).reverse().forEach((key, x) => {
         if (key.endsWith('01')) {
            str_1 = key.slice(8, 10);
            str_2 = key.slice(5, 7);
            str_3 = key.slice(0, 4).slice(2, 4);
            str = `${str_1}.${str_2}.${str_3}`;
            this.ctx.moveTo(Math.round(x * this.scaleX), 0);
            this.ctx.lineTo(Math.round(x * this.scaleX), this.HEIGHT_DPI - this.PADDING_Y);
            this.ctx.strokeText(str, Math.round(x * this.scaleX) - 50, this.HEIGHT_DPI - 10);
         }
      });

      this.ctx.stroke();
      this.ctx.closePath();
   }

   paint() {

      this.grid_lines(this.ctx, this.data);
      // отрисовка графика

      this.ctx.beginPath();
      this.ctx.lineWidth = 3;
      this.ctx.strokeStyle = '#f00808';
      Object.keys(this.data).reverse().forEach((key, x) => {
         this.ctx.lineTo(
            x * this.params.scaleX,
            this.HEIGHT_DPI - this.data[key]['1b. open (USD)'] / 100 * this.params.scaleY - this.params.PADDING_Y);
      });

      this.ctx.stroke();
      this.ctx.closePath();
   }

   horizontalPointer(mouse) {

      this.ctx.beginPath();
      this.ctx.lineWidth = 1;
      this.ctx.moveTo(mouse.x, mouse.y);
      this.ctx.lineTo(mouse.x, this.WIDTH_DPI);
      this.ctx.strokeStyle = '#3A3A3C';
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.moveTo(mouse.x, mouse.y);
      this.ctx.lineTo(this.WIDTH_DPI, mouse.y);
      this.ctx.stroke();



   }


   circul(mouse) {

      this.ctx.beginPath();
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = '#3A3A3C';
      this.ctx.arc(mouse.x, mouse.y, 7, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.closePath();

   }

   clear() {
      this.ctx.clearRect(0, 0, this.WIDTH_DPI, this.HEIGHT_DPI);
   }

}


export const page = {
   /**
    * формирует страницу приложения в т.ч. блок который будет содержать канвас
    */
   method_1: function () {

      console.log('page  page  page  page  page  page  page  page  ');
   }
}
      });



   }

export class DataProcessing {
   /**
    * всё что касается получения и оброботки данных
    */

   constructor(url) {
      this.url = url;
   }

   GetData() {
      return new Promise((resolve, reject) => {
         const request = new XMLHttpRequest();
         request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200) {
               resolve(request.responseText);
            }
         }
         request.open('GET', this.url);
         request.send();
      })
   }

   PreparationData(data) {
      /**
       * преобразует данные в удобный формат
       * разварачивает масив по датам
       *
       */
      let arrResultsData = [];
      let arrData = [];
      let str = JSON.parse(data);

      let candles = str['Time Series (Digital Currency Daily)'];

      Object.keys(candles).forEach((key) => {
         arrResultsData.push(candles[key]['1b. open (USD)']);
      });

      // arrResultsData = arrResultsData.reverse();
      // let strResult = arrResultsData.join('<br>')
      // arrData = [
      //    arrResultsData,   // для тестов
      //    strResult,   // для вывода на экран
      //    candles,    // для чистовика
      // ]


      return candles;
   }
});


}

paint() {

}

//    // работа canvas
//    canvas(prepData[2]);

// });

// }

horizontalPointer(mouse) {

   this.ctx.beginPath();
   this.ctx.lineWidth = 1;
   this.ctx.moveTo(mouse.x, mouse.y);
   this.ctx.lineTo(mouse.x, this.WIDTH_DPI);
   this.ctx.strokeStyle = '#3A3A3C';
   this.ctx.stroke();


   // class Init {
   //    constructor(idNewBlock, data) {
   //       this.idNewBlock = idNewBlock;
   //       this.data = data;
   //    }

   //    CreateBlock(idTargetBlock, widthNewBlock = '') {

   //       this.widthNewBlock = widthNewBlock;

   //       if (!document.getElementById(this.idNewBlock)) {
   //          this.NewBlock = document.createElement('div');
   //          this.NewBlock.id = this.idNewBlock;
   //          this.NewBlock.classList.add('initBlocks');
   //          this.NewBlock.innerHTML = this.data;

   //          let str = document.querySelector(idTargetBlock).textContent;
   //          if ((/Исходные данные/i).test(str) != false) {
   //             document.querySelector(idTargetBlock).textContent = '';
   //          }
   //          this.NewBlock.style.width = this.widthNewBlock;
   //          document.querySelector(idTargetBlock).append(this.NewBlock);
   //       }
   //       return this.NewBlock;
   //    }

   // }

   // function canvas(data) {

   //    const canvas = document.getElementById('canv-1');
   //    const ctx = canvas.getContext('2d');
   //    canvas.style.width = WIDTH;
   //    canvas.style.height = HEIGHT;
   //    canvas.width = WIDTH_DPI;
   //    canvas.height = HEIGHT_DPI;
   //    let raf;



   //    const proxy = new Proxy({}, {
   //       set(...args) {
   //          const result = Reflect.set(...args);
   //          raf = requestAnimationFrame(paint)

   //          return result;
   //       }
   //    });

   //    function clear() {
   //       ctx.clearRect(0, 0, WIDTH_DPI, HEIGHT_DPI);
   //    }

   //    canvas.addEventListener('mousemove', mousemove);
   //    function mousemove({ clientX, clientY }, ctx) {
   //       // console.log('X = ', clientX);
   //       // console.log('Y = ', clientY);
   //       proxy.mouse = {
   //          x: clientX,
   //          y: clientY,
   //       }


   //    }

   //    function paint() {
   //       console.log("proxy.mouse.x = ", proxy.mouse.x);
   //       console.log("proxy.mouse.y = ", proxy.mouse.y);
   //       clear();

   //       grid_lines(ctx, data);
   //       // отрисовка графика
   //       ctx.beginPath();
   //       ctx.lineWidth = 3;
   //       ctx.strokeStyle = '#f00808';
   //       resultsData = Object.keys(data).reverse().forEach((key, x) => {
   //          ctx.lineTo(x * scaleX, HEIGHT_DPI - data[key]['1b. open (USD)'] / 100 * scaleY - PADDING_Y);
   //       });

   //       ctx.stroke();
   //       ctx.closePath();



   //       ctx.beginPath();
   //       ctx.lineWidth = 1;
   //       ctx.strokeStyle = '#f00808';

   //       ctx.arc(proxy.mouse.x, proxy.mouse.y, 10, 0, Math.PI * 2);

   //       ctx.stroke();
   //       ctx.closePath();
   //    }



   //    return {
   //       destroy() {
   //          cancelAnimationFrame(raf);
   //          canvas.removeEventListener('mousemove', mousemove);
   //       }
   //    }
   // }








   // function grid_lines(ctx, data) {
   //    // отрисовка горизонтальных линий сетки
   //    ctx.beginPath();
   //    ctx.lineWidth = 1;
   //    ctx.strokeStyle = '#B1AFB3';
   //    ctx.font = '30px Arial';
   //    for (let i = 0; i < HEIGHT_DPI; i = i + 100) {
   //       ctx.moveTo(0, HEIGHT_DPI - Math.abs(HEIGHT_DPI - i) * scaleY - PADDING_Y);
   //       ctx.lineTo(WIDTH_DPI, HEIGHT_DPI - Math.abs(HEIGHT_DPI - i) * scaleY - PADDING_Y);
   //       ctx.fillText((HEIGHT_DPI - i) * 100, WIDTH_DPI - 110, HEIGHT_DPI - Math.abs(HEIGHT_DPI - i) * scaleY - PADDING_Y);
   //    }
   //    ctx.font = '20px Arial';

   //    let str = '';
   //    let str_1 = '';
   //    let str_2 = '';
   //    let str_3 = '';
   //    resultsData = Object.keys(data).reverse().forEach((key, x) => {
   //       if (key.endsWith('01')) {
   //          str_1 = key.slice(8, 10);
   //          str_2 = key.slice(5, 7);
   //          str_3 = key.slice(0, 4).slice(2, 4);
   //          str = `${str_1}.${str_2}.${str_3}`;
   //          ctx.moveTo(Math.round(x * scaleX), 0);
   //          ctx.lineTo(Math.round(x * scaleX), HEIGHT_DPI - PADDING_Y);
   //          ctx.fillText(str, Math.round(x * scaleX) - 50, HEIGHT_DPI - 10);
   //       }
   //    });

   //    ctx.stroke();
   //    ctx.closePath();
   // }

   return candles;
}



// function formulas() {

//    let arrFormuls = [
//       'yi = hCanvas - y` - инверсия координат',
//       'xi = x`',
//       '',
//       'h - высота canvas в CSS',
//       'hd = h*2- высота canvas в HTML',
//       'wd = w*2- ширина canvas в HTML',
//       'p - padding  canvas для поля графика ',
//       'hv = hd - p*2  - высота поля графика в canvas',
//       'wv = wd',
//       'Y = hd - p - yi * yRatio ',
//       'yRatio = hv / deltaY',
//       'deltaY = maxY - minY',
//       'xRatio = wv / (lengthX-2)',
//       'lengthX - количество точек по Х',
//       'count_Y = 5, количество горизонтальных линий сетки',
//       'textSize = (maxY - minY)/count_Y, количество горизонтальных линий сетки',

//    ];

//    strResult = arrFormuls.join('<br>')
//    const initBlock_3 = new Init('#formuls-block', strResult);
//    // initBlock_3.CreateBlock('#block-results', "auto");
//    // initBlock_3.CreateBlock('.block-controls', "auto");
// }


// // ============   черновик   ======================


// function canvasScaling() {

// }




   // ctx.beginPath();

   // ctx.lineWidth = 1;
   // ctx.strokeStyle = '#f00808';

   // arc(clientX, clientY, 10, 0, Math.PI * 2);

   // ctx.stroke();
   // ctx.closePath();
