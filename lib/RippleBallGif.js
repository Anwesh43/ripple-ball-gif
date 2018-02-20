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
class RippleBall {
    constructor(n) {
        this.state = new State(n)
        this.n = n
    }
    draw(context,w,h) {
        context.fillStyle = '#e74c3c'
        const new_r = Math.min(w,h)/(2*this.n)
        context.save()
        context.translate(w/2, h/2)
        for(var i=0;i<this.state.j;i++) {
            context.save()
            const r = new_r * i + (new_r * this.state.scales[i])
            for(var a=0;a<6;a++) {
                context.save()
                context.rotate(a * Math.PI/3)
                context.beginPath()
                context.arc(0, -r , Math.min(w,h)/22, 0, 2 * Math.PI)
                context.fill()
                context.restore()
            }
            context.restore()
        }
        context.restore()
    }
    update(stopcb) {
        this.state.update(stopcb)
    }
}
class RippleBallRenderer {
    constructor(w,h,n) {
        this.running = true
        this.rippleBall = new RippleBall(n)
    }
    render(context, updatecb) {
        while(this.running) {
            this.rippleBall.draw(context)
            this.rippleBall.update(() => {
                this.running = false
            })
            updatecb(context)
        }
    }
}
