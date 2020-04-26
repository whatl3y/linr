const minimist = require('minimist')
const Chart = require('./chart')
const Http = require('./http')

;(async function linr() {
  try {
    const argv = minimist(process.argv.slice(2))
    const url     = argv._[0] || argv.url || argv.u || `https://api.coinbase.com/v2/prices/BTC-USD/buy`
    const method  = argv.request || argv.X || 'GET'
    const curlH   = argv.header || argv.H
    const query   = argv.p || argv.params
    const key     = argv.key || argv.k || ''
    const delay   = argv.delay || argv.d || 100

    let headers = {}
    if (curlH)
      headers = stringToObj(curlH, ':')

    let params = {}
    if (query)
      params = stringToObj(query, '=')

    const chart = Chart()
    const http = Http({ url, headers })

    chart.init()

    while (true) {
      const val = await http.getAndParse({ method, params }, key)
      chart.push(parseFloat(val))
      chart.draw(`linr - line chart generator (Ctrl+C to exit)\n\n${url}\nlatest value: ${val}`)
      await http.sleep(delay)
    }

  } catch(err) {
    console.error(`Uh oh, something bad happened, closing linr`, err)
    process.exit()
  }
})()

function stringToObj(mainStrings, delimeter='.') {
  const valAry = mainStrings instanceof Array ? mainStrings : [ mainStrings ]
  return valAry.reduce((obj, headerString) => {
    const [ key, val ] = headerString.split(delimeter)
    return {
      ...obj,
      [key.trim()]: (val || '').trim()
    }
  }, {})
}