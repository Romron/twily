export class Layer {

   constructor(params) {
      this.HEIGHT_DPI = params.canvasHeight * 2;      // для плавности у величиваю количество точек холста в двое
      this.WIDTH_DPI = params.canvasWidht * 2;
      const container = document.getElementById(params.idContainer);

      this.canvas = document.createElement("canvas");
      this.context = this.canvas.getContext('2d');
      this.canvas.id = params.idCanvas;
      container.appendChild(this.canvas);

      this.canvas.style.height = params.canvasHeight + 'px';
      this.canvas.style.width = params.canvasWidht + 'px';
      this.canvas.height = this.HEIGHT_DPI;
      this.canvas.width = this.WIDTH_DPI;

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