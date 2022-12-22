export class DataProcessing {
   /**
    * всё что касается получения и оброботки данных
    */

   constructor(url) {
      this.url = url;
   }

   GetData() {
      return new Promise((resolve, reject) => {
         const request = new XMLHttpRequest();
         request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200) {
               resolve(request.responseText);
            }
         }
         request.open('GET', this.url);
         request.send();
      })
   }

   PreparationData(data) {
      /**
       * В зависимости от URL с которого пришли данные 
       * преобразует данные в удобный формат
       * разварачивает масив по датам
       *
       */

      this.arrResultsData = [];

      let str = JSON.parse(data);


      if (str["Meta Data"]['data_source'].includes('alphavantage')) {
         return str['Time Series (Digital Currency Daily)'];
      } else if (str["Meta Data"]['data_source'].includes('cryptocompare')) {
         console.log("date with: cryptocompare");
      }

   }






};




