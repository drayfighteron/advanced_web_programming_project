module.exports = (connex, Sequelize) => {
  return connex.define('user', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    username: { type: Sequelize.STRING(50), allowNull: false, unique: true },
    password_hash: { type: Sequelize.STRING(255), allowNull: false },
    token: { type: Sequelize.TEXT, allowNull: true },
    created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW }
  }, { tableName: 'users', timestamps: false });
};
