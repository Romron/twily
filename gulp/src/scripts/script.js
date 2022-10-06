window.onload = function () {
   let url = './module_php/parser.php';

   // document.querySelector('#parser-start-button').onclick = function () {
   ajaxGet(url, function (data) {

      let usrStr = '<pre>' + data + '<pre>';    // что бы можно было нормально читать 
      const initBlock_1 = new Init('#initBlock_1', usrStr);
      let prepData = PreparationData(data);

      const initBlock_2 = new Init('#initBlock_2', prepData);

      initBlock_1.CreateBlock('#initial-data', '40%');
      initBlock_2.CreateBlock('#initial-data', "50%");

   });

   canvas();




   // }
}


function ajaxGet(url, callbackfunction) {
   let func = callbackfunction || function (data) { }

   let request = new XMLHttpRequest();

   request.onreadystatechange = function () {
      if (request.readyState == 4 && request.status == 200) {
         func(request.responseText);
      }
   }

   request.open('GET', url);
   request.send();

}

class Init {
   constructor(idNewBlock, data) {
      this.idNewBlock = idNewBlock;
      this.data = data;
   }

   CreateBlock(idTargetBlock, widthNewBlock = '') {
      this.widthNewBlock = widthNewBlock;

      if (!document.getElementById(this.idNewBlock)) {
         this.NewBlock = document.createElement('div');
         this.NewBlock.id = this.idNewBlock;
         this.NewBlock.classList.add('initBlocks');
         this.NewBlock.innerHTML = this.data;

         let str = document.querySelector(idTargetBlock).textContent;
         if ((/Исходные данные/i).test(str) != false) {
            document.querySelector(idTargetBlock).textContent = '';
         }
         this.NewBlock.style.width = this.widthNewBlock;
         document.querySelector(idTargetBlock).append(this.NewBlock);
      }
      return this.NewBlock;
   }

}

function PreparationData(data) {
   /**
    * Преобразует данные в удобный формат
    * 
    */
   let resultsData;
   let str = JSON.parse(data);


   let candles = str['Time Series (Digital Currency Daily)'];

   resultsData = Object
      // .keys(str['Time Series (Digital Currency Daily)'])
      .keys(candles)
      .forEach((key) => {

         // console.log(str['Time Series (Digital Currency Daily)'][key]['1b. open (USD)']);
         // console.log(candles[key]['1b. open (USD)']);
      });


   return resultsData;
}

function canvas() {

   const canvas = document.getElementById('canv-1');
   const ctx = canvas.getContext('2d');
   ctx.fillRect(100, 100, 50, 50);

   ctx.beginPath();
   ctx.moveTo(500, 300);
   ctx.lineTo(400, 550);
   ctx.stroke();


}