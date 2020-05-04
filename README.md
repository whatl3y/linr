# linr

Create real-time terminal line charts from HTTP data. As of today this utility requires the URL/endpoint returns either a plain numerical value or a JSON object with the desired value nested in it. For JSON responses, see the **`JSON data key`** parameter and [Usage/Examples](#usageexamples) below.

NOTE: linr continues to make HTTP requests to the endpoint specified in the **`url`** argument until you decide to stop (Ctrl+C). We use exponential backoff in the event that the endpoint is rate limiting, but if it's an API that has quotas per IP address or authenticated via an API key, this utility will go against those quotas.

`$ linr https://api.coinbase.com/v2/prices/BTC-USD/buy -k data.amount`

<img src="https://user-images.githubusercontent.com/13718950/80319524-a93c1d00-87de-11ea-96ab-aa93a51f1543.png" width="300">

## Install

`npm install -g linr`

## Usage/Examples

```sh
# endpoint is: https://www.random.org/integers/?num=1&min=1&max=6&col=1&base=10&format=plain&rnd=new
$ linr https://www.random.org/integers/ -p num=1 -p min=1 -p max=6 -p col=1 -p base=10 -p format=plain -p rnd=new

# response data looks like: {"data":{"base":"BTC","currency":"USD","amount":"7650.37"}}
$ linr https://api.coinbase.com/v2/prices/BTC-USD/buy -k data.amount

# -u flag is optional, no flag defaults to URL
$ linr -u https://api.coinbase.com/v2/prices/BTC-USD/buy -k data.amount

# response data with array: {"data":[{value: 1}, {value: 2}, {value: 3}]}
$ linr https://array-endpoint.com/data -k data.1.value # will use the value `2` from the data above

# single header added to requests (cURL compatible)
$ linr https://api.coinbase.com/v2/prices/BTC-USD/buy -k data.amount -H "x-my-header: the_value"

# multiple headers
$ linr https://api.coinbase.com/v2/prices/BTC-USD/buy -k data.amount -H "x-my-header: the_value" -H "Another: header"

# wait 1 second between subsequent requests
$ linr https://api.coinbase.com/v2/prices/BTC-USD/buy -k data.amount -d 1000

# POST request w/ body added
$ linr http://post-that-does-not-work.net -k value -X POST -b "{\\"key\\":\\"value\\"}"
```

## CLI Parameters

1. `-u|--url|no flag` **url** *REQUIRED*: the HTTP endpoint with the data you would like to chart
2. `-X|--request` **method**: the method/verb of the request (same format as cURL) -- GET, POST, etc. (default GET)
3. `-H|--header` **headers**: a header to pass with the requests (same format as cURL) to get the data, pass multiple headers with multiple CLI parameters (most likely API keys or authentication headers) (default `null`)
4. `-p|--params` **query string params**: query string parameters to pass to the endpoint (ex. -p key=value) (default `null`)
5. `-b|--body` **body params**: parameters to pass to the endpoint in the body for POST requests (ex. -b "{\\"key\\":\\"value\\"}") (default `null`)
6. `-k|--key` **JSON data key**: a string representing the structure of the returned JSON object. If not provided, linr expects plain text of just a numerical value returned (default `null`, meaning expecting plain text value from endpoint)
7. `-d|--delay` **delay between requests**: number of milliseconds to wait between subsequent requests (default 100 milliseconds)

## Special Thanks

The charts are ASCII charts built using [asciichart](https://github.com/kroitor/asciichart). Thanks to the author/contributors for building such a cool and easy to use, free (MIT License) tool!