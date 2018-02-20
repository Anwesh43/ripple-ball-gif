const Gifencoder = require('gifencoder')
const Canvas = require('canvas')
const fs = require('fs')
class RippleBallGif {
    constructor(w, h) {
        this.gifencoder = new Gifencoder(w, h)
        this.canvas = new Canvas()
        this.canvas.width = w
        this.canvas.height = h
        this.context = this.canvas.getContext('2d')
        this.gifencoder.setQuality(100)
        this.gifencoder.setDelay(50)
        this.gifencoder.setRepeat(0)
    }
    create(fileName) {
        this.gifencoder.createReadStream().pipe(fs.createWriteStream(fileName))
        this.gifencoder.start()
        this.gifencoder.end()
    }
}
