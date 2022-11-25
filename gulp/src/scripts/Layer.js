export class Layer {

   constructor(container) {
      this.canvas = document.createElement("canvas");
      this.context = this.canvas.getContext('2d');
      container.appendChild(this.canvas);

      this.canvas.style.height = 600;
      this.canvas.style.width = 1200;

      this.canvas.height = 1200;
      this.canvas.width = 2400;


      console.log("*this.canvas = ", this.canvas);




      // this.FitContainer();
      // addEventListener('resize', () => this.FitContainer(this.canvas));

   }

   FitContainer() {
      this.canvas.style.height = 600;
      this.canvas.style.width = 1200;
      this.canvas.height = 1200;
      this.canvas.width = 2400;

      console.log("**this.canvas = ", this.canvas);
   }
}