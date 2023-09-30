import TaoIcon from "../assets/tao_icon.png";

export const Footer = () => {
	return (
		<footer className="new-site-footer">
			<div className="container">
				<div className="footer-cover">
					<div className="footer-top">
						<div className="ft-left">
							<div className="logo-tegline">
								<img src={TaoIcon} /> Powered by Bittensor
							</div>
							<p>
                τaostats is a Block Explorer and Analytics Platform for
                Bittensor, a decentralized machine learning network.
							</p>
							<p>This site is not affiliated with the Opentensor Foundation.</p>
							<p>
                The content of this website is provided for information purposes
                only.
								<br />
                No claim is made as to the accuracy or currency of the content
                on this site at any time.
							</p>
							<p>
                τaosτaτs is created and maintained by{" "}
								<a
									href="https://twitter.com/mogmachine"
									target="_blank"
									rel="noreferrer"
								>
                  mogmachine
								</a>
                . We hope you found it helpful, if you have any suggestions or
                issues please contact us at{" "}
								<a href="mailto:taostats@mogmachine.com">
                  taostats@mogmachine.com
								</a>
                .
							</p>
						</div>
						<div className="ft-right">
							<div className="f-col">
								<h5>Tao Stats</h5>
								<ul>
									<li>
										<a href="#">About Us</a>
									</li>
									<li>
										<a href="#">Contact Us</a>
									</li>
									<li>
										<a href="#">Careers</a>
									</li>
									<li>
										<a href="#">Terms of Service</a>
									</li>
									<li>
										<a href="#">Bug Bounty</a>
									</li>
								</ul>
							</div>
							<div className="f-col">
								<h5>Community</h5>
								<ul>
									<li>
										<a href="#">API Documentation</a>
									</li>
									<li>
										<a href="#">Knowledge Base</a>
									</li>
									<li>
										<a href="#">Network Status</a>
									</li>
									<li>
										<a href="#">Newsletters</a>
									</li>
									<li>
										<a href="#">Disqus Comments</a>
									</li>
								</ul>
							</div>
							<div className="f-col">
								<h5>Products &amp; Services</h5>
								<ul>
									<li>
										<a href="#">Advertise</a>
									</li>
									<li>
										<a href="#">Explorer as a Service</a>
									</li>
									<li>
										<a href="#">API Plans</a>
									</li>
									<li>
										<a href="#">Item 1</a>
									</li>
									<li>
										<a href="#">Item 2</a>
									</li>
									<li>
										<a href="#">Item 3</a>
									</li>
									<li>
										<a href="#">Item 4</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
					<div className="footer-bottom">
						<div className="copyright">
							<p>Taostats ©2023.</p>
						</div>
						<p>
              If you would like to show your support then please consider
              delegating{" "}
							<a
								href="https://delegate.taostats.io/staking?hkey=5Hddm3iBFD2GLT5ik7LZnT3XJUnRnN8PoeCFgGQgawUVKNm8"
								style={{ color: "#14dec2" }}
							>
                stake to the taostats.io validator
							</a>
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
};
