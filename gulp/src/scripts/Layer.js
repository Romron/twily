export class Layer {

   constructor(params) {

      this.HEIGHT_DPI = params.heightCanvas * params.DPI;      // для плавности у величиваю количество точек холста в двое
      this.WIDTH_DPI = params.widthCanvas * params.DPI;
      const container = document.getElementById(params.idMainConteiner);

      this.canvas = document.createElement("canvas");
      this.context = this.canvas.getContext('2d');
      this.canvas.id = params.idCanvas;
      container.appendChild(this.canvas);

      this.canvas.style.height = params.heightCanvas + 'px';
      this.canvas.style.width = params.widthCanvas + 'px';
      this.canvas.height = this.HEIGHT_DPI;
      this.canvas.width = this.WIDTH_DPI;

      // this.context.rect(0, 0, this.WIDTH_DPI, this.HEIGHT_DPI);
      // this.context.fillStyle = 'red';
      // this.context.fill();

      // this.FitContainer();
      // addEventListener('resize', () => this.FitContainer(this.canvas));

   }

   FitContainer(canv) {
      /**
       * подгонка размеров канваса при изменении размеров окна
       * https://youtu.be/XgXGXEqQJqI
       */
      canv.height = canv.offsetWidth;
      canv.width = canv.offsetHeight;

   }
}