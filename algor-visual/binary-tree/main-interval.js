(function() {
  var deep = document.getElementById('deep');
  var create = document.getElementById('create');
  var animationEffect = document.getElementById('animation-effect');
  var preTraverse = document.getElementById('pre-traverse');
  var inTraverse = document.getElementById('in-traverse');
  var postTraverse = document.getElementById('post-traverse');

  const TRAVERSE_ANIMATION_BACKGROUND = 'traverse-background 0.5s linear';
  const NORMAL_BACKGROUND = 'white';
  const TRAVERSED_BACKGROUND = '#10AB58';

  const TRAVERSE_ANIMATION_BORDER = 'traverse-border 0.5s linear';
  const NORMAL_BORDER = '2px solid black';
  const TRAVERSED_BORDER = '2px solid #1fde0e';

  create.onclick = createBinaryTree;
  preTraverse.onclick = traverseBinaryTree;
  inTraverse.onclick = traverseBinaryTree;
  postTraverse.onclick = traverseBinaryTree;

  function createBinaryTree(e) {
    var deepOfTree = +deep.value;
    if (!Number.isInteger(deepOfTree) || deepOfTree > 5 || deepOfTree < 3) return;

    var body = document.getElementsByTagName('body')[0];
    body.removeChild(document.querySelector('.root'));

    var rootDiv = document.createElement('DIV');
    rootDiv.className = 'root';
    appendLRChildren(rootDiv, 0, deepOfTree);
    body.appendChild(rootDiv);
  };

  function appendLRChildren(parent, i, deepOfTree) {
    if (i > deepOfTree - 2) return;

    var leftDiv = document.createElement('DIV');
    leftDiv.className = 'div' + i + ' left';
    appendLRChildren(leftDiv, i + 1, deepOfTree);
    parent.appendChild(leftDiv);

    var rightDiv = document.createElement('DIV');
    rightDiv.className = 'div' + i + ' right';
    appendLRChildren(rightDiv, i + 1, deepOfTree);
    parent.appendChild(rightDiv);
  }

  function traverseBinaryTree(e) {
    var traveDivs = document.querySelectorAll('div.root, div.root div');
    for (let i = 0; i < traveDivs.length; i++) {
      resetAnimation(traveDivs[i]);
    }

    var rootDiv = document.querySelector('.root');
    var traverseNodes = [];
    switch (e.target.id) {
      case 'pre-traverse':
        preOrderTraverse(rootDiv, traverseNodes);
        break;
      case 'in-traverse':
        inOrderTraverse(rootDiv, traverseNodes);
        break;
      case 'post-traverse':
        postOrderTraverse(rootDiv, traverseNodes);
        break;
      default:
        preOrderTraverse(rootDiv, traverseNodes);
        break;
    }

    var order = 0;
    setInterval(function() {
      if (order < traverseNodes.length) {
        triggerAnimation(traverseNodes[order]);
        order++;
      }
    }, 500);
  }

  /*
   * 先序遍历
   */
  function preOrderTraverse(element, traverseNodes) {
    if (element) {
      traverseNodes.push(element);
      preOrderTraverse(element.firstElementChild, traverseNodes);
      preOrderTraverse(element.lastElementChild, traverseNodes);
    }
  }

  /*
   * 中序遍历
   */
  function inOrderTraverse(element, traverseNodes) {
    if (element) {
      inOrderTraverse(element.firstElementChild, traverseNodes);
      traverseNodes.push(element);
      inOrderTraverse(element.lastElementChild, traverseNodes);
    }
  }

  /*
   * 后序遍历
   */
  function postOrderTraverse(element, traverseNodes) {
    if (element) {
      postOrderTraverse(element.firstElementChild, traverseNodes);
      postOrderTraverse(element.lastElementChild, traverseNodes);
      traverseNodes.push(element);
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

  function resetAnimation(element) {
    element.style.animation = '';
    element.style.background = NORMAL_BACKGROUND;
    element.style.border = NORMAL_BORDER;
  }
})();
