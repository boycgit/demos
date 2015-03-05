define(function(require){


	var Parallax = function(el,mapJSON){

		this.el = el || "body";

		this.$el = $(this.el);

		this.mapJSON = mapJSON;

	}

	var ratio = 1 / 46.875;

	var baseWidth = + $(document.documentElement).css("font-size").slice(0,-2);

	

	// 构造tileScroller
	Parallax.prototype.tileScroller = function (params) {

	    var that = {},
	        $viewport = params.$viewport;
	        
	        // Snapping....
	        // 根据$viewport大小，计算所需的tile数量
	        //计算标准下的图像高宽
	        var standWidth = ($viewport.width()/baseWidth/ratio);
	        var standHeight = ($viewport.height()/baseWidth/ratio);
	        tilesAcross =  Math.ceil((standWidth + params.tileWidth) / params.tileWidth),
	        tilesDown =  Math.ceil((standHeight + params.tileHeight) / params.tileHeight);



	        // 创建.handle元素
	        // 相当于创建显示器外壳，方便搬移整个显示器
	        var html = '<div class="handle" style="position:absolute;">',
	        left = 0,
	        top = 0,
	        // 存放各个tile CSS style的数组
	        tiles = [],
	        // 存储每个tile背景图片的background-position属性
	        tileBackPos = [],
	        // 计算map的尺寸，比如宽度上有32个tile，每个tile为64px，那么map的宽度（px）为 32 * 64 .
	        mapWidthPixels = params.mapWidth * params.tileWidth,
	        mapHeightPixels = params.mapHeight * params.tileHeight,
	        handle, i; // General counter.

	        // var isDebug = true;
	        // console.log("88:",baseWidth,$viewport.width()/baseWidth/ratio);
	        // console.log("33",tilesAcross,tilesDown);


	    // 创建tiles字符串，然后再一次性拼接到.handle元素内
	    // 这比逐次创建tile逐个拼接到.handle的性能要高
	    for (top = 0; top < tilesDown; top++) {
	        for (left = 0; left < tilesAcross; left++) {
	            html += '<div class="tile" style="position:absolute;' +
	            'background-image:url(\'' + params.image + '\');' +
	            'width:' + params.tileWidth*ratio + 'rem;' +
	            'height:' + params.tileHeight*ratio + 'rem;' +
	            'background-position: 0% 0%;' +
	            'background-size: '+ (100 * params.imageWidth / params.tileWidth) +'% auto;' +
	            'left:' + (left * params.tileWidth * ratio) + 'rem;' +
	            'top:' + (top * params.tileHeight * ratio) + 'rem;' + '"/>';
	        }
	    }
	    
	    html += '</div>';
	    // 至此打造完整个“显示器”的物理结构
	    $viewport.html(html);

	    // 获取handle对象
	    handle = $('.handle', $viewport)[0];


	    // 将每个tile的样式（主要是物理位置信息）存放到tile数组中，
	    // 相当于计算机中的缓存，在之后滚动视窗的时候提高运算速度
	    for (i = 0; i < tilesAcross * tilesDown; i++) {
	        tiles.push($('.tile', $viewport)[i].style);
	    }


	    // 将tile的背景图片的background-position存放到数组tileBackPos里
	    // 相当于计算机中的缓存，在后续更新的时候提高运算速度
	    // 计算背景图片的偏移值（还记得Sprite图的位置么？）
	    tileBackPos.push('0% 0%'); // Tile zero - special 'hidden' tile.
	    for (top = 0; top < params.imageHeight; top += params.tileHeight) {
	        for (left = 0; left < params.imageWidth; left += params.tileWidth) {
	            tileBackPos.push((-left/(params.tileWidth - params.imageWidth)*100) + '% ' + (-top/(params.tileHeight - params.imageHeight)*100) + '%');
	        }
	    }

	    // 将map尺寸定义为公共变量，方便读取
	    that.mapWidthPixels = mapWidthPixels;
	    that.mapHeightPixels = mapHeightPixels;

	    // 当水平移动scrollX像素、垂直移动scrollY像素时,snapping!!!
	    that.draw = function (scrollX, scrollY) {
	        // If wrapping, transform start positions to valid positive
	        // positions within the dimensions of the map.
	        // This makes the wrapping code simpler later on.
	        // 以下约14行代码方便之后wrapping使用，这里可以不管
	        var wrapX = params.wrapX,
	            wrapY = params.wrapY;
	        if (wrapX) {
	            scrollX = (scrollX % mapWidthPixels);
	            if (scrollX < 0) {
	                scrollX += mapWidthPixels;
	            }
	        }
	        if (wrapY) {
	            scrollY = (scrollY % mapHeightPixels);
	            if (scrollY < 0) {
	                scrollY += mapHeightPixels;
	            }
	        }


	        // 计算偏移量余数，注意是负数
	        // 视窗往右滚的时候，（相当于）.handle往左移动
	        // （这时因为所有的tile整体移动，所以用.handle移动即可）
	        var xoff = -(scrollX % params.tileWidth),
	            yoff = -(scrollY % params.tileHeight);

	        // >> 0 == math.floor，浮点数转换成整数
	        // 注意此时是.handle移动，而不是某个tile元素
	        handle.style.left = (xoff >> 0)*ratio + 'rem';
	        handle.style.top = (yoff >> 0)*ratio + 'rem';

	        // 计算移动位置（tile为单位）
	        scrollX = (scrollX / params.tileWidth) >> 0;
	        scrollY = (scrollY / params.tileHeight) >> 0;


	        var map = params.map,
	            sx, sy = scrollY,               // Copies of scrollX & Y positions (tile units).
	            countAcross, countDown,         // Loop counts for tiles across and down viewport. 
	            mapWidth = params.mapWidth,     // Copy of map width (tile units). 
	            mapHeight = params.mapHeight,   // Copy of map height (tile units).
	            i,              // General counter.        
	            tileInView = 0, // Start with top left tile in viewport.
	            
	            tileIndex,      // Tile index number taken from map.（一维的）
	            mapRow;
	        // Main drawing loop.
	        for (countDown = tilesDown; countDown; countDown--) {
	            // Wrap vertically?
	            if (wrapY) {
	                if (sy >= mapHeight) {
	                    sy -= mapHeight;
	                }
	            } else
	            // Otherwise clip vertically (just make the whole row blank)
	            if (sy < 0 || sy >= mapHeight) {
	                for (i = tilesW; i; i--) {
	                    tiles[tileInView++].visibility = 'hidden';
	                }
	                sy++;
	                continue;
	            }
	            // Draw a row.
	            sx = scrollX;
	            mapRow = sy * mapWidth;
	            for (countAcross = tilesAcross; countAcross; countAcross--) {
	                // Wrap horizontally?
	                if (wrapX) {
	                    if (sx >= mapWidth) {
	                        sx -= mapWidth;
	                    }
	                } else
	                // Or clipping horizontally?
	                if (sx < 0 || sx >= mapWidth) {
	                    tiles[tileInView++].visibility = 'hidden';
	                    sx++;
	                    continue;
	                }
	                // 获取背景图片索引.
	                tileIndex = map[mapRow + sx];
	                sx++;
	                // 如果索引值不为零（表示有对应的图片块），则“绘制”该模块,
	                if (tileIndex) {
	                    tiles[tileInView].visibility = 'visible';
	                    // 背景图片偏移值
	                    tiles[tileInView++].backgroundPosition = tileBackPos[tileIndex];
	                }
	                // 否则就隐藏该板块
	                else {
	                    tiles[tileInView++].visibility = 'hidden';
	                }
	            }
	            sy++;
	        }
	    };
	    return that;
	};


	// 载入数据
	Parallax.prototype.loadMap = function(mapJSON,$viewports,callback) {

		var _self = this;
	    var tileScrollers = []; // Array of tileScroller instances for each viewport.
	    // Get references to image and map information.
	    var imageInfo = mapJSON.tilesets[0],
	        // $mapInfo = $(xml).find('map'),
	        i;

	        // console.log(mapJSON);
	    // For each layer, create a tileScroller object.
	    $.each(mapJSON.layers,function(key,layer) {
	        // Setup parameters to pass to tileScroller.
	        // The + operator before some values is to ensure
	        // they are treated as numerics instead of strings.
	        var params = {
	            tileWidth: +imageInfo.tilewidth,// 块的尺寸，px
	            tileHeight:+imageInfo.tileheight,
	            wrapX:true,
	            wrapY:true,
	            mapWidth:+mapJSON.width, // 以块为单位
	            mapHeight:+mapJSON.height,
	            image:imageInfo.image,
	            imageWidth: +imageInfo.imagewidth,// 实际sprite图片尺寸,px
	            imageHeight: +imageInfo.imageheight
	        },  
	            // Get the actual map data as an array of strings.
	            mapText = layer.data,
	            // Create a viewport.
	            $viewport = $('<div>');
	            $viewport.attr({
	                'id':layer.name
	            }).css({
	                'width':'100%',
	                'height':'100%',
	                'position':'absolute',
	                'overflow':'hidden'
	            });
	        // Attach viewport to viewports wrapper.
	        $viewports.append($viewport);
	        // Store viewport in parameters.
	        params.$viewport = $viewport;
	        // Create a map array and store in parameters.
	        params.map = [];
	        // 获取Tile Map
	        for(i=0;i<mapText.length;i++) {
	            params.map.push(+mapText[i]);
	        }
	        // Create a tileScroller and save reference.
	        tileScrollers.push( _self.tileScroller(params) );	
	    });
	    // Call callback when map loaded, passing array
	    // of tileScrollers as parameter.
	    callback(tileScrollers);
	};


	Parallax.prototype.init = function(){
		var _self = this;
		if(!_self.mapJSON){
			console.log("没有地图数据！");
			return;
		}else{

			_self.loadMap(_self.mapJSON, _self.$el, function (tileScrollers) {

			    var ts1 = tileScrollers[0],  // Get the three tileScrollers.
			        ts2 = tileScrollers[1],
			        ts3 = tileScrollers[2],
			        scrollX = 0,             // Current scroll position.
			        scrollY = 0,
			        xSpeed = 0,              // Current scroll speed.                             
			        ySpeed = 0,
			        // Width and height of viewports.
			        viewWidth = _self.$el.width(),
			        viewHeight = _self.$el.height();

			    // 当鼠标在画布中移动的时候
			    // 计算鼠标速度
			    
			    _self.$el.on("click",function (ev) {

			        xSpeed = ev.clientX - (viewWidth / 2);
			        xSpeed /= (viewWidth / 2);
			        xSpeed *= 10;
			        ySpeed = ev.clientY - (viewHeight / 2);
			        ySpeed /= (viewHeight / 2);
			        ySpeed *= 10;

			        // console.log("88",xSpeed,ySpeed);
			    });

			    // 添加传感器
			    var Sensor = require('./sensor');

			    var sensor = new Sensor();

			    sensor.start(function(e){
			    	$("#sensor").html(e.absolute+ "<br/>"+ e.alpha.toFixed(2)+"<br/>"+e.beta.toFixed(2)+"<br/>"+e.gamma.toFixed(2));
			    	xSpeed = e.gamma / 5;
			    	ySpeed = e.beta / 5;
			    });

			   
			    // Every 30 milliseconds, update the scroll positions
			    // for the three tileScrollers. 
			    setInterval(function () {
			        // Each tileScroller is given a different scroll positions
			        // for a parralax effect.
			        ts1.draw(scrollX / 3, scrollY / 3);
			        ts2.draw(scrollX / 2, scrollY / 2);
			        ts3.draw(scrollX, scrollY);
			        // Update scroll position.
			        scrollX += xSpeed;
			        scrollY += ySpeed;
			        // Stop scrolling at edges of map.
			        // This code can be removed to test the wrapping.
			        // if (scrollX < 0) {
			        //     scrollX = 0;
			        // }
			        // if (scrollX > ts3.mapWidthPixels - viewWidth) {
			        //     scrollX = ts3.mapWidthPixels - viewWidth;
			        // }
			        // if (scrollY < 0) {
			        //     scrollY = 0;
			        // }
			        // if (scrollY > ts3.mapHeightPixels - viewHeight) {
			        //     scrollY = ts3.mapHeightPixels - viewHeight;
			        // }
			    }, 30);
			});

		}
	}


	// 当窗口大小改变时候，更新画布
	Parallax.prototype.update = function(){
		var _self = this;
		_self.$el = $(_self.el);
		_self.$el.html("");//先清空
		_self.init();
	}

	return Parallax;


});