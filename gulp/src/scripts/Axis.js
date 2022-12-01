import { Layer } from "./Layer.js";


export class X_axis {
   /**
    * при маштобировании сетки растояния между вертикальными линиями меняются!!
    * градуировка шкалы не меняется
    */

   params = {
      idContainerCSS: "wrap-canvas",
      idCanvas: "canvas-chart__X-axis",
      idMainConteiner: 'mainConteiner',
      heightCanvas: 20,
      widhtCanvas: 1400,
      scaleX: 1,
      scaleY: 1,
      paddingTop: 20,
      paddingBottom: 10,
      paddingLeft: 20,
      paddingRight: 20,
   }


   constructor(chart) {
      this.chart = chart;     // контекст слоя графика
      this.layer = new Layer(this.params);
      this.layer.canvas.style.cssText = ` position: absolute;
                                          bottom: 0;
                                          background-color: white; 
                                          left:0;
                                          z-index: 10;
                                          /*border: 1px solid blue;*/
                                       `;

   }
   drawAxis(data) {

      this.field();

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

   params = {
      idContainerCSS: "wrap-canvas",
      idCanvas: "canvas-chart__Y-axis",
      idMainConteiner: 'mainConteiner',
      heightCanvas: 323,
      widhtCanvas: 26,
      scaleX: 1,
      scaleY: 1,
      paddingTop: 20,
      paddingBottom: 10,
      paddingLeft: 20,
      paddingRight: 20,
   }


   constructor(chart) {
      this.chart = chart;     // контекст слоя графика

      this.layer = new Layer(this.params);
      this.layer.canvas.style.cssText = ` position: absolute;
                                          bottom: 0px;
                                          background-color: white; 
                                          right:0px;
                                          z-index: 10;
                                          cursor: pointer;
                                          /*border: 1px solid red;*/
                                          `;
   }


   drawAxis() {

      this.field();

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



