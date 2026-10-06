const header = document.querySelector('header');
const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#site-navigation');
if (header && toggle && navigation) {
    header.dataset.menuReady = 'true';
    const compact = window.matchMedia('(max-width: 1100px)');
    const setOpen = (open) => {
        toggle.setAttribute('aria-expanded', String(open));
        header.classList.toggle('menu-open', open);
    };
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    navigation.addEventListener('click', (event) => {
        if (event.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && header.classList.contains('menu-open')) {
            setOpen(false);
            toggle.focus();
        }
    });
    document.addEventListener('click', (event) => {
        if (!header.contains(event.target)) setOpen(false);
    });
    compact.addEventListener('change', () => {
        if (navigation.contains(document.activeElement) && compact.matches) toggle.focus();
        setOpen(false);
    });
}
