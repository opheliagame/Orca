'use strict'

function Sketch(client) {



  this.setup = () => {

    console.log('setting up shader..')
    this.width = 100;
    this.height = 100;
    this.canvas = document.createElement("canvas");
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '30px';
    this.canvas.style.left = '30px';
    this.canvas.style.opacity = 1;
    this.canvas.style.zIndex = -1;
    this.context = this.canvas.getContext('2d')
    console.log(this.context)
    return this.canvas;
  }

  this.resize = (w, h, h1) => {
    this.canvas.width = w;
    this.canvas.height = h;
    this.canvas.style.width = w;
    this.canvas.style.height = h1;
    console.log(`Canvas resized to: ${w}x${h}`);
  }

}