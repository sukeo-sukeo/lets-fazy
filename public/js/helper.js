'use strict'

function getEl(selector, all = false) {
  if (all) {
    return document.querySelectorAll(selector);
  } else {
    return document.querySelector(selector);
  }
}

function setEv(el, fn, args = "", type = "click") {
  el.addEventListener(type, {
    args: args,
    handleEvent: fn,
  });
}

function createEle(el) {
    return document.createElement(el);
}

function setOption(tage) {
    let div = getEl("#eatTime");
    let select = createEle("select");
    select.classList.add("col", "form-select");
    for (let i = 0; i < tage; i++) {
    let option = createEle("option");
    option.textContent = i + 1;
      option.value = i + 1;
      select.appendChild(option);
  }
    div.appendChild(select);
}

function createSelectBox() {
    let mon = 12;
    let day = 31;
    let h = 24;
    let m = 60;
    
    setOption(mon);
    setOption(day);
    setOption(h);
    setOption(m);
}

// createSelectBox();

function getNowTimeParts(val) {
    const mon = val.split("月")[0];
    const day = val.split("月")[1].split("日")[0];
    const h = val.split("日")[1].split(":")[0];
    const m = val.split("日")[1].split(":")[1];
    return {mon, day, h, m}
}

function getUniqueStr(myStrong) {
  let strong = 1000;
  if (myStrong) strong = myStrong;
  return (
    new Date().getTime().toString(16) +
    Math.floor(strong * Math.random()).toString(16)
  );
}

function createList(values, beforeTime="") {
    const texts = values.map((value, i) => {
    return `
        <li id=${
          value.iid
        } class="bg-white shadow-sm mb-3 rounded p-3" style="${
      i > 0 ? "transform: scale(0.9)" : ""
    }">
            <h2 class="h4 mb-2 row justify-content-between">
                <span class="badge ${
                  value.isFazy ? "bg-warning" : "bg-secondary"
                } mr-1 align-bottom col-auto">${value.isFazy ? "fazy!!" : "non fazy"}
                </span>
                <span class="badge ${
                  Number(value.isDrink) ? "bg-danger" : "bg-secondary"
                } col-auto">${Number(value.isDrink) ? "飲んだ" : "飲んでない"}
                </span>
            </h2>
            <div class="row">
                <span class="col">
                    今日食べた時間 
                    <span class="pointa">${value.nowDate}${value.nowTime}</span>
                </span>
            </div>        
            <div class="row">
                <span class="col">
                    前回食べた時間 
                    <span>${
                      beforeTime
                        ? beforeTime
                        : i === values.length - 1
                        ? "なし"
                        : values[i + 1].nowDate + values[i + 1].nowTime
                    }</span>
                </span>
            </div>
            <span class="h6">
                    次のご飯は 
                    <span class="h2">${value.nextDate + value.nextTime}</span>
                    以降!
                </span>
            <p>${value.comment}</p>
        </li>`;
  });
  return texts.join("");
}

function getItem() {
  return localStorage.getItem("lets-fazy-items");
}

function sortList(dataList) {
    let beforeSortObj = [];
    Object.keys(dataList).forEach((key) => {
      beforeSortObj.push(dataList[key]);
    });

    //sortKeyでソート
    return beforeSortObj.sort((a, b) => {
      if (a.sortKey > b.sortKey) {
        return -1;
      } else {
        return 1;
      }
    });
}

function zeroAdd(h, m) {
    if (h < 10) {
      h = `0${Number(h)}`;
    } 
    if (m < 10) {
      m = `0${Number(m)}`;
    }
    return { h, m };
}