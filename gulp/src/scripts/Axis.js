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
         heightCanvas: chart.params.hightXaxis,
         widthCanvas: chart.params.widthMainConteiner,
         background: chart.params.backgroundXaxis,
         colorCoordinatsLineY: chart.params.colorCoordinatsLineY,
         widthCoordinatsLineY: chart.params.widthCoordinatsLineY,
      }

      this.layer = new Layer(this.params);
      this.layer.canvas.style.cssText = ` position: absolute;
                                          bottom: 0;
                                          left:0;
                                          z-index: 10;
                                          cursor: pointer;
                                          background-color: ${this.params.background};
                                          height:${this.params.heightCanvas}px;
                                          width:${this.params.widthCanvas}px;
                                          /*border: 1px solid #38478D;*/
                                       `;

   }
   drawAxis(data) {


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
         heightCanvas: chart.params.heightMainConteiner,
         widthCanvas: chart.params.widthYaxis,
         background: chart.params.backgroundYaxis,
         background: chart.params.backgroundXaxis,
         colorCoordinatsLineY: chart.params.colorCoordinatsLineY,
         widthCoordinatsLineY: chart.params.widthCoordinatsLineY,
      }

      this.layer = new Layer(this.params);
      this.layer.canvas.style.cssText = ` position: absolute;
                                          bottom: 0px;
                                          right:0px;
                                          z-index: 10;
                                          cursor: pointer;
                                          background-color: ${this.params.background};
                                          height:${this.params.heightCanvas}px;
                                          width:${this.params.widthCanvas}px;
                                          /*border: 0.5px solid #38478D;*/
                                          `;
   }

   drawAxis(x, y, i) {

      this.layer.context.beginPath();
      this.layer.context.lineWidth = this.params.widthCoordinatsLineY;

      this.layer.context.strokeStyle = this.params.colorCoordinatsLineY;
      this.layer.context.font = '20px Arial';

      this.layer.context.moveTo(0, y);
      this.layer.context.lineTo(20, y);
      this.layer.context.strokeText(i * 100, 35, y);
      this.layer.context.stroke();
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



