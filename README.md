a hashmap code:
//class creates a new hashmap
// the hashmap have methods to add/ change, remove, look up, retrieve values, dynamically change capacity up and down based on load factor
// other methods include ones to retrieve all keys, all values, all key value pairs, clear all, return length. 
// helper functions added too to intialize the map, rehash all keys based on capacity change, capacity and loadfactor update, tracking rehashing status

// the hashmap handles collision via linked lists. 

// rehashing for expanding or shrinking works by creating a shallow copy and rehashing from that to a new map reset. I understand the shallow copy could affect
// the memory negatively in larger arrays. since this is only a pracice, i didnt bother figuring changing the array in situ without a shallow copy. 
// maybe later i will
// the code works and is bug free. some optimization can be done, however this version is concise and also easily readable
