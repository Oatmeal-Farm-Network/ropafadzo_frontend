<%@ Language="VBScript" %> 
<html>
<head>

<%  PageName = "Delete Animal" 
PageLink = "EventDeleteAnimal.asp" %>
<!--#Include virtual="GlobalVariablesNotLoggedIn.asp"-->

<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<meta http-equiv="Content-Language" content="en-us">

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">


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
<!--#Include file="EventHeader.asp"-->
<table  border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "<%=Textwidth%>" align = "center">	
<tr><td class = "body" colspan = "2" ><br><h1>Delete an Animal</h1>
</td>
</tr>
  <tr><td class = "body"  bgcolor = "#abacab" height = "1"><img src = "images/px.gif" height = "1" width = "1"></td></tr>
</table>


<table  border="0"  cellspacing="0" cellpadding="0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0" width = "<%=Textwidth%>" align = "center">	
	<tr>
<td class = "body" valign = "top"  align = "center">


<%

AnimalID=Request.Querystring("AnimalID" ) 
DamID=Request.Querystring("DamID" ) 
SireID=Request.Querystring("SireID" ) 
HalterClassID=Request.Querystring("HalterClassID" ) 
ProductionClassID=Request.Querystring("ProductionClassID" ) 

AnimalRegistrationID=Request.Querystring("AnimalRegistrationID" ) 

if len(AnimalID ) > 0 then
	Query =  "Delete * From Animal where AnimalID = " & AnimalID 
	Conn.Execute(Query) 

if len(HalterClassID) > 1 then
	Query =  "Delete * From AnimalHalterClasses where HalterClassID = " & HalterClassID 
	Conn.Execute(Query) 
end if
	
if len(ProductionClassID) > 1 then
	Query =  "Delete * From AnimalProductionClasses where ProductionClassID = " & ProductionClassID 
	Conn.Execute(Query) 
end if

if len(AnimalRegistrationID) > 1 then
	Query =  "Delete * From AnimalRegistration where AnimalRegistrationID = " & AnimalRegistrationID
	Conn.Execute(Query) 
end if
	
if len(DamID) > 1 then		
	Query =  "Delete * From Dam where DamID = " & DamID
	Conn.Execute(Query) 
end if

if len(SireID) > 1 then		
	Query =  "Delete * From Sire where SireID = " & SireID
	Conn.Execute(Query) 
End if
		Query =  "Delete * From RegisteredAnimals where AnimalID = " & AnimalID
	Conn.Execute(Query) 
	
end if
 %>
<br><br>
		<b>Your animal has successfully been deleted.</b>

<br>
			<br><a  class = "body" href="EventDeleteAnimal.asp">Click here to delete another animal.</a><br>
			<br><a  class = "body" href="EventRegister.asp">Click here to return to the registration.</a>
			<br>
		</td>
	</tr>
</table>


<!--#Include file="Footer.asp"--> </Body>
</HTML>
