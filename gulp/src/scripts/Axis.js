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
      widthCanvas: 1400,
      scaleX: 1,
      scaleY: 1,
      paddingTop: 20,
      paddingBottom: 10,
      paddingLeft: 20,
      paddingRight: 20,
   }


   constructor(chart) {
      this.chart = chart;     // контекст слоя графика

      console.log("this.chart = ", this.chart);  навести порядок!!!!!!!!!!!!!!!!

      this.layer = new Layer(this.params);
      this.layer.canvas.style.cssText = ` position: absolute;
                                          bottom: 0;
                                          background-color: white; 
                                          left:0;
                                          z-index: 10;
                                          cursor: pointer;
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

   params = {
      idContainerCSS: "wrap-canvas",
      idCanvas: "canvas-chart__Y-axis",
      idMainConteiner: 'mainConteiner',
      heightCanvas: 600,
      widthCanvas: 50,
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
                                          height:${this.params.heightCanvas}px;
                                          width:${this.params.widthCanvas}px;
                                          /*border: 0.5px solid #38478D;*/
                                          `;

      // console.log("this.layer = ", this.layer);
   }

   drawAxis() {
      // this.layer.context.beginPath();
      // this.layer.context.lineWidth = 1;
      // this.layer.context.strokeStyle = '#ADB5D9';
      // this.layer.context.font = '10px Arial';
      // let x, y;


      // for (let i = 0; i < this.params.heightCanvas * 2 + Math.abs(this.chart.coordinates.yOffset); i = i + 10) {
      //    x = this.params.widhtCanvas;
      //    y = (this.params.heightCanvas * 2 - this.chart.coordinates.yOffset - i * this.chart.scaleY);

      //    console.log("x = ", x);
      //    console.log("y = ", y);

      //    // if (y < this.coordinates.yNull && y > this.paddingTop + 10) {
      //    this.layer.context.moveTo(x, y);   // 10 -- декоративная риска на оси Y 
      //    this.layer.context.lineTo(x - 10, y);
      //    this.layer.context.strokeText(i * 100, x, y);
      //    // }

      // }

      // this.layer.context.stroke();
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



