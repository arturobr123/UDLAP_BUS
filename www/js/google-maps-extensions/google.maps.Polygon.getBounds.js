if (!google.maps.Polygon.prototype.getBounds) {

	google.maps.Polygon.prototype.getBounds = function(latLng) {

		var bounds = new google.maps.LatLngBounds();
		var paths = this.getPaths();
		var path;
		
		for (var p = 0; p < paths.getLength(); p++) {
			path = paths.getAt(p);
			for (var i = 0; i < path.getLength(); i++) {
				bounds.extend(path.getAt(i));
			}
		}

		return bounds;
	}

}