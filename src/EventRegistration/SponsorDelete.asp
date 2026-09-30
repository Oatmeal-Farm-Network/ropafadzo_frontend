<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">

<HTML>
<HEAD>
 <title>Delete an Alpaca Page</title>
       <link rel="stylesheet" type="text/css" href="/administration/style.css">

</HEAD>

<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  bgcolor = "white">

<!--#Include virtual="/Administration/Header.asp"--> 
	</td>
	</tr>
</table>
<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 bgcolor = "#fdf4dd" width = "100%"><tr><td Class = "body">
<!--#Include virtual="/Administration/SponsorHeader.asp"-->
<table leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0>
	<tr>
		<td class = "body">
			 <H2>Delete a Sponsor<br>
			<img src = "images/underline.jpg"></H2>
			To delete an Sponsor simply select the sponsor's name and push the "delete" button.<br> <b>But careful. Once a sponsor is deleted, it's gone!</b></td></tr></table>

<%  
	response.write("SponsorDelete is used")
	dim SponID(4000)
	dim SponCompany(4000)
	Dim SponOwner(4000)
	
	show = "AlpacaMania " & Year(now)
	
	sql2 = "select * from Sponsors where show = '" & show & "' order by SponCompany"

	acounter = 1
	Set rs2 = Server.CreateObject("ADODB.Recordset")
	rs2.Open sql2, conn, 3, 3 
	
	While Not rs2.eof  
		SponID(acounter) = rs2("SponID")
		SponCompany(acounter) = rs2("SponCompany")
		SponOwner(acounter) = rs2("SponOwner")
		'response.write (SSName(studcounter))
		acounter = acounter +1
		rs2.movenext
	Wend		
	
	rs2.close
	set rs2=nothing
	set conn = nothing

%>

	<form action= 'DeleteSponsorhandleform.asp' method = "post">
<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0>
	<tr>
		<td>
<input type = "hidden" name="PhotoType" value= "ListPage">
			   <table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0>
			   <tr>
				 <td>
					<b>Sponsor's Name:</b><br>
					<select size="1" name="sponID">
					<option name = "AID0" value= "" selected></option>
					<% count = 1
						while count < acounter
						response.write(count)
					%>
						<option name = "AID1" value="<%=SponID(count)%>">
							<%=SponCompany(count)%> (<%=SponOwner(count)%>)
						</option>
					<% 	count = count + 1
					wend %>
					</select>
				</td>
				<td>
					<br>
					<input type=submit value = "Delete"  >
				</td>
			  </tr>
		    </table>
		  </form>
		</td>
	</tr>
</table>

<!--#Include virtual="/Footer.asp"--> </Body>
</HTML>