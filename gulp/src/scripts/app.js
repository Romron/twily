

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
      backgroundChart: '#E0E0E0',
      backgroundXaxis: '#E0E0E0',
      backgroundYaxis: '#E0E0E0',
      colorTextXaxis: 'red',
      colorTextYaxis: '#5F5F5F',
      colorChartLine: '#031B42',  // '#ADB5D9',
      colorCoordinatsLineX: '#B6B6B6',  // '#ADB5D9',
      colorCoordinatsLineY: '#B6B6B6',  // '#ADB5D9',
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
                                       border: 1px solid #9ea8a0;
                                   `;


   }

}

onload = () => { new App() }
