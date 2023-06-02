export class EventEmitter {
    public message;
    constructor() {
        this.message = new Map();
    }

    /**
     * 订阅事件及其回调函数
     * @param {string} type 事件名
     * @param {Function} callback 事件对应的回调函数
     */
    $on(type: string, callback: Function) {
        if (!type || !callback) return;
        if (this.message.has(type)) {
            this.message.get(type).push(callback);
        } else {
            this.message.set(type, [callback]);
        }
    }

    /**
     * 取消订阅事件及其回调函数，callback为空时候清除全部事件
     * @param {string} type 事件名
     * @param {Function} callback 事件对应的回调函数
     */
    $off(type: string, callback?: Function) {
        if (!type) return;
        if (!this.message.has(type)) {
            console.error("No such type!");
            return;
        }
        let cbs = this.message.get(type);
        if (callback) {
            let index = cbs.indexOf(callback);
            cbs.splice(index, 1);
            if (cbs.length === 0) this.message.delete(type);
        } else {
            this.message.delete(type);
        }
    }

    /**
     * 触发订阅事件的回调函数
     * @param {string} type 事件名
     */
    $emit(type: string, ...args: any[]) {
        if (!this.message.has(type)) {
            console.error("No such type!");
            return;
        }
        this.message.get(type).forEach((callback: any) => {
            callback(...args);
        })
    }
}


export function isDateTime(data: any): boolean {
    const COMMON_TIME_FORMAT: RegExp[] = [
        /^\d{4}-\d{1,2}-\d{1,2}$/, // YYYY-MM-DD
        /^\d{1,2}\/\d{1,2}\/\d{4}$/, // MM/DD/YYYY
        /^\d{1,2}\/\d{1,2}\/\d{4}$/, // DD/MM/YYYY
        /^\d{4}\/\d{1,2}\/\d{1,2}$/, // YYYY/MM/DD
        /^\d{4}\.\d{1,2}\.\d{1,2}$/, // YYYY.MM.DD
        /^\d{4}-\d{1,2}-\d{1,2}\s\d{1,2}:\d{1,2}:\d{1,2}$/, // YYYY-MM-DD HH:MM:SS
        /^\d{4}-\d{1,2}-\d{1,2}T\d{1,2}:\d{1,2}:\d{1,2}$/, // YYYY-MM-DDTHH:MM:SS (ISO-8601)
    ];
    for (let r of COMMON_TIME_FORMAT) {
        if (r.test(data)) {
            return true;
        }
    }
    return false;
}

export function isNumericData(data: any): boolean {
    // Check if the item is already a number
    if (typeof data === 'number') {
        return true;
    }
    // Check if the item can be converted into a number
    const number = parseFloat(data);
    return !isNaN(number) && isFinite(data);
}

export function isEmptyCell(data: any): boolean {
    if (data === undefined || data === null || data === "" || data === "/" || data === "-") {
        return true;
    }
    return false;
}

export function sampleData(data: any[], maxExeTime: number) {
    const len = data.length;
    if (len === 0) return {};
    for (let i = 0; i < maxExeTime; i++) {
      const randomIndex = Math.floor(Math.random() * len);
      const row = data[randomIndex];
      if (!Object.values(row).some(isEmptyCell)) {
        return { ...row };
      }
    }
    return { ...data[0] };
}