<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">

<HTML>
<HEAD>
 <title>Edit Members</title>
       <link rel="stylesheet" type="text/css" href="/administration/style.css">


</HEAD>

<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 bgcolor = "white" >

<!--#Include virtual="/Administration/Header.asp"--> 
<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0>
	<tr>
		<td Class = "body">
			<H2>Assign AlpacaMania Members <br>
			<img src = "images/underline.jpg" width = "660"></H2>
			To make changes to your data, make your changes in the table below then select the "Submit Changes" button at the bottom of the page.<br><br>
		</td>
	</tr>
</table>
<% Dim name(2000) 
rowcount = rowcount
%>

<form  action="editalpacamaniamembershandle.asp" method = "post">
<table width = "750" border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=5 cellspacing=0>
<tr>
	<td Class = "body" align = "center">
		<b>Position</b>
	</td>
	<td Class = "body" align = "center">
		<b>Name</b>
	</td>
		<td Class = "body" align = "center">
		<b>Ranch</b>
	</td>
		<td Class = "body" align = "center">
		<b>Phone</b>
	</td>
</tr>
<% 
rowcount = 1
conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
"Data Source=" & server.mappath(DatabasePath) & ";" & _
						"User Id=;Password=;" '& _ 
 sql = "select * from AlpacaManiateam order by AMID"

'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	
	While Not rs.eof  
	AMID = rs("AMID")
	Position = rs("Position")
	MemberName = rs("MemberName")
	Phone  = rs("Phone")	
	 RanchID = rs("RanchID")
	 If RanchID < 1 Then
	    showRanchID = "N/A"
		ranchid = 0
	Else
	  showRanchID = RanchID
	End If 
	%>
<tr>
	<td Class = "body" align = "right">
		<input type = "hidden" name="AMID(<%=rowcount%>)" value= "<%= AMID %>" ><b><%=Position %>: </b>&nbsp;
	</td>
	<td Class = "body">
			<input type = "text" name="MemberName(<%=rowcount%>)" value= "<%= MemberName %>" >
	</td>
		<td Class = "body">
	  <%  Set rs2 = Server.CreateObject("ADODB.Recordset")	
		If RanchID > 0 then
			sql2 = "select custCompany from sfcustomers where custid = " & ranchID
		    rs2.Open sql2, conn, 3, 3   
			If Not rs2.eof then
				memberranch = rs2("Custcompany")
			Else
			memberranch = "N/A"
			End If 
				rs2.close 
		Else 
		memberranch = "N/A"
		End If %>

		<select size="1" name="RanchID(<%=rowcount%>)">
			<option value="<%= RanchID %>" selected><%= memberranch %></option>
			<option  value="0">N/A</option>
				
<% sql3 = "select custID, custCompany from sfcustomers order by custcompany"

'response.write (sql)

    rs2.Open sql3, conn, 3, 3   
	
	While Not rs2.eof  %>
	<option  value="<%=rs2("CustID")%>"><%=rs2("CustCompany")%></option>
 <%  rs2.movenext
  Wend %>
		</select>
	</td>
		<td Class = "body">
		<input type = "text" name="Phone(<%=rowcount%>)" value= "<%= Phone %>" >
	</td>
</tr>



<% rowcount = rowcount + 1
		rs.movenext
	Wend		
%>
<tr><td colspan = "4" align = "center">

<input type = "hidden" name="TotalCount" value= "<%= rowcount - 1 %>" >
	<input type=submit value = "update" >
</td></tr></table>
</form>

<!--#Include virtual="/Footer.asp"--> 

</Body>
</HTML>