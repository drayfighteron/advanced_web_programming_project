module.exports = (connex, Sequelize) => {
  return connex.define('task', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    event_id: { type: Sequelize.INTEGER, allowNull: false },
    title: { type: Sequelize.STRING(255), allowNull: false },
    description: { type: Sequelize.TEXT, allowNull: true },
    status: { type: Sequelize.ENUM('To Do', 'Doing', 'Done'), defaultValue: 'To Do' },
    priority: { type: Sequelize.STRING(50), defaultValue: 'Medium Priority' },
    daily_focus: { type: Sequelize.BOOLEAN, defaultValue: false },
    assignee: { type: Sequelize.STRING(255), allowNull: true },
    dueDate: { type: Sequelize.STRING(255), allowNull: true },
    task_dates: { type: Sequelize.TEXT, allowNull: true },
    cost: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0.00 },
    position: { type: Sequelize.INTEGER, defaultValue: 0 },
    created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW }
  }, { tableName: 'tasks', timestamps: false });
};
