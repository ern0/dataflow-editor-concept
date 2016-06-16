
	function Connection(scene,id,data) {
	
		this.scene = scene;
		this.id = id;
		this.data = data;

		this.paper = scene.paper;

		var s = this.id.split(">>")
		var s1 = s[0].split(".");
		var s2 = s[1].split(".");		
		this.pCompId = s1[0];
		this.pPortId = s1[1];
		this.cCompId = s2[0];
		this.cPortId = s2[1];
		
		this.scene.registerConnDependency(this.id,this.pCompId,"p");
		this.scene.registerConnDependency(this.id,this.cCompId,"c");
		
		this.producer = this.scene.getComponent(this.pCompId);
		this.consumer = this.scene.getComponent(this.cCompId);		
		
	} // Connection() ctor
	
	
	Connection.prototype.getId = function() {
		return this.id;
	} // getId()
	
	
	Connection.prototype.create = function(componentId,dx,dy,rot) {

		if (typeof(componentId) == "undefined") componentId = "";
		if (typeof(dx) == "undefined") dx = 0;
		if (typeof(dy) == "undefined") dy = 0;
		if (typeof(rot) == "undefined") rot = 0;

		var dx1 = 0;
		var dy1 = 0;
		var r1 = 0;
		var dx2 = 0;
		var dy2 = 0;
		var r2 = 0;
		if (this.producer.getId() == componentId) {
			dx1 = dx;
			dy1 = dy;
			r1 = rot * 0.0175;
		}
		if (this.consumer.getId() == componentId) {
			dx2 = dx;
			dy2 = dy;
			r2 = rot * 0.0175;
		}
		
		var x1 = (dx1 + this.producer.getPortConnPointX(this.pPortId));
		var y1 = (dy1 + this.producer.getPortConnPointY(this.pPortId));
		if (r1 != 0) {
			var xx = this.producer.getOrigoX(dx,dy);
			var yy = this.producer.getOrigoY(dx,dy);
			var s = Math.sin(r1);
			var c = Math.cos(r1);
			x1 = Math.round(xx + (x1 - xx) * c - (y1 - yy) * s);
			y1 = Math.round(yy + (x1 - xx) * s + (y1 - yy) * c);
		} // if rotate 1
		
		var x2 = (dx2 + this.consumer.getPortConnPointX(this.cPortId));
		var y2 = (dy2 + this.consumer.getPortConnPointY(this.cPortId));
		if (r2 != 0) {
			var xx = this.consumer.getOrigoX(dx,dy);
			var yy = this.consumer.getOrigoY(dx,dy);
			var s = Math.sin(r2);
			var c = Math.cos(r2);
			x2 = Math.round(xx + (x2 - xx) * c - (y2 - yy) * s);
			y2 = Math.round(yy + (x2 - xx) * s + (y2 - yy) * c);
		} // if rotate 2

		var p = "M" + x1 + "," + y1 + " L" + x2 + "," + y2;
		this.path = this.paper.path(p);
		this.path.attr("stroke-width",Math.round(this.scene.getCellHeight() * 0.1));
		this.path.attr("stroke","#888888");

	} // create()


	Connection.prototype.remove = function() {
		this.path.remove();	
	} // remove()
	
	
	Connection.prototype.recreate = function(componentId,dx,dy,rot) {
	
		this.remove();
		this.create(componentId,dx,dy,rot);
		
	} // recreate()
	
	
	Connection.prototype.toBack = function() {

		this.path.toBack();
			
		var comps = this.id.split(">>");
		var prod = comps[0].split(".");
		var cons = comps[1].split(".");
		this.scene.getComponent(prod[0]).portToBack(prod[1]);
		this.scene.getComponent(cons[0]).portToBack(cons[1]);
	
	} // toBack()
