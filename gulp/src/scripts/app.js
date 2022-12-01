

import { DataProcessing } from "./DataProcessing.js";
import { Chart } from "./Chart.js";
import { Loop } from "./Loop.js";
import { Layer } from "./Layer.js";
import { MouseControls } from "./MouseControls.js";


let url = './module_php/parser.php';
const dP = new DataProcessing(url);   // всё что касается получения и оброботки данных

let params = {
   idTargetBlock: "wrap-canvas",
   idCanvas: "canvas-chart",
   idMainConteiner: 'mainConteiner',
   heightMainConteiner: 600,
   widthMainConteiner: 1400,
   hightXaxis: 25,
   widthYaxis: 50,
   scaleX: 2.6,
   scaleY: 1, // 5.5,
   // ROWS_AMOUNT: 5,
   paddingTop: 0,
   paddingBottom: 0,
   paddingLeft: 0,
   paddingRight: 0,
};

class App {
   constructor(params) {

      this._mainConteiner();
      console.log("--- App ---");
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

   _mainConteiner() {
      /**
       * т.к. холстов будет много и их позиционирование будет absolute 
       * нужен независимый контейнер
       */


      // независимая обёртка для всех канвасов нужно для абсолютного позиционирования
      const TargetBlock = document.getElementById(params.idTargetBlock);
      const mainConteiner = document.createElement("div");
      mainConteiner.id = params.idMainConteiner;
      TargetBlock.append(mainConteiner);

      let heightCont = 600;
      let widhtCont = 1400;

      mainConteiner.style.cssText = `  position: relative; 
                                       height: ${params.heightMainConteiner}px;
                                       width: ${params.widthMainConteiner}px;
                                       /*background-color: red;*/
                                       border: 1px solid black;
                                   `;


   }

}

onload = () => { new App(params) }
