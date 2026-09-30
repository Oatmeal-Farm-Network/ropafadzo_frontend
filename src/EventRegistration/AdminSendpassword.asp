<html>

<head>

<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title><%= WebSiteName %> Login</title>
<META name="description" content="contact <%= WebSiteName %>">
<META name="keywords" content="<%=State%> Alpaca Ranch, <%= WebSiteName %>, <%= Slogan %>, <%= Breed %>Alpacas for sale, alpacas, alpaca,  female alpacas, male alpacas">
<meta name="author" content="The Andresen Group">
<link rel="stylesheet" type="text/css" href="/test/barnstyle.css">

</head>


<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >
<% loginpage = True %>
<!--#Include virtual="GlobalVariables.asp"-->
<!--#Include virtual="Header.asp"-->
<table  align = "center" height = "300">
	<tr >
		<td align = "left" class = "body" valign = "top">
<%
Dim email
Dim Password
Dim Name

email=Request.Form("email")
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
	smtpServer = "mail.artisanbarn.com"
	strFrom = "info@artisanbarn.org"
	strTo = email


	strSubject = "Your ArtisanBarn.Com Password"


	' Body Data
	strBody = strBody & "Dear  "
	strBody = strBody & name & ",<br><br>"
	strBody = strBody & "You indicated that you have forgotten your artisanbarn.org password. It is proved below:<br><br>"

	strBody = strBody & "Your password: "
	strBody = strBody & "<b>" & Password & "</b>"

	strBody = strBody & "<br><br>If you didn’t request this email, please contact us at 509-229-3414.<br><br>Thank You.<br><br>Sincerely,<br><br>Artisans at the Dahmen Barn<br><br><br>----------------------------------------------------------------<br>Protect Your Password<br><br>NEVER give your password to anyone, including artisanbarn.org representatives. Protect yourself against fraudulent websites by opening a new web browser (e.g. Internet Explorer or Netscape) and typing in the artisanbarn.org URL every time you log in to your account.<br><br>----------------------------------------------------------------<br><br>"


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

If you don't receive an email, check your bulk mail folder or try to recover your password using a different email address. (You may have registered for your  account using a different address.)
</blockquote>	
</tr>
</table>

<!--#Include virtual="Footer.asp"-->
</body>
</html>