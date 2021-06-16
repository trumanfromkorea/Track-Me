import * as crypto from 'crypto-js';
import wallet from '../data/block.json';
const block = require('./block.js');

class blockchain {

    constructor() {
        this.blockchain = [block.genesis];
        this.difficulty = 3;
    }

    get() {
        return this.blockchain;
    }

    get latestBlock() {
        console.log(wallet.blocks.length)
        return [wallet.blocks.length, this.blockchain[this.blockchain.length - 1]];
    }

    firstValidationChecking() {
        var flag = 0;
        const blockList = wallet.blocks;

        for (var i = 0; i < blockList.length; i++) {
            var tmpIndex = blockList[i].index;
            var tmpPreviousHash = blockList[i].pre_hash;
            var tmpTimestamp = blockList[i].date;
            var tmpStoreID = blockList[i].store_id;
            var tmpUserID = blockList[i].user_id;
            var tmpNonce = blockList[i].nonce;

            const sha256 = crypto.SHA256(tmpIndex + tmpPreviousHash + tmpTimestamp + tmpStoreID + tmpUserID + tmpNonce).toString();

            if (blockList[i].hash != sha256) {
                flag++;
            }
            console.log(i,blockList.length);
            if (i == blockList.length - 1) {
                break;
            }
            if (blockList[i + 1].pre_hash != sha256) {
                flag++;
            }
        }
        if (flag == 0) {
            return true;
        } else {
            return false;
        }
    }

    calculateHash(index, previousHash, timestamp, storeID, userID, nonce) {
        const sha256 = crypto.SHA256(index + previousHash + timestamp + storeID + userID + nonce).toString()
        return sha256;
    }

    generateNextBlock(timestamp, storeID, userID) {
        const nextIndex = this.latestBlock[0] + 1;
        const previousHash = this.latestBlock[1].hash;

        let nonce = 0;
        let nextHash = this.calculateHash(
            nextIndex,
            previousHash,
            timestamp,
            storeID,
            userID,
            nonce
        );

        const nextBlock = new block(nextIndex, previousHash, timestamp, userID, storeID, nextHash, nonce);
        return nextBlock;
    }

    addBlock(newBlock) {
        this.blockchain.push(newBlock);
        wallet.blocks.push(newBlock);
    }

    checkIn(timestamp, storeID, userID) {
        const newBlock = this.generateNextBlock(timestamp, storeID, userID);
        try {
            this.addBlock(newBlock);
            console.log("WALLET", wallet);
        } catch (e) {
            throw e;
        }
    }
}

module.exports = blockchain;