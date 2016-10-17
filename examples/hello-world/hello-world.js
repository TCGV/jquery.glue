(function (wnd) {

    wnd.Form = function () {

        var self = this;
        this.firstName = '';
        this.lastName = '';
        this.fullName = '';

        this.__init = function () {
            self.hasName = false;
        };

        this.onChange = function (prop, newValue, oldValue) {
            self.hasName = self.firstName != '' || self.lastName != '';
            self.fullName = (self.firstName + ' ' + self.lastName).trim();
        };

    };

})(window);