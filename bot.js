const Discord = require("discord.js");
const token = BOT_TOKEN;

const bot = new Discord.Client();

bot.on("ready", () => {
	console.log(`Logged in as ${bot.user.tag}`);
});

bot.login(token);
