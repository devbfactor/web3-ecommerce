//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Escrow is ReentrancyGuard {

  struct orderDetails {
    uint256 ItemNumber;
    uint256 Date;
    uint256 Price;
    uint256 Amount;
    address Origin;
  }

  enum Status {
    AwaitingPayment,
    AwaitingDelivery,
    AwaitingConfirmation,
    Disputed
  }

  Status _Status;
  
  address _Buyer;

  address payable _Seller;
  
  uint256 _OrderID;
  
  bool private _Locked;

  uint256 public _Time_Start;
  
  uint256 public _Time_End;
  
  bool public _Delivery_Status;

  bytes32[] _Product_Key_Array;

  mapping(address => uint256) _Balances;
  
  mapping(address => uint256) _Amount_To_Be_Paid;
  
  mapping(uint256 => orderDetails) public _Order_Details;
  
  mapping(uint256 => Status) public _Order_Status;
  
  mapping(uint256 => bool) public _Order_Completed;
  
  mapping(uint256 => bytes32) public _Product_Key;
  
  mapping(address => uint256[]) _Order_Number;
 
  event Received(address sender, uint256 value);

  constructor() {
    _Status = Status.AwaitingPayment;
    _OrderID = 20230504;
  }

  function pay(address _seller, uint256 _itemNumber, uint256 _price, bytes32 key) external payable virtual nonReentrant {   
    
    _Locked = true;
    
    require(msg.sender != address(0), "Buyer must not be Address 0");
    require(msg.value > 0, "Amount should be not 0");
    require(_seller != address(0), "Seller address should not be address 0");
    require(_itemNumber > 0, "Item number should be greater than 0");
    require(_Status == Status.AwaitingPayment, "Status error: Possible pending transaction.");
    
    _Buyer = msg.sender;
    _Seller = payable(_seller);
    
    keyValidation(key);
    
    require(msg.sender != _seller, "Buyer must not be the seller");
    require(msg.value >= _price, "Msg.value should be equal or more than the price of the item.");
    
    _OrderID += 1;
    _Balances[address(this)] = msg.value;
    _Amount_To_Be_Paid[_Buyer] = msg.value;
  
    _Order_Details[_OrderID] = orderDetails({
      ItemNumber: _itemNumber,
      Date: block.timestamp,
      Price: _price,
      Amount: msg.value,
      Origin: msg.sender
    });
    
    _Order_Number[msg.sender].push(_OrderID);
    _Status = Status.AwaitingDelivery;
    _Order_Status[_OrderID] = _Status;

    _Product_Key_Array.push(key);
    _Product_Key[_OrderID] = key;

    deliver();

    _Order_Completed[_OrderID] = false;
  }

  function deliver() internal virtual {
    require(_Status == Status.AwaitingDelivery, "Status needs to be Awaiting Delivery");
    
    _Status = Status.AwaitingConfirmation;
    _Order_Status[_OrderID] = _Status;

    _Time_Start = block.timestamp;
    _Time_End = block.timestamp + 120;
    _Delivery_Status = true;
  }

  function confirm() external virtual {
    require(_Status == Status.AwaitingConfirmation, "Status needs to be Awaiting Confirmation");
    require(msg.sender == _Buyer, "Only the buyer can call this function");
    require(_Amount_To_Be_Paid[_Buyer] > 0, "Amount paid should be more than 0");

    uint256 amount = _Amount_To_Be_Paid[_Buyer];
    transfer(_Seller, amount);
    _Status = Status.AwaitingPayment;
    _Order_Status[_OrderID] = _Status;
    _Order_Completed[_OrderID] = true;
    _Delivery_Status = false;
    _Locked = false;
  }

  function confirmTimeout() external virtual {
    require(_Status == Status.AwaitingConfirmation, "Status needs to be Awaiting Confirmation");
    require(_Status != Status.Disputed, "Status is currently disputed");
    require(block.timestamp >= _Time_Start + 1800, "Confirmation timeout not yet reached.");
    require(_Amount_To_Be_Paid[_Buyer] > 0, "Amount paid should be more than 0");
    

    uint256 amount = _Amount_To_Be_Paid[_Buyer];
    transfer(_Seller, amount);
    _Status = Status.AwaitingPayment;
    _Order_Completed[_OrderID] = true;
    _Delivery_Status = false;
    _Locked = false;
  }

  function dispute() external {
    require(_Status == Status.AwaitingConfirmation);
    require(msg.sender == _Buyer, "Buyer must not be the caller of this function");
    require(msg.sender != address(0), "Buyer must not be Address 0");
    require(_Delivery_Status = true, "Item hasn't delivered yet");
    
    _Status = Status.Disputed;
    _Order_Status[_OrderID] = _Status;
    _Delivery_Status = false;
  }

  function OrderNumber(address _address) external view virtual returns (uint256[] memory) {
    uint256[] memory _orderNum =  _Order_Number[_address];
    return _orderNum;
  }

  function transfer(address payable to, uint256 amount) internal nonReentrant virtual {
    require(to != address(0), "transfer to the zero address");
    _Balances[address(this)] = address(this).balance - amount;
    
    (bool success) = to.send(amount);

    require( success, "Failed to withdraw");
    _Balances[to] += amount;

  }

  function keyValidation(bytes32 key) internal virtual {
    for (uint i=0; i<_Product_Key_Array.length; i++) {
      require(key != _Product_Key_Array[i], "Keygen already used");
    }
  }

  // This function is called if the buyer disputes the transaction
  // function disputeResolution() public {
  //   require(_Status == Status.Disputed);
  //   // TODO: Implement dispute resolution mechanism
  // }

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

}
