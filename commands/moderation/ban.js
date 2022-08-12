const {Command} = require('discord.js-commando');
const {RichEmbed} = require('discord.js');

module.exports = class Ban extends Command {
    constructor(client) {
        super(client, {
            name: 'ban',
            group: 'moderation',
            memberName: 'ban',
            description: 'Ban a user.',
            examples: ['Ban fyre for annoying me.'],
            userPermissions: ['BAN_MEMBERS'],
            clientPermissions: ['BAN_MEMBERS'],
            guildsOnly: true,
            args: [{
                    key: 'member',
                    prompt: 'Please mention member in this server.',
                    type: 'member'
                },
                {
                    key: 'reason',
                    prompt: 'Give reason for the ban.',
                    type: 'string'
                }
            ]
        });
    }
    async run(msg, {member,reason}) {
        const banembed = new RichEmbed()
            .setTitle('User banned')
            .setColor('#FF0000')
            .setThumbnail(member.user.avatarURL)
            .addField('User', member.user.tag + ' (' + member.id + ')')
            .addField('Reason:', reason)
            .addField('Banned By', msg.author)
        const bannedembed = new RichEmbed()
            .setTitle('You\'ve been Banned from ' + msg.guild.name)
            .addField('Reason:', reason)
            .setColor('#FF0000')
            .addField('Banned by', msg.author)
        await member.send(bannedembed).catch(e => console.log(e));
        await member.ban(reason + ' kicker: ' + msg.author.tag).catch(error => msg.say(`\`ERROR:\`\n ${error}`));
        await msg.embed(banembed) //.then(sent => {sent.delete(120000);});
    }
}