

import { DataProcessing } from "./DataProcessing.js";
import { Chart } from "./Chart.js";
import { Loop } from "./Loop.js";
import { Layer } from "./Layer.js";
import { MouseControls } from "./MouseControls.js";


let url = './module_php/parser.php';
const dP = new DataProcessing(url);   // всё что касается получения и оброботки данных

let params = {
   idTargetBlock: "wrap-canvas",
   idCanvas: "canv-1",
   idContainer: "wrap-canvas",
   canvasHeight: 600,
   canvasWidht: 1400,
   scaleX: 2.6,
   scaleY: 5.5,
   ROWS_AMOUNT: 5,
   paddingTop: 20,
   paddingBottom: 10,
   paddingLeft: 20,
   paddingRight: 20,
   widthYaxis: 100,
   hightXaxis: 40
};


class App {
   constructor(params) {

      this.layer = new Layer(params);
      this.chart = new Chart(this.layer, params);
      this.proxyLoop = new Loop(this.update.bind(this), this.display.bind(this));
      this.mc = new MouseControls(this.layer, this.proxyLoop, params);

      dP.GetData().then((data) => {
         this.chart.data = dP.PreparationData(data);
         this.display();
      });


   }

   update() {

      this.chart.mouse = this.mc;      // получить управляющие сигналы от мыши

      this.chart.clear();
      this.chart.coordinateseCalculation();
      this.chart.graph();

   }

   display() {

      this.chart.clear();
      this.chart.coordinateseCalculation(0, 0);
      this.chart.graph();


   }
}

onload = () => { new App(params) }
