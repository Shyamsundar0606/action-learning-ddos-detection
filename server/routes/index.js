const fs = require('fs');

module.exports = (app) => {
  fs.readdirSync(__dirname).forEach( (dir) => {
    if(!dir.endsWith('.js'))
      fs.readdirSync(__dirname + `/${dir}`).forEach((file) => {
        require(`./${dir}/${file.substr(0, file.indexOf('.'))}`)(app);
      });
  })
};