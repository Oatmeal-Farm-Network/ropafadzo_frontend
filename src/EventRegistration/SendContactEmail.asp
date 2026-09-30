<html>

<head>
<%  PageName = "Contact Us" %>
<!--#Include virtual="GlobalVariables.asp"-->
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title><%= WebSiteName %></title>
<META name="description" content="<%= WebSiteName %>">
<META name="keywords" content="<%=State%> Alpaca Ranch, <%= WebSiteName %>, <%= Slogan %>, Alpaca web development, alpacas, alpaca">
<meta name="author" content="WebArtists.biz">
<link rel="stylesheet" type="text/css" href="BarnStyle.css">

</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >

<!--#Include file="Header.asp"--> 
<!--#Include file="Scripts.asp"--> 

<%
UID=Request.Form("Fieldname8")
CustID=Request.Form("CustID")
'response.write("UID=")
'response.write(UID)

Subject=request.form("Fieldname9") 
If Len(Subject) < 3 then
	Subject= Request.QueryString("Fieldname9") 
End If 

	sql = "select * from SFCustomers;"

	'response.write(sql)
	Set rs = Server.CreateObject("ADODB.Recordset")
	 rs.Open sql, conn, 3, 3 

	custEmail = rs("custEmail")

    rs.close
	Set conn = nothing
Dim Address
Dim Name
Dim City
Dim State
Dim Zip
Dim Email
Dim Comments

FirstName=Request.Form("FirstName")
LastName=Request.Form("LastName")
Street=Request.Form("Street")
City=Request.Form("Fieldname6")
State=Request.Form("Fieldname5")
Zip=Request.Form("Fieldname4")
Email=Request.Form("Email")
Comments=Request.Form("Fieldname1")
Announcements=Request.Form("Announcements")
Fieldname8=Request.Form("Fieldname8")


If Announcements = "Announcements" Then
   

	 Query =  "INSERT INTO sfEmailLists(EmailType, EmailFirstName, EmailLastName,  Email)" 
		Query =  Query & " Values ('Announcements', "
		Query =  Query & " '" &  FirstName & "'," 
		Query =  Query & " '" &  LastName & "'," 
		Query =  Query & " '"  &  Email & "' )"

    ' response.write(Query)

		Conn.Execute(Query) 

End if

str1 = Comments
		str2 = vblfvblf
		If InStr(str1,str2) > 0 Then
			Comments= Replace(str1, str2 , "</br>")
		End If  


		str1 = Comments
		str2 = vblf
		If InStr(str1,str2) > 0 Then
			Comments= Replace(str1, str2 , "</br>")
		End If  

		str1 = Comments
		str2 = vbtab
		If InStr(str1,str2) > 0 Then
			Comments= Replace(str1, str2 , "&nbsp;&nbsp;&nbsp;&nbsp;")
		End If  


If Len(Fieldname8) < 2 then
Response.Flush

'Email Contact Information to WebArtists.biz
Dim strTo, strSubject, strBody
Dim objCDONTSmail
Dim smtpServer
smtpServer = "mail.artisanbarn.org"
strTo = custEmail 
strFrom = "info@artisanbarn.org"
strSubject = "Email from the Dahmen Barn contact form"

strBody = "The following message comes to you from the Artisan Barn Website:"

'Body Data
strBody = strBody & "<br>Contact Name: "
strBody = strBody & FirstName & " " & LastName
strBody = strBody & "&nbsp;"
strBody = strBody & "<br> Location: "
strBody = strBody & Street & "<br>"
strBody = strBody & City
strBody = strBody & ", "
strBody = strBody & State
strBody = strBody & " "
strBody = strBody & Zip
strBody = strBody & " "
strBody = strBody & strCountry
strBody = strBody & "<br>Email Address: "
strBody = strBody & Email
strBody = strBody & "<br><br> Message: "
strBody = strBody & Comments
strBody = strBody & "<br>"

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

'response.write(strBody)

End if
%>


 <table   border="0" cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  align = "center"  valign ="top"   width = "625" >
	<tr>
	     <td class = "body" align ="center"><h1>Your E-mail has Been Sent to the Dahmen Barn</h1></td></tr>
	<tr><td   height = "1"   bgcolor = "#620000" ><img src = "images/px.gif". height = "1"></td></tr>
	<tr>
		<td class = "body" valign = "top" height = "300">
	Thank you for contacting us. We will be in contact with you shortly.<br><br>
		<A href= "default.asp" class = "body"> Please click here to return to our home page.</a></big></center>


</td>
	</tr>
</table>


<!--#Include file="Footer.asp"-->
</body>
</html>