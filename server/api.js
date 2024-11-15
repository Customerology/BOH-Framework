const {
  AppUserProductSubMenuMocked,
  LogonV2Mocked,
  EnterpriseMocked,
  LocationMocked
} = require('./data_mocked');

module.exports = (app) => {
  app.post(
    '/AppUser/LogonV2/app/575ea965-1c78-4e0b-9943-6b2bb68d7f53',
    (req, res) => {
      setTimeout(() => {
        if (req.body.userName === 'admin' && req.body.user_Pwd === 'admin') {
          res.status(200).json(LogonV2Mocked.Success);
        } else {
          res.status(200).json(LogonV2Mocked.Error);
        }
      }, 1000);
    }
  );

  app.get('/AppSubscription/AppUserProductSubMenu', (req, res) => {
    setTimeout(() => {
      res.status(200).json(AppUserProductSubMenuMocked);
    }, 2000);
  });

  app.get('/Enterprise', (req, res) => {
    setTimeout(() => {
      res.status(200).json(EnterpriseMocked);
    }, 3000);
  });

  app.get('/Enterprise/1/Location', (req, res) => {
    setTimeout(() => {
      res.status(200).json(LocationMocked.DATA_ASSET1);
    }, 2000);
  });

  app.get('/Enterprise/19/Location', (req, res) => {
    setTimeout(() => {
      res.status(200).json(LocationMocked.DATA_ASSET1);
    }, 2000);
  });
};
