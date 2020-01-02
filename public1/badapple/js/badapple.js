$(function() {
    var BadApple = {
        is_running: false,
        data_index: 0,
        data_count: 67,
        is_loading: {},
        progress: $('#progress'),
        init: function() {
            var me = this,
                stage = $('#stage'),
                i;

            me.data_matrix = [];
            for (i = 0; i < me.frame_row; ++i) {
                me.data_matrix[i] = Array(me.frame_col).join(' ').split('');
            }

            me.canvas = stage.get(0);
            me.ctx = me.canvas.getContext('2d');
            //me.canvas.width = me.frame_col * 7;
            //me.canvas.height = me.frame_row * 16;
            me.canvas.width = me.frame_col * 7;
            me.canvas.height = me.frame_row * 16;
            console.log(me.canvas.width+" "+me.canvas.height);

            me.ctx.fillStyle = 'rgba(0, 0, 0, .05)';
            me.ctx.fillRect(0, 0, me.canvas.width, me.canvas.height);
            me.ctx.fillStyle = '#7E7E7E';
            me.ctx.font = '12px monospace';
            
        },
        load_data: function (index, count, fn) {
        	var me = this;
            if (!me.is_loading[index]) {
                // mark is loading
                me.is_loading[index] = true;
                $.get('data/BadApple/data_' + index + '.txt', function (data) {
                    // finish loading
                    me.is_loading[index] = null;
                    me.data_index = index;
                    data = data.split('\n');
                    // update progress
                    me.progress.html("Loading Data:"+(index / me.data_count * 100).toFixed(2) + '%');

                    if (me.data) {
                        me.data = me.data.concat(data);
                    }
                    // first time
                    else {
                        me.data = data;
                        var rc = data[0].split(' ');
                        me.frame_row = parseInt(rc[0]);
                        me.frame_col = parseInt(rc[1]);
                        $('#div_loading').remove();
                        me.init();
                    }

                    if (count > 1 && index < me.data_count) {
                        me.load_data(index + 1, count - 1, fn);
                    }
                    else {
                        fn && fn();
                    }
                });
            }
        },
        draw_frame: function(data) {
            var me = this, i;
            for (i = 0; i < data.length; ++i) {
                me.data_matrix[data[i][0] - 1][data[i][1] - 1] = data[i][2];
            }
            me.ctx.clearRect(0, 0, me.canvas.width, me.canvas.height);
            for (i = 0; i < me.frame_row; ++i) {
                me.ctx.fillText(me.data_matrix[i].join(''), 4, i * 14 + 16);
            }
        },
        play: function() {
            var me = this,
                i = 0,
                j,
                l,
                r;
            me.is_running = true;
            me.interval || (me.interval = setInterval(function () {
                if (me.is_running && i < me.data.length) {
                    l = me.data[++i];
                    r = [];
                    if (l && !/^\s*$/.test(l)) {
                        l = l.split('|');
                        for (j = 0; j < l.length; ++j) {
                            r[j] = l[j].split('_');
                        }
                    }
                    me.draw_frame(r);
                    // load data
                    if (i + 16 > me.data_index * 16 && 
                    		me.data_index < me.data_count) {
                    	me.load_data(me.data_index + 1, 2);
                    }
                }
            }, 70));
        },
        start: function() {
            var me = this;
            if (me.data) {
                me.play();
            }
            else {
                me.load_data(0, 1, function() {
                    me.play();
                });
            }
        },
        stop: function() {
            this.is_running = false;
        },
        terminal: function () {
            this.stop();
            clearInterval(this.interval);
        }
    };

    $('#stage').click(function() {
		ap.toggle();
        BadApple.is_running ? 
            BadApple.stop() : 
            BadApple.start();
    }).click();
});
