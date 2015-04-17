// kimi module
define(function(require) {
	
	if (!!$.browser.mozilla){
		$('body').addClass('ks-firefox');
	}

	
	if (!!$.browser.webkit){
		$('body').addClass('ks-chrome');
	}



	var container = $('.container');

	var letters = $('#letters');

	var shapes = $(".tri-shape",letters);

	var calcPath = function(){
		$(".tri").each(function(item,i) {

		 
		  var path = window.getComputedStyle(this, ':after').getPropertyValue('content');

		  // console.log(path);
		   

		  var shapeDefine ="";

		  if(/ellipse/g.test(path)){ // 如果是ellipse形状

		  	var reg = /([\d\.])*%/g;
		  	var match = path.match(reg);

		  	// 转换成小数
		  	$.each(match,function(index,num){ match[index] = parseFloat(num)*0.01;});

		  	var rx = match[0]||0,ry = match[1] || 0,cx = match[2] || 0,cy = match[3] || 0;
		  	
		  	shapeDefine = '<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'">';	

		  }else{

			  var svgPolygonPoints = 
			    path
			      .replace(/px/g, "")
			      .replace(/([\d\.])*%/g,function(num){return parseFloat(num)*0.01;})
			      .replace(/polygon/, "")
			      .replace(/\(/, "")
			      .replace(/\)/, "")
			      .replace(/\;/g, "")
			      .replace(/\"/g, "")
			      .replace(/\'/g, "");

			  shapeDefine = '<polygon points="'+svgPolygonPoints+'"/>';
		  }
		 


		  var order = $(this).attr("data-order");
		  var prefix = $(this).parent().attr('id') + order;

		  // 添加样式类
		  $(this).css({'clip-path':'url(#clip-'+prefix+')'});  
		  var div = $("<div>")
		    .append("<svg xmlns='http://www.w3.org/2000/svg' width='0' height='0' viewBox='0 0 100 100' preserveAspectRatio='none'><defs><clipPath clipPathUnits='objectBoundingBox' id='clip-" + prefix +"'>"+shapeDefine+"</clipPath></defs></svg>");
		  var svg = $('svg',div)[0];


		  $("#calcPaths").append(svg);
		});
	}


	// 针对firefox
	var calcFirfox = function(){

		if (!!$.browser.mozilla) {

			calcPath();
		}
	}



	// 动效代码
	setTimeout(function(){

		var mountain = $("#mountain");
		var slogan = $("#slogan");


		
		
		container.removeClass('-init');
		calcFirfox();



		setTimeout(function(){
			shapes.addClass('-flick');

			calcFirfox();

			setTimeout(function(){
				mountain.addClass("-show");
				slogan.addClass("-show");
				shapes.removeClass('-flick');
				calcFirfox();
			},1500);
		},1000)

	},1000);








	
});