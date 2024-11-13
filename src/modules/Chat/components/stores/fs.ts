// import type { PathWatcherEvent } from '@webcontainer/api';
import AiWebcontainerInst, { HOME_DIR } from './webcontainer'

export function bufferWatchEvents<T extends unknown[]>(timeInMs: number, cb: (events: T[]) => Promise<unknown>) {
    let timeoutId: number | undefined;
    let events: T[] = [];
  
    // keep track of the processing of the previous batch so we can wait for it
    let processing: Promise<unknown> = Promise.resolve();
  
    const scheduleBufferTick = () => {
      timeoutId = self.setTimeout(async () => {
        // we wait until the previous batch is entirely processed so events are processed in order
        await processing;
  
        if (events.length > 0) {
          processing = cb(events);
        }
  
        timeoutId = undefined;
        events = [];
      }, timeInMs);
    };
  
    return (...args: T) => {
      events.push(args);
  
      if (!timeoutId) {
        scheduleBufferTick();
      }
    };
  }
  
