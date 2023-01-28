import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './Navigation';
import Home from './Home';
import News from './News';

import BuySell from './BuySell';

function App() {
	const [stock, setStock] = useState('');
	const [stockHistory, setStockHistory] = useState([]);
	const [stockLive, setStockLive] = useState({});

	useEffect(() => {
		console.log(stockHistory);
	}, [stockHistory]);

	return (
		<Router>
			<div className="App">
				<Navigation />
				<header className="App-header" style={{ paddingTop: '70px' }}>
					<Routes>
						<Route
							path="/buysell"
							element={
								<BuySell
									stock={stock}
									setStockHistory={setStockHistory}
									stockHistory={stockHistory}
									setStock={setStock}
									stockLive={stockLive}
									setStockLive={setStockLive}
								/>
							}
						/>
						<Route path="/" element={<Home />} />
						<Route path="news" element={<News />} />
					</Routes>
				</header>
			</div>
		</Router>
	);
}

export default App;
