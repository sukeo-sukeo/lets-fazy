"use strict";

function setTime() {
    // ごはん食べた時間と日にち
    const nowTime = getTimeFn();
    const nowDate = getDateFn();
    // 次に食べていい時間と日にち
    const nextTime = getTimeFn('next');
    const nextDate = getDateFn('next');
	// domに反映
	setTimeOrDate("#eattime", `${nowDate}${nowTime}`, 'value');
	setTimeOrDate("#nexteat", nextTime);
	setTimeOrDate("#nexteat_day", nextDate);
    // データに反映
    store = { nowTime, nowDate, nextTime, nextDate };
}

function getDateFn(next = "", dateStr = "") {
  let date;
  if (dateStr) {
    date = new Date(dateStr);
  } else {
    date = new Date();
  }
  if (next === "next") date.setHours(date.getHours() + 16);
  let mon = date.getMonth() + 1;
  let day = date.getDate();
  return `${mon}月${day}日`;
}

function getTimeFn(next = "", dateStr = "") {
	let date;
    if (dateStr) {
        date = new Date(dateStr);
    } else {
        date = new Date();
	}
    if (next === 'next') date.setHours(date.getHours() + 16);
    let h = date.getHours();
    let m = date.getMinutes();
    const nextTime = (() => {
      const time = addZeroToBefore(2, h, m);
      return `${time[0]}:${time[1]}`;
    })();
    return nextTime;
}

function saveItems() {
  if (!checkUser()) {
	  alert('記録はログイン後に使用可能です。');
	  return;
  }
  if (!store) {
    alert("食べた時間を入力してください");
    return;
  }

  // コメント
  let comment = getEl("#comment").value;
  store.comment = comment;

  // 飲んだか飲んでないか
  const isDrink = getEl('input[name="drink"]', true);
  [...isDrink].forEach((d) => {
    if (d.checked) store.isDrink = d.value;
  });

  // ユニークID
  const id = getUniqueStr();
  store.iid = id;

  // ソート用のキー
  const sortKey = new Date().getTime();
  store.sortKey = sortKey;

  // fazyチェック
  if (checkFazy()) {
    store.isFazy = 1;
  } else {
    store.isFazy = 0;
  }

  // dbへ保存
  insertDB(store);
//   cashLocal(store);	
	
  // Domへ反映
  setListDom();

  // 記録画面へ遷移
  changeView();
	
}

function setItem(items) {
  const values = sortList(Object.values(items));
  const nextTimeObj = {
		nextDate: values[0].nextDate,
		nextTime: values[0].nextTime,
  } 
  const texts = createList(values);
  const texts2 = createNext(nextTimeObj);
  getEl("#saveList").innerHTML = texts;
  getEl("#next").innerHTML = texts2;
}

function judegeFazy(nowtime, beforetime) {
  if (nowtime - beforetime > 16) {
    getEl("#fazy").textContent = "fazy!";
    getEl("#fazy").classList.add("bg-waring");
  } else {
    getEl("#fazy").textContent = "non fazy...";
    getEl("#fazy").classList.add("bg-secondary");
  }
}

function setHistory() {
	const texts = createDashTable(currentUser);
	getEl("#t-body").insertAdjacentHTML('afterbegin', texts.join(''));
}

function setUserName() {
	getEl('#userName').textContent = currentUser.username;
}

function setUserLevel() {
	getEl('#fazyLevel').textContent = currentUser.level;
}

function judegeDrink(tage) {
  if (Number(tage)) {
    // getEl('#is').classList.add("bg-danger");
    return "飲んだ";
  } else {
    // dom.classList.add("bg-success");
    return "飲んでない";
  }
}

function setTimeInputChange(e) {
  const val = this.args.value;
  console.log(val);
  const { yea, mon, day, h, m } = getNowTimeParts(val);
  const dateStr = `${yea}/${mon}/${day} ${h}:${m}`;
  
  const nowTime = getTimeFn("", dateStr);
  const nowDate = getDateFn("", dateStr);
  const nextTime = getTimeFn("next", dateStr);
  const nextDate = getDateFn("next", dateStr);

  // domに反映
  setTimeOrDate("#nexteat", nextTime);
  setTimeOrDate("#nexteat_day", nextDate);

  // データに反映
  store = { nowTime, nowDate, nextTime, nextDate };
}


document.addEventListener("DOMContentLoaded", async () => {
  setTime();
  const user = await new Auth().checkUser();
  currentUser = user; 
	if (currentUser) {
		// console.log(currentUser);
		const items = await fetchItems(user.userid);
		hiddenLoginBtn();
		setHistory();
        setUserName();
        setUserLevel();
		if (items) {
		  setItem(items);
		} else {
		  loaderStop();
		}
	} else {
		 loaderStop();
	}
});

function changeView() {
	let mainView = getEl("#main");
	let listsView = getEl("#lists");
	switch (currentView) {
		case 0:
			mainView.classList.remove("d-none");
			listsView.classList.add("d-none");
			currentView = 1;
			break;
		case 1:
			mainView.classList.add("d-none");
			listsView.classList.remove("d-none");
			currentView = 0;
			break;
	}
}

const nowBtn = getEl("#now");
setEv(nowBtn, setTime);

const saveBtn = getEl("#save");
setEv(saveBtn, saveItems);

const input = getEl("#eattime");
setEv(input, setTimeInputChange, input, "change");

const viewBtn = getEl("#changeView");
setEv(viewBtn, changeView);


