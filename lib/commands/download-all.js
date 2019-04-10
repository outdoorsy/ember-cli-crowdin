const fs = require('fs'); 
const downloadTranslations = require('./download');

module.exports = {
  name: 'i18n:download-all',
  aliases: ['i18n:dla'],
  availableOptions: [
    { name: 'assets', type: Boolean, default: false }
  ],
  description: 'Download i18n files from Crowdin, including addons',

  run: function() {
    const appPromise = downloadTranslations.run.call(this, {
      project: this.project
    });

    return appPromise.then(() => {
      return Promise.all(this._addonsPromises());
    }).catch((error) => {
      throw error;
    });
  },

  _addonsPromises() {
    // download all addons' translations
    const outdoorsyAddonsWithTranslations = this.project.addons.filter((addon) => {
      const path = addon.root;
      return path.includes('outdoorsyco') && fs.existsSync(`${path}/config/crowdin.js`);
    });
    return outdoorsyAddonsWithTranslations.map((addon) => {
      debugger;
      downloadTranslations.run.call(this, {
        project: addon
      });
    });
  }
};
