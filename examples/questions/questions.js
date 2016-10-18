(function (wnd) {

    wnd.Question = function () {

        var self = this;
        this.labels = [];
        this.options = [];

        this.getAnswer = function () {

            var ans = '';

            for (var i = 0; i < self.options.length; i++) {
                if (self.options[i]) {
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