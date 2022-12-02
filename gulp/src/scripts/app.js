

import { DataProcessing } from "./DataProcessing.js";
import { Chart } from "./Chart.js";
import { Loop } from "./Loop.js";
import { Layer } from "./Layer.js";
import { MouseControls } from "./MouseControls.js";


let url = './module_php/parser.php';
const dP = new DataProcessing(url);   // всё что касается получения и оброботки данных



class App {

   params = {
      idTargetBlock: "wrap-canvas",
      idCanvas: "canvas-chart",
      idMainConteiner: 'mainConteiner',
      heightMainConteiner: 600,
      widthMainConteiner: 1400,
      hightXaxis: 25,
      widthYaxis: 60,
      scaleX: 2.6,
      scaleY: 1, // 5.5,
      paddingTop: 0,
      paddingBottom: 10,
      paddingLeft: 0,
      paddingRight: 10,
      backgroundChart: '#858483',
      backgroundXaxis: '#777777',
      backgroundYaxis: '#777777',
      colorTextXaxis: '#7B7B7B',
      colorTextYaxis: '#011F01',
      colorChartLine: '#fff',  // '#ADB5D9',
      colorCoordinatsLineY: '#E4E4E4',  // '#ADB5D9',
      colorCoordinatsLineX: '#E4E4E4',  // '#ADB5D9',
      widthCoordinatsLineX: 0.5,  // '#ADB5D9',
      widthCoordinatsLineY: 0.5,  // '#ADB5D9',
   };

   constructor() {

      this._mainConteiner();
      this.layer = new Layer(this.params);
      this.chart = new Chart(this.layer, this.params);
      this.proxyLoop = new Loop(this.update.bind(this), this.display.bind(this));
      this.mc = new MouseControls(this.layer, this.proxyLoop, this.params);

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
      const TargetBlock = document.getElementById(this.params.idTargetBlock);
      const mainConteiner = document.createElement("div");
      mainConteiner.id = this.params.idMainConteiner;
      TargetBlock.append(mainConteiner);

      let heightCont = 600;
      let widhtCont = 1400;

      mainConteiner.style.cssText = `  position: relative; 
                                       height: ${this.params.heightMainConteiner}px;
                                       width: ${this.params.widthMainConteiner}px;
                                       /*background-color: red;*/
                                       border: 1px solid black;
                                   `;


   }

}

onload = () => { new App() }
