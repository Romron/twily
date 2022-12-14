export class Candle {



   constructor(x, y, dateCandle, layer) {
      this.layer = layer;
      this.x = x;


      this.yOpen = this.layer.coordinates.y - dateCandle['1b. open (USD)'] / 100 * this.layer.params.scaleY;
      this.yClose = this.layer.coordinates.y - dateCandle['4b. close (USD)'] / 100 * this.layer.params.scaleY;
      this.lenghtCandle = (dateCandle['4b. close (USD)'] - dateCandle['1b. open (USD)']) / 100 * this.layer.params.scaleY;

      // if (this.lenghtCandle > 0) {
      //    var colorCandels = '#00AE68';    // зелёная свеча

      // } else {
      //    var colorCandels = '#FF7373';   // красная свеча
      // }



      this.yLow = this.layer.coordinates.y - dateCandle['3b. low (USD)'] / 100 * this.layer.params.scaleY;

      this.layer.ctx.beginPath();
      this.layer.ctx.lineWidth = 2;


      if (this.lenghtCandle > 0) {
         var colorCandels = '#00AE68';    // зелёная свеча

         // this.layer.ctx.moveTo(this.x + this.layer.params.scaleX / 2, this.yOpen);     // 
         // this.layer.ctx.lineTo(this.x + this.layer.params.scaleX / 2, this.yHight);

         // this.layer.ctx.moveTo(this.x + this.layer.params.scaleX / 2, this.yClose);
         // this.layer.ctx.lineTo(this.x + this.layer.params.scaleX / 2, this.yLow);


      } else {
         var colorCandels = '#FF7373';   // красная свеча
      }

фитиль в зависимости от цвета свечи

      this.layer.ctx.moveTo(this.x + this.layer.params.scaleX / 2, this.yOpen);
      this.layer.ctx.lineTo(this.x + this.layer.params.scaleX / 2, this.yHight);

      this.layer.ctx.moveTo(this.x + this.layer.params.scaleX / 2, this.yClose);
      this.layer.ctx.lineTo(this.x + this.layer.params.scaleX / 2, this.yLow);

      this.layer.ctx.strokeStyle = colorCandels;
      this.layer.ctx.fillStyle = colorCandels;

      // if (this.yLow < 0
      //    || this.yOpen < 0
      //    || this.yHight < 0
      //    || this.yClose < 0
      //    || this.yLow < 0
      // ) {

      //    console.log("**********");
      //    var colorCandels = 'black';

      // }



      // this.layer.ctx.moveTo(this.x + this.layer.params.scaleX / 2, this.yOpen);
      // this.layer.ctx.lineTo(this.x + this.layer.params.scaleX / 2, this.yHight);

      // this.layer.ctx.moveTo(this.x + this.layer.params.scaleX / 2, this.yClose);
      // this.layer.ctx.lineTo(this.x + this.layer.params.scaleX / 2, this.yLow);

      this.layer.ctx.rect(this.x, this.yOpen, this.layer.params.scaleX, Math.abs(this.lenghtCandle));
      // this.layer.ctx.fill();
      this.layer.ctx.stroke();
   }



}