

export class Chart {
   /**
    * патерн Фасад
    * 
    * собрать весь холст внутри этого класса
    * 
    * необходимые сущьности
    *    холст
    *       масштабирование
    *          шкал
    *          графика
    *       прослушка событий
    *          мыши
    *          клавиатуры
    *    график
    *       отрисовка графика
    *    шкала X
    *       создать шкалу
    *    шкала Y
    *       создать шкалу
    *    данные
    * необходимые действия
    *    вычесление координат
    *    управление мышью
    *    управление клавиатурой
    *    
    * 
    */









}



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

      // arrResultsData = arrResultsData.reverse();
      // let strResult = arrResultsData.join('<br>')
      // arrData = [
      //    arrResultsData,   // для тестов
      //    strResult,   // для вывода на экран
      //    candles,    // для чистовика
      // ]


      return candles;
   }
};


export const page = {
   /**
    * формирует страницу приложения в т.ч. блок который будет содержать канвас
    */
   method_1: function () {

      console.log('page  page  page  page  page  page  page  page  ');
   }
}