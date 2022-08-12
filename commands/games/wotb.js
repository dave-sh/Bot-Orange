const {Command} = require('discord.js-commando');
const fetch = require('node-fetch');
const {RichEmbed} = require('discord.js');
const wgAPIKey = require('./api.json').wg;
module.exports = class wotblitz extends Command {
    constructor(client) {
        super(client, {
            name: 'wotb',
            group: 'games',
            memberName: 'wotb',
            description: 'Pulls up player statistics for World of Tanks Blitz.',
            examples: ['c.wotb na Techno_Waffles'],
            args: [
                {
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
        fetch(`https://api.wotblitz.${domain}/wotb/account/list/?application_id=${wgAPIKey}&search=${search}`)
            .then(res => res.json())
            .then(json => {
                if (json.status === 'error' || json.meta.count === 0) {
                    return msg.say('Player not found. Check spelling.')
                }else{
                    let id = json.data[0].account_id;
                    let wotbEmbed = new RichEmbed();
                    fetch(`https://api.wotblitz.${domain}/wotb/account/info/?application_id=${wgAPIKey}&account_id=${id}`)
                    .then(res => res.json())
                    .then(json =>{
                        let nickname = json.data[id].nickname;
                        let xp = json.data[id].statistics.all.xp
                        let wins = json.data[id].statistics.all.wins;
                        let losses = json.data[id].statistics.all.losses;
                        let battles = json.data[id].statistics.all.battles;
                        let survivedBattles = json.data[id].statistics.all.survived_battles;
                        let frags = json.data[id].statistics.all.frags;
                        let maxFragTank = json.data[id].statistics.all.max_frags_tank_id;

                        wotbEmbed.setTitle(`World of Tanks Blitz Stats for ${nickname}`)
                        .setColor('#4b5320')
                        .setThumbnail('https://i.ytimg.com/vi/RBw2GVQqJME/hqdefault.jpg')
                        .addField('Wins:', wins.toLocaleString('en'), true)
                        .addField('Losses:', losses.toLocaleString('en'), true)
                        .addField('Battles:', battles.toLocaleString('en'), true)
                        .addField('Survived Battles:', survivedBattles.toLocaleString('en'), true)
                        .addField('Frags:', frags.toLocaleString('en'), true)

                        fetch(`https://api.wotblitz.${domain}/wotb/account/achievements/?application_id=${wgAPIKey}&account_id=${id}`)
                          .then(res => res.json())
                          .then(json => {
                              wotbEmbed.addField('Mastery Badges:', json.data[id].achievements.markOfMastery.toLocaleString('en'), true);
                        });
                        fetch(`https://api.wotblitz.${domain}/wotb/encyclopedia/vehicles/?application_id=${wgAPIKey}&tank_id=${maxFragTank}`)
                        .then(res => res.json())
                        .then(json =>{
                            let name = json.data[maxFragTank].name;
                            wotbEmbed.addField('Tank with Most Frags:', name, true)
                        });
                         fetch(`https://api.wotblitz.${domain}/wotb/clans/accountinfo/?application_id=${wgAPIKey}&account_id=${id}`)
                             .then(res => res.json())
                             .then(json => {
                                 if (json.status === 'error' || json.data[id] === null) {
                                     wotbEmbed.addField('Clan: ', 'No clan', true)
                                     wotbEmbed.setTimestamp();
                                     msg.embed(wotbEmbed);
                                 } else {
                                    let clanRole = json.data[id].role;
                                    let clanID = json.data[id].clan_id;
                                    fetch(`https://api.wotblitz.${domain}/wotb/clans/info/?application_id=${wgAPIKey}&clan_id=${clanID}`)
                                        .then(res => res.json())
                                        .then(json => {
                                            let clanName;
                                            if(clanName == null){
                                                clanName = "No clan";
                                            }else{
                                                clanName = json.data[clanID].name;
                                                let tag = json.data[clanID].tag;
                                                let clanLeader = json.data[clanID].creator_name;
                                                let members = json.data[clanID].members_count;
                                                wotbEmbed.addField('Clan:', `[${tag}] ${clanName}`, true)
                                                    .addField('Leader:', clanLeader, true)
                                                    .addField('Members:', members, true)
                                                    .addField('Role:', clanRole, true);
                                            }
                                            wotbEmbed.setTimestamp();
                                            msg.embed(wotbEmbed);
                                    });
                                 }
                        });
                    });
                }
            }).catch(error => console.error(error));
    }
}
