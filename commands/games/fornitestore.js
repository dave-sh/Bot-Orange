const {RichEmbed} = require('discord.js');
const {Command} = require('discord.js-commando');
const fetch = require('snekfetch');
const token = require('./api.json').fn;
module.exports = class FnStore extends Command {
    constructor(client) {
        super(client, {
            name: 'fnstoree',
            group: 'games',
            memberName: 'fnstoree',
            description: 'Returns a random store item!',
            examples: ['p.fnstore'],
            guildsOnly: true,
        });
    }
    async run(message) {
             let msg = await message.channel.send('Checking status...');
             fetch.get(`https://fortnite-api.tresmos.xyz/store?key=${token}`).then(res => {
                let length = res.body.length;
                let rndmIndx = Math.floor(Math.random() * length);
                let featured = res.body[rndmIndx].featured;
                let name = res.body[rndmIndx].name;
                let cost = res.body[rndmIndx].cost;
                let imgUrl = res.body[rndmIndx].images.background;
                let fstring = '';
                if(featured === 1){
                    fstring = 'Yes';
                }else{
                    fstring = 'No';
                }
                let type = res.body[rndmIndx].type;
                let fl = type.substring(0, 1);
                let ll = type.substring(1);
                let typeMod = fl.toUpperCase() + ll; 
                let rarity = res.body[rndmIndx].rarity;
                let rl = rarity.substring(0, 1);
                let rll = rarity.substring(1);
                let rarMod = rl.toUpperCase() + rll;
                let embed = new RichEmbed()
                .setTitle('Current Fortnite Store Items')
                .setColor('#FFD700')
                .setThumbnail('https://vignette.wikia.nocookie.net/fortnite/images/5/5a/Icon_VBucks.png/revision/latest?cb=20170806013747')
                .addField('Item:', name, true)
                .addField('Cost:', cost.toLocaleString(), true)
                .addField('Featured:', fstring, true)
                .addField('Type:', typeMod, true)
                .addField('Rarity:', rarMod, true)
                .setImage(imgUrl)
                .setFooter("Torus Development")
                .setTimestamp()
                message.embed(embed);
                msg.delete();
             });
    };
};