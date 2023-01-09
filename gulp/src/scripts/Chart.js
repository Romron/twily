import { X_axis, Y_axis } from "./Axis.js";
import { Candle } from "./Candle.js";




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
      xOffset: 130,//86,    // смещение графика захватом мышки
      // yOffset: -269, // для дневного таймфрейма
      yOffset: -430, // для часового таймфрейма
      // yOffset: 0, // для часового таймфрейма
      xNull: 2680,      // вычесленный нуль
      yNull: 1150,
      x: 2594,
      y: 1419,
   }

   candlesArr = [];

   constructor(canvas, proxy, params) {

      this.canvas = canvas;
      this.ctx = canvas.context;
      this.params = params;

      this.coordinatesDefault = Object.assign({}, this.coordinates);    // для востановления состояния графика по умолчанию
      this.scaleXDefault = this.params.scaleX;
      this.scaleYDefault = this.params.scaleY;

      this.proxy = proxy;

      this.widthCanvas = this.params.widthMainConteiner - this.params.widthYaxis;
      this.heightCanvas = this.params.heightMainConteiner - this.params.hightXaxis;

      this.WIDTH_DPI = this.widthCanvas * 2; //canvas.WIDTH_DPI;
      this.HEIGHT_DPI = this.heightCanvas * 2; // canvas.HEIGHT_DPI;

      this.HEIGHT_GRAPH_FILD = this.HEIGHT_DPI - (this.params.paddingTop + this.params.paddingBottom + this.params.hightXaxis);
      this.WIDTH_GRAPH_FILD = this.WIDTH_DPI - (this.params.paddingLeft + this.params.paddingRight + this.params.widthYaxis);

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

      this.calculationOfDisplayParam();

      this.coordinates.xNull = this.WIDTH_DPI - this.params.paddingRight;     // ноль поля для отрисовки графика по X
      this.coordinates.yNull = this.HEIGHT_DPI - this.params.paddingBottom;   // ноль поля для отрисовки графика по Y
      this.coordinates.x = this.coordinates.xNull - this.coordinates.xOffset;    // ноль графика по X
      this.coordinates.y = this.coordinates.yNull - this.coordinates.yOffset;    // ноль графика по Y

      let deltaX = this.oldMousePosX - this.mouse.pos.x;
      let deltaY = this.oldMousePosY - this.mouse.pos.y;

      if (Object.keys(this.mouse.event).length != 0) {

         if (this.mouse.event.target.id == 'canvas-chart') {

            if (this.mouse.event.type === 'mousemove') {
               // получаю номер свечи над которой нахадится курсор

               this.candelNumber = Math.ceil((this.coordinates.x - this.mouse.pos.x) / this.params.scaleX)     // есле свеча отрицательная то она находится в будущем
            }
            if (this.mouse.event.type === 'wheel') {  // изменение масштаба по оси X
               this.mouse.event.preventDefault();     // запрещает перемотку всей страницы
               if (this.mouse.wheel.wheelY > 0) {
                  this.params.scaleX = this.params.scaleX - 0.5;
               } else if (this.mouse.wheel.wheelY < 0) {
                  this.params.scaleX = this.params.scaleX + 0.5;
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
                  this.params.scaleY = this.params.scaleY + 0.04;
               } else {
                  this.params.scaleY = this.params.scaleY - 0.04;
               }
               this.oldMousePosY = this.mouse.pos.y;
            }

            if (this.mouse.event.type === 'dblclick') {  // возврат графика в начальное положение
               this.coordinates = Object.assign({}, this.coordinatesDefault);
               this.params.scaleX = this.scaleXDefault;
               this.params.scaleY = this.scaleYDefault;

            }
         }

         // проведя все вычисления обновляю график
         this.linePointer();
         this.Yaxis.pointer();
         this.Xaxis.pointer();
         this.circul();
      }
   }

   calculationOfDisplayParam() {
      /* 
         взависимости от полученных данных расчитывает параметры оптимальные для отображения графика

            ширина свечи по умолчанию widthCandleDefault = this.params.scaleX = 10;
            растоянии между свечами distanceBetweenCandlesDefault = this.params.scaleX * 0,2 = 2;

         получить координаты условного прямоугольника в который вписана часть графика поместившаяся на экран
            середина последней свечки -- середина графика
               middleOfRect = Math.abs(this.data[0]['open'] - this.data[0]['close'])/2
            ширина прямоугольника widthRectChart
               widthRectChart = this.WIDTH_GRAPH_FILD - this.coordinates.xOffset
            кол-во свечей на экране candlesQuantity 
               candlesQuantity = widthRectChart / (widthCandleDefault + distanceBetweenCandlesDefault)
            максимум и минимум свечей на экране
               перебрать в цикле нужное кол-во свечек ... найти минимум и максимум
               highReckt
               lowReckt
         
         полученные координаты оптимально отобразить на графике т.е. так что бы прямоугольник оптимально заполнил поле графика
            изменить 
            this.params.scaleY 
               чем меньше свечка тем больше масштаб чем больше(?) масштаб тем меньше смещение
               произведение средней высоты свечи на масштаб по оси Y должно быть около 1500 -- проверить!
            this.coordinates.yOffset  
               this.coordinates.yOffset = (this.coordinates.yNull - middleOfRect / 10) * this.params.scaleY;


      */

      if (this.data.length > 0) {


         let widthCandleDefault = this.params.scaleX = 10;
         let distanceBetweenCandlesDefault = this.params.scaleX * 0.2;

         let middleOfLastCandle = this.coordinates.y - (this.data[0]['low'] + Math.abs(this.data[0]['high'] - this.data[0]['low']) / 2) / 100 * this.params.scaleY;
         let widthRectChart = this.WIDTH_GRAPH_FILD - this.coordinates.xOffset
         let candlesQuantity = widthRectChart / (widthCandleDefault + distanceBetweenCandlesDefault)

         let arrClose = [];
         let arrHigh = [];
         let height = 0;
         let averageHeight = 0;
         let sumHeight = 0;      // сумма высот всех видимых свечей
         let price = 0;
         let sumPrice = 0;       // сумма цен всех видимых свечей
         for (let index = 0; index < candlesQuantity; index++) {
            arrClose.push(this.data[index]['low']);
            arrHigh.push(this.data[index]['high']);

            height = Math.abs(this.data[index]['open'] - this.data[index]['close']);
            sumHeight = sumHeight + height;

            price = this.data[index]['open'] - height / 2;
            sumPrice = sumPrice + price;
         }
         let lowReckt = this.coordinates.y - Math.min(...arrClose) / 100 * this.params.scaleY;
         let highReckt = this.coordinates.y - Math.max(...arrHigh) / 100 * this.params.scaleY;
         let middleOfRect = this.coordinates.y - Math.abs(Math.max(...arrHigh) - Math.min(...arrClose) / 2) / 100 * this.params.scaleY;
         averageHeight = averageHeight = sumHeight / candlesQuantity; // средняя высота всех видимых свечей
         // let averagePrice = sumPrice / candlesQuantity;
         this.params.scaleY = 1200 / averageHeight;


         if (this.params.timefraime == 'day') {
            this.params.scaleY = 1200 / averageHeight;
            this.coordinates.yOffset = -50 * this.params.scaleY;

         } else if (this.params.timefraime == 'hour') {
            this.params.scaleY = 1200 / averageHeight;
            this.coordinates.yOffset = -158 * this.params.scaleY;

         } else if (this.params.timefraime == 'minute') {
            this.params.scaleY = 190 / averageHeight;
            this.coordinates.yOffset = -165 * this.params.scaleY;
         }


         console.log("----------");
         console.log("highReckt = ", highReckt);
         console.log("lowReckt = ", lowReckt);
         console.log("widthRectChart = ", widthRectChart);
         console.log("middleOfLastCandle = ", middleOfLastCandle);
         console.log("this.HEIGHT_GRAPH_FILD / 2 = ", this.HEIGHT_GRAPH_FILD / 2);
         console.log("middleOfRect = ", middleOfRect);
         console.log("-----");
         console.log("this.coordinates.yOffset = ", this.coordinates.yOffset);
         console.log("this.params.scaleY = ", this.params.scaleY);
         console.log("averageHeight = ", averageHeight);

         this.ctx.beginPath();
         this.ctx.lineWidth = 1;
         this.ctx.strokeStyle = 'green';
         this.ctx.lineTo(widthRectChart, highReckt);
         this.ctx.lineTo(0, highReckt);
         this.ctx.stroke();

         this.ctx.beginPath();
         this.ctx.lineWidth = 1;
         this.ctx.strokeStyle = 'red';
         this.ctx.moveTo(0, lowReckt);
         this.ctx.lineTo(widthRectChart, lowReckt);
         this.ctx.stroke();

         this.ctx.beginPath();
         this.ctx.lineWidth = 0.5;
         this.ctx.strokeStyle = 'black';
         this.ctx.moveTo(widthRectChart, middleOfLastCandle);
         this.ctx.lineTo(widthRectChart + 200, middleOfLastCandle);
         this.ctx.stroke();

         this.ctx.beginPath();
         this.ctx.lineWidth = 0.5;
         this.ctx.strokeStyle = 'blue';
         this.ctx.moveTo(widthRectChart, this.HEIGHT_GRAPH_FILD / 2);
         this.ctx.lineTo(widthRectChart + 200, this.HEIGHT_GRAPH_FILD / 2);
         this.ctx.stroke();

         this.ctx.beginPath();
         this.ctx.lineWidth = 3;
         this.ctx.strokeStyle = "#5A0DAC";
         this.ctx.moveTo(widthRectChart, middleOfRect);
         this.ctx.lineTo(widthRectChart + 200, middleOfRect);
         this.ctx.stroke();






         // let sumHeight = 0;      // сумма высот всех видимых свечей
         // let height = 0;
         // let sumPrice = 0;       // сумма цен всех видимых свечей
         // let price = 0;

         // let averageHeight = 0;  // средняя высота всех видимых свечей
         // let averagePrice = 0;   // средняя цена всех видимых свечей

         // let candlesQuantity = this.WIDTH_GRAPH_FILD / (this.params.scaleX + this.params.scaleX * 0.2);  // количество показываемых свечей
         // for (let index = 0; index < candlesQuantity; index++) {
         //    height = Math.abs(this.data[index]['open'] - this.data[index]['close']);
         //    sumHeight = sumHeight + height;
         //    price = this.data[index]['open'] - height / 2;
         //    sumPrice = sumPrice + price;
         // }

         // averageHeight = sumHeight / candlesQuantity;
         // averagePrice = sumPrice / candlesQuantity;



         // console.log("----------");
         // console.log("candlesQuantity = ", candlesQuantity);
         // console.log("averageHeight = ", averageHeight);
         // console.log("averagePrice = ", averagePrice);
         // console.log("this.coordinates.xOffset = ", this.coordinates.xOffset);
         // console.log("this.params.scaleX = ", this.params.scaleX);
         // console.log("this.params.scaleX*0,2 = ", this.params.scaleX * 0.2);
         // console.log("this.coordinates.yNull = ", this.coordinates.yNull);

         // console.log("averageHeight = ", averageHeight);
         // console.log("this.coordinates.yOffset = ", this.coordinates.yOffset);
         // console.log("this.params.scaleY = ", this.params.scaleY);


      }


   }




   graph() {

      // this.mainField();    // для тестов
      this.CoordinateGrid();

      let x, y;
      Object.keys(this.data).forEach((key, n) => {

         x = this.coordinates.x - n * this.params.scaleX;
         // y = this.coordinates.y - this.data[key]['1b. open (USD)'] / 100 * this.params.scaleY;     // для данных с https://www.alphavantage.co
         y = this.coordinates.y - this.data[key]['open'] / 100 * this.params.scaleY;
         this.candlesArr[n] = new Candle(x, this.data[key]['time'], this.data[key], this);
      });

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

      // координатная сетка по оси X
      this.ctx.beginPath();
      this.ctx.lineWidth = this.params.widthCoordinatsLineX;
      this.ctx.strokeStyle = this.params.colorCoordinatsLineX;
      this.ctx.font = '20px Arial';

      this.widthToRight = this.WIDTH_GRAPH_FILD - this.coordinates.xOffset;     // расстояние от нуля графика до края холста
      this.widthToLeft = this.coordinates.xOffset;     // расстояние от нуля графика до края холста
      this.xLine = 0;
      let nLine = 0;
      let arrDays = [];

      if (this.data.length != 0) {     // для того что бы в else иметь возможность выполнять действия до поступления данных 

         for (let n = 0; n < this.data.length; n++) {
            if (this.data[n]['time'].startsWith('01')) {
               this.distanceBetweenLines = this.xLineOld - this.xLine;
               nLine++;
               this.xLineOld = this.xLine;
               this.xLine = Math.round(this.coordinates.x - n * this.params.scaleX);
               this.distanceBetweenLines = this.xLineOld - this.xLine;
               this._drawLines(nLine);
               if (this.distanceBetweenLines < 150 && nLine % 2 != 0) {
                  continue;
               }
               this.Xaxis.drawAxis(this.data[n]['time'], nLine, this.xLine, this.distanceBetweenLines);
            }
            if (this.xLine < 0) {
               break;
            }
         }
      } else {
         // console.log(" -- Данные ещё не получены -- ");
      }
      this.ctx.stroke();

      // координатная сетка по оси Y
      this.ctx.beginPath();
      this.ctx.lineWidth = this.params.widthCoordinatsLineY;
      this.ctx.strokeStyle = this.params.colorCoordinatsLineY;
      this.ctx.font = '20px Arial';

      let y;
      for (let i = 0; i < this.HEIGHT_DPI + Math.abs(this.coordinates.yOffset); i = i + 10) {

         y = this.coordinates.y - i * this.params.scaleY;

         if (y < this.coordinates.yNull && y > this.params.paddingTop + 10) {
            this.ctx.moveTo(this.coordinates.xNull, y);
            this.ctx.lineTo(this.params.paddingLeft, y);
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