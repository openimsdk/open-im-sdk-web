import { CbEvents } from '@/constant/callback';
import type { WsResponse } from '@/types/entity';

interface Events {
  [key: string]: Cbfn[];
}

type Cbfn = (data: WsResponse) => void;

class Emitter {
  private events: Events;

  constructor() {
    this.events = {};
  }

  emit(event: CbEvents, data: WsResponse) {
    if (this.events[event]) {
      this.events[event].forEach(fn => {
        return fn(data);
      });
    }

    return this;
  }

  on(event: CbEvents, fn: Cbfn) {
    if (this.events[event]) {
      this.events[event].push(fn);
    } else {
      this.events[event] = [fn];
    }

    return this;
  }

  off(event: CbEvents, fn: Cbfn) {
    if (event && typeof fn === 'function' && this.events[event]) {
      const listeners = this.events[event];
      if (!listeners || listeners.length === 0) {
        return;
      }
      const index = listeners.findIndex(_fn => {
        return _fn === fn;
      });
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    }

    return this;
  }
}

export default Emitter;
