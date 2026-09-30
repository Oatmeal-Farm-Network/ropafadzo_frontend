
<%

conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
						"Data Source=" & server.mappath(DatabasePath) & ";" & _
						"User Id=;Password=;" '& _ 
	
	Set rsA = Server.CreateObject("ADODB.Recordset")
	sql = "select * from ProductPhotos where ProductID=" & ProductID & " Order by PhotoOrder"
	'response.write(sql)
	counter = 0

	rsA.Open sql, conn, 3, 3 
	if not rsA.eof then 

    'response.write(" Image=")
  'response.write( rsA("Image"))


	imageone = "/Uploads/Products/" + rsA("ProductPhoto1")
	'response.write(imageone)
	ButtoncounterStart  = Buttoncounter
	counttotal = 6
	While counter < counttotal
		Buttoncounter = Buttoncounter + 1
		counter = counter +1
		currentImage =  "/Uploads/Products/" & rsA("ProductPhoto" & counter) 
		buttonimages(counter) = currentImage

		response.write(currentImage)
%>
<script language="JavaScript">
               if (document.images) version = "n3";
               else version = "n2";
               if (version == "n3") {
				but<%=Buttoncounter%>on = new Image(85, 115);
				but<%=Buttoncounter%>on.src = <%=currentImage%>;
			   }
	

       function img<%=Buttoncounter%>(imgName) {
               if (version == "n3") {
               imgOn = eval("but<%=Buttoncounter%>on.src");
               document [imgName].src = imgOn;               }       }
      
      
</script>

<% 

	Wend
 Buttoncounter = ButtoncounterStart 
%>

<% end if %>



					<% if counter < 1 Then
					     %>
							<table border = "0"   leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 style="border-style: ridge; border-color: #6a7d67 ; border-right-width: 3; border-left-width: 2; border-top-width: 2; border-bottom-width: 3"  width = "250">
							<tr>
								<td>
								     <img src = "/uploads/Products/ImageNotAvailable.jpg" height = "200">
								</td>
							</tr>
						</table>
						<% else  %>
							<table border = "0"   leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  width = "250">
							<tr>
								<td align = "center">
									<IMG alt="main image" border=0  name="but1" src="<%=buttonimages(1)%>" align = "center" height = "200">
								</td>
						</tr>
			</table>
						<% end if%>

<%

	if not rsA.eof then
	rsA.movefirst
	counter = 0
	counttotal = 6
		Buttoncounter = 0
	While counter < counttotal
	
		%>

		<table border="0" cellspacing="0" align = "center" valign = "top" >
			<tr>
		<% for x= 1 to 3
		   	Buttoncounter= Buttoncounter +1
			 if counter = counttotal then
					exit for
             end if 
			bcounter =bcounter +1
			counter = counter +1
			%>
			<td valign = "top" align = "center">
			<font 
			onMouseOver="img<%=Buttoncounter%>('but1'), this.style.cursor = 'hand'" 
			onMouseOut="img<%=Buttoncounter%>('but1>')"  class = "menu">
			<img src="<%=buttonimages(counter)%>" height = "40" alt = "<%=buttontitle(counter)%>" border = "0"></font>
			</td>

		<%

	
				next
		%>
			</tr>
			</table>
		<% 
	wend
	end if
%>
