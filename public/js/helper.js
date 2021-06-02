'use strict'

const fazyC = "#33d499";

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
    const yea = new Date().getFullYear();
    const mon = val.split("月")[0];
    const day = val.split("月")[1].split("日")[0];
    const h = val.split("日")[1].split(":")[0];
    const m = val.split("日")[1].split(":")[1];
    return {yea, mon, day, h, m}
}

function getUniqueStr(myStrong) {
  let strong = 1000;
  if (myStrong) strong = myStrong;
  return (
    new Date().getTime().toString(16) +
    Math.floor(strong * Math.random()).toString(16)
  );
}

function createNext(value) {
    return `
    <div class="container d-flex justify-content-center py-3 my-4 rounded bg-success topic">
     <div class="row h2 d-flex align-items-center mb-0 shadow">
        <span class="col-auto me-1 text-light fs-5">
        <span class="iconify display-4" data-inline="false" data-icon="akar-icons:arrow-forward-thick"></span>
        next eat
        </span>
        <span class="col-auto mb-0 fw-bold text-light topic2 rounded">${
          value.nextDate + value.nextTime
        }</span>
    </div></div>`;
}

function createList(values, beforeTime = "") {
    const texts = values.map((value, i) => {
        console.log(value.isFazy);
        return `
        <li id=${
          value.iid
        } class="shadow-sm mb-3 rounded p-3 topic bg-white" style="${
          i > 0 ? "transform: scale(0.9);" : ";"
        }">
            <div class="container">
            ${
              value.isFazy
                ? "<span class='iconify px-0 fazy' data-inline='false' data-icon='carbon:stem-leaf-plot' style='font-size: 20px;'></span>"
                : ""
            }
            </div>
            <div class="container">
            <h2 class="h4 mb-2 row justify-content-between">
                <span class="col fs-6 d-flex align-items-center text-dark" id="previous">${
                  value.diffTime >= 0 ? value.diffTime + "時間あけた" : "<span class='fs-10'>前の食事から何時間あけたか表示されます！</span>"
                }</span>
                <span class="badge ${
                  value.isFazy ? "bg-white" : "bg-white"
                } mr-1 align-bottom col-auto d-flex align-items-center text-dark">${
          value.isFazy
            ? "<span class='iconify h4 px-0 text-danger fw-bold' data-inline='false' data-icon='carbon:stem-leaf-plot'></span><span class='text-danger h4'>fazy!</span>"
            : "non fazy"
        }
                </span>
            </h2>
            </div>
            <div class="container">        
            <div class="row justify-content-between">
                <span class="col-auto shadow rounded">
                    <span class="text-dark fs-10">今日食べた時間</span> 
                    <span class="pointa">${value.nowDate}${value.nowTime}</span>
                </span>
                <span class="badge ${
                  Number(value.isDrink) ? "bg-white" : "bg-white"
                } col-auto px-1 py-0 text-dark">
                <span class='iconify' data-inline='false' data-icon='openmoji:beer-mug' style='font-size: 24px;'></span>
                ${Number(value.isDrink) ? "飲んだ" : "<span class='text-danger fw-bold'>飲んでない</span>"}
                </span>
            </div>
            </div>
            <div class="container mt-2">        
            <div class="row">
                <span class="col-auto shadow rounded">
                <span class="text-dark fs-10">前に食べた時間</span> 
                    <span>${
                      beforeTime
                        ? beforeTime
                        : i === values.length - 1
                        ? ""
                        : values[i + 1].nowDate + values[i + 1].nowTime
                    }</span>
                </span>
            </div>
            </div>
            <pre class="bg-white ${
              value.comment ? "rounded shadow p-2 mb-0" : ""
            }">${value.comment}</pre>
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


function addZeroToBefore(digit, ...nums) {
    return nums.map(num => String(num).padStart(digit, 0));
}

function setTimeOrDate(domId, time, type = "") {
    if (type === "value") {
        getEl(domId).value = time;
        return;
    }
    getEl(domId).textContent = time;
}