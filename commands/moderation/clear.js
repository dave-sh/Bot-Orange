const {Command} = require('discord.js-commando');
const {RichEmbed} = require('discord.js');

module.exports = class Purge extends Command {
    constructor(client) {
        super(client, {
            name: 'clear',
            group: 'moderation',
            memberName: 'clear',
            description: 'Deletes messages',
            guildsOnly: true,
            userPermissions: ['MANAGE_MESSAGES'],
            clientPermissions: ['MANAGE_MESSAGES'],
            args: [{
                key: 'messageCount',
                prompt: 'Enter number of messages to delete.',
                type: 'integer'
            }]
        });
    }
    async run(msg, {messageCount}){
        let guild = msg.channel;
        await guild.bulkDelete(messageCount+1);
        await msg.say(`${messageCount} message(s) 🔥.`);
    }
}