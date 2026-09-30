<html>

<head>
<%  PageName = "Class Registration" %>
<!--#Include file="GlobalVariables.asp"-->
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title><%= WebSiteName %></title>
<META name="description" content="<%= WebSiteName %>">
<META name="keywords" content="<%=State%> Alpaca Ranch, <%= WebSiteName %>, <%= Slogan %>, Alpaca web development, alpacas, alpaca">
<meta name="author" content="The Andresen Group">
<link rel="stylesheet" type="text/css" href="BarnStyle.css">

</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >

<!--#Include file="Header.asp"--> 
<!--#Include file="Scripts.asp"--> 

<%



ClassName=Request.Form("ClassName")
ClassDate=Request.Form("ClassDate")
Cost=Request.Form("Cost")
Name1=Request.Form("Name1")
Age1=Request.Form("Age1")
Name2=Request.Form("Name2")
Age2=Request.Form("Age2")
Name3=Request.Form("Name3")
Age3=Request.Form("Age3")
Name4=Request.Form("Name4")
Age4=Request.Form("Age4")
Name5=Request.Form("Name5")
Age5=Request.Form("Age5")
Name6=Request.Form("Name6")
Age6=Request.Form("Age6")
Name7=Request.Form("Name7")
Age7=Request.Form("Age7")
Name8=Request.Form("Name8")
Age8=Request.Form("Age8")
Name9=Request.Form("Name9")
Age9=Request.Form("Age9")
Name10=Request.Form("Name10")
Age10=Request.Form("Age10")
Name11=Request.Form("Name11")
Age11=Request.Form("Age11")
Name12=Request.Form("Name12")
Age12=Request.Form("Age12")
HereAboutEvent=Request.Form("HereAboutEvent")
Phone=Request.Form("Phone")
Email=Request.Form("Email")
Street=Request.Form("Street")
City=Request.Form("City")
State=Request.Form("State")
Zip=Request.Form("Zip")


Response.Flush

'Email Contact Information to The Andresen Group
Dim strTo, strSubject, strBody
Dim objCDONTSmail
Dim smtpServer

smtpServer = "mail.artisansatthedahmenbarn.com"
strTo = "dlmiller@inlandnet.com, jhartwig@clearwire.net"
'strTo = "johna@The Andresen Group"
strFrom = "info@artisansatthedahmenbarn.com"
strSubject = "Class Signup"

strBody = "The following is a registration for a class:"

'Body Data


strBody = strBody & "<br>Class Name: "
strBody = strBody & ClassName
strBody = strBody & "<br>Class Date: "
strBody = strBody & ClassDate
strBody = strBody & "<br>Cost: "
strBody = strBody & Cost
strBody = strBody & "<br>Attendee Name(s): <br>"
strBody = strBody & Name1
if Len(age1)> 0 Then 
	strBody = strBody & "(" & Age1 & "years old )"
End If
strBody = strBody & "<br>"


if Len(Name2)> 0 Then 
	strBody = strBody & Name2
	if Len(age2)> 0 Then 
		strBody = strBody & "(" & Age2 & "years old )"
	End If
	strBody = strBody & "<br>"
End If 


if Len(Name3)> 0 Then 
	strBody = strBody & Name3
	if Len(age3)> 0 Then 
		strBody = strBody & "(" & Age3 & "years old )"
	End If
	strBody = strBody & "<br>"
End If 


if Len(Name4)> 0 Then 
	strBody = strBody & Name4
	if Len(age4)> 0 Then 
		strBody = strBody & "(" & Age4 & "years old )"
	End If
	strBody = strBody & "<br>"
End If 


if Len(Name5)> 0 Then 
	strBody = strBody & Name5
	if Len(age5)> 0 Then 
		strBody = strBody & "(" & Age5 & "years old )"
	End If
	strBody = strBody & "<br>"
End If 

