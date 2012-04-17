$.support.cssTransition = function(){
    var name    = 'transition',
        tempEl  = document.createElement('div'),
        prefixs = ['Webkit', 'Moz', 'O'];

    if ( tempEl.style[name] === undefined ) {
        for( var i=0, len = prefixs.length; i < len; i++ ){
            name = prefixs[i] + 'Transition';
            if ( tempEl.style[name] !== undefined ){
                return name;
            }
        }
        return false;
    }
    return 'transition';
}();

function PhotoWall(options) {

    this._parseOptions(options);
    this._findElement();
    this._measureViewport();

    var that = this;
    this.nav = new SliderNav({
        clickFun: function(i){
            that.sliderToColumn(i);
        }
    });

    // 列
    this._columnData = [];

    // 照片
    this._photos     = [];

    this._currentColumnIndex = 0;

    this._left = 0;
}

PhotoWall.prototype = {
    
    constructor: PhotoWall,

    _parseOptions: function(options) {

        this.options = $.extend({
            elViewport: '.viewport',
            elSlider  : '.viewport-body',
            elPast    : '.nav-past',
            elNext    : '.nav-next'
        }, options);

    },

    _findElement: function() {
        var opts = this.options,
            that = this;

        this.elViewport = $(opts.elViewport);
        this.elSlider   = $(opts.elSlider);
        this.elPast     = $(opts.elPast).on('click', function(){
            that.past();
        }).hide();
        this.elNext     = $(opts.elNext).on('click', function(){
            that.next();
        }).hide();
    },

    _measureViewport: function() {

        // 容器宽高
        this.viewportWidth  = this.elViewport.width();
        this.viewportHeihgt = this.elViewport.height();

        if ( !this.viewportHeihgt ) {
            var wh        = $(window).height(),
                cssTop    = parseInt(this.elViewport.css('top')),
                cssBottom = parseInt(this.elViewport.css('bottom'));

            this.viewportHeihgt = wh - cssTop - cssBottom;
        }

        // 元件
        this.photoSize = {};

        this.photoSize['1'] = [ this._createSize(this.viewportHeihgt / 3 * 4, this.viewportHeihgt) ];

        var height = this.viewportHeihgt / 2, width  = height / 3 * 4;

        this.photoSize['2'] = [ this._createSize(width, height),
                                this._createSize(width, height-10, height+10) ];

        height = this.viewportHeihgt * 0.66;
        width  = height / 3 * 4;

        this.photoSize['3'] = [ this._createSize(width, height),
                                this._createSize(width/2-5, this.viewportHeihgt-height-10, height+10),
                                this._createSize(width/2-5, this.viewportHeihgt-height-10, height+10, width/2+5) ];

        // console.info(this.photoSize);
    },

    _createSize: function(width, height, top, left){

        var obj = {
            width: Math.ceil(width),
            height: Math.ceil(height)
        };

        obj.top = Math.ceil(top) || 0;
        obj.left = Math.ceil(left) || 0;

        return obj;
    },

    _createColumn: function(type, data) {

        var column = {
            type: type,
            photos: []
            // left: 0
        };

        for (var i=0, len = data.length; i < len; i++ ) {
            column.photos.push( this._createItem( data[i] ) );
        }

        return column;
    },

    _createItem: function(data){

        var item = new Photo(data);

        this._photos.push(item);

        this.elSlider.append( item.el );

        return item;
    },

    // @return int 1,2,3
    _getColumnType: function(len) {
        if ( len < 2 ) {
            return 1;
        }

        var roll = $.rnd(0, 100),
            type;

        if ( roll < 33 ) {
            type = 1;
        } else if ( roll < 66 ) {
            type = 2;
        } else {
            type = 3;
        }
        return Math.min(len, type);
    },

    past: function(){
        var index,
            column;

        if ( this._currentColumnIndex == 0 ) {
            return ;
        }

        index  = this._currentColumnIndex - 1;
        column = this._columnData[index];

        if ( column ) {

            var maxLeft = this.getMaxLeft();

            if ( column.left >= maxLeft ) {
                this._currentColumnIndex--;
                this.past();
                return;
            }

            this.sliderToColumn(index);
        }

        return;
    },

    next: function(){

        if ( this._currentColumnIndex
    < this._columnData.length ) {
            
            var index, column, maxLeft = this.getMaxLeft();

            index  = this._currentColumnIndex + 1;
            this.sliderToColumn(index);

            return;
            // column = this._columnData[index];

            // if ( column ) {
                // if ( column.left + column.width <= this._left ){
                //  this._currentColumnIndex++;
                // }

                // this._slideTo( Math.min(column.left, maxLeft) );
            // }
        }
    },

    _slideTo: function(left){
        if ( $.support.cssTransition ) {
            this.elSlider.css({
                left: -left
            });
        } else {
            this.elSlider.animate({
                left: -left
            }, {
                duration: 300,
                easing: 'easeInOutQuad'
            });
        }
    },

    sliderToColumn: function(index){
        
        var column = this._columnData[index];

        if ( column ) {

            this._currentColumnIndex = index;

            var maxLeft = this.getMaxLeft();

            this._slideTo( Math.min(column.left, maxLeft) );

            this.nav.setSelected(index);

            this._buttonStatus();
        }
    },

    _buttonStatus: function(){
        
        var index = this._currentColumnIndex,
            len   = this._columnData.length;

        if ( index === 0) {
            this.elPast.addClass('disable');
        } else {
            this.elPast.removeClass('disable');
        }

        if ( index === len - 1 ) {
            this.elNext.addClass('disable');
        } else {
            this.elNext.removeClass('disable');
        }

        if ( len > 0 ) {
            this.elPast.show();
            this.elNext.show();
        }
    },

    getMaxLeft: function(){
        return this._left - this.viewportWidth;
    },

    addData: function(datas) {

        if ( !datas || !datas.length ) {
            return ;
        }

        var columns = [];

        while ( datas.length ) {
            var type = this._getColumnType( datas.length ),
                data = datas.splice(0, type);

            var column = this._createColumn(type, data);

            this._columnData.push(column);

            var index = this._columnData.length;
            column.index = index;

            this.nav.addItems();
            
            if ( index == 1 ) {
                this.nav.setSelected(0);
            }

            columns.push(column);
        }

        this._measureColumns( columns );

        this._buttonStatus();
    },

    resize: function(){
        this._left = 0;
        this._measureViewport();

        var columns = this._columnData;
        this._measureColumns(columns);

        for (var i = 0, len = this._photos.length; i
        < len; i++) {
            this._photos[i].resize();
        }
    },

    _measureColumns: function(columns){

        // console.info(columns);

        var column;
        
        for (var i = 0, len = columns.length; i < len; i++ ) {
            column = columns[i];
            this._measureColumn(column);
        }

    },

    _measureColumn: function(column){

        // console.info(column);

        var size = this.photoSize[column.type],
            width = 0;

        if ( this._left >
            0 ) this._left += 10;

        column.left = this._left;

        for (var i=0, len = column.photos.length; i
            < len; i++ ) {

            var s = $.clonePlainObject(size[i]);
            s.left += this._left;

            // console.info(column.photos[i].el);
            column.photos[i].el.css(s);

            if ( i == 0 ) {
                width = s.width;
                column.width = width;
            }
        }

        this._left += width;
    }
}

