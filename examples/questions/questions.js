(function (wnd) {

    wnd.Question = function () {

        var self = this;
        this.labels = [];
        this.radios = [];
        this.checkboxes = [];

        this.getAnswer = function () {

            var ans = '';

            for (var i = 0; i < self.radios.length; i++) {
                if (self.radios[i]) {
                    ans += self.labels[i] + '; ';
                }
            }

            for (var i = 0; i < self.checkboxes.length; i++) {
                if (self.checkboxes[i]) {
                    ans += self.labels[i] + '; ';
                }
            }

            return ans.trim();

        };

    };

    wnd.Result = function () {

        var self = this;
        this.answer = '';

        this.__init = function () {
            self.question.onChange = function () {
                self.answer = self.question.getAnswer();
            };
        };

    };

})(window);