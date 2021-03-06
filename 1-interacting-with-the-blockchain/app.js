'use strict';
import $ from 'jquery';
import Web3 from 'web3';

// Instance Web3 using localhost testrpc
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

// We will use this functions to show the status of the accounts generated by testRPC
const synchAccounts = () => {
  $('#gas-price').html(`<b>Gas: ETH ${web3.eth.gasPrice}</b>`);
  $('#default-account').html(`<b>Default Account: ${web3.eth.defaultAccount}</b>`);
  web3.eth.getAccounts().then(accounts =>
    accounts.forEach(account => {
      $('#accounts').html("");
      web3.eth.getBalance(account).then(balance =>
        $('#accounts').append(`<p><a href="#" class="from">from</a> <a href="#" class="to">to</a> <span class="address">${account}</span> | <span class="balance">ETH ${balance}</span></p>`)
      )
    })
  );
};

// This callback just avoids us to copy & past every time you want to use an address
const updateAddressFromLink = (event, inputSelector) => {
  event.preventDefault();
  $(inputSelector).val($(event.target).siblings(".address").text());
};

// Show initial accounts state and initialize callback triggers
synchAccounts();
$(document).on('click', '.from', e => updateAddressFromLink(e, '#sender-address'));
$(document).on('click', '.to', e => updateAddressFromLink(e, '#recipient-address'));

// Every time the users clicks the send button, we transfer ether to the recipient address and look for the transaction info into the blockchain
$('#send-ether').click(() => {
  let from = $('#sender-address').val();
  let to = $('#recipient-address').val();
  let amount = $('#amount').val();
  let transaction = { from: from, to: to, value: amount };
  console.log(`Sending transaction... ${JSON.stringify(transaction)}`);
  web3.eth.sendTransaction(transaction, function (error, transactionHash) {
    console.log(`Transaction: ${transactionHash}`);
    error ? $("#errors").text(error) : $("#transaction-hash").text(`Tx Hash: ${transactionHash}`);
    web3.eth.getTransaction(transactionHash, function(error, transactionInfo) {
      if(error) $("#errors").text(error);
      else {
        $("#transaction-info").find("#hash").text(transactionInfo.hash);
        $("#transaction-info").find("#nonce").text(transactionInfo.nonce);
        $("#transaction-info").find("#block-hash").text(transactionInfo.blockHash);
        $("#transaction-info").find("#block-number").text(transactionInfo.blockNumber);
        $("#transaction-info").find("#gas-usage").text(transactionInfo.gas);
        $("#transaction-info").find("#transaction-index").text(transactionInfo.transactionIndex);
        $("#transaction-info").find("#from").text(transactionInfo.from);
        $("#transaction-info").find("#to").text(transactionInfo.to);
        $("#transaction-info").find("#value").text(transactionInfo.value);
        synchAccounts();
      }
    })
  });
});
