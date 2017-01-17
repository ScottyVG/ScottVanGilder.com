// 'use strict';

window.onload = function() {
    var paint_brush = '';
    createPixelCanvas();
    getColors();
    eventL();
    pxL();
    changeColor();

};

function createPixelCanvas() {
    var pixelH = 25;
    var pixelW = 25;
    var wrapper = document.querySelector('.wrapper');

    for (var i = 0; i < pixelH; i++) {
        var row = document.createElement('div');
        row.setAttribute('class', 'row');
        wrapper.appendChild(row);

        for (var j = 0; j < pixelW; j++) {
            var div = document.createElement('div');
            div.setAttribute('class', 'pxBox' + ' ' + 'c' + (j + 1) + ' ' + 'r' + (i + 1));
            row.appendChild(div);
        }
    }
}

//-------------------------------------------------------------------------//
// Get Palvarte Colors from Class Name // TODO: maybe add images if?
//-------------------------------------------------------------------------//

function getColors() {
    var colorPicker = document.querySelector('.colorPicker');
    var children = colorPicker.children;
    for (var i = 0; i < children.length; i++) {
        children[i].style.background = children[i].className;
    }
}

//-------------------------------------------------------------------------//
// ColorPicker Event Listener
//-------------------------------------------------------------------------//

function eventL() {
    var colorPicker = document.querySelector('.colorPicker');
    var children = colorPicker.children;
    for (var i = 0; i < children.length; i++) {
        children[i].addEventListener('click', function() {
            currentColor = this.className;
        });
    }
}

//-------------------------------------------------------------------------//
// Pixel Boxes Event Listeners
//-------------------------------------------------------------------------//

function pxL() {
    var pxBox = document.querySelectorAll('.pxBox');
    var mouseDown;
    for (var i = 0; i < pxBox.length; i++) {
        pxBox[i].addEventListener('mousedown', function() {
            this.style.background = currentColor;
            for (var j = 0; j < pxBox.length; j++) {
                pxBox[j].addEventListener('mouseenter', eventHandler);
            }
        });
    }
    for (var i = 0; i < pxBox.length; i++) {
        pxBox[i].addEventListener('mouseup', function() {
            for (var j = 0; j < pxBox.length; j++) {
                pxBox[j].removeEventListener('mouseenter', eventHandler);
            }
            this.style.background = currentColor;
        });
    }
}

//-------------------------------------------------------------------------//
// Event Handler
//-------------------------------------------------------------------------//

function eventHandler() {
    this.style.background = currentColor;
}

//-------------------------------------------------------------------------//
// Event Handler
//-------------------------------------------------------------------------//

function changeColor() {
    var color = document.querySelector('input');
    color.addEventListener('change', function() {
        currentColor = color.value;
    });
}
