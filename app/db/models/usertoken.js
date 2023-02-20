module.exports = (sequelize, DataTypes) => {
  const UserToken = sequelize.define('UserToken', {
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    expires: {
      type: DataTypes.DATE,
      defaultValue: Date.now() + 30 * 86400,
    },
  });

  return UserToken;
};
