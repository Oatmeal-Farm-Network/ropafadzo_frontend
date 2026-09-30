<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">

<HTML>
<HEAD>
 <title>Upload Sonsor Logos</title>
 <link rel="stylesheet" type="text/css" href="/administration/style.css">


<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  bgcolor = "white">

<!--#Include virtual="GlobalVariables.asp"-->


<!--#Include virtual="Header.asp"--> 
	
<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 bgcolor = "#fdf4dd" width = "100%"><tr><td Class = "body">
<!--#Include virtual="SponsorsHeader.asp"-->

<%  
	SponsorID=Trim(Request.Form("SponsorID")) 
	If Len(SponsorID) < 1 then
		SponsorID= Request.QueryString("SponsorID") 
	End if
	
	session("SponsorID") =SponsorID
	'response.write("SponsorID=")
	'response.write(SponsorID)
	Dim SponsorIDArray(1000)
	Dim SponsorBusiness(1000)

	 If Len(SponsorID) = 0 Then 

	
		sql2 = "select * from Sponsor, Business where Sponsor.BusinessId = Business.BusinessID and EventID = '" & EventID & "' order by SponsorID Desc"
	
		response.write("SQl2 =" & sql2 )
		acounter = 1
		Set rs2 = Server.CreateObject("ADODB.Recordset")
		rs2.Open sql2, conn, 3, 3 
		
		While Not rs2.eof  
			SponsorIDArray(acounter) = rs2("SponsorID")
			SponsorBusiness(acounter) = rs2("Business")
			acounter = acounter +1
			rs2.movenext
		Wend		
		
		rs2.close
		set rs2=nothing
		set conn = nothing
%>
		<table  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "800">
			<tr>
				<td class = "body">
					<H1>Upload Sponsor Logo </H1>			
				</td>
			</tr>
		</table>
<form action="logosFiberManiaSponsors.asp" method = "post">
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
							<%=SponsorBusiness(count)%>
						</option>
					<% 	count = count + 1
					wend %>
					</select>
					<input type=submit value = "Edit"   >
				</td>
			  </tr>
		    </table>
		  </form>
<% Else %>
	
 <!-- #include file="SponsorPhotoFormInclude.asp" -->
<% End if %>

  <!-- #include file="Footer.asp" -->
 </Body>
</HTML>
