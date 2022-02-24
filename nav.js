const primaryNav    = document.querySelector('.primary-navigation');
const navToggle = document.querySelector('.mobile-nav-toggle');

navToggle.addEventListener('click', () =>{
    const visbility = primaryNav.getAttribute('data-visible');

    if(visbility === "false" ){
        primaryNav.setAttribute('data-visible', true)
        navToggle.setAttribute('aria-expanded',true)
    }else if(visbility === "true"){
        primaryNav.setAttribute('data-visible', false)
        navToggle.setAttribute('aria-expanded',false)
    }

    console.log (visbility);

})