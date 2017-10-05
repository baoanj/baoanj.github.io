// Overwrites native 'children' prototype.
// Adds Document & DocumentFragment support for IE9 & Safari.
// Returns array instead of HTMLCollection.
;
(function(constructor) {
  if (constructor &&
    constructor.prototype &&
    constructor.prototype.children == null) {
    Object.defineProperty(constructor.prototype, 'children', {
      get: function() {
        var i = 0,
          node, nodes = this.childNodes,
          children = [];
        while (node = nodes[i++]) {
          if (node.nodeType === 1) {
            children.push(node);
          }
        }
        return children;
      }
    });
  }
})(window.Node || window.Element);

// Overwrites native 'firstElementChild' prototype.
// Adds Document & DocumentFragment support for IE9 & Safari.
// Returns array instead of HTMLCollection.
;
(function(constructor) {
  if (constructor &&
    constructor.prototype &&
    constructor.prototype.firstElementChild == null) {
    Object.defineProperty(constructor.prototype, 'firstElementChild', {
      get: function() {
        var node, nodes = this.childNodes,
          i = 0;
        while (node = nodes[i++]) {
          if (node.nodeType === 1) {
            return node;
          }
        }
        return null;
      }
    });
  }
})(window.Node || window.Element);

// Overwrites native 'lastElementChild' prototype.
// Adds Document & DocumentFragment support for IE9 & Safari.
// Returns array instead of HTMLCollection.
;
(function(constructor) {
  if (constructor &&
    constructor.prototype &&
    constructor.prototype.lastElementChild == null) {
    Object.defineProperty(constructor.prototype, 'lastElementChild', {
      get: function() {
        var node, nodes = this.childNodes,
          i = nodes.length - 1;
        while (node = nodes[i--]) {
          if (node.nodeType === 1) {
            return node;
          }
        }
        return null;
      }
    });
  }
})(window.Node || window.Element);

// HTMLCollection只是类数组，没有数组的那些API，
// 这里为它写个forEach方法
if (!HTMLCollection.prototype.forEach) {
  HTMLCollection.prototype.forEach = function(callback, start, end, thisArg) {

    var T, S = 0,
      E = this.length;

    if (this == null) {
      throw new TypeError(' this is null or not defined');
    }

    // If isCallable(callback) is false, throw a TypeError exception.
    if (typeof callback !== "function") {
      throw new TypeError(callback + ' is not a function');
    }

    if (arguments.length === 2) {
      if (Number.isInteger(start)) S = start;
      else T = start;
    }

    if (arguments.length === 3) {
      S = start;
      if (Number.isInteger(end)) E = end;
      else T = end;
    }

    // If thisArg was supplied, let T be thisArg; else let T be undefined.
    if (arguments.length > 3) {
      S = start;
      E = end;
      T = thisArg;
    }

    for (var i = S; i < E; i++) {
      callback.call(T, this[i], i, this);
    }
  };
}

