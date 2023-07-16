const Discord = require("discord.js");
const token =
	"MTEyOTgxNjc3NTM0MTY1ODE4Mw.GFkxnt.9J-LheOmkOkLPrL55oQFgBOy2qBnfmaJm1iOy8";

const bot = new Discord.Client();

bot.on("ready", () => {
	console.log(`Logged in as ${bot.user.tag}`);
});

bot.login(token);
