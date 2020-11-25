require('dotenv').config();
const Discord = require('discord.js');
const essay_bot = new Discord.Client();
const discrete_bot = new Discord.Client();
const ESSAY_TOKEN = process.env.ESSAY_TOKEN;
const DISCRETE_TOKEN = process.env.DISCRETE_TOKEN;
const thesaurus = require('thesaurus');
const fetch = require('node-fetch');
const url = 'https://owlbot.info/api/v4/dictionary/';

const params = {
  method: 'GET',
  headers: {
    'Authorization': `Token ${process.env.API_TOKEN}`
  }
}


get_thesaurus = async (word) => {
  const data = await fetch(`https://www.dictionaryapi.com/api/v3/references/thesaurus/json/${word}?key=${process.env.THESAURUS_KEY}`);
  return await data.json();
}

get_def = async (word) => {
  const data = await fetch(url + word, params);
  return await data.json();
}

essay_bot.login(ESSAY_TOKEN);

essay_bot.on('ready', () => {
  console.info(`Logged in as ${essay_bot.user.tag}!`);
});

essay_bot.on('message', async msg => {
  if (msg.content.startsWith('!synonym')) {
    const word = msg.content.substring(7);
    const synonyms = thesaurus.find(word.trim());
    if (synonyms.length > 0) msg.channel.send(synonyms);
    else msg.channel.send(`Looks like we don't have any synonyms for ${word} :(`);
  } else if (msg.content.startsWith('!def')) {
    const data = await get_def(msg.content.substring(3).trim());
    let message = '';
    if (data[0] === undefined) {
      message += `Pronunciation: ${data.pronunciation}\nWord: ${data.word}\n\n`;
      for (let i = 0; i < data.definitions.length; i++) {
        message += `type: ${data.definitions[i].type}\ndefinition: ${data.definitions[i].definition}\nexample: ${data.definitions[i].example}\n\n`;
      }
    } else message = data[0].message;
    msg.channel.send(message);
  } else if (msg.content.toLowerCase().startsWith('!essay')) {
    let message = '';
    let data = await get_thesaurus(msg.content.substring(6).trim());
    if (data[0].meta === undefined) {
      message = 'Sorry looks like we don\' have that word :(\n';
      message += "Did you mean: ";
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          message += `${data[i]}, `;
        }
      }
      message = message.substring(0, message.length - 2);
      message += '?';
      msg.channel.send(message);
    }
    else {
      let messages = []
      for (let i = 0; i < data.length; i++) {
        if (message.length >= 1500) {
          messages.push(message);
          message = '';
        }
        let relevant_data = data[i].def[0].sseq[0][0][1];
        message += `Definition: ${relevant_data.dt[0][1]}\n`;
        message += `Part of Speech: ${data[i].fl}\n`;
        message += 'Synonyms: ';
        let synonyms = '';
        if (relevant_data.syn_list !== undefined) {
          for (let j = 0; j < relevant_data.syn_list[0].length; j++) {
            synonyms += `${relevant_data.syn_list[0][j].wd}, `;
          }
          message += `${synonyms.substring(0, synonyms.length - 2)}\n`;
        }
        else message += "None\n";
        message += 'Related Words: ';
        if (relevant_data.rel_list !== undefined) {
          let related = '';
          for (let j = 0; j < relevant_data.rel_list.length; j++) {
            for (let k = 0; k < relevant_data.rel_list[j].length; k++) {
              related += `${relevant_data.rel_list[j][k].wd}, `;
            }
          }
          message += `${related.substring(0, related.length - 2)}\n\n`;
        }
        else message += "None\n\n";
      }
      if (messages.length != 0) {
        for (let i = 0; i < messages.length; i++) {
          if (i !== messages.length -1) messages[i] += '...\n';
          msg.channel.send(messages[i]);
        }
      }
      else msg.channel.send(message);
    }

  }
});


discrete_bot.login(DISCRETE_TOKEN);

discrete_bot.on('ready', () => {
  console.info(`Logged in as ${discrete_bot.user.tag}!`);
});

gcd = (a, b) => {
  if (!b) return a;
  else return gcd(b, a % b);
};

discrete_bot.on('message', msg => {
  if (msg.content.toUpperCase().startsWith('!gcd')) {
    let inputs = msg.content.substring(4).trim();
    inputs = inputs.split(' ');
    msg.channel.send(gcd(parseInt(inputs[0]), parseInt(inputs[1])));
  } else if (msg.content.toLowerCase().startsWith('!conversion')) {
    let inputs = msg.content.substring(11).trim();
    inputs = inputs.split(',');
    msg.channel.send(parseInt(inputs[0], inputs[1]));
  } else if (msg.content.toLocaleLowerCase().startsWith('!reverseconversion')) {
    let inputs = msg.content.substring(18).trim();
    inputs = inputs.split(',');
    msg.channel.send((inputs[0] >>> 0).toString(inputs[1]));
  }
})