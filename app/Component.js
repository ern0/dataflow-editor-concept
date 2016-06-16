
	function Component(scene,id,data) {
	
		this.scene = scene;
		this.id = id;
		this.data = data;

		this.paper = scene.paper;
		
	} // Component() ctor


	Component.prototype.getId = function() {
		return this.id;
	} // getId()
	
	
	Component.prototype.create = function() {

		this.portList = new AvArray();
		this.portConnPoints = new AvArray();
		this.st = this.paper.set();
		this.itemY = this.getY();
		var created = false;

		if (this.data.type == "!consumer") {		
			this.width = this.calcWidth(this.id,1);
			this.snapWidth();
			this.height = this.calcHeight(1);
			this.createItem("interface",this.id.substr(1),"middle","","","out",true);
			created = true;
		} // if consumer interface

		if (this.data.type == "!producer") {		
			this.width = this.calcWidth(this.id,1);
			this.snapWidth();
			this.height = this.calcHeight(1);
			this.createItem("interface",this.id.substr(1),"middle","in","","",true);
			created = true;
		} // if consumer interface

		if (this.data.type == "Trigger") {		
			this.width = this.calcWidth(this.id,1);
			this.snapWidth();
			this.height = this.calcHeight(1);
			this.createItem("trigger",this.id,"middle","","","out",true);
			created = true;
		} // if Trigger

		if (this.data.type == "Thru") {		
			this.width = this.calcWidth(this.id,2);
			this.snapWidth();
			this.height = this.calcHeight(1);
			this.createItem("thru",this.id,"middle","in","","out",true);
			created = true;
		} // if Thru

		if (this.data.type == "Value") {		
			var title = this.displayName(this.data.ports.value,this.id);
			this.width = this.calcWidth(title,2);
			this.snapWidth();
			this.height = this.calcHeight(1);
			this.createItem("value",title,"middle","in","","out",true);
			created = true;
		} // if Value

		if (!created) {

			this.name = this.id + " (" + this.data.type + ")";
			this.width = this.calcWidth(this.name,0);
			this.height = 0;
			
			var lastPortName = "";
			for (var portName in this.data.ports) {
				lastPortName = portName;
				var pnum = 0;
				var portType = this.data.ports[portName].split("=")[0];
				if (portType == "consumer") pnum = 1;
				if (portType == "producer") pnum = 1;
				if (portType == "property") pnum = 0;
				var w = this.calcWidth(this.displayName(this.data.ports[portName],portName),pnum);
				if (w > this.width) this.width = w;
				this.height += this.calcHeight(1);
			} // foreach ports
			this.snapWidth();
				
			this.createItem("title",this.name,"middle","","","",true);
	
			for (var portName in this.data.ports) {
				var name = this.displayName(this.data.ports[portName],portName);
				var portType = this.data.ports[portName].split("=")[0];
				var last = ( portName == lastPortName );
	
				if (portType == "consumer") {
					this.createItem(portType,name,"start",name,"","",last);
				}
				if (portType == "producer") {
					this.createItem(portType,name,"end","","",name,last);
				}
				if (portType == "property") {
					this.createItem(portType,name,"middle","",name,"",last);
				}
	
			} // foreach ports

		} // if standard

		this.st.attr("opacity",0.8);
		
	} // create()	
	
	
	Component.prototype.displayName = function(port,name) {
		
		var value = port.split("=")[1];
		if (typeof(value) != "undefined") {			
			if ((name + value).length > 24) {
				var sp = 12 - name.length;
				if (sp < 0) sp = 0;
				value = value.substr(0,sp + 5) + "..." + value.substr(-3 - sp,3 + sp);
			}
			name = name + "=" + value;
		} // if value

		return name;
	} // displayName()
	
	
	Component.prototype.snapWidth = function() {
	
		var cw = this.scene.getCellWidth();
		this.width += cw / 2;
		this.width = Math.round(this.width / cw);
		this.width = cw * this.width;		
		
	} // snapWidth()
	
	
	Component.prototype.createItem = function(type,name,anchor,leftPortName,midPortName,rightPortName,round) {

		var item = new ComponentItem(this);
		item.create(this.itemY,type,name,anchor,leftPortName,rightPortName,round);
		this.itemY += this.calcHeight(1);

		if (leftPortName != "") this.portList.set(leftPortName,item);
		if (midPortName != "") this.portList.set(midPortName,item);
		if (rightPortName != "") this.portList.set(rightPortName,item);
	
	} // createItem()
	
	
	Component.prototype.remove = function() {
		this.st.remove();
	} // remove()
	
	
	Component.prototype.getX = function() {
		return this.data.x * this.scene.getCellWidth();
	} // getX()
	
	
	Component.prototype.getY = function() {
		return this.data.y * this.scene.getCellHeight();
	} // getY()
	
	
	Component.prototype.getWidth = function() {		
		return this.width;
	} // getWidth()
	

	Component.prototype.getHeight = function() {		
		return this.height;
	} // getHeight()

	
	Component.prototype.calcWidth = function(name,portNum) {		
		var nw = (2 + name.length) * this.scene.getFontWidth();		
		var pw = portNum * this.scene.getPortWidth();
		return nw + pw;
	} // calcWidth()
	
	
	Component.prototype.calcHeight = function(itemNum) {
		return itemNum * this.scene.getCellHeight();
	} // calcHeight()


	Component.prototype.getOrigoX = function(dx,dy) {
		if (typeof(dx) == "undefined") dx = 0;
		if (typeof(dy) == "undefined") dy = 0;
		return dx + this.getX() + ( this.getWidth() / 2 );
	} // getOrigoX()
	

	Component.prototype.getOrigoY = function(dx,dy) {
		if (typeof(dx) == "undefined") dx = 0;
		if (typeof(dy) == "undefined") dy = 0;
		return dy + this.getY() + ( this.getHeight() / 2 );
	} // getOrigoY()
	

	Component.prototype.setPortConnPoint = function(port,x,y) {
		this.portConnPoints.set(port,"x",x);
		this.portConnPoints.set(port,"y",y);
	} // setPortConnPoint()
	
	
	Component.prototype.getPortConnPointX = function(port) {
		return this.portConnPoints.get(port,"x");
	} // getPortConnPointX()


	Component.prototype.getPortConnPointY = function(port) {
		return this.portConnPoints.get(port,"y");
	} // getPortConnPointY()

	
	Component.prototype.dndStart = function() {

		this.st.attr("opacity",0.7);
		this.st.toFront();
		this.scene.connectionsToFront(this.id);

		this.dndMoved = false;
		this.dx = this.getX();
		this.dy = this.getY();

		var b = this.st.getBBox();
		var x = (b.x + b.x2) / 2;
		var y = (b.y + b.y2) / 2;
		this.rot = "r" + 8 + "," + x + "," + y + " ";
		
		return this;
	} // dndStart()
	
	
	Component.prototype.dndMove = function(dx,dy,event) {

		this.dndMoved = true;
		this.dx = dx + this.getX();
		this.dy = dy + this.getY();
	
		this.st.transform(this.rot + "T" + dx + "," + dy);

		this.scene.recreateDepConns(this.id,dx,dy,8);

		return this;
	} // dndMove()


	Component.prototype.dndStop = function() {

		if (this.dndMoved) {
			this.data.x = Math.round(this.dx / this.scene.getCellWidth());
			this.data.y = Math.round(this.dy / this.scene.getCellHeight());
			this.move();
		} else {
			/// select!
			this.st.attr("opacity",0.8);
		}
		
		this.scene.connectionsToBack(this.id);
		
		return this;
	} // dndStop()


	Component.prototype.move = function(x,y) {
	
		if (typeof(x) != "undefined") this.data.x = x;
		if (typeof(y) != "undefined") this.data.y = y;

		this.st.remove();		
		this.create();
		this.scene.recreateDepConns(this.id,0,0,0);
	
		return this;
	} // move()
	
	
	Component.prototype.connStart = function(elm) {	
	
		this.connPath = null;
		this.connBroSel = null;
		this.scene.lastHover = "";

		this.cx = elm.data("x");
		this.cy = elm.data("y");
		this.connBeginId = elm.node.id;

		var pw = this.scene.getPortWidth();
		this.connBros = new AvArray();
		var a = this.connBeginId.split("-");
		var bros = this.scene.getConnBros(a[0],a[1]);
		var side = this.connBeginId.split("-")[2];
		for (var broId in bros) {
			var b = broId.split(".");
			var comp = this.scene.getComponent(b[0]);
			var w = this.cx - comp.getPortConnPointX(b[1]);
			var h = this.cy - comp.getPortConnPointY(b[1]);
			var length = Math.sqrt( Math.abs(w * w) + Math.abs(h * h) );
			this.connBros.set(broId,"l",length);
			var angle = Math.atan2(h,w) * 57.29577951308232 - 90;
			if (angle < 0) angle += 360;
			this.connBros.set(broId,"a",angle);
		} // foreach bros
		
	} // connStart()


	Component.prototype.connMove = function(elm,dx,dy,x,y) {

		if (this.connPath != null) this.connPath.remove();
		
		var tx = x;
		if (this.cx < x) tx -= 2;
		if (this.cx > x) tx += 2;
		var ty = y;
		if (this.cy < y) ty -= 2;
		if (this.cy > y) ty += 2;
		
		var p = "M" + (this.cx) + "," + (this.cy);
		p += " L" + (tx) + "," + (ty);		

		this.connPath = this.paper.path(p);
		this.connPath.attr("stroke-width",Math.round(this.scene.getCellHeight() * 0.1));
		this.connPath.attr("stroke","#888888");

		var pw = this.scene.getPortWidth();
		var w = this.cx - tx;
		var h = this.cy - ty;
		var length = Math.sqrt( Math.abs(w * w) + Math.abs(h * h) );
		if (length < 0.25 * pw) return;
		var angle = Math.atan2(h,w) * 57.29577951308232 - 90;
		if (angle < 0) angle += 360;
		
		var bestBro = {"a":99,"i":""};
		for (broId in this.connBros.data) {
			var bro = this.connBros.data[broId];

			if (length < pw) continue;
			if (length > pw + pw + bro.l) continue;
			
			var angleDistance = Math.abs(bro.a - angle);
			if (angleDistance > 9) continue;
			if (bestBro.a < angleDistance) continue;

			bestBro.i = broId;
			bestBro.a = Math.abs(angleDistance);
		} // foreach bro
		
		var connMode = true;
		if (bestBro.i == "") {		
		
			if (this.connBroSel != null) {
				this.connBroSel.path.attr("opacity",1);
				this.connBroSel = null;
			}
		
		}	else {	
		
			var baseId = this.getId() + "." + this.connBeginId.split("-")[1];
			var connBeginType = this.connBeginId.split("-")[2].substr(0,1);
			var connectionId = "";
			if (connBeginType == "r") connectionId = baseId + ">>" + bestBro.i;
			if (connBeginType == "l") connectionId = bestBro.i + ">>" + baseId;

			var lastBro = ( this.connBroSel == null ? "" : this.connBroSel.getId() );
			
			if (lastBro != connectionId) {
				if (this.connBroSel != null) this.connBroSel.path.attr("opacity",1);
				this.connBroSel = this.scene.getConnection(connectionId);		
			} // if change

			connMode = false;
			if (this.scene.portHover != "") {
				connMode = true;
				var selfConnId = "";
				if (connBeginType == "r") selfConnId = baseId + ">>" + this.scene.portHover;
				if (connBeginType == "l") selfConnId = this.scene.portHover + ">>" + baseId;
				if (selfConnId == connectionId) connMode = false;
				var already = this.scene.data.connections[selfConnId];
				if (typeof(already) != "undefined") connMode = false;
			} // if hover
	
			if (connMode) {
				this.connBroSel.path.attr("opacity",1);
			} else {
				this.connBroSel.path.attr("opacity",0.4);
			}

		} // if candidate
			
		var validHover = false;
		if (this.scene.portHover != "") {

			validHover = true;
			var connBeginType = this.connBeginId.split("-")[2].substr(0,1);
			var hs = elm.data("side");
			var ht = "";
			if (hs == "l") ht = "r";
			if (hs == "r") ht = "l";
			if (ht == "") validHover = false;
			if (ht == connBeginType) validHover = false;
			
			if ( (this.getId().substr(0,1) == "!") && (this.scene.portHover.substr(0,1) == "!") ) {
				validHover = false;
			} // if both i/f

			var baseId = this.getId() + "." + this.connBeginId.split("-")[1];
			var selfConnId = "";
			if (connBeginType == "r") selfConnId = baseId + ">>" + this.scene.portHover;
			if (connBeginType == "l") selfConnId = this.scene.portHover + ">>" + baseId;
			var c = this.scene.data.connections[selfConnId];
			if (typeof(c) != "undefined") connMode = false;

		} // if hover

		if (!connMode) validHover = false;

		if (validHover) {

			if (this.scene.lastHover != this.scene.portHover) {
				if (this.scene.lastHover != "") this.markPort(this.scene.lastHover,false);
				this.scene.lastHover = this.scene.portHover;
				this.markPort(this.scene.portHover,true);
			} // if hover changed
			
		} else {
			
			if (this.scene.lastHover != "") {
				this.markPort(this.scene.lastHover,false);
				this.scene.lastHover = "";
			}
			
		} // if-else port hover
	
	} // connMove()
	
	
	Component.prototype.connStop = function(elm) {

		var connEndId = elm.target.id;
		
		var connBeginType = this.connBeginId.split("-")[2].substr(0,1);
		var connEndType = "";
		try {	connEndType = connEndId.split("-")[2].substr(0,1); } catch (e) { }

		var connect = false;
		var connEndComponent = "";
		var connEndPort = "";
		while (true) {
		
			if (this.connPath == null) break;
			this.connPath.remove();
			
			if ( (connBeginType == "l") && (connEndType != "r") ) break;
			if ( (connBeginType == "r") && (connEndType != "l") ) break;
			if ( (this.connBeginId.substr(0,1) == "!") && (connEndId.substr(0,1) == "!") ) break;

					
			var begin = this.connBeginId.split("-")[0];
			begin += "." + this.connBeginId.split("-")[1];
			connEndComponent = connEndId.split("-")[0];
			var end = connEndComponent;
			connEndPort = connEndId.split("-")[1];
			end += "." + connEndPort;
			var conn = begin + ">>" + end;
			if (connBeginType == "l") conn = end + ">>" + begin;
					
			if (typeof(this.scene.getConnection(conn)) != "undefined") break;
			
			connect = true;
			break;
		} // while
		
		if (connect) {
			var c = this.scene.getComponent(connEndComponent);
			var p = c.portList.get(connEndPort);
			p.hilitePort(connEndType,false);
			if (this.connBroSel != null) this.connBroSel.path.attr("opacity",1);
			this.scene.addConnection(conn,{});
		} else if (this.connBroSel != null) {
			this.scene.removeConnection(this.connBroSel.getId());
		}
		
		this.connBroSel = null;
		
	} // connStop()


	Component.prototype.portToBack = function(portId) {	
		this.portList.get(portId).portsToBack();			
	} // portToBack()


	Component.prototype.markPort = function(portId,hilite) {

		var connBeginType = this.connBeginId.split("-")[2].substr(0,1);
		var i = portId.split(".");
		var component = this.scene.getComponent(i[0]);
		var port = component.portList.get(i[1]);

		var cet = "";
		if (connBeginType == "l") cet = "r";
		if (connBeginType == "r") cet = "l";

		port.hilitePort(cet,hilite);
		
	} // markPort()
	
