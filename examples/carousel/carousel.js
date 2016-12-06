(function (wnd) {

    wnd.Carousel = function () {

        var imgs = ['img1.png', 'img2.png', 'img3.png'];
        var index = 0;

        var self = this;
        this.src = imgs[0];

        this.__init = function () {
            setInterval(function () {
                index = (index + 1) % imgs.length;
                self.src = imgs[index];
            }, 1000);
        };

    };

})(window);