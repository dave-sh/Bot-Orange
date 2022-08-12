const {Command} = require('discord.js-commando');
const fetch = require('node-fetch');
const {RichEmbed} = require('discord.js');
const wgAPIKey = require('./api.json').wg;
module.exports = class wotid extends Command {
    constructor(client) {
        super(client, {
            name: 'wotid',
            group: 'games',
            memberName: 'wotid',
            description: 'Pulls up player statistics for World of Tanks.',
            guildOnly: true,
            examples: ['c.wotid na QuickyBaby'],
            args:[
                {
                key: "realm",
                prompt: "Enter a realm.",
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
            },
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
            fetch(`https://api.worldoftanks.${domain}/wot/account/list/?application_id=${wgAPIKey}&search=${search}`)
            .then(res => res.json()) 
            .then(json => {
                if (json.status === 'error' || json.meta.count === 0){
                    return msg.say('Player not found, check spelling.')
                }else{
                    let id = json.data[0].account_id;
                    let tankEmbed = new RichEmbed();
                    fetch(`https://api.worldoftanks.${domain}/wot/account/info/?application_id=${wgAPIKey}&account_id=${id}`)
                    .then(res => res.json())
                    .then(json => {
                        let nickname = json.data[id].nickname;
                        let rating = json.data[id].global_rating;
                        let accuracy = json.data[id].statistics.all.hits_percents;
                        let wins = json.data[id].statistics.all.wins;
                        let losses = json.data[id].statistics.all.losses;
                        let battles = json.data[id].statistics.all.battles;
                        let survivedBattles = json.data[id].statistics.all.survived_battles;
                        let frags = json.data[id].statistics.all.frags;
                        let avgXP = json.data[id].statistics.all.battle_avg_xp;
                        
                        tankEmbed.setTitle(`World of Tanks Stats for ${nickname}`)
                        tankEmbed.setColor('#4b5320')
                        tankEmbed.setThumbnail('https://vignette.wikia.nocookie.net/gup/images/e/e4/Wot_logo.png/revision/latest?cb=20170123230734')
                        tankEmbed.addField('Rating:', rating.toLocaleString('en'), true)
                        tankEmbed.addField('Accuracy:', accuracy + '%', true)
                        tankEmbed.addField('Wins:', wins.toLocaleString('en'), true)
                        tankEmbed.addField('Losses:', losses.toLocaleString('en'), true)
                        tankEmbed.addField('Battles:', battles.toLocaleString('en'), true)
                        tankEmbed.addField('Survived Battles:', survivedBattles.toLocaleString('en'), true)
                        tankEmbed.addField('Frags:', frags.toLocaleString('en'), true)
                        tankEmbed.addField('Average XP per Battle:', avgXP, true);
                        fetch(`https://api.worldoftanks.${domain}/wot/account/tanks/?application_id=${wgAPIKey}&account_id=${id}`)
                             .then(res => res.json())
                             .then(json => {
                                 let tankNum = json.data[id].length;
                                 tankEmbed.addField('Vehicles Owned:', tankNum);
                                 tankEmbed.setTimestamp();
                                 msg.embed(tankEmbed);
                        });
                    });
                }
            });
            
    }
}
