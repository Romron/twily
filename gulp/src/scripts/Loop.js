export class Loop {
   constructor(_update, _display) {
      this.update = _update;
      this.display = _display;

      this.deltaTime = 0;
      this.lastUpdate = 0;
      this.maxInterval = 40;


   }

   loopWithProxy() {


      const proxy = new Proxy({}, {
         set(...args) {
            const result = Reflect.set(...args);
            requestAnimationFrame(() => {
               console.log("proxy");

               proxy.this.update();
               proxy.this.display();


            });
            return result;
         }
      });

      proxy.this = this;

      return proxy;
   }

   animate() {

      this._animate = this._animate.bind(this);
      this._animate();
   }

   _animate(currentTime = 0) {
      requestAnimationFrame(this._animate);

      this.deltaTime = currentTime - this.lastUpdate;

      if (this.deltaTime < this.maxInterval) {
         this.update(this.deltaTime / 1000);
         this.display();
      }

      this.lastUpdate = currentTime;
   }
}