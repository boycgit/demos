// kimi module
define(function(require) {
	
	var resp = function(){
        var baseWidth = $(window).width();
        var size = 20 * baseWidth / 320;
        $(document.documentElement).css({"font-size":""+size+"px"});        
	};

	resp();
    $(window).on("resize",function(){
    	resp();
    });


	var mapJSON = require("./mods/mapdata");

	var Parallax = require("./mods/parallax");


	parallax = new Parallax("#viewports",mapJSON);

	parallax.init();// 初始化


	require("./mods/sensor");

});