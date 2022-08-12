const{Command} = require('discord.js-commando');
const{RichEmbed} = require('discord.js');
module.exports = class CoinFlip extends Command{
    constructor(client){
        super(client,{
            name: 'flip',
            group: 'mini-games',
            memberName: 'flip',
            description: 'Flips a coin!',
            examples: ['c.flip']
        });
    }
    run(msg){
        let flip = Math.floor(Math.random()*2);
        let result = '';
        let imgsrc = '';
        if(flip === 0){
            result = 'Heads!';
            imgsrc = 'https://mbtskoudsalg.com/images/heads-or-tails-quarter-png-3.png';
        }else if(flip === 1){
            result = 'Tails!';
            imgsrc = 'https://vignette.wikia.nocookie.net/coincollecting/images/9/99/USD_1_Cent.png/revision/latest?cb=20091124185408';
        }
        let coin = new RichEmbed()
        .setTitle('Fl00p!')
        .setColor('#FFA500')
        .setDescription(result)
        .setThumbnail(imgsrc)
        .setFooter('Torus Development - v0');
        return msg.embed(coin);
    }
}