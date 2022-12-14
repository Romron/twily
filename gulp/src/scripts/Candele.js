export class Candele {



   constructor(x, y, layer) {
      this.layer = layer;

      this.layer.beginPath();
      this.layer.lineWidth = 0.5;
      this.layer.strokeStyle = "black";


      this.layer.rect(x, y, x + 10, y + 10);
      this.layer.stroke();
   }



}