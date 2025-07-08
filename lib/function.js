import axios, { isAxiosError } from "axios";

export function convert(ms) {
	var minutes = Math.floor(ms / 60000);
	var seconds = ((ms % 60000) / 1000).toFixed(0);
	return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

export function kyun(seconds) {
	seconds = Number(seconds);
	var d = Math.floor(seconds / (3600 * 24));
	var h = Math.floor((seconds % (3600 * 24)) / 3600);
	var m = Math.floor((seconds % 3600) / 60);
	var s = Math.floor(seconds % 60);
	var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
	var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
	var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
	var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
	return dDisplay + hDisplay + mDisplay + sDisplay;
}

export const getBuffer = async (url, response = {}) =>
	new Promise(async (resolve, reject) => {
		await axios
			.request({
				method: response.method || "GET",
				url,
				headers: {
					DNT: 1,
					"Upgrade-Insecure-Request": 1,
					"User-Agent":
						"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36",
				},
				responseType: response.type || "arraybuffer",
			})
			.then(({ data }) => {
				if (isAxiosError()) throw "axios error";
				resolve(data);
			})
			.catch(reject);
	});
