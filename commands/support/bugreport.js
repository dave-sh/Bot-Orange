const {Command} = require('discord.js-commando');
const {RichEmbed} = require('discord.js');

module.exports = class Report extends Command {
    constructor(client) {
        super(client, {
            name: 'bugreport',
            group: 'support',
            memberName: 'bugreport',
            description: 'Report bugs to the Orange Testing Server.',
            examples: ['c.bugreport Dice roll does not work.'],
            guildsOnly: true,
            args: [{
                    key: 'bug',
                    prompt: 'Please mention something.',
                    type: 'string'
                }
            ]
        });
    }
    async run(msg, {bug}) {
        const bugembed = new RichEmbed()
            .setTitle('Bug Report')
            .setColor('#FF0000')
            .setThumbnail(msg.author.avatarURL)
            .addField('Bug:', bug)
            .addField('Reported By:', msg.author.tag + ' (' + msg.author.id + ')')
        await client.channels.get('497518078771593227').embed(bugembed);
    }
}