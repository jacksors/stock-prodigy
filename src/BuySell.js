import fetchStock from './stock';
import fetchStockLive from './stockLive';
import './App.css';
import LoadingIcons from 'react-loading-icons';
import { useState, useEffect } from 'react';
import { ButtonGroup, ToggleButton, Form, Button } from 'react-bootstrap';
import StockChart from './StockChart';
import Select from 'react-select';
import nasdaq from './nasdaqStocks';
import sandp from './sandpStocks';

const BuySell = (props) => {
	const [loading, setLoading] = useState(false);
	const [chartType, setChartType] = useState('candlestick');
	const [exchange, setExchange] = useState('nasdaq');
	const [options, setOptions] = useState([]);
	const [operation, setOperation] = useState('buy');
	const [price, setPrice] = useState(0);
	const [quantity, setQuantity] = useState(0);

	useEffect(() => {
		if (exchange === 'sandp') {
			setOptions(
				sandp.map((stock) => {
					return {
						value: stock.Symbol,
						label: stock.Symbol + ' - ' + stock.Name,
					};
				})
			);
		} else {
			if (exchange === 'nasdaq') {
				setOptions(
					nasdaq.map((stock) => {
						return {
							value: stock.Symbol,
							label: stock.Symbol + ' - ' + stock['Company Name'],
						};
					})
				);
			}
		}
		console.log(options);
	}, [exchange]);

	useEffect(() => {
		if (props.stockHistory) {
			if (props.stockHistory.length > 0) {
				if (chartType === 'line') {
					props.setstockHistory(
						props.stockHistory.map((data) => {
							console.log((data['y'] = data['y'].slice(3)));
						})
					);
				}
			}
		}
	}, [chartType]);

	useEffect(() => {
		if (props.stockHistory) {
			if (props.stockHistory.length > 0) {
				setLoading(false);
			}
		}
	}, [props.stockHistory]);

	useEffect(() => {
		if (props.stockLive) {
			setPrice(
				(
					parseInt(props.stockLive.MarketCapitalization) /
					parseInt(props.stockLive.SharesOutstanding)
				).toFixed(2)
			);
		}
	}, [props.stockLive]);

	return (
		<div className="BuySell">
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				{window.innerWidth > 720 ? (
					<ButtonGroup
						aria-label="Basic example"
						style={{ position: 'flex-start' }}
					>
						<ToggleButton
							variant="secondary"
							type="checkbox"
							defaultChecked="true"
							checked={exchange === 'nasdaq'}
							style={{
								width: '8vw',
								minWidth: '50px',
								textAlign: 'center',
							}}
							onClick={() => {
								setExchange('nasdaq');
							}}
						>
							NASDAQ
						</ToggleButton>
						<ToggleButton
							variant="secondary"
							type="checkbox"
							defaultChecked="false"
							checked={exchange === 'sandp'}
							style={{
								width: '8vw',
								minWidth: '50px',
								textAlign: 'center',
							}}
							onClick={() => {
								setExchange('sandp');
							}}
						>
							S&P 500
						</ToggleButton>
					</ButtonGroup>
				) : (
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<ToggleButton
							variant="secondary"
							type="checkbox"
							defaultChecked="true"
							checked={exchange === 'nasdaq'}
							style={{
								width: '20vw',
								textAlign: 'center',
							}}
							onClick={() => {
								setExchange('nasdaq');
							}}
						>
							NASDAQ
						</ToggleButton>
						<ToggleButton
							variant="secondary"
							type="checkbox"
							defaultChecked="false"
							checked={exchange === 'sandp'}
							style={{
								width: '20vw',
								textAlign: 'center',
							}}
							onClick={() => {
								setExchange('sandp');
							}}
						>
							S&P 500
						</ToggleButton>
					</div>
				)}

				<div
					style={{
						width: '30vw',
						color: 'black',
						minWidth: '240px',
						marginLeft: '10px',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<Select
						options={options}
						menuPlacement="auto"
						menuPosition="fixed"
						onChange={(e) => {
							props.setStock(e.value);
							fetchStock(e.value, props.setStockHistory);
							fetchStockLive(e.value, props.setStockLive);
							setLoading(true);
						}}
					/>
				</div>
			</div>
			{loading ? (
				<LoadingIcons.ThreeDots
					fill="#fff"
					width="3vw"
					style={{ margin: '2vw' }}
				/>
			) : (
				<></>
			)}
			{props.stockHistory ? (
				<>
					{props.stockHistory.length > 0 ? (
						<>
							<div className="chartContainer">
								{chartType === 'candlestick' ? (
									<StockChart
										stockHistory={props.stockHistory}
										chartType={'candlestick'}
									/>
								) : (
									<StockChart
										stockHistory={props.stockHistory}
										chartType={'line'}
									/>
								)}
								{/* <ButtonGroup aria-label="Basic example">
								<Button
									variant="secondary"
									style={{
										width: '8vw',
										minWidth: '50px',
										textAlign: 'center',
									}}
									onClick={() => setChartType('line')}
								>
									{' '}
									Line{' '}
								</Button>
								<Button
									variant="secondary"
									style={{
										width: '8vw',
										minWidth: '50px',
										textAlign: 'center',
									}}
									onClick={() => setChartType('candlestick')}
								>
									{' '}
									Candlestick{' '}
								</Button>
							</ButtonGroup> */}
								<div
									style={{
										display: 'flex',
										flexDirection: 'column',
										width: '10vw',
										marginLeft: '10px',
									}}
								>
									<p>
										Current Price: {'$'}
										{price} per Share
									</p>
									<p>Shares: {props.stockLive.SharesOutstanding}</p>
									<p>Market Cap: ${props.stockLive.MarketCapitalization}</p>
									<p>Price per Earning: {props.stockLive.PERatio}x</p>
									<p>
										Dividend Yield:{' '}
										{(props.stockLive.DividendYield * 100).toFixed(2)}
										{'%'}
									</p>
								</div>
							</div>
							<div
								style={{
									flex: 'display',
									flexDirection: 'row',
									width: '50vw',
									justifyContent: 'center',
									alignItems: 'center',
								}}
							>
								<ButtonGroup style={{ marginBottom: '6px' }}>
									<ToggleButton
										variant="secondary"
										type="checkbox"
										defaultChecked="true"
										checked={operation === 'buy'}
										style={{
											width: '8vw',
											minWidth: '50px',
											textAlign: 'center',
										}}
										onClick={() => setOperation('buy')}
									>
										Buy
									</ToggleButton>
									<ToggleButton
										variant="secondary"
										type="checkbox"
										defaultChecked="false"
										checked={operation === 'sell'}
										style={{
											width: '8vw',
											minWidth: '50px',
											textAlign: 'center',
										}}
										onClick={() => setOperation('sell')}
									>
										Sell
									</ToggleButton>
								</ButtonGroup>
								<Form.Control
									type="number"
									placeholder="Enter number of shares"
									style={{
										display: 'inline',
										width: '20vw',
										marginLeft: '10px',
									}}
									onChange={(e) => setQuantity(e.target.value)}
								></Form.Control>
								<Button
									variant="primary"
									style={{
										display: 'inline',
										width: 'auto',
										textAlign: 'center',
										marginLeft: '10px',
										marginBottom: '6px',
									}}
								>
									{operation === 'buy' ? 'Buy' : 'Sell'}
								</Button>
							</div>
							<p style={{ marginTop: '3px' }}>
								Total Price {operation === 'buy' ? 'Bought' : 'Sold'}: $
								{quantity * price}
							</p>
						</>
					) : (
						<></>
					)}
				</>
			) : (
				<></>
			)}
		</div>
	);
};

export default BuySell;
