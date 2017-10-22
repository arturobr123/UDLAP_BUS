  var actualizacion = false;

  var marker; // marcador global
  
  var myCenter2;  // esta es la ubicacion del usuario actualizandose actualizar()

  var myCenter3;  //Ubicar cada parada

  var marker3; //marcador de cada parada

  var infowindow; //infoWindoq


  //AUTOBUSES
  var nomCamion1 = "CAPU";
  var nomCamion2 = "PUEBLA";

  var Markercamion1; //Marcador del camion


  var waypts = [];  //Waypoints para calcular la distancia del camion a la ruta
  var wayptsCAPU = []; //Waypoints para dibujar la linea CAPU
  var wayptsPUEBLA = []; //Waypoints para dibujar la linea PUEBLA
  var wayptsCIRCUITO = []; //Waypoints para dibujar la linea Circuito


  directionsDisplay = null;
  directionsDisplayBus = null;


$(document).ready(function()  //INICIO!!!!!
  {
    if (typeof google === 'object' && typeof google.maps === 'object') {
    navigator.geolocation.getCurrentPosition(initialize);
    } 
    else {
        alert("No se puede conectar. Verifique que tiene activado el boton ubnicacion  e internet");
    }

  });
  

  function initialize(location) //Inicio de la aplicacion
  {


      waypts = [];
      console.log(location);
      //Mi ubicacion
      var myCenter = new google.maps.LatLng(location.coords.latitude ,location.coords.longitude);
      CENTER = new google.maps.LatLng(location.coords.latitude ,location.coords.longitude);
      var mapOptions = { //opciones del mapa
        center: myCenter ,
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true, // quita los botones en el mapa que vienen predeterminados
        draggable: true
      };
      map = new google.maps.Map(document.getElementById("mapa"),mapOptions); //inicio el mapa



  /*    var ctaLayer = new google.maps.KmlLayer({
    url: 'https://script.google.com/macros/s/AKfycbzUymij474emcOpZYF4MMzi-TehesBun3WrlFZ4BYRCIXlIpec/exec?archivo=capu.kml',
    map: map
  }); */


      marker=new google.maps.Marker({  //Marker del usuario
        position:myCenter,
        map:map,
        title:"posicion usuario",
        icon:{
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10, //tamaño
        strokeColor: '#F0FFFF', //color del borde
        strokeWeight: 5, //grosor del borde
        fillColor: '#00f', //color de relleno
        fillOpacity:1// opacidad del relleno
        }
      });


      marker.setMap(map); //Poner el marker del usuario en el mapa


      var img = new google.maps.MarkerImage("img/autobus.png");

      Markercamion1=new google.maps.Marker({ //marker del camion
      position:myCenter,
      map:map,
      title:"posicion camion1",
      icon:img
      });

         
      Markercamion1.setMap(map); //marker del camion en el mapa
      Markercamion1.setVisible(false);

      // este getJSON obtiene las posiciones de las estaciones de un JSON
    $.getJSON("baseDatos.json",function(data){ 
  //CAPU!!!!!!!!
        var labels = '1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50';
        labels = labels.split(" ");
        var labelIndex = 0;
        for(usuario in data.CAPU){



          var botonLlevar = "<input class=\"ocultarboton\" type=\"button\" id=\""+data.CAPU[usuario].id+"\" onclick=\"botonInfoWindow()\" value=\"Buscar ruta\"  />";
          var contentString = "<div id=\"content\">" + "<h2>"+ data.CAPU[usuario].id+ " </h2> <img src=\""+data.CAPU[usuario].imagen+"\" align=\"right\" width=\"200\" height=\"170\" margin-left=\"10px\">" + "<div id=\"bodyContent\">"+ "<p></p>" + "<p style=\"text-align:center;\"><a class=\""+data.CAPU[usuario].ruta +"\" name="+"\""+data.CAPU[usuario].lat +" "+ data.CAPU[usuario].long+"\""+  "id=\""+data.CAPU[usuario].id+"\" onclick=\"nombreEstacion(this.name, this.className,this.id)\" href=\"informacionParadas.html\" >" + "Informacion</a>.</p>" + "<p style=\"text-align:center;\"><a id=NoSubrayado class=\""+data.CAPU[usuario].ruta +"\" onclick=\"botonInfoWindow(this.className)\" href=\"#\">" + "Llevame ahí</a>.</p>"+ "<p style=\"text-align:center;\"><a class=\""+data.CAPU[usuario].lat +" "+ data.CAPU[usuario].long+"\" id=\""+data.CAPU[usuario].ruta+"\" onclick=\"waypoint(this.id, this.className)\">" + "Llegada Autobus</a>.</p>"+  botonLlevar + "</div>" + "</div>";

          var myCenter3 = new google.maps.LatLng(data.CAPU[usuario].lat ,data.CAPU[usuario].long);
          

          if(wayptsCAPU.length<8  && (parseInt(usuario)%3==0))
          {
                
                  stop = new google.maps.LatLng(data.CAPU[usuario].lat ,data.CAPU[usuario].long);
                  console.log(stop.lat());
                  wayptsCAPU.push({
                      location: stop,
                      stopover: true
                         });
                        
          }

          
          var marker3=new google.maps.Marker({
            position:myCenter3,
            icon:{path: google.maps.SymbolPath.CIRCLE,
            scale: 8, //tamaño
            strokeColor: '#00CED1', //color del borde
            strokeWeight: 5, //grosor del borde
            fillColor: '#00CED1', //color de relleno
            fillOpacity:1 },// opacidad del relleno},
            map: map,
            title:"Esto es un marcador", 
            label:{text: labels[labelIndex++ % labels.length],
                   color: 'white'},
            // the CSS class for the label
            
          });



           // funcion para poner a cada market su infoWindow
          (function(contentString, marker3) {
            google.maps.event.addListener(marker3,'click',function() {
             
            if (!infowindow) {
            infowindow = new google.maps.InfoWindow();
            }
            infowindow.setContent(contentString);
            infowindow.open(map, marker3);

            });
            })(contentString, marker3);

        }

        var ida = new google.maps.LatLng(19.054076 ,-98.292299);
        var Llegada = new google.maps.LatLng(19.073752 ,-98.203382);

        //lineaRuta(wayptsCAPU,"#1E90FF", ida, Llegada);
        var labelIndex = 0;
  //PUEBLA!!!!!!!!
        for(usuario in data.PUEBLA){ 


            
            var botonLlevar = "<input class=\"ocultarboton\" type=\"button\" id=\""+data.PUEBLA[usuario].id+"\" onclick=\"botonInfoWindow()\" value=\"Buscar ruta\"  />";
            var contentString = "<div id=\"content\">" + "<h2>"+ data.PUEBLA[usuario].id+ " </h2> <img src=\""+data.PUEBLA[usuario].imagen+"\" align=\"right\" width=\"200\" height=\"170\" margin-left=\"10px\">" + "<div id=\"bodyContent\">"+ "<p></p>" + "<p style=\"text-align:center;\"><a class=\""+data.PUEBLA[usuario].ruta +"\" name="+"\""+data.PUEBLA[usuario].lat +" "+ data.PUEBLA[usuario].long+"\""+  "id=\""+data.PUEBLA[usuario].id+"\" onclick=\"nombreEstacion(this.name, this.className,this.id)\" href=\"informacionParadas.html\" >" + "Informacion</a>.</p>" + "<p style=\"text-align:center;\"><a id=\"a\" class=\""+data.PUEBLA[usuario].ruta +"\" onclick=\"botonInfoWindow(this.className)\"    href=\"#\">" + "Llevame ahí</a>.</p>"+ "<p style=\"text-align:center;\"><a class=\""+data.PUEBLA[usuario].lat +" "+ data.PUEBLA[usuario].long+"\" id=\""+data.PUEBLA[usuario].ruta+"\" onclick=\"waypoint(this.id, this.className)\">" + "Llegada Autobus</a>.</p>"+  botonLlevar + "</div>" + "</div>";

            var myCenter3 = new google.maps.LatLng(data.PUEBLA[usuario].lat ,data.PUEBLA[usuario].long);
          
            
            if(wayptsPUEBLA.length<8 )
                {
                  
                    stop = new google.maps.LatLng(data.PUEBLA[usuario].lat ,data.PUEBLA[usuario].long);
                    console.log(stop.lat());
                    wayptsPUEBLA.push({
                        location: stop,
                        stopover: true
                           });
                          
                }
            else{
              //lineaRuta(wayptsPUEBLA,"#7CFC00",wayptsPUEBLA[0].location,wayptsPUEBLA[wayptsPUEBLA.length-1].location);
              wayptsPUEBLA = [];
            }

            var marker3=new google.maps.Marker({
              position:myCenter3,
              icon:{path: google.maps.SymbolPath.CIRCLE,
              scale: 8, //tamaño
              strokeColor: '#32CD32', //color del borde
              strokeWeight: 5, //grosor del borde
              fillColor: '#32CD32', //color de relleno
              fillOpacity:1 },
              map: map,
              title:"Esto es un marcador",
              label:{text: labels[labelIndex++ % labels.length],
                   color: 'white'},
          
            });


             // funcion para poner a cada market su infoWindow
             (function(contentString, marker3) {
              google.maps.event.addListener(marker3,'click',function() {
               
              if (!infowindow) {
              infowindow = new google.maps.InfoWindow();
              }
              infowindow.setContent(contentString);
              infowindow.open(map, marker3);

              });
              })(contentString, marker3); 


          }


        //var ida = new google.maps.LatLng(wayptsPUEBLA[0].location);
        //var Llegada = new google.maps.LatLng(wayptsPUEBLA[wayptsPUEBLA.length-1].location);

        
        var labelIndex = 0;
  //CIRCUITO!!!!!!!!! 

        for(usuario in data.Circuito){ 


            var botonLlevar = "<input class=\"ocultarboton\" type=\"button\" id=\""+data.Circuito[usuario].id+"\" onclick=\"botonInfoWindow()\" value=\"Buscar ruta\"  />";
            var contentString = "<div id=\"content\">" + "<h2>"+ data.Circuito[usuario].id+ " </h2> <img src=\""+data.Circuito[usuario].imagen+"\" align=\"right\" width=\"200\" height=\"170\" margin-left=\"10px\">" + "<div id=\"bodyContent\">"+ "<p></p>" + "<p style=\"text-align:center;\"><a class=\""+data.Circuito[usuario].ruta +"\" name="+"\""+data.Circuito[usuario].lat +" "+ data.Circuito[usuario].long+"\""+  "id=\""+data.Circuito[usuario].id+"\" onclick=\"nombreEstacion(this.name, this.className,this.id)\" href=\"informacionParadas.html\" >" + "Informacion</a>.</p>" + "<p style=\"text-align:center;\"><a class=\""+data.Circuito[usuario].ruta +"\" id=\"a\" onclick=\"botonInfoWindow(this.className)\"    href=\"#\">" + "Llevame ahí</a>.</p>"+ "<p style=\"text-align:center;\"><a class=\""+data.Circuito[usuario].lat +" "+ data.Circuito[usuario].long+"\" id=\""+data.Circuito[usuario].ruta+"\" onclick=\"tiempo(this.id, this.className)\">" + "Llegada Autobus</a>.</p>"+  botonLlevar + "</div>" + "</div>";

            var myCenter3 = new google.maps.LatLng(data.Circuito[usuario].lat ,data.Circuito[usuario].long);

            if(wayptsCIRCUITO.length<8)
                {
                  
                    stop = new google.maps.LatLng(data.Circuito[usuario].lat ,data.Circuito[usuario].long);
                    console.log(stop.lat());
                    wayptsCIRCUITO.push({
                        location: stop,
                        stopover: true
                           });
                          
                }
            else{
                  //lineaRuta(wayptsCIRCUITO,"#B22222",wayptsCIRCUITO[0].location,wayptsCIRCUITO[wayptsCIRCUITO.length-1].location);
                  wayptsCIRCUITO = [];
                  if(wayptsCIRCUITO.length ==0)
                  {
                    stop = new google.maps.LatLng(data.Circuito[usuario-1].lat ,data.Circuito[usuario-1].long);
                    console.log(stop.lat());
                    wayptsCIRCUITO.push({
                        location: stop,
                        stopover: true
                           });

                    stop = new google.maps.LatLng(data.Circuito[usuario].lat ,data.Circuito[usuario].long);
                    console.log(stop.lat());
                    wayptsCIRCUITO.push({
                        location: stop,
                        stopover: true
                           });

                  }
                  
            }
         
            var marker3=new google.maps.Marker({
                position:myCenter3,
                icon:{path: google.maps.SymbolPath.CIRCLE,
                scale: 8, //tamaño
                strokeColor: '#DC143C', //color del borde
                strokeWeight: 5, //grosor del borde
                fillColor: '#DC143C', //color de relleno
                fillOpacity:1 },
                map: map,
                title:"Esto es un marcador",
                label:{text: labels[labelIndex++ % labels.length],
                   color: 'white'},
          
            });


             // funcion para poner a cada market su infoWindow
             (function(contentString, marker3) {
              google.maps.event.addListener(marker3,'click',function() {
               
              if (!infowindow) {
              infowindow = new google.maps.InfoWindow();
              }
              infowindow.setContent(contentString);
              infowindow.open(map, marker3);

              });
              })(contentString, marker3);

          }

        //var ida = new google.maps.LatLng(data.Circuito[0].lat ,data.Circuito[0].long);
        //var Llegada = new google.maps.LatLng(data.Circuito[data.Circuito.length-1].lat ,data.Circuito[data.Circuito.length-1].long);

        
 
  //Checar si el progress bar es mayor a 90% para llenarlo todo


        setTimeout(function(){

            var temporal = localStorage.getItem("EstacionF"); // aqui esta la estacion EXCELENTE
            console.log(temporal + " parada TEMPORAL"); 
            var splitt= temporal.split(" ");
            var paradaBuscada = new google.maps.LatLng(splitt[0] ,splitt[1]);

            map.panTo(paradaBuscada);
            map.setZoom(18);

    //do what you need here
        }, 4000);


  }); //acaba getJSON


  navigator.geolocation.watchPosition(actualizar, onError,{frequency:1000}); //funcion actulizar


  }



 //ACTUALIZA LA POSICION DEL USUARIO Y EL AUTOBUS
