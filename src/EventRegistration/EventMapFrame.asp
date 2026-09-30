<!DOCTYPE html>
<html lang="en">
<!--#Include virtual="globalvariables.asp"--> 
<link rel="stylesheet" type="text/css" href="FrameStyle.css">
<%
  
    sql = "select EventLocationID from Event where EventID = " & EventID & ";"
		
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3
    if not rs.eof then
       EventLocationID = rs("EventLocationID")
      end if
  rs.close  
  
  sql = "select  * from EventLocation, Address where EventLocation.AddressID = Address.AddressID and EventLocation.EventLocationID= " & EventLocationID
	rs.Open sql, conn, 3, 3
	If not rs.eof then
		EventLocationName = rs("EventLocationName")
		EventLocationStreet = rs("AddressStreet")
		EventLocationApt = rs("AddressApt")
		EventLocationCity = rs("AddressCity")
		EventLocationState = rs("AddressState")
		EventLocationZip = rs("AddressZip")
		EventLocationCountry = rs("AddressCountry")
	 	end if
   rs.close


 EventAddress =  EventLocationStreet &  " " & EventLocationCity & ", " & EventLocationState & " " & EventLocationZip & " " & EventLocationCountry
 'EventAddress = "1600 Amphitheatre Pky, Mountain View, CA"
		
 %>
  <head>
    <meta charset="utf-8" />
    <title>Google Maps API Example: Simple Geocoding</title>
    <script src="//maps.google.com/maps?file=api&amp;v=2.x&amp;key=AIzaSyBNTQRAs9CE8N1bWyKq59-V9-nExB8hp-M" type="text/javascript"></script>
    <script type="text/javascript">

        var map = null;
        var geocoder = null;


        function showAddress(address) {
            if (geocoder) {
                geocoder.getLatLng(
          address,
          function(point) {
              if (!point) {
                  alert(address + " not found");
              } else {
                  map.setCenter(point, 13);
                  var marker = new GMarker(point);
                  map.addOverlay(marker);

                
              }
          }
        );
            }
        }

        function initialize() {
            if (GBrowserIsCompatible()) {
                map = new GMap2(document.getElementById("map_canvas"));
                map.setCenter(new GLatLng(37.4419, -122.1419), 13);
                geocoder = new GClientGeocoder();
            }
            showAddress(Form.address.value); return false
        }

       
    </script>
    


  </head>

  <body onload="initialize()" onunload="GUnload()"  ><form action="#" name="Form" onsubmit="showAddress(this.address.value); return false"><input type="hidden" size="60" name="address" value="<%= EventAddress%>" />
      <div id="map_canvas" style="width: 200px; height: 300px"></div>
    </form></body>
</html>


