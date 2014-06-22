
/* Prevent native scrolling behaviour on input for type="number" inputs
and restricts keybord entry to numeric characters only. */
mod.directive('inputNumber', function () {
  return {
    restrict: 'A',
    link : function (scope, $element) {
      $element.on('focus', function () {
        angular.element(this).on('mousewheel', scope.preventScrolling);
      });
      $element.on('blur', function () {
        angular.element(this).off('mousewheel', scope.preventScrolling);
      });

      // Restrict numeric characters
      $element.on('keypress', scope.restrictNumeric);

      scope.preventScrolling = function (e) {
        e.preventDefault();
      };

      scope.restrictNumeric = function(e) {
        var input;

        if (e.metaKey || e.ctrlKey) {
          return true;
        }
        if (e.which === 32) {
          return false;
        }
        if (e.which === 0) {
          return true;
        }
        if (e.which < 33) {
          return true;
        }
        input = String.fromCharCode(e.which);
        return !!/[\d\s]/.test(input);
      };
    }
  };
});

mod.directive('instantCheckoutForm', function () {
  return {
    priority: 'A',
    link: function ($scope, $element, attrs) {
      $scope.formScope = {};
      var scope = $scope.formScope;

      scope.src = '/img/InstantCheckout/';
      scope.tooltip = angular.element(document.querySelector('#co-tooltip'));
      scope.tooltipVisible = false;
      scope.hasError = false;

      // When a co-error attribut is added to the input, we show the corresponding error message.
      attrs.$observe('coError', function (val) {
        var msg = val;
        if(msg && msg !== '') {
          //$element.next() is the div after the input used to display error/succes messages
          $element.parent().find('.co-validate').html(msg);
          scope.showError();
        }
      });

      // Show information toolip (if any) on focus.
      $element.on('focus', function () {
        scope.prepareTooltip();
        scope.hasError = false;
      });

      // Form validation on blur; hiding tooltip
      $element.on('blur', function () {

        scope.hideTooltip();

        // Test the field
        if (attrs.required) {
          scope.testRequired();
        }
        if (attrs.type === 'number') {
          scope.testNumber();
        }
        if(attrs.type === 'email') {
          scope.testEmail();
        }

        // Validate
        if (scope.hasError === true) {
          scope.showError();
        } else {
          var trimVal = $element.val().replace(/^\s+|\s+$/g, ""),
              emptyField = (trimVal === '');

          scope.removeError();
          if(!emptyField) {
            scope.showValid();
          }
        }
      });

      scope.testNumber = function () {
        var valIsNumber = $element.val().match(/^\d+$/);
        if (!valIsNumber) {
          scope.hasError = true;
        }
      };
      scope.testRequired = function () {
        var trimVal = $element.val().replace(/^\s+|\s+$/g, ""),
            emptyField = (trimVal === '');

        if(emptyField) {
          scope.hasError = true;
        }
      };
      scope.testEmail = function () {
        var format, val;
        format = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\ ".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA -Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        val = $element.val();

        if (!format.test(val)) {
          scope.hasError = true;
        }
      };

      scope.showError = function () {
        $element.addClass('co-error').removeClass('co-valid');
      };
      scope.removeError = function () {
        $element.removeClass('co-error');
      };
      scope.showValid = function () {
        $element.addClass('co-valid').removeClass('co-error');
        // Remove any error message
        $element.parent().find('.co-validate').html('');
      };

      scope.prepareTooltip = function () {
        var tooltipMessage = angular.element(document.querySelector('#co-tooltip .co-text-container')),
            tooltipImg = angular.element (document.querySelector('#co-tooltip .co-image-container'));

        if (attrs.coInfo || attrs.coImg) {
          tooltipMessage.html(attrs.coInfo);
          tooltipImg.attr('src', (attrs.coImg) ? scope.src + attrs.coImg : '');

          if (attrs.coInsertAfter) {
            angular.element (document.querySelector(attrs.coInsertAfter)).after(scope.tooltip);
          } else {
            $element.after(scope.tooltip);
          }
          scope.tooltip.removeClass('ng-hide');
          scope.tooltipVisible = true;
        }
      };
      scope.hideTooltip = function () {
        if (scope.tooltipVisible) {
          scope.tooltip.addClass('ng-hide');
          scope.tooltipVisible = false;
        }
      };
    }
  };
});


