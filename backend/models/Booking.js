import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Booking = sequelize.define("Booking", {
  ownerName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  dogName: { type: DataTypes.STRING, allowNull: false },
  dogSize: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: false },
  services: { type: DataTypes.JSON, allowNull: false },
  amount: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: "pending payment" },
});

export default Booking;
