const {Command} = require('discord.js-commando');
const Sequelize = require('sequelize');
const sequelizepoints = new Sequelize('database', 'bglaser484', 'BJkSvd3v5', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'points.sqlite',
});
const Points = sequelizepoints.define('points', {
    user: {
        type: Sequelize.TEXT,
        unique: true
    },
    points: {
        type: Sequelize.BIGINT,
        defaultValue: 0,
        allowNull: false
    },
    level: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    daily: {
        type: Sequelize.BIGINT,
        defaultValue: 0,
        allowNull: false
    },
    vote: {
        type: Sequelize.BIGINT,
        defaultValue: 0,
        allowNull: false
    },
    credits: {
        type: Sequelize.BIGINT,
        defaultValue: 0,
        allowNull: false
    },
});
var amount = 0;
var canceled = false;
var moron = false;
module.exports = class GuessNumber extends Command {
    constructor(client) {
        super(client, {
            name: 'guessnumber',
            aliases: ['numberguess', 'guessnum', 'numguess'],
            group: 'mini-games', //change back to funstuffs, The orange group was mini-games
            memberName: 'guessnumber',
            description: 'Gambling game where you try and guess the computer\'s number! Default bet is 1. If you have no credits, you can still play for free, but you can\'t win anything either!',
            examples: ['p.guessnumber', 'p.guessnumber 50'],
            guildOnly: true,
            args: [{
                key: 'bet',
                prompt: 'How many credits would you like to bet?',
                type: 'integer',
                min: 1,
                default: 1
            }]
        });
        this.playing = new Set();   
    }
    async run(msg, {bet}) {
        //checks if channel has game occuring.
        if (this.playing.has(msg.channel.id)) return msg.reply('This channel already has a game occurring. Move to a different channel!');
        this.playing.add(msg.channel.id);
        const points = await Points.findOne({
            where: {
                user: msg.author.id
            }
        });
        const credits = points.get('credits');
        if (credits == 0) { //Let's them play with zero credits.
             try {
                 const randomNumber = Math.ceil(Math.random() * 100);
                 var guessed = false;
                 var count = 0;
                 while (!guessed) {
                     await msg.say("Guess a number 1-100!");
                     const filter = res => {
                         return res.author.id === msg.author.id;
                     };
                     const guess = await msg.channel.awaitMessages(filter, {
                         max: 1,
                         time: 20000
                     });
                     if (!guess.size) {
                         await msg.say('Out of time!, you still there?');
                         break;
                     }
                     const choice = guess.first().content.toLowerCase();
                     if (choice == 'cancel' || choice == 'abort' || choice == 'stop') {
                         canceled = true;
                         break;
                     }
                     if (parseInt(choice) % 1 !== 0 || parseInt(choice) < 1 || parseInt(choice) > 100) {
                         msg.say('Not a valid input!');
                     } else if (count === 100) {
                         break;
                     } else {
                         if (parseInt(choice) > randomNumber) {
                             msg.say("Too high!");
                             count++;
                         } else if (parseInt(choice) < randomNumber) {
                             msg.say("Too low!");
                             count++;
                         } else if (parseInt(choice) == randomNumber) {
                             count++;
                             guessed = true;
                             msg.say(`You guessed it! My number was ${randomNumber}. You took ${count} tries.`);
                         }
                     }
                 }
                 if (canceled) {
                     msg.reply('Game canceled.');
                 }
                 this.playing.delete(msg.channel.id);
             } catch (error) {
                 this.playing.delete(msg.channel.id);
                 msg.say('An unexpected error occurred. We are looking into it!');
                 console.error(error);
             }
        }else if (credits - bet < 0) {
           return msg.say(`You do not have enough credits to bet ${bet}.`);
        }else{
            //Takes away bet credits.
            var hlw = 'I\'m thinking of a number 1-100!';
            setTimeout(async function () {
                await points.decrement('credits', {by: (bet)});
            }, 5000);
            try {
                const randomNumber = Math.ceil(Math.random() * 100);
                var guessed = false;
                var count = 0;
                while (!guessed) {
                    await msg.say(hlw);
                    const filter = res => {
                        return res.author.id === msg.author.id;
                    };
                    const guess = await msg.channel.awaitMessages(filter, {
                        max: 1,
                        time: 20000
                    });
                    if (!guess.size) {
                        await msg.say('Out of time!, you still there?');
                        break;
                    }
                    const choice = guess.first().content.toLowerCase();
                    if (choice == 'cancel' || choice == 'abort' || choice == 'stop'|| choice == 'exit') {
                        canceled = true;
                        break;
                    }
                    if (parseInt(choice) % 1 !== 0 || parseInt(choice) < 1 || parseInt(choice) > 100) {
                        msg.say('Not a valid input!');
                    } else if (count >= 100) {
                        moron = true;
                        break;
                    } else {
                        if (parseInt(choice) > randomNumber) {
                            hlw = "Too high!";
                            count++;
                        } else if (parseInt(choice) < randomNumber) {
                            hlw = "Too low!";
                            count++;
                        } else if (parseInt(choice) == randomNumber) {
                            count++;
                            guessed = true;
                            msg.say(`You guessed it! My number was ${randomNumber}. You took ${count} tries.`);
                        }
                    }
                }
                hlw = 'I\'m thinking of a number 1-100!';
                //Different Win scenarios
                if (count === 1 && guessed === true) {
                    amount = bet * 15;
                    console.log(amount);
                    msg.reply(`Wow! You must be lucky today! You win ${amount} credits!`);
                    setTimeout(async function () {
                        await points.increment('credits', {by: amount+bet});
                    }, 5000);
                } else if (count === 2 && guessed === true) {
                    amount = bet * 7;
                    msg.reply(`Didn\'t ace it, but you still win ${amount} credits!`);
                    setTimeout(async function () {
                         await points.increment('credits', {by: amount+bet});
                    }, 5000);
                } else if (count === 3 && guessed === true) {
                    amount = bet * 5;
                    msg.reply(`Woah. You win ${amount} credits!`);
                    setTimeout(async function () {
                        await points.increment('credits', {by: amount+bet});
                    }, 5000);
                } else if (count === 4 && guessed === true) {
                    amount = bet * 4;
                    msg.reply(`Still sorta lucky. You win ${amount} credits!`);
                    setTimeout(async function () {
                        await points.increment('credits', {by: amount+bet});
                    }, 5000);
                } else if (count === 5 && guessed === true) {
                    amount = bet * 3;
                    msg.reply(`Ooh, just almost. You win ${amount} credits!`);
                    setTimeout(async function () {
                        await points.increment('credits', {by: amount+bet});
                    }, 5000);
                } else if (count === 6 && guessed === true) {
                    amount = bet;
                    msg.reply(`Barely beat the binary search. I'll still return your ${amount} credits though.`);
                    setTimeout(async function () {
                        await points.increment('credits', {by: amount});
                    }, 5000);
                } else if (count === 7 && guessed === true) {
                    msg.reply(`Eh. Not that great. You lost ${bet} credits.`);
                } else if (guessed == false && count < 4 && canceled === true) {
                    msg.reply('Game canceled. You credits have been refunded.');
                    setTimeout(async function () {
                        await points.increment('credits', {by: (bet)});
                    }, 5000);
                } else if(moron){
                    msg.reply(`I gave you 100 tries, and you still couldn\'t guess it? The number was ${randomNumber}. I'm not even gonna take away anymore credits. Just wow.`);
                } else {
                    msg.reply(`You lost ${bet} credits! Better luck next time!`);
                }
               
                this.playing.delete(msg.channel.id);
            } catch (err) {
                this.playing.delete(msg.channel.id);
                console.error(err);
                return msg.reply(`Oh no, an error occurred! We are looking into it!`);
            }
        }
    }
}