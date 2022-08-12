const {RichEmbed} = require('discord.js');
const {Command} = require('discord.js-commando');
module.exports = class FNStats extends Command {
    constructor(client) {
        super(client, {
            name: 'number',
            group: 'games',
            memberName: 'number',
            description: 'Checks a player\'s Fortnite Statistics.',
            examples: ['fortnite \`<user>\` \`<platform>\`', 'fortnite pc Ninja'],
            guildsOnly: true,
            args: [{
                    key: 'number',
                    prompt: 'Enter an integer.',
                    type: 'integer'
                }
            ]
        });
    }
    async run(msg, {number}) {
        try {
            var factorArray = [];
            for(var i = 0; i <= number; i++){
               if(number%i==0){
                   factorArray.push(i);
               }
            }
            msg.say(factorArray.toString());
        } catch (error) {
            console.log(error.stack);
            msg.say('There was an error with the API.');
        }
    };
};
