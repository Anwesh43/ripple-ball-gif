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
class State {
    constructor(n) {
        this.j = 0
        this.dir = 1
        this.n = 0
        this.prevScale = 0
        this.initScales()
    }
    initScales() {
        this.scales = []
        for(var i=0; i < this.n; i++) {
            this.scales.push(0)
        }
    }
    update(stopcb) {
        this.scales[this.j] += 0.1*this.dir
        if(Math.abs(this.scales[this.j] - this.prevScale) > 1) {
            this.j += this.dir
            this.scales[this.j] = this.prevScale + this.dir
            if(this.j == this.n || this.j == -1) {
                this.dir *= -1
                if(this.dir == 1) {
                    this.dir = 0
                }
                this.prevScale = this.scales[this.j]
                stopcb()
            }
        }
    }
}
