const {Command} = require('discord.js-commando');
const {RichEmbed} = require('discord.js');
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

module.exports = class profileCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'profile',
      //aliases: [],
      group: 'userinfo',
      memberName: 'profile',
      description: 'Check out a user\'s Pro-file.',
      examples: ['profile @BoneCrusher'],
      guildsOnly: true,
      args: [
        {
          key: 'user',
          prompt: 'Enter user.',
          type: 'user',
          default: msg => msg.author,
        //  validate: u => !u.bot
        }
      ]
    }); 
  }
  async run(msg, {user}) {
    if (user.bot) return msg.channel.send('Bot\'s don\'t have xp!');
    const point = await Points.findOne({where: {user: user.id}});
    if (point) {
      const bigPoints = await Points.findAll({order: [['points','DESC']], raw: true});
      const userPosition = bigPoints.findIndex(p => p.user === user.id)+1;
      const amountOfXp = point.get('points');
      const level = point.get('level');
      const nextLevel = Math.floor((625*((level+1)*(level+1)))/9);
      const progress = Math.floor(((amountOfXp) / nextLevel)*100);
      const credits = point.get('credits');
      const embed = new RichEmbed()
        .addField('Xp', amountOfXp, true)
        .addField('Level', level, true)
        .addField('Progress', progress +'%'+' ('+amountOfXp+'/'+nextLevel+')', true)
        .addField('Global Xp Rank', userPosition+'/'+bigPoints.length, true)
        .addBlankField(true)
        .addField('Credits', credits, true)
        .setAuthor(user.tag, user.displayAvatarURL);
      return msg.channel.send(embed);
    }		
    if (!point) {
      const embed = new RichEmbed()
        .addField('Xp', 0, true)
        .addField('Level', 0, true)
        .addField('Progress', 'N/A', true)
        .addField('Global Xp Rank', 'N/A', true)
        .addField('Credits', 0, true)
        .setAuthor(user.tag, user.displayAvatarURL);
      return msg.channel.send(embed);
    }
  }
};
