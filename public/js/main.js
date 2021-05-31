"use strict";

setEv(getEl('#testResetBtn'), reset);
function reset() {
    if (confirm('test用のリセットボタンです')) {
        localStorage.removeItem("lets-fazy-items");
        while (getEl('#saveList').firstChild) {
          getEl('#saveList').removeChild(getEl('#saveList').firstChild);
        }
    }
}

let store = null;
let currentView = 1;

function setTime() {
    // ごはん食べた時間と日にち
    const nowTime = getTimeFn();
    const nowDate = getDateFn();
    // 次に食べていい時間と日にち
    const nextTime = getTimeFn('next');
    const nextDate = getDateFn('next');
    // domに反映
    getEl("#eattime").value = `${nowDate}${nowTime}`;
    getEl("#nexteat").textContent = nextTime;
    getEl("#nexteat_day").textContent = nextDate;
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
      const time = zeroAdd(h, m);
      return `${time.h}:${time.m}`;
    })();
    return nextTime;
}

function saveItems() {
  if (!store) {
    alert("食べた時間を入力してください");
    return;
  }

  // コメント
  let comment = getEl("#comment").value;
  //   if (!comment) comment = "デフォルト文章";
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
  if (localStorage.getItem("lets-fazy-items")) {
    const now = store.nowDate + store.nowTime;
    const pre = getEl(".pointa").innerText;

    const { mon:nM, day:nD, h:nH, m:nU } = getNowTimeParts(now);
    
    const { mon:pM, day:pD, h:pH, m:pU } = getNowTimeParts(pre);

    // console.log('今食べた時間', nM, nD, nH, nU);
    // console.log('前食べた時間', pM, pD, pH, pU);

    const date1 = new Date(`${nM}-${nD} ${nH}:${nU}`);
    const date2 = new Date(`${pM}-${pD} ${pH}:${pU}`);
      const diff = date1.getTime() - date2.getTime();
      
      const diffTime = Math.floor(diff / (60 * 60 * 1000));
    
      store.diffTime = diffTime;

    if (diff / (60 * 60 * 1000) >= 16) {
      console.log("fazy!");
      store.isFazy = 1;
    } else {
      console.log("non fazy...");
      store.isFazy = 0;
    }
  }

  const beforeStoreItem = JSON.parse(getItem());
  if (!beforeStoreItem) {
	localStorage.setItem("lets-fazy-items", JSON.stringify({ [id]: store }));
	
  } else {
    beforeStoreItem[id] = store;
	localStorage.setItem("lets-fazy-items", JSON
	.stringify(beforeStoreItem));
  }
  
  // リストの追加
  // 前回食べた時間の取得
    let beforeTime = getEl(".pointa");
    if (beforeTime) {
        beforeTime = beforeTime.innerText;
    }
    const text = createList([store], beforeTime);
	const text2 = createNext(store);

    getEl("#saveList").insertAdjacentHTML("afterbegin", text);
	getEl('#next').innerHTML = text2;
    
    changeView();

  [...getEl("#saveList > li", true)].forEach((el, i) => {
    if (i > 0) {
      el.style.transform = "scale(0.9)";
    }
  });
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

function setTimeBlur(val) {
    console.log(val);

    const { mon, day, h, m } = getNowTimeParts(val);
    const dateStr = `${mon}-${day} ${h}:${m}`;

    const nowTime = getTimeFn('', dateStr);
    const nowDate = getDateFn('', dateStr);
    const nextTime = getTimeFn('next', dateStr);
    const nextDate = getDateFn('next', dateStr);
 
    // domに反映
    getEl("#nexteat").textContent = nextTime;
    getEl("#nexteat_day").textContent = nextDate;

    // データに反映
    store = { nowTime, nowDate, nextTime, nextDate };
}

function inputBlur(e) {
    setTimeBlur(input.value);
}

document.addEventListener("DOMContentLoaded", () => {
  setTime();
  const items = JSON.parse(getItem());
  if (items) {
    setItem(items);
  }
});

function changeView() {
    if (currentView) {
        getEl("#main").classList.add("d-none");
        getEl("#lists").classList.remove("d-none");
        currentView = 0;
    } else {
        getEl("#main").classList.remove("d-none");
        getEl("#lists").classList.add("d-none");
        currentView = 1;
    }
}

const nowBtn = getEl("#now");
setEv(nowBtn, setTime);

const saveBtn = getEl("#save");
setEv(saveBtn, saveItems);

const input = getEl("#eattime");
setEv(input, inputBlur, input, "change");

const viewBtn = getEl("#changeView");
setEv(viewBtn, changeView);


