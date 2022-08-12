const {Command} = require('discord.js-commando');
const fetch = require('node-fetch');
const {RichEmbed} = require('discord.js');
const wgAPIKey = require('./api.json').wg;
module.exports = class warplanes extends Command {
    constructor(client) {
        super(client, {
            name: 'wowp',
            group: 'games',
            memberName: 'wowp',
            description: 'Pulls up player statistics for World of Warplanes.',
            examples: ['c.wowp na LittleBilly'],
            args: [{
                    key: "realm",
                    prompt: "Enter a region.",
                    type: "string",
                    validate: realm => {
                            if (realm === 'ru' || realm === 'na' || realm === 'eu' || realm === 'asia') return true;
                            return 'Enter a valid realm, \`na, ru, eu, asia\`';
                        },
                    parse: realm => realm.toLowerCase()
                },
                {
                    key: "search",
                    prompt: "Enter a search.",
                    type: "string"
                }
            ]
        });
    }
    async run(msg, {realm, search}) {
        var domain = '';
        if (realm === 'ru') {
            domain = 'ru';
        } else if (realm === 'na') {
            domain = 'com';
        } else if (realm === 'eu') {
            domain = 'eu';
        } else if (realm === 'asia') {
            domain = 'asia';
        }
        fetch(`https://api.worldofwarplanes.${domain}/wowp/account/list/?application_id=${wgAPIKey}&search=${search}`)
            .then(res => res.json())
            .then(json => {
                if (json.status === 'error' || json.meta.count === 0) {
                    return msg.say('Player not found. Check spelling.')
                } else {
                    let id = json.data[0].account_id;
                    let wowpEmbed = new RichEmbed();
                    fetch(`https://api.worldofwarplanes.${domain}/wowp/account/info2/?application_id=${wgAPIKey}&account_id=${id}`)
                        .then(res => res.json())
                        .then(json => {
                            let avgxp = json.data[id].statistics.all.avg_xp;
                            let nickname = json.data[id].nickname;
                            let wins = json.data[id].statistics.all.wins;
                            let losses = json.data[id].statistics.all.losses;
                            let battles = json.data[id].statistics.all.battles;
                            let kdr = json.data[id].statistics.all.players.avg_killed;
                            let scoreavg = json.data[id].statistics.all.avg_battle_score;
                            wowpEmbed.setTitle(`World of Warplanes Stats for ${nickname}`)
                                .setColor('#4b5320')
                                .setThumbnail('https://logonoid.com/images/world-of-warplanes-logo.png')
                                .addField('Wins:', wins.toLocaleString('en'), true)
                                .addField('Losses:', losses.toLocaleString('en'), true)
                                .addField('Battles:', battles.toLocaleString('en'), true)
                                .addField('Average XP/Battle:', avgxp.toLocaleString('en'), true)
                                .addField('Average Kills/Battle:', kdr, true)
                                .addField('Average Score:', scoreavg.toLocaleString('en'), true)
                                .setTimestamp();
                               msg.embed(wowpEmbed);
                        });
                }
            }).catch(error => console.error(error));
    }
}
