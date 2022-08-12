const {Command} = require('discord.js-commando');
const fetch = require('node-fetch');
const {RichEmbed} = require('discord.js');
const stockAPIKey = require('./api.json').stock;

module.exports = class stockSearch extends Command {
    constructor(client) {
        super(client, {
            name: 'crypto',
            group: 'finance',
            memberName: 'crypto',
            description: 'Checks cryptocurrency prices/conversions',
            examples: ['c.crypto BTC'],
            args: [{
                key: 'symbol',
                prompt: 'Please enter something to search.',
                type: 'string'
            }]
        });
    }
    async run(msg, {
        symbol
    }) {
        fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${symbol}&apikey=${stockAPIKey}`)
            .then(res => res.json())
            .then(json => {
                let check = json.bestMatches;
                if (check.length === 0) {
                    return msg.say('Your search returned no results.')
                }
                let data = json.bestMatches[0];
                let name = json.bestMatches[0]['2. name'].toString();
                let url = `https://www.google.com/search?q=${name.replace(/\s+/, "+") }`;
                console.log(url);
                let symEmbed = new RichEmbed()
                    .setTitle(`Best Match for '${symbol}'`)
                    .setColor('536872')
                    .setURL(url)
                    .setThumbnail('https://s.thestreet.com/files/tsc/v2008/photos/contrib/uploads/stocktickerboard_600x400.jpg')
                    .addField('Name', data['2. name'])
                    .addField('Type', data['3. type'])
                    .addField('Region', data['4. region'])
                    .addField('Market Hours', `${data['5. marketOpen']} - ${data['6. marketClose']} (${data['7. timezone']})`)
                    .addField('Currency', data['8. currency'])
                    .setFooter('Alpha Vantage API - Torus Development');
                msg.embed(symEmbed);
            })
            .catch(err => console.error(err));
    }
}
