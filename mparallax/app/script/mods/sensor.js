define(function(require){


	var Sensor = function(){

	};

	// 接受一个回调函数
	Sensor.prototype.start = function(cb){
		this.cb = cb;

		var _self = this;

		if (window.DeviceOrientationEvent){

			$(window).on('deviceorientation',function(e){


				// 根据这三个值的正负，我们可以判定手机方位
				cb && cb(e);
				
			});
		}
		
	}

	return Sensor;


});