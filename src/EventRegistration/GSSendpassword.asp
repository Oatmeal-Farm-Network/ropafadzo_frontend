<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">

<HTML>
<HEAD>
<!--#Include virtual="GlobalVariables.asp"-->
 <title>Send Password</title>
       <link rel="stylesheet" type="text/css" href="/administration/style.css">
<link rel="stylesheet" type="text/css" href="style.css">
</head>
<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  bgcolor = "white">



<!--#Include virtual="Header.asp"--><br><br>
<table  align = "center" height = "300">
	<tr >
		<td align = "left" class = "body" valign = "top">
<%
Dim email
Dim Password
Dim Name

email=Request.Form("email")
conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
"Data Source=" & server.mappath(DatabasePath) & ";" & _
						"User Id=;Password=;" '& _ 
 sql = "select * from sfCustomers where custEmail = '" & email & "'"
  Set rs = Server.CreateObject("ADODB.Recordset")
 'response.write(sql)
	
	rs.Open sql, conn, 3, 3 
  If Not rs.eof then
		Password  = rs("custPasswd")
		name  = rs("custFirstname")

    rs.close
	Set Conn = Nothing 

Response.Flush

'Email Contact Information to The Andresen Group
Dim strTo, strSubject, strBody
Dim objCDONTSmail
Dim smtpServer




	'response.write("From The Heart Ranch")
	smtpServer = "mail.GreenShrew.com"
	strFrom = "info@GreenShrew.com"
	strTo = email


strSubject = "Your Green Shrew Password"


' Body Data
strBody = strBody & "Dear  "
strBody = strBody & name & ",<br><br>"
strBody = strBody & "You indicated that you have forgotten your Green Shrew password. It is proved below:<br><br>"

strBody = strBody & "Your password: "
strBody = strBody & "<b>" & Password & "</b>"

strBody = strBody & "<br><br>If you didn’t request this email, please contact us at info@GreenShrew.com.<br><br>Thank You.<br><br>Sincerely,<br><br>Green Shrew<br><br><br>----------------------------------------------------------------<br>Protect Your Password<br><br>NEVER give your password to anyone, including Green Shrew employees. Protect yourself against fraudulent websites by opening a new web browser (e.g. Internet Explorer or Netscape) and typing in GreenShrew.com every time you log in to your account.<br><br>----------------------------------------------------------------<br><br>"


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

%>

	<blockquote>	
<h1>Your password has been sent to you. </h1>
You should receive an email at <%= email%>. Please go to the 	<A href= "login.asp" class = "body"> log in page</a> and enter your e-mail and password.<br><br>

If you don't receive an email, check your bulk mail folder or try to recover your password using a different email address. (You may have registered for your  account using a different email address.)
</blockquote>	
</tr>
</table>
<!--#Include virtual="Footer.asp"-->
</body>
</html>