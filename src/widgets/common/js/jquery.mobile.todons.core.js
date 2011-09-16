/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Kalyan Kondapally <kalyan.kondapally@intel.com>
 */

jQuery.extend(jQuery.mobile, {
    todons: {
      Point: function (x, y) {
          var X = isNaN(x) ? 0 : x;
          var Y = isNaN(y) ? 0 : y;

          this.add = function (Point) {
              this.setX(X + Point.x());
              this.setY(Y + Point.y());
              return this;
          }

          this.subtract = function (Point) {
              this.setX(X - Point.x());
              this.setY(Y - Point.y());
              return this;
          }

          this.multiply = function (Point) {
              this.setX(Math.round(X * Point.x()));
              this.setY(Math.round(Y * Point.y()));
              return this;
          }

          this.divide = function (Point) {
              this.setX(Math.round(X / Point.x()));
              this.setY(Math.round(Y / Point.y()));
              return this;
          }

          this.isNull = function () {
              return (X === 0 && Y === 0);
          }

          this.x = function () {
              return X;
          }

          this.setX = function (val) {
              isNaN(val) ? X = 0 : X = val;
          }

          this.y = function () {
              return Y;
          }

          this.setY = function (val) {
              isNaN(val) ? Y = 0 : Y = val;
          }

          this.setNewPoint = function (point) {
              this.setX(point.x());
              this.setY(point.y());
          }

          this.isEqualTo = function (point) {
              return (X === point.x() && Y === point.y());
          }
      },

      Rect: function (left,top,width,height) {
          var Left = left;
          var Top = top;
          var Right = Left+width;
          var Bottom = Top+height;

          this.setRect = function(varL,varR,varT,varB) {
              this.setLeft(varL);
              this.setRight(varR);
              this.setTop(varT);
              this.setBottom(varB);
          }

          this.right = function () {
              return Right;
          }

          this.setRight = function (val) {
              Right = val;
          }

          this.top = function () {
              return Top;
          }

          this.setTop = function (val) {
              Top = val;
          }

          this.bottom = function () {
              return Bottom;
          }

          this.setBottom = function (val) {
              Bottom = val;
          }

          this.left = function () {
              return Left;
          }

          this.setLeft = function (val) {
              Left = val;
          }

          this.moveTop = function(valY) {
              var h = this.height();
              Top = valY;
              Bottom = Top + h;
          }

          this.isNull = function () {
              return Right === Left && Bottom === Top;
          }

          this.isValid = function () {
              return Left <= Right && Top <= Bottom;
          }

          this.isEmpty = function () {
              return Left > Right || Top > Bottom;
          }

          this.contains = function (valX,valY) {
              if (this.containsX(valX) && this.containsY(valY))
                  return true;
              return false;
          }

          this.width = function () {
              return Right - Left;
          }

          this.height = function () {
              return Bottom - Top;
          }

          this.containsX = function(val) {
              var l = Left,
              r = Right;
              if (Right<Left) {
                  l = Right;
                  r = Left;
              }
              if (l > val || r < val)
                  return false;
          return true;
          }

          this.containsY = function(val) {
              var t = Top,
              b = Bottom;
              if (Bottom<Top) {
                  t = Bottom;
                  b = Top;
              }
              if (t > val || b < val)
                  return false;
            return true;
          }
      },

      disableSelection: function (element) {
          return $(element).each(function () {
              jQuery(element).css('-webkit-user-select', 'none');
          });
      },

      enableSelection: function (element, value) {
          return $(element).each(function () {
              val = value == "text" ? val = 'text' : val = 'auto';
              jQuery(element).css('-webkit-user-select', val);
          });
      },

      /**
       * Set the height of the content area to fill the space between a
       * page's header and footer
       */
      fillPageWithContentArea: function (page) {
          var $page = $(page);
          var $content = $page.children(".ui-content");
          var hh = $page.children(".ui-header").outerHeight(); hh = hh ? hh : 0;
          var fh = $page.children(".ui-footer").outerHeight(); fh = fh ? fh : 0;
          var pt = parseFloat($content.css("padding-top"));
          var pb = parseFloat($content.css("padding-bottom"));
          var wh = window.innerHeight;
          var height = wh - (hh + fh) - (pt + pb);
          $content.height(height);
      },

      /**
       * Read data- options from the element and update a dictionary of
       * options when possible.
       */
       parseOptions: function (widget) {
          var optionKeys = _.keys(widget.options);
          for (key in optionKeys) {
              opt = optionKeys[key];
              dataValue = widget.element.attr("data-" + opt);
              defaultValue = widget.options[opt];

              if (dataValue !== undefined)
                  if (dataValue == "true" ||
                      dataValue == "yes" ||
                      dataValue == "on") dataValue = true;
                  else
                  if (dataValue == "false" ||
                      dataValue == "no" ||
                      dataValue == "off") dataValue = false;
                  else
                  if (parseInt(dataValue) != NaN) dataValue = parseInt(dataValue);

              widget._setOption(opt, dataValue === undefined ? defaultValue : dataValue);
          }
      }
    }
});
