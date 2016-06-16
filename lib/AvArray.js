
	function AvArray(ini) {
	
		this.data = ini || {};
		
	} // AvArray()
	
	
	AvArray.prototype.set = function() {
 
		var ptr = this.data;
		for (var n = 0; n < arguments.length - 2; n++) {
	
			var i = arguments[n];
			if (typeof(ptr[i]) != "object") ptr[i] = {};
			ptr = ptr[i];
	
		} // foreach arguments
 
		var i = arguments[arguments.length - 2];
		var value = arguments[arguments.length - 1];
		ptr[i] = value;
 
	} // set()
	
	
	AvArray.prototype.get = function() {
 
		var ptr = this.data;
		for (var n = 0; n < (arguments.length - 1); n++) {
			
			var i = arguments[n];
			if (typeof(ptr[i]) != "object") return undefined;
			ptr = ptr[i];
			
		} // foreach arguments
 
		return ptr[arguments[arguments.length - 1]];
	} // get()
 
 
	AvArray.prototype.del = function() {
	
		var ptr = this.data;
		for (var n = 0; n < (arguments.length - 1); n++) {
		
			var i = arguments[n];
			if (typeof(ptr[i]) != "object") return;
			ptr = ptr[i];
			
		} // foreach arguments
		
		delete ptr[arguments[arguments.length - 1]];
		
	} // del()
