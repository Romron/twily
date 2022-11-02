
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
   mouse = {
      x: 100
   };
   coordinats = {};

   constructor(params) {
      this.params = params;
      this.HEIGHT_DPI = params.canvasHight * 2;
      this.WIDTH_DPI = params.canvasWidht * 2;
      this.scaleX = params.scaleX;
      this.scaleY = params.scaleY;

      this.paddingTop = params.paddingTop;
      this.paddingBottom = params.paddingBottom;
      this.paddingLeft = params.paddingLeft;
      this.paddingRight = params.paddingRight;

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


   coordinateCalculation() {
      /**
       * единое место для манипуляции с координатами
       * 
       * увязать 
       *    координаты мыши
       *    координаты холста
       *    данные из date
       * 
       * возвращает объект с универсальными координатами пригоднми для 
       *    непосредственного, без какой либо доработки, использования во всех методах
       *       для 
       *          отрисовки фигур 
       *          позиционирования надписей 
       */

      this.coordinats = {
         coordinats: {
            X(n) { return n * this.scaleX + this.paddingLeft },      // 
            Y(key) { return this.HEIGHT_DPI - this.data[key]['1b. open (USD)'] / 100 * this.scaleY - this.paddingRight }
         },
         mouse: {},
         date: {}
      };

      // console.log(" coordinats = ", coordinats.coordinats.Y());

      // Object.keys(this.data).reverse().forEach((key, n) => {

      //    console.log("key, n = ", key, n);

      //    if (n == 0) {
      //       this.ctx.moveTo(
      //          n * this.params.scaleX + this.paddingLeft,
      //          this.HEIGHT_DPI - this.data[key]['1b. open (USD)'] / 100 * this.params.scaleY - this.paddingRight);
      //    }
      //    this.ctx.lineTo(
      //       n * this.params.scaleX + this.paddingLeft,
      //       this.HEIGHT_DPI - this.data[key]['1b. open (USD)'] / 100 * this.params.scaleY - this.paddingRight);
      // });




      this.coordinats.mouse = this.mouse;
      // console.log("coordinats.mouse.x = ", coordinats.mouse.x);
      // console.log("coordinats.mouse.y = ", coordinats.mouse.y);
      // console.log("coordinats.date = ", coordinats.date);
      // return coordinats;
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
         this.mouse = proxy.mouse;

         this.coordinateCalculation();       // перерасчёт координат при движении мыши

      });



   }

   paint() {

      this.paintPaddings()
      this.grid_lines();
      // отрисовка графика

      this.ctx.beginPath();
      this.ctx.lineWidth = 3;
      this.ctx.strokeStyle = '#f00808';
      Object.keys(this.data).reverse().forEach((key, n) => {

         // console.log("key, n = ", key, n);
         // console.log("this.coordinats.coordinats.X(n) = ", this.coordinats.coordinats.X(n));

         if (n == 0) {
            this.ctx.moveTo(
               this.coordinats.coordinats.X(n),
               // n * this.params.scaleX + this.paddingLeft,
               this.HEIGHT_DPI - this.data[key]['1b. open (USD)'] / 100 * this.params.scaleY - this.paddingRight
            );
         }
         this.ctx.lineTo(
            // this.coordinats.coordinats.X(n),
            n * this.params.scaleX + this.paddingLeft,
            this.HEIGHT_DPI - this.data[key]['1b. open (USD)'] / 100 * this.params.scaleY - this.paddingRight
         );
      });

      this.ctx.stroke();
      this.ctx.closePath();
   }

   paintPaddings() {
      this.ctx.beginPath();
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = '#ADB5D9';
      this.ctx.moveTo(this.paddingLeft, this.paddingTop);
      this.ctx.lineTo(this.WIDTH_DPI - this.paddingRight, this.paddingTop);
      this.ctx.lineTo(this.WIDTH_DPI - this.paddingRight, this.HEIGHT_DPI - this.paddingBottom);
      this.ctx.lineTo(this.paddingLeft, this.HEIGHT_DPI - this.paddingBottom);
      this.ctx.closePath();
      this.ctx.stroke();
   }
   grid_lines() {
      // отрисовка горизонтальных линий сетки
      this.ctx.beginPath();
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = '#ADB5D9';
      this.ctx.font = '20px Arial';
      for (let i = 0; i < this.HEIGHT_DPI; i = i + 100) {
         this.ctx.moveTo(0, this.HEIGHT_DPI - Math.abs(this.HEIGHT_DPI - i) * this.scaleY - this.paddingLeft);
         this.ctx.lineTo(this.WIDTH_DPI - this.paddingRight, this.HEIGHT_DPI - Math.abs(this.HEIGHT_DPI - i) * this.scaleY);
         this.ctx.strokeText((this.HEIGHT_DPI - i) * 100, this.WIDTH_DPI - 70, this.HEIGHT_DPI - Math.abs(this.HEIGHT_DPI - i) * this.scaleY - this.paddingRight);
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
            this.ctx.moveTo(Math.round(x * this.scaleX) + this.paddingLeft, this.paddingTop);
            this.ctx.lineTo(Math.round(x * this.scaleX) + this.paddingLeft, this.HEIGHT_DPI - this.paddingBottom);
            this.ctx.strokeText(str, Math.round(x * this.scaleX) - 50 + this.paddingLeft, this.HEIGHT_DPI - 10);
         }
      });

      this.ctx.stroke();
      this.ctx.closePath();
   }

   horizontalPointerText(mouse) {
      this.ctx.font = '25px Arial';
      this.ctx.fillText(Math.ceil((this.HEIGHT_DPI - mouse.y - this.paddingRight) * 100), this.WIDTH_DPI - 80, mouse.y);
      this.ctx.fillText(Math.ceil(mouse.x), mouse.x, this.HEIGHT_DPI - 10);
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
};


