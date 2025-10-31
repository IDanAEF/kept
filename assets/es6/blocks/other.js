const other = () => {
    const hideScroll = () => {
        document.querySelector('body').classList.add('fixed');
        document.querySelector('html').classList.add('fixed');
    }

    const showScroll = () => {
        document.querySelector('body').classList.remove('fixed');
        document.querySelector('html').classList.remove('fixed');
    }

    const toggleScroll = () => {
        document.querySelector('body').classList.toggle('fixed');
        document.querySelector('html').classList.toggle('fixed');
    }

    const getCookie = (name) => {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));

        return matches ? decodeURIComponent(matches[1]) : '';
    }

    const setCookie = (name, value, options = {}) => {
        options = {
            path: '/',
            ...options
        };

        if (options.expires instanceof Date) 
            options.expires = options.expires.toUTCString();

        let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

        for (let optionKey in options) {
            updatedCookie += "; " + optionKey;

            let optionValue = options[optionKey];
            if (optionValue !== true) {
                updatedCookie += "=" + optionValue;
            }
        }

        document.cookie = updatedCookie;
    }

    try {
        const targetElem = document.querySelectorAll('.elem_animate'),
              targetText = document.querySelectorAll('.text_animate'),
              targetFields = document.querySelectorAll('.elem_animate_field');

            
        if (window.innerWidth > 992) {
            targetFields.forEach(field => {
                const fieldElems = field.querySelectorAll('.elem_animate'),
                      first = field.querySelector('.first-animate');

                let delay = 0;

                if (first) {
                    first.style.transitionDelay = delay+'s';
                    delay += 0.4;
                }

                fieldElems.forEach(item => {
                    if (!first || item != first) {
                        item.style.transitionDelay = delay+'s';
                        delay += 0.4; 
                    }
                });
            });
        }
        
        targetText.forEach(item => {
            let textCont = item.textContent.trim(),
                newInner = '',
                transit = 0;

            for (let i = 0; i < textCont.length; i++) {
                newInner += `<i class="or" style="transition: 0.4s all ${transit.toFixed(2)}s">${textCont[i]}</i>`;
                transit += 0.03;
            }
            item.innerHTML = newInner;
        });

        function returnHeight() {
            return window.innerWidth <= 600 ? window.innerHeight / 1.05 : window.innerHeight / 1.2
        }

        function removeAnim() {
            targetElem.forEach(item => item.classList.remove('anim'));
        }

        function setAnim(mass) {
            mass.forEach(item => {
                if (returnHeight() + window.scrollY >= item.getBoundingClientRect().y + window.scrollY) {
                    item.classList.add('anim');
                }
            });
        }

        function setChildAnim(mass) {
            if (window.innerWidth > 992) {
               mass.forEach(item => {
                    if (returnHeight() + window.scrollY >= item.getBoundingClientRect().y + window.scrollY) {
                        item.querySelectorAll('.elem_animate').forEach(itemChild => {
                            itemChild.classList.add('anim');
                        });
                    }
                }); 
            }
        }

        setChildAnim(targetFields);
        setAnim(targetElem);
        setAnim(targetText);

        window.addEventListener('scroll', () => {
            setChildAnim(targetFields);
            setAnim(targetElem);
            setAnim(targetText);
        });

        window.onbeforeunload = () => {
            removeAnim();
        }
        window.onpageshow = function() {
            setChildAnim(targetFields);
            setAnim(targetElem);
            setAnim(targetText);
        };
    } catch (e) {
        console.log(e.stack);
    }

    try {
        const bodyClickContent = document.querySelectorAll('.body-click-content'),
              bodyClickTarget = document.querySelectorAll('.body-click-target');

        document.body.addEventListener('click', (e) => {
            if (e.target.classList.contains('body-click-target') || e.target.classList.contains('body-click-close')) {
                e.preventDefault();

                let contentElem = 
                    e.target.getAttribute('data-content') ? 
                    document.querySelector('.body-click-content[data-content="'+e.target.getAttribute('data-content')+'"]') : 
                    (e.target.nextElementSibling ? e.target.nextElementSibling : '');

                bodyClickContent.forEach(item => contentElem != item && item.classList.contains('global-hide') ? item.classList.remove('active') : '');
                bodyClickTarget.forEach(item => item.classList.contains('global-hide') && item != e.target ? item.classList.remove('active') : '');
                
                if (contentElem && contentElem.classList.contains('body-click-content'))
                    contentElem.classList.toggle('active');
                else 
                    e.target.parentElement.classList.remove('active');

                !e.target.classList.contains('not-active') ? e.target.classList.toggle('active') : '';
            } else if (!e.target.closest('.body-click-content')) {
                bodyClickContent.forEach(item => !item.classList.contains('not-global') ? item.classList.remove('active') : '');
                bodyClickTarget.forEach(item => !item.classList.contains('not-active') && !item.classList.contains('not-global') ? item.classList.remove('active') : '');
            }
        });
    } catch (e) {
        console.log(e.stack);
    }

    try {
        const modal = document.querySelector('.modal'),
              modalBtns = document.querySelectorAll('[data-call-modal]'),
              modalItems = document.querySelectorAll('.modal__item');

        modalBtns.forEach(btn => {
            if (btn.getAttribute('data-call-modal')) {
                btn.addEventListener('click', () => {
                    modalItems.forEach(item => item.classList.remove('active'));

                    modal.classList.add('active');
                    modal.querySelector('.modal__item[data-modal="'+btn.getAttribute('data-call-modal')+'"]')
                        .classList.add('active');

                    hideScroll();
                });
            }
        });

        modal.addEventListener('click', (e) => {
            if (e.target == modal || e.target.classList.contains('modal__close') || e.target.classList.contains('modal__hide')) {
                modalItems.forEach(item => item.classList.remove('active'));
                modal.classList.remove('active');
                showScroll();
            }
        });
    } catch (e) {
        console.log(e.stack);
    }

    try {
        Fancybox.bind("[data-fancybox]");

        const iframeUsage = document.querySelectorAll('a[data-iframe-usage]');

        iframeUsage.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();

                new Fancybox([
                    {
                        type: 'html',
                        src: '<iframe src="'+item.href+'" class="framed-video" frameBorder="0" allow="clipboard-write; autoplay" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>'
                    }
                ]);
            });
        });
    } catch (e) {
        console.log(e.stack);
    }

    try {
        const personsSliderItems = document.querySelectorAll('.home__persons-slider-item');

        let timeout;

        const setHover = (i = -1) => {
            clearTimeout(timeout);

            personsSliderItems.forEach(item => item.classList.remove('hover', 'linked'));
            if (i != -1) personsSliderItems[i].classList.add('hover');

            timeout = setTimeout(() => {
                personsSliderItems[i].classList.add('linked');
            }, 300);
        }

        personsSliderItems.forEach((sliderItem, i) => {
            let link = sliderItem.querySelector('a');

            link.addEventListener('click', (e) => {
                if (!sliderItem.classList.contains('linked'))
                    e.preventDefault();

                setHover(i)
            });
            link.addEventListener('mouseenter', () => setHover(i));
            link.addEventListener('mouseleave', () => setHover(-1));
        });
    } catch (e) {
        console.log(e.stack);
    }

    try {
        const homeVideoBlock = document.querySelector('.home__promo-video'),
              loadingImage = document.querySelector('.loading-video');

        if (loadingImage) {
            let videoSrc = loadingImage.getAttribute('data-src').trim();

            const setProgress = async () => {
                let response = await fetch(videoSrc),
                    reader = response.body.getReader(),
                    contentLength = +response.headers.get('Content-Length'),
                    receivedLength = 0,
                    progress = 0;

                while(true) {
                    const {done, value} = await reader.read();

                    if (done) {
                        loadingImage.src = videoSrc;
                        homeVideoBlock.classList.add('anim');
                        break;
                    }

                    receivedLength += value.length;

                    progress = Math.round(receivedLength / (contentLength / 100));
                }
            }

            setProgress();
        }
    } catch (e) {
        console.log(e.stack);
    }
}

export default other;