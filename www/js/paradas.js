function JASON()
{
  console.log("JSON");
  var texto;
  
  $.getJSON("baseDatos.json",function(data){ 
  for(usuario in data.CAPU){ 
            recorrido = "CAPU";
            texto = "<li><a name=\""+data.CAPU[usuario].id+"\" id="+"\""+data.CAPU[usuario].lat +" "+ data.CAPU[usuario].long+"\"" +
            "onclick=\"nombreEstacion(this.id, recorrido,this.name)\"   href=\"informacionParadas.html\">"
             + data.CAPU[usuario].id
           + "</a></li>";

           $("#lista").append(texto);
           console.log(texto);
  }


  for(usuario in data.PUEBLA){ 
           recorrido2 = "PUEBLA";
            texto = "<li><a name=\""+data.PUEBLA[usuario].id+"\" id="+"\""+data.PUEBLA[usuario].lat +" "+ data.PUEBLA[usuario].long+"\"" +
            " onclick=\"nombreEstacion(this.id,recorrido2,this.name)\" href=\"informacionParadas.html\">"
             + data.PUEBLA[usuario].id
           + "</a></li>";

           $("#lista").append(texto);
           console.log(texto);
  }

  for(usuario in data.Circuito){ 
            recorrido3 = "Circuito";
            texto = "<li><a name=\""+data.Circuito[usuario].id+"\"  id="+"\""+data.Circuito[usuario].lat +" "+ data.Circuito[usuario].long+"\"" +
            " onclick=\"nombreEstacion(this.id, recorrido3, this.name)\" href=\"informacionParadas.html\">"
             + data.Circuito[usuario].id
           + "</a></li>";

           $("#lista").append(texto);
           console.log(texto);
  }

  
  $("#lista").show();
  $( ".selector" ).filterable( "refresh" );
   
  });

  $( ".selector" ).filterable( "refresh" );

  $( ".selector" ).filterable({
  filter: function( event, ui ) {}
});
}


var estacion; //esto es el nombre de la estacion que le das click
var recorrido;
var nomPARADA;


function nombreEstacion(id, recorri, nombreParada)
{
  console.log("obtuvo nombre...");
  console.log("obtuvo nombre..." + nombreParada);
  estacion=id;
  nomPARADA = nombreParada;
  recorrido = recorri;
  console.log(id);
  console.log(recorrido);
  localStorage.setItem("id",id);
  localStorage.setItem("recorri",recorri);
  localStorage.setItem("nombreParada",nombreParada);


  location.href = "informacionParadas.html"; 


}


function DatosEstacion()
{
  estacion=localStorage.getItem("id");
  nomPARADA = localStorage.getItem("nombreParada");;
  recorrido = localStorage.getItem("recorri");
  console.log("bien, nombreestacion " + estacion);
  console.log("bien, recorrido " + recorrido);
  console.log("bien, parada " + nomPARADA);
   window.name = recorrido;
 window.name = estacion;
 window.name = nomPARADA;



  var nombre;
  var imagen;
  var horario;

  $.getJSON("baseDatos.json",function(data){ 

  if(recorrido=="CAPU")
  { console.log("CAPU");
      for(usuario in data.CAPU){ 
        if(data.CAPU[usuario].id == nomPARADA)
        {
            localStorage.setItem("Estacion",data.CAPU[usuario].lat+" "+ data.CAPU[usuario].long);
            nombre=" <h1 >"+data.CAPU[usuario].id+"</h1>";

            imagen="<img src=\" "+ data.CAPU[usuario].imagen+" \" height=\"200\" width=\"230\">";
           
            horario="<p>"+ data.CAPU[usuario].horario +"</p>";
        }

      }
  }
  if(recorrido=="PUEBLA")
  {console.log("PUEBLA");
      for(usuario in data.PUEBLA){ 
        if(data.PUEBLA[usuario].id == nomPARADA)
        {
          localStorage.setItem("Estacion",data.CAPU[usuario].lat+" "+ data.CAPU[usuario].long);
          
            nombre=" <h1 >"+data.PUEBLA[usuario].id+"</h1>";

            imagen="<img src=\" "+ data.PUEBLA[usuario].imagen+" \" height=\"200\" width=\"230\">";
           
            horario="<p>"+ data.PUEBLA[usuario].horario +"</p>";
        }

      }
  }
  if(recorrido=="Circuito")
  {console.log("CIRCUITO");
      for(usuario in data.Circuito){ 
        if(data.Circuito[usuario].id == nomPARADA)
        {
          localStorage.setItem("Estacion",data.CAPU[usuario].lat+" "+ data.CAPU[usuario].long);

            nombre=" <h1 >"+data.Circuito[usuario].id+"</h1>";

            imagen="<img src=\" "+ data.Circuito[usuario].imagen+" \" height=\"200\" width=\"230\">";
           
            horario="<p>"+ data.Circuito[usuario].horario +"</p>";
        }

      }
  }

  $("#Parada").append(nombre);
  $("#imagen").append(imagen);
  $("#horarios").append(horario);


  });

  console.log("BIEN");

}


  function cambiarEstacion()
  {
    
    console.log("estacionnnn " + estacion);
    localStorage.setItem("EstacionF",estacion);
  }

