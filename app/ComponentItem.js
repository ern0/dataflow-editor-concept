
	function ComponentItem(component) {
	
		this.component = component;		
		this.elmList = [];		
		
		this.scene = component.scene;
		this.paper = component.paper;

		this.ch = this.scene.getCellHeight();
		this.pad = Math.round(this.ch * 0.25);
		this.stroke = Math.round(this.scene.getCellHeight() * 0.1);
		if (this.stroke < 1) this.stroke = 1;
		
	} // ComponentItem() ctor
	
	
	ComponentItem.prototype.create = function(y,type,name,anchor,leftPortName,rightPortName,last) {

		var first = false;
		var interface = false;
		this.fillColor = "#ffffff";
		this.hiliteColor = "#cccccc";
		if (type == "interface") {
			interface = true;
			first = true;
			this.fillColor = "#dddddd";
			this.hiliteColor = "#bbbbbb";
		} // if interface
		if (type == "trigger") first = true;
		if (type == "thru") first = true;
		if (type == "value") first = true;
		if (type == "title") first = true;
		var leftPort = ( leftPortName != "" );
		var rightPort = ( rightPortName != "" );

		var fullWidth = this.component.getWidth();
		var mainWidth = fullWidth;
		var mainLeft = this.component.getX();
		var pw = this.scene.getPortWidth();		
		var leftLeft = mainLeft;
		var rightLeft = mainLeft + mainWidth - pw;
		if (leftPort) {
			mainWidth -= pw;
			mainLeft += pw;
		}
		if (rightPort) mainWidth -= this.scene.getPortWidth();
		
		var topEdge = ( first ? this.stroke : 0 );
		var bottomEdge = ( last ? this.stroke : 0 );
		
		var mainCursor = ( first ? "move" : "default" );
		var regMode = ( first ? "move" : "none" );

		var a = ( leftPort ? 0 : topEdge );
		var b = ( rightPort ? 0 : topEdge );
		var c = ( rightPort ? 0 : bottomEdge );
		var d = ( leftPort ? 0 : bottomEdge );				
		var mainElm = this.paper.rrect(mainLeft,y,mainWidth,this.ch,a,b,c,d);
		mainElm.attr("fill",this.fillColor);
		mainElm.attr("stroke","#888888");
		mainElm.attr("stroke-width",this.stroke);		
		mainElm.attr("cursor",mainCursor);
		this.regElm("m",(first ? "!title" : name),mainElm,regMode);	

		var fs = this.scene.getFontSize();
		var textPos = mainLeft;
		if (anchor == "start") textPos += fs / 2;
		if (anchor == "middle") textPos += mainWidth / 2;
		if (anchor == "end") textPos += mainWidth - fs / 2;
		var textElm = this.paper.text(textPos,fs / 1.4 + y,name);
		textElm.attr("font-family","monospace");
		textElm.attr("font-size",fs);
		textElm.attr("text-anchor",anchor);
		textElm.attr("cursor",mainCursor);
		this.regElm("mt",(first ? "!title" : name),textElm,regMode);

		var cy = y + (this.ch / 2);
		this.leftElm = null;
		this.rightElm = null;

		if (leftPort) {
		
			var cx = leftLeft + this.pad;
			this.component.setPortConnPoint(leftPortName,cx,cy);
		
			this.leftElm = this.paper.rrect(leftLeft,y,pw,this.ch,topEdge,0,0,bottomEdge);
			this.leftElm.attr("fill",this.fillColor);
			this.leftElm.attr("stroke","#888888");
			this.leftElm.attr("stroke-width",this.stroke);		
			this.leftElm.attr("cursor","crosshair");		
			this.leftElm.data("x",cx);
			this.leftElm.data("y",cy);
			this.regElm("l",leftPortName,this.leftElm,"consumer");	
			this.regPortHover(this.leftElm,leftPortName,"l");
			
			var leftArrow = this.mkArrow(leftLeft,y,pw);
			leftArrow.attr("stroke","#999999");
			leftArrow.attr("fill","#cccccc");
			leftArrow.attr("cursor","crosshair");		
			leftArrow.data("x",cx);
			leftArrow.data("y",cy);
			this.regElm("la",leftPortName,leftArrow,"consumer");
			this.regPortHover(leftArrow,leftPortName,"l");
			
		} // if left
		
		if (rightPort) {

			var cx = rightLeft + pw - this.pad;
			this.component.setPortConnPoint(rightPortName,cx,cy);

			this.rightElm = this.paper.rrect(rightLeft,y,pw,this.ch,0,topEdge,bottomEdge,0);
			this.rightElm.attr("fill",this.fillColor);
			this.rightElm.attr("stroke","#988888");
			this.rightElm.attr("stroke-width",this.stroke);		
			this.rightElm.attr("cursor","crosshair");		
			this.rightElm.data("x",cx);
			this.rightElm.data("y",cy);
			this.regElm("r",rightPortName,this.rightElm,"producer");		
			this.regPortHover(this.rightElm,rightPortName,"r");

			var rightArrow = this.mkArrow(rightLeft,y,pw);
			rightArrow.attr("stroke","#999999");
			rightArrow.attr("fill","#cccccc");
			rightArrow.attr("cursor","crosshair");		
			rightArrow.data("x",cx);
			rightArrow.data("y",cy);
			this.regElm("ra",rightPortName,rightArrow,"producer");
			this.regPortHover(rightArrow,rightPortName,"r");

		} // if right
		
	} // create()


	ComponentItem.prototype.mkArrow = function(x,y,w) {
	
		var h2 = this.ch / 2;
		var path = "";
		
		path = "M" + (this.pad + x) + "," + (h2 + y);
		path += " L" + (this.pad + x) + "," + (this.pad + y);
		path += " L" + (x + this.ch - this.pad) + "," + (h2 + y);
		path += " L" + (x + this.pad) + "," + (y + this.ch - this.pad);
		path += " L" + (x + this.pad) + "," + (h2 + y);
		path += " Z";			
		
		var arrow = this.paper.path(path);
		arrow.attr("stroke-width",this.stroke);
		
		return arrow;
	} // mkArrow()
	

	ComponentItem.prototype.regElm = function(id,nam,elm,mode) {
		var self = this;
	
		elm.node.id = this.component.id + "-" + nam + "-" + id;
		this.elmList.push(elm);
		this.component.st.push(elm);

		if (mode == "none") return;

		if (mode == "move") {
		
			elm.drag(function(dx,dy,ax,ay,event) {
				Component.prototype.dndMove.call(self.component,dx,dy,event);
			},function(dx,dy) {
				Component.prototype.dndStart.call(self.component);
			},function() {
				Component.prototype.dndStop.call(self.component);
			});
		
		} else {  // producer/consumer
		
			elm.drag(function(dx,dy,x,y,event) {
				Component.prototype.connMove.call(self.component,this,dx,dy,x,y);
			},function(dx,dy) {		
				Component.prototype.connStart.call(self.component,this);				
			},function(elm) {
				Component.prototype.connStop.call(self.component,elm);
			});

		} // if-else mode
		
	} // regElm()


	ComponentItem.prototype.regPortHover = function(elm,portName,side) {
		var self = this;

		var id = this.component.getId() + "." + portName;
		elm.data("port",id);
		elm.data("side",side);
		elm.data("scene",this.scene);
	
		elm.hover(function() {
			this.data("scene").portHover = this.data("port");
		},function() {
			this.data("scene").portHover = "";		
		});
	
	} // regPortHover()
	

	ComponentItem.prototype.portsToBack = function() {
	
		if (this.leftElm != null) this.leftElm.toBack();
		if (this.rightElm != null) this.rightElm.toBack();
		
	} // portsToBack()


	ComponentItem.prototype.hilitePort = function(cet,hilite) {

		var elm = null;
		if (cet == "l") elm = this.leftElm;
		if (cet == "r") elm = this.rightElm;
		if (elm == null) return;
		
		if (hilite) {
			elm.attr("fill",this.hiliteColor);
		} else {
			elm.attr("fill",this.fillColor);
		}

	} // hilitePort()
