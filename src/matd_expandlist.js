/*
matd expanded list

Javascript / jQuery plugin to create a Material Design expanded list

Created: 5/17/2019
Author: Chris Ash

*/
;(function($) {

	$.matd_expandlist = {
		id: '',
		toggled: true,
		color_css_class: '',
		color_css_style : '',
		templateString: '<span class="swt_container"><span class="swt_frame" data-flipped="${on_off}"><span class="swt_inner"><span class="swt_dot ${color_css_class}" data-flipped="${on_off}" style="${color_style}"></span><input id="i2usw_${id}" tabindex="0" class="swt_chk" type="checkbox" value="checkedB" checked=""></span><span class="swt_space"></span></span><span class="swt_bar"></span></span>',
        existing_id: '',
        orig_input: []
	};

	  // default values to reset globals between each run. This is in case of multiple uses on a single page.
  var _def = {
		id: '',
		toggled: true,
		color_css_class: '',
		color_css_style : '',
		templateString: '<span class="swt_container"><span class="swt_frame" data-flipped="${on_off}"><span class="swt_inner"><span class="swt_dot ${color_css_class}" data-flipped="${on_off}" style="${color_style}"></span><input id="i2usw_${id}" tabindex="0" class="swt_chk" type="checkbox" value="checkedB" checked=""></span><span class="swt_space"></span></span><span class="swt_bar"></span></span>',
        existing_id: '',
        orig_input: []
	}

		$.extend($.fn, {
		matd_expandlist: function() {
			var _param = arguments[0],
				_args = [].slice.call(arguments).slice(1);

			// API check first
			if ( API[_param] ) {
				var _fn = API[_param];
				return _fn.apply(this, _args);
			} else {
                // reset to default
                var _out = I2U21.checkAPI($.matd_expandlist, _def, API);
				$.matd_expandlist = _out.local;
				API = _out.API;

                // don't do anything if no params are set
				if ( _param ) {
					_out = I2U21.checkAPI($.matd_expandlist, _param, API);
					$.matd_expandlist = _out.local;
					API = _out.API;
				}

				// check for blank id.
				if ( $.matd_expandlist.id == '' ) {
					if ( $(this).attr('id') != '' ) {
						$.matd_expandlist.id = $(this).attr('id');
					} else {
						methods.counter++;
						var _rand = I2U21.MD5( I2U21.MD5(new Date() + '') ) + methods.counter;
						$.matd_expandlist.id = _rand;
						$(this).attr('id',_rand);
					}
				}

				// kick off launch
				methods.startup.apply(this);

			}
		}
	});

	var API = {
		debug: function() {
			console.log($.matd_expandlist);
		}
	};

	var methods = {
		counter: 1,
		types: ['checkbox'],
		startup: function() {
            if ($.matd_expandlist.templateString != '' ) {
                if ( $('#i2usw_'+$.matd_expandlist.id).length == 0 ) {
                        // see if we're absorbing an existing input tag
                        methods.check_target_type();

                        // fire init event
                        methods.trigger_evt($.matd_expandlist.id,'init','');

                        methods.place_ctrl( methods.make_html() );

                        methods.assign_event();

                        // fire done event
                        methods.trigger_evt($.matd_expandlist.id,'started','');
                } else {
                    console.log('[matd_expandlist] id: '+$.matd_expandlist.id+' is already in place in the DOM. Control not added.');
                }
            } else {
                console.log('[matd_expandlist] Control Template may not be blank');
            }
		},
		check_target_type: function() {
			var _elem = $('#'+$.matd_expandlist.id);
			if ( _elem[0].nodeName.toLowerCase() == 'input') {
				$.matd_expandlist.preserve_input = true;
				$.matd_expandlist.existing_id = ''+$.matd_expandlist.id;

				// gather what attribs the tag has for later.
				for ( var i=0; i < _elem[0].attributes.length; i++ ) {
					var _param = _elem[0].attributes[i];
					$.matd_expandlist.orig_input.push(_param);
				}

				// move the mark of the target up to parent.
				var _prt = _elem.parent();
				if ( ( _prt.attr('id') != '' ) && ( _prt.attr('id') ) ) {
					$.matd_expandlist.id = _prt.attr('id');
				} else {
					methods.counter++;
					// parent has no id, generate one then use it.
					 var _rand = I2U21.MD5( I2U21.MD5(new Date() + '') ) + methods.counter;
					 _prt.attr('id',_rand);
					 $.matd_expandlist.id = _rand;
				}
			}
        },
        add_hash_hex: function(_val) {
            var _missing_hash = ( /^[a-f\d]{2}[a-f\d]{2}[a-f\d]{2}$/i.exec(_val) || /^[a-f\d]{3}$/i.exec(_val) ) == null ? false : true;
            if ( _missing_hash ) {
              _val = '#' + _val;
            }
            return _val;
          },        
    make_html: function() {
            $.matd_expandlist.on_off = ( $.matd_expandlist.toggled ? "true" : "false" );

            // make sure color style has a leading # if a hex
            if ( $.matd_expandlist.color_css_style.toLowerCase().indexOf('rgb') == -1 ) {
                $.matd_expandlist.color_css_style = methods.add_hash_hex( $.matd_expandlist.color_css_style);
            } 
            
            $.matd_expandlist.color_style = ( ( $.matd_expandlist.color_css_style != '' ) ? 'color: '+$.matd_expandlist.color_css_style+';' : '' );

      // this covers the base swaps
			var _html = I2U21.prp_ct($.matd_expandlist.templateString, $.matd_expandlist);
			
      return _html;
    },
    place_ctrl: function(_html) {
      if ( $('#i2usw_'+$.matd_expandlist.id).length == 0 ) {
				if ( $.matd_expandlist.existing_id != '' ) {
					$('#'+$.matd_expandlist.id).prepend(_html);
					var _class = $('#i2usw_'+$.matd_expandlist.id).attr('class');
					$('#'+$.matd_expandlist.existing_id).clone(true, true).attr('id', $.matd_expandlist.existing_id+'new').addClass(_class).attr('tabIndex','0').attr('autocomplete','on').attr('aria-invalid','false').attr('aria-required','false').insertBefore('#i2usw_'+$.matd_expandlist.id);
					$('#'+$.matd_expandlist.existing_id).remove();
					$('#i2usw_'+$.matd_expandlist.id).remove();
					$('#'+$.matd_expandlist.existing_id+'new').attr('id',$.matd_expandlist.existing_id);
				} else {
					$('#'+$.matd_expandlist.id).html(_html);
				}
      } else {
        console.log('[matd_expandlist] id: i2usw_'+$.matd_expandlist.id+' is already in place in the DOM. Control not added.');
      }
    },
    assign_event: function() {
      var _what = $('#i2usw_'+$.matd_expandlist.id);
			if ( $.matd_expandlist.existing_id != '' ) {
				_what = $('#'+$.matd_expandlist.existing_id);
			}

			var _loc_what = $(_what);
			_loc_what.on('click',function(evt) {
                var _this = $(this);
                var _top = _this.parents('.swt_container');
                var _frame = _top.find('.swt_frame');
                var _dot = _top.find('.swt_dot');                
                var _df = ( _frame.attr('data-flipped') == 'false' ) ? 'true' : 'false';
                
                _frame.attr('data-flipped',_df);
                _dot.attr('data-flipped',_df);
				methods.trigger_evt($.matd_expandlist.id,'flipped',_this,evt);
			});
    },
    trigger_evt: function(_who,_trigger, evt) {
			$('#'+_who).trigger(_trigger,evt);
		}

	}
})(jQuery);
