

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

    $(function () {
        assert.ok(initialized);
    });

});


QUnit.test("this.onChange test", function (assert) {

    window.NameList = function () {

        var self = this;
        this.name = null;
        this.names = '';
        this.oldNames = '';

        this.onChange = function (prop, newVal, oldVal) {
            if (prop == 'name') {
                self.names += newVal + '; ';
				self.oldNames += oldVal + '; ';
            }
        };
    };

    var html = appendToBody(
		'<div data-instance="NameList">' +
		'<input data-prop="name" type="text"/>' +
		'<span data-prop="names"></span>' +
		'<span data-prop="oldNames"></span>' +
		'</div>');

    $(function () {
        html.find('input')
			.val('Bill').change()
			.val('John').change()
			.val('Victor').change();
        assert.ok('Bill; John; Victor; ' == html.find('[data-prop="names"]').text());
        assert.ok('; Bill; John; ' == html.find('[data-prop="oldNames"]').text());
    });

});


QUnit.test("[data-prop] span test", function (assert) {

    var html = appendToBody('<div><span data-prop="name">Thomas</span></div>');

    var obj = new (function () { })();

    html.glue(obj);

    $(function () {
        assert.ok('Thomas' == html.find('span').text());
        obj.name = '';
        assert.ok('' == html.find('span').text());
    });

});


QUnit.test("[data-prop] input test", function (assert) {

    var html = appendToBody('<div><input data-prop="name" type="text" /></div>');

    var obj = new (function () {
        this.name = 'Insert your name...';
    })();

    html.glue(obj);

    $(function () {
        assert.ok('Insert your name...' == obj.name);
        html.find('input').val('Thomas').change();
        assert.ok('Thomas' == obj.name);
        obj.name = '';
        assert.ok('' == html.find('input').val());
    });

});


QUnit.test("[data-prop] radio test", function (assert) {

    var html = appendToBody(
		'<div>' +
		'<input data-prop="r.0" name="r" type="radio" />' +
		'<input data-prop="r.1" name="r" type="radio" />' +
		'<input data-prop="r.2" name="r" type="radio" />' +
		'</div>');

    var obj = new (function () {
        this.r = [false, true, false];
    })();

    html.glue(obj);

    $(function () {
        var r = obj.r;
        assert.ok(!r[0] && !html.find('input:eq(0)').is(':checked'));
        assert.ok(r[1] && html.find('input:eq(1)').is(':checked'));
        assert.ok(!r[2] && !html.find('input:eq(2)').is(':checked'));
        html.find('input:eq(0)').prop('checked', true).change();
        assert.ok(r[0] && html.find('input:eq(0)').is(':checked'));
        assert.ok(!r[1] && !html.find('input:eq(1)').is(':checked'));
        assert.ok(!r[2] && !html.find('input:eq(2)').is(':checked'));
        r[2] = true;
        assert.ok(!r[0] && !html.find('input:eq(0)').is(':checked'));
        assert.ok(!r[1] && !html.find('input:eq(1)').is(':checked'));
        assert.ok(r[2] && html.find('input:eq(2)').is(':checked'));
    });

});


QUnit.test("[data-prop] checkbox test", function (assert) {

    var html = appendToBody('<div><input data-prop="enable" type="checkbox" /></div>');

    var obj = new (function () {
        this.enable = null;
    })();

    html.glue(obj);

    $(function () {
        assert.ok(!obj.enable && !html.find('input:eq(0)').is(':checked'));
        html.find('input:eq(0)').prop('checked', true).change();
        assert.ok(obj.enable && html.find('input:eq(0)').is(':checked'));
        obj.enable = false;
        assert.ok(!obj.enable && !html.find('input:eq(0)').is(':checked'));
    });

});


QUnit.test("[data-prop] select test", function (assert) {

    var html = appendToBody(
		'<div><select data-prop=letter>' +
		'<option value="A">A</option>' +
		'<option value="B">B</option>' +
		'<option value="C">C</option>' +
		'</select></div>');

    var obj = new (function () {
        this.letter = 'A';
    })();

    html.glue(obj);

    $(function () {
        assert.ok(obj.letter == 'A' && html.find('select').val() == 'A');
        html.find('select').val('B').change();
        assert.ok(obj.letter == 'B' && html.find('select').val() == 'B');
        obj.letter = 'C';
        assert.ok(obj.letter == 'C' && html.find('select').val() == 'C');
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

    $(function () {
        assert.ok(3 == obj.getCount());
    });

});


QUnit.test("[data-template] test", function (assert) {

    var html = appendToBody('<div><span data-template="Child" data-prop="name"></span></div>');

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

    $(function () {
        obj.addChild('One');
        obj.addChild('Two');
        obj.addChild('Three');

        var sel = 'span:not([data-template])';
        assert.ok(typeof obj.name == 'undefined');
        assert.ok(3 == html.find(sel).length);
        assert.ok('One' == html.find(sel + ':eq(0)').text());
        assert.ok('Two' == html.find(sel + ':eq(1)').text());
        assert.ok('Three' == html.find(sel + ':eq(2)').text());
    });

});


function appendToBody(html) {
    return $(html).appendTo($('body')).hide();
}