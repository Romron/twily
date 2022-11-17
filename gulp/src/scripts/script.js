

export class Chart {
   /**
    * патерн Фасад
    * собирает весь холст внутри этого класса
    * 
    * необходимые сущьности
    *    холст canv()
    *       получает
    *          массив params
    *          массив с данными data
    *       путём единого(!!) для всего приложения цыкле перебора данных
    *       связывает данные с координатами холста   
    *       в этом цыкле отрисовывается:
    *          оси
    *          сетку
    *          график
    *    _график graph(){}
    *       отрисовка графика
    *    ось X  X_axis(){} -- отдельные объекты
    *       создать шкалу
    *    ось Y Y_axis(){} -- отдельные объекты
    *       создать шкалу
    *    _координатная сетка  CoordinateGrid()
    *       создать сетку
    *    данные Data()
    *       получает
    *          URL для запроса данных
    *       выполняет
    *          отправляет зарос для получения данных
    *          получает данные 
    *          подготавливает данные
    *       возвращает
    *          подготовленные данные
    *    _управление CanvControl()
    *       _прослушивает события
    *          мыши
    *          клавиатуры
    *       _интерпритирует события
    *       _возвращает 
    *          управляющий сигнал(??????)
    *             инфотмацию согласно которой 
    *                будут пересчитываться координаты при масштабировании   
    *    _расчёт координат
    *       получает
    *          X - курсора мыши
    *          Y - курсора мыши
    *          текущий масштаб
            выполняет
            возвращает
    *    масштабировании холста
            цели
               отобразить участок графика более/менее детально
            способ
               получить границы выбранного участка холста
               получить границы участока графика
               получить срез данных которые соответствуют выбраному участку графика
               отобразить соответствующий  участока графика пропорционально изменив его ленейные размеры
               отобразить элементы холста из выбранного участка пропорционально изменив их ленейные размеры
    */

   data = {};


   constructor(params) {
      this.HEIGHT_DPI = params.canvasHight * 2;
      this.WIDTH_DPI = params.canvasWidht * 2;

      this.scaleX = params.scaleX;
      this.scaleY = params.scaleY;

      this.paddingTop = params.paddingTop;
      this.paddingBottom = params.paddingBottom;
      this.paddingLeft = params.paddingLeft;
      this.paddingRight = params.paddingRight;
      this.widthYaxis = params.widthYaxis;
      this.hightXaxis = params.hightXaxis;

      this.HEIGHT_GRAPH_FILD = this.HEIGHT_DPI - (this.paddingTop + this.paddingBottom + this.hightXaxis);
      this.WIDTH_GRAPH_FILD = this.WIDTH_DPI - (this.paddingLeft + this.paddingRight + this.widthYaxis);

      this.mouse = {};
      this.coordinates = {}

      this.offsetX = 2000;

      if (!document.getElementById(params.idCanvas)) {
         this.canvas = document.createElement("canvas");
         this.canvas.id = params.idCanvas;
         document.getElementById(params.idTargetBlock).append(this.canvas);
         this.canvas.style.width = params.canvasWidht + 'px';
         this.canvas.style.height = params.canvasHight + 'px';
         this.canvas.width = this.WIDTH_DPI;
         this.canvas.height = this.HEIGHT_DPI;
         this.ctx = this.canvas.getContext('2d');

         this.mc = new MouseControls(this.canvas);
         this.Xaxis = new X_axis(this);
         this.Yaxis = new Y_axis(this);

      }

      this._init();
   }

   _init() {

      // this.CoordinateGrid();

      const proxy = new Proxy({}, {
         set(...args) {
            const result = Reflect.set(...args);
            requestAnimationFrame(() => {
               proxy.this.clear();
               // proxy.this.CoordinateGrid();
               proxy.this.graph();
               proxy.this.horizontalPointer();
               proxy.this.horizontalPointerText();
               proxy.this.circul();
               proxy.this.coordinateseCalculation(proxy.this.offsetX, 0);

               proxy.this.funcForTest();

            });
            return result;
         }
      });

      proxy.this = this;
      proxy.mc = this.mc;

      this.canvas.addEventListener('mousemove', ({ clientX, clientY }) => {      // получание текущих координат курсора
         const { left, top } = this.canvas.getBoundingClientRect()      // т.к. координаты канваса не савпадают с координатами экрана  
         proxy.mouse = {
            x: (clientX - left) * 2,      // преобразование в WIDTH_DPI
            y: (clientY - top) * 2,       // преобразование в HEIGHT_DPI
         }

         this.mouse = proxy.mouse;
      });

      this.canvas.addEventListener('wheel', (e) => {
         const DefouitScaleX = this.scaleX;

         this.scaleX = this.scaleX + proxy.mc.wheel;
         this.scaleX = +this.scaleX.toFixed(3);

         if (this.scaleX < 0.1) {
            this.scaleX = 0.1;
            proxy.mc.wheel = 0.1;
         }

         proxy.this.clear();
         // proxy.this.CoordinateGrid();
         proxy.this.graph();
         proxy.this.horizontalPointer();
         proxy.this.horizontalPointerText();
         proxy.this.circul();
         proxy.this.coordinateseCalculation(this.offsetX, 0);

         proxy.this.funcForTest();
      });

   }

