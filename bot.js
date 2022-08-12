const{CommandoClient} = require('discord.js-commando');
const path = require('path');
const TOKEN = require('./config.json').token;
const client = new CommandoClient({
    commandPrefix: 'c.',
    owner: '',
    disableEveryone: true,
    unknownCommandResponse: false
});

client.registry.registerDefaultTypes()
.registerGroups([
    ['mini-games', 'Fun Mini Games!'],
    ['games', 'Game Statistics'],
    ['finance', 'Finance'],
    ['moderation','Moderation'],
    ['userinfo', 'Guild and User Information'],
    ['support', 'Support']
])
.registerDefaultGroups()
.registerDefaultCommands()
.registerCommandsIn(path.join(__dirname, 'commands'));

client.on('ready',()=>{
    console.log(`Bot Orange went online @ ${Date.now()}`);
    client.user.setActivity('c.help');
});

client.login(TOKEN);