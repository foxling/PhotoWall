/**
 * 给jQuery扩展新方法
 */


$.extend({
    timeParse: function(timeString){
        var t = Date.parse(timeString);
        if ( !t ) {
            return '';
        }
        var now = +(new Date),
            diff = (now - t) / 1000;
        
        if (diff < 60) {
            return '刚刚';
        } else if( diff < 3600 ) {
            return Math.floor(diff / 60) + '分钟前';
        } else if ( diff < 86400 ) {
            return Math.floor(diff / 3600) + '小时前';
        } else if ( diff < 1296000 ) {
            return Math.floor( diff / 86400 ) + '天前';
        }
        var d = new Date(t);
        return d.getFullYear() + '/' + $.pad((d.getMonth()+1),2) + '/' + $.pad(d.getDate(),2) + ' ' 
                + $.pad(d.getHours(),2) + ':' + $.pad(d.getMinutes(),2);// + ':' + $.pad(d.getSeconds(),2);
    },

    /**
     * 清除记时器，并返回null
     * @param {Object} timer
     */
    clearTimer: function(timer){
        clearInterval(timer);
        clearTimeout(timer);
        return null;
    },
    
    /**
     * 补位，比如日期 9 变成 09
     * @param {mixed} num  需要补位的数字或者字符串，一般是数字
     * @param {int}   n    需要补成几位
     * @return {string}    返回一个字符串
     */
    pad: function (num, n) {
        var len = num.toString().length;
        while (len < n) {
            num = '0' + num;
            len++;
        }
        return num.toString();
    },
    
    
    /**
     * 点击区域判断
     * @param {htmlElement} target  点击的目标元素
     * @param {htmlElement} elm     判断是否在该元素内部点击
     */
    isClickInside: function(target, elm){
        if (!target || target.nodeType !== 1 || !elm || elm.nodeType !== 1) {
            throw new Error('target or elm undefined');
        }
        var el = $(target), result = false;
        if (target === elm) {
            result = true;
        } else {
            if ( this === document.body ){
                return false;
            }
            el.parents().each(function(i) {
                if (this === document.body){
                    result = false;
                    return false;
                }else if (this === elm) {
                    result = true;
                    return false;
                }
            });
        }
        return result;
    },
    
    /**
     * 返回一个从 m 到 n 的随机数
     * @param {int} m
     * @param {int} n
     */
    rnd: function (m, n){
        return Math.floor( (n-m) * Math.random() + m);
    },
    
    /**
     * 判断对象是否是一个字符串
     * @param {Object} object
     */
    isString: function(object){
        return typeof object === 'string';
    },
    
    /**
     * 判断对象是否是一个有效的字符串，并且不为空
     * @param {Object} object
     */
    isNotEmptyString: function(object){
        return $.isString(object) && object !== '';
    },

    getByteLen: function(text){
        if ( !text ) return 0;
        var cArr = text.match(/[^\x00-\xff]/ig);
        return text.length + (cArr == null ? 0 : cArr.length);  
    },

    clonePlainObject: function(){

        function clone(cloneObj){
            if ( !$.isPlainObject(cloneObj) ) {
                return cloneObj;
            }
            var obj = {};
            for ( var k in cloneObj ) {
                obj[k] = clone( cloneObj[k] );
            }
            return obj;
        }

        return clone;
           
    }()
});

// 将输入框的光标移到末尾
$.fn.moveCursorToEnd = function(){
    if (this.length === 0) return this;
    
    var obj = this[0],
        len = obj.value.length;
    
    this.val( this.val() ).focus();
    
    console.info(len);

    if (document.selection) {
        var sel = obj.createTextRange();
        sel.moveStart('character', len);
        sel.collapse();
        sel.select();
    } else if (
        typeof obj.selectionStart == 'number' &&
        typeof obj.selectionEnd == 'number') {

        obj.selectionStart = obj.selectionEnd = len;
    }

    return this;
};


