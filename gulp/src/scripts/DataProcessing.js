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
};




// "2020-12-31":
// "1a. open (UAH)": "1059732.68500000"
// "1b. open (USD)": "28875.55000000"
// "2a. high (UAH)": "1075310.00000000"
// "2b. high (USD)": "29300.00000000"
// "3a. low (UAH)": "1022095.00000000"
// "3b. low (USD)": "27850.00000000"
// "4a. close (UAH)": "1061497.22100000"
// "4b. close (USD)": "28923.63000000"
// "5. volume": "75508.50515200"
// "6. market cap (USD)": "75508.50515200"