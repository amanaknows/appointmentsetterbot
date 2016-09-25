const bot = require('../bot/bot');
const funcs = require('../db/functions');

module.exports = function(app, config) {

  // Index route
  app.get('/', function (req, res) {
    res.sendFile(config.rootPath + '/public/index.html');
  });

  // for facebook verification
  app.get('/webhook/', function (req, res) {
  	if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
  		res.send(req.query['hub.challenge']);
  	}
  	res.send('Error, wrong token');
  });

  // to post data
  app.post('/webhook/', function (req, res) {
  	let messaging_events = req.body.entry[0].messaging
  	for (let i = 0; i < messaging_events.length; i++) {
  		let event = req.body.entry[0].messaging[i]
  		let sender = event.sender.id.toString();
  		if (event.message && event.message.text) {
  			let text = event.message.text.toLowerCase();
  			if (text === 'generic') {
  				bot.sendGenericMessage(sender)
  				continue
  			}
  			bot.sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
  			if (text === 'hi') {
  				bot.sendUniqueMessage(sender, "Hi, i'm your Bot Booker assistant, what can I do for you?")
  				continue
  			}
  			if (text === 'haircut') {
          funcs.getAvailableUsers(function(avails) {
            bot.sendQuickReplyMessage(sender)
    				bot.sendUniqueMessage(sender, `There are ${avails.length} hair stylists available now.`);
          })
          continue
  			}
  			if (text === 'gordon levitt') {
  				bot.sendUniqueMessage(sender, "You have selected Gordon. His available dates are x, y, z. please pick one")
  				continue
  			}
  			if (text === 'x' || 'y' || 'z') {
  				bot.sendUniqueMessage(sender, "You have selected " + text + " . Thank you!")
  			}
  		}
  		// if (event.postback) {
  		// 	let text = JSON.stringify(event.postback)
  		// 	bot.sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
  		// 	continue
  		// }
  	}
  	res.sendStatus(200)
  });
}
