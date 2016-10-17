(function (wnd) {

    wnd.BirthSelector = function () {

        var self = this;
        this.hasDate = null;
        this.dateString = null;
        this.day = null;
        this.month = null;
        this.year = null;

        var shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var fullMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        this.__init = function () {
            self.hasDate = false;
            populateDays(31);
            populateMonths();
            populateYears();
        };

        this.onChange = function (prop) {
            var n = daysInMonth();
            populateDays(n);
            self.dateString = getDateString();
        };

        function getDateString() {
            self.hasDate = !empty(self.year) && !empty(self.month) && !empty(self.day);
            return self.hasDate ?
                fullMonths[self.month] + " " + self.day + ", " + self.year :
                '';
        }

        function daysInMonth() {
            return !empty(self.year) && !empty(self.month) ?
                new Date(self.year, parseInt(self.month) + 1, 0).getDate() :
                31;
        }

        function populateDays(n) {
            var d = self.day;
            self.daySel.empty();
            self.daySel.append(getOption());
            for (var i = 1; i <= n; i++) {
                var $opt = $(getOption(i));
                self.daySel.append($opt);
            }
            self.day = d <= n ? d : null;
        }

        function populateMonths() {
            self.monthSel.empty();
            self.monthSel.append(getOption());
            for (var i = 0; i < 12; i++) {
                self.monthSel.append(getOption(shortMonths[i], i));
            }
        }

        function populateYears() {
            self.yearSel.empty();
            self.yearSel.append(getOption());
            var max = new Date().getFullYear();
            for (var i = max; i >= 1900 ; i--) {
                self.yearSel.append(getOption(i));
            }
        }

        function getOption(text, value) {
            if (text == undefined) {
                text = '';
            }
            if (value == undefined) {
                value = text;
            }
            return '<option value="' + value + '">' + text + '</option>';
        }

        function empty(val) {
            return val == null || val == '';
        }

    };

})(window);