if Len(Name6)> 0 Then 
	strBody = strBody & Name6
	if Len(age6)> 0 Then 
		strBody = strBody & "(" & Age6 & "years old )"
	End If
	strBody = strBody & "<br>"
End If 

if Len(Name7)> 0 Then 
	strBody = strBody & Name7
	if Len(age7)> 0 Then 
		strBody = strBody & "(" & Age7 & "years old )"
	End If
	strBody = strBody & "<br>"
End If 

if Len(Name8)> 0 Then 
	strBody = strBody & Name8
	if Len(age8)> 0 Then 
		strBody = strBody & "(" & Age8 & "years old )"
	End If
	strBody = strBody & "<br>"
End If 

if Len(Name9)> 0 Then 
	strBody = strBody & Name9
	if Len(age9)> 0 Then 
		strBody = strBody & "(" & Age9 & "years old )"
	End If
	strBody = strBody & "<br>"
End If 


if Len(Name10)> 0 Then 
	strBody = strBody & Name10
	if Len(age10)> 0 Then 
		strBody = strBody & "(" & Age10 & "years old )"
	End If
	strBody = strBody & "<br>"
End If 



if Len(Name11)> 0 Then 
	strBody = strBody & Name11
	if Len(age11)> 0 Then 
		strBody = strBody & "(" & Age11 & "years old )"
	End If
	strBody = strBody & "<br>"
End If 



if Len(Name12)> 0 Then 
	strBody = strBody & Name12
	if Len(age12)> 0 Then 
		strBody = strBody & "(" & Age12 & "years old )"
	End If
	strBody = strBody & "<br>"
End If 

strBody = strBody & "<br>Phone: "
strBody = strBody & Phone
strBody = strBody & "<br>Email: "
strBody = strBody & Email
strBody = strBody & "<br>Street: "
strBody = strBody & Street
strBody = strBody & "&nbsp;"
strBody = strBody & "<br> City: "
strBody = strBody & City
strBody = strBody & ", "
strBody = strBody & State
strBody = strBody & " "
strBody = strBody & Zip
strBody = strBody & "<br>"
strBody = strBody & "<br>How did they hear about this event?: "
strBody = strBody & HereAboutEvent
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


%>	<form target="_paypal" action="https://www.paypal.com/cgi-bin/webscr" method="post">
<table border = "0" width = "725"   leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  align = "center" >
					<tr>
						<td colspan = "2"   height = "20"  >
							<h1>Register</h1>
						</td>
					</tr>
					<tr>
						<td colspan = "2"   height = "2"  background = "images/Underline.jpg"><img src = "images/px.gif". height = "2"></td>
					</tr>
					<tr>
						<td colspan = "2"   height = "5"  ><img src = "images/px.gif". height = "2"></td>
					</tr>
				
	<tr>
		<td class = "body"><h3>Step 2: Payment</h3>
		<center> We have added your name to the class roster, but we must receive payment to confirm your registration. Please press the button below to pay online for the class.
		 
		 
		
	<input type="hidden" name="add" value="1">
<input type="hidden" name="cmd" value="_cart">
<input type="hidden" name="business" value="jhartwig@clearwire.net">
<input type="hidden" name="item_name" value="<%=Trim(ClassName)%>">
<input type="hidden" name="amount" value="<%=Cost%> ">
<input type="hidden" name="no_shipping" value="0">
<input type="hidden" name="no_note" value="1">
<input type="hidden" name="currency_code" value="USD">
<input type="hidden" name="lc" value="US">
<input type="hidden" name="bn" value="PP-ShopCartBF">
<input type="hidden" name="return" value="http://www.ArtisanBarn.org/completion.asp">
<input type="hidden" name="cancel_return" value="http://www.ArtisanBarn.org/BarnStore.asp">
<br>

<input type=submit   border="0" name="submit"  Value = "Pay On-Line" >&nbsp;&nbsp;

</form> 
</center>
</td>
	</tr>
</table>


<!--#Include file="Footer.asp"-->
</body>
</html>