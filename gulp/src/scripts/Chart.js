import { X_axis, Y_axis } from "./Axis.js";




export class Chart {
   /**
    * патерн Фасад
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
   coordinates = {
      xOffset: 0,
      yOffset: 0,
      xNull: 0,
      yNull: 0,
   }

   constructor(canvas, params) {

      this.canvas = canvas;
      this.ctx = canvas.context;

      this.heightCanvas = params.heightMainConteiner - params.hightXaxis;
      this.widthCanvas = params.widthMainConteiner - params.widthYaxis;

      this.HEIGHT_DPI = this.heightCanvas * 2; // canvas.HEIGHT_DPI;
      this.WIDTH_DPI = this.widthCanvas * 2; //canvas.WIDTH_DPI;

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

      canvas.canvas.style.cssText = `position: absolute;
                                     top:0px;
                                     left:0px;
                                     z-index: 5;
                                     height:${this.heightCanvas}px;
                                     width:${this.widthCanvas}px;
                                     border: 1px solid blue;
                                     `;


      this.canvas.canvas.height = this.HEIGHT_DPI;
      this.canvas.canvas.width = this.WIDTH_DPI;



      this.oldMousePosX = 0;  // для отслеживания движения курсора 
      this.oldMousePosY = 0;  // для отслеживания движения курсора

      this.Xaxis = new X_axis(this);      // здесь для того что бы можно было отключать координатную сетку а шкалы оставались
      this.Yaxis = new Y_axis(this);


   }

   coordinateseCalculation() {

      this.coordinates.xNull = this.WIDTH_DPI - this.paddingRight - this.widthYaxis;
      this.coordinates.yNull = this.HEIGHT_DPI - this.paddingBottom - this.hightXaxis;

      this.scaleX = this.scaleX + this.mouse.wheel;
      this.scaleX = +this.scaleX.toFixed(3);

      let deltaX = this.oldMousePosX - this.mouse.pos.x;
      let deltaY = this.oldMousePosY - this.mouse.pos.y;


      if (this.scaleX < 0.1) {   // изменение масштаба по оси X 
         this.scaleX = 0.1;
         this.mouse.wheel = 0.1;
      }

      if (this.mouse.isPressed == true && this.mouse.pos.x > this.WIDTH_GRAPH_FILD) {  // изменение масштаба по оси Y 
         if (deltaY > 0) {
            this.scaleY = this.scaleY + 0.02;
         } else {
            this.scaleY = this.scaleY - 0.02;
         }
         this.oldMousePosY = this.mouse.pos.y;
      }

      if (this.mouse.isPressed == true &&    // перемещение поля графика вслед за курсором
         this.mouse.pos.x > this.paddingLeft &&
         this.mouse.pos.x < this.WIDTH_GRAPH_FILD) {

         if (deltaX < 0) {
            this.coordinates.xOffset = this.coordinates.xOffset - 5;
            this.oldMousePosX = this.mouse.pos.x;
         } else if (deltaX > 0) {
            this.coordinates.xOffset = this.coordinates.xOffset + 5;
            this.oldMousePosX = this.mouse.pos.x;
         }
         if (deltaY < 0) {
            this.coordinates.yOffset = this.coordinates.yOffset - 5;
            this.oldMousePosY = this.mouse.pos.y;
         } else if (deltaY > 0) {
            this.coordinates.yOffset = this.coordinates.yOffset + 5;
            this.oldMousePosY = this.mouse.pos.y;
         }

      }


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
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = '#252229';
      let x, y;
      Object.keys(this.data).forEach((key, n) => {
         x = this.coordinates.xNull - n * this.scaleX - this.coordinates.xOffset;
         y = this.coordinates.yNull - this.data[key]['1b. open (USD)'] / 100 * this.scaleY - this.coordinates.yOffset;
         if (x < this.coordinates.xNull
            && x > this.paddingLeft) {

            if (n == 0) {
               this.ctx.moveTo(x - this.mainX, y);
            }
            this.ctx.lineTo(x, y);
         }
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

      // координатная сетка по оси X
      this.ctx.beginPath();
      this.ctx.strokeStyle = '#ADB5D9';
      this.ctx.font = '20px Arial';

      this.widthToRight = this.WIDTH_GRAPH_FILD - this.coordinates.xOffset;     // расстояние от нуля графика до края
      this.widthToLeft = this.coordinates.xOffset;     // расстояние от нуля графика до края
      this.xLine = 0;

      let nLine = 0;
      let arrDays = Object.keys(this.data);
      if (arrDays.length != 0) {
         for (let n = 0; n < arrDays.length; n++) {
            if (arrDays[n].endsWith('01')) {
               this.distanceBetweenLines = this.xLineOld - this.xLine;
               nLine++;
               this.xLineOld = this.xLine;
               this.xLine = Math.round(this.coordinates.xNull - n * this.scaleX - this.coordinates.xOffset);
               this.distanceBetweenLines = this.xLineOld - this.xLine;
               if (this.xLine < this.coordinates.xNull && this.xLine > this.paddingLeft) {    // запрет отрисовки координамтной сетки на шкале
                  this._drawLines(nLine);
                  this._writeText(arrDays[n], n, nLine);
               }
               if (this.distanceBetweenLines < 150 && nLine % 2 != 0) {
                  continue;
               }
            }
            if (this.xLine < 0) {
               break;
            }
         }
      } else {
         console.log(" -- Данные ещё не получены -- ");
      }
      this.ctx.stroke();


      // координатная сетка по оси Y
      this.ctx.beginPath();
      this.ctx.lineWidth = 0.;
      this.ctx.strokeStyle = '#ADB5D9';
      this.ctx.font = '20px Arial';
      let x, y;
      for (let i = 0; i < this.HEIGHT_DPI + Math.abs(this.coordinates.yOffset); i = i + 10) {
         x = this.coordinates.xNull;
         y = this.coordinates.yNull - this.coordinates.yOffset - i * this.scaleY;
         if (y < this.coordinates.yNull && y > this.paddingTop + 10) {
            this.ctx.moveTo(x + 10, y);   // 10 -- декоративная риска на оси Y 
            this.ctx.lineTo(this.paddingLeft, y);
            this.ctx.strokeText(i * 100, x + 25, y);
         }
      }
      if (this.coordinates.yOffset > 10) {
         for (let i = 0; i < this.coordinates.yOffset; i = i + 10) {
            this.ctx.moveTo(this.coordinates.xNull, this.coordinates.yNull - this.coordinates.yOffset + i * this.scaleY);
            this.ctx.lineTo(this.paddingLeft, this.coordinates.yNull - this.coordinates.yOffset + i * this.scaleY);
         }
      }
      this.ctx.stroke();
   }

   _drawLines(nLine) {
      if (nLine == 2) {
         for (let xLineTR = this.xLine; xLineTR < this.WIDTH_GRAPH_FILD; xLineTR = xLineTR + this.distanceBetweenLines) {
            this.ctx.moveTo(xLineTR, this.paddingTop + 20);
            this.ctx.lineTo(xLineTR, this.coordinates.yNull + 20);     // 20 -- декоративная риска на оси Х
         }
      }
      this.ctx.moveTo(this.xLine, this.paddingTop + 20);
      this.ctx.lineTo(this.xLine, this.coordinates.yNull + 20);    // 20 -- декоративная риска на оси Х
   }

   _writeText(key) {

      let str = '';
      let str_1 = '';
      let str_2 = '';
      let str_3 = '';

      str_1 = key.slice(8, 10);
      str_2 = key.slice(5, 7);
      str_3 = key.slice(0, 4).slice(2, 4);
      str = `${str_1}.${str_2}.${str_3}`;
      this.ctx.strokeText(str, this.xLine - 40, this.coordinates.yNull + 40);
   }

   horizontalPointerText() {
      this.ctx.font = '25px Arial';

      this.ctx.fillText(
         Math.ceil((this.coordinates.yNull - this.mouse.pos.y - this.paddingTop - this.coordinates.yOffset) / this.scaleY * 100),
         this.WIDTH_DPI - this.widthYaxis / 1.1,
         this.mouse.pos.y
      );
      this.ctx.fillText(
         Math.ceil(this.coordinates.xNull - this.mouse.pos.x - this.paddingRight),
         this.mouse.pos.x,
         this.HEIGHT_DPI - this.hightXaxis / 2);
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

   funcForTest() {

      this.ctx.beginPath();
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = 'red';
      this.ctx.arc(this.coordinates.xOffset, this.coordinates.yOffset, 5, 0, Math.PI * 2);
      this.ctx.stroke();

   }

}