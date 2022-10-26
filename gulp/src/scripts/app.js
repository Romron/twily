import { chart, dataProcessing, page } from "./script.js";


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
// const dataProcessing = new dataProcessing(url);


window.onload = function () {

   page();     // формирует страницу приложения
   jaxPromise = dataProcessing.GetData;    // всё что касается получения и оброботки данных
   console.log("jaxPromise = ", jaxPromise);
   jaxPromise.then((data) => {
      dataProcessing.PreparationData(data);
      chart();    // канвас и всё что на нём
   },);
}