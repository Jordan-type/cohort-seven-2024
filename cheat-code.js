import { ethers } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

// This utility function will help you create a wallet using different methods.
const createWallets = async () => {
  try {
    console.log("### Creating Wallets ###");

    // 1. Create Wallet using Random Private Key
    const randomWallet = ethers.Wallet.createRandom();
    console.log("Random Wallet Address:", randomWallet.address);
    console.log("Random Wallet Private Key:", randomWallet.privateKey);

    // 2. Create Wallet using Private Key
    const privateKey = "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
    const walletFromPrivateKey = new ethers.Wallet(privateKey);
    console.log("Wallet from Private Key Address:", walletFromPrivateKey.address);

    // 3. Create Wallet using Mnemonic
    const mnemonicPhrase = "test test test test test test test test test test test junk";
    const walletFromMnemonic = ethers.Wallet.fromPhrase(mnemonicPhrase);
    console.log("Wallet from Mnemonic Address:", walletFromMnemonic.address);
    console.log("Mnemonic Phrase:", walletFromMnemonic.mnemonic.phrase);

    // 4. Encrypt Wallet to JSON Keystore
    const password = "myStrongPassword123";
    const encryptedJson = await walletFromPrivateKey.encrypt(password);
    console.log("Encrypted Wallet JSON:", encryptedJson);

    // 5. Decrypt Encrypted JSON to Retrieve Wallet
    const decryptedWallet = await ethers.Wallet.fromEncryptedJson(encryptedJson, password);
    console.log("Decrypted Wallet Address:", decryptedWallet.address);

  } catch (error) {
    console.error("Error creating wallets:", error);
  }
};

// Function for signing a message
const signMessages = async () => {
  try {
    console.log("### Signing Messages ###");

    // 1. Create a wallet from a private key
    const privateKey = "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
    const wallet = new ethers.Wallet(privateKey);

    // 2. Sign a message
    const message = "This is a message to be signed!";
    const signature = await wallet.signMessage(message);
    console.log("Message:", message);
    console.log("Signature:", signature);

    // 3. Verify the message
    const recoveredAddress = ethers.verifyMessage(message, signature); // Updated to correct usage
    console.log("Recovered Address:", recoveredAddress);
  } catch (error) {
    console.error("Error signing messages:", error);
  }
};

// Function to handle HDNodeWallet
const createHDWallets = async () => {
  try {
    console.log("### Handling HD Wallets ###");

    // 1. Create an HD Wallet using Mnemonic
    const mnemonic = ethers.Wallet.createRandom().mnemonic.phrase;
    console.log("Generated Mnemonic Phrase:", mnemonic);

    const hdWallet = ethers.HDNodeWallet.fromPhrase(mnemonic);
    console.log("HD Wallet Root Address:", hdWallet.address);
    console.log("HD Wallet Path:", hdWallet.path);

    // 2. Derive a Child Account (Example at Index 1)
    const childWallet = hdWallet.deriveChild(1); // Use deriveChild instead of derivePath for non-root nodes
    console.log("Derived Child Wallet Address:", childWallet.address);

    // 3. Encrypt HD Wallet
    const password = "secureHDWallet";
    const encryptedJson = await hdWallet.encrypt(password);
    console.log("Encrypted HD Wallet JSON:", encryptedJson);
  } catch (error) {
    console.error("Error handling HD Wallets:", error);
  }
};

// Execute wallet operations
(async () => {
  await createWallets(); // Create different types of wallets
  await signMessages();  // Sign a message
  await createHDWallets(); // Handle HD Wallets
})();



// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.2;

import "./BookStore.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AdvancedBookStore is BookStore {
    mapping(uint256 => bool) public bestsellers;

    event BookRemoved(uint256 indexed  bookId);
    event BookMarkedAsBestseller(uint256 indexed  bookId);

    constructor(address _owner) BookStore(_owner) {}


    // mark book as a bestseller
    function markAsBestseller(uint256 _bookId) public onlyOwner {
        require(books[_bookId].price != 0, "Book does not exist.");
        bestsellers[_bookId] = true;
        emit BookMarkedAsBestseller(_bookId);
    }
// isAdmin, isAuth, isUser - true or false
    function isBestseller(uint256 _bookId) public view returns (bool) {
        return bestsellers[_bookId];
    }

    // Function to remove a book from the store
    function removeBook(uint256 _bookId) public onlyOwner {
        require(books[_bookId].price != 0, "Book does not exist.");
        delete books[_bookId];

        for (uint256 i = 0; i < bookIds.length; i++) {
            if (bookIds[i] == _bookId) {
                bookIds[i] = bookIds[bookIds.length - 1];
                bookIds.pop(); // array remove
                break;
            }
        }

        if (bestsellers[_bookId]) {
            delete bestsellers[_bookId]; // Remove from bestsellers if applicable
        }

        emit BookRemoved(_bookId);
    }

}


// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/Ownable.sol";

// Book Store - we have an owner
// Books - cat_name, price, author, title, isbn, available
// - string, uint, int, bool
// uint8 (137) - unit256 (878687678678687876) 2*8 2*256
// int8 - int255 

// struct - grouping items
// mapping - used to store items with thier unique id
// array - two type - dynamic, fixed size unit256[] and unit256[4]
// event - notify about new addition or act as audit trail
// variables - global, state, local

// functions - setters and getters
// addBooks() - event BookAdded setter - setting data
// getBook() - getter - getting data
// buyBook() - event 
// getTotalBooks() - 

