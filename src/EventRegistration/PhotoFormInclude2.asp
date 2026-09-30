<%

			conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
						"Data Source=" & server.mappath(DatabasePath) & ";" & _
						"User Id=;Password=;" '& _ 
			Set rs = Server.CreateObject("ADODB.Recordset")
			
			sql = "select * from Photos where id = " & ID
				'response.write(sql)
				rs.Open sql, conn, 3, 3

				If rs.eof Then
					Query =  "INSERT INTO Photos (ID)" 
					Query =  Query & " Values (" &  ID & ")"

					'response.write(Query)
					
					Set DataConnection = Server.CreateObject("ADODB.Connection")

					DataConnection.Open "DRIVER={Microsoft Access Driver (*.mdb)};DBQ=" & Server.MapPath(DatabasePath) & ";" 
					DataConnection.Execute(Query) 
				rs.close

				sql = "select * from Photos where id = " & ID
				'response.write(sql)
				rs.Open sql, conn, 3, 3
				
				End If 

					If Len(Filename) > 2 Then
						File1 =Filename
					else
						File1= rs("Photo1")
					End If
					 If Len(File1) < 2 Then
						File1 = "ImageNotAvailable.jpg"
					End if

					If Len(Filename2) > 2 Then
						File2 =Filename2
					else
						File2= rs("Photo2")
					End If
					 If Len(File2) < 2 Then
						File2 = "ImageNotAvailable.jpg"
					End if

					If Len(Filename3) > 2 Then
						File3 =Filename3
					else
						File3= rs("Photo3")
					End If
					 If Len(File3) < 2 Then
						File3 = "ImageNotAvailable.jpg"
					End if

					If Len(Filename4) > 2 Then
						File4 =Filename4
					else
						File4= rs("Photo4")
					End If
					 If Len(File4) < 2 Then
						File4 = "ImageNotAvailable.jpg"
					End if

					If Len(Filename5) > 2 Then
						File5 =Filename5
					else
						File5= rs("Photo5")
					End If
					 If Len(File5) < 2 Then
						File5 = "ImageNotAvailable.jpg"
					End if

	If Len(Filename6) > 2 Then
						File6 =Filename6
					else
						File6= rs("Photo6")
					End If
					 If Len(File6) < 2 Then
						File6 = "ImageNotAvailable.jpg"
					End if

					If Len(Filename7) > 2 Then
						File7 =Filename7
					else
						File7= rs("Photo7")
					End If
					 If Len(File7) < 2 Then
						File7 = "ImageNotAvailable.jpg"
					End if

					If Len(Filename8) > 2 Then
						File8 =Filename8
					else
						File8= rs("Photo8")
					End If
					 If Len(File8) < 2 Then
						File8 = "ImageNotAvailable.jpg"
					End if

	     If len(rs("PhotoCaption1")) > 1 then
				   PhotoCaption1 = rs("PhotoCaption1")
		End If 
		 If len(rs("PhotoCaption2")) > 1 then
				   PhotoCaption2 = rs("PhotoCaption2")
		End If 
		 If len(rs("PhotoCaption3")) > 1 then
				   PhotoCaption3 = rs("PhotoCaption3")
		End If 
		 If len(rs("PhotoCaption4")) > 1 then
				   PhotoCaption4 = rs("PhotoCaption4")
		End If 
		 If len(rs("PhotoCaption5")) > 1 then
				   PhotoCaption5 = rs("PhotoCaption5")
		End If 
		 If len(rs("PhotoCaption6")) > 1 then
				   PhotoCaption6 = rs("PhotoCaption6")
		End If 
		 If len(rs("PhotoCaption1")) > 1 then
				   PhotoCaption1 = rs("PhotoCaption1")
		End If 
		 If len(rs("PhotoCaption7")) > 1 then
				   PhotoCaption7 = rs("PhotoCaption7")
		End If 
		If len(rs("PhotoCaption8")) > 1 then
				   PhotoCaption8 = rs("PhotoCaption8")
		End If 

'response.write(File5)
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
			
			str1 = File5
			str2 = "''"
			If InStr(str1,str2) > 0 Then
				File5= Replace(str1,  str2, "'")
			End If  	 
			
			str1 = File6
			str2 = "''"
			If InStr(str1,str2) > 0 Then
				File6= Replace(str1,  str2, "'")
			End If  	
			
			str1 = File7
			str2 = "''"
			If InStr(str1,str2) > 0 Then
				File7= Replace(str1,  str2, "'")
			End If  
			
			str1 = File8
			str2 = "''"
			If InStr(str1,str2) > 0 Then
				File8= Replace(str1,  str2, "'")
			End If  


				rs.close
%>
    <table  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "800">
		<tr>
			<td class = "body">
				<H1>Upload Photos for <%=Name%></H1>			
			</td>
		</tr>
	</table>


	
			<%  


	conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
