import { Chart, page, DataProcessing } from "./script.js";

import { Loop } from "./Loop.js";
import { Layer } from "./Layer.js";


let url = './module_php/parser.php';
const dP = new DataProcessing(url);   // всё что касается получения и оброботки данных

let params = {
   idTargetBlock: "block-results",
   idCanvas: "canv-1",
   idContainer: "block-results",
   canvasHeight: 600,
   canvasWidht: 1400,
   HEIGHT_DPI: 1200,
   WIDTH_DPI: 2800,
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


      const container = document.getElementById(params.idContainer);
      container.style.width = params.canvasWidht + 'px';
      container.style.height = params.canvasHeight + 'px';
      this.layer = new Layer(container);
      // this.layer.height = params.HEIGHT_DPI;
      // this.layer.width = params.WIDTH_DPI;
      console.log("***this.layer = ", this.layer);


   }
}

onload = () => { new App(params) }
