module.exports = (connex, Sequelize) => {
  return connex.define('event', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: Sequelize.INTEGER, allowNull: false },
    title: { type: Sequelize.STRING(255), allowNull: false },
    date: { type: Sequelize.DATEONLY, allowNull: true },
    location: { type: Sequelize.STRING(255), allowNull: true },
    description: { type: Sequelize.TEXT, allowNull: true },
    budget: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0.00 },
    event_type: { type: Sequelize.STRING(50), defaultValue: 'Other' },
    guest_count: { type: Sequelize.INTEGER, defaultValue: 0 },
    notes: { type: Sequelize.TEXT, allowNull: true },
    created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW }
  }, { tableName: 'events', timestamps: false });
};
