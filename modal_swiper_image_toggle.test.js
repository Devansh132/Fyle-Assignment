const { JSDOM } = require('jsdom');     // Import Jest functions
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8');
const js = fs.readFileSync(path.resolve(__dirname, './script.js'), 'utf8');

const dom = new JSDOM(html, { runScripts: 'dangerously' });
const { window } = dom;

// Initialize Jest with JSDOM
global.window = window;
global.document = window.document;

const { openModal, closeModal } = require('./script');

describe('Modal Functions', () => {
  let modal;

  beforeEach(() => {
    modal = document.createElement('div');
    modal.classList.add('modal');
    document.body.appendChild(modal);
  });

  afterEach(() => {
    modal.remove();
  });

  test('openModal function should add active class to modal and overlay', () => {
    openModal(modal);
    expect(modal.classList.contains('active')).toBe(true);
    expect(document.getElementById('overlay').classList.contains('active')).toBe(true);
  });

  test('closeModal function should remove active class from modal and overlay', () => {
    openModal(modal);
    closeModal(modal);
    expect(modal.classList.contains('active')).toBe(false);
    expect(document.getElementById('overlay').classList.contains('active')).toBe(false);
  });
});

describe('Swiper Initialization', () => {
  test('Swiper should initialize with specified options', () => {
    expect(() => {
      new window.Swiper('.mySwiper', {
        slidesPerView: 3,
        spaceBetween: 30,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      });
    }).not.toThrow();
  });
});

describe('Image Toggler', () => {
  let tabs, images;

  beforeEach(() => {
    tabs = [];
    images = [];

    for (let i = 0; i < 3; i++) {
      const tab = document.createElement('div');
      tab.classList.add('tab');
      tabs.push(tab);

      const image = document.createElement('div');
      image.classList.add('img');
      images.push(image);

      document.body.appendChild(tab);
      document.body.appendChild(image);
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener = jest.fn((event, callback) => {
        callback();
      });
    });
  });

  afterEach(() => {
    tabs.forEach((tab) => tab.remove());
    images.forEach((image) => image.remove());
  });

  test('Clicking on tab should toggle active class on corresponding image', () => {
    tabs[1].click();
    expect(images[1].classList.contains('active')).toBe(true);
    expect(tabs[1].classList.contains('active')).toBe(true);

    tabs[0].click();
    expect(images[0].classList.contains('active')).toBe(true);
    expect(tabs[0].classList.contains('active')).toBe(true);
  });
});
