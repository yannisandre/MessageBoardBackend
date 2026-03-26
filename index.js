var express = require('express'); //import de la bibliothèque Express
var app = express(); //instanciation d'une application Express

var compteur = 0;
var allMsgs = [
  { text: "Hello World", pseudo: "Berlin", date: "2025-09-28T10:00:00.000Z" },
  { text: "foobar", pseudo: "Dautrac", date: "2025-07-28T10:00:00.000Z" },
  { text: "CentraleSupelec Forever", pseudo: "Loupiotte", date: "2025-05-29T10:00:00.000Z" }
];

// Pour s'assurer que l'on peut faire des appels AJAX au serveur
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Ici faut faire faire quelque chose à notre app...
// On va mettre les "routes"  == les requêtes HTTP acceptéés par notre application.

app.get("/", function(req, res) {
  res.send("Hello")
})

app.get("/cpt/query", function(req, res) {
  res.json({ cpt: compteur });
});

app.get("/cpt/inc", function(req, res) {
  var value = req.query.v;

  if (value === undefined) {
    compteur += 1;
    return res.json({ code: 0 });
  }

  if (String(value).match(/^-?\d+$/)) {
    compteur += parseInt(value, 10);
    return res.json({ code: 0 });
  }

  return res.json({ code: -1 });
});

app.get("/msg/getAll", function(req, res) {
  res.json(allMsgs);
});

app.get("/msg/nber", function(req, res) {
  res.json(allMsgs.length);
});

app.get("/msg/get/*", function(req, res) {
  var idxRaw = req.params[0];

  if (!String(idxRaw).match(/^\d+$/)) {
    return res.json({ code: 0 });
  }

  var idx = parseInt(idxRaw, 10);

  if (idx < 0 || idx >= allMsgs.length) {
    return res.json({ code: 0 });
  }

  return res.json({ code: 1, msg: allMsgs[idx] });
});

app.get("/msg/post/*", function(req, res) {
  var encodedMsg = req.params[0] || "";
  var decodedMsg = unescape(encodedMsg);
  var pseudo = req.query.pseudo || "Anon";
  var decodedPseudo = unescape(String(pseudo)).trim();

  if (decodedPseudo.length === 0) {
    decodedPseudo = "Anon";
  }

  allMsgs.push({
    text: decodedMsg,
    pseudo: decodedPseudo,
    date: new Date().toISOString()
  });
  res.json(allMsgs.length - 1);
});

app.get("/msg/del/*", function(req, res) {
  var idxRaw = req.params[0];

  if (!String(idxRaw).match(/^\d+$/)) {
    return res.json({ code: 0 });
  }

  var idx = parseInt(idxRaw, 10);

  if (idx < 0 || idx >= allMsgs.length) {
    return res.json({ code: 0 });
  }

  allMsgs.splice(idx, 1);
  return res.json({ code: 1 });
});




app.listen(8080); //commence à accepter les requêtes
console.log("App listening on port 8080...");

