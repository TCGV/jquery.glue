(function (wnd) {

    wnd.Tabs = function () {

        var self = this;
        this.buttons = [];
        this.bodies = [];

        this.__init = function () {
            self.hideAll();
            selectAt(0);
        };

        this.select = function () {

            self.hideAll();

            for (var i = 0; i < self.buttons.length; i++) {
                if (self.buttons[i][0] == this) {
                    selectAt(i);
                }
            }

        };

        this.hideAll = function () {
            for (var i = 0; i < self.buttons.length; i++) {
                self.buttons[i].removeClass('active');
                self.bodies[i].hide();
            }
        };

        function selectAt(i) {
            self.buttons[i].addClass('active');
            self.bodies[i].show();
        }
    };

    wnd.Body = function () {

        var self = this;

        this.show = function () {
            self.view.show();
        };

        this.hide = function () {
            self.view.hide();
        };
    };

})(window);
