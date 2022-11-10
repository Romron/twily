

export class Chart {
   /**
    * патерн Фасад
    * собирает весь холст внутри этого класса
    * 
    * необходимые сущьности
    *    холст canv()
    *       получает
    *       путём единого(!!) для всего приложения цыкле перебора данных
    *       связывает данные с координатами холста   
    *       в этом цыкле отрисовывается:
    *          оси
    *          сетку
    *          график
    *    _график graph(){}
    *       отрисовка графика
    *    _ось X  X_axis(){}
    *       создать шкалу
    *    _ось Y Y_axis(){}
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



   }

   canv() {

      Object.keys(this.data).forEach((key, n) => {
         // console.log("key, n = ", key, n);
         setTimeout(() => {
            // this.graph(key, n);
            this.CoordinateGrid(key, n);
            // this.X_axis(key, n);
            // this.Y_axis(key, n);
         }, 100);
      });
   }

   graph(key, n) {

      if (n == 0) {
         this.ctx.moveTo(
            this.WIDTH_DPI - n * this.scaleX - this.paddingRight,
            this.HEIGHT_DPI - this.data[key]['1b. open (USD)'] / 100 * this.scaleY
         );
      }
      this.ctx.lineTo(
         this.WIDTH_DPI - n * this.scaleX - this.paddingRight,
         this.HEIGHT_DPI - this.data[key]['1b. open (USD)'] / 100 * this.scaleY
      );
      this.ctx.stroke();


   }

   CoordinateGrid(key, n) {
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


      let Xaxis = new X_axis(key, n, this);
      let Yaxis = new Y_axis(key, n, this);


   }



   // Y_axis(key, n) {
   //    console.log("Y_axis(){}");
   // }



}

class X_axis {


   constructor(key, n, canv) {

      this.key = key;
      this.n = n;
      this.canv = canv;

      let amountLine = Math.round(this.canv.WIDTH_GRAPH_FILD / 100);
      let k_X_axis = this.canv.WIDTH_GRAPH_FILD / amountLine;
      let xLine = Math.round(this.canv.WIDTH_DPI - (n * k_X_axis + this.canv.paddingRight + this.canv.widthYaxis));

      this.canv.ctx.beginPath();
      this.canv.ctx.strokeStyle = '#ADB5D9';
      this.canv.ctx.moveTo(xLine, this.canv.paddingTop);
      this.canv.ctx.lineTo(xLine, this.canv.HEIGHT_DPI - this.canv.paddingBottom - this.canv.hightXaxis);
      this.canv.ctx.stroke();

      // this._field();
   }

   _field() {
      this.canv.ctx.beginPath();
      this.canv.ctx.lineWidth = 2;
      // this.canv.ctx.strokeStyle = '#ADB5D9';
      this.canv.ctx.strokeStyle = 'blue';
      this.canv.ctx.moveTo(this.canv.paddingLeft, this.canv.HEIGHT_DPI - this.canv.paddingBottom);
      this.canv.ctx.lineTo(this.canv.WIDTH_DPI - this.canv.paddingRight - this.canv.widthYaxis, this.canv.HEIGHT_DPI - this.canv.paddingBottom);
      this.canv.ctx.lineTo(this.canv.WIDTH_DPI - this.canv.paddingRight - this.canv.widthYaxis, this.canv.HEIGHT_DPI - this.canv.paddingBottom - this.canv.hightXaxis);
      this.canv.ctx.lineTo(this.canv.paddingLeft, this.canv.HEIGHT_DPI - this.canv.paddingBottom - this.canv.hightXaxis);
      this.canv.ctx.closePath();
      this.canv.ctx.stroke();
   }

}

class Y_axis {


   constructor(key, n, canv) {
      this.key = key;
      this.n = n;
      this.canv = canv;





      this.canv.ctx.beginPath();
      this.canv.ctx.lineWidth = 1;
      this.canv.ctx.strokeStyle = '#ADB5D9';
      this.canv.ctx.font = '20px Arial';
      for (let i = 0; i < this.canv.HEIGHT_DPI; i = i + 100) {

         this.canv.ctx.moveTo(this.canv.paddingLeft, this.canv.HEIGHT_DPI - Math.abs(this.canv.HEIGHT_DPI - i) * this.canv.scaleY);
         this.canv.ctx.lineTo(this.canv.WIDTH_DPI - this.canv.paddingRight - this.canv.widthYaxis + 20, this.canv.HEIGHT_DPI - Math.abs(this.canv.HEIGHT_DPI - i) * this.canv.scaleY);
         this.canv.ctx.strokeText((this.canv.HEIGHT_DPI - i) * 100, this.canv.WIDTH_DPI - 80, this.canv.HEIGHT_DPI - Math.abs(this.canv.HEIGHT_DPI - i) * this.canv.scaleY);
         this.canv.ctx.stroke();
      }







      // this._field();
   }


   _field() {
      this.canv.ctx.beginPath();
      this.canv.ctx.lineWidth = 2;
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