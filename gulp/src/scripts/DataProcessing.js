export class DataProcessing {
   /**
    * всё что касается получения и оброботки данных
    */

   constructor() {


   }

   GetData(url) {

      this.url = url;

      return new Promise((resolve, reject) => {
         const request = new XMLHttpRequest();
         request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200) {
               resolve(request.responseText);
            }
         }
         request.open('GET', this.url);
         request.send();
         // request.open('POST', this.url);
         // request.send('timefraime=1h');
      })
   }

   PreparationData_1(data) {     //обработка данных с https://www.alphavantage.co
      /**
       * преобразует данные в удобный формат
       * разварачивает масив по датам
       *
       */

      let arrResultsData = [];
      let arrData = [];
      let str = JSON.parse(data);

      let candles = str['Time Series (Digital Currency Daily)'];

      Object.keys(candles).forEach((key) => {
         arrResultsData.push(candles[key]['1b. open (USD)']);
      });

      console.log("candles = ", candles);

      return candles;
   }

   PreparationData_2(data) {     //обработка данных с https://min-api.cryptocompare.com
      /**
       * преобразует данные в удобный формат
       * разварачивает масив по датам 
       *
       */

      if (data == 'Time frame is not processing') {

         console.log("time frame is not processing");
         return false;
      }

      let str = JSON.parse(data);
      let candles = str.Data.Data.reverse();    // разворачиваю масив в обратном порядке
      return candles;

   }

};