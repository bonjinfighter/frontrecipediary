/* global $ MobileDetect */

// モバイルブラウザかどうか判定
const isMobile = !!new MobileDetect(window.navigator.userAgent).mobile();

$(function() {
  setTimeout(function(){
	  $('.start p').fadeIn(1600);
  },500); //0.5秒後にロゴをフェードイン!
  setTimeout(function(){
	  $('.start').fadeOut(500);
  },2500); //2.5秒後にロゴ含め真っ白背景をフェードアウト
});
 
const showTab = (tabName) => {
  if ($(`#${tabName}`).is(':visible')) {
    return;
  }

  const tabsContainer = $(`a[href='#${tabName}']`).closest('.tabs');
  tabsContainer.find('.tabs__menu li').removeClass('active');
  tabsContainer
    .find(`.tabs__menu a[href='#${tabName}']`)
    .parent('li')
    .addClass('active');

  tabsContainer.find('.tabs__content > *').css({ display: 'none' });
  tabsContainer
    .find(`#${tabName}, .tabs__content .${tabName}`)
    .css({
      display: 'block',
      opacity: 0.7,
    })
    .animate(
      {
        opacity: 1,
      },
      400,
    );
};



const speed = 2;
const $window = $(window);

let slideHeight;

const showParallax = () => {
  const scrollTop = $window.scrollTop();

  $('.about').css({
    'background-position': `center ${Math.round((0 - scrollTop) / speed)}px`,
  });
  $('.introductions').css({
    'background-position': `center ${Math.round((slideHeight - scrollTop) / speed)}px`,
  });
};

const initParallax = () => {
  slideHeight = $window.height();

  showParallax();
};

$window.on('scroll', showParallax);

$window.on('resize', () => {
  initParallax();
});

initParallax();


$(window).on('resize', () => {
  initParallax();
});

$('.tabs__menu a').on('click', (e) => {
  const tabName = $(e.currentTarget).attr('href');

  e.preventDefault();

  if (tabName[0] === '#') {
    showTab(tabName.substring(1));
  }
});


$('.nav-link').on('click', (e) => {
  const destination = $(e.target).attr('href');

  e.preventDefault();

  $('html, body').animate(
    {
      scrollTop: $(destination).offset().top,
    },
    1000,
  );

  $('.navbar-toggler:visible').trigger('click');
});

$('.animated').waypoint({
  handler(direction) {
    if (direction === 'down') {
      $(this.element).removeClass('fadeOutUp');
      $(this.element).addClass('fadeInUp');
    }
    else if (direction === 'up'){
      $(this.element).removeClass('fadeInUp');
      $(this.element).addClass('fadeOutUp');
    }
  },
  offset: '90%',
});

$(window).on('resize', () => {
  initParallax();
});


if (isMobile) {
  $('.top__bg').css({
    'background-image': 'url(video/top-video-still.jpg)',
  });
} else {
  $('.top__video').css({ display: 'block' });
}

showTab('about-1');
showTab('introductions-1');

initParallax();
