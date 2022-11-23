export class Loop {
   constructor(_update, _display) {
      this.update = _update;
      this.display = _display;

      this.deltaTime = 0;
      this.lastUpdate = 0;
      this.maxInterval = 40;

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

}