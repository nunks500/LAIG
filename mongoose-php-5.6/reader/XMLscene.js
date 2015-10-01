
function XMLscene() {
    CGFscene.call(this);
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.initCameras();

    this.initLights();
	
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);
	
	
	this.obj2 = new MyObject(this);
};

XMLscene.prototype.initLights = function () {

    this.shader.bind();
//	this.glLightModelfv(this.GL_LIGHT_MODEL_TWO_SIDE,this.GL_TRUE);
	this.luce = new CGFlight(this,1);
	this.luce.setPosition(0,3,3,1);
	 this.luce.setDiffuse(1.0,1.0,1.0,1.0);
	this.luce.update();
	this.lights[0].setPosition(2, 3, 3, 1);
    this.lights[0].setDiffuse(1.0,1.0,1.0,1.0);
    this.lights[0].update();
 
    this.shader.unbind();
};

XMLscene.prototype.initCameras = function () {
		this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));


};

XMLscene.prototype.setDefaultAppearance = function () {
  if(typeof this.graph.ambienter !== "undefined")
  this.setAmbient(this.graph.ambienter,this.graph.ambienteg, this.graph.ambienteb, this.graph.ambientea);	
   else
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);	
};

// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function () 
{
	
		if(this.graph.fr.length !== 0){
			this.camera.near = this.graph.nearx;
			this.camera.far = this.graph.farx;
		}

 if(this.graph.q.length !== 0){
	this.axis=new CGFaxis(this,this.graph.len);}
	else
	this.axis = new CGFaxis(this);
	
	var ite=0;
/*
	for(;ite<this.graph.arr.length;ite++){
		if(this.graph.arr[ite].enable == "1")
		{
	this.graph.arr[ite].setPosition(2, 3, 3, 1);
    this.graph.arr[ite].setDiffuse(1.0,1.0,1.0,1.0);
    this.graph.arr[ite].update();
		}

	}
	*/
//	this.gl.clearColor(1,0,0,0);
this.gl.clearColor(this.graph.backr,this.graph.backgg,this.graph.backb,this.graph.backa);
	this.lights[0].setVisible(true);
	this.luce.setVisible(true);
	this.luce.enable();
    this.lights[0].enable();
    	return true;
  
};

XMLscene.prototype.display = function () {
	// ---- BEGIN Background, camera and axis setup
    this.shader.bind();
	
	// Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation
	this.updateProjectionMatrix();
    this.loadIdentity();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();

	// Draw axis
	 if(typeof this.axis !== "undefined"){
	this.axis.display();
	
	 }

	this.setDefaultAppearance();

	// Rotate 30 degrees around Y
	// These constants would normally be pre-computed at initialization time
	// they are placed here just to simplify the example
	
	var deg2rad=Math.PI/180.0;
	var a_radx=this.graph.rotxangle*deg2rad;
	var a_rady=this.graph.rotyangle*deg2rad;
	var a_radz=this.graph.rotzangle*deg2rad;
	var cos_ax = Math.cos(a_radx);
	var sin_ax = Math.sin(a_radx);
	var cos_ay = Math.cos(a_rady);
	var sin_ay = Math.sin(a_rady);
	var cos_az = Math.cos(a_radz);
	var sin_az = Math.sin(a_radz);

    var tra = [   1.0, 0.0, 0.0, 0.0,
                  0.0, 1.0, 0.0, 0.0,
                  0.0, 0.0, 1.0, 0.0,
                  this.graph.xtrans, this.graph.ytrans, this.graph.ztrans, 1.0  ];

    var roty = [ cos_ay,  0.0,  -sin_ay,  0.0,
                0.0,    1.0,   0.0,    0.0,
                sin_ay,  0.0,   cos_ay,  0.0,
                0.0,    0.0,   0.0,    1.0 ];
                
	 var rotx = [1.0,  0.0,  0.0,  0.0,
                0.0,  cos_ax, -sin_ax, 0.0,
                0.0,  sin_ax,   cos_ax,  0.0,
                0.0,    0.0,   0.0,    1.0 ];
     var rotz = [cos_az,  -sin_az,  0.0,  0.0,
                sin_az,  cos_az, 0.0, 0.0,
                0.0,  0.0,   1.0,  0.0,
                0.0,    0.0,   0.0,    1.0 ];           



	// Scaling by (5,2,1)

    var sca = [ this.graph.scalax, 0.0, 0.0, 0.0,
                0.0, this.graph.scalay, 0.0, 0.0,
                0.0, 0.0,this.graph.scalaz, 0.0,
                0.0, 0.0, 0.0, 1.0  ];

	// ---- END Background, camera and axis setup

	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it
	this.multMatrix(tra);
	this.multMatrix(sca);
	
	 if(typeof this.graph.rotxangle !== "undefined"){
	this.multMatrix(rotx);
	 }
	 if(typeof this.graph.rotyangle !== "undefined"){
	this.multMatrix(roty);
	 }
	 if(typeof this.graph.rotzangle !== "undefined"){
	this.multMatrix(rotz);
	 }
	this.obj2.display();
	if (this.graph.loadedOk)
	{
		this.lights[0].update();
	};	

    this.shader.unbind();
};

