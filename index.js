require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
const TOKEN = process.env.DIS_TOKEN;
const thesaurus = require('thesaurus');

bot.login(TOKEN);

bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});


bot.on('message', async msg => {
  if (msg.content.startsWith('synonym')) {
    const word = msg.content.substring(7);
    const synonyms = thesaurus.find(word.trim());
    if (synonyms.length > 0) msg.channel.send(synonyms);
    else msg.channel.send(`Looks like we don't have any synonyms for ${word} :(`)
  } 
});
