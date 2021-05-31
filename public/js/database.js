'use strict';

class Db {
  constructor(uid = null) {
    this.uid = uid;
    this.fazyData = {};
  }

  setUid(uid) {
    this.uid = uid;
  }

  returnData(data) {
    console.log(data);
    return data;
  }

  async read() {
    const ref = db.ref(`fazy/${this.uid}/`);
    await ref.once("value", (snapshot) => {
      this.fazyData = snapshot.val();
    });
    return this.returnData(this.fazyData);
  }

  async readOne(iid) {
    const ref = db.ref(`fazy/${this.uid}/${iid}`);
    await ref.once("value", (snapshot) => {
      this.fazyData = snapshot.val();
    });
    return this.returnData(this.fazyData);
  }

  writeFazy(fazydata) {
    const ref = db.ref(`fazy/${this.uid}/${fazydata.iid}`);

    ref.set({ fazydata });
  }

  deleteOne(fazydata) {
    const ref = db.ref(`fazy/${this.uid}/${fazydata.iid}`);

    ref.remove();
  }

  deleteAll() {
    const ref = db.ref(`fazy/${this.uid}`);
    ref.remove();
  }

  writeUser(uid, name, email) {
    const ref = db.ref(`users/${uid}`);

    ref.set({
      username: name,
      email: email,
      userid: uid,
      fazyCnt: 0,
    });
  }
}

// (async function () {
//     const db = new Db('testuid');
//     db.read();
// })()