# jquery.glue
A simple HTML/JavaScript binding plugin to improve code organization in web applications.

Decorate your markup with `data-` attributes to bind DOM elements to JavaScript object's properties:

```HTML
<div class="form" data-instance="AccountForm">
    <label>First name:</label>
    <input type="text" data-prop="firstName" />

    <label>Last Name:</label>
    <input type="text" data-prop="lastName" />

    <button data-action="submit">submit</button>
</div>
```

And define behavior through user-defined object types:

```JavaScript
(function (wnd) {

    wnd.AccountForm = function () {

        var self = this;
        this.firstName = null;
        this.lastName = null;

        this.submit = function () {
            $.post('account/save', {
                firstName: self.firstName,
                lastName: self.lastName
            }).done(function () {
                alert('Success!');
            });
        };

    };

})(window);
```

For more sample code browse the [examples](https://github.com/TCGV/jquery.glue/tree/master/examples) folder.
  
## Quick Reference
  
### Methods

`this.__init = function () { }`  
Gets called after binding has been performed.  
  
`this.onChange = function (prop, newValue, oldValue) { }`  
Gets called whenever a bound property value is modified.  
  
### Attributes

`data-instance="<class_name>"`  
Binds the specified class to the HTML view.  
  
`data-child="<property_name>"`  
Marks the start of a new object's view, to prevent duplicate binding in nested views. When `<property_name>` is specified a parent's object property of same name is initialized with a reference to the child's view object.  
  
`data-ref-<property_name>="<view_id>"`  
When `<property_name>` is specified an object property of same name is initialized with a reference to the object whose view ID attribute matches `<view_id>`, otherwise the property name defaults to the view ID.  
  
`data-prop="<property_name>"`  
Two way binding between HTML element's value and an object property of same name.  
  
`data-el="<element_name>"`  
Initializes an object property of same name with a reference to the corresponding jQuery object.  
  
`data-action="<function_name>"`  
Binds the `onclick` event to the object function with the specified name.  
  
`data-show="<property_name>"`  
Element visibility will be controlled by the boolean object property with the specified name.  
  
`data-hide="<property_name>"`  
Element visibility will be controlled by the boolean object property with the specified name.  
  
`data-<attribute_name>="<property_name>"`  
One way value binding between attribute and object property with specified names. Supported attribute names are: `['src', 'href', 'title', 'class', 'style', 'disabled']`.  
  
`data-template="classType"`  
Marks an HTML view as a template for the specified class type.  
  
### Extensions

`self.view`  
Holds a reference to the jQuery object to which the object was bound.  
  
`self.resolve(classType)`  
Gets an array of references to all objects of the specified class type whose views are still attached to the DOM.  
  
`self.template(classType)`  
Generates a jQuery object by cloning the view whose `data-template` attribute value matches the `classType` argument.  
  
## Remarks

- jQuery version 1.12.4 or higher required
- Experimental plugin with support for modern browsers (Chrome/FireFox/Edge)

##Licensing

This code is released under the MIT License:

Copyright (c) TCGV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
