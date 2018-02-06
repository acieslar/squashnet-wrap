const tournaments = document.querySelector("div#tournaments");

fetch("/tournaments")
  .then((response) => {
    return response.json();
  })
  .then((json) => {
    var tablestr = "<table>";
    json.forEach((item) => {
      tablestr += "<tr><td>"+item.num+"</td><td>"+item.date+"</td><td>"+item.title+"</td></tr>";
    });
    tablestr += "</table>";
    tournaments.innerHTML = tablestr;
  });
