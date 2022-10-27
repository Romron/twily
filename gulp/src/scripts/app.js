import { chart, page, dataProcessing } from "./script.js";
// import { page } from "./script.js";
// import { dataProcessing } from "./script.js";


const
   WIDTH = 1800,
   HEIGHT = 600,
   WIDTH_DPI = WIDTH * 2,
   HEIGHT_DPI = HEIGHT * 2,
   ROWS_AMOUNT = 5,
   PADDING_Y = 30,
   VIEW_HEIGT = HEIGHT_DPI - PADDING_Y * 2,
   scaleX = 3.5,
   scaleY = 1;

let url = './module_php/parser.php';
let jaxPromise;
// const dataProc = new dataProcessing(url);


window.onload = function () {

   // console.log("page : ", page);
   // console.log("page.method_1 : ", page.method_1);
   // chart();    // канвас и всё что на нём


   // console.log("dataProcessing = ", dataProcessing);

   const dP = new dataProcessing(url);
   console.log("dP = ", dP);

   console.log(dP.GetData);

   // jaxPromise = dP.GetData;    // всё что касается получения и оброботки данных
   // console.log("jaxPromise = ", jaxPromise);
   dP.GetData().then(() => {
      // dataProc.PreparationData(data);
      chart();    // канвас и всё что на нём
   });
}