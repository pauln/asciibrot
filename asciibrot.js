limit=100;
chars=" .,,,-----++++%%%%@@@@### ";
params={};
generating=false;
function xGen(xPos,zoom) {
	x[0]=parseFloat(xPos);
	zoom=parseFloat(zoom);
	for(var i=1;i<=limit;i++) {
		x[i]=x[i-1]+zoom;
	}
}
function yGen(yPos,zoom) {
	y[0]=parseFloat(yPos);
	zoom=parseFloat(zoom);
	for(var i=1;i<=limit;i++) {
		y[i]=y[i-1]+zoom;
	}
}
function zIter() {
	var tempx=0;
	var tempy=0;
	var ti=0;
	for(var i=0;i<=limit;i++) {
		rx[i]=[];
		ry[i]=[];
	}
	for(var i=0;i<=limit;i++) {
		for(var j=0;j<=limit;j++) {
			ix[ix.length]=j;
			iy[iy.length]=i;
			ii[ii.length]=0;
			zx[zx.length]=x[j];
			zy[zy.length]=y[i];
			rx[j][i]=x[j];
			ry[j][i]=y[i];
		}
	}
	for(var j=limit;j>=0;j--) {
		for(var k=limit;k>=0;k--) {
			for(var i=1;i<=limit;i++) {
				tempx=rx[k][j]*rx[k][j]-ry[k][j]*ry[k][j]+x[k];
				tempy=ry[k][j]*rx[k][j]*2+y[j];
				
				ix[ix.length]=k;
				iy[iy.length]=j;
				ii[ii.length]=i;
				zx[zx.length]=tempx;
				zy[zy.length]=tempy;
				
				rx[k][j]=tempx;
				ry[k][j]=tempy;
				
				if(((tempx*tempx)+(tempy*tempy)) > 16) break;
			}
		}
	}
}

function generateMandelbrot(xPos,yPos,zoom) {
	generating=true;
	// globals
	x=[];
	y=[];
	zx=[];
	zy=[];
	ix=[];
	iy=[];
	ii=[];
	rx=[];
	ry=[];
	finalGrid=[];
	// locals
	var el=document.getElementById('asciibrot');
	var line="";
	var newBrot="";
	
	params.x=xPos;
	params.y=yPos;
	params.zoom=zoom;
	
	xGen(xPos,zoom);
	yGen(yPos,zoom);
	zIter();
	for(var i=0;i<=limit;i++) {
		finalGrid[i]=[];
		for(var j=0;j<limit;j++) {
			finalGrid[i][j]=0;
		}
	}
	for(var i=0;i<ix.length;i++) {
		if(ii[i]>finalGrid[iy[i]][ix[i]]) {
			finalGrid[iy[i]][ix[i]]=ii[i];
		}
	}
	for(var i=0;i<=limit;i++) {
		line='';
		for(var j=0;j<finalGrid[i].length;j++) {
			var pos=finalGrid[i][j]%25;
			pos--;
			if(pos<0)pos=25;
			line+=chars.substring(pos,pos+1);
		}
		newBrot+=line.replace(/ /g,'&nbsp;')+'<br>';
	}
	el.innerHTML=newBrot;
	generating=false;
}

function checkKey(e) {
	e=e||window.event;
	if(e.keyCode==38) {
		if(e.ctrlKey||e.shiftKey) {
			generateMandelbrot(params.x,params.y,params.zoom-0.005);
		} else {
			generateMandelbrot(params.x,params.y-0.1,params.zoom);
		}
		e.keyCode==0;
		return false;
	} else if(e.keyCode==37) {
		generateMandelbrot(params.x-0.1,params.y,params.zoom);
		e.keyCode==0;
		return false;
	} else if(e.keyCode==39) {
		generateMandelbrot(params.x+0.1,params.y,params.zoom);
		e.keyCode==0;
		return false;
	} else if(e.keyCode==40) {
		if(e.ctrlKey||e.shiftKey) {
			generateMandelbrot(params.x,params.y,params.zoom+0.005);
		} else {
			generateMandelbrot(params.x,params.y+0.1,params.zoom);
		}
		e.keyCode==0;
		return false;
	}
}
function cancelKey(e) {
	e=e||window.event;
	if(e.keyCode>=38&&e.keyCode<=40) {
		e.keyCode==0;
		return false;
	}
	return true;
}
