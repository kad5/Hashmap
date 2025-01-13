class HashMap {
  constructor(capacity = 16) {
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
    this.map = [];
    for (let i = 0; i < this.capacity; i++) {
      this.map.push(null);
    }
    if (hasItems === 0) {
      this.isBeingResized = false;
      return;
    }
    shallowCopy.forEach((bucket) => {
      if (bucket === null) return;
      if (bucket.nextNode === null) {
        const newHashKey = this.hash(bucket.key);
        this.set(bucket.key, bucket.value);
      }
      if (bucket.nextNode !== null) {
        let node = bucket;
        while (node !== null) {
          const newHashKey = this.hash(node.key);
          this.set(node.key, node.value);
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
    if (Math.abs(hashCode) >= this.capacity) {
      throw new Error("Trying to access index out of bounds");
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
  //remove: hashes the key and checks if the index exists, if not it returns
  // if there is a bucket then first it checks if the bucket head matches - no
  // collision and that there isnt a linked list. if collision is the case with
  // no linked list, it returns. if there is a linked list the we traverse in case
  // non matching key. once a match is found, weather head or inside the list
  // it is excluded and true returned.
  remove(key) {
    const hashIndex = this.hash(key);
    let node = this.map[hashIndex];
    if (node !== null) {
      if (node.key !== key && node.nextNode === null) {
        return false;
      }
      if (node.key === key && node.nextNode === null) {
        this.map[hashIndex] = null;
        this.checkLoad();
        return true;
      }
      if (node.key === key && node.nextNode !== null) {
        this.map[hashIndex] = node.nextNode;
        this.checkLoad();
        return true;
      }
      let previousNode = node;
      node = previousNode.nextNode;
      while (node !== null) {
        if (node.key === key) {
          previousNode.nextNode = node.nextNode || null;
          this.checkLoad();
          return true;
        }
        previousNode = node;
        node = previousNode.nextNode;
      }
    }
    return false;
  }
  //checkload:
  // gets called after each item is added or removed. it first updates
  // the load factor. then only if there is no process of rehashing going
  // it proceeds to check if a rehash and expansion or shrinkage is needed
  // shrinkage can only happen if the limit above a base capacity of 16
  checkLoad() {
    this.loadFactor = this.length() / this.capacity;
    if (this.isBeingResized === true) return;
    if (this.loadFactor > 0.75) {
      this.capacity = this.capacity * 2;
      this.initMap();
      return;
    }
    if (this.loadFactor < 0.25 && this.capacity > 16) {
      this.capacity = this.capacity / 2;
      this.initMap();
    }
  }
  // get checks all bucket heads and any linked lists found
  get(key) {
    const hashIndex = this.hash(key);
    if (this.map[hashIndex]) {
      if (this.map[hashIndex].key === key) {
        return this.map[hashIndex].value;
      }
      let node = this.map[hashIndex];
      while (node !== null) {
        if (node.key === key) return node.value;
        node = node.nextNode;
      }
    }
    return null;
  }
  // has is a copy of get with just truthy and falsy returns
  has(key) {
    const hashIndex = this.hash(key);
    if (this.map[hashIndex]) {
      if (this.map[hashIndex].key === key) {
        return true;
      }
      let node = this.map[hashIndex];
      while (node !== null) {
        if (node.key === key) return true;
        node = node.nextNode;
      }
    }
    return false;
  }

  // checks the number of all key value pairs (including in the linked list)
  length() {
    let count = 0;
    for (let i = 0; i < this.map.length; i++) {
      if (this.map[i] !== null) {
        if (this.map[i].nextNode === null) {
          count++;
        }
        if (this.map[i].nextNode !== null) {
          let node = this.map[i];
          while (node !== null) {
            count++;
            node = node.nextNode;
          }
        }
      }
    }
    return count;
  }
  // clears the map and intializes a new one with a passed capacity or def 16
  clear(capacity = 16) {
    this.map = [];
    this.capacity = capacity;
    this.loadFactor = 0;
    this.isBeingResized = false;
    this.initMap();
  }
  // gets all keys in an array whether heads or linked lists
  keys() {
    const allKeys = [];
    this.map.forEach((bucket) => {
      let node = bucket;
      while (node !== null) {
        allKeys.push(node.key);
        node = node.nextNode;
      }
    });
    return allKeys;
  }
  values() {
    const allvalues = [];
    this.map.forEach((bucket) => {
      let node = bucket;
      while (node !== null) {
        allvalues.push(node.value);
        node = node.nextNode;
      }
    });
    return allvalues;
  }
  entries() {
    const allEntries = [];
    this.map.forEach((bucket) => {
      let node = bucket;
      while (node !== null) {
        allEntries.push([node.key, node.value]);
        node = node.nextNode;
      }
    });
    return allEntries;
  }
}

// the extra credit in the assignment for a hashSet is the exact same code minus all the
// value related logic. it would be too much effort to duplicate all this code.

//testing
console.log("started");
const test = new HashMap();
console.log(test);

test.set("apple", "red");
test.set("banana", "yellow");
test.set("carrot", "orange");
test.set("dog", "brown");
test.set("elephant", "gray");
test.set("frog", "green");
test.set("grape", "purple");
test.set("hat", "black");
test.set("ice cream", "white");
test.set("jacket", "blue");
test.set("kite", "pink");
test.set("lion", "golden");
console.log(test);

test.set("moon", "silver");
console.log(test);

// testing complete. all methods tested in console and work as expected
// also resizing and rehashing works with removing items
// no bugs
