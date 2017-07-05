(function ($) {

    var keys = [];
    var vals = [];
    var templates = [];
    var attrs = ['src', 'href', 'title', 'class', 'style', 'disabled'];

    var ALT_KEY_CODE = 18;
    var jQueryReady = false;
    var glueReady = false;
    var glueReadyListeners = [];

    addCss('[data-template] { display: none !important; }');
    visibilityStyle = addCss('[data-show],[data-hide] { display: none !important; }');

    $(function () {
        jQueryReady = true;
        $('[data-template]').each(parseTemplates);
        $('[data-instance]').each(parseInstances);
        glueReadyEv();
        visibilityStyle.parentNode.removeChild(visibilityStyle);
    });

    $.fn.findBack = function (selector) {
        return $(this).find(selector).addBack(selector);
    };

    $.each(['append', 'prepend', 'after', 'before', 'html', 'replaceWith'], function (i, v) {
        var old = $.fn[v];
        $.fn[v] = function (content) {

            var wasReady = glueReady;
            glueReady = false;

            var p = $(this).parent();
            var r = old.apply(this, arguments);
            var el = (v == 'after' || v == 'before' || v == 'replaceWith' ? p : $(this));
            el.find('[data-template]').each(parseTemplates);
            el.find('[data-instance]').each(parseInstances);

            if (wasReady) {
                glueReadyEv();
            }

            return r;
        };
    });

    $.fn.glue = function (obj) {

        keys.push($(this)[0]);
        vals.push(obj);

        $(this).each(function () {

            var childs = $(this).find('[data-child],[data-instance],[data-template]');

            function notChild(i, el) {
                for (var i = 0; i < childs.length; i++) {
                    var c = childs[i];
                    var v = c.getAttribute('data-child');
                    if ((v == null && c == el) || $.contains(c, el))
                        return false;
                }
                return true;
            }

            $(this).each(function () {
                $.each(this.attributes, function () {
                    bindReferences.call(this, obj);
                });
            });

            $(this).find('[data-child][data-child!=""]').filter(notChild).each(function (i, el) {
                bindChild(obj, i, el);
            });

            $(this).findBack('[data-el]').filter(notChild).each(function (i, el) {
                bindElement(obj, i, el);
            });

            $(this).findBack('[data-action]').filter(notChild).each(function (i, el) {
                bindAction(obj, i, el);
            });

            $(this).findBack('[data-show],[data-hide]').filter(notChild).each(function (i, el) {
                bindVisibility(obj, i, el);
            });

            $(this).findBack('[data-prop]').filter(notChild).each(function (i, el) {
                bindObject(el, obj, 'data-prop', getValue, setValue);
            });

            for (var x = 0; x < attrs.length; x++) {
                var name = attrs[x];
                var exp = 'data-' + name;
                $(this).findBack('[' + exp + ']').filter(notChild).each(function (i, el) {
                    bindAttr(el, obj, exp, name);
                });
            }

        });

        extend.call(this, obj);

        return $(this);
    };

    function extend(obj) {
        if (obj.view == undefined) {
            obj.view = $(this);
        } else {
            obj.view = obj.view.add(this);
        }

        obj.template = function (classType, index) {
            for (var p in templates) {
                if (templates.hasOwnProperty(p) && getClassType(p) == classType) {
                    var el = obj.view.find('[data-template="' + p + '"]').eq(index || 0);
                    return el.clone().removeAttr('data-template').insertBefore(el);
                }
            }
            return null;
        };

        obj.resolve = function (classType) {
            var a = [];
            for (var i = 0; i < vals.length; i++) {
                if (vals[i] instanceof classType) {
                    if (jQuery.contains(document, vals[i].view.get(0))) {
                        a.push(vals[i]);
                    }
                }
            }
            return a;
        };

        if (obj.__init != undefined) {
            if (glueReady) {
                obj.__init();
            } else if (jQueryReady) {
                glueReadyEv(obj.__init);
            } else {
                $(obj.__init);
            }
        }
    }

    function glueReadyEv(listener) {
        if (listener) {
            glueReadyListeners.push(listener);
        } else {
            glueReady = true;
            var listeners = glueReadyListeners;
            glueReadyListeners = [];
            while (listeners.length > 0) {
                listeners[0]();
                listeners.splice(0, 1);
            }
        }
    }

    function parseTemplates(i, v) {
        var name = $(v).attr('data-template');
        templates[name] = $(v);
    }

    function parseInstances(i, v) {
        var data_instance_parsed = 'data_instance_parsed';
        if ($(v).data(data_instance_parsed) == null) {
            var fullName = $(v).attr('data-instance');
            var func = getClassType(fullName);
            $(v).glue(new func);
            $(v).data(data_instance_parsed, true);
        }
    }

    function bindReferences(obj) {
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
    }

    function bindChild(obj, i, el) {
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
    }

    function bindElement(obj, i, el) {
        var split = $(el).attr('data-el').split('.');
        var key = split[0];
        var index = split[1];
        if (index == null) {
            obj[key] = $(el);
        } else {
            obj[key] = (obj[key] || []);
            obj[key][index] = $(el);
        }
    }

    function bindAction(obj, i, el) {
        var act = $(el).attr('data-action').split('.');
        act = act[act.length - 1];

        if (typeof obj[act] === 'function') {
            addEvent(el, 'click', obj[act]);
        }
    }

    function bindVisibility(obj, i, el) {

        $(el).hide();
        var prop = ($(el).attr('data-show') || $(el).attr('data-hide')).split('.');
        obj = getObject(obj, prop);
        prop = prop[prop.length - 1];

        if (obj != undefined) {

            var v = obj[prop];
            defineProperty(obj, prop, {
                get: function () { return v; },
                set: function (val) {
                    v = val;
                    if ((val == false && $(el).is('[data-show]')) || (val == true && $(el).is('[data-hide]'))) {
                        $(el).css('display', 'none');
                    } else {
                        $(el).css('display', '');
                    }
                }
            });
            obj[prop] = v;
        }

    }

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
        var v = null;
        var lastValue = null;

        var prop = fullProp.split('.');
        obj = getObject(obj, prop);
        prop = prop[prop.length - 1];

        if (obj != undefined) {

            v = obj[prop];
            v = v != undefined ? v : getter(el);
            settter(el, v);
            lastValue = v;

            addEvent(el, 'change', change);
            addEvent(el, 'keypress', change);
            addEvent(el, 'keyup', keyup);

            defineProperty(obj, prop, {
                get: function () {
                    return isRadio(el) ? getter(el) : v;
                }, set: function (val) {
                    v = val;
                    settter(el, val);
                    if (root.onChange != null && (v != lastValue || isRadio(el))) {
                        var _v = lastValue;
                        lastValue = v;
                        root.onChange(fullProp, v, isRadio(el) ? false : _v);
                    }
                }
            });
        }

        function keyup(e) {
            if (e.which == ALT_KEY_CODE)
                setTimeout(change, 1);
            else
                change();
        }

        function change() {
            v = getter(el);
            if ((v != lastValue || isRadio(el))) {
                obj[prop] = v;
            }
        }
    }

    function map(key) {
        for (var i = 0; i < keys.length; i++) {
            if (keys[i] == key) {
                return vals[i];
            }
        }
        return null;
    }

    function getClassType(fullName) {
        var names = fullName.split('.');
        var func = window[names[0]];
        for (var i = 1; i < names.length; i++)
            func = func[names[i]];
        return func;
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

        Object.defineProperty(obj, prop, { get: _get, set: _set, configurable: true });
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
        } else if (el.innerHTML != val) {
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

    function addCss(cssCode) {
        var styleElement = document.createElement("style");
        styleElement.type = "text/css";
        if (styleElement.styleSheet) {
            styleElement.styleSheet.cssText = cssCode;
        } else {
            styleElement.appendChild(document.createTextNode(cssCode));
        }
        document.getElementsByTagName("head")[0].appendChild(styleElement);
        return styleElement;
    }

}(jQuery));