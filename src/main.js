import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";
import BigNumber from "bignumber.js";
import pizzaPapAbi from "../contract/pizzapap.abi.json";

const ERC20_DECIMALS = 18;
const PPContractAddress = "0xB47C37297AB4a38873C77872aEf205a0F314C40b";

var price, crust_price;

let total = 0;

let currentOrders = [];

let userOrders = [];
let contract;
let kit;

class Pizza {
  constructor(id, name, size, crust, toppings, total) {
    this.id = id;
    this.name = name;
    this.size = size;
    this.crust = crust;
    this.toppings = toppings;
    this.total = total;
    this.status = false;
  }
}

function notification(_text) {
  document.querySelector(".alert").style.display = "block";
  document.querySelector("#notification").textContent = _text;
}

function notificationOff() {
  document.querySelector(".alert").style.display = "none";
}

const connectCeloWallet = async function () {
  if (window.celo) {
    notification("⚠️ Please approve this DApp to use it.");
    try {
      await window.celo.enable();
      setTimeout(notificationOff(), 5000);

      const web3 = new Web3(window.celo);
      kit = newKitFromWeb3(web3);

      const accounts = await kit.web3.eth.getAccounts();
      kit.defaultAccount = accounts[0];

      contract = new kit.web3.eth.Contract(pizzaPapAbi, PPContractAddress);
    } catch (error) {
      notification(`⚠️ ${error}.`);
    }
  } else {
    notification("⚠️ Please install the CeloExtensionWallet.");
  }
};

const getBalance = async function () {
  notification("⌛ Getting User Balance...");
  try {
    const totalBalance = await kit.getTotalBalance(kit.defaultAccount);
    const CELOBalance = totalBalance.CELO.shiftedBy(-ERC20_DECIMALS).toFixed(2);
    document.querySelector("#balance").textContent = CELOBalance;
  } catch (error) {
    notification(`⚠️ ${error}.`);
  }
  setTimeout(notificationOff(), 5000);
};

const getUserOrders = async function () {
  notification("⌛ Getting User Orders...");
  try {
    userOrders = await contract.methods
      .getUserOrders(kit.defaultAccount)
      .call();
    renderOrders();
  } catch (error) {
    notification(`⚠️ ${error}.`);
  }
  setTimeout(notificationOff(), 5000);
};

const renderOrders = function () {
  $("#userorders").html("");

  for (let i = 0; i < userOrders.length; i++) {
    let order = userOrders[i];
    if (order.status) {
      $("#userorders").append(
        '<tr class="align-middle"><td id="id">' +
          order.id +
          '</td><td id="pizzaname">' +
          order.name +
          '</td><td id="pizzasize">' +
          order.size +
          '</td><td id="pizzacrust">' +
          order.crust +
          '</td><td id="pizzatopping">' +
          order.toppings.join(", ") +
          '</td><td id="totals">' +
          new BigNumber(order.total).shiftedBy(-ERC20_DECIMALS).toFixed(2) +
          '</td><td id="status">Delivery confirmed</td></tr>'
      );
    } else {
      $("#userorders").append(
        '<tr class="align-middle"><td id="id">' +
          order.id +
          '</td><td id="pizzaname">' +
          order.name +
          '</td><td id="pizzasize">' +
          order.size +
          '</td><td id="pizzacrust">' +
          order.crust +
          '</td><td id="pizzatopping">' +
          order.toppings.join(", ") +
          '</td><td id="totals">' +
          new BigNumber(order.total).shiftedBy(-ERC20_DECIMALS).toFixed(2) +
          '</td><td id="status">' +
          '<button class="btn btn-green confirm" id=' +
          order.id +
          "> Confirm Delivery </button>" +
          "</td></tr>"
      );
    }
  }
};

const placeUserOrders = async function (
  orders,
  name,
  location,
  number,
  amount
) {
  let value = new BigNumber(amount).shiftedBy(ERC20_DECIMALS).toString();
  try {
    await contract.methods
      .placeOrder(orders, name, location, number)
      .send({ from: kit.defaultAccount, value });
    await getBalance();
    await getUserOrders();
    return true;
  } catch (error) {
    notification(`⚠️ ${error}.`);
    return false;
  }
};

const confirmReceipt = async function (id) {
  await contract.methods.confirmReceipt(id).send({ from: kit.defaultAccount });
};

