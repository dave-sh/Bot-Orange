const {Command} = require('discord.js-commando');
const fetch = require('node-fetch');
const {RichEmbed} = require('discord.js');
const stockAPIKey = require('./api.json').stock;
const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
});

module.exports = class stocks extends Command {
    constructor(client) {
        super(client, {
            name: 'stocksnow',
            group: 'finance',
            memberName: 'stocksnow',
            description: 'Checks stock data without the hassle, just input a symbol!',
            examples: ['c.stocksnow AAPL'],
            args: [
                {
                    key: 'symbol',
                    prompt: 'Name of equity of your choice. Ex: \`googl\`',
                    type: 'string'
                }
            ]
        });
    }
    async run(msg, {symbol}) {
        fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${stockAPIKey}`)
            .then(res => res.json())
            .then(json => {
                var obj = json['Global Quote']['01. symbol'];
                if (!obj) return msg.say(`No results found for "${symbol}."`);
                let sym = json['Global Quote']['01. symbol'];
                let change = json['Global Quote']['09. change'];
                let percentChange = json['Global Quote']['10. change percent'];
                let prevClose = json['Global Quote']['08. previous close'];
                let currentPrice = json['Global Quote']['05. price'];
                let volume = json['Global Quote']['06. volume'];
                let latest = json['Global Quote']['07. latest trading day'];
                let color = '';
                if(change.substring(0,1) === ('-')){
                    color = '#CD0000';
                } else if (formatter.format(change) === '$0.00') {
                    color = '#A9A9A9';
                }else {
                    color = '#00FF00';
                }
                let stckEmbed = new RichEmbed()
                .setTitle(`Latest Trading Day Prices for ${sym}`)
                .setColor(color)
                .addField('Current Price', formatter.format(currentPrice))
                .addField('Previous Close', formatter.format(prevClose))
                .addField('Price Change', `${formatter.format(change)}`)
                .addField('% Price Change', percentChange)
                .addField('Volume', volume)
                .setFooter(`Latest Trading Day - ${latest} - Alpha Vantage API`);
                msg.embed(stckEmbed);
            })
            .catch(err => console.error(err));
    }
}
