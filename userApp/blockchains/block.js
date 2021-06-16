class Block {
    constructor (index, previousHash, timestamp, userID, storeID, hash, nonce) {
      this.index = index;
      this.pre_hash = previousHash;
      this.date = timestamp;
      this.user_id = userID;
      this.store_id = storeID;
      this.hash = hash;
      this.nonce = nonce;
    }
  
    static get genesis() {
      return new Block(
        0,
        "0",
        1508270000000,
        "USER_ID",
        "STORE_ID",
        "generic block",
        "000dc75a315c77a1f9c98fb6247d03dd18ac52632d7dc6a9920261d8109b37cf",
        604
      );
    }
  }
  
  module.exports = Block;