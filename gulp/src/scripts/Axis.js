import { Layer } from "./Layer.js";


export class X_axis {
   /**
    * при маштобировании сетки растояния между вертикальными линиями меняются!!
    * градуировка шкалы не меняется
    */

   params = {}


   constructor(chart) {
      this.chart = chart;     // контекст слоя графика
      this.layer = new Layer(params);

   }

   drawAxis(data) {

      this.field();

      // this.chart.canvas.canvas.style.cursor = 'col-resize';

      this.chart.ctx.beginPath();
      this.chart.ctx.strokeStyle = '#ADB5D9';
      this.chart.ctx.font = '20px Arial';

      this.widthToRight = this.chart.WIDTH_GRAPH_FILD - this.chart.coordinates.xOffset;     // расстояние от нуля графика до края
      this.widthToLeft = this.chart.coordinates.xOffset;     // расстояние от нуля графика до края
      this.xLine = 0;

      let nLine = 0;
      let arrDays = Object.keys(data);
      if (arrDays.length != 0) {
         for (let n = 0; n < arrDays.length; n++) {
            if (arrDays[n].endsWith('01')) {
               this.distanceBetweenLines = this.xLineOld - this.xLine;
               nLine++;
               this.xLineOld = this.xLine;
               this.xLine = Math.round(this.chart.coordinates.xNull - n * this.chart.scaleX - this.chart.coordinates.xOffset);
               this.distanceBetweenLines = this.xLineOld - this.xLine;
               if (this.xLine < this.chart.coordinates.xNull && this.xLine > this.chart.paddingLeft) {    // запрет отрисовки координамтной сетки на шкале
                  this.drawLines(nLine);
                  this.writeText(arrDays[n], n, nLine);
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




      this.chart.ctx.stroke();

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

   drawLines(nLine) {
      if (nLine == 2) {
         for (let xLineTR = this.xLine; xLineTR < this.chart.WIDTH_GRAPH_FILD; xLineTR = xLineTR + this.distanceBetweenLines) {
            this.chart.ctx.moveTo(xLineTR, this.chart.paddingTop + 20);
            this.chart.ctx.lineTo(xLineTR, this.chart.coordinates.yNull + 20);     // 20 -- декоративная риска на оси Х
         }
      }
      this.chart.ctx.moveTo(this.xLine, this.chart.paddingTop + 20);
      this.chart.ctx.lineTo(this.xLine, this.chart.coordinates.yNull + 20);    // 20 -- декоративная риска на оси Х
   }

   writeText(key) {

      let str = '';
      let str_1 = '';
      let str_2 = '';
      let str_3 = '';

      str_1 = key.slice(8, 10);
      str_2 = key.slice(5, 7);
      str_3 = key.slice(0, 4).slice(2, 4);
      str = `${str_1}.${str_2}.${str_3}`;
      this.chart.ctx.strokeText(str, this.xLine - 40, this.chart.coordinates.yNull + 40);
   }
}

export class Y_axis {
   /**
    * при маштобировании сетки растояния между горизонтальными линиями не меняются!!
    * градуировка шкалы меняется 
    */

   constructor(canv_this) {
      this.chart = canv_this;

   }

   drawAxis() {

      this.field();

      // this.chart.canvas.canvas.style.cursor = 'row-resize';
      this.chart.canvas.canvas.style.cursor = 'pointer';

      this.chart.ctx.beginPath();
      this.chart.ctx.lineWidth = 0.;
      this.chart.ctx.strokeStyle = '#ADB5D9';
      this.chart.ctx.font = '20px Arial';

      let x, y;
      for (let i = 0; i < this.chart.HEIGHT_DPI + Math.abs(this.chart.coordinates.yOffset); i = i + 10) {
         x = this.chart.coordinates.xNull;
         y = this.chart.coordinates.yNull - this.chart.coordinates.yOffset - i * this.chart.scaleY;

         if (y < this.chart.coordinates.yNull && y > this.chart.paddingTop + 10) {
            this.chart.ctx.moveTo(x + 10, y);   // 10 -- декоративная риска на оси Y 
            this.chart.ctx.lineTo(this.chart.paddingLeft, y);
            this.chart.ctx.strokeText(i * 100, x + 25, y);

         }

      }


      if (this.chart.coordinates.yOffset > 10) {
         for (let i = 0; i < this.chart.coordinates.yOffset; i = i + 10) {
            this.chart.ctx.moveTo(this.chart.coordinates.xNull, this.chart.coordinates.yNull - this.chart.coordinates.yOffset + i * this.chart.scaleY);
            this.chart.ctx.lineTo(this.chart.paddingLeft, this.chart.coordinates.yNull - this.chart.coordinates.yOffset + i * this.chart.scaleY);
         }
      }


      this.chart.ctx.stroke();
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



