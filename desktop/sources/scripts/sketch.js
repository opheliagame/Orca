'use strict'

function Sketch(client) {
    // p5 global variables
    this.width;
    this.height;
    this.cell = {w: 0, h: 0};
    this.columns;
    this.rows;
    this.board;
    this.next;
    this.initStrings;

    // sketch specific functions
    this.initBoard = () => {
        for (let i = 0; i < this.columns; i++) {
            for (let j = 0; j < this.rows; j++) {
              // Lining the edges with 0s
              if (i == 0 || j == 0 || i == this.columns-1 || j == this.rows-1) this.board[i][j] = 0;
              // Filling the rest randomly
              else this.board[i][j] = floor(random(2));
              this.next[i][j] = 0;
            }
        }
        // console.log(this.board)
    }

    this.generate = () => {
        // Loop through every spot in our 2D array and check spots neighbors
        for (let x = 1; x < this.columns - 1; x++) {
            for (let y = 1; y < this.rows - 1; y++) {
            // Add up all the states in a 3x3 surrounding grid
            let neighbors = 0;
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    neighbors += this.board[x+i][y+j];
                }
            }

            // A little trick to subtract the current cell's state since
            // we added it in the above loop
            neighbors -= this.board[x][y];
            // Rules of Life
            if      ((this.board[x][y] == 1) && (neighbors <  2)) this.next[x][y] = 0;           // Loneliness
            else if ((this.board[x][y] == 1) && (neighbors >  3)) this.next[x][y] = 0;           // Overpopulation
            else if ((this.board[x][y] == 0) && (neighbors == 3)) this.next[x][y] = 1;           // Reproduction
            else                                             this.next[x][y] = this.board[x][y]; // Stasis
            }
        }

        // Swap!
        let temp = this.board;
        this.board = this.next;
        this.next = temp;
    }

    // p5 setup function 
    this.setup = (tile, orca) => {
        console.log('Setting up p5 sketch..');
        this.cell.w = tile.ws;
        this.cell.h = tile.hs;
        // this.columns = Math.floor(this.width / this.cell.w);
        this.columns = orca.w;
        this.rows = orca.h;
        // console.log('columns rows', this.columns, this.rows);

        // Wacky way to make a 2D array is JS
        this.board = new Array(this.columns);
        for (let i = 0; i < this.columns; i++) {
            this.board[i] = new Array(this.rows);
        }
        // Going to use multiple 2D arrays and swap them
        this.next = new Array(this.columns);
        for (let i = 0; i < this.columns; i++) {
            this.next[i] = new Array(this.rows);
        }
        
        // fetch('/home/anushka/daily_sketches/36daysoftype/bxo.txt')
        //     .then(response => response.text())
        //     .then((data) => {
        //         console.log(data)
        //         this.initStrings = data;
        //         this.initBoard(this.initStrings);
        //     })
        // this.initStrings = loadStrings('/home/anushka/daily_sketches/36daysoftype/bxo.txt', this.initBoard)

        this.initBoard();
    }
    
    // p5 draw function
    this.draw = () => {
        let backgroundColor = color(0);
        background(255, 0, 0);
        this.clear();
        // if(this.board) {
        //     console.log(this.board[0][0]);
        // }
        strokeWeight(0);
        
        // fill(0);
        for ( let i = 0; i < this.columns; i++) {
          for ( let j = 0; j < this.rows; j++) {
            if (this.board[i][j] != 1) {
              // fill(255);
              noFill();
            }
            else {
              fill(0);
            }
            noStroke();
            rect(i * this.cell.w, j * this.cell.h, this.cell.w, this.cell.h);
            }
        } 
    }

    setInterval(() => this.generate(), 1000);
    setInterval(() => this.initBoard(), 2*60*1000);

    this.clear = () => {
        clear();
        // background(0);
    }

    this.createCanvas = (w, h) => {
        new p5();
        this.width = w;
        this.height = h;
        return createCanvas(w, h);
    }

    this.resize = (w, h) => {
        this.width = w;
        this.height = h;
        resizeCanvas(w, h);
        console.log(`Canvas resized to: ${w}x${h}`);
    }
}