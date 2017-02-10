(function ($) {

    var keys = [];
    var vals = [];
    var attrs = ['src', 'href', 'title', 'class', 'style', 'disabled'];

    $(function () {
        $('[data-instance]').each(function (i, v) {
            var name = $(v).attr('data-instance')
            var obj = new window[name];
            $(v).glue(obj);
        });
    });

    $.fn.findBack = function (selector) {
        return $(this).find(selector).addBack(selector);
    };

    $.fn.glue = function (obj) {

        keys.push($(this)[0]);
        vals.push(obj);

        function map(key) {
            for (var i = 0; i < keys.length; i++) {
                if (keys[i] == key) {
                    return vals[i];
                }
            }
            return null;
        }

        var a = $(this).each(function () {

            $(this).each(function () {
                $.each(this.attributes, function () {
                    if (this.specified && this.name.indexOf('data-ref') == 0) {
                        var name = this.name.replace('data-ref', '');
                        name = name.length > 0 ? name.substr(1) : '';
                        var value = this.value;
                        defineProperty(obj, (name || value), {
                            get: function () {
                                return map($('#' + value)[0]);
                            }
                        });
                    }
                });
            });

            $(this).find('[data-child][data-child!=""]').not($(this).find('[data-child] [data-child]')).each(function (i, el) {

                (function bindChild(obj) {
                    var split = $(el).attr('data-child').split('.');
                    var key = split[0];
                    var index = split[1];
                    if (index == null) {
                        defineProperty(obj, key, {
                            get: function () {
                                return map(el);
                            }
                        });
                    } else {
                        obj[key] = (obj[key] || []);
                        defineProperty(obj[key], index, {
                            get: function () {
                                return map(el);
                            }
                        });
                    }
                })(obj);

            });

            $(this).findBack('[data-el]').not($(this).find('[data-child] [data-el]')).each(function (i, el) {

                (function bindElement(obj) {
                    var split = $(el).attr('data-el').split('.');
                    var key = split[0];
                    var index = split[1];
                    if (index == null) {
                        obj[key] = $(el);
                    } else {
                        obj[key] = (obj[key] || []);
                        obj[key][index] = $(el);
                    }
                })(obj);

            });

            $(this).findBack('[data-action]').not($(this).find('[data-child] [data-action]')).each(function (i, el) {

                (function bindAction(obj) {
                    var act = $(el).attr('data-action').split('.');
                    act = act[act.length - 1];

                    if (typeof obj[act] === 'function') {
                        addEvent(el, 'click', obj[act]);
                    }
                })(obj);

            });

            $(this).findBack('[data-show],[data-hide]').not($(this).find('[data-child] [data-show],[data-child] [data-hide]')).each(function (i, el) {

                (function bindVisibility(obj) {

                    var prop = ($(el).attr('data-show') || $(el).attr('data-hide')).split('.');
                    obj = getObject(obj, prop);
                    prop = prop[prop.length - 1];

                    if (obj != undefined) {

                        defineProperty(obj, prop, {
                            set: function (val) {
                                if ((val == false && $(el).is('[data-show]')) || (val == true && $(el).is('[data-hide]'))) {
                                    $(el).hide();
                                } else {
                                    $(el).show();
                                }
                            }
                        });
                    }

                })(obj);

            });

            $(this).findBack('[data-prop]').not($(this).find('[data-child] [data-prop]')).each(function (i, el) {
                bindObject(el, obj, 'data-prop', getValue, setValue);
            });

            for (var x = 0; x < attrs.length; x++) {
                var name = attrs[x];
                var exp = 'data-' + name;
                $(this).findBack('[' + exp + ']').not($(this).find('[data-child] [' + exp + ']')).each(function (i, el) {
                    bindAttr(el, obj, exp, name);
                });
            }

        });

        obj.view = $(this);
        obj.resolve = function (classType) {
			var a = [];
            for (var i = 0; i < vals.length; i++) {
                if (vals[i] instanceof classType)
                    a.push(vals[i]);
            }
            return a;
        };
        if (obj.__init != undefined) {
            $(obj.__init);
        }

        return a;
    };

    function bindAttr(el, obj, exp, name) {
        var root = obj;
        var fullProp = $(el).attr(exp);

        bindObject(el, obj, exp, function (el) { getAttr(el, name); }, function (el, val) { setAttr(el, name, val); });
        if (el.tagName == 'IMG') {
            addEvent(el, 'load', load);
        }

        function load() {
            $(function () {
                if (root.onLoad != null) {
                    root.onLoad(fullProp, getAttr(el, name));
                }
            });
        }
    }

    function bindObject(el, obj, exp, getter, settter) {
        var root = obj;
        var fullProp = $(el).attr(exp);
        var lastValue = null;

        var prop = fullProp.split('.');
        obj = getObject(obj, prop);
        prop = prop[prop.length - 1];

        if (obj != undefined) {

            var v = obj[prop];
            v = v != undefined ? v : getter(el);
            settter(el, v);
            lastValue = v;

            addEvent(el, 'change', change);
            addEvent(el, 'keypress', change);
            addEvent(el, 'keyup', change);

            defineProperty(obj, prop, {
                get: function () {
                    return isRadio(el) ? getter(el) : v;
                }, set: function (val) {
                    v = val;
                    settter(el, val);
                }
            });
        }

        function change() {
            obj[prop] = getter(el);
            if (root.onChange != null && (getter(el) != lastValue || isRadio(el))) {
                root.onChange(fullProp, getter(el), lastValue && !isRadio(el));
                lastValue = getter(el);
            }
        }
    }

    function getObject(obj, prop) {
        for (var i = 0; i < prop.length - 1; i++) {
            obj = (obj || {})[prop[i]];
        }
        return obj;
    }

    function defineProperty(obj, prop, descriptor) {
        var _value = null;

        if (obj['_setters'] == undefined) {
            obj['_setters'] = {};
        }

        var _old_setter = obj['_setters'][prop];
        var _set = function (val) {
            if (_old_setter != null) {
                _old_setter(val);
            }
            if (descriptor.set != null) {
                descriptor.set(val);
            }
            _value = val;
        };

        var _get = descriptor.get || function () {
            return _value;
        };

        Object.defineProperty(obj, prop, { get: _get, set: _set });
        obj['_setters'][prop] = _set;
    }

    function addEvent(el, eventName, eventHandler) {
        $(el).on(eventName, eventHandler);
    }

    function getValue(el) {
        if (isCheckbox(el) || isRadio(el)) {
            return el.checked;
        } else if (el.value != undefined && el.tagName != 'LI') {
            return el.value;
        } else {
            return el.innerHTML;
        }
    }

    function setValue(el, val) {
        if (isCheckbox(el) || isRadio(el)) {
            el.checked = val;
        } else if (el.value != undefined && el.tagName != 'LI') {
            if (el.value != val) {
                el.value = val;
            }
        } else {
            el.innerHTML = val;
        }
    }

    function getAttr(el, name) {
        return el.getAttribute(name);
    }

    function setAttr(el, name, val) {
        el.setAttribute(name, val);
    }

    function isRadio(el) {
        return el.tagName == 'INPUT' && el.type == 'radio';
    }

    function isCheckbox(el) {
        return el.tagName == 'INPUT' && el.type == 'checkbox';
    }

    // ES 15.2.3.6 Object.defineProperty ( O, P, Attributes )
    // Partial support for most common case - getters, setters, and values
    (function () {
        if (!Object.defineProperty ||
            !(function () { try { Object.defineProperty({}, 'x', {}); return true; } catch (e) { return false; } }())) {
            var orig = Object.defineProperty;
            Object.defineProperty = function (o, prop, desc) {
                // In IE8 try built-in implementation for defining properties on DOM prototypes.
                if (orig) { try { return orig(o, prop, desc); } catch (e) { } }

                if (o !== Object(o)) { throw TypeError("Object.defineProperty called on non-object"); }
                if (Object.prototype.__defineGetter__ && ('get' in desc)) {
                    Object.prototype.__defineGetter__.call(o, prop, desc.get);
                }
                if (Object.prototype.__defineSetter__ && ('set' in desc)) {
                    Object.prototype.__defineSetter__.call(o, prop, desc.set);
                }
                if ('value' in desc) {
                    o[prop] = desc.value;
                }
                return o;
            };
        }
    }());

}(jQuery));