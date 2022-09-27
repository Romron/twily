window.onload = function () {
   document.querySelector('#parser-start-button').onclick = function () {
      ajaxGet(url, function (data) {
         document.querySelector('#block-results').innerHTML = data;
      });
   }
}


let url = 'libs/module_php/parser.php';
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
