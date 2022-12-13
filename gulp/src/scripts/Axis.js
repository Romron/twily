import { Layer } from "./Layer.js";



export class X_axis {
   /**
    * при маштобировании сетки растояния между вертикальными линиями меняются!!
    * градуировка шкалы не меняется
    */


   constructor(chart) {
      this.chart = chart;     // контекст слоя графика

      this.params = {
         idMainConteiner: chart.params.idMainConteiner,
         idCanvas: "X_axis",
         DPI: 2,   // показывает восколько раз внутренний размер canvas больше размера заданного в CSS
         heightCanvas: chart.params.hightXaxis,
         widthCanvas: chart.params.widthMainConteiner,
         background: chart.params.backgroundXaxis,
         colorCoordinatsLineX: chart.params.colorTextXaxis,
         widthCoordinatsLineX: chart.params.widthCoordinatsLineX,
         widthYaxis: chart.params.widthYaxis,
      }



      this.layer = new Layer(this.params);
      this.layer.canvas.style.cssText = ` position: absolute;
                                          bottom: 0px;
                                          left:0px;
                                          z-index: 10;
                                          cursor: pointer;
                                          background-color: ${this.params.background};
                                          height:${this.params.heightCanvas}px;
                                          width:${this.params.widthCanvas}px;
                                          /*border: 0.5px solid #38478D;*/
                                       `;


   }

   drawAxis(key, nLine, xLine, distanceBetweenLines) {

      // _drawLines(nLine)

      // console.log("-----");
      // console.log("this.chart.coordinates.x = ", this.chart.coordinates.x);
      // console.log("this.chart.coordinates.xNull = ", this.chart.coordinates.xNull);



      // нулевая линия
      this.layer.context.beginPath();
      this.layer.context.lineWidth = this.params.widthCoordinatsLineX * 6;
      this.layer.context.strokeStyle = this.params.colorCoordinatsLineX;

      this.layer.context.moveTo(0, 0);
      this.layer.context.lineTo(this.chart.coordinates.xNull, 0);
      this.layer.context.stroke();


      this.layer.context.beginPath();
      this.layer.context.lineWidth = this.params.widthCoordinatsLineX;
      this.layer.context.strokeStyle = this.params.colorCoordinatsLineX;
      this.layer.context.font = '20px Arial';

      if (nLine == 2) {
         for (let xLineTR = xLine; xLineTR < this.params.widthCanvas * 2; xLineTR = xLineTR + distanceBetweenLines) {
            this.layer.context.moveTo(xLineTR, 0);
            this.layer.context.lineTo(xLineTR, 20);     // 20 -- декоративная риска на оси Х
         }
      }
      this.layer.context.moveTo(xLine, 0);
      this.layer.context.lineTo(xLine, 20);    // 20 -- декоративная риска на оси Х
      this.layer.context.stroke();

      // _writeText(key)
      let str = '';
      let str_1 = '';
      let str_2 = '';
      let str_3 = '';

      str_1 = key.slice(8, 10);
      str_2 = key.slice(5, 7);
      str_3 = key.slice(0, 4).slice(2, 4);
      str = `${str_1}.${str_2}.${str_3}`;
      this.layer.context.strokeText(str, xLine - 40, this.params.heightCanvas * 1.3);


   }

   field() {

      this.chart.ctx.beginPath();
      this.chart.ctx.lineWidth = 1;
      // this.chart.ctx.strokeStyle = '#ADB5D9';
      this.chart.ctx.strokeStyle = '#8A8EA3';

      this.chart.ctx.moveTo(this.chart.paddingLeft, this.chart.HEIGHT_DPI - this.chart.paddingBottom);
      this.chart.ctx.lineTo(this.chart.WIDTH_DPI - this.chart.paddingRight - this.chart.widthYaxis, this.chart.HEIGHT_DPI - this.chart.paddingBottom);
      this.chart.ctx.lineTo(this.chart.WIDTH_DPI - this.chart.paddingRight - this.chart.widthYaxis, this.chart.HEIGHT_DPI - this.chart.paddingBottom - this.chart.hightXaxis);
      this.chart.ctx.lineTo(this.chart.paddingLeft, this.chart.HEIGHT_DPI - this.chart.paddingBottom - this.chart.hightXaxis);
      this.chart.ctx.closePath();
      this.chart.ctx.stroke();
   }

   clearAxis() {
      this.layer.context.clearRect(0, 0, this.params.widthCanvas * 2, this.params.heightCanvas * 2);
   }
}

export class Y_axis {
   /**
    * при маштобировании сетки растояния между горизонтальными линиями не меняются!!
    * градуировка шкалы меняется 
    */