function actualizar(location)
{

  var img = new google.maps.MarkerImage("img/autobus.png");
//127.0.0.1/bus/get   http://pruebaserver.ddns.net:443/bus/get
  $.getJSON("http://joseluisvelazquez.ddns.net:443/bus/get",function(data){ 
    $("#fail").hide(); //ocultar el mensaje de "no se pudo conectar al sevidor"

  if(data[1].route == nomCamion2) //ver si esta el camion en el servidor y ponerlo en el mapa
  {
    console.log("Actualizando location camion");
    var ubicacionCamion1 = new google.maps.LatLng(parseFloat(data[1].lat) ,parseFloat(data[1].lng));     
    Markercamion1.position = ubicacionCamion1;
    Markercamion1.setMap(map);
    Markercamion1.setVisible(true);

  }

  }).fail(function(data) {
    $("#fail").show();
    $("#fail").html("No connection with the server."); 
  })      ;
  
       
  console.log(location);
  myCenter2 = new google.maps.LatLng(location.coords.latitude ,location.coords.longitude); //posicion nueva del usuario
    var mapOptions2 = {
      center: myCenter2 ,
      zoom: 17,
      mapTypeId: google.maps.MapTypeId.ROADMAP
      };

  marker.position =myCenter2; //posicion del marker del usuario

  marker.setMap(map); //poner el marker del usuario en la nueva posicion 

  }


   function onError(error) {
            alert('code: '    + error.code    + '\n' +
                  'message: ' + error.message + '\n');
        }



  function lineaRuta(Waypoints,color,ida,Llegada)
  {
    var directionsDisplay = new google.maps.DirectionsRenderer({
            suppressMarkers: true,
            suppressInfoWindows: true,
            polylineOptions: { strokeColor: color },
       }); 

    var directionsService = new google.maps.DirectionsService();

    var request = {
     origin: ida ,
     destination: Llegada,
     waypoints: Waypoints,
      travelMode: google.maps.TravelMode.DRIVING
     };


     directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            
            directionsDisplay.setMap(map);
             directionsDisplay.setPanel(document.getElementById("panel_ruta"));
            directionsDisplay.setDirections(response);
        } 
        else 
        {
            alert("problemas al cargar las rutas");        
        }

      });


  }

