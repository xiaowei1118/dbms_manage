Object.defineProperty(Object.prototype, "extendConfig", {   //原来的extend和express的parse对象的extend属性冲突，在res.render的时候会出问题，千万不要用！
    enumerable: false,
    value: function (from) {
        var props = Object.getOwnPropertyNames(from);
        var dest = this;
        props.forEach(function (name) {
            if (name in dest) {
                var destination = Object.getOwnPropertyDescriptor(from, name);
                Object.defineProperty(dest, name, destination);
            }
        });
        return this;
    }
});
//(function () {
//    var orig = Array.prototype.forEach;
//    Array.prototype.forEach = function forEach(func, ctx) {
//        var len = this.length,i=0;
//        if (ctx) orig.call(this, func, ctx);
//        else while (++i<len) func(this[i], i, this);
//    }
//})();
Date.prototype.toString = function () { return this.toJSON().split(/[T.Z]/).slice(0, 2).join(' '); }