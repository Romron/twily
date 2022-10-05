window.onload = function () {
   let url = './module_php/parser.php';

   document.querySelector('#parser-start-button').onclick = function () {
      ajaxGet(url, function (data) {
         // InitBlock(data, 'initBlock_1');
         const initBlock_1 = new InitBlocks('#initBlock_1', data);
         const initBlock_2 = new InitBlocks('#initBlock_2', '**************');

         console.log(initBlock_1);
         console.log(initBlock_2);

         let a = initBlock_1.CreateBlock('#initial-data');
         let b = initBlock_2.CreateBlock('#initial-data');

         document.querySelector('#initial-data').append(a);
         document.querySelector('#initial-data').append(b);

         // InitBlock('#initBlock_1', '#initial-data', data);
         // InitBlock('#initBlock_2', '#initial-data', '**************');
         PreparationData(data);
      });
   }
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

class InitBlocks {
   constructor(idNewBlock, data) {
      this.idNewBlock = idNewBlock;
      // this.idTargetBlock = idTargetBlock;
      this.data = data;
   }

   CreateBlock(idTargetBlock) {
      if (!document.getElementById(this.idNewBlock)) {
         this.NewBlock = document.createElement('div');
         this.NewBlock.id = this.idNewBlock;
         this.NewBlock.classList.add('initBlocks');
         this.NewBlock.innerHTML = this.data;
         document.querySelector(idTargetBlock).innerHTML = '';
         document.querySelector(idTargetBlock).style.justifyContent = 'space-between';
         // document.querySelector(idTargetBlock).append(this.NewBlock);
      }
      return this.NewBlock;
   }


}


// function InitBlock(idNewBlock, idTargetBlock, data) {
//    this.NewBlock = document.getElementById(idNewBlock);
//    this.idTargetBlock = idTargetBlock;
//    this.data = data;
//    // console.log(idTargetBlock);

//    if (!this.NewBlock) {
//       this.NewBlock = document.createElement('div');
//       console.log(this.NewBlock);
//       this.NewBlock.id = this.idNewBlock;
//       this.NewBlock.classList.add('initBlocks');
//       this.NewBlock.innerHTML = this.data;
//       document.querySelector(idTargetBlock).innerHTML = '';
//       document.querySelector(idTargetBlock).style.justifyContent = 'space-between';
//       document.querySelector(idTargetBlock).append(this.NewBlock);
//    }
// }

function PreparationData(data) {

}