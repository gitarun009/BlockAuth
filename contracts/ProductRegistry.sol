// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ProductRegistry {
    struct Product {
        string name;
        address manufacturer;
        uint256 timestamp;
    }

    mapping(uint256 => Product) public products;
    uint256 public productCount;

    event ProductRegistered(uint256 indexed productId, string name, address manufacturer);

    function registerProduct(string memory name) public {
        productCount++;
        products[productCount] = Product(name, msg.sender, block.timestamp);
        emit ProductRegistered(productCount, name, msg.sender);
    }

    function getProduct(uint256 productId) public view returns (string memory, address, uint256) {
        Product memory p = products[productId];
        return (p.name, p.manufacturer, p.timestamp);
    }
} 