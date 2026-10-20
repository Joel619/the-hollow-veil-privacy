(() => {
  const root = document.documentElement;
  const languageLinks = [...document.querySelectorAll('[data-language-link]')];
  const documents = [...document.querySelectorAll('[data-document]')];
  const languageForHash = () => /^(#espanol|#es-)/.test(location.hash) ? 'es' : /^(#english|#en-)/.test(location.hash) ? 'en' : null;
  const applyLanguage = language => {
    root.dataset.language = language;
    root.lang = language;
    root.classList.add('js');
    documents.forEach(section => { section.hidden = section.dataset.document !== language; });
    languageLinks.forEach(link => {
      if (link.dataset.languageLink === language) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
    document.querySelectorAll('.contents a').forEach(link => link.removeAttribute('aria-current'));
    document.title = language === 'es' ? 'Política de privacidad · Ricochet Forge' : 'Privacy Policy · Ricochet Forge';
  };
  applyLanguage(languageForHash() || ((navigator.language || '').toLowerCase().startsWith('es') ? 'es' : 'en'));
  languageLinks.forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    applyLanguage(link.dataset.languageLink);
    history.replaceState(null, '', link.getAttribute('href'));
  }));
  window.addEventListener('hashchange', () => {
    const language = languageForHash();
    if (language && language !== root.dataset.language) applyLanguage(language);
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting || entry.target.closest('[hidden]')) continue;
        document.querySelectorAll('.contents a').forEach(link => {
          if (link.getAttribute('href') === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    }, { rootMargin: '-110px 0px -55% 0px', threshold: 0 });
    document.querySelectorAll('.policy-block').forEach(section => observer.observe(section));
  }
})();
