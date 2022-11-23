import { Chart, page, DataProcessing } from "./script.js";

import { Loop } from "./Loop.js";
import { Layer } from "./Layer.js";
import { MouseControls } from "./MouseControls.js";


let url = './module_php/parser.php';
const dP = new DataProcessing(url);   // всё что касается получения и оброботки данных

let params = {
   idTargetBlock: "block-results",
   idCanvas: "canv-1",
   idContainer: "block-results",
   canvasHeight: 600,
   canvasWidht: 1400,
   scaleX: 2.6,
   scaleY: 1,
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

      this.chart.mouse.pos = this.mc.pos;
      this.chart.mouse.wheel = this.mc.wheel;

      this.chart.clear();
      this.chart.coordinateseCalculation(0, 0);
      this.chart.graph();

   }

   display() {

      this.chart.clear();
      this.chart.coordinateseCalculation(0, 0);
      this.chart.graph();
      this.chart.horizontalPointer();
      this.chart.horizontalPointerText();
      this.chart.circul();


   }
}

onload = () => { new App(params) }
