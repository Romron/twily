

import { DataProcessing } from "./DataProcessing.js";
import { Chart } from "./Chart.js";
import { Loop } from "./Loop.js";
import { Layer } from "./Layer.js";
import { MouseControls } from "./MouseControls.js";




class App {

   params = {
      // dataurl: './module_php/parser.php',
      dataurl: './module_php/parser_timefraime.php',
      idTargetBlock: "wrap-canvas",
      idMainConteiner: 'mainConteiner',
      idCanvas: "canvas-chart",
      heightMainConteiner: 600,
      widthMainConteiner: 1400,
      DPI: 2,   // показывает восколько раз внутренний размер canvas больше размера заданного в CSS 
      hightXaxis: 25,
      widthYaxis: 60,
      scaleX: 10,
      scaleY: 4,
      paddingTop: 0,
      paddingBottom: 0,      // 50 для тестов
      paddingLeft: 0,
      paddingRight: 0,    // 50 для тестов
      backgroundChart: '#E0E0E0',
      backgroundXaxis: '#E0E0E0',
      backgroundYaxis: '#E0E0E0',
      colorTextXaxis: '#5F5F5F',
      colorTextYaxis: '#5F5F5F',
      colorChartLine: '#031B42',  // '#ADB5D9',
      colorCoordinatsLineX: '#B6B6B6',  // '#ADB5D9',
      colorCoordinatsLineY: '#B6B6B6',  // '#ADB5D9',
      widthCoordinatsLineX: 0.5,  // '#ADB5D9',
      widthCoordinatsLineY: 0.5,  // '#ADB5D9',
   };

   constructor() {

      this.mainConteiner = this._mainConteiner();
      this.layer = new Layer(this.params);
      this.proxyLoop = new Loop(this.update.bind(this), this.display.bind(this));
      this.chart = new Chart(this.layer, this.proxyLoop, this.params);
      this.mc = new MouseControls(this.mainConteiner, this.proxyLoop, this.params.DPI);


      // let strReqwestData = this.params.dataurl + '?timefraime=minute';
      // let strReqwestData = this.params.dataurl + '?timefraime=hour';
      let strReqwestData = this.params.dataurl + '?timefraime=day';

      this.dP = new DataProcessing();   // всё что касается получения и оброботки данных

      this.dP.GetData(strReqwestData).then((data) => {
         this.chart.data = this.dP.PreparationData_2(data);
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
      this.chart.coordinateseCalculation();
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

      return mainConteiner;
   }

   _timeFraimeChoice() {
      /*
         здесь всё что касаеться управления приложением
      
      */

      // const navFraimtime = document.querySelectorAll('#nav-fraimtime');
      // const navFraimtime = document.querySelector('#nav-fraimtime').querySelectorAll('.fraimtime-item');
      // console.log("navFraimtime  = ", navFraimtime);



      let strReqwestData = this.params.dataurl + '?timefraime=day';
      // console.log("strReqwestData = ", strReqwestData);
      this.dP = new DataProcessing();   // всё что касается получения и оброботки данных

      this.dP.GetData(strReqwestData).then((data) => {
         this.chart.data = this.dP.PreparationData(data);
         this.display();
      });


   }


}

onload = () => { new App() }