   coordinateseCalculation(offsetX, offsetY) {

      let xNull = (this.WIDTH_DPI - this.paddingRight - this.widthYaxis);
      let yNull = (this.HEIGHT_DPI - this.paddingBottom - this.hightXaxis);

      this.coordinates = {
         xNull: xNull,
         yNull: yNull,
         xOffset: xNull - offsetX,
         yOffset: yNull - offsetY
      }

   }

   funcForTest() {

      this.ctx.beginPath();
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = 'red';
      this.ctx.arc(this.coordinates.xOffset, this.coordinates.yOffset, 5, 0, Math.PI * 2);
      this.ctx.stroke();

   }

   graph() {

      this.CoordinateGrid();


      this.ctx.beginPath();
      Object.keys(this.data).forEach((key, n) => {

         this.ctx.lineWidth = 2;
         this.ctx.strokeStyle = '#252229';

         if (n == 0) {
            this.ctx.moveTo(
               this.WIDTH_DPI - n * this.scaleX - this.paddingRight - this.widthYaxis - this.mainX,
               this.HEIGHT_DPI - this.data[key]['1b. open (USD)'] / 100 * this.scaleY - this.paddingBottom - this.hightXaxis
            );
         }
         this.ctx.lineTo(
            this.coordinates.xOffset - n * this.scaleX,
            this.HEIGHT_DPI - this.data[key]['1b. open (USD)'] / 100 * this.scaleY - this.paddingBottom - this.hightXaxis
         );
      });

      this.ctx.stroke();

   }


   CoordinateGrid() {
      /**
       * рисует координатную сетку которая 
       *    изменяеться при изменении масштаба
       *       ось X  градуируется 
       *          от месяцев до дней
       *       ось Y  градуируется 
       *          от единиц до тысяч
       * К сетке привязать данные!!!
       *    
       */


      this.Xaxis.drawAxis(this.data);
      this.Yaxis.drawAxis();
      // this.Xaxis.writeText(this.data)

   }

   horizontalPointerText() {
      this.ctx.font = '25px Arial';
      this.ctx.fillText(Math.ceil((this.coordinates.yNull - this.mouse.y) / this.scaleY * 100) + 26, this.WIDTH_DPI - this.widthYaxis / 1.1, this.mouse.y);
      this.ctx.fillText(Math.ceil(this.coordinates.xNull - this.mouse.x), this.mouse.x, this.HEIGHT_DPI - this.hightXaxis / 2);
   }

   horizontalPointer() {
      this.ctx.beginPath();
      this.ctx.lineWidth = 1;
      this.ctx.setLineDash([4, 16]);      // устанавливается для всего холста
      this.ctx.moveTo(this.mouse.x, this.mouse.y);
      this.ctx.lineTo(this.mouse.x, this.WIDTH_DPI);
      this.ctx.strokeStyle = '#3A3A3C';
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.moveTo(this.mouse.x, this.mouse.y);
      this.ctx.lineTo(this.WIDTH_DPI, this.mouse.y);
      // this.ctx.closePath();
      this.ctx.stroke();
      this.ctx.setLineDash([]);     // сброс штриховки и возврат к сплошным линиям
   }

   circul() {
      this.ctx.beginPath();
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = '#3A3A3C';
      this.ctx.arc(this.mouse.x, this.mouse.y, 7, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.closePath();
   }

   clear() {
      this.ctx.clearRect(0, 0, this.WIDTH_DPI, this.HEIGHT_DPI);
   }

}

class MouseControls {
   constructor(conteiner) {
      this.conteiner = conteiner;

      this.isPressed = false;
      this.isDown = false;
      this.isUp = false;
      this.pos = { x: 0, y: 0 };
      this.wheel = 0;


      // conteiner.addEventListener('click', e => this.cangeState(e));
      // conteiner.addEventListener('dblclick', e => this.cangeState(e));
      // conteiner.addEventListener('mouseenter', e => this.cangeState(e));
      this.conteiner.addEventListener('mousedown', e => this.cangeState(e));
      this.conteiner.addEventListener('mouseup', e => this.cangeState(e));
      this.conteiner.addEventListener('wheel', e => this.cangeState(e));
      this.conteiner.addEventListener('mouseleave', e => this.cangeState(e));
      this.conteiner.addEventListener('contextmenu', e => this.cangeState(e));
   }