"Data Source=" & server.mappath(DatabasePath) & ";" & _
						"User Id=;Password=;" 
	sql2 = "select * from Animals where CustID = " & Session("custID") & " order by Fullname ;"
'response.write(sql2)
	acounter = 1
	Set rs2 = Server.CreateObject("ADODB.Recordset")
	rs2.Open sql2, conn, 3, 3 
	
	While Not rs2.eof  
		IDArray(acounter) = rs2("ID")
		alpacaName(acounter) = rs2("FullName")
		'response.write (SSName(studcounter))

		acounter = acounter +1
		rs2.movenext
	Wend		
	
		rs2.close
		set rs2=nothing
		set conn = nothing



%>
		<font class = "body">
		<form  action="AdminPhotos.asp" method = "post">
			<h2>Select Another Product</h2>
			Select an animal below and push the edit button to update an animal's photos:<br>
			  
			  <table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0>
			   <tr>
				<td colspan ="30">
					&nbsp;
				</td>
				 <td class = "body">
					<br>Select one of your alpacas:
					<select size="1" name="ID">
					<option name = "AID0" value= "" selected></option>
					<% count = 1
						while count < acounter
						response.write(count)
					%>
						<option name = "AID1" value="<%=IDArray(count)%>">
							<%=alpacaName(count)%>
						</option>
					<% 	count = count + 1
					wend %>
					</select>
					<input type=submit value = "Edit" style="background-image: url('images/background.jpg'); border-width:1px" size = "210" class = "menu" >
				</td>
			  </tr>
		    </table>
	 </form>
	 </font>
   <table Border = "1" Bgcolor = "#dddddd" width = "750" align = "center">
		<tr>
			<td colspan = "2">
				<h1>Main Image</h1>
			</td>
		</tr>
		<tr>
			<td width = "150" align = "center">
					<img src = "../../Uploads/<%=File1%>" height = "100">
					<center><b><%=PhotoCaption1%></b></center>
			</td>
			<td class = "body">
					<form name="frmSend" method="POST" enctype="multipart/form-data" action="uploadTester.asp" >
						<% If Not (File1 = "ImageNotAvailable.jpg") Then %>
									Current Image Name: <b><%=File1%></b><br>
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
					 <form action= 'Addcaption.asp' method = "post">
							Current Caption: <b><%=PhotoCaption1%></b><br>
							New Caption (11 Character Max.): <input name="Caption" Value =""  size = "10" maxlength = "11">
							<input type = "hidden" name="CaptionID" value= "1" >
							<input type = "hidden" name="ID" value= "<%= ID %>" >
							<input type=submit value="Submit">
					</form>
