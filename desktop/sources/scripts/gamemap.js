'use strict'

function GameMap(client) {
  const fs = require('fs')

  this.fullmap = null
  this.x = 0
  this.y = 0
  this.width = null
  this.height = null
  this.buildMode = true
  if (this.buildMode) this.url = null
  else this.url = './maps/map2.txt'

  this.start = () => {
    document.addEventListener('mousedown', this.onMouseDown)
    window.addEventListener('keydown', this.onKeyDown)
    if(!this.buildMode) this.fetchMap()
    this.fullmap = Array.from(Array(client.orca.h), () => Array(client.orca.w).fill('.'))
  }

  this.drawMap = () => {
    this.fullmap.split('\n').forEach((line, y) => {
      line.split('').forEach((pos, x) => {
        console.log(pos, x, y)
        if(pos == 'a') {
          this.makeColorBlock(x, y)
        }
      })
    })
  }

  this.fetchMap = () => {
    fetch(this.url)
      .then(response => response.text())
      .then(map => {
        this.fullmap = map
        let mapArr = this.fullmap.split('\n')
        this.x = Math.floor(mapArr[0].length / 2)
        this.y = Math.floor(mapArr.length / 2)
        this.width = mapArr[0].length
        this.height = mapArr.length
        console.log(`Gamemap -> width:${this.width} height:${this.height}`)
        this.drawMap()
      })
    
  }

  this.getMapSection = (x1, x2, y1, y2) => {
    let mapArr = this.fullmap.split('\n')
    return mapArr.slice(y1, y2)
          .map(line => line.substring(x1, x2))
          .join('\n')
  }

  this.revealMapSection = (mapSection, xoff, yoff) => {
    console.log(client.cursor.minX)
    const data = mapSection
    client.orca.writeBlock(client.cursor.minX + xoff, client.cursor.minY + yoff, data, client.cursor.ins)
    client.history.record(client.orca.s)
    // client.cursor.scaleTo(data.split(/\r?\n/)[0].length - 1, data.split(/\r?\n/).length - 1)
  }

  this.makeColorBlock = (x, y) => {
    const w = client.tile.ws
    const h = client.tile.hs
    client.sketch.context.fillStyle = 'white'
    client.sketch.context.fillRect(x * w, y * h, w, h)
  }

  this.draw = () => {
    this.makeColorBlock(client.cursor.minX, client.cursor.minY)
  }

  this.onKeyDown = (e) => {
    switch(e.key) {
      case 'ArrowUp':
        this.y -= 1
        break
      case 'ArrowDown':
        this.y += 1
        break
      case 'ArrowLeft':
        this.x -= 1
        break
      case 'ArrowRight':
        this.x += 1
        break
      case 's':
        this.saveMap()
      default:
        return
    }

    this.draw()
    if (this.buildMode) this.buildMap()
    
    // if(this.x < 0 || this.x > this.width-1 || this.y < 0 || this.y > this.height-1) return
    // let y1 = this.y-1, y2 = this.y+2, x1 = this.x-1, x2 = this.x+2
    // let xoff = -1, yoff = -1
    // if(y1 < 0) {
    //   y1 = 0
    //   y2 = this.y + 1
    //   yoff = 0
    // }
    // // if(y2 > this.height-1) 
    // if(x1 < 0) {
    //   x1 = 0
    //   x2 = this.x + 1
    //   xoff = 0
    // }

    // let data = this.getMapSection(x1, x2, y1, y2)
    // this.revealMapSection(data, xoff, yoff)
  }

  this.onMouseDown = (e) => {
    // const data = this.getMapSection(this.x-1, this.x+2, this.y-1, this.y+2)
    // this.revealMapSection(data, -1, -1) 
    this.draw()
    e.preventDefault()
    document.removeEventListener('mousedown', this.onMouseDown)
  }

  // Utilities
  this.buildMap = () => {
    this.fullmap[client.cursor.minY][client.cursor.minX] = 'x'
  }
  
  this.saveMap = () => {
    try {
      var temp = ''
      this.fullmap.forEach(line => {
        temp = temp + line.join('') + '\n'
      })
      // const temp = this.fullmap.join('\n')
      fs.writeFileSync('test.txt', temp, 'utf8')
    } catch (e) {
      console.log(e)
    }
  }

}