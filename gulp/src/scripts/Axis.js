export class X_axis {
   /**
    * при маштобировании сетки растояния между вертикальными линиями меняются!!
    * градуировка шкалы не меняется
    */

   constructor(canv_this) {

      this.canv = canv_this;

   }

   drawAxis(data) {

      // this.field();

      // this.canv.canvas.canvas.style.cursor = 'col-resize';

      this.canv.ctx.beginPath();
      this.canv.ctx.strokeStyle = '#ADB5D9';
      this.canv.ctx.font = '20px Arial';

      this.widthToRight = this.canv.WIDTH_GRAPH_FILD - this.canv.coordinates.xOffset;     // расстояние от нуля графика до края
      this.widthToLeft = this.canv.coordinates.xOffset;     // расстояние от нуля графика до края
      this.xLine = 0;

      let nLine = 0;
      let arrDays = Object.keys(data);

      if (arrDays.length != 0) {
         for (let n = 0; n < arrDays.length; n++) {
            if (arrDays[n].endsWith('01')) {
               this.distanceBetweenLines = this.xLineOld - this.xLine;
               nLine++;
               this.xLineOld = this.xLine;
               this.xLine = Math.round(this.canv.coordinates.xNull - n * this.canv.scaleX - this.canv.coordinates.xOffset);
               this.distanceBetweenLines = this.xLineOld - this.xLine;
               this.drawLines(nLine);
               if (this.distanceBetweenLines < 150 && nLine % 2 != 0) {
                  continue;
               }
               this.writeText(arrDays[n], n, nLine);
            }
            if (this.xLine < 0) {
               break;
            }

         }
      } else {
         console.log(" -- Данные ещё не получены -- ");
      }




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

   drawLines(nLine) {
      if (nLine == 2) {
         for (let xLineTR = this.xLine; xLineTR < this.canv.WIDTH_GRAPH_FILD; xLineTR = xLineTR + this.distanceBetweenLines) {
            this.canv.ctx.moveTo(xLineTR, this.canv.paddingTop + 20);
            this.canv.ctx.lineTo(xLineTR, this.canv.coordinates.yNull + 20);     // 20 -- декоративная риска на оси Х
         }
      }
      this.canv.ctx.moveTo(this.xLine, this.canv.paddingTop + 20);
      this.canv.ctx.lineTo(this.xLine, this.canv.coordinates.yNull + 20);    // 20 -- декоративная риска на оси Х
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
      this.canv.ctx.strokeText(str, this.xLine - 40, this.canv.coordinates.yNull + 40);
   }
}

export class Y_axis {
   /**
    * при маштобировании сетки растояния между горизонтальными линиями не меняются!!
    * градуировка шкалы меняется 
    */

   constructor(canv_this) {
      this.canv = canv_this;

   }

   drawAxis() {

      // this.field();

      // this.canv.canvas.canvas.style.cursor = 'row-resize';
      this.canv.canvas.canvas.style.cursor = 'pointer';


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



