declare global {
  interface Window {
    botpressWebChat?: any;
    botpress?: any;
  }
}

export interface BotpressConfig {
  botId: string;
  clientId: string;
  hostUrl?: string;
  messagingUrl?: string;
}

export function loadBotpressScripts(config: BotpressConfig): Promise<boolean> {
  return new Promise((resolve, reject) => {
    if (!config.botId) {
      resolve(false);
      return;
    }

    if (window.botpress) {
      try {
        window.botpress.init({
          botId: config.botId,
          clientId: config.clientId || config.botId,
          hostUrl: config.hostUrl || 'https://cdn.botpress.cloud/webchat/v2',
          messagingUrl: config.messagingUrl || 'https://messaging.botpress.cloud',
        });
        resolve(true);
      } catch (err) {
        console.warn('Botpress init error:', err);
        resolve(false);
      }
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.botpress.cloud/webchat/v2/inject.js';
    script.async = true;
    script.onload = () => {
      if (window.botpress) {
        try {
          window.botpress.init({
            botId: config.botId,
            clientId: config.clientId || config.botId,
            hostUrl: config.hostUrl || 'https://cdn.botpress.cloud/webchat/v2',
            messagingUrl: config.messagingUrl || 'https://messaging.botpress.cloud',
          });
          resolve(true);
        } catch (err) {
          console.warn('Botpress initialization failed:', err);
          resolve(false);
        }
      } else {
        resolve(false);
      }
    };
    script.onerror = () => {
      reject(new Error('Failed to load Botpress webchat inject script'));
    };

    document.head.appendChild(script);
  });
}
