

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
    *  при масштабировании холста 
    *    определить участок массива данных для отображения 
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

      this.HEIGHT_GRAPH_FILD = this.HEIGHT_DPI - (this.paddingTop + this.paddingBottom);
      this.WIDTH_GRAPH_FILD = this.WIDTH_DPI - (this.paddingLeft + this.paddingRight);


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

      this.X_axis(key, n);


   }

   X_axis(key, n) {

      /**
       * КОЛ = n-Линии * k-X_axis 
       *    КОЛ - координата очередной линии
       * k-X_axis = КВЛ / КТО 
       *   КТО - общее количество точек по оси 
       *   КВЛ - количество вертикальных линий сетки которые нужно отобразить 
       * 
       * 
       */


      // this.HEIGHT_DPI = params.canvasHight * 2;
      // this.WIDTH_DPI = params.canvasWidht * 2;
      // this.scaleX = params.scaleX;
      // this.scaleY = params.scaleY;

      // this.paddingTop = params.paddingTop;
      // this.paddingBottom = params.paddingBottom;
      // this.paddingLeft = params.paddingLeft;
      // this.paddingRight = params.paddingRight;

      // this.HEIGHT_GRAPH_FILD = this.HEIGHT_DPI - (this.paddingTop + this.paddingBottom);
      // this.WIDTH_GRAPH_FILD = this.WIDTH_DPI - (this.paddingLeft + this.paddingRight);

      console.log("this.HEIGHT_GRAPH_FILD = ", this.HEIGHT_GRAPH_FILD);
      console.log("this.WIDTH_GRAPH_FILD = ", this.WIDTH_GRAPH_FILD);







   }

   Y_axis(key, n) {
      console.log("Y_axis(){}");
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