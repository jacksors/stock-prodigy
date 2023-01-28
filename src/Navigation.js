import React from 'react';
import { Navbar, Nav, Container, Image } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navigation = () => {
	return (
		<>
			<Navbar
				collapseOnSelect
				fixed="top"
				expand="sm"
				variant="dark"
				style={{ padding: '2vh', backgroundColor: '#1f2937' }}
			>
				<Container>
					<Image
						src={require('./logo.png')}
						width={'50vw'}
						style={{ paddingRight: '0.75vw' }}
					/>
					<Navbar.Brand href="/">Stock Prodigy</Navbar.Brand>
					<Navbar.Toggle aria-controls="responsive-navbar-nav" />
					<Navbar.Collapse id="responsive-navbar-nav">
						<Nav>
							<Nav.Link href="/">Home</Nav.Link>
							<Nav.Link href="/buysell">Buy/Sell</Nav.Link>
							<Nav.Link href="/news">News</Nav.Link>
							<Nav.Link href="/portfolio">Portfolio</Nav.Link>
							<Nav.Link href="/profile">Profile</Nav.Link>
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</>
	);
};

export default Navigation;
