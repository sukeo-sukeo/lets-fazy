'use strict';

class Auth {
  constructor(user) {
    this.user = user;
  }

  signup() {
    return auth
      .createUserWithEmailAndPassword(this.user.email, this.user.pwd)
      .then(async registed => {
        const user = registed.user;
        const db = new Db(user.uid);
        const userData = await db.writeUser(this.user);
          if (userData) {
            alert("登録成功！");
            return userData;
        } else {
          throw new Error("登録失敗。もう一度お願いします！");
        }
      })
      .catch((err) => {
        auth.currentUser
          .delete()
          .then(() => alert(err))
          .catch(() => {
            alert("致命的エラー：違うメールアドレスでトライしてください");
          });
      });
  }

  login() {
    return auth.signInWithEmailAndPassword(this.user.email, this.user.pwd)
      .then(async userCredential => {
        const user = userCredential.user;
        const db = new Db(user.uid);
        const userData = await db.getUserData(); 
        if (userData) {
            this.user = userData;
            alert("ログイン成功！");
            return this.user;
          } else {
            throw new Error("ログイン失敗。もう一度お願いします！");
          }
      })
      .catch((err) => {
          alert(err);
      });
  }

  logout() {
    if (!confirm("ログアウトしますか？")) return;
    auth.signOut()
      .then(() => {
        location.reload();
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  checkUser() {
    return new Promise((resolve, reject) => {
      auth.onAuthStateChanged(async (user) => {
          if (user) {
          const db = new Db(user.uid);
          const userData = await db.getUserData();
          this.user = userData;
          console.log(this.user);
          return resolve(this.user);
        } else {
          return resolve(null);
        }
      });
    });
  }
}