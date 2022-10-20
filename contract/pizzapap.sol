// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

contract PizzaPap {
    address owner;

    struct Order {
        uint256 id;
        string name;
        string size;
        string crust;
        string[] toppings;
        uint256 total;
        bool completed;
    }

    struct CustomerDetails {
        string name;
        string location;
        string phoneNumber;
    }

    mapping(address => Order[]) internal orders;

    mapping(address => CustomerDetails) internal customerDetails;

    constructor() {
        owner = msg.sender;
    }

    function placeOrder(
        Order[] memory _orders,
        string memory _name,
        string memory _location,
        string memory _number
    ) public payable {
        require(_orders.length <= 10, "Too much orders");

        // transfer amount
        (bool success, ) = payable(owner).call{value: msg.value}("");
        require(success, "Transfer of order amount failed");

        for (uint256 i = 0; i < _orders.length; i++) {
            orders[msg.sender].push(_orders[i]);
        }

        customerDetails[msg.sender] = CustomerDetails(
            _name,
            _location,
            _number
        );
    }

    function confirmReceipt(uint256 _orderId) public {
        Order storage _order = orders[msg.sender][_orderId];
        require(_order.completed == false, "Order already Completed");
        _order.completed = true;
    }

    function getUserOrders(address _address)
        public
        view
        returns (Order[] memory)
    {
        return (orders[_address]);
    }

    function getOwner() public view returns (address) {
        return owner;
    }
}
