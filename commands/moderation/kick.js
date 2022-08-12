const {Command} = require('discord.js-commando');
const {RichEmbed} = require('discord.js');

module.exports = class Kick extends Command {
    constructor(client) {
        super(client, {
            name: 'kick',
            group: 'moderation',
            memberName: 'kick',
            description: 'Kick a user.',
            examples: ['kick @JoeDiscord#1234 spamming'],
            userPermissions: ['KICK_MEMBERS'],
            clientPermissions: ['KICK_MEMBERS'],
            guildsOnly: true,
            args: [{
                    key: 'member',
                    prompt: 'Please mention member in this server.',
                    type: 'member'
                },
                {
                    key: 'reason',
                    prompt: 'Give reason for the kick.',
                    type: 'string'
                }
            ]
        });
    }
    async run(msg, {
        member,
        reason
    }) {
        const kickembed = new RichEmbed()
            .setTitle('User Kicked')
            .setColor('#FF0000')
            .setThumbnail(member.user.avatarURL)
            .addField('User', member.user.tag + ' (' + member.id + ')')
            .addField('Reason:', reason)
            .addField('Kicked By', msg.author)
        const kickedembed = new RichEmbed()
            .setTitle('You\'ve been kicked from ' + msg.guild.name)
            .addField('Reason:', reason)
            .setColor('#FF0000')
            .addField('Kicked by', msg.author)
        await member.send(kickedembed).catch(e => console.log(e));
        await member.kick(reason + ' kicker: ' + msg.author.tag).catch(error => msg.say(`\`ERROR:\`\n ${error}`));
        await msg.embed(kickembed);
    }
}