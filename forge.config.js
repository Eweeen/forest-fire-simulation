const path = require('path');

module.exports = {
  packagerConfig: {
    asar: true,
    ignore: (file) => {
      if (file.includes('/out/main/')) return false; // Ne pas ignorer out/main/
      return /\/out\//.test(file); // Ignorer le reste du dossier out
    }
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {}
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin']
    },
    {
      name: '@electron-forge/maker-deb',
      config: {}
    }
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'Eweeen',
          name: 'electron-forest-fire'
        },
        prerelease: false
      }
    }
  ]
};
