function MyTriangle(scene,x1,y1,z1,x2,y2,z2,x3,y3,z3) {
	CGFobject.call(this,scene);

	this.initBuffers(x1,y1,z1,x2,y2,z2,x3,y3,z3);
//this.initBuffers();
};

MyTriangle.prototype = Object.create(CGFobject.prototype);
MyTriangle.prototype.constructor=MyTriangle;

MyTriangle.prototype.initBuffers = function (x1,y1,z1,x2,y2,z2,x3,y3,z3) {
	this.vertices = [
            x1,y1,z1,
			x2,y2,z2,
			x1,y3,z3
			];

	this.indices = [
			0, 1, 2
        ];
      this.texCoords = [
		    0, 0,
		    1, 0,
		    1, 1
	  ];

		
	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};
MyTriangle.prototype.updatest = function (s,t) {
	   this.texCoords = [
 	 0, t,
 	 s, t,
 	 0, 0,
 	 s, 0
 	  ];
		
	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
	
};
