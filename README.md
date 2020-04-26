# linr

Create and refresh a terminal line chart from data fetched via HTTP request. As of today this utility requires that the HTTP endpoint either returns a plain text numerical value only or a JSON object with the value nested inside the JSON. For JSON responses, see the `JSON data key` parameter.

NOTE: linr continues to make HTTP requests to the endpoint specified in the `url` argument until you decide to stop (Ctrl+C). We use exponential backoff in the event that the endpoint is rate limiting, but if it's an API that has quotas per IP address or authenticated via an API key, this utility will go against those quotas.

![Coinbase BTC-USD](https://user-images.githubusercontent.com/13718950/80319524-a93c1d00-87de-11ea-96ab-aa93a51f1543.png | width=100)

## Install

`npm install -g linr`

## Usage/Examples

```sh
$ linr https://www.random.org/integers/ -p num=1 -p min=1 -p max=6 -p col=1 -p base=10 -p format=plain -p rnd=new
$ linr https://api.coinbase.com/v2/prices/BTC-USD/buy -k data.amount
$ linr -u https://api.coinbase.com/v2/prices/BTC-USD/buy -k data.amount
$ linr https://api.coinbase.com/v2/prices/BTC-USD/buy -k data.amount
$ linr https://api.coinbase.com/v2/prices/BTC-USD/buy -k data.amount -H "x-my-header: the_value"
$ linr https://api.coinbase.com/v2/prices/BTC-USD/buy -k data.amount -H "x-my-header: the_value" -H "Another: header"
$ linr https://api.coinbase.com/v2/prices/BTC-USD/buy -k data.amount -d 1000
$ linr https://api.coinbase.com/v2/prices/BTC-USD/buy -k data.amount -d 1000
$ linr http://an-endpoint-that-does-not-work.net -k value -X POST
```

### Parameters

1. url ([NO PARAM]|-u|--url) <REQUIRED>: the JSON endpoint where the data you would like to chart
2. method (-X|--request) <optional>: the method/verb of the request to the request -- GET, POST, etc. (default GET)
3. headers (-H|--header) <optional>: a (or multiple) headers to add to the requests to get the data (most likely API keys or authentication headers)
4. JSON data key (-k|--key) <optional>: a string representing the structure of the returned JSON object
5. delay between requests (-d|--delay) <optional>: number of millisecodns to wait between subsequent requests (default 100 milliseconds)