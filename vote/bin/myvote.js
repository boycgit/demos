#! /usr/bin/env node
var fs = require('fs')
  , path = require('path');


var argv = require( 'argv' );

argv.version( 'v1.0.0' );

// 旧的字符串
argv.option({
    name: 'num',
    short: 'n',
    type: 'int',
    description: '输入你想投票的数量',
    example: "'myvote --num=5' or 'myvote -n 5'"
});


// 设置间隔时间
argv.option({
    name: 'time',
    short: 't',
    type: 'int',
    description: '输入间隔时间，默认是200ms',
    example: "'myvote --time=500' or 'myvote -t 500'"
});



var args = argv.run();

var num = args.targets[0] || args.options.num; // 获取数量
var time = args.targets[1] || args.options.time || 200; // 获取数量

// console.log(num,time);

if(!num){
	console.log('Err:没有传入数量');
	return;
}



var request = require('request');;

var options = {
    url:'http://vote.umsg.net/Index/add_vote',
    form:{'select_value':{'1763':'104 潘帆帆'},'url_data':{'p':{'mdn':'15257701170'},'token':{'id':'227'}}}
};

var tmp = 0;

console.log('正在投票,每隔'+time+'毫秒投票一次')

for(var i=0;i<num;i++){

	// 延迟设置时间
	setTimeout(function(){
		request.post(options,function(err,res,body){
			if (err) {
			    return console.error('出错了,请找管理员解决：', err);
			  }
			tmp++;
			process.stdout.write(".");
			if(tmp === num){
				console.log("\r\n投票完成!");
			}
		    // if(res.statusCode == 200){
		    //     console.log("可以访问该网站");
		    // }
		    // else{
		    //     console.log("不能访问网站")
		    // }
		});
	},200);

}




