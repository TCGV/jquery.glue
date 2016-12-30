(function (wnd) {

    wnd.Counter = function () {

        var self = this;
        this.count = null;

        this.__init = function () {
            self.count = 0;
        };

        this.increment = function () {
            self.count++;
            self.counterEl.css('border', self.count + 'px solid black');
        };
    };

})(window);