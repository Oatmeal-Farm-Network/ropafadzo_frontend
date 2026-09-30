<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">

<HTML> 
<HEAD>
 <title>Calendar Maintanance</title>
       <Link rel="stylesheet" type="text/css" href="/Administration/style.css">

</HEAD>

<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  background = "images/background.jpg">



<!--#Include virtual="/Administration/Header.asp"--> 
<!--#Include virtual="/Administration/CalendarHeader.asp"--> 
<table width = "680" height = "300"  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0>
	<tr>

		
<td class = "body" valign = "top">
<%
session("PageName") = "Calendar"
PageName =  "Calendar"
			conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
						"Data Source=" & server.mappath(DatabasePath) & ";" & _
						"User Id=;Password=;" '& _ 
			Set rs = Server.CreateObject("ADODB.Recordset")
			
			sql = "select * from PageLayout where PageName = '" & PageName & "'"
				'response.write(sql)
				rs.Open sql, conn, 3, 3

					If Len(rs("Image1")) > 2 Then
						File1= rs("Image1")
					else
						File1 = "ImageNotAvailable.jpg"
					End If
					
					If Len(rs("Image2")) > 2 Then
						File2= rs("Image2")
					else
						File2 = "ImageNotAvailable.jpg"
					End if
				
					If Len(rs("Image3")) > 2 Then
						File3= rs("Image3")
					else
						File3 = "ImageNotAvailable.jpg"
					End If
					
					If Len(rs("Image4")) > 2 Then
						File4= rs("Image4")
					else
						File4 = "ImageNotAvailable.jpg"
					End if

					str1 = File1
					str2 = "''"
					If InStr(str1,str2) > 0 Then
						File1= Replace(str1,  str2, "'")
					End If  	 

	
					str1 = File2
					str2 = "''"
					If InStr(str1,str2) > 0 Then
						File2= Replace(str1,  str2, "'")
					End If  	 
					str1 = File3
					str2 = "''"
					If InStr(str1,str2) > 0 Then
						File3= Replace(str1,  str2, "'")
					End If  	 
					str1 = File4
					str2 = "''"
					If InStr(str1,str2) > 0 Then
						File4= Replace(str1,  str2, "'")
					End If  	 



					str1 = File1
					str2 = "www"
					If Not(InStr(str1,str2) > 0) Then
				       File1 = "http://www.PNAA.org/Uploads/" & File1
					End If  

					str1 = File2
					str2 = "www"
					If Not(InStr(str1,str2) > 0) Then
				       File2 = "http://www.PNAA.org/Uploads/" & File2
					End If  
	
					str1 = File3
					str2 = "www"
					If Not(InStr(str1,str2) > 0) Then
				       File3 = "http://www.PNAA.org/Uploads/" & File3
					End If  
					str1 = File4
					str2 = "www"
					If Not(InStr(str1,str2) > 0) Then
				       File4 = "http://www.PNAA.org/Uploads/" & File4
					End If  

				rs.close
%>
   

		
  
    <br> 
	
   <table Border = "1" Bgcolor = "#abacab" width = "650" align = "center">
		<tr>
			<td colspan = "2">
				<h1>Left Side Image One</h1>
			</td>
		</tr>
		<tr>
			<td width = "150" align = "center">
					<img src = "<%=File1%>" height = "100">
					
			</td>
			<td class = "body">
					<form name="frmSend" method="POST" enctype="multipart/form-data" action="uploadPageImage.asp" >
						<% If Not (File1 = "ImageNotAvailable.jpg") Then %>
									Current Image Name: <b><% If Len(File1) > 28 Then %>
																					<%=right(File1, Len(File1) - 28)%>
																					<% Else %>
																							<%=File1 %>
																					<% End If %>
									</b><br>
						<% Else %>
							Current Image Name: <b>Not Defined</b><br>
						<% End If %>

						
						
					
						Upload New Photo: <input name="attach1" type="file" size=35 >
						<input  type=submit value="Upload">
					</form>
<table  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 >
						<tr>
							<td bgcolor = "#abacab" height = "2" width = "700"><img src = "images/px.gif" height = "2"></td>
						</tr>
					</table>
					 
