// import './index.html';
import './index.php';      // добавить loader
import './style/index.css';






// alert('перед window.onload = function');

window.onload = function () {
   document.querySelector('#parser-start-button').onclick = function () {

      // alert('в нутри window.onload = function');

      ajaxGet(url, function (data) {
         document.querySelector('#block-results').innerHTML = data;
      });
   }
}


// let url = 'libs/module_php/parser.php';
// let url = 'http://localhost/twily/simpl_php/libs/module_php/parser.php';
let url = 'libs_p/module_php/parser.php';
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
