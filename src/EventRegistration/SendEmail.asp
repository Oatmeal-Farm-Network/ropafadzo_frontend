<!DOCTYPE html>
<html>

<head>
<%  PageName = "Contact Us" %>
<!--#Include file = "GlobalVariables.asp"-->
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title><%= WebSiteName %></title>
<META name="description" content="<%= WebSiteName %>">
<META name="keywords" content="<%=State%> Alpaca Ranch, <%= WebSiteName %>, <%= Slogan %>, Alpaca web development, alpacas, alpaca">
<meta name="author" content="The Andresen Group">
<link rel="stylesheet" type="text/css" href="<%=style%>">

</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >
<!--#Include file="ContactVariablesInclude.asp"-->
<% custemail = Email %>

<!--#Include file="Scripts.asp"--> 

<%
UID=Request.Form("Fieldname8")
'response.write("Fieldname8 UID = " & UID & "<br/>")
fieldX = request.form("fieldX")
'response.write("fieldX = " & fieldX & "<br/>")
Subject=request.form("Fieldname9") 
If Len(Subject) < 3 then
	Subject= Request.QueryString("Fieldname9") 
End If 

sql = "select * from AndresenEvents;"
Set rs = Server.CreateObject("ADODB.Recordset")
rs.Open sql, conn, 3, 3 
custEmail = rs("custEmail")
mailserver = rs("MailServer")
rs.close
Set conn = nothing

Dim Name
Dim Address
Dim Apt
Dim City
Dim State
Dim Zip
Dim Country
Dim Email
Dim Comments
Dim Referral
FirstName=Request.Form("FirstName")
LastName=Request.Form("LastName")
Address=Request.Form("Address")
Apt=Request.Form("Apt")
City=Request.Form("City")
State=Request.Form("State")
Country=Request.form("Country")
Zip=Request.Form("Zip")
Email=Request.Form("Email")
Comments=Request.Form("Questions")
Referral=Request.Form("Referral")

'**********
' Set session variables in case of failure to send
'**********
session("CUFirstName") = FirstName
session("CULastName")  = LastName
session("CUAddress")   = Address
session("CUApt")	   = Apt
session("CUCity")      = City
session("CUState")     = State
session("CUZip")       = Zip
session("CUCountry")   = Country
session("CUEmail")     = Email
session("CUComments")  = Comments
session("CUReferral")  = Referral



if not fieldX = "4" then
	Response.redirect("Contactus.asp?message=Math Question response was incorrect.")
end if 


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



'If Len(LastName) > 2 then
Response.Flush

'Email Contact Information to The Andresen Group
Dim strTo, strSubject, strBody
Dim objCDONTSmail
Dim smtpServer

smtpServer = mailserver
'strTo = custEmail
strTo = "John@TheAndresenGroup.com"
strFrom = "John@TheAndresenGroup.com"

'response.write("StrTo = " & strTo & ", StrFrom = " & strFrom & "<br/>")
strSubject = "Email from your contact form"

strBody = "The following message comes to you from Andresen Events Contact Us page:"
'response.write(" A strBody = " & strBody & "<br/>")

'Body Data
strBody = strBody & "<br>Contact Name: "
strBody = strBody & FirstName & " " & Lastname
strBody = strBody & "&nbsp;"
strBody = strBody & "<br> Location: "
strBody = strBody & Address
strBody = strBody & " "
strBody = strBody & Apt
strBody = strBody & " "
strBody = strBody & City 
strBody = strBody & ", "
strBody = strBody & State
strBody = strBody & " "
strBody = strBody & Zip
strBody = strBody & " "
strBody = strBody & Country
strBody = strBody & "<br>Email Address: "
strBody = strBody & Email
strBody = strBody & "<br><br> Questions: "
strBody = strBody & Comments
strBody = strBody & "<br><br> Referrals: "
strBody = strBody & Referral

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

'response.write("AAAA strBody = " & strBody & "<br/>")


'End if
%>


<body   marginheight="0" marginwidth="0" topmargin="0" leftmargin="0" ><!--#Include file="Header.asp"--><br>
<table border = "0" width = "900"  background= "images/ContactUsbackground.jpg" cellpadding=0 cellspacing=0  align = "center" >
					<tr>
						<td  >

<table border = "0" align = "center" cellpadding=2 cellspacing=5 width = "600" >
	<tr>
		<td class = "body"  valign = "top"><h1><%=PageTitle %></h1></td>
	</tr>
	<tr>
		<td class = "body"><br><br><br><br><br />
			<h2>Thank you for contacting us. </h2>
			You will hear back from us soon.<br><br>
			<A href= "default.asp" class = "body"> Please click here to return to our home page.</a>
		</td>
	</tr>
	<tr>
	   	<td height = "150">&nbsp;</td>
	  </tr>
</table>

   </td>
	  </tr>
</table>
<%
session("CUFirstName") = ""
session("CULastName")  = ""
session("CUAddress")   = ""
session("CUApt")	   = ""
session("CUCity")      = ""
session("CUState")     = ""
session("CUZip")       = ""
session("CUCountry")   = ""
session("CUEmail")     = ""
session("CUComments")  = ""
session("CUReferral")  = ""
%>

<!--#Include file="Footer.asp"-->
</body>
</html>