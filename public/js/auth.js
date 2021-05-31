'use strict';

class Auth {
  constructor() {}

  signup(db) {
    this.getInput();

    if (!this.inputData.name || this.inputData.name === "ログイン") {
      this.errorM.textContent = "User Nameを入力してください";
      // this.loading = false
      return;
    } else {
      if (
        confirm(
          `User Nameは ${this.inputData.name} でよろしいですか？\n※今の所変更はできません`
        )
      ) {
      } else {
        return;
      }
    }
    // this.loading = true
    auth.auth
      .createUserWithEmailAndPassword(
        this.inputData.email,
        this.inputData.password
      )
      .then(async (registed) => {
        const user = registed.user;
        this.name = this.inputData.name;
        this.uid = user.uid;
        db.uid = await user.uid;
        db.name = this.name;
        db.add(this.inputData, "userData");
        alert("成功しました！");
        document.getElementById("loged").textContent = this.name;
        this.closeModal();
      })
      .catch((err) => {
        this.errorM.textContent = `${err.code}\n${err.message}`;
      });
  }

  login(db, view) {
    this.getInput();
    auth.auth
      .signInWithEmailAndPassword(this.inputData.email, this.inputData.password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        // this.name = this.inputData.name;
        this.uid = user.uid;
        db.uid = user.uid;
        //dbからユーザーネーム取得
        const username = await db.readone("getUser");
        this.name = username;
        db.name = username;
        alert("成功しました！");
        view.booksPage();
        this.closeModal();
      })
      .catch((err) => {
        this.errorM.textContent = `${err.code}\n${err.message}`;
      });
  }

  logout(db) {
    if (!confirm("ログアウトしますか？")) return;
    auth.auth
      .signOut()
      .then(() => {
        location.reload();
      })
      .catch((error) => {
        // An error happened.
      });
  }
}