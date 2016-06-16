// http://stackoverflow.com/a/7313475/185881

	Raphael.fn.rrect = function (x, y, w, h, r1, r2, r3, r4){
		var array = [];
		array = array.concat(["M",x,r1+y,"Q",x,y,x+r1,y]); //A
		array = array.concat(["L",x+w-r2,y,"Q",x+w,y,x+w,y+r2]); //B
		array = array.concat(["L",x+w,y+h-r3,"Q",x+w,y+h,x+w-r3,y+h]); //C
		array = array.concat(["L",x+r4,y+h,"Q",x,y+h,x,y+h-r4,"Z"]); //D
		return this.path(array);
	};
