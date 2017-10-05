(function() {
  var animationEffect = document.getElementById('animation-effect');
  var traverseAlgor = document.getElementById('traverse-algor');
  var traverse = document.getElementById('traverse');
  var queryContent = document.getElementById('query-content');
  var query = document.getElementById('query');

  var timer = null;

  const TRAVERSE_ANIMATION_BACKGROUND = 'traverse-background 0.5s linear';
  const NORMAL_BACKGROUND = 'white';
  const TRAVERSED_BACKGROUND = '#10AB58';

  const TRAVERSE_ANIMATION_BORDER = 'traverse-border 0.5s linear';
  const NORMAL_BORDER = '2px solid black';
  const TRAVERSED_BORDER = '2px solid #1fde0e';

  traverse.onclick = handleTraverseNodes;
  query.onclick = queryTree;

  // 遍历
  function handleTraverseNodes(e) {
    init();

    var traverseNodes = getTraverseNodes();

    var order = 0;
    timer = setInterval(function() {
      if (order < traverseNodes.length) {
        triggerAnimation(traverseNodes[order]);
        order++;
      } else {
        clearInterval(timer);
      }
    }, 500);
  }

  // 查询遍历
  function queryTree(e) {
    init();

    var traverseNodes = getTraverseNodes();

    var order = 0;
    timer = setInterval(function() {
      if (order < traverseNodes.length) {
        triggerQueryAnimation(traverseNodes[order],
          traverseNodes[order].querySelector('p').innerText === queryContent.value);
        order++;
      } else {
        clearInterval(timer);
      }
    }, 500);
  }

  // 初始化状态
  function init() {
    clearInterval(timer);
    var traveDivs = document.querySelectorAll('div.root, div.root div');
    for (let i = 0; i < traveDivs.length; i++) {
      resetAnimation(traveDivs[i]);
    }
  }

  // 获取遍历节点顺序
  function getTraverseNodes() {
    var rootDiv = document.querySelector('.root');
    var traverseNodes = [];
    switch (traverseAlgor.value) {
      case 'pre-order-dfs':
        preOrderTraverseDFS(rootDiv, traverseNodes);
        break;
      case 'pre-order-bfs':
        preOrderTraverseBFS(rootDiv, traverseNodes, []);
        break;
      case 'post-order-dfs':
        postOrderTraverseDFS(rootDiv, traverseNodes);
        break;
      case 'post-order-bfs':
        postOrderTraverseBFS(rootDiv, traverseNodes, []);
        break;
      default:
        preOrderTraverseDFS(rootDiv, traverseNodes);
        break;
    }
    return traverseNodes;
  }

  /*
   * 先序遍历(深度优先)
   */
  function preOrderTraverseDFS(element, traverseNodes) {
    traverseNodes.push(element);
    for (let i = 0; i < element.children.length; i++) {
      if (element.children[i].nodeName.toUpperCase() === 'DIV') {
        preOrderTraverseDFS(element.children[i], traverseNodes);
      }
    }
  }

  /*
   * 先序遍历(广度优先)
   */
  function preOrderTraverseBFS(element, traverseNodes, queue) {
    if (element.className === 'root') traverseNodes.push(element);
    for (let i = 0; i < element.children.length; i++) {
      if (element.children[i].nodeName.toUpperCase() === 'DIV') {
        traverseNodes.push(element.children[i]);
        queue.push(element.children[i]);
      }
    }
    if (queue.length > 0) {
      var firstEle = queue.shift();
      preOrderTraverseBFS(firstEle, traverseNodes, queue);
    }
  }

  /*
   * 后序遍历(深度优先)
   */
  function postOrderTraverseDFS(element, traverseNodes) {
    for (let i = 0; i < element.children.length; i++) {
      if (element.children[i].nodeName.toUpperCase() === 'DIV') {
        postOrderTraverseDFS(element.children[i], traverseNodes);
      }
    }
    traverseNodes.push(element);
  }

  /*
   * 后序遍历(广度优先)
   */
  function postOrderTraverseBFS(element, traverseNodes, queue) {
    if (element.className === 'root') traverseNodes.push(element);
    var temp = [];
    for (let i = 0; i < element.children.length; i++) {
      if (element.children[i].nodeName.toUpperCase() === 'DIV') {
        temp.push(element.children[i]);
      }
    }
    traverseNodes.unshift(...temp);
    queue.push(...temp.reverse());
    if (queue.length > 0) {
      var firstEle = queue.shift();
      postOrderTraverseBFS(firstEle, traverseNodes, queue);
    }
  }

  function triggerAnimation(element) {
    if (animationEffect.value === 'border') {
      element.style.animation = TRAVERSE_ANIMATION_BORDER;
      element.style.border = TRAVERSED_BORDER;
    } else if (animationEffect.value === 'background') {
      element.style.animation = TRAVERSE_ANIMATION_BACKGROUND;
      element.style.background = TRAVERSED_BACKGROUND;
    }
  }

  function triggerQueryAnimation(element, flag) {
    if (animationEffect.value === 'border') {
      element.style.animation = TRAVERSE_ANIMATION_BORDER;
      if (flag) element.style.border = TRAVERSED_BORDER;
    } else if (animationEffect.value === 'background') {
      element.style.animation = TRAVERSE_ANIMATION_BACKGROUND;
      if (flag) element.style.background = TRAVERSED_BACKGROUND;
    }
  }

  function resetAnimation(element) {
    element.style.animation = '';
    element.style.background = NORMAL_BACKGROUND;
    element.style.border = NORMAL_BORDER;
  }
})();