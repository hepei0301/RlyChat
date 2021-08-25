export class EventBus {
  listeners = [];

  listenersOncer = [];

  on = (listener) => {
    this.listeners.push(listener);
    return () => this.off(listener);
  };

  once = (listener) => {
    this.listenersOncer.push(listener);
  };

  off = (listener) => {
    this.listeners = this.listeners.filter((v) => {
      return v !== listener;
    });
  };

  emit = (event) => {
    this.listeners.forEach((listener) => listener(event));

    this.listenersOncer.forEach((listener) => listener(event));

    this.listenersOncer = [];
  };
}
