
<%
	Set rsA = Server.CreateObject("ADODB.Recordset")
	sql = "select * from sfProducts where ProdID='" & ProdID  & "'"
	'response.write(sql)
	counter = 0

	rsA.Open sql, conn, 3, 3 
	if not rsA.eof then 

  'response.write(" Image=")
'response.write( rsA("ProdImage1"))

	 CurrentImage = "/uploads/" & rsA("ProdImage1")
	imageone =  CurrentImage
	'response.write("CurrentImage=" & imageone)

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
					'response.write("CurrentImage=" & CurrentImage)
					if Len(CurrentImage) < 18 Then
					     %>
							<table border = "0"   leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "125" >
							<tr>
								<td>
								     <img src = "/uploads/ImageNotAvailable.jpg" width = "160">
								</td>
							</tr>
						</table>
						<% else  %>
							<table border = "0"   leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "125" >
							<tr>
								<td>
									<a href = "Productdetails.asp?prodID=<%=prodID %>" class = "body" ><IMG alt="main image" border=0  name="but<%=ProductID%>" src="<%=buttonimages(1)%>" align = "center" width = "160"></a>
								</td>
						</tr>
			</table>
						<% end if%>

<%

	if not rsA.eof then
	rsA.movefirst
	counter = 0
	counttotal = 0
	
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
			onMouseOver="img<%=Buttoncounter%>('but<%=ProductID%>'), this.style.cursor = 'hand'" 
			onMouseOut="img<%=Buttoncounter%>('but<%=ProductID%>')"  class = "menu">
			<img src="<%=buttonimages(counter)%>" height = "50" alt = "<%=buttontitle(counter)%>" border = "0"></font>
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
