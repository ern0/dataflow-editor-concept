
	function Editor(elmId,data,gridWidth,gridHeight) {
	
		this.data = data;
		this.scene = null;
		
		var elm = $("#" + elmId).get(0);
		this.paper = Raphael(elm,gridWidth,gridHeight);			
		
	} // Editor() ctor
	
	
	Editor.prototype.create = function(sceneId) {
	
		if (this.scene != null) {
			/// destroy the scene
		} // if destroy
		
		this.scene = new Scene(this,this.data[sceneId]);
		this.scene.create();
		
	} // create()
