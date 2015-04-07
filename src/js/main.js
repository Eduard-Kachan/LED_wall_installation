jQuery(function($) {


    window.requestAnimFrame = (function(){
        return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    var cw = Raphael.colorwheel($('.colorwheel')[0],200);

    var grid = document.getElementById('canvas');
    var context = grid.getContext("2d");

    var cellSize = 50;
    var rows = 6;
    var columns = 5;

    grid.width = cellSize * columns;
    grid.height = cellSize * rows;

    var pixels = [];

    for(var i = 0; i < rows * columns; i++){
        pixels.push("#f0f0f0");
    }


    grid.onmousedown = function() {
        var self = this;
        grid.onmousemove = function(e) {
            var x = e.x - e.target.offsetLeft;
            var y = e.y - e.target.offsetTop;
            var column = 0;
            var row = 0;
            for(var i = 0; i < columns; i++){
                if(x > cellSize * i){
                    column = i ;
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
            //console.log(number)
            pixels[number] = cw.color().hex;
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
        for(var i = 0; i < pixels.length; i++){
            context.beginPath();
            context.rect(column * cellSize, row * cellSize, cellSize, cellSize);
            context.fillStyle = pixels[i];
            context.fill();
            column++;
            if(column == 5){
                column = 0;
                row++;
            }
        }
        requestAnimFrame(update);
    }

    update();

});