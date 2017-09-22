const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user.js');
const bitGoJS = require('bitgo');
const slotMachine = require('../slot-machine/slot-machine')
const accessToken = ""; // add your access token here

const bitGo = new bitGoJS.BitGo({
  env: 'test',
  accessToken,
});

bitGo.session({})
  .then(function(res) {
    console.log(res);
    bitGo.unlock({
      otp: '0000000'
    }, function callback(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Unlock Success");
      }
    });
  })
  .catch(function(err) {
    console.log(err);
    process.exit(-1);
  });



router.post('/register', function(req, res) {
  User.register(new User({
    name: req.body.name,
    username: req.body.username,
    phone: '0000000000',
    bitsLost : '0'
  }),
    req.body.password,
    function(err, account) {
      if (err) {
        return res.status(500).json({
          err: err
        });
      }
      passport.authenticate('local')(req, res, function() {
        var params = {
          "passphrase": req.body.username,
          "label": req.body.username
        }
        bitGo.wallets().createWalletWithKeychains(params, function(err, result) {
          if (err) {
            console.log(err);
            // Failed, Delete user also
            User.deleteOne({
              username: req.body.username
            }, (err) => {
              if (err) console.log(err);
            })
            return res.status(500).json({
              'err': {
                code: err.code,
                Error: err.Error,
                message: "Error while creating wallet, Try again later"
              }
            });
          }
          User.update({
            username: req.body.username
          }, {
            wallet: result.wallet.id()
          }, function(err, rawResponse) {
            if (err) {
              User.deleteOne({
                username: req.body.username
              }, (err) => {
                if (err) console.log(err);
              })
              return res.status(500).json({
                err: err
              });
            }
            return res.status(200).json({
              status: 'Registration successful!'
            });
          })
        });
      });
    });
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }
      console.log(user);
      res.status(200).json({
        status: 'Login successful!'
      });
    });
  })(req, res, next);
});

router.get('/logout', function(req, res) {
  req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});

router.get('/status', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(200).json({
      status: false
    });
  }
  res.status(200).json({
    status: true
  });
});


router.post('/getBCBalance', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(500).json({
      'err': {
        code: 420,
        message: "Error while fetching balance, User Not Authenticated"
      }
    });
  }
  let user = req.user;
  bitGo.wallets().get({
    type: 'bitcoin',
    id: user.wallet
  }, function(err, wallet) {
    if (err) {
      console.log(err);
      return res.status(500).json({
        'err': {
          message: "Error while fetching balance, Internal error"
        }
      });
    }
    let finalBalance = wallet.balance();
    console.log('Wallet balance is: ' + finalBalance + ' Satoshis');
    finalBalance = finalBalance - parseInt(user.bitsLost)
    console.log(user);
    console.log('Filtered Wallet balance is: ' + finalBalance + ' Satoshis');
    res.status(200).json({
      status: true,
      data: finalBalance
    });
  });
});

router.post('/info', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(500).json({
      'err': {
        code: 420,
        message: "Error while fetching user info, User Not Authenticated"
      }
    });
  }
  let user = req.user;
  res.status(200).json({
    status: true,
    data: {
      name: user.name,
      wallet: user.wallet,
      email: user.username,
      phone: user.phone
    }
  });
});

