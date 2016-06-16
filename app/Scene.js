
	function Scene(editor,data) {
	
		this.editor = editor;
		this.data = data;
		this.paper = this.editor.paper;

		this.portHover = "";
		
	} // Scene() ctor


	Scene.prototype.getCellWidth = function() {
		return this.data.cellSize;
	} // getCellWidth()

	
	Scene.prototype.getPortWidth = function() {
		return this.getCellWidth();
	} // getPortWidth()
	
	
	Scene.prototype.getCellHeight = function() {
		return this.data.cellSize;
	} // getCellHeight()

	
	Scene.prototype.getFontSize = function() {		
		return this.getCellHeight() * 0.7;
	} // getFontSize()
	

	Scene.prototype.getFontWidth = function() {		
		return this.getCellWidth() * 0.40;
	} // getFontWidth()


	Scene.prototype.create = function() {
	
		this.componentList = {};
		for (var componentId in this.data.components) {
			var componentData = this.data.components[componentId];
			this.addComponent(componentId,componentData);
		} // foreach components
		
		this.connDeps = new AvArray();
		this.connBros = new AvArray();
		
		this.connectionList = {};
		for (var connectionId in this.data.connections) {
			var connectionData = this.data.connections[connectionId];
			this.addConnection(connectionId,connectionData);
		} // foreach connections

		for (var interfaceId in this.data.interface) {
			
			var interfaceData = this.data.interface[interfaceId];
			this.addInterface(interfaceId,interfaceData);
			
			for (var conn in interfaceData.conns) {
				var c;

				if (interfaceData.side == "consumer") {
					c = "!" + interfaceId + ".out>>" + conn;
				}
				
				if (interfaceData.side == "producer") {
					c = conn + ">>!" + interfaceId + ".in";
				}
				
				this.addConnection(c,{});
			} // foreach conn
			
		} // foreach interface
		
	} // create()
	
	
	Scene.prototype.addComponent = function(id,data) {

		this.componentList[id] = new Component(this,id,data);			
		this.componentList[id].create();

		if (id.substr(0,1) == "!") {
			this.data.interface[id.substr(1)] = {
				"x": data.x,
				"y": data.y,
				"side": data.type.substr(1),
				"conns": {}
			}
		} else {
			this.data.components[id] = data;
		}
	
	} // addComponent()

	
	Scene.prototype.removeComponent = function(id) {
	
		var revBros = this.connBros.get(id);
		for (rev in revBros) {
			var ports = revBros[rev];
			for (port in ports) {
				var revC = port.split(".")[0];
				var revP = port.split(".")[1];
				this.connBros.del(revC,revP,id + "." + rev);
			} // foreach port
		} // foreach rev
		this.connBros.del(id);

		this.componentList[id].remove();
		delete this.componentList[id];

		var deps = this.connDeps.get(id);
		var dels = {};
		for (var d in deps) dels[d] = "";
		for (var d in dels) this.removeConnection(d);		
		this.connDeps.del(id);
		
		if (id.substr(0,1) == "!") {
			delete this.data.interface[id.substr(1)];
		} else {
			delete this.data.components[id];
		}

	} // removeComponent()
	
	
	Scene.prototype.getComponent = function(id) {
		return this.componentList[id];
	} // getComponent()
	

	Scene.prototype.addConnection = function(id,data) {

		var conn = new Connection(this,id,data);			
		this.connectionList[id] = conn;
		conn.create();
		conn.toBack();
		
		var a = id.split(">>");
		var a0 = a[0].split(".");
		this.connBros.set(a0[0],a0[1],a[1],"");
		var a1 = a[1].split(".");
		this.connBros.set(a1[0],a1[1],a[0],"");

		var iface = false;
		if (a0[0].substr(0,1) == "!") {
			iface = true;
			this.data.interface[a0[0].substr(1)].conns[a[1]] = {};
		} 
		if (a1[0].substr(0,1) == "!") {
			iface = true;
			this.data.interface[a1[0].substr(1)].conns[a[0]] = {};
		}

		if (!iface) this.data.connections[id] = data;

	} // addConnection()


	Scene.prototype.removeConnection = function(id) {

		this.connectionList[id].remove();
		delete this.connectionList[id];
		
		var a = id.split(">>");
		var a0 = a[0].split(".");
		this.connBros.del(a0[0],a0[1],a[1]);
		var a1 = a[1].split(".");
		this.connBros.del(a1[0],a1[1],a[0]);
		
		this.connDeps.del(a[0].split(".")[0],id);
		this.connDeps.del(a[1].split(".")[0],id);
		
		var iface = false;
		if (a0[0].substr(0,1) == "!") {
			iface = true;
			delete this.data.interface[a0[0].substr(1)].conns[a[1]];
		}
		if (a1[0].substr(0,1) == "!") {
			iface = true;
			delete this.data.interface[a1[0].substr(1)].conns[a[0]];
		}
			
		if (!iface) delete this.data.connections[id];
		
	} // removeConnection()
	
	
	Scene.prototype.addInterface = function(id,data) {

		var ports = {};
		if (data.side == "consumer") ports["out"] = "producer";
		if (data.side == "producer") ports["in"] = "consumer";

		var data = {
			"type": "!" + data.side,
			"x": data.x,
			"y": data.y,
			"ports": ports				
		};

		this.addComponent("!" + id,data);
	
	} // addInterface()
	
	
	Scene.prototype.removeInterface = function(id) {
		this.removeComponent("!" + id);
	} // removeInterface()


	Scene.prototype.getConnection = function(id) {
		return this.connectionList[id];
	} // getConnection()
	

	Scene.prototype.registerConnDependency = function(connectionId,componentId,pt) {
		this.connDeps.set(componentId,connectionId,pt);
	} // registerConnRef()
	
	
	Scene.prototype.getConnBros = function(componentId,portId) {
		var res = this.connBros.get(componentId,portId);
		if (typeof(res) == "undefined") return {};
		return res;
	} // getConnBros()
	
	
	Scene.prototype.recreateDepConns = function(componentId,dx,dy,rot) {

		for (var connectionId in this.connDeps.data[componentId]) {
			this.getConnection(connectionId).recreate(componentId,dx,dy,rot);
		} // foreach connection
		
	} // destroyDepConns()

	
	Scene.prototype.connectionsToFront = function(componentId) {

		for (var connectionId in this.connDeps.data[componentId]) {
			this.getConnection(connectionId).path.toFront();
		} // foreach connection
	
	} // connectionsToFront()
	

	Scene.prototype.connectionsToBack = function(componentId) {

		for (var connectionId in this.connDeps.data[componentId]) {
		
			var conn = this.getConnection(connectionId);
			conn.toBack();
		
		} // foreach connection
	
	} // connectionsToBack()
	
