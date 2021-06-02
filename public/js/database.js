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
    const ref = rDB.ref(`fazy/${this.uid}/`);
    await ref.once("value", (snapshot) => {
      this.fazyData = snapshot.val();
    });
    return this.returnData(this.fazyData);
  }

  async readOne(iid) {
    const ref = rDB.ref(`fazy/${this.uid}/${iid}`);
    await ref.once("value", (snapshot) => {
      this.fazyData = snapshot.val();
    });
    return this.returnData(this.fazyData);
  }

  writeFazy(fazydata) {
    const ref = rDB.ref(`fazy/${this.uid}`);

    ref.update({ [fazydata.iid]: fazydata });
  }
    
   async writeUser(user) {
        try {
            const userData = {
              userid: this.uid,
              username: user.nickname,
              email: user.email,
              pwd: user.pwd,
              fazyCnt: 0,
              fazyCombo: 0,
              drinkCnt: 0,
              drinkCombo: 0,
              nonDrinkCnt: 0,
              nonDrinkCombo: 0,
            };
            const ref = rDB.ref(`users/${this.uid}`);
            await ref.set(userData);
            return userData;
        } catch {
            return false;
    }
  }
  
    async getUserData() {
        try {
            let userData = {};
            const ref = rDB.ref(`users/${this.uid}`);
            await ref.once("value", (snapshot) => {
              userData = snapshot.val();
            });
            return userData;
        } catch {
            return false;
      }
  }

  deleteOne(fazydata) {
    const ref = rDB.ref(`fazy/${this.uid}/${fazydata.iid}`);

    ref.remove();
  }

  deleteAll() {
    const ref = rDB.ref(`fazy/${this.uid}`);
    ref.remove();
  }
}

// (async function () {
//     const db = new Db('testuid');
//     db.read();
// })()