(function($) {

  "use strict";

  var initPreloader = function() {
    $(document).ready(function($) {
    var Body = $('body');
        Body.addClass('preloader-site');
    });
    $(window).load(function() {
        $('.preloader-wrapper').fadeOut();
        $('body').removeClass('preloader-site');
    });
  }

  // init Chocolat light box
	var initChocolat = function() {
		Chocolat(document.querySelectorAll('.image-link'), {
		  imageSize: 'contain',
		  loop: true,
		})
	}

  var initSwiper = function() {

    var swiper = new Swiper(".main-swiper", {
      speed: 500,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });

    var bestselling_swiper = new Swiper(".bestselling-swiper", {
      slidesPerView: 4,
      spaceBetween: 30,
      speed: 500,
      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 3,
        },
        991: {
          slidesPerView: 4,
        },
      }
    });

    var testimonial_swiper = new Swiper(".testimonial-swiper", {
      slidesPerView: 1,
      speed: 500,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });

    var products_swiper = new Swiper(".products-carousel", {
      slidesPerView: 4,
      spaceBetween: 30,
      speed: 500,
      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 3,
        },
        991: {
          slidesPerView: 4,
        },

      }
    });

  }

  var initProductQty = function(){

    $('.product-qty').each(function(){

      var $el_product = $(this);
      var quantity = 0;

      $el_product.find('.quantity-right-plus').click(function(e){
          e.preventDefault();
          var quantity = parseInt($el_product.find('#quantity').val());
          $el_product.find('#quantity').val(quantity + 1);
      });

      $el_product.find('.quantity-left-minus').click(function(e){
          e.preventDefault();
          var quantity = parseInt($el_product.find('#quantity').val());
          if(quantity>0){
            $el_product.find('#quantity').val(quantity - 1);
          }
      });

    });

  }

  // init jarallax parallax
  var initJarallax = function() {
    jarallax(document.querySelectorAll(".jarallax"));

    jarallax(document.querySelectorAll(".jarallax-keep-img"), {
      keepImg: true,
    });
  }

  // init header active link based on current page
  var initHeaderActive = function() {
    try {
      var path = window.location.pathname.split('/').pop();
      if (!path) path = 'index.html';
      $('a.nav-link, .menu-list a').each(function() {
        var href = $(this).attr('href');
        if (!href) return;
        var hrefFile = href.split('/').pop();
        if (hrefFile === path) {
          $('a.nav-link').removeClass('active');
          $(this).addClass('active');
        }
      });
    } catch (e) {
      // fail silently
    }
  }

  // Cart management system
  var CartManager = {
    cartItems: [],
    
    init: function() {
      this.loadCart();
      this.attachCartListeners();
      this.updateCartDisplay();
    },

    loadCart: function() {
      var stored = localStorage.getItem('waggy_cart');
      if (stored) {
        this.cartItems = JSON.parse(stored);
      }
    },

    saveCart: function() {
      localStorage.setItem('waggy_cart', JSON.stringify(this.cartItems));
    },

    addItem: function(productName, price, image) {
      var existingItem = this.cartItems.find(function(item) {
        return item.name === productName;
      });

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        this.cartItems.push({
          name: productName,
          price: parseFloat(price),
          image: image,
          quantity: 1,
          id: Date.now() + Math.random()
        });
      }

      this.saveCart();
      this.updateCartDisplay();
      this.showNotification('Added to cart: ' + productName);
    },

    removeItem: function(id) {
      this.cartItems = this.cartItems.filter(function(item) {
        return item.id !== id;
      });
      this.saveCart();
      this.updateCartDisplay();
    },

    updateQuantity: function(id, quantity) {
      var item = this.cartItems.find(function(item) {
        return item.id === id;
      });
      if (item) {
        if (quantity <= 0) {
          this.removeItem(id);
        } else {
          item.quantity = quantity;
          this.saveCart();
          this.updateCartDisplay();
        }
      }
    },

    getTotal: function() {
      return this.cartItems.reduce(function(sum, item) {
        return sum + (item.price * item.quantity);
      }, 0);
    },

    getItemCount: function() {
      return this.cartItems.reduce(function(sum, item) {
        return sum + item.quantity;
      }, 0);
    },

    updateCartDisplay: function() {
      var self = this;
      var count = this.getItemCount();
      var total = this.getTotal();

      // Update badge counts
      $('.badge').text(count > 0 ? count : '0');

      // Update cart items list
      var cartList = $('.offcanvas-body .list-group');
      cartList.empty();

      if (this.cartItems.length === 0) {
        cartList.html('<li class="list-group-item text-center text-muted">Your cart is empty</li>');
      } else {
        this.cartItems.forEach(function(item) {
          var itemHtml = '<li class="list-group-item d-flex justify-content-between align-items-center">' +
            '<div>' +
            '<h6 class="my-0">' + item.name + '</h6>' +
            '<small class="text-body-secondary">$' + item.price.toFixed(2) + ' each</small>' +
            '</div>' +
            '<div class="d-flex align-items-center gap-2">' +
            '<input type="number" class="form-control form-control-sm" style="width: 60px;" value="' + item.quantity + '" data-item-id="' + item.id + '" class="item-qty">' +
            '<span class="text-body-secondary">$' + (item.price * item.quantity).toFixed(2) + '</span>' +
            '<button class="btn btn-sm btn-danger remove-item" data-item-id="' + item.id + '">×</button>' +
            '</div>' +
            '</li>';
          cartList.append(itemHtml);
        });
      }

      // Add total and checkout button
      var totalHtml = '<li class="list-group-item d-flex justify-content-between">' +
        '<span class="fw-bold">Total (USD)</span>' +
        '<strong>$' + total.toFixed(2) + '</strong>' +
        '</li>' +
        '<li class="list-group-item">' +
        '<a href="checkout.html" class="w-100 btn btn-primary btn-lg text-center">Continue to checkout</a>' +
        '</li>';
      cartList.append(totalHtml);

      // Attach event handlers
      this.attachCartItemListeners();
    },

    attachCartListeners: function() {
      var self = this;
      $(document).on('click', '.btn-cart', function(e) {
        e.preventDefault();
        
        var card = $(this).closest('.card');
        var productName = card.find('.card-title').text();
        var price = card.find('.secondary-font.text-primary').text().replace('$', '');
        var image = card.find('img').attr('src');

        self.addItem(productName, price, image);
      });
    },

    attachCartItemListeners: function() {
      var self = this;
      
      $(document).off('click', '.remove-item').on('click', '.remove-item', function() {
        var itemId = $(this).data('item-id');
        self.removeItem(itemId);
      });

      $(document).off('change', '.item-qty').on('change', '.item-qty', function() {
        var itemId = $(this).data('item-id');
        var quantity = parseInt($(this).val());
        self.updateQuantity(itemId, quantity);
      });
    },

    showNotification: function(message) {
      var notification = $('<div class="alert alert-success alert-dismissible fade show position-fixed" role="alert" style="bottom: 20px; right: 20px; z-index: 9999; min-width: 300px;">' +
        message +
        '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
        '</div>');
      
      $('body').append(notification);
      
      setTimeout(function() {
        notification.alert('close');
      }, 3000);
    }
  };

  // document ready
  $(document).ready(function() {
    
    initPreloader();
    initSwiper();
    initProductQty();
    initJarallax();
    initChocolat();
    initHeaderActive();
    CartManager.init();

        // product single page
        var thumb_slider = new Swiper(".product-thumbnail-slider", {
          spaceBetween: 8,
          slidesPerView: 3,
          freeMode: true,
          watchSlidesProgress: true,
        });
    
        var large_slider = new Swiper(".product-large-slider", {
          spaceBetween: 10,
          slidesPerView: 1,
          effect: 'fade',
          thumbs: {
            swiper: thumb_slider,
          },
        });

    window.addEventListener("load", (event) => {
      //isotope
      $('.isotope-container').isotope({
        // options
        itemSelector: '.item',
        layoutMode: 'masonry'
      });


      var $grid = $('.entry-container').isotope({
        itemSelector: '.entry-item',
        layoutMode: 'masonry'
      });


      // Initialize Isotope
      var $container = $('.isotope-container').isotope({
        // options
        itemSelector: '.item',
        layoutMode: 'masonry'
      });

      $(document).ready(function () {
        //active button
        $('.filter-button').click(function () {
          $('.filter-button').removeClass('active');
          $(this).addClass('active');
        });
      });

      // Filter items on button click
      $('.filter-button').click(function () {
        var filterValue = $(this).attr('data-filter');
        if (filterValue === '*') {
          // Show all items
          $container.isotope({ filter: '*' });
        } else {
          // Show filtered items
          $container.isotope({ filter: filterValue });
        }
      });

    });

  }); // End of a document

})(jQuery);