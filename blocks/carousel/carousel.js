/* eslint-disable no-unused-expressions */
import { decorateIcons, loadCSS } from '../../scripts/lib-franklin.js';
import { div, span, p } from '../../scripts/dom-helpers.js';

const AUTOSCROLL_INTERVAL = 7000;

/**
 * Clone a carousel item
 * @param {Element} item carousel item to be cloned
 * @returns the clone of the carousel item
 */
function createClone(item) {
  const clone = item.cloneNode(true);
  clone.classList.add('clone');
  clone.classList.remove('selected');

  return clone;
}

class Carousel {
  constructor(block, data, config) {
    // Set defaults
    this.cssFiles = [];
    this.defaultStyling = false;
    this.dotButtons = true;
    this.navButtons = true;
    this.counter = false;
    this.infiniteScroll = true;
    this.autoScroll = true; // only available with infinite scroll
    this.autoScrollInterval = AUTOSCROLL_INTERVAL;
    this.currentIndex = 0;
    this.counterText = '';
    this.counterNavButtons = true;
    this.cardRenderer = this;
    // this is primarily controlled by CSS,
    // but we need to know then intention for scrolling pourposes
    this.visibleItems = [
      {
        items: 1,
        condition: () => true,
      },
    ];

    // Set information
    this.block = block;
    this.data = data || [...block.children];

    // Will be replaced after rendering, if available
    this.navButtonLeft = null;
    this.navButtonRight = null;

    // Apply overwrites
    Object.assign(this, config);

    if (this.defaultStyling) {
      this.cssFiles.push('/blocks/carousel/carousel.css');
    }
  }
  

  /**
  * Scroll the carousel to the next item
  */
  nextItem() {
  
    const navRight = this.block.parentNode.querySelector('.carousel-nav-right');
    const navLeft = this.block.parentNode.querySelector('.carousel-nav-left');
    const selectedItem = this.block.querySelectorAll('.carousel-item.show');
    const hiddenItem = this.block.querySelectorAll('.carousel-item.hidden');
    const allItems = this.block.querySelectorAll('.carousel-item');
    const carouselItems = this.block.querySelector('.carousel-items') ;

    var highestItemNumber = 0 ;
    var shownItemNumber = 0 ;
    allItems.forEach(e => {
      highestItemNumber = e.tabIndex ;
    }) ;
    selectedItem.forEach(e => {
      shownItemNumber = e.tabIndex ;
    }) ;

    var rotationDegree =  (shownItemNumber + 1)*(-100) ;

    carouselItems.style = "animation:1s; left: 0px; transform: translateX(" + rotationDegree +"%);"

    hiddenItem.forEach(e => {
      if( e.tabIndex == (shownItemNumber + 1  )) {
        e.classList.add("show")
        e.classList.remove("hidden")
      }
    }) ;
    if( (shownItemNumber + 1)  == highestItemNumber ) {
      navRight.classList.add('disabled');
    }
    navLeft.classList.remove('disabled');

    selectedItem.forEach(e => {
      e.classList.remove("show")
      e.classList.add("hidden")
    }) ;
    
  }

  /**
  * Scroll the carousel to the previous item
  */
  prevItem() {
    const navLeft = this.block.parentNode.querySelector('.carousel-nav-left');
    const navRight = this.block.parentNode.querySelector('.carousel-nav-right');
    const selectedItem = this.block.querySelectorAll('.carousel-item.show');
    const hiddenItem = this.block.querySelectorAll('.carousel-item.hidden');
    const carouselItems = this.block.querySelector('.carousel-items') ;
    //carouselItems.style = "animation:1s; left: 0px; transform: translateX(0%);" ;

    var shownItemNumber =  0 ;

    selectedItem.forEach(e => {
      shownItemNumber = e.tabIndex ;
    }) ;

    var rotationDegree =  (shownItemNumber - 1)*(-100) ;

    carouselItems.style = "animation:1s; left: 0px; transform: translateX(" + rotationDegree +"%);"
  
    hiddenItem.forEach(e => {
      if( e.tabIndex == (shownItemNumber - 1  )) {
        e.classList.add("show")
        e.classList.remove("hidden")
      }
    }) ;
    if((shownItemNumber - 1) == 0 ) {
      navLeft.classList.add('disabled');
    }
    navRight.classList.remove('disabled');
    selectedItem.forEach(e => {
      e.classList.remove("show")
      e.classList.add("hidden")
    }) ;
   
  }

