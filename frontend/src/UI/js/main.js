(function($){

    // Spinner
    var spinner = function(){
        setTimeout(function(){
            if($('#spinner').length > 0){
                $('#spinner').removeClass('show');
            }
        },1);
    };
    spinner();
    
    // AOs Animation initialization
    AOS.init({
        once: true,
        // offset: 250,
        easing: 'ease',
        duration: 800
    });


    // Navigation hamburger
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    hamburger.addEventListener("click", ()=> {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    })

    document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", ()=> {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
    }))

    // Partners Carousel
    $('.loop').owlCarousel({
        center: true,
        items:1,
        loop:true,
        autoplay: true,
        nav: false,
        margin:0,
        responsive:{ 
            1200:{
                items:5
            },
            992:{
                items:3
            },
            760:{
              items:2
          }
        }
    });

    // Product details slider
    $(".product-carousel").owlCarousel({
        items: 1,
        autoplay: true,
        smartSpeed: 1000,
        dots: true,
        loop: true,
        // nav: true,
        // navText : [
        //     '<i class="bi bi-chevron-left"></i>',
        //     '<i class="bi bi-chevron-right"></i>'
        // ]
    });

    // Initialize Glightbox
    const glightbox = GLightbox({
        selector: '.glightbox'
    });

})(jQuery);