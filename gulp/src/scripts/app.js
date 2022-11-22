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


// window.onload = function () {
//    const chr = new Chart(params);

//    dP.GetData().then((data) => {
//       chr.data = dP.PreparationData(data);
//       chr.graph();
//    });
// }


class App {
   constructor(params) {
      this.pos = { x: 0, y: 0 }


      this.layer = new Layer(params);
      this.chart = new Chart(this.layer, params);
      this.loop = new Loop(this.update.bind(this), this.display.bind(this));
      this.proxyLoop = this.loop.loopWithProxy();
      // this.proxyLoop = this.loop.animate();

      this.mc = new MouseControls(this.layer, this.proxyLoop);
      this.pos = this.mc.pos
      // console.log("this.pos = ", this.pos);

      dP.GetData().then((data) => {
         this.chart.data = dP.PreparationData(data);


      });


   }

   update() {

      console.log("update()");
      this.chart.clear();
      this.chart.coordinateseCalculation(100, 0);
      this.chart.graph();
      this.chart.horizontalPointer(this.pos);
      this.chart.horizontalPointerText(this.pos);
      this.chart.circul(this.pos);



   }

   display() {

      // this.chart.clear();
      // this.chart.coordinateseCalculation(100, 0);
      // this.chart.graph();
      // this.chart.horizontalPointer();
      // this.chart.horizontalPointerText();
      // this.chart.circul();


   }
}

onload = () => { new App(params) }