  /**
  * Create left and right arrow navigation buttons
  */
  createNavButtons(parentElement) {
    const buttonLeft = document.createElement('button');
    buttonLeft.classList.add('carousel-nav-left','previous');
    buttonLeft.ariaLabel = 'Previous';
    //buttonLeft.append(span({ class: 'icon icon-chevron-left' }));
    buttonLeft.addEventListener('click', () => {
      if(buttonLeft.classList.contains('disabled') == false) {
        clearInterval(this.intervalId);
        this.prevItem();
      }
    });
    buttonLeft.innerHTML= this.createLeftArrow() ;
    buttonLeft.classList.add('disabled');

    const buttonRight = document.createElement('button');
    buttonRight.classList.add('carousel-nav-right','next');
    buttonRight.ariaLabel = 'Next';
    //buttonRight.append(span({ class: 'icon icon-chevron-right' }));
    buttonRight.addEventListener('click', () => {
      if(buttonRight.classList.contains('disabled') == false) {
        clearInterval(this.intervalId);
        this.nextItem();
      }
    });
    buttonRight.innerHTML= this.createRightArrow() ;

    [buttonLeft, buttonRight].forEach((navButton) => {
      navButton.classList.add('carousel-nav-button');
      parentElement.append(navButton);
    });

    decorateIcons(buttonLeft);
    decorateIcons(buttonRight);
    this.navButtonLeft = buttonLeft;
    this.navButtonRight = buttonRight;
  }
  createButton(){

  }

  createLeftArrow(){
    var arrow = '<svg class="svg" viewBox="0 0 100 100"><path d="M22.4566257,37.2056786 L-21.4456527,71.9511488 C-22.9248661,72.9681457 -24.9073712,72.5311671 -25.8758148,70.9765924 L-26.9788683,69.2027424 C-27.9450684,67.6481676 -27.5292733,65.5646602 -26.0500598,64.5484493 L20.154796,28.2208967 C21.5532435,27.2597011 23.3600078,27.2597011 24.759951,28.2208967 L71.0500598,64.4659264 C72.5292733,65.4829232 72.9450684,67.5672166 71.9788683,69.1217913 L70.8750669,70.8956413 C69.9073712,72.4502161 67.9241183,72.8848368 66.4449048,71.8694118 L22.4566257,37.2056786 Z" class="arrow" transform="translate(100, 100) rotate(90)"></path></svg>' ; 
    console.log(arrow) ;
    return arrow ;
}
  createRightArrow(){
    var arrow = '<svg class="svg" viewBox="0 0 100 100"><path d="M22.4566257,37.2056786 L-21.4456527,71.9511488 C-22.9248661,72.9681457 -24.9073712,72.5311671 -25.8758148,70.9765924 L-26.9788683,69.2027424 C-27.9450684,67.6481676 -27.5292733,65.5646602 -26.0500598,64.5484493 L20.154796,28.2208967 C21.5532435,27.2597011 23.3600078,27.2597011 24.759951,28.2208967 L71.0500598,64.4659264 C72.5292733,65.4829232 72.9450684,67.5672166 71.9788683,69.1217913 L70.8750669,70.8956413 C69.9073712,72.4502161 67.9241183,72.8848368 66.4449048,71.8694118 L22.4566257,37.2056786 Z" class="arrow" transform="translate(100, 100) rotate(270)"></path></svg>' ; 
    console.log(arrow) ;
    return arrow ;
  }



