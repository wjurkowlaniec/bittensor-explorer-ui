export const shortenHash = (
	hash?: string,
	proceding = true,
	leading = true
) => {
	if (!hash || hash.length < 15) {
		return hash;
	}

	return `${proceding ? hash.slice(0, 6) : ""}...${
		leading ? hash.slice(-6) : ""
	}`;
};
