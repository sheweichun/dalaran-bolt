type ClassNamesArg = undefined | string | Record<string, boolean> | ClassNamesArg[];



function appendClass(value: string, newClass: string | undefined) {
    if (!newClass) {
      return value;
    }
  
    if (value) {
      return value + ' ' + newClass;
    }
  
    return value + newClass;
}

function parseValue(arg: ClassNamesArg) {
    if (typeof arg === 'string' || typeof arg === 'number') {
      return arg;
    }
  
    if (typeof arg !== 'object') {
      return '';
    }
  
    if (Array.isArray(arg)) {
      return classNames(...arg);
    }
  
    let classes = '';
  
    for (const key in arg) {
      if (arg[key]) {
        classes = appendClass(classes, key);
      }
    }
  
    return classes;
  }
/**
 * A simple JavaScript utility for conditionally joining classNames together.
 *
 * @param args A series of classes or object with key that are class and values
 * that are interpreted as boolean to decide whether or not the class
 * should be included in the final class.
 */
export function classNames(...args: ClassNamesArg[]): string {
  let classes = '';

  for (const arg of args) {
    classes = appendClass(classes, parseValue(arg));
  }

  return classes;
}


export function debounce<Args extends any[]>(fn: (...args: Args) => void, delay = 100) {
  if (delay === 0) {
    return fn;
  }

  let timer: number | undefined;

  return function <U>(this: U, ...args: Args) {
    const context = this;

    clearTimeout(timer);

    timer = window.setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
}

//@ts-ignore
export function withResolvers<T>(): PromiseWithResolvers<T> {
  //@ts-ignore
  if (typeof Promise.withResolvers === 'function') {
    //@ts-ignore
    return Promise.withResolvers();
  }

  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: any) => void;

  const promise = new Promise<T>((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });

  return {
    resolve,
    reject,
    promise,
  };
}
