// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

contract PizzaPap {
    address private owner;



    uint public orderFee = 0.5 ether;

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
        bool registered;
    }

    mapping(address => Order[]) private orders;

    mapping(address => CustomerDetails) private customerDetails;

    constructor() {
        owner = msg.sender;
    }


    modifier checkIfRegistered(){
        require(customerDetails[msg.sender].registered, "You need to register first");
        _;
    }

    /**
        * @dev allow registered customers to place orders
     */
    function placeOrder(
        Order[] memory _orders
    ) public payable checkIfRegistered() {
        
        require(_orders.length <= 10, "Too much orders");
        require(orderFee == msg.value, "You need to pay the order fee to be able to place orders");

        // assign an id to each order using the current orders array's length of customer
        // this will prevent ids on the frontend to collide with each other which could cause unexpected bugs 
        for (uint256 i = 0; i < _orders.length; i++) {
            _orders[i].id = orders[msg.sender].length;
            orders[msg.sender].push(_orders[i]);
        }

        // transfer amount
        (bool success, ) = payable(owner).call{value: msg.value}("");
        require(success, "Transfer of order amount failed");
    }


    /**
        * @dev allow users to create and register themselves. Users can also call this function again to update their credentials.
        * @notice details entered needs to be valid
     */
    function saveCustomerDetails(string calldata _name,string calldata _location, string calldata _number) public {
        require(bytes(_name).length > 0, "Empty name");
        require(bytes(_location).length > 0, "Empty location");
        require(bytes(_number).length > 7, "Empty number");
        CustomerDetails storage currentCustomer = customerDetails[msg.sender];
        currentCustomer.name = _name;
        currentCustomer.phoneNumber = _number;
        currentCustomer.location = _location;
        if(!currentCustomer.registered){
            currentCustomer.registered = true;
        }
    }

    /**
        * @dev allow customers to confirm that an order has been received
     */
    function confirmReceipt(uint256 _orderId) public checkIfRegistered() {
        Order storage _order = orders[msg.sender][_orderId];
        require(_order.status == false, "Order already Completed");
        _order.status = true;
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
