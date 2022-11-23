import { X_axis, Y_axis } from "./Axis.js";



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
   mouse = {
      pos: {},
      wheel: {}
   };
   coordinates = {}

   constructor(canvas, params) {

      this.canvas = canvas;
      this.ctx = canvas.context;
      this.HEIGHT_DPI = canvas.HEIGHT_DPI;
      this.WIDTH_DPI = canvas.WIDTH_DPI;

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


      this.Xaxis = new X_axis(this);      // здесь для того что бы можно было отключать координатную сетку а шкалы оставались
      this.Yaxis = new Y_axis(this);

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

      this.scaleX = this.scaleX + this.mouse.wheel;
      this.scaleX = +this.scaleX.toFixed(3);

      if (this.scaleX < 0.1) {
         this.scaleX = 0.1;
         this.mouse.wheel = 0.1;
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

      // this.mainField();    // для тестов
      this.CoordinateGrid();

      if (this.mouse.pos.x > this.paddingLeft
         && this.mouse.pos.x < this.WIDTH_GRAPH_FILD
         && this.mouse.pos.y > this.paddingTop
         && this.mouse.pos.y < this.HEIGHT_GRAPH_FILD) {
         this.horizontalPointer();
         this.horizontalPointerText();
         this.circul();
      }

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

   }

   horizontalPointerText() {
      this.ctx.font = '25px Arial';
      this.ctx.fillText(Math.ceil((this.coordinates.yNull - this.mouse.pos.y - this.paddingTop) / this.scaleY * 100) + 26, this.WIDTH_DPI - this.widthYaxis / 1.1, this.mouse.pos.y);
      this.ctx.fillText(Math.ceil(this.coordinates.xNull - this.mouse.pos.x - this.paddingRight), this.mouse.pos.x, this.HEIGHT_DPI - this.hightXaxis / 2);
   }

   horizontalPointer() {
      this.ctx.beginPath();
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = '#3A3A3C';
      this.ctx.setLineDash([4, 16]);      // устанавливается для всего холста


      // вертикальный указатель
      this.ctx.moveTo(this.mouse.pos.x + this.paddingRight, this.mouse.pos.y + this.paddingTop);
      this.ctx.lineTo(this.mouse.pos.x + this.paddingRight, this.coordinates.yNull);

      // горизонтальный указатель

      this.ctx.moveTo(this.mouse.pos.x + this.paddingRight, this.mouse.pos.y + this.paddingTop);
      this.ctx.lineTo(this.coordinates.xNull, this.mouse.pos.y + this.paddingTop);


      this.ctx.stroke();
      this.ctx.setLineDash([]);     // сброс штриховки и возврат к сплошным линиям
   }

   circul() {
      this.canvas.canvas.style.cursor = 'none';
      this.ctx.beginPath();
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = '#3A3A3C';
      this.ctx.arc(this.mouse.pos.x + this.paddingRight, this.mouse.pos.y + this.paddingTop, 7, 0, Math.PI * 2);
      this.ctx.stroke();
      // this.ctx.closePath();
   }

   clear() {
      this.ctx.clearRect(0, 0, this.WIDTH_DPI, this.HEIGHT_DPI);
   }

   mainField() {
      this.ctx.beginPath();
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = 'green';

      this.ctx.moveTo(this.paddingLeft, this.paddingTop);
      this.ctx.lineTo(this.WIDTH_DPI - this.paddingRight, this.paddingTop);
      this.ctx.lineTo(this.WIDTH_DPI - this.paddingRight, this.HEIGHT_DPI - this.paddingBottom);
      this.ctx.lineTo(this.paddingLeft, this.HEIGHT_DPI - this.paddingBottom);
      this.ctx.closePath();
      this.ctx.stroke();



   }

}