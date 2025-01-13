/*
if (index < 0 || index >= buckets.length) {
  throw new Error("Trying to access index out of bounds");
}*/

class HashMap {
  constructor(capacity) {
    this.map = [];
    this.capacity = capacity;
    this.loadFactor = this.length() / this.capacity;
    this.isBeingResized = false;
    // call initMap automatically when a new object is created
    this.initMap();
  }

  // initMap:
  // if the map is empty, it fills its capacity with nulls and early returns since
  // length() would be zero. if the map has items it creates a shallow copy and
  // then intialize a new map with new capacity then rehashes those items from the
  // shallow copy into the newly created expanded or shrunk map. To prevent short
  // circuiting during an event of rehashing, isBeingResized blocks checkLoad
  // which gets called after each item is rehashed via set(). The logic of rehashing
  // works via rehashing all keys in the shallow copy and spread them over the new map
  // first if statement in the forEach : if the bucket has only 1 key value pair.
  // 2nd if: if the bucket has a linked list, loop and hash each node starting by 0.
  // we dont have to reset the nextNode to null since we are taking the key and
  // value and creating entire new linked lists via out set method.
  // lastly reset the isBeingResized to allow resizing if needed.

  initMap() {
    this.isBeingResized = true;
    const hasItems = this.length();
    const shallowCopy = this.map.slice();
    for (let i = 0; i < this.capacity; i++) {
      this.map.push(null);
    }
    if (hasItems === 0) return;
    shallowCopy.forEach((bucket) => {
      if (bucket.nextNode === null) {
        const newHashKey = this.hash(bucket.key);
        this.set(newHashKey, bucket.value);
      }
      if (bucket.nextNode !== null) {
        let node = bucket;
        while (node !== null) {
          const newHashKey = this.hash(node.key);
          this.set(newHashKey, node.value);
          node = node.nextNode;
        }
      }
    });
    this.isBeingResized = false;
  }

  hash(key) {
    let hashCode = 0;
    const primeNumber = 31;
    for (let i = 0; i < key.length; i++) {
      hashCode = (primeNumber * hashCode + key.charCodeAt(i)) % this.capacity;
    }
    return Math.abs(hashCode);
  }

  //set:
  // takes the key and value and creates a temp bucket with a hashKey. then if the
  // index corresponding to the  hashKey is empty it adds the bucket, if there is a index
  // if checks if the key matches the existing key, if a match it changes the value
  // if no match, then it checks if there is a linked list, if there is: it loops through
  // each node and tries to find a key matching the given key. if it does, then it updates
  // the value. if it doesnt then it adds it to the tail of the linked list [works also if
  // the linked list has only a head]. after each new bucket item is introduced, it recal-
  // culates the load factor and checks the load limits to intialize an expansion if needed

  set(key, value) {
    const bucket = { key, value, nextNode: null };
    const hashIndex = this.hash(key);
    if (this.map[hashIndex] === null) {
      this.map[hashIndex] = bucket;
      this.checkLoad();
      return;
    }
    if (this.map[hashIndex] !== null && this.map[hashIndex].key === key) {
      this.map[hashIndex].value = value;
      return;
    }
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
        this.checkLoad();
      }
      return;
    }
  }

  //checkload:
  // gets called after each item is added or removed. it first updates
  // the load factor. then only if there is no process of rehashing going
  // it proceeds to check if a rehash and expansion or shrinkage is needed
  // shrinkage can only happen if the limit above a base capacity of 16

  checkLoad() {
    this.loadFactor = this.length() / this.capacity;
    if (this.isBeingResized === true) return;
    if (this.loadFactor >= 0.8) {
      this.capacity = this.capacity * 2;
      this.initMap();
      return;
    }
    if (this.loadFactor <= 0.2 && this.capacity > 16) {
      this.capacity = this.capacity / 2;
      this.initMap();
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
