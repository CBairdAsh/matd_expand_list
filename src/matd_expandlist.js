/*
matd expanded list

Javascript / jQuery plugin to create a Material Design expanded list

Created: 5/17/2019
Author: Chris Ash

*/
;(function($) {

	$.matd_expandlist = {
		id: '',
        list:[],
        templateString: '<div id="mtd_${id}" class="ex_container flex-base justify-center"><div class="ex_inner">${rows}</div></div>',
        templateRowString: '<div class="ex_row_frame" aria-expanded="false"><div class="ex_hdr_cont flex-base justify-center flex-align-items-cntr" tabindex="0" role="button" aria-expanded="false"><div class="ex_headings flex-base"><p class="marg_z_block typograph ex_head">${heading}</p><p class="marg_z_block typograph ex_sec_head">${secondary_heading}</p></div><div class="ex_svg_cont" tabindex="-1" role="button" aria-hidden="true"><span class="svg_ctrl"><svg class="svg_style" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path><path fill="none" d="M0 0h24v24H0z"></path></svg></span><span class="svg_frame"></span></div></div><div class="ex_det_con" aria-hidden="true"><div class="flex-base"><div class="w_100p"><div class="flex-base det_pad"><p class="marg_z_block typograph">${details}</p></div></div></div></div></div>',
        existing_id: '',
        orig_input: []
	};

	  // default values to reset globals between each run. This is in case of multiple uses on a single page.
  var _def = {
    id: '',
    list:[],
    templateString: '<div id="mtd_${id}" class="ex_container flex-base justify-center"><div class="ex_inner">${rows}</div></div>',
    templateRowString: '<div class="ex_row_frame" aria-expanded="false"><div class="ex_hdr_cont flex-base justify-center flex-align-items-cntr" tabindex="0" role="button" aria-expanded="false"><div class="ex_headings flex-base"><p class="marg_z_block typograph ex_head">${heading}</p><p class="marg_z_block typograph ex_sec_head">${secondary_heading}</p></div><div class="ex_svg_cont" tabindex="-1" role="button" aria-hidden="true"><span class="svg_ctrl"><svg class="svg_style" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"></path><path fill="none" d="M0 0h24v24H0z"></path></svg></span><span class="svg_frame"></span></div></div><div class="ex_det_con" aria-hidden="true"><div class="flex-base"><div class="w_100p"><div class="flex-base det_pad"><p class="marg_z_block typograph">${details}</p></div></div></div></div></div>',
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
                var _out = methods.checkAPI($.matd_expandlist, _def, API);
				$.matd_expandlist = _out.local;
				API = _out.API;

                // don't do anything if no params are set
				if ( _param ) {
					_out = methods.checkAPI($.matd_expandlist, _param, API);
					$.matd_expandlist = _out.local;
					API = _out.API;
				}

				// check for blank id.
				if ( $.matd_expandlist.id == '' ) {
					if ( $(this).attr('id') != '' ) {
						$.matd_expandlist.id = $(this).attr('id');
					} else {
						methods.counter++;
						var _rand = 'r' + (new Date().getTime()) + 'r' + methods.counter;
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
			console.log('[debug]',$.matd_expandlist);
		}
	};

	var methods = {
		counter: 1,
		types: ['checkbox'],
		startup: function() {
            if ($.matd_expandlist.templateString != '' ) {
                if ( $('#mtd_'+$.matd_expandlist.id).length == 0 ) {
                        // see if we're absorbing an existing input tag
                       // methods.check_target_type();

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
					 var _rand = 'r' + (new Date().getTime()) + 'r' + methods.counter
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
            $.matd_expandlist.disp_rows = [];
            $.matd_expandlist.rows = '';
            
            var _data = $.matd_expandlist.list;
            var _proc_data = function(_a_list) {
                _a_list.forEach(function(_an_elm) {
                    var _add_missing = function(_obj, _prop, _def) {
                        if ( _obj.hasOwnProperty(_prop) == false ) _obj[_prop] = _def;
                        return _obj;
                    }
                    _an_elm = _add_missing(_an_elm, 'secondary_heading','');
                    _an_elm = _add_missing(_an_elm, 'override_css','');
                    _an_elm = _add_missing(_an_elm, 'details','');

                    if (typeof _an_elm.details == 'object') {
                        var _temp_level = _proc_data(_an_elm.details);
                        var _inner = {
                            "id": "sub_" + $.matd_expandlist.id,
                            "rows": ""
                        }
                        _temp_level.forEach(function(_an_elm) {
                            _inner.rows += _an_elm.row_html;
                        });
                        _an_elm.details = methods.prp_ct($.matd_expandlist.templateString, _inner);
                    }

                    _an_elm.row_html = methods.prp_ct($.matd_expandlist.templateRowString, _an_elm);
                });

                return _a_list;              
            }
            var _f_data = _proc_data(_data);

            _f_data.forEach(function(_an_elm) {
                $.matd_expandlist.rows += _an_elm.row_html;
            });

            // this covers the base swaps
			var _html = methods.prp_ct($.matd_expandlist.templateString, $.matd_expandlist);
			
      return _html;
    },
    place_ctrl: function(_html) {
      if ( $('#mtd_'+$.matd_expandlist.id).length == 0 ) {
				if ( $.matd_expandlist.existing_id != '' ) {
					$('#'+$.matd_expandlist.id).prepend(_html);
					var _class = $('#mtd_'+$.matd_expandlist.id).attr('class');
					$('#'+$.matd_expandlist.existing_id).clone(true, true).attr('id', $.matd_expandlist.existing_id+'new').addClass(_class).attr('tabIndex','0').attr('autocomplete','on').attr('aria-invalid','false').attr('aria-required','false').insertBefore('#mtd_'+$.matd_expandlist.id);
					$('#'+$.matd_expandlist.existing_id).remove();
					$('#mtd_'+$.matd_expandlist.id).remove();
					$('#'+$.matd_expandlist.existing_id+'new').attr('id',$.matd_expandlist.existing_id);
				} else {
					$('#'+$.matd_expandlist.id).html(_html);
				}
      } else {
        console.log('[matd_expandlist] id: mtd_'+$.matd_expandlist.id+' is already in place in the DOM. Control not added.');
      }
    },
    assign_event: function() {
      var _what = $('#mtd_'+$.matd_expandlist.id + ' .ex_hdr_cont');
			if ( $.matd_expandlist.existing_id != '' ) {
				_what = $('#'+$.matd_expandlist.existing_id + ' .ex_hdr_cont');
			}

			var _loc_what = $(_what);
			_loc_what.on('click',function(evt) {

                var _open_close = function(_a_target) {
                    var _swap_a_expand = function(_a_elem) {
                        if ( _a_elem.attr('aria-expanded') == 'true') {
                            _a_elem.attr('aria-expanded','false');
                            _a_elem.removeClass('active');
                        } else {
                            _a_elem.attr('aria-expanded','true');
                            _a_elem.addClass('active');
                        }
                    }
                    var _set_one = function(_a_elem) {
                        _a_elem.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function() {
                            if ( _this.attr('aria-hidden') == 'true') {
                                _this.attr('aria-hidden','false');
                            } else {
                                _this.attr('aria-hidden','true');
                            }
                        });                    
                    } 
    
                    var _set_det = function(_a_elem) {
                        if ( _a_elem.attr('aria-expanded') == 'true') {
                            _a_elem.find('.ex_det_con').attr('style','min-height: 0px; height: 0px; transition-duration: 224ms;');
                        } else {
                            _a_elem.find('.ex_det_con').attr('style','min-height: 0px; height: '+_a_elem.find('.ex_det_con > div').height()+'px; transition-duration: 224ms;');
                        }
                    }

                    _set_det(_a_target);
                    _swap_a_expand(_a_target);
                    _swap_a_expand(_a_target.find('.ex_hdr_cont'));  
                    _set_one(_a_target.find('.ex_det_con'));
                }

                
                var _this = $(this).parent('.ex_row_frame');
                if ( _this.hasClass('active') == false ) {
                    // close previous
                    _open_close( $(this).parents('.ex_inner').find('div.ex_row_frame[aria-expanded=true]') );
                }
                
                // open selected
                _open_close( _this );
				methods.trigger_evt($.matd_expandlist.id,'row_clicked',_this,evt);
            });
    },
    trigger_evt: function(_who,_trigger, evt) {
			$('#'+_who).trigger(_trigger,evt);
    },
    checkAPI: function(_local, _param, API) {
        var _loc_out = {};

        for (var _idx in _local) {
            // absorb overrides
            _loc_out[_idx] = _local[_idx];

            if( _param.hasOwnProperty(_idx) ) {
                // check if where we're putting the new data is an object / array
                if ( typeof _loc_out[_idx] == "object" ) {

                    // checking inbound data is object/array. If so, replace like with like
                    if ( Array.isArray(_loc_out[_idx]) && Array.isArray(_param[_idx]) ) {
                         _loc_out[_idx] = [];
                         var _inner_from = _param[_idx],
                            _inner_to = _loc_out[_idx];

                         for ( var itm=0; itm < _param[_idx].length; itm++ ) {
                             var _row = _inner_from[itm];
                             _inner_to.push( _row );
                         }
                    } else if ( ( typeof _param[_idx] == "string" ) && ( Array.isArray(_loc_out[_idx]) ) ) {
                        _loc_out[_idx].push( _param[_idx] );
                    } else {
                        _loc_out[_idx] = _param[_idx];
                    }

                } else {
                    _loc_out[_idx] = _param[_idx];
                }
            }
        }
        // check API for overrides. This should be rare
        methods.each( API, function(_idx, _val) {
            // absorb overrides
            if ( _param[_idx] != null ) {
                API[_idx] = _param[_idx];
            }
        });
        return { "local": _loc_out, "API": API };
    },
    prp_ct: function(_template, _data_obj, _alt_obj) {
        var _nmeObj = /\${([^\}]+)}/i;

        var _loop = true,
            _fallback_counter = 0;

        if ( _alt_obj ) {
            _data_obj = _alt_obj;
        }
        try {
            do {
                var reNme = _nmeObj.exec(_template);
                if (reNme != null && reNme.length > 1) {
                    var _tag = reNme[1];

                    var _fnc = new Function("_tmpl","_newval","return _tmpl.replace(/\\${"+_tag+"}/ig, _newval);");
                    _template = _fnc(_template, _data_obj[_tag]);
                    _fallback_counter++;                    
                } else {
                    _fallback_counter = 10;
                }
            } while (  _fallback_counter < 10 );
        } catch (e) {
            console.log('[prp_ct] error processing template = '+e);
        }
        return _template;
    },    
    each: function( obj, callback ) {
        var length, i = 0;

        if ( methods.isArrayLike( obj ) ) {
            length = obj.length;
            for ( ; i < length; i++ ) {
                if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
                    break;
                }
            }
        } else {
            for ( i in obj ) {
                if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
                    break;
                }
            }
        }

        return obj;
    },
    type: function( obj ) {
        if ( obj == null ) {
            return obj + "";
        }

        // Support: Android<4.0, iOS<6 (functionish RegExp) because you don't know who has what out there
        return typeof obj === "object" || typeof obj === "function" ?
            methods.class2type[ methods.class2type.toString.call( obj ) ] || "object" :
            typeof obj;
    },
    class2type: {},
    isWindow: function( obj ) {
        return obj != null && obj === obj.window;
    },
    isArrayLike: function( obj ) {
        // from jQuery 2.2.5

        // Support: iOS 8.2 (not reproducible in simulator)
        // `in` check used to prevent JIT error (gh-2145)
        var length = !!obj && "length" in obj && obj.length,
            type = methods.type( obj );

        if ( type === "function" || methods.isWindow( obj ) ) {
            return false;
        }

        return type === "array" || length === 0 ||
            typeof length === "number" && length > 0 && ( length - 1 ) in obj;
    }        

    }

    // populate class2type
    var _names = "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " );
    var _nmMax = _names.length;
    for ( var i=0; i < _nmMax; i++ ){
        var _entry = _names[i];
        methods.class2type[ "[object " + _entry + "]" ] = _entry.toLowerCase();
    }    
})(jQuery);
