const API_KEY = 'CRMUJ20OJST6VARK';

const fetchStockLive = (StockSymbol, setStockLive) => {
	let API_Call_Live = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${StockSymbol}&apikey=${API_KEY}`;
	fetch(API_Call_Live)
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			setStockLive(data);
		});
};

export default fetchStockLive;
