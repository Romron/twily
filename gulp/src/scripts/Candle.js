export class Candle {



   constructor(x, day, dateCandle, layer) {
      this.layer = layer;
      this.x = x;
      this.day = day;

      this.yOpen = this.layer.coordinates.y - dateCandle['1b. open (USD)'] / 100 * this.layer.params.scaleY;
      this.yClose = this.layer.coordinates.y - dateCandle['4b. close (USD)'] / 100 * this.layer.params.scaleY;
      this.lenghtCandle = (dateCandle['4b. close (USD)'] - dateCandle['1b. open (USD)']) / 100 * this.layer.params.scaleY;
      this.yLow = this.layer.coordinates.y - dateCandle['3b. low (USD)'] / 100 * this.layer.params.scaleY;
      this.yHight = this.layer.coordinates.y - dateCandle['2b. high (USD)'] / 100 * this.layer.params.scaleY;

      this.layer.ctx.beginPath();
      this.layer.ctx.lineWidth = 2;

      if (this.lenghtCandle > 0) {
         var colorCandels = '#00AE68';    // зелёная свеча
      } else {
         var colorCandels = '#FF7373';   // красная свеча
      }

      this.layer.ctx.moveTo(this.x + this.layer.params.scaleX / 2, this.yHight);     // сквозной фетиль 
      this.layer.ctx.lineTo(this.x + this.layer.params.scaleX / 2, this.yLow);
      this.layer.ctx.rect(this.x, this.yOpen, this.layer.params.scaleX, Math.abs(this.lenghtCandle));

      this.layer.ctx.strokeStyle = colorCandels;
      this.layer.ctx.fillStyle = colorCandels;
      // this.layer.ctx.fill();
      this.layer.ctx.stroke();
   }



}