function botonInfoWindow(ruta) //Llevame ahí
  {
    console.log("oprimiste el boton de infowindow");
    $("#panel_ruta").show();
    $("#finalizar").show();
    $("#bLateral").show(); 
    var buscarCamino = false;
    var estacionLat;
    var estacionLng;
    
    nombreParada = document.getElementsByTagName('input')[0].id;

    $.getJSON("baseDatos.json",function(data){
      if(ruta == "CAPU")
      {   
        for(usuario in data.CAPU){
          console.log(data.CAPU[usuario].id); 
            if(data.CAPU[usuario].id == nombreParada)
            {
                estacionLat = data.CAPU[usuario].lat;
                estacionLng = data.CAPU[usuario].long;
               

            }
        }
      }

      if(ruta == "PUEBLA")
      {   
        for(usuario in data.PUEBLA){
          console.log(data.PUEBLA[usuario].id); 
            if(data.PUEBLA[usuario].id == nombreParada)
            {
                estacionLat = data.PUEBLA[usuario].lat;
                estacionLng = data.PUEBLA[usuario].long;
            }
        }
      }

      if(ruta == "Circuito")
      {   
        for(usuario in data.Circuito){
          console.log(data.Circuito[usuario].id); 
            if(data.Circuito[usuario].id == nombreParada)
            {
                estacionLat = data.Circuito[usuario].lat;
                estacionLng = data.Circuito[usuario].long;
            }
        }
      }


    infowindow.close();

    directionsDisplay = new google.maps.DirectionsRenderer({ //No ponga markers
            suppressMarkers: true,
            suppressInfoWindows: true,
       });

    var directionsService = new google.maps.DirectionsService(); //Se necesitan para dibujar lineas
    var destino = new google.maps.LatLng(estacionLat ,estacionLng);//Se necesitan para dibujar lineas

    var request = {
     origin: myCenter2,
     destination: destino,
      travelMode: google.maps.TravelMode.WALKING,
      provideRouteAlternatives: true
     };

     directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) { //Dibuja la linea
            directionsDisplay.setMap(map);
             directionsDisplay.setPanel(document.getElementById("panel_ruta"));
            directionsDisplay.setDirections(response);
        } 
        else {
                alert("No existen rutas entre ambos puntos");
        }
    });  

   
  }); //Finaliza el getJSON


  }
  


  function Finalizar()
  {
    $(".panel_ruta").hide();
    $("#finalizar").hide();
    if(directionsDisplay != null)
      directionsDisplay.setMap(null);
    if(directionsDisplayBus != null)
      directionsDisplayBus.setMap(null);
    
  }

 
  