<table  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 >
						<tr>
							<td bgcolor = "#abacab" height = "2" width = "700"><img src = "images/px.gif" height = "2"></td>
						</tr>
					</table>
					<form action= 'RemoveImage.asp' method = "post">
							Would you like to remove this image? 
							<input type = "hidden" name="ImageID" value= "1" >
							<input type = "hidden" name="ID" value= "<%= ID %>" >
							<input type=submit value="Remove This Image">
					</form>
			</td>
		</table>

		 <table Border = "1" Bgcolor = "#dddddd" width = "750" align = "center">
		<tr>
			<td colspan = "2">
				<h1>Image 2</h1>
			</td>
		</tr>
		<tr>
			<td width = "150" align = "center" class = "body">
					<img src = "../../Uploads/<%=File2%>" height = "100">
					<center><b><%=PhotoCaption2%></b></center>
			</td>
			<td class = "body">
					<form name="frmSend" method="POST" enctype="multipart/form-data" action="uploadTester2.asp" onSubmit="return onSubmitForm();">
						<% If Not (File2 = "ImageNotAvailable.jpg") Then %>
									Current Image Name: <b><%=File2%></b><br>
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
					 <form action= 'Addcaption.asp' method = "post" >
							Current Caption: <b><%=PhotoCaption2%></b><br>
							New Caption (11 Character Max.): <input name="Caption" Value =""  size = "10" maxlength = "11">
							<input type = "hidden" name="ID" value= "<%= ID %>" >
									<input type = "hidden" name="CaptionID" value= "2" >
							<input type=submit value="Submit">
					</form>
						
					<table  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 >
						<tr>
							<td bgcolor = "#abacab" height = "2" width = "700"><img src = "images/px.gif" height = "2"></td>
						</tr>
					</table>
					<form action= 'RemoveImage.asp' method = "post">
							Would you like to remove this image? 
							<input type = "hidden" name="ImageID" value= "2" >
							<input type = "hidden" name="ID" value= "<%= ID %>" >
							<input type=submit value="Remove This Image">
					</form>
			</td>
		</table>
  
   <table Border = "1" Bgcolor = "#dddddd" width = "750" align = "center">
		<tr>
			<td colspan = "2">
				<h1>Image 3</h1>
			</td>
		</tr>
		<tr>
			<td width = "150" align = "center" class = "body">
					<img src = "../../Uploads/<%=File3%>" height = "100">
					<center><b><%=PhotoCaption3%></b></center>
			</td>
			<td class = "body">
					<form name="frmSend" method="POST" enctype="multipart/form-data" action="uploadTester3.asp" onSubmit="return onSubmitForm();">
						<% If Not (File3 = "ImageNotAvailable.jpg") Then %>
									Current Image Name: <b><%=File3%></b><br>
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
					 <form action= 'Addcaption.asp' method = "post">
							Current Caption: <b><%=PhotoCaption3%></b><br>
							New Caption (11 Character Max.): <input name="Caption" Value =""  size = "10" maxlength = "11">
							<input type = "hidden" name="ID" value= "<%= ID %>" >
								<input type = "hidden" name="CaptionID" value= "3" >
							<input type=submit value="Submit">
					</form>
					<table  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 >
						<tr>
							<td bgcolor = "#abacab" height = "2" width = "700"><img src = "images/px.gif" height = "2"></td>
						</tr>
					</table>
					<form action= 'RemoveImage.asp' method = "post">
							Would you like to remove this image? 
							<input type = "hidden" name="ImageID" value= "3" >
							<input type = "hidden" name="ID" value= "<%= ID %>" >
							<input type=submit value="Remove This Image">
					</form>
			</td>
		</table>
  
   <table Border = "1" Bgcolor = "#dddddd" width = "750" align = "center">
		<tr>
			<td colspan = "2">
				<h1>Image 4</h1>
			</td>
		</tr>
		<tr>
			<td width = "150" align = "center" class = "body">
					<img src = "../../Uploads/<%=File4%>" height = "100">
					<center><b><%=PhotoCaption4%></b></center>
			</td>
			<td class = "body">
					<form name="frmSend" method="POST" enctype="multipart/form-data" action="uploadTester4.asp" onSubmit="return onSubmitForm();">
					<% If Not (File4 = "ImageNotAvailable.jpg") Then %>
									Current Image Name: <b><%=File4%></b><br>
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
					 <form action= 'Addcaption.asp' method = "post">
							Current Caption: <b><%=PhotoCaption4%></b><br>
							New Caption (11 Character Max.): <input name="Caption" Value =""  size = "10" maxlength = "11">
							<input type = "hidden" name="ID" value= "<%= ID %>" >
								<input type = "hidden" name="CaptionID" value= "4" >
							<input type=submit value="Submit">
					</form>
					<table  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 >
						<tr>
							<td bgcolor = "#abacab" height = "2" width = "700"><img src = "images/px.gif" height = "2"></td>
						</tr>
					</table>
					<form action= 'RemoveImage.asp' method = "post">
							Would you like to remove this image? 
							<input type = "hidden" name="ImageID" value= "4" >
							<input type = "hidden" name="ID" value= "<%= ID %>" >
							<input type=submit value="Remove This Image">
					</form>
			</td>
		</table>
  
   <table Border = "1" Bgcolor = "#dddddd" width = "750" align = "center">
		<tr>
			<td colspan = "2">
				<h1>Image 5</h1>
			</td>
		</tr>
		<tr>
			<td width = "150" align = "center" class = "body">
					<img src = "../../Uploads/<%=File5%>" height = "100">
					<center><b><%=PhotoCaption5%></b></center>
			</td>
			<td class = "body">
					<form name="frmSend" method="POST" enctype="multipart/form-data" action="uploadTester5.asp" onSubmit="return onSubmitForm();">
						<% If Not (File5 = "ImageNotAvailable.jpg") Then %>
									Current Image Name: <b><%=File5%></b><br>
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
					 <form action= 'Addcaption.asp' method = "post">
							Current Caption: <b><%=PhotoCaption5%></b><br>
							New Caption (11 Character Max.): <input name="Caption" Value =""  size = "10" maxlength = "11">
							<input type = "hidden" name="ID" value= "<%= ID %>" >
								<input type = "hidden" name="CaptionID" value= "5" >
							<input type=submit value="Submit">
					</form>
					<table  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 >
						<tr>
							<td bgcolor = "#abacab" height = "2" width = "700"><img src = "images/px.gif" height = "2"></td>
						</tr>
					</table>
					<form action= 'RemoveImage.asp' method = "post">
							Would you like to remove this image? 
							<input type = "hidden" name="ImageID" value= "5" >
							<input type = "hidden" name="ID" value= "<%= ID %>" >
							<input type=submit value="Remove This Image">
					</form>
			</td>
		</table>
  
   <table Border = "1" Bgcolor = "#dddddd" width = "750" align = "center">
		<tr>
			<td colspan = "2">
				<h1>Image 6</h1>
			</td>
		</tr>
		<tr>
			<td width = "150" align = "center" class = "body">
					<img src = "../../Uploads/<%=File6%>" height = "100">
					<center><b><%=PhotoCaption6%></b></center>
			</td>
			<td class = "body">
					<form name="frmSend" method="POST" enctype="multipart/form-data" action="uploadTester6.asp" onSubmit="return onSubmitForm();">
						<% If Not (File6 = "ImageNotAvailable.jpg") Then %>
									Current Image Name: <b><%=File6%></b><br>
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
					 <form action= 'Addcaption.asp' method = "post">
							Current Caption: <b><%=PhotoCaption6%></b><br>
							New Caption (11 Character Max.): <input name="Caption" Value =""  size = "10" maxlength = "11">
							<input type = "hidden" name="ID" value= "<%= ID %>" >
								<input type = "hidden" name="CaptionID" value= "6" >
							<input type=submit value="Submit">
					</form>
					<table  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 >
						<tr>
							<td bgcolor = "#abacab" height = "2" width = "700"><img src = "images/px.gif" height = "2"></td>
						</tr>
					</table>
					<form action= 'RemoveImage.asp' method = "post">
							Would you like to remove this image? 
							<input type = "hidden" name="ImageID" value= "6" >
							<input type = "hidden" name="ID" value= "<%= ID %>" >
							<input type=submit value="Remove This Image">
					</form>
			</td>
		</table>
  
   <table Border = "1" Bgcolor = "#dddddd" width = "750" align = "center">
		<tr>
			<td colspan = "2">
				<h1>Image 7</h1>
			</td>
		</tr>
		<tr>
			<td width = "150" align = "center" class = "body">
					<img src = "../../Uploads/<%=File7%>" height = "100">
					<center><b><%=PhotoCaption7%></b></center>
			</td>
			<td class = "body">
					<form name="frmSend" method="POST" enctype="multipart/form-data" action="uploadTester7.asp" onSubmit="return onSubmitForm();">
						<% If Not (File7 = "ImageNotAvailable.jpg") Then %>
									Current Image Name: <b><%=File7%></b><br>
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
					 <form action= 'Addcaption.asp' method = "post">
							Current Caption: <b><%=PhotoCaption7%></b><br>
							New Caption (11 Character Max.): <input name="Caption" Value =""  size = "10" maxlength = "11">
							<input type = "hidden" name="ID" value= "<%= ID %>" >
								<input type = "hidden" name="CaptionID" value= "7" >
							<input type=submit value="Submit">
					</form>
