

	$(document).ready(function() {
	
		data = {
		
			"if": {
				"cellSize": 20,
				"interface": {
					"xin": {
						"side": "consumer",
						"x": 3,
						"y": 12,
						"conns": {}
					},
					"xout": {
						"side": "producer",
						"x": 16,
						"y": 12,
						"conns": {}
					}
				}, // interface
				"components": {
					"thru1": {
						"type": "Thru",
						"x": 9,
						"y": 14,
						"ports": {
							"in": "consumer",
							"out": "producer"
						}
					},
					"p1": {
						"type": "Proc",
						"x": 10,
						"y": 17,
						"ports": {
							"in": "consumer",
							"out": "producer"
						}
					}
				},
				"connections": {
				},
			
			}, // scene
		
			"wc": {
				"cellSize": 20,
				"interface": { },
				"components":  {
					"button": {"type": "Button","x": 1,"y": 1,"ports": {"press": "producer"}},"carousel": {"type": "Carousel","x": 2,"y": 7,"ports": {"in": "consumer","out": "producer"}},"on": {"type": "Thru","x": 14,"y": 6,"ports": {"in": "consumer","out": "producer"}},"off": {"type": "Thru","x": 13,"y": 10,"ports": {"in": "consumer","out": "producer"}},"voff": {"type": "Value","x": 27,"y": 18,"ports": {"value": "property=0","in": "consumer","out": "producer"}},"von": {"type": "Value","x": 27,"y": 12,"ports": {"value": "property=1","in": "consumer","out": "producer"}},"loff": {"type": "Value","x": 27,"y": 8,"ports": {"value": "property=0","in": "consumer","out": "producer"}},"lon": {"type": "Value","x": 27,"y": 2,"ports": {"value": "property=1","in": "consumer","out": "producer"}},"dv": {"type": "Value","x": 9,"y": 16,"ports": {"value": "property=10000","in": "consumer","out": "producer"}},"dvtrigger": {"type": "Trigger","x": 1,"y": 16,"ports": {"out": "producer"}},"lamp": {"type": "Lamp","x": 33,"y": 4,"ports": {"in": "consumer"}},"delay": {"type": "Delay","x": 19,"y": 13,"ports": {"in": "consumer","delay": "consumer","reset": "consumer","out": "producer"}},"vent": {"type": "Vent","x": 33,"y": 14,"ports": {"in": "consumer"}}
				},
				"connections": {
					"von.out>>vent.in": {},"voff.out>>vent.in": {},"lon.out>>lamp.in": {},"loff.out>>lamp.in": {},"delay.out>>voff.in": {},"off.out>>delay.in": {},"carousel.out>>off.in": {},"carousel.out>>on.in": {},"on.out>>lon.in": {},"button.press>>carousel.in": {},"off.out>>loff.in": {},"on.out>>von.in": {},"dvtrigger.out>>dv.in": {},"dv.out>>delay.delay": {},"off.out>>delay.reset": {}
				}				
			} // scene
		};
	
		editor = new Editor("scene",data,800,480);
		editor.create("wc");
		//editor.create("if");
		
		$("#srcbutton").on("click",function() {
			src = JSON.stringify(editor.data["if"]);
			$("#src").html( src.replace(/\:/g,":\n"));
		});
		
	});
