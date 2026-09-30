<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">

<HTML>
<HEAD>
 <title>Edit Sponsors</title>
       <link rel="stylesheet" type="text/css" href="/administration/style.css">


</HEAD>

<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 bgcolor = "white" >

<!--#Include virtual="/Administration/Header.asp"--> 
	</td>
	</tr>
</table>
<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 bgcolor = "#fdf4dd" width = "100%"><tr><td Class = "body">
<!--#Include virtual="/Administration/FiberManiaSponsorsHeader.asp"-->
<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0>
	<tr>
		<td Class = "body">
			<H2>Edit FiberMania Sponsors <br>
			<img src = "images/underline.jpg" width = "660"></H2>
			To make changes to your data, make your changes in the table below then select the "Update" button at the bottom of the page.<br><br>
		</td>
	</tr>
</table>
<% Dim name(2000) 
rowcount = rowcount
%>


<form  action="EditFiberManiasponsorshandle.asp" method = "post">
<table width = "750" border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=5 cellspacing=0>

<%
row = "odd"
rowcount = 1
 sql = "select * from sponsors where show = 'FiberMania " & Year(now) & "' order by sponsorlevel, SponCompany"

'response.write (sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
	
	While Not rs.eof  
	SponID = rs("SponID")
	RanchID = rs("ID")
	Show = rs("Show")
	SponsorLevel  = rs("SponsorLevel")	
	SponCompany = rs("SponCompany")
	SponOwner = rs("SponOwner")
	SponAddress1 = rs("SponAddress1")
	SponAddress2 = rs("SponAddress2")
	Sponcity = rs("Sponcity")
	SponState = rs("SponState")
	SponCountry = rs("SponCountry")
	SponPhone = rs("SponPhone")
	SponEmail = rs("SponEmail")
	SponWebsite = rs("SponWebsite")
	SponLogo = rs("SponLogo")
	SponZip = rs("SponZip")

	 If RanchID < 1 Then
	    showRanchID = "N/A"
		ranchid = 0
	Else
	  showRanchID = RanchID
	End If 

	If Len(SponsorLevel) < 2 Then
		SponsorLevel = " "
	End If 
	%>
	<input type = "hidden" name="SponID(<%=rowcount%>)" value= "<%= SponID %>" >
		<input type = "hidden" name="Show(<%=rowcount%>)" value= "<%= Show %>" >
<tr>
<td Class = "body" align = "right">
<%  If row = "even" Then
		row = "odd"
	Else
		row = "even"
	End if
 If row = "even" Then %>
	<table border = "0" width = "100%"  align = "center" bgcolor = "#c9c9a6">
<% Else %>
	<table border = "0" width = "100%"  align = "center" bgcolor = "#fdf4dd">
<% End If %>
    <tr>
	<td Class = "body" valign = "top">
	<% levels = false
	if levels = true then %>
	Sponsorship Level: <br>
		<select size="1" name="SponsorLevel(<%=rowcount%>)">
			<option value="<%= SponsorLevel %>" selected><%= SponsorLevel %></option>
			<option  value="Grand">Grand</option>
			<option  value="Platinum">Platinum</option>
			<option  value="Gold">Gold</option>
			<option  value="Silver">Silver</option>
			<option  value="Show Patron">Show Patron</option>
			<option  value="Class Sponsor">Class Sponsor</option>
			</select><br>
	<% end if %>
			Web Address: <br><input type = "text" name="SponWebsite(<%=rowcount%>)" value= "<%= SponWebsite %>" size = "30"><br>
			Email:<br>
		<input type = "text" name="SponEmail(<%=rowcount%>)" value= "<%= SponEmail %>" size = "30"><br>
	</td>
	<td Class = "body" valign = "top">
	Company:<br>
		<input type = "text" name="SponCompany(<%=rowcount%>)" value= "<%= SponCompany %>" size = "30"><br>
		Owner:<br>
		<input type = "text" name="SponOwner(<%=rowcount%>)" value= "<%= SponOwner %>" size = "30"><br>
		Phone:<br>
		<input type = "text" name="SponPhone(<%=rowcount%>)" value= "<%= SponPhone %>" >
		
	</td>
	<td Class = "body" width = "220" valign = "top">
	Address:
		<input type = "text" name="SponAddress1(<%=rowcount%>)" value= "<%= SponAddress1 %>" size = "30"><br>
		<input type = "text" name="SponAddress2(<%=rowcount%>)" value= "<%= SponAddress2 %>" size = "30"><br>
		City:<input type = "text" name="Sponcity(<%=rowcount%>)" value= "<%= Sponcity %>" size = "25"><br>
		State:<input type = "text" name="SponState(<%=rowcount%>)" value= "<%= SponState %>" size = "2" >
		Zip: <input type = "text" name="Sponzip(<%=rowcount%>)" value= "<%= SponZip %>" size = "8" ><br>
	</td>
  </tr>
  </table>



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