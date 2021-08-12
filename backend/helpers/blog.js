exports.excerptTrim = (data, length) => {
	if (data.length < length) return data;

	let trimmedData = data.trim().substring(0, length);
	return `${trimmedData} ...`;
};