   cangeState(e) {

      this.pos.x = e.clientX;
      this.pos.y = e.clientY;

      if (e.type === 'mousedown') {
         this.isPressed = true;
         this.isDown = true;
         this.isUp = false;
      } else if (e.type === 'mouseup') {
         this.isPressed = false;
         this.isDown = false;
         this.isUp = true;
      } else if (e.type === 'wheel') {
         e.preventDefault();
         // console.log("e.deltaY = ", e.deltaY);

         let q = e.deltaY + e.deltaX;

         if (q > 0) {
            this.wheel = 0.1;
         } else if (q < 0) {
            this.wheel = -0.1;
         } else {
            this.wheel = 0;
         }

         // if (e.deltaY > 0) {
         //    this.wheel += 0.1;
         // } else {
         //    this.wheel -= 0.1;

         // }

      } else if (e.type === 'contextmenu') {
         e.preventDefault();
      }

   }


}

class X_axis {
   /**
    * при маштобировании сетки растояния между вертикальными линиями меняются!!
    * градуировка шкалы не меняется
    */

   constructor(canv_this) {

      this.canv = canv_this;

   }

   drawAxis(data) {

      this.field();

      this.canv.ctx.beginPath();
      this.canv.ctx.strokeStyle = '#ADB5D9';
      this.canv.ctx.font = '20px Arial';




      this.widthToRight = this.canv.WIDTH_GRAPH_FILD - this.canv.coordinates.xOffset;     // расстояние от нуля графика до края
      this.widthToLeft = this.canv.coordinates.xOffset;     // расстояние от нуля графика до края
      this.distanceBetweenLines = 100;
      this.xLine = 0;

      let nLine = 0, xLineOld;


      // let arrToMonths = Object.keys(data).filter((key) => {
      //    if (key.endsWith('01')) {
      //       return true;
      //    }
      // })

      // for (let n = 0; n < arrToMonths.length; n++) {
      //    console.log("arrToMonths[n] = ", arrToMonths[n]);

      // }

      let arrDays = Object.keys(data);
      var qqq;

      for (let n = 0; n < arrDays.length; n++) {
         if (arrDays[n].endsWith('01')) {
            nLine++;
            console.log("nLine = ", nLine);
            this.xLineOld = this.xLine;
            this.xLine = Math.round(this.canv.coordinates.xOffset - n * this.canv.scaleX);
            this.drawLines(arrDays[n], n, nLine);
            this.writeText(arrDays[n], n, nLine);
         }
         if (this.xLine < 0) {

            break;
         }

      }

      // Object.keys(data).forEach((key, n) => {

      //    if (key.endsWith('01')) {

      //       this.xLine = Math.round(this.canv.coordinates.xOffset - n * this.canv.scaleX);
      //       this.amountLineToRight = (this.canv.WIDTH_GRAPH_FILD - this.canv.coordinates.xOffset) / this.distanceBetweenLines;

      //       this.drawLines(key, n, nLine);
      //       this.writeText(key, n, nLine);

      //       nLine++;
      //    }

      // });


      this.canv.ctx.stroke();

   }

   field() {
      this.canv.ctx.beginPath();
      this.canv.ctx.lineWidth = 1;
      // this.canv.ctx.strokeStyle = '#ADB5D9';
      this.canv.ctx.strokeStyle = 'blue';

      this.canv.ctx.moveTo(this.canv.paddingLeft, this.canv.HEIGHT_DPI - this.canv.paddingBottom);
      this.canv.ctx.lineTo(this.canv.WIDTH_DPI - this.canv.paddingRight - this.canv.widthYaxis, this.canv.HEIGHT_DPI - this.canv.paddingBottom);
      this.canv.ctx.lineTo(this.canv.WIDTH_DPI - this.canv.paddingRight - this.canv.widthYaxis, this.canv.HEIGHT_DPI - this.canv.paddingBottom - this.canv.hightXaxis);
      this.canv.ctx.lineTo(this.canv.paddingLeft, this.canv.HEIGHT_DPI - this.canv.paddingBottom - this.canv.hightXaxis);
      this.canv.ctx.closePath();
      this.canv.ctx.stroke();
   }

