
QUnit.test("[data-instance] test", function (assert) {

	var initialized = false;
	
    window.MyClass = function () {

        var count = 0;

        this.__init = function () {
            initialized = true;
        };

        this.getCount = function () {
            return count;
        };
    };

    var html = appendToBody('<div data-instance="MyClass"></div>');

	$(function(){
		assert.ok(initialized);
	});

});


QUnit.test("[data-prop] input test", function (assert) {
	
    var html = appendToBody('<div><input data-prop="name" type="text" /></div>');
	
	var obj = new (function () {
		this.name = 'Insert your name...';
    })();

    html.glue(obj);

	$(function(){
		assert.ok('Insert your name...' == obj.name);
		html.find('input').val('Thomas').change();
		assert.ok('Thomas' == obj.name);
		obj.name = '';
		assert.ok('' == html.find('input').val());
	});

});


QUnit.test("[data-prop] span test", function (assert) {
	
    var html = appendToBody('<div><span data-prop="name">Thomas</span></div>');
	
	var obj = new (function () {})();

    html.glue(obj);

	$(function(){
		assert.ok('Thomas' == html.find('span').text());
		obj.name = '';
		assert.ok('' == html.find('span').text());
	});

});


QUnit.test("[data-action] test", function (assert) {

    var html = appendToBody('<div><button data-action="increment"></button></div>');

    var obj = new (function () {

        var count = 0;

        this.increment = function () {
            count++;
        };

        this.getCount = function () {
            return count;
        };
    })();

    html.glue(obj);

    html.find('button')
		.click()
		.click()
		.click();

	$(function(){
		assert.ok(3 == obj.getCount());
	});

});


QUnit.test("[data-template] test", function (assert) {
	
    var html = appendToBody('<div><span data-template="Child" data-prop="name" data-child></span></div>');
	
    window.Child = function (name) {
        this.name = name;
    };
	
	var obj = new (function () {
		var self = this;
		this.addChild = function (name) {
			self.template(Child)
				.glue(new Child(name));
		};
	})();

    html.glue(obj);

	$(function(){
		obj.addChild('One');
		obj.addChild('Two');
		obj.addChild('Three');
		
		var sel = '[data-child]:not([data-template])';
		assert.ok(3 == html.find(sel).length);
		assert.ok('One' == html.find(sel + ':eq(0)').text());
		assert.ok('Two' == html.find(sel + ':eq(1)').text());
		assert.ok('Three' == html.find(sel + ':eq(2)').text());
	});

});


function appendToBody(html) {
    return $(html).appendTo($('body')).hide();
}