function tiempo(idBus , LatLongParada , latCamion, lngCamion)
{
  $("#finalizar").show();
  console.log(idBus); //nombre del camion
  var splitt= LatLongParada.split(" ");

  console.log(splitt[0]); // latitud
  console.log(splitt[1]);  //longitud


  var latitud; //latCamion
  var longitud; //lngCamion

  latitud = latCamion;
  longitud = lngCamion;
      
    
  //calcular tiempo
  var ubicaciona = new google.maps.LatLng(latitud ,longitud); 
  var ubicacionb = new google.maps.LatLng(splitt[0] ,splitt[1]);

  var service = new google.maps.DistanceMatrixService();

  service.getDistanceMatrix({ //Calcula el tiempo, se va a la funcion callback
     origins: [ubicaciona],
     destinations: [ubicacionb],
     travelMode: google.maps.TravelMode.DRIVING,
     unitSystem: google.maps.UnitSystem.METRIC
   },callback);


  //color de linea y suprimir otros markers
  directionsDisplayBus = new google.maps.DirectionsRenderer({ //obligatoria para dibujar lineas
              suppressMarkers: true,
              suppressInfoWindows: true,
              polylineOptions: { strokeColor: "#7CFC00" },

         }); 

  var directionsServiceBus = new google.maps.DirectionsService(); //obligatoria para dibujar lineas

  //ciclo waypoints inicio
  var i =0;
  var RutaWaypts = [];
  while(waypts[i].location.lat()!= splitt[0])
  {
    console.log("while " + waypts[i].location);
    if(i % 2 == 0)  // 0 es par , cuando sea par se sumara 1 a i
    {
              stop = waypts[i].location;
          RutaWaypts.push({
              location: stop,
              stopover: true
                          });
    }

    i++;
      
  }

  var requestBus = {
   origin: ubicaciona,
   destination: ubicacionb,
   waypoints: RutaWaypts,
    travelMode: google.maps.TravelMode.DRIVING,
    optimizeWaypoints: true
   };


   directionsServiceBus.route(requestBus, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK)
      {
          directionsDisplayBus.setMap(map); //dibuja la linea
          
          directionsDisplayBus.setDirections(response);
          var route = response.routes[0];         
      } else {
              alert("No existen rutas entre ambos puntos");
      }

    }); 




 }


