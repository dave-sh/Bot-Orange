const {RichEmbed} = require('discord.js');
const {Command} = require('discord.js-commando');
module.exports = class Jimmy extends Command {
    constructor(client) {
        super(client, {
            name: 'trap',
            group: 'games',
            memberName: 'trap',
            description: 'Traps the next person to talk.',
            examples: ['trap'],
            guildsOnly: true
        });
    }
    async run(msg) {
        let embed = new RichEmbed()
        .setTitle('TRAPPED!')
        .setImage('https://media.discordapp.net/attachments/467481453651951616/509551970864857088/8ab97bb-1.png?width=679&height=670');
        msg.embed(embed);
    };
};
