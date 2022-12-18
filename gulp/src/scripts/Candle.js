export class Candle {



    constructor(x, day, dateCandle, layer) {

        this.layer = layer;
        this.x = x;
        this.day = day;

        this.params = {
            colorGrowingCandels: '#00AE68', // зелёная свеча
            colorFallingCandels: '#FF7373', // красная свеча
            widthCandle: this.layer.params.scaleX,
            distanceBetweenCandles: this.layer.params.scaleX * 0.2,
        }

        this.yOpen = this.layer.coordinates.y - dateCandle['1b. open (USD)'] / 100 * this.layer.params.scaleY;
        this.yLow = this.layer.coordinates.y - dateCandle['3b. low (USD)'] / 100 * this.layer.params.scaleY;
        this.yHight = this.layer.coordinates.y - dateCandle['2b. high (USD)'] / 100 * this.layer.params.scaleY;
        this.yClose = this.layer.coordinates.y - dateCandle['4b. close (USD)'] / 100 * this.layer.params.scaleY;

        if (this.yOpen > this.yClose) {
            this.colorCandels = this.params.colorGrowingCandels
        } else {
            this.colorCandels = this.params.colorFallingCandels
        }
        this._bodyCandle();
    }


    _bodyCandle() {
        this.layer.ctx.beginPath();
        this.layer.ctx.lineWidth = 2;

        this.layer.ctx.moveTo(this.x, this.yHight); // сквозной фетиль 
        this.layer.ctx.lineTo(this.x, this.yLow);

        this.layer.ctx.moveTo(this.x + this.params.distanceBetweenCandles - this.params.widthCandle / 2, this.yOpen);
        this.layer.ctx.lineTo(this.x - this.params.distanceBetweenCandles + this.params.widthCandle / 2, this.yOpen);

        this.layer.ctx.lineTo(this.x - this.params.distanceBetweenCandles + this.params.widthCandle / 2, this.yClose);
        this.layer.ctx.lineTo(this.x + this.params.distanceBetweenCandles - this.params.widthCandle / 2, this.yClose);
        this.layer.ctx.lineTo(this.x + this.params.distanceBetweenCandles - this.params.widthCandle / 2, this.yOpen);


        this.layer.ctx.strokeStyle = this.colorCandels;
        this.layer.ctx.fillStyle = this.colorCandels;
        this.layer.ctx.fill();
        this.layer.ctx.stroke();

    }


}