// inheritance - 

// more than 2 contracts
// index contract - entry point for all your other contracts
// interface contracts - abstracts functions that are reusable  - IERC20
// modifer contracts - require statements thats reusable 
// opezzenplin contracts -

// ABI - Application Binary Interface - xml, json, graphql - bridge between la backend python, php, javascript - react or next or reactNative

// example - assignment 
// create a loyaltyProgram - contract for the bookstore - two addPoint to user address, getUserPoints
// use the opezepplin contract for ownable 
// create a discount contract - two functions - setDiscount(either fixed or percentage), getDiscountedPrice
// use the points for the discount - 

// Events Advanced 
// - event filtering and montering - realtime upadtes and analytiics
// - event log analysis and decoding for data 
// - event driven architectures for dApps - stages = BookAdded, PurchaseInitiated, PurchaseConfirmed, SubscriptionAdded, SubscriptionRemoved
// - event subscription - notifications and updates  


contract BookStore is Ownable {

    struct Book {
        string title;
        string author;
        uint price;
        uint256 stock;
        bool isAvailable;
    }

    mapping(uint256 => Book) public books;
    mapping(address => bool) public subscribers;
    
    address[] public subscriberList;
    uint256[] public bookIds;

    event BookAdded(uint256 indexed bookId, string title, string author, uint256 price, uint256 stock);
    event PurchaseIntiated(uint256 indexed bookId, address indexed buyer, address indexed seller,  uint256 quantity);  // add a seller address for the event
    event PurchaseConfirmed(uint256 indexed bookId, address indexed buyer, address indexed seller, uint256 quantity); // add a seller address
    event SubscriptionAdded(address indexed subscriber);          // complete on this two 
    event SubscriptionRemoved(address indexed subscriber);
    
     constructor(address initialOwner) Ownable(initialOwner) {

     }

     function addBook(uint256 _bookId, string memory _title, string memory _author, uint256 _price, uint256 _stock) public onlyOwner {
        require(books[_bookId].price == 0, "Book already exists with this ID.");
        books[_bookId] = Book({
            title: _title,
            author: _author,
            price: _price * 1 ether, // Proper conversion to make sure price is in wei
            stock: _stock,
            isAvailable: _stock > 0
        });
        bookIds.push(_bookId); // push() , remove()
        emit BookAdded(_bookId, _title, _author, _price, _stock);
    }
    
    function getBooks(uint256 _bookId) public view returns (string memory, string memory, uint256, uint256, bool) {
        Book memory book = books[_bookId];
        return (book.title, book.author, book.price, book.stock, book.isAvailable);
    }

    // quantity = should a whole integer = 0.000000000000000006 but we need it like 6.0000000000000000
    // clue your assignment = 2**18 add this make quantity to 6.0000000000000000 also check ether conversations
    function buyBook(uint256 _bookId, uint256 _quantity) public payable {
        Book storage book = books[_bookId];
        require(book.isAvailable, "This book is not available.");
        require(book.stock >= _quantity, "Not enough stock available.");

        uint256 totalPrice = book.price * _quantity;
        require(msg.value == totalPrice, "Incorrect payment amount.");
        require(msg.value <= totalPrice, "Overpaid for book purchase.");

        emit PurchaseIntiated(_bookId, msg.sender, owner(), _quantity);

        // Transfer payment to the owner
        payable(owner()).transfer(msg.value);
    }

    function confirmPurchase(uint256 _bookId, uint256 _quantity) public onlyOwner {
        Book storage book = books[_bookId];
        require(book.stock >= _quantity, "Not enough stock to confirm purchase.");
        
        book.stock -= _quantity;
        if (book.stock == 0) {
            book.isAvailable = false;
        }

        emit PurchaseConfirmed(_bookId, msg.sender, owner(), _quantity);
    }

}


// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;


// function needs to return outputs
// note is that a public func cannot accept certain data type as inputs or outputs
contract Function {
    // func that can return multiple values
    function returnMany() public  pure returns (uint8, bool, uint8) {
        return (1, true, 1);
    }
    
    // its best to have named return values specially where is no named return variables
    function named() public  pure returns (uint8 x, bool y, uint8 z) {
        return (1, true, 1);
    }

    // return values can be assigned to thier name
    // allows for simple code writing - omit the the key word return 
    function assigned() public pure returns(uint8 x, uint8 y, uint8 z) {
      x = 1;
      y = 2;
      
      // sum of two numbers x + y = z
      z =  x + y; // output = 3

    }

    function destructuringAssignments() public pure returns (uint8, bool, uint8) {
        (uint8 i, bool b, uint8 j) = returnMany();

        return (i, b, j);
    }

//     // function to get pen details at a specific index - id (0, 1, 5)
// function getPen(uint256 _index) public view returns (string memory, PenType, uint256, bool) {
//     require(_index < pens.length, "Pen does not exist"); // conditions
//     Pen memory pen = pens[_index];

//     return (pen.brand, pen.penType, pen.stock, pen.isAvailable);
// }

// add buy funactionality to PEN Store
// function buyPen(uint256 _index) public {
//    (uint8 i, bool b, uint8 j) = getPen(_index); 
// }


    function arrayInput(uint256[] memory _arr) public {}
    
    // Can use array for output
    uint256[] public arr;

    function arrayOutput() public view returns (uint256[] memory) {
        return arr;
    }


}

