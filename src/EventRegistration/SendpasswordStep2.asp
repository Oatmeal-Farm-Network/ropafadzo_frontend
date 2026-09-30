<html>

<head>

<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title><%= WebSiteName %> Login</title>
<META name="description" content="contact <%= WebSiteName %>">
<META name="keywords" content="<%=State%> Alpaca Ranch, <%= WebSiteName %>, <%= Slogan %>, <%= Breed %>Alpacas for sale, alpacas, alpaca,  female alpacas, male alpacas">
<meta name="author" content="WebArtists.biz">
<link rel="stylesheet" type="text/css" href="style.css">

</head>


<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >
<% loginpage = True %>
<!--#Include virtual="globalvariablesNotLoggedIn.asp"-->
<!--#Include virtual="Header.asp"-->
<br>
<table border = "5" bordercolor = "#DBF5F3" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 bordercolor = "" align = "center" width = "600" height = "300" bgcolor = "#DBF5F3" valign = "top">
	<tr >
		<td align = "left" class = "body" valign = "top">
<%
Dim email
Dim Password
Dim Name
Foundpassword = False
email=Request.Form("email")
 sql = "select * from People where PeopleEmail = '" & Email & "'"
  Set rs = Server.CreateObject("ADODB.Recordset")
  'response.write(sql)
	
	rs.Open sql, conn, 3, 3 
  If Not rs.eof then
		Password  = rs("PeoplePassword")
		name  = rs("PeopleFirstName")
Foundpassword = true
    rs.close
	Set Conn = Nothing 

Response.Flush

'Email Contact Information to WebArtists.biz
Dim strTo, strSubject, strBody
Dim objCDONTSmail
Dim smtpServer





	smtpServer = "mail.AndresenEvents.com"
	strFrom = "ContactUs@AndresenEvents.com"
	strTo = email


	strSubject = "Your Andresenevents.Com Password"


	' Body Data
	strBody = strBody & "<font face='arial'>Dear  "
	strBody = strBody & name & ",<br><br>"
	strBody = strBody & "You indicated that you have forgotten your AndresenEvents.com password. It is provided below:<br><br>"

	strBody = strBody & "Your password: "
	strBody = strBody & "<b>" & Password & "</b>"

	strBody = strBody & "<br><br>If you did not request this email, please contact us at 509-831-0103.<br><br>Thank You.<br><br>Sincerely,<br><br>Andresen Events<br><br><br>-------------------------------------------------------------------------------------------------------------------------------<br>Protect Your Password<br><br>NEVER give your password to anyone, including Andresenevents.com representatives. Protect <br>yourself against fraudulent websites by opening a new web browser (e.g. Internet Explorer or Netscape)<br> and typing in the Andresenevents.com URL every time you log in to your account.<br><br>-------------------------------------------------------------------------------------------------------------------------------<br><br></font>"


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

%>

	<blockquote>	
<h1>Your password has been sent to you. </h1>
<br>
You should receive an email at <b><%= email%></b>. Please go to our <A href= "regcreateSignIn.asp" class = "body"> log in page</a> and enter your e-mail and password.<br><br>

If you don not receive an email, check your bulk mail folder or try to recover your password using a different email address. (You may have registered for your  account using a different address.)
</blockquote>	

<% else %>

<blockquote>	
<h1>Email Not Found</h1>
The Email address you entered, <b><%= email%></b>, is not currently in our system. If you think that you may have entered your email address incorrectly please use the form below to return to our login page, or <a href = "SetupAccount.asp" class = "body"> click here to set up a new account.</a><br><br>


	
<form action= 'SendpasswordStep2.asp' method = "post">
<table align = "center">
	<tr > 
		<td  align = "center" class = "body2">
			E-mail Address: <input name="Email" size = "52" value="">
		</td>
	</tr>
<tr>
		<td  valign = "top" align = "center" class = "body2">
	
			<div align = "center">
			<input type=submit value = "Send Password" size = "110"  ></div>
			
		</td>
</tr>
<tr>
<td><br><br><br>
</td>
</tr>
</table>
</form>

</blockquote>	


<% End if%>	
</td>
</tr>
</table>
<!--#Include virtual="Footer.asp"-->
</body>
</html>