'use strict';

setEv(getEl("#registOpen"), openModal, "signup");
setEv(getEl("#registClose"), closeModal, "signup");
setEv(getEl("#registUserBtn"), signup);

setEv(getEl("#loginOpen"), openModal, "login");
setEv(getEl("#loginClose"), closeModal, "login");
setEv(getEl("#loginBtn"), login);

setEv(getEl("#dashBordBtn"), openDash);

function openDash(e) {
    if (!currentUser) {
        alert('ダッシュボードはログインしてから使用できます。');
        return;
    }
  new Auth().logout();
  return;
}

function openModal(e) {
  e.preventDefault();
  let arg;
  if (this.args === "signup") arg = "#registModal";
  if (this.args === "login") arg = "#loginModal";
  getEl(arg).classList.add("active");
  getEl("#mask").classList.add("active");
}
function closeModal(e) {
  e.preventDefault();
  let arg;
  if (this.args === "signup") arg = "#registModal";
  if (this.args === "login") arg = "#loginModal";
  getEl(arg).classList.remove("active");
  getEl("#mask").classList.remove("active");
}

async function signup(e) {
  e.preventDefault();
  const form = getEl("#registForm");
  const user = {
    email: form.elements.email.value,
    pwd: form.elements.pwd.value,
    nickname: form.elements.nickname.value,
  };
    currentUser = await new Auth(user).signup();
}

async function login(e) {
  e.preventDefault();
  if (currentUser) alert('すでにログインしています。') 
  const form = getEl("#loginForm");
  const user = {
    email: form.elements.email_login.value,
    pwd: form.elements.pwd_login.value,
  };
    currentUser = await new Auth(user).login();
}
