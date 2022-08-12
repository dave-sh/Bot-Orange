const {RichEmbed} = require('discord.js');
const {Command} = require('discord.js-commando');
const fetch = require('snekfetch');

module.exports = class Pokemon extends Command {
    constructor(client) {
        super(client, {
            name: 'pokemon',
            group: 'games',
            memberName: 'pokemon',
            description: 'Get information on a Pokemon!.',
            examples: ['c.pokemon bulbosaur', 'c.pokemon ditto s'],
            guildsOnly: true,
            args:[{
                key: 'pokemon',
                prompt: 'Pick a Pokemon to search up!',
                type: 'string',
                parse: pokemon => pokemon.toLowerCase()
            },{
                key: 'regular',
                prompt: 'Regular or shiny',
                type: 'string',
                default: 'd'
            }]
        });
    }
    async run(message, {pokemon, regular}) {
        try {
            let msg = await message.channel.send('Checking...');
            fetch.get(`https://pokeapi.co/api/v2/pokemon/${pokemon}`).then(res => {
                if(res.body.order == undefined){
                    message.channel.send('Pokemon not found. Please check spelling.');
                }else{
                     var no = res.body.order;
                     var weight = res.body.weight;
                     var absString = '';
                     var abilities = new Array(res.body.abilities.length);
                     for (var c = 0; c < abilities.length; c++) {
                         abilities[c] = res.body.abilities[c].ability.name.substring(0, 1).toUpperCase() + res.body.abilities[c].ability.name.substring(1);
                         if (res.body.abilities[c].is_hidden) {
                             abilities[c] += '(Hidden)';
                         }
                         absString += abilities[c] + ', '
                     }
                     absString = absString.substring(0, absString.length - 2);
                     const pokemonEmbed = new RichEmbed()
                         .setTitle(res.body.name.substring(0, 1).toUpperCase() + res.body.name.substring(1))
                         .addField("Number:", no)
                         .addField('Abilities:', absString)
                         .addField('Weight:', weight)
                     if (regular == 'd') {
                         pokemonEmbed.setThumbnail(res.body.sprites.front_default)
                     } else {
                         pokemonEmbed.setThumbnail(res.body.sprites.front_shiny)
                     }


                     message.channel.send(pokemonEmbed);
                }
                msg.delete();
            });
        } catch (error) {
            console.log(error.stack);
            message.channel.send('There was an error with the API.');
        }
    };
};