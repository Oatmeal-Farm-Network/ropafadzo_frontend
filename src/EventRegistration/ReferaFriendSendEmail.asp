<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>Livestock of America Referral Program</title>
<meta name="Title" content="Livestock of America Referral Program"/>
<meta name="robots" content="nofollow"/>
<meta name="author" content="The Andresen Group"/>
<link rel="stylesheet" type="text/css" href="/style.css" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="Content-Language" content="en-us"/>
</HEAD>
<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center">
<!--#Include file="AdminGlobalVariables.asp"-->
<% Current2="AdminHome" %> 
<%
PeopleFirstName=Request.Form("FirstName")
PeopleLastName=Request.Form("LastName")
Email=Request.Form("Fieldname2")

Response.Flush

'Email Contact Information to The ANDRESEN<b>GROUP</b>
Dim strTo, strSubject, strBody
Dim objCDONTSmail
Dim smtpServer

ReferringPeopleID =Session("PeopleID") 
	sql = "select distinct PeopleEmail, PeopleFirstName, PeoplelastName , Business.Businessname  from People, Business where People.BusinessID = Business.BusinessID and PeopleID = " & ReferringPeopleID
   ' response.write("sql=" & sql)
    Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3   
if  Not rs.eof then   
ReferringPeopleEmail = rs("PeopleEmail")
ReferringPeopleFirstName = rs("PeopleFirstName")
ReferringPeopleLastName = rs("PeoplelastName")
ReferringRanchname = rs("Businessname")
end if
rs.close

smtpServer = "mail.webartists.biz"
strTo = "john@TheAndresenGroup.com"
strFrom = "John@theAndresenGroup.com"
strSubject = PeopleFirstName & " " & PeopleLastName & " Recommends That You Join Livestock Of America."

'Body Data
strBody="<html><head><div dir='ltr' lang='en-us' class='OutlookMessageHeader' align='left'><meta name='GENERATOR' content='MSHTML 8.00.6001.18259' />" & vbCrLf 

strBody= strBody & "<style type='text/css'>body {	Background-color : white }BODY {FONT-FAMILY: Verdana, Arial, Helvetica, sans-serif; FONT-SIZE: 11px}A {FONT-STYLE: normal; FONT-FAMILY: verdana, sans-serif; COLOR: brown; FONT-SIZE: 11px; TEXT-DECORATION: none}A:visited {COLOR: #666666}A:hover {TEXT-DECORATION: underline}P {FONT-STYLE: normal; FONT-FAMILY: verdana, sans-serif; COLOR: #666666; FONT-SIZE: 11px; FONT-WEIGHT: normal; TEXT-DECORATION: none}H1 {FONT-STYLE: normal; FONT-FAMILY: verdana, sans-serif; COLOR: #666666; FONT-SIZE: 14px; FONT-WEIGHT: bold; TEXT-DECORATION: none}DIV.emailfooter {FONT-FAMILY: Verdana, Arial, Helvetica, sans-serif; FONT-SIZE: 11px }DIV.emailfooter A {	FONT-STYLE: normal; FONT-FAMILY: verdana, sans-serif; COLOR: #ff6600; FONT-SIZE: 11px; TEXT-DECORATION: none}</style>" & vbCrLf 

strBody= strBody & "</head><body border='0' cellspacing='0' cellpadding='0' leftmargin='0' topmargin='0' marginwidth='0' marginheight='0'><table width='650' border='0' cellspacing='0' cellpadding='0' leftmargin='0' topmargin='0' marginwidth='0' marginheight='0' align = 'center'  valign ='top' bgcolor = 'white'><tbody><tr><td align = 'center'>"  & vbCrLf 

strBody =  strBody &  "<table width = 650 border='0' cellspacing='0' cellpadding='0' leftmargin='0' topmargin='0' marginwidth='0' marginheight='0' align = 'left'  valign ='top' bgcolor = 'white' >" & vbCrLf

strBody =  strBody &  "<tr><td width = '600' colspan = '2' align = 'center'><a href = 'http://www.LivestockOfAmerica.com' ><img src = 'http://www.theandresengroup.com/massemails/NewAI2.jpg'  width = '212' height = '157' border = 0 alt = 'Livestock Of America'  align = 'center'></a></td></tr>" & vbCrLf


