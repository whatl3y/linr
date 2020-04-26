const axios = require('axios')

module.exports = function Http({
  url,
  headers={}
}) {
  return {
    client: axios.create({
      baseURL: url,
      headers,
      responseType: 'text'
    }),

    async request({
      method='get',
      params=null,
      body=null
    }) {
      return await this.exponentialBackoff(async () => await this.client({
        method,
        params,
        body
      }), () => {})
    },

    async getAndParse(info, keyString=null) {
      const { data } = await this.request(info)
      if (!keyString)
        return data

      const keys = keyString.split('.')
      return keys.reduce((obj, key) => obj[key], data)
    },

    async sleep(delay) {
      return await new Promise(resolve => setTimeout(resolve, parseInt(delay)))
    },

    async exponentialBackoff(
      promiseFunction,
      failureFunction=NOOP,
      err=null,
      totalAllowedBackoffTries=10,
      backoffAttempt=1
    ) {
      const backoffSecondsToWait = 2 + Math.pow(backoffAttempt, 2)

      if (backoffAttempt > totalAllowedBackoffTries)
        throw err

      try {
        const result = await promiseFunction()
        return result
      } catch(err) {
        failureFunction(err, backoffAttempt)
        await this.sleep(backoffSecondsToWait * 1000)
        return await this.exponentialBackoff(
          promiseFunction,
          failureFunction,
          err,
          totalAllowedBackoffTries,
          backoffAttempt + 1)
      }
    },
  }
}