router.post('/startBet', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(500).json({
      'err': {
        code: 420,
        message: "Error while starting bet, User Not Authenticated"
      }
    });
  }
  let user = req.user;
  if (isNaN(parseFloat(req.body.bet)))
  {
    return res.status(500).json({
      'err': {
        code: 420,
        message: "Invalid Bet Amount"
      }
    });
  }
  let bet = Math.round(req.body.bet * 1e8);

  bitGo.wallets().get({
    type: 'bitcoin',
    id: user.wallet
  }, function(err, wallet) {
    if (err) {
      console.log(err);
      return res.status(500).json({
        'err': {
          message: "Error while fetching wallet balance, Internal error"
        }
      });
    }
    let finalBalance = wallet.balance();
    console.log('Wallet balance is: ' + finalBalance + ' Satoshis');
    finalBalance = finalBalance - parseInt(user.bitsLost)
    if (finalBalance < 0)
    {
      return res.status(500).json({
        'err': {
          message: "Enough credits not available !!"
        }
      });
    }
    let result = slotMachine.processBet();
    let bitsLost = parseInt(user.bitsLost);
    if (result.win > 0)
    {
      bitsLost -=  result.win * bet;
    }
    else
    {
      bitsLost += bet
    }

    User.update({
      username: req.user.username
    }, {
      bitsLost: bitsLost.toString()
    }, function(err, rawResponse) {
      if (err) {
        return res.status(500).json({
          'err': {
            message: "Error updating Account ! Internal Error !!"
          }
        });
      }
      req.user.bitsLost = bitsLost.toString();
      return res.status(200).json({
        status: true,
        data: {
          win: result.win,
          spins : result.spins
        }
      });
    })
  });
});


router.post('/sendfunds', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(500).json({
      'err': {
        code: 420,
        message: "Error while withdraw request, User Not Authenticated"
      }
    });
  }
  if (isNaN(parseFloat(req.body.amount)) || req.body.amount == 0)
  {
    return res.status(500).json({
      'err': {
        code: 420,
        message: "Invalid withdraw amount"
      }
    });
  }

  const amount = Math.round(req.body.amount * 1e8);
  const address = req.body.address;
  const user = req.user;

  bitGo.wallets().get({
    type: 'bitcoin',
    id: user.wallet
  }, function(err, wallet) {
    if (err) {
      console.log(err);
      return res.status(500).json({
        'err': {
          message: "Error while fetching wallet, Internal error"
        }
      });
    }
    let finalBalance = wallet.balance();
    console.log('Wallet balance is: ' + finalBalance + ' Satoshis');
    finalBalance = finalBalance - parseInt(user.bitsLost)
    if (amount > finalBalance)
    {
      return res.status(500).json({
        'err': {
          message: "Enough credits not available for withdraw !!"
        }
      });
    }
    wallet.sendCoins({
      address: address,
      amount: amount,
      walletPassphrase: req.user.username
    }, function callback(err, result) {
      if (err) {
        console.log(err);
        return res.status(500).json({
          'err': {
            message: "Error occurred while sending bitcoins" + JSON.stringify(err)
          }
        });
      }
      console.log(result);
      res.status(200).json({
        status: true,
        data: 'Successful Transfer !!'
      });

    });
  });

});

/*
router.post('/changename', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(500).json({
      'err': {
        code: 420,
        message: "Error while fetching user info, User Not Authenticated"
      }
    });
  }
  User.update({
    username: req.user.username
  }, {
    name: req.body.name
  }, function(err, rawResponse) {
    if (err) {
      return res.status(500).json({
        err: err
      });
    }
    req.user.name = req.body.name;
    return res.status(200).json({
      status: true,
      data: {
        name: req.user.name
      }
    });
  })
});

router.post('/changephone', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(500).json({
      'err': {
        code: 420,
        message: "Error while fetching user info, User Not Authenticated"
      }
    });
  }
  User.update({
    username: req.user.username
  }, {
    phone: req.body.phone
  }, function(err, rawResponse) {
    if (err) {
      return res.status(500).json({
        err: err
      });
    }
    req.user.phone = req.body.phone;
    return res.status(200).json({
      status: true,
      data: {
        name: req.user.phone
      }
    });
  })
});

router.post('/changepass', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(500).json({
      'err': {
        code: 420,
        message: "Error while fetching user info, User Not Authenticated"
      }
    });
  }
  let newPass = req.body.newPass;
  User.findByUsername(req.user.username).then(function(sanitizedUser) {
    if (sanitizedUser) {
      sanitizedUser.setPassword(newPass, function() {
        sanitizedUser.save();
        res.status(200).json({
          message: 'password reset successful'
        });
      });
    } else {
      res.status(500).json({
        message: 'This user does not exist'
      });
    }
  }, function(err) {
    res.status(500).json({
      message: 'Internal Error resetting password'
    });
  })
});


*/

module.exports = router;