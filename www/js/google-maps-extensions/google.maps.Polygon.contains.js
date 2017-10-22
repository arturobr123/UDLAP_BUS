if (!google.maps.Polygon.prototype.contains) {
    
	google.maps.Polygon.prototype.contains = function(latLng) {

		// Outside the bounds means outside the polygon
		if (this.getBounds && !this.getBounds().contains(latLng)) {
			return false;
		}
		
		var lat = latLng.lat();
		var lng = latLng.lng();
		var paths = this.getPaths();
		var path, pathLength, inPath, i, j, vertex1, vertex2;
		
		// Walk all the paths
		for (var p = 0; p < paths.getLength(); p++) {
			
			path = paths.getAt(p);
			pathLength = path.getLength();
			j = pathLength - 1;
			inPath = false;
			
			for (i = 0; i < pathLength; i++) {

				vertex1 = path.getAt(i);
				vertex2 = path.getAt(j);

				if (vertex1.lng() < lng && vertex2.lng() >= lng || vertex2.lng() < lng && vertex1.lng() >= lng) {
					if (vertex1.lat() + (lng - vertex1.lng()) / (vertex2.lng() - vertex1.lng()) * (vertex2.lat() - vertex1.lat()) < lat) {
		                inPath = !inPath;
		            }
		        }

		        j = i;
				
			}
			
			if (inPath) {
				return true;
			}
			
		}
		
		return false;
	}

}