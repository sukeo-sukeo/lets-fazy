'use strict';

setEv(getEl("#registOpen"), openLegist);
setEv(getEl("#registClose"), closeLegist);
setEv(getEl("#registUserBtn"), signup);

setEv(getEl("#loginOpen"), openLogin, "login");
setEv(getEl("#loginClose"), closeLogin, "login");
setEv(getEl("#loginBtn"), login);

setEv(getEl("#dashBordBtn"), openDash);
setEv(getEl("#dashClose"), closeDash);

setEv(getEl("#logout"), logout);

function openDash(e) {
    if (!currentUser) {
        alert('ダッシュボードはログインしてから使用できます。');
        return;
    }
   getEl("#dashModal").classList.add("active");
   getEl("#mask").classList.add("active");
//   new Auth().logout();
}
function closeDash(e) {
  e.preventDefault();
  getEl("#dashModal").classList.remove("active");
  getEl("#mask").classList.remove("active");
}
function openLegist(e) {
    e.preventDefault();
    getEl('#registModal').classList.add("active");
    getEl("#mask").classList.add("active");
}
function openLogin(e) {
    e.preventDefault();
    getEl('#loginModal').classList.add("active");
    getEl("#mask").classList.add("active");
}
function closeLegist(e) {
    e.preventDefault();
    getEl('#registModal').classList.remove("active");
    getEl("#mask").classList.remove("active");
}
function closeLogin(e) {
    e.preventDefault();
    getEl('#loginModal').classList.remove("active");
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
    hiddenLoginBtn();
    closeLegist(e);
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
    hiddenLoginBtn();
    closeLogin(e);
}

function logout(e) {
    e.preventDefault()
    new Auth().logout();
    return;
}
