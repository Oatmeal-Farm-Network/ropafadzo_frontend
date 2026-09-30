<html>
 
<head>
<!--#Include file="/AlpacaBargainHunter/GlobalVariables.asp"-->
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">
<title><%= WebSiteName %> Contact Us Confirmation Page</title>
<META name="description" content="<%= WebSiteName %>">
<META name="keywords" content="<%=State%> Alpaca Ranch, <%= WebSiteName %>, <%= Slogan %>, Alpaca web development, alpacas, alpaca">
<meta name="author" content="The Andresen Group">
<link rel="stylesheet" type="text/css" href="<%=Style%>">

</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   >

<!--#Include file="/AlpacaBargainHunter/Header.asp"--> 
	
<%
Dim strFName
Dim strLName
Dim strMName
Dim strBizName
Dim strAddress1
Dim strCity
Dim strState
Dim strZipcode
Dim strCountry
Dim strEmail
Dim strCommentText

strFName=Request.Form("FName")
strLName=Request.Form("LName")
strMName=Request.Form("MName")
strBizName=Request.Form("BizName")
strAddress1=Request.Form("Address1")
strCity=Request.Form("City")
strState=Request.Form("State")
strZipcode=Request.Form("Zipcode")
strCountry=Request.Form("Country")
strEmail=Request.Form("Email")
strCommentText=Request.Form("CommentText")
%>



<%
Response.Flush

'Email Contact Information to The Andresen Group
Dim strTo, strSubject, strBody
Dim objCDONTSmail
Dim smtpServer

smtpServer = "mail.The Andresen Group"
strTo = "johna@The Andresen Group"
strSubject = "WebArtists Contact Us Form"

strBody = "This message was sent from the Contact Us Form at The Andresen Group."

' Body Data
strBody = strBody & "<br>Contact Name: "
strBody = strBody & strFName
strBody = strBody & "&nbsp;"
strBody = strBody & strMName
strBody = strBody & "&nbsp;"
strBody = strBody & strLName
strBody = strBody & "<br> Business Name: "
strBody = strBody & strBizName
strBody = strBody & "<br>Address:        "
strBody = strBody & strAddress1
strBody = strBody & "<br>                 "
strBody = strBody & strCity
strBody = strBody & ", "
strBody = strBody & strState
strBody = strBody & " "
strBody = strBody & strZipcode
strBody = strBody & " "
strBody = strBody & strCountry
strBody = strBody & "<br>Email Address: "
strBody = strBody & strEmail
strBody = strBody & "<br><br> Message: "
strBody = strBody & strCommentText
strBody = strBody & "<br>"

'CDONTS EMail
set objCDONTSmail = Server.CreateObject("CDONTS.NewMail")
objCDONTSmail.BodyFormat = 0
objCDONTSmail.MailFormat = 0
objCDONTSmail.From = strTo
objCDONTSmail.To = strTo
objCDONTSmail.Subject = strSubject
objCDONTSmail.Body = strBody
objCDONTSmail.Send

set objCDONTSmail = Nothing

%>

		<center><big><br>Thank You<br><br>
		Your request has been sent to The Andresen Group.<br><br>
		<A href= "default.asp" class = "body"> Please click here to return to our home page.</a></big></center>

<!--#Include file="/alpacabargainhunter/Footer.asp"-->
</body>
</html>