var _ = require('lodash');
var tabLibRenderer = require('./taglib-renderer');

module.exports = function(express) {
  // TODO express for engine?
  var tagLibOpts = {};

  // return the middleware for usage
  return function(req, res, next) {
    // save the current render method
    var _render = res.render;

    // override the render method
    res.render = function(view, opts, callback) {
      // create resRenderOpts
      var resRenderOpts = {
        req: req,
        res: res
      };

      // merge with tagLibOpts and renderOpts
      _.merge(resRenderOpts, tagLibOpts, opts);

      // Define RenderCallback
      var tagLibRenderCallback = function(err, html) {
        // Start the taglib render process here
        tabLibRenderer(html, resRenderOpts, function(renderError, html) {
          // execute the callback if it exists
          if(callback) {
            callback(err, html);
          } else {
            // if we got an error - we have to handle itself
            // else send the html string
            if(renderError) {
              req.next(renderError);
            } else {
              res.send(html);
            }
          }
        });
      };

      // call the original render method
      _render.call(this, view, opts, callback);
    };

    // call next middleware handler
    next();
  };
};
