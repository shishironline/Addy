import Browser from 'webextension-polyfill';

class Common {
  static isSupportedProtocol(urlString?: string) {
    var supportedProtocols = ['https:', 'http:', 'ftp:', 'file:'];
    var url = document.createElement('a');
    url.href = urlString || '';
    return supportedProtocols.indexOf(url.protocol) != -1;
  }

  static async getCurrentTab(): Promise<string> {
    var gettingActiveTab = await Browser.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (gettingActiveTab.length <= 0) {
      return '';
    }

    return gettingActiveTab[0].url!;
  }

  static getExtensionByContentType(contentType: string) {
    switch (contentType) {
      case 'image/apng':
        return '.apng';

      case 'image/avif':
        return '.avif';

      case 'image/gif':
        return '.gif';

      case 'image/jpeg':
      case 'image/jpg':
        return '.jpg';

      case 'image/png':
        return '.png';

      case 'image/svg+xml':
        return '.svg';

      case 'image/webp':
        return '.webp';

      case 'image/bmp':
        return '.bmp';

      case 'image/x-icon':
        return '.ico';

      case 'image/tiff':
        return '.tiff';
    }
  }
}

export default Common;
