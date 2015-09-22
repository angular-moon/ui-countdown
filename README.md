# ui-countdown
显示倒计时

### countdown 配置属性:

* <code>countdown</code> (Defaults: '1970-1-1'): 倒计时结束时间 支持类型 -> Date对象, UTC时间戳, 时间字符串 eg:"2015-9-14 12:00:00"

* <code>show-ms</code>  (Defaults: false):是否显示毫秒

* <code>watch</code>  (Defaults: false):是否监测start 和 countdown的变化

* <code>over-title</code>  (Defaults: '已结束'):倒计时结束后显示的内容

* <code>start</code>  (Defaults: null):倒计时开始时间, 一般用于使用服务器端的当前时间来计算倒计时. 由于网络和客户端计算时间差等原因可能会有一定的误差. (目前采用的方案经过测试误差还是在可接受的范围内).建议最好用[服务器返回的当前时间+网络延迟的时间]作为开始时间

* <code>countdown</code>指令 依赖countdown.js

### 默认使用客户端当前时间来计算倒计时(各大电商平台也是用的客户端时间,计算准确度高,但依赖客户端时间的正确性)

* 如果想使用服务器端时间作为开始时间来计算请使用start属性

* 如果想自定义数字的样式,请覆盖 class .countdown i

* 如果想自定义倒计时结束文字的样式,请覆盖 class .over
