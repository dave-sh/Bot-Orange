/*const {RichEmbed} = require('discord.js');
const {Command} = require('discord.js-commando');
const fetch = require('snekfetch');
const token = require('./api.json').fn;

module.exports = class FNNews extends Command {
    constructor(client) {
        super(client, {
            name: 'fortnitenews',
            group: 'games',
            memberName: 'fortnitenews',
            description: 'Checks the latest Fortnite updates.',
            examples: ['c.fortnitenews'],
            guildsOnly: true,
        });
    }
    async run(message) {
      try {
          let msg = await message.channel.send('Checking news...');
          fetch.get(`https://fortnite-api.tresmos.xyz/news?key=${token}`).then(res => {
              let player = new RichEmbed()
                  .setTitle(`The Latest Fortnite News!`)
                  .setColor('#FFD700')
                  .setImage(res.body.br[2].image)
                  .addField(res.body.br[2].title, res.body.br[2].body)
                  .setDescription('As always, you can check for details on Fortnite\'s Twitter')
                  .setURL('https://twitter.com/FortniteGame?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor')
                  .setFooter(`Fortnite TRN API - Torus Development - `)
              message.channel.send(player);
              msg.delete();
          });
      } catch (error) {
          console.log(error.stack);
          message.channel.send('There was an error with the API.');
      }
    };
};*/