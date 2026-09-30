
<%
	Set rs = Server.CreateObject("ADODB.Recordset")			
	sql = "select * from Sponsors where SponsorID = " & SponsorID
	'	response.write(sql)
	rs.Open sql, conn, 3, 3

	If rs.eof Then
		Query =  "INSERT INTO Sponsors (SponsorID)" 
		Query =  Query & " Values (" &  SponsorID & ")"
		'response.write(Query)
		
		Conn.Execute(Query) 
		rs.close
		sql = "select * from Sponsors where SponsorID = " & SponsorID
		'response.write(sql)
		rs.Open sql, conn, 3, 3
	End If 

	If Len(rs("SponsorLogo")) > 2 Then
	  File1= rs("SponLogo")
	else
			File1 = "ImageNotAvailable.jpg"
	End if
	str1 = File1
	str2 = "''"
	If InStr(str1,str2) > 0 Then
		File1= Replace(str1,  str2, "'")
	End If  	 
	
	SponsorCompany = rs("SponCompany")
	rs.close
			
%>
    <table  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "800">
		<tr>
			<td class = "body">
				<H1>Upload Sponsor Logo for <%=SponsorCompany %></H1>			
			</td>
		</tr>
	</table>


	
<%  
	Dim SponLogo(1000)
	Dim SponsorText(1000)


	sql2 = "select * from Sponsors order by SponCompany ;"
	'response.write(sql2)
	acounter = 1
	Set rs2 = Server.CreateObject("ADODB.Recordset")
	rs2.Open sql2, conn, 3, 3 
	
	While Not rs2.eof  
		SponsorIDArray(acounter) = rs2("SponsorID")
		SponCompany(acounter) = rs2("SponCompany")
		SponLogo(acounter) = rs2("SponLogo")
		'response.write (SSName(studcounter))

		acounter = acounter +1
		rs2.movenext
	Wend		
	
	rs2.close
	set rs2=nothing
	set conn = nothing
%>
		<font class = "body">
		<form  action="logosFiberManiaSponsors.asp" method = "post">
			<h2>Select Another Sponsor</h2>
			Select a Sponsor below and push the edit button to update an Sponsor:<br>
			  
			  <table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0>
			   <tr>
				<td colspan ="30">
					&nbsp;
				</td>
				 <td class = "body">
					<br>Select one of your Sponsors:
					<select size="1" name="SponsorID">
					<option name = "ASponsorID0" value= "" selected></option>
					<% count = 1
						while count < acounter
						response.write(count)
					%>
						<option name = "ASponsorID1" value="<%=SponsorIDArray(count)%>">
							<%=SponCompany(count)%>
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
				<h1>Sponsor Logo</h1>
			</td>
		</tr>
		<tr>
			<td width = "150" align = "center">
					<img src = "/uploads/logos/<%=File1%>" width = "100">
					<center><b><%=PhotoCaption1%></b></center>
			</td>
			<td class = "body">
					<form name="frmSend" method="POST" enctype="multipart/form-data" action="uploadSponLogo.asp?show=<%=showname1%>" >
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
					<form action= 'ShowLogoRemoveImage.asp' method = "post">
							Would you like to remove this image?
							<input type = "hidden" name="show" value= "<%=showname1%>" > 
							<input type = "hidden" name="ImageID" value= "1" >
							<input type = "hidden" name="SponsorID" value= "<%= SponsorID %>" >
							<input type=submit value="Remove This Image">
					</form>
			</td>
		</table>

		
  
    <br> 