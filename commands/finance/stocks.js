const {Command} = require('discord.js-commando');
const fetch = require('node-fetch');
const {RichEmbed} = require('discord.js');
const stockAPIKey = require('./api.json').stock;
const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
});
let time = '';
let ts = '';
let int = '';
module.exports = class stocks extends Command{
    constructor(client) {
        super(client, {
            name: 'stocks',
            group: 'finance',
            memberName: 'stocks',
            description: 'Checks stock data.',
            examples: ['c.stocks Intraday MSFT 5min'],
            args: [{
                key: 'timeseries',
                prompt: 'Please enter a time series. Ex: \`Intraday\`',
                type: 'string'
            },
            {
                key: 'symbol',
                prompt: 'Name of equity of your choice. Ex: \`MSFT\`',
                type: 'string'
            }, {
                key: 'interval',
                prompt: 'Please provide an interval between two consecutive data points. Ex: \`1min\`',
                default: '1min',
                type: 'string'
            }]
        });
    }
    async run(msg, {timeseries, symbol, interval}) {
        let intt = interval.toLowerCase();
        if (intt !== '1min' && intt !== '5min' && intt !== '15min' && intt !== '30min' && intt !== '60min')
        return msg.say('Interval must be \`1min\`, \`5min\`, \`15min\`, \`30min\`, or \`60min\`');
        if(timeseries.toLowerCase() === 'intraday'){
            time = 'TIME_SERIES_INTRADAY';
            int = `&interval=${interval}`;
            if(intt === '1min'){
                ts = 'Time Series (1min)';
            }else if(intt === '5min'){
                ts = 'Time Series (5min)';
            }else if(intt === '15 min'){
                ts = 'Time Series (15min)';
            }else if(intt === '30min'){
                ts = 'Time Series (30 min)';
            }else if(intt === '60 min'){
                ts = 'Time Series (60min)';
            }
        }else if(timeseries.toLowerCase() === 'daily'){
            time = 'TIME_SERIES_DAILY';
            ts = 'Time Series (Daily)';
            int = '';
        }else{
            return msg.say('Timeseries must be intraday or daily.');
        }
        fetch(`https://www.alphavantage.co/query?function=${time}&symbol=${symbol}${int}&apikey=${stockAPIKey}`)
        .then(res => res.json())
        .then(json => {
            let refresh = '';
            let dispInt = '-';
            var obj = json['Error Message'];
            if (obj) return msg.say(`No results found for "${symbol}"`);
            if (timeseries.toLowerCase() === 'daily') {
                dispInt = '';
                refresh = json['Meta Data']['3. Last Refreshed'].toString().substring(0, 10);   
            } else if (timeseries.toLowerCase() === 'intraday') {
                dispInt = `Interval: ${json['Meta Data']['4. Interval']} -`;
                refresh = json['Meta Data']['3. Last Refreshed'];
            }
            let sym = json['Meta Data']['2. Symbol'];
            let open = json[ts][refresh]['1. open'];
            let high = json[ts][refresh]['2. high'];
            let low = json[ts][refresh]['3. low'];
            let close = json[ts][refresh]['4. close'];
            let volume = json[ts][refresh]['5. volume'];
            let stckEmbed = new RichEmbed()
            .setTitle(`Stock Prices ${sym.toUpperCase()}`)
            .setColor('#85bb65')
            .setURL(`https://www.google.com/search?q=${sym}`)
            .setThumbnail('https://si.wsj.net/public/resources/images/IF-AC796_JUNKST_GR_20161103121700.jpg')
            .addField('Open', formatter.format(open))
            .addField('High', formatter.format(high))
            .addField('Low', formatter.format(low))
            .addField('Close', formatter.format(close))
            .addField('Volume', volume)
            .setFooter(`${refresh} - ${dispInt} Torus Development`);
            msg.embed(stckEmbed);
        })
        .catch(err=>console.error(err));    
    }
}
