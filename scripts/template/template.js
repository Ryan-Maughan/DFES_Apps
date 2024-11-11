
	 /* Application */
	
	$(document).ready(function(){
		
		if(window.location.hash){
			showTab(window.location.hash.substring(1));
		} else {
			showTab('about');
		}
		
	});
	 
	function showTab(id){
		
		closeSidebar();
		
		window.history.pushState(null, null, '#' + id);
		
		var a = $('a[href="#' + id + '"]', '#sidebar ul li.active'); // Find the link inside the current;
		
		if(a.length > 0){ // If we found the link, use this one
			a.click();
			return;
		}
		
		$('a[href="#' + id + '"]').eq(0).closest('ul').siblings('a').click(); // Click the parent first
		$('a[href="#' + id + '"]').eq(0).click(); // Now click the child (may be the same as the parent)
		
		window.scrollTo(0, 0);
		
	}
	
	function openSidebar(){
		
		if($('#sidebar').hasClass('open')) return;
		
		$('#sidebar').addClass('open');
		
		$('body').append($('<div id="opacity" />').on('click', closeSidebar));
		$('div#opacity').css('opacity'); // CSS3 transition fix
		$('div#opacity').css('opacity', 0.4);
		
	}
	
	function closeSidebar(){
		
		if(!$('#sidebar').hasClass('open')) return;
		
		$('#sidebar').removeClass('open');
		$('div#opacity').css('opacity'); // CSS3 transition fix
		$('div#opacity').css('opacity', 0);
		
	}
	
	$('header #menu').on('click', function(e){
		
		e.stopPropagation();
		
		if($('#sidebar').hasClass('open')){
			closeSidebar();
		} else {
			openSidebar();			
		}
		
	});
	
	$('#sidebar, #infobar').on('webkitTransitionEnd msTransitionEnd transitionend', function(){
		if(!$(this).hasClass('open')){
			$('div#opacity').remove();
		}
	});
	
	$(window).resize(function(){

		if($('#sidebar').hasClass('open') && window.matchMedia('(min-width:1024px)').matches){
			closeSidebar();
		}
	
	});
	
	$('#sidebar li a[href^="#"]').on('click', function(e){
		
		e.stopPropagation();
		closeSidebar();
		
		// Update sidebar
		$(this).closest('ul').find('li.active').removeClass('active');
		$(this).closest('li').addClass('active');
		
		// Update content
		
		var id = $(this).attr('href').substring(1);
		var div = $('div#pages div[page-id="' + id + '"]');
		
		$('div#pages div.page.active').removeClass('active');
		
		if(div.length){
			div.addClass('active');
		} else {
			
			var div = $('<div page-id="' + id + '" class="page active">Loading...</div>');
			
			$('div#pages').append(div);
			
			$.get('./pages/' + id + '/' + id + '.html', function(response){
				div.html(response);
			});
			
		}
		
		window.scrollTo(0, 0);
	 
	});

	$('body').on('click', 'button:not([data-tooltip])', function(){
		// Make buttons look nicer after click - but not tooltips.
		$(this).blur();
	});

	$('body').on('change', 'select', function(){
		// Make inputs look nicer after change.
		$(this).blur();
	});
	 
	$('body').on('keypress', 'input[type=tel]', function(e){
		
		var key = e.which || e.keyCode || 0;
		return key == 13 || key == 46 || (48 <= key && key <= 57) || (typeof $(this).data('allow') === 'string' && $(this).data('allow').indexOf(String.fromCharCode(key)) >= 0);
		
	}).on('click', 'div.btn-group button', function(){
		
		var input = $(this).find('input');
		
		if(input.prop('type') == 'radio'){
		
			$(this).closest('div.btn-group').find('.btn').removeClass('btn-primary btn-success btn-warning btn-danger btn-info').addClass('btn-default')
			
			if(input.is(':checked')){
				
				$(this).addClass('btn-default').blur().find('input').prop('selected', false).prop('checked', false).trigger('change');
				
			} else {
				
				$(this).removeClass('btn-default').addClass(input.data('class') ? input.data('class') : 'btn-primary').blur().find('input').prop('selected', true).prop('checked', true).trigger('change');
				
			}
			
				
				
		} else if(input.prop('type') == 'checkbox'){
		
			input.prop('checked', !input.is(':checked')).trigger('change');
		
			if(input.is(':checked')){
				$(this).removeClass('btn-default').addClass('btn-primary').blur();
			} else {
				$(this).removeClass('btn-primary').addClass('btn-default').blur();
			}
			
		}
		
	});
	
	$('body').on('click', '[data-goto]', function(){
		
		showTab($(this).data('goto'));
		
	});
	
	var isTouch = 'ontouchstart' in document.documentElement && 1 < window.devicePixelRatio;
	