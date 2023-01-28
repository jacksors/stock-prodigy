import React from 'react';
import { useState, useEffect } from 'react';
import {
	Container,
	Row,
	Col,
	ToggleButton,
	ButtonGroup,
} from 'react-bootstrap';
import { redirect } from 'react-router-dom';
import Select from 'react-select';
import nasdaq from './nasdaqStocks';
import sandp from './sandpStocks';

const API_KEY = 'CRMUJ20OJST6VARK';

const fetchNews = (stock, setNews) => {
	if (stock !== '') {
		fetch(
			`https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${stock}&apikey=${API_KEY}`
		)
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				console.log(data);
				if (
					data.Information ===
					'Invalid inputs. Please refer to the API documentation https://www.alphavantage.co/documentation#newsapi and try again.'
				) {
					setNews(['No news found']);
				} else {
					console.log('Found news');
					setNews(data.feed);
				}
			});
	}
};

const News = () => {
	const [news, setNews] = useState([]);
	const [search, setSearch] = useState('');
	const [exchange, setExchange] = useState('nasdaq');
	const [options, setOptions] = useState([]);

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

	return (
		<div
			className="News"
			style={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<h1>News</h1>
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					width: '40vw',
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
							defaultChecked="true"
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
							defaultChecked="true"
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
							setSearch(e.value);
							fetchNews(e.value, setNews);
						}}
					/>
				</div>
			</div>
			<Container fluid style={{ padding: '30px' }}>
				<Row>
					{news.length > 1 ? (
						news.map((article) => (
							<Col xs={4} sm={3} md={2} lg={2}>
								<a
									style={{
										display: 'block',
										justifyContent: 'center',
										alignItems: 'center',
										textAlign: 'center',
										padding: '10px',
										backgroundColor: '#1f2937',
										borderRadius: '10px',
										outline: '2px solid #374151',
										marginBottom: '15px',
										textDecoration: 'none',
									}}
									href={article.url}
									target="_blank"
									rel="noopener noreferrer"
								>
									<img
										src={
											article.banner_image != ''
												? article.banner_image
												: 'https://nbhc.ca/sites/default/files/styles/article/public/default_images/news-default-image%402x_0.png?itok=B4jML1jF'
										}
										alt="article banner"
										style={{
											width: '12vw',
											height: '9vw',
											objectFit: 'cover',
											cursor: 'pointer',
											borderRadius: '5px',
											minWidth: '100px',
											minHeight: '100px',
										}}
									/>
									<p
										style={{
											fontSize: '1.0rem',
											cursor: 'pointer',
											textDecoration: 'none',
											color: 'white',
											marginTop: '5px',
										}}
									>
										{article.title.length > 30
											? article.title.substring(0, 38) + '...'
											: article.title}
									</p>
								</a>
							</Col>
						))
					) : news.length === 1 ? (
						<p>No News Found</p>
					) : (
						<></>
					)}
				</Row>
			</Container>
		</div>
	);
};

export default News;
