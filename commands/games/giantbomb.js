const {RichEmbed} = require('discord.js');
const {Command} = require('discord.js-commando');
const fetch = require('node-fetch');
const token = require('./api.json').giantbomb;

module.exports = class GameInfo extends Command {
    constructor(client) {
        super(client, {
            name: 'gameinfo',
            group: 'games',
            memberName: 'gameinfo',
            description: 'Search up a game!',
            examples: ['c.gameinfo Minecraft'],
            guildOnly: true,
            args: [{
                    key: 'game',
                    prompt: 'Enter a game to search.',
                    type: 'string'
                }
            ]
        });
    }
    async run(msg, {game}) {
        fetch(`https://fortnite-api.tresmos.xyz/profile/${platform}/${user}?key=${token}`)
            .then(res => res.json())
            .then(async (json) => {
                if (json.info.platform === 'pc') {
                    pltm = 'PC';
                } else if (json.info.platform === 'xb1') {
                    pltm = 'Xbox One';
                } else if (json.info.platform === 'ps4') {
                    pltm = 'Playstation 4';
                }
                //Solo Statistics
                var username = json.info.username;
                var soloWins = json.group.solo.wins;
                var soloKD = json.group.solo['k/d'];
                var soloWR = json.group.solo['win%'];
                var soloKills = json.group.solo.kills;
                var soloWasted = json.group.solo.timePlayed;
                var soloScore = json.group.solo.score;
                var soloMatches = json.group.solo.matches;
                const solo = new RichEmbed()
                    .setTitle(`Fortnite Solo Statistics for ${username} [${pltm}]`)
                    .setColor('#FFD700')
                    .setThumbnail(json.info.rank)
                    .addField('Wins:', soloWins, true)
                    .addField('Win Rate:', soloWR + '%', true)
                    .addField('K/D:', soloKD, true)
                    .addField('Kills:', soloKills.toLocaleString('en'), true)
                    .addField('Time Played:', soloWasted, true)
                    .addField('Score:', soloScore, true)
                    .addField('Matches:', soloMatches, true)
                    .setTimestamp()
                    .setFooter(`Torus Development`);
                //Duo Statistics
                var duoWins = json.group.duo.wins;
                var duoKD = json.group.duo['k/d'];
                var duoWR = json.group.duo['win%'];
                var duoKills = json.group.duo.kills;
                var duoWasted = json.group.duo.timePlayed;
                var duoScore = json.group.duo.score;
                var duoMatches = json.group.duo.matches;
                const duo = new RichEmbed()
                    .setTitle(`Fortnite Duos Statistics for ${username} [${pltm}]`)
                    .setColor('#FFD700')
                    .setThumbnail(json.info.rank)
                    .addField('Wins:', duoWins, true)
                    .addField('Win Rate:', duoWR + '%', true)
                    .addField('K/D:', duoKD, true)
                    .addField('Kills:', duoKills.toLocaleString('en'), true)
                    .addField('Time Played:', duoWasted, true)
                    .addField('Score:', duoScore, true)
                    .addField('Matches:', duoMatches, true)
                    .setTimestamp()
                    .setFooter(`Torus Development`);
                //Squad Statistics
                var sqWins = json.group.squad.wins;
                var sqKD = json.group.squad['k/d'];
                var sqWR = json.group.squad['win%'];
                var sqKills = json.group.squad.kills;
                var sqWasted = json.group.squad.timePlayed;
                var sqScore = json.group.squad.score;
                var sqMatches = json.group.squad.matches;
                const squad = new RichEmbed()
                    .setTitle(`Fortnite Squad Statistics for ${username} [${pltm}]`)
                    .setColor('#FFD700')
                    .setThumbnail(json.info.rank)
                    .addField('Wins:', sqWins, true)
                    .addField('Win Rate:', sqWR + '%', true)
                    .addField('K/D:', sqKD, true)
                    .addField('Kills:', sqKills.toLocaleString('en'), true)
                    .addField('Time Played:', sqWasted, true)
                    .addField('Score:', sqScore, true)
                    .addField('Matches:', sqMatches, true)
                    .setTimestamp()
                    .setFooter(`Torus Development`);
                //Lifetime Statistics
                var lifeWins = json.lifetimeStats.wins;
                var lifeKD = json.lifetimeStats['k/d'];
                var lifeWR = json.lifetimeStats['win%'];
                var lifeKills = json.lifetimeStats.kills;
                var lifeWasted = json.lifetimeStats.timePlayed;
                var lifeScore = json.lifetimeStats.score;
                var totalMatches = json.lifetimeStats.matches;
                const lifetime = new RichEmbed()
                    .setTitle(`Fortnite Lifetime Statistics for ${username} [${pltm}]`)
                    .setColor('#FFD700')
                    .setThumbnail(json.info.rank)
                    .addField('Wins:', lifeWins, true)
                    .addField('Win Rate:', lifeWR + '%', true)
                    .addField('K/D:', lifeKD, true)
                    .addField('Kills:', lifeKills.toLocaleString('en'), true)
                    .addField('Time Played:', lifeWasted, true)
                    .addField('Score:', lifeScore, true)
                    .addField('Matches:', totalMatches, true)
                    .setTimestamp()
                    .setFooter(`Torus Development`);
                var lifetimeR = await msg.say(lifetime);
                await lifetimeR.react('🇱');
                await lifetimeR.react('🇸');
                await lifetimeR.react('🇩');
                lifetimeR.react('🇹');
                var mode = 'lifetime';
                const filter = (reaction, user) => (reaction.emoji.name === '🇱' || reaction.emoji.name === '🇸' || reaction.emoji.name === '🇩' || reaction.emoji.name === '🇹') && !user.bot;
                const collector = lifetimeR.createReactionCollector(filter, {
                    time: 100000
                });
                collector.on('collect', async res => {
                    if (res.emoji.name === '🇱' && mode !== 'lifetime') {
                        await lifetimeR.edit(lifetime);
                        mode = 'lifetime';
                    } else if (res.emoji.name === '🇸' && mode !== 'solo') {
                        await lifetimeR.edit(solo);
                        mode = 'solo';
                    } else if (res.emoji.name === '🇩' && mode !== 'duo') {
                        await lifetimeR.edit(duo);
                        mode = 'duo';
                    } else if (res.emoji.name === '🇹' && mode !== 'squad') {
                        await lifetimeR.edit(squad);
                        mode = 'squad';
                    }
                    await res.remove(res.users.last());
                });
                collector.on('end', collected => {
                    lifetimeR.clearReactions();
                });
            })
            .catch(error => {
                console.error(error);
                return msg.say(`No results for player "${user}" on ${pltm} platform.`);
            });
    };
};