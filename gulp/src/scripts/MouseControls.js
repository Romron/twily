export class MouseControls {

   /**
    * этот класс должен быть универсальным 
    *    т.е. должен подключаться к любому(!!) контейнеру
    * отслеживает манипуляции мыши
    * формирует управляющий сигнал
    * 
    * принимает: 
    *    контейнер - блок для отслеживания
    *    proxy - для запуска ф-ции обновления
    * 
    */

   constructor(conteiner, proxy, DPI) {

      this.conteiner = conteiner;
      this.DPI = DPI;
      this.proxy = proxy;

      const { left, top } = this.conteiner.getBoundingClientRect()      // т.к. координаты канваса не савпадают с координатами экрана
      this.left = left;
      this.top = top;

      this.isPressed = false;
      this.isDown = false;
      this.isUp = false;
      this.pos = { x: -10, y: -10 };         // прячу курсор до начала работы приложения
      this.wheel = { wheelX: 0, wheelY: 0 };
      this.event = {};

      // conteiner.addEventListener('click', e => this.cangeState(e));
      // conteiner.addEventListener('dblclick', e => this.cangeState(e));
      // conteiner.addEventListener('mouseenter', e => this.cangeState(e));

      this.conteiner.addEventListener('mousemove', e => this.cangeState(e));
      this.conteiner.addEventListener('mousedown', e => this.cangeState(e));
      this.conteiner.addEventListener('mouseup', e => this.cangeState(e));
      this.conteiner.addEventListener('wheel', e => this.cangeState(e));
      this.conteiner.addEventListener('mouseleave', e => this.cangeState(e));
      this.conteiner.addEventListener('contextmenu', e => this.cangeState(e));
   }

   cangeState(e) {
      this.event = e;      // для обработки событий вне этого класса

      if (e.type === 'mousemove') {
         // возвращает координаты мыши внутри контейнера
         this.pos = {
            x: (e.clientX - this.left) * this.DPI,
            y: (e.clientY - this.top) * this.DPI,
         }

         console.log("this.pos = ", this.pos);

         this.proxy.mouse = this.pos;
      } else if (e.type === 'wheel') {
         this.wheel = {
            wheelX: e.deltaX,
            wheelY: e.deltaY,
         }
         this.proxy.mouse = this.wheel;
      } else if (e.type === 'mousedown') {
         this.isPressed = true;
         this.isDown = true;
         this.isUp = false;
      } else if (e.type === 'mouseup') {
         this.isPressed = false;
         this.isDown = false;
         this.isUp = true;
      } else if (e.type === 'contextmenu') {
         e.preventDefault();
      }



   }


}
