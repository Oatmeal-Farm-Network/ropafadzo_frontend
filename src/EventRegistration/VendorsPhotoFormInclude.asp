
<%

	Set rs = Server.CreateObject("ADODB.Recordset")		
	sql = "select * from Vendors where Venid = " & VenID
	'response.write(sql)
	rs.Open sql, conn, 3, 3

	If rs.eof Then
		Query =  "INSERT INTO Vendors (VenID)" 
		Query =  Query & " Values (" &  VenID & ")"
		'response.write(Query)
		Conn.Execute(Query) 
		rs.close

		sql = "select * from Vendors where VenID = " & VenID
		'response.write(sql)
		rs.Open sql, conn, 3, 3		
	End If 

If Len(rs("VenLogo")) > 2 Then
  File1= rs("VenLogo")
else
		File1 = "http://www.sojaa.com/uploads/logos/ImageNotAvailable.jpg"
End if
str1 = File1
str2 = "''"
If InStr(str1,str2) > 0 Then
	File1= Replace(str1,  str2, "'")
End If  	 

VendorCompany = rs("VenCompany")
rs.close
			
%>
    <table  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "800">
		<tr>
			<td class = "body">
				<H1>Upload Vendor Logo for <%=VendorCompany %></H1>			
			</td>
		</tr>
	</table>


	
<%  
	Dim VenLogo(1000)
	Dim VendorText(1000)
	
	sql2 = "select * from Vendors order by VenCompany ;"
	'response.write(sql2)
	acounter = 1
	Set rs2 = Server.CreateObject("ADODB.Recordset")
	rs2.Open sql2, conn, 3, 3 
	
	While Not rs2.eof  
		VenIDArray(acounter) = rs2("VenID")
		VenCompany(acounter) = rs2("VenCompany")
		VenLogo(acounter) = rs2("VenLogo")
		'response.write (SSName(studcounter))

		acounter = acounter +1
		rs2.movenext
	Wend		
	
		rs2.close
		set rs2=nothing
		set conn = nothing



%>
		<font class = "body">
		<form  action="logosVendors.asp" method = "post">
			<h2>Select Another Vendor</h2>
			Select a Vendor below and push the edit button to update an Vendor:<br>
			  
			  <table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0>
			   <tr>
				<td colspan ="30">
					&nbsp;
				</td>
				 <td class = "body">
					<br>Select one of your Vendors:
					<select size="1" name="VenID">
					<option name = "AVenID0" value= "" selected></option>
					<% count = 1
						while count < acounter
						response.write(count)
					%>
						<option name = "AVenID1" value="<%=VenIDArray(count)%>">
							<%=VenCompany(count)%>
						</option>
					<% 	count = count + 1
					wend %>
					</select>
					<input type=submit value = "Edit"  >
				</td>
			  </tr>
		    </table>
	 </form>
	 </font>
   <table Border = "1" Bgcolor = "#dddddd" width = "750" align = "center">
		<tr>
			<td colspan = "2">
				<h1>Vendor Logo</h1>
			</td>
		</tr>
		<tr>
			<td width = "150" align = "center">
					<img src = "/uploads/logos/<%=File1%>" width = "100">
					<center><b><%=PhotoCaption1%></b></center>
			</td>
			<td class = "body">
					<form name="frmSend" method="POST" enctype="multipart/form-data" action="uploadVenLogo.asp" >
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
					<form action= 'AMLogoRemoveImage.asp' method = "post">
							Would you like to remove this image? 
							<input type = "hidden" name="ImageID" value= "1" >
							<input type = "hidden" name="VenID" value= "<%= VenID %>" >
							<input type=submit value="Remove This Image">
					</form>
			</td>
		</table>

		
  
    <br> 