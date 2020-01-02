$(function() {
    $('#main_content').headsmart()
    // trigger matrix
    $('#matrix_trigger').click(function() {
        window.scrollTo(0, 0);
        $('body').append([
            '<div style="position: absolute;',
                'z-index: 1024;',
                'left: 0;',
                'top:0;',
                '">',
            '<canvas id="stage">',
            '</canvas>',
            '</div>'].join(''));

        var d = $(document),
            stage = $('#stage'),
            q = stage.get(0),
            width = d.width(),
            height = d.height() - $('h1').height() - 6,
            yy = Array(300).join(0).split(''),
            ctx = q.getContext('2d');

        q.width = width;
        q.height = height;
         
        // run_matrix();
        var matrix_interval = setInterval(function() {
            ctx.fillStyle = 'rgba(0, 0, 0, .05)';
            ctx.fillRect(0, 0, width, height);
            ctx.fillStyle = '#0F0';
            ctx.font = '10pt Georgia';

            yy.map(function(y, index) {
                ctx.fillText(String.fromCharCode(1e2 + Math.random() * 33),
                    (index * 10) + 10, 
                    y);

                if(y > 100 + Math.random() * 1e4) {
                    yy[index] = 0;
                }
                else {
                    yy[index] = y + 10;
                }
            });
        }, 33);
        // click stop
        stage.click(function() {
            clearInterval(matrix_interval);
            $(this).parents('div').remove();            
        });
    });
});
