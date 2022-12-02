/**
 * A conflict-free replicated data type (CRDT) is a type of data structure that is used to achieve strong eventual consistency and monotonicity (ie, there are no rollbacks) across a set of nodes in a distributed system. 
 * 
 * It can be used in very specific cases to implement a distributed data store that does not require any form of synchronization to function. 
 * One common CRDT data structure is the Last-Writer-Wins (LWW) Element Set. This set stores only one instance of each element in the set, and associates it with a timestamp. 
 * The operations on the LWW Element Set are: 
 * ● New() → Z 
 * ● Add(Z, e, t) → t 
 * ● Remove(Z, e, t) → t 
 * ● Exists(Z, e) → boolean 
 * ● Get(Z) → [e] 
 * Intuitively, for a LWW Element Set: 
 * ● An element is in the set if its most-recent operation was an add. 
 * ● An element is not in the set if its most-recent operation was a remove
 * 
 * The LWW Element Set CRDT can be implemented using two separate underlying simple sets: an Add set (ZA) and a Remove set (ZR). 
 * ● Add - When an element e is added to the CRDT set Z, ensure the Add set ZA updates as follows: 
 *  ○ If there is already an entry in ZA for e, update it. 
 *  ○ Otherwise, insert a new entry into ZA. 
 * ● Remove - When an element e is removed from the CRDT set Z, the Remove set ZR is modified as follows: 
 *  ○ If there is already an entry in ZR for e, update it. 
 *  ○ Otherwise, insert a new entry into ZR. 
 * ● Exists - Determine whether an element e is in the CRDT set Z, and return the result. 
 * ● Get - Generate the contents of the CRDT set Z, selecting only those elements that are meant to be present.
 * 
 * Task #1 Implement the LWW Element Set’s first three operations (New, Add and Remove), as described above. 
 * Task #2 Extend your implementation to include the Exists and Get operations for your set, as described above.
 */

class LWW {
  constructor() {
    this.new();
  }

  new() {
    this.za = {};
    this.zr = {};
    this.init_stamp = Date.now();
    return this;
  }

  add(e) {
    this.za[e] = Date.now();
    return this.za[e];
  }

  remove(e) {
    this.zr[e] = Date.now();
    return this.zr[e];
  }

  exists(e) {
    return ((this.za[e] || this.init_stamp) - (this.zr[e] || this.init_stamp)) > 0; 
  }

  get() {
    this.probe();
    return Object.entries(this.za).filter(([key]) => {
      this.probe(key)
      return this.exists(key);
    }).map(([key]) => {
      return key;
    })
  }

  probe(e) {
    if (e) {
      console.log(e, ' is existing: ', this.exists(e));
    } else {  
      console.log(this);
    }
  }
}

const lww = new LWW();
const ops = [
  {'op': 'add', 'item': 'a'},
  {'op': 'add', 'item': 'b'},
  {'op': 'add', 'item': 'c'},
  {'op': 'rm', 'item': 'd'},
  {'op': 'rm', 'item': 'a'},
  {'op': 'add', 'item': 'd'},
  {'op': 'get'}
]
let index = 0;
const interval = setInterval(() => {
  const {op, item} = ops[index];
  switch(op) {
    case 'add':
      lww.add(item);
      break;
    case 'rm':
      lww.remove(item);
      break;
    default:
      console.log(lww.get());
  }
  index += 1;
  if (index === ops.length) {
    clearInterval(interval);
  }
}, 100)