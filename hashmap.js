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
    const updatedMap = [];
    for (let i = 0; i < capacity; i++) {
      updatedMap.push(null);
    }
    for (let i = 0; i < this.map.length; i++) {
      updatedMap[i] = this.map[i];
    }
    this.map = updatedMap;
  }

  hash(key) {
    let hashCode = 0;

    const primeNumber = 31;
    for (let i = 0; i < key.length; i++) {
      hashCode = primeNumber * hashCode + key.charCodeAt(i);
    }

    return hashCode;
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
      if (tempNode === null) {
        tempNode = bucket;
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
