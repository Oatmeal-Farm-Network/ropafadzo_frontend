
<%

 	Set rsA = Server.CreateObject("ADODB.Recordset")
	sql = "select * from sfProducts where ProdID='" & ID  & "'"
	'response.write(sql)
	counter = 0

	rsA.Open sql, conn, 3, 3 
	if not rsA.eof then 

  'response.write(" Image=")
'response.write( rsA("ProdImage1"))

	 CurrentImage = "/uploads/" & rsA("ProdImageLargePath")
	imageone =  CurrentImage
	'response.write(imageone)

	ButtoncounterStart  = Buttoncounter
	counttotal = rsA.recordcount
	While counter < counttotal
		Buttoncounter = Buttoncounter + 1
		counter = counter +1
		CurrentImage = "/uploads/" & rsA("ProdImage1")
		buttonimages(counter) = CurrentImage

		'response.write(CurrentImage)
%>
<script language="JavaScript">
               if (document.images) version = "n3";
               else version = "n2";
               if (version == "n3") {
				but<%=Buttoncounter%>on = new Image(85, 115);
				but<%=Buttoncounter%>on.src = "<%=CurrentImage%>";
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



					<%
					
					if Len(CurrentImage) < 18 Then
					     %>
							<table border = "0"   leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "100" >
							<tr>
								<td>
								     <img src = "/uploads/ImageNotAvailable.jpg" width = "95">
								</td>
							</tr>
						</table>
						<% else  %>
							<table border = "0"   leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "100" >
							<tr>
								<td>
									<IMG alt="main image" border=0  name="but<%=ProductID%>" src="<%=buttonimages(1)%>" align = "center" width = "95">
								</td>
						</tr>
			</table>
						<% end if%>

