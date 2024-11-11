	
	(function(){
		
		var div = $('div[page-id="sitrep"]');
		
		var sitrep_final = {
			raw: '',
			html: '',
		};
		
		$('input[name], select[name], textarea[name]', div).on('keyup change', function(){
			
			var input = {};
			
			$('input[name][type=radio]:checked, input[name][type!=radio], select[name], textarea[name]', div).each(function(){
				input[$(this).attr('name')] = $(this);
			});
			
			var sitrep = {
				group1: [],
				group2: [],
				group3: [],
				group4: [],
			};
			
			if(input['incident_name'].val().length){
				sitrep.group1.push(input['incident_name'].val());
			}
			if(input['incident_address'].val().length){
				sitrep.group1.push(input['incident_address'].val());
			}
			
			/***/
			
			if(input['fuel'].val().length){
				sitrep.group2.push('Fuel Type: ' + input['fuel'].val());
			}
			
			if(input['location'].val().length){
				sitrep.group2.push('Located: ' + input['location'].val());
			}
			
			if(input['direction_ns'] || input['direction_ew']){
				
				var direction = [];
				
				if(input['direction_ns'] && input['direction_ns'].val().length){
					direction.push(input['direction_ns'].val());
				}
				if(input['direction_ew'] && input['direction_ew'].val().length){
					direction.push(input['direction_ew'].val());
				}
				
				sitrep.group2.push('Heading: ' + direction.join('-'));
			}
			
			if(input['topography']){
				sitrep.group2.push('Topography: ' + input['topography'].val());
			}
			
			if(input['infrastructure'].val().length){
				sitrep.group2.push('Heading Towards: ' + input['infrastructure'].val());
			}
			
			/***/
			
			if(input['size_width'].val().length || input['size_length'].val().length){
				
				var size = [];
				
				if(input['size_width'].val().length){
					size.push(input['size_width'].val() + ' metres wide');
				}
				if(input['size_length'].val().length){
					size.push(input['size_length'].val() + ' metres long');
				}
				
				sitrep.group3.push('Size: ' + size.join(' x '));
				
			}
			
			if(input['intensity']){
				sitrep.group3.push('Flame Intensity: ' + input['intensity'].val());
			}
			
			if(input['flame_height'].val().length){
				sitrep.group3.push('Flame Height: ' + input['flame_height'].val() + ' m');
			}
			
			if(input['wind_speed'].val().length){
				sitrep.group3.push('Wind Speed: ' + input['wind_speed'].val() + ' km/h');
			}
			
			if(input['spotting'].val().length){
				sitrep.group3.push('Spotting: ' + input['spotting'].val() + ' in front of head fire');
			}
			
			/***/
			
			if(input['under_threat']){
				sitrep.group4.push('Properties Under Threat: ' + input['under_threat'].val());
			}
			
			/***/
			
			var output_raw = [];
			var output_html = [];
			
			$.each(sitrep, function(group, parts){
				if(parts.length > 0){
					output_raw.push(parts.join('\n'));
					output_html.push(parts.join('<br>'));
				}
			});
			
			sitrep_final.raw = output_raw.join('\n-------------\n');
			sitrep_final.html = output_html.join('<hr>');
			
			$('div.sitrep').html(sitrep_final.html);
			
		});
		
		$('button.send', div).on('click', function(){
			
			var date = new Date;
			var name = $('input[name=incident_name]').val();
			
			var subject = (name.length ? name : 'Bushfire') + ' SITREP [' + date.getHours().toString() + date.getMinutes().toString() + ' hrs' + ']';
			
			switch($(this).data('method')){
				case 'email':
					window.location = 'mailto:?subject=' + encodeURI(subject) + '&body=' + sitrep_final.raw.split('\n').map(encodeURI).join("%0D%0A\n");
				break;
				case 'sms':
					window.location = 'sms:?body=' + sitrep_final.raw.split('\n').map(encodeURI).join("%0D%0A");
				break;
			}
			
		});
		
		$('form', div).on('reset', function(){
			
			var form = $(this);
			
			setTimeout(function(){
				
				$('div.btn-group .btn', form).addClass('btn-default').removeClass('btn-primary btn-success btn-warning btn-danger btn-info');
				$('input[name]', form).eq(0).trigger('change');
				
			});
			
		});
		
	})();