// proceed to the next step button
$(document).ready(function () {
  $("button.proceed").click(function (event) {
    let pname = $(".name option:selected").val();
    let psize = $("#size option:selected").val();
    let pcrust = $("#crust option:selected").val();
    let ptopping = [];
    let totalAmount = 0;
    $.each($("input[name='toppings']:checked"), function () {
      ptopping.push($(this).val());
    });

    switch (psize) {
      case "large":
        price = 2.0;
        break;
      case "medium":
        price = 1.5;
        break;
      case "small":
        price = 1.0;
        break;
      default:
        price = 0;
    }

    switch (pcrust) {
      case "Crispy":
        crust_price = 0.5;
        break;
      case "Stuffed":
        crust_price = 0.5;
        break;
      case "Gluten-free":
        crust_price = 0.3;
        break;
      default:
        crust_price = 0;
    }

    let topping_value = (ptopping.length * 10.0) / 100.0;

    if (pname == "none" || psize == "none" || pcrust == "none") {
      $("button.proceed").show();
      $("#information").show();
      $("div.choise").hide();
      alert("Please select pizza size and crust");
    } else {
      $("button.proceed").hide();
      $("#information").hide();
      $("div.choise").slideDown(1000);
    }

    total = price + crust_price + topping_value;

    let checkoutTotal = 0;

    checkoutTotal = checkoutTotal + total;

    $("#pizzaname").html($(".name option:selected").val());
    $("#pizzasize").html($("#size option:selected").val());
    $("#pizzacrust").html($("#crust option:selected").val());
    $("#pizzatopping").html(ptopping.join(", "));
    $("#totals").html(total.toFixed(2));

    var currentId = userOrders.length;
    var newOrder = new Pizza(
      currentId,
      pname,
      psize,
      pcrust,
      ptopping,
      new BigNumber(total.toFixed(2)).shiftedBy(ERC20_DECIMALS).toString()
    );

    currentOrders.push(newOrder);

    // Addition of pizza button
    $("button.addPizza").click(function () {
      let pname = $(".name option:selected").val();
      let psize = $("#size option:selected").val();
      let pcrust = $("#crust option:selected").val();
      let ptopping = [];
      $.each($("input[name='toppings']:checked"), function () {
        ptopping.push($(this).val());
      });

      switch (psize) {
        case "large":
          price = 2.0;
          break;
        case "medium":
          price = 1.5;
          break;
        case "small":
          price = 1.0;
          break;
        default:
          price = 0;
      }

      switch (pcrust) {
        case "Crispy":
          crust_price = 0.5;
          break;
        case "Stuffed":
          crust_price = 0.5;
          break;
        case "Gluten-free":
          crust_price = 0.3;
          break;
        default:
          crust_price = 0;
      }

      let topping_value = (ptopping.length * 10.0) / 100.0;

      total = price + crust_price + topping_value;

      checkoutTotal = checkoutTotal + total;

      var nextId = currentOrders[currentOrders.length - 1].id;
      // constructor function
      var newOrder = new Pizza(
        nextId + 1,
        pname,
        psize,
        pcrust,
        ptopping,
        new BigNumber(total.toFixed(2)).shiftedBy(ERC20_DECIMALS).toString()
      );

      currentOrders.push(newOrder);

      $("#ordersmade").append(
        '<tr><td id="pizzaname">' +
          newOrder.name +
          '</td><td id="pizzasize">' +
          newOrder.size +
          '</td><td id="pizzacrust">' +
          newOrder.crust +
          '</td><td id="pizzatopping">' +
          newOrder.toppings.join(", ") +
          '</td><td id="totals">' +
          new BigNumber(newOrder.total).shiftedBy(-ERC20_DECIMALS).toFixed(2) +
          "</td></tr>"
      );
    });

    // Checkout button
    $("button#checkout").click(function () {
      $("button#checkout").hide();
      $("button.addPizza").hide();
      $(".pizzatable").hide();
      $(".choise h2").hide();
      $(".delivery").slideDown(1000);
      totalAmount = checkoutTotal + 0.2;
      $("#totalbill").append(
        "Your bill plus delivery fee is: " +
          totalAmount.toFixed(2) +
          " CELO." +
          " Delivery fee 0.2 CELO"
      );
    });

    // when one clicks place order button
    $("button#final-order").click(async function (event) {
      event.preventDefault();
      $(".delivery").hide();
      $("button#final-order").hide();
      let person = $("input#name").val();
      let phone = $("input#phone").val();
      let location = $("input#location").val();

      if (
        $("input#name").val() &&
        $("input#phone").val() &&
        $("input#location").val() != ""
      ) {
        $("#paymentmessage").append("Please confirm payment on wallet");
        $("#paymentmessage").slideDown(1200);

        notification(`⌛ Placing your orders...`);

        let result = await placeUserOrders(
          currentOrders,
          person,
          location,
          phone.toString(),
          totalAmount.toFixed(2)
        );

        if (result) {
          notification(`🎉 Order placed successfully".`);
          $("#finallmessage").append(
            "Hello " +
              person +
              ", We have recieved your order and it will be delivered to you at " +
              location +
              " thanks for ordering at PizzaPap"
          );
          $("#totalbill").hide();
          $("#paymentmessage").hide();
          $("#finallmessage").slideDown(1200);
        } else {
          $("#finallmessage").append(
            "Sorry " +
              person +
              " order not placed successfully " +
              " please try again."
          );
          $("#paymentmessage").hide();
          $("#totalbill").hide();
          $("#finallmessage").slideDown(1200);
        }
      } else {
        alert("Please fill in the details for delivery!");
        $(".delivery").show();
        $("button#final-order").show();
      }
    });
    event.preventDefault();
  });
});

document.querySelector("#userorders").addEventListener("click", async (e) => {
  if (e.target.className.includes("confirm")) {
    const index = e.target.id;
    notification(`⌛ Confirming delivery for order ${index}...`);
    try {
      const result = await confirmReceipt(index);
      notification(`🎉 Receipt successfully confirmed".`);
      getUserOrders();
      getBalance();
    } catch (error) {
      notification(`⚠️ ${error}.`);
    }
  }
});

window.addEventListener("load", async () => {
  notification("⌛ Loading...");
  await connectCeloWallet();
  await getBalance();
  await getUserOrders();
  setTimeout(notificationOff(), 5000);
});
