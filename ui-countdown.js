
var countdown = require('countdown');

angular.module("ui.countdown", [])

.directive('countdown', function() {

      //数字前面补零占位
      function pad(num, n) { 
        num = num || 0; 
        var len = String(num).length;  
        while(len < n) {  
            num = "0" + num;  
            len++;  
        }  
        return num;  
      }  

      //创建某一项时间元素
      function buildTimeElement(number, label){
        return "<span class='countdown'><i>"+ String(number).split("").join("</i><i>") +"</i></span>" + label + " ";
      }

      //根据ts对象构造html内容
      function timespanToHtml(ts){
          var html = "";
          if(ts.years)
            html += buildTimeElement(ts.years, "年");

          if(ts.months || html)
            html += buildTimeElement(ts.months, "月");

          if(ts.days || html)
            html += buildTimeElement(ts.days, "天");

          if(ts.hours || html)
            html += buildTimeElement(pad(ts.hours, 2), "时");

          if(ts.minutes || html)
            html += buildTimeElement(pad(ts.minutes, 2), "分");

          if(ts.seconds || html)
            html += buildTimeElement(pad(ts.seconds, 2), "秒");

          if(ts.milliseconds !== undefined && html)
            html += buildTimeElement(pad(ts.milliseconds, 3), "毫秒");

          return html;
      }

    return {
        restrict: 'AE',
        link: function(scope, elem, attr, ctrl) {

          if(!angular.isFunction(countdown)){
            alert("请引用countdown.js");
            return;
          }
         
          //定时器句柄
          var timerId;

          //倒计时结束提示
          var overTitle = attr.overTitle ? "<span class='over'>"+attr.overTitle+"</span>" : "<span class='over'>已结束</span>";

          //是否显示毫秒
          var ms = scope.$eval(attr.showMs);

          //开始时间,用于使用服务器端计算倒计时,计算准确的没有
          var start = scope.$eval(attr.start);

          //结束时间
          var end;

          //是否监控时间变化
          var watch = scope.$eval(attr.watch);
          
          //使用指定时间作为开始时间
          function goStart(){
            start = scope.$eval(attr.start);
            start = angular.isDate(start) ? start.getTime() : new Date(angular.isString(start) ? start.replace(/-/g, '/') : start).getTime();
            end = scope.$eval(attr.countdown) || '1970/1/1';
            end = angular.isDate(end) ? end.getTime() : new Date(angular.isString(end) ? end.replace(/-/g, '/') : end).getTime();
            var now_time = new Date().getTime();
            function _go(){
              //根据客户端时间差计算新的开始时间,
              //这种方案的准确度比 + 根据delay时间增加相应的毫秒数要高
              //而且切换浏览器tabs计时器暂停也可以很好的工作
              var _start = start + (new Date().getTime() - now_time);
              var ts = countdown(_start, end,  ms ? countdown.DEFAULTS | countdown.MILLISECONDS : countdown.DEFAULTS);
              if(end > _start)
                elem.html(timespanToHtml(ts));
              else{
                elem.html(overTitle);
                window.clearInterval(timerId);
              }
            }

            if(end > start){
              timerId = window.setInterval(_go, ms ? 1000/30 : 1000);
              _go();
            }else{
              elem.html(overTitle);
            }
          }

          //使用客户端当前时间作为开始时间
          function go(){
            end = scope.$eval(attr.countdown) || '1970/1/1';
            end = angular.isDate(end) ? end : new Date(angular.isString(end) ? end.replace(/-/g, '/') : end);
            var now = new Date();
            if(end > now){
              timerId = countdown(
              function(ts) {
                var _now = new Date()
                if(end > _now)
                  elem.html(timespanToHtml(ts));
                else{
                  elem.html(overTitle);
                  window.clearInterval(timerId);
                }
              },end, ms ? countdown.DEFAULTS | countdown.MILLISECONDS : countdown.DEFAULTS);
            }else{
              elem.html(overTitle);
            }
          };

          //开始倒计时
          if(start)
            goStart();
          else
            go();

          if(watch){
            if(attr.start){
              scope.$watch(attr.start + "+" + attr.countdown, function(oldValue, newValue){
                  window.clearInterval(timerId);
                  goStart();
                
              });
            }else{
              scope.$watch(attr.countdown, function(){
                  window.clearInterval(timerId);
                  go();
              });
            }
          }
        }
    };
});