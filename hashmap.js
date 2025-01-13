/*
if (index < 0 || index >= buckets.length) {
  throw new Error("Trying to access index out of bounds");
}*/

class HashMap {
  constructor() {
    this.capacity = 16;
    this.loadFactor = 0;
    this.map = [];
  }

  initMap() {
    //create a shallow copy of our map
    const shallowCopy = this.map.slice();
    //create a new full capacity empty map
    for (let i = 0; i < this.capacity; i++) {
      this.map.push(null);
    }
    //rehash all keys in the old buckets and spread them over the new map
    shallowCopy.forEach((bucket) => {
      // if the bucket has only 1 key value pair
      if (bucket.nextNode === null) {
        const newHashKey = this.hash(bucket.key);
        this.set(newHashKey, bucket.value);
      }
      // if the bucket has a linked list, loop and hash each
      if (bucket.nextNode !== null) {
        let node = bucket;
        while (node !== null) {
          const newHashKey = this.hash(node.key);
          this.set(newHashKey, node.value);
          node = node.nextNode;
          // we dont have to reset the nextNode to null since we are
          // taking the key and value and creating entire new linked lists
          // via out set method.
        }
      }
    });

    for (let i = 0; i < this.map.length; i++) {
      updatedMap[i] = this.map[i];
    }
    this.map = updatedMap;
  }

  hash(key) {
    let hashCode = 0;
    const primeNumber = 31;
    for (let i = 0; i < key.length; i++) {
      hashCode = (primeNumber * hashCode + key.charCodeAt(i)) % this.capacity;
    }
    return Math.abs(hashCode);
  }

  set(key, value) {
    const bucket = { key, value, nextNode: null };
    const hashIndex = this.hash(key);
    // if the index is empty
    if (this.map[hashIndex] === null) {
      this.map[hashIndex] = bucket;

      return;
    }
    // to modify a value for an existing key at the head
    if (this.map[hashIndex] !== null && this.map[hashIndex].key === key) {
      this.map[hashIndex].value = value;
      return;
    }
    // to modify a value for an existing key in a linked list or create a new list item
    if (this.map[hashIndex] !== null && this.map[hashIndex].key !== key) {
      let tempNode = this.map[hashIndex];
      while (tempNode.nextNode !== null && tempNode.nextNode.key !== key) {
        tempNode = tempNode.nextNode;
      }
      if (tempNode.key && tempNode.key === key) {
        tempNode.value = value;
      }
      if (tempNode.nextNode === null) {
        tempNode.nextNode = bucket;
      }
      return;
    }
  }

  get(key) {}
  has(key) {}
  remove(key) {}

  length() {
    let count = 0;
    for (let i = 0; i < this.map.length; i++) {
      if (this.map[i] !== null) count++;
    }
    return count;
  }
  clear() {
    this.map = [];
    this.initMap();
    return this.map;
  }
  keys() {}
  values() {}
  entries() {}
}

const myMap = hashmapGenerator();
console.log(myMap);
