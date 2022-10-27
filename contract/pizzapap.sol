// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

/** @title PizzaPap Lottery
 *  @notice IT is a contract that controls the payment system of a pizza shop.
 */
contract PizzaPap {
    address owner;

    struct Order {
        uint256 id;
        string name;
        string size;
        string crust;
        string[] toppings;
        uint256 total;
        bool status;
    }

    struct CustomerDetails {
        string name;
        string location;
        string phoneNumber;
    }

    // mapping of customer addresses to their orders
    mapping(address => Order[]) internal orders;

    // mapping of customer delivery details to their address.
    mapping(address => CustomerDetails) internal customerDetails;

    /**
     * @notice Constructor that sets owner to who deploys the contract
     */
    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice place orders for delivery
     * @param _orders: pizza orders
     * @param _name: customer delivery name
     * @param _location: customer delivery location
     * @param _number: customer delivery number
     */
    function placeOrder(
        Order[] memory _orders,
        string memory _name,
        string memory _location,
        string memory _number
    ) public payable {
        require(_orders.length <= 10, "Too much orders");

        // transfer amount to pizza owner
        (bool success, ) = payable(owner).call{value: msg.value}("");
        require(success, "Transfer of order amount failed");

        // loop through array and store customer orders in mapping
        for (uint256 i = 0; i < _orders.length; i++) {
            orders[msg.sender].push(_orders[i]);
        }

        // update customer details with new delivery details entered by customer
        customerDetails[msg.sender] = CustomerDetails(
            _name,
            _location,
            _number
        );
    }

    /**
     * @notice confirm receipt of order
     * @param _orderId: id of order.
     */
    function confirmReceipt(uint256 _orderId) public {
        Order storage _order = orders[msg.sender][_orderId];
        require(_order.status == false, "Order already Completed");
        _order.status = true;
    }

    /**
     * @notice get array of customer orders
     * @param _address: customer address
     */
    function getUserOrders(address _address)
        public
        view
        returns (Order[] memory)
    {
        return (orders[_address]);
    }

    /**
     * @notice get delivery details of customer
     * @param _address: customer address
     */
    function getCustomerDetails(address _address)
        public
        view
        returns (CustomerDetails memory)
    {
        return customerDetails[_address];
    }

    /**
     * @notice returns owner address
     */
    function getOwner() public view returns (address) {
        return owner;
    }
}
