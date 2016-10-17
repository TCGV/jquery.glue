# jquery.glue
A simple HTML/JavaScript binding plugin to improve code organization in web applications.

Decorate your markup with `data-` attributes to bind DOM elements to JavaScript object's properties:

```HTML
<div class="form">
    <label>First name:</label>
    <input type="text" data-prop="firstName" />

    <label>Last Name:</label>
    <input type="text" data-prop="lastName" />

    <h3 data-show="hasName">Hello <span data-prop="fullName"></span>!</h3>
</div>

<script>
    // set-up binding
    $('.form').glue(new Form());
</script>
```

And define behavior through user-defined object types:

```JavaScript
(function (wnd) {

    wnd.Form = function () {

        var self = this;
        this.firstName = '';
        this.lastName = '';
        this.fullName = '';

        // initialize variables after binding has been performed
        this.__init = function () {
            self.hasName = false;
        };

        // listen to changes in bound properties values
        this.onChange = function (prop, newValue, oldValue) {
            self.hasName = self.firstName != '' || self.lastName != '';
            self.fullName = (self.firstName + ' ' + self.lastName).trim();
        };

    };

})(window);
```

For more sample code browse the [examples](https://github.com/TCGV/jquery.glue/tree/master/examples) folder.

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
