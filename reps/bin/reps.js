#! /usr/bin/env node

var fs = require('fs')
  , dir = require('node-dir')
  , mkdirp = require('mkdirp')
  , path = require('path');


var argv = require( 'argv' );

argv.version( 'v0.0.1' );

// 旧的字符串
argv.option({
    name: 'old',
    short: 'o',
    type: 'string',
    description: 'Defines the string or regex express wanted to be replaced',
    example: "'reps --old=a.com' or 'reps -o a.com'"
});

// 新的字符串
argv.option({
    name: 'new',
    short: 'n',
    type: 'string',
    description: 'Defines the replaced string',
    example: "'reps --new=b.net' or 'reps -o b.net'"
});

// 定义是否按正则表示式方式
argv.option({
    name: 'reg',
    short: 'r',
    type: 'boolean',
    description: 'using the regex express if true,default false',
    example: "'reps --reg' or 'reps -r'"
});


var args = argv.run();


var srcDir = args.targets[0]; // 获取源目录

if(!srcDir){
	console.log('Err:请至少传入一个参数当做源目录');
	return;
}

var destDir = args.targets[1] || path.join(srcDir); // 如果目标目录不传入，就默认就地替换


var newStr = args.options["new"] || "";

var isReg = args.options['reg'] || false; // 默认是按字符串匹配

var escapeRegExp = function(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}


var oldStr = args.options["old"] || "";

if(!isReg){
	oldStrReg = new RegExp(escapeRegExp(oldStr), 'g'); // 不是正则就转换成正则表达式
}else{
	oldStrReg = new RegExp(oldStr,'g');
}



console.log(args);

// var srcDir = 'tests/ori',destDir = 'tests/test';

dir.files(path.join(__dirname,srcDir),function(err,files){
    if (err) throw err;


    console.log("正在创建文件夹....");

    mkdirp.sync(path.join(__dirname,destDir));//先创建目录
    // 处理文件
    for(var i = 0;i<files.length;i++){

		var relPath = path.relative(path.join(__dirname,srcDir),path.dirname(files[i]));

		var destSubDir = path.join(__dirname,destDir,relPath);  
	
		console.log(__dirname,destDir,relPath,destSubDir);

		// 先同步创建文件夹 	
		
		mkdirp.sync(destSubDir);
		// process.stdout.write(".");
    }
	console.log("创建完成！");


	console.log("开始替换文件内容....");
    // 再异步化copy 替换文件
    for(var i = 0;i<files.length;i++){

     	(function(index){
	    	setTimeout(function(){


				var relPath = path.relative(path.join(__dirname,srcDir),path.dirname(files[index]));

				var destSubDir = path.join(__dirname,destDir,relPath);  

				var destFile = path.join(destSubDir,path.basename(files[index]));

				var str = fs.readFileSync(files[index],'binary');
				str = str.replace(oldStrReg, newStr);
				fs.writeFileSync(destFile,str,'binary');
				// fs.createReadStream(files[index],{encoding: 'utf8'})
				//   .pipe(replaceStream('http://static.alibado.com', '//g.alicdn.com/tb/zhaopin/2.0.4/oldassets'))
				//   .pipe(fs.createWriteStream(destFile,{flags:'w+',encoding: 'utf8'}));

	    		// console.log(destFile);process.stdout.write
	    		var perc = (index / (files.length-1) * 100.0).toFixed(2);
	    		
	    		process.stdout.write( perc+"%\033[0G");
				// process.stdout.write(".");
	    		if(index == files.length-1) console.log("\r\n替换完成！");
	    	},0);// 异步化
    		
    	})(i);   	
    }
      
});