strBody = strBody & "<tr><td class=BODY>Dear " & PeopleFirstName & " " & PeopleLastName & ",<br><br>" & vbCrLf
strBody = strBody & ReferringPeopleFirstName & " " & ReferringPeopleLastName & " recommends that you join Livestock Of America. (www.LivestofAmerica.com). <br><br> "& vbCrLf
strBody = strBody & " Livestock of America is an online marketplace that offers opportunities for ranchers to sell animals (Alpacas, Llamas, Cattle, Working Dogs, Donkeys, Goats, Horses, Pigs, and Sheep), properties, businesses, and products. Livestock of America is the fastest growing livestock marketplace on the web and <b>prices start as low as $19.95 per year!</b><br><br>" & vbCrLf

strBody = strBody & "If you accept this referral and subscribe to Livestock of America please select " & ReferringRanchname & " as the ranch that referred you and you will receive 2 extra months membership for free and " & ReferringRanchname & " will receive a commission and 2 extra month’s membership for free. To learn more please go to <a href = 'http://www.livestockofamerica.com/referralprogram.asp?RPI=" & ReferringPeopleID & "'>http://www.livestockofamerica.com/referralprogram.asp</a> .<br><br>" & vbCrLf

strBody = strBody & "Sincerely,<br><br><i>The Livestock of America Team,</i><br><a href = 'http://www.livestockofamerica.com/referralprogram.asp?RPI=" & ReferringPeopleID & "'>www.LivestockOfAmerica.com</a>" & vbCrLf

strBody = strBody & "</td></tr></table></td></tr></tbody></table>" & vbCrLf  

strBody= strBody & "</BODY></HTML>"  & vbCrLf 

'response.write("strBody=" & strBody )
Set ObjSendMail = CreateObject("CDO.Message") 
     
'This section provides the configuration information for the remote SMTP server.
     
ObjSendMail.Configuration.Fields.Item ("http://schemas.microsoft.com/cdo/configuration/sendusing") = 2 'Send the message using the network (SMTP over the network).
ObjSendMail.Configuration.Fields.Item ("http://schemas.microsoft.com/cdo/configuration/smtpserver") ="mail.theandresengroup.com" 'your mail server
ObjSendMail.Configuration.Fields.Item ("http://schemas.microsoft.com/cdo/configuration/smtpserverport") = 25 
ObjSendMail.Configuration.Fields.Item ("http://schemas.microsoft.com/cdo/configuration/smtpusessl") = False 'Use SSL for the connection (True or False)
ObjSendMail.Configuration.Fields.Item ("http://schemas.microsoft.com/cdo/configuration/smtpconnectiontimeout") = 60
     
' If your server requires outgoing authentication uncomment the lines below and use a valid email address and password.
ObjSendMail.Configuration.Fields.Item ("http://schemas.microsoft.com/cdo/configuration/smtpauthenticate") = 1 'basic (clear-text) authentication
ObjSendMail.Configuration.Fields.Item ("http://schemas.microsoft.com/cdo/configuration/sendusername") ="pacamail@theandresengroup.com"
ObjSendMail.Configuration.Fields.Item ("http://schemas.microsoft.com/cdo/configuration/sendpassword") ="Jackson5"
     
ObjSendMail.Configuration.Fields.Update
     
   
'End remote SMTP server configuration section==
     
ObjSendMail.To = strTo
'ObjSendMail.To = "john@theandresengroup.com"
ObjSendMail.Subject = strSubject
ObjSendMail.From =  " Livestock Of America <pacamail@theandresengroup.com>"
     
' we are sending a text email.. simply switch the comments around to send an html email instead
ObjSendMail.HTMLBody = strBody
'ObjSendMail.TextBody = strBody
 ' response.Write(strBody)  
ObjSendMail.Send
     
Set ObjSendMail = Nothing 
%>
<body   marginheight="0" marginwidth="0" topmargin="0" leftmargin="0" >
 <% Current = "Home" %>
<% CurrentWebsite = "LivestockofAmerica" 
Current3 = "ContactUs"%>
<% Current2="AdminHome" %> 
<!--#Include file="adminHeader.asp"-->
	<table border = "0" cellspacing="0" cellpadding = "0" align = "center" class = "roundedtopandbottom" width = "100%"><tr><td  align = "left" valign = 'top'>
<table border = "0" cellspacing="0" cellpadding = "0" align = "center"  width = "80%"><tr><td  align = "left" valign = 'top'>
<br />
<H1>Thank You for Refering a Friend</H1>
</td></tr>
<tr><td  align = "left" class = "body2">
Thank you for spreading the word about the fastest growing livestock marketplace on the web!<br />
<br />
When your friend accepts your referral, you will receive an email informing you of their acceptance. At that time you will also receive two months added to your membership and at the end of the month we will send you all of the commissions that you have earned this month.<br><br>
</td></tr>
<tr><td height = "300"></td></tr>
</table>
</td></tr>
</table>
<!--#Include file="Footer.asp"-->
</body>
</html>