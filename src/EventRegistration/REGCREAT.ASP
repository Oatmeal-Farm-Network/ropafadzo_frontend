<!DOCTYPE html>
<html>
<head>

<%  PageName = "Registry" %>
<!--#Include virtual="GlobalVariables.asp"-->


<title>Registry Login</title>


<link rel="stylesheet" type="text/css" href="BarnStyle.css">


</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center">

<!--#Include file="Header.asp"-->

<table align = "center">
	<tr >
		<td align = "center">

      
<%
UID=Trim(Request.Form("Email")) 
	password=Trim(Request.Form("password")) 
	group1=Trim(Request.Form("group1")) 
	'response.write(group1)


		sql2 = "select * from Registrants where RegEmail = '" & UID & "' or CoRegEmail= '" & UID & "' and (password = '" & password &"' )"
'response.write(sql2)
	acounter = 1
	Set rs2 = Server.CreateObject("ADODB.Recordset")
	rs2.Open sql2, conn, 3, 3 
	

	if Not rs2.eof And Len(UID) > 6 Then
	
regaccessfound = true

		session("RegcustID")= rs2("RegcuistID")

	Else
	session("RegcustID")=""
	end if

rs2.close
Set conn = Nothing



%>
</td>
	</tr>
</table>

<%
	If regaccessfound  = True Or group1 = "NoAccount" Then
	'response.write("Redirect") 
	Response.Redirect("RegCreate.asp")
	else
%>
		<b>Your username or password was incorrect. Please try again.</b>
			<!--#Include file="RegCreateSigninInclude.asp"-->
	
	
	
<%	End if
%>




	


<!--#Include file="Footer.asp"-->
</BODY>
</HTML>
