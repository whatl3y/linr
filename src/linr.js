const minimist = require('minimist')
const Chart = require('./libs/chart')
const Http = require('./libs/http')

;(async function linr() {
  try {
    const argv = minimist(process.argv.slice(2))
    const url     = argv._[0] || argv.url || argv.u
    const method  = argv.request || argv.X || 'GET'
    const curlH   = argv.header || argv.H
    const query   = argv.p || argv.params
    const data    = argv.b || argv.body
    const key     = argv.key || argv.k
    const delay   = argv.delay || argv.d || 100

    if (!url) {
      console.error(`Please provide a URL (-u|--url) to fetch data to chart.`)
      process.exit()
    }

    let headers = {}
    if (curlH)
      headers = stringToObj(curlH, ':')

    let params = null
    if (query)
      params = stringToObj(query, '=')

    let body = null
    if (data)
      body = JSON.parse(data)

    const chart = Chart()
    const http = Http({ url, headers })

    chart.init()

    while (true) {
      const val = await http.exponentialBackoff(async () => await http.getAndParse({
        method,
        body,
        params
      }, key), err => {
        chart.draw(`Error getting data from endpoint -- ${err.stack}`, true)
      })

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