<%@ Language="VBScript" %> 
<!DOCTYPE html>
<html>
<head>

<%  PageName = "Event Home" 
PageLink = "EventRegister.asp" %>
<!--#Include virtual="GlobalVariables.asp"-->

<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">

<title><%= EventName %> at Andresen Events - Event Registration</title>
<meta name="Title" content="<%= EventName %> at Andresen Events - Event Registration">
<meta name="description" content="<%= EventDescription %> " >
<META name="keywords" content="Alpaca events, livestock events, events,Alpaca event registration, Livestock event registration, online registration, event registration, online event registration, event registration software, event registration online, online event registration software, event registration management software, event registration system, event management, registration software, event registration service, event registration services, easy online event registration, online event registration service, event registration website, event registration site, online event registration services,  PayPal, credit cards, online payments"> 
<meta name="robots" content="index,follow">
<meta name="rating" content="Safe for kids">
<meta name="revisit-after" content="1">
<meta name="Googlebot" content="index,follow">
<meta name="robots" content="All">
<meta name="subjects" content="Event Registration, Alpaca Events" >
<link rel="shortcut icon" href="/AELogo.ico" > 
<link rel="icon" href="http://www.AndresenEvents.com/AELogo.ico" > 
<meta name="author" content="The Andresen group">
<link rel="stylesheet" type="text/css" href="Style.css">

<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js"></script>
<script type="text/javascript" src="jquery.numeric.js"></script>

</head>

<BODY border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"   align = "center">

<!--#Include file="Header.asp"--> 
<!--#Include file="Scripts.asp"--> 

<!--#Include file="AddRegistrationHeader.asp"--> 

<a name="Top"></a>
<% PageTitleText = "Add a Registration -Completed"  %>
<!--#Include file="970Top.asp"-->
<br>
<table border = "0" width = "960">
<tr>
<td class = "body" valign = "top">
 	
	<blockquote>
	  <b>The order was successfully added.</b><br />
	   Select the links below to:<ul>
	     <li><a href = "AddRegistration.asp" class = "body">Add Another Registration</a></li>
	    <li><a href = "ReportRegistrationsList.asp" class = "body">View Registrations</a></li>
	    </ul>
	    </blockquote>
</td>
</table>


<br>
<!--#Include file="970Bottom.asp"-->

  
  
<!--#Include file="Footer.asp"--> 
</body>
</html>