const API_KEY = 'CRMUJ20OJST6VARK';

const fetchStock = (StockSymbol, setStockHistory) => {
	let API_Call_History = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${StockSymbol}&outputsize=full&apikey=${API_KEY}`;
	let API_Call_Live = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${StockSymbol}&apikey=${API_KEY}`;
	let stockChartValues = [];
	setStockHistory(['loading']);

	fetch(API_Call_History)
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			for (var date in data['Time Series (Daily)']) {
				if (parseInt(date.substring(0, 4)) >= 2010) {
					stockChartValues.push({
						x: new Date(date),
						y: [
							data['Time Series (Daily)'][date]['1. open'],
							data['Time Series (Daily)'][date]['2. high'],
							data['Time Series (Daily)'][date]['3. low'],
							data['Time Series (Daily)'][date]['4. close'],
						],
					});
				}
			}
			setStockHistory(stockChartValues);
		});
};

export default fetchStock;
