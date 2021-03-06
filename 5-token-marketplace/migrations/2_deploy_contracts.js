const MyToken = artifacts.require("./MyToken.sol");
const TokenSale = artifacts.require("./TokenSale.sol");
const TokenPurchase = artifacts.require("./TokenPurchase.sol");
const TokenPurchaseAcceptance = artifacts.require("./TokenPurchaseAcceptance.sol");

module.exports = function(deployer) {
  deployer.deploy(MyToken);
  deployer.deploy(TokenSale);
  deployer.deploy(TokenPurchase);
  deployer.deploy(TokenPurchaseAcceptance);
};
