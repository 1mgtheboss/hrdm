function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}
setInterval(function() {
  var informationstore = [
    "We won’t \"take a company public without diversity on its board\": David Solomon, CEO, Goldman Sachs <sup><a href='https://www.washingtonpost.com/business/2020/01/23/goldman-sachs-ceo-says-it-wont-take-companies-public-without-diverse-board-member/'>[1]</a></sup>",
    "[...] \"when there is an optimal gender balance within an organisation, employee engagement increases by 4 percentage points, gross profit increases by 23% and brand image strengthens by 5 percentage points\": Sodexo <sup><a href='https://www.digitalrepublictalent.com/2019/04/02/10-companies-around-the-world-that-are-embracing-diversity-in-a-big-way/'>[2]</a></sup>",
    "\"Diversity is what drives better insights, better decisions, and better products. It is the backbone of innovation\": Mastercard <sup><a href='http://newsroom.mastercard.com/wp-content/uploads/2014/05/NYUStern-Commencement-Address-2014-As-Prepared-for-Delivery.pdf'>[3]</a></sup>"
  ];
  document.getElementById("information").innerHTML =
    informationstore[getRandomInt(0, 3)];
}, 3000);
document.getElementById("get-insight").addEventListener("click", function() {
  var headers = {
    "QB-Realm-Hostname": "REDACTED",

    Authorization: "QB-USER-TOKEN REDACTED",
    "Content-Type": "application/json"
  };
  var body = { from: "REDACTED", select: [6, 22, 26] };

  const xmlHttp = new XMLHttpRequest();
  xmlHttp.open("POST", "https://api.quickbase.com/v1/records/query", true);
  for (const key in headers) {
    xmlHttp.setRequestHeader(key, headers[key]);
  }
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState === XMLHttpRequest.DONE) {
      var data = JSON.parse(xmlHttp.responseText).data;

      var totalno = data.length;
      var diversityno = 0;

      if (
        document.getElementById("diversity").value === "M" ||
        document.getElementById("diversity").value === "F"
      ) {
        for (var i = 0; i < totalno; i++) {
          if (
            data[i]["22"]["value"] ===
            document.getElementById("diversity").value
          ) {
            diversityno++;
          }
        }
      } else {
        for (var i = 0; i < totalno; i++) {
          if (
            data[i]["26"]["value"] ===
            document.getElementById("diversity").value
          ) {
            diversityno++;
          }
        }
      }

      var percentvalue = ((diversityno * 100) / totalno).toFixed(2);
      var requiredvalue = parseFloat(document.getElementById("percent").value);
      if (percentvalue < requiredvalue) {
        var requiredvalueindecimal = requiredvalue / 100;
        var needtohire = (
          (requiredvalueindecimal * totalno - diversityno) /
          (-requiredvalueindecimal + 1)
        ).toFixed(0);
        document.getElementById("result").innerHTML =
          "You have failed to meet the diversity goal. (" +
          percentvalue +
          " %)<br><br>Advice: You need to hire " +
          needtohire +
          " " +
          document.getElementById("diversity").options[
            document.getElementById("diversity").selectedIndex
          ].text +
          " persons to meet your diversity goal.";
      } else {
        document.getElementById("result").innerHTML =
          "You have successfully met the diversity goal. (" +
          percentvalue +
          " %)";
      }
    }
  };

  xmlHttp.send(JSON.stringify(body));
});
