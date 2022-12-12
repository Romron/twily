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
      wheel: {},
      event: {},
   };
   coordinates = {
      xOffset: 0,    // смещение графика захватом мышки
      yOffset: 0,
      xNull: 0,      // вычесленный нуль
      yNull: 0,
      x: 0,    // то же по ходу ноль!! найти способ объединить все формулы в xNull, yNull
      y: 0,
   }
   // proxy = {};

   constructor(canvas, proxy, params) {

      this.canvas = canvas;
      this.ctx = canvas.context;
      this.params = params;
      this.proxy = proxy;

      this.widthCanvas = this.params.widthMainConteiner - this.params.widthYaxis;
      this.heightCanvas = this.params.heightMainConteiner - this.params.hightXaxis;

      this.WIDTH_DPI = this.widthCanvas * 2; //canvas.WIDTH_DPI;
      this.HEIGHT_DPI = this.heightCanvas * 2; // canvas.HEIGHT_DPI;



      this.HEIGHT_GRAPH_FILD = this.HEIGHT_DPI - (this.params.paddingTop + this.params.paddingBottom + this.params.hightXaxis);
      this.WIDTH_GRAPH_FILD = this.WIDTH_DPI - (this.params.paddingLeft + this.params.paddingRight + this.params.widthYaxis);

      // console.log("this.params.hightXaxis = ", this.params.hightXaxis);
      // console.log("this.params.widthYaxis = ", this.params.widthYaxis);


      canvas.canvas.style.cssText = `position: absolute;
                                     /*top:0px;*/
                                     /*left:0px;*/

                                     bottom:${this.params.hightXaxis}px;
                                     right:${this.params.widthYaxis}px;

                                     z-index: 5;
                                     background-color: ${this.params.backgroundChart};
                                     height:${this.heightCanvas}px;
                                     width:${this.widthCanvas}px;
                                     /*border: 1px solid blue;*/
                                     `;

      this.canvas.canvas.height = this.HEIGHT_DPI;
      this.canvas.canvas.width = this.WIDTH_DPI;

      this.oldMousePosX = 0;  // для отслеживания движения курсора 
      this.oldMousePosY = 0;  // для отслеживания движения курсора

      this.Xaxis = new X_axis(this);      // здесь для того что бы можно было отключать координатную сетку а шкалы оставались
      this.Yaxis = new Y_axis(this);

   }

   coordinateseCalculation() {

      this.coordinates.xNull = this.WIDTH_DPI - this.params.paddingRight;
      this.coordinates.yNull = this.HEIGHT_DPI - this.params.paddingBottom;

      this.coordinates.x = this.coordinates.xNull - this.coordinates.xOffset;
      this.coordinates.y = this.coordinates.yNull - this.coordinates.yOffset;

      let deltaX = this.oldMousePosX - this.mouse.pos.x;
      let deltaY = this.oldMousePosY - this.mouse.pos.y;

      if (Object.keys(this.mouse.event).length != 0
         && this.coordinates.y > this.mouse.pos.y
         && this.mouse.pos.x < this.coordinates.xNull) {

         this.linePointer();
         this.Yaxis.pointer();
         this.circul();

         if (this.mouse.event.target.id == 'canvas-chart') {
            if (this.mouse.event.type === 'wheel') {  // изменение масштаба по оси X
               this.mouse.event.preventDefault();     // запрещает перемотку всей страницы
               if (this.mouse.wheel.wheelY > 0) {
                  this.params.scaleX = this.params.scaleX + 0.02;
               } else if (this.mouse.wheel.wheelY < 0) {
                  this.params.scaleX = this.params.scaleX - 0.02;
               } else {
                  console.log("this.mouse.wheel.wheelY = ", this.mouse.wheel.wheelY);  // для тестов
               }
            }
            // перемещение поля графика вслед за курсором
            if (this.mouse.isPressed == true) {
               if (deltaX < 0) {
                  if (Math.abs(deltaX) < 200) {
                     this.coordinates.xOffset = this.coordinates.xOffset - Math.abs(deltaX);
                     this.oldMousePosX = this.mouse.pos.x;
                  } else {
                     this.coordinates.xOffset = this.coordinates.xOffset - 5;
                     this.oldMousePosX = this.mouse.pos.x;
                  }
               } else if (deltaX > 0) {
                  if (Math.abs(deltaX) < 200) {
                     this.coordinates.xOffset = this.coordinates.xOffset + Math.abs(deltaX);
                     this.oldMousePosX = this.mouse.pos.x;
                  } else {
                     this.coordinates.xOffset = this.coordinates.xOffset + 5;
                     this.oldMousePosX = this.mouse.pos.x;
                  }
               }
               if (deltaY < 0) {
                  if (Math.abs(deltaY) < 200) {
                     this.coordinates.yOffset = this.coordinates.yOffset - Math.abs(deltaY);
                     this.oldMousePosY = this.mouse.pos.y;
                  } else {
                     this.coordinates.yOffset = this.coordinates.yOffset - 5;
                     this.oldMousePosY = this.mouse.pos.y;
                  }
               } else if (deltaY > 0) {
                  if (Math.abs(deltaY) < 200) {
                     this.coordinates.yOffset = this.coordinates.yOffset + Math.abs(deltaY);
                     this.oldMousePosY = this.mouse.pos.y;
                  } else {
                     this.coordinates.yOffset = this.coordinates.yOffset + 5;
                     this.oldMousePosY = this.mouse.pos.y;
                  }
               }
            }
         }

         if (this.mouse.event.target.id == 'Y_axis') {
            if (this.mouse.isPressed == true) {    // изменение масштаба по оси Y
               if (deltaY > 0) {
                  this.params.scaleY = this.params.scaleY + 0.01;
               } else {
                  this.params.scaleY = this.params.scaleY - 0.01;
               }
               this.oldMousePosY = this.mouse.pos.y;
            }

         }

      }
   }

   graph() {

      // this.mainField();    // для тестов
      this.CoordinateGrid();

      this.ctx.beginPath();
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = this.params.colorChartLine;
      let x, y;

      Object.keys(this.data).forEach((key, n) => {
         x = this.coordinates.x - n * this.params.scaleX;
         y = this.coordinates.y - this.data[key]['1b. open (USD)'] / 100 * this.params.scaleY;
         if (x < this.coordinates.xNull
            && x > this.params.paddingLeft) {
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


      this.ctx.beginPath();      // для тестов 
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = 'red';
      this.ctx.moveTo(this.coordinates.xNull, this.coordinates.yNull);
      this.ctx.lineTo(this.coordinates.xNull - 500, this.coordinates.yNull);
      this.ctx.stroke();


      // координатная сетка по оси X
      this.ctx.beginPath();
      this.ctx.lineWidth = this.params.widthCoordinatsLineX;
      this.ctx.strokeStyle = this.params.colorCoordinatsLineX;
      this.ctx.font = '20px Arial';

      this.widthToRight = this.WIDTH_GRAPH_FILD - this.coordinates.xOffset;     // расстояние от нуля графика до края холста
      this.widthToLeft = this.coordinates.xOffset;     // расстояние от нуля графика до края холста
      this.xLine = 0;

      let nLine = 0;
      let arrDays = Object.keys(this.data);
      if (arrDays.length != 0) {

         for (let n = 0; n < arrDays.length; n++) {
            if (arrDays[n].endsWith('01')) {
               this.distanceBetweenLines = this.xLineOld - this.xLine;
               nLine++;
               this.xLineOld = this.xLine;
               this.xLine = Math.round(this.coordinates.x - n * this.params.scaleX);
               this.distanceBetweenLines = this.xLineOld - this.xLine;

               this._drawLines(nLine);
               if (this.distanceBetweenLines < 150 && nLine % 2 != 0) {
                  continue;
               }

               this.Xaxis.drawAxis(arrDays[n], nLine, this.xLine, this.distanceBetweenLines);
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
      this.ctx.lineWidth = this.params.widthCoordinatsLineY;
      this.ctx.strokeStyle = this.params.colorCoordinatsLineY;
      this.ctx.font = '20px Arial';

      console.log("----------");
      let y;
      for (let i = 0; i < this.HEIGHT_DPI + Math.abs(this.coordinates.yOffset); i = i + 10) {

         y = this.coordinates.y - i * this.params.scaleY;

         if (y < this.coordinates.yNull && y > this.params.paddingTop + 10) {
            this.ctx.moveTo(this.coordinates.xNull, y);
            this.ctx.lineTo(this.params.paddingLeft, y);

            console.log("y = ", y);
            console.log("i = ", i);
            console.log("y - i = ", y - i);

            this.Yaxis.drawAxis(y, i);
         }
      }
      if (this.coordinates.yOffset > 10) {
         for (let i = 0; i < this.coordinates.yOffset; i = i + 10) {
            this.ctx.moveTo(this.coordinates.xNull, y + i);
            this.ctx.lineTo(this.params.paddingLeft, y + i);

         }
      }
      this.ctx.stroke();
   }

   _drawLines(nLine) {
      if (nLine == 2) {
         for (let xLineTR = this.xLine; xLineTR < this.WIDTH_GRAPH_FILD; xLineTR = xLineTR + this.distanceBetweenLines) {
            this.ctx.moveTo(xLineTR, this.params.paddingTop);
            this.ctx.lineTo(xLineTR, this.coordinates.yNull);
         }
      }
      if (this.xLine < this.coordinates.xNull) {         // запрет рисовать сетку в зоне правого padding
         this.ctx.moveTo(this.xLine, this.params.paddingTop);
         this.ctx.lineTo(this.xLine, this.coordinates.yNull);
      }
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

   linePointer() {
      this.ctx.beginPath();
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = '#3A3A3C';
      this.ctx.setLineDash([4, 16]);      // устанавливается для всего холста


      // вертикальный указатель
      this.ctx.moveTo(this.mouse.pos.x + this.params.paddingLeft, this.mouse.pos.y + this.params.paddingTop);
      this.ctx.lineTo(this.mouse.pos.x + this.params.paddingLeft, this.coordinates.yNull);

      // горизонтальный указатель
      this.ctx.moveTo(this.mouse.pos.x + this.params.paddingLeft, this.mouse.pos.y + this.params.paddingTop);
      this.ctx.lineTo(this.coordinates.xNull, this.mouse.pos.y + this.params.paddingTop);

      this.ctx.stroke();
      this.ctx.setLineDash([]);     // сброс штриховки и возврат к сплошным линиям
   }

   circul() {
      this.canvas.canvas.style.cursor = 'none';
      this.ctx.beginPath();
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = '#3A3A3C';
      this.ctx.arc(this.mouse.pos.x + this.params.paddingLeft, this.mouse.pos.y + this.params.paddingTop, 7, 0, Math.PI * 2);
      this.ctx.stroke();
   }

   clear() {
      this.ctx.clearRect(0, 0, this.WIDTH_DPI, this.HEIGHT_DPI);
      this.Yaxis.clearAxis();
      this.Xaxis.clearAxis();
   }

   mainField() {
      this.ctx.beginPath();
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = 'green';

      this.ctx.moveTo(this.params.paddingLeft, this.params.paddingTop);
      this.ctx.lineTo(this.WIDTH_DPI - this.params.paddingRight, this.params.paddingTop);
      this.ctx.lineTo(this.WIDTH_DPI - this.params.paddingRight, this.HEIGHT_DPI - this.params.paddingBottom);
      this.ctx.lineTo(this.params.paddingLeft, this.HEIGHT_DPI - this.params.paddingBottom);
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