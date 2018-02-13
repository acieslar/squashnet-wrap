const express = require("express");
const path = require("path");
const rp = require("request-promise");
const cheerio = require("cheerio");

const app = express();

app.use(express.static(path.join(__dirname, "build")));

function testFunc() {
    return getTournamentsList();
}

async function getTournamentsList() {
    var tournaments = [];
    const r1 = await getTournamentsChunk(1);
    const r2 = await getTournamentsChunk(2);
    const r3 = await getTournamentsChunk(3);
    tournaments = tournaments.concat(r1);
    tournaments = tournaments.concat(r2);
    tournaments = tournaments.concat(r3);
    return tournaments;
}

function getTournamentsChunk(num) {
	return new Promise((resolve, reject) => {
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
				"Accept-Language": "en-US,en;q=0.9",
				"Cookie": "PHPSESSID=0ah7gv1dskdhvvq97292vmncq4; authchallenge=30eee841c94bcc19b56a9a1d5cd4aa04"
			}
		};
		rp(options)
			.then((body) => {
				json = JSON.parse(body);
				var result = [];
				json.rows.forEach((row, idx) => {
					let id = row.id;
					let tdate = row.cell[1];
					let tlink = row.cell[4];
					const $ = cheerio.load(tlink);
					let title = $('a').text();
					result.push({id: id, date: tdate, title: title});
				});
				resolve(result);
			}).catch((err) => {
					console.log(err);
				}
			)
		});
}

app.get("/tournaments", (req, res) => {
  testFunc().then((tlist) => {
		res.send(tlist);
    })
  }
);

app.get("/", function (req, res) {
   res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(3000);
