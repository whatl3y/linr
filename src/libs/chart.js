const asciichart = require('asciichart')
const readline = require('readline')

module.exports = function Chart() {
  return {
    data: [],

    init() {
      console.clear()
    },

    pushAndRedraw(val, header=null) {
      this.push(val)
      this.draw(header)
    },

    push(val) {
      this.data.push(val)
      return this.data = this.data.slice(-100)
    },

    draw(header=null) {
      readline.clearLine(process.stdout, 0)

      if (header) {
        readline.cursorTo(process.stdout, 0, 1)
        process.stdout.write(header)
      }

      readline.cursorTo(process.stdout, 0, 6)
      process.stdout.write(asciichart.plot(this.data, {
        height: Math.floor(process.stdout.rows - (process.stdout.rows * 0.20))
      }))
    }
  }
}