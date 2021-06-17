'use strict'

function GameMap(client) {
  this.fullmap = null
  this.x = 0
  this.y = 0

  this.start = () => {
    document.addEventListener('mousedown', this.onMouseDown)
    window.addEventListener('keydown', this.onKeyDown)
  }

  this.fetchMap = (url) => {
    fetch(url)
      .then(response => response.text())
      .then(map => {
        this.fullmap = map
        let mapArr = this.fullmap.split('\n')
        this.x = Math.floor(mapArr[0].length / 2)
        this.y = Math.floor(mapArr.length / 2)
      })
    
  }

  this.getMapSection = () => {
    let mapArr = this.fullmap.split('\n')
    return mapArr.slice(this.y - 1, this.y + 2)
          .map(line => line.substring(this.x - 1, this.x + 2))
          .join('\n')
  }

  this.revealMapSection = (mapSection) => {
    console.log(mapSection)
    const data = mapSection
    client.orca.writeBlock(client.cursor.minX - 1, client.cursor.minY - 1, data, client.cursor.ins)
    client.history.record(client.orca.s)
    // client.cursor.scaleTo(data.split(/\r?\n/)[0].length - 1, data.split(/\r?\n/).length - 1)
    // console.log(data.split(/\r?\n/)[0].length - 1, data.split(/\r?\n/).length - 1)
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
      default:
        return
    }
    
    let data = this.getMapSection()
    this.revealMapSection(data)
  }

  this.onMouseDown = (e) => {
    const data = this.getMapSection()
    this.revealMapSection(data) 
    // e.preventDefauslt()
  }

}