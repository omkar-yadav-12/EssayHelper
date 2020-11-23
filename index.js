require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
const TOKEN = "NzgwMTgxNDgwMTg5NzIyNjM1.X7rWnw.cF9xPgfwWO-nsfEgBn0upp0avTw";
const thesaurus = require('thesaurus');
const word_definition = require('word-definition');
bot.login(TOKEN);

bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});

function definition (word) {
  word_definition.getDef(word, "en", null, function(definition) {
    console.log(definition)
    return definition
  })
}

bot.on('message', async msg => {
  if (msg.content === 'ping') {
    msg.reply('pong');
    msg.channel.send('pong');
  } else if (msg.content.startsWith('synonym')) {
    const word = msg.content.substring(7);
    const synonyms = thesaurus.find(word.trim());
    let response = "";
    // for (synonym in synonyms) {
    //   console.log(await definition(synonym))
    // }
    if (synonyms.length > 0) msg.channel.send(synonyms);
    else msg.channel.send(`Looks like we don't have any synonyms for ${word} :(`)
  } else if (msg.content.startsWith('!kick')) {
    if (msg.mentions.users.size) {
      const taggedUser = msg.mentions.users.first();
      msg.channel.send(`You wanted to kick: ${taggedUser.username}`);
    } else {
      msg.reply('Please tag a valid user!');
    }
  }
});
