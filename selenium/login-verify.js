var webdriver = require('selenium-webdriver'),
    By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until;
var should = require('should');
var test = require('selenium-webdriver/testing');



test.describe('检测登录', function() {

    var driver;
    var usrname = 'rutao1';
    var pwd = "taobao1234";

  test.before(function() {
  	this.timeout(0);	// 这个不能少，否则会报'timeout of 2000ms exceeded'错误
	driver = new webdriver.Builder()
	    .forBrowser('chrome')
	    .build();
  });

  test.it('登录后正确设置用户名', function() {

	  	this.timeout(0);

		var baseUrl = "http://daxue.taobao.com";


		driver.get(baseUrl);


		driver.findElement(By.linkText("请登录")).click();

		// 非常重要：需要定位到iframe框里
		driver.switchTo().frame("ifmTbLgoin");

		// 填写用户名和密码
		driver.findElement(By.id("TPL_username_1")).clear();
		driver.findElement(By.id("TPL_username_1")).sendKeys(usrname);
		driver.findElement(By.id("TPL_password_1")).clear();
		driver.findElement(By.id("TPL_password_1")).sendKeys(pwd);

		// 点击提交按钮
		driver.findElement(By.id("J_SubmitStatic")).click();


		// 重要，要切换主窗口！否则报错
		driver.switchTo().defaultContent();

		// 要等到退出按钮出现才行
		// 因为这个退出按钮是通过JS实现的
		driver.wait(until.elementLocated(By.id("topbarLog")), 3000).then(function(){
			console.log("-------------------");

			// 验证用户名
			driver.findElement(By.css("#topbarName > a")).getText().then(function(name){
				name.should.be.equal(usrname);
			});

			// 点击退出按钮
			driver.findElement(By.id("topbarLog")).click();
		});
  });

  test.after(function() {
  	this.timeout(0);
    driver.quit();
  });

});

