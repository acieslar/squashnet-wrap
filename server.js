const express = require("express");
const path = require("path");
const request = require("request");
const cheerio = require("cheerio");

const app = express();

app.use(express.static(path.join(__dirname, "build")));

function loadWiki(callback) {
	this.result = [];
	this.count = 0;
	this.num = 0;
	var getTournamentPage = (num) => {
		var url = "https://www.squashnet.fr/Src/index.php?ajax=1&bnAction=132359";
		var options = {
			url: url,
			method : "POST",
			form: {"_search":false, "nd":1517867715515, "rows":25, "page":num, "sidx":2, "sord":"asc"},
			headers: {
				"Accept": "application/json, text/javascript, */*; q=0.01",
				"Connection": "keep-alive",
				"Origin": "https://www.squashnet.fr",
				"X-Requested-With":"XMLHttpRequest",
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36",
				"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
				"Referer": "https://www.squashnet.fr/Src/",
				//"Accept-Encoding": "gzip, deflate, br",
				"Accept-Language": "en-US,en;q=0.9",
				"Cookie": "PHPSESSID=0ah7gv1dskdhvvq97292vmncq4; authchallenge=30eee841c94bcc19b56a9a1d5cd4aa04"
			}
		};
		request
			.post(options, (error, res, body) => {
				json = JSON.parse(body);
				json.rows.forEach((row, idx) => {
					let tdate = row.cell[1];
					let tlink = row.cell[4];
					const $ = cheerio.load(tlink);
					this.num++;
					let title = $('a').text();
					this.result.push({num: this.num, date: tdate, title: title});
				});
				this.count++;
				if (this.count==3) {
					console.log(`Callback: ${this.result}`);
					callback(this.result);
				}
			});
	}
	getTournamentPage(1);
	getTournamentPage(2);
	getTournamentPage(3);
}

app.get("/tournaments", (req, res) => {
  loadWiki((body) => {
		res.send(body);
	});
}); 

app.get("/", function (req, res) {
   res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(3000);
