jQuery(function($) {
    var socket = io();

    window.requestAnimFrame = (function(){
        return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    var cw = Raphael.colorwheel($('.colorwheel')[0],150);

    var grid = document.getElementById('canvas');
    var context = grid.getContext("2d");

    var cellSize = 50;
    var rows = 6;
    var columns = 10;

    grid.width = cellSize * columns;
    grid.height = cellSize * rows;

    var colors = [];

    for(var i = 0; i < (rows * columns); i++){
        colors.push("#000000");
    }

    console.log(colors.length);

    //$('#canvas').on('mouseover', function(e){
    //    console.log(e)
    //});


    //$('#canvas').on('mousemove', function(e){
    //    $('#canvas').on('click', function(e){
    //        console.log(e);
    //    });
    //});
    //

    grid.onmousedown = function() {
        var self = this;
        grid.onmousemove = function(e) {
            var x = e.x - e.target.offsetLeft;
            var y = e.y - e.target.offsetTop;
            var column = 0;
            var row = 0;
            for(var i = 0; i < columns; i++){
                if(x > cellSize * i){
                    column = i;
                    continue;
                }
            }
            for(var i = 0; i < rows; i++){
                if(y > cellSize * i){
                    row = i + 1;
                    continue;
                }
            }
            //console.log(row);
            var number;
            if(row > 1){
                number = (row - 1) * columns + column;
            }else{
                number = column;
            }
            //console.log(cw.color())
            if(!cw.color()){
                colors[number] = "#000000"
            }else{
                colors[number] = cw.color().hex;
            }


            socket.emit('pixels', colors);
        };
        this.onmouseup = function() {
            grid.onmousemove = null
        }
    };
    grid.ondragstart = function() { return false };

    //cw.color().hex
    function update() {
        var row = 0;
        var column = 0;
        for(var i = 0; i < colors.length; i++){
            context.beginPath();
            context.rect(column * cellSize, row * cellSize, cellSize, cellSize);
            context.fillStyle = colors[i];
            context.fill();
            column++;
            if(column == columns){
                column = 0;
                row++;
            }
        }
        requestAnimFrame(update);
    }

    update();

});