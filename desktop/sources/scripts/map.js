'use strict'

function Map(client) {
  this.fullmap = null

  this.start = () => {
    document.addEventListener('mousedown', this.revealMap)
  }

  this.fetchMap = (url) => {
    fetch(url)
      .then(response => response.text())
      .then(map => {
        this.fullmap = map
      })
  }

  this.revealMap = (e) => {
    console.log('revealing map...')
    const data = this.fullmap
    client.orca.writeBlock(client.cursor.minX, client.cursor.minY, data, client.cursor.ins)
    client.history.record(client.orca.s)
    client.cursor.scaleTo(data.split(/\r?\n/)[0].length - 1, data.split(/\r?\n/).length - 1)
    console.log(e)
    e.preventDefault()
  }

}