   drawLines(key, n, nLine) {

      if (nLine == 2) {

         this.distanceBetweenLines = this.xLineOld - this.xLine;

         console.log(" this.xLineOld = ", this.xLineOld);
         console.log("this.xLine = ", this.xLine);
         console.log("this.distanceBetweenLines = ", this.distanceBetweenLines);


         for (let xLineTR = this.xLine; xLineTR < this.canv.WIDTH_GRAPH_FILD; xLineTR = xLineTR + this.distanceBetweenLines) {
            this.canv.ctx.moveTo(xLineTR, this.canv.paddingTop + 20);
            this.canv.ctx.lineTo(xLineTR, this.canv.coordinates.yNull + 20);     // 20 -- декоративная риска на оси Х
         }


      }

      this.canv.ctx.moveTo(this.xLine, this.canv.paddingTop + 20);
      this.canv.ctx.lineTo(this.xLine, this.canv.coordinates.yNull + 20);    // 20 -- декоративная риска на оси Х


   }

   writeText(key, n) {

      // this.canv.ctx.save();

      // this.canv.ctx.beginPath();
      // this.canv.ctx.lineWidth = 3;
      // this.canv.ctx.strokeStyle = 'red';
      // this.canv.ctx.font = '20px Arial';
      // console.log("*** this.xLine = ", this.xLine);

      let str = '';
      let str_1 = '';
      let str_2 = '';
      let str_3 = '';


      str_1 = key.slice(8, 10);
      str_2 = key.slice(5, 7);
      str_3 = key.slice(0, 4).slice(2, 4);
      str = `${str_1}.${str_2}.${str_3}`;
      // console.log("+++++++++++ this.xLine = ", this.xLine);
      this.canv.ctx.strokeText(str, this.xLine, this.canv.coordinates.yNull + 40);


      // this.canv.ctx.stroke();
      // this.canv.ctx.restore();


   }



}

class Y_axis {
   /**
    * при маштобировании сетки растояния между горизонтальными линиями не меняются!!
    * градуировка шкалы меняется 
    */

   constructor(canv_this) {
      this.canv = canv_this;

   }

   drawAxis() {

      // this.field();

      this.canv.ctx.beginPath();
      this.canv.ctx.lineWidth = 1;
      this.canv.ctx.strokeStyle = '#ADB5D9';

      this.canv.ctx.font = '20px Arial';
      for (let i = this.canv.HEIGHT_DPI; i > 0; i = i - 100) {
         this.canv.ctx.moveTo(this.canv.paddingLeft, this.canv.coordinates.yNull - Math.abs(this.canv.HEIGHT_DPI - i) * this.canv.scaleY);
         this.canv.ctx.lineTo(this.canv.coordinates.xNull + 20, this.canv.coordinates.yNull - Math.abs(this.canv.HEIGHT_DPI - i) * this.canv.scaleY);
         this.canv.ctx.strokeText((this.canv.HEIGHT_DPI - i) * 100, this.canv.WIDTH_DPI - 80, this.canv.coordinates.yNull - Math.abs(this.canv.HEIGHT_DPI - i) * this.canv.scaleY);
      }
      this.canv.ctx.stroke();
   }

   field() {

      this.canv.ctx.beginPath();
      this.canv.ctx.lineWidth = 2;
      // this.canv.ctx.globalAlpha = 1;
      // this.canv.ctx.strokeStyle = '#ADB5D9';
      this.canv.ctx.strokeStyle = 'blue';
      this.canv.ctx.moveTo(this.canv.WIDTH_DPI - this.canv.paddingRight, this.canv.paddingTop);
      this.canv.ctx.lineTo(this.canv.WIDTH_DPI - this.canv.paddingRight, this.canv.HEIGHT_DPI - this.canv.paddingBottom - this.canv.hightXaxis);
      this.canv.ctx.lineTo(this.canv.WIDTH_DPI - this.canv.paddingRight - this.canv.widthYaxis, this.canv.HEIGHT_DPI - this.canv.paddingBottom - this.canv.hightXaxis);
      this.canv.ctx.lineTo(this.canv.WIDTH_DPI - this.canv.paddingRight - this.canv.widthYaxis, this.canv.paddingTop);
      this.canv.ctx.closePath();
      this.canv.ctx.stroke();

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

export const page = {
   /**
    * формирует страницу приложения в т.ч. блок который будет содержать канвас
    */
   method_1: function () {

      console.log('page  page  page  page  page  page  page  page  ');
   }
}