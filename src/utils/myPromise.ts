class myPromise {
    promiseResult!: null;
    promiseState: string = "";
    fulfilledCallbacks: Array<any> = []
    rejectedCallbacks: Array<any> = []
    constructor(executor: any) {

        // 创建基础值
        this.initValue();
        // 初始化绑定
        this.initBind();
        // 执行
        try {
            executor(this.resolve, this.reject);
        } catch (e) {
            this.reject(e);
        }
    }

    initValue() {
        this.promiseResult = null;
        this.promiseState = 'pending';
        // 保存失败和成功的回调
        this.fulfilledCallbacks = [];
        this.rejectedCallbacks = [];
    }

    initBind() {
        this.resolve = this.resolve.bind(this);
        this.reject = this.reject.bind(this);
    }

    /**
     * 成功执行
     */
    resolve(value: any) {
        // 添加状态不可逆
        if (this.promiseState !== 'pending') return;
        this.promiseState = 'fulfilled';
        this.promiseResult = value;

        while (this.fulfilledCallbacks.length > 0) {
            this.fulfilledCallbacks.shift()(this.promiseResult);
        }
    }

    // 失败
    reject(value: any): void {
        if (this.promiseState !== 'pending') return;
        this.promiseState = 'rejected';
        this.promiseResult = value;

        while (this.rejectedCallbacks.length > 0) {
            this.rejectedCallbacks.shift()(this.promiseResult);
        }
    }

    then(onFulfilled: any, onRejected: any) {
        onFulfilled = typeof onFulfilled == 'function' ? onFulfilled : (val: any) => val;
        onRejected = typeof onRejected == 'function' ? onRejected : (val: any) => val;

        const thenPromise = new myPromise((resolve: any, reject: any) => {
            const resolvePromise = (cb: (arg0: null) => any) => {
                try {
                    const res = cb(this.promiseResult);

                    if (res && res === thenPromise) {
                        throw new Error('不能返回自身。。。');
                    }

                    if (res instanceof myPromise) {
                        res.then(resolve, reject);
                    } else {
                        resolve(res);
                    }
                } catch(e : any) {
                    reject(e);
                }
            };
            if (this.promiseState === 'rejected') {
                onRejected(this.promiseResult);
            } else if (this.promiseState === 'fulfilled') {
                onFulfilled(this.promiseResult);
            } else if (this.promiseState === 'pending') {
                this.fulfilledCallbacks.push(this.promiseResult.bind(this, onFulfilled));
                this.rejectedCallbacks.push(this.promiseResult.bind(this, onRejected));
            };
        })

        return thenPromise;

    }
}