(function() {
  var animationEffect = document.getElementById('animation-effect');
  var preTraverse = document.getElementById('pre-traverse');
  var postTraverse = document.getElementById('post-traverse');
  var queryContent = document.getElementById('query-content');
  var preQuery = document.getElementById('pre-query');
  var postQuery = document.getElementById('post-query');

  var timer = null;

  const TRAVERSE_ANIMATION_BACKGROUND = 'traverse-background 0.5s linear';
  const NORMAL_BACKGROUND = 'white';
  const TRAVERSED_BACKGROUND = '#10AB58';

  const TRAVERSE_ANIMATION_BORDER = 'traverse-border 0.5s linear';
  const NORMAL_BORDER = '2px solid black';
  const TRAVERSED_BORDER = '2px solid #1fde0e';

  preTraverse.onclick = traverseTree;
  postTraverse.onclick = traverseTree;
  preQuery.onclick = traverseTree;
  postQuery.onclick = traverseTree;

  function traverseTree(e) {
    init();

    var rootDiv = document.querySelector('.root');

    setTimeout(function() {
      switch (e.target.id) {
        case 'pre-traverse':
          preOrderTraverse(rootDiv, [], 'traverse');
          break;
        case 'pre-query':
          preOrderTraverse(rootDiv, [], 'query');
          break;
        case 'post-traverse':
          postOrderTraverse(rootDiv, [], 'traverse');
          break;
        case 'post-query':
          postOrderTraverse(rootDiv, [], 'query');
          break;
        default:
          preOrderTraverse(rootDiv, [], 'traverse');
          break;
      }
    }, 100);
  }

  function init() {
    clearTimeout(timer);
    var traveDivs = document.querySelectorAll('div.root, div.root div');
    for (let i = 0; i < traveDivs.length; i++) {
      resetAnimation(traveDivs[i]);
    }
  }

  /*
   * 先序遍历
   */
  function preOrderTraverse(element, stack, operation) {
    triggerAnimationByOperation(element, operation);

    if (element.children.length > 1) {
      for (let i = element.children.length - 1; i > 1; i--) {
        if (element.children[i].nodeName.toUpperCase() === 'DIV') {
          stack.push(element.children[i]);
        }
      }
      timer = setTimeout(function() {
        preOrderTraverse(element.children[1], stack, operation);
      }, 500);
    } else if (stack.length > 0) {
      var rightEle = stack.pop();
      timer = setTimeout(function() {
        preOrderTraverse(rightEle, stack, operation);
      }, 500);
    } else {
      clearTimeout(timer);
    }
  }

  /*
   * 后序遍历
   */
  function postOrderTraverse(element, stack, operation) {
    if (element.children.length > 1 && !element.children[1].style.animation) {
      stack.push(element);
      for (let i = element.children.length - 1; i > 1; i--) {
        if (element.children[i].nodeName.toUpperCase() === 'DIV') {
          stack.push(element.children[i]);
        }
      }
      postOrderTraverse(element.children[1], stack, operation);
    } else {
      triggerAnimationByOperation(element, operation);
      if (stack.length > 0) {
        var rightEle = stack.pop();
        timer = setTimeout(function() {
          postOrderTraverse(rightEle, stack, operation);
        }, 500);
      }
    }
  }

  function triggerAnimationByOperation(element, operation) {
    if (operation === 'traverse') {
      triggerAnimation(element);
    } else if (operation === 'query') {
      triggerQueryAnimation(element,
        element.querySelector('p').innerText === queryContent.value);
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