  /*
  * Changing the default rendering may break carousels that rely on it
  * (e.g. CSS might not match anymore)
  */
  // eslint-disable-next-line class-methods-use-this
  renderItem(item) {
    // create the carousel content
    const columnContainer = document.createElement('div');
    columnContainer.classList.add('carousel-item-columns-container');

    const columns = [document.createElement('div'), document.createElement('div')];

    const itemChildren = [...item.children];
    itemChildren.forEach((itemChild, idx) => {
      if (itemChild.querySelector('img')) {
        itemChild.classList.add('carousel-item-image');
      } else {
        itemChild.classList.add('carousel-item-text');
      }
      columns[idx].appendChild(itemChild);
    });

    columns.forEach((column) => {
      column.classList.add('carousel-item-column');
      columnContainer.appendChild(column);
    });
    return columnContainer;
  }

  async render() {
    
    // copy carousel styles to the wrapper too
    this.block.parentElement.classList.add(
      ...[...this.block.classList].filter((item, idx) => idx !== 0 && item !== 'block'),
    );
    //const carouselItems = this.block.querySelector('.carousel-items') ;
    // if ( carouselItems) {
    //   carouselItems.remove() ;
    // }  

    let defaultCSSPromise;
    if (Array.isArray(this.cssFiles) && this.cssFiles.length > 0) {
      // add default carousel classes to apply default CSS
      defaultCSSPromise = new Promise((resolve) => {
        this.cssFiles.forEach((cssFile) => {
          loadCSS(cssFile, (e) => resolve(e));
        });
      });
      this.block.parentElement.classList.add('carousel-wrapper');
      this.block.classList.add('carousel');
    }

    this.block.innerHTML = '';
    
     const carousalNavContainer = document.createElement('div');
     carousalNavContainer.className = 'carousel-nav-container';
     this.block.appendChild(carousalNavContainer);
     this.createNavButtons(carousalNavContainer);


    
    const carousalItemContainer = document.createElement('div');
    carousalItemContainer.className = 'carousel-items';
    this.block.appendChild(carousalItemContainer);
    var limit = getLimit() ;
  
    let count = 0;
    this.data.forEach((item, i) => {
      const itemContainer = document.createElement('div');
      itemContainer.className = 'carousel-item';
      itemContainer.style="position: absolute; left:" +count*(100/(limit + 1)) +"%;"
      itemContainer.tabIndex= count/(limit+ 1);

      if(count > limit){
        itemContainer.ariaHidden="true";
        itemContainer.classList.add("hidden") ;
      } else{
        itemContainer.classList.add("show") ;
      }
      count = count+1 ;
      if (i === this.currentIndex) {
        itemContainer.classList.add('selected');
      }

      let renderedItem = this.cardRenderer.renderItem(item);
      renderedItem = Array.isArray(renderedItem) ? renderedItem : [renderedItem];
      renderedItem.forEach((renderedItemElement) => {
        itemContainer.appendChild(renderedItemElement);
      });
      carousalItemContainer.appendChild(itemContainer);
    });

    this.cssFiles && (await defaultCSSPromise);
  }
}

function getLimit() {
  var x = window.matchMedia("(max-width: 600px)") ;

  var y = window.matchMedia("(max-width: 1000px)") ;
  if(x.matches && y.matches) {
      return 2 ;
  } else if (!x.matches && y.matches) {
      return 3
  } else {
      return 4 ;
  }
}
/**
 * Create and render default carousel.
 * Best practice: Create a new block and call the function, instead using or modifying this.
 * @param {Element}  block        required - target block
 * @param {Array}    data         optional - a list of data elements.
 *  either a list of objects or a list of divs.
 *  if not provided: the div children of the block are used
 * @param {Object}   config       optional - config object for
 * customizing the rendering and behaviour
 */
export async function createCarousel(block, data, config) {
  const carousel = new Carousel(block, data, config);
 
  await carousel.render();
  return carousel;
}




export default async function decorate(block, data, config) {
  // use the default carousel
  await createCarousel(block, data, config);
  window.onresize = function(event) { 
    window.location.reload();
  } ;
}

