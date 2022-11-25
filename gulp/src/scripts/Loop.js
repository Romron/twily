export class Loop {
   // <<<<<<< Updated upstream
   constructor(_update, _display) {
      this.update = _update;
      this.display = _display;
      // =======
      //    constructor(update, display) {
      //       this.update = update;
      //       this.display = display;
      // >>>>>>> Stashed changes

      this.deltaTime = 0;
      this.lastUpdate = 0;
      this.maxInterval = 40;

      // <<<<<<< Updated upstream
      const proxy = new Proxy({}, {
         set(...args) {
            const result = Reflect.set(...args);
            requestAnimationFrame(() => {
               proxy.this.update();
            });
            return result;
         }
      });

      proxy.this = this;

      return proxy;

   }

   // =======
   //       requestAnimationFrame(stampTime => this.animate(stampTime));
   //    }
   animate(currentTime) {
      requestAnimationFrame(stampTime => this.animate(stampTime));

      this.deltaTime = currentTime - this.lastUpdate;

      if (this.deltaTime < this.maxInterval) {
         this.update(this.deltaTime / 1000);
         this.display();
      }

      this.lastUpdate = currentTime;
   }
   // >>>>>>> Stashed changes
}