<table  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 >
						<tr>
							<td bgcolor = "#abacab" height = "2" width = "700"><img src = "images/px.gif" height = "2"></td>
						</tr>
					</table>
					<form action= 'RemovePageImage.asp' method = "post">
							Would you like to remove this image? 
							<input type = "hidden" name="ImageID" value= "1" >
							<input type = "hidden" name="ID" value= "<%= ID %>" >
							<input type=submit value="Remove This Image">
					</form>
			</td>
		</table>

		
  
    <br> 

	
   <table Border = "1" Bgcolor = "#abacab" width = "650" align = "center">
		<tr>
			<td colspan = "2">
				<h1>Left Side Image Two</h1>
			</td>
		</tr>
		<tr>
			<td width = "150" align = "center">
					<img src = "<%=File2%>" height = "100">
					
			</td>
			<td class = "body">
					<form name="frmSend" method="POST" enctype="multipart/form-data" action="uploadPageImage2.asp" >
						<% If Not (File2 = "ImageNotAvailable.jpg") Then %>
									Current Image Name: <b><% If Len(File2) > 28 Then %>
																					<%=right(File2, Len(File2) - 28)%>
																					<% Else %>
																							<%=File2 %>
																					<% End If %>
									</b><br>
						<% Else %>
							Current Image Name: <b>Not Defined</b><br>
						<% End If %>

						
						
					
						Upload New Photo: <input name="attach1" type="file" size=28 >
						<input  type=submit value="Upload">
					</form>
<table  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 >
						<tr>
							<td bgcolor = "#abacab" height = "2" width = "700"><img src = "images/px.gif" height = "2"></td>
						</tr>
					</table>
					 
<table  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 >
						<tr>
							<td bgcolor = "#abacab" height = "2" width = "700"><img src = "images/px.gif" height = "2"></td>
						</tr>
					</table>
					<form action= 'RemovePageImage.asp' method = "post">
							Would you like to remove this image? 
							<input type = "hidden" name="ImageID" value= "2" >
							<input type = "hidden" name="ID" value= "<%= ID %>" >
							<input type=submit value="Remove This Image">
					</form>
			</td>
		</table>

		
  
    <br> 

	
   <table Border = "1" Bgcolor = "#abacab" width = "650" align = "center">
		<tr>
			<td colspan = "2">
				<h1>Left Side Image Three</h1>
			</td>
		</tr>
		<tr>
			<td width = "150" align = "center">
					<img src = "<%=File3%>" height = "100">
					
			</td>
			<td class = "body">
					<form name="frmSend" method="POST" enctype="multipart/form-data" action="uploadPageImage3.asp" >
						<% If Not (File3= "ImageNotAvailable.jpg") Then %>
									Current Image Name: <b><% If Len(File3) > 28 Then %>
																					<%=right(File3, Len(File3) - 28)%>
																					<% Else %>
																							<%=File3 %>
																					<% End If %>
									</b><br>
						<% Else %>
							Current Image Name: <b>Not Defined</b><br>
						<% End If %>

						
						
					
						Upload New Photo: <input name="attach1" type="file" size=35 >
						<input  type=submit value="Upload">
					</form>
<table  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 >
						<tr>
							<td bgcolor = "#abacab" height = "2" width = "700"><img src = "images/px.gif" height = "2"></td>
						</tr>
					</table>
					 
<table  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 >
						<tr>
							<td bgcolor = "#abacab" height = "2" width = "700"><img src = "images/px.gif" height = "2"></td>
						</tr>
					</table>
					<form action= 'RemovePageImage.asp' method = "post">
							Would you like to remove this image? 
							<input type = "hidden" name="ImageID" value= "3" >
							<input type = "hidden" name="ID" value= "<%= ID %>" >
							<input type=submit value="Remove This Image">
					</form>
			</td>
		</table>

		
  
    <br> 

	
  
    <br> 
</td>
</tr>
</table>
<!--#Include virtual="/administration/Footer2.asp"-->
</Body>
</HTML>