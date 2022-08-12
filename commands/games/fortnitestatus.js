const {RichEmbed} = require('discord.js');
const {Command} = require('discord.js-commando');
const fetch = require('snekfetch');
let statusIndicator = '';
const token = require('./api.json').fn;
module.exports = class FNStatus extends Command {
    constructor(client) {
        super(client, {
            name: 'fortnitestatus',
            group: 'games',
            memberName: 'fortnitestatus',
            description: 'Checks Fortnite Server Status.',
            examples: ['p.fortnitestatus'],
            guildsOnly: true,
        });
    }
    async run(message) {
         try {
             let msg = await message.channel.send('Checking status...');
             fetch.get(`https://fortnite-api.tresmos.xyz/status?key=${token}`).then(res => {
                 if(res.body.status === 'Online'){
                    statusIndicator = '✅';
                 }else{
                    statusIndicator = '❌';
                 }
                 let player = new RichEmbed()
                     .setTitle(`Fortnite Server Status`)
                     .setColor('#FFD700')
                     .setThumbnail('http://media.comicbook.com/2018/04/00xj0ekhrv901-1--1101417.jpeg')
                     .addField('🖧Server Status:', res.body.status + statusIndicator)
                     .setFooter(`Fortnite TRN API-Torus Development-${message.createdAt}`)
                 message.channel.send(player);
                 msg.delete();
             });
         } catch (error) {
             console.log(error.stack);
             message.channel.send('There was an error with the API.');
         }
    };
};