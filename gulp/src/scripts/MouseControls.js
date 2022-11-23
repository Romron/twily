export class MouseControls {
   constructor(conteiner, proxy = {}, params) {
      this.conteiner = conteiner.canvas;
      const { left, top } = this.conteiner.getBoundingClientRect()      // т.к. координаты канваса не савпадают с координатами экрана
      this.left = left;
      this.top = top;
      this.proxy = proxy;
      this.params = params;

      this.isPressed = false;
      this.isDown = false;
      this.isUp = false;
      this.pos = { x: -10, y: -10 };
      this.wheel = 0;

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



      if (e.type === 'mousemove') {
         this.pos = {
            x: (e.clientX - this.left) * 2 - this.params.paddingRight,      // преобразование в WIDTH_DPI
            y: (e.clientY - this.top) * 2 - this.params.paddingTop,       // преобразование в HEIGHT_DPI
         }
         this.proxy.mouse = this.pos;
      } else if (e.type === 'wheel') {
         e.preventDefault();     // запрещает перемотку всей страницы
         // console.log("e.deltaY = ", e.deltaY);


         let q = e.deltaY + e.deltaX;

         if (q > 0) {
            this.wheel = 0.1;
         } else if (q < 0) {
            this.wheel = -0.1;
         } else {
            this.wheel = 0;
         }

         this.proxy.mouse = this.wheel;
         // if (e.deltaY > 0) {
         //    this.wheel += 0.1;
         // } else {
         //    this.wheel -= 0.1;

         // }

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