function callback(respuesta, status) { //Muestra la distancia y el tiempo del camion a la parada
   if (status != google.maps.DistanceMatrixStatus.OK) {
      console.log("error");
   } else {
      var origen = respuesta.originAddresses;
      var destino = respuesta.destinationAddresses;

      for (var i = 0; i < origen.length; i++) {
         var results = respuesta.rows[i].elements;
         for (var j = 0; j < results.length; j++) {
           // $("#dialog").html(' Distancia <code>' + results[j].distance.text + ' ,Tiempo estimado es de <code>'
           // + results[j].duration.text + '</code><br />');
            alert(' Distancia ' + results[j].distance.text + ' ,Tiempo estimado es de '
            + results[j].duration.text);
         }
      }
       
   }
}


function waypoint(idBus , LatLngParadaClick)
{
  
  infowindow.close();

   var splitt= LatLngParadaClick.split(" ");

   console.log(splitt[0] + " latitud");
   console.log(splitt[1] + " longitud");

  waypts = [];
  var parada=0;
//https://ofeliacervantes14-80.terminal.com/bus/get
  $.getJSON("http://joseluisvelazquez.ddns.net:443/bus/get",function(data){
    for(index in data)
    {
      console.log(index);
      if(data[index].route == idBus) //Busca el autobus en el servidor y cuando lo encuentra empieza a jalar sus datos
      {
         parada = data[index].stop;
         console.log(parada+ " numero de parada");
         var latitud = data[index].lat;
         var longitud = data[index].lng;
          if(parada != -1) // saber si detecta bien la localizacion, si no , no se puede saber donde esta el autobus
          {
            $.getJSON("baseDatos.json",function(data){ 
              while(data[idBus][parada].lat!= splitt[0]) //empieza a meter las paradas anteriores del camion hasta la parada que diste click
              { 
                
                console.log("que parada : " + data[idBus][parada].lat);
                stop = new google.maps.LatLng(data[idBus][parada].lat ,data.CAPU[parada].long);
                console.log(stop.lat());
                waypts.push({
                    location: stop,
                    stopover: true
                       });
                      
                      parada++;
                        
              }
              //ingresa la ultima
              stop = new google.maps.LatLng(data[idBus][parada].lat ,data[idBus][parada].lng);
              waypts.push({
                    location: stop,
                    stopover: true
                       });
                   
                 tiempo(idBus , LatLngParadaClick,latitud, longitud); // se manda a la funcion calcular tiempo
            });
        }
        else
          alert("No se puede obtener la ubicacion del autobus");

      }

      else
        alert("No encuentra al camion especificado");

    }

    
  }).fail(function(data) {
    alert("No se puede conectar al servidor");
  })      ;



}


function callBackFunction(b){
  if(b == 1){
    console.log("user said ok");
  }
  else {
    console.log("user said Awesome");
  }
}


/*
//POSIBLE IMAGEN
var img = new google.maps.MarkerImage( 
          "img/paradaCapu.png",
          null, 
          null, 
          null, 
          new google.maps.Size(30, 30)
          ); 

*/











  