/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 */
// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend( jQuery.easing,
{
    def: 'easeOutQuad',
    swing: function (x, t, b, c, d) {
        //alert(jQuery.easing.default);
        return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
    },
    easeInQuad: function (x, t, b, c, d) {
        return c*(t/=d)*t + b;
    },
    easeOutQuad: function (x, t, b, c, d) {
        return -c *(t/=d)*(t-2) + b;
    },
    easeInOutQuad: function (x, t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t + b;
        return -c/2 * ((--t)*(t-2) - 1) + b;
    },
    easeInCubic: function (x, t, b, c, d) {
        return c*(t/=d)*t*t + b;
    },
    easeOutCubic: function (x, t, b, c, d) {
        return c*((t=t/d-1)*t*t + 1) + b;
    },
    easeInOutCubic: function (x, t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t*t + b;
        return c/2*((t-=2)*t*t + 2) + b;
    },
    easeInQuart: function (x, t, b, c, d) {
        return c*(t/=d)*t*t*t + b;
    },
    easeOutQuart: function (x, t, b, c, d) {
        return -c * ((t=t/d-1)*t*t*t - 1) + b;
    },
    easeInOutQuart: function (x, t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
        return -c/2 * ((t-=2)*t*t*t - 2) + b;
    },
    easeInQuint: function (x, t, b, c, d) {
        return c*(t/=d)*t*t*t*t + b;
    },
    easeOutQuint: function (x, t, b, c, d) {
        return c*((t=t/d-1)*t*t*t*t + 1) + b;
    },
    easeInOutQuint: function (x, t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
        return c/2*((t-=2)*t*t*t*t + 2) + b;
    },
    easeInSine: function (x, t, b, c, d) {
        return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
    },
    easeOutSine: function (x, t, b, c, d) {
        return c * Math.sin(t/d * (Math.PI/2)) + b;
    },
    easeInOutSine: function (x, t, b, c, d) {
        return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
    },
    easeInExpo: function (x, t, b, c, d) {
        return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
    },
    easeOutExpo: function (x, t, b, c, d) {
        return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
    },
    easeInOutExpo: function (x, t, b, c, d) {
        if (t==0) return b;
        if (t==d) return b+c;
        if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
        return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
    },
    easeInCirc: function (x, t, b, c, d) {
        return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
    },
    easeOutCirc: function (x, t, b, c, d) {
        return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
    },
    easeInOutCirc: function (x, t, b, c, d) {
        if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
        return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
    },
    easeInElastic: function (x, t, b, c, d) {
        var s=1.70158;var p=0;var a=c;
        if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
        if (a < Math.abs(c)) { a=c; var s=p/4; }
        else var s = p/(2*Math.PI) * Math.asin (c/a);
        return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    },
    easeOutElastic: function (x, t, b, c, d) {
        var s=1.70158;var p=0;var a=c;
        if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
        if (a < Math.abs(c)) { a=c; var s=p/4; }
        else var s = p/(2*Math.PI) * Math.asin (c/a);
        return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
    },
    easeInOutElastic: function (x, t, b, c, d) {
        var s=1.70158;var p=0;var a=c;
        if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
        if (a < Math.abs(c)) { a=c; var s=p/4; }
        else var s = p/(2*Math.PI) * Math.asin (c/a);
        if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
    },
    easeInBack: function (x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c*(t/=d)*t*((s+1)*t - s) + b;
    },
    easeOutBack: function (x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    },
    easeInOutBack: function (x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158; 
        if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
        return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
    },
    easeInBounce: function (x, t, b, c, d) {
        return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
    },
    easeOutBounce: function (x, t, b, c, d) {
        if ((t/=d) < (1/2.75)) {
            return c*(7.5625*t*t) + b;
        } else if (t < (2/2.75)) {
            return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
        } else if (t < (2.5/2.75)) {
            return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
        } else {
            return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
        }
    },
    easeInOutBounce: function (x, t, b, c, d) {
        if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
        return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
    }
});
