const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = '';
        this.nonce = 0;
    };

    // npm install --save crypto-js --> gives us sha256 library for hash function
    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    };

    mineBlock(difficulty) {
        while (this.hash.substring(0,difficulty) !== Array(difficulty+1).join('0')) {
            this.nonce++
            this.hash = this.calculateHash();
        }
        console.log('Block mined: ' + this.hash)
    }
};

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        // for consistent difficulty throughout blockchain
        this.difficulty = 4;
    };

    createGenesisBlock() {
        return new Block(0, new Date().toString(), 'Genesis block', '0');
    };

    getLatestBlock() {
        return this.chain[this.chain.length-1];
    };

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    };

    isValidChain() {
        for (let i=1; i<this.chain.length; i++) {
            let currentBlock = this.chain[i];
            let previousBlock = this.chain[i-1];
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (previousBlock.hash !== currentBlock.previousHash) {
                return false;
            }
        }
        return true;
    };
};

let farahCoin = new Blockchain();
console.log('Mining block 1...')
farahCoin.addBlock(new Block(1, new Date().toString(), {amount: 4}));
console.log('Mining block 2...');
farahCoin.addBlock(new Block(2, new Date().toString(), {amount: 6}));


console.log('Is this a valid chain? ' + farahCoin.isValidChain());


