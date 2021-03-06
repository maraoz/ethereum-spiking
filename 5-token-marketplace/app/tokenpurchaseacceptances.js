import $ from 'jquery'
import Accounts from './accounts'
import Transactions from './transactions'
import TokenPurchases from './tokenpurchases'
import { GAS, showError } from "./constants"
import { ERC20, TokenPurchase, TokenPurchaseAcceptance } from "./contracts"

const TokenPurchaseAcceptaces = {
  async update(acceptance) {
    const address = acceptance.address
    const list = $('#token-purchase-acceptance-contracts')
    const contractDetails = this._buildDetailFor(address)
    const acceptanceElement = list.find(`#${address}`)
    acceptanceElement.length ? acceptanceElement.html(contractDetails) : list.append(`<p id="${address}">${contractDetails}</p>`);

    try {
      list.find(`#${address}`).find(".tokens").html(`Tokens ${(await acceptance.tokensBalance())}`)
      list.find(`#${address}`).find(".claimed").html(`Claimed ${(await acceptance.claimed())}`)
    } catch(error) { showError(error) }
  },

  async publish(erc20Address, tokenPurchaseAddress, seller) {
    try {
      const acceptance = await TokenPurchaseAcceptance.new(erc20Address, tokenPurchaseAddress, { from: seller, gas: GAS })
      Transactions.add(acceptance.transactionHash)
      this.update(acceptance)
      return acceptance
    } catch(error) { showError(error) }
  },

  async claim(acceptanceAddress) {
    try {
      const acceptance = await TokenPurchaseAcceptance.at(acceptanceAddress)
      const erc20Address = await acceptance.token()
      const erc20 = await ERC20.at(erc20Address)
      const tokenPurchaseAddress = await acceptance.tokenPurchase()
      const tokenPurchase = await TokenPurchase.at(tokenPurchaseAddress)
      const buyerAddress = await tokenPurchase.buyer();

      console.log(`Buyer ${buyerAddress} claiming ${tokenPurchaseAddress} through acceptance ${acceptance.address}`);
      const response = await tokenPurchase.claim(acceptance.address, { from: buyerAddress, gas: GAS })
      Accounts.update(erc20)
      Transactions.add(response.tx)
      TokenPurchases.update(tokenPurchase)
      this.update(acceptance)
    } catch (error) { showError(error) }
  },

  _buildDetailFor(address) {
    return `<a href="#" class="claim-acceptance">claim</a> <span class="address">${address}</span> | <span class="tokens">Tokens</span> | <span class="claimed">Claimed </span>`
  },
}

export default TokenPurchaseAcceptaces
