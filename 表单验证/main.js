;(function( win ){

	var regItem = {
		//是否为必读;
		required : function( field ){
			var value = field.value;

			//判断是不是单选框，多选框的可能;
			if( field.type === "checkbox" || field.type === "radio" ){
				return field.checked === true;
			}
			return value != null && value != "";
		},
		maxLength : function( field,len ){
			var value = field.value;
			return value.length <= len;
		},
		minLength : function( field,len ){
			var value = field.value;
			return value.length >= len;
		}
	}


	function Mvalidate( form ){
		this.form = document.forms[form];
		this.options = [];
	};

	Mvalidate.prototype = {
		add : function( opts ){
			var _this = this;
			_this.options.push( opts );
			return _this;
		},
		valid : function(){
			var _this = this;
			for( var i=0;i<_this.options.length;i++ ){
				
				if( validate.call(_this,_this.options[i]) === false ){
					return false;
				}
			}
			return true;
		}
	}

	win.Mvalidate = Mvalidate;


	function validate( opts ){
		var el = this.form[opts.name];

		if( opts.rules ){
			for( var i=0;i<opts.rules.length;i++ ){
				var valiReg = true, valiStr = true;
				if( typeof opts.rules[i] != "string" ){
					valiReg = validateReg( el,opts.rules[i] );
				}else{
					valiStr = validateString( el,opts.rules[i] );
				}

				if( !valiReg || !valiStr ){
					alertMessage.call(this,opts,opts.message[i]);

					return false;
				}

			}
		}else if(opts.sameTo){
			var selfValue = el.value;
			var targetValue = this.form[opts.sameTo].value;
			if( selfValue != targetValue ){
				alertMessage.call(this,opts,opts.message[0]);
				return false;
			}
		}
		return true;
	}

	function alertMessage( opts,message ){
		var errorEle = document.createElement("div");
		errorEle.className = 'errorMessage';
		var nodeEles = document.getElementsByClassName( 'errorMessage' );

		if( nodeEles.length === 0 ){
			document.body.appendChild( errorEle );
		}
		var errEl = document.getElementsByClassName( 'errorMessage' )[0];
		errEl.innerHTML = message;
		errorMessageStyle(errEl);
		if(opts.callback){
            opts.callback(this.form[opts.name],errEl);
        }
	}

	function errorMessageStyle( errEl ){
		errEl.style.display = 'block';
		  if(!/animated fadeOut/.test(errEl.className)){
            errEl.className += ' animated fadeOut';
        }

        errEl.addEventListener('webkitAnimationEnd',endAnime);
        errEl.addEventListener('animationend',endAnime);
        function endAnime(){
            removeClass(errEl,'animated');
            removeClass(errEl,'fadeOut');
            errEl.style.display = 'none';
        }
	}

	function removeClass( ele,oldClass ){
		var classNames = ele.className.trim();
        classNames = classNames.replace(/\s+/g,' ');
		var classNameArr = classNames.split(' ');
		for(var i=0;i<classNameArr.length;i++){
			if( oldClass === classNameArr[i] ){
				classNameArr.splice(i,1)
			}
		}
		
		return ele.className = classNameArr.join(' ');
	}

	function cssStyle(){
        var cssStyle = document.createElement('style');
        cssStyle.type = 'text/css';
        cssStyle.innerHTML = '.errorMessage{position:fixed;top:50%;right:0;left:0;display:block;margin:auto;padding:5%;width:60%;-webkit-border-radius:4px;background-color:rgba(0,0,0,.7);color:#fff;text-align:center;font-size:16px;transform:translateY(-50%);-ms-transform:translateY(-50%)}.animated{-webkit-animation-duration:2s;animation-duration:2s;-webkit-animation-fill-mode:both;animation-fill-mode:both}@-webkit-keyframes fadeOut{50%{opacity:1}to{opacity:0}}@keyframes fadeOut{50%{opacity:1}to{opacity:0}}.fadeOut{-webkit-animation-name:fadeOut;animation-name:fadeOut}';

        document.head.appendChild(cssStyle);
    }
    cssStyle();



	//判断正则
	function validateReg( el,rule ){
		return rule.test( el.value );
	}

	function validateString( el,rule ){
		var result;
		var ruleArr = /(\w+)/ig.exec(rule);

		//不带参数的处理结果;
		if( ruleArr[1] === ruleArr.input ){
			result = regItem[ruleArr.input](el);
		}else{
			ruleArr = /(\w+)\((\d+)/ig.exec(rule);
			result = regItem[ruleArr[1]](el,ruleArr[2]);
		}

		return result;
	}
})( window )