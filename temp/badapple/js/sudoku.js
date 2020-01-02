$(function() {
    var Sudoku = {
        matrix: [],
        level: 6,
        init: function() {
            var me = this;
            me.init_play_board();
            me.draw_play_board();
            // submit
            $('#btn_submit').click(function() {
                me.on_submit();
            });
            // refresh
            $('#btn_refresh').click(function() {
                me.draw_play_board();
            });
            // set level
            $('#btn_set_level').click(function() {
                me.level = parseInt($('#sel_level').val());
                me.draw_play_board();
            });

            // set level
            $('#btn_help').click(function() {
                $('#help_doc').css({display: 'block'});
            });
            $('#help_doc').click(function() {
                $(this).css({display: 'none'});
            });
            // on blur, validate
            $(document).on('blur', '.cell_input', function() {
                var v = parseInt($(this).val());
                (isNaN(v) || v < 1 || v > 9) && $(this).val('')
            });
            // double click to tip
            $(document).on('dblclick', '.cell_input', function() {
                me.alert($(this).parent().data('v'));
            });
            $('.board_row:nth-child(3n) > td').css({'border-bottom': '1px solid #fa0a0a'});
            $('.board_row:first > td').css({'border-top-color': '#fa0a0a'});
            $('.board_row > td:nth-child(3n)').css({'border-right-color': '#fa0a0a'});
        },
        alert: function(msg) {
            $('#tip').animate({height: '48px'}, 500, function() {
                $(this).html(msg).animate({height: 0}, 2000, function() {
                    $(this).html('');
                });
            });
        },
        init_matrix_data: function() {
            var me = this,
                i,
                j;
            for (i = 0; i < 9; ++i) {
                me.matrix[i] = [];
                for (j = 0; j < 9; ++j) {
                    // 3 rows as a group
                    // for example
                    // 1 2 3 | 4 5 6
                    // 4 5 6 | 7 8 9
                    // 7 8 9 | 1 2 3
                    // ------+------
                    //
                    me.matrix[i][j] = ((i * 3 + j) % 9 + Math.floor(i / 3)) % 9 + 1;
                }
            }

            // row random
            // 3 rows as a group
            var tm = []; // temporary var
            for (i = 0; i < 3; ++i) {
                tm = tm.concat(
                        // random sort per 3 rows
                    me.matrix.slice(i * 3, i * 3 + 3).sort(function() {
                        return Math.round(Math.random()) - 0.5;
                    }));
            }
            me.matrix = tm;

            // column random
            // 3 columns as a group，random exchange
            for (j = 0; j < 3; ++j) {
                var r0 = Math.floor((Math.random() * 3)),
                    r1 = Math.floor((Math.random() * 3)),
                    t,
                    c0,
                    c1;
                while (r0 == r1) {
                    r1 = Math.floor((Math.random() * 3));
                }
                c0 = j * 3 + r0;
                c1 = j * 3 + r1;
                // exchange elements each row
                for (i = 0; i < 9; ++i) {
                    t = me.matrix[i][c0];
                    me.matrix[i][c0] = me.matrix[i][c1];
                    me.matrix[i][c1] = t;
                }
            }

            // remove some numbers of each row
            for (i = 0; i < 9; ++i) {
                var n = Math.floor((Math.random() * me.level));
                for (j = 0; j < n; ++j) {
                    var col = Math.floor((Math.random() * 9)),
                        v = me.matrix[i][col];
                    if (v != 0) {
                        $('#row_' + i + '_col_' + col).data('v', v);
                        me.matrix[i][col] = 0;
                    }
                }
            }
        },
        init_play_board: function() {
            var i, j, b = [];
            for (i = 0; i < 9; ++i) {
                b.push('<tr class="board_row">');
                for (j = 0; j < 9; ++j) {
                    b.push('<td id="row_' + i + '_col_' + j + '"></td>');
                }
                b.push('</tr>');
            }
            $('#play_board > tbody').empty().append(b.join(''));
        },
        draw_play_board: function () {
            var me = this,
                i,
                j,
                v;
            me.init_matrix_data();
            for (i = 0; i < 9; ++i) {
                for (j = 0; j < 9; ++j) {
                    v = me.matrix[i][j];
                    if (v == 0) {
                        $('#row_' + i + '_col_' + j)
                        .empty()
                        .append('<input type="text" class="cell_input" />');
                    }
                    else {
                        $('#row_' + i + '_col_' + j).html(v);
                    }
                }
            }
        },
        on_submit: function() {
            var me = this,
                i,
                j,
                row_score,
                col_score;
            for (i = 0; i < 9; ++i) {
                row_score = 0;
                col_score = 0; 
                for (j = 0; j < 9; ++j) {
                    row_score += me.get_val(i, j);
                    col_score += me.get_val(j, i);
                }
                if (row_score != 45 || col_score != 45) {
                    me.alert('No, You are not complete');
                    return;
                }
            }
            me.alert('Congratuations!');
        },
        get_val: function(row, col) {
            var v, cell, cell_input;
            cell = $('#row_' + row + '_col_' + col);
            cell_input = cell.find('input');
            return cell_input.size() ? parseInt(cell_input.val()) : parseInt(cell.html());
        }
    };

    Sudoku.init();
});
