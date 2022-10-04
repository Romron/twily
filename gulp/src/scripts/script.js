window.onload = function () {
   let url = './module_php/parser.php';

   document.querySelector('#parser-start-button').onclick = function () {
      ajaxGet(url, function (data) {
         InitBlock(data);
         ParseData(data);
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

function InitBlock(data) {
   let initBlock_1 = document.getElementById('initBlock_1');
   if (!initBlock_1) {
      initBlock_1 = document.createElement('div');
      initBlock_1.id = 'initBlock_1';
      initBlock_1.classList.add('initBlocks');
      initBlock_1.innerHTML = data;
      document.querySelector('#initial-data').innerHTML = '';
      document.querySelector('#initial-data').style.justifyContent = 'space-between';
      document.querySelector('#initial-data').append(initBlock_1);
   }
}

function ParseData(data) {

}