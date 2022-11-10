import { Chart, page, DataProcessing } from "./script.js";


let url = './module_php/parser.php';
const dP = new DataProcessing(url);   // всё что касается получения и оброботки данных

let params = {
   idTargetBlock: "block-results",
   idCanvas: "canv-1",
   canvasHight: 600,
   canvasWidht: 1400,
   scaleX: 2.6,
   scaleY: 1,
   ROWS_AMOUNT: 5,
   paddingTop: 30,
   paddingBottom: 10,
   paddingLeft: 30,
   paddingRight: 10,
   widthYaxis: 100,
   hightXaxis: 50
};


window.onload = function () {
   const chr = new Chart(params);

   dP.GetData().then((data) => {
      chr.data = dP.PreparationData(data);
      chr.canv();
   });
}