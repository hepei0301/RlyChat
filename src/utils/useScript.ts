let toggle: boolean = false;

export const useScript = () => {
  return new Promise<boolean>((resolve) => {
    if (!toggle) {
      toggle = true;
      const arrJs = [
        'https://github.com/hepei0301/rly-chat/blob/main/public/clound/MD5.min.js',
        'https://github.com/hepei0301/rly-chat/blob/main/public/clound/base64.min.js',
        'https://github.com/hepei0301/rly-chat/blob/main/public/clound/jquery-3.1.0.min.js',
        'https://github.com/hepei0301/rly-chat/blob/main/public/clound/ytx-web-im7.2.2.5.js',
        'https://github.com/hepei0301/rly-chat/blob/main/public/clound/ytx-web-av3.js',
        'https://github.com/hepei0301/rly-chat/blob/main/public/clound/adapter.js',
        'https://github.com/hepei0301/rly-chat/blob/main/public/clound/config.js',
        'https://github.com/hepei0301/rly-chat/blob/main/public/clound/RL_Meet.js',
        'https://github.com/hepei0301/rly-chat/blob/main/public/clound/chatLogin.js',
        'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js',
      ];
      const arrCss = ['https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css'];

      arrJs.forEach((url: string) => {
        const sc = document.createElement('script');
        sc.setAttribute('src', url);
        sc.setAttribute('type', 'text/javascript');
        document.head.appendChild(sc);
      });
      arrCss.forEach((url: string) => {
        const li = document.createElement('link');
        li.setAttribute('href', url);
        li.setAttribute('rel', 'stylesheet');
        document.head.appendChild(li);
      });
    }
    setTimeout(() => {
      resolve(toggle);
    }, 500);
  });
};
