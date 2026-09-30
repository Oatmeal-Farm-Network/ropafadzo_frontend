
<html>
<head>

<%  PageName = "Registry" %>
<!--#Include virtual="GlobalVariablesNotLoggedIn.asp"-->
<title>Create Event</title>
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title><%= SEOTitle %> </title>
<meta name="author" content="AndresenEvents.com">
<link rel="shortcut icon" href="<%=ShortIcon%>" /> 
<link rel="icon" href="<%=LongIcon%>" /> 
<meta name="author" content="The Andresen Group">
<link rel="stylesheet" type="text/css" href="Style.css">

</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center">

<!--#Include file="Header.asp"-->

<table  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "600" align = "center">
	<tr >
		<td align = "left" class = "body" valign = "top">
<%
Dim email
Dim Password
Dim Name
InSystem = False

email=Request.Form("email")
sql = "select * from People where PeopleEmail = '" & email & "'"
Set rs = Server.CreateObject("ADODB.Recordset")
 response.write(sql)
	
	rs.Open sql, conn, 3, 3 
	If  rs.eof Or Len(email) < 5 Then
		InSystem = False
Else
		InSystem = True
		Password  = rs("Peoplepassword")
		name  = rs("PeopleFirstName") & " " & rs("PeopleLastName")

    rs.close
	Response.Flush

'Email Contact Information to The Andresen Group
Dim strTo, strSubject, strBody
Dim objCDONTSmail
Dim smtpServer
	'response.write("From The Heart Ranch")
	smtpServer = "mail.artisanbarn.com"
	strFrom = "info@artisanbarn.org"
	strTo = email


	strSubject = "Your Andresen Events Password"


	' Body Data
	strBody = strBody & "Dear  "
	strBody = strBody & name & ",<br><br>"
	strBody = strBody & "You indicated that you have forgotten your Andresen Events password. It is provided below:<br><br>"

	strBody = strBody & "Your password: "
	strBody = strBody & "<b>" & Password & "</b>"

	strBody = strBody & "<br><br>If you didn’t request this email, please contact us at 541-831-0103.<br><br>Thank You.<br><br>Sincerely,<br><br>Andresen Events<br><br><br>----------------------------------------------------------------<br>Protect Your Password<br><br>NEVER give your password to anyone, including AndresenEvents.com representatives. Protect yourself against fraudulent websites by opening a new web browser (e.g. Internet Explorer or Netscape) and typing in the AndresenEvents.com URL every time you log in to your account.<br><br>----------------------------------------------------------------<br><br>"


	'CDONTS EMail
	set objCDONTSmail = Server.CreateObject("CDONTS.NewMail")
	objCDONTSmail.BodyFormat = 0
	objCDONTSmail.MailFormat = 0
	objCDONTSmail.From = strFrom
	objCDONTSmail.To = strTo
	objCDONTSmail.Subject = strSubject
	objCDONTSmail.Body = strBody
	objCDONTSmail.Send

set objCDONTSmail = Nothing

bidtime = FormatDateTime(now,0)
'response.write(bidtime)

End if		

If 	InSystem = True then
%>

	<blockquote>	
<h1>Your password has been sent to you. </h1>
You should receive an email at <%= email%>. Please go to the <A href= "regcreateSignIn.asp" class = "body">Sign In Page</a> and enter your e-mail and password.<br><br>

If you don't receive an email, check your bulk mail folder or try to recover your password using a different email address. (You may have registered for your  account using a different address.)
</blockquote>	

<% Else %>
<blockquote>	

<br>
<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 bordercolor = "" align = "center" width = "600">
	<tr>
		<td class = "body" >
			<a name="Ancestry"></a>
			<h2><b>Send Registry Password</b></h2>
			Enter the email address associated with your account and we will email you your password.<br><br>
			<font color = "red">That address is not in our system. Please re-enter your e-mail address.</font>
      </td>
	</tr>
	
<form action= 'RegSendpasswordstep2.asp' method = "post">
	<tr > 
		<td  align = "center" class = "body">
			E-mail Address: <input name="Email" size = "32" value="">
		</td>
	</tr>
<tr>
		<td  valign = "middle" class = "body">

			<div align = "center">
			<input type=submit value = "Send Password" size = "110"  >
			</form>
		</td>

</tr>
</table><br><br><br>
</blockquote>	



<% End If %>
</tr>
</table>
<br><br><br><br>
<!--#Include virtual="Footer.asp"-->
</body>
</html>