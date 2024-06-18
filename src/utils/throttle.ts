function throttle(fn :Function , delay :number) :  Function {
    let lastTime = Date.now();
  return function(this : any)  {
    let context = this;
    // 记录当前函数触发的时间
    var nowTime = Date.now()
    // 当前时间减去上一次执行时间大于这个时间间隔才让他触发这个函数
    if (nowTime - lastTime >= delay) {
      // 绑定this 指向
      fn.apply(context, [...arguments]);
      // 同步时间
      lastTime = Date.now();
    }
  }
}

throttle(()=>console.log('这是节流') , 1000);