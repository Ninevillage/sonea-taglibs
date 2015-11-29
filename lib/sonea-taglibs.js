var _ = require('lodash');
var tabsLibRenderer = require('./taglibs-renderer');

module.exports = function(express, config) {
  // TODO express for engine?
  var tagsLibOpts = {};
  _.merge(tagsLibOpts, config)

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

      // merge with tagsLibOpts and renderOpts
      _.merge(resRenderOpts, tagsLibOpts, opts);

      // Define RenderCallback
      var tagLibRenderCallback = function(err, html) {
        // Start the taglib render process here
        tabsLibRenderer(html, resRenderOpts,
          function(renderError, html) {
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