   constructor(chart) {
      this.chart = chart;     // контекст слоя графика

      this.params = {
         idMainConteiner: chart.params.idMainConteiner,
         idCanvas: "Y_axis",
         DPI: 2,   // показывает восколько раз внутренний размер canvas больше размера заданного в CSS
         heightCanvas: chart.params.heightMainConteiner,
         widthCanvas: chart.params.widthYaxis,
         background: chart.params.backgroundYaxis,
         background: chart.params.backgroundXaxis,
         colorTextYaxis: chart.params.colorTextYaxis,
         widthCoordinatsLineY: chart.params.widthCoordinatsLineY,
         hightXaxis: chart.params.hightXaxis,
         cursor: 'pointer',
         pointerFontSize: 20,
      }

      this.layer = new Layer(this.params);
      this.layer.canvas.style.cssText = ` position: absolute;
                                          bottom: 0px;
                                          right:0px;
                                          z-index: 10;
                                          cursor: ${this.params.cursor};
                                          background-color: ${this.params.background};
                                          height:${this.params.heightCanvas}px;
                                          width:${this.params.widthCanvas}px;
                                          /*border: 0.5px solid #38478D;*/
                                          `;

   }

   drawAxis(y, i) {

      this.Y = y; // для использования в PointerText()

      // нулевая линия
      this.layer.context.beginPath();
      this.layer.context.lineWidth = this.params.widthCoordinatsLineY * 6;
      this.layer.context.strokeStyle = this.params.colorCoordinatsLineY;

      this.layer.context.moveTo(0, 0);
      this.layer.context.lineTo(0, this.chart.coordinates.yNull);
      this.layer.context.stroke();

      // декоративные  засечки
      this.layer.context.beginPath();
      this.layer.context.lineWidth = this.params.widthCoordinatsLineY;
      this.layer.context.strokeStyle = this.params.colorTextYaxis;
      this.layer.context.font = '20px Arial';

      this.layer.context.moveTo(0, y);
      this.layer.context.lineTo(20, y);
      this.layer.context.strokeText(i * 100, 35, y);
      this.layer.context.stroke();

   }

   pointer() {
      this.layer.context.beginPath();
      this.layer.context.lineWidth = this.params.widthCoordinatsLineY * 2;
      this.layer.context.strokeStyle = "black";

      this.PointerText(this.chart.mouse.pos.y);
      this.layer.context.rect(10, this.chart.mouse.pos.y - this.params.pointerFrimeHight / 2, this.params.pointerFrimeWidth, this.params.pointerFrimeHight);
      this.layer.context.stroke();

   }

   PointerText(mousePosY) {
      this.layer.context.font = `${this.params.pointerFontSize}px Arial`;

      // отделить тысячи пробелом
      let text0 = ((this.chart.coordinates.y - mousePosY) * 100 / this.chart.params.scaleY).toFixed(3);
      let indexSpace = text0.indexOf('.') - 3;
      let text = text0.slice(0, indexSpace) + ' ' + text0.slice(indexSpace);

      //  получаю параметры текста для корректного отображения его и рамки указателя
      let metricsText = this.layer.context.measureText(text);
      let actualHeightText = metricsText.actualBoundingBoxAscent + metricsText.actualBoundingBoxDescent;

      this.params.pointerFrimeHight = actualHeightText + 20;
      this.params.pointerFrimeWidth = metricsText.width + 10;

      this.layer.context.fillText(
         text,
         13,
         mousePosY + actualHeightText / 2
      );
   }

   clearAxis() {
      this.layer.context.clearRect(0, 0, this.params.widthCanvas * 2, this.params.heightCanvas * 2);
   }


   field() {

      this.chart.ctx.beginPath();
      this.chart.ctx.lineWidth = 1;
      // this.chart.ctx.globalAlpha = 1;
      // this.chart.ctx.strokeStyle = '#ADB5D9';
      this.chart.ctx.strokeStyle = '#8A8EA3';
      this.chart.ctx.moveTo(this.chart.WIDTH_DPI - this.chart.paddingRight, this.chart.paddingTop);
      this.chart.ctx.lineTo(this.chart.WIDTH_DPI - this.chart.paddingRight, this.chart.HEIGHT_DPI - this.chart.paddingBottom - this.chart.hightXaxis);
      this.chart.ctx.lineTo(this.chart.WIDTH_DPI - this.chart.paddingRight - this.chart.widthYaxis, this.chart.HEIGHT_DPI - this.chart.paddingBottom - this.chart.hightXaxis);
      this.chart.ctx.lineTo(this.chart.WIDTH_DPI - this.chart.paddingRight - this.chart.widthYaxis, this.chart.paddingTop);
      this.chart.ctx.closePath();
      this.chart.ctx.stroke();

   }


}



