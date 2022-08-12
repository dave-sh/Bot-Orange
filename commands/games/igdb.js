const {RichEmbed} = require('discord.js');
const {Command} = require('discord.js-commando');
const fetch = require('snekfetch');
const axios = require('axios');
module.exports = class IGDB extends Command {
    constructor(client) {
        super(client, {
            name: 'game',
            group: 'games',
            memberName: 'game',
            description: 'Get information on a game!.',
            examples: ['c.game Pacman'],
            guildsOnly: true,
           
        });
    }

   

    async run(message) {
        try {
            axios({
                 url: 'https://api-v3.igdb.com/games/?search=fortnite',
                 method: 'POST',
                 headers: {
                     'Accept': 'application/json',
                     'user-key': 'ca233611495dc344174fdad6f1604252'
                 },
                 data: "fields age_ratings,aggregated_rating,aggregated_rating_count,alternative_names,artworks,bundles,category,collection,cover,created_at,dlcs,expansions,external_games,first_release_date,follows,franchise,franchises,game_engines,game_modes,genres,hypes,involved_companies,keywords,multiplayer_modes,name,parent_game,platforms,player_perspectives,popularity,pulse_count,rating,rating_count,release_dates,screenshots,similar_games,slug,standalone_expansions,status,storyline,summary,tags,themes,time_to_beat,total_rating,total_rating_count,updated_at,url,version_parent,version_title,videos,websites;"
            }).then(response => {
                 console.log(response.data);
            }).catch(err => {
                 console.error(err);
            });
        } catch (error) {
            console.log(error.stack);
            message.channel.send('There was an error with the API.');
        }
    };
};