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

  // 创建二叉树
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

  // 为二叉树添加左右子节点
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

  // 遍历二叉树
  function traverseBinaryTree(e) {
    var traveDivs = document.querySelectorAll('div.root, div.root div');
    for (let i = 0; i < traveDivs.length; i++) {
      resetAnimation(traveDivs[i]);
    }
    var rootDiv = document.querySelector('.root');
    setTimeout(function() {
      switch (e.target.id) {
        case 'pre-traverse':
          preOrderTraverse(rootDiv, []);
          break;
        case 'in-traverse':
          inOrderTraverse(rootDiv, []);
          break;
        case 'post-traverse':
          postOrderTraverse(rootDiv, []);
          break;
        default:
          preOrderTraverse(rootDiv, []);
          break;
      }
    }, 0);
  }

  /*
   * 先序遍历
   */
  function preOrderTraverse(element, stack) {
    triggerAnimation(element);
    if (element.children.length > 0) {
      stack.push(element.children[1]);
      setTimeout(function() {
        preOrderTraverse(element.children[0], stack);
      }, 500);
    } else if (stack.length > 0) {
      var rightEle = stack.pop();
      setTimeout(function() {
        preOrderTraverse(rightEle, stack);
      }, 500);
    }
  }

  /*
   * 中序遍历
   */
  function inOrderTraverse(element, stack) {
    if (element.children.length > 0 && !element.children[0].style.animation) {
      stack.push(element.children[1]);
      stack.push(element);
      inOrderTraverse(element.children[0], stack);
    } else {
      triggerAnimation(element);
      if (stack.length > 0) {
        var popEle = stack.pop();
        setTimeout(function() {
          inOrderTraverse(popEle, stack);
        }, 500);
      }
    }
  }

  /*
   * 后序遍历
   */
  function postOrderTraverse(element, stack) {
    if (element.children.length > 0 && !element.children[0].style.animation) {
      stack.push(element);
      stack.push(element.children[1]);
      postOrderTraverse(element.children[0], stack);
    } else {
      triggerAnimation(element);
      if (stack.length > 0) {
        var popEle = stack.pop();
        setTimeout(function() {
          postOrderTraverse(popEle, stack);
        }, 500);
      }
    }
  }

  // 触发动画
  function triggerAnimation(element) {
    if (animationEffect.value === 'border') {
      element.style.animation = TRAVERSE_ANIMATION_BORDER;
      element.style.border = TRAVERSED_BORDER;
    } else if (animationEffect.value === 'background') {
      element.style.animation = TRAVERSE_ANIMATION_BACKGROUND;
      element.style.background = TRAVERSED_BACKGROUND;
    }
  }

  // 清除动画
  function resetAnimation(element) {
    element.style.animation = '';
    element.style.background = NORMAL_BACKGROUND;
    element.style.border = NORMAL_BORDER;
  }
})();