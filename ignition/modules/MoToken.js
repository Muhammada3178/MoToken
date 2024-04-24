const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("MoToken", (m) => {
    const moToken = m.contract("MoToken", []);
  
    return { moToken };
});