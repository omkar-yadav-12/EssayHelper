require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
const TOKEN = process.env.DIS_TOKEN;
const thesaurus = require('thesaurus');
const fetch = require('node-fetch');
const url = 'https://owlbot.info/api/v4/dictionary/';

const params = {
  method: 'GET',
  headers: {
    'Authorization': `Token ${process.env.API_TOKEN}`
  }
}


get_def = async (word) => {
  let data = await fetch(url + word, params);
  return await data.json();
}

bot.login(TOKEN);

bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', async msg => {
  if (msg.content.startsWith('synonym')) {
    let word = msg.content.substring(7);
    let synonyms = thesaurus.find(word.trim());
    if (synonyms.length > 0) msg.channel.send(synonyms);
    else msg.channel.send(`Looks like we don't have any synonyms for ${word} :(`)
  } else if (msg.content.startsWith('def')) {
    const data = await get_def(msg.content.substring(3).trim());
    console.log(data);
    let message = "";
    if (data[0] === undefined) {
      for (let i = 0; i < data.definitions.length; i++) {
        message += `type: ${data.definitions[i].type}\ndefinition: ${data.definitions[i].definition}\nexample: ${data.definitions[i].example}\n\n`;
      }
    }
    else message = data[0].message;
    msg.channel.send(message);
  }
});