(function() {
  var inputNumber = document.getElementById('input-number');
  var leftIn = document.getElementById('left-in');
  var rightIn = document.getElementById('right-in');
  var leftOut = document.getElementById('left-out');
  var rightOut = document.getElementById('right-out');
  var sortCount = document.getElementById('sort-count');
  var autoCreate = document.getElementById('auto-create');
  var sortAlgor = document.getElementById('sort-algor');
  var sortQueue = document.getElementById('sort-queue');
  var ulQueue = document.getElementById('queue');
  var sortState = document.getElementById('sort-state');
  var sortTime = document.getElementById('sort-time');

  var curElmBgColor = '#17C352';
  var defaultBgColor = '#EC0505';

  // 左侧进
  function leftInFunc(e) {
    if (isValid()) {
      ulQueue.children.forEach(function(element) {
        element.style.order = +element.style.order + 1 + '';
      });
      var li = createLI();
      li.style.order = '0';
      ulQueue.appendChild(li);
    }
  };

  // 右侧进
  function rightInFunc(e) {
    if (isValid()) {
      var li = createLI();
      li.style.order = ulQueue.children.length + '';
      ulQueue.appendChild(li);
    }
  };

  // 左侧出
  function leftOutFunc(e) {
    var firstElementChild;
    ulQueue.children.forEach(function(element) {
      if (element.style.order === '0') firstElementChild = element;
      element.style.order = element.style.order - 1 + '';
    });
    ulQueue.removeChild(firstElementChild);
  };

  // 右侧出
  function rightOutFunc(e) {
    ulQueue.removeChild(getKthElementChild(ulQueue, ulQueue.children.length - 1));
  };

  // 自动创建数据
  function autoCreateFunc() {
    ulQueue.innerHTML = '';
    for (var i = 0; i < sortCount.value; i++) {
      inputNumber.value = Math.floor(Math.random() * 90) + 10;
      rightInFunc();
    }
  }

  // 排序
  function sortQueueFunc(e) {
    ulQueue.children.forEach(function(element) {
      element.style.backgroundColor = defaultBgColor;
    });
    sortState.innerText = '排序中...,请勿点击任何按钮！';
    sortTime.innerText = '排序计时：0ms';
    switch (sortAlgor.value) {
      case 'bubble':
        bubbleSort(0, Date.now());
        break;
      case 'selection':
        selectionSort([], 0, Date.now());
        break;
      case 'insertion':
        insertSort(1, Date.now());
        break;
      case 'shell':
        shellSort(ulQueue.children.length, Date.now());
        break;
      case 'merge':
        mergeSort();
        break;
      case 'quick':
        quickSort();
        break;
      case 'heap':
        heapSort();
        break;
      default:
        bubbleSort();
        break;
    }
  }

  // 冒泡排序
  function bubbleSort(i, time) {
    if (i > ulQueue.children.length - 2) {
      sortState.innerText = '排序完成';
      return;
    }

    bubbleSortAssist(i, 0, time);
  }

  function bubbleSortAssist(i, j, time) {
    if (j >= ulQueue.children.length - i - 1) {
      showSortTime('排序耗时：' + (Date.now() - time) + 'ms');
      bubbleSort(i + 1, time);
      return;
    }

    var cur = getKthElementChild(ulQueue, j);
    var next = getKthElementChild(ulQueue, j + 1);
    if (cur.getAttribute('sortVal') > next.getAttribute('sortVal')) {
      cur.style.backgroundColor = curElmBgColor;

      cur.style.order = j + 1 + '';
      next.style.order = j + '';

      showSortTime('排序耗时：' + (Date.now() - time) + 'ms');

      setTimeout(function() {
        cur.style.backgroundColor = defaultBgColor;
        bubbleSortAssist(i, j + 1, time);
      }, 500);
    } else {
      bubbleSortAssist(i, j + 1, time);
    }
  }

  // 选择排序
  function selectionSort(foundChildren, i, time) {
    if (i > ulQueue.children.length - 1) {
      sortState.innerText = '排序完成';
      return;
    }

    var minEle = null,
      minVal = null; // *****坑死我了*****

    ulQueue.children.forEach(function(element) {
      if (!foundChildren.includes(element)) {
        var innerVal = +element.getAttribute('sortVal');
        if (!minVal || innerVal < minVal) {
          minEle = element;
          minVal = innerVal;
        }
      }
    });

    foundChildren.push(minEle);

    getKthElementChild(ulQueue, i).style.order = minEle.style.order;
    minEle.style.order = i + '';
    minEle.style.backgroundColor = curElmBgColor;

    showSortTime('排序耗时：' + (Date.now() - time) + 'ms');

    setTimeout(function() {
      selectionSort(foundChildren, ++i, time);
    }, 500);
  }

  // 插入排序
  function insertSort(i, time) {
    if (i > ulQueue.children.length - 1) {
      sortState.innerText = '排序完成';
      return;
    }

    var curEle = getKthElementChild(ulQueue, i);
    curEle.style.backgroundColor = curElmBgColor;
    if (curEle.getAttribute('sortVal') < getKthElementChild(ulQueue, i - 1).getAttribute('sortVal')) {
      setTimeout(function() {
        insertSortAssist(curEle, i, i, time);
      }, 500);
    } else {
      showSortTime('排序耗时：' + (Date.now() - time) + 'ms');

      setTimeout(function() {
        curEle.style.backgroundColor = defaultBgColor;
        insertSort(i + 1, time);
      }, 500);
    }
  }

  function insertSortAssist(curEle, position, i, time) {
    if (position < 1 || curEle.getAttribute('sortVal') >= getKthElementChild(ulQueue, position - 1).getAttribute('sortVal')) {
      showSortTime('排序耗时：' + (Date.now() - time) + 'ms');
      curEle.style.backgroundColor = defaultBgColor;
      insertSort(i + 1, time);
    } else {
      var pre = getKthElementChild(ulQueue, position - 1);
      curEle.style.order = position - 1 + '';
      pre.style.order = position + '';

      showSortTime('排序耗时：' + (Date.now() - time) + 'ms');

      setTimeout(function() {
        insertSortAssist(curEle, position - 1, i, time);
      }, 500);
    }
  }

  // 希尔排序
  function shellSort(increment, time) {
    if (increment <= 1) {
      sortState.innerText = '排序完成';
      return;
    }

    increment = Math.floor(increment / 3) + 1;

    shellSortAssist1(0, increment, time);
  }

  function shellSortAssist1(i, increment, time) {
    if (i >= increment) {
      showSortTime('排序耗时：' + (Date.now() - time) + 'ms');
      shellSort(increment, time);
      return;
    }

    shellSortAssist2(i, i + increment, increment, time);
  }

  function shellSortAssist2(i, j, increment, time) {
    if (j >= ulQueue.children.length) {
      showSortTime('排序耗时：' + (Date.now() - time) + 'ms');
      shellSortAssist1(i + 1, increment, time);
      return;
    }

    if (getKthElementChild(ulQueue, j).getAttribute('sortVal') < getKthElementChild(ulQueue, j - increment).getAttribute('sortVal')) {
      shellSortAssist3(i, j, j, increment, time);
    } else {
      shellSortAssist2(i, j + increment, increment, time);
    }
  }

  function shellSortAssist3(i, j, pos, increment, time) {
    var posElm = getKthElementChild(ulQueue, pos);
    var nextPos = getKthElementChild(ulQueue, pos - increment);
    if (pos < increment || posElm.getAttribute('sortVal') >= nextPos.getAttribute('sortVal')) {
      showSortTime('排序耗时：' + (Date.now() - time) + 'ms');
      shellSortAssist2(i, j + increment, increment, time);
      return;
    }

    posElm.style.backgroundColor = curElmBgColor;
    posElm.style.order = pos - increment + '';
    nextPos.style.order = pos + '';

    setTimeout(function() {
      posElm.style.backgroundColor = defaultBgColor;
      shellSortAssist3(i, j, pos - increment, increment, time);
    }, 500);
  }

  function mergeSort() {
    alert('还未实现..');
  }

  function quickSort() {
    alert('还未实现..');
  }

  function heapSort() {
    alert('还未实现..');
  }

  // 创建一个LI节点
  function createLI() {
    var li = document.createElement('LI');
    li.innerHTML = '<p>' + inputNumber.value + '</p>';
    li.style.height = (2 * +inputNumber.value) + 'px';
    li.setAttribute('sortVal', inputNumber.value);
    return li;
  }

  // 获取从左到右第k个子节点
  function getKthElementChild(element, k) {
    var children = element.children;
    var len = children.length;

    for (let i = 0; i < len; i++) {
      if (children[i].style.order === (k + '')) {
        return children[i];
      }
    }
  }

  // 判断输入是否合法
  function isValid() {
    if (inputNumber.value === '') {
      return false;
    } else if (isNaN(+inputNumber.value)) {
      return false;
    } else if (+inputNumber.value < 10 || +inputNumber.value > 99) {
      return false;
    } else if (ulQueue.children.length > 50) {
      return false;
    } else {
      return true;
    }
  }

  // 事件绑定 兼容browser
  function addEvent(element, event, listener) {
    if (element.addEventListener) {
      element.addEventListener(event, listener, false);
    } else if (element.attachEvent) {
      element.attachEvent('on' + event, listener, false);
    } else {
      element['on' + event] = listener;
    }
  }

  function showSortTime(content) {
    sortTime.innerText = content;
  }

  // 为元素绑定事件
  addEvent(leftIn, 'click', leftInFunc);
  addEvent(rightIn, 'click', rightInFunc);
  addEvent(leftOut, 'click', leftOutFunc);
  addEvent(rightOut, 'click', rightOutFunc);
  addEvent(autoCreate, 'click', autoCreateFunc);
  addEvent(sortQueue, 'click', sortQueueFunc);


  /*****************************************************
   * menu
   ****************************************************/
   var gotoItem = document.getElementById('goto-item');

   addEvent(gotoItem, 'click', gotoItemFunc);

   function gotoItemFunc(e) {
    if (e.target && e.target.nodeName.toUpperCase() === 'LI') {
      window.scrollTo(0, document.getElementById(e.target.getAttribute('goto')).offsetTop);
    }
   }
})();