function Photo(data) {
    
    this.width = 0;
    this.height = 0;

    var that = this,
        item = $( PHOTO_TEMP );

    var loader = $('<img>
                ');
    
    that.img = item.find('.img img').hide();

    loader.on('load', function(){

        loader.off('load', arguments.callee);

        that.width  = loader[0].width;
        that.height = loader[0].height;

        that.resize();

        that.img.attr('src', data.src).show();

    });
    loader.attr('src', data.src);

    item.find('.name').text(data.name);

    var likes       = item.find('.likes'),
        likesNum    = likes.find('.num'),
        comments    = item.find('.comments'),
        commentsNum = comments.find('.num'),
        countChange = function(num){
            var count = parseInt(this.text());
            this.text( count + num );
        };

    likesNum.text(data.likes);
    commentsNum.text(data.comments);

    likes.on('click', function(){
        var self = $(this);
        if ( self.hasClass('selected') ) {
            // TODO ajax 取消喜欢

            countChange.call(likesNum, -1);
            self.removeClass('selected');
        } else {

            // TODO ajax 喜欢操作
            // 反馈结果
            countChange.call(likesNum, 1);
            self.addClass('selected');
        }
    });

    comments.on('click', function(){
        var self = $(this);
        if ( self.hasClass('selected') ) {
            // TODO ajax 取消喜欢

            countChange.call(commentsNum, -1);
            self.removeClass('selected');
        } else {

            // TODO ajax 喜欢操作
            // 反馈结果
            countChange.call(commentsNum, 1);
            self.addClass('selected');
        }
    });

    this.el = item;
}

Photo.prototype.resize = function(){
    var w   = this.width,
        h   = this.height,
        parentEl = this.img.parent();

    var pw  = parentEl.width(),
        ph  = parentEl.height(),
        css = {};

    if ( w > h && w/h >= pw/ph) {
        css.height = ph;
        css.width  = 'auto';
    } else {
        css.height = 'auto';
        css.width  = pw;
    }

    this.img.css(css);
};

function SliderNav (options) {
    
    this.options = $.extend({
        el: '.pagenum ol',
        item: '
                <li>
                    '
    }, options);

    this.el = $(this.options.el);
    this.items = [];
    this.itemCount = 0;
}

SliderNav.prototype.addItems = function(num) {
    
    num = num || 1;

    var that     = this,
        callback = this.options.clickFun,
        count    = this.itemCount,
        item;

    while ( num-- ) {
        item = $(this.options.item);
        (function(i){
            item.on('click', function(){
                that.setSelected(i);
                if ( $.isFunction(callback) ) callback(i);
            });
        })(count);

        this.items.push(item);
        this.el.append(item);
        count++;
    }

    this.itemCount = count;
};

SliderNav.prototype.setSelected = function(index){

    if ( this.items[index] ) {
        if ( this.selected ) { this.selected.removeClass('selected'); }
        this.selected = this.items[index].addClass('selected');

        this.selectedIndex = index;
    }
}