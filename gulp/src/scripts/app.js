

import { DataProcessing } from "./DataProcessing.js";
import { Chart } from "./Chart.js";
import { Loop } from "./Loop.js";
import { Layer } from "./Layer.js";
import { MouseControls } from "./MouseControls.js";




class App {

   params = {
      // timefraime: 'minute',   // для тестов
      // timefraime: 'hour',  // для тестов
      timefraime: 'day',
      dataurl: './module_php/parser_timefraime.php',
      idTargetBlock: "wrap-canvas",
      idMainConteiner: 'mainConteiner',
      idCanvas: "canvas-chart",
      heightMainConteiner: 600,
      widthMainConteiner: 1400,
      DPI: 2,   // показывает восколько раз внутренний размер canvas больше размера заданного в CSS 
      hightXaxis: 25,
      widthYaxis: 60,
      // scaleX: 2,  // для дневного таймфрейма
      scaleX: 1,  // для часового таймфрейма
      // scaleY: 5,
      scaleY: 1,
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
      this.dP = new DataProcessing();   // всё что касается получения и оброботки данных

      let strReqwest = this.params.dataurl + '?timefraime=' + this.params.timefraime;

      this.dP.GetData(strReqwest).then((data) => {
         this.chart.data = this.dP.PreparationData_2(data);
         this.display();
      });

      this.eventHandler();

   }

   eventHandler() {
      /* обработка всех событий в окне приложения кроме событий холста
      */



      document.querySelector('#nav-fraimtime').addEventListener('click', event => {
         if (!event.target.innerHTML) {
            // добавить оброботчик исключений
            console.log("empty item ???");
            return;
         }

         this.params.timefraime = event.target.innerHTML.toLowerCase();
         let strReqwest = this.params.dataurl + '?timefraime=' + this.params.timefraime;

         this.dP.GetData(strReqwest).then((data) => {
            this.chart.data = this.dP.PreparationData_2(data);
            this.chart.calculationDefaultParam();
            this.update();


            let arrItemsTimeFrime = Object.entries(document.querySelector('#nav-fraimtime').querySelectorAll('.fraimtime-item'));
            let arrItemsTimeFrimeNew = [];
            arrItemsTimeFrime.find((element, index) => {
               if (element[1]['innerHTML'] === event.target.innerHTML) {
                  arrItemsTimeFrimeNew = [arrItemsTimeFrime.splice(index, 1)[0], ...arrItemsTimeFrime]
                  return true;
               }
            })

            console.log("arrItemsTimeFrimeNew = ", arrItemsTimeFrimeNew);

         });

      })
   }

   update() {

      this.chart.mouse = this.mc;      // получить управляющие сигналы от мыши
      this.chart.clear();
      this.chart.coordinateseCalculation();
      this.chart.graph();

   }

   display() {

      this.chart.clear();
      this.chart.calculationDefaultParam();      // расчитываю параметры показа графика в зависимости от полученных данных
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

   timeFraimeChoice() {
      /*
         выбор таймфрейма по нажатию на кнопку
      
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
