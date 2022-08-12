const {RichEmbed} = require('discord.js');
const {Command} = require('discord.js-commando');
const fetch = require('node-fetch');
const token = require('./api.json').fn;

module.exports = class FNStore extends Command {
    constructor(client) {
        super(client, {
            name: 'fnstore',
            group: 'games',
            memberName: 'fnstore',
            description: 'Checks the Fortnite store!',
            aliases: ['fortnitestore', 'fnshop', 'fortniteshop'],
            examples: ['c.fnshop'],
            guildOnly: true,
        });
    }
    async run(msg) {
        fetch(`https://fortnite-api.tresmos.xyz/store?key=${token}`)
        .then(res => res.json())
        .then(async function(json){
            let itemCount = json.length;
            let currentItemIndx = 0;
            let itemName = json[currentItemIndx].name;
            let cost = json[currentItemIndx].cost;
            let imgUrl = json[currentItemIndx].images.background;
            let type = json[currentItemIndx].type;
            let rarity = json[currentItemIndx].rarity;
            let featured = '';
            if (json[currentItemIndx].featured === 1) {
                featured = 'Yes';
            }else{
                featured = 'No';
            }
            const embed = new RichEmbed()
                .setTitle('Fortnite Store')
                .setColor('#FFD700')
                .setThumbnail(imgUrl)
                .addField('Item:', itemName, true)
                .addField('Cost:', `${cost.toLocaleString('en')} V-Bucks`, true)
                .addField('Type:', type.substring(0,1).toUpperCase()+type.substring(1), true)
                .addField('Rarity:', rarity.substring(0, 1).toUpperCase() + rarity.substring(1), true)
                .addField('Featured:', featured);
            const embedR = await msg.say(embed);
            await embedR.react('◀');
            embedR.react('▶');

            const filter = (reaction, user) => (reaction.emoji.name === '▶' || reaction.emoji.name === '◀') && !user.bot;
            const collector = embedR.createReactionCollector(filter, {time: 100000});
            collector.on('collect', async res=>{
                if (res.emoji.name === '▶' && currentItemIndx < itemCount - 1){
                    currentItemIndx++;
                    itemName = json[currentItemIndx].name;
                    cost = json[currentItemIndx].cost;
                    imgUrl = json[currentItemIndx].images.background;
                    type = json[currentItemIndx].type;
                    rarity = json[currentItemIndx].rarity;
                    featured = '';
                    if (json[currentItemIndx].featured === 1) {
                        featured = 'Yes';
                    } else {
                       featured = 'No';
                    }
                    const next = new RichEmbed()
                        .setTitle('Fortnite Store')
                        .setColor('#FFD700')
                        .setThumbnail(imgUrl)
                        .addField('Item:', itemName, true)
                        .addField('Cost:', `${cost.toLocaleString('en')} V-Bucks`, true)
                        .addField('Type:', type.substring(0, 1).toUpperCase() + type.substring(1), true)
                        .addField('Rarity:', rarity.substring(0, 1).toUpperCase() + rarity.substring(1), true)
                        .addField('Featured:', featured);
                    await embedR.edit(next);
                    res.remove(res.users.last());
                } else if (res.emoji.name === '◀' && currentItemIndx > 0) {
                    currentItemIndx--;
                    itemName = json[currentItemIndx].name;
                    cost = json[currentItemIndx].cost;
                    imgUrl = json[currentItemIndx].images.background;
                    type = json[currentItemIndx].type;
                    rarity = json[currentItemIndx].rarity;
                    featured = '';
                    if (json[currentItemIndx].featured === 1) {
                        featured = 'Yes';
                    } else {
                        featured = 'No';
                    }
                    const next = new RichEmbed()
                        .setTitle('Fortnite Store')
                        .setColor('#FFD700')
                        .setThumbnail(imgUrl)
                        .addField('Item:', itemName, true)
                        .addField('Cost:', `${cost.toLocaleString('en')} V-Bucks`, true)
                        .addField('Type:', type.substring(0, 1).toUpperCase() + type.substring(1), true)
                        .addField('Rarity:', rarity.substring(0, 1).toUpperCase() + rarity.substring(1), true)
                        .addField('Featured:', featured);
                    await embedR.edit(next);
                    res.remove(res.users.last());
                } else if (res.emoji.name === '▶' && currentItemIndx === 17) {
                    currentItemIndx = 0;
                    itemName = json[currentItemIndx].name;
                    cost = json[currentItemIndx].cost;
                    imgUrl = json[currentItemIndx].images.background;
                    type = json[currentItemIndx].type;
                    rarity = json[currentItemIndx].rarity;
                    featured = '';
                    if (json[currentItemIndx].featured === 1) {
                        featured = 'Yes';
                    } else {
                        featured = 'No';
                    }
                    const next = new RichEmbed()
                        .setTitle('Fortnite Store')
                        .setColor('#FFD700')
                        .setThumbnail(imgUrl)
                        .addField('Item:', itemName, true)
                        .addField('Cost:', `${cost.toLocaleString('en')} V-Bucks`, true)
                        .addField('Type:', type.substring(0, 1).toUpperCase() + type.substring(1), true)
                        .addField('Rarity:', rarity.substring(0, 1).toUpperCase() + rarity.substring(1), true)
                        .addField('Featured:', featured);
                    await embedR.edit(next);
                    res.remove(res.users.last());
                } else if (res.emoji.name === '◀' && currentItemIndx === 0) {
                    currentItemIndx = 17;
                    itemName = json[currentItemIndx].name;
                    cost = json[currentItemIndx].cost;
                    imgUrl = json[currentItemIndx].images.background;
                    type = json[currentItemIndx].type;
                    rarity = json[currentItemIndx].rarity;
                    featured = '';
                    if (json[currentItemIndx].featured === 1) {
                        featured = 'Yes';
                    } else {
                        featured = 'No';
                    }
                    const next = new RichEmbed()
                        .setTitle('Fortnite Store')
                        .setColor('#FFD700')
                        .setThumbnail(imgUrl)
                        .addField('Item:', itemName, true)
                        .addField('Cost:', `${cost.toLocaleString('en')} V-Bucks`, true)
                        .addField('Type:', type.substring(0, 1).toUpperCase() + type.substring(1), true)
                        .addField('Rarity:', rarity.substring(0, 1).toUpperCase() + rarity.substring(1), true)
                        .addField('Featured:', featured);
                    await embedR.edit(next);
                    res.remove(res.users.last());
                }
                collector.on('end', collected => {
                    embedR.clearReactions();
                });
            });
        });
    };
};