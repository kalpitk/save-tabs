var urlList = [];

window.onload = function () {
  document.getElementById('saveAll').addEventListener('click', saveAllTabs);
  document.getElementById('saveCurrent').addEventListener('click', saveCurrentTab);

  chrome.storage.sync.get('tabStorage', function (tabs) {
    if (!tabs.tabStorage) return;
    for (var i = 0; i < tabs.tabStorage.length; i++) {
      addToList(tabs.tabStorage[i], Array.isArray(tabs.tabStorage[i]));
    }
  });
}

function Tab(title, link) {
  this.title = title;
  this.url = link;
}

function saveAllTabs() {
  chrome.tabs.query({
    currentWindow: true
  }, function (tabs) {
    var arr = [];
    tabs.forEach(function (tab) {
      arr.push(new Tab(tab.title, tab.url));
    });
    addToList(arr, true);
    chrome.storage.sync.set({
      'tabStorage': urlList
    });
  });
}

function saveCurrentTab() {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tab) {
    addToList(tab[0]);
    chrome.storage.sync.set({
      'tabStorage': urlList
    });
  });
}

function addToList(tab, isArray) {
  urlList.push(tab);
  var myList = document.getElementById("list");
  var link = document.createElement('a');
  var close = document.createElement('img');
  close.height = 12;
  close.src = 'close.png';

  if (isArray) {
    link.innerText = 'windows1';
    link.addEventListener('click', (function (tab) {
      return function () {
        for (var i = 0; i < tab.length; i++) {
          chrome.tabs.create({
            url: String(tab[i].url)
          });
        }
      }
    })(tab));
  } else {
    link.innerText = tab.title;
    link.addEventListener('click', (function (tab) {
      return function () {
        chrome.tabs.create({
          url: String(tab.url)
        });
      }
    })(tab));
  }

  close.addEventListener('click', function (e) {
    const index = $(e.target.parentNode).index();
    urlList.splice(index, 1);
    $('#list li').eq(index).remove();
    chrome.storage.sync.set({
      'tabStorage': urlList
    });
  })

  link.href = '#';
  var item = document.createElement('li');
  item.appendChild(close);
  item.appendChild(link);
  myList.appendChild(item);
}