<table  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 >
						<tr>
							<td bgcolor = "#abacab" height = "2" width = "700"><img src = "images/px.gif" height = "2"></td>
						</tr>
					</table>
					<form action= 'RemoveImage.asp' method = "post">
							Would you like to remove this image? 
							<input type = "hidden" name="ImageID" value= "7" >
							<input type = "hidden" name="ID" value= "<%= ID %>" >
							<input type=submit value="Remove This Image">
					</form>
					
			</td>
		</table>
  
   <table Border = "1" Bgcolor = "#dddddd" width = "750" align = "center">
		<tr>
			<td colspan = "2">
				<h1>Image 8</h1>
			</td>
		</tr>
		<tr>
			<td width = "150" align = "center" class = "body">
					<img src = "../../Uploads/<%=File8%>" height = "100">
					<center><b><%=PhotoCaption8%></b></center>
			</td>
			<td class = "body">
					<form name="frmSend" method="POST" enctype="multipart/form-data" action="uploadTester8.asp" onSubmit="return onSubmitForm();">
						<% If Not (File8 = "ImageNotAvailable.jpg") Then %>
									Current Image Name: <b><%=File8%></b><br>
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
					 <form action= 'Addcaption.asp' method = "post">
							Current Caption: <b><%=PhotoCaption8%></b><br>
						New Caption (11 Character Max.): <input name="Caption" Value =""  size = "10" maxlength = "11">
							<input type = "hidden" name="ID" value= "<%= ID %>" >
							<input type = "hidden" name="CaptionID" value= "8" >
							<input type=submit value="Submit">
					</form>
<table  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 >
						<tr>
							<td bgcolor = "#abacab" height = "2" width = "700"><img src = "images/px.gif" height = "2"></td>
						</tr>
					</table>
					
					<form action= 'RemoveImage.asp' method = "post">
							Would you like to remove this image? 
							<input type = "hidden" name="ImageID" value= "8" >
							<input type = "hidden" name="ID" value= "<%= ID %>" >
							<input type=submit value="Remove This Image">
					</form>
			</td>
		</table>
  
    <br> 