const {Command} = require('discord.js-commando');
const fetch = require('node-fetch');
const {RichEmbed} = require('discord.js');
const wgAPIKey = require('./api.json').wg;
module.exports = class Warships extends Command {
    constructor(client) {
        super(client, {
            name: 'wows',
            group: 'games',
            memberName: 'wows',
            description: 'Pulls up player statistics for World of Warships.',
            examples: ['c.wows na LittleBilly'],
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
        fetch(`https://api.worldofwarships.${domain}/wows/account/list/?application_id=${wgAPIKey}&search=${search}`)
            .then(res => res.json())
            .then(json => {
                if (json.status === 'error' || json.meta.count === 0) {
                    return msg.say('Player not found. Check spelling.')
                } else {
                    let id = json.data[0].account_id;
                    let wowsEmbed = new RichEmbed();
                            fetch(`https://api.worldofwarships.${domain}/wows/account/info/?application_id=${wgAPIKey}&account_id=${id}`)
                            .then(res => res.json())
                            .then(json =>{
                                let nickname = json.data[id].nickname;
                                let tier = json.data[id].leveling_tier;
                                let wins = json.data[id].statistics.pvp.wins;
                                let losses = json.data[id].statistics.pvp.losses;
                                let battles = json.data[id].statistics.battles;
                                let frags = json.data[id].statistics.pvp.frags;
                                let planes = json.data[id].statistics.pvp.planes_killed;
                                let dmg = json.data[id].statistics.pvp.damage_dealt;
                                wowsEmbed.setTitle(`World of Warships Stats for ${nickname}`)
                                    .setColor('#4b5320')
                                    .setThumbnail('https://upload.wikimedia.org/wikipedia/fr/thumb/9/96/World_of_Warships_Logo.png/280px-World_of_Warships_Logo.png')
                                    .addField('Leveling Tier:', tier.toLocaleString('en'), true)
                                    .addField('Battles:', battles.toLocaleString('en'), true)
                                    .addField('Wins:', wins.toLocaleString('en'), true)
                                    .addField('Losses:', losses.toLocaleString('en'), true)
                                    .addField('Frags:', frags.toLocaleString('en'), true)
                                    .addField('Plane Frags:', planes.toLocaleString('en'), true)
                                    .addField('Total Damage:', dmg.toLocaleString('en'), true)
                                    msg.embed(wowsEmbed);
                            });
                }
        }).catch(error => console.error(error));
    }
}
