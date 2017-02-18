(function (wnd) {

    wnd.ToDoList = function () {

        var self = this;
        this.items = [];
        this.length = 0;
        this.pending = 0;
        this.done = 0;

        this.newItem = function () {
            self.form.open();
        };

        this.addItem = function (item) {
            self.template(ToDoItem)
				.appendTo(self.container)
				.glue(item);
            self.items.push(item);
            self.length = self.items.length;
            self.pending += item.done ? 0 : 1;
        };

        this.removeItem = function (item) {
            for (var i = 0; i < self.items.length; i++) {
                if (self.items[i] == item) {
                    self.items.splice(i, 1);
                    self.length = self.items.length;
                    self.pending -= item.done ? 0 : 1;
                    return true;
                }
            }
            return false;
        };

        this.contains = function (item) {
            for (var i = 0; i < self.items.length; i++) {
                if (self.items[i].description.trim().toLowerCase() == item.description.trim().toLowerCase()) {
                    return true;
                }
            }
            return false;
        }

        this.increment = function (item) {
            self.pending -= item.done ? 1 : 0;
            self.done++;
        }

    };

    wnd.ToDoForm = function () {

        var self = this;
        this.disabled = true;
        this.item = new ToDoItem();

        this.__init = function () {
            self.textArea.on('keyup', function (e) {
                if ((e.which || e.keyCode) === 13) {
                    self.confirm();
                }
            });
        }

        this.open = function () {
            self.item.description = '';
            validateDescription();
            self.view.show();
            self.textArea.focus();
        };

        this.confirm = function () {
            if (!self.disabled) {
                self.list.addItem(self.item.clone());
                self.view.hide();
            }
        };

        this.cancel = function () {
            self.view.hide();
        };

        this.onChange = function (prop) {
            if (prop == 'item.description') {
                validateDescription();
            }
        };

        function validateDescription() {
            self.disabled = self.list.contains(self.item) || self.item.description == '';
            if (self.disabled) {
                self.confirmBtn.attr('disabled', 'disabled');
                self.textArea.css('color', 'red');
            } else {
                self.confirmBtn.removeAttr('disabled');
                self.textArea.css('color', '');
            }
        }

    };

    wnd.ToDoItem = function () {

        var self = this;
        this.description = '';
        this.done = false;

		this.__init = function (){
			self.list = self.resolve(ToDoList)[0];
		};
		
        this.setDone = function () {
            if (!self.done) {
                self.done = true;
                self.list.increment(self);
                self.view.css('background-color', '#e0f2ff');
                self.doneBtn.fadeOut();
            }
        };

        this.remove = function () {
            self.list.removeItem(self);
            self.view.remove();
        };

        this.clone = function () {
            var item = new ToDoItem();
            item.description = self.description;
            item.done = self.done;
            return item;
        };

    };

})(window);