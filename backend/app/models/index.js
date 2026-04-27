const dbConfig = require('../config/db.config.js');
const Sequelize = require('sequelize');

// Central Sequelize connection. All models share this same connection.
const connex = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  port: 3306,
  logging: false
});

const db = {};

db.Sequelize = Sequelize;
db.connex = connex;

// Register application models.
db.users = require('./user.model.js')(connex, Sequelize);
db.events = require('./event.model.js')(connex, Sequelize);
db.tasks = require('./task.model.js')(connex, Sequelize);

// Define table relationships.
db.users.hasMany(db.events, { foreignKey: 'user_id', as: 'events', onDelete: 'CASCADE' });
db.events.belongsTo(db.users, { foreignKey: 'user_id', as: 'user' });
db.events.hasMany(db.tasks, { foreignKey: 'event_id', as: 'tasks', onDelete: 'CASCADE' });
db.tasks.belongsTo(db.events, { foreignKey: 'event_id', as: 'event' });

module.exports = db;
